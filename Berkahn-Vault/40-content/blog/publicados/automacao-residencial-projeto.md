---
tipo: draft-content
criado: 2026-09-22
atualizado: 2026-09-22
tags:
  - project/blog
  - status/draft
  - domain/lsf
  - domain/normas
ai_summary: "Pauta 4 das cinco solicitações dos sócios. Automação residencial organizada por decisão de projeto, nunca por marca, com a tese de que tudo se reduz a duas perguntas respondidas antes de a placa fechar, que são quantos módulos sobram no quadro e por onde um cabo que não foi passado pode voltar. Ancorado na reserva obrigatória da Tabela 59 da ABNT NBR 5410:2004, na ABNT NBR 16264, que é a norma brasileira de cabeamento estruturado residencial e cujo terceiro grupo de aplicação é literalmente a automação residencial, nos limites de ocupação e de trecho contínuo do eletroduto e no delta de R$ 2,89 por metro entre eletroduto de 25 e de 32 mm no SINAPI, composições 91834 e 91836, referência 07/2026. A geometria de furação do perfil fica com instalacoes-hidraulicas-eletricas-steel-frame e entra aqui em uma única frase atribuída. Diz com todas as letras que o sistema construtivo não conserta automação mal projetada."
status: published
projeto: blog
slug: automacao-residencial-projeto
title: "Automação residencial: o que prever no projeto antes da obra"
seo_title: "Automação Residencial no Projeto: O Que Prever na Obra"
description: "Automação residencial se decide no projeto, não na loja. Veja o que precisa estar no quadro, no eletroduto e na caixa antes de a parede fechar, e o que ainda volta depois."
seo_description: "O que prever de quadro, eletroduto e cabeamento antes de a parede fechar: a reserva da NBR 5410, a norma residencial NBR 16264 e o que ainda volta depois."
palavras_chave:
  - automação residencial projeto
  - infraestrutura automação residencial
  - automação residencial light steel frame
  - eletroduto cabeamento automação casa
  - o que prever antes de fechar a parede
  - quadro de distribuição reserva automação
category: Guias e Tutoriais
read_time: 8 min
author: Equipe Berkahn
answer_summary: "Automação residencial se decide no projeto porque a infraestrutura fecha junto com a parede. A Tabela 59 da ABNT NBR 5410:2004 fixa a reserva do quadro pelo número de circuitos com que ele for efetivamente equipado: 2 espaços até 6 circuitos, 3 de 7 a 12, 4 de 13 a 30 e 0,15 vezes o número acima disso, e essa reserva entra no cálculo do alimentador. A mesma norma admite 53% de ocupação do eletroduto com um condutor, 15 m de trecho contínuo e três curvas de 90 graus entre caixas. A régua residencial brasileira é a ABNT NBR 16264. A regra prática: o que tem eletroduto vazio volta depois, o que não tem depende de rádio ou de obra."
contextos_aplicados:
  - berkahn-brand
  - seo-aeo-strategy
  - steel-frame-domain
material_visual_slug: cover.webp
data_publicacao: 2026-09-22
supabase_id: f1e623c5-4e10-42c4-8b5c-75d2ce135ab0
url_final: "https://www.berkahn.com.br/atualidades/automacao-residencial-projeto"
---

Um quadro de distribuição residencial equipado com 13 a 30 circuitos precisa, pela ABNT NBR 5410:2004, de quatro espaços de reserva. Só isso. Uma central de automação, a fonte do barramento e dois módulos de comando consomem os quatro antes de a casa acender a primeira lâmpada, e a conta acabou sem que ninguém escolhesse marca nenhuma.

Em Light Steel Frame, sistema construtivo com perfis leves de aço galvanizado formados a frio como estrutura e placas como fechamento, o caminho de cada cabo também se decide antes de a placa subir. Automação se vende como escolha de aplicativo, e a decisão que manda vem muito antes dela, no projeto, resumida a duas perguntas. Quantos módulos sobram no quadro, e por onde volta um cabo que não foi passado.

[STATS:automacao-projeto-numeros]

## As sete decisões que a obra precisa ouvir antes de qualquer marca

Controle de iluminação, persianas motorizadas, climatização, segurança, irrigação, gestão de energia e cenas parecem sete compras diferentes. Para a obra são sete versões da mesma pergunta, porque cada uma ocupa espaço no quadro, precisa de caminho de cabo dentro da parede e quase sempre de energia no ponto onde o sensor ou o motor vai morar.

[TABLE:automacao-decisoes-projeto]

## O quadro decide quanto da casa pode virar automação

A ABNT NBR 5410:2004, norma brasileira de instalações elétricas de baixa tensão, já obriga o quadro a ter folga. A Tabela 59 fixa o mínimo pelo número de circuitos com que o quadro for efetivamente equipado, com 2 espaços reserva até 6 circuitos, 3 de 7 a 12, 4 de 13 a 30 e 0,15 vezes o número de circuitos acima de 30. A nota da própria tabela acrescenta o detalhe que costuma passar batido, ou seja, essa reserva entra no cálculo do alimentador, e não só no tamanho da caixa. Os valores vêm de transcrições técnicas convergentes, não do documento da ABNT.

A folga some rápido quando a automação chega, porque cada circuito comandado pode pedir seu módulo, a central pede alimentação própria e o barramento pede fonte, tudo disputando trilho com o diferencial e o protetor contra surtos. Pelo SINAPI, composições 101879 e 101880, referência 07/2026, média nacional não desonerada, subir um quadro de embutir de 24 para 30 disjuntores DIN custa R$ 106,26 a mais, com a ressalva de que o maior vai de 100 A para 150 A de barramento.

Um item pede decisão antecipada mesmo sem carro elétrico hoje. A ABNT NBR 17019, de abril de 2022, determina fator de demanda igual a 1 no circuito que alimenta ponto de recarga veicular, ou seja, ele é dimensionado como se estivesse sempre em plena carga, o que mexe no alimentador e não apenas no quadro.

## O neutro que nunca chegou ao interruptor

A fiação residencial brasileira segue uma convenção antiga. A fase entra no interruptor, o retorno sai dele até a luminária e o neutro vai direto para o ponto de luz, sem passar pela caixa do comando. Isso basta para um interruptor mecânico, e não para a maior parte dos inteligentes, que precisam de energia permanente.

Quem descobre isso com a parede fechada tem duas saídas desconfortáveis. Os modelos que dispensam neutro existem e têm limitação real de carga mínima e de compatibilidade com driver de LED. A outra é abrir a parede. Levar o neutro a todas as caixas de interruptor enquanto o painel está aberto é uma linha no memorial e alguns metros de cabo, a decisão mais barata deste artigo e a mais esquecida. O projeto luminotécnico é assunto de [iluminação LED residencial](/atualidades/iluminacao-led-residencial); aqui o tema é o fio que chega ao comando.

## A prumada sobe com folga, o horizontal disputa cada furo

O projeto de automação não decide como a parede é feita, e sim o que cabe dentro dela. As camadas dessa vedação estão em [anatomia da parede em steel frame](/atualidades/anatomia-parede-steel-frame); aqui o assunto é o orçamento de espaço, que muda conforme o cabo sobe ou atravessa.

A prumada sobe pelo vão entre montantes, sem gargalo. O percurso horizontal é o oposto, porque cada montante repete a mesma restrição e o chicote precisa caber ali junto com o que a elétrica já ocupa. A figura de furação da ABNT NBR 15253 reproduzida no manual Steel Framing: Arquitetura, do CBCA, por Santiago, Freitas e Crasto, 2012, dá ao furo sem reforço 38 mm de diâmetro, que é a dimensão transversal a vencer, ou 115 mm de comprimento quando ele é oblongo. Furo maior não fica proibido, passa a exigir reforço.

Para quem projeta a automação isso vira uma conta de ocupação. Cabo de barramento, par trançado, coaxial e alimentação de motor de persiana disputam o mesmo caminho horizontal, e é por isso que subir até o forro e distribuir de cima para baixo resolve mais que qualquer escolha de dispositivo.

## O que volta pelo eletroduto, e o que não volta

Eletroduto é definido como elemento destinado a conter condutores isolados permitindo tanto a instalação quanto a retirada deles, e essa segunda metade da definição é o ativo inteiro desta conversa. A norma sustenta a promessa com limites que circulam nas transcrições técnicas, ou seja, ocupação de 53% com um condutor e 40% com três ou mais, trecho contínuo de no máximo 15 m sem caixa de passagem e no máximo três curvas de 90 graus entre duas caixas. Deixado vazio com arame guia, ele é uma decisão reversível.

O que não volta é o que dependia de um caminho que ninguém criou: cabo de barramento até ponto sem eletroduto, neutro em caixa que não recebeu neutro, sensor em forro fechado sem passagem. Sobra o rádio, que funciona e tem limite físico. O relatório de Rudd, Craig, Ganley e Hartless para a Ofcom, de 2014, separa duas coisas que o mercado costuma juntar. Estrutura metálica maciça, como viga de aço e radiador, pode ser tratada como refletor e atenuador perfeito, enquanto filme metálico fino, como a face aluminizada do isolante e o vidro de baixa emissividade, ainda deixa passar rádio significativo. Numa única casa pequena, medida antes e depois de receber esse par de materiais, o acréscimo de perda na entrada da edificação ficou entre 5 e 10 dB, e os autores advertem contra generalizar a estatística. A Recomendação ITU-R P.2109-2, de 2023, projeta diferença bem maior entre construção tradicional e termoeficiente, da ordem de 14 dB em 2,4 GHz. Nos dois documentos quem atrapalha o sinal é o envelope termoeficiente, presente em qualquer sistema construtivo, e não o esqueleto de aço. Para a atenuação entre cômodos numa parede de LSF não existe medição brasileira publicada.

[MYTHS:automacao-lsf-mitos]

## Existe norma residencial de cabeamento, e ela vira cláusula

A ABNT NBR 14565, na edição de novembro de 2025, trata de edifício comercial e campus, e é por causa desse escopo que se repete por aí que a casa ficou sem norma. Não ficou. A ABNT NBR 16264, Cabeamento estruturado residencial, confirmada em janeiro de 2025 segundo os catálogos consultados, organiza a infraestrutura da residência em três grupos de aplicação, que são tecnologias da informação e telecomunicações, tecnologias de broadcast e automação residencial. O terceiro é o assunto deste texto.

Para comparação existe a ANSI/TIA-570-D, de 2018, que classifica a casa em três graus e pede, no Grau 1, ao menos um canal categoria 6A e um canal coaxial por tomada de telecomunicações. Nenhuma das duas é obrigação legal em obra residencial privada. Norma ABNT obriga quando contrato, código de obras ou regulamento a referencia, e é por isso que escrever a designação no memorial encerra a conversa vaga sobre pontos de rede.

## O sistema construtivo não conserta automação mal projetada

Esta parte precisa ser dita sem rodeio. O Light Steel Frame torna a correção mais barata e não a torna desnecessária. A parede abre com serrote e fecha com placa nova, mas nada disso cria módulo em quadro sem espaço, neutro em caixa que não recebeu neutro nem eletroduto onde não foi previsto nenhum, e toda reabertura mexe em acabamento e na continuidade do isolamento.

A escala dessa diferença já está medida no artigo sobre [patologias em steel frame](/atualidades/patologias-steel-frame), que detalha a Lei de Sitter e o salto de custo entre corrigir no projeto e corrigir na construção pronta. Automação é um caso cruel dessa curva, porque o erro não aparece na entrega, e sim dois anos depois, quando o morador quer somar uma persiana e descobre que o caminho não existe.

[CHECKLIST:automacao-projeto-checklist]

## O que custa decidir agora

O preço da previsão é pequeno e rastreável. No SINAPI, referência 07/2026, média nacional não desonerada, o eletroduto corrugado de PVC sai por R$ 22,16 por metro no DN 25 mm, composição 91834, e por R$ 25,05 no DN 32 mm, composição 91836. São R$ 2,89 por metro, ou 13%, para subir a bitola e ganhar folga de enfiação, num valor que descreve a camada em forro, não o sistema. Do outro lado da conta não existe número público: nenhuma base oficial brasileira precifica reabrir parede para incluir automação depois. O custo da casa inteira está em [quanto custa construir em steel frame por metro quadrado](/atualidades/custo-steel-frame-m2-2026).

A síntese cabe numa frase. Automação não se compra na obra, se reserva na obra, e o que se reserva é espaço no quadro, neutro na caixa e eletroduto vazio com arame guia. Repare no que esses três têm em comum. Nenhum aparece no orçamento com o nome de automação, nenhum tem marca e nenhum exige que a família já saiba qual aplicativo vai usar. São a parte do sistema que envelhece bem, porque não dependem do protocolo que estiver na moda quando alguém for instalar o primeiro sensor.

[FAQ:automacao-residencial-projeto]

[CTA:automacao-residencial-projeto]

---

<!-- vault-rodape-v1 -->

**Relacionado**: [[blog]] · [[iluminacao-led-residencial]] · [[anatomia-parede-steel-frame]] · [[patologias-steel-frame]] · [[custo-steel-frame-m2-2026]]

**Contexto aplicado**: [[berkahn-brand]] · [[seo-aeo-strategy]] · [[steel-frame-domain]]

---

## ESPECIFICAÇÕES TÉCNICAS PARA IMPLEMENTAÇÃO:

**Elementos visuais/interativos sugeridos:**

1. `[STATS:automacao-projeto-numeros]`: quatro StatHighlight logo após a abertura, no trecho que a AEO mais cita. Estrutura com wrapper, `[{id: "automacao-projeto-numeros", stats: Stat[]}]`, porque o renderer faz `.find` pelo id quando o primeiro elemento tem `id`. Valores inteiros porque o CountUp usa `Math.floor`: `4` com sufixo ` espaços` (reserva mínima da Tabela 59 entre 13 e 30 circuitos), `15` com sufixo ` m` (trecho contínuo máximo de eletroduto interno sem caixa de passagem, NBR 5410), `3` com prefixo `R$ ` e sufixo `/m` (delta SINAPI 07/2026 entre eletroduto de 25 e de 32 mm, valor exato de R$ 2,89 na descrição) e `106` com prefixo `R$ ` (delta SINAPI 07/2026 entre quadro de 24 e de 30 módulos, valor exato de R$ 106,26 na descrição). A progressão vai das duas obrigações já vigentes para os dois preços de decidir agora. O `38 mm` de furação saiu daqui de propósito: a keyword "furo em montante steel frame" é de `instalacoes-hidraulicas-eletricas-steel-frame`, e o número fica só no corpo, atribuído.
2. `[TABLE:automacao-decisoes-projeto]`: resolvido por id no array `tables`. Sete linhas, uma por família de decisão, com as colunas "Decisão de projeto", "O que ocupa no quadro", "Que caminho exige na parede" e "Reversível sem obra?". É o elemento exclusivo da peça, porque a SERP inteira organiza automação por marca e por cômodo, nunca por consequência de obra. A última coluna é a tese do artigo em formato de tabela.
3. `[MYTHS:automacao-lsf-mitos]`: objeto singular no JSONB, o renderer ignora o `id` e não faz `.find`. Três mitos: "em steel frame dá para passar cabo depois, é só abrir a parede", "automação é decisão de acabamento" e "hoje tudo é sem fio, não precisa prever nada". Cada resposta ancorada num dado já citado no corpo.
4. `[CHECKLIST:automacao-projeto-checklist]`: objeto singular, também sem `.find`. Cinco itens, na ordem em que a obra fecha: neutro em toda caixa de interruptor; reserva do quadro dimensionada pela Tabela 59 e contada no alimentador; eletroduto vazio com arame guia entre quadro, forro e pontos de sensor; furação de fábrica compatibilizada com o caminho dos dutos antes da fabricação do painel; ponto de energia em cada local de sensor, motor e atuador.
5. `[FAQ:automacao-residencial-projeto]`: resolvido por id no array `faqs`. Cinco perguntas, carregando as long tails que o H1 não comporta ("preciso de neutro no interruptor", "dá para automatizar depois de pronta", "quantos pontos de rede").
6. `[CTA:automacao-residencial-projeto]`: resolvido por id no array `ctas`, modo `dialog`, segmento residencial. `ctaLocation` é derivado do slug, não enviar.

**Internal links sugeridos:**
- projeto luminotécnico e camada de luz → `/atualidades/iluminacao-led-residencial`
- camadas da vedação vertical → `/atualidades/anatomia-parede-steel-frame`
- escala do custo de corrigir, sem repetir os multiplicadores → `/atualidades/patologias-steel-frame`
- custo da casa, sem recálculo → `/atualidades/custo-steel-frame-m2-2026`

Os quatro links do corpo apontam para artigos já publicados. O link que existia para `/atualidades/instalacoes-hidraulicas-eletricas-steel-frame` foi removido: era o único do lote apontando para dentro do próprio lote, e a pauta `f4d25753` não tem publicação garantida antes desta. Se ela subir primeiro, vale acrescentar a remissão no parágrafo da furação, nunca substituindo a de `anatomia-parede-steel-frame`.

**External links incluídos:**
Nenhum no corpo, por coerência com o padrão do lote. As fontes entram por atribuição em texto, com autor, veículo e ano. URLs para conferência na revisão:
- Santiago, Freitas e Crasto, "Steel Framing: Arquitetura", 2ª edição, Instituto Aço Brasil / CBCA, Rio de Janeiro, 2012, ISBN 978-85-89819-32-9, capítulo 8 (Instalações), p. 112 a 117: https://engprime.com.br/wp-content/uploads/2020/07/Manual_SF_Arquitetura_web.pdf
- Rodrigues e Caldas, "Steel Framing: Engenharia", 2ª edição revisada, Instituto Aço Brasil / CBCA, Rio de Janeiro, 2016, ISBN 978-85-89819-39-8, p. 17: http://www.skylightestruturas.com.br/downloads/101497_manual_lsf_engenharia_2016.pdf
- Tabela 59 e item 6.5.4.7 da ABNT NBR 5410:2004, transcrição da nota do alimentador entre aspas e reprodução da tabela, Indelmatec: https://indelmatec.com.br/conjunto-de-protecao-manobra-e-comando-parte-02-03/
- Tabela 59, as quatro faixas (2 / 3 / 4 / 0,15N), Hiperfer: https://www.hiperfer.com.br/blog/quadro-de-distribuicao-como-dimensionar
- ABNT NBR 17019:2022 e fator de demanda igual a 1, O Setor Elétrico: https://www.osetoreletrico.com.br/alimentacao-de-veiculos-eletricos-na-nbr-17019/
- Taxa de ocupação, 15 m e curvas de 90 graus, transcrição da AltoQi: https://suporte.altoqi.com.br/hc/pt-br/articles/115009164767
- ABNT NBR 14565, edição de 11/2025, escopo de edifícios comerciais e campus: https://buscanormas.com.br/norma/nbr-14565-cabeamento-estruturado-pra-edificios-comerciais
- ABNT NBR 16264, Cabeamento estruturado residencial, escopo com os três grupos de aplicação: https://buscanormas.com.br/norma/nbr-16264-cabeamento-estruturado-residencial
- ANSI/TIA-570-D, graus 1 a 3: https://www.tiafotc.org/tia-standards-update/tia-570-d/
- Rudd, Craig, Ganley e Hartless, "Building Materials and Propagation, Final Report", Ofcom, 2014, referência 2604/BMEM/R/3/2.0, sumário executivo e seção 4.3: http://www.qostic.org/Qostic/wp-content/uploads/Qostic6/AHQ-78-05-Building_Materials_and_Propagation.pdf
- Recomendação ITU-R P.2109-2 (08/2023), modelo de perda de entrada em edificação, classes tradicional e termoeficiente: https://www.itu.int/rec/R-REC-P.2109/en

Preços: a fonte citada no corpo é o SINAPI, composições 91834, 91836, 101879 e 101880, referência 07/2026, média nacional não desonerada, que é a chave conferível na publicação da Caixa. Os endereços abaixo são consulta de conveniência em agregador de terceiro, não a fonte:
- https://orcamentor.com/composicao/91834/ · https://orcamentor.com/composicao/91836/
- https://orcamentor.com/composicao/101879/ · https://orcamentor.com/composicao/101880/

**Imagens necessárias:**
Capa 1200x800, sem texto embutido, assunto deslocado para um dos terços laterais por causa do gradient. A mesma foto serve o LinkedIn em 1080x1350. Nada a gerar: a capa já está decidida e recortada a partir da foto real `obra-carrossel-28`, conforme `scripts/.cache/socios/DECISAO-CAPAS.md`, com os dois recortes em `scripts/.cache/socios/capas/`. A menção anterior a `obra-carrossel-40` era resíduo da sessão interrompida e foi corrigida aqui; o briefing de imagem desta pauta explica por que a `40` perde.
Alt text sugerido: "Painel de Light Steel Frame em obra, com os montantes de aço galvanizado ainda abertos antes do fechamento com placa".

**Schema markup recomendado:** Article + FAQPage

**Observações para implementação:**

Contagem do corpo: 1.600 palavras por `scripts/.cache/contar.mjs`, no teto da faixa de 1.100 a 1.600. `answer_summary` em 120 palavras, `seo_description` em 154 caracteres, `seo_title` em 54. `read_time` em 8 min, uniformizado com as outras quatro peças do lote pela mediana de 193 palavras por minuto do acervo.

Público priorizado: residencial alto padrão em fase de projeto, cliente decidindo a própria casa, com leitura secundária de arquiteto e de integrador compatibilizando com a estrutura. Não é o público de retrofit, e isso separa a peça da SERP inteira de automação, que fala com quem já mora e quer comprar dispositivo.

Separação entre verificado e inferido, mantida dentro do texto. A geometria de furação é atribuída à figura da ABNT NBR 15253 reproduzida no manual de arquitetura do CBCA, e não a consulta ao documento comercializado pela ABNT, que não foi lido em nenhuma edição. Vale o mesmo para a Tabela 59, para os limites de eletroduto e para a vigência da NBR 16264, todos atribuídos a transcrições convergentes ou a catálogos de normas. O delta SINAPI dos quadros mistura duas variáveis (número de módulos e corrente de barramento) e o texto declara isso. Os quatro preços SINAPI são da mesma base: referência 07/2026, média nacional, não desonerada, declarada em cada ocorrência. O dado da Ofcom é de uma casa só, é acréscimo e não total, e o texto diz isso, além de declarar que não existe medição brasileira publicada de atenuação entre cômodos numa parede de LSF. A afirmação de que não existe base pública precificando reabertura de parede para automação é resultado de busca, não de omissão.

Correções aplicadas nesta revisão, todas vindas do dossiê de verificação adversarial ou da seção 4 da própria pesquisa. A premissa de que não existiria norma residencial brasileira de cabeamento era falsa e foi invertida: a ABNT NBR 16264 existe e o terceiro grupo de aplicação dela é literalmente automação residencial, o que troca um achado negativo frágil por uma âncora nacional citável. A NBR 14565 passou de 2019 para a edição de 11/2025. A Tabela 59 passou a dizer "circuitos com que o quadro for efetivamente equipado" e "0,15 vezes o número de circuitos", que é a forma normativa, e a fonte AltoQi que não transcreve a tabela saiu do bloco de fontes. A frase sobre pontos de recarga entrarem na nova NBR 5410 não se sustentava na matéria citada e o parágrafo foi reescrito, ficando só a âncora verificada da NBR 17019:2022. O uso do relatório da Ofcom foi corrigido em duas frentes: o relatório trata como atenuador perfeito apenas a estrutura metálica maciça e diz o oposto para filme metálico fino, e os 5 a 10 dB são de uma única casa, como acréscimo sobre ela mesma, com a margem da ITU-R P.2109-2 acrescentada para o leitor que dimensiona rede. Os multiplicadores 1x e 125x da Lei de Sitter saíram por serem de `patologias-steel-frame`, alinhando esta peça à decisão que `projeto-integrado-light-steel-frame` tomou no mesmo lote. O Matter saiu das fontes e das fronteiras, porque nunca chegou ao corpo.

A convenção de fiação sem neutro na caixa do interruptor é apresentada como convenção de mercado, e não como exigência da NBR 5410, porque o que se verificou é a prática corrente, não uma cláusula.

Decisão de formato que vale registrar: a keyword "automação residencial projeto" tem a SERP inteira ocupada por loja e por integrador, com conteúdo organizado por cômodo e por marca. O H1 e o `seo_title` disputam a mesma keyword, e a diferenciação acontece no primeiro parágrafo, que agora abre pela reserva do quadro em vez da furação do perfil. Essa troca é deliberada e resolve a canibalização com `instalacoes-hidraulicas-eletricas-steel-frame`: a keyword "furo em montante steel frame" fica com ele, a furação saiu do `seo_description`, do `answer_summary` e do STATS, e no corpo restou uma única frase atribuída. O ângulo de reversibilidade, que separa decisão que volta de decisão que não volta, é o que a peça tem de próprio e não aparece em nenhum dos resultados examinados.

Fecho reescrito. O lote inteiro fechava com a mesma fórmula, que era assinatura Berkahn mais projeto executivo mais janela única, e os drafts 2 e 4 dividiam até o sintagma "esses três itens". O fecho desta peça agora sai do assunto dela: os três itens que se reserva não têm marca, não aparecem no orçamento como automação e não dependem do protocolo da moda, que é o argumento que o corpo provou.

Fronteiras respeitadas. Nada de luminotécnica, IRC, temperatura de cor, luz circadiana ou escolha de luminária, que são de `iluminacao-led-residencial`, citada aqui como dona da camada de luz enquanto esta peça fica com a camada de controle e de infraestrutura. Nada de geração solar, painel fotovoltaico, inversor ou compensação, que são de `energia-solar-residencial`, com "gestão de energia e recarga veicular" limitada ao que ocupa quadro e alimentador. Nada de etiqueta ENCE, PBE Edifica ou eficiência energética regulatória, que são da pauta `181cfeae` e de `eficiencia-energetica-reforma-tributaria`. Nada de carga, bucha, mão francesa ou fixação de televisor em parede, que são do draft `pendurar-tv-parede-steel-frame`, e o texto não chega perto da conta de carga em placa. A furação dos perfis e seus limites pertencem a `instalacoes-hidraulicas-eletricas-steel-frame`, do mesmo lote, por atribuição do contrato, e esta peça se retirou do território: caíram o parágrafo que reexplicava a geometria do zero (eixo da alma, 600 mm entre centros, 300 mm da extremidade), o detalhe de proteção do conduíte na travessia, o H2 que carregava o número e a menção no `seo_description`, no `answer_summary` e no STATS. Do assunto restou uma frase, atribuída à figura da NBR 15253 reproduzida no manual do CBCA, porque sem ela o leitor não entende por que o percurso horizontal é gargalo. O recorte próprio é o orçamento de espaço entre prumada e percurso horizontal, e o que a automação empilha nesse caminho. Nada de inventário normativo do LSF, que é de `normas-light-steel-frame-brasil`. Nada de custo por metro quadrado da casa, que é de `custo-steel-frame-m2-2026` e entra só por link. Nada de camadas da parede, que são de `anatomia-parede-steel-frame`. A camada metálica contínua do envelope aparece em uma única frase, sem entrar em sistema de fachada, que é de `revestimento-externo-steel-frame`, do mesmo lote.

Não confirmado, e por isso dito com a atribuição que a evidência permite. O texto da ABNT NBR 15253 não foi lido em nenhuma edição, e os 38 e os 115 mm aparecem em texto apenas no manual do CBCA de 2012, cuja cadeia é a edição de 2005 da norma; por isso o corpo diz "a figura de furação da ABNT NBR 15253 reproduzida no manual" e nunca "a NBR 15253 limita o furo a 38 mm". A vigência da NBR 16264 vem de catálogos de normas, com divergência conhecida entre revendedores sobre qual edição está em vigor, e a existência da norma, que é o que o argumento precisa, converge em três fontes independentes. Os 38 por 115 mm da figura de furação e a faixa de validade do método de cálculo da AISI S100-12, que aparece no exemplo 6.6 do manual de engenharia do CBCA, são grandezas distintas e não concorrentes; esta peça não entra nessa distinção, que é território de `instalacoes-hidraulicas-eletricas-steel-frame`.

Backlog registrado, fora deste lote: a ANSI/TIA-570-E teria sido publicada e substituiria a 570-D, mas a página de anúncio da TIA devolveu 403 na pesquisa e a data não foi verificada. O texto cita a 570-D, cuja publicação em julho de 2018 e cujos graus estão confirmados. Se a 570-E for confirmada antes da publicação, atualizar a menção e conferir se os graus mudaram. A ISO/IEC 11801-4:2017 saiu do corpo por espaço, depois que a NBR 16264 assumiu o papel de régua residencial; ela continua verificada e pode voltar se a peça ganhar folga de palavras.
