# 逐字听写（离线 SenseVoice + silero VAD）：python3 tools/asr.py vo16k.wav
# 输出 asr.json（每句 start/end/text + 每个字的时间戳）和 asr.js（页面里 say() 用），并打印分句。模型由 tools/setup.sh 下载到 models/。
import sys, json, sherpa_onnx, soundfile as sf
M='models/sense-voice/'; WAV=sys.argv[1] if len(sys.argv)>1 else 'vo16k.wav'
rec=sherpa_onnx.OfflineRecognizer.from_sense_voice(model=M+'model.int8.onnx',tokens=M+'tokens.txt',use_itn=True,language='auto',num_threads=2)
x,sr=sf.read(WAV,dtype='float32')
cfg=sherpa_onnx.VadModelConfig(); cfg.silero_vad.model='models/vad.onnx'; cfg.silero_vad.min_silence_duration=0.25; cfg.silero_vad.threshold=0.4; cfg.silero_vad.max_speech_duration=8; cfg.sample_rate=sr
vad=sherpa_onnx.VoiceActivityDetector(cfg,buffer_size_in_seconds=600); out=[]
def drain():
    while not vad.empty():
        seg=vad.front; st=seg.start/sr; s=rec.create_stream(); s.accept_waveform(sr,seg.samples); rec.decode_stream(s); r=s.result
        out.append(dict(start=round(st,2),end=round(st+len(seg.samples)/sr,2),text=r.text,tokens=r.tokens,ts=[round(st+t,2) for t in r.timestamps])); vad.pop()
for i in range(0,len(x),512): vad.accept_waveform(x[i:i+512]); drain()
vad.flush(); drain()
for o in out: print(f"{o['start']:6.2f}-{o['end']:6.2f}  {o['text']}")
json.dump(out,open('asr.json','w'),ensure_ascii=False,indent=1)
open('asr.js','w').write('window.ASR='+json.dumps([dict(tokens=o['tokens'],ts=o['ts']) for o in out],ensure_ascii=False)+';\n')  # 给页面里的 say() 用
