import Image from "next/image";

export const timelineData = [
  {
    title: "1999",
    content: (
      <div className="timeline-content">
        <h3 className="text-2xl font-heading font-medium mb-3">
          Fundação da Berkahn
        </h3>
        <p className="text-black-70 leading-relaxed mb-6">
          Nasce a BERKAHN com visão de revolucionar a forma de construir,
          trazendo métodos modernos e sustentáveis para o mercado brasileiro.
        </p>
        <div className="aspect-[4/3] overflow-hidden rounded-lg border border-black-10">
          <Image
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Fundação"
            width={1200}
            height={900}
            className="w-full h-full object-cover grayscale hover:grayscale-50 transition-all duration-500"
          />
        </div>
      </div>
    ),
  },
  {
    title: "2005",
    content: (
      <div className="timeline-content">
        <h3 className="text-2xl font-heading font-medium mb-3">
          Primeira Certificação Internacional
        </h3>
        <p className="text-black-70 leading-relaxed mb-6">
          Obtém certificação ISO 9001, consolidando seu compromisso com
          qualidade e excelência nos processos construtivos.
        </p>
        <div className="aspect-[4/3] overflow-hidden rounded-lg border border-black-10">
          <Image
            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Certificação"
            width={1200}
            height={900}
            className="w-full h-full object-cover grayscale hover:grayscale-50 transition-all duration-500"
          />
        </div>
      </div>
    ),
  },
  {
    title: "2010",
    content: (
      <div className="timeline-content">
        <h3 className="text-2xl font-heading font-medium mb-3">
          Expansão para Light Steel Frame
        </h3>
        <p className="text-black-70 leading-relaxed mb-6">
          Pioneiros na introdução do Light Steel Frame como sistema construtivo
          principal, democratizando construções de alta performance.
        </p>
        <div className="aspect-[4/3] overflow-hidden rounded-lg border border-black-10">
          <Image
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Light Steel Frame"
            width={1200}
            height={900}
            className="w-full h-full object-cover grayscale hover:grayscale-50 transition-all duration-500"
          />
        </div>
      </div>
    ),
  },
  {
    title: "2015",
    content: (
      <div className="timeline-content">
        <h3 className="text-2xl font-heading font-medium mb-3">
          100 Projetos Concluídos
        </h3>
        <p className="text-black-70 leading-relaxed mb-6">
          Marca histórica de 100 residências entregues, consolidando expertise
          em construção industrializada de alto padrão.
        </p>
        <div className="aspect-[4/3] overflow-hidden rounded-lg border border-black-10">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="100 Projetos"
            width={1200}
            height={900}
            className="w-full h-full object-cover grayscale hover:grayscale-50 transition-all duration-500"
          />
        </div>
      </div>
    ),
  },
  {
    title: "2020",
    content: (
      <div className="timeline-content">
        <h3 className="text-2xl font-heading font-medium mb-3">
          Tecnologia e Sustentabilidade
        </h3>
        <p className="text-black-70 leading-relaxed mb-6">
          Implementação de processos 100% digitais e certificação LEED em
          projetos, liderando a construção sustentável no Brasil.
        </p>
        <div className="aspect-[4/3] overflow-hidden rounded-lg border border-black-10">
          <Image
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Tecnologia"
            width={1200}
            height={900}
            className="w-full h-full object-cover grayscale hover:grayscale-50 transition-all duration-500"
          />
        </div>
      </div>
    ),
  },
  {
    title: "2024",
    content: (
      <div className="timeline-content">
        <h3 className="text-2xl font-heading font-medium mb-3">
          25 Anos de Excelência
        </h3>
        <p className="text-black-70 leading-relaxed mb-6">
          Celebrando um quarto de século de inovação. Mais de 500 projetos
          entregues, consolidando a Berkahn como referência nacional em LSF.
        </p>
        <div className="aspect-[4/3] overflow-hidden rounded-lg border border-black-10">
          <Image
            src="https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="25 Anos"
            width={1200}
            height={900}
            className="w-full h-full object-cover grayscale hover:grayscale-50 transition-all duration-500"
          />
        </div>
      </div>
    ),
  },
];
