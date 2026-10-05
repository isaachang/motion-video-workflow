#!/bin/bash
# 分段并行渲染整片：bash tools/segs.sh DUR [--v] [JOBS=2]
# 输出 segs/（或 segs_v/）里的 seg_XX.mp4 + concat.txt；用 nohup 后台跑，完成会写 ALLDONE。
DUR=$1; V=$2; J=${3:-2}; [ "$V" = "--v" ] && D=segs_v || { D=segs; V=""; }
mkdir -p $D; N=$(python3 -c "import math;print(max(2,math.ceil($DUR/5.5)))")
python3 - "$DUR" "$N" > $D/bounds.txt <<'P'
import sys; d=float(sys.argv[1]); n=int(sys.argv[2]); print(' '.join(f'{d*i/n:.3f}' for i in range(n+1)))
P
read -a B < $D/bounds.txt; : > $D/concat.txt
for ((i=0;i<N;i++)); do echo "file 'seg_$(printf %02d $i).mp4'" >> $D/concat.txt; done
run(){ i=$1; python3 tools/render.py 60 ${B[$i]} ${B[$((i+1))]} $D/seg_$(printf %02d $i).mp4 $V > $D/log_$(printf %02d $i).txt 2>&1; }
for ((i=0;i<N;i+=J)); do for ((j=0;j<J && i+j<N;j++)); do run $((i+j)) & done; wait; done
echo ALLDONE > $D/ALLDONE
