// 12 张效果图的配置：show.html#1 … #12
const N = +(location.hash.slice(1) || 1);
const SHOWS = {
  1: { name: '白瓷发布会', shell: 'porcelain', t: 2.6,
    theme: { bg: '#FBF7EF', bg2: '#F5F0E8', ink: '#16161C', sub: '#7A7368', accent: '#003AE7', accent2: '#2B5EAA', hi: '#FEDD55', bad: '#E8442D', card: '#FFFDF8', line: 'rgba(22,22,28,.08)', vignette: 'rgba(60,45,20,.10)' },
    v: { title: ['一句提示词', '做出[[发布会]]{{动效}}'], tag: 'AI 工具', sub: '代码逐帧渲染 · 每一帧都可控', url: 'MOTION-KIT', brand: { name: 'Motion Kit' } } },
  2: { name: '深夜霓虹', preset: 'night', t: 2.7,
    theme: { bg: '#070A1A', bg2: '#0D1230', ink: '#F2F4FF', sub: '#9AA3C7', accent: '#7B5CFF', accent2: '#22D3EE', hi: '#FFD54A', bad: '#FF4D6D', card: '#141A3A', line: 'rgba(140,160,255,.14)' },
    v: { title: ['今天 AI 圈', '发生了[[三件大事]]'], tag: 'AI 资讯', sub: '每天 60 秒 · 看懂 AI 新动向', brand: { name: 'AI Daily' } } },
  3: { name: '科技网格', preset: 'tech', t: 2.9,
    theme: { bg: '#061021', bg2: '#0A1A36', ink: '#EAF2FF', sub: '#8FA6C9', accent: '#2E7CFF', accent2: '#00E0B8', hi: '#FFC94A', bad: '#FF5470', card: '#0F223F', line: 'rgba(120,170,255,.15)' },
    v: { title: ['大模型', '[[写代码]]谁最强'], tag: 'AI 测评', sub: '示意数据 · 仅作效果演示', brand: { name: 'Bench Lab' } } },
  4: { name: '清爽白板', preset: 'clean', t: 3.2,
    theme: { bg: '#F6F8FC', bg2: '#E8EEF9', ink: '#111827', sub: '#5B6478', accent: '#3B5BFF', accent2: '#16C2F0', hi: '#FFD54A', good: '#18B26B', bad: '#F0445B', card: '#FFFFFF', line: 'rgba(17,24,39,.08)' },
    v: { title: ['一段配音', '怎么变成[[动效片]]'], tag: 'AI 知识', sub: '3 分钟看懂整套流程', brand: { name: 'Motion Kit' } } },
  5: { name: '杂志拼贴', preset: 'paper', t: 2.9,
    theme: { bg: '#F3EAD8', bg2: '#E9DCC2', ink: '#221B14', sub: '#7D6C55', accent: '#E8442D', accent2: '#F2994A', hi: '#FEDD55', good: '#2F9E62', bad: '#C2412D', card: '#FFFBF2', line: 'rgba(34,27,20,.10)' },
    v: { title: ['以前 vs 现在', '做动效差在[[哪]]'], tag: '对比', sub: '同一支片子的两种做法', brand: { name: 'Studio Note' } } },
  6: { name: '弧形作品墙', preset: 'night', t: 2.4,
    theme: { bg: '#05060C', bg2: '#0B0E1F', ink: '#FFFFFF', sub: '#9AA0B8', accent: '#5B7CFF', accent2: '#B26BFF', hi: '#FFD54A', bad: '#FF4D6D', card: '#11152A', line: 'rgba(160,170,255,.14)' },
    v: { title: ['一整面墙', '的[[作品]]转起来'], tag: '3D 场景', sub: 'CSS 3D · 逐帧确定性渲染', brand: { name: 'Gallery' } } },
  7: { name: '终端教程', preset: 'tech', t: 3.6,
    theme: { bg: '#0B0F17', bg2: '#111827', ink: '#E5E7EB', sub: '#94A3B8', accent: '#22C55E', accent2: '#38BDF8', hi: '#FDE047', bad: '#F87171', card: '#111827', line: 'rgba(148,163,184,.16)' },
    v: { title: ['三条命令', '装好[[动效技能]]'], tag: '教程', sub: 'Claude Code · 本地运行', brand: { name: 'Dev Tips' } } },
  8: { name: '产品对话', preset: 'clean', t: 3.0,
    theme: { bg: '#FFF7F0', bg2: '#FDEBDD', ink: '#1F1A17', sub: '#7A6A5E', accent: '#FF6B2C', accent2: '#FFB347', hi: '#FFE066', good: '#22A06B', bad: '#E5484D', card: '#FFFFFF', line: 'rgba(31,26,23,.08)' },
    v: { title: ['跟 AI 说一句', '它就[[帮你订好]]'], tag: '案例分享', sub: '虚构对话 · 仅作效果演示', brand: { name: 'Agent Story' } } },
  9: { name: '数据看板', preset: 'clean', t: 3.0,
    theme: { bg: '#F4FBF7', bg2: '#E2F4EA', ink: '#0F1F17', sub: '#557064', accent: '#10B981', accent2: '#0EA5E9', hi: '#FDE047', good: '#10B981', bad: '#F43F5E', card: '#FFFFFF', line: 'rgba(15,31,23,.08)' },
    v: { title: ['做一支片子', '能[[省下]]多少时间'], tag: '数据', sub: '示意数据 · 仅作效果演示', brand: { name: 'Data Bite' } } },
  10: { name: '分层结构', preset: 'tech', t: 3.1,
    theme: { bg: '#0A0820', bg2: '#140F33', ink: '#F5F3FF', sub: '#A5A1C9', accent: '#8B5CF6', accent2: '#EC4899', hi: '#FDE047', bad: '#F43F5E', card: '#1B1540', line: 'rgba(170,150,255,.15)' },
    v: { title: ['一支动效片', '由[[五层]]搭起来'], tag: 'AI 知识', sub: '从配音到成片的技术栈', brand: { name: 'Stack Lab' } } },
  11: { name: '片尾引导', shell: 'porcelain', t: 2.6,
    theme: { bg: '#F7F5EF', bg2: '#EEEADF', ink: '#14171A', sub: '#6E7378', accent: '#0F766E', accent2: '#14B8A6', hi: '#FDE68A', bad: '#E8442D', card: '#FFFFFF', line: 'rgba(20,23,26,.08)' },
    v: { title: ['看到最后的', '都是[[懂行]]的人'], tag: '片尾', sub: '收藏 · 关注 · 评论区置顶', url: 'YOUR-CHANNEL', brand: { name: 'Your Channel' } } },
  12: { name: '极光时间线', preset: 'night', t: 3.4,
    theme: { bg: '#04121A', bg2: '#06202B', ink: '#ECFEFF', sub: '#8FB5BF', accent: '#06B6D4', accent2: '#A3E635', hi: '#FDE047', bad: '#FB7185', card: '#0B2A36', line: 'rgba(120,220,240,.14)' },
    v: { title: ['一支片子', '是怎么[[诞生]]的'], tag: '幕后', sub: '配音 → 听写 → 分镜 → 渲染', brand: { name: 'Behind' } } },
};
const S = SHOWS[N];
window.THEME = S.theme;
window.CONFIG = { duration: 6, grain: .05, preload: [], sprites: {}, creator: { name: 'Your Channel', avatar: 'Y' }, vertical: Object.assign({ preset: S.preset }, S.v) };
window.IMPACTS = [0.0];
