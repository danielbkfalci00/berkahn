import { Hero } from "@/components/sections/Hero";
import { Expertise } from "@/components/sections/Expertise";
import { Gallery } from "@/components/sections/Gallery";
import { LSFIntro } from "@/components/sections/LSFIntro";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Expertise />
      <Gallery />
      <LSFIntro />
      <CTA />
    </>
  );
}
