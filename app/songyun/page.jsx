'use client';

import { useEffect } from 'react';
import './songyun.css';

function Seal({ size }) {
  return (
    <svg className="seal" style={{ width: size, height: size }} viewBox="0 0 64 64" aria-label="印：宋韻">
      <rect x="3" y="3" width="58" height="58" rx="6" fill="#b03a2e" />
      <text x="32" y="27" textAnchor="middle" fontSize="22" fill="#f4efe4" fontFamily="serif" fontWeight="700">宋</text>
      <text x="32" y="52" textAnchor="middle" fontSize="22" fill="#f4efe4" fontFamily="serif" fontWeight="700">韻</text>
    </svg>
  );
}

export default function SongyunPage() {
  useEffect(() => {
    /* 進場：IntersectionObserver */
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
      }
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.songyun-root .reveal').forEach((el) => io.observe(el));

    /* 千里江山：視差 */
    const pano = document.getElementById('panorama');
    const layers = pano.querySelectorAll('.layer');
    let ticking = false;
    function parallax() {
      ticking = false;
      const r = pano.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (innerHeight - r.top) / (innerHeight + r.height); // 0..1
      for (const l of layers) {
        const s = parseFloat(l.dataset.speed);
        l.style.transform = `translateY(${(1 - p) * 90 * s}px) translateX(${(p - .5) * -40 * s}px)`;
      }
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(parallax); } };
    addEventListener('scroll', onScroll, { passive: true });
    parallax();

    return () => {
      io.disconnect();
      removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="songyun-root">
      {/* ================= 序 ================= */}
      <section id="hero-song">
        <div className="mist" />
        <div className="inner">
          <h1 className="reveal">宋韻</h1>
          <div className="inscription reveal d1">
            <p className="sub">中國美學的天花板，不在金碧，而在收斂。</p>
            <Seal size={42} />
          </div>
        </div>
        <div className="scroll-hint">徐徐展卷<div className="rule" /></div>
      </section>

      {/* ================= 壹 · 留白 ================= */}
      <section id="baii" className="chapter">
        <div className="chapter-head reveal">
          <h2>留白</h2>
          <p className="lede">壹 —— 不畫，是更高級的畫。</p>
        </div>
        <p className="prose reveal d1">馬遠畫《寒江獨釣》，一葉扁舟、一個漁翁，四周全是空無。可沒有人覺得那是空白——那是水，是寒，是天地之大與一人之小。<b>宋人最懂：把九成留給想像，剩下一成才落筆。</b></p>
        <div className="stage">
          <svg className="boat reveal d2" viewBox="0 0 240 90" fill="none" aria-label="寒江獨釣">
            {/* 舟 */}
            <path d="M14 58 Q120 78 226 54 Q200 70 120 71 Q42 71 14 58 Z" fill="#2b333e" />
            <path d="M30 58 Q120 72 212 55" stroke="#2b333e" strokeWidth="1.6" opacity=".5" />
            {/* 漁翁 */}
            <ellipse cx="104" cy="44" rx="9" ry="11" fill="#2b333e" />
            <circle cx="104" cy="29" r="5.5" fill="#2b333e" />
            <path d="M96 26 Q104 19 113 26 L104 31 Z" fill="#2b333e" />
            {/* 釣竿與線 */}
            <path d="M110 38 L168 16" stroke="#2b333e" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M168 16 L171 52" stroke="#2b333e" strokeWidth=".9" opacity=".75" />
            {/* 水紋 */}
            <path d="M168 56 q4 -2.5 8 0 q-4 2.5 -8 0 Z" stroke="#2b333e" strokeWidth=".9" opacity=".5" />
            <path d="M0 80 q14 -3 28 0" stroke="#2b333e" strokeWidth="1" opacity=".22" />
            <path d="M196 82 q14 -3 28 0" stroke="#2b333e" strokeWidth="1" opacity=".22" />
          </svg>
          <div className="verse reveal d3">
            孤舟蓑笠翁<br />獨釣寒江雪
            <small>柳宗元 · 江雪 ／ 馬遠 · 寒江獨釣圖</small>
          </div>
        </div>
      </section>

      {/* ================= 貳 · 天青 ================= */}
      <section id="tianqing">
        <div className="chapter">
          <div className="chapter-head reveal">
            <h2>天青</h2>
            <p className="lede">貳 —— 雨過天青雲破處，這般顏色做將來。</p>
          </div>
          <p className="prose reveal d1">傳說宋徽宗夢見雨後初晴的天空，醒來命汝窯燒出那個顏色。汝瓷存世不足百件，釉面有蟹爪般的細小開片，<b>青不豔、灰不暗，是介於一切顏色之間的顏色</b>。後世燒了一千年，再也沒燒回來。</p>

          <div className="bowl-wrap">
            <svg className="reveal d2" viewBox="0 0 440 300" fill="none" aria-label="汝窯天青釉碗">
              <defs>
                <radialGradient id="glaze" cx="50%" cy="32%" r="85%">
                  <stop offset="0%" stopColor="#cfdedb" />
                  <stop offset="55%" stopColor="#9db8b6" />
                  <stop offset="100%" stopColor="#7d9a98" />
                </radialGradient>
                <linearGradient id="inner" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e9f1ef" />
                  <stop offset="100%" stopColor="#b9cdca" />
                </linearGradient>
              </defs>
              {/* 碗身 */}
              <path d="M52 96 Q220 122 388 96 Q382 206 290 240 Q252 254 220 254 Q188 254 150 240 Q58 206 52 96 Z" fill="url(#glaze)" />
              {/* 口沿與內壁 */}
              <ellipse cx="220" cy="96" rx="168" ry="26" fill="url(#inner)" />
              <ellipse cx="220" cy="96" rx="168" ry="26" fill="none" stroke="#7d9a98" strokeWidth="1.4" opacity=".7" />
              {/* 開片（蟹爪紋） */}
              <g stroke="#5e7a78" strokeWidth=".55" opacity=".4">
                <path d="M120 150 l26 14 l-7 22 m7 -22 l24 -6" />
                <path d="M210 170 l18 17 l20 -9 m-20 9 l-4 24" />
                <path d="M298 142 l-19 18 l8 19 m-8 -19 l-26 3" />
                <path d="M158 200 l21 9 l14 -12" />
                <path d="M256 214 l16 -12 l17 7" />
                <path d="M100 124 l18 11 l-3 16" />
                <path d="M330 120 l-15 14 l4 15" />
              </g>
              {/* 高光 */}
              <path d="M96 130 Q116 186 168 220" stroke="#eaf4f2" strokeWidth="9" strokeLinecap="round" opacity=".5" />
              {/* 圈足 */}
              <path d="M186 252 Q220 258 254 252 L250 268 Q220 273 190 268 Z" fill="#8aa5a2" />
              <ellipse cx="220" cy="282" rx="96" ry="9" fill="#2b333e" opacity=".08" />
            </svg>
          </div>

          <div className="palette">
            <div className="swatch light reveal" style={{ background: '#9db8b6' }}><span>天青</span><i>#9DB8B6</i></div>
            <div className="swatch light reveal d1" style={{ background: '#e3eeec' }}><span>月白</span><i>#E3EEEC</i></div>
            <div className="swatch dark reveal d2" style={{ background: '#1f5673' }}><span>石青</span><i>#1F5673</i></div>
            <div className="swatch dark reveal d3" style={{ background: '#3f7d6c' }}><span>石綠</span><i>#3F7D6C</i></div>
            <div className="swatch dark reveal d1" style={{ background: '#9d2933' }}><span>胭脂</span><i>#9D2933</i></div>
            <div className="swatch light reveal d2" style={{ background: '#d9a727' }}><span>緗色</span><i>#D9A727</i></div>
            <div className="swatch dark reveal d3" style={{ background: '#2b333e' }}><span>黛</span><i>#2B333E</i></div>
          </div>
        </div>
      </section>

      {/* ================= 參 · 青綠 ================= */}
      <section id="qinglv">
        <div className="intro">
          <div className="chapter-head reveal">
            <h2>青綠</h2>
            <p className="lede">參 —— 十八歲少年的千里江山。</p>
          </div>
          <p className="prose reveal d1">北宋政和三年，十八歲的王希孟用半年畫完近十二米的《千里江山圖》，以石青、石綠層層罩染，山是寶石的山，水是綢緞的水。<b>這是中國青綠山水的巔峰，之後再無人到達。</b>畫完不久，他便從歷史裡消失了。</p>
        </div>

        <div id="panorama">
          <div className="caption reveal">
            <h3>千里江山</h3>
            <p>王希孟 · 北宋 · 絹本設色</p>
          </div>
          <div className="haze" />

          {/* 遠山 */}
          <div className="layer" data-speed="0.12" style={{ zIndex: 1, opacity: .55 }}>
            <svg viewBox="0 0 1200 280" preserveAspectRatio="none">
              <path d="M0 280 L0 170 Q60 120 110 158 Q150 90 210 132 Q260 70 320 124 Q380 88 430 140 Q500 60 570 130 Q630 96 690 142 Q750 78 820 134 Q880 100 940 146 Q1000 84 1070 138 Q1130 110 1200 150 L1200 280 Z" fill="#9dc0ae" />
            </svg>
          </div>
          {/* 中山 */}
          <div className="layer" data-speed="0.3" style={{ zIndex: 2, opacity: .85 }}>
            <svg viewBox="0 0 1200 300" preserveAspectRatio="none">
              <path d="M0 300 L0 200 Q80 120 150 178 Q200 70 280 150 Q340 100 400 162 Q480 50 570 148 Q640 104 700 160 Q780 64 870 152 Q930 110 990 164 Q1060 90 1140 158 L1200 180 L1200 300 Z" fill="#5e9b80" />
              <path d="M280 150 Q300 190 340 212 M570 148 Q590 196 640 220 M870 152 Q890 198 936 218" stroke="#3f7d6c" strokeWidth="3" fill="none" opacity=".5" />
            </svg>
          </div>
          {/* 近山 */}
          <div className="layer" data-speed="0.55" style={{ zIndex: 3 }}>
            <svg viewBox="0 0 1200 260" preserveAspectRatio="none">
              <path d="M0 260 L0 190 Q90 90 180 168 Q240 60 330 150 Q400 96 470 158 Q560 40 660 146 Q730 100 800 156 Q880 56 980 150 Q1050 104 1120 160 L1200 130 L1200 260 Z" fill="#2e6e5e" />
              <path d="M180 168 Q205 210 250 232 M660 146 Q685 200 740 226 M980 150 Q1002 196 1050 220" stroke="#1f5673" strokeWidth="3.5" fill="none" opacity=".55" />
              <path d="M330 150 Q310 200 268 226 M800 156 Q778 204 736 228" stroke="#1f5673" strokeWidth="3" fill="none" opacity=".4" />
            </svg>
          </div>
          {/* 水與小舟 */}
          <div className="layer" data-speed="0.8" style={{ zIndex: 5 }}>
            <svg viewBox="0 0 1200 90" preserveAspectRatio="none">
              <rect x="0" y="34" width="1200" height="56" fill="#bcd6c6" />
              <g stroke="#7fae96" strokeWidth="1.4" opacity=".7">
                <path d="M80 56 q22 -5 44 0 M520 66 q22 -5 44 0 M900 58 q22 -5 44 0 M260 74 q18 -4 36 0 M1080 72 q18 -4 36 0" />
              </g>
              <g fill="#2b333e">
                <path d="M340 52 q26 7 52 0 q-12 9 -26 9 q-14 0 -26 -9 Z" />
                <rect x="363" y="40" width="3" height="13" rx="1.5" />
                <path d="M760 64 q22 6 44 0 q-10 8 -22 8 q-12 0 -22 -8 Z" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* ================= 肆 · 風骨 ================= */}
      <section id="fenggu" className="chapter">
        <div className="chapter-head reveal" style={{ justifyContent: 'center' }}>
          <h2>風骨</h2>
          <p className="lede">肆 —— 字如其人，瘦硬通神。</p>
        </div>
        <p className="prose reveal d1" style={{ textAlign: 'center', margin: '0 auto' }}>宋徽宗自創瘦金體，鐵畫銀鉤、鋒芒畢露，亡了國，字卻立了千年。宋人的審美自有風骨：梅要疏、竹要瘦、石要醜，<b>寧可清減，不肯臃腫</b>。</p>
        <div className="couplet">
          <div className="line reveal d2">疏影橫斜水清淺</div>
          <div className="line reveal d3">暗香浮動月黃昏</div>
        </div>
        <p className="attribution reveal d4">—— 林逋 ·《山園小梅》· <em>梅妻鶴子</em></p>
      </section>

      {/* ================= 伍 · 四藝 ================= */}
      <section id="siyi" className="chapter">
        <div className="chapter-head reveal">
          <h2>四藝</h2>
          <p className="lede">伍 —— 宋人的日常，本身就是作品。</p>
        </div>
        <p className="prose reveal d1">焚香、點茶、掛畫、插花，被稱為「宋人四藝」。不為待客，不為炫耀，只為把尋常的一天過成可以凝視的東西。<b>生活美學這個詞，宋人一千年前就做完了示範。</b></p>
        <div className="arts">
          <div className="art reveal">
            <h3 data-roman="INCENSE">焚香</h3>
            <p>一縷沉水香，靜室自聞。香不在濃，在若有似無之間。</p>
          </div>
          <div className="art reveal d1">
            <h3 data-roman="TEA">點茶</h3>
            <p>碾茶為末，注湯擊拂，沫餑如雪。後來東渡，成了日本的抹茶道。</p>
          </div>
          <div className="art reveal d2">
            <h3 data-roman="PAINTING">掛畫</h3>
            <p>素壁只掛一軸，看倦了便換。牆上的留白，與畫同樣要緊。</p>
          </div>
          <div className="art reveal d3">
            <h3 data-roman="FLOWERS">插花</h3>
            <p>折枝入膽瓶，一枝便足。花求姿態，不求繁盛。</p>
          </div>
        </div>
      </section>

      {/* ================= 跋 ================= */}
      <section id="ba">
        <p className="closing reveal">所謂天花板，不是堆到最滿，<br />而是減到不能再減，<b>仍然動人</b>。</p>
        <div className="bigseal reveal d1"><Seal size={86} /></div>
        <p className="colophon reveal d2">丙午年夏 · 觀宋而記 · 是為跋</p>
      </section>
    </div>
  );
}
