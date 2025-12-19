import { cn } from "@/lib/utils";

interface PresentationLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PresentationLayout({
  children,
  className
}: PresentationLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen w-full",
        "scroll-smooth",
        className
      )}
    >
      {children}
    </div>
  );
}
