import asyncio, os
from playwright.async_api import async_playwright
SEQ = [(6, .6, 2.6), (1, 0, 2.2), (5, 0, 2.4), (11, 0, 2.4), (2, 0, 2.2)]
FPS = 15
os.makedirs('reel', exist_ok=True)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--allow-file-access-from-files', '--force-color-profile=srgb'])
        k = 0
        for n, a, z in SEQ:
            pg = await b.new_page(viewport={'width': 1080, 'height': 1920})
            await pg.goto('file://' + os.path.abspath('show.html') + f'#{n}'); await pg.wait_for_function('window.READY', timeout=60000); await pg.evaluate('window.READY')
            t = a
            while t < z:
                await pg.evaluate(f'seek({t})'); await pg.screenshot(path=f'reel/{k:04d}.jpg', type='jpeg', quality=90); k += 1; t += 1 / FPS
            await pg.close()
        await b.close(); print('frames', k)
asyncio.run(main())
