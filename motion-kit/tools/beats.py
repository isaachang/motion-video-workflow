# 音乐节拍：python3 tools/beats.py bgm.mp3 → beats.json + beats.js（BEATS 拍点 / KICKS 低频重拍）
import sys, json, librosa, numpy as np
y,sr=librosa.load(sys.argv[1],sr=22050,mono=True)
tempo,beats=librosa.beat.beat_track(y=y,sr=sr,units='time')
S=np.abs(librosa.stft(y,n_fft=2048,hop_length=512)); f=librosa.fft_frequencies(sr=sr,n_fft=2048)
low=S[f<120].sum(0); tt=librosa.frames_to_time(np.arange(S.shape[1]),sr=sr,hop_length=512)
pk=librosa.util.peak_pick(low/low.max(),pre_max=5,post_max=5,pre_avg=10,post_avg=10,delta=0.08,wait=8)
T=float(np.atleast_1d(tempo)[0]); B=[round(float(b),2) for b in beats]; K=[round(float(k),2) for k in tt[pk]]
print('tempo',round(T,1),'beats',len(B),'kicks',len(K))
json.dump(dict(tempo=T,beats=B,kicks=K),open('beats.json','w'))
open('beats.js','w').write(f'window.BEATS={json.dumps(B)};\nwindow.KICKS={json.dumps(K)};\nwindow.TEMPO={T:.1f};\n')
