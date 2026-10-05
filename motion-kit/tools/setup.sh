#!/bin/bash
# 初始化（在项目根目录运行）。支持 macOS / Linux / WSL；Windows 请用 WSL 或 Git Bash。
PIP="python3 -m pip install -q"; $PIP sherpa-onnx soundfile librosa playwright numpy pillow 2>/dev/null || $PIP --break-system-packages sherpa-onnx soundfile librosa playwright numpy pillow
[ -n "$PLAYWRIGHT_BROWSERS_PATH" ] || python3 -m playwright install chromium
command -v ffmpeg >/dev/null || echo "!! 缺 ffmpeg：macOS 用 brew install ffmpeg，Ubuntu 用 sudo apt install ffmpeg"
mkdir -p models && cd models
if [ ! -f sense-voice/model.int8.onnx ]; then
  curl -sSL -o sv.tar.bz2 https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-sense-voice-zh-en-ja-ko-yue-2024-07-17.tar.bz2 && tar xjf sv.tar.bz2 && mv sherpa-onnx-sense-voice-zh-en-ja-ko-yue-2024-07-17 sense-voice && rm sv.tar.bz2
fi
[ -f vad.onnx ] || curl -sSL -o vad.onnx https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/silero_vad.onnx
ls -la sense-voice/model.int8.onnx vad.onnx; cd ..
if command -v fc-list >/dev/null; then fc-list | grep -qi "Noto Sans CJK" || echo "!! 缺中文字体 Noto Sans CJK SC（标题的超粗字重靠它）：macOS 用 brew install --cask font-noto-sans-cjk-sc，Ubuntu 用 sudo apt install fonts-noto-cjk fonts-noto-color-emoji"
else echo "提示：请确认已安装 Noto Sans CJK SC 字体（macOS：brew install --cask font-noto-sans-cjk-sc）"; fi
# 系统没有 Noto Sans CJK 时（macOS 默认就没有），下载开源思源黑体可变字重（OFL）到 a/fonts，kit.css 会自动兜底
if ! (command -v fc-list >/dev/null && fc-list | grep -qi "Noto Sans CJK") && [ ! -f a/fonts/NotoSansSC.ttf ]; then
  mkdir -p a/fonts && curl -sSL -o a/fonts/NotoSansSC.ttf "https://github.com/google/fonts/raw/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf" && echo "已下载 a/fonts/NotoSansSC.ttf"
fi
[ -f a/fonts/inter-latin-800-normal.woff2 ] || echo "!! a/fonts 里缺 Inter 字体，请从 skill 目录的 motion-kit/a/fonts 复制"
