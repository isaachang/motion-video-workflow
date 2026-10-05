# 封面导出：python3 tools/cover_shot.py → cover_34.png(1080×1440@2x) cover_43.png(1440×1080@2x)
import asyncio, os
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--allow-file-access-from-files','--force-color-profile=srgb'])
        for r,(w,h) in {'34':(1080,1440),'43':(1440,1080)}.items():
            pg=await b.new_page(viewport={'width':w,'height':h},device_scale_factor=2)
            await pg.goto('file://'+os.path.abspath('cover.html')+'#'+r); await pg.wait_for_function('window.COVER_READY'); await pg.wait_for_timeout(400)
            await pg.locator('#c').screenshot(path=f'cover_{r}.png')
        await b.close()
asyncio.run(main())
