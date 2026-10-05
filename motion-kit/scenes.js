// =====================================================================
// 演示时间轴：把每个组件包过一遍，用来检查模板能不能正常渲染。
// 新片子：清空本文件，按分镜表逐段写 Scene。一个画面一个信息，关键信息停留 ≥1s。
// 写法：const sc = Scene(名称, 开始, 结束, 层级, 背景); 组件 = 工厂(sc.el 或 cam, ...); sc.upd = t => {...}
// =====================================================================

// ---- S1 0–4.2 开场提问：深色网格 + 动态文字 + 关键词 ----
{
  const sc = Scene('hook', 0, 4.2, 1);
  const bg = Bg(sc.el, 'grid', { top: '#050A1F', bottom: '#0D1A4A' });
  const cam = el('div', 'cam', null, sc.el);
  const q = KineticText(cam, '大模型是怎么[[回答问题]]的？', { y: 430, size: VMODE ? 78 : 110, color: '#fff', t0: .25, mode: 'blur', t1: 4.2 });
  const k = KeyWord(cam, '预测下一个词', { y: 640, size: VMODE ? 96 : 130, style: 'chip', t0: snap(1.9), t1: 4.2 });
  sc.upd = t => { bg.upd(t); applyCam(cam, camKeys([[0, 960, 540, 1], [4.2, 960, 540, 1.08, E.lin]], t), drift(t, 4)); q.upd(t); k.upd(t); };
  FLASHES.push([snap(1.9), .35, .3, '#9fc4ff']);
}
BarsWipe(3.9, .6);

// ---- S2 4.2–8.2 原理流程：FlowChain 逐个点亮 ----
{
  const sc = Scene('flow', 4.2, 8.2, 1);
  const bg = Bg(sc.el, 'dots');
  const tt = KineticText(sc.el, '一次回答的 4 个步骤', { y: VMODE ? 100 : 170, size: 64, t0: 4.4, mode: 'rise' });
  const fc = FlowChain(sc.el, [{ ic: 'chat', label: '你的问题' }, { ic: 'code', label: '切成词元' }, { ic: 'brain', label: '逐词预测' }, { ic: 'spark', label: '拼成回答' }], { y: VMODE ? 610 : 560, x: VMODE ? 1000 : 960, times: [4.7, 5.3, 5.9, 6.5].map(x => snap(x)) });
  sc.upd = t => { bg.upd(t); tt.upd(t); fc.upd(t); };
}
StrokeWipe(7.9, .65);

// ---- S3 8.2–12.2 对比：搜索引擎 vs 大模型（VMODE 下左右摇镜，一次只看一边） ----
{
  const sc = Scene('compare', 8.2, 12.2, 1);
  const bg = Bg(sc.el, 'paper');
  const cam = el('div', 'cam', null, sc.el);
  const cp = Compare(cam, { title: '搜索引擎', ic: 'search', items: ['给你一堆链接', '自己去翻、去拼'], tone: 'bad' }, { title: '大模型', ic: 'bot', items: ['直接写出答案', '还能接着追问'], tone: 'good' }, { t0: 8.35, tWin: 10.6 });
  const keys = VMODE ? [[8.2, 560, 540, 1], [9.7, 560, 540, 1], [10.3, 1360, 540, 1, E.ioQt], [12.2, 1360, 540, 1.03, E.lin]] : [[8.2, 960, 540, 1], [12.2, 960, 540, 1.04, E.lin]];
  if (VMODE) MB.push([9.7, 10.3, 4]);
  sc.upd = t => { bg.upd(t); applyCam(cam, camKeys(keys, t)); cp.upd(t); };
}
Iris(11.9, .7, { from: [1360, 540] });

// ---- S4 12.2–16.2 数据：柱状图 + 大数字 ----
{
  const sc = Scene('data', 12.2, 16.2, 1);
  const bg = Bg(sc.el, 'mesh');
  const bc = BarChart(sc.el, [{ label: '2022', value: 12 }, { label: '2023', value: 38 }, { label: '2024', value: 71 }, { label: '2025', value: 120, hi: true }], { t0: 12.5, unit: '亿', t1: 14.4 });
  const bs = BigStat(sc.el, { value: 120, suffix: '亿', label: '每天的 AI 对话次数（示意数据）', t0: 14.4, size: VMODE ? 200 : 240 });
  sc.upd = t => { bg.upd(t); bc.upd(t); bs.upd(t); };
}

// ---- S5 16.2–20.2 资讯：新闻卡 + 滚动条 ----
{
  const sc = Scene('news', 16.2, 20.2, 1);
  const bg = Bg(sc.el, 'aurora');
  const nc = NewsCard(sc.el, { tag: '快讯', source: '示例来源', date: '2026-10-01', headline: '这里放真实新闻标题<br>一行不超过 16 个字', t0: 16.4, y: 500 });
  const tk = Ticker(sc.el, { items: ['真实资讯要写来源', '数字要能查证', '一屏只讲一件事'], t0: 16.8 });
  sc.upd = t => { bg.upd(t); nc.upd(t); tk.upd(t); };
}
BarsWipe(19.9, .6, { angle: 12 });

// ---- S6 20.2–25.2 教程：窗口 + 光标点击 + 聚光灯 + 步骤号（镜头推近操作区） ----
{
  const sc = Scene('tutorial', 20.2, 25.2, 1);
  const bg = Bg(sc.el, 'paper');
  const cam = el('div', 'cam', null, sc.el);
  const w = Win(cam, { kind: 'browser', url: 'example.com/settings', w: 1300, h: 760, t0: 20.3, html: `<div style="padding:60px 70px;font:600 34px Inter,'Noto Sans CJK SC';color:#333">设置<div style="margin-top:40px;display:flex;gap:30px"><div style="padding:22px 40px;border-radius:18px;background:#EEF1F8">常规</div><div style="padding:22px 40px;border-radius:18px;background:#EEF1F8">账户</div><div id="tgt" style="padding:22px 40px;border-radius:18px;background:var(--accent);color:#fff">开启 AI 助手</div></div></div>` });
  const cur = Cursor(cam, { keys: [[21.0, 1500, 900], [22.2, '#tgt', 0, true], [24.0, '#tgt', 0]] });
  const sp = Spotlight(cam, { target: '#tgt', t0: 22.5, dim: .5 });
  let tg = [960, 540]; INITS.push(() => { const r = rectOf('#tgt'); tg = [r.cx, r.cy]; });
  const sb = StepBadge(sc.el, { n: 1, total: 3, text: '打开设置', t0: 20.5 });
  sc.upd = t => { bg.upd(t); applyCam(cam, camKeys([[20.2, 960, 540, 1], [22.5, 960, 540, 1], [23.1, tg[0], tg[1], 1.7, E.ioQt], [25.2, tg[0], tg[1], 1.75, E.lin]], t)); w.upd(t); cur.upd(t); sp.upd(t); sb.upd(t); };
}

// ---- S7 25.2–28.6 代码 + 层级结构 ----
{
  const sc = Scene('code', 25.2, 28.6, 1);
  const bg = Bg(sc.el, 'grid');
  const cb = CodeBlock(sc.el, { code: '# 调用一次大模型\nreply = model.chat("你好")\nprint(reply)', w: VMODE ? 1000 : 1100, t0: 25.3, cps: 30 });
  sc.upd = t => { bg.upd(t); cb.upd(t); };
}
{
  const sc = Scene('layers', 28.6, 31.4, 1);
  const bg = Bg(sc.el, 'paper');
  const ly = Layers(sc.el, [{ label: '算力', sub: 'GPU 集群', ic: 'gear' }, { label: '基础模型', sub: '预训练', ic: 'brain' }, { label: '应用', sub: '聊天 / 智能体', ic: 'chat' }], { t0: 28.7, w: VMODE ? 900 : 820 });
  sc.upd = t => { bg.upd(t); ly.upd(t); };
}
StrokeWipe(31.1, .6);

// ---- S8 31.4–34 结尾：手机聊天 + 胶囊 ----
{
  const sc = Scene('phone', 31.4, 34, 1);
  const bg = Bg(sc.el, 'mesh');
  const cam = el('div', 'cam', null, sc.el);
  const ph = Phone(cam, { x: 759, y: 103, name: '助手', status: '在线', clock: '9:41' });
  ph.add('帮我总结这篇文章', 31.6, 'u'); ph.add('好的，核心观点有三条：…', 32.2, 'a');
  const pl = Pill(sc.el, 'check', '一个画面只讲一件事', { y: 130, t0: 32.8 });
  sc.upd = t => { bg.upd(t); applyCam(cam, camKeys([[31.4, 960, 540, 1], [32.4, 960, 540, 1], [33.2, 960, 720, 2.2, E.ioQt]], t)); ph.update(t); pl.upd(t); };
}
