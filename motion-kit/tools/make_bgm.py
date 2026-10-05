# 自动合成配乐（没有背景音乐时的备选；效果最好的还是用户自己挑的音乐）
# python3 tools/make_bgm.py --dur 56.8 [--bpm 120] [--impacts 6,21,44.5] [--brk 38,44.5] [--end 53.5]
#   --dur      配乐时长（= 成片时长 + 0.2）
#   --impacts  冲击音时刻（段落切换处，按听写时间取、吸附到拍点）
#   --brk      痛点段：去鼓 + 低通，结束处自动接一个冲击回归（可省略）
#   --end      收尾和弦开始时刻（默认 dur-3）
# 输出 bgm.wav（-1dB 峰值）+ beats.js（精确拍点 BEATS / 重拍 KICKS / 冲击 IMPACTS）
import argparse, json
import numpy as np, soundfile as sf
from scipy.signal import fftconvolve, butter, sosfilt

ap = argparse.ArgumentParser()
ap.add_argument('--dur', type=float, required=True); ap.add_argument('--bpm', type=float, default=120)
ap.add_argument('--impacts', default=''); ap.add_argument('--brk', default=''); ap.add_argument('--end', type=float)
ap.add_argument('--seed', type=int, default=7)
A_ = ap.parse_args()
SR = 48000; BPM = A_.bpm; BEAT = 60 / BPM; DUR = A_.dur
N = int(SR * DUR); rng = np.random.default_rng(A_.seed)
L = np.zeros(N); R = np.zeros(N)
IMPACTS = [float(x) for x in A_.impacts.split(',') if x]
BREAK0, DROP = ([float(x) for x in A_.brk.split(',')] if A_.brk else [1e9, 1e9])
if A_.brk and DROP not in IMPACTS: IMPACTS.append(DROP)
END = A_.end if A_.end is not None else round((DUR - 3) / BEAT) * BEAT
FIRST = min(IMPACTS) if IMPACTS else 4 * BEAT * 4

def mtof(m): return 440 * 2 ** ((m - 69) / 12)
def env_adsr(n, a, d, s, r, sus_len):
    a, d, r = int(a * SR), int(d * SR), int(r * SR); sl = max(0, n - a - d - r)
    e = np.concatenate([np.linspace(0, 1, max(a, 1)), np.linspace(1, s, max(d, 1)), np.full(sl, s), np.linspace(s, 0, max(r, 1))])
    return e[:n] if len(e) >= n else np.pad(e, (0, n - len(e)))
def saw(f, t, nh=None):
    nh = nh or max(1, int(SR / 2 / f * .8)); out = np.zeros_like(t)
    for k in range(1, min(nh, 40) + 1): out += np.sin(2 * np.pi * f * k * t) / k
    return out * .6
def lp(x, fc, order=2): return sosfilt(butter(order, fc, 'low', fs=SR, output='sos'), x)
def hp(x, fc, order=2): return sosfilt(butter(order, fc, 'high', fs=SR, output='sos'), x)
def add(buf, x, t0, gain=1.0):
    i = int(t0 * SR); j = min(N, i + len(x))
    if j > i: buf[i:j] += x[:j - i] * gain
def addst(x, t0, g=1.0, pan=0.0):
    add(L, x, t0, g * np.sqrt((1 - pan) / 2) * 1.414); add(R, x, t0, g * np.sqrt((1 + pan) / 2) * 1.414)

def in_break(t): return BREAK0 <= t < DROP
SECOND = sorted(IMPACTS)[1] if len(IMPACTS) > 1 else FIRST
def energy(t):
    if t < FIRST: return .7
    if in_break(t): return .4
    if t >= END: return .5
    if t >= DROP: return 1.05
    if t < SECOND: return .85
    return 1.0

# 和弦（每 2 小节 = 4s 换一次）：Fmaj9 → Am7 → Dm9 → Bbmaj7(#11)
CH = [[53, 57, 60, 64, 67], [57, 60, 64, 67, 71], [50, 57, 60, 64, 65], [46, 53, 57, 62, 64]]
ROOT = [41, 45, 38, 46]
def chord_at(t): return int(t // 4) % 4

# --- 铺底 pad：失谐锯齿 + 低通 ---
for c in range(int(DUR // 4) + 1):
    t0 = c * 4; ln = 4.2 if t0 < END else DUR - t0 + .5
    if t0 >= DUR: break
    n = int(ln * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for m in CH[c % 4]:
        for det in (-.07, .07): x += saw(mtof(m + det), t, 12)
    fc = 900 if in_break(t0) else 1800
    x = lp(x, fc) * env_adsr(n, .6, .5, .8, 1.2, n) * .05
    if t0 >= END: x = lp(x, 700) * 1.4
    addst(x, t0, 1, -.3); addst(np.roll(x, 300), t0, 1, .3)

# --- 鼓 ---
def kick():
    n = int(.45 * SR); t = np.arange(n) / SR
    f = 48 + 110 * np.exp(-t * 28); ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-t * 7.5) + .25 * np.exp(-t * 300) * rng.standard_normal(n) * .3) * .9
def hat(open_=False):
    n = int((.22 if open_ else .05) * SR); x = hp(rng.standard_normal(n), 7000, 4)
    return x * np.exp(-np.arange(n) / SR * (14 if open_ else 70)) * .16
def clap():
    n = int(.25 * SR); x = sosfilt(butter(2, [900, 3200], 'band', fs=SR, output='sos'), rng.standard_normal(n))
    e = np.zeros(n)
    for o in (0, .011, .023): i = int(o * SR); e[i:] += np.exp(-np.arange(n - i) / SR * 26)
    return x * e * .22
K, HC, HO, CL = kick(), hat(), hat(True), clap()
b = 0
while b * BEAT < END + .01:
    t = b * BEAT; e = energy(t)
    if not in_break(t) and t >= .0:
        addst(K, t, .9 * min(1, e + .1))
        if b % 2 == 1 and t >= FIRST: addst(CL, t, .8 * e, .1)
    if not in_break(t):
        addst(HC, t + BEAT / 2, e, .35)
        if t >= SECOND and b % 4 == 3: addst(HO, t + BEAT / 2, .8 * e, -.25)
        if t >= FIRST: addst(HC, t + BEAT * .75, .45 * e, -.4)
    b += 1
addst(K, END, 1.0)

# --- 贝斯：根音 8 分 + 侧链感 ---
for i in range(int(END / (BEAT / 2))):
    t = i * BEAT / 2
    if t < FIRST or in_break(t): continue
    m = ROOT[chord_at(t)] - 12 + (12 if i % 4 == 3 else 0)
    n = int(BEAT / 2 * SR); tt = np.arange(n) / SR
    x = lp(saw(mtof(m), tt, 10), 420) + .6 * np.sin(2 * np.pi * mtof(m) * tt)
    duck = np.clip((tt / (BEAT / 2)) ** .6, .15, 1) if i % 2 == 0 else 1
    addst(x * env_adsr(n, .005, .08, .7, .05, n) * duck * .22 * energy(t), t)

# --- 琶音 pluck（16 分，2 拍一组）---
for i in range(int(END / (BEAT / 4))):
    t = i * BEAT / 4
    if t < FIRST: continue
    ch = CH[chord_at(t)]; pat = [0, 2, 4, 2, 1, 3, 4, 3]
    m = ch[pat[i % 8]] + 12
    n = int(.32 * SR); tt = np.arange(n) / SR
    x = saw(mtof(m), tt, 14); x = lp(x, 2600 if not in_break(t) else 1100) * np.exp(-tt * 13)
    g = (.05 if t < SECOND else .065) * (0.6 if in_break(t) else 1)
    addst(x, t, g, .5 if i % 2 else -.5)

# --- 冲击 / 上升音 ---
def impact():
    n = int(2.4 * SR); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * (38 + 60 * np.exp(-t * 9)) * t) * np.exp(-t * 2.2)
    air = lp(rng.standard_normal(n), 5000) * np.exp(-t * 3.5) * .35
    return (boom + air) * .7
def riser(ln):
    n = int(ln * SR); t = np.arange(n) / SR; k = t / ln
    x = rng.standard_normal(n); out = np.zeros(n); seg = int(.05 * SR)
    for s in range(0, n, seg): out[s:s + seg] = lp(x[s:s + seg + 200], 400 + 9000 * k[s] ** 2)[:len(out[s:s + seg])]
    return out * k ** 2.2 * .25
IM = impact()
for t in IMPACTS:
    addst(IM, t, .9 if t != DROP else 1.1)
    addst(riser(2.0), t - 2.0, .8 if t != DROP else 1.0)
addst(IM, END, .9)

# 收尾长和弦
n = int((DUR - END) * SR); t = np.arange(n) / SR; x = np.zeros(n)
for m in [53, 60, 64, 67, 72]: x += np.sin(2 * np.pi * mtof(m) * t) * .5 + saw(mtof(m), t, 6) * .3
addst(lp(x, 2400) * np.exp(-t * .9) * .06, END)

# --- 混响 + 母带 ---
ir_n = int(2.2 * SR); ir = rng.standard_normal(ir_n) * np.exp(-np.arange(ir_n) / SR * 3.2); ir = lp(ir, 6000); ir /= np.abs(ir).sum() / 6
wetL = fftconvolve(L, ir)[:N]; wetR = fftconvolve(R, ir[::-1].copy())[:N]
L2 = L + .18 * wetL; R2 = R + .18 * wetR
mix = np.stack([L2, R2], 1)
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
fade = int(1.2 * SR); mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
mix *= .89 / np.abs(mix).max()
sf.write('bgm.wav', mix.astype(np.float32), SR)
B = [round(i * BEAT, 3) for i in range(int(DUR / BEAT) + 1)]
K = [b for b in B if b <= END and not in_break(b)]
open('beats.js', 'w').write(f'window.BEATS={json.dumps(B)};\nwindow.KICKS={json.dumps(K)};\nwindow.TEMPO={BPM};\nwindow.IMPACTS={json.dumps(sorted(IMPACTS + [END]))};\n')
print('bgm.wav', DUR, 's · beats.js', len(B), 'beats · impacts', sorted(IMPACTS + [END]))
