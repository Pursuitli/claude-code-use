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
