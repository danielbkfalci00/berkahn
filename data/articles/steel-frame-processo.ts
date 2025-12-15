import { RichArticle } from "@/types/article";

export const steelFrameProcessoArticle: RichArticle = {
  slug: "passo-passo-construcao-steel-frame",
  title: "Passo a Passo: Como Funciona a Construção em Steel Frame",
  subtitle: "Do projeto à entrega: conheça as 11 etapas da construção industrializada",
  category: "Tecnologia",
  author: "Equipe Berkahn",
  publishDate: "2024-12-15",
  readTime: 18,
  heroImage: "https://images.unsplash.com/photo-1503387838067-dab8fce807b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  excerpt: "Guia completo com 11 etapas detalhadas da construção em Steel Frame: do planejamento aos acabamentos finais. Cronograma, normas ABNT e comparativo com alvenaria tradicional.",

  stats: [
    {
      value: 60,
      suffix: "%",
      label: "Redução de prazo",
      description: "vs construção em alvenaria"
    },
    {
      value: 99,
      suffix: "%",
      label: "Construção seca",
      description: "eliminando tempo de cura"
    },
    {
      value: 1,
      suffix: "–5%",
      label: "Desperdício máximo",
      description: "vs 20–25% da alvenaria"
    },
    {
      value: 250,
      suffix: " kg/m²",
      label: "Estrutura leve",
      description: "5× mais leve que alvenaria"
    },
    {
      value: 30,
      suffix: "%",
      label: "Economia fundações",
      description: "devido ao baixo peso"
    },
    {
      value: 100,
      suffix: " anos",
      label: "Durabilidade projetada",
      description: "vida útil do sistema"
    }
  ],

  tables: [
    {
      id: "cronograma-comparativo",
      caption: "Comparativo de prazos: Steel Frame vs Alvenaria Tradicional (Casa 100m²)",
      headers: ["Etapa", "Steel Frame", "Alvenaria Tradicional"],
      highlightColumn: 1,
      rows: [
        ["Projeto completo", "40–50 dias", "40–50 dias"],
        ["Fundação", "3 dias + 30 dias cura", "15–30 dias"],
        ["Estrutura", "15–60 dias", "60–90 dias"],
        ["Cobertura", "7–15 dias", "15–20 dias"],
        ["Vedações internas", "15–30 dias", "35–50 dias"],
        ["Instalações", "10–20 dias", "20–30 dias"],
        ["Acabamentos", "30–90 dias", "45–120 dias"],
        ["TOTAL", "90–120 dias (3–4 meses)", "240–360 dias (8–12 meses)"]
      ]
    }
  ],

  process: [
    {
      number: 0,
      title: "Planejamento e Projeto Executivo",
      shortTitle: "Planejamento",
      description: "Desenvolvimento do projeto arquitetônico compatibilizado, projeto estrutural com memória de cálculo conforme NBR 16970:2022, projetos hidráulico e elétrico integrados. Modulação estrutural em múltiplos de 40cm ou 60cm. Custo: R$ 70–100/m² | Prazo: 40–50 dias",
      duration: "40–50 dias"
    },
    {
      number: 1,
      title: "Preparação do Terreno com Precisão Topográfica",
      shortTitle: "Terreno",
      description: "Limpeza, terraplanagem e nivelamento do solo com remoção de vegetação. Sondagem SPT obrigatória (mínimo 2 furos em terrenos de 300m²). Locação com precisão milimétrica — qualquer erro no esquadro compromete toda montagem. Instalações provisórias de água, energia e banheiro.",
      duration: "3–7 dias"
    },
    {
      number: 2,
      title: "Fundação Radier como Base Ideal",
      shortTitle: "Fundação",
      description: "Execução de laje de concreto armado (radier) com espessura de 12–15cm em malha dupla. Preparação e compactação do solo, lastro de brita, impermeabilização com lona plástica, instalação de tubulações hidráulicas e eletrodutos, armação sobre espaçadores, concretagem nivelada. Aterramento elétrico aproveita as próprias armaduras (economia 10–20×). Execução: 2–3 dias | Cura: 28–30 dias (paralelo à fabricação).",
      duration: "1–2 dias execução + 28–30 dias cura"
    },
    {
      number: 3,
      title: "Fabricação Industrial dos Perfis com Tecnologia CNC",
      shortTitle: "Fabricação",
      description: "Produção em fábrica de perfis galvanizados (montantes 'Ue' tipo C, guias 'U') utilizando perfiladeiras CNC. Espessuras de 0,80–3,00mm (padrão 0,95mm), galvanização Z275 (Z350 em regiões litorâneas). Pré-corte, pré-furação e identificação por painel. Desperdício zero — perfeição milimétrica. Casa 100m²: 5–10 dias | Executado paralelamente à cura da fundação.",
      duration: "5–10 dias (paralelo)"
    },
    {
      number: 4,
      title: "Montagem da Estrutura Metálica Tipo 'Lego'",
      shortTitle: "Montagem",
      description: "Fixação de guias inferiores no radier (chumbadores químicos/mecânicos, espaçamento 80–120cm). Manta asfáltica entre concreto e perfis (barreira térmica/umidade). Posicionamento de montantes a cada 40–60cm. Guias superiores fecham os painéis, vergas sobre aberturas. Contraventamento em 'X' ou placas OSB garantem rigidez lateral. Conexões 100% parafusadas (sem solda). Equipe: 4–6 montadores | Prazo: 15–60 dias conforme complexidade.",
      duration: "15–60 dias"
    },
    {
      number: 5,
      title: "Fechamento Externo com Múltiplas Camadas",
      shortTitle: "Fechamento Ext.",
      description: "Aplicação de placas OSB (11,1mm mínimo) como contraventamento estrutural. Membrana hidrófuga (Tyvek) envolvendo a edificação — impede água mas permite saída de vapor (evita mofo). Sobreposição mínima 15cm, fixação a cada 35cm. Acabamento externo com placas cimentícias (10–12mm), siding vinílico, EIFS ou réguas SmartSide. Tempo: 10–20 dias.",
      duration: "10–20 dias"
    },
    {
      number: 6,
      title: "Isolamento Termoacústico nas Cavidades",
      shortTitle: "Isolamento",
      description: "Preenchimento das cavidades entre montantes com lã de vidro (melhor custo-benefício), lã de rocha (resistência ao fogo) ou lã de PET (reciclável, sem EPI). Espessura padrão: 50mm (paredes internas) até 100mm (paredes externas). Parede com 50mm lã de vidro atinge 45dB de isolamento (acima de NBR 15575). Integrado ao fechamento externo | 3–7 dias adicionais.",
      duration: "3–7 dias"
    },
    {
      number: 7,
      title: "Fechamento Interno com Drywall",
      shortTitle: "Drywall",
      description: "Instalação de placas de gesso acartonado (1.200×1.800mm, espessura 12,5mm). Tipo ST (standard) em áreas secas, RU (verde, resistente umidade) em banheiros/cozinhas, RF (rosa, resistência fogo) em áreas técnicas. Tratamento de juntas crítico: aplicação de massa, fita microperfurada, cobertura progressiva com lixamento lixa 220. Níveis Q1–Q4 conforme acabamento final. Tempo: 5–15 dias.",
      duration: "5–15 dias"
    },
    {
      number: 8,
      title: "Instalações que Passam Livremente pela Estrutura",
      shortTitle: "Instalações",
      description: "Perfis chegam com furações padronizadas (NBR 15253) permitindo passagem sem quebrar paredes. Sistema PEX (polietileno reticulado) para hidráulica — flexível, até 95°C, instalação 10× mais rápida que PVC. Sistema 'ponto a ponto' com manifold central. Eletrodutos corrugados para cabeamento. Manutenção facilitada: 'shafts acessíveis' com alçapões no forro. Tempo: 10–20 dias (simultâneo ao fechamento externo).",
      duration: "10–20 dias"
    },
    {
      number: 9,
      title: "Cobertura com Estrutura Metálica Integrada",
      shortTitle: "Cobertura",
      description: "Estrutura de telhado em perfis galvanizados (tesouras pré-fabricadas ou caibros inclinados). Telhas Shingle (asfáltica com fibra vidro + grânulos cerâmicos) — apenas 31–33kg por pacote 3,1m², 100% estanqueidade, durabilidade 50 anos, garantia 25–30 anos. Alternativas: metálicas, termoacústicas tipo sanduíche, cerâmicas tradicionais. Execução: 7–15 dias.",
      duration: "7–15 dias"
    },
    {
      number: 10,
      title: "Acabamentos que Finalizam a Construção",
      shortTitle: "Acabamentos",
      description: "Pisos vinílicos/laminados (ideais por leveza e rapidez) ou porcelanatos/cerâmicas com argamassa adequada. Revestimentos de parede (texturas, pinturas, pedras naturais — verificando peso). Pintura interna sobre drywall com primer selador. Fixação de objetos pesados com buchas específicas ou reforços previstos em projeto. Louças sanitárias, metais, esquadrias, bancadas, armários. Prazo: 30–90 dias conforme padrão especificado.",
      duration: "30–90 dias"
    }
  ],

  norms: [
    {
      code: "NBR 16970:2022",
      title: "Edificações em Light Steel Frame — Requisitos de Desempenho",
      description: "Norma fundamental publicada em 2022, dividida em três partes: Parte 1 (desempenho e requisitos gerais), Parte 2 (projeto estrutural) e Parte 3 (interfaces entre sistemas). Estabelece requisitos de desempenho, critérios de projeto e especificações técnicas para edificações de até dois pavimentos em Light Steel Frame no Brasil.",
      year: "2022"
    },
    {
      code: "NBR 15253:2014",
      title: "Perfis de Aço Formados a Frio para Light Steel Frame",
      description: "Especifica perfis de aço galvanizado formados a frio utilizados em LSF. Define espessura mínima de 0,80mm, resistência ao escoamento mínima de 230 MPa, e galvanização mínima Z275 (275 g/m² de zinco), aumentada para Z350 em regiões litorâneas. Garante proteção anticorrosiva e durabilidade superior a 100 anos quando corretamente especificados.",
      year: "2014"
    },
    {
      code: "NBR 14762:2010",
      title: "Dimensionamento de Estruturas de Aço Formadas a Frio",
      description: "Estabelece procedimentos para dimensionamento de estruturas de aço constituídas por perfis formados a frio. Inclui cálculo de resistência, estabilidade, análise de flambagem local e distorcional, métodos de verificação e resistência ao escoamento. Norma essencial para engenheiros calculistas dimensionarem corretamente os perfis de Steel Frame.",
      year: "2010"
    }
  ],

  sections: [
    {
      id: "introducao",
      title: "Introdução",
      level: 2,
      content: "O Steel Frame revoluciona o modo de construir no Brasil, reduzindo prazos em até 60% e eliminando o tradicional 'quebra-quebra' das obras em alvenaria. Uma casa de 100m² que levaria 10 meses em construção convencional pode ser concluída em apenas 3 a 4 meses com este sistema industrializado. A diferença fundamental está no conceito de 'construção seca': enquanto a alvenaria utiliza água abundantemente em argamassas e concretos, o Steel Frame concentra 99% do processo em montagem de componentes pré-fabricados, sem depender de tempos de cura ou condições climáticas. Para construtores, engenheiros e proprietários, compreender cada etapa significa garantir qualidade, prever custos com precisão e evitar surpresas durante a execução."
    },
    {
      id: "diferenca-construcao-seca",
      title: "O que Diferencia a Construção Seca da Construção Úmida",
      level: 2,
      content: "A construção convencional em alvenaria é chamada de 'úmida' porque depende constantemente de água — no concreto das fundações, na argamassa de assentamento de blocos, no reboco das paredes. Esse processo gera 25% a 40% de desperdício de materiais e produz toneladas de entulho. Já o Steel Frame utiliza perfis de aço galvanizado fabricados industrialmente com precisão milimétrica, que chegam à obra prontos para montagem. O resultado é um desperdício de apenas 1% a 5%, canteiro limpo e cronograma previsível.\n\nA estrutura do Steel Frame pesa aproximadamente 250 kg/m², contra 1.250 kg/m² da alvenaria — cinco vezes mais leve. Essa diferença permite fundações simplificadas, geralmente um radier de 12 a 15 centímetros de espessura, representando economia de até 30% nesta etapa. Os perfis de aço galvanizado garantem durabilidade superior a 100 anos quando corretamente especificados, com proteção anticorrosiva de zinco conforme norma ABNT NBR 15253."
    },
    {
      id: "etapa-0",
      title: "Etapa 0: O Planejamento que Define o Sucesso da Obra",
      level: 2,
      content: "O projeto para Steel Frame exige abordagem diferente da construção convencional. Todas as decisões precisam ser tomadas antes da execução — não há espaço para improvisos como 'rasgar parede' para passar tubulações. O conceito de modulação estabelece espaçamento de 400mm ou 600mm entre os montantes verticais, otimizando o aproveitamento de placas industrializadas e garantindo eficiência estrutural.\n\nA documentação necessária inclui projeto arquitetônico compatibilizado, projeto estrutural com memória de cálculo elaborada por engenheiro especializado em Light Steel Frame, projetos hidráulico e elétrico integrados, e memorial descritivo com especificação de materiais. As normas ABNT que regem o sistema são a NBR 16970 (publicada em 2022, dividida em três partes: desempenho, projeto estrutural e interfaces entre sistemas), NBR 15253 (perfis de aço formados a frio) e NBR 14762 (dimensionamento estrutural).\n\nO custo do conjunto completo de projetos varia entre R$ 70 e R$ 100 por m², incluindo arquitetônico, estrutural, fundação, elétrico e hidráulico. O prazo de elaboração é de 40 a 50 dias para projetos de tamanho médio. ARTs (Anotação de Responsabilidade Técnica) para engenheiros via CREA e RRTs (Registro de Responsabilidade Técnica) para arquitetos via CAU são obrigatórias tanto para projeto quanto para execução."
    },
    {
      id: "etapa-1",
      title: "Etapa 1: Preparação do Terreno com Precisão Topográfica",
      level: 2,
      content: "A limpeza e terraplanagem seguem padrões similares à construção convencional, com remoção de vegetação e nivelamento do solo. A sondagem SPT (Standard Penetration Test) é obrigatória para dimensionar corretamente a fundação — para edificações de até 200m², são necessários no mínimo 2 furos, com custo médio de R$ 1.500 para terrenos de 300m².\n\nA locação da obra exige precisão milimétrica, diferentemente da alvenaria que tolera variações centimétricas. Os perfis chegam da fábrica cortados nas dimensões exatas do projeto — qualquer erro no esquadro da fundação compromete toda a montagem. O tempo típico para preparação do terreno é de 3 a 7 dias, incluindo instalações provisórias de água, energia e banheiro."
    },
    {
      id: "etapa-2",
      title: "Etapa 2: Fundação Radier como Base Ideal",
      level: 2,
      content: "O radier é a fundação mais utilizada em Steel Frame por combinar simplicidade, rapidez e economia. Trata-se de uma laje de concreto armado que abrange toda a área de construção, distribuindo cargas uniformemente sobre o solo. A espessura típica varia entre 12 e 15 centímetros, com armação em malha dupla de aço.\n\nO processo de execução segue sequência rigorosa: preparação e compactação do solo, aplicação de lastro de brita, instalação de lona plástica preta para impermeabilização, posicionamento de tubulações hidráulicas e eletrodutos (que passarão permanentemente sob o radier), instalação da armação sobre espaçadores, e finalmente a concretagem com acabamento nivelado.\n\nO sistema de aterramento elétrico pode utilizar as próprias armaduras do concreto como eletrodo, conforme NBR 5410 e NBR 5419, gerando economia de 10 a 20 vezes comparado ao aterramento externo com hastes. A execução do radier leva 2 a 3 dias, mas exige 28 a 30 dias de cura antes da montagem da estrutura metálica — período que permite a fabricação simultânea dos perfis na indústria."
    },
    {
      id: "etapa-3",
      title: "Etapa 3: Fabricação Industrial dos Perfis com Tecnologia CNC",
      level: 2,
      content: "A produção dos perfis acontece em ambiente fabril utilizando perfiladeiras CNC (Controle Numérico Computadorizado), como os sistemas FrameCAD. Bobinas de aço galvanizado são alimentadas nas máquinas, que executam automaticamente perfuração, corte, conformação e identificação das peças conforme projeto.\n\nOs principais tipos de perfis são o montante (Ue), com formato de 'C' enrijecido usado nas verticais estruturais, e a guia (U), com formato de 'U' simples utilizado na base e topo dos painéis. As espessuras variam de 0,80mm (mínimo normativo) a 3,00mm, sendo 0,95mm o padrão mais utilizado. A galvanização mínima é Z275 (275 g/m² de zinco), aumentada para Z350 em regiões litorâneas.\n\nOs perfis engenheirados chegam pré-cortados, pré-furados e etiquetados por painel, eliminando perdas e erros de medição em obra. A fabricação para uma casa de 100m² leva 5 a 10 dias, executada paralelamente à cura da fundação. Fornecedores de referência no Brasil incluem Barbieri, LP Brasil, Espaço Smart e Naframe."
    },
    {
      id: "etapa-4",
      title: "Etapa 4: Montagem da Estrutura Metálica Tipo 'Lego'",
      level: 2,
      content: "A montagem inicia com a fixação das guias inferiores no radier através de chumbadores químicos ou mecânicos (parabolts), espaçados entre 80 e 120 centímetros. Uma manta asfáltica é obrigatória entre o concreto e os perfis, funcionando como barreira de umidade e evitando ponte térmica.\n\nOs montantes verticais são posicionados no espaçamento definido em projeto — 400mm para cargas maiores ou 600mm como padrão compatível com placas de fechamento. A guia superior fecha o painel, e vergas são instaladas sobre aberturas de portas e janelas para distribuir cargas. O contraventamento garante rigidez lateral, podendo utilizar fitas de aço galvanizado em 'X' (Cruz de Santo André) tensionadas em ângulos de 30° a 60°, ou placas OSB estruturais.\n\nAs conexões são exclusivamente parafusadas — não há solda em Steel Frame. Parafusos autoperfurantes de cabeça lentilha são utilizados para uniões montante-guia, enquanto cabeça sextavada é empregada em reforços e treliças. A regra básica exige que o comprimento do parafuso ultrapasse a espessura total em 10 a 12mm, com no mínimo 3 fios de rosca sobressaindo.\n\nUma equipe de 4 a 6 montadores especializados consegue montar a estrutura de uma casa de 100m² em 15 a 60 dias, dependendo da complexidade arquitetônica. Ferramentas essenciais incluem parafusadeira com torque ajustável (0-2500 RPM), nível laser, tesoura de aviação e alicates de pressão tipo C."
    },
    {
      id: "etapa-5",
      title: "Etapa 5: Fechamento Externo com Múltiplas Camadas",
      level: 2,
      content: "O fechamento externo forma um 'sanduíche' de proteção composto por três camadas principais. Primeiro, placas OSB com espessura mínima de 11,1mm são fixadas aos montantes, cumprindo função estrutural de contraventamento. Dimensões padrão de 1.200 x 2.400mm garantem rendimento de 2,88m² por placa.\n\nA membrana hidrófuga (como Tyvek da DuPont) é aplicada sobre o OSB, envolvendo toda a edificação. Este material de polietileno de alta densidade impede a passagem de água líquida e vento, mas permite a saída de vapor interno — propriedade essencial para evitar mofo. A instalação segue do canto inferior para cima, com sobreposições de 150mm e fixação por grampos galvanizados a cada 350mm.\n\nO acabamento externo utiliza placas cimentícias com espessura de 10 a 12mm para fachadas. Fabricadas em cimento Portland com fibras de celulose, essas placas são resistentes à umidade, fogo e impactos, conforme NBR 15498. Alternativas incluem siding vinílico (PVC de baixa manutenção), sistema EIFS (isolamento térmico com acabamento monolítico) e réguas SmartSide com aspecto de madeira. O tempo de execução do fechamento externo é de 10 a 20 dias."
    },
    {
      id: "etapa-6",
      title: "Etapa 6: Isolamento Termoacústico nas Cavidades",
      level: 2,
      content: "Os espaços entre montantes recebem materiais isolantes que conferem ao Steel Frame desempenho térmico e acústico superior à alvenaria. A lã de vidro oferece melhor relação custo-benefício, composta por sílica fundida a 1400°C com 40-80% de vidro reciclado. A lã de rocha, derivada de rochas basálticas vulcânicas, proporciona melhor resistência ao fogo e amortecimento sonoro. A lã de PET, fabricada com fibras de poliéster reciclado (cerca de 35 garrafas por m²), dispensa equipamentos de proteção individual e é 100% reciclável.\n\nEspessuras de 50mm atendem paredes internas padrão, enquanto 75mm a 100mm são recomendadas para paredes externas e máximo conforto. Uma parede Steel Frame com 50mm de lã de vidro atinge 45dB de isolamento acústico, atendendo o nível mínimo da NBR 15575 para edificações habitacionais. A instalação é integrada ao fechamento, levando 3 a 7 dias adicionais."
    },
    {
      id: "etapa-7",
      title: "Etapa 7: Fechamento Interno com Drywall",
      level: 2,
      content: "O drywall (gesso acartonado) é o padrão para fechamento interno, oferecendo superfícies perfeitamente planas e prontas para pintura. Três tipos de placas atendem diferentes ambientes: ST (branca) para áreas secas como salas e quartos, RU (verde) com tratamento contra umidade para banheiros e cozinhas, e RF (rosa) com fibra de vidro para resistência ao fogo em áreas técnicas.\n\nA espessura padrão é 12,5mm, com dimensões de 1.200 x 1.800mm. A fixação utiliza parafusos específicos de cabeça trombeta. O tratamento de juntas é crítico para qualidade do acabamento: aplicação de massa específica para drywall, posicionamento de fita de papel microperfurado centralizada, cobertura com camadas adicionais de massa (secagem entre demãos), e lixamento final com lixa grão 220. Cantoneiras metálicas protegem ângulos externos de 90°.\n\nOs níveis de acabamento variam conforme o revestimento final pretendido — Q1 para revestimentos espessos como cerâmica, Q3 para pintura acetinada, Q4 para pintura brilhante. O tempo de execução do drywall é de 5 a 15 dias dependendo da metragem."
    },
    {
      id: "etapa-8",
      title: "Etapa 8: Instalações que Passam Livremente pela Estrutura",
      level: 2,
      content: "As instalações elétricas e hidráulicas representam uma das maiores vantagens do Steel Frame. Os perfis chegam com furações padronizadas de fábrica, dimensionadas conforme NBR 15253, permitindo passagem livre de conduítes e tubulações. Não há necessidade de quebrar paredes — as instalações são simplesmente passadas pelos vazios entre montantes antes do fechamento interno.\n\nO sistema PEX (polietileno reticulado) é preferido para instalações hidráulicas por sua flexibilidade, resistência térmica até 95°C e instalação 10 vezes mais rápida que PVC convencional. O sistema 'ponto a ponto' com manifold central distribui água para cada ponto individualmente, eliminando conexões intermediárias e facilitando manutenções futuras.\n\nA facilidade de manutenção é outro diferencial: as paredes funcionam como 'shafts acessíveis', permitindo localização clara no projeto e troca de tubulações sem demolição. Bastam alçapões no forro de drywall para acesso. O tempo de execução das instalações é de 10 a 20 dias, executado simultaneamente ao fechamento externo."
    },
    {
      id: "etapa-9",
      title: "Etapa 9: Cobertura com Estrutura Metálica Integrada",
      level: 2,
      content: "A estrutura do telhado utiliza os mesmos perfis galvanizados das paredes, formando tesouras metálicas pré-fabricadas para vãos maiores ou caibros inclinados para estruturas mais simples. Espessuras de chapa variam entre 0,75mm e 1,25mm, com resistência ao escoamento mínima de 300 MPa.\n\nA telha Shingle é a mais utilizada em Steel Frame, composta por manta asfáltica com fibra de vidro e grânulos cerâmicos. Pesa apenas 31-33kg por pacote (3,1m²), sendo 4 vezes mais leve que telhas cerâmicas tradicionais. Oferece 100% de estanqueidade, resistência a UV e ventos, com durabilidade de até 50 anos e garantia de 25-30 anos. O sistema completo inclui base de OSB, subcobertura impermeabilizante e telhas Shingle.\n\nOutras opções compatíveis incluem telhas metálicas/galvalume (instalação rápida), termoacústicas tipo sanduíche (isolamento integrado) e até cerâmicas tradicionais (exigindo estrutura com menor espaçamento). O tempo de execução da cobertura é de 7 a 15 dias."
    },
    {
      id: "etapa-10",
      title: "Etapa 10: Acabamentos que Finalizam a Construção",
      level: 2,
      content: "Os acabamentos em Steel Frame seguem padrões similares à construção convencional, com algumas especificidades. Pisos vinílicos e laminados são ideais por sua leveza e rapidez de instalação. Porcelanatos e cerâmicas são perfeitamente compatíveis com argamassa adequada sobre base cimentícia ou OSB.\n\nPara revestimentos de parede externos, as placas cimentícias aceitam texturas, pinturas e até aplicação de pedras naturais (verificando peso sobre a estrutura). A pintura interna sobre drywall requer primer selador antes da tinta final. Fixação de objetos pesados em paredes de drywall utiliza buchas específicas (tipo borboleta ou metálica) — para cargas maiores, reforços de madeira ou aço são previstos em projeto nos pontos de fixação.\n\nO tempo de acabamentos varia de 30 a 90 dias dependendo do padrão especificado, incluindo pintura, revestimentos de piso, instalação de louças e metais, esquadrias, bancadas e armários."
    },
    {
      id: "cronograma",
      title: "Cronograma Consolidado Mostra a Velocidade do Sistema",
      level: 2,
      content: "Uma casa de 100m² em Steel Frame leva 3 a 4 meses contra 8 a 12 meses em alvenaria — redução de 50% a 60% no prazo total. Cases reais documentados mostram resultados impressionantes: estrutura de 70m² montada em 58 dias em Londrina/PR e módulos de 100m² com estrutura concluída em 14 dias."
    },
    {
      id: "investimento",
      title: "Investimento e Mercado Brasileiro em Expansão",
      level: 2,
      content: "Os custos por região em janeiro de 2025 mostram o Steel Frame competitivo: padrão popular entre R$ 2.900 e R$ 3.100/m², padrão médio entre R$ 4.300 e R$ 4.500/m², e alto padrão entre R$ 5.600 e R$ 6.100/m². Embora o custo inicial seja ligeiramente superior à alvenaria, o prazo reduzido, menor desperdício e cronograma previsível equilibram o investimento total.\n\nO mercado brasileiro cresceu 60% nos últimos 5 anos segundo a ABCEM (Associação Brasileira da Construção Metálica), com produção de perfis galvanizados aumentando 27,7% em 2023. O financiamento pela Caixa Econômica Federal está disponível com até 80% do valor financiado em 360 meses, após a publicação da NBR 16970 em 2022 que formalizou o sistema construtivo."
    },
    {
      id: "conclusao",
      title: "Conclusão: Um Sistema que Exige Planejamento e Entrega Previsibilidade",
      level: 2,
      content: "O Steel Frame transforma a construção civil de atividade artesanal em processo industrial controlado. A chave do sucesso está no planejamento antecipado: todas as decisões de projeto, posicionamento de instalações e especificação de acabamentos devem ser definidas antes do início da obra. Em contrapartida, o sistema oferece precisão milimétrica, cronograma previsível, canteiro limpo e durabilidade secular.\n\nPara quem planeja construir, a recomendação é buscar construtoras especializadas com portfólio documentado, solicitar visita a obras em andamento, exigir projetos compatibilizados com responsabilidade técnica formal, e verificar certificação dos materiais (especialmente galvanização Z275 dos perfis). Os principais players do mercado brasileiro — Innova Steel, Eco Agile, Hensil e Steel F Design — oferecem treinamentos e suporte técnico que garantem execução conforme normas vigentes. A construção industrializada deixou de ser tendência para se tornar realidade viável e competitiva no Brasil."
    }
  ],

  metaTitle: "Passo a Passo: Como Funciona a Construção em Steel Frame | Berkahn",
  metaDescription: "Guia completo com 11 etapas da construção em Steel Frame: do planejamento aos acabamentos. Cronograma, normas ABNT, comparativo com alvenaria e prazos detalhados.",
  keywords: [
    "steel frame passo a passo",
    "construção steel frame etapas",
    "como construir steel frame",
    "cronograma steel frame",
    "steel frame processo",
    "light steel frame construção",
    "NBR 16970",
    "fundação radier",
    "montagem steel frame",
    "prazo construção steel frame",
    "steel frame vs alvenaria",
    "perfis galvanizados",
    "instalações steel frame"
  ]
};

