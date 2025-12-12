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
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Projeto Steel Frame Berkahn"
                width={1200}
                height={800}
                className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
            <Link href="/portfolio" className="overflow-hidden block group">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Interior Casa Steel Frame"
                width={1200}
                height={800}
                className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
