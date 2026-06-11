"""Test FAQ page Phase 2 changes - desktop and mobile screenshots."""
from playwright.sync_api import sync_playwright

URL = "http://localhost:3000/perguntas-frequentes"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # ── Desktop 1440px ──
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto(URL)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1500)

    # 1. Hero + search section (not sticky — should be at its position)
    page.screenshot(path="faq-p2-desktop-hero.jpg", full_page=False, quality=80, type="jpeg")
    print("[OK] Desktop hero")

    # 2. Scroll to FAQ section to see search + chips
    page.evaluate("window.scrollTo(0, 700)")
    page.wait_for_timeout(500)
    page.screenshot(path="faq-p2-desktop-search.jpg", full_page=False, quality=80, type="jpeg")
    print("[OK] Desktop search + chips")

    # 3. Open first accordion to see bold text
    accordion_triggers = page.locator("[data-state='closed'] button").all()
    if len(accordion_triggers) > 0:
        accordion_triggers[0].click()
        page.wait_for_timeout(500)
    page.screenshot(path="faq-p2-desktop-accordion-bold.jpg", full_page=False, quality=80, type="jpeg")
    print("[OK] Desktop accordion with bold")

    # 4. Scroll down more to check no form/stats sections exist
    page.evaluate("window.scrollTo(0, document.body.scrollHeight - 1500)")
    page.wait_for_timeout(500)
    page.screenshot(path="faq-p2-desktop-cards.jpg", full_page=False, quality=80, type="jpeg")
    print("[OK] Desktop explore cards")

    # 5. Scroll to CTA
    page.evaluate("window.scrollTo(0, document.body.scrollHeight - 400)")
    page.wait_for_timeout(500)
    page.screenshot(path="faq-p2-desktop-cta.jpg", full_page=False, quality=80, type="jpeg")
    print("[OK] Desktop CTA")

    page.close()

    # ── Mobile 375px ──
    page = browser.new_page(viewport={"width": 375, "height": 812})
    page.goto(URL)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1500)

    # 6. Scroll to FAQ search section with chips
    page.evaluate("window.scrollTo(0, 600)")
    page.wait_for_timeout(500)
    page.screenshot(path="faq-p2-mobile-chips.jpg", full_page=False, quality=80, type="jpeg")
    print("[OK] Mobile chips (horizontal scroll)")

    # 7. Open first accordion on mobile
    accordion_triggers = page.locator("[data-state='closed'] button").all()
    if len(accordion_triggers) > 0:
        accordion_triggers[0].click()
        page.wait_for_timeout(500)
    page.screenshot(path="faq-p2-mobile-accordion.jpg", full_page=False, quality=80, type="jpeg")
    print("[OK] Mobile accordion with bold")

    # 8. Scroll to cards on mobile
    page.evaluate("window.scrollTo(0, document.body.scrollHeight - 2000)")
    page.wait_for_timeout(500)
    page.screenshot(path="faq-p2-mobile-cards.jpg", full_page=False, quality=80, type="jpeg")
    print("[OK] Mobile cards")

    page.close()
    browser.close()
    print("\n[DONE] All 8 screenshots captured!")
