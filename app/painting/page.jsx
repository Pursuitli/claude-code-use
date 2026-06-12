'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import './painting.css';
import { InkEngine, colorToAbsorbance } from './ink-engine';
import {
  listPaintings, getPainting, putPainting, deletePainting,
  packedToBlob, blobToPacked,
} from './store';

/* 筆 — each preset maps to physical splat parameters in the engine.
   wet = water laid down, flow = pigment load, dry = flying-white threshold,
   depletion = stroke distance (px) over which the brush runs out of ink. */
const BRUSHES = [
  { id: 'zhongfeng', name: '中鋒', hint: '勾線', size: 9,  wet: 0.55, flow: 1.0,  dry: 0.05, depletion: 2600 },
  { id: 'cefeng',    name: '側鋒', hint: '皴擦', size: 26, wet: 0.80, flow: 0.65, dry: 0.14, depletion: 2200 },
  { id: 'kubi',      name: '枯筆', hint: '飛白', size: 15, wet: 0.13, flow: 0.95, dry: 0.60, depletion: 900 },
  { id: 'ran',       name: '染',   hint: '渲染', size: 48, wet: 1.25, flow: 0.26, dry: 0.0,  depletion: 6500 },
  { id: 'qingshui',  name: '清水', hint: '破墨', size: 34, wet: 1.15, flow: 0.0,  dry: 0.0,  depletion: 9000 },
];

/* 色 — ink plus traditional mineral / plant pigments */
const PIGMENTS = [
  { name: '墨',   rgb: [0.07, 0.07, 0.08] },
  { name: '花青', rgb: [0.18, 0.32, 0.46] },
  { name: '赭石', rgb: [0.60, 0.38, 0.23] },
  { name: '胭脂', rgb: [0.58, 0.14, 0.23] },
  { name: '藤黃', rgb: [0.84, 0.64, 0.12] },
  { name: '朱砂', rgb: [0.78, 0.22, 0.14] },
  { name: '石綠', rgb: [0.33, 0.54, 0.40] },
];

const CONC_MARKS = ['清', '淡', '重', '濃', '焦'];
const UNDO_CAP = 10;
const LAST_KEY = 'moyun-last';

function rgbCss([r, g, b]){
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

export default function PaintingPage(){
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const engineRef = useRef(null);
  const currentRef = useRef(null); // { id, name, width, height, createdAt }
  const undoRef = useRef({ stack: [], redo: [] });
  const saveTimerRef = useRef(null);
  const thumbUrlsRef = useRef([]);

  const [paintings, setPaintings] = useState([]);
  const [current, setCurrent] = useState(null);
  const [brushId, setBrushId] = useState('zhongfeng');
  const [pigment, setPigment] = useState(0);
  const [size, setSize] = useState(BRUSHES[0].size);
  const [conc, setConc] = useState(0.85);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [histLens, setHistLens] = useState([0, 0]);
  const [error, setError] = useState(null);

  /* ---- persistence ------------------------------------------------- */

  const refreshList = useCallback(async () => {
    const rows = await listPaintings();
    thumbUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    thumbUrlsRef.current = [];
    setPaintings(rows.map((r) => {
      const thumbUrl = r.thumb ? URL.createObjectURL(r.thumb) : null;
      if(thumbUrl) thumbUrlsRef.current.push(thumbUrl);
      return { id: r.id, name: r.name, updatedAt: r.updatedAt, thumbUrl };
    }));
  }, []);

  const saveCurrent = useCallback(async () => {
    const eng = engineRef.current, cur = currentRef.current;
    if(!eng || !cur) return;
    const packed = eng.snapshot();
    const state = await packedToBlob(packed);
    const tc = document.createElement('canvas');
    const tw = 300, th = Math.round(300 * cur.height / cur.width);
    tc.width = tw; tc.height = th;
    eng.render();
    tc.getContext('2d').drawImage(eng.canvas, 0, 0, tw, th);
    const thumb = await new Promise((res) => tc.toBlob(res, 'image/jpeg', 0.85));
    await putPainting({
      id: cur.id, name: cur.name, width: cur.width, height: cur.height,
      createdAt: cur.createdAt, updatedAt: Date.now(), thumb, state,
    });
    refreshList();
  }, [refreshList]);

  const scheduleSave = useCallback(() => {
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => { saveCurrent().catch(console.error); }, 1200);
  }, [saveCurrent]);

  const flushSave = useCallback(() => {
    if(!saveTimerRef.current) return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = null;
    saveCurrent().catch(console.error);
  }, [saveCurrent]);

  /* ---- painting lifecycle ------------------------------------------ */

  const ensureEngine = useCallback((w, h) => {
    if(engineRef.current){
      engineRef.current.resize(w, h);
    } else {
      const canvas = canvasRef.current;
      canvas.width = w; canvas.height = h;
      const eng = new InkEngine(canvas);
      eng.onStrokeEnd = () => scheduleSave();
      engineRef.current = eng;
    }
    return engineRef.current;
  }, [scheduleSave]);

  const setCurrentBoth = useCallback((rec) => {
    currentRef.current = rec;
    setCurrent(rec);
    undoRef.current = { stack: [], redo: [] };
    setHistLens([0, 0]);
    try { localStorage.setItem(LAST_KEY, rec.id); } catch {}
  }, []);

  const openPainting = useCallback(async (id) => {
    flushSave();
    const rec = await getPainting(id);
    if(!rec) return;
    const eng = ensureEngine(rec.width, rec.height);
    if(rec.state){
      eng.restore(await blobToPacked(rec.state, rec.width, rec.height));
    }
    setCurrentBoth({ id: rec.id, name: rec.name, width: rec.width, height: rec.height, createdAt: rec.createdAt });
    setGalleryOpen(false);
  }, [flushSave, ensureEngine, setCurrentBoth]);

  const createNew = useCallback(async (count) => {
    flushSave();
    const rect = stageRef.current.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = Math.max(Math.round(rect.width * dpr), 320);
    let h = Math.max(Math.round(rect.height * dpr), 320);
    const scale = Math.sqrt(1.9e6 / (w * h));
    if(scale < 1){ w = Math.round(w * scale); h = Math.round(h * scale); }
    const rec = {
      id: crypto.randomUUID(),
      name: `無題之${['一','二','三','四','五','六','七','八','九','十'][count % 10] || count + 1}`,
      width: w, height: h, createdAt: Date.now(), updatedAt: Date.now(),
      thumb: null, state: null,
    };
    await putPainting(rec);
    ensureEngine(w, h);
    setCurrentBoth({ id: rec.id, name: rec.name, width: w, height: h, createdAt: rec.createdAt });
    refreshList();
    setGalleryOpen(false);
  }, [flushSave, ensureEngine, setCurrentBoth, refreshList]);

  const removePainting = useCallback(async (id) => {
    if(!window.confirm('將這頁從冊中撕去？此舉不可復原。')) return;
    await deletePainting(id);
    if(currentRef.current?.id === id){
      const rows = await listPaintings();
      if(rows.length) await openPainting(rows[0].id);
      else await createNew(0);
    }
    refreshList();
  }, [openPainting, createNew, refreshList]);

  /* ---- boot --------------------------------------------------------- */

  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const rows = await listPaintings();
        if(dead) return;
        await refreshList();
        const lastId = (() => { try { return localStorage.getItem(LAST_KEY); } catch { return null; } })();
        const rec = rows.find((r) => r.id === lastId) || rows[0];
        if(rec) await openPainting(rec.id);
        else await createNew(0);
      } catch (err) {
        console.error(err);
        if(!dead) setError(
          err.message === 'webgl2-unavailable' || err.message === 'float-fbo-unavailable'
            ? '此瀏覽器不支援 WebGL2 浮點繪製，水墨無法暈開。請改用新版 Chrome / Edge / Safari。'
            : '初始化失敗：' + err.message
        );
      }
    })();
    const onHide = () => { if(document.hidden) flushSave(); };
    document.addEventListener('visibilitychange', onHide);
    return () => {
      dead = true;
      document.removeEventListener('visibilitychange', onHide);
      clearTimeout(saveTimerRef.current);
      thumbUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      engineRef.current?.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- history ------------------------------------------------------ */

  const syncHist = () => setHistLens([undoRef.current.stack.length, undoRef.current.redo.length]);

  const pushUndo = () => {
    const eng = engineRef.current;
    const h = undoRef.current;
    h.stack.push(eng.snapshot());
    if(h.stack.length > UNDO_CAP) h.stack.shift();
    h.redo = [];
    syncHist();
  };

  const undo = useCallback(() => {
    const eng = engineRef.current, h = undoRef.current;
    if(!eng || !h.stack.length) return;
    h.redo.push(eng.snapshot());
    eng.restore(h.stack.pop());
    syncHist();
    scheduleSave();
  }, [scheduleSave]);

  const redo = useCallback(() => {
    const eng = engineRef.current, h = undoRef.current;
    if(!eng || !h.redo.length) return;
    h.stack.push(eng.snapshot());
    eng.restore(h.redo.pop());
    syncHist();
    scheduleSave();
  }, [scheduleSave]);

  useEffect(() => {
    const onKey = (e) => {
      if(!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if(k === 'z'){ e.preventDefault(); e.shiftKey ? redo() : undo(); }
      else if(k === 'y'){ e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);

  const clearPaper = () => {
    const eng = engineRef.current;
    if(!eng) return;
    pushUndo();
    eng.clear();
    scheduleSave();
  };

  /* ---- stroke input -------------------------------------------------- */

  const makeBrush = (pointerType) => {
    const b = BRUSHES.find((x) => x.id === brushId);
    return {
      size,
      wet: b.wet * (1.15 - 0.45 * conc),
      flow: b.flow * Math.pow(conc, 1.4),
      dry: b.dry,
      depletion: b.depletion,
      abs: colorToAbsorbance(PIGMENTS[pigment].rgb),
      pointer: pointerType === 'pen' ? 'pen' : 'mouse',
    };
  };

  const toCanvas = (e) => {
    const c = canvasRef.current;
    const r = c.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (c.width / r.width),
      y: (e.clientY - r.top) * (c.height / r.height),
    };
  };

  const onPointerDown = (e) => {
    const eng = engineRef.current;
    if(!eng || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    pushUndo();
    const { x, y } = toCanvas(e);
    eng.beginStroke(x, y, e.pressure || 0.5, e.timeStamp, makeBrush(e.pointerType));
  };

  const onPointerMove = (e) => {
    const eng = engineRef.current;
    if(!eng || !eng.stroke) return;
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [e];
    for(const ev of events){
      const { x, y } = toCanvas(ev);
      eng.moveStroke(x, y, ev.pressure || 0.5, ev.timeStamp);
    }
  };

  const onPointerUp = () => engineRef.current?.endStroke();

  /* ---- misc actions --------------------------------------------------- */

  const exportPNG = () => {
    const eng = engineRef.current, cur = currentRef.current;
    if(!eng || !cur) return;
    eng.render();
    eng.canvas.toBlob((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${cur.name || '墨韻'}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    }, 'image/png');
  };

  const renameCurrent = (name) => {
    if(!currentRef.current) return;
    currentRef.current = { ...currentRef.current, name };
    setCurrent(currentRef.current);
    scheduleSave();
  };

  const pickBrush = (b) => { setBrushId(b.id); setSize(b.size); };

  const concMark = CONC_MARKS[Math.min(Math.floor(conc * CONC_MARKS.length), CONC_MARKS.length - 1)];

  /* ---- render --------------------------------------------------------- */

  return (
    <div className="mz-root">
      <header className="mz-top">
        <h1 className="mz-logo">墨韻</h1>
        <input
          className="mz-name" value={current?.name ?? ''} placeholder="題名"
          onChange={(e) => renameCurrent(e.target.value)} spellCheck={false}
        />
        <div className="mz-actions">
          <button onClick={undo} disabled={!histLens[0]} title="復原 (Ctrl+Z)">復原</button>
          <button onClick={redo} disabled={!histLens[1]} title="重做 (Ctrl+Shift+Z)">重做</button>
          <button onClick={clearPaper} title="清紙">清紙</button>
          <button onClick={exportPNG} title="輸出 PNG">存圖</button>
          <button
            className={galleryOpen ? 'mz-on' : ''}
            onClick={() => setGalleryOpen((v) => !v)} title="畫冊"
          >冊頁</button>
        </div>
      </header>

      <div className="mz-body">
        <aside className="mz-tools">
          <div className="mz-section" role="radiogroup" aria-label="筆">
            {BRUSHES.map((b) => (
              <button
                key={b.id}
                className={`mz-brush ${brushId === b.id ? 'mz-on' : ''}`}
                onClick={() => pickBrush(b)} title={b.hint}
              >{b.name}</button>
            ))}
          </div>
          <div className="mz-rule" />
          <div className="mz-section mz-dishes" role="radiogroup" aria-label="色">
            {PIGMENTS.map((p, i) => (
              <button
                key={p.name}
                className={`mz-dish ${pigment === i ? 'mz-on' : ''}`}
                style={{ background: rgbCss(p.rgb) }}
                onClick={() => setPigment(i)} title={p.name}
              ><span>{p.name}</span></button>
            ))}
          </div>
          <div className="mz-rule" />
          <div className="mz-section mz-sliders">
            <label>
              <span>筆鋒</span>
              <input
                type="range" min="3" max="60" step="1" value={size}
                onChange={(e) => setSize(+e.target.value)}
              />
            </label>
            <label>
              <span>{concMark}墨</span>
              <input
                type="range" min="0.08" max="1" step="0.01" value={conc}
                onChange={(e) => setConc(+e.target.value)}
              />
            </label>
          </div>
        </aside>

        <main className="mz-stage" ref={stageRef}>
          <canvas
            ref={canvasRef}
            className="mz-canvas"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onContextMenu={(e) => e.preventDefault()}
          />
          {error && (
            <div className="mz-error">
              <p>{error}</p>
            </div>
          )}
        </main>

        <aside className={`mz-gallery ${galleryOpen ? 'mz-open' : ''}`}>
          <header>
            <h2>冊頁</h2>
            <button className="mz-new" onClick={() => createNew(paintings.length)}>＋ 新紙</button>
          </header>
          <ul>
            {paintings.map((p) => (
              <li key={p.id} className={p.id === current?.id ? 'mz-on' : ''}>
                <button className="mz-leaf" onClick={() => openPainting(p.id)}>
                  {p.thumbUrl
                    ? <img src={p.thumbUrl} alt={p.name} />
                    : <span className="mz-blank">空白</span>}
                  <span className="mz-leaf-name">{p.name}</span>
                  <time>{new Date(p.updatedAt).toLocaleDateString('zh-Hant')}</time>
                </button>
                <button className="mz-del" onClick={() => removePainting(p.id)} title="刪除">撕</button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
