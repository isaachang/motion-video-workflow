import asyncio, os, sys
from playwright.async_api import async_playwright
ids = [int(x) for x in sys.argv[1].split(',')] if len(sys.argv) > 1 else range(1, 13)
os.makedirs('out', exist_ok=True)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--allow-file-access-from-files', '--force-color-profile=srgb', '--font-render-hinting=none'])
        for n in ids:
            pg = await b.new_page(viewport={'width': 1080, 'height': 1920}); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
            await pg.goto('file://' + os.path.abspath('show.html') + f'#{n}'); await pg.wait_for_function('window.READY', timeout=60000); await pg.evaluate('window.READY')
            t = await pg.evaluate('S.t'); await pg.evaluate(f'seek({t})'); await pg.wait_for_timeout(150)
            await pg.screenshot(path=f'out/{n:02d}.png'); print(n, 'ok', errs[:3]); await pg.close()
        await b.close()
asyncio.run(main())
