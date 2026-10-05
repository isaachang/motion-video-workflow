// =====================================================================
// motion-kit · engine/fx.js  —— 转场与镜头工具（与题材无关）
// 两类：① 叠加式转场：自身是高 z 的 Scene，盖住切点（StrokeWipe / BarsWipe / Iris）
//       ② 场景级助手：在 scene.upd 里对元素做 clip / 推拉 / 甩镜（clipCircle / zoomThrough / whip）
// 规则：切点放在拍点上（snap），转场 0.35–0.7s，并把区间写进 MB 做运动模糊。
// =====================================================================

// 通用笔刷路径（100×100 空间的 S 形）。品牌片可换成品牌笔画中心线。
const BRUSH_S = 'M2 70 C18 40 30 22 44 30 C58 38 40 72 56 76 C72 80 80 40 98 24';

// ① 笔刷擦屏：一笔扫过全屏，前半段盖住、后半段露出下一场景
function StrokeWipe(t0, dur, opt = {}) {
  const sc = Scene('wipe' + t0, t0, t0 + dur, 900);
  const sw = opt.width || 620, d = opt.d || BRUSH_S;
  const c1 = opt.c1 || TH.accent || '#2F6BFF', c2 = opt.c2 || TH.accent2 || '#18C8FF';
  const id = 'swg' + Math.round(t0 * 100);
  sc.el.innerHTML = `<svg width="1920" height="1080" viewBox="0 0 1920 1080" style="position:absolute;inset:0;overflow:visible">
   <defs><linearGradient id="${id}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
   <g transform="translate(-300,-560) scale(25.5,22.5)">
     <path class="glow" d="${d}" fill="none" stroke="${c2}" stroke-opacity=".4" stroke-width="${(sw + 160) / 25}" stroke-linecap="round" stroke-linejoin="round"/>
     <path class="main" d="${d}" fill="none" stroke="url(#${id})" stroke-width="${sw / 25}" stroke-linecap="round" stroke-linejoin="round"/>
   </g></svg>`;
  const ps = [sc.el.querySelector('.main'), sc.el.querySelector('.glow')];
  let L = 0;
  INITS.push(() => { L = ps[0].getTotalLength(); });
  sc.upd = (t, lt) => {
    const k = lt / dur;
    const head = E.ioQ(clamp(k / 0.58)) * L, tail = E.ioQ(clamp((k - 0.42) / 0.58)) * L;
    for (const p of ps) p.style.strokeDasharray = `0 ${tail} ${Math.max(0.01, head - tail)} ${L * 2}`;
  };
  MB.push([t0, t0 + dur, 5]);
  return sc;
}

// ① 色条擦屏：n 条斜色带依次扫入再扫出（资讯/知识类常用，干净利落）
function BarsWipe(t0, dur, opt = {}) {
  const sc = Scene('bars' + t0, t0, t0 + dur, 900);
  const n = opt.n || 5, cols = opt.colors || [TH.accent || '#2F6BFF', TH.accent2 || '#18C8FF', TH.ink || '#111'];
  const wrap = el('div', 'abs', null, sc.el, { left: '-300px', top: '-200px', width: '2520px', height: '1480px', transform: `rotate(${opt.angle ?? -12}deg)` });
  const bars = [];
  for (let i = 0; i < n; i++) bars.push(el('div', 'abs', null, wrap, { left: '0', top: (i * 1480 / n) + 'px', width: '2520px', height: (1480 / n + 2) + 'px', background: cols[i % cols.length] }));
  sc.upd = (t, lt) => {
    bars.forEach((b, i) => {
      const d = i * 0.06 * dur / 0.6;
      const kin = P(lt, d, d + dur * .45, E.ioQt), kout = P(lt, dur * .5 + d, dur * .5 + d + dur * .42, E.ioQt);
      b.style.transform = `translateX(${(-1 + kin + kout) * 2520}px)`;
    });
  };
  MB.push([t0, t0 + dur, 4]);
  return sc;
}

// ① 圆形光圈：色块从 (cx,cy) 扩张盖满，再从另一点收缩露出
function Iris(t0, dur, opt = {}) {
  const sc = Scene('iris' + t0, t0, t0 + dur, 900);
  const d = el('div', 'abs', null, sc.el, { inset: '0', background: opt.color || TH.accent || '#2F6BFF' });
  const [x1, y1] = opt.from || [960, 540], [x2, y2] = opt.to || [960, 540];
  sc.upd = (t, lt) => {
    const k = lt / dur;
    if (k < .5) { const r = 2300 * E.inQ(k / .5); d.style.clipPath = `circle(${r}px at ${x1}px ${y1}px)`; d.style.webkitMaskImage = 'none'; }
    else { const r = 2300 * E.outQ((k - .5) / .5); d.style.clipPath = 'none'; d.style.webkitMaskImage = `radial-gradient(circle at ${x2}px ${y2}px, transparent ${r}px, #000 ${r + 1}px)`; }
  };
  return sc;
}

// ② 场景级助手 ------------------------------------------------------
// 圆形 / 矩形揭示：k 0→1
function clipCircle(e, cx, cy, k, rMax = 2300) { e.style.clipPath = k >= 1 ? 'none' : `circle(${(rMax * k).toFixed(1)}px at ${cx}px ${cy}px)`; }
function clipRect(e, k, dir = 'l') { const v = ((1 - k) * 100).toFixed(2) + '%'; e.style.clipPath = k >= 1 ? 'none' : ({ l: `inset(0 ${v} 0 0)`, r: `inset(0 0 0 ${v})`, t: `inset(0 0 ${v} 0)`, b: `inset(${v} 0 0 0)` })[dir]; }
// 穿越推镜：出场元素放大+模糊+淡出；入场元素从 0.6 推到 1
function zoomThrough(out, inn, t, t0, dur = .5) {
  const k = P(t, t0, t0 + dur, E.inQ), k2 = P(t, t0 + dur * .35, t0 + dur, E.outQt);
  if (out) set(out, { s: 1 + 2.2 * k, o: 1 - P(t, t0 + dur * .4, t0 + dur, E.lin), b: 14 * k });
  if (inn) set(inn, { s: .6 + .4 * k2, o: k2, b: 10 * (1 - k2) });
}
// 甩镜：返回 x 偏移（配合 MB）；dir=1 往左甩
function whip(t, t0, dur = .45, dist = 2200, dir = 1) { return -dir * dist * P(t, t0, t0 + dur, E.ioX); }
// 心跳/重拍缩放：卡在 KICKS 上
function kickScale(t, amt = .025) { return 1 + amt * beatPulse(t, 9, KICKS.length ? KICKS : BEATS); }
