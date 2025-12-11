import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { ProjectCard } from "@/components/project/ProjectCard";
import { PROJECTS } from "@/data/projects";

export function ProjectsGrid() {
  return (
    <section className="py-xl">
      <div className="container">
        {/* Header */}
        <RevealOnScroll>
          <div className="text-center mb-12">
            <p className="label-text mb-4">Projetos Prontos para Construir</p>
            <h2 className="headline-lg mb-6">Escolha Seu Projeto</h2>
            <p className="body-lg text-black-70 max-w-3xl mx-auto">
              Oferecemos projetos prontos em Light Steel Frame para diferentes
              estilos de vida. Do compacto ao espaçoso, cada projeto foi pensado
              para oferecer conforto, eficiência e beleza.
            </p>
          </div>
        </RevealOnScroll>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {PROJECTS.map((project, index) => (
            <RevealOnScroll key={project.id} delay={index * 0.1}>
              <ProjectCard project={project} />
            </RevealOnScroll>
          ))}
        </div>

        {/* Call to action secundário */}
        <RevealOnScroll delay={0.4}>
          <div className="mt-12 text-center">
            <p className="body-md text-black-70">
              Não encontrou o que procura?{" "}
              <a
                href="/contato"
                className="text-black font-medium hover:underline underline-offset-4"
              >
                Fale conosco para um projeto personalizado
              </a>
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
