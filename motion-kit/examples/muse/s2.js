// ===================== C12: lock screen + notification (11.85 - 14.62) =====================
{
  const S = Scene('C12', 11.85, 15.2, 13);
  S.el.innerHTML = `<div class="abs" style="inset:0;background:radial-gradient(1000px 760px at 50% 62%, #16307a 0%, #0a1330 45%, #050915 80%)"></div><div class="cam"></div>`;
  const cam = S.el.querySelector('.cam');
  const rings = [0, 1, 2].map(() => el('div', 'abs', null, cam, { left: '759px', top: '103px', width: '402px', height: '874px', borderRadius: '66px', border: '3px solid rgba(130,180,255,.7)' }));
  const ph = el('div', 'phone', null, cam, { left: '759px', top: '103px', background: '#0B1433' });
  ph.innerHTML = `
   <div class="abs" style="inset:0;background:linear-gradient(172deg,#08102c 0%,#0d2160 42%,#1a42b0 78%,#3f74f5 100%)"></div>
   <div class="abs" style="left:-80px;top:420px;width:420px;height:420px;border-radius:50%;background:radial-gradient(#4f86ff,rgba(79,134,255,0) 70%);opacity:.55"></div>
   <div class="abs" style="left:170px;top:560px;width:380px;height:380px;border-radius:50%;background:radial-gradient(#8a5cff,rgba(138,92,255,0) 70%);opacity:.35"></div>
   <div class="island"></div>
   <div class="sbar" style="color:#fff;justify-content:flex-end;gap:6px">${ICON.signal}${ICON.wifi}${ICON.battery}</div>
   <div class="abs" style="left:0;right:0;top:96px;text-align:center;font:500 21px 'Noto Sans CJK SC';color:rgba(255,255,255,.9)">9月30日 星期三</div>
   <div class="abs tab" style="left:0;right:0;top:118px;text-align:center;font:700 112px Inter;letter-spacing:-3px;color:#fff;line-height:1.1;display:flex;justify-content:center">
     <span>23:4</span><span class="roll" style="display:inline-block;height:123px;overflow:hidden;position:relative;width:.62em"><span class="rin" style="position:absolute;left:0;top:0;display:flex;flex-direction:column"><span>6</span><span>7</span></span></span>
   </div>
   <div class="noti abs" style="left:12px;right:12px;top:510px;border-radius:26px;padding:14px 16px 15px;display:flex;gap:12px;background:rgba(236,240,252,.86);box-shadow:0 12px 40px rgba(0,0,0,.35)">
     <div style="flex:none">${appIcon(44)}</div>
     <div style="flex:1;min-width:0">
       <div style="display:flex;justify-content:space-between;align-items:center"><b style="font:600 16px Inter">Muse</b><span style="font:400 13px 'Noto Sans CJK SC';color:#6c6f7a">现在</span></div>
       <div style="font:700 18px 'Noto Sans CJK SC';margin-top:3px;color:#D3122F">⚠️ 航班取消提醒</div>
       <div style="font:500 16.5px/1.42 'Noto Sans CJK SC';color:#1d1d22;margin-top:2px">你明天 <b>北京 → 洛杉矶</b> 的美联航航班已被取消</div>
     </div>
   </div>
   <div class="abs" style="left:46px;bottom:52px;width:52px;height:52px;border-radius:26px;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center"><svg width="18" height="26" viewBox="0 0 18 26"><path d="M3 1h12v5l-3 5v14H6V11L3 6z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg></div>
   <div class="abs" style="right:46px;bottom:52px;width:52px;height:52px;border-radius:26px;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center"><svg width="26" height="20" viewBox="0 0 26 20"><rect x="1" y="4" width="24" height="15" rx="3.5" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="13" cy="11.5" r="4.2" fill="none" stroke="#fff" stroke-width="1.8"/><path d="M8 4l2-3h6l2 3" fill="none" stroke="#fff" stroke-width="1.8"/></svg></div>
   <div class="abs" style="left:131px;bottom:9px;width:140px;height:5px;border-radius:3px;background:rgba(255,255,255,.85)"></div>`;
  const noti = ph.querySelector('.noti'), rin = ph.querySelector('.rin');
  S.upd = (t) => {
    const kin = P(t, 11.85, 12.45, E.outQt);
    const c = camKeys([[11.85, 960, 540, 1.35], [12.45, 960, 540, 1.0, E.outQt], [13.3, 960, 548, 1.04, E.lin], [13.85, 960, 668, 2.75, E.ioQt], [14.95, 960, 672, 2.8, E.lin], [15.2, 960, 680, 3.3, E.inC]], t);
    const hk = t > 13.04 && t < 13.62 ? Math.sin((t - 13.04) * 2 * Math.PI * 38) * 7 * Math.pow(1 - (t - 13.04) / 0.58, 1.5) : 0;
    applyCam(cam, c);
    cam.style.filter = blurF((1 - kin) * 12 + P(t, 14.95, 15.2, E.inC) * 8);
    set(ph, { x: hk });
    S.el.style.opacity = P(t, 11.85, 12.1, E.lin) * (1 - P(t, 15.02, 15.2, E.lin));
    // clock roll 46 -> 47
    const kr = P(t, 12.3, 12.62, E.outB);
    rin.style.transform = `translateY(${-123 * kr}px)`;
    // notification
    const kn = SP(t - 13.04, 1.25, 6.2);
    set(noti, { y: 70 * (1 - kn), s: 0.9 + 0.1 * kn, o: P(t, 13.04, 13.2, E.lin) });
    rings.forEach((r, i) => { const t0 = 13.04 + i * 0.13; const k = P(t, t0, t0 + 0.7, E.outC); set(r, { x: hk, s: 1 + 0.16 * k, o: t > t0 ? (1 - k) * 0.8 : 0 }); });
  };
  FLASHES.push([15.08, .55, .32, '#ffffff']);
}

// ===================== C34: Muse chat, cancelled + empty inbox (14.36 - 20.7) =====================
{
  const S = Scene('C34', 14.98, 20.72, 14);
  S.el.innerHTML = `<div class="bgMuse"></div><div class="cam"><div class="abs world" style="inset:0"></div></div>`;
  const cam = S.el.querySelector('.cam'), world = S.el.querySelector('.world');
  const pw = el('div', 'abs', null, world, { left: '0', top: '0', width: '1920px', height: '1080px' });
  const P3 = Phone(pw, { x: 759, y: 103, sprite: 'hw' });
  P3.status([[14.9, '✈️ 正在查看航班动态'], [15.86, '⚠️ 发现航班取消'], [16.9, '🎧 正在处理中']]);
  P3.add('帮我盯一下 10月1日 去洛杉矶的航班 ✈️', -2, 'u');
  P3.add('好的，航班有任何变动我会第一时间告诉你。', -2, 'a');
  P3.add('⚠️ 刚收到消息：你明天的美联航航班因为<b>飞机机械故障</b>被取消了。', 15.05, 'a');
  const fcm = P3.add(flightCard({ head: `Scheduled<div class="red" style="position:absolute;inset:0;background:#E3173E;display:flex;align-items:center;justify-content:center;gap:6px">Cancelled</div>`, cls: 'sch', prog: 0 }), 15.55, 'raw');
  const red = fcm.inner.querySelector('.red'); fcm.inner.querySelector('.fch').style.position = 'relative';
  // inbox panel
  const inbox = el('div', 'card', `
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div style="font:700 46px 'Noto Sans CJK SC'">收件箱</div>
      <svg class="rf" width="46" height="46" viewBox="-23 -23 46 46"><circle r="16" fill="none" stroke="#D5DDEB" stroke-width="4.5"/><circle class="rfa" r="16" fill="none" stroke="#0064E0" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="30 120"/></svg>
    </div>
    <div style="margin-top:22px;height:52px;border-radius:14px;background:#F1F2F5;display:flex;align-items:center;gap:12px;padding:0 18px;font:500 20px Inter;color:#7d8292">
      <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="6.5" stroke="#7d8292" stroke-width="2" fill="none"/><path d="M13.5 13.5L18 18" stroke="#7d8292" stroke-width="2" stroke-linecap="round"/></svg>United Airlines</div>
    <div class="slot" style="margin-top:22px;height:118px;border-radius:20px;border:2.5px dashed #C8D2E5;position:relative;overflow:hidden;display:flex;align-items:center;gap:18px;padding:0 22px">
      <div style="width:60px;height:60px;border-radius:30px;background:#EDF0F5"></div>
      <div style="flex:1"><div class="sk" style="width:62%;height:16px;border-radius:8px;background:#E6E9F0"></div><div class="sk" style="width:88%;height:13px;border-radius:7px;background:#EEF0F4;margin-top:12px"></div><div class="sk" style="width:48%;height:13px;border-radius:7px;background:#EEF0F4;margin-top:10px"></div></div>
      <div class="shim abs" style="top:0;bottom:0;width:180px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.85),rgba(255,255,255,0))"></div>
      <div class="abs" style="inset:0;display:flex;align-items:center;justify-content:center;gap:12px;font:600 27px 'Noto Sans CJK SC';color:#7d8496;background:rgba(255,255,255,.55)"><svg class="rf2" width="32" height="32" viewBox="-16 -16 32 32"><circle r="11" fill="none" stroke="#D5DDEB" stroke-width="4"/><circle r="11" fill="none" stroke="#0064E0" stroke-width="4" stroke-linecap="round" stroke-dasharray="22 80"/></svg>暂无航空公司官方通知</div>
    </div>
    ${[['United Airlines', 'Your trip to Los Angeles is coming up', '你的洛杉矶之行即将开始，出发前请确认行程信息…', '9月28日', true],
      ['MileagePlus', 'Your September statement', '本月里程账单已生成…', '9月25日', true],
      ['LA Downtown Hotel', '预订确认 · 10月1日入住', '感谢预订，期待您的光临…', '9月20日', false]].map(([f, s, p, d, u]) => `
      <div style="display:flex;gap:18px;align-items:center;padding:20px 4px;border-bottom:1px solid #EEF0F4;opacity:.62">
        <div style="width:60px;height:60px;border-radius:30px;background:${u ? '#fff' : '#EFE9FF'};border:1px solid #E6E9F0;display:flex;align-items:center;justify-content:center;overflow:hidden;flex:none">${u ? UA_GLOBE(34) : '<span class="emoji" style="font-size:28px">🏨</span>'}</div>
        <div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between"><b style="font:600 21px Inter,'Noto Sans CJK SC'">${f}</b><span style="font:400 17px 'Noto Sans CJK SC';color:#8b90a0">${d}</span></div>
        <div style="font:500 18px Inter,'Noto Sans CJK SC';margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s}</div>
        <div style="font:400 16px 'Noto Sans CJK SC';color:#8b90a0;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p}</div></div></div>`).join('')}
  `, world, { left: '1270px', top: '150px', width: '680px', height: '790px', padding: '38px 42px' });
  const slot = inbox.querySelector('.slot'), shim = inbox.querySelector('.shim'), rfa = inbox.querySelector('.rfa'), rf = inbox.querySelector('.rf');
  const env = el('div', 'abs', `<img src="${A}icon-envelope@2x.webp" style="width:190px;height:190px;display:block"><div class="bdg" style="position:absolute;right:-10px;top:-8px;min-width:82px;height:82px;border-radius:41px;background:#E3173E;color:#fff;font:800 48px Inter;display:flex;align-items:center;justify-content:center;border:6px solid #fff">0</div>`, world, { left: '1800px', top: '60px' });
  const bdg = env.querySelector('.bdg');
  const clockPill = el('div', 'pill', `<span class="pi emoji" style="background:#F1F2F5">🕚</span><span class="tab">23:52</span><span style="color:#8b90a0;font-size:24px">航司通知 · 0</span>`, world, { left: '1270px', top: '962px' });
  const rf2 = inbox.querySelector('.rf2');
  S.upd = (t) => {
    P3.update(t); animDots(P3.el, t);
    const kin = P(t, 14.98, 15.3, E.outQt);
    const punch = bump(t, 15.84, 15.92, 16.45, E.outC, E.ioC);
    const shk = shake(t, 15.86, 0.55, 22, 30, 5);
    const c = camKeys([[14.98, 950, 700, 3.1], [15.3, 945, 712, 2.75, E.outQt], [15.55, 945, 712, 2.7, E.lin], [15.95, 945, 708, 2.45, E.ioQt], [16.8, 945, 708, 2.42, E.lin], ...(V ? [[17.5, 1610, 560, 1.0, E.ioQt], [18.2, 1610, 560, 1.0, E.lin], [18.75, 1615, 330, 1.42, E.ioQt], [20.15, 1615, 335, 1.45, E.lin]] : [[17.5, 1355, 545, 1.12, E.ioQt], [18.2, 1355, 545, 1.1, E.lin], [18.75, 1590, 315, 1.75, E.ioQt], [20.15, 1590, 322, 1.8, E.lin]])], t);
    applyCam(cam, c, { x: shk.x, y: shk.y, r: shk.r, s: 1 + 0.08 * punch });
    cam.style.filter = blurF((1 - kin) * 10);
    // red header flip
    const kf = P(t, 15.86, 16.02, E.outQt);
    red.style.clipPath = `inset(0 0 ${100 - 100 * kf}% 0)`;
    rgbSplit(pw, (t > 15.86 ? Math.exp(-7 * (t - 15.86)) * 16 : 0) + (t > 20.1 ? P(t, 20.1, 20.6, E.inQ) * 26 : 0));
    // inbox
    const ki = SP(t - 16.95, 1.1, 6);
    set(inbox, { x: 900 * (1 - ki), r: 6 * (1 - ki), o: t > 16.9 ? 1 : 0 });
    if (rf2) rf2.style.transform = `rotate(${t * 380}deg)`;
    const ke = SP(t - 17.25, 1.3, 5.5);
    const eShake = t > 19.36 && t < 19.9 ? Math.sin((t - 19.36) * 60) * 10 * (1 - (t - 19.36) / 0.54) : 0;
    set(env, { s: ke * (1 + 0.12 * bump(t, 19.34, 19.42, 19.8)), y: Math.sin(t * 2.2) * 8, r: eShake * 0.6 + Math.sin(t * 1.4) * 3, o: t > 17.2 ? 1 : 0 });
    set(bdg, { s: 1 + 0.35 * bump(t, 19.74, 19.82, 20.15) });
    const kc = SP(t - 17.6, 1.2, 6);
    set(clockPill, { y: 30 * (1 - kc), o: t > 17.55 ? Math.min(1, kc * 2) : 0 });
    shim.style.transform = `translateX(${((t * 0.9) % 1) * 820 - 200}px)`;
    set(slot, { x: eShake });
    rf.style.transform = `rotate(${t * 400}deg)`;
    rfa.style.strokeDasharray = `${30 + 40 * Math.abs(Math.sin(t * 2))} 120`;
    // glitch out
    const g = P(t, 20.15, 20.7, E.inQ);
    S.el.style.opacity = 1 - P(t, 20.55, 20.72, E.lin);
    world.style.transform = g > 0 ? `translateX(${noise1(t * 60, 4) * 60 * g}px) skewX(${noise1(t * 50, 9) * 8 * g}deg)` : 'none';
  };
  FLASHES.push([15.86, .22, .4, '#FF2A45']);
  FLASHES.push([20.5, .5, .25, '#ffffff']);
  MB.push([16.55, 17.3, 3]);
}

// ===================== D1: split-flap board + crack + shatter (20.4 - 24.2) =====================
{
  const S = Scene('D1', 20.4, 24.2, 15);
  const cv = el('canvas', null, null, S.el, { position: 'absolute', inset: '0', width: '1920px', height: '1080px' });
  cv.width = 1920; cv.height = 1080;
  const ctx = cv.getContext('2d');
  const off = document.createElement('canvas'); off.width = 1920; off.height = 1080; const o = off.getContext('2d');
  const snap = document.createElement('canvas'); snap.width = 1920; snap.height = 1080; let snapped = false;
  const CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const rows = [
    ['UA 856', 'LOS ANGELES', '13:05', ['ON TIME', 'CANCELLED']],
    ['CA 981', 'NEW YORK', '13:00', ['BOARDING']],
    ['MU 587', 'LOS ANGELES', '13:40', ['ON TIME', 'DELAYED']],
    ['HU 495', 'SEATTLE', '14:20', ['ON TIME']],
    ['CA 769', 'VANCOUVER', '14:55', ['GATE OPEN', 'DELAYED']],
    ['MU 297', 'TOKYO', '15:30', ['ON TIME']],
    ['CZ 327', 'LOS ANGELES', '16:05', ['ON TIME', 'DELAYED']],
  ];
  const statusT = { 0: [21.06], 2: [21.48], 4: [21.92], 6: [21.7] };
  const CW = 40, CHh = 60, PITCH = 44, X0 = 196, Y0 = 262, RP = 86;
  const cols = [[X0, 6], [X0 + 7 * PITCH, 12], [X0 + 20 * PITCH, 5], [X0 + 26 * PITCH, 9]];
  const pad = (s, n) => (s + ' '.repeat(n)).slice(0, n);
  const hash = (a, b, c) => { const v = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453; return v - Math.floor(v); };
  function cellChar(target, prev, tStart, t, seed) {
    if (t < tStart) return [prev, 0];
    const steps = 5 + Math.floor(hash(seed, 1, 2) * 5), dt = 0.042;
    const k = (t - tStart) / dt;
    if (k >= steps) return [target, 0];
    const i = Math.floor(k);
    return [CH[Math.floor(hash(seed, i, 3) * CH.length)], k - i];
  }
  function drawCell(x, y, ch, ph, color, glow) {
    o.fillStyle = '#171a22'; o.beginPath(); o.roundRect(x, y, CW, CHh, 5); o.fill();
    o.fillStyle = '#1d212b'; o.beginPath(); o.roundRect(x, y, CW, CHh / 2, [5, 5, 0, 0]); o.fill();
    if (ch !== ' ') {
      o.save(); o.translate(x + CW / 2, y + CHh / 2);
      const sy = ph > 0 ? Math.abs(Math.cos(ph * Math.PI)) : 1;
      o.scale(1, Math.max(0.05, sy));
      if (glow) { o.shadowColor = color; o.shadowBlur = 16; }
      o.fillStyle = color; o.font = '700 40px Inter'; o.textAlign = 'center'; o.textBaseline = 'middle';
      o.fillText(ch, 0, 2); o.restore();
    }
    o.fillStyle = '#07080b'; o.fillRect(x, y + CHh / 2 - 1, CW, 2);
  }
  // cracks (precomputed)
  const IMP = [1060, 560];
  const cracks = []; { const r = rng(21); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + r() * .3; let x = IMP[0], y = IMP[1]; const pts = [[x, y]]; const L = 350 + r() * 900; let d = 0; while (d < L) { const st = 30 + r() * 60; const aa = a + (r() - .5) * .6; x += Math.cos(aa) * st; y += Math.sin(aa) * st; d += st; pts.push([x, y]); } cracks.push(pts); } }
  // shards: wedge x ring
  const shards = []; { const r = rng(33); const NA = 12, RR = [0, 170, 420, 800, 2200]; for (let i = 0; i < NA; i++) { const a0 = i / NA * Math.PI * 2 + (r() - .5) * .2, a1 = (i + 1) / NA * Math.PI * 2 + (r() - .5) * .2; for (let j = 0; j < RR.length - 1; j++) { const ra = RR[j] * (0.9 + r() * .2), rb = RR[j + 1] * (0.9 + r() * .2); const poly = [[Math.cos(a0) * ra, Math.sin(a0) * ra], [Math.cos(a0) * rb, Math.sin(a0) * rb], [Math.cos((a0 + a1) / 2) * rb * 1.02, Math.sin((a0 + a1) / 2) * rb * 1.02], [Math.cos(a1) * rb, Math.sin(a1) * rb], [Math.cos(a1) * ra, Math.sin(a1) * ra]].map(([x, y]) => [x + IMP[0], y + IMP[1]]); const am = (a0 + a1) / 2, rm = (ra + rb) / 2; shards.push({ poly, cx: IMP[0] + Math.cos(am) * rm, cy: IMP[1] + Math.sin(am) * rm, vx: Math.cos(am) * (500 + r() * 900) * (1 + 200 / (rm + 100)), vy: Math.sin(am) * (400 + r() * 700) - 300 - r() * 400, vr: (r() - .5) * 5, delay: j * 0.05 + r() * 0.06 }); } } }
  function drawBoard(t) {
    o.fillStyle = '#0A0C11'; o.fillRect(0, 0, 1920, 1080);
    const vg = o.createRadialGradient(960, 540, 300, 960, 540, 1200); vg.addColorStop(0, 'rgba(40,60,110,.25)'); vg.addColorStop(1, 'rgba(0,0,0,0)'); o.fillStyle = vg; o.fillRect(0, 0, 1920, 1080);
    o.fillStyle = '#F2F3F5'; o.font = '800 56px Inter'; o.textBaseline = 'alphabetic'; o.textAlign = 'left';
    o.save(); o.letterSpacing = '6px'; o.fillText('DEPARTURES', X0, 170); o.restore();
    o.fillStyle = '#8C93A3'; o.font = '500 46px "Noto Sans CJK SC"'; o.fillText('出发', X0 + 478, 168);
    // plane glyph
    o.fillStyle = '#FFB020'; o.font = '600 22px Inter'; o.letterSpacing = '0px';
    o.fillStyle = '#7C8394'; o.font = '600 19px Inter';
    const hd = ['FLIGHT', 'DESTINATION', 'TIME', 'STATUS']; cols.forEach(([x], i) => { o.save(); o.letterSpacing = '3px'; o.fillText(hd[i], x, 236); o.restore(); });
    // clock
    const clk = '23:52'; for (let i = 0; i < 5; i++) drawCell(1620 + i * PITCH - 20, 118, clk[i], 0, '#F2F3F5');
    const chaos = P(t, 22.3, 22.75, E.inQ);
    rows.forEach((row, ri) => {
      const y = Y0 + ri * RP;
      const st = statusT[ri] || [];
      const statusIdx = st.filter(tt => t >= tt).length;
      const stText = row[3][Math.min(statusIdx, row[3].length - 1)];
      const prevText = statusIdx > 0 ? row[3][statusIdx - 1] : '';
      const stColor = stText === 'CANCELLED' ? '#FF3B4E' : stText === 'DELAYED' ? '#FFB020' : stText === 'BOARDING' || stText === 'GATE OPEN' ? '#36D07A' : '#F2F3F5';
      if (ri === 0 && t >= 21.06) { const a = 0.18 + 0.12 * Math.sin(t * 8); o.fillStyle = `rgba(255,40,60,${a})`; o.beginPath(); o.roundRect(X0 - 18, y - 10, 1560, CHh + 20, 14); o.fill(); }
      const texts = [pad(row[0], 6), pad(row[1], 12), pad(row[2], 5), pad(stText, 9)];
      const prevs = [' '.repeat(6), ' '.repeat(12), ' '.repeat(5), pad(prevText, 9)];
      cols.forEach(([x, n], ci) => {
        for (let k = 0; k < n; k++) {
          const seed = ri * 100 + ci * 20 + k;
          let tStart = 20.45 + ri * 0.06 + (ci * 6 + k) * 0.012;
          let prev = prevs[ci][k];
          if (ci === 3 && statusIdx > 0) { tStart = st[statusIdx - 1] + k * 0.03; }
          else if (ci === 3) prev = ' ';
          let [ch, ph] = cellChar(texts[ci][k], ci === 3 && statusIdx > 0 ? prevs[3][k] : ' ', tStart, t, seed + statusIdx * 7);
          if (chaos > 0 && hash(seed, Math.floor(t * 22), 5) < chaos * 0.85) { ch = CH[Math.floor(hash(seed, Math.floor(t * 22), 9) * CH.length)]; ph = hash(seed, Math.floor(t * 30), 2) * .8; }
          const col = ci === 3 ? stColor : (ri === 0 && t >= 21.06 ? '#FFD9DD' : '#F2F3F5');
          drawCell(x + k * PITCH, y, ch, ph, chaos > 0.3 && hash(seed, 3, Math.floor(t * 15)) < .2 ? '#FF3B4E' : col, ci === 3 && (stText === 'CANCELLED'));
        }
      });
    });
    // cracks
    const kc = P(t, 22.74, 22.95, E.outQt);
    if (kc > 0) {
      o.save(); o.lineCap = 'round'; o.lineJoin = 'round';
      for (const pts of cracks) { const n = Math.max(2, Math.floor(pts.length * kc)); for (const [w, c] of [[6, 'rgba(160,200,255,.25)'], [2, 'rgba(255,255,255,.9)']]) { o.strokeStyle = c; o.lineWidth = w; o.beginPath(); for (let i = 0; i < n; i++) i ? o.lineTo(pts[i][0], pts[i][1]) : o.moveTo(pts[i][0], pts[i][1]); o.stroke(); } }
      const g = o.createRadialGradient(IMP[0], IMP[1], 0, IMP[0], IMP[1], 160); g.addColorStop(0, `rgba(255,255,255,${0.6 * (1 - P(t, 22.74, 23.1))})`); g.addColorStop(1, 'rgba(255,255,255,0)'); o.fillStyle = g; o.fillRect(IMP[0] - 160, IMP[1] - 160, 320, 320);
      o.restore();
    }
  }
  S.upd = (t) => {
    const shk = shake(t, 22.74, 0.5, 34, 26, 8), shk2 = shake(t, 21.06, 0.3, 10, 30, 2);
    const drift = P(t, 20.4, 23.2, E.lin);
    const kin = P(t, 20.4, 20.8, E.outQt);
    const zf = P(t, 20.95, 21.4, E.ioQt) * (1 - P(t, 22.15, 22.6, E.ioQt));
    cv.style.transform = V ? `translate(${shk.x + shk2.x + 10}px,${shk.y + shk2.y + 120 * zf}px) perspective(1600px) rotateY(${lerp(-10, -4, drift) + 3 * zf}deg) rotateX(${lerp(7, 3, drift)}deg) scale(${(lerp(0.86, 0.69, kin) + 0.03 * drift) * (1 + 0.06 * zf)})` : `translate(${shk.x + shk2.x - 95 * zf}px,${shk.y + shk2.y + 200 * zf}px) perspective(1600px) rotateY(${lerp(-14, -6, drift) + 4 * zf}deg) rotateX(${lerp(8, 4, drift)}deg) scale(${(lerp(1.25, 1.02, kin) + 0.05 * drift) * (1 + 0.1 * zf)})`;
    cv.style.filter = blurF((1 - kin) * 14);
    S.el.style.background = t < 23.22 && t > 20.7 ? '#0A0C11' : 'transparent';
    if (t < 23.22) {
      drawBoard(t); ctx.clearRect(0, 0, 1920, 1080); ctx.drawImage(off, 0, 0); snapped = false;
    } else {
      if (!snapped) { drawBoard(23.22); snap.getContext('2d').clearRect(0, 0, 1920, 1080); snap.getContext('2d').drawImage(off, 0, 0); snapped = true; }
      ctx.clearRect(0, 0, 1920, 1080);
      const lt = t - 23.22;
      for (const sh of shards) {
        const k = Math.max(0, lt - sh.delay);
        const x = sh.vx * k, y = sh.vy * k + 2600 * k * k;
        const rr = sh.vr * k, sc = 1 + 0.35 * Math.min(1, k * 2);
        ctx.save(); ctx.globalAlpha = clamp(1 - k * 1.3);
        ctx.translate(sh.cx + x, sh.cy + y); ctx.rotate(rr); ctx.scale(sc, sc); ctx.translate(-sh.cx, -sh.cy);
        ctx.beginPath(); sh.poly.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
        ctx.save(); ctx.clip(); ctx.drawImage(snap, 0, 0); ctx.restore();
        ctx.strokeStyle = 'rgba(200,225,255,.55)'; ctx.lineWidth = 2; ctx.stroke();
        ctx.restore();
      }
    }
  };
  FLASHES.push([22.74, .5, .4, '#FF3B4E'], [23.22, .35, .25, '#ffffff']);
  MB.push([23.2, 23.9, 4], [22.7, 23.0, 3]);
}

// ===================== D2 + D3: plans shuffle, vortex, freeze (23.1 - 29.3) =====================
{
  const S = Scene('D23', 23.1, 29.35, 14);
  S.el.innerHTML = `<div class="bgMuse"></div><div class="dark abs" style="inset:0;background:radial-gradient(circle at 50% 50%, rgba(30,40,70,0) 0%, rgba(20,28,52,.55) 100%)"></div><div class="cam" style="perspective:1500px"></div>`;
  const cam = S.el.querySelector('.cam'), dark = S.el.querySelector('.dark');
  const plans = [['🏨', '洛杉矶酒店', '10月1日 入住 · 3晚', '#FFF2E3'], ['🚗', 'LAX 接机', '10月1日 · 9:45 AM', '#E8F3FF'], ['📅', '客户会议', '10月2日 · 10:00 AM', '#EEF0FF'], ['🍽️', '晚餐预订', '10月1日 · 7:30 PM', '#FFEDEF']];
  const POS = V ? [[960, 205], [960, 420], [960, 635], [960, 850]] : [[520, 360], [1400, 360], [520, 720], [1400, 720]];
  const PERM = [[0, 1, 2, 3], [1, 3, 0, 2], [3, 2, 1, 0], [2, 0, 3, 1]];
  const PT = [24.06, 24.47, 24.89];
  const cards = plans.map(([ic, ti, su, bg], i) => {
    const c = el('div', 'card', `<div style="display:flex;align-items:center;gap:22px;height:100%;padding:0 28px">
      <div class="emoji" style="width:84px;height:84px;border-radius:22px;background:${bg};display:flex;align-items:center;justify-content:center;font-size:44px;flex:none">${ic}</div>
      <div style="flex:1"><div style="font:600 32px 'Noto Sans CJK SC'">${ti}</div><div style="font:400 23px Inter,'Noto Sans CJK SC';color:#7b8091;margin-top:4px" class="sub">${su}</div></div>
      <div class="chip" style="position:relative;height:44px;padding:0 18px;border-radius:22px;background:#E6F7EE;color:#11A04D;font:600 20px 'Noto Sans CJK SC';display:flex;align-items:center;white-space:nowrap;overflow:hidden">✓ 已确认<div class="rc" style="position:absolute;inset:0;background:#FDE6EA;color:#E3173E;display:flex;align-items:center;justify-content:center">待重新安排</div></div></div>`,
      cam, { left: '0', top: '0', width: '560px', height: '160px' });
    return { c, rc: c.querySelector('.rc'), sub: c.querySelector('.sub'), i };
  });
  const glyphs = ['?', '?', '?', '？', '?', '?', '?', '？', '?', '?', '⏰', '✈️', '📅', '?', '?', '?', '💸', '?'];
  const gcols = ['#1b1f2a', '#0064E0', '#E3173E', '#8A93A6', '#1b1f2a'];
  const parts = []; { const r = rng(55); for (let i = 0; i < 95; i++) parts.push({ g: glyphs[Math.floor(r() * glyphs.length)], c: gcols[Math.floor(r() * gcols.length)], r0: 450 + r() * 1000, th: r() * 6.283, sz: 28 + r() * 90, sp: 0.7 + r() * 0.6, d: r() * 0.9 }); }
  const cv = el('canvas', null, null, S.el, { position: 'absolute', inset: '0', width: '1920px', height: '1080px' }); cv.width = 1920; cv.height = 1080; const ctx = cv.getContext('2d');
  const orb = el('div', 'abs', `<div style="position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg, rgba(90,170,255,0), rgba(90,170,255,.55), rgba(90,170,255,0) 20%, rgba(90,170,255,.4) 40%, rgba(90,170,255,0) 55%, rgba(90,170,255,.5) 75%, rgba(90,170,255,0));filter:blur(18px)" class="rays"></div><div style="position:absolute;left:25%;top:25%;width:50%;height:50%;border-radius:50%;background:radial-gradient(#ffffff 0%, #9fd0ff 30%, #0064E0 60%, rgba(0,100,224,0) 72%)"></div>`, S.el, { left: '660px', top: '240px', width: '600px', height: '600px' });
  const rays = orb.querySelector('.rays');
  const TS0 = 25.31, TF = 27.36;
  function vtime(t) { // integrated time with bullet-time slow down
    if (t <= TS0) return 0;
    let tau = 0; const dt = 1 / 240;
    for (let x = TS0; x < t; x += dt) { const ts = lerp(1, 0.035, P(x, TF - 0.08, TF + 0.3, E.ioC)); tau += ts * Math.min(dt, t - x); }
    return tau;
  }
  const spiral = (r0, th0, sp, tau) => { const r = r0 * Math.exp(-0.62 * tau * sp); const th = th0 + tau * sp * (0.9 + 260 / (r + 140)); return [960 + Math.cos(th) * r, 540 + Math.sin(th) * r * 0.62, r]; };
  S.upd = (t) => {
    const tau = vtime(t);
    const freeze = P(t, TF - 0.05, TF + 0.35, E.ioC);
    // cards
    cards.forEach((C, i) => {
      const t0 = 23.25 + i * 0.07;
      const ke = SP(t - t0, 1.1, 5.5);
      // shuffle position
      let pi = i; let x, y, lift = 0, rz = 0;
      let cur = POS[PERM[0][i]];
      for (let k = 0; k < PT.length; k++) {
        const kk = P(t, PT[k], PT[k] + 0.36, E.ioQt);
        const a = POS[PERM[k][i]], b = POS[PERM[k + 1][i]];
        if (t >= PT[k]) { cur = [lerp(a[0], b[0], kk), lerp(a[1], b[1], kk)]; lift = Math.sin(kk * Math.PI) * (i % 2 ? -1 : 1) * 90; rz = Math.sin(kk * Math.PI) * (i % 2 ? 9 : -9); }
      }
      x = cur[0] + (V ? lift * 1.8 : 0); y = cur[1] + (V ? 0 : lift);
      let s = 0.6 + 0.4 * ke, o = t > t0 ? Math.min(1, ke * 1.5) : 0, rot = rz, f = 0;
      // vortex suck
      if (tau > 0) {
        const dx = x - 960, dy = (y - 540) / 0.62; const r0 = Math.hypot(dx, dy), th0 = Math.atan2(dy, dx);
        const [vx, vy, rr] = spiral(r0, th0, 0.9 + i * 0.1, tau * 1.25);
        x = vx; y = vy; s *= clamp(rr / r0 * 1.1, 0.12, 1); rot += tau * 90 * (i % 2 ? 1 : -1); f = (1 - freeze) * Math.min(6, tau * 3);
      }
      set(C.c, { x: x - 280, y: y - 80, s: s * (V ? 1.1 : 1.28), r: rot + (1 - ke) * 10, rx: (1 - ke) * 50, o, f: blurF(f) });
      const kr = P(t, 24.06 + i * 0.08, 24.2 + i * 0.08, E.outQt);
      C.rc.style.clipPath = `inset(0 ${100 - 100 * kr}% 0 0)`;
      C.sub.style.textDecoration = t > 24.1 + i * .08 ? 'line-through' : 'none';
      C.sub.style.color = t > 24.1 + i * .08 ? '#E3173E' : '#7b8091';
    });
    // vortex glyphs
    ctx.clearRect(0, 0, 1920, 1080);
    const kv = P(t, 25.2, 25.8, E.lin);
    if (kv > 0) {
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (const p of parts) {
        const tt = Math.max(0, tau - p.d * 0.4);
        const ghosts = freeze > 0.8 ? 1 : 3;
        for (let g = ghosts - 1; g >= 0; g--) {
          const [x, y, rr] = spiral(p.r0, p.th, p.sp, tt - g * 0.03 * (1 - freeze));
          const sz = p.sz * clamp(0.25 + rr / p.r0, 0.2, 1.2);
          ctx.globalAlpha = kv * clamp(tt * 2.5) * (g ? 0.18 : 0.9) * clamp(rr / 60);
          ctx.fillStyle = p.c; ctx.font = `${p.g.length > 1 || p.g.charCodeAt(0) > 255 && p.g !== '？' ? '' : '800 '}${sz.toFixed(0)}px Inter,'Noto Color Emoji','Noto Sans CJK SC'`;
          ctx.save(); ctx.translate(x, y); ctx.rotate(tt * 1.5 * p.sp + p.th); ctx.fillText(p.g, 0, 0); ctx.restore();
        }
      }
      ctx.globalAlpha = 1;
    }
    dark.style.opacity = P(t, 25.0, 26.6, E.ioC) * (1 - 0.3 * freeze);
    // freeze look + heartbeat
    const hb = bump(t, 27.47, 27.55, 27.85) + bump(t, 28.33, 28.41, 28.7);
    cam.style.transform = `scale(${1 + 0.03 * hb + 0.04 * freeze})`;
    cv.style.transform = `scale(${1 + 0.03 * hb + 0.04 * freeze})`;
    const gf = freeze > 0.01 ? `grayscale(${(0.8 * freeze).toFixed(3)}) contrast(${1 + 0.06 * freeze})` : 'none';
    cam.style.filter = gf; cv.style.filter = gf;
    const ko = P(t, 28.05, 28.85, E.inQ);
    set(orb, { s: 0.05 + 1.3 * ko, o: ko });
    rays.style.transform = `rotate(${t * 60}deg)`;
  };
  MB.push([23.9, 24.3, 3], [24.3, 24.7, 3], [24.8, 25.2, 3], [25.4, 27.3, 3]);
}
StrokeWipe(28.55, 0.95, { width: 980 });
