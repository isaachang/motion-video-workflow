# 预览抽帧：python3 tools/preview.py 1.2,3.5,8 [--v] [--out pv]
# 在项目根目录运行；--v 预览 9:16（vertical.html）。会打印页面报错。
import sys, asyncio, os
from playwright.async_api import async_playwright
args=[a for a in sys.argv[1:] if not a.startswith('--')]
V='--v' in sys.argv
out=sys.argv[sys.argv.index('--out')+1] if '--out' in sys.argv else ('pvv' if V else 'pv')
if '--out' in sys.argv: args.remove(out)
times=[float(x) for x in args[0].split(',')]
os.makedirs(out,exist_ok=True)
page='vertical.html' if V else 'index.html'; vw,vh=(1080,1920) if V else (1920,1080)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--allow-file-access-from-files','--disable-web-security','--font-render-hinting=none','--force-color-profile=srgb'])
        pg=await b.new_page(viewport={'width':vw,'height':vh}); msgs=[]
        pg.on('console',lambda m: m.type in('error','warning') and msgs.append(m.text)); pg.on('pageerror',lambda e: msgs.append('ERR '+str(e)))
        await pg.goto('file://'+os.path.abspath(page)); await pg.wait_for_function('window.READY',timeout=120000); await pg.evaluate('window.READY')
        for t in times:
            await pg.evaluate(f'seek({t})'); await pg.screenshot(path=f'{out}/f_{t:06.2f}.jpg',type='jpeg',quality=80)
        for m in msgs[:30]: print('LOG',m)
        await b.close()
asyncio.run(main())
