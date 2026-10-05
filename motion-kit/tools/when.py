# 查口播里某个词出现的时间：python3 tools/when.py 4万 收藏 "Opus 5.5"
# 和页面里的 say() 用同一套匹配规则（按听写原文，忽略空格和大小写）
import sys, json
cs, ts = [], []
for s in json.load(open('asr.json')):
    for tk, t in zip(s['tokens'], s['ts']):
        for ch in ''.join(str(tk).split()): cs.append(ch.lower()); ts.append(t)
txt = ''.join(cs)
for w in sys.argv[1:]:
    q = ''.join(w.split()).lower(); i = txt.find(q); hits = []
    while i >= 0: hits.append(f"{ts[i]:.2f}–{ts[i + len(q) - 1]:.2f}"); i = txt.find(q, i + 1)
    print(f"{w}: {'  '.join(hits) if hits else '找不到（听写可能有错字，换相邻的字查）'}")
