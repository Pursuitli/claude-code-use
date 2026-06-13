/* 墨韻 ink-wash engine — WebGL2 fluid simulation of ink on raw xuan paper.
 *
 * State lives in three half-float textures, ping-ponged each substep:
 *   water   R    = free water height on the paper
 *   pigment RGB  = per-channel absorbance of pigment still suspended in water
 *   deposit RGB  = per-channel absorbance fixed into the paper fibers
 * plus one static procedural `paper` texture (R absorbency, G fiber grain,
 * B large-scale mottle) that makes bleeding ragged and dry strokes broken.
 *
 * Each substep: water diffuses through the fiber field (with a capillary
 * retention threshold so the bleed front is irregular), pigment is advected
 * outward along -∇h and fixed into the deposit at a rate that spikes at the
 * drying edge — which is what produces the dark rims (积墨) of real ink wash.
 * Compositing is subtractive: paper * exp(-(deposit + suspended)).
 */

const DMAX = 4.0; // absorbance full-scale used when packing state to RGBA8

const VERT_FS = `#version 300 es
layout(location=0) in vec2 aPos;
out vec2 vUv;
void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG_NOISE = `
float hash12(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1,0)), u.x),
             mix(hash12(i + vec2(0,1)), hash12(i + vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for(int i = 0; i < 4; i++){ v += a * vnoise(p); p *= 2.13; a *= 0.5; }
  return v;
}`;

const FRAG_PAPER = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform vec2 uSize;
${FRAG_NOISE}
void main(){
  vec2 px = vUv * uSize;
  float absorb = fbm(px * 0.035) * 0.55 + fbm(px * 0.13 + 7.3) * 0.45;
  // fiber grain: fine streaks, mildly horizontal like laid xuan fibres
  float fiber = fbm(px * vec2(0.10, 0.55)) * 0.6 + fbm(px * 0.45) * 0.4;
  float mottle = fbm(px * 0.008);
  o = vec4(absorb, fiber, mottle, 1.0);
}`;

const VERT_SPLAT = `#version 300 es
layout(location=0) in vec4 aA; // x, y (px), radius (px), water
layout(location=1) in vec4 aB; // absorbance RGB, dryness
uniform vec2 uSize;
out vec4 vB;
out float vWater;
void main(){
  vB = aB; vWater = aA.w;
  vec2 clip = (aA.xy / uSize) * 2.0 - 1.0;
  gl_Position = vec4(clip, 0.0, 1.0);
  gl_PointSize = aA.z * 2.0;
}`;

const FRAG_SPLAT = `#version 300 es
precision highp float;
in vec4 vB;
in float vWater;
uniform sampler2D uPaper;
uniform vec2 uTexel;
layout(location=0) out vec4 oW;
layout(location=1) out vec4 oP;
void main(){
  vec2 d = gl_PointCoord * 2.0 - 1.0;
  float r = length(d);
  if(r > 1.0) discard;
  float fall = exp(-r * r * 2.5) * smoothstep(1.0, 0.55, r);
  // dryness gates deposition to the raised fibres -> flying white (飛白)
  float grain = texture(uPaper, gl_FragCoord.xy * uTexel).g;
  float mask = smoothstep(vB.w - 0.18, vB.w + 0.18, grain + (1.0 - vB.w) * 0.5);
  oW = vec4(vWater * fall * mix(1.0, mask, 0.85), 0.0, 0.0, 0.0);
  oP = vec4(vB.rgb * fall * mask, 0.0);
}`;

const FRAG_UPDATE = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uW;
uniform sampler2D uP;
uniform sampler2D uD;
uniform sampler2D uPaper;
uniform vec2 uTexel;
layout(location=0) out vec4 oW;
layout(location=1) out vec4 oP;
layout(location=2) out vec4 oD;

float hEff(vec2 uv){
  float h = texture(uW, uv).r;
  float tau = mix(0.015, 0.13, texture(uPaper, uv).r); // capillary retention
  return max(h - tau, 0.0);
}

void main(){
  vec2 t = uTexel;
  float h  = texture(uW, vUv).r;
  float he = hEff(vUv);
  float heE = hEff(vUv + vec2(t.x, 0.0)), heW = hEff(vUv - vec2(t.x, 0.0));
  float heN = hEff(vUv + vec2(0.0, t.y)), heS = hEff(vUv - vec2(0.0, t.y));
  float heNE = hEff(vUv + t), heSW = hEff(vUv - t);
  float heNW = hEff(vUv + vec2(-t.x, t.y)), heSE = hEff(vUv + vec2(t.x, -t.y));

  // fiber-weighted diffusion: neighbours pull unevenly -> ragged bleed front
  float wE = 0.35 + 1.3 * texture(uPaper, vUv + vec2(t.x, 0.0)).r;
  float wW = 0.35 + 1.3 * texture(uPaper, vUv - vec2(t.x, 0.0)).r;
  float wN = 0.35 + 1.3 * texture(uPaper, vUv + vec2(0.0, t.y)).r;
  float wS = 0.35 + 1.3 * texture(uPaper, vUv - vec2(0.0, t.y)).r;
  float lap = wE * (heE - he) + wW * (heW - he) + wN * (heN - he) + wS * (heS - he)
            + 0.5 * ((heNE - he) + (heSW - he) + (heNW - he) + (heSE - he));
  float h2 = h + 0.11 * lap;
  h2 = max(h2 - 0.0022, 0.0) * 0.998; // evaporation

  // water flows outward (downhill); pigment rides along
  vec2 grad = vec2(heE - heW, heN - heS) * 0.5;
  vec2 vel = -grad * 26.0;
  float vlen = length(vel);
  if(vlen > 1.6) vel *= 1.6 / vlen;
  vec3 p = texture(uP, vUv - vel * uTexel).rgb;
  vec3 pAvg = (texture(uP, vUv + vec2(t.x, 0.0)).rgb + texture(uP, vUv - vec2(t.x, 0.0)).rgb
             + texture(uP, vUv + vec2(0.0, t.y)).rgb + texture(uP, vUv - vec2(0.0, t.y)).rgb) * 0.25;
  p = mix(p, pAvg, 0.05);

  // fixing: faster on absorbent paper, much faster at the drying edge -> dark rims
  float paperAbs = 0.55 + 0.9 * texture(uPaper, vUv).r;
  float edge = length(grad);
  float rate = clamp(0.016 * paperAbs * (1.0 + 9.0 * edge) * (1.25 - clamp(h2, 0.0, 1.0)), 0.0, 0.45);
  if(h2 <= 0.002) rate = 1.0; // dry paper fixes everything instantly
  vec3 moved = p * rate;

  oW = vec4(min(h2, 2.5), 0.0, 0.0, 0.0);
  oP = vec4(max(p - moved, 0.0), 0.0);
  oD = vec4(min(texture(uD, vUv).rgb + moved, vec3(DMAX_)), 0.0);
}`.replace('DMAX_', DMAX.toFixed(1));

const FRAG_COMPOSITE = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uW;
uniform sampler2D uP;
uniform sampler2D uD;
uniform sampler2D uPaper;
void main(){
  vec3 paper = texture(uPaper, vUv).rgb;
  vec3 base = vec3(0.965, 0.948, 0.905) * (0.985 + 0.03 * (paper.b - 0.5));
  vec3 total = texture(uD, vUv).rgb + texture(uP, vUv).rgb * 0.9;
  vec3 col = base * exp(-total);
  float h = texture(uW, vUv).r;
  col *= 1.0 - 0.05 * clamp(h * 1.5, 0.0, 1.0); // wet sheen
  o = vec4(col, 1.0);
}`;

const FRAG_PACK = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uP;
uniform sampler2D uD;
void main(){
  vec3 total = texture(uD, vUv).rgb + texture(uP, vUv).rgb * 0.9;
  o = vec4(clamp(total / ${DMAX.toFixed(1)}, 0.0, 1.0), 1.0);
}`;

const FRAG_UNPACK = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTex;
layout(location=0) out vec4 oW;
layout(location=1) out vec4 oP;
layout(location=2) out vec4 oD;
void main(){
  oW = vec4(0.0);
  oP = vec4(0.0);
  oD = vec4(texture(uTex, vUv).rgb * ${DMAX.toFixed(1)}, 0.0);
}`;

function compile(gl, type, src){
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if(!gl.getShaderParameter(sh, gl.COMPILE_STATUS)){
    throw new Error('shader: ' + gl.getShaderInfoLog(sh));
  }
  return sh;
}

function program(gl, vs, fs){
  const p = gl.createProgram();
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if(!gl.getProgramParameter(p, gl.LINK_STATUS)){
    throw new Error('link: ' + gl.getProgramInfoLog(p));
  }
  return p;
}

export class InkEngine {
  constructor(canvas){
    this.canvas = canvas;
    const gl = canvas.getContext('webgl2', {
      alpha: false, antialias: false, depth: false, stencil: false,
      preserveDrawingBuffer: true,
    });
    if(!gl) throw new Error('webgl2-unavailable');
    if(!gl.getExtension('EXT_color_buffer_float')) throw new Error('float-fbo-unavailable');
    this.gl = gl;

    this.progPaper = program(gl, VERT_FS, FRAG_PAPER);
    this.progSplat = program(gl, VERT_SPLAT, FRAG_SPLAT);
    this.progUpdate = program(gl, VERT_FS, FRAG_UPDATE);
    this.progComposite = program(gl, VERT_FS, FRAG_COMPOSITE);
    this.progPack = program(gl, VERT_FS, FRAG_PACK);
    this.progUnpack = program(gl, VERT_FS, FRAG_UNPACK);

    this.quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    this.splatBuf = gl.createBuffer();
    this.splatData = new Float32Array(4096 * 8);
    this.splatCount = 0;

    this.stroke = null;
    this.lastSplatTime = 0;
    this.running = false;
    this.replaying = false;
    this._acc = 0;        // accumulated wall-clock time owed to the sim (ms)
    this._lastFrame = 0;  // timestamp of previous frame (0 = needs reseed)
    this.onStrokeEnd = null;
    this._raf = this._raf || null;
    this._frame = this._frame.bind(this);

    this.resize(canvas.width, canvas.height);
  }

  _makeTex(w, h){
    const gl = this.gl;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  }

  _makeStateFBO(set){
    const gl = this.gl;
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, set.water, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, set.pigment, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.TEXTURE_2D, set.deposit, 0);
    return fbo;
  }

  resize(w, h){
    const gl = this.gl;
    this.w = w; this.h = h;
    this.canvas.width = w; this.canvas.height = h;
    if(this.src){
      for(const set of [this.src, this.dst]){
        gl.deleteTexture(set.water); gl.deleteTexture(set.pigment); gl.deleteTexture(set.deposit);
        gl.deleteFramebuffer(set.fbo);
      }
      gl.deleteTexture(this.paperTex);
      gl.deleteFramebuffer(this.packFBO);
      gl.deleteTexture(this.packTex);
    }
    this.src = { water: this._makeTex(w, h), pigment: this._makeTex(w, h), deposit: this._makeTex(w, h) };
    this.dst = { water: this._makeTex(w, h), pigment: this._makeTex(w, h), deposit: this._makeTex(w, h) };
    this.src.fbo = this._makeStateFBO(this.src);
    this.dst.fbo = this._makeStateFBO(this.dst);

    this.paperTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.paperTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const paperFBO = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, paperFBO);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.paperTex, 0);
    gl.viewport(0, 0, w, h);
    gl.useProgram(this.progPaper);
    gl.uniform2f(gl.getUniformLocation(this.progPaper, 'uSize'), w, h);
    this._drawQuad();
    gl.deleteFramebuffer(paperFBO);

    this.packTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.packTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    this.packFBO = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.packFBO);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.packTex, 0);

    this.clear();
  }

  _drawQuad(){
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disableVertexAttribArray(1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  _bindState(prog, set){
    const gl = this.gl;
    const names = [['uW', set.water], ['uP', set.pigment], ['uD', set.deposit], ['uPaper', this.paperTex]];
    names.forEach(([name, tex], i) => {
      const loc = gl.getUniformLocation(prog, name);
      if(loc === null) return;
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(loc, i);
    });
  }

  clear(){
    const gl = this.gl;
    for(const set of [this.src, this.dst]){
      gl.bindFramebuffer(gl.FRAMEBUFFER, set.fbo);
      gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2]);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    this.wake();
  }

  /* ---- stroke input ------------------------------------------------ */

  beginStroke(x, y, pressure, time, brush){
    this.stroke = {
      brush, x, y, time,
      dist: 0, speed: 0,
      pressure, // low-pass filtered below to smooth pencil sensor jitter
      width: this._strokeWidth(brush, pressure, 0),
    };
    this._stamp(x, y, this.stroke.width, 0);
    this.wake();
  }

  moveStroke(x, y, pressure, time){
    const s = this.stroke;
    if(!s) return;
    const dx = x - s.x, dy = y - s.y;
    const d = Math.hypot(dx, dy);
    if(d < 0.3) return;
    const dt = Math.max(time - s.time, 1);
    s.speed = s.speed * 0.7 + (d / dt) * 0.3;
    s.pressure += (pressure - s.pressure) * 0.35; // smooth jittery pencil pressure
    const targetW = this._strokeWidth(s.brush, s.pressure, s.speed);
    const spacing = Math.max(1.4, s.width * 0.22);
    const steps = Math.ceil(d / spacing);
    for(let i = 1; i <= steps; i++){
      const t = i / steps;
      s.width += (targetW - s.width) * 0.18;
      this._stamp(s.x + dx * t, s.y + dy * t, s.width, s.dist + d * t);
    }
    s.dist += d; s.x = x; s.y = y; s.time = time;
    this.wake();
  }

  endStroke(){
    if(!this.stroke) return;
    this.stroke = null;
    if(this.onStrokeEnd) this.onStrokeEnd();
  }

  _strokeWidth(brush, pressure, speed){
    const pf = brush.pointer === 'pen'
      ? 0.25 + 0.95 * pressure
      : Math.max(0.35, 1.0 - Math.min(speed / 2.4, 1) * 0.55);
    return Math.max(1.5, brush.size * pf);
  }

  _stamp(x, y, radius, dist){
    const s = this.stroke;
    const b = s.brush;
    if(this.splatCount >= 4096) this._flushSplats();
    // the brush runs out of ink along the stroke: wet start, dry tail
    const deplete = Math.exp(-dist / b.depletion);
    // 0.22 / 0.5: overlapping stamps stack ~4x, keep totals in sane range
    const water = b.wet * (0.30 + 0.70 * deplete) * 0.22;
    const flow = b.flow * (0.35 + 0.65 * deplete) * 0.5;
    const dry = Math.min(b.dry + (1 - deplete) * 0.35, 0.92);
    const o = this.splatCount * 8;
    const d = this.splatData;
    d[o] = x; d[o + 1] = this.h - y; d[o + 2] = radius; d[o + 3] = water;
    d[o + 4] = b.abs[0] * flow; d[o + 5] = b.abs[1] * flow; d[o + 6] = b.abs[2] * flow; d[o + 7] = dry;
    this.splatCount++;
  }

  _flushSplats(){
    const gl = this.gl;
    if(this.splatCount === 0) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.src.fbo);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.NONE]);
    gl.viewport(0, 0, this.w, this.h);
    gl.useProgram(this.progSplat);
    gl.uniform2f(gl.getUniformLocation(this.progSplat, 'uSize'), this.w, this.h);
    gl.uniform2f(gl.getUniformLocation(this.progSplat, 'uTexel'), 1 / this.w, 1 / this.h);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.paperTex);
    gl.uniform1i(gl.getUniformLocation(this.progSplat, 'uPaper'), 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.splatBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.splatData.subarray(0, this.splatCount * 8), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 32, 16);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.drawArrays(gl.POINTS, 0, this.splatCount);
    gl.disable(gl.BLEND);
    gl.disableVertexAttribArray(1);
    this.splatCount = 0;
    this.lastSplatTime = performance.now();
  }

  /* ---- simulation loop --------------------------------------------- */

  wake(){
    if(this.replaying) return; // replay drives the sim explicitly via simulate()
    this.lastSplatTime = performance.now();
    if(!this.running){
      this.running = true;
      this._lastFrame = 0; // reseed dt on the next frame; drop any stale backlog
      this._acc = 0;
      this._raf = requestAnimationFrame(this._frame);
    }
  }

  _stepSim(iters){
    const gl = this.gl;
    for(let i = 0; i < iters; i++){
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.dst.fbo);
      gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2]);
      gl.viewport(0, 0, this.w, this.h);
      gl.useProgram(this.progUpdate);
      gl.uniform2f(gl.getUniformLocation(this.progUpdate, 'uTexel'), 1 / this.w, 1 / this.h);
      this._bindState(this.progUpdate, this.src);
      this._drawQuad();
      const tmp = this.src; this.src = this.dst; this.dst = tmp;
    }
  }

  // Advance the simulation by `iters` substeps and show the result.
  // Used during .painting replay, where rAF is paused (replaying = true).
  simulate(iters){
    this._flushSplats();
    this._stepSim(iters);
    this.render();
  }

  _frame(now){
    if(!this.running) return;
    if(now === undefined) now = performance.now();
    this._flushSplats();

    // Advance the sim by elapsed wall-clock time, not a fixed count per frame,
    // so the ink dries/bleeds at the same real-world rate on a 60Hz desktop
    // and a 120Hz iPad. Without this, ProMotion runs the physics 2x too fast
    // and fast strokes fix into beads before they can bleed together.
    if(!this._lastFrame) this._lastFrame = now;
    let dt = now - this._lastFrame;
    this._lastFrame = now;
    if(dt < 0) dt = 0;
    if(dt > 64) dt = 64; // clamp after a stall / backgrounded tab
    const SUBSTEP = 1000 / 120; // target 120 substeps/sec (== old 60Hz × 2)
    this._acc = Math.min(this._acc + dt, SUBSTEP * 6); // bound the backlog
    const n = Math.floor(this._acc / SUBSTEP);
    this._acc -= n * SUBSTEP;
    if(n > 0) this._stepSim(n);
    this.render();

    // keep simulating until the paper has had time to dry, then sleep
    if(performance.now() - this.lastSplatTime > 22000 && !this.stroke){
      this.running = false;
      this._raf = null;
    } else {
      this._raf = requestAnimationFrame(this._frame);
    }
  }

  render(){
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.w, this.h);
    gl.useProgram(this.progComposite);
    this._bindState(this.progComposite, this.src);
    this._drawQuad();
  }

  /* ---- state pack / restore (deposit + suspended, dried) ------------ */

  snapshot(){
    const gl = this.gl;
    this._flushSplats();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.packFBO);
    gl.viewport(0, 0, this.w, this.h);
    gl.useProgram(this.progPack);
    this._bindState(this.progPack, this.src);
    this._drawQuad();
    const buf = new Uint8Array(this.w * this.h * 4);
    gl.readPixels(0, 0, this.w, this.h, gl.RGBA, gl.UNSIGNED_BYTE, buf);
    return buf;
  }

  restore(buf){
    const gl = this.gl;
    this.stroke = null;
    this.splatCount = 0;
    gl.bindTexture(gl.TEXTURE_2D, this.packTex);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.w, this.h, gl.RGBA, gl.UNSIGNED_BYTE, buf);
    for(const set of [this.src, this.dst]){
      gl.bindFramebuffer(gl.FRAMEBUFFER, set.fbo);
      gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2]);
      gl.viewport(0, 0, this.w, this.h);
      gl.useProgram(this.progUnpack);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.packTex);
      gl.uniform1i(gl.getUniformLocation(this.progUnpack, 'uTex'), 0);
      this._drawQuad();
    }
    this.render();
    this.wake();
  }

  destroy(){
    this.running = false;
    if(this._raf) cancelAnimationFrame(this._raf);
    const ext = this.gl.getExtension('WEBGL_lose_context');
    if(ext) ext.loseContext();
  }
}

/* Pigment color -> per-channel absorbance (Beer–Lambert). */
export function colorToAbsorbance(rgb){
  return rgb.map((c) => Math.min(-Math.log(Math.max(c, 0.018)), DMAX));
}
