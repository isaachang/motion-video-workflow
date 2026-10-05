// ===================== 9:16 frame: decorative top / bottom bands =====================
(function () {
  const F = document.getElementById('vframe');
  const DUR = 66.6;
  // full-frame background canvas (tunnel lines, aurora) behind the window
  const bg = el('canvas', null, null, F, { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px', zIndex: 0 });
  bg.width = 1080; bg.height = 1920;
  const g = bg.getContext('2d');
  const r = rng(808);
  const dots = []; for (let i = 0; i < 140; i++) dots.push([r() * 1080, r() < 0.5 ? r() * 410 : 1510 + r() * 410, r() * 1.6 + 0.4, r() * 6.28]);

  // top band content
  const top = el('div', 'abs', `
    <div class="tl1" style="font:900 74px 'Noto Sans CJK SC';color:#fff;letter-spacing:3px;text-align:center;transform:skewX(-8deg);text-shadow:0 0 28px rgba(60,150,255,.55),0 4px 0 rgba(0,0,0,.35)">航班突然被取消</div>
    <div class="tl2" style="font:900 74px 'Noto Sans CJK SC';color:#fff;letter-spacing:3px;text-align:center;transform:skewX(-8deg);margin-top:6px;text-shadow:0 0 28px rgba(60,150,255,.55),0 4px 0 rgba(0,0,0,.35)"><span style="font-family:Inter;font-weight:800;background:linear-gradient(90deg,#3FB2FF,#1C6BFF);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none;filter:drop-shadow(0 0 18px rgba(40,140,255,.7))">Muse</span> <span style="color:#FFD54A">10分钟</span>搞定改签</div>`,
    F, { left: '0', top: '170px', width: '1080px', zIndex: 3, lineHeight: '1.22' });
  const tl1 = top.querySelector('.tl1'), tl2 = top.querySelector('.tl2');

  // bottom band content
  const bot = el('div', 'abs', `
    <div style="display:flex;align-items:center;justify-content:center;gap:18px">
      <div style="width:84px;height:84px;border-radius:22px;background:linear-gradient(#fff,#EDEDEF);display:flex;align-items:center;justify-content:center;box-shadow:0 0 30px rgba(40,140,255,.55)">${museSVG(66)}</div>
      <div style="font:800 68px Inter;color:#fff;letter-spacing:-2px">Muse</div>
      <div style="width:2px;height:52px;background:rgba(255,255,255,.28);margin:0 8px"></div>
      <div style="display:flex;align-items:center;gap:6px"><span style="font:500 34px Inter;color:rgba(255,255,255,.7)">from</span><img src="${A}meta-wordmark.svg" style="height:88px;margin:-6px -26px 0 -26px;filter:invert(1);opacity:.85"></div>
    </div>
    <div style="margin-top:20px;text-align:center;font:500 30px 'Noto Sans CJK SC';letter-spacing:6px;color:rgba(200,222,255,.72)">Meta 推出的个人 AI 智能体</div>`,
    F, { left: '0', top: '1566px', width: '1080px', zIndex: 3 });

  // window frame glow + progress bar
  const frame = el('div', 'abs', `
    <div style="position:absolute;left:0;right:0;top:418px;height:3px;background:linear-gradient(90deg,rgba(24,160,255,0),#3FB2FF 20%,#7FD0FF 50%,#3FB2FF 80%,rgba(24,160,255,0));box-shadow:0 0 18px 2px rgba(40,150,255,.8)"></div>
    <div style="position:absolute;left:0;right:0;top:1499px;height:3px;background:linear-gradient(90deg,rgba(24,160,255,0),#3FB2FF 20%,#7FD0FF 50%,#3FB2FF 80%,rgba(24,160,255,0));box-shadow:0 0 18px 2px rgba(40,150,255,.8)"></div>
    ${[[18, 438, 'left', 'top'], [1062, 438, 'right', 'top'], [18, 1482, 'left', 'bottom'], [1062, 1482, 'right', 'bottom']].map(([x, y, h, v]) => `<i style="position:absolute;${h}:${h === 'left' ? 18 : 18}px;${v}:${v === 'top' ? 438 : 1920 - 1482}px;width:46px;height:46px;border-${h}:4px solid rgba(255,255,255,.9);border-${v}:4px solid rgba(255,255,255,.9);filter:drop-shadow(0 0 6px rgba(80,170,255,.9))"></i>`).join('')}
    <div style="position:absolute;left:60px;right:60px;top:1530px;height:6px;border-radius:3px;background:rgba(255,255,255,.12)"><div class="pf" style="position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:linear-gradient(90deg,#1C6BFF,#3FB2FF);box-shadow:0 0 12px rgba(60,160,255,.9)"></div><div class="ph" style="position:absolute;top:-6px;width:18px;height:18px;margin-left:-9px;border-radius:9px;background:#fff;box-shadow:0 0 14px 3px rgba(80,170,255,.95)"></div></div>`,
    F, { left: '0', top: '0', width: '1080px', height: '1920px', zIndex: 4, pointerEvents: 'none' });
  const pf = frame.querySelector('.pf'), ph = frame.querySelector('.ph');

  function drawBg(t) {
    // base
    const lg = g.createLinearGradient(0, 0, 0, 1920);
    lg.addColorStop(0, '#040716'); lg.addColorStop(0.22, '#0A1640'); lg.addColorStop(0.5, '#08102C'); lg.addColorStop(0.78, '#0A1640'); lg.addColorStop(1, '#040716');
    g.fillStyle = lg; g.fillRect(0, 0, 1080, 1920);
    // aurora blobs
    g.globalCompositeOperation = 'lighter';
    const blobs = [[200, 250, 380, '30,90,255', .33, 0.31], [880, 160, 340, '120,80,255', .22, 0.23], [540, 420, 520, '24,150,255', .22, 0.17], [260, 1700, 400, '24,150,255', .26, 0.27], [860, 1560, 420, '30,90,255', .3, 0.21], [540, 1500, 520, '120,80,255', .14, 0.19]];
    for (const [x, y, rr, c, a, sp] of blobs) {
      const xx = x + Math.sin(t * sp + x) * 90, yy = y + Math.cos(t * sp * 1.3 + y) * 40;
      const gr = g.createRadialGradient(xx, yy, 0, xx, yy, rr); gr.addColorStop(0, `rgba(${c},${a})`); gr.addColorStop(1, `rgba(${c},0)`);
      g.fillStyle = gr; g.fillRect(xx - rr, yy - rr, rr * 2, rr * 2);
    }
    g.globalCompositeOperation = 'source-over';
    // tunnel frames receding toward the window (vanishing at window center)
    const N = 7;
    for (let i = 0; i < N; i++) {
      const ph0 = ((t * 0.22 + i / N) % 1);
      const k = Math.pow(ph0, 1.6);
      const w = lerp(1100, 2300, k), h = lerp(1110, 2900, k);
      const a = (1 - ph0) * 0.55 * Math.min(1, ph0 * 6);
      g.strokeStyle = `rgba(70,160,255,${a})`; g.lineWidth = 2;
      g.beginPath(); g.roundRect(540 - w / 2, 960 - h / 2, w, h, 40 + 60 * k); g.stroke();
    }
    // perspective rails from window corners to screen corners
    g.strokeStyle = 'rgba(80,170,255,.35)'; g.lineWidth = 2;
    for (const [x0, y0, x1, y1] of [[0, 420, -260, 0], [1080, 420, 1340, 0], [0, 1500, -260, 1920], [1080, 1500, 1340, 1920]]) { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
    // light pulses along horizontal scan lines
    for (let i = 0; i < 4; i++) {
      const y = i < 2 ? 70 + i * 300 : 1560 + (i - 2) * 300;
      const px = ((t * 260 + i * 400) % 1600) - 260;
      const gr = g.createLinearGradient(px - 220, 0, px + 220, 0); gr.addColorStop(0, 'rgba(90,180,255,0)'); gr.addColorStop(.5, 'rgba(150,210,255,.55)'); gr.addColorStop(1, 'rgba(90,180,255,0)');
      g.fillStyle = gr; g.fillRect(px - 220, y, 440, 2);
    }
    // dust
    for (const [x, y, s, p] of dots) { g.globalAlpha = 0.25 + 0.5 * Math.abs(Math.sin(t * 1.5 + p)); g.fillStyle = '#bfe0ff'; g.fillRect(x, y + Math.sin(t * .5 + p) * 6, s, s); }
    g.globalAlpha = 1;
  }
  OVERLAYS.push(t => {
    drawBg(t);
    const k1 = P(t, 0.0, 0.6, E.outQt), k2 = P(t, 0.15, 0.75, E.outQt);
    const pulse = 0.4 * beatPulse(t, 6);
    tl1.style.opacity = k1; tl1.style.transform = `translateY(${30 * (1 - k1)}px) skewX(-8deg) scale(${1 + 0.012 * pulse})`; tl1.style.filter = blurF((1 - k1) * 10);
    tl2.style.opacity = k2; tl2.style.transform = `translateY(${30 * (1 - k2)}px) skewX(-8deg) scale(${1 + 0.012 * pulse})`; tl2.style.filter = blurF((1 - k2) * 10);
    const pr = clamp(t / 65.6);
    pf.style.width = (pr * 960) + 'px'; ph.style.left = (pr * 960) + 'px';
  });
})();
