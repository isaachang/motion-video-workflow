// =====================================================================
// motion-kit · packs/explainer.js —— 知识讲解 / 通用信息可视化组件
// 约定：每个组件 = 工厂函数(parent, ...) → { el, upd(t) }，时间点在构造时给定，
// 场景里 sc.upd = t => { a.upd(t); b.upd(t); } 即可。坐标都是 1920×1080 舞台坐标。
// 竖版安全区：关键内容放在 x∈[420,1500]（SAFE），否则在 VMODE 分支里改坐标或摇镜。
// =====================================================================

// ---------- 通用线性图标（stroke = currentColor） ----------
const IC = (() => {
  const s = (d, w = 24) => (size = 48, c = 'currentColor', sw = 2) => `<svg width="${size}" height="${size}" viewBox="0 0 ${w} ${w}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  return {
    check: s('<path d="M5 12.5l4.5 4.5L19 7.5"/>'), cross: s('<path d="M6 6l12 12M18 6L6 18"/>'),
    arrow: s('<path d="M4 12h15M13 6l6 6-6 6"/>'), plus: s('<path d="M12 5v14M5 12h14"/>'),
    spark: s('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/>'),
    bolt: s('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'), doc: s('<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>'),
    chat: s('<path d="M4 5h16v11H9l-5 4z"/>'), search: s('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>'),
    user: s('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
    bot: s('<rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 3v4M9 12v1M15 12v1M9 16h6"/>'),
    code: s('<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>'), chart: s('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
    globe: s('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>'),
    lock: s('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>'),
    clock: s('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'), warn: s('<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>'),
    db: s('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'),
    brain: s('<path d="M9 4a3 3 0 00-3 3 3 3 0 00-2 5 3 3 0 002 5 3 3 0 006 0V4a3 3 0 00-3 0zM15 4a3 3 0 013 3 3 3 0 012 5 3 3 0 01-2 5 3 3 0 01-6 0"/>'),
    gear: s('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'),
    play: s('<path d="M7 4l13 8-13 8z"/>'), cursor: s('<path d="M5 3l14 7-6 2-2 6z"/>'),
  };
})();
// 图标内容：IC 名 / emoji / 图片路径（.png/.svg/.webp）/ 任意 html
function iconHTML(ic, size, color) {
  if (!ic) return '';
  if (IC[ic]) return IC[ic](size, color || 'currentColor', 2);
  if (/\.(png|svg|webp|jpg)$/.test(ic)) return `<img src="${A}${ic}" style="width:${size}px;height:${size}px;object-fit:contain">`;
  if (ic.startsWith('<')) return ic;
  return `<span class="emoji" style="font-size:${size * .9}px;line-height:1">${ic}</span>`;
}

// ---------- 动态文字：KineticText ----------
// text 里用 [[关键词]] 标记重点：主题强调色 + 荧光笔下划线扫过
// opt: x,y(中心) size weight color font align('center'|'left') t0 t1 mode('rise'|'pop'|'blur'|'type'|'slam') stagger
function KineticText(parent, text, opt = {}) {
  const size = opt.size || 96, mode = opt.mode || 'rise', st = opt.stagger ?? (mode === 'type' ? .045 : .035);
  const wrap = el('div', 'kt', null, parent, { font: `${opt.weight || 800} ${size}px ${opt.font || "Inter,'Noto Sans CJK SC'"}`, color: opt.color || 'var(--ink)', letterSpacing: (opt.ls ?? (size > 80 ? -1 : 0)) + 'px' });
  const chars = [], marks = [];
  let inHi = false, hiSpan = null;
  for (const part of text.split(/(\[\[|\]\])/)) {
    if (part === '[[') { inHi = true; hiSpan = el('span', 'hi', null, wrap); continue; }
    if (part === ']]') { inHi = false; const m = el('i', 'mk', null, hiSpan); marks.push(m); hiSpan = null; continue; }
    for (const c of part) {
      if (c === '\n') { el('br', null, null, inHi ? hiSpan : wrap); continue; }
      const sp = el('span', 'ch', c === ' ' ? '&nbsp;' : c, inHi ? hiSpan : wrap);
      chars.push(sp);
    }
  }
  if (opt.align === 'left') { wrap.style.left = opt.x + 'px'; wrap.style.top = opt.y + 'px'; wrap.style.translate = '0 -50%'; }
  else { wrap.style.textAlign = 'center'; place(wrap, opt.x ?? 960, opt.y ?? 540); }
  const t0 = opt.t0 ?? 0, t1 = opt.t1 ?? 1e9, n = chars.length, inDur = mode === 'type' ? .01 : .5;
  const tEnd = t0 + n * st + inDur;
  return {
    el: wrap, chars, tEnd,
    upd(t) {
      const out = P(t, t1 - .35, t1, E.inC);
      chars.forEach((c, i) => {
        const ti = t0 + i * st, k = P(t, ti, ti + inDur, E.outQt), sp = SP(t - ti, 1.3, 7);
        if (mode === 'rise') set(c, { y: (1 - k) * size * .6, o: k, b: (1 - k) * 8 });
        else if (mode === 'pop') set(c, { s: clamp(sp, 0, 1.3), o: k });
        else if (mode === 'blur') set(c, { s: 1.25 - .25 * k, o: k, b: (1 - k) * 18 });
        else if (mode === 'type') c.style.opacity = t >= ti ? 1 : 0;
        else if (mode === 'slam') set(c, { s: 1 + 1.6 * (1 - E.outQt(clamp((t - ti) / .28))), o: P(t, ti, ti + .08, E.lin) });
      });
      marks.forEach((m, i) => { const a = tEnd + .05 + i * .15; m.style.transform = `scaleX(${P(t, a, a + .35, E.outQt).toFixed(3)})`; });
      if (t1 < 1e8) set(wrap, { o: 1 - out, y: -40 * out, b: 10 * out });
    }
  };
}

// ---------- 关键词大字卡：KeyWord ----------
// style: 'marker'(荧光笔) | 'box'(描边框画出) | 'glow'(发光) | 'chip'(彩色胶囊)
function KeyWord(parent, text, opt = {}) {
  const size = opt.size || 140, style = opt.style || 'chip';
  const w = el('div', 'abs', null, parent, { whiteSpace: 'nowrap' });
  const inner = el('div', null, text, w, { font: `900 ${size}px Inter,'Noto Sans CJK SC'`, letterSpacing: '-2px', position: 'relative', padding: style === 'chip' ? `${size * .12}px ${size * .32}px` : `0 ${size * .08}px`, borderRadius: size * .3 + 'px', color: style === 'chip' ? '#fff' : (opt.color || 'var(--ink)'), background: style === 'chip' ? `linear-gradient(90deg,var(--accent),var(--accent2))` : 'none', boxShadow: style === 'chip' ? '0 20px 60px -10px color-mix(in srgb,var(--accent) 55%,transparent)' : 'none', textShadow: style === 'glow' ? '0 0 40px var(--accent2),0 0 90px var(--accent)' : 'none' });
  let deco = null;
  if (style === 'marker') deco = el('i', null, null, inner, { position: 'absolute', left: '0', right: '0', bottom: '.06em', height: '.38em', background: 'var(--hi)', zIndex: -1, transformOrigin: '0 50%' });
  if (style === 'box') deco = el('i', null, null, inner, { position: 'absolute', inset: `-${size * .14}px -${size * .22}px`, border: `${Math.max(4, size * .04)}px solid var(--accent)`, borderRadius: size * .2 + 'px', clipPath: 'inset(0 100% 0 0)' });
  place(w, opt.x ?? 960, opt.y ?? 540);
  const t0 = opt.t0 ?? 0, t1 = opt.t1 ?? 1e9;
  return {
    el: w, upd(t) {
      const s = SP(t - t0, 1.2, 6.5), out = P(t, t1 - .3, t1, E.inC);
      set(w, { s: (t < t0 ? 0 : clamp(s, 0, 1.4)) * (1 + .15 * out) * kickScale(t, .02), o: P(t, t0, t0 + .12, E.lin) * (1 - out), b: 12 * out });
      if (style === 'marker') deco.style.transform = `scaleX(${P(t, t0 + .3, t0 + .7, E.outQt)})`;
      if (style === 'box') deco.style.clipPath = `inset(0 ${(100 - 100 * P(t, t0 + .25, t0 + .75, E.ioC)).toFixed(1)}% 0 0)`;
    }
  };
}

// ---------- 流程链：FlowChain ----------
// nodes: [{ic, label, sub}]；opt: x,y(整链中心) gap size dir('x'|'y') times[每个节点出现时刻] t1 color
// 节点逐个弹出，连线逐段画出并有光点流过；VMODE 下默认改成竖排
function FlowChain(parent, nodes, opt = {}) {
  const dir = opt.dir || (VMODE && nodes.length > 2 ? 'y' : 'x');
  const size = opt.size || (dir === 'x' ? 170 : 150), gap = opt.gap || (dir === 'x' ? 420 : 215), n = nodes.length;
  const cx = opt.x ?? 960, cy = opt.y ?? 540, times = opt.times || nodes.map((_, i) => (opt.t0 || 0) + i * .6);
  const pos = nodes.map((_, i) => dir === 'x' ? [cx + (i - (n - 1) / 2) * gap, cy] : [cx, cy + (i - (n - 1) / 2) * gap]);
  const svg = el('div', 'abs', `<svg width="1920" height="1080" style="position:absolute;inset:0;overflow:visible"></svg>`, parent, { inset: '0' });
  const sv = svg.firstChild; const lines = [], dots = [];
  for (let i = 0; i < n - 1; i++) {
    const [x1, y1] = pos[i], [x2, y2] = pos[i + 1], off = size / 2 + 26;
    const a = dir === 'x' ? [x1 + off, y1, x2 - off, y2] : [x1, y1 + off * .78, x2, y2 - off * .78];
    sv.insertAdjacentHTML('beforeend', `<line x1="${a[0]}" y1="${a[1]}" x2="${a[2]}" y2="${a[3]}" stroke="var(--line)" stroke-width="8" stroke-linecap="round"/><line class="ln" x1="${a[0]}" y1="${a[1]}" x2="${a[2]}" y2="${a[3]}" stroke="var(--accent)" stroke-width="8" stroke-linecap="round"/><circle class="dt" r="11" fill="var(--accent2)" style="filter:drop-shadow(0 0 10px var(--accent2))"/>`);
    lines.push({ el: sv.querySelectorAll('.ln')[i], a, L: Math.hypot(a[2] - a[0], a[3] - a[1]) }); dots.push(sv.querySelectorAll('.dt')[i]);
  }
  const els = nodes.map((nd, i) => {
    const e = el('div', 'fn', `<div class="bx" style="width:${size}px;height:${size}px;color:var(--accent)">${iconHTML(nd.ic, size * .5)}</div>${nd.label ? `<div class="lb">${nd.label}</div>` : ''}${nd.sub ? `<div class="sb">${nd.sub}</div>` : ''}`, parent);
    if (dir === 'y') { e.style.flexDirection = 'row'; e.style.gap = '34px'; e.querySelector('.bx').style.flex = 'none'; e.style.left = (pos[i][0] - size / 2 - 140) + 'px'; e.style.top = (pos[i][1] - size / 2) + 'px'; e.style.transformOrigin = `${size / 2}px ${size / 2}px`; }
    else { e.style.left = pos[i][0] + 'px'; e.style.top = (pos[i][1] - size / 2) + 'px'; e.style.translate = '-50% 0'; e.style.transformOrigin = `50% ${size / 2}px`; }
    return e;
  });
  const t1 = opt.t1 ?? 1e9;
  return {
    el: svg, els, pos, upd(t) {
      const out = P(t, t1 - .35, t1, E.inC);
      els.forEach((e, i) => {
        const s = SP(t - times[i], 1.3, 7);
        set(e, { s: t < times[i] ? 0 : clamp(s, 0, 1.3) * (1 - .3 * out), o: P(t, times[i], times[i] + .1, E.lin) * (1 - out) });
        const bx = e.firstChild, lit = t >= times[i] + .15;
        bx.style.background = lit && i === n - 1 && opt.finalGlow !== false ? 'linear-gradient(135deg,var(--accent),var(--accent2))' : 'var(--card)';
        bx.style.color = lit && i === n - 1 && opt.finalGlow !== false ? '#fff' : 'var(--accent)';
      });
      lines.forEach((l, i) => {
        const a = times[i] + .12, b = Math.max(a + .2, times[i + 1] - .05), k = P(t, a, b, E.ioC);
        l.el.style.strokeDasharray = `${l.L * k} ${l.L}`; l.el.style.opacity = 1 - out;
        const ph = ((t - b) * .9) % 1, show_ = t > b;
        dots[i].setAttribute('cx', lerp(l.a[0], l.a[2], show_ ? ph : k)); dots[i].setAttribute('cy', lerp(l.a[1], l.a[3], show_ ? ph : k));
        dots[i].style.opacity = (t > a ? 1 : 0) * (1 - out);
      });
    }
  };
}

// ---------- 对比：Compare ----------
// left/right: {title, ic, items:[str], tone:'bad'|'good'|'neutral'}；opt: t0 stagger tWin(赢家高亮时刻) t1 x y gap
function Compare(parent, left, right, opt = {}) {
  const gap = opt.gap ?? 80, cx = opt.x ?? 960, cy = opt.y ?? 540, t0 = opt.t0 ?? 0, stg = opt.stagger ?? .35, t1 = opt.t1 ?? 1e9;
  const mk = (d, side) => {
    const good = d.tone === 'good', bad = d.tone === 'bad';
    const c = el('div', 'cmp', `<h3>${d.ic ? `<span style="color:${good ? 'var(--accent)' : 'var(--sub)'}">${iconHTML(d.ic, 60)}</span>` : ''}${d.title}</h3>` + d.items.map(s => `<div class="it"><span class="ic" style="background:${good ? 'var(--good)' : bad ? 'var(--line)' : 'var(--bg2)'};color:${good ? '#fff' : 'var(--sub)'}">${(good ? IC.check : bad ? IC.cross : IC.arrow)(30, 'currentColor', 3)}</span><span>${s}</span></div>`).join(''), parent);
    c.style.left = (side < 0 ? cx - gap / 2 - 720 : cx + gap / 2) + 'px'; c.style.top = cy + 'px'; c.style.translate = '0 -50%';
    return { c, its: [...c.querySelectorAll('.it')], d };
  };
  const L = mk(left, -1), R = mk(right, 1);
  return {
    el: [L.c, R.c], L, R, upd(t) {
      const out = P(t, t1 - .35, t1, E.inC);
      [L, R].forEach((S, j) => {
        const ts = t0 + j * .25, k = P(t, ts, ts + .55, E.outQt);
        const win = opt.tWin != null ? P(t, opt.tWin, opt.tWin + .4, E.outC) : 0, isW = S.d.tone === 'good';
        set(S.c, { x: (j ? 1 : -1) * 120 * (1 - k), o: k * (1 - out) * (isW ? 1 : 1 - .45 * win), s: (isW ? 1 + .06 * win : 1 - .05 * win) });
        S.c.style.boxShadow = isW && win > 0 ? `0 0 0 ${6 * win}px var(--accent), 0 30px 90px -10px color-mix(in srgb,var(--accent) ${60 * win}%,transparent)` : '';
        S.c.style.filter = !isW && win > 0 ? `grayscale(${win})` : 'none';
        S.its.forEach((it, i) => { const a = ts + .35 + i * stg; const kk = P(t, a, a + .4, E.outQt); set(it, { x: 40 * (1 - kk), o: kk }); });
      });
    }
  };
}

// ---------- 时间线：Timeline ----------
// items: [{date, label}]；opt: y x0 x1 times t1
function Timeline(parent, items, opt = {}) {
  const y = opt.y ?? 560, x0 = opt.x0 ?? (SAFE.x0 + 140), x1 = opt.x1 ?? (SAFE.x1 - 140), n = items.length, times = opt.times || items.map((_, i) => (opt.t0 || 0) + .4 + i * .6);
  const base = el('div', 'abs', null, parent, { left: x0 + 'px', top: (y - 4) + 'px', height: '8px', width: (x1 - x0) + 'px', borderRadius: '4px', background: 'var(--line)' });
  const fill = el('div', 'abs', null, base, { left: '0', top: '0', bottom: '0', borderRadius: '4px', background: 'linear-gradient(90deg,var(--accent),var(--accent2))' });
  const nodes = items.map((it, i) => {
    const x = n === 1 ? (x0 + x1) / 2 : lerp(x0, x1, i / (n - 1)), up = i % 2 === 0;
    const e = el('div', 'abs', `<div style="width:34px;height:34px;border-radius:50%;background:var(--card);border:8px solid var(--accent);margin:0 auto"></div>
      <div style="position:absolute;left:50%;translate:-50% 0;${up ? 'bottom:58px' : 'top:58px'};text-align:center;white-space:nowrap"><div style="font:800 46px Inter;color:var(--accent)">${it.date}</div><div style="font:600 34px Inter,'Noto Sans CJK SC';color:var(--ink);margin-top:6px">${it.label}</div></div>`, parent, { left: (x - 17) + 'px', top: (y - 17) + 'px', width: '34px', height: '34px' });
    return { e, x };
  });
  const t1 = opt.t1 ?? 1e9;
  return {
    el: base, upd(t) {
      const out = P(t, t1 - .35, t1, E.inC);
      const last = times[n - 1] + .3, k = P(t, times[0] - .4, last, E.ioS);
      fill.style.width = (k * 100) + '%'; base.style.opacity = 1 - out;
      nodes.forEach((nd, i) => { const s = SP(t - times[i], 1.3, 7); set(nd.e, { s: t < times[i] ? 0 : clamp(s, 0, 1.3), o: 1 - out }); });
    }
  };
}

// ---------- 数字滚动 ----------
function countText(t, t0, t1, from, to, dec = 0, sep = true) {
  const v = lerp(from, to, P(t, t0, t1, E.outQt));
  let s = v.toFixed(dec); if (sep) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return s;
}
// 大数字：BigStat {value, prefix, suffix, label, dec, x,y,size,t0,dur,t1}
function BigStat(parent, o = {}) {
  const size = o.size || 220;
  const w = el('div', 'abs', `<div style="font:900 ${size}px Inter;letter-spacing:-6px;line-height:1;background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;color:transparent" class="tab"><span>${o.prefix || ''}</span><span class="v"></span><span style="font-size:.5em;letter-spacing:0">${o.suffix || ''}</span></div>${o.label ? `<div style="font:700 ${size * .2}px Inter,'Noto Sans CJK SC';color:var(--sub);margin-top:${size * .08}px">${o.label}</div>` : ''}`, parent, { textAlign: 'center', whiteSpace: 'nowrap' });
  place(w, o.x ?? 960, o.y ?? 540);
  const v = w.querySelector('.v'), t0 = o.t0 ?? 0, dur = o.dur ?? 1.2, t1 = o.t1 ?? 1e9;
  return { el: w, upd(t) { v.textContent = countText(t, t0, t0 + dur, o.from || 0, o.value, o.dec || 0); const out = P(t, t1 - .3, t1, E.inC); set(w, { s: clamp(SP(t - t0, 1.2, 6), 0, 1.3) * kickScale(t, .015), o: P(t, t0, t0 + .1, E.lin) * (1 - out) }); } };
}

// ---------- 柱状图：BarChart ----------
// data: [{label, value, color?, hi?}]；opt: x y(底部基线中心) w h max unit t0 stagger t1
function BarChart(parent, data, opt = {}) {
  const n = data.length, w = opt.w ?? (VMODE ? 980 : 1300), h = opt.h ?? 560, cx = opt.x ?? 960, by = opt.y ?? 820, max = opt.max ?? Math.max(...data.map(d => d.value)) * 1.08;
  const bw = Math.min(180, w / n * .58), t0 = opt.t0 ?? 0, stg = opt.stagger ?? .15, t1 = opt.t1 ?? 1e9;
  const grp = el('div', 'abs', null, parent, { inset: '0' });
  el('div', 'abs', null, grp, { left: (cx - w / 2) + 'px', top: by + 'px', width: w + 'px', height: '4px', background: 'var(--line)' });
  const bars = data.map((d, i) => {
    const x = cx - w / 2 + (i + .5) * w / n;
    const b = el('div', 'abs', `<div class="vl tab" style="position:absolute;left:50%;translate:-50% 0;bottom:100%;margin-bottom:14px;font:800 ${d.hi ? 54 : 42}px Inter;color:${d.hi ? 'var(--accent)' : 'var(--ink)'};white-space:nowrap"></div>`, parent, { left: (x - bw / 2) + 'px', bottom: (1080 - by) + 'px', width: bw + 'px', height: '0px', borderRadius: '18px 18px 6px 6px', background: d.color || (d.hi ? 'linear-gradient(var(--accent2),var(--accent))' : 'color-mix(in srgb,var(--sub) 35%,transparent)') });
    el('div', 'abs', d.label, grp, { left: x + 'px', top: (by + 22) + 'px', translate: '-50% 0', font: `700 ${d.hi ? 38 : 34}px Inter,'Noto Sans CJK SC'`, color: d.hi ? 'var(--accent)' : 'var(--sub)', whiteSpace: 'nowrap' });
    return { b, d, vl: b.firstChild };
  });
  return {
    el: grp, upd(t) {
      const out = P(t, t1 - .35, t1, E.inC); grp.style.opacity = 1 - out;
      bars.forEach(({ b, d, vl }, i) => { const a = t0 + i * stg; const k = P(t, a, a + .8, E.outQt); b.style.height = (k * (d.value / max) * h * (1 - out)) + 'px'; vl.textContent = countText(t, a, a + .8, 0, d.value, opt.dec || 0) + (opt.unit || ''); vl.style.opacity = k * (1 - out); });
    }
  };
}

// ---------- 层叠结构：Layers（技术栈 / 架构 / 分层概念） ----------
// layers: [{label, sub, ic}]（自下而上）；opt: x y w times t1 tilt
function Layers(parent, layers, opt = {}) {
  const n = layers.length, cx = opt.x ?? 960, cy = opt.y ?? 560, w = opt.w ?? 820, gap = opt.gap ?? 150, times = opt.times || layers.map((_, i) => (opt.t0 || 0) + i * .5);
  const persp = el('div', 'abs', null, parent, { left: '0', top: '0', width: '1920px', height: '1080px', perspective: '2200px' });
  const items = layers.map((L, i) => {
    const e = el('div', 'abs', `<div style="display:flex;align-items:center;gap:26px;height:100%;padding:0 46px"><span style="color:#fff">${iconHTML(L.ic, 70)}</span><div><div style="font:800 58px Inter,'Noto Sans CJK SC';color:#fff">${L.label}</div>${L.sub ? `<div style="font:500 34px Inter,'Noto Sans CJK SC';color:rgba(255,255,255,.8)">${L.sub}</div>` : ''}</div></div>`, persp,
      { left: (cx - w / 2) + 'px', top: (cy + ((n - 1) / 2 - i) * gap - 65) + 'px', width: w + 'px', height: '130px', borderRadius: '24px', background: `linear-gradient(90deg, color-mix(in srgb,var(--accent) ${100 - i * 12}%, #0a1030), color-mix(in srgb,var(--accent2) ${100 - i * 12}%, #0a1030))`, boxShadow: '0 24px 50px -16px rgba(10,20,60,.45)' });
    return e;
  });
  const t1 = opt.t1 ?? 1e9;
  return { upd(t) { const out = P(t, t1 - .35, t1, E.inC); items.forEach((e, i) => { const k = P(t, times[i], times[i] + .55, E.outB); set(e, { y: -260 * (1 - k), rx: (opt.tilt ?? 18) * (1 - .3 * k), o: P(t, times[i], times[i] + .15, E.lin) * (1 - out) }); }); } };
}

// ---------- 标注框：Callout（截图/界面上圈重点） ----------
// opt: x y w h(框，舞台坐标) label side('t'|'b'|'l'|'r') t0 t1 color
function Callout(parent, o = {}) {
  const box = el('div', 'abs', null, parent, { left: o.x + 'px', top: o.y + 'px', width: o.w + 'px', height: o.h + 'px', border: `6px solid ${o.color || 'var(--accent)'}`, borderRadius: (o.r ?? 18) + 'px', boxShadow: `0 0 0 9999px rgba(8,12,24,${o.dim ?? 0})` });
  const lb = o.label ? el('div', 'abs', o.label, parent, { font: `800 ${o.size || 44}px Inter,'Noto Sans CJK SC'`, color: '#fff', background: o.color || 'var(--accent)', padding: '10px 26px', borderRadius: '16px', whiteSpace: 'nowrap' }) : null;
  if (lb) { const sd = o.side || 'b'; Object.assign(lb.style, sd === 'b' ? { left: (o.x + o.w / 2) + 'px', top: (o.y + o.h + 22) + 'px', translate: '-50% 0' } : sd === 't' ? { left: (o.x + o.w / 2) + 'px', top: (o.y - 22) + 'px', translate: '-50% -100%' } : sd === 'r' ? { left: (o.x + o.w + 26) + 'px', top: (o.y + o.h / 2) + 'px', translate: '0 -50%' } : { left: (o.x - 26) + 'px', top: (o.y + o.h / 2) + 'px', translate: '-100% -50%' }); }
  const t0 = o.t0 ?? 0, t1 = o.t1 ?? 1e9;
  return {
    upd(t) {
      const k = P(t, t0, t0 + .45, E.outQt), out = P(t, t1 - .3, t1, E.inC);
      box.style.clipPath = `inset(0 ${(100 - 100 * k).toFixed(1)}% 0 0 round ${o.r ?? 18}px)`; if (o.dim) box.style.clipPath = 'none';
      box.style.opacity = (o.dim ? k : 1) * (1 - out);
      if (lb) set(lb, { s: clamp(SP(t - t0 - .25, 1.3, 7), 0, 1.3), o: P(t, t0 + .25, t0 + .35, E.lin) * (1 - out) });
    }
  };
}

// ---------- 状态胶囊：Pill ----------
function Pill(parent, ic, text, o = {}) {
  const p = el('div', 'pill', `<span class="pi" style="color:var(--accent)">${iconHTML(ic, 36)}</span><span>${text}</span>`, parent);
  place(p, o.x ?? 960, o.y ?? 540);
  if (o.size) p.style.fontSize = o.size + 'px';
  const t0 = o.t0 ?? 0, t1 = o.t1 ?? 1e9;
  return { el: p, upd(t) { const out = P(t, t1 - .3, t1, E.inC); set(p, { s: t < t0 ? 0 : clamp(SP(t - t0, 1.3, 7), 0, 1.3) * (1 - .2 * out), o: P(t, t0, t0 + .1, E.lin) * (1 - out), y: -30 * out }); } };
}

// ---------- 背景：Bg ----------
// kind: 'paper'(浅色渐变) | 'grid'(透视网格，科技感) | 'dots'(点阵波) | 'aurora'(深色极光) | 'mesh'(彩色弥散)
function Bg(parent, kind = 'paper', o = {}) {
  const c = el('canvas', null, null, parent, { position: 'absolute', inset: '0', width: '1920px', height: '1080px' });
  c.width = 1920; c.height = 1080; const g = c.getContext('2d');
  const css = k => getComputedStyle(document.documentElement).getPropertyValue(k).trim();
  let cols = null;
  return {
    el: c, upd(t) {
      if (!cols) cols = { bg: css('--bg'), bg2: css('--bg2'), ac: css('--accent'), ac2: css('--accent2'), line: css('--line') };
      if (kind === 'aurora' || kind === 'grid') { const lg = g.createLinearGradient(0, 0, 0, 1080); lg.addColorStop(0, o.top || '#060A1E'); lg.addColorStop(1, o.bottom || '#0B1640'); g.fillStyle = lg; }
      else { const lg = g.createLinearGradient(0, 0, 0, 1080); lg.addColorStop(0, cols.bg); lg.addColorStop(1, cols.bg2); g.fillStyle = lg; }
      g.fillRect(0, 0, 1920, 1080);
      if (kind === 'aurora' || kind === 'mesh') {
        g.globalCompositeOperation = kind === 'aurora' ? 'lighter' : 'source-over';
        const bl = [[400, 300, 600, cols.ac, .22], [1500, 260, 560, cols.ac2, .2], [960, 900, 800, cols.ac, .16]];
        for (const [x, y, r, col, a] of bl) { const xx = x + Math.sin(t * .3 + x) * 120, yy = y + Math.cos(t * .25 + y) * 60; const gr = g.createRadialGradient(xx, yy, 0, xx, yy, r); gr.addColorStop(0, col); gr.addColorStop(1, 'transparent'); g.globalAlpha = kind === 'aurora' ? a * 1.6 : a * 1.3; g.fillStyle = gr; g.fillRect(xx - r, yy - r, r * 2, r * 2); }
        g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
      }
      if (kind === 'grid') {
        g.strokeStyle = cols.ac; g.globalAlpha = .28; g.lineWidth = 1.5; const hz = 520;
        for (let i = -20; i <= 20; i++) { g.beginPath(); g.moveTo(960 + i * 40, hz); g.lineTo(960 + i * 260, 1080); g.stroke(); }
        const off = (t * .6) % 1; for (let j = 0; j < 14; j++) { const z = (j + off) / 14, y = hz + Math.pow(z, 2.2) * (1080 - hz); g.globalAlpha = .28 * z; g.beginPath(); g.moveTo(0, y); g.lineTo(1920, y); g.stroke(); }
        g.globalAlpha = 1;
      }
      if (kind === 'dots') {
        g.fillStyle = cols.ac;
        for (let x = 30; x < 1920; x += 48) for (let y = 30; y < 1080; y += 48) { const d = Math.hypot(x - 960, y - 540); const a = .06 + .14 * Math.max(0, Math.sin(d / 90 - t * 2.2)); g.globalAlpha = a; g.fillRect(x - 2, y - 2, 4, 4); }
        g.globalAlpha = 1;
      }
    }
  };
}
