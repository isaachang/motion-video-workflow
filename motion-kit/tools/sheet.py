# 关键帧总览拼图：python3 tools/sheet.py pvv output/关键帧总览.jpg [列数=4] [格宽=360]
# 每格下面标时间；pvv/labels.txt 里写「时间<Tab>口播」就会一起标上（按格宽自动换行，最多 3 行）。
# 先用 preview.py 抽帧（每个镜头一帧），再运行本工具。
import sys, glob, os
from PIL import Image, ImageDraw, ImageFont
d, out = sys.argv[1], sys.argv[2]; cols = int(sys.argv[3]) if len(sys.argv) > 3 else 4; w = int(sys.argv[4]) if len(sys.argv) > 4 else 360
labels = {}
if os.path.exists(d + '/labels.txt'):
    for ln in open(d + '/labels.txt', encoding='utf-8'):
        if '\t' in ln: k, v = ln.rstrip('\n').split('\t', 1); labels[float(k)] = v
fs = sorted(glob.glob(d + '/f_*.jpg'))
ims = [Image.open(f).convert('RGB') for f in fs]; h = int(w * ims[0].height / ims[0].width); lab = 96
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (w + 16) + 16, rows * (h + lab + 16) + 16), '#ffffff')
FONTS = ['a/fonts/NotoSansSC.ttf', '/System/Library/Fonts/PingFang.ttc', '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc']
font = next((ImageFont.truetype(f, 22) for f in FONTS if os.path.exists(f)), ImageFont.load_default())
dr = ImageDraw.Draw(sheet)
for i, (f, im) in enumerate(zip(fs, ims)):
    x = 16 + (i % cols) * (w + 16); y = 16 + (i // cols) * (h + lab + 16)
    sheet.paste(im.resize((w, h)), (x, y))
    t = float(os.path.basename(f)[2:-4]); txt = f'{t:.1f}s  ' + labels.get(t, '')
    lines, cur = [], ''
    for ch in txt:
        if font.getlength(cur + ch) > w - 4: lines.append(cur); cur = ''
        cur += ch
    lines.append(cur)
    for k, ln in enumerate(lines[:3]): dr.text((x, y + h + 6 + k * 28), ln, fill='#1A1530' if k == 0 else '#6E6787', font=font)
sheet.save(out, quality=86); print(out, sheet.size)
