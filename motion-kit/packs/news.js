// =====================================================================
// motion-kit · packs/news.js —— AI 资讯 / 案例分享常用组件
// 原则：来源要真实（真实 logo、真实标题、真实日期），抓不到就不写来源，绝不编造。
// 社交帖卡片用中性样式展示真实帖子内容，不模仿某个平台的整套界面。
// =====================================================================

// 新闻卡：NewsCard {tag, source, logo, date, headline, img, x, y, w, t0, t1}
function NewsCard(parent, o = {}) {
  const w = o.w ?? (VMODE ? 980 : 1100);
  const c = el('div', 'news', `${o.img ? `<div style="height:${o.imgH || 360}px;background:url(${A}${o.img}) center/cover"></div>` : ''}
    <div style="padding:40px 48px 46px">
      <div class="src">${o.tag ? `<span class="tag">${o.tag}</span>` : ''}${o.logo ? `<img src="${A}${o.logo}" style="height:40px">` : ''}<span>${o.source || ''}</span><span style="margin-left:auto" class="tab">${o.date || ''}</span></div>
      <div class="hd">${o.headline || ''}</div>
    </div>`, parent, { width: w + 'px' });
  place(c, o.x ?? 960, o.y ?? 540);
  const hd = c.querySelector('.hd'); const t0 = o.t0 ?? 0, t1 = o.t1 ?? 1e9;
  return {
    el: c, upd(t) {
      const k = P(t, t0, t0 + .6, E.outQt), out = P(t, t1 - .35, t1, E.inC);
      set(c, { y: 160 * (1 - k) - 60 * out, rx: 14 * (1 - k), s: .92 + .08 * k, o: P(t, t0, t0 + .2, E.lin) * (1 - out), b: 10 * out });
      hd.style.clipPath = `inset(0 0 ${(100 - 100 * P(t, t0 + .3, t0 + .9, E.ioC)).toFixed(1)}% 0)`;
    }
  };
}

// 社交帖：PostCard {name, handle, avatar, text, time, x, y, w, t0, t1, typing}
function PostCard(parent, o = {}) {
  const c = el('div', 'post', `<div class="who"><div class="av" style="${o.avatar ? `background-image:url(${A}${o.avatar})` : ''}"></div><div><div class="nm">${o.name || ''}</div><div class="hd2">${o.handle || ''}${o.time ? ' · ' + o.time : ''}</div></div></div><div class="tx"></div>`, parent);
  if (o.w) c.style.width = o.w + 'px';
  place(c, o.x ?? 960, o.y ?? 540);
  const tx = c.querySelector('.tx'), t0 = o.t0 ?? 0, t1 = o.t1 ?? 1e9, full = o.text || '', cps = o.cps ?? 28;
  if (!o.typing) tx.innerHTML = full;
  return { el: c, upd(t) { const k = P(t, t0, t0 + .5, E.outQt), out = P(t, t1 - .3, t1, E.inC); set(c, { y: 100 * (1 - k), o: k * (1 - out), s: .95 + .05 * k }); if (o.typing) { const n = Math.floor(clamp((t - t0 - .4) * cps, 0, full.length)); tx.textContent = full.slice(0, n); } } };
}

// 滚动字幕条：Ticker {items, y, t0, speed, label}
function Ticker(parent, o = {}) {
  const bar = el('div', 'abs', `<div style="position:absolute;left:0;top:0;bottom:0;z-index:2;display:flex;align-items:center;padding:0 28px;background:var(--bad);color:#fff;font:900 34px Inter,'Noto Sans CJK SC';letter-spacing:3px">${o.label || 'AI 快讯'}</div><div class="tr" style="position:absolute;left:220px;top:0;bottom:0;display:flex;align-items:center;gap:80px;white-space:nowrap;font:700 34px Inter,'Noto Sans CJK SC';color:#fff"></div>`, parent, { left: '0', top: (o.y ?? 960) + 'px', width: '1920px', height: '80px', background: 'rgba(10,14,30,.88)', overflow: 'hidden' });
  const tr = bar.querySelector('.tr'); tr.innerHTML = [...o.items, ...o.items, ...o.items].map(s => `<span>● ${s}</span>`).join('');
  const t0 = o.t0 ?? 0;
  return { el: bar, upd(t) { set(bar, { y: 80 * (1 - P(t, t0, t0 + .4, E.outQt)) }); tr.style.transform = `translateX(${-(t - t0) * (o.speed ?? 160)}px)`; } };
}

// 排行榜：Ranking {rows:[{name, value, logo, hi}], x, y, w, t0, stagger, unit, t1}
function Ranking(parent, rows, o = {}) {
  const w = o.w ?? 1000, rh = o.rh ?? 104, cx = o.x ?? 960, cy = o.y ?? 540, max = Math.max(...rows.map(r => r.value)), t0 = o.t0 ?? 0, stg = o.stagger ?? .18, t1 = o.t1 ?? 1e9;
  const top = cy - rows.length * rh / 2;
  const R = rows.map((r, i) => {
    const e = el('div', 'abs', `<div style="width:64px;font:900 48px Inter;color:${i < 3 ? 'var(--accent)' : 'var(--sub)'}">${i + 1}</div>${r.logo ? `<img src="${A}${r.logo}" style="width:56px;height:56px;object-fit:contain;margin-right:18px">` : ''}<div style="width:300px;font:800 40px Inter,'Noto Sans CJK SC';white-space:nowrap">${r.name}</div><div style="flex:1;height:44px;border-radius:22px;background:var(--line);position:relative;overflow:hidden"><div class="f" style="position:absolute;left:0;top:0;bottom:0;border-radius:22px;background:${r.hi ? 'linear-gradient(90deg,var(--accent),var(--accent2))' : 'color-mix(in srgb,var(--sub) 45%,transparent)'}"></div></div><div class="v tab" style="width:170px;text-align:right;font:800 40px Inter"></div>`, parent,
      { left: (cx - w / 2) + 'px', top: (top + i * rh) + 'px', width: w + 'px', height: (rh - 20) + 'px', display: 'flex', alignItems: 'center', padding: '0 30px', borderRadius: '24px', background: r.hi ? 'color-mix(in srgb,var(--accent) 10%,var(--card))' : 'var(--card)', boxShadow: 'var(--shadow)' });
    return { e, f: e.querySelector('.f'), v: e.querySelector('.v'), r };
  });
  return { upd(t) { const out = P(t, t1 - .35, t1, E.inC); R.forEach(({ e, f, v, r }, i) => { const a = t0 + i * stg, k = P(t, a, a + .5, E.outQt); set(e, { x: -80 * (1 - k), o: k * (1 - out) }); const kk = P(t, a + .2, a + 1.1, E.outQt); f.style.width = (kk * r.value / max * 100) + '%'; v.textContent = countText(t, a + .2, a + 1.1, 0, r.value, o.dec || 0) + (o.unit || ''); }); } };
}
