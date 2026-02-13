"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { XIcon } from "lucide-react";

/* ─── Types ─── */

export interface MasonryItem {
  id: string;
  img: string;
  alt: string;
  height: number;
}

interface MasonryProps {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: "top" | "bottom" | "left" | "right" | "center" | "random";
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
}

/* ─── Hooks ─── */

function useMedia(
  queries: string[],
  values: number[],
  defaultValue: number
): number {
  const get = useCallback(
    () =>
      values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue,
    [queries, values, defaultValue]
  );

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(get());
    const handler = () => setValue(get());
    const mqls = queries.map((q) => matchMedia(q));
    mqls.forEach((mql) => mql.addEventListener("change", handler));
    return () =>
      mqls.forEach((mql) => mql.removeEventListener("change", handler));
  }, [queries, get]);

  return value;
}

function useMeasure(): [React.RefObject<HTMLDivElement | null>, { width: number; height: number }] {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
}

/* ─── Preload ─── */

const preloadImages = async (urls: string[]) => {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

/* ─── Grid item with position ─── */

interface GridItem extends MasonryItem {
  x: number;
  y: number;
  w: number;
  h: number;
}

/* ─── Component ─── */

export function Masonry({
  items,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
}: MasonryProps) {
  const columns = useMedia(
    [
      "(min-width:1500px)",
      "(min-width:1000px)",
      "(min-width:600px)",
      "(min-width:400px)",
    ],
    [5, 4, 3, 2],
    1
  );

  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MasonryItem | null>(null);
  const hasMounted = useRef(false);

  const getInitialPosition = useCallback(
    (item: GridItem) => {
      const el = containerRef.current;
      if (!el) return { x: item.x, y: item.y };
      const rect = el.getBoundingClientRect();

      let direction = animateFrom;
      if (animateFrom === "random") {
        const dirs: Array<"top" | "bottom" | "left" | "right"> = [
          "top",
          "bottom",
          "left",
          "right",
        ];
        direction = dirs[Math.floor(Math.random() * dirs.length)];
      }

      switch (direction) {
        case "top":
          return { x: item.x, y: -200 };
        case "bottom":
          return { x: item.x, y: window.innerHeight + 200 };
        case "left":
          return { x: -200, y: item.y };
        case "right":
          return { x: window.innerWidth + 200, y: item.y };
        case "center":
          return {
            x: rect.width / 2 - item.w / 2,
            y: rect.height / 2 - item.h / 2,
          };
        default:
          return { x: item.x, y: item.y + 100 };
      }
    },
    [animateFrom, containerRef]
  );

  useEffect(() => {
    preloadImages(items.map((i) => i.img)).then(() => setImagesReady(true));
  }, [items]);

  const grid = useMemo<GridItem[]>(() => {
    if (!width) return [];

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;

    return items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const height = child.height / 2;
      const y = colHeights[col];
      colHeights[col] += height;
      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, items, width]);

  const containerHeight = useMemo(() => {
    if (!grid.length) return 0;
    return Math.max(...grid.map((item) => item.y + item.h));
  }, [grid]);

  useLayoutEffect(() => {
    if (!imagesReady) return;

    grid.forEach((item, index) => {
      const selector = `[data-masonry-key="${item.id}"]`;
      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
      };

      if (!hasMounted.current) {
        const initialPos = getInitialPosition(item);
        const initialState: gsap.TweenVars = {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          width: item.w,
          height: item.h,
          ...(blurToFocus && { filter: "blur(10px)" }),
        };

        gsap.fromTo(selector, initialState, {
          opacity: 1,
          ...animationProps,
          ...(blurToFocus && { filter: "blur(0px)" }),
          duration: 0.8,
          ease: "power3.out",
          delay: index * stagger,
        });
      } else {
        gsap.to(selector, {
          ...animationProps,
          duration,
          ease,
          overwrite: "auto",
        });
      }
    });

    hasMounted.current = true;
  }, [grid, imagesReady, stagger, blurToFocus, duration, ease, getInitialPosition]);

  const handleMouseEnter = (item: GridItem) => {
    if (!scaleOnHover) return;
    gsap.to(`[data-masonry-key="${item.id}"]`, {
      scale: hoverScale,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (item: GridItem) => {
    if (!scaleOnHover) return;
    gsap.to(`[data-masonry-key="${item.id}"]`, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  /* ─── Lightbox ─── */

  useEffect(() => {
    if (!selectedImage) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  return (
    <>
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className="masonry-list"
        style={{ height: containerHeight }}
      >
        {grid.map((item) => (
          <div
            key={item.id}
            data-masonry-key={item.id}
            className="masonry-item"
            onClick={() => setSelectedImage(item)}
            onMouseEnter={() => handleMouseEnter(item)}
            onMouseLeave={() => handleMouseLeave(item)}
          >
            <div
              className="masonry-item-img"
              style={{ backgroundImage: `url(${item.img})` }}
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 cursor-pointer p-8"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage.img}
              alt={selectedImage.alt}
              className="max-w-[min(600px,80vw)] max-h-[65vh] object-contain rounded-lg"
            />
            <button
              type="button"
              aria-label="Fechar"
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              <XIcon size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
