# 白底（或纯色底）视频 / 图片序列抠成透明 PNG 序列：
#   python3 tools/key_video.py 官方动画.mp4 a/morph [--scale 1.4] [--from 0] [--to 112] [--hole 1500]
# 输出 a/morph/001.png、002.png…（CONFIG.sprites 直接能读：{ morph: { dir: 'morph', n: 帧数 } }）
# 做法：取四边像素中位数当底色，和底色的距离映射成 alpha；只抠和画面边缘连通的底色，
# 所以角色身上的白色（眼白、高光）不会被抠掉；封闭的大块底色（比如字母 o 的孔，面积 > --hole 像素）也当底色抠掉。
# 最后去掉底色残留（反预乘）并把边缘收紧 1px，避免浅色描边。
import sys, os, glob, subprocess, tempfile
import cv2, numpy as np
a = sys.argv[1:]
if len(a) < 2: sys.exit(__doc__ or '用法见文件头')
SRC, DST = a[0], a[1]
opt = lambda k, d: type(d)(a[a.index(k) + 1]) if k in a else d
SCALE, F0, F1, HOLE = opt('--scale', 1.0), opt('--from', 0), opt('--to', 10 ** 9), opt('--hole', 1500)
os.makedirs(DST, exist_ok=True)
if os.path.isdir(SRC): fs = sorted(glob.glob(SRC + '/*.png'))
else:
    tmp = tempfile.mkdtemp(); subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, f'{tmp}/%04d.png'], check=True); fs = sorted(glob.glob(tmp + '/*.png'))
fs = fs[F0:F1 + 1]; bgc = None; k3 = np.ones((3, 3), np.uint8)
for i, f in enumerate(fs):
    im = cv2.imread(f).astype(np.float32)
    if bgc is None: bgc = np.median(np.concatenate([im[:4].reshape(-1, 3), im[-4:].reshape(-1, 3), im[:, :4].reshape(-1, 3), im[:, -4:].reshape(-1, 3)]), 0); print('底色', bgc)
    d = np.abs(im - bgc).max(2); lo, hi = 6, 38
    al = np.clip((d - lo) / (hi - lo), 0, 1)
    n, lab = cv2.connectedComponents((d < hi).astype(np.uint8), connectivity=4)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    areas = np.bincount(lab.ravel()); big = {k for k in range(1, n) if areas[k] > HOLE}
    alpha = np.where(np.isin(lab, list(border | big)), al, 1.0)
    A_ = np.maximum(alpha, 1e-3)[..., None]
    col = np.clip((im - bgc * (1 - A_)) / A_, 0, 255)
    alpha = np.minimum(alpha ** 1.5, cv2.erode(alpha.astype(np.float32), k3))
    out = np.dstack([col, alpha[..., None] * 255]).astype(np.uint8)
    if SCALE != 1: out = cv2.resize(out, None, fx=SCALE, fy=SCALE, interpolation=cv2.INTER_LANCZOS4)
    cv2.imwrite(f'{DST}/{i + 1:03d}.png', out)
print('帧数', len(fs), '→', DST)
