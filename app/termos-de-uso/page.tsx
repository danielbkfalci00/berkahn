import { CheckIcon } from "lucide-react";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata = {
  title: "Termos de Uso | Berkahn",
  description:
    "Termos de Uso do site da Construtora Berkahn. Conheça as condições de acesso e utilização do nosso site.",
};

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 body-md text-black-70"
        >
          <CheckIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function TermosDeUsoPage() {
  return (
    <LegalPageLayout
      title="Termos de Uso"
      lastUpdated="fevereiro de 2025"
      introContent={
        <p>
          Estes Termos de Uso regulam o acesso e a utilização do site
          berkahn.com.br, de propriedade e operação da Construtora Berkahn
          (&quot;Berkahn&quot;, &quot;nós&quot;). Ao acessar ou utilizar nosso
          site, você concorda com os termos descritos abaixo. Caso não concorde
          com qualquer disposição, recomendamos que interrompa o uso do site.
        </p>
      }
      sections={[
        {
          number: 1,
          title: "Sobre o site",
          content: (
            <p>
              O site berkahn.com.br tem caráter institucional e informativo. Seu
              objetivo é apresentar a Construtora Berkahn, seus serviços, áreas
              de atuação e conteúdos educativos sobre construção civil e Light
              Steel Frame. O site também disponibiliza canais para solicitação de
              orçamento e inscrição em newsletter.
            </p>
          ),
        },
        {
          number: 2,
          title: "Uso permitido",
          content: (
            <>
              <p>
                Ao acessar o site, você se compromete a utilizá-lo de forma
                lícita, respeitosa e em conformidade com estes Termos. É
                permitido navegar pelo conteúdo, consultar informações sobre
                nossos serviços, solicitar orçamentos, inscrever-se na
                newsletter e compartilhar conteúdos do blog desde que com a
                devida atribuição à Berkahn.
              </p>
              <p>
                É expressamente proibido utilizar o site para qualquer finalidade
                ilegal ou não autorizada. Isso inclui, entre outras condutas:
              </p>
              <CheckList
                items={[
                  "Tentar obter acesso não autorizado a sistemas ou dados.",
                  "Utilizar mecanismos automatizados para extração de conteúdo (scraping).",
                  "Transmitir vírus ou códigos maliciosos.",
                  "Reproduzir conteúdo do site para fins comerciais sem autorização prévia.",
                  "Fornecer informações falsas nos formulários de contato ou orçamento.",
                ]}
              />
            </>
          ),
        },
        {
          number: 3,
          title: "Propriedade intelectual",
          content: (
            <>
              <p>
                Todo o conteúdo disponível no site, incluindo mas não se
                limitando a textos, imagens, fotografias, logotipos, ícones,
                layout, código-fonte, identidade visual e marca
                &quot;Berkahn&quot;, é de propriedade da Construtora Berkahn ou
                licenciado para uso por ela, e está protegido pela legislação
                brasileira de propriedade intelectual e direitos autorais (Lei nº
                9.610/1998 e Lei nº 9.279/1996).
              </p>
              <p>
                Nenhum conteúdo do site pode ser copiado, reproduzido,
                distribuído, modificado ou utilizado para fins comerciais sem
                autorização prévia e por escrito da Berkahn. O compartilhamento
                de artigos e conteúdos do blog é permitido para fins não
                comerciais, desde que acompanhado de crédito à Berkahn e link
                para o conteúdo original.
              </p>
            </>
          ),
        },
        {
          number: 4,
          title: "Solicitação de orçamento",
          content: (
            <>
              <p>
                O formulário de solicitação de orçamento disponível no site é um
                canal de contato inicial. O envio de uma solicitação não
                constitui proposta comercial, contrato ou compromisso de
                prestação de serviços por parte da Berkahn. Toda negociação
                comercial será conduzida diretamente pela equipe da Berkahn após
                análise da solicitação, e eventuais contratos serão formalizados
                em instrumentos próprios.
              </p>
              <p>
                As informações fornecidas no formulário devem ser verdadeiras e
                completas. A Berkahn reserva-se o direito de não dar andamento a
                solicitações com dados inconsistentes ou incompletos.
              </p>
            </>
          ),
        },
        {
          number: 5,
          title: "Newsletter",
          content: (
            <>
              <p>
                A inscrição na newsletter da Berkahn é voluntária e gratuita. Ao
                se inscrever, você autoriza o envio periódico de e-mails com
                conteúdos sobre construção civil, Light Steel Frame, novidades da
                empresa e informações que consideramos relevantes para nosso
                público.
              </p>
              <p>
                Você pode cancelar sua inscrição a qualquer momento através do
                link de descadastro presente em cada e-mail enviado, ou entrando
                em contato conosco pelos canais indicados na seção 11 deste
                documento.
              </p>
            </>
          ),
        },
        {
          number: 6,
          title: "Conteúdo informativo e educativo",
          content: (
            <>
              <p>
                Os artigos, textos técnicos e demais conteúdos publicados no
                blog e nas páginas do site têm caráter exclusivamente informativo
                e educativo. Embora a Berkahn se empenhe em fornecer informações
                precisas e atualizadas, o conteúdo do site não substitui
                consultoria técnica profissional, parecer de engenharia ou
                qualquer orientação especializada.
              </p>
              <p>
                Decisões sobre projetos de construção devem ser tomadas com o
                acompanhamento de profissionais habilitados. A Berkahn não se
                responsabiliza pelo uso que terceiros façam das informações
                disponibilizadas no site fora do contexto de uma relação
                contratual formal.
              </p>
            </>
          ),
        },
        {
          number: 7,
          title: "Disponibilidade do site",
          content: (
            <>
              <p>
                A Berkahn se empenha em manter o site disponível e funcional, mas
                não garante que o acesso será ininterrupto ou livre de erros. O
                site pode ficar temporariamente indisponível para manutenção,
                atualizações ou por razões técnicas fora do nosso controle.
              </p>
              <p>
                Reservamo-nos o direito de modificar, suspender ou descontinuar
                qualquer funcionalidade do site a qualquer momento, sem aviso
                prévio.
              </p>
            </>
          ),
        },
        {
          number: 8,
          title: "Limitação de responsabilidade",
          content: (
            <>
              <p>
                A Berkahn não se responsabiliza por danos diretos, indiretos,
                incidentais ou consequentes decorrentes do uso ou da
                impossibilidade de uso do site, incluindo, mas não se limitando
                a, perda de dados, interrupção de negócios ou danos a
                equipamentos.
              </p>
              <p>
                O site pode conter links para sites de terceiros, fornecidos
                apenas por conveniência. A Berkahn não controla, endossa ou se
                responsabiliza pelo conteúdo, políticas de privacidade ou
                práticas de sites externos.
              </p>
            </>
          ),
        },
        {
          number: 9,
          title: "Alterações nestes termos",
          content: (
            <p>
              Estes Termos de Uso podem ser atualizados a qualquer momento para
              refletir mudanças em nossas práticas ou exigências legais.
              Alterações relevantes serão comunicadas por meio do site, e a data
              de última atualização no topo deste documento será sempre revisada.
              O uso continuado do site após a publicação de alterações implica
              aceitação dos novos termos.
            </p>
          ),
        },
        {
          number: 10,
          title: "Legislação aplicável e foro",
          content: (
            <p>
              Estes Termos de Uso são regidos pela legislação da República
              Federativa do Brasil. Para dirimir quaisquer controvérsias
              decorrentes destes termos, fica eleito o Foro da Comarca de São
              Paulo, Estado de São Paulo, com renúncia a qualquer outro, por mais
              privilegiado que seja.
            </p>
          ),
        },
      ]}
      contactSection={{
        sectionNumber: 11,
        title: "Contato",
        contact: {
          email: "contato.berkahn@gmail.com",
          phone: "+55 (11) 96641-5742",
          introText:
            "Para dúvidas ou solicitações relacionadas a estes Termos de Uso, entre em contato:",
        },
      }}
    />
  );
}
