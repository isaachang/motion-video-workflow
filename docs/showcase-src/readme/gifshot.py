import asyncio, os, sys, subprocess
from playwright.async_api import async_playwright
mode, T, out, W = sys.argv[1], float(sys.argv[2]), sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 360
FPS = 15
async def main():
    os.makedirs('fr', exist_ok=True); [os.remove('fr/' + f) for f in os.listdir('fr')]
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--allow-file-access-from-files', '--force-color-profile=srgb'])
        pg = await b.new_page(viewport={'width': 1080, 'height': 1080})
        await pg.goto('file://' + os.path.abspath('square.html') + '#' + mode); await pg.wait_for_function('window.READY'); await pg.evaluate('window.READY')
        n = int(T * FPS)
        for i in range(n):
            await pg.evaluate(f'seek({i / FPS})'); await pg.screenshot(path=f'fr/{i:04d}.jpg', type='jpeg', quality=92)
        await b.close()
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-framerate', str(FPS), '-i', 'fr/%04d.jpg', '-vf', f'scale={W}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle', out])
    print(out, os.path.getsize(out))
asyncio.run(main())
