// ================= core =================
const W = 1920, H = 1080;
const stage = document.getElementById('stage');
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
  ioS: x => -(Math.cos(Math.PI * x) - 1) / 2,
  outS: x => Math.sin(x * Math.PI / 2),
  outEl: x => x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * (2 * Math.PI) / 3) + 1,
};
const P = (t, a, b, e = E.ioC) => e(clamp((t - a) / (b - a)));
// damped spring: 0 -> 1 with overshoot; x seconds since start
function SP(x, f = 1.6, d = 6) { if (x <= 0) return 0; return 1 - Math.exp(-d * x) * Math.cos(f * 2 * Math.PI * x); }
// bump 0->1->0
const bump = (t, a, b, c, e1 = E.outC, e2 = E.inC) => t < b ? P(t, a, b, e1) : 1 - P(t, b, c, e2);
function rng(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = s * 16807 % 2147483647, (s - 1) / 2147483646); }
function noise1(x, seed = 1) { const i = Math.floor(x), f = x - i; const h = n => { const s = Math.sin((n + seed * 131.7) * 127.1) * 43758.5453; return s - Math.floor(s); }; const u = f * f * (3 - 2 * f); return lerp(h(i), h(i + 1), u) * 2 - 1; }

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
function set(e, o) {
  if (!e) return;
  if ('o' in o) e.style.opacity = clamp(o.o).toFixed(4);
  e.style.transform = tf(o);
  if ('f' in o) e.style.filter = o.f || 'none';
}
function show(e, on) { const v = on ? '' : 'none'; if (e.style.display !== v) e.style.display = v; }
const blurF = b => b > 0.05 ? `blur(${b.toFixed(2)}px)` : 'none';

// ================= scenes =================
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
// motion-blur subframe requests for renderer: [t0,t1,n]
const MB = [];
window.mbSamples = t => { let n = 1; for (const [a, b, k] of MB) if (t >= a && t <= b) n = Math.max(n, k); return n; };

// ================= beats =================
const BEATS = [0.07, 0.49, 0.93, 1.35, 1.76, 2.16, 2.58, 3.07, 3.48, 3.85, 4.34, 4.74, 5.2, 5.64, 6.06, 6.5, 6.92, 7.34, 7.76, 8.2, 8.61, 9.06, 9.47, 9.91, 10.36, 10.77, 11.17, 11.59, 12.0, 12.38, 12.77, 13.19, 13.58, 14.0, 14.42, 14.84, 15.28, 15.72, 16.11, 16.56, 16.97, 17.39, 17.79, 18.16, 18.55, 18.92, 19.34, 19.74, 20.2, 20.62, 21.06, 21.48, 21.92, 22.34, 22.78, 23.22, 23.64, 24.06, 24.47, 24.89, 25.31, 25.7, 26.15, 26.59, 27.05, 27.47, 27.91, 28.33, 28.77, 29.19, 29.63, 30.07, 30.49, 30.91, 31.35, 31.79, 32.18, 32.62, 33.07, 33.48, 33.9, 34.34, 34.76, 35.25, 35.64, 36.06, 36.48, 36.92, 37.34, 37.73, 38.13, 38.57, 39.01, 39.45, 39.87, 40.36, 40.77, 41.19, 41.66, 42.1, 42.54, 42.93, 43.37, 43.79, 44.21, 44.65, 45.07, 45.44, 45.86, 46.35, 46.76, 47.21, 47.62, 48.07, 48.51, 48.9, 49.34, 49.76, 50.2, 50.67, 51.06, 51.48, 51.92, 52.34, 52.78, 53.2, 53.61, 54.08, 54.5, 54.92, 55.36, 55.77, 56.19, 56.59, 57.03, 57.49, 57.93, 58.35, 58.77, 59.21, 59.63, 60.07, 60.49, 60.91, 61.35, 61.79, 62.21, 62.62, 63.04, 63.48, 63.88, 64.27, 64.69, 65.11, 65.53];
// beat pulse: 1 at beat, decays
function beatPulse(t, decay = 7) { let best = 0; for (const b of BEATS) { const d = t - b; if (d >= 0 && d < 1) best = Math.max(best, Math.exp(-decay * d)); } return best; }

// ================= assets =================
const A = 'a/';
const MUSE_D = 'M24.6257 16.1214C28.2365 16.1214 30.8187 18.9408 30.8187 23.3643C30.8185 27.7868 30.1055 31.7765 28.9225 40.2466C28.0743 46.1813 26.62 55.2418 26.0132 59.0088C27.1782 56.7815 29.9074 51.5757 30.3914 50.5982C36.1081 39.061 42.0657 28.7544 43.7826 26.0254C46.0594 22.382 48.062 20.9229 51.1597 20.9229C52.7685 20.923 54.6826 21.7357 55.6315 22.819C56.9178 24.2895 57.1859 26.6602 57.1411 29.244C57.0738 33.2073 56.5599 39.5264 55.8553 46.5698C55.5416 49.7057 54.9365 56.1066 54.5288 60.4004C58.1883 53.8532 64.9609 41.8109 67.6921 37.6058C70.0727 33.9402 72.466 31.5797 75.6836 31.5796C78.4595 31.5796 81.8809 33.5416 81.6772 38.7573C81.3774 46.4556 80.2673 63.2232 79.7607 70.7479C83.1662 65.7913 87.6377 58.4543 89.3148 55.6966C91.0104 52.908 92.75 50.6542 95.3898 50.5778C98.0987 50.4995 99.913 52.341 99.9959 55.1839C100.078 58.0277 98.3835 61.2256 96.1344 64.856C93.6937 68.7957 90.9621 73.0123 87.6383 76.9491C84.3148 80.8856 81.2604 83.8782 76.5991 83.8786C72.4243 83.8786 69.4869 81.1043 69.283 76.0254C69.1768 73.364 69.6804 67.6405 70.0602 63.1673C70.5 57.9875 71.0315 52.9861 71.403 49.6786C67.7337 56.3979 60.0101 70.4676 56.5348 75.9603C53.1343 81.3339 51.4774 83.2269 47.8882 83.2275C44.2977 83.2275 42.7226 80.6416 42.6717 76.7497C42.6142 72.5285 45.7852 47.1821 46.8587 38.737C45.1183 42.4616 40.839 51.6056 38.1551 57.0435C35.5587 62.3055 31.204 71.3978 28.0436 76.6357C25.7668 80.4094 23.2092 83.2273 19.4173 83.2275C15.6252 83.2275 13.4847 80.6784 13.4847 76.5788C13.4847 72.4794 14.6716 65.6492 15.9465 57.1777C16.5839 53.0781 17.3108 48.6133 18.1315 43.8761C18.7324 40.448 19.7764 34.4169 20.4183 30.7129C17.502 35.2539 12.2536 43.4278 10.6567 45.8903C8.88113 48.6291 7.28747 50.626 4.64681 50.6266C1.7329 50.6266 0.000532901 48.3522 0 45.7113C0 43.0703 1.34323 41.0344 3.52376 37.4512C6.32403 32.8465 11.3578 26.57 14.1154 23.2747C17.3656 19.3912 20.6139 16.1219 24.6257 16.1214Z';
// hand-traced centerline of the squiggle (100x100 space) for stroke-draw animations
const MUSE_CL = 'M4.5 45.7 C8 40 15 29 21 23 C25 19.5 27.6 20.5 26.9 27 C25.6 38 21 60 19.7 71 C19 78 20.5 80 23.5 76.5 C30 66 41 40 47 30 C50 24.5 52.4 24.5 52.3 30 C51.9 42 49 64 48 74 C47.6 79 49.5 79.5 52 76 C58 67 67 48 72.2 40.6 C74.5 37.5 76.7 35.5 76.9 39.5 C76.5 51 75 65 74.8 73.5 C74.7 79 76.3 80 79 77.5 C84 72 90 62 95.4 55.2';
const MUSE_GRAD = (id) => `<linearGradient id="${id}" x1="133.245" y1="109.046" x2="24.9203" y2="-12.5565" gradientUnits="userSpaceOnUse"><stop offset="0.2548" stop-color="#0082FB"/><stop offset="0.6971" stop-color="#0064E0"/><stop offset="1" stop-color="#0040DC"/></linearGradient>`;
let _gid = 0;
function museSVG(size, extra = '') { const id = 'mg' + (_gid++); return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" ${extra}><defs>${MUSE_GRAD(id)}</defs><path d="${MUSE_D}" fill="url(#${id})"/></svg>`; }
function appIcon(size) {
  return `<div style="width:${size}px;height:${size}px;border-radius:${size * .235}px;background:linear-gradient(#FFFFFF,#EDEDEF);box-shadow:0 ${size * .06}px ${size * .18}px rgba(40,70,160,.22),inset 0 0 0 1px rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center">${museSVG(size * .8)}</div>`;
}

const ICON = {
  signal: `<svg width="19" height="12" viewBox="0 0 19 12"><rect x="0" y="8" width="3.2" height="4" rx="1" fill="currentColor"/><rect x="5" y="5.5" width="3.2" height="6.5" rx="1" fill="currentColor"/><rect x="10" y="3" width="3.2" height="9" rx="1" fill="currentColor"/><rect x="15" y="0" width="3.2" height="12" rx="1" fill="currentColor"/></svg>`,
  wifi: `<svg width="17" height="12" viewBox="0 0 17 12"><path d="M8.5 2.3c2.4 0 4.6.9 6.3 2.5l1.2-1.2C14 1.6 11.3.5 8.5.5S3 1.6 1 3.6l1.2 1.2C3.9 3.2 6.1 2.3 8.5 2.3zm0 3.5c1.4 0 2.8.5 3.8 1.5l1.2-1.2C12.2 4.8 10.4 4 8.5 4S4.8 4.8 3.5 6.1l1.2 1.2c1-1 2.4-1.5 3.8-1.5zm0 3.4c.5 0 1 .2 1.3.5L8.5 11 7.2 9.7c.3-.3.8-.5 1.3-.5z" fill="currentColor"/></svg>`,
  battery: `<svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="currentColor" opacity=".4" fill="none"/><rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="currentColor" opacity=".45"/></svg>`,
  burger: `<svg width="22" height="16" viewBox="0 0 22 16"><rect y="2" width="22" height="2.2" rx="1.1" fill="#111"/><rect y="11" width="22" height="2.2" rx="1.1" fill="#111"/></svg>`,
  plus: `<svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 2v16M2 10h16" stroke="#111" stroke-width="2" stroke-linecap="round"/></svg>`,
  mic: `<svg width="18" height="22" viewBox="0 0 18 22"><rect x="5.5" y="1" width="7" height="12" rx="3.5" stroke="#8e8e93" stroke-width="1.6" fill="none"/><path d="M2 10a7 7 0 0014 0M9 17v4" stroke="#8e8e93" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`,
  tChat: `<svg width="26" height="26" viewBox="0 0 26 26"><path d="M13 3.5c5.5 0 9.5 3.7 9.5 8.3S18.5 20 13 20c-1.2 0-2.4-.2-3.4-.5L4.5 22l1.3-4.2C4.4 16.3 3.5 14.2 3.5 11.8 3.5 7.2 7.5 3.5 13 3.5z" stroke="#111" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>`,
  tFeed: `<svg width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="3" width="15" height="18" rx="3" stroke="#111" stroke-width="2" fill="none"/><path d="M8 8h7M8 12h7M8 16h4" stroke="#111" stroke-width="2" stroke-linecap="round"/><path d="M1.5 7v10" stroke="#111" stroke-width="2" stroke-linecap="round"/></svg>`,
  tBulb: `<svg width="24" height="26" viewBox="0 0 24 26"><path d="M12 2.5a7.5 7.5 0 00-4.3 13.7c.8.6 1.3 1.5 1.3 2.5v.8h6v-.8c0-1 .5-1.9 1.3-2.5A7.5 7.5 0 0012 2.5z" stroke="#111" stroke-width="2" fill="none"/><path d="M9 22.5h6" stroke="#111" stroke-width="2" stroke-linecap="round"/></svg>`,
  tCheck: `<svg width="24" height="24" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" stroke="#111" stroke-width="2" fill="none"/><path d="M7.5 12.5l3 3 6-7" stroke="#111" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  tApps: `<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="7.5" cy="7.5" r="4" stroke="#111" stroke-width="2" fill="none"/><path d="M18.5 3.2l4.3 7.3h-8.6z" stroke="#111" stroke-width="2" fill="none" stroke-linejoin="round"/><rect x="3.5" y="14.5" width="8" height="8" rx="2" stroke="#111" stroke-width="2" fill="none"/><rect x="14.5" y="14.5" width="8" height="8" rx="2" stroke="#111" stroke-width="2" fill="none"/></svg>`,
  plane: (c = '#fff', s = 12) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" fill="${c}" transform="rotate(90 12 12)"/></svg>`,
  phoneI: (c = '#fff', s = 20) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" fill="${c}"/></svg>`,
  check: (c = '#fff', s = 20, w = 3) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

const UA_GLOBE = (h = 40) => `<div style="width:${h * 1.15}px;height:${h}px;background:url(${A}United_Airlines_Logo.svg) no-repeat right center/auto ${h}px"></div>`;


// ================= camera keyframes =================
// keys: [time, cx, cy, scale, ease?]; returns [cx, cy, s]; scale interpolated in log space
function camKeys(keys, t) {
  if (t <= keys[0][0]) return keys[0].slice(1, 4);
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t < b[0]) { const k = (b[4] || E.ioC)(clamp((t - a[0]) / (b[0] - a[0]))); return [lerp(a[1], b[1], k), lerp(a[2], b[2], k), Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), k))]; }
  }
  return keys[keys.length - 1].slice(1, 4);
}
function applyCam(cam, c, ex = {}) {
  cam.style.transformOrigin = '0 0';
  cam.style.transform = `translate(${(960 - c[2] * c[0] + (ex.x || 0)).toFixed(2)}px,${(540 - c[2] * c[1] + (ex.y || 0)).toFixed(2)}px) rotate(${(ex.r || 0).toFixed(3)}deg) scale(${(c[2] * (ex.s || 1)).toFixed(4)})`;
}

// ================= sprites (mascot video frames) =================
const SPR = { hw: [], hc: [] };
const IMG = {};
function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(src); i.src = src; }); }
async function loadAll() {
  const jobs = [];
  for (let i = 1; i <= 92; i++) jobs.push(loadImg(`${A}hw/${String(i).padStart(3, '0')}.png`).then(im => SPR.hw[i - 1] = im));
  for (let i = 1; i <= 96; i++) jobs.push(loadImg(`${A}hc/${String(i).padStart(3, '0')}.png`).then(im => SPR.hc[i - 1] = im));
  for (const k of ['hatch.jpg', 'og-image.jpg', 'plane_ua.png', 'sz_77.1.jpg', 'muse-logo.svg'])
    jobs.push(loadImg(A + k).then(im => IMG[k] = im));
  await Promise.all(jobs);
}
// crop presets (in 320x320 sprite space)
const CROP = { hc: [70, 20, 180, 180], hw: [30, 10, 200, 200], hcFull: [0, 0, 320, 320], hwFull: [0, 0, 320, 320] };
function drawSprite(ctx, name, t, x, y, w, h, crop, fps = 24) {
  const arr = SPR[name]; if (!arr.length) return;
  const i = ((Math.floor(t * fps) % arr.length) + arr.length) % arr.length;
  const c = crop || CROP[name];
  ctx.drawImage(arr[i], c[0], c[1], c[2], c[3], x, y, w, h);
}
// avatar canvas that shows a sprite; returns updater
function Avatar(parent, size, name = 'hc', crop) {
  const c = el('canvas', null, null, parent);
  c.width = c.height = Math.round(size * 2);
  c.style.width = c.style.height = size + 'px';
  const ctx = c.getContext('2d');
  const a = { el: c, name, crop, t0: 0,
    draw(t) { ctx.fillStyle = '#F6F6F6'; ctx.fillRect(0, 0, c.width, c.height); drawSprite(ctx, a.name, t - a.t0, 0, 0, c.width, c.height, a.crop || CROP[a.name]); } };
  return a;
}

// ================= Phone component =================
function Phone(parent, opt = {}) {
  const p = el('div', 'phone', null, parent);
  if (opt.x != null) { p.style.left = opt.x + 'px'; p.style.top = opt.y + 'px'; }
  el('div', 'island', null, p);
  const sbar = el('div', 'sbar', `<span class="clk">${opt.clock || '9:41'}</span><span style="display:flex;gap:6px;align-items:center">${ICON.signal}${ICON.wifi}${ICON.battery}</span>`, p);
  const chat = el('div', 'chat', null, p);
  const col = el('div', 'col', null, chat);
  const head = el('div', 'phead', null, p);
  el('div', 'hbtn', ICON.burger, head, { left: '16px' });
  el('div', 'hbtn', 'Invite', head, { right: '16px', padding: '0 18px' });
  const hav = el('div', 'hav', null, head);
  const av = Avatar(hav, 56, opt.sprite || 'hc');
  const hname = el('div', 'hname', `<b>Muse</b><i class="st">${opt.status || ''}</i>`, head);
  const st = hname.querySelector('.st');
  if (!opt.status) st.style.display = 'none';
  el('div', 'bottomfade', null, p);
  const input = el('div', 'pinput', `${ICON.plus}<span class="ph" style="flex:1">Message</span>${ICON.mic}`, p);
  el('div', 'ptabs', `<div class="sel">${ICON.tChat}</div>${ICON.tFeed}${ICON.tBulb}${ICON.tCheck}${ICON.tApps}`, p);
  INITS.push(() => ph.measure());
  const ph = {
    el: p, col, chat, head, av, st, sbar, input, msgs: [], statusSeq: [],
    // add message: kind 'a' (muse), 'u' (user), 'raw' (custom html, side l/r)
    add(html, t0, kind = 'a', dur = 0.42) {
      const w = el('div', 'mw' + (kind === 'u' || kind === 'rawR' ? ' r' : ''), null, col);
      let inner;
      if (kind === 'a' || kind === 'u') inner = el('div', 'm ' + kind, html, w);
      else { inner = el('div', null, html, w); inner.style.transformOrigin = kind === 'rawR' ? '100% 100%' : '0 100%'; }
      const m = { w, inner, t0, dur, h: 0, kind };
      ph.msgs.push(m);
      return m;
    },
    status(seq) { ph.statusSeq = seq; }, // [[t, html], ...]
    measure() { for (const m of ph.msgs) { m.w.style.height = 'auto'; m.h = m.w.offsetHeight; } },
    update(t) {
      for (const m of ph.msgs) {
        const k = P(t, m.t0, m.t0 + m.dur, E.outQt);
        if (k <= 0) { show(m.w, false); continue; }
        show(m.w, true);
        m.w.style.height = (m.h * k).toFixed(2) + 'px';
        const s = SP(t - m.t0, 1.5, 7);
        set(m.inner, { s: 0.6 + 0.4 * s, o: P(t, m.t0, m.t0 + 0.18, E.lin), y: (1 - k) * 10 });
      }
      if (ph.statusSeq.length) {
        let cur = null; for (const [tt, html] of ph.statusSeq) if (t >= tt) cur = [tt, html];
        if (cur) { if (st._h !== cur[1]) { st.innerHTML = cur[1]; st._h = cur[1]; } show(st, !!cur[1]); st.style.opacity = P(t, cur[0], cur[0] + .25, E.lin); }
        else show(st, false);
      }
      av.draw(t);
    }
  };
  return ph;
}
function typingDots(t, t0) { // returns html of 3 dots animated? use static and animate via update
  return `<div class="m a tdots" style="padding:13px 16px;display:flex;gap:5px"><i></i><i></i><i></i></div>`;
}
function animDots(root, t) { root.querySelectorAll('.tdots').forEach(d => { d.querySelectorAll('i').forEach((i, k) => { const v = .35 + .65 * Math.max(0, Math.sin((t * 5.5 - k * .8))); Object.assign(i.style, { display: 'block', width: '8px', height: '8px', borderRadius: '4px', background: '#8e8e93', opacity: v, transform: `translateY(${-3 * Math.max(0, Math.sin(t * 5.5 - k * .8))}px)` }); }); }); }

function flightCard(o = {}) {
  const cls = o.cls || '';
  return `<div class="fc"><div class="fch ${cls}">${o.head || 'Scheduled'}</div><div class="fcb">
  <div class="r1"><b>${o.from || 'PEK'}</b><span>${o.dur || '11h 40m'}</span><b>${o.to || 'LAX'}</b></div>
  <div class="bar"><div class="fill" style="position:absolute;left:0;top:0;bottom:0;border-radius:2px;background:#1936D6;width:${(o.prog || 0) * 100}%"></div><div class="dot" style="left:calc(${(o.prog || 0) * 100}% - 4px)">${ICON.plane('#fff', 12)}</div></div>
  <div class="r3"><span>${o.date || 'OCT 1 · 1:05 PM'}</span><span>${o.arr || '9:45 AM'}</span></div></div></div>`;
}
function statusCard(icon, title, sub, bg = '#FDEBDD') {
  return `<div class="sc"><div class="ic" style="background:${bg}">${icon}</div><div><b>${title}</b><i>${sub}</i></div></div>`;
}

// ================= Muse brush-stroke wipe (overlay) =================
function StrokeWipe(t0, dur, opt = {}) {
  const sc = Scene('wipe' + t0, t0, t0 + dur, 900);
  const sw = opt.width || 560;
  // map 100x100 centerline to a 2400x1500 area centered on the stage
  const svg = `<svg width="1920" height="1080" viewBox="0 0 1920 1080" style="position:absolute;inset:0;overflow:visible">
   <defs><linearGradient id="swg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#0040DC"/><stop offset=".5" stop-color="#0064E0"/><stop offset="1" stop-color="#18A0FF"/></linearGradient>
   <filter id="swsh" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="18"/></filter></defs>
   <g transform="translate(-420,-560) scale(26.5,22.5)">
     <path class="glow" d="${MUSE_CL}" fill="none" stroke="#7FBDFF" stroke-opacity=".45" stroke-width="${(sw + 160) / 25}" stroke-linecap="round" stroke-linejoin="round"/>
     <path class="main" d="${MUSE_CL}" fill="none" stroke="url(#swg)" stroke-width="${sw / 25}" stroke-linecap="round" stroke-linejoin="round"/>
   </g></svg>`;
  sc.el.innerHTML = svg;
  const main = sc.el.querySelector('.main'), glow = sc.el.querySelector('.glow');
  let L = 0;
  INITS.push(() => { L = main.getTotalLength(); for (const p of [main, glow]) { p.style.strokeDasharray = `${L} ${L}`; } });
  sc.upd = (t, lt) => {
    const k = lt / dur;
    // head draws 0..0.55, tail erases 0.45..1
    const head = E.ioQ(clamp(k / 0.58)) * L, tail = E.ioQ(clamp((k - 0.42) / 0.58)) * L;
    for (const p of [main, glow]) { p.style.strokeDasharray = `0 ${tail} ${Math.max(0.01, head - tail)} ${L * 2}`; }
  };
  MB.push([t0, t0 + dur, 5]);
  return sc;
}

// ================= global overlays: grain + vignette =================
(function grain() {
  const g = el('canvas', null, null, stage, { position: 'absolute', inset: '0', width: '1920px', height: '1080px', zIndex: 1000, pointerEvents: 'none', mixBlendMode: 'overlay', opacity: .10 });
  g.width = 960; g.height = 540;
  const ctx = g.getContext('2d');
  const frames = [];
  const r = rng(99);
  for (let k = 0; k < 6; k++) { const id = ctx.createImageData(960, 540); for (let i = 0; i < id.data.length; i += 4) { const v = 128 + (r() - .5) * 150; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; } frames.push(id); }
  let last = -1;
  OVERLAYS.push(t => { const f = Math.floor(t * 30) % 6; if (f !== last) { ctx.putImageData(frames[f], 0, 0); last = f; } });
})();
const FX = el('div', null, null, stage, { position: 'absolute', inset: '0', zIndex: 990, pointerEvents: 'none' });
const FLASH = el('div', null, null, FX, { position: 'absolute', inset: '0', background: '#fff', opacity: 0 });
const VIG = el('div', null, null, FX, { position: 'absolute', inset: '0', background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(10,20,50,.16) 100%)' });
const FLASHES = []; // [t, peak, dur, color]
OVERLAYS.push(t => {
  let o = 0, col = '#fff';
  for (const [t0, pk, d, c] of FLASHES) { if (t >= t0 - 0.04 && t < t0 + d) { const v = t < t0 ? (t - t0 + 0.04) / 0.04 * pk : pk * Math.pow(1 - (t - t0) / d, 2); if (v > o) { o = v; col = c || '#fff'; } } }
  FLASH.style.opacity = o.toFixed(3); FLASH.style.background = col;
});
// camera shake helper
function shake(t, t0, dur, amp, freq = 28, seed = 3) { const k = t - t0; if (k < 0 || k > dur) return { x: 0, y: 0, r: 0 }; const a = amp * Math.pow(1 - k / dur, 2); return { x: noise1(k * freq, seed) * a, y: noise1(k * freq, seed + 7) * a, r: noise1(k * freq * .7, seed + 13) * a * .03 }; }

// chromatic aberration: duplicate-layer approach via CSS drop-shadow is costly; use SVG filter on demand
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

// ================= confetti (canvas) =================
function Confetti(parent, seed, n, origin, opt = {}) {
  const c = el('canvas', null, null, parent, { position: 'absolute', inset: '0', width: '1920px', height: '1080px', pointerEvents: 'none' });
  c.width = 1920; c.height = 1080;
  const ctx = c.getContext('2d');
  const r = rng(seed);
  const cols = opt.colors || ['#0064E0', '#18A0FF', '#FFC23D', '#FF5A7A', '#34C77B', '#9B6BFF', '#FF8A3D', '#ffffff'];
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
        ctx.save(); ctx.translate(x, y); ctx.rotate(p.rot + p.vr * lt);
        ctx.scale(1, Math.cos(p.flip + p.vf * lt));
        ctx.fillStyle = p.c; ctx.globalAlpha = clamp(2.8 - lt * .55);
        if (p.shape) { ctx.beginPath(); ctx.arc(0, 0, p.w * .35, 0, 6.283); ctx.fill(); } else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    }
  };
}

// ============ init / ready ============
window.READY = (async () => {
  await document.fonts.load('600 20px Inter'); await document.fonts.load('400 20px Inter'); await document.fonts.load('700 20px Inter'); await document.fonts.load('800 20px Inter'); await document.fonts.load('500 20px Inter');
  await document.fonts.load('400 20px "Noto Sans CJK SC"', '中文');
  await loadAll();
  // measure with all scenes visible
  for (const s of SCENES) s.el.style.display = 'block';
  for (const f of INITS) f();
  for (const s of SCENES) s.el.style.display = 'none', s._on = false;
  seek(0);
  return true;
})();
