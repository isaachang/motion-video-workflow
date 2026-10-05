// =====================================================================
// motion-kit · packs/outro.js —— 片尾引导：收藏 / 关注 / 评论区置顶
// 依赖 packs/vertical.js（Chars），html 里要先引入 vertical.js。
// 作者信息统一放 CONFIG.creator = { name: '伊萨克玩AI', avatar: '伊' 或 'avatar.png'（a/ 下的图） }
// 坐标是父容器本地坐标（竖版内容窗 1080×1080；横版也能用，自己给 x/y）。
//   const fav = FavButton(sc.cam, { y: 350, t0: say('收藏') - .1, tPress: say('收藏') });
//   const fol = FollowCard(sc.cam, { t0: say('关注') - .1, tPress: say('关注') + .4, slogan: '带你掌握最新 [[AI 干货]]' });
//   const pin = CommentPin(sc.R, { t0: say('评论区') - .2, text: '网址：[[youmind.com]]' });
// =====================================================================
el('style', null, `
.o-btn{position:absolute;display:flex;align-items:center;justify-content:center;gap:20px;font:900 80px 'Noto Sans CJK SC';color:var(--ink);background:var(--hi);border-radius:var(--radius,24px);box-shadow:var(--shadow)}
.o-av{position:absolute;border-radius:50%;background:var(--ink) center/cover;color:var(--card);display:flex;align-items:center;justify-content:center;font:900 150px 'Noto Sans CJK SC'}
.o-fb{position:absolute;display:flex;align-items:center;justify-content:center;gap:16px;font:900 60px 'Noto Sans CJK SC';color:#fff;border-radius:18px}
.o-sheet{position:absolute;left:0;width:1080px;background:var(--card);border-radius:36px 36px 0 0;box-shadow:0 -20px 60px rgba(0,0,0,.14)}
.o-sheet .hd{height:84px;display:flex;align-items:center;padding:0 40px;font:800 36px 'Noto Sans CJK SC';color:var(--ink);border-bottom:2px solid var(--line)}
.o-tag{font:800 24px 'Noto Sans CJK SC';padding:4px 12px;border-radius:6px}
.o-link{color:var(--accent);text-decoration:underline;text-decoration-thickness:4px;text-underline-offset:8px;font-family:Inter,'Noto Sans CJK SC';font-weight:800;border-radius:6px;padding:0 4px}
`, document.head);

const CREATOR = () => Object.assign({ name: '作者', avatar: '' }, CFG.creator || {});
const avatarHTML = (c, size) => /\.(png|jpe?g|webp|svg)$/i.test(c.avatar || '') ? '' : (c.avatar || c.name.slice(0, 1));
const avatarStyle = c => /\.(png|jpe?g|webp|svg)$/i.test(c.avatar || '') ? { backgroundImage: `url(${A}${c.avatar})` } : {};
const SVG_STAR = (s, stroke, fill) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.7 3.1 1.2-6.3L2.8 9.5l6.4-.8z"/></svg>`;
const SVG_CHECK = (s, c) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>`;

// 粒子迸发（本地坐标，1080×1080 画布）
function Sparks(parent, x, y, t0, o = {}) {
  const c = el('canvas', null, null, parent, { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1080px', pointerEvents: 'none', zIndex: 5 });
  c.width = 1080; c.height = 1080; const g = c.getContext('2d'), r = rng(o.seed || 11);
  const css = k => getComputedStyle(document.documentElement).getPropertyValue(k).trim();
  const cols = o.colors || ['--accent', '--hi', '--ink', '--accent2'].map(css).filter(Boolean).concat(['#ffffff']);
  const ps = [...Array(o.n || 70)].map(() => { const a = r() * 6.283, v = (o.v || 900) * (.35 + r() * .8); return { vx: Math.cos(a) * v, vy: Math.sin(a) * v - 300, s: 8 + r() * 12, c: cols[Math.floor(r() * cols.length)], rot: r() * 6, vr: (r() - .5) * 12 }; });
  return { upd(t) { const lt = t - t0; g.clearRect(0, 0, 1080, 1080); if (lt < 0 || lt > 2.5) return; for (const p of ps) { const e = (1 - Math.exp(-2.2 * lt)) / 2.2; const px = x + p.vx * e, py = y + p.vy * e + 600 * lt * lt; g.save(); g.translate(px, py); g.rotate(p.rot + p.vr * lt); g.globalAlpha = clamp(1.6 - lt * .8); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .66); g.restore(); } } };
}

// 收藏按钮：弹出 → tPress 按下（星标填色 + 粒子）。o = {x,y,w,h,t0,tPress,label}
function FavButton(parent, o = {}) {
  const w = o.w ?? 520, h = o.h ?? 180, x = o.x ?? 540, y = o.y ?? 350, tp = o.tPress ?? 1e9, t0 = o.t0 ?? 0;
  const b = el('div', 'o-btn', `<span class="ic"></span><span>${o.label || '收藏'}</span>`, parent, { left: (x - w / 2) + 'px', top: (y - h / 2) + 'px', width: w + 'px', height: h + 'px' });
  const ic = b.querySelector('.ic'), sp = Sparks(parent, x, y, tp + .04);
  return { el: b, upd(t) { const p = bump(t, tp, tp + .06, tp + .3); set(b, { s: P(t, t0, t0 + .18, E.outB) * (1 - .08 * p), o: P(t, t0, t0 + .06) }); ic.innerHTML = SVG_STAR(86, 'var(--ink)', t > tp + .04 ? 'var(--accent)' : 'none'); sp.upd(t); } };
}

// 关注卡：头像 + 名字 + 关注按钮（tPress 后变「已关注」）+ 一句口号（[[ ]] 下面加荧光笔）。o = {y,t0,tPress,slogan}
function FollowCard(parent, o = {}) {
  const c = CREATOR(), t0 = o.t0 ?? 0, tp = o.tPress ?? t0 + .7, y0 = o.y ?? 290;
  const av = el('div', 'o-av', avatarHTML(c), parent, Object.assign({ width: '280px', height: '280px', left: '400px', top: (y0 - 140) + 'px', boxShadow: '10px 10px 0 var(--accent)' }, avatarStyle(c)));
  const nm = Chars(parent, c.name, { y: y0 + 240, t0: t0 + .1, font: "900 84px 'Noto Sans CJK SC'", stagger: .04 });
  const fb = el('div', 'o-fb', '', parent, { width: '440px', height: '130px', left: '320px', top: (y0 + 345) + 'px' });
  const sl = o.slogan || '', plain = sl.replace(/\[\[|\]\]/g, '');
  const sg = Chars(parent, plain, { y: y0 + 610, t0: t0 + .5, font: "900 74px 'Noto Sans CJK SC'", stagger: .045 });
  const hiFrom = sl.indexOf('[['), hiLen = hiFrom >= 0 ? sl.indexOf(']]') - hiFrom - 2 : 0;
  const mk = el('div', 'abs', null, parent, { height: '30px', background: 'var(--hi)', transformOrigin: '0 50%', zIndex: -1, borderRadius: '4px' });
  let measured = false;
  INITS.push(() => { if (hiFrom < 0) return; const cs = [...sg.el.children].slice(hiFrom, hiFrom + hiLen); if (!cs.length) return; const a = cs[0].getBoundingClientRect(), b = cs[cs.length - 1].getBoundingClientRect(), pr = parent.getBoundingClientRect(); Object.assign(mk.style, { left: (a.left - pr.left) + 'px', width: (b.right - a.left) + 'px', top: (a.bottom - pr.top - 34) + 'px' }); measured = true; });
  const tHi = o.tHi ?? t0 + 1.4;
  return { upd(t) {
    set(av, { s: P(t, t0, t0 + .3, E.outB2), o: P(t, t0, t0 + .06) }); nm.upd(t); sg.upd(t);
    const done = t > tp + .05, p = bump(t, tp, tp + .06, tp + .25);
    fb.innerHTML = done ? `${SVG_CHECK(54, '#fff')}已关注` : `<span style="font-size:72px;line-height:1">+</span>关注`;
    fb.style.background = done ? 'var(--ink)' : 'var(--accent)';
    set(fb, { s: P(t, t0 + .2, t0 + .45, E.outB) * (1 - .08 * p), o: P(t, t0 + .2, t0 + .26) });
    mk.style.transform = `scaleX(${measured ? P(t, tHi, tHi + .4, E.ioC).toFixed(3) : 0})`;
  } };
}

// 评论区置顶：评论面板从底部滑上来，置顶评论里放网址（[[ ]] 变成链接样式，tFlash 时闪一下高亮）。
// o = {t0, h, count, text, tags:['作者','置顶'], tFlash}，parent 建议用 sc.R（不跟镜头缩放）
function CommentPin(parent, o = {}) {
  const c = CREATOR(), h = o.h ?? 430, t0 = o.t0 ?? 0, tf = o.tFlash ?? t0 + .5;
  const tags = (o.tags || ['作者', '置顶']).map((s, i) => `<span class="o-tag" style="background:${i ? 'var(--hi)' : 'var(--ink)'};color:${i ? 'var(--ink)' : 'var(--card)'}">${s}</span>`).join('');
  const txt = (o.text || '').replace(/\[\[(.+?)\]\]/g, '<span class="o-link">$1</span>');
  const sh = el('div', 'o-sheet', `<div class="hd">评论<span style="color:var(--sub);margin-left:12px;font-weight:600">${o.count || '1,024'}</span></div>
    <div style="display:flex;gap:24px;padding:30px 40px"><div class="o-av" style="position:relative;flex:none;width:96px;height:96px;font-size:52px;${/\.(png|jpe?g|webp|svg)$/i.test(c.avatar || '') ? `background-image:url(${A}${c.avatar})` : ''}">${avatarHTML(c)}</div>
    <div style="flex:1"><div style="display:flex;align-items:center;gap:14px;font:800 36px 'Noto Sans CJK SC';color:var(--ink)">${c.name}${tags}</div>
    <div style="margin-top:14px;font:600 44px 'Noto Sans CJK SC';color:var(--ink)">${txt}</div></div></div>`, parent, { top: '1080px', height: h + 'px' });
  const lk = sh.querySelector('.o-link');
  return { el: sh, upd(t) { sh.style.top = (1080 - h * P(t, t0, t0 + .4, E.outQt)) + 'px'; if (lk) lk.style.background = `color-mix(in srgb,var(--hi) ${(90 * bump(t, tf, tf + .2, tf + .8)).toFixed(1)}%,transparent)`; } };
}
