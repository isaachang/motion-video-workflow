// =====================================================================
// motion-kit · packs/tutorial.js —— 教程 / 操作演示组件
// 真实截图放进 Win 里，用 Cursor 点、用 Spotlight/Callout 圈、用镜头推近到操作区域；
// 一个步骤一个画面，步骤号 StepBadge 常驻角落。
// =====================================================================

// 窗口：Win {kind:'browser'|'app'|'plain', url, title, img, html, x, y, w, h, t0, t1, scroll:[[t,px],...]}
function Win(parent, o = {}) {
  const w = o.w ?? 1400, h = o.h ?? 860;
  const bar = o.kind === 'plain' ? '' : `<div class="bar"><i style="background:#FF5F57"></i><i style="background:#FEBC2E"></i><i style="background:#28C840"></i>${o.kind === 'browser' ? `<div class="url">${IC.lock(18, '#888', 2)}&nbsp;${o.url || ''}</div>` : `<div style="flex:1;text-align:center;font:600 22px Inter,'Noto Sans CJK SC';color:#444;margin-right:80px">${o.title || ''}</div>`}</div>`;
  const c = el('div', 'win', `${bar}<div class="body">${o.img ? `<img src="${A}${o.img}">` : ''}${o.html || ''}</div>`, parent, { width: w + 'px', height: h + 'px' });
  if (o.kind === 'plain') c.querySelector('.body').style.top = '0';
  place(c, o.x ?? 960, o.y ?? 540);
  const body = c.querySelector('.body'), im = body.querySelector('img'), t0 = o.t0 ?? 0, t1 = o.t1 ?? 1e9;
  return {
    el: c, body, upd(t) {
      const k = P(t, t0, t0 + .6, E.outQt), out = P(t, t1 - .35, t1, E.inC);
      set(c, { y: 120 * (1 - k), s: .9 + .1 * k, rx: 10 * (1 - k), o: P(t, t0, t0 + .2, E.lin) * (1 - out) });
      if (im && o.scroll) { const y = camKeys(o.scroll.map(([tt, py]) => [tt, 0, py, 1]), t)[1]; im.style.transform = `translateY(${-y}px)`; }
    }
  };
}

// 光标：Cursor {keys:[[t, x, y, click?]] | [[t, '#id', dy, click?]], t0, t1, size}
// 移动走缓动曲线，click=true 时在到达后按下 + 波纹
function Cursor(parent, o = {}) {
  const size = o.size || 56;
  const c = el('div', 'abs', `<svg width="${size}" height="${size}" viewBox="0 0 24 24"><path d="M4 2l15 9.5-6.5 1.6L9.6 20z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`, parent, { left: '0', top: '0', zIndex: 50, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.3))', transformOrigin: '6px 4px' });
  const rip = el('div', 'abs', null, parent, { width: '120px', height: '120px', marginLeft: '-60px', marginTop: '-60px', borderRadius: '50%', border: '6px solid var(--accent)', zIndex: 49, opacity: 0 });
  // key 的 x 可写成选择器 '#id'（落到元素中心，y 当作纵向偏移），在 INITS 时解析
  let keys = [], clicks = [];
  const build = () => { const ks = o.keys.map(k => typeof k[1] === 'string' ? (r => [k[0], r.cx + 10, r.cy + (k[2] || 0), k[3]])(rectOf(k[1])) : k); keys = ks.map(k => [k[0], k[1], k[2], 1]); clicks = ks.filter(k => k[3]).map(k => [k[0], k[1], k[2]]); };
  if (o.keys.some(k => typeof k[1] === 'string')) { keys = [[0, 0, 0, 1]]; INITS.push(build); } else build();
  const t0 = o.t0 ?? o.keys[0][0] - .3, t1 = o.t1 ?? 1e9;
  return {
    el: c, upd(t) {
      const [x, y] = camKeys(keys, t); let press = 0, ro = 0, rs = 0, rx = 0, ry = 0;
      for (const [tc, cx, cy] of clicks) { press = Math.max(press, bump(t, tc, tc + .08, tc + .22)); if (t >= tc && t < tc + .6) { const k = (t - tc) / .6; ro = 1 - k; rs = .2 + 1.1 * E.outC(k); rx = cx; ry = cy; } }
      c.style.left = x + 'px'; c.style.top = y + 'px';
      set(c, { s: 1 - .18 * press, o: P(t, t0, t0 + .2, E.lin) * (1 - P(t, t1 - .2, t1, E.lin)) });
      rip.style.left = rx + 'px'; rip.style.top = ry + 'px'; set(rip, { s: rs, o: ro });
    }
  };
}

// 逐字打字到某个元素：typeInto(elm, text, t, t0, cps, caret)
function typeInto(elm, text, t, t0, cps = 18, caret = true) {
  const n = Math.floor(clamp((t - t0) * cps, 0, text.length));
  const blink = caret && (n < text.length || Math.floor(t * 2) % 2 === 0) && t >= t0;
  elm.innerHTML = text.slice(0, n).replace(/</g, '&lt;') + (blink ? '<span class="caret"></span>' : '');
}

// 代码块：CodeBlock {code, x, y, w, t0, cps, t1, lines(显示行号)}
function hlCode(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/(#.*|\/\/.*)$/gm, '\u0001c$1\u0002')
    .replace(/("[^"\n]*"|'[^'\n]*')/g, '\u0001s$1\u0002')
    .replace(/\b(def|return|import|from|const|let|function|class|if|else|for|in|await|async|new|print)\b/g, '\u0001k$1\u0002')
    .replace(/\b(\d+(\.\d+)?)\b/g, '\u0001n$1\u0002')
    .replace(/\u0001(\w)/g, '<span class="$1">').replace(/\u0002/g, '</span>');
}
function CodeBlock(parent, o = {}) {
  const c = el('div', 'code', null, parent, { width: (o.w ?? 1200) + 'px' });
  place(c, o.x ?? 960, o.y ?? 540);
  const code = o.code || '', t0 = o.t0 ?? 0, cps = o.cps ?? 40, t1 = o.t1 ?? 1e9;
  const render = s => s.split('\n').map((ln, i) => (o.lines !== false ? `<span class="ln">${i + 1}</span>` : '') + hlCode(ln)).join('\n');
  c.innerHTML = render(code); // 先撑开尺寸
  return {
    el: c, upd(t) {
      const k = P(t, t0, t0 + .5, E.outQt), out = P(t, t1 - .3, t1, E.inC);
      set(c, { y: 80 * (1 - k), o: k * (1 - out) });
      const n = Math.floor(clamp((t - t0 - .3) * cps, 0, code.length));
      c.innerHTML = render(code.slice(0, n)) + (n < code.length || Math.floor(t * 2) % 2 ? '<span class="caret"></span>' : '');
    }
  };
}

// 终端：Terminal {lines:[{t, cmd}|{t, out}], x, y, w, h, t0, t1}
function Terminal(parent, o = {}) {
  const c = el('div', 'code', null, parent, { width: (o.w ?? 1200) + 'px', height: (o.h ?? 560) + 'px', background: '#0B0E14', overflow: 'hidden' });
  place(c, o.x ?? 960, o.y ?? 540);
  const t0 = o.t0 ?? 0, t1 = o.t1 ?? 1e9;
  return {
    el: c, upd(t) {
      set(c, { o: P(t, t0, t0 + .3, E.lin) * (1 - P(t, t1 - .3, t1, E.lin)), s: .96 + .04 * P(t, t0, t0 + .5, E.outQt) });
      let html = '';
      for (const L of o.lines) {
        if (t < L.t) break;
        if (L.cmd != null) { const n = Math.floor(clamp((t - L.t) * 22, 0, L.cmd.length)); html += `<span style="color:#7EE787">❯</span> ${L.cmd.slice(0, n).replace(/</g, '&lt;')}\n`; }
        else html += `<span style="color:#9AA6C2">${L.out.replace(/</g, '&lt;')}</span>\n`;
      }
      c.innerHTML = html + (Math.floor(t * 2) % 2 ? '<span class="caret"></span>' : '');
    }
  };
}

// 聚光灯：Spotlight {keys:[[t, x, y, w, h]] 或 target:'#id'(自动取元素矩形, pad 外扩), dim, t0, t1}——除洞口外压暗
function Spotlight(parent, o = {}) {
  const s = el('div', 'abs', null, parent, { borderRadius: '22px', boxShadow: `0 0 0 4000px rgba(6,10,22,${o.dim ?? .62})`, outline: '5px solid var(--accent)', zIndex: 40 });
  if (o.target) { o.keys = [[0, 0, 0, 0, 0]]; INITS.push(() => { const r = rectOf(o.target), p = o.pad ?? 14; o.keys = [[0, r.x - p, r.y - p, r.w + 2 * p, r.h + 2 * p]]; }); }
  const t0 = o.t0 ?? o.keys[0][0], t1 = o.t1 ?? 1e9;
  return {
    upd(t) {
      const a = camKeys(o.keys.map(k => [k[0], k[1], k[2], 1]), t), b = camKeys(o.keys.map(k => [k[0], k[3], k[4], 1]), t);
      Object.assign(s.style, { left: a[0] + 'px', top: a[1] + 'px', width: b[0] + 'px', height: b[1] + 'px' });
      s.style.opacity = P(t, t0, t0 + .35, E.lin) * (1 - P(t, t1 - .3, t1, E.lin));
    }
  };
}

// 步骤号：StepBadge {n, total, text, x, y, t0, t1}
function StepBadge(parent, o = {}) {
  const b = el('div', 'abs', `<div style="width:92px;height:92px;border-radius:28px;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;display:flex;align-items:center;justify-content:center;font:900 52px Inter">${o.n}</div><div><div style="font:700 26px Inter;color:var(--sub);letter-spacing:3px">STEP ${o.n}${o.total ? ' / ' + o.total : ''}</div><div style="font:800 48px Inter,'Noto Sans CJK SC';white-space:nowrap">${o.text || ''}</div></div>`, parent, { display: 'flex', alignItems: 'center', gap: '24px', left: (o.x ?? SAFE.x0 + 70) + 'px', top: (o.y ?? 70) + 'px' });
  const t0 = o.t0 ?? 0, t1 = o.t1 ?? 1e9;
  return { el: b, upd(t) { const k = P(t, t0, t0 + .5, E.outQt), out = P(t, t1 - .3, t1, E.inC); set(b, { x: -60 * (1 - k), o: k * (1 - out) }); } };
}
