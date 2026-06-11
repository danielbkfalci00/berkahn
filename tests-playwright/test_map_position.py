from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})

    # First load - triggers compilation
    page.goto('http://localhost:3000/residencial', wait_until='load')
    page.wait_for_timeout(10000)

    # Reload to get fully compiled version
    page.reload(wait_until='networkidle')
    page.wait_for_timeout(5000)

    # Check if CSS is loaded by checking a styled element
    bg_check = page.evaluate('window.getComputedStyle(document.body).backgroundColor')
    print(f"Body background: {bg_check}")

    # Scroll to formulario
    page.evaluate('document.getElementById("formulario")?.scrollIntoView({behavior: "instant"})')
    page.wait_for_timeout(3000)

    # Screenshot viewport
    page.screenshot(path='map-viewport.png')
    print("Viewport screenshot saved")

    # Check maps
    maps = page.locator('img[alt*="Mapa do Brasil"]')
    count = maps.count()
    print(f"Found {count} maps")
    for i in range(count):
        m = maps.nth(i)
        box = m.bounding_box()
        vis = m.is_visible()
        print(f"  Map {i}: visible={vis}, box={box}")

    # Check dots
    dots = page.locator('.bg-blue-500')
    dot_count = dots.count()
    print(f"Found {dot_count} dots")
    for i in range(dot_count):
        d = dots.nth(i)
        box = d.bounding_box()
        vis = d.is_visible()
        print(f"  Dot {i}: visible={vis}, box={box}")

    browser.close()
