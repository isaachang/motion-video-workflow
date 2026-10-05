// =====================================================================
// motion-kit · packs/transition.js —— 苹果式运镜转场（镜头连续，不是盖一层遮罩）
// 原理：转场区间 [tc - d/2, tc + d/2] 内 A、B 两层同时存在，共用同一条缓动曲线 u(t)，
//       所以运动的方向和速度跨过切点不断。坐标都是内容窗本地坐标（1080×1080，中心 540,540）。
// 用法：每个镜头是一层 Layer(parent)；在 upd(t) 里调用对应的转场函数，返回 true 表示转场进行中。
//   const A = Layer(R), B = Layer(R);
//   pushThrough(A, B, t, 4.5, 1.0, { x: 420, y: 350, w: 240, h: 240, r: 120 });   // A 推进某个元素 → 元素里是 B
// 每个转场都会自动把区间写进 MB（运动模糊）。
// =====================================================================
const TR = [];   // 记录转场，给装饰带显示名字用：{ tc, d, name }
function Layer(parent, bg) {
  const e = el('div', 'abs', null, parent, { left: '0', top: '0', width: '1080px', height: '1080px', transformOrigin: '0 0', overflow: 'hidden', background: bg || 'transparent' });
  return { el: e, vis: true };
}
// 把层的本地坐标 p 映射为 p*s + (tx,ty)
function place2(L, s, tx, ty, extra = {}) {
  L.el.style.transform = `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px) scale(${s.toFixed(5)})`;
  if ('o' in extra) L.el.style.opacity = clamp(extra.o).toFixed(3);
  if ('b' in extra) L.el.style.filter = blurF(extra.b);
  if ('clip' in extra) L.el.style.clipPath = extra.clip || 'none';
}
function resetL(L) { place2(L, 1, 0, 0, { o: 1, b: 0, clip: '' }); }
const tu = (t, tc, d, ease = E.ioX) => ease(clamp((t - (tc - d / 2)) / d));
function regTR(tc, d, name, k = 4) { if (!TR.some(x => x.tc === tc)) { TR.push({ tc, d, name }); MB.push([tc - d / 2, tc + d / 2, k]); } }

// ① 推进穿越：镜头推进 A 里的元素 r（矩形，r.r 为圆角），元素放大到满屏，里面就是 B
function pushThrough(A, B, t, tc, d, r, o = {}) {
  regTR(tc, d, o.name || '推进穿越', 6);
  if (t < tc - d / 2 || t > tc + d / 2) return false;
  const e = tu(t, tc, d, o.ease || E.ioX);
  const k = Math.exp(lerp(0, Math.log(1080 / r.w), e));           // 尺度按对数插值，推进速度均匀
  const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
  const mx = lerp(cx, 540, e), my = lerp(cy, 540, e);              // 元素中心移到画面中心
  place2(A, k, mx - cx * k, my - cy * k, { o: 1 - P(e, .9, 1) });
  const sB = r.w * k / 1080;
  const rad = (r.r ?? 0) / sB * (1 - e);
  place2(B, sB, mx - 540 * sB, my - 540 * sB, { o: P(e, .12, .4), clip: e >= 1 ? '' : `inset(0 round ${rad.toFixed(1)}px)` });
  return true;
}
// ⑥ 拉远揭示：A 满屏 → 缩进 B 里的一个槽位 slot，镜头拉远看到 B 的全景
function pullOut(A, B, t, tc, d, slot, o = {}) {
  regTR(tc, d, o.name || '拉远揭示', 6);
  if (t < tc - d / 2) return false;
  const e = t > tc + d / 2 ? 1 : tu(t, tc, d, o.ease || E.ioX);
  const sB = Math.exp(lerp(Math.log(1080 / slot.w), 0, e));
  const cx = slot.x + slot.w / 2, cy = slot.y + slot.h / 2;
  const mx = lerp(540, cx, e), my = lerp(540, cy, e);
  place2(B, sB, mx - cx * sB, my - cy * sB, { o: P(e, 0, .25) });
  const sA = slot.w * sB / 1080;
  place2(A, sA, mx - 540 * sA, my - 540 * sA, { o: 1, clip: `inset(0 round ${((slot.r ?? 0) / sA * e).toFixed(1)}px)` });
  return t <= tc + d / 2;
}
// ② 甩镜衔接：A 带着运动模糊往 dir 方向甩走，B 以同样速度接着进来（dir: -1 往左, 1 往右）
function whipPan(A, B, t, tc, d, dir = -1, o = {}) {
  regTR(tc, d, o.name || '甩镜衔接', 8);
  if (t < tc - d / 2 || t > tc + d / 2) return false;
  const X = 1180 * tu(t, tc, d, o.ease || E.ioX);
  place2(A, 1, dir * X, 0, { o: 1 }); place2(B, 1, dir * (X - 1180), 0, { o: 1 });
  return true;
}
// ③ 形状匹配：A 里的元素 ra 原地变形成 B 里的元素 rb（位置、尺寸、圆角、颜色都插值），其余内容交叉淡化
// proxy 是一个放在 parent 顶层的 div，fillA / fillB 是两端的填充（CSS background）
function shapeMatch(A, B, proxy, t, tc, d, ra, rb, fillA, fillB, o = {}) {
  regTR(tc, d, o.name || '形状匹配', 3);
  if (t < tc - d / 2 || t > tc + d / 2) { proxy.style.display = 'none'; return false; }
  const e = tu(t, tc, d, o.ease || E.ioQt);
  proxy.style.display = 'block';
  const x = lerp(ra.x, rb.x, e), y = lerp(ra.y, rb.y, e), w = lerp(ra.w, rb.w, e), h = lerp(ra.h, rb.h, e), r = lerp(ra.r ?? 0, rb.r ?? 0, e);
  Object.assign(proxy.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', borderRadius: r + 'px' });
  proxy.firstChild.style.background = fillA; proxy.lastChild.style.background = fillB; proxy.lastChild.style.opacity = P(e, .35, .85).toFixed(3);
  place2(A, 1 + .04 * e, -21.6 * e, -21.6 * e, { o: 1 - P(e, 0, .45), b: 8 * e });
  place2(B, 1.04 - .04 * e, 21.6 * (e - 1), 21.6 * (e - 1), { o: P(e, .5, 1), b: 8 * (1 - e) });
  return true;
}
function ShapeProxy(parent) {
  return el('div', 'abs', '<div style="position:absolute;inset:0"></div><div style="position:absolute;inset:0"></div>', parent, { overflow: 'hidden', zIndex: 50, display: 'none' });
}
// ④ 前景遮挡：一块前景板（slab，放在 parent 顶层）从镜头前横扫过去，扫过画面中央时 A 换成 B，前后有视差
function foregroundWipe(A, B, slab, t, tc, d, o = {}) {
  regTR(tc, d, o.name || '前景遮挡', 6);
  if (t < tc - d / 2 || t > tc + d / 2) { slab.style.display = 'none'; return false; }
  const e = tu(t, tc, d, o.ease || E.ioC);
  slab.style.display = 'block';
  slab.style.transform = `translate(${lerp(1500, -1700, e).toFixed(1)}px,0) rotate(${o.rot ?? -14}deg)`;
  const half = e < .5;
  place2(A, 1, -160 * e, 0, { o: half ? 1 : 0 });
  place2(B, 1, 160 * (1 - e), 0, { o: half ? 0 : 1 });
  return true;
}
// ⑤ 景深转换：A 虚焦、略放大、淡出；B 从虚到实、从略小到正常
function focusPull(A, B, t, tc, d, o = {}) {
  regTR(tc, d, o.name || '景深转换', 2);
  if (t < tc - d / 2 || t > tc + d / 2) return false;
  const e = tu(t, tc, d, o.ease || E.ioS);
  const sa = 1 + .1 * e, sb = .9 + .1 * e;
  place2(A, sa, 540 - 540 * sa, 540 - 540 * sa, { o: 1 - P(e, .35, .75), b: 28 * P(e, 0, .6) });
  place2(B, sb, 540 - 540 * sb, 540 - 540 * sb, { o: P(e, .25, .65), b: 28 * (1 - P(e, .4, 1)) });
  return true;
}
// 当前时刻正在进行的转场（给装饰带显示）
function trAt(t, pad = .6) { return TR.find(x => t >= x.tc - x.d / 2 - pad && t <= x.tc + x.d / 2 + pad); }
