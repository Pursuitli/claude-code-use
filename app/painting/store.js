/* 冊頁 gallery persistence — IndexedDB, no backend.
 * Each painting record: { id, name, width, height, createdAt, updatedAt,
 *   thumb: Blob(png), state: Blob(png of the packed deposit buffer) }
 */

const DB_NAME = 'moyun-gallery';
const STORE = 'paintings';

function openDB(){
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx(mode, fn){
  const db = await openDB();
  try {
    return await new Promise((resolve, reject) => {
      const t = db.transaction(STORE, mode);
      const out = fn(t.objectStore(STORE));
      t.oncomplete = () => resolve(out.result !== undefined ? out.result : out);
      t.onerror = () => reject(t.error);
    });
  } finally {
    db.close();
  }
}

export function listPaintings(){
  return tx('readonly', (s) => s.getAll()).then((rows) =>
    (rows || []).sort((a, b) => b.updatedAt - a.updatedAt)
  );
}

export function getPainting(id){
  return tx('readonly', (s) => s.get(id));
}

export function putPainting(record){
  return tx('readwrite', (s) => s.put(record));
}

export function deletePainting(id){
  return tx('readwrite', (s) => s.delete(id));
}

/* ---- packed-state <-> compressed blob ----
 * Deflate via native CompressionStream: a mostly-blank packed buffer
 * shrinks ~100x and the encode stays off the canvas/GPU path entirely. */

export function packedToBlob(buf){
  const cs = new CompressionStream('deflate');
  return new Response(new Blob([buf]).stream().pipeThrough(cs)).blob();
}

export async function blobToPacked(blob, w, h){
  const ds = new DecompressionStream('deflate');
  const ab = await new Response(blob.stream().pipeThrough(ds)).arrayBuffer();
  const out = new Uint8Array(ab);
  const n = w * h * 4;
  return out.length === n ? out : out.slice(0, n);
}

/* ---- .painting document (vector stroke log, JSON) ----
 * Records intent — brush / colour / points / timing — not pixels.
 * Opening one replays the strokes through the ink engine. */

export const PAINTING_FORMAT = 'moyun-painting';
export const PAINTING_VERSION = 1;

export function buildPaintingDoc({ name, width, height, createdAt, actions }){
  return {
    format: PAINTING_FORMAT,
    version: PAINTING_VERSION,
    name: name || '',
    width, height,
    createdAt: createdAt || Date.now(),
    savedAt: Date.now(),
    actions,
  };
}

export function parsePaintingDoc(text){
  let d;
  try { d = JSON.parse(text); }
  catch { throw new Error('檔案無法解析：不是有效的 JSON'); }
  if(!d || d.format !== PAINTING_FORMAT) throw new Error('這不是 .painting 畫稿檔');
  if(!(Number.isFinite(d.width) && d.width > 0 && Number.isFinite(d.height) && d.height > 0))
    throw new Error('畫稿尺寸無效');
  if(!Array.isArray(d.actions)) throw new Error('畫稿缺少筆觸記錄');
  if(d.version > PAINTING_VERSION) throw new Error('此畫稿來自較新版本，請更新後再開啟');
  return d;
}

export async function savePaintingFile(filename, doc){
  const blob = new Blob([JSON.stringify(doc)], { type: 'application/json' });
  if(window.showSaveFilePicker){
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: '墨韻畫稿', accept: { 'application/json': ['.painting'] } }],
      });
      const w = await handle.createWritable();
      await w.write(blob);
      await w.close();
      return;
    } catch (e) {
      if(e.name === 'AbortError') return;
      // fall through to anchor download on any picker failure
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
