// ---------------------------------------------------------------------------
// Perguntas Frequentes — Dados centralizados
// ---------------------------------------------------------------------------

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  label: string;
  questions: FAQItem[];
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: "tecnologia",
    label: "Tecnologia Steel Frame",
    questions: [
      {
        question: "O que é Light Steel Frame?",
        answer:
          "Light Steel Frame (LSF) é um sistema construtivo industrializado que utiliza perfis de aço galvanizado leve como estrutura principal. As paredes, pisos e coberturas são formados por painéis pré-fabricados com alta precisão dimensional, preenchidos com isolamento termoacústico e fechados com placas (cimentícias, OSB, gesso acartonado). O resultado é uma construção até 70% mais rápida que a alvenaria, com menos desperdício, maior eficiência energética e durabilidade comprovada superior a 90 anos.",
      },
      {
        question: "O aço do Steel Frame enferruja?",
        answer:
          "O aço utilizado no Steel Frame recebe galvanização a quente com camada de zinco (mínimo Z275, equivalente a 275 g/m² conforme NBR 15253), que cria uma barreira protetora contra umidade. Os perfis ficam dentro de uma cavidade protegida entre as placas de fechamento, sem exposição às intempéries. Estudos do IPT (Instituto de Pesquisas Tecnológicas) comprovam vida útil superior a 90 anos em estruturas adequadamente executadas. Para regiões litorâneas (até 2 km da costa), utiliza-se galvanização reforçada Z350.",
      },
      {
        question: "Uma casa em Steel Frame é segura contra incêndios?",
        answer:
          "Os perfis de aço galvanizado são incombustíveis e não alimentam chamas. Os materiais de isolamento (lã de vidro, lã de rocha, gesso acartonado) também são não combustíveis. Configurações de paredes em Steel Frame atingem resistência ao fogo de 30 a 180 minutos, dependendo da composição. Existem versões específicas de placas de gesso com resistência ao fogo (tipo RF) que aumentam essa proteção. Na prática, o Steel Frame tem resistência ao fogo igual ou maior que a alvenaria convencional.",
      },
      {
        question: "A casa resiste a ventos fortes e tempestades?",
        answer:
          "A norma brasileira exige que edificações residenciais suportem ventos de 144 km/h. Estruturas em Steel Frame são dimensionadas para resistir a ventos de até 200 a 300 km/h, mais que o dobro da exigência. A estrutura leve mas totalmente interconectada, com cada junta parafusada, distribui as forças de vento por todo o esqueleto estrutural. Além disso, a estrutura metálica funciona como uma gaiola de Faraday, conduzindo descargas atmosféricas com segurança ao redor dos ocupantes.",
      },
      {
        question: "Posso pendurar quadros, TV e armários nas paredes?",
        answer:
          "Todas as paredes externas recebem placas OSB que suportam cargas distribuídas. Para paredes internas em drywall, buchas específicas para gesso suportam até 50 kg por ponto de fixação, suficiente para quadros, prateleiras e objetos decorativos. Para itens mais pesados como TVs, armários de cozinha e suportes de banheiro, a fixação é feita diretamente nos perfis de aço. A equipe de construção fornece um mapeamento da estrutura por trás das paredes, facilitando futuras fixações.",
      },
      {
        question: "Steel Frame x Wood Frame: qual a diferença?",
        answer:
          "Ambos são sistemas construtivos industrializados com painéis estruturais, mas diferem no material principal. O Steel Frame usa perfis de aço galvanizado, enquanto o Wood Frame usa montantes de madeira tratada. O Steel Frame tem vantagens em durabilidade (aço galvanizado resiste a cupins, fungos e umidade), precisão dimensional (perfis fabricados em máquinas CNC), resistência ao fogo (aço é incombustível) e reciclabilidade (100% do aço pode ser reciclado). O Wood Frame pode ter custo inicial menor em regiões com madeira abundante, mas exige tratamento constante contra pragas e umidade. No Brasil, o Steel Frame tem regulamentação mais consolidada com a NBR 16970.",
      },
    ],
  },
  {
    id: "processo",
    label: "Projeto e Processo",
    questions: [
      {
        question: "Como funciona o primeiro contato com a Berkahn?",
        answer:
          "O primeiro passo é uma conversa inicial, que pode ser por telefone, WhatsApp ou e-mail. Nela, entendemos suas necessidades: tipo de projeto (casa, comércio, ampliação), localização do terreno, metragem estimada e expectativas de prazo e investimento. Em seguida, agendamos uma visita técnica ao terreno (quando aplicável) e apresentamos uma proposta preliminar com escopo, cronograma estimado e faixa de investimento. Não há compromisso nessa etapa — é uma conversa para alinhar expectativas dos dois lados.",
      },
      {
        question: "Quanto tempo leva do projeto à entrega?",
        answer:
          "O prazo total depende da complexidade e metragem do projeto. Como referência: uma residência de 150 m² pode ficar pronta em 4 a 6 meses, incluindo projeto, fabricação e montagem. Projetos comerciais de porte médio ficam entre 3 e 5 meses. A fase de projeto e aprovações geralmente leva de 30 a 60 dias, e a execução da obra em si é 50 a 70% mais rápida que na construção convencional. O cronograma detalhado é definido na fase de planejamento e compartilhado com o cliente antes do início da obra.",
      },
      {
        question: "Preciso ter terreno para iniciar?",
        answer:
          "Sim, o terreno é necessário para o desenvolvimento do projeto executivo, já que a topografia, o solo e a orientação solar influenciam diretamente nas decisões de projeto. No entanto, podemos iniciar conversas e estudos preliminares mesmo antes da aquisição do terreno. Se você está avaliando terrenos, nossa equipe pode orientar sobre aspectos técnicos que impactam a construção em Steel Frame, como tipo de solo, acessibilidade e regulamentações locais.",
      },
      {
        question: "A Berkahn faz o projeto arquitetônico ou só executa a obra?",
        answer:
          "Nosso cenário ideal é acompanhar o projeto do início ao fim, desde a concepção até a entrega. Mas nos adaptamos à necessidade de cada cliente. Se você já possui projetos arquitetônico e complementares definidos, podemos atuar exclusivamente na execução da obra com nossa mão de obra especializada e certificada em Steel Frame. Também oferecemos consultoria técnica para validar projetos existentes antes da execução, garantindo que sejam compatíveis com o sistema construtivo.",
      },
      {
        question: "O que significa 'planejamento detalhado' no Steel Frame?",
        answer:
          "O Steel Frame exige que todas as decisões de projeto sejam tomadas antes da fabricação dos componentes. Isso inclui: localização exata de pontos elétricos e hidráulicos, tipo de revestimento de cada parede, posição de portas e janelas, e especificação de acabamentos. Cada definição entra no projeto antes de qualquer peça ser produzida. Essa disciplina pode parecer exigente, mas é justamente o que garante obra dentro do orçamento, sem surpresas e com prazo cumprido. Na prática, resulta em menos retrabalho e mais tranquilidade durante a execução.",
      },
    ],
  },
  {
    id: "financeiro",
    label: "Financeiro e Custos",
    questions: [
      {
        question: "Quanto custa construir em Steel Frame comparado à alvenaria?",
        answer:
          "O custo inicial por metro quadrado do Steel Frame é tipicamente 15 a 30% superior ao da alvenaria convencional. Porém, o custo inicial não conta a história completa. O Steel Frame oferece previsibilidade orçamentária com variação de apenas 3 a 5% (contra até 30% de estouro na alvenaria), economia de até 8% na fundação pelo menor peso estrutural, redução de 50 a 60% no prazo de obra (diminuindo custos indiretos como aluguel, supervisão e atrasos por chuva), e economia de 20 a 40% em climatização ao longo da vida útil do imóvel. Considerando o custo total de propriedade, o Steel Frame tende a ser mais econômico no longo prazo.",
      },
      {
        question: "É possível financiar uma casa em Steel Frame?",
        answer:
          "Desde 2022, com a norma ABNT NBR 16970, o Steel Frame é classificado como sistema construtivo \"convencional\" pela Caixa Econômica Federal. A Caixa financia até 80% do valor da construção em até 360 meses, com possibilidade de uso do FGTS. Não é mais necessário Documento de Avaliação Técnica (DATec) ou laudos especiais. Outros bancos como Bradesco, Itaú e Santander também oferecem linhas de crédito para construção em Steel Frame, geralmente exigindo que a execução seja feita por construtora certificada.",
      },
      {
        question: "Como funciona o orçamento da Berkahn?",
        answer:
          "Após a fase de projeto e definição do escopo, apresentamos um orçamento detalhado e fechado. O orçamento discrimina materiais, mão de obra, prazos e condições de pagamento. Uma das grandes vantagens do Steel Frame é a previsibilidade: como os componentes são fabricados sob medida, o desperdício é inferior a 5% e imprevistos de obra são raros. O orçamento que apresentamos é o que se cumpre, com variação máxima de 3 a 5%, muito abaixo dos 20 a 30% comuns na construção convencional.",
      },
      {
        question: "Quais as formas de pagamento?",
        answer:
          "O pagamento é estruturado em etapas vinculadas ao andamento da obra. Trabalhamos com uma entrada na assinatura do contrato e parcelas ao longo da execução, cada uma associada a uma entrega verificável (fundação concluída, estrutura montada, fechamento finalizado, acabamento entregue). Essa estrutura garante transparência e alinha o fluxo de pagamento ao progresso real da construção. As condições específicas são definidas em contrato de acordo com o porte e as características de cada projeto.",
      },
      {
        question: "O preço é fechado por m² ou por projeto completo?",
        answer:
          "Trabalhamos com orçamento por projeto completo, não por m². O custo por metro quadrado é uma referência útil para comparações iniciais, mas pode ser enganoso porque não considera a complexidade do projeto, o tipo de acabamento, as condições do terreno e outros fatores que impactam diretamente o custo real. O orçamento por projeto garante que o cliente saiba exatamente quanto vai investir, sem surpresas. Cada projeto recebe um orçamento personalizado que reflete suas especificidades.",
      },
    ],
  },
  {
    id: "pos-obra",
    label: "Pós-obra e Garantia",
    questions: [
      {
        question: "Qual a garantia da construção?",
        answer:
          "A Berkahn oferece garantia conforme a NBR 15575 (Norma de Desempenho de Edificações), que estabelece prazos de garantia por sistema: estrutura (mínimo 5 anos), vedações e revestimentos (2 a 3 anos), instalações elétricas e hidráulicas (1 a 3 anos), entre outros. Além da garantia formal, mantemos um canal de atendimento pós-obra para orientações sobre uso e manutenção. O aço galvanizado da estrutura tem vida útil comprovada superior a 90 anos, garantindo a solidez do investimento por gerações.",
      },
      {
        question: "Como funciona a manutenção de uma casa Steel Frame?",
        answer:
          "A manutenção de uma edificação em Steel Frame é similar ou mais simples que na alvenaria convencional. A estrutura de aço galvanizado é protegida dentro das paredes e não requer manutenção. Os cuidados se concentram nos acabamentos: pintura (a cada 5 a 7 anos), revisão de calhas e rufos (anual), manutenção de rejuntes (conforme uso) e verificação de vedações em esquadrias. O sistema não sofre com trincas por movimentação estrutural (comuns na alvenaria), o que reduz custos de manutenção ao longo do tempo.",
      },
      {
        question: "É possível fazer reformas e ampliações depois?",
        answer:
          "Por ser um sistema construtivo a seco, ampliações e reformas são mais limpas e rápidas que na alvenaria. Uma placa de gesso pode ser aberta com estilete, sem necessidade de demolição. Paredes não estruturais podem ser removidas ou reposicionadas facilmente. Adicionar um segundo pavimento é especialmente vantajoso porque as paredes em Steel Frame pesam aproximadamente 40 kg/m², quatro vezes menos que alvenaria, o que significa que a fundação existente pode frequentemente suportar a ampliação sem reforço. Durante reformas, os moradores podem muitas vezes continuar habitando o imóvel.",
      },
      {
        question: "O Steel Frame funciona em regiões litorâneas?",
        answer:
          "Para construções em regiões litorâneas (até 2 km da costa), utiliza-se galvanização reforçada Z350 (350 g/m² de zinco) nos perfis de aço, com proteção anticorrosiva superior à galvanização padrão Z275. O sistema de múltiplas camadas (placa cimentícia, manta hidrófuga, isolamento, gesso) mantém os perfis em uma cavidade totalmente protegida da maresia e da umidade salina. A combinação de galvanização reforçada com a proteção do envelope construtivo assegura durabilidade e desempenho estrutural mesmo em ambientes costeiros agressivos.",
      },
    ],
  },
  {
    id: "empresa",
    label: "Sobre a Berkahn",
    questions: [
      {
        question: "Onde a Berkahn atua?",
        answer:
          "A Berkahn atua principalmente no estado de São Paulo, com projetos na capital, região metropolitana, litoral e interior. Também avaliamos projetos em outros estados do Sudeste, dependendo do porte e localização. Para projetos fora da nossa área principal de atuação, realizamos uma análise de viabilidade logística antes de apresentar proposta, garantindo que possamos manter o mesmo padrão de qualidade e acompanhamento que entregamos nos projetos locais.",
      },
      {
        question: "Quais certificações e normas a Berkahn segue?",
        answer:
          "Nossos projetos seguem integralmente a ABNT NBR 16970 (norma dedicada ao Light Steel Frame, aprovada em 2022), a NBR 15253 (perfis de aço), a NBR 14762 (dimensionamento estrutural) e a NBR 15575 (desempenho de edificações). A equipe é certificada na execução de sistemas construtivos em Steel Frame, e todos os materiais utilizados são especificados conforme as normas técnicas vigentes. Com esse arcabouço normativo, o Steel Frame é classificado como sistema construtivo convencional, com acesso a financiamento bancário regular.",
      },
      {
        question: "A Berkahn trabalha com projetos comerciais e industriais?",
        answer:
          "Sim. Além de residências, executamos projetos comerciais (lojas, escritórios, showrooms), industriais (galpões, centros de distribuição, áreas técnicas), temporários (estandes, canteiros de obra) e reformas corporativas. O Steel Frame é especialmente vantajoso no contexto corporativo pela velocidade de execução (50 a 70% mais rápido), pela possibilidade de obra limpa e silenciosa em ambientes já ocupados, e pela flexibilidade de layout que permite adaptações futuras com intervenções mínimas.",
      },
    ],
  },
];

// Helper: flatten all FAQs for JSON-LD and search
export function getAllFAQItems(): FAQItem[] {
  return FAQ_CATEGORIES.flatMap((cat) => cat.questions);
}
