// =====================================================================
// 每支片子的配置：主题色 / 时长 / 预载素材 / 竖版装饰带 / 封面
// 主题按选题定，不要沿用上一支。下面是演示用的“清爽科技蓝”。
// =====================================================================
window.THEME = {
  bg: '#F4F6FB', bg2: '#E6ECF8', ink: '#0E1220', sub: '#5D6680',
  accent: '#3B5BFF', accent2: '#16C2F0', hi: '#FFD54A', good: '#18B26B', bad: '#F0445B',
  card: '#FFFFFF', line: 'rgba(14,18,32,.10)',
};
window.CONFIG = {
  creator: { name: '作者名', avatar: '' },   // 片尾关注 / 评论区用：avatar 可写一个字，或 a/ 下的头像图片
  duration: 34,              // 成片时长（秒）= 音频时长 + 0.5–1s 定版
  grain: .06,                // 胶片颗粒强度，0 关闭
  preload: [],               // 需要 canvas 绘制的图片：['logo.svg', 'hero.jpg']
  sprites: {},               // 逐帧 PNG 动图：{ ip: { dir: 'ip', n: 96 } }
  vertical: {
    preset: 'night',         // night | tech | clean | paper
    title: ['大模型是怎么', '[[回答]]你的问题的？'],
    sub: '3 分钟看懂 AI 原理',
    tag: 'AI 知识',
  },
  cover: {
    title: ['大模型', '其实在[[猜词]]'],
    kicker: 'AI 知识讲解',
    hero: '',                // 主图（a/ 下的文件），空则用 heroHTML
    hero43: '',              // 横版主图（可选）：竖长的主体（比如抠出来的透明底手机 PNG）单独给一张，完整显示不裁切
    heroHTML: '',
    sub: '',                 // 横版：标题下的一行说明（可选），如「GitHub 开源 · 免费」
    chips: [],               // 横版：2–3 个卖点标签（可选），如 ['逐字踩点', '运镜转场']
  },
};
