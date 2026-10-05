# 抓真实网页截图（2x）：python3 tools/capture.py URL 名称 [--sel 'CSS选择器' 元素名 ...] [--w 1440] [--h 900]
# 输出到 a/web/：
#   名称_top.png    首屏（视口大小）
#   名称_full.png   整页长图（先滚动一遍触发懒加载）
#   名称_els.json   页面上按钮 / 链接 / 标题的位置（截图像素坐标，已 ×2），给 WebMark / WebCrop 定位用
#   名称_元素名.png  --sel 指定的元素单独截图
# 会自动关掉 Cookie / 订阅 / 登录这类浮层（先点「拒绝 / 接受 / 关闭」，点不掉就直接从页面移除）。
# 抓图前告诉用户要抓哪些页面；需要登录的页面让用户先在浏览器里登录，或改用用户已登录的浏览器截图。
import asyncio, os, sys, json
from playwright.async_api import async_playwright

a = sys.argv[1:]
if len(a) < 2: sys.exit(__doc__ if __doc__ else '用法：python3 tools/capture.py URL 名称 [--sel 选择器 元素名 ...]')
URL, NAME = a[0], a[1]
VW = int(a[a.index('--w') + 1]) if '--w' in a else 1440
VH = int(a[a.index('--h') + 1]) if '--h' in a else 900
SELS = []
for i, x in enumerate(a):
    if x == '--sel': SELS.append((a[i + 1], a[i + 2]))
OUT = 'a/web'; DPR = 2
DISMISS = ['拒绝广告 Cookie', '拒绝所有', '全部拒绝', '仅必要', 'Reject all', 'Reject', 'Decline', '接受所有 Cookie', '全部接受', '同意', 'Accept all', 'Accept', 'Got it', '我知道了', '关闭', 'Close']
JS_STRIP = r'''() => { let n = 0; for (const e of [...document.querySelectorAll('body *')]) { const s = getComputedStyle(e);
  if ((s.position === 'fixed' || s.position === 'sticky') && /cookie|consent|订阅|subscribe|登录|sign in|隐私|privacy/i.test(e.innerText || '') && e.getBoundingClientRect().height < innerHeight * .9) { e.remove(); n++; } } return n; }'''
JS_ELS = r'''(dpr) => [...document.querySelectorAll('button,a,[role=button],[role=tab],h1,h2,h3,input,textarea,img')]
  .map(e => { const r = e.getBoundingClientRect(); return { tag: e.tagName, text: (e.innerText || e.alt || e.placeholder || '').trim().slice(0, 40),
    rect: [r.x * dpr, (r.y + scrollY) * dpr, r.width * dpr, r.height * dpr].map(Math.round), src: e.currentSrc || undefined }; })
  .filter(o => o.rect[2] > 4 && o.rect[3] > 4 && (o.text || o.src))'''

async def main():
    os.makedirs(OUT, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={'width': VW, 'height': VH}, device_scale_factor=DPR, locale='zh-CN')
        pg = await ctx.new_page()
        await pg.goto(URL, wait_until='networkidle', timeout=90000); await pg.wait_for_timeout(2000)
        for label in DISMISS:
            btn = pg.get_by_role('button', name=label, exact=True)
            if await btn.count():
                try: await btn.first.click(timeout=2000); await pg.wait_for_timeout(500); break
                except Exception: pass
        H = await pg.evaluate('document.body.scrollHeight')
        for y in range(0, H, 600): await pg.evaluate(f'window.scrollTo(0,{y})'); await pg.wait_for_timeout(180)
        await pg.evaluate('window.scrollTo(0,0)'); await pg.wait_for_timeout(1000)
        print('移除浮层', await pg.evaluate(JS_STRIP))
        await pg.screenshot(path=f'{OUT}/{NAME}_top.png')
        await pg.screenshot(path=f'{OUT}/{NAME}_full.png', full_page=True)
        json.dump(await pg.evaluate(JS_ELS, DPR), open(f'{OUT}/{NAME}_els.json', 'w'), ensure_ascii=False, indent=1)
        for sel, nm in SELS:
            try:
                loc = pg.locator(sel).first; await loc.scroll_into_view_if_needed(timeout=5000); await pg.wait_for_timeout(400)
                await loc.screenshot(path=f'{OUT}/{NAME}_{nm}.png'); print('元素', nm, 'ok')
            except Exception as e: print('元素', nm, '失败', str(e)[:100])
        print(NAME, await pg.title(), f'截图宽 {VW * DPR}px，整页高 {H * DPR}px')
        await b.close()

asyncio.run(main())
