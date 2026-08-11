import { CheckIcon } from "lucide-react";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata = {
  title: "Política de Privacidade | Berkahn",
  description:
    "Política de Privacidade da Construtora Berkahn. Saiba como coletamos, utilizamos e protegemos seus dados pessoais em conformidade com a LGPD.",
  openGraph: {
    title: "Política de Privacidade | Berkahn",
    description:
      "Política de Privacidade da Construtora Berkahn. Saiba como coletamos, utilizamos e protegemos seus dados pessoais em conformidade com a LGPD.",
    url: "https://www.berkahn.com.br/privacidade",
    siteName: "Construtora Berkahn",
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/images/Compartilhamento/og-image.webp", width: 1200, height: 630, alt: "Construtora Berkahn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Política de Privacidade | Berkahn",
    description:
      "Política de Privacidade da Construtora Berkahn. Saiba como coletamos, utilizamos e protegemos seus dados pessoais em conformidade com a LGPD.",
    images: ["/images/Compartilhamento/og-image.webp"],
  },
  alternates: {
    canonical: "/privacidade",
    languages: { "pt-BR": "https://www.berkahn.com.br/privacidade" },
  },
};

const LINK_CLASSES =
  "underline underline-offset-2 hover:text-black/70 transition-colors";

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

export default function PrivacidadePage() {
  return (
    <LegalPageLayout
      title="Política de Privacidade"
      lastUpdated="agosto de 2026"
      introContent={
        <>
          <p>
            A Construtora Berkahn (&quot;Berkahn&quot;, &quot;nós&quot;) leva a
            proteção dos seus dados pessoais a sério. Esta Política de
            Privacidade explica como coletamos, utilizamos, armazenamos e
            protegemos as informações que você nos fornece ao acessar o site
            berkahn.com.br, em conformidade com a Lei Geral de Proteção de Dados
            Pessoais (Lei nº 13.709/2018 — LGPD) e demais normas aplicáveis.
          </p>
          <p>
            Ao utilizar nosso site, você declara estar ciente das práticas
            descritas nesta política.
          </p>
        </>
      }
      sections={[
        {
          number: 1,
          title: "Dados que coletamos",
          content: (
            <p>
              Coletamos dados pessoais que você nos fornece voluntariamente nas
              seguintes situações:
            </p>
          ),
          subSections: [
            {
              id: "1.1",
              title: "Dados fornecidos por você",
              content: (
                <>
                  <p>
                    <strong className="font-semibold">
                      Formulário de solicitação de orçamento
                    </strong>{" "}
                    — ao solicitar um orçamento pelo site, coletamos informações
                    como nome, e-mail, telefone e detalhes sobre o projeto
                    desejado. Esses dados são utilizados exclusivamente para
                    responder à sua solicitação e dar andamento ao atendimento
                    comercial.
                  </p>
                  <p>
                    <strong className="font-semibold">
                      Cadastro na newsletter
                    </strong>{" "}
                    — ao se inscrever em nossa newsletter, coletamos seu nome e
                    endereço de e-mail para envio periódico de conteúdos sobre
                    construção, Light Steel Frame e novidades da Berkahn. Você
                    pode cancelar o recebimento a qualquer momento através do
                    link de descadastro presente em cada e-mail enviado.
                  </p>
                  <p>
                    <strong className="font-semibold">
                      Download de materiais
                    </strong>{" "}
                    â€” quando um material solicita e-mail, registramos o endereço
                    e o recurso escolhido para liberar o download e medir o
                    interesse naquele conteúdo. O envio não inscreve você
                    automaticamente na newsletter.
                  </p>
                </>
              ),
            },
            {
              id: "1.2",
              title: "Dados coletados automaticamente",
              content: (
                <p>
                  Quando você acessa nosso site, algumas informações são
                  coletadas automaticamente por meio de cookies e tecnologias
                  similares. Esses dados incluem endereço IP, tipo de navegador,
                  sistema operacional, páginas visitadas, tempo de permanência,
                  origem do acesso e interações com elementos do site. Essas
                  informações não identificam você individualmente e são
                  utilizadas para melhorar a experiência de navegação e
                  compreender como nosso site é utilizado.
                </p>
              ),
            },
          ],
        },
        {
          number: 2,
          title: "Como utilizamos seus dados",
          content: (
            <>
              <p>
                Os dados pessoais coletados são utilizados para as seguintes
                finalidades:
              </p>
              <CheckList
                items={[
                  "Responder solicitações de orçamento e manter contato comercial com potenciais clientes.",
                  "Enviar conteúdos informativos por e-mail aos assinantes da newsletter.",
                  "Liberar materiais solicitados e registrar o interesse no conteúdo escolhido.",
                  "Analisar o comportamento de navegação no site para melhorar a experiência do usuário, identificar problemas técnicos e aprimorar nossos conteúdos.",
                  "Cumprir obrigações legais e regulatórias quando aplicável.",
                ]}
              />
              <p>
                Não utilizamos seus dados para finalidades diferentes das
                descritas acima sem o seu consentimento prévio.
              </p>
            </>
          ),
        },
        {
          number: 3,
          title: "Cookies e tecnologias de rastreamento",
          content: (
            <p>
              Nosso site utiliza cookies e tecnologias similares para coletar
              dados de navegação. Cookies são pequenos arquivos de texto
              armazenados no seu dispositivo que permitem reconhecer seu
              navegador e registrar determinadas informações sobre sua visita.
            </p>
          ),
          subSections: [
            {
              id: "3.1",
              title: "Ferramentas que utilizamos",
              content: (
                <>
                  <p>
                    <strong className="font-semibold">
                      Google Analytics 4 (GA4)
                    </strong>{" "}
                    — utilizado para análise de tráfego e comportamento dos
                    visitantes. O GA4 coleta dados como páginas visitadas,
                    duração das sessões, origem do acesso e tipo de dispositivo.
                    Esses dados são processados de forma agregada e nos ajudam a
                    entender como o site é utilizado. Para mais informações,
                    consulte a{" "}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK_CLASSES}
                    >
                      Política de Privacidade do Google
                    </a>
                    .
                  </p>
                  <p>
                    <strong className="font-semibold">
                      Google Search Console
                    </strong>{" "}
                    — ferramenta utilizada para monitorar o desempenho do site
                    nos resultados de busca do Google. Não coleta dados pessoais
                    dos visitantes diretamente, mas nos fornece informações
                    agregadas sobre as buscas que levam ao nosso site.
                  </p>
                  <p>
                    <strong className="font-semibold">PostHog</strong> —
                    plataforma de análise de produto que utilizamos para
                    compreender como os visitantes interagem com o site. O
                    PostHog pode registrar cliques, rolagem de página e navegação
                    entre páginas. Para mais informações, consulte a{" "}
                    <a
                      href="https://posthog.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK_CLASSES}
                    >
                      Política de Privacidade do PostHog
                    </a>
                    .
                  </p>
                  <p>
                    <strong className="font-semibold">Hotjar</strong> —
                    ferramenta de análise de experiência do usuário que registra
                    mapas de calor, gravações de sessão e pesquisas de feedback.
                    O Hotjar anonimiza dados sensíveis automaticamente e não
                    coleta informações de identificação pessoal sem
                    consentimento. Para mais informações, consulte a{" "}
                    <a
                      href="https://www.hotjar.com/privacy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK_CLASSES}
                    >
                      Política de Privacidade do Hotjar
                    </a>
                    .
                  </p>
                </>
              ),
            },
            {
              id: "3.2",
              title: "Gerenciamento de cookies",
              content: (
                <p>
                  Você pode gerenciar suas preferências de cookies a qualquer
                  momento através do banner de cookies exibido no site ou pelas
                  configurações do seu navegador. A desativação de determinados
                  cookies pode afetar funcionalidades do site.
                </p>
              ),
            },
          ],
        },
        {
          number: 4,
          title: "Armazenamento e segurança dos dados",
          content: (
            <>
              <p>
                Os dados pessoais de solicitações comerciais são armazenados no
                Supabase, que é a fonte operacional única desses registros.
                Google Sheets e Apps Script não participam da captura. Alertas
                operacionais opcionais usam Web Push sem nome, e-mail, telefone,
                mensagem ou outros dados pessoais. Adotamos medidas técnicas e
                organizacionais adequadas para proteger seus dados.
              </p>
              <p>
                Leads não convertidos e sem atualização por 24 meses são
                anonimizados, incluindo notas, dados pessoais em orçamentos ou
                propostas vinculados e arquivos relacionados. Registros
                convertidos ou documentos sujeitos a obrigação legal podem ser
                preservados pelo prazo aplicável, com exceção documentada.
                Dados de newsletter são mantidos enquanto durar sua inscrição.
                Dados de navegação seguem as políticas de cada ferramenta.
              </p>
            </>
          ),
        },
        {
          number: 5,
          title: "Compartilhamento de dados",
          content: (
            <>
              <p>
                A Berkahn não vende, aluga ou compartilha seus dados pessoais com
                terceiros para fins comerciais.
              </p>
              <p>
                Seus dados podem ser compartilhados apenas com os provedores das
                ferramentas descritas na seção 3 deste documento, estritamente
                para viabilizar os serviços de análise e comunicação que
                utilizamos. Esses provedores atuam como operadores de dados e
                estão sujeitos às suas próprias políticas de privacidade,
                referenciadas acima.
              </p>
              <p>
                Em caso de obrigação legal ou requisição de autoridade
                competente, poderemos compartilhar dados conforme exigido pela
                legislação vigente.
              </p>
            </>
          ),
        },
        {
          number: 6,
          title: "Seus direitos",
          content: (
            <>
              <p>
                A LGPD garante a você, titular dos dados, os seguintes direitos
                em relação aos seus dados pessoais:
              </p>
              <CheckList
                items={[
                  "Confirmação da existência de tratamento de dados.",
                  "Acesso aos dados pessoais que mantemos sobre você.",
                  "Correção de dados incompletos, inexatos ou desatualizados.",
                  "Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a LGPD.",
                  "Portabilidade dos dados a outro fornecedor de serviço.",
                  "Eliminação dos dados tratados com base no seu consentimento.",
                  "Informação sobre com quem seus dados foram compartilhados.",
                  "Revogação do consentimento a qualquer momento.",
                ]}
              />
              <p>
                Para exercer qualquer um desses direitos, entre em contato com
                nosso Encarregado de Proteção de Dados pelos canais indicados na
                seção 8 desta política.
              </p>
            </>
          ),
        },
        {
          number: 7,
          title: "Alterações nesta política",
          content: (
            <p>
              Esta Política de Privacidade pode ser atualizada periodicamente
              para refletir mudanças em nossas práticas ou em exigências legais.
              Qualquer alteração relevante será comunicada por meio do nosso
              site. Recomendamos que você consulte esta página regularmente.
            </p>
          ),
        },
      ]}
      contactSection={{
        sectionNumber: 8,
        title: "Contato e Encarregado de Proteção de Dados",
        contact: {
          role: "Encarregado de Proteção de Dados",
          name: "Matheus Bertevello",
          email: "contato.berkahn@gmail.com",
          phone: "+55 (11) 96641-5742",
          introText:
            "Para dúvidas, solicitações ou reclamações relacionadas a esta Política de Privacidade ou ao tratamento dos seus dados pessoais, entre em contato com o Encarregado de Proteção de Dados da Berkahn:",
        },
      }}
    />
  );
}
