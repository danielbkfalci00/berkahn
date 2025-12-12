"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { List, X } from "lucide-react";
import type { ArticleSection } from "@/types/article";

interface TableOfContentsProps {
  sections: ArticleSection[];
  className?: string;
}

export function TableOfContents({ sections, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsOpen(false);
  };

  const navContent = (
    <ul className="space-y-1">
      {sections.map((section, index) => (
        <motion.li
          key={section.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: index * 0.03,
            duration: 0.4,
            ease: [0.19, 1, 0.22, 1]
          }}
        >
          <button
            onClick={() => scrollToSection(section.id)}
            className={cn(
              "block w-full text-left py-2.5 px-4 text-sm transition-all duration-300 rounded-sm",
              section.level === 3 && "pl-8 text-xs",
              activeId === section.id
                ? "bg-black text-white font-medium"
                : "text-black-70 hover:bg-black-5 hover:text-black"
            )}
          >
            {section.title}
          </button>
        </motion.li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <nav className={cn("hidden lg:block sticky top-24", className)}>
        <p className="label-text mb-4 text-black-50">Neste artigo</p>
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          {navContent}
        </ScrollArea>
      </nav>

      {/* Mobile Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full",
          "bg-black text-white shadow-luxury-xl flex items-center justify-center",
          "hover:bg-black-90 transition-colors"
        )}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Fechar índice" : "Abrir índice"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <List className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300
              }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-luxury-xl max-h-[70vh] overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <p className="label-text text-black-50">Neste artigo</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-black-5 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <ScrollArea className="h-[50vh]">
                  {navContent}
                </ScrollArea>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Progress indicator for sidebar (optional enhancement)
interface ReadingProgressSidebarProps {
  progress: number;
}

export function ReadingProgressSidebar({ progress }: ReadingProgressSidebarProps) {
  return (
    <div className="w-1 h-full bg-black-10 rounded-full overflow-hidden">
      <motion.div
        className="w-full bg-black rounded-full"
        style={{ height: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}
