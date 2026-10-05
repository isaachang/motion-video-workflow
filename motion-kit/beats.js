// 由 tools/beats.py 生成；演示用 120 BPM
window.BEATS = Array.from({length: 80}, (_, i) => +(i * 0.5).toFixed(2));
window.KICKS = window.BEATS.filter((_, i) => i % 2 === 0);
