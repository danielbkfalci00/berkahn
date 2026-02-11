import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade | Berkahn",
  description:
    "Política de Privacidade da Construtora Berkahn. Saiba como coletamos, utilizamos e protegemos seus dados pessoais em conformidade com a LGPD.",
};

export default function PrivacidadePage() {
  return (
    <main className="pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Política de Privacidade
        </h1>
        <p className="text-black/50 text-sm mb-12">
          Última atualização: fevereiro de 2025
        </p>

        <div className="space-y-0">
          <p className="text-black/80 leading-relaxed mb-4">
            A Construtora Berkahn (&quot;Berkahn&quot;, &quot;nós&quot;) leva a
            proteção dos seus dados pessoais a sério. Esta Política de
            Privacidade explica como coletamos, utilizamos, armazenamos e
            protegemos as informações que você nos fornece ao acessar o site
            berkahn.com.br, em conformidade com a Lei Geral de Proteção de Dados
            Pessoais (Lei nº 13.709/2018 — LGPD) e demais normas aplicáveis.
          </p>
          <p className="text-black/80 leading-relaxed mb-4">
            Ao utilizar nosso site, você declara estar ciente das práticas
            descritas nesta política.
          </p>

          <hr className="border-t border-black/10 my-8" />

          {/* Seção 1 */}
          <h2 className="text-xl md:text-2xl font-semibold mt-12 mb-4">
            1. Dados que coletamos
          </h2>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            1.1 Dados fornecidos por você
          </h3>
          <p className="text-black/80 leading-relaxed mb-4">
            Coletamos dados pessoais que você nos fornece voluntariamente nas
            seguintes situações:
          </p>
          <p className="text-black/80 leading-relaxed mb-4">
            <strong className="font-semibold">
              Formulário de solicitação de orçamento
            </strong>{" "}
            — ao solicitar um orçamento pelo site, coletamos informações como
            nome, e-mail, telefone e detalhes sobre o projeto desejado. Esses
            dados são utilizados exclusivamente para responder à sua solicitação
            e dar andamento ao atendimento comercial.
          </p>
          <p className="text-black/80 leading-relaxed mb-4">
            <strong className="font-semibold">
              Cadastro na newsletter
            </strong>{" "}
            — ao se inscrever em nossa newsletter, coletamos seu nome e endereço
            de e-mail para envio periódico de conteúdos sobre construção, Light
            Steel Frame e novidades da Berkahn. Você pode cancelar o recebimento
            a qualquer momento através do link de descadastro presente em cada
            e-mail enviado.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            1.2 Dados coletados automaticamente
          </h3>
          <p className="text-black/80 leading-relaxed mb-4">
            Quando você acessa nosso site, algumas informações são coletadas
            automaticamente por meio de cookies e tecnologias similares. Esses
            dados incluem endereço IP, tipo de navegador, sistema operacional,
            páginas visitadas, tempo de permanência, origem do acesso e
            interações com elementos do site. Essas informações não identificam
            você individualmente e são utilizadas para melhorar a experiência de
            navegação e compreender como nosso site é utilizado.
          </p>

          <hr className="border-t border-black/10 my-8" />

          {/* Seção 2 */}
          <h2 className="text-xl md:text-2xl font-semibold mt-12 mb-4">
            2. Como utilizamos seus dados
          </h2>
          <p className="text-black/80 leading-relaxed mb-4">
            Os dados pessoais coletados são utilizados para as seguintes
            finalidades:
          </p>
          <p className="text-black/80 leading-relaxed mb-4">
            Responder solicitações de orçamento e manter contato comercial com
            potenciais clientes. Enviar conteúdos informativos por e-mail aos
            assinantes da newsletter. Analisar o comportamento de navegação no
            site para melhorar a experiência do usuário, identificar problemas
            técnicos e aprimorar nossos conteúdos. Cumprir obrigações legais e
            regulatórias quando aplicável.
          </p>
          <p className="text-black/80 leading-relaxed mb-4">
            Não utilizamos seus dados para finalidades diferentes das descritas
            acima sem o seu consentimento prévio.
          </p>

          <hr className="border-t border-black/10 my-8" />

          {/* Seção 3 */}
          <h2 className="text-xl md:text-2xl font-semibold mt-12 mb-4">
            3. Cookies e tecnologias de rastreamento
          </h2>
          <p className="text-black/80 leading-relaxed mb-4">
            Nosso site utiliza cookies e tecnologias similares para coletar dados
            de navegação. Cookies são pequenos arquivos de texto armazenados no
            seu dispositivo que permitem reconhecer seu navegador e registrar
            determinadas informações sobre sua visita.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            3.1 Ferramentas que utilizamos
          </h3>
          <p className="text-black/80 leading-relaxed mb-4">
            <strong className="font-semibold">Google Analytics 4 (GA4)</strong>{" "}
            — utilizado para análise de tráfego e comportamento dos visitantes. O
            GA4 coleta dados como páginas visitadas, duração das sessões, origem
            do acesso e tipo de dispositivo. Esses dados são processados de forma
            agregada e nos ajudam a entender como o site é utilizado. Para mais
            informações, consulte a{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-black/70 transition-colors"
            >
              Política de Privacidade do Google
            </a>
            .
          </p>
          <p className="text-black/80 leading-relaxed mb-4">
            <strong className="font-semibold">Google Search Console</strong> —
            ferramenta utilizada para monitorar o desempenho do site nos
            resultados de busca do Google. Não coleta dados pessoais dos
            visitantes diretamente, mas nos fornece informações agregadas sobre
            as buscas que levam ao nosso site.
          </p>
          <p className="text-black/80 leading-relaxed mb-4">
            <strong className="font-semibold">PostHog</strong> — plataforma de
            análise de produto que utilizamos para compreender como os visitantes
            interagem com o site. O PostHog pode registrar cliques, rolagem de
            página e navegação entre páginas. Para mais informações, consulte a{" "}
            <a
              href="https://posthog.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-black/70 transition-colors"
            >
              Política de Privacidade do PostHog
            </a>
            .
          </p>
          <p className="text-black/80 leading-relaxed mb-4">
            <strong className="font-semibold">Hotjar</strong> — ferramenta de
            análise de experiência do usuário que registra mapas de calor,
            gravações de sessão e pesquisas de feedback. O Hotjar anonimiza dados
            sensíveis automaticamente e não coleta informações de identificação
            pessoal sem consentimento. Para mais informações, consulte a{" "}
            <a
              href="https://www.hotjar.com/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-black/70 transition-colors"
            >
              Política de Privacidade do Hotjar
            </a>
            .
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            3.2 Gerenciamento de cookies
          </h3>
          <p className="text-black/80 leading-relaxed mb-4">
            Você pode gerenciar suas preferências de cookies a qualquer momento
            através do banner de cookies exibido no site ou pelas configurações
            do seu navegador. A desativação de determinados cookies pode afetar
            funcionalidades do site.
          </p>

          <hr className="border-t border-black/10 my-8" />

          {/* Seção 4 */}
          <h2 className="text-xl md:text-2xl font-semibold mt-12 mb-4">
            4. Armazenamento e segurança dos dados
          </h2>
          <p className="text-black/80 leading-relaxed mb-4">
            Os dados pessoais coletados são armazenados em plataformas seguras,
            incluindo Google Workspace (Google Sheets), PostHog e Supabase.
            Adotamos medidas técnicas e organizacionais adequadas para proteger
            seus dados contra acesso não autorizado, perda, destruição ou
            qualquer forma de tratamento inadequado.
          </p>
          <p className="text-black/80 leading-relaxed mb-4">
            O período de armazenamento varia conforme a finalidade da coleta.
            Dados de solicitações de orçamento são mantidos pelo tempo necessário
            para atendimento comercial e eventual formalização contratual. Dados
            de newsletter são mantidos enquanto durar sua inscrição. Dados de
            navegação coletados por cookies seguem as políticas de retenção de
            cada ferramenta utilizada.
          </p>

          <hr className="border-t border-black/10 my-8" />

          {/* Seção 5 */}
          <h2 className="text-xl md:text-2xl font-semibold mt-12 mb-4">
            5. Compartilhamento de dados
          </h2>
          <p className="text-black/80 leading-relaxed mb-4">
            A Berkahn não vende, aluga ou compartilha seus dados pessoais com
            terceiros para fins comerciais.
          </p>
          <p className="text-black/80 leading-relaxed mb-4">
            Seus dados podem ser compartilhados apenas com os provedores das
            ferramentas descritas na seção 3 deste documento, estritamente para
            viabilizar os serviços de análise e comunicação que utilizamos. Esses
            provedores atuam como operadores de dados e estão sujeitos às suas
            próprias políticas de privacidade, referenciadas acima.
          </p>
          <p className="text-black/80 leading-relaxed mb-4">
            Em caso de obrigação legal ou requisição de autoridade competente,
            poderemos compartilhar dados conforme exigido pela legislação
            vigente.
          </p>

          <hr className="border-t border-black/10 my-8" />

          {/* Seção 6 */}
          <h2 className="text-xl md:text-2xl font-semibold mt-12 mb-4">
            6. Seus direitos
          </h2>
          <p className="text-black/80 leading-relaxed mb-4">
            A LGPD garante a você, titular dos dados, os seguintes direitos em
            relação aos seus dados pessoais:
          </p>
          <p className="text-black/80 leading-relaxed mb-4">
            Confirmação da existência de tratamento de dados. Acesso aos dados
            pessoais que mantemos sobre você. Correção de dados incompletos,
            inexatos ou desatualizados. Anonimização, bloqueio ou eliminação de
            dados desnecessários ou tratados em desconformidade com a LGPD.
            Portabilidade dos dados a outro fornecedor de serviço. Eliminação dos
            dados tratados com base no seu consentimento. Informação sobre com
            quem seus dados foram compartilhados. Revogação do consentimento a
            qualquer momento.
          </p>
          <p className="text-black/80 leading-relaxed mb-4">
            Para exercer qualquer um desses direitos, entre em contato com nosso
            Encarregado de Proteção de Dados pelos canais indicados na seção 8
            desta política.
          </p>

          <hr className="border-t border-black/10 my-8" />

          {/* Seção 7 */}
          <h2 className="text-xl md:text-2xl font-semibold mt-12 mb-4">
            7. Alterações nesta política
          </h2>
          <p className="text-black/80 leading-relaxed mb-4">
            Esta Política de Privacidade pode ser atualizada periodicamente para
            refletir mudanças em nossas práticas ou em exigências legais.
            Qualquer alteração relevante será comunicada por meio do nosso site.
            Recomendamos que você consulte esta página regularmente.
          </p>

          <hr className="border-t border-black/10 my-8" />

          {/* Seção 8 */}
          <h2 className="text-xl md:text-2xl font-semibold mt-12 mb-4">
            8. Contato e Encarregado de Proteção de Dados
          </h2>
          <p className="text-black/80 leading-relaxed mb-4">
            Para dúvidas, solicitações ou reclamações relacionadas a esta
            Política de Privacidade ou ao tratamento dos seus dados pessoais,
            entre em contato com o Encarregado de Proteção de Dados da Berkahn:
          </p>
          <p className="text-black/80 leading-relaxed mb-1">
            <strong className="font-semibold">Encarregado:</strong> Matheus
            Bertevello
          </p>
          <p className="text-black/80 leading-relaxed mb-1">
            <strong className="font-semibold">E-mail:</strong>{" "}
            contato.berkahn@gmail.com
          </p>
          <p className="text-black/80 leading-relaxed mb-4">
            <strong className="font-semibold">Telefone / WhatsApp:</strong> +55
            (11) 96641-5742
          </p>

          <hr className="border-t border-black/10 my-8" />

          {/* Footer do documento */}
          <div className="text-black/50 text-sm space-y-1 mt-12">
            <p>
              <strong className="font-semibold text-black/70">
                Construtora Berkahn
              </strong>
            </p>
            <p>CNPJ: 39.455.932/0001-64</p>
            <p>São Paulo, SP — Brasil</p>
            <p>berkahn.com.br</p>
            <p className="mt-4">
              © 2026 Berkahn. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
