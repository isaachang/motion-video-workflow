#!/bin/bash
# 配音 + 背景音乐混音：bash tools/mix.sh vo.(mp3|wav) bgm.(mp3|wav) DUR [BGM_DB=-16]
# 说话时自动压低音乐（sidechain），整体响度 -14 LUFS；结尾音乐 1s 淡出。
# 同时导出 vo16k.wav（听写用，纯人声）。
VO=$1; BGM=$2; DUR=$3; G=${4:--16}
ffmpeg -y -loglevel error -i "$VO" -ac 1 -ar 16000 vo16k.wav
ffmpeg -y -loglevel error -i "$VO" -stream_loop -1 -i "$BGM" -filter_complex "\
[0:a]aformat=channel_layouts=stereo,aresample=48000,apad=whole_dur=$DUR,asplit=2[vo][sc];\
[1:a]aformat=channel_layouts=stereo,aresample=48000,atrim=0:$DUR,volume=${G}dB,afade=t=out:st=$(python3 -c "print($DUR-1.2)"):d=1.2[bg];\
[bg][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350[duck];\
[vo][duck]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.0:LRA=11" -ar 48000 mix.wav
ffprobe -v error -show_entries format=duration -of csv=p=0 mix.wav
