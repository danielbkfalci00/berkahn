from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})

    # Test on comercial-industrial page
    page.goto('http://localhost:3000/comercial-industrial#formulario')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)

    # Scroll the map into view
    map_img = page.locator('img[alt*="Mapa do Brasil"]').first
    map_img.scroll_into_view_if_needed()
    page.wait_for_timeout(1000)

    # Get map container
    map_container = page.locator('.relative.max-w-md').first
    container_box = map_container.bounding_box()

    if container_box:
        map_container.screenshot(path='map-container-comercial.png')
        print("Comercial map screenshot saved: map-container-comercial.png")

    # Get positions
    map_box = map_img.bounding_box()
    dot = page.locator('.bg-blue-500').first
    dot_box = dot.bounding_box()

    if map_box and dot_box:
        dot_cx = dot_box['x'] + dot_box['width'] / 2
        dot_cy = dot_box['y'] + dot_box['height'] / 2
        rel_x = (dot_cx - map_box['x']) / map_box['width'] * 100
        rel_y = (dot_cy - map_box['y']) / map_box['height'] * 100
        print(f"Map image: x={map_box['x']:.0f}, y={map_box['y']:.0f}, w={map_box['width']:.0f}, h={map_box['height']:.0f}")
        print(f"Blue dot center: ({dot_cx:.0f}, {dot_cy:.0f})")
        print(f"Dot relative to map image: ({rel_x:.1f}%, {rel_y:.1f}%)")

    browser.close()
