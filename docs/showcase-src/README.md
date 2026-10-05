# 效果图源码

README 里的 12 张效果图、横幅和动图都由本仓库的 `motion-kit` 渲染，内容全部为代码生成的虚构示例。

复现方法：把这个文件夹里的文件复制到一份 `motion-kit` 副本的根目录（并确保 `a/fonts/NotoSansSC.ttf` 存在，`bash tools/setup.sh` 会自动下载），然后：

```bash
python3 shoot.py          # 12 张 → out/01.png … out/12.png（show.html#1 … #12）
python3 reel.py           # 动图逐帧 → reel/，再用 ffmpeg 转 GIF
```

`banner.html` 用 `out/` 里的图拼成横幅，用 Playwright 以 2x 截图即可。
