# 逐帧渲染一段：python3 tools/render.py FPS T0 T1 OUT.mp4 [--v] [--nomb]
# 运动模糊：MB 区间内每帧取 mbSamples(t)（≤8）个子帧平均；快速甩镜要 8，普通转场 3–4，快门 0.5 帧。
import sys, asyncio, time, subprocess, io, os
import numpy as np
from PIL import Image
from playwright.async_api import async_playwright
a=[x for x in sys.argv[1:] if not x.startswith('--')]
FPS=float(a[0]); T0=float(a[1]); T1=float(a[2]); OUT=a[3]
V='--v' in sys.argv; MBON='--nomb' not in sys.argv; SHUTTER=0.5
page='vertical.html' if V else 'index.html'; vw,vh=(1080,1920) if V else (1920,1080)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--allow-file-access-from-files','--disable-web-security','--font-render-hinting=none','--force-color-profile=srgb','--disable-gpu-vsync'])
        pg=await b.new_page(viewport={'width':vw,'height':vh}); errs=[]
        pg.on('pageerror',lambda e: errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath(page)); await pg.wait_for_function('window.READY',timeout=120000); await pg.evaluate('window.READY')
        n0=int(round(T0*FPS)); n1=int(round(T1*FPS))
        ff=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','image2pipe','-framerate',str(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','14','-pix_fmt','yuv420p','-r',str(FPS),OUT],stdin=subprocess.PIPE)
        st=time.time()
        for n in range(n0,n1):
            t=n/FPS
            k=min(8,await pg.evaluate(f'mbSamples({t})')) if MBON else 1
            if k<=1:
                await pg.evaluate(f'seek({t})'); buf=await pg.screenshot(type='jpeg',quality=95)
            else:
                acc=None
                for i in range(k):
                    await pg.evaluate(f'seek({t+((i+0.5)/k-0.5)*SHUTTER/FPS})')
                    im=np.asarray(Image.open(io.BytesIO(await pg.screenshot(type='jpeg',quality=96))).convert('RGB'),dtype=np.float32)
                    acc=im if acc is None else acc+im
                bb=io.BytesIO(); Image.fromarray(np.clip(acc/k+0.5,0,255).astype(np.uint8)).save(bb,'JPEG',quality=95); buf=bb.getvalue()
            ff.stdin.write(buf)
            if (n-n0)%120==0: print(f'{t:.2f}s {(time.time()-st)/(n-n0+1):.3f}s/frame',flush=True)
        ff.stdin.close(); ff.wait(); print('done',round(time.time()-st),'s errors',errs[:5]); await b.close()
asyncio.run(main())
