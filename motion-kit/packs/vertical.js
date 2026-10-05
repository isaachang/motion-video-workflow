// =====================================================================
// motion-kit · packs/vertical.js —— 竖版 9:16 专用画布 + 强调类小组件
// 只出 9:16 时用：每个镜头直接在 1080×1080 内容窗的本地坐标里搭（左上 0,0，中心 540,540），
// 不用再考虑 16:9 构图和 SAFE 裁切。颜色全部走主题变量，样式跟着当期风格改 CSS 即可。
//   const sc = VShot('名字', t0, t1);           // sc.R = 内容窗，sc.cam = 镜头层（往这里放元素）
//   sc.upd = t => { vEnter(sc, t); vcam(sc.cam, camKeys([[t0,540,540,1],[t1,540,600,1.3]], t), drift(t, 4)); ... };
// =====================================================================
el('style', null, `
.v-card{position:absolute;background:var(--card);border-radius:var(--radius,24px);box-shadow:var(--shadow)}
.v-stamp{position:absolute;white-space:nowrap;font:900 160px/1 'Noto Sans CJK SC';color:var(--ink);letter-spacing:2px}
.v-stamp b{position:relative;z-index:0;font-weight:900}
.v-stamp .m{position:absolute;left:-.06em;right:-.06em;bottom:.08em;height:.34em;background:var(--hi);z-index:-1;transform-origin:0 50%;border-radius:.05em}
.v-seal{position:absolute;white-space:nowrap;font:900 64px 'Noto Sans CJK SC';letter-spacing:6px;padding:10px 28px;border:6px solid currentColor;border-radius:10px}
.v-toast{position:absolute;display:flex;align-items:center;gap:14px;padding:20px 34px;background:var(--ink);color:var(--card);font:800 40px 'Noto Sans CJK SC';border-radius:14px;white-space:nowrap;box-shadow:0 18px 40px rgba(0,0,0,.25)}
.v-stat{position:absolute;background:var(--card);border-radius:var(--radius,24px);box-shadow:var(--shadow);overflow:hidden}
.v-stat .lb{position:absolute;left:30px;top:26px;display:flex;align-items:center;gap:12px;font:800 38px 'Noto Sans CJK SC';color:var(--sub)}
.v-stat .v{position:absolute;left:30px;bottom:22px;font:800 128px/1 Inter;letter-spacing:-3px;color:var(--ink);font-variant-numeric:tabular-nums}
.v-key{position:absolute;width:250px;height:230px;border-radius:34px;background:var(--card);border:4px solid var(--ink);display:flex;align-items:center;justify-content:center;gap:10px;font:800 110px Inter;color:var(--ink)}
`, document.head);

// ---------- 画布 ----------
function VShot(name, t0, t1, bg) {
  const sc = Scene(name, t0, t1);
  sc.R = el('div', 'abs', null, sc.el, { left: '420px', top: '0', width: '1080px', height: '1080px', overflow: 'hidden', background: bg || 'var(--bg)' });
  sc.cam = el('div', 'abs', null, sc.R, { left: '0', top: '0', width: '1080px', height: '1080px', transformOrigin: '0 0' });
  MB.push([t1 - .08, t1 + .1, 3]);   // 切点运动模糊
  return sc;
}
// 镜头：把本地坐标 (cx,cy) 放到内容窗中心并缩放 s；ex 叠加 drift()/shake()
function vcam(cam, c, ex = {}) {
  const [cx, cy, s] = c;
  cam.style.transform = `translate(${(540 - s * cx + (ex.x || 0)).toFixed(2)}px,${(540 - s * cy + (ex.y || 0)).toFixed(2)}px) rotate(${(ex.r || 0).toFixed(3)}deg) scale(${(s * (ex.s || 1)).toFixed(4)})`;
}
// 切入：轻推 + 去模糊（每个镜头 upd 第一行调用）
function vEnter(sc, t, dur = .32, from = 1.06) { const k = P(t, sc.t0, sc.t0 + dur, E.outQt); set(sc.R, { s: from + (1 - from) * k, b: (1 - k) * 7 }); }
function vbox(parent, cls, html, x, y, w, h, style = {}) {
  return el('div', cls, html, parent, Object.assign({ left: x + 'px', top: y + 'px', width: w != null ? w + 'px' : undefined, height: h != null ? h + 'px' : undefined }, style));
}
function vcenter(e, x, y) { e.style.left = x + 'px'; e.style.top = y + 'px'; e.style.translate = '-50% -50%'; return e; }

// ---------- 强调类 ----------
// 印章大字：从 1.9 倍砸下来，可选荧光笔。Stamp(parent, '高级感', {x,y,t0,t1,size,mark,rot,color,font})
function Stamp(parent, text, o = {}) {
  const e = el('div', 'v-stamp', `<b>${text}</b>${o.mark ? '<i class="m"></i>' : ''}`, parent, { fontSize: (o.size || 160) + 'px', color: o.color || 'var(--ink)' });
  if (o.font) e.style.font = o.font;
  vcenter(e, o.x ?? 540, o.y ?? 540);
  const m = e.querySelector('.m'), t0 = o.t0 ?? 0, t1 = o.t1 ?? 1e9, rot = o.rot ?? 0;
  return {
    el: e, upd(t) {
      const k = P(t, t0, t0 + .24, E.outQt), out = P(t, t1 - .18, t1, E.inC);
      set(e, { s: (1.9 - .9 * k) * (1 - .1 * out) * kickScale(t, .012), r: rot + 7 * (1 - k), o: P(t, t0, t0 + .08, E.lin) * (1 - out), b: (1 - k) * 6 });
      if (m) m.style.transform = `scaleX(${P(t, t0 + .2, t0 + .55, E.ioC).toFixed(3)})`;
    }
  };
}
// 盖章：描边框文字，从 2.2 倍盖下。Seal(parent, '塑料味', {x,y,t0,t1,color,size,rot,bg})
function Seal(parent, text, o = {}) {
  const e = el('div', 'v-seal', text, parent, { color: o.color || 'var(--bad)', fontSize: (o.size || 64) + 'px', background: o.bg || 'transparent' });
  vcenter(e, o.x ?? 540, o.y ?? 540);
  const t0 = o.t0 ?? 0, rot = o.rot ?? -10, t1 = o.t1 ?? 1e9;
  return { el: e, upd(t) { const k = P(t, t0, t0 + .2, E.outQt); set(e, { s: 2.2 - 1.2 * k, r: rot, o: P(t, t0, t0 + .06, E.lin) * (1 - P(t, t1 - .15, t1)) }); } };
}
// 逐字浮现。Chars(parent, '记住这个网站', {x,y,t0,t1,font,color,stagger})
function Chars(parent, text, o = {}) {
  const e = el('div', 'abs', [...text].map(c => `<span style="display:inline-block">${c === ' ' ? '&nbsp;' : c}</span>`).join(''), parent, { whiteSpace: 'nowrap', font: o.font || "900 72px 'Noto Sans CJK SC'", color: o.color || 'var(--ink)', letterSpacing: o.ls || '2px' });
  vcenter(e, o.x ?? 540, o.y ?? 540);
  const cs = [...e.children], t0 = o.t0 ?? 0, st = o.stagger ?? .05, t1 = o.t1 ?? 1e9;
  return { el: e, upd(t) { cs.forEach((c, i) => { const k = P(t, t0 + i * st, t0 + i * st + .4, E.outQt); set(c, { y: 40 * (1 - k), o: k * (1 - P(t, t1 - .2, t1)), b: (1 - k) * 6 }); }); } };
}
// 数字滚动：countTo(el, t, t0, t1, 287) / countTo(el, t, t0, t1, 48.7, v => v.toFixed(1) + 'K')
function countTo(e, t, t0, t1, to, fmt = v => Math.round(v).toLocaleString('en-US')) { e.textContent = fmt(to * P(t, t0, t1, E.outQt)); }
// 提示条（「已复制」之类）。Toast(parent, html, x, y, t0, t1)
function Toast(parent, html, x, y, t0, t1) {
  const e = el('div', 'v-toast', html, parent); vcenter(e, x, y);
  return { el: e, upd(t) { const k = P(t, t0, t0 + .3, E.outB), out = P(t, t1 - .2, t1, E.inC); set(e, { y: 60 * (1 - k) + 20 * out, s: .9 + .1 * k, o: P(t, t0, t0 + .12) * (1 - out) }); } };
}
// 数据格：图标 + 标签 + 跳动的大数字。StatBox(parent, {x,y,w,h,icon,label,value,fmt,t0,dur})
function StatBox(parent, o) {
  const e = vbox(parent, 'v-stat', `<div class="lb">${o.icon || ''}${o.label || ''}</div><div class="v">0</div>`, o.x, o.y, o.w ?? 455, o.h ?? 250);
  const v = e.querySelector('.v'), t0 = o.t0 ?? 0, d = o.dur ?? .6;
  return { el: e, upd(t) { const k = P(t, t0, t0 + .24, E.outQt); set(e, { s: 1.6 - .6 * k, o: P(t, t0, t0 + .06), r: (o.rot ?? -3) * (1 - k) }); countTo(v, t, t0 + .04, t0 + d, o.value, o.fmt); } };
}
// 键帽：按下时下沉、变高亮色。Keycap(parent, '⌘C', {x,y,t0,tPress})
function Keycap(parent, label, o = {}) {
  const e = vbox(parent, 'v-key', label, (o.x ?? 540) - 125, (o.y ?? 540) - 115, 250, 230);
  const t0 = o.t0 ?? 0, tp = o.tPress ?? 1e9;
  return { el: e, upd(t) { const ka = P(t, t0, t0 + .3, E.outB), p = bump(t, tp, tp + .06, tp + .3); e.style.boxShadow = `0 ${14 - 12 * p}px 0 var(--ink)`; e.style.background = t > tp ? 'var(--hi)' : 'var(--card)'; set(e, { y: 120 * (1 - ka) + 12 * p, o: ka }); } };
}
// 放射线：点击 / 砸下时的冲击线。Burst(parent, x, y, t0, {n,len,r,colors})
function Burst(parent, x, y, t0, o = {}) {
  const n = o.n || 10, r = o.r || 300, cols = o.colors || ['var(--accent)', 'var(--ink)'];
  const rays = [...Array(n)].map((_, i) => el('div', 'abs', null, parent, { left: x + 'px', top: y + 'px', width: (o.len || 80) + 'px', height: '10px', borderRadius: '5px', background: cols[i % cols.length], transformOrigin: `${-r}px 5px`, opacity: 0 }));
  return { upd(t) { const k = P(t, t0, t0 + .5, E.outQt); rays.forEach((e, i) => { e.style.transform = `rotate(${i * 360 / n + 18}deg) translateX(${-r - 80 + 60 * k}px) scaleX(${(1 - k) * 1.2})`; e.style.opacity = (t > t0 ? 1 - k : 0).toFixed(3); }); } };
}
