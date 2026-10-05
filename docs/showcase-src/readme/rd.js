// README 演示：#say 配音逐字驱动  #web 真实网页 1:1
const MODE = location.hash.slice(1) || 'say';
const sc = VShot('rd', 0, 10, MODE === 'say' ? 'radial-gradient(ellipse at 50% 30%,#151A33,#07080F 70%)' : '#0B0C12');
const C = sc.cam, R = sc.R, parts = [];
if (MODE === 'say') {
  const lab = el('div', 'abs', '配音 · 逐字时间轴', R, { left: '60px', top: '70px', font: "700 34px 'Noto Sans CJK SC'", color: '#8A8F98', letterSpacing: '3px' });
  const bars = [...Array(64)].map((_, i) => el('div', 'abs', null, R, { left: (60 + i * 15) + 'px', top: '240px', width: '8px', borderRadius: '4px', background: 'linear-gradient(#6E8BFF,#B37BFF)' }));
  const toks = [['比', 21.15], ['如', 21.27], ['这', 21.45], ['全', 21.69], ['网', 21.81], ['爆', 22.11], ['火', 22.23], ['4', 22.59], ['万', 22.83], ['多', 23.01], ['播', 23.19], ['放', 23.31]];
  const T0 = 21.0, K = 1.25, tt = rt => .3 + (rt - T0) * K;            // 真实时间 → 动画时间
  const X0 = 60, TW = 72, GAP = 8;
  const tiles = toks.map(([ch, rt], i) => {
    const x = X0 + i * (TW + GAP);
    const e = el('div', 'abs', ch, R, { left: x + 'px', top: '400px', width: TW + 'px', height: '92px', borderRadius: '16px', background: '#171A2A', border: '2px solid #2A2F45', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "900 48px 'Noto Sans CJK SC',Inter", color: '#E8EAF2' });
    const l = el('div', 'abs', rt.toFixed(2), R, { left: x + 'px', top: '506px', width: TW + 'px', textAlign: 'center', font: '700 20px Inter', color: '#7C8CFF' });
    return { e, l, x, at: tt(rt) };
  });
  const ph = el('div', 'abs', null, R, { left: '60px', top: '200px', width: '4px', height: '330px', borderRadius: '2px', background: '#fff', boxShadow: '0 0 18px #8EA2FF' });
  const hit = tt(22.59);
  const big = el('div', 'abs', '48.7K', R, { left: '540px', top: '700px', translate: '-50% -50%', font: '800 210px/1 Inter', color: '#fff', letterSpacing: '-6px' });
  const bl = el('div', 'abs', '浏览', R, { left: '540px', top: '806px', translate: '-50% 0', font: "800 40px 'Noto Sans CJK SC'", color: '#8A8F98' });
  const code = el('div', 'abs', `<span style="color:#7EE787">say</span>(<span style="color:#FFB86B">'4万'</span>)&nbsp;&nbsp;<span style="color:#6B7280">→</span>&nbsp;&nbsp;<b style="color:#fff">22.59s</b>`, R, { left: '540px', top: '930px', translate: '-50% 0', padding: '18px 36px', borderRadius: '18px', background: '#161A2E', border: '1.5px solid #2A2F45', font: '600 40px Menlo,monospace', color: '#C9D1D9', whiteSpace: 'nowrap' });
  parts.push({ upd(t) {
    const px = lerp(X0, X0 + 12 * (TW + GAP), clamp((t - .3) / ((23.5 - T0) * K)));
    ph.style.left = px + 'px';
    bars.forEach((b, i) => { const h = 16 + 120 * Math.abs(noise1(t * 3 + i * .41, 7)) * (1 - Math.abs(i - 32) / 40); b.style.height = h + 'px'; b.style.top = (290 - h / 2) + 'px'; b.style.opacity = (60 + i * 15 < px ? 1 : .35).toFixed(2); });
    tiles.forEach(({ e, x, at }, i) => { const on = t >= at; const key = i === 7 || i === 8; e.style.background = on ? (key ? 'linear-gradient(135deg,#6E8BFF,#B37BFF)' : '#fff') : '#171A2A'; e.style.color = on ? (key ? '#fff' : '#0B0D18') : '#E8EAF2'; e.style.borderColor = on ? 'transparent' : '#2A2F45'; set(e, { s: 1 + .18 * bump(t, at, at + .06, at + .3) }); });
    const k = P(t, hit, hit + .22, E.outQt); set(big, { s: 1.7 - .7 * k, o: P(t, hit, hit + .05), b: (1 - k) * 8 }); set(bl, { o: P(t, hit + .15, hit + .35) });
    set(code, { y: 30 * (1 - P(t, hit + .25, hit + .55, E.outQt)), o: P(t, hit + .25, hit + .45) });
    FLASHES.length || FLASHES.push([hit, .18, .2]);
  } });
} else {
  const web = WebShot(C, { img: 'web/gh_full.png', srcW: 2880, x: 60, y: 60, w: 960, h: 960, url: 'github.com/isaachang/motion-video-workflow', scroll: [[0, 0], [1.0, 0], [2.1, 2560, E.ioQt]] });
  const mk = WebMark(web, [300, 2790, 1660, 700], { t0: 2.35 });
  const cur = Cursor(C, { keys: [[1.0, 820, 860], [2.3, 560, 700], [2.5, 560, 700, true]], size: 54 });
  const cap = el('div', 'abs', '真实网页 1:1 还原 · 自动关掉弹窗 · 按坐标精确框选', R, { left: '540px', top: '985px', translate: '-50% 0', padding: '14px 30px', borderRadius: '999px', background: 'rgba(10,11,18,.85)', border: '1.5px solid #2A2F45', font: "700 30px 'Noto Sans CJK SC'", color: '#E8EAF2', whiteSpace: 'nowrap', zIndex: 5 });
  parts.push(web, mk, cur, { upd(t) {
    const [cx, cy] = web.at(1130, 3140, t);
    vcam(C, camKeys([[0, 540, 540, 1], [2.6, 540, 540, 1], [3.6, cx, cy + 40, 1.32, E.ioX]], t));
    set(cap, { o: P(t, .3, .6) });
  } });
}
sc.upd = t => parts.forEach(p => p.upd(t));
