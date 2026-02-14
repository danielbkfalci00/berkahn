import { Hero } from "@/components/sections/Hero";
import { Categories } from "@/components/sections/Categories";
import { Expertise } from "@/components/sections/Expertise";
import { Gallery } from "@/components/sections/Gallery";
import { LSFIntro } from "@/components/sections/LSFIntro";
import { BenefitsGridCompact } from "@/components/sections/BenefitsGridCompact";
import { ComparisonTableHome } from "@/components/sections/ComparisonTableHome";
import { PartnersFlowingMenu } from "@/components/residencial/PartnersFlowingMenu";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Expertise />
      <Gallery />
      <LSFIntro />
      <BenefitsGridCompact />
      <ComparisonTableHome />
      <PartnersFlowingMenu />
      <CTA />
    </>
  );
}
