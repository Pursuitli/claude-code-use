'use client';

import { useEffect } from 'react';
import './chinese-painting.css';

/* gpt-image-2 生成的水墨圖層（multiply 疊印，白紙自動消隱）。
   圖片尚未生成或 404 時自動回退到內建 SVG。root=true 的那張載入成功後，
   會隱藏純 SVG 的補間山層，避免畫風混雜。 */
function inkLayer(src, root = false) {
  return (
    <img
      src={src} alt="" className="ink-img" loading="lazy"
      onLoad={(e) => {
        const p = e.currentTarget.parentElement;
        p.classList.add('has-img');
        if (root) p.closest('.ruhua-root').classList.add('imgs-on');
      }}
      onError={(e) => e.currentTarget.remove()}
    />
  );
}

export default function ChinesePaintingPage() {
  /* =================== ScrollProgressController =================== */
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const M = reduced ? 0 : 1;                    // 動作幅度（reduced 時僅保留透明度變化）
    const $ = (s) => document.querySelector(s);
    const journey = $('#journey');
    let vh = innerHeight;
    let disposed = false;
    const listeners = [];
    const on = (target, type, fn, opts) => { target.addEventListener(type, fn, opts); listeners.push([target, type, fn, opts]); };

    const clamp01 = (x) => x < 0 ? 0 : x > 1 ? 1 : x;
    const seg  = (a, b) => (p) => clamp01((p - a) / (b - a));
    const ease = (t) => t < .5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2;
    const lerp = (a, b, t) => a + (b - a) * t;

    const hero   = $('#hero-ru');
    const mistL  = $('#mist-l'), mistR = $('#mist-r'), mistF = $('#mist-f');
    const mounts = [...document.querySelectorAll('.ruhua-root .mountain')].map((el, i) => ({ el, d: +el.dataset.depth, i }));
    const birds  = $('#birds');
    const water  = $('#water'), canvas = $('#ripples');
    const bridge = $('#bridge');
    const night  = $('#night'), moon = $('#moon'), stars = $('#stars');
    const bamboos = document.querySelectorAll('.ruhua-root .bamboo');

    /* 滾動劇本（p ∈ 0..1）
       0.00–.08 hero ｜ .06–.22 霧起 ｜ .22–.42 山現
       .42–.60 水動 ｜ .56–.76 橋過 ｜ .72–.92 月升 */
    const captions = [
      { el: $('#cap-wu'),   a:.10, b:.15, c:.19, d:.23 },
      { el: $('#cap-shan'), a:.26, b:.31, c:.38, d:.42 },
      { el: $('#cap-shui'), a:.46, b:.51, c:.56, d:.60 },
      { el: $('#cap-qiao'), a:.60, b:.65, c:.71, d:.75 },
      { el: $('#cap-yue'),  a:.79, b:.84, c:.90, d:.94 },
    ];

    let waterOn = false;
    const boot = performance.now();

    function update() {
      const r = journey.getBoundingClientRect();
      const p = clamp01(-r.top / (r.height - vh));

      /* 開卷：遠山自空白宣紙中緩緩滲出（時間驅動，與滾動無關） */
      const faint = clamp01((performance.now() - boot - 1400) / 3800) * .38;

      /* Hero 退場 */
      const hOut = seg(.015, .07)(p);
      hero.style.opacity = 1 - hOut;
      hero.style.transform = `translateY(${-hOut * 8 * M}vh)`;
      hero.style.pointerEvents = hOut > .5 ? 'none' : 'auto';

      /* 霧散：兩岸霧向外讓開 */
      const part = ease(seg(.05, .22)(p));
      mistL.style.transform = `translateX(${-part * 34 * M}vw)`;
      mistR.style.transform = `translateX(${ part * 34 * M}vw)`;
      mistL.style.opacity = mistR.style.opacity = .96 - part * .55;
      const fmist = ease(seg(.30, .48)(p));                 // 前景霧在水段前退去
      mistF.style.transform = `translateY(${fmist * 30 * M}vh)`;
      mistF.style.opacity = .85 - fmist * .55;

      /* 山：浮現 → 層巒散開 → 鏡頭下沉看水 */
      const spread = ease(seg(.22, .42)(p));
      const sink   = ease(seg(.42, .60)(p));
      for (const m of mounts) {
        const show = ease(seg(.06 + m.d * .07, .17 + m.d * .07)(p));
        const ty = (1 - show) * m.d * 16            // 自霧中升起
                 - spread * m.d * 9                  // 層巒後退散開
                 - sink   * m.d * 24                 // 下沉至水畔
                 - p * m.d * 4;                      // 全程基礎視差
        const tx = spread * (m.i % 2 ? 1 : -1) * m.d * 3.5;
        const sc = 1 + (spread * .10 + sink * .06) * m.d;
        m.el.style.opacity = m.d <= .35 ? Math.max(show, faint) : show;
        m.el.style.transform = `translate(${tx * M}vw, ${ty * M}vh) scale(${1 + (sc - 1) * M})`;
      }

      /* 飛鳥 */
      birds.style.opacity = seg(.24, .29)(p) * (1 - seg(.40, .45)(p));

      /* 水 */
      const wIn = ease(seg(.42, .52)(p));
      water.style.opacity = wIn * (1 - seg(.93, .98)(p) * .4);
      water.style.transform = `translateY(${(1 - wIn) * 14 * M}vh)`;
      waterOn = wIn > .08 && p < .95;

      /* 橋：自遠處迎來，再被走過 */
      const bT = ease(seg(.56, .76)(p));
      bridge.style.opacity = seg(.56, .61)(p) * (1 - seg(.73, .77)(p));
      bridge.style.transform =
        `translate(${lerp(38, -58, bT) * M}vw, ${lerp(4, 16, bT) * M}vh) scale(${lerp(.55, 1.85, reduced ? .35 : bT)})`;

      /* 夜與月 */
      night.style.opacity = ease(seg(.72, .86)(p)) * .94;
      moon.style.opacity  = seg(.75, .81)(p);
      moon.style.transform = `translateY(${lerp(26, -4, ease(seg(.73, .88)(p))) * M}vh)`;
      stars.style.opacity = seg(.79, .89)(p) * .9;
      bamboos.forEach((b) => { b.style.opacity = seg(.77, .85)(p); });

      /* 文案 */
      for (const c of captions) {
        const o = seg(c.a, c.b)(p) * (1 - seg(c.c, c.d)(p));
        c.el.style.opacity = o;
        const base = c.el.id === 'cap-qiao' ? 'translateX(-50%) ' : '';
        c.el.style.transform = base + `translateY(${(1 - seg(c.a, c.b)(p)) * 3 * M}vh)`;
      }
    }

    let ticking = false;
    on(window, 'scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; if (!disposed) update(); }); }
    }, { passive: true });
    on(window, 'resize', () => { vh = innerHeight; sizeCanvas(); update(); });
    update();
    /* 開卷的前幾秒持續重繪，讓遠山不靠滾動也能浮現 */
    (function bootLoop() {
      if (disposed) return;
      if (performance.now() - boot < 7000) { update(); requestAnimationFrame(bootLoop); }
    })();

    /* CTA：開始 → 滑入霧起 */
    on($('#begin'), 'click', () => {
      const target = (journey.scrollHeight - vh) * .14;
      scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
    });

    /* =================== RiverScene · canvas 漣漪 =================== */
    const ctx = canvas.getContext('2d');
    let dpr = 1, ripples = [], tick = 0;
    function sizeCanvas() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width  = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    }
    sizeCanvas();

    function spawn(x, y, big) {
      if (ripples.length > 28) ripples.shift();
      ripples.push({ x, y, r: big ? 8 : 3, v: big ? 1.7 : 1.15, a: big ? .42 : .3 });
    }

    let lastSpawn = 0;
    function pointerRipple(e) {
      if (!waterOn || reduced) return;
      const now = performance.now();
      if (now - lastSpawn < 70) return;
      const rect = canvas.getBoundingClientRect();
      const pt = e.touches ? e.touches[0] : e;
      const x = (pt.clientX - rect.left) * dpr, y = (pt.clientY - rect.top) * dpr;
      if (y < 0 || y > canvas.height) return;
      lastSpawn = now;
      spawn(x, y, false);
    }
    on(window, 'pointermove', pointerRipple, { passive: true });
    on(window, 'touchmove', pointerRipple, { passive: true });

    function drawWater() {
      if (disposed) return;
      requestAnimationFrame(drawWater);
      if (!waterOn || reduced) { if (ripples.length) { ripples = []; ctx.clearRect(0, 0, canvas.width, canvas.height); } return; }
      tick++;
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      /* 水光：緩慢漂移的微波線 */
      ctx.strokeStyle = 'rgba(38,45,51,.06)';
      ctx.lineWidth = dpr;
      for (let i = 0; i < 5; i++) {
        const y0 = h * (.2 + i * .17);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 14 * dpr) {
          const y = y0 + Math.sin(x / (90 * dpr) + tick / 90 + i * 1.7) * 3.2 * dpr;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      /* 漣漪：扁橢圓雙環 */
      for (const rp of ripples) {
        for (const k of [1, .58]) {
          ctx.beginPath();
          ctx.ellipse(rp.x, rp.y, rp.r * k * dpr, rp.r * k * .3 * dpr, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(38,45,51,${rp.a * k})`;
          ctx.lineWidth = 1.2 * dpr;
          ctx.stroke();
        }
        rp.r += rp.v; rp.a *= .965;
      }
      ripples = ripples.filter((rp) => rp.a > .015);

      /* 無人撫水時，偶有雨點自生 */
      if (tick % 170 === 0) spawn(Math.random() * w, h * (.25 + Math.random() * .6), true);
    }
    drawWater();

    /* =================== SealStamp =================== */
    const ending = $('#ending');
    const sealIO = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) ending.classList.add('stamped');
    }, { threshold: .45 });
    sealIO.observe($('#seal-wrap'));

    on($('#again'), 'click', () => {
      scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      setTimeout(() => ending.classList.remove('stamped'), 1200);   // 下次抵達可重新落印
    });

    return () => {
      disposed = true;
      sealIO.disconnect();
      for (const [t, type, fn, opts] of listeners) t.removeEventListener(type, fn, opts);
    };
  }, []);

  return (
    <div className="ruhua-root">
      {/* ============ LivingScrollPage：一卷長畫 ============ */}
      <div id="journey">
        <div id="stage">

          {/* 月夜（MoonScene 底層星空，僅夜段可見） */}
          <div className="layer" id="stars" style={{ zIndex: 15 }}>
            <i style={{ left: '12%', top: '14%' }} /><i style={{ left: '26%', top: '9%', animationDelay: '-2s' }} />
            <i style={{ left: '44%', top: '18%', animationDelay: '-1s' }} /><i style={{ left: '58%', top: '7%', animationDelay: '-3s' }} />
            <i style={{ left: '71%', top: '22%', animationDelay: '-1.6s' }} /><i style={{ left: '84%', top: '12%', animationDelay: '-2.7s' }} />
            <i style={{ left: '35%', top: '26%', animationDelay: '-.8s' }} /><i style={{ left: '92%', top: '30%', animationDelay: '-2.2s' }} />
          </div>

          {/* 遠山 → 近山（MountainLayer ×5，data-depth 控制視差） */}
          <div className="mountain m1 layer" data-depth=".16" style={{ zIndex: 2 }}>
            {inkLayer('/assets/painting/far.webp', true)}
            <svg viewBox="0 0 1440 460" preserveAspectRatio="xMidYMax meet">
              <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--stone-1)" /><stop offset=".75" stopColor="var(--stone-1)" stopOpacity=".5" /><stop offset="1" stopColor="var(--stone-1)" stopOpacity="0" />
              </linearGradient></defs>
              <path fill="url(#g1)" d="M0 460 L0 300 Q90 210 170 268 Q250 140 350 232 Q430 170 510 240 Q620 110 740 226 Q830 160 920 234 Q1030 120 1150 230 Q1250 180 1340 244 L1440 210 L1440 460 Z" />
            </svg>
          </div>
          <div className="mountain m2 layer svg-only" data-depth=".32" style={{ zIndex: 3 }}>
            <svg viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax meet">
              <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--stone-2)" /><stop offset=".8" stopColor="var(--stone-2)" stopOpacity=".4" /><stop offset="1" stopColor="var(--stone-2)" stopOpacity="0" />
              </linearGradient></defs>
              <path fill="url(#g2)" d="M0 420 L0 290 Q110 170 210 250 Q290 120 400 224 Q500 160 590 232 Q700 90 830 220 Q930 150 1030 226 Q1140 120 1260 224 L1360 190 L1440 240 L1440 420 Z" />
            </svg>
          </div>
          <div className="mountain layer" data-depth=".52" style={{ zIndex: 4 }}>
            {inkLayer('/assets/painting/mid.webp')}
            <svg viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax meet">
              <defs><linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--stone-3)" /><stop offset=".82" stopColor="var(--stone-3)" stopOpacity=".35" /><stop offset="1" stopColor="var(--stone-3)" stopOpacity="0" />
              </linearGradient></defs>
              <path fill="url(#g3)" d="M0 400 L0 280 Q130 140 250 240 Q340 100 460 216 Q560 150 660 224 Q780 70 910 212 Q1010 140 1120 220 Q1230 130 1330 224 L1440 200 L1440 400 Z" />
              <path d="M250 240 Q280 300 340 330 M910 212 Q940 280 1000 312" stroke="var(--stone-4)" strokeWidth="3" fill="none" opacity=".4" />
            </svg>
          </div>
          <div className="mountain layer svg-only" data-depth=".74" style={{ zIndex: 6 }}>
            <svg viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax meet">
              <defs><linearGradient id="g4" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--stone-4)" /><stop offset=".85" stopColor="var(--stone-4)" stopOpacity=".3" /><stop offset="1" stopColor="var(--stone-4)" stopOpacity="0" />
              </linearGradient></defs>
              <path fill="url(#g4)" d="M0 360 L0 250 Q150 110 290 220 Q390 80 520 200 Q640 130 750 206 Q880 50 1020 196 Q1130 130 1250 206 L1360 170 L1440 220 L1440 360 Z" />
              <path d="M520 200 Q495 260 440 292 M1020 196 Q1050 256 1110 286" stroke="var(--stone-5)" strokeWidth="3.5" fill="none" opacity=".45" />
            </svg>
          </div>
          <div className="mountain layer" data-depth="1" style={{ zIndex: 12 }}>
            {inkLayer('/assets/painting/near.webp')}
            <svg viewBox="0 0 1440 240" preserveAspectRatio="xMidYMax meet">
              <defs><linearGradient id="g5" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--stone-5)" /><stop offset=".9" stopColor="var(--stone-5)" stopOpacity=".4" /><stop offset="1" stopColor="var(--stone-5)" stopOpacity="0" />
              </linearGradient></defs>
              <path fill="url(#g5)" d="M0 240 L0 170 Q120 60 250 150 Q330 100 420 152 L520 120 Q640 70 760 142 Q880 100 990 148 Q1110 60 1240 144 L1440 110 L1440 240 Z" />
              {/* 山腰小亭 */}
              <g fill="var(--stone-5)" opacity=".9">
                <path d="M1216 96 l22 -14 l22 14 l-6 0 l0 18 l-32 0 l0 -18 Z" />
                <rect x="1224" y="114" width="4" height="10" /><rect x="1250" y="114" width="4" height="10" />
              </g>
            </svg>
          </div>

          {/* 飛鳥 */}
          <div className="layer" id="birds" style={{ zIndex: 7 }}>
            <div className="bird b1"><svg viewBox="0 0 40 14" fill="none"><path d="M2 10 Q11 1 20 9 Q29 1 38 10" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" /></svg></div>
            <div className="bird b2"><svg viewBox="0 0 40 14" fill="none"><path d="M2 10 Q11 2 20 9 Q29 2 38 10" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" /></svg></div>
            <div className="bird b3"><svg viewBox="0 0 40 14" fill="none"><path d="M2 10 Q11 2 20 9 Q29 2 38 10" stroke="var(--ink)" strokeWidth="2.8" strokeLinecap="round" /></svg></div>
          </div>

          {/* 水（RiverScene：CSS 水面 + canvas 漣漪） */}
          <div id="water" style={{ zIndex: 8 }}>
            <div className="surface" />
            <canvas id="ripples" />
          </div>

          {/* 橋（BridgeScene） */}
          <div id="bridge" className="layer" style={{ zIndex: 10 }}>
            {inkLayer('/assets/painting/bridge.webp')}
            <svg viewBox="0 0 900 260" fill="none">
              {/* 橋身 */}
              <path d="M30 200 Q450 30 870 200 L870 216 Q450 56 30 216 Z" fill="var(--stone-5)" />
              <path d="M120 188 Q450 64 780 188 Q450 88 120 188 Z" fill="var(--paper)" opacity=".14" />
              {/* 欄杆 */}
              <g stroke="var(--stone-5)" strokeWidth="7" strokeLinecap="round">
                <path d="M90 196 L90 156" /><path d="M230 154 L230 116" /><path d="M380 124 L380 88" />
                <path d="M520 122 L520 86" /><path d="M668 150 L668 112" /><path d="M810 194 L810 154" />
              </g>
              <path d="M84 152 Q450 -8 816 150" stroke="var(--stone-5)" strokeWidth="9" fill="none" strokeLinecap="round" />
              {/* 行人 */}
              <g fill="var(--stone-5)">
                <ellipse cx="430" cy="78" rx="7.5" ry="11" />
                <circle cx="430" cy="62" r="5" />
                <path d="M421 60 Q430 52 440 60 L430 65 Z" />
                <path d="M436 70 L452 52" stroke="var(--stone-5)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              </g>
              {/* 倒影 */}
              <path d="M30 226 Q450 110 870 226" stroke="var(--stone-4)" strokeWidth="5" opacity=".22" fill="none" />
            </svg>
          </div>

          {/* 月與夜（MoonScene） */}
          <div id="night" className="layer" style={{ zIndex: 14 }} />
          <div id="moon" style={{ zIndex: 15 }} />
          <div className="bamboo bl" style={{ zIndex: 16 }}>
            {inkLayer('/assets/painting/bamboo.webp')}
            <svg viewBox="0 0 220 560" fill="none"><g className="sway">
              <path d="M60 560 C58 420 64 260 84 90" stroke="#141b18" strokeWidth="10" strokeLinecap="round" />
              <path d="M118 560 C120 430 112 300 96 150" stroke="#141b18" strokeWidth="7" strokeLinecap="round" />
              <g fill="#141b18">
                <path d="M84 96 q-44 -10 -70 16 q40 6 70 -16 Z" /><path d="M86 92 q10 -44 52 -56 q-8 42 -52 56 Z" />
                <path d="M80 170 q-40 -4 -62 22 q38 4 62 -22 Z" /><path d="M98 152 q40 -10 62 12 q-36 10 -62 -12 Z" />
                <path d="M70 280 q-36 -2 -54 22 q34 2 54 -22 Z" /><path d="M104 250 q34 -14 58 4 q-30 14 -58 -4 Z" />
              </g>
              <g stroke="#141b18" strokeWidth="3" opacity=".7"><path d="M56 470 l10 -2 M62 330 l12 -2 M74 200 l12 -3 M114 460 l-12 -2 M108 320 l-12 -3" /></g>
            </g></svg>
          </div>
          <div className="bamboo br" style={{ zIndex: 16 }}>
            {inkLayer('/assets/painting/bamboo.webp')}
            <svg viewBox="0 0 220 560" fill="none"><g className="sway">
              <path d="M70 560 C66 410 76 250 96 110" stroke="#141b18" strokeWidth="9" strokeLinecap="round" />
              <g fill="#141b18">
                <path d="M96 116 q-42 -12 -68 12 q38 8 68 -12 Z" /><path d="M98 110 q14 -40 54 -48 q-10 40 -54 48 Z" />
                <path d="M88 210 q-38 -6 -58 18 q34 6 58 -18 Z" /><path d="M104 190 q38 -12 60 8 q-34 12 -60 -8 Z" />
              </g>
              <g stroke="#141b18" strokeWidth="3" opacity=".7"><path d="M66 450 l11 -2 M74 300 l12 -3" /></g>
            </g></svg>
          </div>

          {/* 霧（MistLayer ×3：左右兩岸 + 前景） */}
          <div className="layer" id="mist-l" style={{ zIndex: 5 }}><div className="mist l"><div className="puff" /></div></div>
          <div className="layer" id="mist-r" style={{ zIndex: 9 }}><div className="mist r"><div className="puff" /></div></div>
          <div className="layer" id="mist-f" style={{ zIndex: 13 }}><div className="mist front"><div className="puff" /></div></div>

          {/* 文案（MinimalChineseText） */}
          <div className="caption" id="cap-wu"><h2>霧起</h2><p>遠山浮現。</p></div>
          <div className="caption" id="cap-shan"><h2>山現</h2><p>層巒隨你後退。</p></div>
          <div className="caption" id="cap-shui"><h2>水動</h2><p>指尖掠過，漣漪自生。</p></div>
          <div className="caption" id="cap-qiao"><h2>橋過</h2><p>一步入深處。</p></div>
          <div className="caption light" id="cap-yue"><h2>月升</h2><p>世界安靜下來。</p></div>

          {/* HeroScene */}
          <div id="hero-ru">
            <h1>入畫</h1>
            <p className="sub">山水隨行</p>
            <button className="cta" id="begin" aria-label="開始入畫">開始</button>
          </div>

        </div>
      </div>

      {/* ============ 印落（SealStamp） ============ */}
      <section id="ending">
        <h2>印落</h2>
        <p className="line">你來過，畫記得。</p>
        <div id="seal-wrap" aria-label="印：入畫">
          <div id="seal-halo" />
          <svg id="seal" viewBox="0 0 150 150">
            <defs>
              <filter id="rough" x="-8%" y="-8%" width="116%" height="116%">
                <feTurbulence type="fractalNoise" baseFrequency=".08" numOctaves="3" seed="7" result="n" />
                <feDisplacementMap in="SourceGraphic" in2="n" scale="5.5" />
              </filter>
            </defs>
            <g filter="url(#rough)">
              <rect x="10" y="10" width="130" height="130" rx="14" fill="var(--seal)" />
              <text x="75" y="64" textAnchor="middle" fontSize="52" fontWeight="900" fontFamily="'Noto Serif TC',serif" fill="var(--paper)">入</text>
              <text x="75" y="122" textAnchor="middle" fontSize="52" fontWeight="900" fontFamily="'Noto Serif TC',serif" fill="var(--paper)">畫</text>
            </g>
          </svg>
        </div>
        <button id="again">再入畫</button>
        <p className="colophon">入畫 · 山水隨行</p>
      </section>
    </div>
  );
}
