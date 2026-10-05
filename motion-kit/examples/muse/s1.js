const V = !!window.VMODE;
// ===================== BG =====================
const SBG = Scene('bg', 0, 999, 0);
SBG.el.innerHTML = '<div class="bgMuse"></div>';

// ===================== A: opening (0 - 7.42) =====================
{
  const S = Scene('A', 0, 7.44, 10);
  S.el.innerHTML = `<div class="bgMuse"></div><div class="cam"></div>`;
  const cam = S.el.querySelector('.cam');
  cam.style.perspective = '1600px';
  // logo draw
  const logo = el('div', 'abs', `<svg width="520" height="520" viewBox="0 0 100 100" style="overflow:visible">
    <defs>${MUSE_GRAD('agA')}<mask id="amA" maskUnits="userSpaceOnUse" x="-20" y="-20" width="140" height="140">
      <path class="cl" d="${MUSE_CL}" stroke="#fff" stroke-width="21" fill="none" stroke-linecap="round" stroke-linejoin="round"/></mask>
      <filter id="tipblur" x="-3" y="-3" width="7" height="7"><feGaussianBlur stdDeviation="2.2"/></filter></defs>
    <path class="lg" d="${MUSE_D}" fill="url(#agA)" mask="url(#amA)"/>
    <circle class="tip" r="5" fill="#7cc0ff" filter="url(#tipblur)"/><circle class="tip2" r="1.6" fill="#fff"/>
  </svg>`, cam, { left: '700px', top: '280px', width: '520px', height: '520px' });
  const cl = logo.querySelector('.cl'), lg = logo.querySelector('.lg'), tip = logo.querySelector('.tip'), tip2 = logo.querySelector('.tip2');
  let CLL = 0;
  INITS.push(() => { CLL = cl.getTotalLength(); });

  // timer ring
  const RCX = V ? 960 : 700, RCY = V ? 380 : 540, RR = 360, RS = V ? 0.8 : 1;
  const ringW = el('div', 'abs', `<svg width="900" height="900" viewBox="-450 -450 900 900" style="overflow:visible">
    <defs><linearGradient id="rgA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#18A0FF"/><stop offset=".6" stop-color="#0064E0"/><stop offset="1" stop-color="#0040DC"/></linearGradient>
    <filter id="rglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter></defs>
    <g class="ticks"></g>
    <circle r="360" fill="none" stroke="#E2E7F1" stroke-width="32"/>
    <circle class="pg2" r="360" fill="none" stroke="#5AAEFF" stroke-opacity=".55" stroke-width="36" stroke-linecap="round" transform="rotate(-90)" filter="url(#rglow)"/>
    <circle class="pg" r="360" fill="none" stroke="url(#rgA)" stroke-width="32" stroke-linecap="round" transform="rotate(-90)"/>
  </svg>`, cam, { left: (RCX - 450) + 'px', top: (RCY - 450) + 'px', width: '900px', height: '900px' });
  const ticks = ringW.querySelector('.ticks');
  let tk = ''; for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, r1 = 410, r2 = i % 5 ? 422 : 436; tk += `<line x1="${Math.sin(a) * r1}" y1="${-Math.cos(a) * r1}" x2="${Math.sin(a) * r2}" y2="${-Math.cos(a) * r2}" stroke="#C9D3E6" stroke-width="${i % 5 ? 2 : 4}" stroke-linecap="round" class="tk"/>`; }
  ticks.innerHTML = tk;
  const tickEls = [...ticks.querySelectorAll('.tk')];
  const pg = ringW.querySelector('.pg'), pg2 = ringW.querySelector('.pg2');
  const C = 2 * Math.PI * 360;
  const dig = el('div', 'abs tab', '00:00', cam, { left: (RCX - 450) + 'px', width: '900px', top: (RCY - 148) + 'px', textAlign: 'center', font: '700 222px Inter', letterSpacing: '-7px', color: '#0B0B10' });
  const digSub = el('div', 'abs', `<span style="display:inline-flex;align-items:center;gap:12px;background:#EAF1FE;color:#0B5BD8;border-radius:40px;padding:10px 28px 12px;font:600 40px Inter,'Noto Sans CJK SC'">${museSVG(42)} 用时</span>`, cam, { left: (RCX - 450) + 'px', width: '900px', top: (RCY + 128 * RS - 30 * (1 - RS)) + 'px', textAlign: 'center' });
  const tipIcon = el('div', 'abs', appIcon(112), cam, { left: '0', top: '0' });

  // status pills
  const pills = [
    [1.76, '📞', '联系美联航客服', V ? 960 : 1190, V ? 735 : 300, '#E6F7EE'],
    [2.54, '🎧', '真人客服已接入', V ? 960 : 1190, V ? 840 : 480, '#EEF3FE'],
    [3.3, '✅', '改签完成', V ? 960 : 1190, V ? 945 : 660, '#E6F7EE'],
  ].map(([t0, ic, tx, x, y, bg]) => { const p = el('div', 'pill', `<span class="pi emoji" style="background:${bg};width:84px;height:84px;font-size:44px">${ic}</span>${tx}`, cam, { left: x + 'px', top: y + 'px', font: "600 50px Inter,'Noto Sans CJK SC'", padding: '16px 40px 16px 18px', gap: '20px', transformOrigin: V ? '50% 50%' : '0 50%' }); return { p, t0, x, y, w: 0 }; });
  if (V) INITS.push(() => pills.forEach(q => q.w = q.p.offsetWidth));

  // boarding pass
  const pass = el('div', 'card', `
   <div style="position:absolute;left:0;top:0;width:640px;height:340px;padding:34px 40px">
     <div style="display:flex;justify-content:space-between;align-items:center"><img src="${A}United_Airlines_Logo.svg" style="height:30px"><span style="font:600 16px Inter;letter-spacing:3px;color:#8a8fa0">BOARDING PASS</span></div>
     <div style="display:flex;align-items:center;justify-content:space-between;margin-top:30px">
       <div><div style="font:800 92px Inter;letter-spacing:-2px;line-height:1">PEK</div><div style="font:500 20px Inter,'Noto Sans CJK SC';color:#6b7080;margin-top:6px">北京 Beijing</div></div>
       <div style="display:flex;align-items:center;gap:10px;color:#0064E0"><i style="display:block;width:70px;border-top:3px dashed #BCD2F7"></i>${ICON.plane('#0064E0', 40)}<i style="display:block;width:70px;border-top:3px dashed #BCD2F7"></i></div>
       <div style="text-align:right"><div style="font:800 92px Inter;letter-spacing:-2px;line-height:1">LAX</div><div style="font:500 20px Inter,'Noto Sans CJK SC';color:#6b7080;margin-top:6px">洛杉矶 Los Angeles</div></div>
     </div>
     <div style="display:flex;gap:46px;margin-top:30px;font:500 15px Inter;color:#8a8fa0;letter-spacing:1.5px">
       <div>DATE<div style="font:700 26px Inter;color:#111;letter-spacing:0;margin-top:4px">OCT 2</div></div>
       <div>DEPARTS<div style="font:700 26px Inter;color:#111;letter-spacing:0;margin-top:4px">1:05 PM</div></div>
       <div>SEAT<div style="font:700 26px Inter;color:#111;letter-spacing:0;margin-top:4px">34A</div></div>
     </div>
   </div>
   <div style="position:absolute;left:640px;top:24px;bottom:24px;border-left:3px dashed #E1E4EC"></div>
   <div style="position:absolute;left:640px;top:0;width:240px;height:340px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px">
     ${appIcon(84)}
     <div style="width:150px;height:74px;background:repeating-linear-gradient(90deg,#111 0 3px,transparent 3px 5px,#111 5px 6px,transparent 6px 10px,#111 10px 14px,transparent 14px 16px)"></div>
   </div>
   <div class="stamp" style="position:absolute;left:330px;top:150px;border:6px solid #11A04D;color:#11A04D;border-radius:16px;padding:6px 18px;font:800 46px Inter;letter-spacing:3px;display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.85)">${ICON.check('#11A04D', 44, 3.4)}REBOOKED</div>`,
    cam, { left: '520px', top: '370px', width: '880px', height: '340px', borderRadius: '32px' });
  const stamp = pass.querySelector('.stamp');

  // refresh spinner
  const spin = el('div', 'abs', `<svg width="90" height="90" viewBox="-45 -45 90 90"><defs>${MUSE_GRAD('spg')}</defs>
    <circle r="30" fill="none" stroke="#DCE6F7" stroke-width="7"/><circle class="sa" r="30" fill="none" stroke="#0064E0" stroke-width="7" stroke-linecap="round" stroke-dasharray="60 200"/></svg>`, cam, { left: '915px', top: '150px' });
  const shock = el('div', 'abs', null, cam, { left: '960px', top: '540px', width: '10px', height: '10px', borderRadius: '50%', border: '10px solid #5AAEFF' });
  const shock2 = el('div', 'abs', null, cam, { left: '960px', top: '540px', width: '10px', height: '10px', borderRadius: '50%', border: '3px solid #0064E0' });

  // mascot circle + orbit icons
  const orbitIcons = ['icon-envelope@2x.webp', 'icon-airplane@2x.webp', 'icon-cart@2x.webp', 'icon-calendar@2x.webp', 'icon-piggybank@2x.webp'].map(f => el('img', 'abs', null, cam, { width: '120px', height: '120px' }));
  orbitIcons.forEach((im, i) => im.src = A + ['icon-envelope@2x.webp', 'icon-airplane@2x.webp', 'icon-cart@2x.webp', 'icon-calendar@2x.webp', 'icon-piggybank@2x.webp'][i]);
  const mcW = el('div', 'abs', null, cam, { left: '730px', top: '310px', width: '460px', height: '460px' });
  const mc = el('div', 'abs', null, mcW, { inset: '0', borderRadius: '50%', overflow: 'hidden', background: '#F6F6F6', boxShadow: '0 30px 80px rgba(30,60,140,.22), 0 0 0 10px rgba(255,255,255,.9)' });
  const mav = Avatar(mc, 460, 'hc', [40, 0, 250, 250]);
  mav.el.style.position = 'absolute';
  const mcBlue = el('div', 'abs', `<div style="position:absolute;left:34px;top:22px;font:600 96px Inter;color:#fff">1</div><img src="${A}icon-airplane@2x.webp" style="position:absolute;left:101px;top:92px;width:128px;height:128px">`, mc, { inset: '0', background: '#3E86F2', opacity: 0 });
  const badge = el('div', 'abs', appIcon(110), cam, { left: '1110px', top: '300px' });

  S.upd = (t) => {
    // --- logo draw ---
    const kd = P(t, 0.05, 0.95, E.ioQ);
    const len = CLL * kd;
    cl.style.strokeDasharray = `${len} ${CLL + 10}`;
    if (kd > 0 && kd < 1) { const pt = cl.getPointAtLength(len); tip.setAttribute('cx', pt.x); tip.setAttribute('cy', pt.y); tip2.setAttribute('cx', pt.x); tip2.setAttribute('cy', pt.y); tip.style.opacity = tip2.style.opacity = 1; } else tip.style.opacity = tip2.style.opacity = 0;
    lg.setAttribute('mask', kd >= 1 ? '' : 'url(#amA)');
    // logo -> shrinks into ring tip
    const kl = P(t, 0.98, 1.34, E.ioQt);
    const ringA = 0; // angle for tip at start (top)
    set(logo, { x: lerp(0, RCX - 960, kl), y: lerp(0, RCY - RR * RS - 540, kl), s: lerp(1 + 0.04 * kd, 0.2, kl), o: 1 - P(t, 1.2, 1.34, E.lin) });
    // --- ring ---
    const kr = P(t, 1.0, 1.5, E.outQt);
    const out = P(t, 3.9, 4.25, E.ioC);
    const kt = P(t, 1.1, 3.2, E.outQt); // timer progress to 9:48
    const secs = kt * 588;
    const mm = Math.floor(secs / 60), ss = Math.floor(secs % 60);
    const txt = String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
    if (dig._t !== txt) { dig.textContent = txt; dig._t = txt; }
    const prog = secs / 600;
    pg.style.strokeDasharray = `${C * prog} ${C}`; pg2.style.strokeDasharray = `${C * prog} ${C}`;
    pg2.style.opacity = 0.4 + 0.6 * beatPulse(t, 5);
    tickEls.forEach((e, i) => { e.style.opacity = P(t, 1.0 + i * 0.006, 1.2 + i * 0.006, E.lin) * (i / 60 <= prog + 0.001 ? 1 : 0.55); e.setAttribute('stroke', i / 60 <= prog ? '#5A9CF5' : '#C9D3E6'); });
    const bp = beatPulse(t, 9);
    set(ringW, { s: RS * ((0.6 + 0.4 * kr) * (1 - 0.35 * out) + 0.012 * bp), o: kr * (1 - out), r: -20 * (1 - kr), f: blurF(out * 10) });
    set(dig, { s: RS * (0.7 + 0.3 * P(t, 1.05, 1.5, E.outB)) * (1 - 0.3 * out) * (1 + 0.025 * bp), o: P(t, 1.05, 1.3, E.lin) * (1 - out), f: blurF(out * 12) });
    set(digSub, { s: RS, y: 20 * (1 - P(t, 1.3, 1.7, E.outC)), o: P(t, 1.3, 1.6, E.lin) * (1 - out) });
    // tip icon rides the ring
    const ang = prog * Math.PI * 2;
    const tx = RCX + Math.sin(ang) * RR * RS - 56, ty = RCY - Math.cos(ang) * RR * RS - 56;
    set(tipIcon, { x: tx, y: ty, s: P(t, 1.18, 1.45, E.outB) * (1 - out), o: P(t, 1.18, 1.3, E.lin) * (1 - out), r: Math.sin(t * 3) * 6 });
    // pills
    pills.forEach(({ p, t0, w }, i) => { const k = SP(t - t0, 1.3, 6.5); const ko = P(t, 3.88 + i * 0.04, 4.15 + i * 0.04, E.inB); set(p, { s: (V ? 0.84 : 1) * (0.6 + 0.4 * k), o: P(t, t0, t0 + .15, E.lin) * (1 - ko), x: (V ? -w / 2 : 0) + (V ? 0 : 90 * (1 - k)) + ko * 420 * (V ? 0 : 1), y: V ? 40 * (1 - k) + ko * 160 : 0, f: blurF(ko * 10) }); });
    // --- boarding pass flip-in at 3.85 ---
    const kp = SP(t - 3.95, 1.1, 5.5);
    const pullDown = P(t, 4.6, 5.1, E.outC) * 150 - P(t, 5.1, 5.24, E.inC) * 150;
    const release = P(t, 5.16, 5.5, E.inQ);
    set(pass, { ry: -95 * (1 - kp), s: (V ? 1.12 : 1.38) * (0.85 + 0.15 * kp) * (1 - 0.2 * release), y: pullDown - release * 900, o: (t > 3.93 ? 1 : 0) * (1 - P(t, 5.3, 5.45, E.lin)), f: blurF(release * 18 + (1 - clamp(kp * 1.4)) * 6) });
    const ks = P(t, 4.18, 4.34, E.inQ);
    set(stamp, { s: 2.6 - 1.6 * ks, r: -12, o: ks });
    // spinner
    const kspin = P(t, 4.6, 4.9, E.outB) * (1 - P(t, 5.18, 5.35, E.inC));
    set(spin, { s: kspin, o: kspin, r: t * 540, y: pullDown * 0.45 });
    spin.querySelector('.sa').style.strokeDasharray = `${40 + 60 * P(t, 4.4, 5.1)} 200`;
    // shockwave at 5.18
    const kw = P(t, 5.18, 5.9, E.outC), kw2 = P(t, 5.22, 6.0, E.outQt);
    const r1 = 10 + kw * 1100, r2 = 10 + kw2 * 1400;
    Object.assign(shock.style, { left: (960 - r1) + 'px', top: (540 - r1) + 'px', width: 2 * r1 + 'px', height: 2 * r1 + 'px', borderWidth: (40 * (1 - kw) + 1) + 'px', opacity: (t > 5.18 ? 1 - kw : 0) * 0.55 });
    Object.assign(shock2.style, { left: (960 - r2) + 'px', top: (540 - r2) + 'px', width: 2 * r2 + 'px', height: 2 * r2 + 'px', borderWidth: '3px', opacity: t > 5.22 ? (1 - kw2) : 0 });
    // --- mascot pop ---
    const km = SP(t - 5.28, 1.2, 5.2);
    mav.t0 = 5.28; mav.draw(t);
    // morph circle -> tile at 6.92..7.42
    const kt2 = P(t, 6.9, 7.38, E.ioQt);
    const size = lerp(460, 330, kt2);
    mcW.style.left = (960 - size / 2) + 'px'; mcW.style.top = (540 - size / 2) + 'px'; mcW.style.width = mcW.style.height = size + 'px';
    mc.style.borderRadius = lerp(size / 2, 57, kt2) + 'px';
    mav.el.style.width = mav.el.style.height = size + 'px';
    mcBlue.style.opacity = P(t, 6.98, 7.3, E.lin);
    set(mcW, { s: km * (1 + 0.03 * Math.sin(t * 2.2) * (1 - kt2)), o: t > 5.26 ? 1 : 0 });
    const kb = SP(t - 5.9, 1.2, 6) * (1 - P(t, 6.8, 7.0, E.inB));
    set(badge, { s: kb, r: -10 + 10 * kb, o: kb > 0.01 ? 1 : 0 });
    // orbit icons
    orbitIcons.forEach((im, i) => {
      const t0 = 5.64 + i * 0.09;
      const k = P(t, t0, t0 + 0.6, E.outQt), ko = P(t, 6.85, 7.25, E.inC);
      const a = i / 5 * Math.PI * 2 + t * 0.55 - 1.2;
      const rx = (360 + 900 * (1 - k) + 700 * ko), ry = (300 + 600 * (1 - k) + 500 * ko);
      set(im, { x: 960 + Math.cos(a) * rx - 60, y: 540 + Math.sin(a) * ry - 60, s: 0.6 + 0.4 * k + Math.sin(t * 3 + i) * 0.03, r: Math.sin(t * 1.7 + i) * 10, o: (t > t0 ? 1 : 0) * (1 - ko), f: blurF((1 - k) * 10 + ko * 12) });
    });
    // whole-cam RGB kick at refresh
    const rgb = Math.exp(-8 * Math.max(0, t - 5.18)) * (t > 5.18 ? 14 : 0);
    rgbSplit(cam, rgb);
    const shk = shake(t, 5.18, 0.4, 16);
    set(cam, { x: shk.x, y: shk.y, r: shk.r });
  };
  FLASHES.push([5.2, .45, .35, '#EAF3FF']);
  MB.push([5.1, 5.5, 4], [6.85, 7.3, 3], [0.95, 1.4, 3]);
}

// ===================== B1: calendar (7.3 - 8.75) =====================
{
  const S = Scene('B1', 7.3, 8.72, 11);
  S.el.innerHTML = `<div class="bgMuse"></div><div class="persp" style="position:absolute;inset:0;perspective:1800px;perspective-origin:50% 40%"><div class="cam"></div></div>`;
  const cam = S.el.querySelector('.cam');
  const tiles = [];
  el('div', 'abs', 'October', cam, { left: V ? '700px' : '381px', top: '118px', font: '600 64px Inter', letterSpacing: '-1px' });
  el('div', 'abs', '2026', cam, { left: V ? '969px' : '650px', top: '130px', font: '500 50px Inter', color: '#9aa0ad' });
  const dows = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  for (let c = 0; c < 7; c++) el('div', 'abs', dows[c], cam, { left: (381 + c * 168) + 'px', width: '150px', top: '198px', textAlign: 'center', font: '600 22px Inter', color: '#9aa0ad' });
  for (let d = 1; d <= 31; d++) {
    const idx = d + 3, c = idx % 7, r = Math.floor(idx / 7);
    const x = 381 + c * 168, y = 225 + r * 168;
    const blue = d === 1;
    const tl = el('div', 'abs', blue ? `<div style="position:absolute;left:16px;top:10px;font:600 44px Inter;color:#fff">1</div><img src="${A}icon-airplane@2x.webp" style="position:absolute;left:46px;top:42px;width:58px;height:58px"><div style="position:absolute;left:14px;right:14px;bottom:12px;height:30px;border-radius:15px;background:#71A8F5;color:#fff;font:600 13px Inter;display:flex;align-items:center;justify-content:center">PEK → LAX</div>`
      : `<div style="position:absolute;left:18px;top:12px;font:500 44px Inter;color:${c === 0 || c === 6 ? '#A3A8B4' : '#16161a'}">${d}</div>`, cam,
      { left: x + 'px', top: y + 'px', width: '150px', height: '150px', borderRadius: '26px', background: blue ? '#3E86F2' : '#fff', boxShadow: blue ? '0 18px 40px rgba(40,110,240,.35)' : '0 4px 14px rgba(30,50,110,.06)' });
    tiles.push({ tl, d, x, y, c, r });
  }
  const T1 = { x: 381 + 4 * 168 + 75, y: 225 + 75 };
  S.upd = (t) => {
    const k = P(t, 7.34, 8.25, E.ioQt);
    const FX = V ? 1040 : 960, FY = V ? 430 : 470, FS = V ? 1.38 : 1.45;
    const s0 = 2.2, s = lerp(s0, FS, k);
    const tx = lerp(-s * (T1.x - 960), -s * (FX - 960), k), ty = lerp(-s * (T1.y - 540), -s * (FY - 540), k);
    const push = P(t, 8.2, 8.5, E.inC);
    const whip = P(t, 8.42, 8.7, E.ioQt);
    cam.style.transformOrigin = '960px 540px';
    cam.style.transform = `translate(${tx - whip * 1920 - push * 60}px,${ty}px) rotateX(${9 * k}deg) rotateY(${-4 * k + 4 * push}deg) scale(${s * (1 + 0.06 * push)})`;
    for (const T of tiles) {
      if (T.d === 1) continue;
      const dist = Math.hypot(T.c - 4, T.r - 0);
      const kk = P(t, 7.36 + dist * 0.05, 7.7 + dist * 0.05, E.outB);
      set(T.tl, { s: 0.5 + 0.5 * kk, o: kk });
    }
    S.el.style.filter = blurF(P(t, 8.45, 8.62, E.inQ) * 4);
  };
  MB.push([8.4, 8.72, 6]);
}

// ===================== B2: United sky (8.42 - 9.8) =====================
{
  const S = Scene('B2', 8.42, 9.88, 12);
  S.el.innerHTML = `<div class="cam" style="background:linear-gradient(180deg,#2E6FCF 0%,#5B97E4 45%,#A9CCF3 100%);overflow:hidden"></div>`;
  const cam = S.el.querySelector('.cam');
  const clouds = [];
  const r = rng(7);
  for (let i = 0; i < 14; i++) {
    const layer = i % 3;
    const w = 300 + r() * 700, h = w * (0.18 + r() * .12);
    const c = el('div', 'abs', null, cam, { width: w + 'px', height: h + 'px', borderRadius: '50%', background: `rgba(255,255,255,${0.35 + layer * 0.2})`, filter: `blur(${30 - layer * 8}px)` });
    clouds.push({ c, x: r() * 2600 - 300, y: 120 + r() * 900, sp: 250 + layer * 420, layer });
  }
  const trail = el('div', 'abs', null, cam, { height: '10px', borderRadius: '5px', background: 'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.75))', filter: 'blur(3px)' });
  const trail2 = el('div', 'abs', null, cam, { height: '10px', borderRadius: '5px', background: 'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.75))', filter: 'blur(3px)' });
  const PWID = V ? 1250 : 1560, PSC = PWID / 1560;
  const plane = el('img', 'abs', null, cam, { width: PWID + 'px' });
  plane.src = A + 'plane_ua.png';
  const ua = el('div', 'abs', `<img src="${A}United_Airlines_Logo.svg" style="height:96px;display:block">`, cam, { left: '960px', top: '110px', padding: '34px 64px', background: 'rgba(255,255,255,.94)', borderRadius: '70px', boxShadow: '0 20px 60px rgba(10,40,120,.25)', transformOrigin: '50% 50%' });
  const uaW = { w: 0 };
  INITS.push(() => { uaW.w = ua.offsetWidth; });
  S.upd = (t) => {
    const whip = P(t, 8.42, 8.7, E.ioQt);
    const iris = P(t, 9.5, 9.82, E.ioC);
    cam.style.transform = `translateX(${1920 * (1 - whip)}px)`;
    S.el.style.clipPath = iris > 0 ? `circle(${lerp(1200, 400, iris)}px at 960px 540px)` : 'none';
    S.el.style.opacity = 1 - P(t, 9.72, 9.86, E.lin);
    for (const C of clouds) { let x = C.x - (t - 8.4) * C.sp; x = ((x + 700) % 2600 + 2600) % 2600 - 700; set(C.c, { x, y: C.y }); }
    const kp = P(t, 8.5, 9.2, E.outQt);
    const px = lerp(-1900, V ? 330 : 180, kp) + (t - 9.2) * (V ? 120 : 180) * (t > 9.2 ? 1 : 0);
    const py = (V ? 380 : 330) + 30 * (1 - kp) + Math.sin(t * 2.4) * 6;
    set(plane, { x: px, y: py, r: -3 + Math.sin(t * 1.3) * 0.6 });
    // engine trails
    const tl = 600 * kp;
    set(trail, { x: px + 700 * PSC - tl, y: py + 330 * PSC }); trail.style.width = tl + 'px';
    set(trail2, { x: px + 550 * PSC - tl * 0.8, y: py + 390 * PSC }); trail2.style.width = tl * 0.8 + 'px';
    trail.style.opacity = trail2.style.opacity = 0.7 * kp;
    // united logo reveal at 8.89
    const ku = P(t, 8.85, 9.2, E.outQt);
    ua.style.clipPath = `inset(0 ${100 - 100 * ku}% 0 0 round 70px)`;
    set(ua, { x: -uaW.w / 2, y: 14 * (1 - ku), s: 0.92 + 0.08 * SP(t - 8.85, 1.2, 6) });
  };
  MB.push([8.42, 9.25, 5]);
}

// ===================== B3 + C1: globe, route, night (9.35 - 12.35) =====================
{
  const S = Scene('B3', 9.35, 12.36, 11);
  const bg = el('div', 'abs', null, S.el, { inset: '0', background: '#F4F5F8' });
  const glow = el('div', 'abs', null, S.el, { inset: '0', background: 'radial-gradient(700px 700px at 50% 50%, rgba(120,170,245,.35), rgba(0,0,0,0) 70%)' });
  const cv = el('canvas', null, null, S.el, { position: 'absolute', inset: '0', width: '1920px', height: '1080px' });
  cv.width = 1920; cv.height = 1080;
  const ctx = cv.getContext('2d');
  const labels = el('div', 'abs', null, S.el, { inset: '0' });
  const mkLabel = (cn, code) => el('div', 'abs', `<span style="font:800 46px Inter">${code}</span><span style="font:600 40px 'Noto Sans CJK SC';color:#3d4458;margin-left:14px">${cn}</span>`, labels, { background: '#fff', borderRadius: '48px', padding: '14px 30px 16px', boxShadow: '0 14px 40px rgba(20,50,120,.22)', whiteSpace: 'nowrap', transformOrigin: '50% 100%' });
  const lPEK = mkLabel('北京', 'PEK'), lLAX = mkLabel('洛杉矶', 'LAX');
  const planeI = el('div', 'abs', `<div style="width:54px;height:54px;border-radius:50%;background:#0064E0;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(0,80,220,.5)">${ICON.plane('#fff', 30)}</div>`, labels);
  const D = window.LAND_DOTS;
  const rad = Math.PI / 180;
  const PEK = [116.6, 40.08], LAX = [-118.41, 33.94];
  const toV = ([lo, la]) => [Math.cos(la * rad) * Math.cos(lo * rad), Math.cos(la * rad) * Math.sin(lo * rad), Math.sin(la * rad)];
  const vP = toV(PEK), vL = toV(LAX);
  const om = Math.acos(vP[0] * vL[0] + vP[1] * vL[1] + vP[2] * vL[2]);
  const slerp = s => { const a = Math.sin((1 - s) * om) / Math.sin(om), b = Math.sin(s * om) / Math.sin(om); return [a * vP[0] + b * vL[0], a * vP[1] + b * vL[1], a * vP[2] + b * vL[2]]; };
  const CITIES = [[116.4, 39.9, 1.6], [121.5, 31.2, 1.2], [139.7, 35.7, 1.3], [127, 37.5, 1], [114.1, 22.4, 1], [113.3, 23.1, .9], [104, 30.6, .8], [108.9, 34.3, .7], [126.6, 45.8, .6], [123.4, 41.8, .7], [117.2, 39.1, .9], [120.1, 30.3, .8], [135.5, 34.7, .9], [130.4, 33.6, .6], [-118.2, 34, 1.3], [-122.4, 37.8, 1], [-74, 40.7, 1.3], [-87.6, 41.9, 1], [-122.3, 47.6, .8], [37.6, 55.8, 1], [2.35, 48.9, 1], [-0.1, 51.5, 1], [77.2, 28.6, 1], [72.9, 19.1, 1], [100.5, 13.8, .8], [106.8, -6.2, .8], [103.8, 1.35, .8], [151.2, -33.9, .8], [-99.1, 19.4, 1]];
  const stars = []; { const r = rng(11); for (let i = 0; i < 260; i++) stars.push([r() * 1920, r() * 1080, r() * 1.6 + .3, r()]); }
  // projection with center (lo0, la0)
  let lo0 = 0, la0 = 0, R = 400, cx = 960, cy = 540;
  function proj(v, lift = 0) {
    // rotate vector so that (lo0,la0) faces viewer: first rotate around z by -lo0, then around y by la0
    const cl = Math.cos(-lo0 * rad), sl = Math.sin(-lo0 * rad);
    let x = v[0] * cl - v[1] * sl, y = v[0] * sl + v[1] * cl, z = v[2];
    const cp = Math.cos(la0 * rad), sp = Math.sin(la0 * rad);
    const x2 = x * cp + z * sp, z2 = -x * sp + z * cp;
    // now x2 = depth toward viewer, y = right, z2 = up
    const m = R * (1 + lift);
    return [cx + y * m, cy - z2 * m, x2];
  }
  function draw(t) {
    // animation params
    const kr = P(t, 9.45, 10.62, E.ioC);   // rotate PEK -> mid
    const kb = P(t, 10.72, 11.85, E.ioC);  // rotate back to PEK
    const loA = 116.4, laA = 30, loM = -178, laM = 44;
    let lo = lerp(loA, loM + 360 * 0, kr); // careful wrap: go east from 116 to 182 (=-178)
    lo = lerp(loA, 182, kr); lo = lerp(lo, 116.4, kb);
    lo0 = lo; la0 = lerp(lerp(laA, laM, kr), 39.9, kb);
    const zoom = P(t, 11.45, 12.25, E.inX);
    R = lerp(400, 430, P(t, 9.4, 10.6, E.outC)) * (1 + zoom * 14);
    const night = P(t, 10.72, 11.5, E.ioC);
    ctx.clearRect(0, 0, 1920, 1080);
    // stars
    if (night > 0) { for (const [x, y, s, ph] of stars) { ctx.globalAlpha = night * (0.35 + 0.5 * Math.abs(Math.sin(t * 2 + ph * 9))) * (1 - zoom); ctx.fillStyle = '#cfe0ff'; ctx.fillRect(x, y, s, s); } ctx.globalAlpha = 1; }
    // atmosphere
    const ag = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.25);
    ag.addColorStop(0, night ? `rgba(60,120,255,${0.35 * night + 0.25})` : 'rgba(100,160,255,.3)'); ag.addColorStop(1, 'rgba(100,160,255,0)');
    ctx.fillStyle = ag; ctx.beginPath(); ctx.arc(cx, cy, R * 1.25, 0, 6.283); ctx.fill();
    // sphere
    const sg = ctx.createRadialGradient(cx - R * .35, cy - R * .4, R * .1, cx, cy, R);
    const c1 = [255, 255, 255], c2 = [226, 234, 247], n1 = [22, 36, 80], n2 = [8, 14, 36];
    const mix = (a, b, k) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], k))).join(',')})`;
    sg.addColorStop(0, mix(c1, n1, night)); sg.addColorStop(1, mix(c2, n2, night));
    ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.fill();
    // dots
    const ds = Math.max(2.6, R / 165);
    const dr = lerp(28, 70, night), dg = lerp(84, 110, night), db = lerp(196, 230, night);
    for (let i = 0; i < D.length; i++) {
      const p = proj(toV(D[i]));
      if (p[2] <= 0.02) continue;
      if (p[0] < -20 || p[0] > 1940 || p[1] < -20 || p[1] > 1100) continue;
      ctx.globalAlpha = (0.3 + 0.7 * p[2]) * (1 - night * 0.45);
      ctx.fillStyle = `rgb(${dr},${dg},${db})`;
      ctx.fillRect(p[0] - ds / 2, p[1] - ds / 2, ds, ds);
    }
    ctx.globalAlpha = 1;
    // city lights at night
    if (night > 0) {
      ctx.globalCompositeOperation = 'lighter';
      for (const [lo, la, s] of CITIES) { const p = proj(toV([lo, la])); if (p[2] <= 0.05) continue; const rr = (10 + 14 * s) * Math.max(1, R / 420) * 0.9; const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], rr); g.addColorStop(0, `rgba(255,214,140,${0.9 * night * p[2]})`); g.addColorStop(1, 'rgba(255,170,80,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], rr, 0, 6.283); ctx.fill(); }
      ctx.globalCompositeOperation = 'source-over';
    }
    // route arc
    const ka = P(t, 9.52, 10.4, E.ioC);
    const arcFade = 1 - P(t, 11.2, 11.6, E.lin);
    if (ka > 0 && arcFade > 0) {
      const N = 90; const pts = [];
      for (let i = 0; i <= N * ka; i++) { const s = i / N; pts.push(proj(slerp(s), 0.2 * Math.sin(Math.PI * s))); }
      const head = proj(slerp(ka), 0.2 * Math.sin(Math.PI * ka));
      pts.push(head);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (const [w, col, a] of [[16, '#62A8FF', .25], [6, '#0064E0', 1]]) {
        ctx.globalAlpha = a * arcFade; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath();
        pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // plane icon at head
      const prev = pts[Math.max(0, pts.length - 3)];
      const ang = Math.atan2(head[1] - prev[1], head[0] - prev[0]);
      set(planeI, { x: head[0] - 27, y: head[1] - 27, r: ang * 180 / Math.PI, s: P(t, 9.52, 9.7, E.outB) * (1 - P(t, 10.35, 10.55, E.inB)), o: arcFade });
    } else set(planeI, { o: 0 });
    // pins
    const pinDraw = (v, t0, col) => { const p = proj(v); if (p[2] <= 0) return p; const k = SP(t - t0, 1.3, 6); if (k <= 0) return p; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p[0], p[1], 9 * k, 0, 6.283); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke(); const pu = ((t - t0) % 1.2) / 1.2; ctx.strokeStyle = col; ctx.globalAlpha = (1 - pu) * .7; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p[0], p[1], 10 + 40 * pu, 0, 6.283); ctx.stroke(); ctx.globalAlpha = 1; return p; };
    const pp = pinDraw(vP, 9.47, night > 0.5 ? '#FFB84D' : '#0064E0');
    const pl = pinDraw(vL, 10.05, '#0064E0');
    const kl1 = SP(t - 9.5, 1.3, 6) * (1 - P(t, 11.1, 11.35, E.inC)), kl2 = SP(t - 10.05, 1.3, 6) * (1 - P(t, 10.8, 11.0, E.inC));
    set(lPEK, { x: pp[0] - (lPEK.offsetWidth / 2), y: pp[1] - 118, s: kl1, o: pp[2] > 0 ? Math.min(1, kl1 * 2) : 0 });
    set(lLAX, { x: pl[0] - (lLAX.offsetWidth / 2), y: pl[1] - 118, s: kl2, o: pl[2] > 0 ? Math.min(1, kl2 * 2) : 0 });
    // background
    const bgc = [lerp(244, 6, night), lerp(245, 10, night), lerp(248, 24, night)].map(Math.round);
    bg.style.background = `rgb(${bgc.join(',')})`;
    glow.style.opacity = 1 - night * 0.4;
    cv.style.filter = blurF(zoom * 10);
    S.el.style.opacity = 1 - P(t, 12.0, 12.34, E.lin);
  };
  S.upd = (t) => draw(t);
  MB.push([11.6, 12.3, 3]);
}
