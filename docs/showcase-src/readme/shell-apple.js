// 9:16 黑色装饰带：顶部标题，底部显示当前转场 + 带转场刻度的进度条
(function () {
  const F = document.getElementById('vframe'), DUR = CONFIG.duration;
  F.style.background = '#000';
  el('style', null, `.ap-t{position:absolute;left:0;width:1080px;text-align:center;color:#fff}
  .ap-line{position:absolute;left:60px;width:960px;height:1px;background:#1E1E24;z-index:4}`, document.head);
  const t1 = el('div', 'ap-t', '运镜转场', F, { top: '150px', font: "900 100px/1 'Noto Sans CJK SC'", letterSpacing: '6px' });
  const t2 = el('div', 'ap-t', 'APPLE-STYLE CAMERA TRANSITIONS', F, { top: '290px', font: '600 24px Inter', letterSpacing: '9px', color: '#6B7280' });
  el('div', 'ap-line', null, F, { top: '419px' }); el('div', 'ap-line', null, F, { top: '1500px' });
  const idx = el('div', 'ap-t', '', F, { top: '1570px', font: '700 30px Inter', letterSpacing: '6px', color: '#8E9BFF' });
  const nm = el('div', 'ap-t', '', F, { top: '1620px', font: "900 76px/1 'Noto Sans CJK SC'" });
  const bar = el('div', 'abs', '<div class="f" style="position:absolute;left:0;top:0;bottom:0;background:#fff;border-radius:2px"></div>', F, { left: '90px', top: '1790px', width: '900px', height: '4px', borderRadius: '2px', background: '#26262C', zIndex: 4 });
  const fill = bar.querySelector('.f');
  const ticks = [];
  INITS.push(() => { TR.forEach((r, i) => ticks.push(el('div', 'abs', null, bar, { left: (r.tc / DUR * 900 - 6) + 'px', top: '-4px', width: '12px', height: '12px', borderRadius: '50%', background: '#26262C', border: '2px solid #000' }))); });
  const foot = el('div', 'ap-t', 'Motion Kit · 30 秒演示', F, { top: '1830px', font: "500 26px 'Noto Sans CJK SC'", color: '#4B5060', letterSpacing: '4px' });
  OVERLAYS.push(t => {
    const k = P(t, .1, .7, E.outQt); set(t1, { y: 30 * (1 - k), o: k }); set(t2, { o: P(t, .4, .9) });
    const cur = trAt(t, .5); const i = cur ? TR.indexOf(cur) : -1;
    const ki = cur ? P(t, cur.tc - cur.d / 2 - .5, cur.tc - cur.d / 2 - .2, E.outQt) * (1 - P(t, cur.tc + cur.d / 2 + .25, cur.tc + cur.d / 2 + .5)) : 0;
    if (cur) { idx.textContent = `TRANSITION ${String(i + 1).padStart(2, '0')} / ${String(TR.length).padStart(2, '0')}`; nm.textContent = cur.name; }
    set(idx, { o: ki, y: 14 * (1 - ki) }); set(nm, { o: ki, y: 20 * (1 - ki) });
    fill.style.width = (clamp(t / DUR) * 900) + 'px';
    ticks.forEach((d, j) => { const on = t >= TR[j].tc - TR[j].d / 2; d.style.background = on ? '#fff' : '#26262C'; d.style.transform = `scale(${j === i ? 1.5 : 1})`; });
  });
})();
