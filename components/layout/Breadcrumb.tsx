import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  light?: boolean;
}

export function Breadcrumb({ items, className = "", light = false }: BreadcrumbProps) {
  const fullItems = [{ name: "Home", href: "/" }, ...items];

  return (
    <>
      {/* Visual breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className={`text-sm ${light ? "text-white/80" : "text-neutral-500"} ${className}`}
      >
        <ol className="flex flex-wrap items-center gap-1">
          {fullItems.map((item, index) => (
            <li key={item.href} className="flex items-center gap-1">
              {index > 0 && (
                <span className={light ? "text-white/50" : "text-neutral-400"} aria-hidden="true">
                  /
                </span>
              )}
              {index === fullItems.length - 1 ? (
                <span className={`font-medium truncate max-w-[200px] ${light ? "text-white" : "text-neutral-700"}`}>
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={`transition-colors ${light ? "hover:text-white" : "hover:text-neutral-900"}`}
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* BreadcrumbList structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: fullItems.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `https://www.berkahn.com.br${item.href}`,
          })),
        })}
      </script>
    </>
  );
}
