"use client";

import { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";

interface MenuItem {
  link?: string;
  text: string;
  image: string;
}

interface FlowingMenuProps {
  items?: MenuItem[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
}

export function FlowingMenu({
  items = [],
  speed = 0.5,
  textColor = "#000000",
  bgColor = "transparent",
  marqueeBgColor = "#000000",
  marqueeTextColor = "#ffffff",
  borderColor = "rgba(0,0,0,0.1)",
}: FlowingMenuProps) {
  return (
    <div className="menu-wrap">
      {items.map((item, index) => (
        <MenuItemComponent
          key={index}
          item={item}
          speed={speed}
          textColor={textColor}
          bgColor={bgColor}
          marqueeBgColor={marqueeBgColor}
          marqueeTextColor={marqueeTextColor}
          borderColor={borderColor}
        />
      ))}
    </div>
  );
}

function MenuItemComponent({
  item,
  speed,
  textColor,
  bgColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
}: {
  item: MenuItem;
  speed: number;
  textColor: string;
  bgColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    const marqueeInner = marqueeInnerRef.current;
    if (!marqueeInner) return;

    const marquee = el.querySelector(".marquee") as HTMLElement;

    // Set initial marquee position (hidden below)
    gsap.set(marquee, { yPercent: 101 });

    // Set initial marquee width
    const marqueeWidth = marqueeInner.scrollWidth;

    // Create infinite scroll animation
    const animationTl = gsap.timeline({ repeat: -1 });
    animationTl.to(marqueeInner, {
      x: -marqueeWidth / 2,
      duration: marqueeWidth / (100 * speed),
      ease: "none",
    });

    // Handle hover
    const handleMouseEnter = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const fromTop = e.clientY - rect.top < rect.height / 2;

      gsap.fromTo(
        marquee,
        { yPercent: fromTop ? -100 : 100 },
        { yPercent: 0, duration: 0.5, ease: "power2.out" }
      );
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const toTop = e.clientY - rect.top < rect.height / 2;

      gsap.to(marquee, {
        yPercent: toTop ? -100 : 100,
        duration: 0.5,
        ease: "power2.in",
      });
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    // Touch support — show marquee on tap
    const handleTouchStart = () => {
      gsap.fromTo(
        marquee,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.5, ease: "power2.out" }
      );
    };

    const handleTouchEnd = () => {
      gsap.to(marquee, {
        yPercent: 100,
        duration: 0.5,
        ease: "power2.in",
        delay: 1.5,
      });
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
      animationTl.kill();
    };
  }, [speed]);

  // Create repeated items for seamless loop
  const marqueeItems: ReactNode[] = [];
  for (let i = 0; i < 8; i++) {
    marqueeItems.push(
      <span key={`text-${i}`} className="marquee__text">
        {item.text}
      </span>
    );
    marqueeItems.push(
      <span key={`img-${i}`} className="marquee__img-wrapper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt={item.text} className="marquee__img" />
      </span>
    );
  }

  return (
    <div
      ref={itemRef}
      className="menu__item"
      style={{
        ["--menu-text-color" as string]: textColor,
        ["--menu-bg-color" as string]: bgColor,
        ["--marquee-bg-color" as string]: marqueeBgColor,
        ["--marquee-text-color" as string]: marqueeTextColor,
        ["--border-color" as string]: borderColor,
      }}
    >
      <div className="menu__item-link font-heading">
        {item.text}
        <span className="menu__item-hint" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      </div>
      <div
        className="marquee"
        style={{
          backgroundColor: marqueeBgColor,
          color: marqueeTextColor,
        }}
      >
        <div className="marquee__inner-wrap" ref={marqueeInnerRef}>
          {marqueeItems}
        </div>
      </div>
    </div>
  );
}
