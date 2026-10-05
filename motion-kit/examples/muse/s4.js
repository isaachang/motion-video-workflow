// ===================== G: contrast + dissolve (47.05 - 54.9) =====================
{
  const S = Scene('G', 47.13, 54.95, 20);
  S.el.innerHTML = `<div class="bgMuse"></div><div class="left abs" style="left:0;top:0;width:960px;height:1080px;background:#E4E5EA;overflow:hidden"></div><div class="right abs" style="left:960px;top:0;width:960px;height:1080px;overflow:hidden"></div><div class="div abs" style="left:958px;top:0;width:4px;height:1080px;background:linear-gradient(#fff0,#fff,#fff0)"></div>`;
  const left = S.el.querySelector('.left'), right = S.el.querySelector('.right'), dv = S.el.querySelector('.div');
  const gw = el('div', 'abs', null, S.el, { left: '0', top: '0', width: '1920px', height: '1080px' });
  gw.appendChild(left); gw.appendChild(right); gw.appendChild(dv);
  // left: generic chatbot
  const lcam = el('div', 'abs', null, left, { left: '0', top: '0', width: '960px', height: '1080px' });
  const lab = el('div', 'pill', `<span class="pi" style="background:#E9EAEE;font-size:30px;color:#8a8f9c;width:66px;height:66px">✦</span><span style="color:#5d6272">普通 AI 助手</span>`, lcam, { left: '110px', top: '58px', boxShadow: 'none', background: '#F4F4F6', font: "600 44px Inter,'Noto Sans CJK SC'", padding: '12px 34px 12px 12px' });
  const bot = el('div', 'card', `
    <div style="height:70px;display:flex;align-items:center;gap:12px;padding:0 28px;border-bottom:1px solid #EEEFF2;font:600 22px Inter;color:#7b7f8a"><span style="font-size:24px">✦</span>AI Chat</div>
    <div style="position:absolute;right:28px;top:96px;background:#DCE1EA;color:#2b2f38;border-radius:24px 24px 8px 24px;padding:14px 24px;font:500 34px 'Noto Sans CJK SC'" class="uq">航班取消了怎么办？</div>`, lcam, { left: '100px', top: '180px', width: '770px', height: '800px', boxShadow: '0 20px 60px rgba(0,0,0,.08)' });
  const uq = bot.querySelector('.uq');
  const ans = el('canvas', 'abs', null, bot, { left: '28px', top: '196px', width: '660px', height: '460px' });
  ans.width = 1320; ans.height = 920; const actx = ans.getContext('2d');
  const inp = el('div', 'abs', `<span style="flex:1">Ask anything</span><span class="cur" style="display:inline-block;width:3px;height:34px;background:#555"></span>`, bot, { left: '28px', right: '28px', bottom: '28px', height: '76px', borderRadius: '38px', background: '#F3F4F6', display: 'flex', alignItems: 'center', padding: '0 30px', font: "400 30px Inter", color: '#9aa0ad' });
  const cur = inp.querySelector('.cur');
  const LINES = ['航班取消后，你可以：', '1. 联系航空公司客服改签或退票', '2. 查看航司官网的改签政策', '3. 留意官方短信和邮件通知', '4. 必要时考虑其他航班…'];
  const TOT = LINES.join('').length;
  function drawAns(nchars, clipX = 0) {
    actx.clearRect(0, 0, 1320, 920);
    actx.fillStyle = '#EFF0F3'; actx.beginPath(); actx.roundRect(0, 0, 1320, 920, [48, 48, 48, 14]); actx.fill();
    actx.fillStyle = '#3a3e48'; actx.textBaseline = 'top';
    let left = nchars;
    LINES.forEach((ln, i) => { if (left <= 0) return; const s = ln.slice(0, left); left -= ln.length; actx.font = (i === 0 ? '600 ' : '400 ') + '60px "Noto Sans CJK SC"'; actx.fillText(s, 56, 56 + i * 166); });
    if (clipX > 0) actx.clearRect(0, 0, clipX * 2, 920);
  }
  // right: Muse action chain
  const rcam = el('div', 'abs', null, right, { left: '-960px', top: '0', width: '1920px', height: '1080px' });
  const rbg = el('div', 'bgMuse', null, rcam);
  const rlab = el('div', 'pill', `<span class="pi" style="background:#fff;width:66px;height:66px">${museSVG(48)}</span>Muse AI 助手`, rcam, { left: '1270px', top: '58px', font: "600 44px Inter,'Noto Sans CJK SC'", padding: '12px 34px 12px 12px' });
  const glowR = el('div', 'abs', null, rcam, { left: '1022px', top: '108px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(rgba(90,170,255,.5),rgba(90,170,255,0) 70%)' });
  const line = el('div', 'abs', null, rcam, { left: '1169px', top: '330px', width: '6px', height: '0px', borderRadius: '3px', background: 'linear-gradient(#0064E0,#18A0FF)' });
  const mas = el('div', 'abs', null, rcam, { left: '1110px', top: '196px', width: '124px', height: '124px', borderRadius: '62px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(30,70,160,.25),0 0 0 6px #fff' });
  const mav = Avatar(mas, 124, 'hw');
  const NODES = [['🔔', '23:47 发现航班取消', '#FFF3E0'], ['💬', '联系美联航在线客服', '#EEF3FE'], ['📞', '提醒你同步拨打电话', '#E6F7EE'], ['✅', '改签完成 · 10月2日', '#E6F7EE']];
  const NT = V ? [48.62, 48.95, 49.3, 49.62] : [47.62, 48.07, 48.51, 48.9];
  const nodes = NODES.map(([ic, tx, bg], i) => el('div', 'abs', `<div class="emoji" style="width:92px;height:92px;border-radius:46px;background:${bg};display:flex;align-items:center;justify-content:center;font-size:44px;box-shadow:0 0 0 7px #fff,0 10px 30px rgba(30,60,140,.15);flex:none">${ic}</div><div style="background:#fff;border-radius:26px;padding:18px 30px;font:600 40px 'Noto Sans CJK SC';box-shadow:0 12px 36px rgba(30,60,140,.12);white-space:nowrap">${tx}</div>`, rcam, { left: '1126px', top: (352 + i * 168) + 'px', display: 'flex', alignItems: 'center', gap: '26px', transformOrigin: '46px 46px' }));
  // particles overlay for dissolve
  const pc = el('canvas', null, null, S.el, { position: 'absolute', inset: '0', width: '1920px', height: '1080px', pointerEvents: 'none' });
  pc.width = 1920; pc.height = 1080; const pctx = pc.getContext('2d');
  let parts = null;
  const T_DIS = 53.5;
  function buildParts() {
    drawAns(TOT);
    const id = actx.getImageData(0, 0, 1320, 920).data;
    const r0 = ans.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    const r = { left: r0.left - sr.left, top: r0.top - sr.top, width: r0.width, height: r0.height };
    const sx = r.width / 1320, sy = r.height / 920;
    const rr = rng(71); parts = [];
    for (let y = 0; y < 920; y += 6) for (let x = 0; x < 1320; x += 6) {
      const i = (y * 1320 + x) * 4; if (id[i + 3] < 40) continue;
      const dark = id[i] < 160; if (!dark && rr() > 0.33) continue;
      parts.push({ x: r.left + x * sx, y: r.top + y * sy, c: dark ? '#3a3e48' : '#D9DBE1', s: (dark ? 3.2 : 4) * sx * 2, d: x / 1320 * 0.55 + rr() * 0.12, vx: 300 + rr() * 700, vy: -150 - rr() * 400, ph: rr() * 6, lx: x });
    }
  }
  S.upd = (t) => {
    // split reveal
    const kL = P(t, 47.13, 47.68, E.outQt), kR = P(t, 47.2, 47.75, E.outQt);
    set(lcam, { x: -500 * (1 - kL) });
    set(rcam, { x: 500 * (1 - kR) });
    dv.style.transform = `scaleY(${P(t, 47.05, 47.5, E.outC)})`;
    // G2: move to left answer
    const kf = P(t, 51.3, 52.3, E.ioQt);
    left.style.width = lerp(960, 1920, kf) + 'px';
    right.style.left = lerp(960, 1920, kf) + 'px';
    dv.style.left = lerp(958, 1930, kf) + 'px';
    left.style.background = `rgb(${Math.round(lerp(228, 238, kf))},${Math.round(lerp(229, 240, kf))},${Math.round(lerp(234, 245, kf))})`;
    set(bot, { x: (V ? 0 : 480) * kf, y: -60 * kf, s: 1 + 0.28 * kf });
    bot.style.transformOrigin = '370px 350px';
    const dim = P(t, 49.3, 49.7, E.ioC) * (1 - kf);
    lcam.style.filter = dim > 0.01 ? `grayscale(1) opacity(${1 - 0.35 * dim})` : 'grayscale(1)';
    set(lab, { o: (1 - kf) * P(t, 47.3, 47.6, E.lin) });
    const wob = t > 50.4 && t < 51.0 ? Math.sin((t - 50.4) * 30) * 4 * (1 - (t - 50.4) / 0.6) : 0;
    set(uq, { s: SP(t - 47.62, 1.3, 6), r: wob * 0.3 });
    const nch = Math.floor(TOT * P(t, 47.95, 49.3, E.lin));
    const dis = P(t, T_DIS, T_DIS + 1.2, E.lin);
    if (t < T_DIS) { drawAns(nch); parts = null; pctx.clearRect(0, 0, 1920, 1080); }
    else {
      if (!parts) buildParts();
      const lt = t - T_DIS;
      const front = (lt / 0.62) * 1320;
      drawAns(TOT, Math.min(660, front / 2));
      pctx.clearRect(0, 0, 1920, 1080);
      for (const p of parts) {
        const k = lt - p.d; if (k <= 0 || p.lx > front + 60) continue;
        const e = k;
        const x = p.x + p.vx * e + Math.sin(p.ph + k * 4) * 30 * k;
        const y = p.y + p.vy * e * (1 + k) + Math.cos(p.ph + k * 3) * 20 * k;
        const a = clamp(1 - k * 1.1);
        if (a <= 0) continue;
        pctx.globalAlpha = a; pctx.fillStyle = p.c; pctx.fillRect(x, y, p.s * (1 - k * .4), p.s * (1 - k * .4));
      }
      pctx.globalAlpha = 1;
    }
    set(ans, { o: 1 });
    cur.style.opacity = Math.floor(t * 2.2) % 2 ? 0 : 1;
    // fade chatbot card after dissolve
    set(bot, { x: (V ? 0 : 480) * kf, y: -60 * kf, s: 1 + (V ? 0.22 : 0.28) * kf, o: 1 - P(t, 53.9, 54.5, E.inC), f: blurF(P(t, 53.9, 54.5, E.inC) * 6) });
    // right side nodes
    mav.draw(t);
    const emph = P(t, 49.3, 49.7, E.ioC) * (1 - P(t, 51.0, 51.4, E.lin));
    rcam.style.transformOrigin = '1440px 540px';
    set(rcam, { x: 500 * (1 - kR), s: 1 + 0.035 * emph });
    set(glowR, { s: 1 + 0.15 * Math.sin(t * 3) + 0.3 * emph, o: 0.4 + 0.6 * emph });
    set(rlab, { o: P(t, 47.35, 47.65, E.lin) });
    const kl = V ? P(t, 48.55, 49.75, E.ioC) : P(t, 47.6, 49.1, E.ioC);
    if (V) { const dxg = lerp(lerp(475, -460, P(t, 48.3, 48.72, E.ioQt)), 475, P(t, 50.25, 50.68, E.ioQt)); gw.style.transform = `translateX(${dxg}px)`; }
    line.style.height = (kl * 540) + 'px';
    nodes.forEach((n, i) => { const k = SP(t - NT[i], 1.3, 6); set(n, { s: k, o: t > NT[i] ? 1 : 0, x: 30 * (1 - k) }); });
    S.el.style.opacity = 1 - P(t, 54.6, 54.95, E.lin);
  };
  MB.push([51.3, 52.3, 2]);
}

// ===================== G3 + H1: radar detect -> solved checks (54.3 - 59.9) =====================
{
  const S = Scene('GR', 54.3, 59.9, 21);
  S.el.innerHTML = `<div class="bgMuse"></div><div class="cam"></div>`;
  const cam = S.el.querySelector('.cam');
  const cv = el('canvas', null, null, cam, { position: 'absolute', inset: '0', width: '1920px', height: '1080px' }); cv.width = 1920; cv.height = 1080; const ctx = cv.getContext('2d');
  const CX = 960, CY = 600, TILT = 0.42;
  const W0 = 2.35, A0 = 0.5 - 2.35 * (56.79 - 54.4);
  const TGT_T = 56.79; const tgtA = A0 + W0 * (TGT_T - 54.4);
  const BL = [['📅', 1.3, 300], ['🏨', 2.2, 430], ['📦', 2.9, 220], ['💳', 3.6, 470], ['🎟️', 4.35, 330], ['🍽️', 5.2, 420], ['🚗', 6.0, 250], ['✈️', tgtA, 470]];
  const avW = el('div', 'abs', null, cam, { left: (CX - 80) + 'px', top: (CY - 210) + 'px', width: '160px', height: '160px', borderRadius: '80px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(30,70,160,.3),0 0 0 7px #fff' });
  const av = Avatar(avW, 160, 'hw');
  const br = el('div', 'abs', ['0 0', '1 0', '0 1', '1 1'].map(c => { const [x, y] = c.split(' '); return `<i style="position:absolute;${x === '0' ? 'left' : 'right'}:0;${y === '0' ? 'top' : 'bottom'}:0;width:34px;height:34px;border-${x === '0' ? 'left' : 'right'}:6px solid #E3173E;border-${y === '0' ? 'top' : 'bottom'}:6px solid #E3173E;border-radius:${x === '0' && y === '0' ? '10px 0 0 0' : x === '1' && y === '0' ? '0 10px 0 0' : x === '0' ? '0 0 0 10px' : '0 0 10px 0'}"></i>`; }).join(''), cam, { width: '120px', height: '120px' });
  const card = el('div', 'abs', `<div class="f1" style="position:absolute;inset:0;background:#fff;border-radius:26px;border:4px solid #E3173E;display:flex;align-items:center;gap:16px;padding:0 24px;box-shadow:0 20px 50px rgba(227,23,62,.25);backface-visibility:hidden">
      <span class="emoji" style="font-size:40px">⚠️</span><div><div style="font:700 30px 'Noto Sans CJK SC';color:#E3173E">航班取消</div><div style="font:600 22px Inter;color:#5b6070">PEK → LAX · OCT 1</div></div></div>
    <div class="f2" style="position:absolute;inset:0;background:#fff;border-radius:26px;border:4px solid #11A04D;display:flex;align-items:center;gap:16px;padding:0 24px;box-shadow:0 20px 50px rgba(17,160,77,.25);backface-visibility:hidden;transform:rotateX(180deg)">
      <span style="width:52px;height:52px;border-radius:26px;background:#11A04D;display:flex;align-items:center;justify-content:center">${ICON.check('#fff', 32, 3.5)}</span><div><div style="font:700 30px 'Noto Sans CJK SC';color:#11A04D">已改签</div><div style="font:600 22px Inter;color:#5b6070">PEK → LAX · OCT 2</div></div></div>`, cam, { width: '340px', height: '110px', transformStyle: 'preserve-3d' });
  const cardIn = [card.querySelector('.f1'), card.querySelector('.f2')];
  // blue checks cascade (official style)
  const CK = [[-330, -170, 120, 58.05], [300, -200, 150, 58.15], [420, 40, 96, 58.35], [-430, 60, 150, 58.35], [-220, 200, 80, 58.5], [210, 190, 130, 58.6], [0, -290, 90, 58.77], [520, -120, 70, 58.85], [-560, -80, 64, 58.95], [60, 300, 100, 58.95]];
  const checks = CK.map(([dx, dy, sz, t0]) => ({ e: el('div', 'abs', `<svg width="${sz}" height="${sz}" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#fff" stroke="#1F62E0" stroke-width="7"/><path d="M29 52l14 14 29-31" fill="none" stroke="#1F62E0" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`, cam, { left: (960 + dx * (V ? 0.8 : 1) - sz / 2) + 'px', top: (540 + dy - sz / 2) + 'px' }), t0 }));
  const proj = (a, r) => [CX + Math.cos(a) * r, CY + Math.sin(a) * r * TILT];
  S.upd = (t) => {
    const kin = P(t, 54.3, 55.0, E.outQt);
    const kout = P(t, 58.0, 58.6, E.ioC);
    cam.style.transform = `scale(${lerp(0.9, 1.0, kin) + 0.05 * P(t, 55, 58, E.lin)})`;
    S.el.style.opacity = P(t, 54.3, 54.6, E.lin);
    // radar
    ctx.clearRect(0, 0, 1920, 1080);
    const ra = kin * (1 - kout * 0.2), rOp = 1 - kout;
    ctx.save(); ctx.globalAlpha = rOp;
    const sweep = A0 + W0 * (t - 54.4);
    // sweep wedge
    for (let i = 0; i < 36; i++) {
      const a1 = sweep - i * 0.03, a2 = sweep - (i + 1) * 0.03;
      ctx.fillStyle = `rgba(40,130,255,${0.22 * (1 - i / 36)})`;
      ctx.beginPath(); ctx.moveTo(CX, CY); for (let k = 0; k <= 4; k++) { const a = lerp(a1, a2, k / 4); const p = proj(a, 540 * ra); ctx.lineTo(p[0], p[1]); } ctx.closePath(); ctx.fill();
    }
    for (const r of [140, 260, 380, 500]) { ctx.strokeStyle = 'rgba(60,120,220,.28)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(CX, CY, r * ra, r * TILT * ra, 0, 0, 6.283); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(60,120,220,.18)'; ctx.beginPath(); ctx.moveTo(CX - 540 * ra, CY); ctx.lineTo(CX + 540 * ra, CY); ctx.moveTo(CX, CY - 230 * ra); ctx.lineTo(CX, CY + 230 * ra); ctx.stroke();
    const sp = proj(sweep, 540 * ra); ctx.strokeStyle = 'rgba(0,100,224,.8)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(sp[0], sp[1]); ctx.stroke();
    // blips
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    let tp = null;
    for (const [g, a, r] of BL) {
      const p = proj(a, r * ra);
      let since = ((sweep - a) % 6.283 + 6.283) % 6.283; const lit = Math.exp(-since * 1.2);
      const isT = g === '✈️';
      const hot = isT && t >= TGT_T - 0.02;
      const col = hot ? (t >= 57.93 ? '#11A04D' : '#E3173E') : '#2F7BF0';
      ctx.fillStyle = col; ctx.globalAlpha = rOp * (0.25 + 0.75 * (hot ? 1 : lit)) * kin;
      ctx.beginPath(); ctx.arc(p[0], p[1] + 34, 7, 0, 6.283); ctx.fill();
      ctx.font = `${hot ? 56 : 40}px 'Noto Color Emoji'`; ctx.globalAlpha = rOp * (0.35 + 0.65 * (hot ? 1 : lit)) * kin;
      ctx.fillText(g, p[0], p[1]);
      if (hot) { tp = p; for (let k = 0; k < 3; k++) { const u = ((t - TGT_T) * 1.4 + k / 3) % 1; ctx.strokeStyle = col; ctx.globalAlpha = rOp * (1 - u) * .8; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(p[0], p[1] + 34, 20 + 110 * u, (20 + 110 * u) * TILT, 0, 0, 6.283); ctx.stroke(); } }
    }
    ctx.restore();
    av.draw(t);
    set(avW, { s: SP(t - 54.4, 1.2, 6) * (1 - 0.4 * kout), o: 1 - kout });
    // lock brackets + card
    const tpp = tp || proj(tgtA, 470);
    const kb = P(t, TGT_T, TGT_T + 0.3, E.outQt);
    set(br, { x: tpp[0] - 60, y: tpp[1] - 55, s: lerp(2.6, 1, kb), r: 90 * (1 - kb), o: t >= TGT_T ? 1 - kout : 0 });
    const kc = SP(t - 56.95, 1.2, 6);
    const kmove = P(t, 57.9, 58.45, E.ioQt);
    const cx = lerp(V ? tpp[0] - 420 : Math.min(tpp[0] + 120, 1920 - 300 - 340), 960 - 170, kmove), cy = lerp(V ? tpp[1] + 85 : tpp[1] - 190, 540 - 55, kmove);
    const flip = P(t, 57.93, 58.35, E.ioC);
    card.style.left = cx + 'px'; card.style.top = cy + 'px';
    set(card, { s: kc * 1.45 * (1 + 0.25 * kmove), o: t > 56.93 ? 1 : 0, rx: 180 * flip, y: -30 * Math.sin(flip * Math.PI) });
    checks.forEach(({ e, t0 }) => { const k = SP(t - t0, 1.4, 5.5); set(e, { s: k, o: t > t0 ? 1 : 0, r: -20 * (1 - k) }); });
  };
  FLASHES.push([56.79, .22, .3, '#FF3B4E'], [57.93, .25, .3, '#B8FFD4']);
}

// ===================== H2 + H3: AGI network -> Muse logo + everyday objects (59.2 - 70) =====================
{
  const S = Scene('H', 59.2, 70, 22);
  S.el.innerHTML = `<div class="dk abs" style="inset:0;background:radial-gradient(1200px 800px at 50% 50%, #0b1a4a 0%, #050a1e 60%, #02040c 100%)"></div><div class="lt abs" style="inset:0"><div class="bgMuse"></div></div>`;
  const dk = S.el.querySelector('.dk'), lt = S.el.querySelector('.lt');
  const cv = el('canvas', null, null, S.el, { position: 'absolute', inset: '0', width: '1920px', height: '1080px' }); cv.width = 1920; cv.height = 1080; const ctx = cv.getContext('2d');
  // nodes on fibonacci sphere
  const N = 520; const nodes = []; const rr = rng(91);
  for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996; const j = 0.82 + rr() * 0.3; nodes.push({ x: Math.cos(th) * r * j, y: y * j, z: Math.sin(th) * r * j, ph: rr() * 6.28 }); }
  const links = []; for (let i = 0; i < N; i++) { const d = nodes.map((n, j) => [j, (n.x - nodes[i].x) ** 2 + (n.y - nodes[i].y) ** 2 + (n.z - nodes[i].z) ** 2]).sort((a, b) => a[1] - b[1]); for (let k = 1; k <= 3; k++) if (d[k][0] > i) links.push([i, d[k][0]]); }
  // logo sample targets
  const targets = []; { const c = document.createElement('canvas'); c.width = c.height = 400; const g = c.getContext('2d'); const p = new Path2D(MUSE_D); g.scale(4, 4); g.fill(p); const id = g.getImageData(0, 0, 400, 400).data; const pts = []; for (let y = 0; y < 400; y += 4) for (let x = 0; x < 400; x += 4) if (id[(y * 400 + x) * 4 + 3] > 128) pts.push([x / 400, y / 400]); const r2 = rng(5); for (let i = 0; i < N; i++) targets.push(pts[Math.floor(r2() * pts.length)]); }
  const LOGO = { x: 960, y: 500, s: 460 };
  const LKS = V ? 0.74 : 1;
  const LT = { x: 960, y: 540 + (LOGO.y - 540) * LKS, s: LOGO.s * LKS };
  const lk = el('div', 'abs', null, S.el, { left: '0', top: '0', width: '1920px', height: '1080px', transformOrigin: '960px 540px', transform: `scale(${LKS})` });
  const logo = el('div', 'abs', museSVG(460), lk, { left: (LOGO.x - 230) + 'px', top: (LOGO.y - 230) + 'px', width: '460px', height: '460px' });
  const word = el('div', 'abs', 'Muse', lk, { left: '0', top: '0', font: '800 240px Inter', letterSpacing: '-7px', color: '#0B0B10', whiteSpace: 'nowrap', lineHeight: '1' });
  INITS.push(() => { word._w = word.offsetWidth; });
  // "from ∞Meta": baseline-aligned in one SVG. Meta wordmark tight bounds (svg units): x 1000..5964, baseline y 1982.7, cap height 950.6
  const FROM_F = 56, MK = (0.74 * FROM_F) / 950.6;
  const from = el('div', 'abs', `<svg width="420" height="80" style="overflow:visible"><text class="ft" x="0" y="60" font-family="Inter" font-weight="500" font-size="${FROM_F}" fill="#5f6472">from</text><image class="mi" href="${A}meta-wordmark.svg" y="${60 - 1982.7 * MK}" width="${6962.36 * MK}" height="${3000 * MK}" opacity=".78"/></svg>`, lk, { left: '0', top: '0' });
  const LK = { fromW: 0, inkF: 0, inkM: 0 };
  INITS.push(() => { const g = document.createElement('canvas').getContext('2d'); g.font = `500 ${FROM_F}px Inter`; const mf = g.measureText('from'); LK.fromW = mf.width; LK.inkF = -mf.actualBoundingBoxLeft; g.font = '800 240px Inter'; LK.inkM = -g.measureText('M').actualBoundingBoxLeft; from.querySelector('.mi').setAttribute('x', LK.fromW + 0.36 * FROM_F - 1000 * MK); });
  // everyday objects ring
  const OBJ = ['big_01', 'big_02', 'big_03', 'big_04', 'big_05', 'big_06', 'big_07', 'big_08', 'big_09', 'big_10', 'big_11', 'sm_01', 'sm_03', 'sm_07', 'sm_04', 'sm_06'];
  const objs = OBJ.map((n, i) => { const im = el('img', 'abs', null, S.el, { width: (n.startsWith('big') ? 150 : 120) + 'px' }); im.src = `${A}obj/${n}.png`; const a = i / OBJ.length * Math.PI * 2 + 0.2; return { im, a, rx: V ? 452 + (i % 3) * 12 : 830 + (i % 3) * 25, ry: V ? 430 + (i % 2) * 22 : 385 + (i % 2) * 30, t0: 63.9 + (i % 8) * 0.07, ph: i * 1.3 }; });
  const fig = el('img', 'abs', null, S.el, { width: V ? '140px' : '165px', left: V ? '890px' : '1590px', top: V ? '700px' : '470px' }); fig.src = A + 'obj/big_00.png';
  const pulseR = el('div', 'abs', null, S.el, { left: '960px', top: '540px', width: '10px', height: '10px', borderRadius: '50%', border: '3px solid rgba(140,200,255,.8)' });
  S.upd = (t) => {
    const reveal = P(t, 59.2, 59.8, E.ioQt);
    S.el.style.clipPath = reveal < 1 ? `circle(${reveal * 1200}px at 960px 540px)` : 'none';
    const light = P(t, 63.35, 63.95, E.ioQt);
    lt.style.clipPath = light < 1 ? `circle(${light * 1200}px at 960px 520px)` : 'none';
    lt.style.display = light > 0 ? 'block' : 'none';
    // network params
    const rot = (t - 59.2) * 0.35 + P(t, 61.7, 62.3, E.ioC) * 0.8;
    const agi = bump(t, 61.8, 61.95, 62.8);
    const R = 300 * (0.75 + 0.25 * P(t, 59.2, 60.5, E.outC)) * (1 + 0.18 * P(t, 60.5, 62.9, E.ioS)) * (1 + 0.14 * agi);
    const morph = P(t, 62.95, 64.0, E.ioC);
    const cy = Math.cos(rot), sy = Math.sin(rot), cx = Math.cos(0.35), sx = Math.sin(0.35);
    const pts = nodes.map((n, i) => {
      let x = n.x * cy + n.z * sy, z = -n.x * sy + n.z * cy, y = n.y;
      const y2 = y * cx - z * sx, z2 = y * sx + z * cx;
      const persp = 900 / (900 - z2 * R);
      let X = 960 + x * R * persp, Y = 540 + y2 * R * persp;
      const tg = targets[i]; const TX = LT.x - LT.s / 2 + tg[0] * LT.s, TY = LT.y - LT.s / 2 + tg[1] * LT.s;
      const m = clamp(morph * 1.25 - (i % 50) / 50 * 0.25);
      const em = E.ioC(m);
      return [lerp(X, TX, em), lerp(Y, TY, em), z2, em];
    });
    ctx.clearRect(0, 0, 1920, 1080);
    const la = (1 - morph) * (0.55 + 0.45 * agi);
    if (la > 0.01) {
      ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 1.4;
      for (const [a, b] of links) { const p = pts[a], q = pts[b]; const d = (p[2] + q[2]) / 2; ctx.strokeStyle = `rgba(90,165,255,${(0.16 + 0.42 * (d + 1) / 2) * la})`; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); }
      // orbit rings with travelling sparks
      for (let k = 0; k < 3; k++) {
        const tilt = 0.35 + k * 0.5, spin = (t - 59.2) * (0.5 + k * 0.25) + k * 2, rr = R * (1.28 + k * 0.14);
        ctx.strokeStyle = `rgba(110,180,255,${0.22 * la})`; ctx.lineWidth = 1.6;
        ctx.save(); ctx.translate(960, 540); ctx.rotate(-0.4 + k * 0.9 + (t - 59.2) * 0.08);
        ctx.beginPath(); ctx.ellipse(0, 0, rr, rr * Math.cos(tilt) * 0.35 + 20, 0, 0, 6.283); ctx.stroke();
        for (let j = 0; j < 3; j++) { const a = spin + j * 2.094; const x = Math.cos(a) * rr, y = Math.sin(a) * (rr * Math.cos(tilt) * 0.35 + 20); const g = ctx.createRadialGradient(x, y, 0, x, y, 16); g.addColorStop(0, `rgba(220,240,255,${la})`); g.addColorStop(1, 'rgba(120,190,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 16, 0, 6.283); ctx.fill(); }
        ctx.restore(); ctx.lineWidth = 1.4;
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    // core glow
    const cg = ctx.createRadialGradient(960, 540, 0, 960, 540, 420 * (1 + agi * .4));
    cg.addColorStop(0, `rgba(120,190,255,${(0.28 + 0.4 * agi) * (1 - morph)})`); cg.addColorStop(1, 'rgba(60,120,255,0)');
    ctx.fillStyle = cg; ctx.fillRect(0, 0, 1920, 1080);
    // nodes
    const logoFade = P(t, 63.95, 64.3, E.lin);
    for (let i = 0; i < pts.length; i++) {
      const [x, y, z, m] = pts[i];
      const tw = 0.75 + 0.25 * Math.sin(t * 6 + i * 1.7);
      const br = (0.5 + 0.5 * (z + 1) / 2) * (1 + 0.6 * agi) * tw;
      const sz = lerp(2.4 + 3.0 * (z + 1) / 2, 7, m);
      const r0 = Math.round(lerp(170, 0, light * m)), g0 = Math.round(lerp(220, 100, light * m)), b0 = Math.round(lerp(255, 224, light * m));
      ctx.globalAlpha = clamp(br) * (1 - logoFade);
      ctx.fillStyle = `rgb(${r0},${g0},${b0})`;
      ctx.beginPath(); ctx.arc(x, y, sz, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // AGI pulse ring
    const kp = P(t, 61.83, 62.7, E.outC);
    const pr = 20 + kp * 900;
    Object.assign(pulseR.style, { left: (960 - pr) + 'px', top: (540 - pr) + 'px', width: 2 * pr + 'px', height: 2 * pr + 'px', opacity: t > 61.83 ? (1 - kp) : 0, borderWidth: (6 * (1 - kp) + 1) + 'px' });
    // logo -> lockup
    const kl = P(t, 64.35, 65.05, E.ioQt);
    const ls = lerp(1, 0.7, kl);
    const WW = word._w || 650, GAP = 42, LW = 460 * 0.7;
    const gx = 960 - (LW + GAP + WW) / 2;
    set(logo, { x: lerp(0, gx + LW / 2 - LOGO.x, kl), y: lerp(0, 12, kl), s: ls, o: logoFade });
    const kw = P(t, 64.55, 65.1, E.outQt);
    word.style.left = (gx + LW + GAP) + 'px'; word.style.top = '394px';
    word.style.clipPath = `inset(-20px ${100 - 100 * kw}% -40px 0)`;
    set(word, { x: -60 * (1 - kw), o: kw });
    from.style.left = (gx + LW + GAP + LK.inkM - LK.inkF) + 'px'; from.style.top = (394 + 207.2 + 104 - 60) + 'px';
    set(from, { y: 20 * (1 - P(t, 64.85, 65.3, E.outC)), o: P(t, 64.85, 65.2, E.lin) });
    // objects
    objs.forEach((O) => {
      const k = P(t, O.t0, O.t0 + 0.75, E.outQt);
      const bob = Math.sin(t * 1.6 + O.ph) * 10;
      const rx = O.rx * (0.3 + 0.7 * k) * (1 + 0.04 * kl), ry = O.ry * (0.3 + 0.7 * k);
      const x = 960 + Math.cos(O.a + t * 0.05) * rx, y = 520 + Math.sin(O.a + t * 0.05) * ry + bob;
      const w = O.im.width || 150;
      set(O.im, { x: x - w / 2, y: y - w / 2, s: lerp(0.2, 1, k), r: Math.sin(t * 1.2 + O.ph) * 8, o: k, f: blurF((1 - k) * 12) });
    });
    const kf = SP(t - 64.9, 1.1, 4.5);
    set(fig, { y: 380 * (1 - kf), r: Math.sin(t * 5) * 4, o: t > 64.88 ? 1 : 0 });
    dk.style.opacity = 1;
  };
  MB.push([59.2, 59.8, 3], [62.95, 64.0, 3]);
  FLASHES.push([61.83, .28, .45, '#A8D4FF']);
}
