#!/bin/bash
# 合并 + 混入成品音频 + 压成可发送的 HEVC：bash tools/finish.sh mix.wav OUT.mp4 [--v] [CRF=25]
# 体积目标：≤ 30MiB（聊天发送上限），电脑写入单文件 ≤ 20MB；超了就 CRF +1 重压。
A=$1; OUT=$2; [ "$3" = "--v" ] && D=segs_v || D=segs; CRF=${4:-25}
ffmpeg -y -loglevel error -f concat -safe 0 -i $D/concat.txt -c copy $D/video_only.mp4
ffmpeg -y -loglevel error -i $D/video_only.mp4 -i "$A" -map 0:v -map 1:a -c:v libx265 -preset medium -crf $CRF -tag:v hvc1 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
ls -la "$OUT"
