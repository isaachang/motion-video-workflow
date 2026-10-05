// 12 张效果图的画面（全部为代码生成的虚构内容）
const ART = [['#FF6B6B', '#FFD93D', 'NOVA'], ['#4D96FF', '#6BCB77', 'FLUX'], ['#B983FF', '#FF6FB5', 'ORBIT'], ['#00C2A8', '#00E0FF', 'PULSE'], ['#FF9F45', '#FF5D5D', 'BLAZE'], ['#5B7CFF', '#B26BFF', 'AURA'], ['#F9F871', '#00C9A7', 'ZEST'], ['#FF8FAB', '#A78BFA', 'BLOOM'], ['#38BDF8', '#818CF8', 'DRIFT'], ['#FACC15', '#FB7185', 'SOLAR'], ['#34D399', '#22D3EE', 'MINT'], ['#F472B6', '#FB923C', 'GLOW']];
function artCard(parent, i, x, y, w, h, o = {}) {
  const [a, b, word] = ART[i % ART.length];
  return vbox(parent, 'abs', `<div style="position:absolute;inset:0;background:radial-gradient(circle at ${25 + (i * 37) % 50}% ${30 + (i * 23) % 40}%,${b},transparent 62%),linear-gradient(${(i * 53) % 360}deg,${a},#0b0d18 85%)"></div><div style="position:absolute;left:8%;bottom:9%;font:800 ${Math.round(w * .16)}px/1 Inter;color:#fff;letter-spacing:-1px;mix-blend-mode:overlay">${word}</div><div style="position:absolute;left:8%;top:8%;width:28%;height:4px;background:#fff;opacity:.7"></div>`, x, y, w, h, Object.assign({ overflow: 'hidden', borderRadius: (o.r ?? 18) + 'px', boxShadow: o.shadow || '0 20px 50px rgba(0,0,0,.35)', border: o.border || 'none' }, o.style || {}));
}
function BGW() { return el('div', 'abs', null, C, { left: '-420px', top: '0', width: '1920px', height: '1080px' }); }
const sc = VShot('show' + N, 0, 6, N === 6 ? 'radial-gradient(ellipse at 50% 60%,#1b2040,#05060c 72%)' : 'var(--bg)');
const C = sc.cam, parts = [];
const add = c => (parts.push(c), c);
let camf = t => [540, 540, 1];

if (N === 1) {
  add(Stamp(C, '高级感', { y: 230, t0: .2, size: 210, mark: true, rot: -4 }));
  add(StatBox(C, { x: 60, y: 470, icon: IC.search(44, 'var(--sub)'), label: '浏览', value: 48.7, fmt: v => v.toFixed(1) + 'K', t0: .9 }));
  add(StatBox(C, { x: 565, y: 470, icon: IC.check(44, 'var(--sub)'), label: '收藏', value: 1.4, fmt: v => v.toFixed(1) + 'K', t0: 1.3, rot: 3 }));
  add(Keycap(C, '⌘C', { x: 380, y: 900, t0: 1.2, tPress: 1.9 })); add(Keycap(C, '⌘V', { x: 700, y: 900, t0: 1.3, tPress: 2.2 }));
  [...C.querySelectorAll('.v-stat,.v-key')].forEach(e => { e.style.border = '3px solid var(--ink)'; e.style.boxShadow = '9px 9px 0 var(--ink)'; e.style.borderRadius = '0'; });
}
if (N === 2) {
  add(Bg(BGW(), 'aurora', { top: '#070A1A', bottom: '#120C3A' }));
  const nc = add(NewsCard(C, { tag: '快讯', source: '示例新闻 · 虚构', date: '2026-10-05', headline: '某开源模型把上下文提升到 1M，还能边看视频边写代码', x: 540, y: 560, w: 960, t0: .2 }));
  const hero = artCard(nc.el, 5, 0, 0, 960, 330, { r: 0, shadow: 'none' }); hero.style.position = 'relative';
  nc.el.insertBefore(hero, nc.el.firstChild);
  add(Ticker(C, { items: ['示例快讯 A', '示例快讯 B', '示例快讯 C', '仅作效果演示'], y: 990, t0: .4, label: 'LIVE' }));
  [...C.querySelectorAll('.news .hd')].forEach(e => e.style.fontSize = '64px');
}
if (N === 3) {
  add(Bg(BGW(), 'grid'));
  add(Ranking(C, [{ name: '模型 A', value: 92, hi: true }, { name: '模型 B', value: 87 }, { name: '模型 C', value: 81 }, { name: '模型 D', value: 74 }, { name: '模型 E', value: 66 }], { x: 540, y: 560, w: 960, t0: .3, unit: '分' }));
  add(Chars(C, '编程测评 · 示意', { y: 160, t0: .1, font: "800 52px 'Noto Sans CJK SC'", color: 'var(--sub)' }));
}
if (N === 4) {
  add(Bg(BGW(), 'dots'));
  add(FlowChain(C, [{ ic: 'chat', label: '口播配音', sub: '你只需要录音' }, { ic: 'doc', label: '逐字听写', sub: '每个字都有时间' }, { ic: 'code', label: '代码动效', sub: 'HTML · CSS 3D · Canvas' }, { ic: 'play', label: '逐帧渲染', sub: '60fps 成片' }], { x: 330, y: 540, dir: 'y', gap: 250, size: 140, times: [.2, .7, 1.2, 1.7] }));
}
if (N === 5) {
  const card = (y, title, items, good, t0, rot) => { const e = vbox(C, 'abs', `<div style="font:900 64px 'Noto Sans CJK SC';display:flex;align-items:center;gap:18px;color:${good ? 'var(--accent)' : 'var(--sub)'}">${good ? IC.spark(60, 'var(--accent)', 2.6) : IC.clock(60, 'var(--sub)', 2.6)}${title}</div>` + items.map(x => `<div style="display:flex;align-items:center;gap:18px;margin-top:20px;font:700 44px 'Noto Sans CJK SC';color:${good ? 'var(--ink)' : 'var(--sub)'};${good ? '' : 'text-decoration:line-through;text-decoration-thickness:4px'}"><span style="flex:none;width:50px;height:50px;border-radius:50%;background:${good ? 'var(--good)' : '#B7A88F'};display:flex;align-items:center;justify-content:center">${good ? IC.check(32, '#fff', 3.4) : IC.cross(30, '#fff', 3.4)}</span>${x}</div>`).join(''), 70, y, 940, 420, { background: good ? 'var(--card)' : 'rgba(255,251,242,.55)', border: `4px solid ${good ? 'var(--ink)' : 'rgba(34,27,20,.25)'}`, boxShadow: good ? '12px 12px 0 var(--ink)' : 'none', padding: '40px 48px', transform: `rotate(${rot}deg)` });
    return { upd(t) { const k = P(t, t0, t0 + .45, E.outB); e.style.opacity = P(t, t0, t0 + .1); e.style.transform = `translateY(${80 * (1 - k)}px) rotate(${rot}deg)`; } }; };
  add(card(50, '以前', ['手写提示词改十几版', '一个镜头调一下午', '跑出来一股塑料味'], false, .2, -1.5));
  add(card(560, '现在', ['口播一到自动对齐', '组件拼装 + 现场设计', '每一帧都能重画'], true, .9, 1));
  add(Seal(C, '高下立判', { x: 860, y: 590, t0: 2.0, size: 64, rot: 10, color: 'var(--accent)', bg: 'var(--card)' }));
}
if (N === 6) {
  const holder = el('div', 'abs', '', C, { left: '0', top: '0', width: '1080px', height: '1080px', perspective: '1100px' });
  const ring = el('div', 'abs', null, holder, { left: '540px', top: '440px', width: '0', height: '0', transformStyle: 'preserve-3d' });
  const NR = 15, RAD = 1000, STEP = 15;
  const cards = [...Array(NR)].map((_, i) => artCard(ring, i, -190, -260, 380, 520, { r: 16, border: '2px solid rgba(255,255,255,.55)', shadow: '0 0 60px rgba(90,120,255,.45)' }));
  const refl = el('div', 'abs', null, C, { left: '0', top: '720px', width: '1080px', height: '360px', background: 'linear-gradient(transparent,rgba(5,6,12,.9))' });
  add({ upd(t) { ring.style.transform = 'rotateX(4deg)'; cards.forEach((c, i) => { const th = ((i - (NR - 1) / 2) * STEP + (t - 2.4) * 9 + 7.5) * Math.PI / 180; c.style.transform = `translate3d(${(RAD * Math.sin(th)).toFixed(1)}px,0,${(-RAD * Math.cos(th) + 330).toFixed(1)}px) rotateY(${(-th * 180 / Math.PI).toFixed(2)}deg)`; c.style.opacity = clamp(1.45 - Math.abs(th) * 1.35).toFixed(3); }); } });
  add(Stamp(C, '出效果', { y: 900, t0: .9, size: 150, mark: true, color: '#fff' }));
}
if (N === 7) {
  add(Bg(BGW(), 'grid', { top: '#070B12', bottom: '#0B1220' }));
  add(Terminal(C, { x: 540, y: 590, w: 980, h: 760, t0: .1, lines: [
    { t: .2, cmd: 'git clone github.com/isaachang/motion-video-workflow' }, { t: 1.2, out: '✓ 已下载 motion-kit · 7 个组件包' },
    { t: 1.5, cmd: 'cp -r motion-video-workflow ~/.claude/skills/' }, { t: 2.4, out: '✓ 技能已安装' },
    { t: 2.7, cmd: 'claude "用我的配音做一支 9:16 动效片"' }, { t: 3.4, out: '◆ 听写配音… 55.7s' }, { t: 3.5, out: '◆ 生成分镜 20 个镜头' } ] }));
  [...C.querySelectorAll('.code')].forEach(e => { e.style.font = "500 31px/1.7 Menlo,'SF Mono',monospace"; e.style.whiteSpace = 'pre-wrap'; e.style.borderRadius = '22px'; e.style.border = '1.5px solid rgba(148,163,184,.25)'; });
  { const b = add(StepBadge(C, { n: 2, total: 3, label: '安装技能', title: '安装技能', t0: .1 })); Object.assign(b.el.style, { left: '60px', top: '20px', display: 'flex', gap: '20px', alignItems: 'center' }); }
}
if (N === 8) {
  const wrap = el('div', 'abs', null, C, { left: '0', top: '0', width: '1080px', height: '1080px', transform: 'scale(2.15)', transformOrigin: '540px 760px' });
  const ph = Phone(wrap, { x: 339, y: 90, name: '出行助手', status: '在线', input: '发消息…' });
  ph.add('帮我订明早去上海的高铁，靠窗', .2, 'u'); ph.add('好的，找到 3 班。07:00 那班还有靠窗座位，要订吗？', .8, 'a'); ph.add('订', 1.5, 'u'); ph.add('✓ 已订好 G7001 · 07:00 · 12F 靠窗', 2.0, 'a');
  add(ph);

}
if (N === 9) {
  add(Bg(BGW(), 'mesh'));
  add(BigStat(C, { value: 87, prefix: '-', suffix: '%', label: '制作时间（示意）', x: 540, y: 250, size: 220, t0: .2, dur: 1 }));
  add(BarChart(C, [{ label: '剪辑软件', value: 6, color: 'var(--sub)' }, { label: '模板套用', value: 3.5, color: 'var(--accent2)' }, { label: '本技能', value: .8, hi: true }], { x: 540, y: 980, w: 900, h: 460, unit: 'h', t0: .8 }));
}
if (N === 10) {
  add(Bg(BGW(), 'aurora', { top: '#0A0820', bottom: '#1A0F3D' }));
  add(Layers(C, [{ label: '渲染', sub: 'Playwright 逐帧 · 60fps', ic: 'play' }, { label: '组件', sub: '7 个组件包', ic: 'gear' }, { label: '分镜', sub: '一屏一个信息', ic: 'doc' }, { label: '听写', sub: '逐字时间轴', ic: 'chat' }, { label: '配音', sub: '你的声音', ic: 'user' }].reverse(), { x: 540, y: 560, w: 900, gap: 160, t0: .2, tilt: 22 }));
}
if (N === 11) {
  add(FollowCard(C, { y: 165, t0: .1, tPress: 1.3, slogan: '每周一支 [[AI 干货]]', tHi: 1.9 }));
  add(CommentPin(sc.R, { t0: 1.5, h: 250, text: '技能地址：[[github.com/…]]', tFlash: 2.0 }));
}
if (N === 12) {
  add(Bg(BGW(), 'aurora', { top: '#03111A', bottom: '#062A2F' }));
  add(Timeline(C, [{ date: '①', label: '录配音' }, { date: '②', label: '听写分镜' }, { date: '③', label: '代码动效' }, { date: '④', label: '逐帧渲染' }], { y: 470, x0: 130, x1: 950, times: [.2, .7, 1.2, 1.7] }));
  add(KeyWord(C, '全程本地运行', { x: 540, y: 860, style: 'glow', t0: 2.2, size: 100 }));
}
sc.upd = t => { camL0(t); parts.forEach(p => p.upd && p.upd(t)); };
function camL0(t) { vcam(C === sc.cam ? sc.cam : sc.cam, camf(t), drift(t, 2)); }
