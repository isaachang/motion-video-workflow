// =====================================================================
// motion-kit · engine/core.js
// 通用时间轴引擎：一切画面都是 t（秒）的纯函数，seek(t) 可任意跳帧，
// 由 tools/render.py 逐帧截图。与题材无关，不含任何品牌素材。
// 依赖：config.js（window.CONFIG / THEME / BEATS）先加载。
// =====================================================================
const W = 1920, H = 1080;
const CFG = window.CONFIG || {};
const TH = window.THEME || {};
const VMODE = !!window.VMODE;              // 9:16 模式：只看到 x∈[420,1500] 的正中 1080×1080
const SAFE = VMODE ? { x0: 420, x1: 1500 } : { x0: 0, x1: 1920 };
const stage = document.getElementById('stage');
const A = 'a/';                             // 素材目录
// THEME 的颜色写入 CSS 变量：{bg,bg2,ink,sub,accent,accent2,hi,good,bad,card,line}
for (const [k, v] of Object.entries(TH)) if (typeof v === 'string') document.documentElement.style.setProperty('--' + k, v);

// ---------- math / easing ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const E = {
  lin: x => x,
  inQ: x => x * x, outQ: x => 1 - (1 - x) * (1 - x), ioQ: x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
  inC: x => x * x * x, outC: x => 1 - Math.pow(1 - x, 3), ioC: x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
  outQt: x => 1 - Math.pow(1 - x, 4), ioQt: x => x < .5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2,
  outQn: x => 1 - Math.pow(1 - x, 5),
  inX: x => x === 0 ? 0 : Math.pow(2, 10 * x - 10), outX: x => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
  ioX: x => x === 0 ? 0 : x === 1 ? 1 : x < .5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
  outB: x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
  outB2: x => { const c1 = 2.6, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
  inB: x => { const c1 = 1.70158, c3 = c1 + 1; return c3 * x * x * x - c1 * x * x; },
  ioS: x => -(Math.cos(Math.PI * x) - 1) / 2, outS: x => Math.sin(x * Math.PI / 2),
  outEl: x => x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * (2 * Math.PI) / 3) + 1,
};
const P = (t, a, b, e = E.ioC) => e(clamp((t - a) / (b - a)));           // 进度 0→1
function SP(x, f = 1.6, d = 6) { if (x <= 0) return 0; return 1 - Math.exp(-d * x) * Math.cos(f * 2 * Math.PI * x); } // 弹簧
const bump = (t, a, b, c, e1 = E.outC, e2 = E.inC) => t < b ? P(t, a, b, e1) : 1 - P(t, b, c, e2); // 0→1→0
const inOut = (t, a, b, fi = .3, fo = .3) => Math.min(P(t, a, a + fi, E.outC), 1 - P(t, b - fo, b, E.inC)); // 进场停留退场
function rng(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = s * 16807 % 2147483647, (s - 1) / 2147483646); }
function noise1(x, seed = 1) { const i = Math.floor(x), f = x - i; const h = n => { const s = Math.sin((n + seed * 131.7) * 127.1) * 43758.5453; return s - Math.floor(s); }; const u = f * f * (3 - 2 * f); return lerp(h(i), h(i + 1), u) * 2 - 1; }

// ---------- DOM helpers ----------
function el(tag, cls, html, parent, style) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  if (style) Object.assign(e.style, style);
  if (parent) parent.appendChild(e);
  return e;
}
function tf(o) {
  let s = '';
  if (o.px != null || o.py != null) s += `translate(${-(o.px || 0)}px,${-(o.py || 0)}px) `;
  if (o.x || o.y || o.z) s += `translate3d(${(o.x || 0).toFixed(2)}px,${(o.y || 0).toFixed(2)}px,${(o.z || 0).toFixed(2)}px) `;
  if (o.rx) s += `rotateX(${o.rx.toFixed(3)}deg) `;
  if (o.ry) s += `rotateY(${o.ry.toFixed(3)}deg) `;
  if (o.r) s += `rotate(${o.r.toFixed(3)}deg) `;
  if (o.s != null) s += `scale(${(+o.s).toFixed(4)}) `;
  if (o.sx != null || o.sy != null) s += `scale(${(o.sx ?? 1).toFixed(4)},${(o.sy ?? 1).toFixed(4)}) `;
  return s || 'none';
}
// set(e,{x,y,s,r,rx,ry,o,f,b})  b = blur px
function set(e, o) {
  if (!e) return;
  if ('o' in o) e.style.opacity = clamp(o.o).toFixed(4);
  e.style.transform = tf(o);
  if ('b' in o) e.style.filter = blurF(o.b);
  else if ('f' in o) e.style.filter = o.f || 'none';
}
function show(e, on) { const v = on ? '' : 'none'; if (e.style.display !== v) e.style.display = v; }
const blurF = b => b > 0.05 ? `blur(${b.toFixed(2)}px)` : 'none';
// 绝对定位到中心点：place(e, cx, cy)
// 元素在舞台坐标里的矩形（在 INITS 里调用：此时镜头未变换）→ {x,y,w,h,cx,cy}
function rectOf(e) { if (typeof e === 'string') e = document.querySelector(e); const r = e.getBoundingClientRect(), s = stage.getBoundingClientRect(); return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height, cx: r.left - s.left + r.width / 2, cy: r.top - s.top + r.height / 2 }; }
function place(e, cx, cy) { e.style.left = cx + 'px'; e.style.top = cy + 'px'; e.style.translate = '-50% -50%'; return e; }

// ---------- scenes & timeline ----------
const SCENES = [], OVERLAYS = [], INITS = [];
function Scene(name, t0, t1, z = 0, bg) {
  const e = el('div', 'scene', null, stage);
  e.style.zIndex = z;
  if (bg) e.style.background = bg;
  const s = { name, t0, t1, el: e, upd: () => {} };
  SCENES.push(s);
  return s;
}
let CUR_T = 0;
function seek(t) {
  CUR_T = t;
  for (const s of SCENES) {
    const on = t >= s.t0 && t < s.t1;
    if (on !== s._on) { s.el.style.display = on ? 'block' : 'none'; s._on = on; }
    if (on) s.upd(t, t - s.t0);
  }
  for (const o of OVERLAYS) o(t);
}
window.seek = seek;
// 运动模糊子帧请求 [t0,t1,n]：转场/甩镜区间写进来，渲染器会取 n 个子帧平均
const MB = [];
window.mbSamples = t => { let n = 1; for (const [a, b, k] of MB) if (t >= a && t <= b) n = Math.max(n, k); return n; };

// ---------- beats（tools/beats.py 生成 beats.js → window.BEATS / KICKS） ----------
const BEATS = window.BEATS || [], KICKS = window.KICKS || [];
function beatPulse(t, decay = 7, arr = BEATS) { let best = 0; for (const b of arr) { const d = t - b; if (d >= 0 && d < 1) best = Math.max(best, Math.exp(-decay * d)); } return best; }
// 最近的拍点（用于把切点吸附到节拍）
function snap(t, arr = BEATS) { let best = t, bd = 1e9; for (const b of arr) { const d = Math.abs(b - t); if (d < bd) { bd = d; best = b; } } return best; }

// ---------- 口播时间（tools/asr.py 生成 asr.js → window.ASR） ----------
// say('4万') → 这个词第一个字在配音里的时间（秒）；say('4万', 2) 第 2 次出现；say('4万', 1, true) 最后一个字的时间
// 按听写原文匹配（听写有错字时，用没错的相邻字词来查）；找不到返回 NaN 并在控制台警告
const ASRC = (() => { const cs = [], ts = []; for (const s of window.ASR || []) (s.tokens || []).forEach((tk, i) => { for (const ch of String(tk).replace(/\s+/g, '')) { cs.push(ch.toLowerCase()); ts.push(s.ts[i]); } }); return { s: cs.join(''), ts }; })();
function say(word, n = 1, end = false) {
  const w = String(word).replace(/\s+/g, '').toLowerCase(); let i = -1;
  for (let k = 0; k < n; k++) { i = ASRC.s.indexOf(w, i + 1); if (i < 0) { console.warn('say: 口播里找不到', word, n); return NaN; } }
  return ASRC.ts[end ? i + w.length - 1 : i];
}
const sayEnd = (word, n = 1) => say(word, n, true);

// ---------- camera ----------
// keys: [time, cx, cy, scale, ease?] → [cx,cy,s]，scale 在对数空间插值（推拉匀速感）
function camKeys(keys, t) {
  if (t <= keys[0][0]) return keys[0].slice(1, 4);
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t < b[0]) { const k = (b[4] || E.ioC)(clamp((t - a[0]) / (b[0] - a[0]))); return [lerp(a[1], b[1], k), lerp(a[2], b[2], k), Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), k))]; }
  }
  return keys[keys.length - 1].slice(1, 4);
}
// 把 (cx,cy) 放到画面中心并缩放 s；ex: {x,y,r,s} 叠加抖动等
function applyCam(cam, c, ex = {}) {
  cam.style.transformOrigin = '0 0';
  cam.style.transform = `translate(${(960 - c[2] * c[0] + (ex.x || 0)).toFixed(2)}px,${(540 - c[2] * c[1] + (ex.y || 0)).toFixed(2)}px) rotate(${(ex.r || 0).toFixed(3)}deg) scale(${(c[2] * (ex.s || 1)).toFixed(4)})`;
}
function shake(t, t0, dur, amp, freq = 28, seed = 3) { const k = t - t0; if (k < 0 || k > dur) return { x: 0, y: 0, r: 0 }; const a = amp * Math.pow(1 - k / dur, 2); return { x: noise1(k * freq, seed) * a, y: noise1(k * freq, seed + 7) * a, r: noise1(k * freq * .7, seed + 13) * a * .03 }; }
// 手持呼吸感：给静止镜头加一点漂移，避免“死帧”
function drift(t, amp = 6, seed = 5) { return { x: noise1(t * .35, seed) * amp, y: noise1(t * .3, seed + 3) * amp * .7, r: noise1(t * .25, seed + 9) * .15 }; }

// ---------- images / sprites ----------
const IMG = {}, SPR = {};
function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(src); i.src = src; }); }
// CONFIG.preload = ['logo.svg', ...]；CONFIG.sprites = { name: { dir:'ip', n:96, ext:'png'|'jpg' } }（逐帧图：a/ip/001.png）
async function loadAll() {
  const jobs = [];
  for (const k of CFG.preload || []) jobs.push(loadImg(A + k).then(im => IMG[k] = im).catch(e => console.warn('missing', e)));
  for (const [name, s] of Object.entries(CFG.sprites || {})) { SPR[name] = []; for (let i = 1; i <= s.n; i++) jobs.push(loadImg(`${A}${s.dir}/${String(i).padStart(3, '0')}.${s.ext || 'png'}`).then(im => SPR[name][i - 1] = im)); }
  await Promise.all(jobs);
}
function drawSprite(ctx, name, t, x, y, w, h, crop, fps = 24) {
  const arr = SPR[name]; if (!arr || !arr.length) return;
  const i = ((Math.floor(t * fps) % arr.length) + arr.length) % arr.length;
  const im = arr[i]; const c = crop || [0, 0, im.width, im.height];
  ctx.drawImage(im, c[0], c[1], c[2], c[3], x, y, w, h);
}
// 视频素材逐帧：<video> 必须顺序 seek，不能并行
async function videoFrame(v, t) { if (Math.abs(v.currentTime - t) < 1e-3) return; await new Promise(r => { v.onseeked = r; v.currentTime = t; }); }

// ---------- global FX: grain / vignette / flash ----------
(function grain() {
  if (CFG.grain === 0) return;
  const g = el('canvas', null, null, stage, { position: 'absolute', inset: '0', width: '1920px', height: '1080px', zIndex: 1000, pointerEvents: 'none', mixBlendMode: 'overlay', opacity: CFG.grain ?? .08 });
  g.width = 960; g.height = 540;
  const ctx = g.getContext('2d'); const frames = []; const r = rng(99);
  for (let k = 0; k < 6; k++) { const id = ctx.createImageData(960, 540); for (let i = 0; i < id.data.length; i += 4) { const v = 128 + (r() - .5) * 150; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; } frames.push(id); }
  let last = -1;
  OVERLAYS.push(t => { const f = ((Math.floor(t * 30) % 6) + 6) % 6; if (f !== last) { ctx.putImageData(frames[f], 0, 0); last = f; } });
})();
const FX = el('div', null, null, stage, { position: 'absolute', inset: '0', zIndex: 990, pointerEvents: 'none' });
const FLASH = el('div', null, null, FX, { position: 'absolute', inset: '0', background: '#fff', opacity: 0 });
el('div', null, null, FX, { position: 'absolute', inset: '0', background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, ${TH.vignette || 'rgba(10,20,50,.16)'} 100%)` });
const FLASHES = []; // [t, peak, dur, color]
OVERLAYS.push(t => {
  let o = 0, col = '#fff';
  for (const [t0, pk, d, c] of FLASHES) { if (t >= t0 - 0.04 && t < t0 + d) { const v = t < t0 ? (t - t0 + 0.04) / 0.04 * pk : pk * Math.pow(1 - (t - t0) / d, 2); if (v > o) { o = v; col = c || '#fff'; } } }
  FLASH.style.opacity = o.toFixed(3); FLASH.style.background = col;
});

// RGB 色散（SVG filter）
el('div', null, `<svg width="0" height="0" style="position:absolute"><defs>
<filter id="rgbsplit" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
 <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r"/>
 <feOffset in="r" dx="0" dy="0" result="ro"/>
 <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g"/>
 <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b"/>
 <feOffset in="b" dx="0" dy="0" result="bo"/>
 <feBlend in="ro" in2="g" mode="screen" result="rg"/><feBlend in="rg" in2="bo" mode="screen"/>
</filter></defs></svg>`, stage);
const RGB = { ro: null, bo: null };
function rgbSplit(elm, amt) {
  if (!RGB.ro) { RGB.ro = document.querySelector('#rgbsplit feOffset[result=ro]'); RGB.bo = document.querySelector('#rgbsplit feOffset[result=bo]'); }
  if (amt < 0.3) { if (elm.style.filter.includes('rgbsplit')) elm.style.filter = 'none'; return; }
  RGB.ro.setAttribute('dx', amt.toFixed(2)); RGB.bo.setAttribute('dx', (-amt).toFixed(2));
  elm.style.filter = 'url(#rgbsplit)';
}

// ---------- confetti / particles ----------
function Confetti(parent, seed, n, origin, opt = {}) {
  const c = el('canvas', null, null, parent, { position: 'absolute', inset: '0', width: '1920px', height: '1080px', pointerEvents: 'none' });
  c.width = 1920; c.height = 1080;
  const ctx = c.getContext('2d'); const r = rng(seed);
  const cols = opt.colors || TH.confetti || ['#2F6BFF', '#18A0FF', '#FFC23D', '#FF5A7A', '#34C77B', '#9B6BFF', '#FF8A3D', '#ffffff'];
  const parts = [];
  for (let i = 0; i < n; i++) {
    const a = (opt.dir ?? -Math.PI / 2) + (r() - .5) * (opt.spread ?? 2.2);
    const v = (opt.v ?? 1500) * (0.35 + r() * .8);
    parts.push({ vx: Math.cos(a) * v, vy: Math.sin(a) * v, w: 10 + r() * 14, h: 6 + r() * 10, c: cols[Math.floor(r() * cols.length)], rot: r() * 6, vr: (r() - .5) * 14, flip: r() * 6, vf: 4 + r() * 10, shape: r() < .25 ? 1 : 0, drag: 1.1 + r() * .9, x0: origin[0] + (r() - .5) * (opt.w || 40), y0: origin[1] + (r() - .5) * (opt.h || 40) });
  }
  return {
    el: c, draw(lt) {
      ctx.clearRect(0, 0, 1920, 1080);
      if (lt < 0) return;
      for (const p of parts) {
        const d = p.drag; const e = (1 - Math.exp(-d * lt)) / d;
        const x = p.x0 + p.vx * e + Math.sin(lt * 2 + p.flip) * 20;
        const y = p.y0 + p.vy * e + 520 * lt * lt * .5 + 180 * lt;
        if (y > 1200) continue;
        ctx.save(); ctx.translate(x, y); ctx.rotate(p.rot + p.vr * lt); ctx.scale(1, Math.cos(p.flip + p.vf * lt));
        ctx.fillStyle = p.c; ctx.globalAlpha = clamp(2.8 - lt * .55);
        if (p.shape) { ctx.beginPath(); ctx.arc(0, 0, p.w * .35, 0, 6.283); ctx.fill(); } else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    }
  };
}

// ---------- ready ----------
window.READY = (async () => {
  for (const w of [400, 500, 600, 700, 800]) await document.fonts.load(`${w} 20px Inter`).catch(() => {});
  const cjk = await document.fonts.load('900 20px "Noto Sans CJK SC"', '中文').catch(() => []); await document.fonts.load('400 20px "Noto Sans CJK SC"', '中文').catch(() => {});
  if (!cjk.length) console.error('缺中文字体：a/fonts/NotoSansSC.ttf 不存在，系统也没装 Noto Sans CJK SC，中文会变成宋体。请在项目目录运行 bash tools/setup.sh');
  await loadAll();
  await Promise.all([...document.images].map(i => i.decode().catch(() => console.warn('img', i.src))));
  for (const s of SCENES) s.el.style.display = 'block';      // 全部可见时测量
  for (const f of INITS) f();
  for (const s of SCENES) s.el.style.display = 'none', s._on = false;
  seek(0);
  return true;
})();
