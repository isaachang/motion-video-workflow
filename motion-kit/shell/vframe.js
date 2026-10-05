// =====================================================================
// motion-kit · shell/vframe.js —— 9:16 上下装饰带（1080×1920）
// 结构固定：上 420px 标题带 / 中 1080×1080 内容窗 / 下 420px 信息带 + 进度条。
// 视觉按每支片的主题选 preset 并改配色，不要每支都用同一套。
// CONFIG.vertical = {
//   preset: 'night' | 'clean' | 'tech' | 'paper',
//   title: ['第一行', '第二行 [[重点]]'],   // [[ ]] = 强调色；{{ }} = 高亮黄
//   sub: '底部一句话说明', tag: '右上角小标签(可空)',
//   brand: { logo:'xx.svg', name:'名称' } // 片子主体（产品/话题）的标识，没有就省略
// }
// =====================================================================
(function () {
  const F = document.getElementById('vframe');
  const V = CONFIG.vertical || {}, preset = V.preset || 'night', DUR = CONFIG.duration || 60;
  const dark = preset === 'night' || preset === 'tech';
  const css = k => getComputedStyle(document.documentElement).getPropertyValue(k).trim();
  const AC = () => css('--accent'), AC2 = () => css('--accent2');
  F.style.background = dark ? '#050818' : css('--bg');
  const bg = el('canvas', null, null, F, { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px', zIndex: 0 });
  bg.width = 1080; bg.height = 1920; const g = bg.getContext('2d');
  const r = rng(808); const dots = []; for (let i = 0; i < 120; i++) dots.push([r() * 1080, r() < .5 ? r() * 410 : 1510 + r() * 410, r() * 1.6 + .4, r() * 6.28]);

  const fmt = s => s.replace(/\[\[(.+?)\]\]/g, `<span style="background:linear-gradient(90deg,var(--accent2),var(--accent));-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none;filter:drop-shadow(0 0 16px color-mix(in srgb,var(--accent) 60%,transparent))">$1</span>`).replace(/\{\{(.+?)\}\}/g, '<span style="color:var(--hi)">$1</span>');
  const tcol = dark ? '#fff' : 'var(--ink)', tsh = dark ? '0 0 28px color-mix(in srgb,var(--accent) 55%,transparent),0 4px 0 rgba(0,0,0,.35)' : 'none';
  const lines = (V.title || []).map((s, i) => `<div class="tl" style="font:900 ${V.titleSize || 74}px 'Noto Sans CJK SC';color:${tcol};letter-spacing:3px;text-align:center;${preset === 'paper' ? '' : 'transform:skewX(-8deg);'}margin-top:${i ? 6 : 0}px;text-shadow:${tsh}">${fmt(s)}</div>`).join('');
  const top = el('div', 'abs', lines, F, { left: '0', top: (V.titleTop ?? (V.title && V.title.length > 1 ? 170 : 220)) + 'px', width: '1080px', zIndex: 3, lineHeight: '1.22' });
  const tls = [...top.querySelectorAll('.tl')];
  if (V.tag) el('div', 'abs', V.tag, F, { right: '40px', top: '60px', zIndex: 3, font: "800 28px 'Noto Sans CJK SC'", padding: '8px 20px', borderRadius: '999px', color: '#fff', background: 'linear-gradient(90deg,var(--accent),var(--accent2))', letterSpacing: '3px' });

  const b = V.brand;
  el('div', 'abs', `${b ? `<div style="display:flex;align-items:center;justify-content:center;gap:18px">${b.logo ? `<img src="${A}${b.logo}" style="height:${b.logoH || 78}px">` : ''}${b.name ? `<div style="font:800 60px Inter,'Noto Sans CJK SC';color:${tcol};letter-spacing:-1px">${b.name}</div>` : ''}</div>` : ''}
    ${V.sub ? `<div style="margin-top:20px;text-align:center;font:500 30px 'Noto Sans CJK SC';letter-spacing:6px;color:${dark ? 'rgba(200,222,255,.72)' : 'var(--sub)'}">${V.sub}</div>` : ''}`,
    F, { left: '0', top: (b ? 1580 : 1640) + 'px', width: '1080px', zIndex: 3 });

  const lineCol = dark ? 'var(--accent2)' : 'var(--accent)';
  const frame = el('div', 'abs', `
    <div style="position:absolute;left:0;right:0;top:418px;height:3px;background:linear-gradient(90deg,transparent,${lineCol} 25%,${lineCol} 75%,transparent);box-shadow:0 0 18px 2px color-mix(in srgb,${lineCol} 70%,transparent)"></div>
    <div style="position:absolute;left:0;right:0;top:1499px;height:3px;background:linear-gradient(90deg,transparent,${lineCol} 25%,${lineCol} 75%,transparent);box-shadow:0 0 18px 2px color-mix(in srgb,${lineCol} 70%,transparent)"></div>
    ${preset !== 'paper' ? [['left', 'top'], ['right', 'top'], ['left', 'bottom'], ['right', 'bottom']].map(([h, v]) => `<i style="position:absolute;${h}:18px;${v}:${v === 'top' ? 438 : 438}px;width:46px;height:46px;border-${h}:4px solid ${dark ? 'rgba(255,255,255,.9)' : 'var(--accent)'};border-${v}:4px solid ${dark ? 'rgba(255,255,255,.9)' : 'var(--accent)'}"></i>`).join('') : ''}
    <div style="position:absolute;left:60px;right:60px;top:1530px;height:6px;border-radius:3px;background:${dark ? 'rgba(255,255,255,.12)' : 'var(--line)'}"><div class="pf" style="position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:linear-gradient(90deg,var(--accent),var(--accent2))"></div><div class="ph" style="position:absolute;top:-6px;width:18px;height:18px;margin-left:-9px;border-radius:9px;background:#fff;box-shadow:0 0 14px 3px color-mix(in srgb,var(--accent2) 90%,transparent)"></div></div>`,
    F, { left: '0', top: '0', width: '1080px', height: '1920px', zIndex: 4, pointerEvents: 'none' });
  const pf = frame.querySelector('.pf'), ph = frame.querySelector('.ph');

  function drawBg(t) {
    const ac = AC(), ac2 = AC2();
    if (dark) { const lg = g.createLinearGradient(0, 0, 0, 1920); lg.addColorStop(0, '#040716'); lg.addColorStop(.22, '#0A1640'); lg.addColorStop(.5, '#08102C'); lg.addColorStop(.78, '#0A1640'); lg.addColorStop(1, '#040716'); g.fillStyle = lg; }
    else { const lg = g.createLinearGradient(0, 0, 0, 1920); lg.addColorStop(0, css('--bg2')); lg.addColorStop(.5, css('--bg')); lg.addColorStop(1, css('--bg2')); g.fillStyle = lg; }
    g.fillRect(0, 0, 1080, 1920);
    // 弥散光斑
    g.globalCompositeOperation = dark ? 'lighter' : 'source-over';
    for (const [x, y, rr, c, a, sp] of [[200, 250, 380, ac, .3, .31], [880, 160, 340, ac2, .22, .23], [260, 1700, 400, ac2, .24, .27], [860, 1580, 420, ac, .28, .21]]) {
      const xx = x + Math.sin(t * sp + x) * 90, yy = y + Math.cos(t * sp * 1.3 + y) * 40;
      const gr = g.createRadialGradient(xx, yy, 0, xx, yy, rr); gr.addColorStop(0, c); gr.addColorStop(1, 'transparent');
      g.globalAlpha = dark ? a : a * .5; g.fillStyle = gr; g.fillRect(xx - rr, yy - rr, rr * 2, rr * 2);
    }
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    if (preset === 'night') { // 向外扩散的隧道框
      for (let i = 0; i < 7; i++) { const p0 = ((t * .22 + i / 7) % 1), k = Math.pow(p0, 1.6); const w = lerp(1100, 2300, k), h = lerp(1110, 2900, k); g.globalAlpha = (1 - p0) * .55 * Math.min(1, p0 * 6); g.strokeStyle = ac2; g.lineWidth = 2; g.beginPath(); g.roundRect(540 - w / 2, 960 - h / 2, w, h, 40 + 60 * k); g.stroke(); }
      g.globalAlpha = 1;
    }
    if (preset === 'tech') { // 上下透视网格
      g.strokeStyle = ac2; g.lineWidth = 1.5;
      for (const [y0, dirn] of [[420, -1], [1500, 1]]) {
        for (let i = -12; i <= 12; i++) { g.globalAlpha = .25; g.beginPath(); g.moveTo(540 + i * 50, y0); g.lineTo(540 + i * 200, y0 + dirn * 420); g.stroke(); }
        const off = (t * .5) % 1; for (let j = 0; j < 8; j++) { const z = (j + off) / 8; g.globalAlpha = .3 * z; const y = y0 + dirn * Math.pow(z, 2) * 420; g.beginPath(); g.moveTo(0, y); g.lineTo(1080, y); g.stroke(); }
      }
      g.globalAlpha = 1;
    }
    if (preset === 'clean' || preset === 'paper') { // 细网格纸 + 斜向色带
      g.strokeStyle = css('--line'); g.lineWidth = 1;
      for (let x = 0; x <= 1080; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 420); g.moveTo(x, 1500); g.lineTo(x, 1920); g.stroke(); }
      for (let y = 0; y <= 1920; y += 60) { if (y > 420 && y < 1500) continue; g.beginPath(); g.moveTo(0, y); g.lineTo(1080, y); g.stroke(); }
    }
    // 扫光线 + 光点
    for (let i = 0; i < 4; i++) { const y = i < 2 ? 70 + i * 300 : 1560 + (i - 2) * 300; const px = ((t * 260 + i * 400) % 1600) - 260; const gr = g.createLinearGradient(px - 220, 0, px + 220, 0); gr.addColorStop(0, 'transparent'); gr.addColorStop(.5, dark ? 'rgba(170,215,255,.55)' : ac); gr.addColorStop(1, 'transparent'); g.globalAlpha = dark ? 1 : .35; g.fillStyle = gr; g.fillRect(px - 220, y, 440, 2); }
    if (dark) for (const [x, y, s, p] of dots) { g.globalAlpha = .25 + .5 * Math.abs(Math.sin(t * 1.5 + p)); g.fillStyle = '#bfe0ff'; g.fillRect(x, y + Math.sin(t * .5 + p) * 6, s, s); }
    g.globalAlpha = 1;
  }
  OVERLAYS.push(t => {
    drawBg(t);
    tls.forEach((e, i) => { const k = P(t, i * .15, .6 + i * .15, E.outQt); e.style.opacity = k; e.style.transform = `translateY(${30 * (1 - k)}px) ${preset === 'paper' ? '' : 'skewX(-8deg)'} scale(${1 + .006 * beatPulse(t, 6)})`; e.style.filter = blurF((1 - k) * 10); });
    const pr = clamp(t / DUR); pf.style.width = (pr * 960) + 'px'; ph.style.left = (pr * 960) + 'px';
  });
})();
