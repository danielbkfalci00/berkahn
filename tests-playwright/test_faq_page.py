from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # Desktop screenshots (1440px)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:3000/perguntas-frequentes")
    page.wait_for_load_state("networkidle")
    time.sleep(2)

    # Hero section
    page.screenshot(path="faq-desktop-hero.jpg", quality=80, type="jpeg")

    # Scroll to FAQ section with search
    page.evaluate("window.scrollTo(0, window.innerHeight)")
    time.sleep(1)
    page.screenshot(path="faq-desktop-search.jpg", quality=80, type="jpeg")

    # Scroll to accordion area
    page.evaluate("window.scrollTo(0, window.innerHeight * 1.5)")
    time.sleep(1)
    page.screenshot(path="faq-desktop-accordion.jpg", quality=80, type="jpeg")

    # Scroll to form section
    page.evaluate("window.scrollTo(0, window.innerHeight * 4)")
    time.sleep(1)
    page.screenshot(path="faq-desktop-form.jpg", quality=80, type="jpeg")

    # Scroll to stats section
    page.evaluate("window.scrollTo(0, window.innerHeight * 5)")
    time.sleep(1)
    page.screenshot(path="faq-desktop-stats.jpg", quality=80, type="jpeg")

    # Scroll to links section
    page.evaluate("window.scrollTo(0, window.innerHeight * 6)")
    time.sleep(1)
    page.screenshot(path="faq-desktop-links.jpg", quality=80, type="jpeg")

    page.close()

    # Mobile screenshots (375px)
    page = browser.new_page(viewport={"width": 375, "height": 812})
    page.goto("http://localhost:3000/perguntas-frequentes")
    page.wait_for_load_state("networkidle")
    time.sleep(2)

    # Hero mobile
    page.screenshot(path="faq-mobile-hero.jpg", quality=80, type="jpeg")

    # Search section mobile
    page.evaluate("window.scrollTo(0, window.innerHeight)")
    time.sleep(1)
    page.screenshot(path="faq-mobile-search.jpg", quality=80, type="jpeg")

    # Accordion mobile
    page.evaluate("window.scrollTo(0, window.innerHeight * 2)")
    time.sleep(1)
    page.screenshot(path="faq-mobile-accordion.jpg", quality=80, type="jpeg")

    page.close()
    browser.close()
    print("Screenshots saved!")
