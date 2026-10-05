// =====================================================================
// motion-kit · packs/product-ui.js —— 产品案例：手机聊天 / 推送通知
// 真实产品的界面要按官方截图/发布视频 1:1 重建（颜色、圆角、字号、图标），
// 这里给的是通用 iOS 骨架，换 header / 气泡色 / 底栏即可贴近目标产品。
// =====================================================================
el('style', null, `
.phone{position:absolute;width:402px;height:874px;border-radius:64px;background:#FCFCFC;overflow:hidden;box-shadow:0 0 0 7px #0c0c0e,0 0 0 9px #3b3b40,0 50px 110px -25px rgba(25,40,80,.45)}
.phone .island{position:absolute;top:11px;left:50%;width:122px;height:35px;margin-left:-61px;background:#000;border-radius:20px;z-index:9}
.phone .sbar{position:absolute;top:0;left:0;right:0;height:54px;display:flex;justify-content:space-between;align-items:center;padding:4px 30px 0 52px;font:600 17px Inter;z-index:8}
.phone .phead{position:absolute;top:48px;left:0;right:0;height:110px;z-index:6;background:linear-gradient(#FCFCFC 70%,rgba(252,252,252,0));display:flex;flex-direction:column;align-items:center;padding-top:6px}
.phone .phead .av{width:52px;height:52px;border-radius:50%;background:#eee center/cover}
.phone .phead b{font:600 16px Inter,'Noto Sans CJK SC';margin-top:4px}
.phone .phead i{font:400 12.5px Inter,'Noto Sans CJK SC';color:#6c6c72;font-style:normal}
.phone .chat{position:absolute;left:0;right:0;top:150px;bottom:96px;overflow:hidden;z-index:2}
.phone .col{position:absolute;left:14px;right:14px;bottom:8px;display:flex;flex-direction:column}
.phone .pinput{position:absolute;left:14px;right:14px;bottom:30px;height:50px;border-radius:25px;background:#fff;box-shadow:0 2px 14px rgba(0,0,0,.07);display:flex;align-items:center;padding:0 18px;font:400 17px Inter,'Noto Sans CJK SC';color:#8e8e93;z-index:6}
.mw{flex:none;display:flex;overflow:visible}.mw.r{justify-content:flex-end}
.m{max-width:84%;padding:10px 14px 11px;border-radius:20px;font:400 16px/1.42 Inter,'Noto Sans CJK SC';margin:4px 0;transform-origin:0 100%}
.m.a{background:#EDEDF0;color:#141416}.m.u{background:var(--accent);color:#fff;transform-origin:100% 100%}
.notice{position:absolute;width:370px;border-radius:24px;background:rgba(245,245,247,.86);backdrop-filter:blur(20px);padding:14px 16px;display:flex;gap:12px;box-shadow:0 10px 30px rgba(0,0,0,.18)}
.notice .ni{width:40px;height:40px;border-radius:10px;background:#fff center/cover;flex:none}
.notice b{font:600 15px Inter,'Noto Sans CJK SC'}.notice p{margin:2px 0 0;font:400 15px/1.35 Inter,'Noto Sans CJK SC'}
`, document.head);

// Phone {x, y, clock, name, avatar(素材路径), status, input}
// ph.add(html, t0, kind 'a'|'u'|'raw'|'rawR')；ph.status([[t, html],...])；ph.update(t)
// 推近看消息：把 phone 放在 cam 里，用 camKeys 逐条推到 2.4–2.8 倍（正文成片 ≥40px）
function Phone(parent, o = {}) {
  const p = el('div', 'phone', null, parent);
  if (o.x != null) { p.style.left = o.x + 'px'; p.style.top = o.y + 'px'; }
  el('div', 'island', null, p);
  el('div', 'sbar', `<span class="clk">${o.clock || '9:41'}</span><span style="font:600 14px Inter">●●● ᯤ ▮</span>`, p);
  const chat = el('div', 'chat', null, p), col = el('div', 'col', null, chat);
  const head = el('div', 'phead', `<div class="av" style="${o.avatar ? `background-image:url(${A}${o.avatar})` : ''}"></div><b>${o.name || ''}</b><i class="st">${o.status || ''}</i>`, p);
  const st = head.querySelector('.st');
  el('div', 'pinput', o.input || 'Message', p);
  INITS.push(() => ph.measure());
  const ph = {
    el: p, col, chat, head, st, msgs: [], statusSeq: [],
    add(html, t0, kind = 'a', dur = 0.42) {
      const w = el('div', 'mw' + (kind === 'u' || kind === 'rawR' ? ' r' : ''), null, col);
      const inner = (kind === 'a' || kind === 'u') ? el('div', 'm ' + kind, html, w) : el('div', null, html, w, { transformOrigin: kind === 'rawR' ? '100% 100%' : '0 100%' });
      const m = { w, inner, t0, dur, h: 0, kind }; ph.msgs.push(m); return m;
    },
    status(seq) { ph.statusSeq = seq; },
    measure() { for (const m of ph.msgs) { m.w.style.height = 'auto'; m.h = m.w.offsetHeight; } },
    update(t) {
      for (const m of ph.msgs) {
        const k = P(t, m.t0, m.t0 + m.dur, E.outQt);
        if (k <= 0) { show(m.w, false); continue; }
        show(m.w, true); m.w.style.height = (m.h * k).toFixed(2) + 'px';
        set(m.inner, { s: 0.6 + 0.4 * SP(t - m.t0, 1.5, 7), o: P(t, m.t0, m.t0 + 0.18, E.lin), y: (1 - k) * 10 });
      }
      let cur = null; for (const [tt, html] of ph.statusSeq) if (t >= tt) cur = html;
      if (cur != null && st._h !== cur) { st.innerHTML = cur; st._h = cur; }
    },
    upd(t) { ph.update(t); }
  };
  return ph;
}
// 消息在 phone 内的中心坐标（舞台坐标，用于 camKeys 推近），需在 INITS 之后调用
function msgCenter(ph, m) { const r = m.inner.getBoundingClientRect(), s = stage.getBoundingClientRect(); return [r.left + r.width / 2 - s.left, r.top + r.height / 2 - s.top]; }

// 推送通知：Notice {x, y, icon, app, title, text, t0, t1}
function Notice(parent, o = {}) {
  const n = el('div', 'notice', `<div class="ni" style="${o.icon ? `background-image:url(${A}${o.icon})` : ''}"></div><div style="flex:1"><div style="display:flex;justify-content:space-between"><b>${o.app || ''}</b><span style="font:400 13px Inter;color:#888">${o.time || 'now'}</span></div>${o.title ? `<b>${o.title}</b>` : ''}<p>${o.text || ''}</p></div>`, parent, { left: (o.x ?? 776) + 'px', top: (o.y ?? 200) + 'px' });
  const t0 = o.t0 ?? 0, t1 = o.t1 ?? 1e9;
  return { el: n, upd(t) { const k = SP(t - t0, 1.1, 7); set(n, { y: t < t0 ? -200 : -200 * (1 - k), o: P(t, t0, t0 + .15, E.lin) * (1 - P(t, t1 - .3, t1, E.lin)), s: 1 }); } };
}
