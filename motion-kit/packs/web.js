// =====================================================================
// motion-kit · packs/web.js —— 真实网页展示（配合 tools/capture.py 的截图）
// 坐标约定：截图像素（capture.py 是 2x，宽 2880）用 [sx, sy]；组件把它换算到父容器坐标。
// 定位不要猜：按钮、标题的位置查 a/web/名称_els.json 里的 rect。
//   const web = WebShot(sc.cam, { img: 'web/x_full.png', srcW: 2880, x: 50, y: 50, w: 980, h: 980, url: 'example.com', scroll: [[t0, 0], [t1, 1600]] });
//   const mk  = WebMark(web, [540, 190, 1800, 500], { t0: 16.0, t1: 16.6 });     // 在截图上框出一块
//   const [bx, by] = web.at(1620, 102, t);                                     // 截图点 → 父容器坐标（含滚动），给 Cursor / 镜头用
//   const crop = WebCrop(sc.cam, 'web/x_full.png', [1016, 70, 366, 63], { srcW: 2880, x: 100, y: 300, w: 880 });  // 只露出截图的一块
// =====================================================================
el('style', null, `
.web{position:absolute;overflow:hidden;background:#fff;border-radius:var(--web-radius,18px);box-shadow:0 30px 80px -20px rgba(20,30,60,.35),0 0 0 2px var(--line)}
.web .wbar{position:absolute;left:0;right:0;top:0;display:flex;align-items:center;gap:12px;padding:0 22px;background:#F2F1EE;border-bottom:2px solid var(--line)}
.web .wbar i{width:16px;height:16px;border-radius:50%;display:block}
.web .wurl{flex:1;margin:0 26px;height:40px;border-radius:20px;background:#fff;border:2px solid var(--line);display:flex;align-items:center;justify-content:center;font:600 22px Inter;color:#444;white-space:nowrap;overflow:hidden}
.web .wbody{position:absolute;left:0;right:0;bottom:0;overflow:hidden}
.web .wlayer{position:absolute;left:0;top:0;width:100%;transform-origin:0 0}
.web .wlayer img{width:100%;display:block}
.wmark{position:absolute;border:6px solid var(--accent);border-radius:8px;pointer-events:none}
`, document.head);

// 浏览器窗口 + 整页长图，可按时间滚动。o = {img, srcW, x, y, w, h, url, chrome(默认 true), barH, scroll:[[t, sy截图像素], ...], t0, t1}
function WebShot(parent, o) {
  const barH = o.chrome === false ? 0 : (o.barH ?? 64), w = o.w ?? 980, h = o.h ?? 980;
  const e = vboxOr(parent, 'web', `${barH ? `<div class="wbar" style="height:${barH}px"><i style="background:#FF5F57"></i><i style="background:#FEBC2E"></i><i style="background:#28C840"></i><div class="wurl">${o.url || ''}</div></div>` : ''}<div class="wbody" style="top:${barH}px"><div class="wlayer"><img src="${A}${o.img}"></div></div>`, o.x ?? 50, o.y ?? 50, w, h);
  const layer = e.querySelector('.wlayer'), k = w / (o.srcW || 2880), keys = o.scroll || [[0, 0]];
  const sy = t => camKeys(keys.map(([tt, y, ease]) => [tt, 0, y, 1, ease]), t)[1];
  const t0 = o.t0 ?? -1e9, t1 = o.t1 ?? 1e9;
  return {
    el: e, layer, k, barH,
    // 截图像素 → 父容器坐标（考虑滚动）
    at(sx, sy_, t) { return [(o.x ?? 50) + sx * k, (o.y ?? 50) + barH + (sy_ - sy(t)) * k]; },
    upd(t) {
      layer.style.transform = `translateY(${(-sy(t) * k).toFixed(2)}px)`;
      const kin = P(t, t0, t0 + .5, E.outQt), out = P(t, t1 - .3, t1, E.inC);
      if (o.t0 != null) set(e, { y: 80 * (1 - kin), s: .94 + .06 * kin, o: P(t, t0, t0 + .15) * (1 - out) });
    }
  };
}
// 在 WebShot 的截图上框出一块（跟着页面滚动）。rect = [sx, sy, sw, sh] 截图像素
function WebMark(web, rect, o = {}) {
  const [sx, sy, sw, sh] = rect, k = web.k;
  const m = el('div', 'wmark', null, web.layer, { left: sx * k + 'px', top: sy * k + 'px', width: sw * k + 'px', height: sh * k + 'px', borderColor: o.color || 'var(--accent)' });
  const t0 = o.t0 ?? 0, t1 = o.t1 ?? 1e9;
  return { el: m, upd(t) { const kk = P(t, t0, t0 + .3, E.outB); set(m, { s: 1.15 - .15 * kk, o: kk * (1 - P(t, t1 - .2, t1)) }); } };
}
// 只露出截图里的一块（按钮、输入框、数据卡），按目标宽度等比放大。crop = [sx, sy, sw, sh]，o = {srcW, x, y, w}
function WebCrop(parent, img, crop, o = {}) {
  const [sx, sy, sw, sh] = crop, w = o.w ?? 900, k = w / sw, h = sh * k;
  const e = vboxOr(parent, 'abs', '', o.x ?? (540 - w / 2), o.y ?? (540 - h / 2), w, h, { backgroundImage: `url(${A}${img})`, backgroundSize: `${(o.srcW || 2880) * k}px auto`, backgroundPosition: `${-sx * k}px ${-sy * k}px`, backgroundRepeat: 'no-repeat' });
  return { el: e, k, h, at(px, py) { return [(o.x ?? (540 - w / 2)) + (px - sx) * k, (o.y ?? (540 - h / 2)) + (py - sy) * k]; } };
}
// 横竖版通用的绝对定位盒子（vertical.js 没加载时也能用）
function vboxOr(parent, cls, html, x, y, w, h, style = {}) {
  return el('div', cls, html, parent, Object.assign({ left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' }, style));
}
// 卡片里播放视频素材：先 ffmpeg 拆成逐帧图（a/clip/001.jpg…），CONFIG.sprites = { clip: { dir:'clip', n:108, ext:'jpg' } }
// ClipPlayer(parent, 'clip', {x,y,w,h,t0,fps}) → 从 t0 开始播，播完停在最后一帧
function ClipPlayer(parent, name, o = {}) {
  const w = o.w ?? 900, h = o.h ?? 506, cv = el('canvas', null, null, parent, { position: 'absolute', left: (o.x ?? 90) + 'px', top: (o.y ?? 200) + 'px', width: w + 'px', height: h + 'px', background: '#000' });
  cv.width = o.cw ?? 1280; cv.height = Math.round(cv.width * h / w); const g = cv.getContext('2d'); const fps = o.fps ?? 30, t0 = o.t0 ?? 0;
  return { el: cv, upd(t) { const arr = SPR[name]; if (!arr || !arr.length) return; const i = clamp(Math.floor((t - t0) * fps) + (o.offset || 0), 0, arr.length - 1); g.drawImage(arr[i], 0, 0, cv.width, cv.height); } };
}
