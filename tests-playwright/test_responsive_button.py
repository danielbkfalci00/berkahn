#!/usr/bin/env python3
"""Test responsive button behavior on mobile and desktop breakpoints."""

from playwright.sync_api import sync_playwright
import time

def test_responsive_button():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # Test 1: Desktop (1440px)
        print("\n" + "="*60)
        print("TEST 1: DESKTOP VIEWPORT (1440px)")
        print("="*60)

        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("http://localhost:3000", wait_until="networkidle")
        page.wait_for_timeout(500)

        # Take screenshot
        page.screenshot(path="test_desktop.png", full_page=False)
        print("✓ Screenshot saved: test_desktop.png")

        # Check if button exists in header (should be visible)
        header = page.locator("header")
        button_in_header = header.locator("button:has-text('Fale Conosco')")

        try:
            is_visible = button_in_header.is_visible()
            print(f"✓ Button in header: {'VISIBLE' if is_visible else 'HIDDEN'}")

            # Check CSS (should have md:flex visible)
            wrapper = button_in_header.locator("xpath=../..")
            computed_display = wrapper.evaluate("el => window.getComputedStyle(el).display")
            print(f"✓ Wrapper display CSS: {computed_display}")

            if is_visible:
                print("✅ PASS: Button is visible in desktop header")
            else:
                print("❌ FAIL: Button should be visible in desktop header")
        except Exception as e:
            print(f"❌ ERROR: {str(e)}")

        page.close()

        # Test 2: Mobile (375px)
        print("\n" + "="*60)
        print("TEST 2: MOBILE VIEWPORT (375px)")
        print("="*60)

        page = browser.new_page(viewport={"width": 375, "height": 812})
        page.goto("http://localhost:3000", wait_until="networkidle")
        page.wait_for_timeout(500)

        # Take screenshot
        page.screenshot(path="test_mobile.png", full_page=False)
        print("✓ Screenshot saved: test_mobile.png")

        # Check if button in header is hidden (should not be visible)
        header = page.locator("header")
        button_in_header = header.locator("button:has-text('Fale Conosco')")

        try:
            is_visible_in_header = button_in_header.is_visible()
            print(f"✓ Button in header: {'VISIBLE' if is_visible_in_header else 'HIDDEN'}")

            if not is_visible_in_header:
                print("✅ PASS: Button is hidden in mobile header")
            else:
                print("❌ FAIL: Button should be hidden in mobile header")
        except Exception as e:
            print(f"⚠️ Button not found in header (expected): {str(e)}")

        # Open mobile menu
        print("\n📱 Opening mobile menu...")
        hamburger = page.locator("button[aria-label='Menu']")
        hamburger.click()
        page.wait_for_timeout(600)  # Wait for animation

        # Take screenshot of open menu
        page.screenshot(path="test_mobile_menu.png", full_page=False)
        print("✓ Screenshot saved: test_mobile_menu.png")

        # Check if button exists in sidebar (should be visible)
        sidebar = page.locator("aside")
        button_in_sidebar = sidebar.locator("button:has-text('Fale Conosco')")

        try:
            is_visible_in_sidebar = button_in_sidebar.is_visible()
            print(f"✓ Button in sidebar: {'VISIBLE' if is_visible_in_sidebar else 'HIDDEN'}")

            if is_visible_in_sidebar:
                print("✅ PASS: Button is visible in mobile menu")
            else:
                print("❌ FAIL: Button should be visible in mobile menu")
        except Exception as e:
            print(f"❌ ERROR: {str(e)}")

        page.close()

        # Test 3: Check for button duplication at breakpoint
        print("\n" + "="*60)
        print("TEST 3: BREAKPOINT CHECK (768px)")
        print("="*60)

        page = browser.new_page(viewport={"width": 768, "height": 1024})
        page.goto("http://localhost:3000", wait_until="networkidle")
        page.wait_for_timeout(500)

        # Count all "Fale Conosco" buttons
        all_buttons = page.locator("button:has-text('Fale Conosco')")
        button_count = all_buttons.count()
        print(f"✓ Total 'Fale Conosco' buttons found: {button_count}")

        if button_count == 1:
            print("✅ PASS: No button duplication at breakpoint")
        else:
            print(f"⚠️ WARNING: Found {button_count} buttons (should be exactly 1)")

        page.close()

        browser.close()

        print("\n" + "="*60)
        print("TESTING COMPLETE")
        print("="*60)
        print("\nScreenshots saved:")
        print("  - test_desktop.png")
        print("  - test_mobile.png")
        print("  - test_mobile_menu.png")

if __name__ == "__main__":
    test_responsive_button()
