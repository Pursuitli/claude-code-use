'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import './painting.css';
import { InkEngine, colorToAbsorbance } from './ink-engine';
import {
  listPaintings, getPainting, putPainting, deletePainting,
  packedToBlob, blobToPacked,
  buildPaintingDoc, parsePaintingDoc, savePaintingFile,
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

/* Resolve a stored stroke intent into engine splat parameters. Shared by
   live painting (makeBrush) and .painting replay so they match exactly. */
function buildBrush({ brushId, color, size, conc, pointer }){
  const b = BRUSHES.find((x) => x.id === brushId) || BRUSHES[0];
  return {
    size,
    wet: b.wet * (1.15 - 0.45 * conc),
    flow: b.flow * Math.pow(conc, 1.4),
    dry: b.dry,
    depletion: b.depletion,
    abs: colorToAbsorbance(color),
    pointer,
  };
}

/* Replay one recorded action through the engine, re-running the fluid sim.
   Stroke points carry relative ms timestamps; we step the sim every ~16ms
   of stroke time (matching the live rAF cadence) and settle for the gap
   that preceded the action, so wet-into-wet vs dry interactions reproduce. */
function replayAction(eng, a){
  if(a.t === 'clear'){
    eng.clear();
  } else if(a.t === 'stroke' && a.pts && a.pts.length){
    const brush = buildBrush(a);
    const [x0, y0, pr0] = a.pts[0];
    eng.beginStroke(x0, y0, pr0 ?? 0.5, 0, brush);
    let last = a.pts[0][3] || 0, acc = 0;
    for(let i = 1; i < a.pts.length; i++){
      const [x, y, pr, t] = a.pts[i];
      eng.moveStroke(x, y, pr ?? 0.5, t);
      acc += (t - last); last = t;
      if(acc >= 16){ eng.simulate(2); acc = 0; }
    }
    eng.endStroke();
  }
  const settle = Math.min(Math.round((a.gap || 0) / 8), 300);
  if(settle > 0) eng.simulate(settle);
}

export default function PaintingPage(){
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const engineRef = useRef(null);
  const currentRef = useRef(null); // { id, name, width, height, createdAt }
  const undoRef = useRef({ stack: [], redo: [] });
  const logRef = useRef({ actions: [], redo: [] }); // vector stroke log (.painting)
  const recRef = useRef(null);                      // stroke being recorded
  const lastActionEndRef = useRef(0);               // for inter-stroke gap timing
  const fileInputRef = useRef(null);
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
  const [replayPct, setReplayPct] = useState(-1); // -1 = idle, 0..100 while opening a .painting

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
    // Capture all mutable refs synchronously before any await — concurrent state
    // switches (setCurrentBoth) reset logRef between awaits which would corrupt
    // the saved action log for whichever painting was current at call time.
    const actions = logRef.current.actions.slice();
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
      actions,
    });
    refreshList();
  }, [refreshList]);

  const scheduleSave = useCallback(() => {
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveTimerRef.current = null; // must be null before saveCurrent so flushSave doesn't re-fire it
      saveCurrent().catch(console.error);
    }, 1200);
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
    logRef.current = { actions: [], redo: [] };
    recRef.current = null;
    lastActionEndRef.current = 0;
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
    } else {
      eng.clear();
    }
    setCurrentBoth({ id: rec.id, name: rec.name, width: rec.width, height: rec.height, createdAt: rec.createdAt });
    logRef.current = { actions: rec.actions ? rec.actions.slice() : [], redo: [] };
    syncHist(); // enable undo for strokes already in this painting
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
      thumb: null, state: null, actions: [],
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

  // Log is the source of truth for undo count: both live strokes and strokes
  // loaded from the gallery/file are in logRef.actions. Raster snapshots in
  // undoRef are a fast-path cache for recent strokes — when they run out
  // (i.e. undoing into history that predates this session), we replay the log.
  const syncHist = () =>
    setHistLens([logRef.current.actions.length, logRef.current.redo.length]);

  const pushUndo = () => {
    const eng = engineRef.current;
    const h = undoRef.current;
    h.stack.push(eng.snapshot());
    if(h.stack.length > UNDO_CAP) h.stack.shift();
    h.redo = [];
    // Note: syncHist called by onPointerUp after the action lands in the log.
  };

  // Replay all actions in logRef up to their current count. Used when raster
  // snapshots are exhausted and we need to reconstruct an earlier state.
  const replayFromLog = useCallback((actions) => {
    const eng = engineRef.current;
    if(!eng) return;
    eng.stroke = null;
    eng.splatCount = 0;
    eng.replaying = true;
    eng.clear();
    try {
      for(const a of actions) replayAction(eng, a);
    } finally {
      eng.replaying = false;
      eng.wake();
    }
  }, []);

  const undo = useCallback(() => {
    const eng = engineRef.current, h = undoRef.current, L = logRef.current;
    if(!eng || !L.actions.length) return;
    if(h.stack.length){
      // Fast path: raster snapshot covers this stroke
      h.redo.push(eng.snapshot());
      eng.restore(h.stack.pop());
      L.redo.push(L.actions.pop());
    } else {
      // Slow path: no raster snapshot — pop from log and replay remaining
      L.redo.push(L.actions.pop());
      replayFromLog(L.actions);
    }
    syncHist();
    scheduleSave();
  }, [scheduleSave, replayFromLog]);

  const redo = useCallback(() => {
    const eng = engineRef.current, h = undoRef.current, L = logRef.current;
    if(!eng || !L.redo.length) return;
    if(h.redo.length){
      // Fast path: raster snapshot covers this redo step
      h.stack.push(eng.snapshot());
      eng.restore(h.redo.pop());
      L.actions.push(L.redo.pop());
    } else {
      // Slow path: replay with one more action re-applied
      L.actions.push(L.redo.pop());
      replayFromLog(L.actions);
    }
    syncHist();
    scheduleSave();
  }, [scheduleSave, replayFromLog]);

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
    const L = logRef.current;
    L.actions.push({ t: 'clear', gap: 0 });
    L.redo = [];
    lastActionEndRef.current = 0;
    syncHist();
    scheduleSave();
  };

  /* ---- stroke input -------------------------------------------------- */

  const strokeIntent = (pointerType) => ({
    brushId,
    color: [...PIGMENTS[pigment].rgb],
    size,
    conc,
    pointer: pointerType === 'pen' ? 'pen' : 'mouse',
  });

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
    if(!eng || eng.replaying || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    pushUndo();
    const { x, y } = toCanvas(e);
    const p = e.pressure || 0.5;
    const intent = strokeIntent(e.pointerType);
    eng.beginStroke(x, y, p, e.timeStamp, buildBrush(intent));
    recRef.current = {
      t: 'stroke', ...intent,
      gap: Math.min(Math.max(e.timeStamp - lastActionEndRef.current, 0), 8000),
      pts: [[Math.round(x), Math.round(y), Math.round(p * 100) / 100, 0]],
      _t0: e.timeStamp,
    };
  };

  const onPointerMove = (e) => {
    const eng = engineRef.current;
    if(!eng || !eng.stroke) return;
    const rec = recRef.current;
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [e];
    for(const ev of events){
      const { x, y } = toCanvas(ev);
      const p = ev.pressure || 0.5;
      eng.moveStroke(x, y, p, ev.timeStamp);
      if(rec) rec.pts.push([Math.round(x), Math.round(y), Math.round(p * 100) / 100, Math.round(ev.timeStamp - rec._t0)]);
    }
  };

  const onPointerUp = (e) => {
    const eng = engineRef.current;
    if(!eng) return;
    const rec = recRef.current;
    recRef.current = null;
    if(rec && eng.stroke){
      delete rec._t0;
      const L = logRef.current;
      L.actions.push(rec);
      L.redo = [];
      lastActionEndRef.current = e?.timeStamp ?? performance.now();
      syncHist(); // log just grew; update undo button
    }
    eng.endStroke();
  };

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

  const savePainting = async () => {
    const cur = currentRef.current;
    if(!cur) return;
    await savePaintingFile(
      `${cur.name || '墨韻'}.painting`,
      buildPaintingDoc({
        name: cur.name, width: cur.width, height: cur.height,
        createdAt: cur.createdAt, actions: logRef.current.actions,
      }),
    );
  };

  const importDoc = useCallback(async (doc) => {
    flushSave();
    const rec = {
      id: crypto.randomUUID(),
      name: doc.name || '匯入畫稿',
      width: doc.width, height: doc.height,
      createdAt: Date.now(), updatedAt: Date.now(),
      thumb: null, state: null, actions: [],
    };
    await putPainting(rec);
    const eng = ensureEngine(doc.width, doc.height);
    eng.clear();
    setCurrentBoth({ id: rec.id, name: rec.name, width: doc.width, height: doc.height, createdAt: rec.createdAt });
    setGalleryOpen(false);

    const L = logRef.current; // reset to empty by setCurrentBoth
    const n = doc.actions.length;
    setReplayPct(0);
    eng.replaying = true;
    try {
      for(let i = 0; i < n; i++){
        replayAction(eng, doc.actions[i]);
        L.actions.push(doc.actions[i]);
        if(i % 2 === 0 || i === n - 1){
          setReplayPct(Math.round(((i + 1) / n) * 100));
          await new Promise((r) => requestAnimationFrame(r)); // let the canvas repaint
        }
      }
    } finally {
      eng.replaying = false;
      setReplayPct(-1);
      eng.wake();
      syncHist(); // enable undo for all replayed strokes
      scheduleSave();
    }
  }, [flushSave, ensureEngine, setCurrentBoth, scheduleSave]);

  const onFilePicked = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if(!file) return;
    try {
      const doc = parsePaintingDoc(await file.text());
      await importDoc(doc);
    } catch (err) {
      window.alert(err.message || '開啟失敗');
    }
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
          <button onClick={exportPNG} title="輸出 PNG 圖檔">存圖</button>
          <button onClick={savePainting} title="存成可再編輯的 .painting 畫稿">存稿</button>
          <button onClick={() => fileInputRef.current?.click()} title="開啟 .painting 畫稿">開稿</button>
          <button
            className={galleryOpen ? 'mz-on' : ''}
            onClick={() => setGalleryOpen((v) => !v)} title="畫冊"
          >冊頁</button>
        </div>
        <input
          ref={fileInputRef} type="file" accept=".painting,application/json"
          hidden onChange={onFilePicked}
        />
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
          {replayPct >= 0 && (
            <div className="mz-replay">
              <p>重現筆墨…</p>
              <div className="mz-replay-bar"><i style={{ width: `${replayPct}%` }} /></div>
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
