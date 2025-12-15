import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

export function Gallery() {
  return (
    <section className="py-xl bg-black-5">
      <div className="container">
        <RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/portfolio" className="overflow-hidden block group">
              <Image
                src="/images/home-gallery-1.png"
                alt="Residência em Light Steel Frame - Projeto Berkahn"
                width={2048}
                height={1152}
                className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
            <Link href="/portfolio" className="overflow-hidden block group">
              <Image
                src="/images/home-gallery-2.png"
                alt="Edifício Comercial em Steel Frame - Projeto Berkahn"
                width={2048}
                height={1152}
                className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
