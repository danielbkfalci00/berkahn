"""Test sidebar scroll fix — verify CTA is accessible after expanding Serviços."""
from playwright.sync_api import sync_playwright

URL = "http://localhost:3000"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # Mobile viewport
    page = browser.new_page(viewport={"width": 375, "height": 812})
    page.goto(URL, wait_until="networkidle")
    page.wait_for_timeout(2000)

    page.screenshot(path="sidebar-01-page.jpg", quality=80, type="jpeg")
    print("[OK] Page loaded")

    # Click hamburger (the button in the header that opens menu)
    # Header has a button with 3 span children for the hamburger
    hamburger = page.locator("header button").first
    hamburger.click(timeout=5000)
    page.wait_for_timeout(800)

    page.screenshot(path="sidebar-02-opened.jpg", quality=80, type="jpeg")
    print("[OK] Sidebar opened")

    # Find the accordion trigger for Serviços (the chevron button)
    # It's inside the sidebar: aside > div > nav > Accordion
    chevron = page.locator("aside [data-radix-collection-item]").first
    if chevron.count() > 0:
        chevron.click()
        page.wait_for_timeout(500)
        page.screenshot(path="sidebar-03-expanded.jpg", quality=80, type="jpeg")
        print("[OK] Serviços accordion expanded")
    else:
        # Fallback: try clicking any AccordionTrigger in sidebar
        chevron = page.locator("aside button[data-state]").first
        if chevron.count() > 0:
            chevron.click()
            page.wait_for_timeout(500)
        page.screenshot(path="sidebar-03-expanded.jpg", quality=80, type="jpeg")
        print("[OK] Clicked accordion trigger (fallback)")

    # Check if CTA is visible or if we need to scroll
    cta_text = page.locator("text=Fale Conosco")
    # The CTA in sidebar (not the one in header which is hidden on mobile)
    sidebar_cta = page.locator("aside").locator("text=Fale Conosco")

    if sidebar_cta.count() > 0:
        is_visible = sidebar_cta.first.is_visible()
        print(f"[INFO] CTA visible without scroll: {is_visible}")

        if not is_visible:
            # Try scrolling within nav
            page.locator("aside nav").evaluate("el => el.scrollBy(0, 300)")
            page.wait_for_timeout(300)
            is_visible_after = sidebar_cta.first.is_visible()
            print(f"[INFO] CTA visible after nav scroll: {is_visible_after}")

        page.screenshot(path="sidebar-04-cta.jpg", quality=80, type="jpeg")
    else:
        print("[WARN] CTA not found in sidebar")

    # Also check footer text
    footer = page.locator("aside").locator("text=2026 Berkahn")
    if footer.count() > 0:
        print(f"[INFO] Footer visible: {footer.first.is_visible()}")

    page.screenshot(path="sidebar-05-final.jpg", quality=80, type="jpeg")
    print("\n[DONE] Test complete!")

    page.close()
    browser.close()
