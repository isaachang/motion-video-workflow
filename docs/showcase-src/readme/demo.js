// 运镜转场演示片：7 个镜头 × 6 种转场（0–30.4s）
el('style', null, `
.w{color:#fff;font-family:'Noto Sans CJK SC',Inter,sans-serif}
.g{color:#8A8F98}
.tile{position:absolute;border-radius:22px;background:#171A2A;border:1.5px solid #2A2F45;display:flex;align-items:center;justify-content:center;font:900 76px 'Noto Sans CJK SC';color:#E8EAF2}
.tl{position:absolute;font:700 26px Inter;color:#7C8CFF;letter-spacing:1px}
.card{position:absolute;border-radius:28px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.5)}
.pill{position:absolute;padding:14px 30px;border-radius:999px;font:700 34px Inter;color:#fff;background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.18);backdrop-filter:blur(8px);white-space:nowrap}
`, document.head);
const GRAD = ['linear-gradient(135deg,#5B7CFF,#B26BFF)', 'linear-gradient(135deg,#FF6B6B,#FFD93D)', 'linear-gradient(135deg,#00C2A8,#00E0FF)', 'linear-gradient(135deg,#FF8FAB,#A78BFA)', 'linear-gradient(135deg,#F9F871,#00C9A7)', 'linear-gradient(135deg,#38BDF8,#818CF8)', 'linear-gradient(135deg,#FB923C,#F472B6)', 'linear-gradient(135deg,#34D399,#3B82F6)', 'linear-gradient(135deg,#FACC15,#FB7185)'];
const ACC = 'linear-gradient(90deg,#6E8BFF,#B37BFF)';

const film = Scene('film', 0, 30.4);
const R = el('div', 'abs', null, film.el, { left: '420px', top: '0', width: '1080px', height: '1080px', overflow: 'hidden', background: '#000' });
const S = [1, 2, 3, 4, 5, 6, 7].map(i => Layer(R, ['#000', 'radial-gradient(ellipse at 50% 40%,#161A33,#0B0D18 70%)', '#07070B', 'radial-gradient(ellipse at 50% 50%,#121218,#000 70%)', '#000', 'radial-gradient(ellipse at 50% 40%,#17172A,#08080E 72%)', '#000'][i - 1]));
S[5].el.style.zIndex = 7; S[6].el.style.zIndex = 6;
S.forEach((L, i) => { L.cam = el('div', 'abs', null, L.el, { left: '0', top: '0', width: '1080px', height: '1080px', transformOrigin: '540px 540px' }); if (i < 5) L.el.style.zIndex = i + 1; });
const VIS = [[0, 5.05], [3.95, 9.35], [8.65, 13.98], [13.02, 18.45], [17.55, 22.98], [22.02, 30.4], [26.45, 30.4]];
const parts = [];
const add = c => (parts.push(c), c);

// ---------- 1 · 一段配音 ----------
{
  const C = S[0].cam;
  const bars = [...Array(44)].map((_, i) => el('div', 'abs', null, C, { left: (96 + i * 20.4) + 'px', top: '470px', width: '10px', height: '10px', borderRadius: '5px', background: ACC, transformOrigin: '50% 50%' }));
  const disc = el('div', 'abs', `<svg class="mic" width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>`, C, { left: '540px', top: '470px', width: '240px', height: '240px', marginLeft: '-120px', marginTop: '-120px', borderRadius: '50%', background: '#161A33', boxShadow: '0 0 0 6px #fff, 0 0 80px rgba(120,140,255,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' });
  const mic = disc.querySelector('.mic');
  const t1 = Chars(C, '一段配音', { y: 760, t0: 1.5, font: "900 112px 'Noto Sans CJK SC'", color: '#fff', stagger: .07 });
  const t2 = Chars(C, '就能开始', { y: 870, t0: 2.3, font: "700 46px 'Noto Sans CJK SC'", color: '#8A8F98', stagger: .05 });
  add({ upd(t) {
    if (t > 5.1) return;
    const g = P(t, 1.0, 1.6, E.outB), s = (24 + 216 * g) / 240;
    set(disc, { s: s * (1 + .06 * beatPulse(t, 9) * (1 - g)) });
    disc.style.boxShadow = `0 0 0 ${(6 / Math.max(s, .1)).toFixed(1)}px #fff, 0 0 80px rgba(120,140,255,${(.45 * g).toFixed(2)})`;
    mic.style.opacity = (P(t, 1.4, 1.7) * (1 - P(t, 3.7, 4.0))).toFixed(2);
    bars.forEach((b, i) => { const k = P(t, 1.2 + Math.abs(i - 21.5) * .012, 1.7 + Math.abs(i - 21.5) * .012, E.outQt); const h = 10 + k * (30 + 110 * Math.abs(noise1(t * 2.4 + i * .37, 3))) * (1 - Math.abs(i - 21.5) / 26); b.style.height = h + 'px'; b.style.marginTop = (-h / 2) + 'px'; b.style.opacity = (k * (1 - P(t, 3.6, 4.2))).toFixed(2); });
    t1.upd(t); t2.upd(t);
    S[0].cam.style.transform = `scale(${(1 + .03 * P(t, 0, 4.5)).toFixed(4)})`;
  } });
}
// ---------- 2 · 逐字听写 ----------
{
  const C = S[1].cam, chars = [...'说到哪个字都知道'], times = ['0.21', '0.43', '0.62', '0.80', '1.02', '1.25', '1.41', '1.66'];
  const head = Chars(C, '每个字都有时间', { y: 250, t0: 4.95, font: "900 92px 'Noto Sans CJK SC'", color: '#fff', stagger: .06 });
  const x0 = 540 - (8 * 104 + 7 * 14) / 2;
  const tiles = chars.map((ch, i) => { const e = el('div', 'tile', ch, C, { left: (x0 + i * 118) + 'px', top: '420px', width: '104px', height: '130px' }); const l = el('div', 'tl', times[i] + 's', C, { left: (x0 + i * 118 + 12) + 'px', top: '570px' }); return { e, l }; });
  const head2 = el('div', 'abs', null, C, { left: x0 + 'px', top: '400px', width: '4px', height: '230px', borderRadius: '2px', background: '#fff', boxShadow: '0 0 20px #8EA2FF' });
  const cap = Chars(C, '离线逐字听写 · 画面踩准每个字', { y: 880, t0: 6.6, font: "700 40px 'Noto Sans CJK SC'", color: '#8A8F98', stagger: .025 });
  add({ upd(t) {
    if (t < 3.9 || t > 9.4) return;
    head.upd(t); cap.upd(t);
    const ph = P(t, 5.6, 8.2, E.ioS), px = x0 + ph * (8 * 118 - 14);
    head2.style.left = px + 'px'; head2.style.opacity = P(t, 5.5, 5.7).toFixed(2);
    tiles.forEach(({ e, l }, i) => {
      const a = 5.2 + i * .12, k = P(t, a, a + .45, E.outB); set(e, { y: 40 * (1 - k), o: k }); set(l, { o: P(t, a + .2, a + .5) });
      const on = px > x0 + i * 118 + 20; e.style.background = on ? '#fff' : '#171A2A'; e.style.color = on ? '#0B0D18' : '#E8EAF2'; e.style.borderColor = on ? '#fff' : '#2A2F45';
    });
    S[1].cam.style.transform = `scale(${(1.04 - .04 * P(t, 4.5, 9, E.outC)).toFixed(4)})`;
  } });
}
// ---------- 3 · 分镜墙 ----------
const CARD = 250, GAP = 30, G0 = 540 - (3 * CARD + 2 * GAP) / 2;
{
  const C = S[2].cam;
  const cards = [...Array(9)].map((_, i) => el('div', 'card', `<div style="position:absolute;inset:0;background:${GRAD[i]}"></div><div style="position:absolute;left:22px;top:18px;font:800 30px Inter;color:rgba(255,255,255,.9)">${String(i + 1).padStart(2, '0')}</div><div style="position:absolute;left:22px;right:22px;bottom:26px;height:12px;border-radius:6px;background:rgba(255,255,255,.55)"></div><div style="position:absolute;left:22px;width:60%;bottom:48px;height:12px;border-radius:6px;background:rgba(255,255,255,.35)"></div>`, C, { left: (G0 + (i % 3) * (CARD + GAP)) + 'px', top: (G0 + Math.floor(i / 3) * (CARD + GAP)) + 'px', width: CARD + 'px', height: CARD + 'px' }));
  const ring = el('div', 'abs', null, C, { left: (G0 + CARD + GAP - 10) + 'px', top: (G0 + CARD + GAP - 10) + 'px', width: (CARD + 20) + 'px', height: (CARD + 20) + 'px', borderRadius: '36px', border: '6px solid #fff', opacity: 0 });
  const cap = Chars(C, '一屏只讲一个信息', { y: 1028, t0: 10.0, font: "700 40px 'Noto Sans CJK SC'", color: '#8A8F98', stagger: .03 });
  add({ upd(t) {
    if (t < 8.6 || t > 14) return;
    cap.upd(t);
    const k = P(t, 12.2, 12.7, E.outB);
    cards.forEach((c, i) => { const ctr = i === 4; set(c, { s: ctr ? 1 + .06 * k : 1 - .04 * k, o: ctr ? 1 : 1 - .65 * k }); });
    set(ring, { s: 1 + .06 * k, o: k });
    S[2].cam.style.transform = `scale(${(1 + .06 * P(t, 9, 13.5, E.ioS)).toFixed(4)})`;
  } });
}
// ---------- 4 · 手机里播放代码动画 ----------
const PH = { x: 330, y: 110, w: 420, h: 860 }, SCR = { x: 348, y: 128, w: 384, h: 824, r: 48 };
{
  const C = S[3].cam;
  el('div', 'abs', null, C, { left: PH.x + 'px', top: PH.y + 'px', width: PH.w + 'px', height: PH.h + 'px', borderRadius: '66px', background: '#1A1A1E', boxShadow: 'inset 0 0 0 2px #3A3A40, 0 40px 90px rgba(0,0,0,.6)' });
  const scr = el('div', 'abs', `<canvas width="384" height="824" style="position:absolute;inset:0"></canvas><div style="position:absolute;left:0;right:0;bottom:120px;text-align:center;font:800 64px Inter;color:#fff;letter-spacing:-2px">60<span style="font-size:28px;color:#9AA0AA;margin-left:6px">fps</span></div><div class="pb" style="position:absolute;left:40px;bottom:80px;height:6px;border-radius:3px;background:#fff"></div><div style="position:absolute;left:150px;top:18px;width:84px;height:26px;border-radius:13px;background:#000"></div>`, C, { left: SCR.x + 'px', top: SCR.y + 'px', width: SCR.w + 'px', height: SCR.h + 'px', borderRadius: SCR.r + 'px', overflow: 'hidden', background: '#0B0B10' });
  const g = scr.querySelector('canvas').getContext('2d'), pb = scr.querySelector('.pb');
  const pills = [['HTML', 120, 300, -1], ['CSS 3D', 800, 500, 1], ['Canvas', 110, 700, -1]].map(([s, x, y, side], i) => ({ e: el('div', 'pill', s, C, { left: x + 'px', top: y + 'px' }), t0: 14.6 + i * .35, side }));
  const cap = Chars(C, '代码画出每一帧', { y: 1032, t0: 15.4, font: "700 40px 'Noto Sans CJK SC'", color: '#8A8F98', stagger: .03 });
  add({ upd(t) {
    if (t < 13 || t > 18.5) return;
    g.canvas.style.opacity = P(t, 13.85, 14.3).toFixed(2);
    g.clearRect(0, 0, 384, 824);
    for (let i = 0; i < 7; i++) { const r = 40 + i * 26, a = t * (1.2 - i * .1) + i; g.save(); g.translate(192, 380); g.rotate(a); const gr = g.createLinearGradient(-r, 0, r, 0); gr.addColorStop(0, '#5B7CFF'); gr.addColorStop(1, '#FF6FB5'); g.strokeStyle = gr; g.lineWidth = 10; g.globalAlpha = .9 - i * .09; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * (1.1 + .1 * i)); g.stroke(); g.restore(); }
    pb.style.width = (304 * ((t - 13.5) / 4.5 % 1)) + 'px';
    pills.forEach(p => { const k = P(t, p.t0, p.t0 + .45, E.outB); set(p.e, { x: -60 * p.side * (1 - k), o: k }); });
    cap.upd(t);
    S[3].cam.style.transform = `scale(${(1 + .03 * P(t, 13.5, 18)).toFixed(4)})`;
  } });
}
// ---------- 5 · 60 帧 ----------
{
  const C = S[4].cam;
  const strip = y => { const s = el('div', 'abs', null, C, { left: '0', top: y + 'px', width: '3600px', height: '120px', opacity: .55 }); for (let i = 0; i < 20; i++) el('div', 'card', `<div style="position:absolute;inset:0;background:${GRAD[i % 9]}"></div>`, s, { left: (i * 190) + 'px', top: '0', width: '170px', height: '120px', borderRadius: '14px' }); return s; };
  const s1 = strip(150), s2 = strip(810);
  const big = el('div', 'abs', '60', C, { left: '540px', top: '470px', translate: '-50% -50%', font: '800 440px/1 Inter', color: '#fff', letterSpacing: '-20px' });
  const unit = el('div', 'abs', '帧 / 秒 · 逐帧渲染', C, { left: '540px', top: '690px', translate: '-50% 0', font: "700 44px 'Noto Sans CJK SC'", color: '#8A8F98', whiteSpace: 'nowrap' });
  const ctr = el('div', 'abs', '', C, { left: '540px', top: '990px', translate: '-50% 0', font: '600 30px Menlo,monospace', color: '#6E8BFF', letterSpacing: '3px' });
  add({ upd(t) {
    if (t < 17.5 || t > 23) return;
    s1.style.transform = `translateX(${(-(t - 17.5) * 260).toFixed(1)}px)`; s2.style.transform = `translateX(${(-1200 + (t - 17.5) * 260).toFixed(1)}px)`;
    const k = P(t, 18.2, 18.8, E.outQt); set(big, { s: .85 + .15 * k * kickScale(t, .02), o: P(t, 18.0, 18.3) }); set(unit, { y: 30 * (1 - P(t, 18.6, 19.0, E.outQt)), o: P(t, 18.6, 18.9) });
    ctr.textContent = 'FRAME ' + String(Math.floor(Math.max(0, t - 18) * 60)).padStart(4, '0') + ' / 1800';
  } });
}
// ---------- 6 · 封面悬浮 ----------
{
  const C = S[5].cam;
  const stage3 = el('div', 'abs', null, C, { left: '0', top: '0', width: '1080px', height: '1080px', perspective: '1400px' });
  const mk = (x, y, w, h, gi, label, ry) => { const e = el('div', 'card', `<div style="position:absolute;inset:0;background:${GRAD[gi]}"></div><div style="position:absolute;left:28px;top:26px;font:900 ${Math.round(w * .2)}px 'Noto Sans CJK SC';color:#fff;line-height:1.05">封面<br><span style="font:800 ${Math.round(w * .09)}px Inter;opacity:.85">${label}</span></div>`, stage3, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' }); return { e, ry }; };
  const covers = [mk(110, 300, 300, 400, 0, '3 : 4', 20), mk(640, 340, 360, 270, 6, '4 : 3', -18), mk(440, 230, 200, 356, 2, '9 : 16', 0)];
  covers[2].e.style.zIndex = 3;
  const cap = Chars(C, '成片和封面，一次交付', { y: 900, t0: 23.6, font: "700 44px 'Noto Sans CJK SC'", color: '#C9CCD6', stagger: .03 });
  add({ upd(t) {
    if (t < 22) return;
    covers.forEach((c, i) => { c.e.style.transform = `translateY(${(Math.sin(t * 1.3 + i * 2) * 14).toFixed(1)}px) rotateY(${(c.ry + Math.sin(t * .8 + i) * 4).toFixed(2)}deg) rotateX(${(6 + Math.cos(t * .9 + i) * 3).toFixed(2)}deg)`; });
    cap.upd(t);
  } });
}
// ---------- 7 · 定版 ----------
const SLOT = { x: 410, y: 210, w: 260, h: 260, r: 60 };
{
  const C = S[6].cam;
  el('div', 'abs', null, C, { left: (SLOT.x - 40) + 'px', top: (SLOT.y + 60) + 'px', width: (SLOT.w + 80) + 'px', height: (SLOT.h) + 'px', borderRadius: '50%', background: 'radial-gradient(closest-side,rgba(120,130,255,.55),transparent)', filter: 'blur(30px)' });
  const nm = el('div', 'abs', 'Motion Kit', C, { left: '540px', top: '560px', translate: '-50% 0', font: '800 120px Inter', color: '#fff', letterSpacing: '-3px', whiteSpace: 'nowrap' });
  const sub = el('div', 'abs', '一段配音，一支动效片', C, { left: '540px', top: '715px', translate: '-50% 0', font: "700 48px 'Noto Sans CJK SC'", color: '#9AA0AA', whiteSpace: 'nowrap' });
  const url = el('div', 'abs', 'github.com/isaachang/motion-video-workflow', C, { left: '540px', top: '820px', translate: '-50% 0', font: '600 26px Inter', color: '#6B7280', whiteSpace: 'nowrap' });
  add({ upd(t) {
    if (t < 26.4) return;
    set(nm, { y: 40 * (1 - P(t, 27.3, 27.9, E.outQt)), o: P(t, 27.3, 27.7) });
    set(sub, { y: 30 * (1 - P(t, 27.6, 28.2, E.outQt)), o: P(t, 27.6, 28.0) });
    set(url, { o: P(t, 28.1, 28.6) * .9 });
  } });
}

// ---------- 转场编排 ----------
const proxy = ShapeProxy(R), slab = el('div', 'abs', null, R, { left: '-200px', top: '-400px', width: '1500px', height: '1900px', borderRadius: '120px', background: 'linear-gradient(120deg,rgba(110,139,255,.95),rgba(179,123,255,.95))', boxShadow: '0 0 0 2px rgba(255,255,255,.35) inset, 0 0 120px rgba(140,120,255,.6)', zIndex: 60, display: 'none' });
const CTR = { x: 540 - (CARD * 1.06 * 1.06) / 2, y: 540 - (CARD * 1.06 * 1.06) / 2, w: CARD * 1.06 * 1.06, h: CARD * 1.06 * 1.06, r: 30 };
film.upd = t => {
  S.forEach((L, i) => { const [a, b] = VIS[i]; show(L.el, t >= a && t <= b); });
  S.forEach(resetL);
  pushThrough(S[0], S[1], t, 4.5, 1.0, { x: 420, y: 350, w: 240, h: 240, r: 120 });
  whipPan(S[1], S[2], t, 9.0, .7, -1);
  shapeMatch(S[2], S[3], proxy, t, 13.5, .95, CTR, SCR, GRAD[4], '#0B0B10');
  foregroundWipe(S[3], S[4], slab, t, 18.0, .9);
  focusPull(S[4], S[5], t, 22.5, .95);
  pullOut(S[5], S[6], t, 27.0, 1.1, SLOT);
  parts.forEach(p => p.upd(t));
};
