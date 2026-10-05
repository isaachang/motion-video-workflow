# motion-kit · 口播动效视频通用模板

输入：配音 + 背景音乐。输出：16:9 和 9:16 两版成片，外加 3:4 和 4:3 两张封面。
画面全部用代码生成：HTML、CSS 3D 和 Canvas 画出每一帧，再逐帧截图、合成成片。可以任意跳到某一秒重画，渲染结果每次都一样。

## 目录
| 路径 | 作用 |
|---|---|
| `config.js` | **每支片改这里**：主题色、时长、预载素材、竖版装饰带、封面文案 |
| `scenes.js` | **每支片重写**：按分镜逐段写 Scene（现在是组件演示） |
| `beats.js` | 节拍，由 `tools/beats.py` 生成 |
| `index.html` / `vertical.html` / `cover.html` | 16:9 舞台 / 9:16 外壳（`VMODE`）/ 封面（`#34` `#43`） |
| `engine/core.js` | 时间轴、缓动、弹簧、镜头 camKeys/applyCam/drift/shake、闪白、色散、彩屑、颗粒、`rectOf` |
| `engine/fx.js` | 转场：StrokeWipe 笔刷 / BarsWipe 色条 / Iris 光圈；clipCircle、clipRect、zoomThrough、whip、kickScale |
| `engine/kit.css` | 基础样式，颜色全部用主题变量 |
| `packs/explainer.js` | 知识讲解：KineticText、KeyWord、FlowChain、Compare、Timeline、BigStat、BarChart、Layers、Callout、Pill、Bg、IC 图标 |
| `packs/news.js` | 资讯：NewsCard、PostCard、Ticker、Ranking |
| `packs/tutorial.js` | 教程：Win 窗口、Cursor 光标点击、Spotlight、StepBadge、CodeBlock、Terminal、typeInto |
| `packs/product-ui.js` | 产品案例：Phone 聊天（逐条推近）、Notice 推送、msgCenter |
| `packs/vertical.js` | 竖版专用：VShot / vcam / vEnter（1080×1080 本地坐标）；强调类 Stamp、Seal、Chars、StatBox、Toast、Keycap、Burst、countTo |
| `packs/web.js` | 真实网页：WebShot（浏览器加长图滚动，`at()` 把截图坐标换算成画面坐标）、WebMark（在截图上框选）、WebCrop（只露出截图的一块）、ClipPlayer（逐帧播放视频素材） |
| `packs/transition.js` | 运镜转场（镜头跨切点连续）：pushThrough 推进穿越、pullOut 拉远揭示、whipPan 甩镜衔接、shapeMatch 形状匹配、foregroundWipe 前景遮挡、focusPull 景深转换；每个镜头是一层 `Layer(R)`，转场区间里前后两层共用同一条缓动曲线 |
| `packs/outro.js` | 片尾：FavButton 收藏、FollowCard 关注、CommentPin 评论区置顶（作者信息写在 `CONFIG.creator`） |
| `asr.js` | 由 `tools/asr.py` 生成；页面里 `say('词')` 返回这个词在配音里的时间 |
| `shell/vframe.js` | 9:16 上下装饰带，preset 可选 night、tech、clean、paper |
| `tools/` | setup、mix、asr、beats、make_bgm（没有音乐时自动合成配乐）、preview、render、segs、finish、cover_shot |
| `examples/muse/` | 第一支片的完整源码，只作参考 |

## 组件约定
- 每个组件都是 `工厂(parent, …, {t0, t1, x, y, …}) → { el, upd(t) }`。时间点在创建组件时给定，场景里写 `sc.upd = t => { a.upd(t); b.upd(t) }`。
- 坐标统一用 1920×1080 的舞台坐标。竖版只能看到 x 从 420 到 1500 的部分（`SAFE`），关键内容必须放在这个范围里；放不下就在 `VMODE` 分支里改坐标，或者用镜头左右摇。
- 文字里用 `[[关键词]]` 标出强调色，再配荧光笔扫过；`{{ }}` 是黄色高亮（竖版标题和封面支持）。

## 常用命令（都在项目根目录运行）
```bash
bash tools/setup.sh                                # 新会话装依赖、下模型
bash tools/mix.sh vo.mp3 bgm.mp3 62.5              # 生成 mix.wav 和 vo16k.wav
python3 tools/asr.py vo16k.wav                     # 生成 asr.json（逐字时间）
python3 tools/when.py 4万 收藏                       # 查某个词在口播里第几秒（页面里用 say('4万')）
python3 tools/capture.py https://x.com 名称 --sel 'textarea' 输入框   # 抓网页 2x 截图到 a/web/
python3 tools/beats.py bgm.mp3                     # 生成 beats.js
python3 tools/make_bgm.py --dur 56.8 --impacts 6,21 --brk 38,44.5  # 没有音乐时：合成 bgm.wav + 精确 beats.js
python3 tools/preview.py 1,5.5,12 [--v]            # 抽帧预览，生成 pv/ 或 pvv/
nohup bash tools/segs.sh 62.5 > segs.log 2>&1 &    # 16:9 分段并行渲染
nohup bash tools/segs.sh 62.5 --v > segs_v.log 2>&1 &
bash tools/finish.sh mix.wav out_16x9.mp4          # 合并、加音频、压成 HEVC
bash tools/finish.sh mix.wav out_9x16.mp4 --v
python3 tools/cover_shot.py                        # 生成 cover_34.png 和 cover_43.png
```
