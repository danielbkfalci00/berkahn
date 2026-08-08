import { cn } from "@/lib/utils";

interface SectionLabelProps {
  number: string;
  title: string;
  variant: "dark" | "light";
  subtitle?: string;
  className?: string;
}

export function SectionLabel({
  number,
  title,
  variant,
  subtitle,
  className,
}: SectionLabelProps) {
  const isDark = variant === "dark";

  return (
    <div className={cn("mb-6", className)}>
      <span
        className={cn(
          "inline-block text-sm sm:text-base uppercase tracking-[0.3em] font-mono",
          isDark ? "text-white/60" : "text-black/60"
        )}
      >
        {number} — {title}
      </span>
      {subtitle && (
        <span
          className={cn(
            "block text-xs sm:text-sm uppercase tracking-[0.25em] mt-1.5",
            isDark ? "text-white/60" : "text-black/60"
          )}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
}
