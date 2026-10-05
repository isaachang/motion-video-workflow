// generic message list (flex column anchored at bottom)
function MsgList(parent, style) {
  const col = el('div', 'abs', null, parent, Object.assign({ display: 'flex', flexDirection: 'column' }, style));
  const L = { col, msgs: [],
    add(html, t0, right = false, dur = 0.4) { const w = el('div', 'mw' + (right ? ' r' : ''), null, col); const inner = el('div', null, html, w); inner.style.transformOrigin = right ? '100% 100%' : '0 100%'; const m = { w, inner, t0, dur, h: 0 }; L.msgs.push(m); return m; },
    update(t) { for (const m of L.msgs) { const k = P(t, m.t0, m.t0 + m.dur, E.outQt); if (k <= 0) { show(m.w, false); continue; } show(m.w, true); m.w.style.height = (m.h * k).toFixed(2) + 'px'; set(m.inner, { s: 0.6 + 0.4 * SP(t - m.t0, 1.5, 7), o: P(t, m.t0, m.t0 + .18, E.lin), y: (1 - k) * 10 }); } } };
  INITS.push(() => { for (const m of L.msgs) { m.w.style.height = 'auto'; m.h = m.w.offsetHeight; } });
  return L;
}

// ===================== E1: Muse at work (28.95 - 31.2) =====================
{
  const S = Scene('E1', 29.0, 31.25, 17);
  S.el.innerHTML = `<div class="cam"><img class="og abs" src="${A}og-image.jpg" style="left:-68px;top:0;width:2057px;height:1080px"></div>`;
  const cam = S.el.querySelector('.cam'), og = S.el.querySelector('.og');
  og.style.transformOrigin = '1405px 700px';
  const pill = el('div', 'abs', `<div style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.95);border-radius:40px;padding:10px 26px 10px 10px;box-shadow:0 20px 60px rgba(40,50,90,.22)">
      <div class="av" style="width:64px;height:64px;border-radius:32px;overflow:hidden;background:#fff"></div>
      <div><div style="font:600 24px Inter">Muse</div><div style="font:500 21px 'Noto Sans CJK SC';color:#5d6272;margin-top:1px">🎧 正在联系美联航在线客服<span class="dd" style="display:inline-block;width:1.2em;text-align:left"></span></div></div></div>`, S.el, { left: '960px', top: '70px', transformOrigin: '50% 0' });
  let PW = 0; INITS.push(() => { PW = pill.offsetWidth; });
  const pav = Avatar(pill.querySelector('.av'), 64, 'hw');
  const dd = pill.querySelector('.dd');
  const card = el('div', 'abs', `<div class="sc" style="width:420px;background:rgba(255,255,255,.95);box-shadow:0 20px 60px rgba(40,50,90,.2);border-radius:22px;padding:16px 18px"><div class="ic" style="width:52px;height:52px;border-radius:14px;background:#FDEBDD;font-size:26px">🌐</div><div><b style="font-size:21px">Browser · united.com</b><i style="font-size:18px">正在与在线客服对话…</i></div></div>`, S.el, { left: V ? '640px' : '1180px', top: V ? '830px' : '330px', transformOrigin: '0 0' });
  const wave = el('div', 'abs', Array.from({ length: 9 }, () => '<i style="display:block;width:7px;border-radius:4px;background:#0064E0"></i>').join(''), S.el, { left: '555px', top: '330px', display: 'flex', gap: '6px', alignItems: 'center', height: '70px' });
  const bars = [...wave.children];
  S.upd = (t) => {
    const kb = P(t, 28.95, 30.5, E.lin);
    const kz = P(t, 30.45, 31.1, E.inX);
    og.style.transform = `scale(${lerp(1.06, 1.14, kb) * (1 + kz * 2.6)})`;
    cam.style.filter = blurF(kz * 14);
    const kp = SP(t - 29.34, 1.2, 6);
    set(pill, { x: -PW / 2, y: -40 * (1 - kp), s: 1.85 * (0.85 + 0.15 * kp), o: (t > 29.3 ? 1 : 0) * (1 - kz) });
    pav.draw(t);
    dd.textContent = '.'.repeat(1 + Math.floor(t * 4) % 3);
    const kc = SP(t - 29.95, 1.2, 6);
    set(card, { x: 60 * (1 - kc), s: 1.55 * (0.9 + 0.1 * kc), o: (t > 29.85 ? 1 : 0) * (1 - kz) });
    bars.forEach((b, i) => { b.style.height = (12 + 50 * Math.abs(Math.sin(t * 7 + i * 0.9) * noise1(t * 3 + i, 4))) + 'px'; });
    set(wave, { o: P(t, 29.6, 29.9, E.lin) * (1 - kz) });
    S.el.style.opacity = 1 - P(t, 30.95, 31.22, E.lin);
  };
}

// ===================== EF: dual channel + hold + surprise (30.8 - 44.95) =====================
{
  const S = Scene('EF', 30.8, 44.95, 18);
  S.el.innerHTML = `<div class="bgMuse"></div><div class="cam"><div class="abs world" style="left:0;top:0;width:1920px;height:1080px"></div></div>`;
  const cam = S.el.querySelector('.cam'), world = S.el.querySelector('.world');
  // ---------- browser window ----------
  const bw = el('div', 'card', `
    <div style="height:56px;background:#F2F3F6;border-radius:22px 22px 0 0;display:flex;align-items:center;padding:0 20px;gap:9px;border-bottom:1px solid #E6E8EE">
      <i style="width:14px;height:14px;border-radius:7px;background:#FF5F57;display:block"></i><i style="width:14px;height:14px;border-radius:7px;background:#FEBC2E;display:block"></i><i style="width:14px;height:14px;border-radius:7px;background:#28C840;display:block"></i>
      <div style="flex:1;display:flex;justify-content:center"><div style="height:36px;min-width:520px;border-radius:18px;background:#fff;display:flex;align-items:center;justify-content:center;gap:8px;font:500 17px Inter;color:#4a4f5c;border:1px solid #E6E8EE">🔒 united.com/en-us/customer-care/chat</div></div>
      <div style="display:flex;align-items:center;gap:8px;background:#EAF1FE;color:#0B5BD8;border-radius:18px;padding:4px 14px 4px 4px;font:600 16px Inter"><div class="bav" style="width:28px;height:28px;border-radius:14px;overflow:hidden"></div>Muse is working</div>
    </div>
    <div style="height:74px;display:flex;align-items:center;gap:34px;padding:0 34px;border-bottom:1px solid #EEF0F4">
      <img src="${A}United_Airlines_Logo.svg" style="height:28px"><span style="font:500 18px Inter;color:#3b4150">Book</span><span style="font:500 18px Inter;color:#3b4150">My trips</span><span style="font:500 18px Inter;color:#3b4150">Travel info</span><span style="font:500 18px Inter;color:#3b4150">MileagePlus®</span>
    </div>
    <div style="position:absolute;left:34px;top:164px;width:380px">
      <div style="font:700 40px Inter;color:#0C2340">Customer care</div>
      <div style="font:400 18px/1.5 Inter;color:#6b7080;margin-top:12px">Changes, cancellations and rebooking — chat with a live agent 24/7.</div>
      <div style="margin-top:26px;height:210px;border-radius:18px;background:linear-gradient(160deg,#1f5fd0,#7fb2f2);overflow:hidden;position:relative"><img src="${A}plane_ua.png" style="position:absolute;left:-40px;top:60px;width:470px;transform:rotate(-4deg)"></div>
      <div style="margin-top:22px;height:14px;width:80%;border-radius:7px;background:#EEF0F4"></div><div style="margin-top:12px;height:14px;width:62%;border-radius:7px;background:#EEF0F4"></div>
    </div>
    <div class="cp" style="position:absolute;left:450px;top:150px;width:580px;height:610px;border-radius:20px;border:1px solid #E3E6EE;overflow:hidden;background:#FAFBFD">
      <div style="height:64px;background:#0C2340;color:#fff;display:flex;align-items:center;gap:12px;padding:0 20px;font:600 20px Inter">${UA_GLOBE(30)}Chat with United<span style="margin-left:auto;font:500 15px Inter;display:flex;align-items:center;gap:6px"><i style="width:9px;height:9px;border-radius:5px;background:#36D07A;display:block"></i>Live agent</span></div>
      <div class="msgs abs" style="left:0;right:0;top:64px;bottom:72px;overflow:hidden"></div>
      <div style="position:absolute;left:14px;right:14px;bottom:12px;height:48px;border-radius:24px;background:#fff;border:1px solid #E3E6EE;display:flex;align-items:center;padding:0 8px 0 18px;font:400 17px Inter;color:#9aa0ad"><span class="typ" style="flex:1;color:#111;white-space:nowrap;overflow:hidden"></span><div style="width:36px;height:36px;border-radius:18px;background:#0C2340;display:flex;align-items:center;justify-content:center;color:#fff;font:700 18px Inter">↑</div></div>
    </div>`, world, { left: '100px', top: '150px', width: '1080px', height: '800px', borderRadius: '22px', overflow: 'hidden' });
  const bav = Avatar(bw.querySelector('.bav'), 28, 'hw');
  const typ = bw.querySelector('.typ');
  const cml = MsgList(bw.querySelector('.msgs'), { left: '16px', right: '16px', bottom: '8px' });
  const agent = (txt) => `<div style="font:500 13px Inter;color:#7b8091;margin:6px 0 3px 4px">Emily · United</div><div style="max-width:420px;background:#EEF1F6;border-radius:18px 18px 18px 6px;padding:10px 14px;font:400 16.5px/1.42 Inter;color:#1b2030">${txt}</div>`;
  const muse = (txt) => `<div style="font:500 13px Inter;color:#7b8091;margin:6px 4px 3px 0;text-align:right;display:flex;justify-content:flex-end;align-items:center;gap:5px">${museSVG(15)} Muse</div><div style="max-width:430px;background:linear-gradient(90deg,#0861D5,#3F5BE6);color:#fff;border-radius:18px 18px 6px 18px;padding:10px 14px;font:400 16.5px/1.42 Inter">${txt}</div>`;
  const M2 = "Hi Emily — I'm Muse, assisting a passenger whose Oct 1 flight from Beijing (PEK) to Los Angeles (LAX) was cancelled. Could you rebook them on the next available flight?";
  cml.add(agent("Hi, you're chatting with Emily from United. How can I help today?"), 31.0);
  cml.add(muse(M2), 32.0, true);
  const dots1 = cml.add(`<div class="m a tdots" style="padding:12px 15px;display:flex;gap:5px;background:#EEF1F6"><i></i><i></i><i></i></div>`, 32.7);
  cml.add(agent("I'm sorry about that. Let me check the options for you…"), 33.55);
  cml.add(agent("I can confirm a seat on <b>Oct 2</b>, same route, departing 1:05 PM."), 35.05);
  cml.add(muse('Perfect — please go ahead. A window seat if possible.'), 35.6, true);
  cml.add(agent('Done ✅ Rebooking confirmed · seat 34A. Confirmation sent.'), 36.15);
  // ---------- phone (Muse) ----------
  const pwrap = el('div', 'abs', null, world, { left: '0', top: '0', width: '1920px', height: '1080px' });
  const PE = Phone(pwrap, { x: 1400, y: 103, sprite: 'hw' });
  PE.status([[30.8, '🎧 正在联系在线客服'], [33.5, '💬 两边同步进行中']]);
  PE.add('⚠️ 刚收到消息：你明天的美联航航班因为<b>飞机机械故障</b>被取消了。', -2, 'a');
  PE.add(flightCard({ head: 'Cancelled', prog: 0 }), -2, 'raw');
  PE.add('我正在联系美联航在线客服。你也同时拨打一下客服电话，<b>两边同步进行</b>，哪边先接通都行 👍', 31.12, 'a');
  PE.add(`<div class="ac"><div style="display:flex;align-items:center;gap:12px;margin-bottom:12px"><div style="width:46px;height:46px;border-radius:23px;background:#E6F7EE;display:flex;align-items:center;justify-content:center">${ICON.phoneI('#11A04D', 22)}</div><div><div style="font:600 16px 'Noto Sans CJK SC'">美联航客服热线</div><div style="font:400 13.5px Inter;color:#7b8091">United Airlines · 24h</div></div></div><div class="btnB callbtn">${ICON.phoneI('#fff', 18)} 拨打电话</div></div>`, 32.05, 'raw');
  const tap = el('div', 'abs', null, PE.el, { left: '174px', top: '688px', width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,.7)', border: '2px solid rgba(0,80,220,.5)', zIndex: 20 });
  // call overlay
  const call = el('div', 'abs', `
    <div class="abs" style="inset:0;background:linear-gradient(180deg,#44557a 0%,#1f2942 55%,#10141f 100%)"></div>
    <div class="abs" style="left:-60px;top:80px;width:360px;height:360px;border-radius:50%;background:radial-gradient(#5a86ff,rgba(90,134,255,0) 70%);opacity:.45"></div>
    <div class="sbar" style="color:#fff">${'<span></span>'}<span style="display:flex;gap:6px;align-items:center">${ICON.signal}${ICON.wifi}${ICON.battery}</span></div>
    <div class="cav abs" style="left:151px;top:120px;width:100px;height:100px;border-radius:50px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 30px rgba(0,0,0,.3)">${UA_GLOBE(52)}</div>
    <svg class="clock abs" width="200" height="200" viewBox="-100 -100 200 200" style="left:101px;top:70px"><circle r="92" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="2"/>${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-84" x2="0" y2="-76" stroke="rgba(255,255,255,.6)" stroke-width="3" transform="rotate(${i * 30})"/>`).join('')}<line class="hm" x1="0" y1="0" x2="0" y2="-78" stroke="#8FC1FF" stroke-width="4" stroke-linecap="round"/><line class="hh" x1="0" y1="0" x2="0" y2="-52" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>
    <div class="gring abs" style="left:141px;top:110px;width:120px;height:120px;border-radius:60px;border:4px solid #36D07A"></div>
    <div class="abs" style="left:0;right:0;top:250px;text-align:center;font:600 31px Inter;color:#fff">United Airlines</div>
    <div class="cst abs" style="left:0;right:0;top:296px;text-align:center;font:500 18px 'Noto Sans CJK SC';color:rgba(255,255,255,.72)">正在呼叫…</div>
    <div class="ctm abs tab" style="left:0;right:0;top:330px;text-align:center;font:700 56px Inter;color:#fff;letter-spacing:-1px">00:00</div>
    <div class="wv abs" style="left:60px;right:60px;top:430px;height:70px;display:flex;align-items:center;justify-content:space-between">${Array.from({ length: 28 }, () => '<i style="display:block;width:6px;border-radius:3px;background:rgba(255,255,255,.75)"></i>').join('')}</div>
    <div class="wchip abs" style="left:0;right:0;top:512px;display:flex;justify-content:center"><span style="background:rgba(255,255,255,.14);color:#fff;border-radius:14px;padding:4px 14px;font:500 15px 'Noto Sans CJK SC'" class="wct">等待音乐</span></div>
    <div class="abs" style="left:40px;right:40px;top:570px;display:grid;grid-template-columns:repeat(3,1fr);row-gap:18px;justify-items:center">
      ${[['🔇', '静音'], ['⌨️', '拨号键盘'], ['🔊', '扬声器'], ['➕', '添加'], ['📹', 'FaceTime'], ['👤', '通讯录']].map(([i, l]) => `<div style="text-align:center"><div class="emoji" style="width:70px;height:70px;border-radius:35px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:26px;filter:grayscale(1) brightness(2.2)">${i}</div><div style="font:400 13px 'Noto Sans CJK SC';color:#fff;margin-top:6px">${l}</div></div>`).join('')}
    </div>
    <div class="abs" style="left:163px;bottom:52px;width:76px;height:76px;border-radius:38px;background:#FF3B30;display:flex;align-items:center;justify-content:center"><div style="transform:rotate(135deg)">${ICON.phoneI('#fff', 32)}</div></div>`, PE.el, { inset: '0', zIndex: 30, borderRadius: '64px', overflow: 'hidden' });
  const cst = call.querySelector('.cst'), ctm = call.querySelector('.ctm'), wvb = [...call.querySelectorAll('.wv i')], wct = call.querySelector('.wct'), clock = call.querySelector('.clock'), hm = call.querySelector('.hm'), hh = call.querySelector('.hh'), gring = call.querySelector('.gring');
  // ---------- sync connector ----------
  const sync = el('div', 'abs', `<svg width="1920" height="1080" style="position:absolute;left:0;top:0;overflow:visible"><defs><linearGradient id="syg" x1="0" x2="1"><stop offset="0" stop-color="#0064E0"/><stop offset="1" stop-color="#18A0FF"/></linearGradient></defs>
    <path class="sp" d="M1180 520 C1270 430, 1310 610, 1400 520" fill="none" stroke="url(#syg)" stroke-width="6" stroke-linecap="round"/>
    <path class="sp2" d="M1180 520 C1270 430, 1310 610, 1400 520" fill="none" stroke="#7fbdff" stroke-opacity=".35" stroke-width="20" stroke-linecap="round"/>
    ${Array.from({ length: 6 }, () => '<circle class="pd" r="7" fill="#fff" stroke="#0064E0" stroke-width="3"/>').join('')}</svg>
    <div class="sb abs" style="left:1252px;top:482px;width:76px;height:76px;border-radius:38px;background:linear-gradient(135deg,#0064E0,#18A0FF);box-shadow:0 10px 30px rgba(0,90,230,.4);display:flex;align-items:center;justify-content:center;color:#fff;font:700 34px Inter">⇄</div>`, world, { left: '0', top: '0' });
  const sp = sync.querySelector('.sp'), sp2 = sync.querySelector('.sp2'), pds = [...sync.querySelectorAll('.pd')], sb = sync.querySelector('.sb');
  let SPL = 0; INITS.push(() => { SPL = sp.getTotalLength(); });
  const tagA = el('div', 'pill', `<span class="pi emoji" style="background:#EEF3FE;width:64px;height:64px;font-size:34px">💬</span>Muse · 在线客服`, world, { left: '560px', top: '40px', font: "600 40px Inter,'Noto Sans CJK SC'", padding: '12px 30px 12px 12px' });
  const tagB = el('div', 'pill', `<span class="pi emoji" style="background:#E6F7EE;width:64px;height:64px;font-size:34px">📞</span>你 · 电话客服`, world, { left: V ? '1250px' : '1370px', top: '8px', font: "600 40px Inter,'Noto Sans CJK SC'", padding: '12px 30px 12px 12px' });
  // ---------- boarding pass 2 ----------
  const pass2 = el('div', 'card', `
    <div style="height:64px;background:#11A04D;border-radius:30px 30px 0 0;display:flex;align-items:center;justify-content:space-between;padding:0 30px;color:#fff;font:700 24px Inter;letter-spacing:3px">CONFIRMED<img src="${A}United_Airlines_Logo.svg" style="height:22px;filter:brightness(0) invert(1)"></div>
    <div style="padding:26px 34px">
      <div style="display:flex;align-items:center;justify-content:space-between"><div style="font:800 76px Inter;letter-spacing:-2px">PEK</div><div style="color:#11A04D">${ICON.plane('#11A04D', 40)}</div><div style="font:800 76px Inter;letter-spacing:-2px">LAX</div></div>
      <div style="display:flex;gap:40px;margin-top:18px;font:500 14px Inter;color:#8a8fa0;letter-spacing:1.5px">
        <div>DATE<div style="font:700 26px Inter;color:#111;letter-spacing:0;margin-top:4px">OCT 2</div></div><div>DEPARTS<div style="font:700 26px Inter;color:#111;letter-spacing:0;margin-top:4px">1:05 PM</div></div><div>SEAT<div style="font:700 26px Inter;color:#111;letter-spacing:0;margin-top:4px">34A</div></div></div>
    </div>
    <svg class="ck abs" width="150" height="150" viewBox="0 0 150 150" style="right:-44px;bottom:-56px"><circle cx="75" cy="75" r="68" fill="#11A04D"/><circle class="ckr" cx="75" cy="75" r="68" fill="none" stroke="#9BE7BC" stroke-width="6"/><path class="ckp" d="M43 78l22 22 44-48" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="120" stroke-dashoffset="120"/></svg>`,
    world, { left: '1880px', top: '330px', width: '560px', height: '300px', borderRadius: '30px' });
  const ckp = pass2.querySelector('.ckp'), ck = pass2.querySelector('.ck');
  const spark = Confetti(world, 77, 80, [2380 - 900, 610], { colors: ['#FFD54A', '#ffffff', '#36D07A', '#8FE3B0'], v: 1100, spread: 6.2, dir: 0 });
  spark.el.style.left = '900px';
  // ---------- phone B (catch-up reveal) ----------
  const PB = Phone(world, { x: 300, y: 103, sprite: 'hc' });
  PB.status([[40, '✅ 改签已完成']]);
  PB.add('我正在联系美联航在线客服。你也同时拨打一下客服电话，<b>两边同步进行</b>，哪边先接通都行 👍', -2, 'a');
  PB.add('✅ 搞定！我已经和美联航<b>真人客服</b>沟通完了。', 42.95, 'a');
  PB.add('帮你改签到了 <b>10月2日</b> 同一航线，出发时间不变，靠窗座位 34A 也保留好了。', 43.8, 'a');

  S.upd = (t) => {
    // camera
    const kin = P(t, 30.8, 31.4, E.outQt);
    const punch = bump(t, 40.84, 40.92, 41.4, E.outC, E.ioC);
    const shk = shake(t, 40.88, 0.35, 8, 26, 4);
    const c = camKeys([[30.8, 1585, 720, 3.2], [31.15, 1580, 712, 2.7, E.outQt], [31.9, 1580, 712, 2.64, E.lin], [32.15, 1585, 700, 2.45, E.ioQt], [32.5, 1590, 698, 2.4, E.lin],
      [33.25, V ? 1000 : 951, 540, V ? 0.6 : 1.0, E.ioQt], [34.55, V ? 1000 : 951, 540, V ? 0.615 : 1.03, E.lin], [35.0, 1601, 428, 2.1, E.ioQt], [37.8, 1601, 432, 2.16, E.lin], [38.2, 1601, 470, 1.92, E.ioQt], [40.55, 1601, 472, 1.95, E.lin],
      [41.0, V ? 2160 : 1965, V ? 485 : 500, V ? 1.22 : 1.45, E.ioQt], [42.05, V ? 2165 : 1975, V ? 485 : 500, V ? 1.25 : 1.48, E.lin], [42.6, 500, 700, 2.45, E.ioQt], [44.95, 500, 690, 2.52, E.lin]], t);
    applyCam(cam, c, { x: shk.x, y: shk.y, s: 1 + 0.04 * punch });
    cam.style.filter = blurF((1 - kin) * 12 + P(t, 44.7, 44.95, E.inQ) * 8);
    PB.el.style.opacity = t > 41.9 ? 1 : 0;
    S.el.style.opacity = P(t, 30.8, 31.05, E.lin) * (1 - P(t, 44.72, 44.95, E.lin));
    // browser
    const bExit = P(t, 36.9, 37.8, E.ioQt);
    set(bw, { x: -700 * bExit, s: 1 - 0.1 * bExit, o: 1 - bExit, f: blurF(bExit * 10) });
    bav.draw(t);
    cml.update(t); animDots(bw, t); show(dots1.w, t < 33.55);
    const typing = P(t, 31.3, 31.9, E.lin); const nt = Math.floor(M2.length * typing);
    const tv = t >= 31.3 && t < 32.0 ? M2.slice(Math.max(0, nt - 44), nt) + '|' : '';
    if (typ._v !== tv) { typ.textContent = tv; typ._v = tv; }
    // phone position: right -> center
    PE.update(t); animDots(PE.el, t);
    // tap ripple
    const kt = P(t, 32.3, 32.6, E.outC);
    set(tap, { s: 1 + kt * 7, o: t > 32.3 ? (1 - kt) : 0 });
    const btn = PE.el.querySelector('.callbtn'); if (btn) set(btn, { s: 1 - 0.06 * bump(t, 32.3, 32.36, 32.5) });
    // call overlay slide
    const kc = P(t, 32.5, 32.85, E.outQt);
    set(call, { y: 900 * (1 - kc), o: t > 32.48 ? 1 : 0 });
    // timer logic
    let secs = 0, status = '正在呼叫…';
    if (t >= 32.85) { status = '保持等待中'; }
    if (t < 34.74) secs = Math.max(0, t - 32.85);
    else if (t < 36.3) secs = lerp(1.9, 1204, P(t, 34.74, 36.3, E.ioC));
    else secs = 1204 + (t - 36.3);
    const connected = t >= 36.48;
    if (connected) status = '已接通';
    const tt = String(Math.floor(secs / 60)).padStart(2, '0') + ':' + String(Math.floor(secs % 60)).padStart(2, '0');
    if (ctm._v !== tt) { ctm.textContent = tt; ctm._v = tt; }
    if (cst._v !== status) { cst.textContent = status; cst._v = status; }
    ctm.style.color = connected ? '#5BE39A' : '#fff';
    cst.style.color = connected ? '#5BE39A' : 'rgba(255,255,255,.72)';
    set(ctm, { s: 1 + 0.12 * bump(t, 36.44, 36.52, 36.9) + (t > 34.74 && t < 36.3 ? 0.04 * Math.sin(t * 40) * 0 : 0) });
    // clock for time-lapse
    const kcl = P(t, 34.6, 34.85, E.outC) * (1 - P(t, 36.3, 36.55, E.inC));
    clock.style.opacity = kcl;
    hm.setAttribute('transform', `rotate(${secs * 6})`); hh.setAttribute('transform', `rotate(${secs * 0.5})`);
    const kg = P(t, 36.48, 37.3, E.outC);
    set(gring, { s: 1 + kg * 0.9, o: connected ? (1 - kg) : 0 });
    // waveform
    const speaking = t >= 37.9 && t < 39.3 ? 1 : t >= 39.4 && t < 40.7 ? 2 : 0;
    const wlabel = speaking === 1 ? '🎙️ 你' : speaking === 2 ? '🎧 United 客服' : connected ? '通话中' : '等待音乐 ♪';
    if (wct._v !== wlabel) { wct.textContent = wlabel; wct._v = wlabel; }
    wvb.forEach((b, i) => {
      let hgt;
      if (!connected) hgt = 8 + 26 * Math.abs(Math.sin(t * 5 + i * 0.5)) * (0.5 + 0.5 * Math.sin(t * 1.3 + i * .2));
      else if (speaking) hgt = 6 + 58 * Math.abs(noise1(t * 9 + i * 0.7, speaking)) * (0.4 + 0.6 * Math.abs(Math.sin(i / 27 * Math.PI)));
      else hgt = 5 + 4 * Math.abs(Math.sin(t * 3 + i));
      b.style.height = hgt.toFixed(1) + 'px';
      b.style.background = speaking === 1 ? '#6FB2FF' : speaking === 2 ? '#5BE39A' : 'rgba(255,255,255,.75)';
    });
    // sync
    const ks = P(t, 33.4, 33.9, E.outQt), ksOut = P(t, 34.7, 35.1, E.inC);
    sp.style.strokeDasharray = `${SPL * ks} ${SPL}`; sp2.style.strokeDasharray = `${SPL * ks} ${SPL}`;
    sync.style.opacity = 1 - ksOut;
    pds.forEach((c, i) => { const dir = i % 2; let u = ((t * 0.9 + i / 6) % 1); if (dir) u = 1 - u; const pt = sp.getPointAtLength(u * SPL); c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); c.style.opacity = ks > 0.9 ? 1 : 0; });
    set(sb, { s: (V ? 1.6 : 1) * SP(t - 33.48, 1.4, 6) * (1 + 0.08 * beatPulse(t, 8)), r: (t - 33.48) * 120, o: t > 33.45 ? 1 : 0 });
    const kA = SP(t - 33.48, 1.3, 6), kB = SP(t - 33.66, 1.3, 6);
    set(tagA, { s: kA * (V ? 1.7 : 1), o: (t > 33.45 ? 1 : 0) * (1 - ksOut) }); set(tagB, { s: kB * (V ? 1.7 : 1), o: (t > 33.63 ? 1 : 0) * (1 - ksOut) });
    // boarding pass 2
    const kp = SP(t - 40.6, 1.05, 5.2);
    set(pass2, { x: -420 * (1 - kp), y: 80 * (1 - kp), s: 0.5 + 0.5 * kp, ry: -25 * (1 - kp) - 6, r: 3 * (1 - kp), o: t > 40.58 ? Math.min(1, kp * 2) : 0 });
    pass2.style.zIndex = kp > 0.5 ? 5 : 0;
    const kk = P(t, 40.88, 41.15, E.outC);
    ckp.style.strokeDashoffset = 120 * (1 - kk);
    set(ck, { s: SP(t - 40.8, 1.4, 6), o: t > 40.78 ? 1 : 0 });
    spark.draw(t - 40.9);
    PB.update(t); animDots(PB.el, t);
  };
  FLASHES.push([36.5, .18, .3, '#9BFFC4'], [40.9, .3, .3, '#ffffff']);
  MB.push([42.05, 42.65, 6], [40.55, 41.0, 3], [32.5, 33.25, 2], [34.55, 35.0, 2]);
}

// ===================== F4: calendar tiles "Updated flight" + confetti (44.6 - 47.45) =====================
{
  const S = Scene('F4', 44.75, 47.45, 19, '#E7EFF3');
  S.el.innerHTML = `<div class="cam"></div>`;
  const cam = S.el.querySelector('.cam');
  const T = 380, G = 36;
  const tiles = [];
  const mk = (x, y, html, blue) => { const d = el('div', 'abs', html, cam, { left: x + 'px', top: y + 'px', width: T + 'px', height: T + 'px', borderRadius: '70px', background: blue ? '#3E86F2' : '#fff', boxShadow: blue ? '0 30px 70px rgba(40,110,240,.35)' : '0 10px 30px rgba(30,60,110,.06)' }); tiles.push(d); return d; };
  const X1 = 960 - T - G / 2 - T / 2 - 0, Y = 540 - T / 2;
  // row: 30 | 1 | 2 | 3
  mk(X1 - T - G, Y, `<div style="position:absolute;left:44px;top:30px;font:500 150px Inter;color:#c9cdd6">30</div>`);
  const t1 = mk(X1, Y, `<div style="position:absolute;left:52px;top:30px;font:500 150px Inter;color:#9aa0ad">1</div><div style="position:absolute;left:44px;right:44px;bottom:40px;height:64px;border-radius:32px;background:#FDE6EA;color:#E3173E;font:600 28px Inter;display:flex;align-items:center;justify-content:center">Cancelled</div><svg style="position:absolute;left:0;top:0" width="${T}" height="${T}"><line class="xl" x1="60" y1="${T - 60}" x2="${T - 60}" y2="60" stroke="#E3173E" stroke-width="10" stroke-linecap="round" stroke-dasharray="400" stroke-dashoffset="400" opacity=".75"/></svg>`);
  const t2 = mk(X1 + T + G, Y, `<div class="tav" style="position:absolute;left:${T / 2 - 72}px;top:40px;width:144px;height:144px;border-radius:72px;overflow:hidden;border:5px solid rgba(255,255,255,.6)"></div><div style="position:absolute;left:30px;right:30px;bottom:34px;border-radius:34px;background:#6EA6F3;color:#fff;font:500 33px/1.25 Inter;padding:18px 26px">Updated flight<br>PEK to LAX</div><div style="position:absolute;right:34px;top:26px;font:600 64px Inter;color:rgba(255,255,255,.95)">2</div>`, true);
  mk(X1 + 2 * (T + G), Y, `<div style="position:absolute;left:52px;top:30px;font:500 150px Inter;color:#c9cdd6">3</div>`);
  for (const [dx, dy] of [[-1, -1], [0, -1], [1, -1], [2, -1], [-1, 1], [0, 1], [1, 1], [2, 1]]) mk(X1 + dx * (T + G), Y + dy * (T + G), '');
  const tav = Avatar(t2.querySelector('.tav'), 144, 'hc', [50, 0, 220, 220]);
  const xl = t1.querySelector('.xl');
  const conf = Confetti(S.el, 12, 220, [X1 + T + G + T / 2, Y + 60], { v: 1900, spread: 2.6 });
  const fig = el('img', 'abs', null, S.el, { width: V ? '230px' : '300px', left: V ? '1240px' : '1500px', top: V ? '780px' : '700px' }); fig.src = A + 'obj/big_00.png';
  S.upd = (t) => {
    const kin = P(t, 44.75, 45.2, E.outQt);
    const pan = P(t, 45.1, 45.8, E.ioQt);
    const cx = lerp(X1 + T / 2, X1 + T + G + T / 2, pan);
    const s = lerp(1.9, 1.0, kin) * (1 + 0.03 * P(t, 45.7, 47.4, E.lin));
    cam.style.transformOrigin = '960px 540px';
    cam.style.transform = `translate(${-(cx - 960) * s}px,0px) scale(${s})`;
    S.el.style.opacity = P(t, 44.75, 44.98, E.lin);
    xl.style.strokeDashoffset = 400 * (1 - P(t, 45.05, 45.3, E.outC));
    set(t2, { s: 1 + 0.06 * bump(t, 45.82, 45.9, 46.3) });
    tav.draw(t - 45.2);
    conf.draw(t - 45.86);
    const kf = SP(t - 46.0, 1.2, 4.5);
    set(fig, { y: 420 * (1 - kf) - Math.abs(Math.sin((t - 46.0) * 5.5)) * 40 * P(t, 46.2, 46.5, E.lin), r: Math.sin(t * 6) * 5, o: t > 45.98 ? 1 : 0 });
  };
  FLASHES.push([47.15, .95, .45, '#ffffff']);
}
