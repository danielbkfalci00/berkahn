import Image from "next/image";
import { ParallaxHero } from "@/components/sections/ParallaxHero";
import { Partners } from "@/components/sections/Partners";
import { CTA } from "@/components/sections/CTA";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { ContentBlocksGrid } from "@/components/sections/ContentBlocksGrid";
import { ComparisonTable } from "@/components/lsf/ComparisonTable";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { ResidencialContactForm } from "@/components/residencial/ResidencialContactForm";
import { DomeGallery } from "@/components/presentation/DomeGallery";
import {
  RESIDENCIAL_BENEFITS,
  RESIDENCIAL_TRANSPARENCY_BLOCKS,
  RESIDENCIAL_COMPARISON_DATA,
  RESIDENCIAL_PROCESS_STEPS,
  GALLERY_IMAGES_STYLES,
  GALLERY_IMAGES_PROJECTS,
} from "@/lib/residencial-data";

export const metadata = {
  title: "Residencial | Berkahn Steel Frame",
  description:
    "Sua casa construída com a precisão que você merece. Construção nova, reforma ou ampliação com Light Steel Frame — obra mais rápida, mais limpa e sem surpresas no orçamento.",
};

export default function ResidencialPage() {
  return (
    <>
      {/* 1. Hero Section */}
      <ParallaxHero
        label="CONSTRUÇÃO RESIDENCIAL"
        title="Sua casa construída com a precisão que você merece."
        subtitle="Construção nova, reforma ou ampliação com Light Steel Frame. Sua obra mais rápida, mais limpa e sem surpresas no orçamento."
        ctaText="Fale com a Berkahn"
        ctaHref="#formulario"
        backgroundImage="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80"
      />

      {/* ================================================================ */}
      {/* 2. O que fazemos por você */}
      {/* ================================================================ */}
      <section className="pt-xl pb-lg">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Column */}
            <RevealOnScroll>
              <div>
                <p className="label-text mb-4">O QUE FAZEMOS POR VOCÊ</p>
                <h2 className="headline-md mb-8">
                  A Berkahn constrói, reforma e amplia.
                </h2>

                <div className="space-y-5">
                  <p className="body-lg text-black-70">
                    O Light Steel Frame (LSF) é um sistema construtivo industrializado que utiliza perfis de aço galvanizado como estrutura, fechados externamente com placas cimentícias e internamente com gesso acartonado. É o mesmo sistema que domina mais de 90% das construções residenciais nos Estados Unidos, Canadá e Japão, e que vem crescendo de forma acelerada no Brasil pela superioridade técnica comprovada em relação à alvenaria tradicional.
                  </p>
                  <p className="body-lg text-black-70">
                    A Berkahn trabalha com o LSF como tecnologia primária, mas também atua com sistemas híbridos que combinam Steel Frame com concreto armado e aço laminado. Isso significa que o projeto se beneficia da melhor solução técnica para cada situação, ampliando as possibilidades arquitetônicas sem comprometer eficiência.
                  </p>
                  <p className="body-lg text-black-70">
                    Nosso escopo cobre o ciclo completo. Construímos casas do zero, executamos reformas estruturais e realizamos ampliações, inclusive verticais, em imóveis já existentes. Se o seu projeto é construir algo novo ou transformar algo que já existe, a engenharia por trás é a mesma: industrializada, previsível e com controle milimétrico.
                  </p>
                </div>
              </div>
            </RevealOnScroll>

            {/* Image Column */}
            <RevealOnScroll delay={0.2}>
              <div className="relative h-[500px] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                  alt="Residência de alto padrão em Steel Frame"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Partners sub-block */}
      <Partners
        label="PARCERIAS QUE SUSTENTAM A QUALIDADE"
        title="Marcas que Garantem o Padrão Berkahn"
      />

      {/* ================================================================ */}
      {/* 3. Por que Steel Frame para sua casa */}
      {/* ================================================================ */}
      <section className="py-xl">
        <div className="container">
          <RevealOnScroll>
            <p className="label-text mb-4">POR QUE STEEL FRAME</p>
            <h2 className="headline-md mb-6">
              O que o Steel Frame muda na prática.
            </h2>
            <p className="body-lg text-black-70 max-w-4xl mb-16">
              A diferença entre construir em Steel Frame e construir em alvenaria tradicional é estrutural. Ela aparece em cada etapa da obra e em cada dia que você mora no imóvel depois que ela termina.
            </p>
          </RevealOnScroll>

          <ContentBlocksGrid data={RESIDENCIAL_BENEFITS} columns={3} />

          {/* Sub-block: Versatilidade arquitetônica */}
          <div className="mt-16 pt-16 border-t border-black-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <RevealOnScroll>
                <div>
                  <h3 className="headline-sm mb-6">Versatilidade arquitetônica</h3>
                  <p className="body-lg text-black-70 leading-relaxed">
                    Uma das percepções equivocadas sobre o Steel Frame é que ele limita o design. Na realidade, o sistema permite desde linhas retas e minimalistas até fachadas com curvas e formas complexas, utilizando placas cimentícias moldáveis. Combinado com outros materiais em soluções híbridas, como madeira, concreto aparente ou vidro, o LSF se adapta a praticamente qualquer linguagem arquitetônica.
                  </p>
                </div>
              </RevealOnScroll>

              {/* DomeGallery — estilos arquitetônicos */}
              <div className="h-[400px] md:h-[500px]">
                <DomeGallery
                  images={GALLERY_IMAGES_STYLES}
                  fit={0.7}
                  minRadius={400}
                  segments={20}
                  grayscale={false}
                  overlayBlurColor="#ffffff"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 4. Design e personalização */}
      {/* ================================================================ */}
      <section className="py-xl bg-black">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* DomeGallery — projetos residenciais */}
            <div className="order-2 lg:order-1 h-[400px] md:h-[500px]">
              <DomeGallery
                images={GALLERY_IMAGES_PROJECTS}
                fit={0.7}
                minRadius={400}
                segments={20}
                grayscale={false}
                overlayBlurColor="#000000"
              />
            </div>

            {/* Text Column (right on desktop) */}
            <RevealOnScroll delay={0.2} className="order-1 lg:order-2">
              <div>
                <p className="label-text text-white/50 mb-4">DESIGN & PERSONALIZAÇÃO</p>
                <h2 className="headline-md text-white mb-8">
                  Cada projeto é único. E o seu também será.
                </h2>

                <div className="space-y-5">
                  <p className="body-lg text-white/70">
                    A Berkahn mantém parcerias com arquitetas qualificadas que atuam em diferentes linguagens de design, do contemporâneo ao clássico, do minimalista ao integrado com natureza. Isso garante que o projeto da sua casa seja pensado para a forma como você e sua família vivem, e que saia de um processo criativo real, com profissionais que entendem tanto de estética quanto de engenharia.
                  </p>
                  <p className="body-lg text-white/70">
                    A personalização começa no projeto estrutural, passa pelas decisões de layout, considera a orientação solar do terreno, o aproveitamento de ventilação natural e chega até a escolha dos acabamentos internos e externos. O Steel Frame permite esse nível de personalização sem comprometer prazos ou previsibilidade de custo, porque o processo industrializado absorve a complexidade que na alvenaria se transformaria em retrabalho.
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 5. Transparência antes de tudo */}
      {/* ================================================================ */}
      <section className="py-xl bg-black-5">
        <div className="container">
          <RevealOnScroll>
            <p className="label-text mb-4">O QUE VOCÊ PRECISA SABER</p>
            <h2 className="headline-md mb-6">
              Transparência antes de tudo.
            </h2>
            <p className="body-lg text-black-70 max-w-4xl mb-16">
              Nenhum sistema construtivo é perfeito para todas as situações. O Steel Frame tem vantagens claras e documentadas, mas também tem características que exigem atenção e planejamento. A Berkahn acredita que você toma decisões melhores quando tem todas as informações. Por isso, aqui vai o que você precisa saber.
            </p>
          </RevealOnScroll>

          <ContentBlocksGrid data={RESIDENCIAL_TRANSPARENCY_BLOCKS} columns={2} />
        </div>
      </section>

      {/* ================================================================ */}
      {/* 6. Reformas e Ampliações */}
      {/* ================================================================ */}
      <section className="py-xl">
        <div className="container max-w-4xl">
          <RevealOnScroll>
            <p className="label-text mb-4">REFORMAS & AMPLIAÇÕES</p>
            <h2 className="headline-md mb-8">
              Reformar e ampliar sem o caos de uma obra tradicional.
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <div className="space-y-6">
              <p className="body-lg text-black-70 leading-relaxed">
                Uma das aplicações mais inteligentes do Steel Frame é em reformas e ampliações de imóveis existentes. E o motivo é simples: o peso. A estrutura do LSF pesa entre 60 e 100 kg/m², comparada aos 1.200 a 1.500 kg/m² da alvenaria convencional. Isso significa que uma ampliação em Steel Frame pode ser construída sobre uma laje ou estrutura existente sem necessidade de reforço de fundação na maioria dos casos. Para quem quer adicionar um andar, expandir lateralmente ou transformar um espaço interno, essa diferença de peso é a diferença entre uma obra simples e uma obra de grande intervenção.
              </p>
              <p className="body-lg text-black-70 leading-relaxed">
                Além disso, a construção a seco elimina os problemas clássicos de reformas em alvenaria: poeira excessiva, quebra de paredes, entulho, meses de obra e a impossibilidade de usar o imóvel durante o processo. Com LSF, a montagem é limpa e rápida, e em muitos casos o morador pode continuar no imóvel durante parte significativa da obra.
              </p>
              <p className="body-lg text-black-70 leading-relaxed">
                A Berkahn executa reformas e ampliações residenciais com o mesmo nível de planejamento e precisão que aplica em construções novas. O processo começa com uma avaliação técnica da estrutura existente, seguida pelo projeto de integração entre o novo e o existente, e termina com a execução industrializada com prazo definido.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 7. Comparativo LSF vs. Tradicional */}
      {/* ================================================================ */}
      <section className="py-xl bg-black-5">
        <div className="container max-w-5xl">
          <RevealOnScroll>
            <p className="label-text mb-4">COMPARATIVO</p>
            <h2 className="headline-md mb-6">
              Os números falam.
            </h2>
            <p className="body-lg text-black-70 max-w-4xl mb-12">
              Veja como o Steel Frame se compara à construção tradicional nos critérios que mais importam para quem vai construir, reformar ou ampliar.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <ComparisonTable data={RESIDENCIAL_COMPARISON_DATA} />
          </RevealOnScroll>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 8. Como funciona o processo */}
      {/* ================================================================ */}
      <section className="py-xl">
        <div className="container">
          <RevealOnScroll>
            <p className="label-text mb-4">NOSSO PROCESSO</p>
            <h2 className="headline-md mb-6">
              Do primeiro contato à entrega das chaves.
            </h2>
            <p className="body-lg text-black-70 max-w-4xl mb-16">
              Cada etapa é conduzida com transparência, planejamento e controle.
              Você acompanha tudo, do início ao fim.
            </p>
          </RevealOnScroll>

          <ProcessTimeline steps={RESIDENCIAL_PROCESS_STEPS} />
        </div>
      </section>

      {/* ================================================================ */}
      {/* 9. Formulário de contato */}
      {/* ================================================================ */}
      <section id="formulario" className="py-xl bg-black-5">
        <div className="container max-w-3xl">
          <RevealOnScroll>
            <p className="label-text mb-4">FALE CONOSCO</p>
            <h2 className="headline-md mb-4">
              Fale com a Berkahn sobre o seu projeto.
            </h2>
            <p className="body-lg text-black-70 mb-12">
              Conte o que você tem em mente. A gente responde com uma análise
              técnica inicial e sem compromisso.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <ResidencialContactForm />
          </RevealOnScroll>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 10. CTA de redirecionamento */}
      {/* ================================================================ */}
      <CTA
        label="SOLUÇÕES CORPORATIVAS"
        title="A Berkahn também atende empresas."
        description="Se você procura soluções em Steel Frame para projetos comerciais, industriais ou construções temporárias, conheça o que podemos fazer pelo seu negócio."
        actionType="link"
        actionText="Conheça nossas soluções corporativas"
        actionHref="/comercial-industrial"
      />
    </>
  );
}
