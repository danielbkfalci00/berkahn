import { CountUp } from "@/components/animations/CountUp";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

const STATS = [
  { value: 25, suffix: "+", label: "Anos de experiência" },
  { value: 500, suffix: "+", label: "Projetos concluídos" },
  { value: 50, suffix: "+", label: "Profissionais especializados" },
  { value: 100, suffix: "%", label: "Satisfação dos clientes" },
];

export function Stats() {
  return (
    <section className="py-xl bg-black text-white">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {STATS.map((stat, index) => (
            <RevealOnScroll key={stat.label} delay={index * 0.1}>
              <div className="text-center">
                <CountUp
                  end={stat.value}
                  suffix={stat.suffix}
                  className="text-4xl lg:text-5xl font-heading font-light mb-2"
                />
                <p className="label-text text-white-70">{stat.label}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
