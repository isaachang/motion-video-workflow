// =====================================================================
// motion-kit · shell/vframe-porcelain.js —— 9:16「白瓷」装饰带（vframe.js 的替代版，二选一引入）
// 浅色纸感底 + 细网格 + 标尺刻度 + 角标，标题墨黑，[[ ]] 强调色，{{ }} 荧光笔（会在 hl 时刻重扫）。
// CONFIG.vertical = { title:['第一行','[[重点]]，{{直接抄}}'], tag:'AI 工具', sub:'一句话说明', url:'EXAMPLE.COM',
//                     brand:{ logo:'logo.svg', h:66 } 或 { name:'品牌名' }, hl:[0.95, 28.4] }
// 冲击音时刻 window.IMPACTS（make_bgm.py 生成在 beats.js 里）会触发标题扫光。
// =====================================================================
(function () {
  const F = document.getElementById('vframe');
  const V = CONFIG.vertical || {}, DUR = CONFIG.duration || 60;
  const IMPACTS = window.IMPACTS || [];
  const HL_AT = V.hl || [0.95];
  el('style', null, `
#vframe{background:var(--bg2)}
.vf-grid{position:absolute;left:0;width:1080px;height:420px;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:60px 60px;background-position:0 0}
.vf-tag{position:absolute;left:540px;top:74px;translate:-50% 0;font:700 26px 'Noto Sans CJK SC';letter-spacing:8px;padding:10px 26px 10px 34px;border-radius:999px;border:2.5px solid var(--ink);color:var(--ink);background:var(--card);z-index:3}
.vf-title{position:absolute;left:0;top:146px;width:1080px;text-align:center;z-index:3}
.vf-tl{font:900 104px/1.18 'Noto Sans CJK SC';letter-spacing:2px;white-space:nowrap;color:var(--ink);position:relative}
.vf-k{color:var(--accent)}
.vf-hl{position:relative;display:inline-block;z-index:0}
.vf-hl i{position:absolute;left:-8px;right:-8px;bottom:12px;height:34px;background:var(--hi);z-index:-1;border-radius:4px;transform-origin:0 50%}
.vf-sheen{position:absolute;inset:0;background:linear-gradient(100deg,transparent 40%,rgba(255,255,255,.95) 50%,transparent 60%);mix-blend-mode:soft-light;pointer-events:none;-webkit-mask:linear-gradient(#000,#000)}
.vf-rule{position:absolute;left:0;width:1080px;height:2px;background:var(--ink);z-index:4}
.vf-ticks{position:absolute;left:0;width:1080px;height:14px;background-image:linear-gradient(90deg,var(--ink) 2px,transparent 2px);background-size:30px 14px;opacity:.32;z-index:4}
.vf-corner{position:absolute;width:54px;height:54px;border:0 solid var(--accent);z-index:4}
.vf-prog{position:absolute;left:60px;width:960px;top:1546px;height:6px;border-radius:3px;background:rgba(22,22,28,.1);z-index:4}
.vf-prog .f{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:var(--accent)}
.vf-prog .h{position:absolute;top:-7px;width:20px;height:20px;margin-left:-10px;border-radius:50%;background:var(--card);border:4px solid var(--accent)}
.vf-brand{position:absolute;left:0;width:1080px;top:1630px;display:flex;justify-content:center;z-index:3}
.vf-brand img{height:66px}
.vf-sub{position:absolute;left:0;width:1080px;top:1772px;text-align:center;font:500 30px 'Noto Sans CJK SC';letter-spacing:7px;color:var(--sub);z-index:3}
.vf-url{position:absolute;left:0;width:1080px;top:1830px;text-align:center;font:700 24px Inter;letter-spacing:6px;color:var(--accent);opacity:.85;z-index:3}
.vf-noise{position:absolute;inset:0;opacity:.32;mix-blend-mode:multiply;pointer-events:none;z-index:6}
`, document.head);

  el('div', 'vf-grid', null, F, { top: '0' });
  el('div', 'vf-grid', null, F, { top: '1500px' });
  const glow1 = el('div', 'abs', null, F, { left: '-160px', top: '-120px', width: '620px', height: '520px', borderRadius: '50%', background: 'var(--accent)', filter: 'blur(90px)', opacity: .16 });
  const glow2 = el('div', 'abs', null, F, { right: '-180px', top: '1500px', width: '640px', height: '520px', borderRadius: '50%', background: 'var(--accent2)', filter: 'blur(90px)', opacity: .16 });

  const tag = V.tag ? el('div', 'vf-tag', V.tag, F) : null;
  const fmt = s => s.replace(/\[\[(.+?)\]\]/g, '<span class="vf-k">$1</span>').replace(/\{\{(.+?)\}\}/g, '<span class="vf-hl"><i></i>$1</span>');
  const title = el('div', 'vf-title', (V.title || []).map(s => `<div class="vf-tl">${fmt(s)}</div>`).join(''), F);
  const tls = [...title.querySelectorAll('.vf-tl')];
  const hlBar = title.querySelector('.vf-hl i');
  const sheen = el('div', 'vf-sheen', null, title);

  el('div', 'vf-ticks', null, F, { top: '403px' });
  el('div', 'vf-rule', null, F, { top: '419px' });
  el('div', 'vf-rule', null, F, { top: '1499px' });
  el('div', 'vf-ticks', null, F, { top: '1503px' });
  const corners = [['left', 'top', 444], ['right', 'top', 444], ['left', 'bottom', 1422], ['right', 'bottom', 1422]].map(([h, v, y]) =>
    el('div', 'vf-corner', null, F, { [h]: '22px', top: y + 'px', ['border' + h[0].toUpperCase() + h.slice(1) + 'Width']: '4px', ['border' + v[0].toUpperCase() + v.slice(1) + 'Width']: '4px' }));

  const prog = el('div', 'vf-prog', '<div class="f"></div><div class="h"></div>', F);
  const pf = prog.querySelector('.f'), ph = prog.querySelector('.h');
  const B = V.brand || {};
  const brand = el('div', 'vf-brand', B.logo ? `<img src="${A}${B.logo}" style="height:${B.h || 66}px">` : `<span style="font:800 60px Inter,'Noto Sans CJK SC';color:var(--ink);letter-spacing:-1px">${B.name || ''}</span>`, F);
  const sub = V.sub ? el('div', 'vf-sub', V.sub, F) : null;
  const url = V.url ? el('div', 'vf-url', V.url, F) : null;
  el('div', 'vf-noise', `<svg width="1080" height="1920"><filter id="vfn"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .45 0 0 0 0 .4 0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#vfn)"/></svg>`, F);

  OVERLAYS.push(t => {
    tls.forEach((e, i) => { const k = P(t, .05 + i * .14, .7 + i * .14, E.outQt); set(e, { y: 34 * (1 - k), s: 1 + .004 * beatPulse(t, 8, KICKS), o: k, b: (1 - k) * 10 }); });
    if (tag) set(tag, { y: -16 * (1 - P(t, 0, .5, E.outC)), o: P(t, 0, .4) });
    if (hlBar) {
      let s = P(t, HL_AT[0], HL_AT[0] + .45, E.ioC);
      for (const a of HL_AT.slice(1)) if (t >= a && t < a + .6) s = P(t, a, a + .45, E.ioC);
      hlBar.style.transform = `scaleX(${s.toFixed(4)})`;
    }
    let sh = -1;
    for (const a of IMPACTS) if (t >= a && t < a + .7) sh = P(t, a, a + .7, E.ioQ);
    sheen.style.opacity = sh < 0 ? 0 : 1;
    sheen.style.backgroundPosition = '0 0';
    sheen.style.transform = `translateX(${lerp(-1080, 1080, Math.max(0, sh))}px)`;
    const pr = clamp(t / DUR); pf.style.width = (pr * 960) + 'px'; ph.style.left = (pr * 960) + 'px';
    const bk = P(t, .3, .9, E.outQt);
    set(brand, { y: 20 * (1 - bk), o: bk }); if (sub) set(sub, { o: P(t, .5, 1.1) }); if (url) set(url, { o: P(t, .7, 1.3) * .85 });
    corners.forEach((c, i) => set(c, { s: 1 + .25 * (1 - P(t, .1 + i * .05, .6 + i * .05, E.outB)), o: P(t, .1 + i * .05, .4 + i * .05) }));
    glow1.style.transform = `translate(${noise1(t * .2, 1) * 60}px,${noise1(t * .17, 4) * 30}px)`;
    glow2.style.transform = `translate(${noise1(t * .2, 7) * 60}px,${noise1(t * .17, 9) * 30}px)`;
  });
})();
