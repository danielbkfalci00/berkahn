"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Ponto único de registro dos plugins GSAP. Todos os consumidores importam
// daqui — nunca de "gsap" direto — para garantir registro em module scope
// e manter o GSAP fora de qualquer bundle de servidor (só client components
// importam este módulo).
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText, useGSAP };
