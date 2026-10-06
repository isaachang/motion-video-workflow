// =====================================================================
// motion-kit · packs/mascot.js —— 角色 / IP 形象 + 柔光渐变镜头底（竖版）
// 依赖 packs/vertical.js（VShot / vcenter），html 里放在 vertical.js 后面。
// 角色图要先抠成透明 PNG（白底动画用 tools/key_video.py）。
//   const sc = SoftShot('cloud', 10.4, 17.4, { c1: '#E8E4FD', c2: '#D9EAFF' });   // sc.bg(t) 让光斑漂
//   const dot = Char(sc.cam, 'chars/blue.png', { x: 540, y: 560, w: 330, t0: 10.5 });           // 弹出
//   const peek = Char(sc.cam, 'chars/heart.png', { x: 950, y: 960, w: 280, t0: 40, peek: 'r' });  // 从右边探出来
//   sc.upd = t => { sc.bg(t); vEnter(sc, t); dot.upd(t); peek.upd(t, { s: 1.1 }); };
// =====================================================================
el('style', null, `
.m-ch{position:absolute;filter:drop-shadow(0 18px 24px var(--chShadow,rgba(40,30,90,.22)));will-change:transform}
`, document.head);

// 柔光渐变底：两色渐变 + 几团慢慢漂的径向光斑（光斑在镜头层下面，不跟镜头缩放）
// o = { c1, c2, blobs: [[x, y, size, '--主题变量', 浓度%], ...] }
function SoftShot(name, t0, t1, o = {}) {
  const sc = VShot(name, t0, t1, `linear-gradient(160deg,${o.c1 || 'var(--bg)'},${o.c2 || 'var(--bg2)'})`);
  const bl = (o.blobs || [[-140, -120, 640, '--accent2', 30], [560, 480, 720, '--accent', 26], [520, -220, 520, '--hi', 30]]).map(([x, y, s, c, a], i) => {
    const b = el('div', 'abs', null, null, { left: x + 'px', top: y + 'px', width: s + 'px', height: s + 'px', borderRadius: '50%', background: `radial-gradient(circle,color-mix(in srgb,var(${c}) ${a}%,transparent),transparent 68%)` });
    sc.R.insertBefore(b, sc.cam); return [b, i];
  });
  sc.bg = t => bl.forEach(([b, i]) => { b.style.transform = `translate(${(Math.sin(t * .4 + i * 2) * 50).toFixed(1)}px,${(Math.cos(t * .33 + i) * 36).toFixed(1)}px)`; });
  return sc;
}

// 角色：弹簧弹出（或 peek 从边缘探出）→ 呼吸式上下浮动 + 挤压，重拍上弹一下 → t1 前缩回
// Char(parent, 'a/ 下的图片', { x, y, w, t0, t1, rot, peek: 'l'|'r'|'t'|'b', seed, bob(0 关掉浮动), z })
// upd(t, ex) 的 ex = { x, y, r, s } 叠加额外位移 / 缩放（比如收到东西时 s: 1.15 弹一下）
function Char(parent, src, o = {}) {
  const w = o.w || 300, e = el('img', 'm-ch', null, parent, { width: w + 'px' });
  e.src = A + src; vcenter(e, o.x ?? 540, o.y ?? 540);
  if (o.z) e.style.zIndex = o.z;
  const t0 = o.t0 ?? 0, t1 = o.t1 ?? 1e9, rot = o.rot || 0, sd = o.seed || 1, bob = o.bob ?? 1;
  const dir = { l: [-1, 0], r: [1, 0], b: [0, 1], t: [0, -1] }[o.peek] || null;
  return {
    el: e,
    upd(t, ex = {}) {
      const lt = t - t0, out = P(t, t1 - .25, t1, E.inB);
      let s = 1, dx = 0, dy = 0;
      if (dir) { const k = SP(clamp(lt / 1.1), 1.2, 5.5); dx = dir[0] * w * 1.1 * (1 - k); dy = dir[1] * w * 1.1 * (1 - k); }
      else s = lt < 0 ? 0 : SP(clamp(lt / 1.1), 1.3, 5);
      s *= 1 - out;
      const sq = 1 + .035 * Math.sin(t * 4.4 + sd) * bob + .05 * beatPulse(t, 9, KICKS.length ? KICKS : BEATS) * bob;
      const by = Math.sin(t * 2.2 + sd) * 8 * bob;
      e.style.opacity = lt < 0 ? 0 : 1;
      e.style.transform = `translate(${(dx + (ex.x || 0)).toFixed(2)}px,${(dy + by + (ex.y || 0)).toFixed(2)}px) rotate(${(rot + Math.sin(t * 1.4 + sd) * 3 * bob + (ex.r || 0)).toFixed(2)}deg) scale(${(s * sq * (ex.s || 1)).toFixed(4)},${(s * (2 - sq) * (ex.s || 1)).toFixed(4)})`;
    }
  };
}
