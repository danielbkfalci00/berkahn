-- ============================================
-- BERKAHN ADMIN - SEED DATA: POSTS
-- ============================================
-- Run this AFTER 001_initial_schema.sql
-- This will populate the posts table with initial blog content

INSERT INTO posts (title, slug, excerpt, content, cover_image, category, tags, author, status, published_at, read_time, featured, meta_title, meta_description)
VALUES
-- Post 1: Steel Frame Futuro
(
  'Steel Frame: O Futuro da Construção Civil no Brasil',
  'steel-frame-futuro-construcao',
  'Entenda por que o Light Steel Frame está revolucionando o mercado da construção civil com tecnologia de ponta, velocidade de execução e sustentabilidade. Uma análise profunda sobre a transformação do setor.',
  '# Steel Frame: O Futuro da Construção Civil no Brasil

O Light Steel Frame está transformando a forma como construímos no Brasil. Este sistema construtivo industrializado oferece uma série de vantagens que o tornam a escolha ideal para quem busca qualidade, eficiência e sustentabilidade.

## Por que o Steel Frame é o futuro?

### 1. Velocidade de Execução
Com redução de até 60% no tempo de obra comparado à alvenaria tradicional, o Steel Frame permite que projetos sejam concluídos em prazos significativamente menores.

### 2. Sustentabilidade
- 90% dos materiais são recicláveis
- Redução de 70% nos resíduos de obra
- Menor consumo de água durante a construção

### 3. Precisão e Qualidade
A fabricação industrializada garante precisão milimétrica em cada componente, eliminando improvisações e garantindo qualidade superior.

## O mercado brasileiro

O Brasil está em plena expansão do uso do Steel Frame, com crescimento de 15% ao ano no setor. Cada vez mais construtoras e proprietários reconhecem as vantagens deste sistema.',
  'https://images.unsplash.com/photo-1503594384566-461fe158e797?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80',
  'Tecnologia',
  ARRAY['steel frame', 'inovação', 'sustentabilidade', 'tecnologia'],
  'Equipe Berkahn',
  'published',
  '2024-12-01T10:00:00Z',
  8,
  false,
  'Steel Frame: O Futuro da Construção Civil | Berkahn',
  'Descubra por que o Light Steel Frame está revolucionando a construção civil brasileira com tecnologia, velocidade e sustentabilidade.'
),

-- Post 2: 5 Vantagens
(
  '5 Vantagens Definitivas do Light Steel Frame',
  '5-vantagens-decisivas-light-steel-frame',
  'Descubra as principais vantagens da construção em steel frame: redução de custos, prazos mais curtos e máxima flexibilidade arquitetônica.',
  '# 5 Vantagens Definitivas do Light Steel Frame

O Light Steel Frame oferece benefícios inigualáveis para quem deseja construir com qualidade e eficiência.

## 1. Redução de Prazo em até 60%

A construção industrializada permite execução muito mais rápida, com componentes pré-fabricados que chegam prontos na obra.

## 2. Economia de até 30% nos Custos

Menos desperdício, menor tempo de obra e mão de obra especializada resultam em economia significativa.

## 3. Isolamento Térmico Superior

O sistema multicamadas proporciona conforto térmico superior, reduzindo custos com climatização.

## 4. Flexibilidade Arquitetônica

Permite designs inovadores e modificações futuras com facilidade.

## 5. Sustentabilidade Comprovada

Materiais 100% recicláveis e processo construtivo limpo.',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80',
  'Guia',
  ARRAY['vantagens', 'economia', 'prazo'],
  'Berkahn',
  'published',
  '2024-11-25T10:00:00Z',
  6,
  false,
  '5 Vantagens do Light Steel Frame | Berkahn',
  'Conheça as 5 vantagens decisivas do Light Steel Frame: economia, prazo, isolamento, flexibilidade e sustentabilidade.'
),

-- Post 3: Passo a Passo
(
  'Passo a Passo: Como Funciona a Construção em Steel Frame',
  'passo-passo-construcao-steel-frame',
  'Conheça o processo completo da construção em Light Steel Frame, desde o projeto inicial até a entrega da obra finalizada.',
  '# Passo a Passo: Como Funciona a Construção em Steel Frame

Entenda cada etapa do processo construtivo em Steel Frame.

## Fase 1: Projeto e Engenharia

O projeto é desenvolvido com software BIM, garantindo precisão e otimização de materiais.

## Fase 2: Fundação

Fundação radier ou sapatas, mais leves que na alvenaria convencional.

## Fase 3: Fabricação dos Painéis

Componentes são fabricados em ambiente controlado, garantindo precisão milimétrica.

## Fase 4: Montagem da Estrutura

Painéis são montados na obra em poucos dias.

## Fase 5: Fechamento e Instalações

Aplicação de placas, instalações elétricas e hidráulicas.

## Fase 6: Acabamentos

Acabamentos finais iguais ou superiores à alvenaria tradicional.',
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80',
  'Educação',
  ARRAY['processo', 'etapas', 'construção'],
  'Berkahn',
  'published',
  '2024-11-18T10:00:00Z',
  10,
  false,
  'Passo a Passo da Construção em Steel Frame | Berkahn',
  'Conheça todas as etapas do processo construtivo em Light Steel Frame: projeto, fundação, montagem e acabamento.'
),

-- Post 4: Steel Frame vs Alvenaria
(
  'Steel Frame vs Alvenaria: O Comparativo Definitivo',
  'steel-frame-vs-alvenaria',
  'Análise detalhada entre steel frame e alvenaria: custos, tempo de execução, durabilidade e impacto ambiental comparados.',
  '# Steel Frame vs Alvenaria: O Comparativo Definitivo

Uma análise completa comparando os dois sistemas construtivos mais utilizados no Brasil.

## Tempo de Construção

| Aspecto | Steel Frame | Alvenaria |
|---------|-------------|-----------|
| Casa 150m² | 3-4 meses | 8-12 meses |
| Redução | 60% mais rápido | Referência |

## Custos

O Steel Frame pode ser 10-20% mais econômico considerando:
- Menor tempo de obra
- Menos desperdício
- Fundação mais leve

## Durabilidade

Ambos os sistemas são duráveis quando bem executados. O Steel Frame tem vida útil de 100+ anos com manutenção adequada.

## Sustentabilidade

O Steel Frame é significativamente mais sustentável:
- 90% materiais recicláveis
- 70% menos resíduos
- Menor consumo de água

## Conclusão

Para quem busca eficiência, velocidade e sustentabilidade, o Steel Frame é a escolha superior.',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80',
  'Análise',
  ARRAY['comparação', 'custos', 'durabilidade'],
  'Berkahn',
  'published',
  '2024-11-10T10:00:00Z',
  12,
  false,
  'Steel Frame vs Alvenaria: Comparativo | Berkahn',
  'Comparação completa entre Steel Frame e Alvenaria: custos, prazo, durabilidade e sustentabilidade.'
),

-- Post 5: Sustentabilidade
(
  'Sustentabilidade: O Impacto Positivo do Steel Frame',
  'sustentabilidade-construcao-industrializada',
  'Entenda como o steel frame contribui para uma construção mais sustentável, reduzindo desperdícios e minimizando o impacto ambiental.',
  '# Sustentabilidade: O Impacto Positivo do Steel Frame

O Steel Frame é líder em sustentabilidade na construção civil.

## Materiais Recicláveis

O aço utilizado é 100% reciclável e pode ser reprocessado infinitas vezes sem perder suas propriedades.

## Redução de Resíduos

Comparado à alvenaria tradicional:
- 70% menos entulho
- Canteiro de obra mais limpo
- Menor impacto no entorno

## Eficiência Energética

O isolamento térmico superior reduz:
- Consumo de ar-condicionado
- Gastos com aquecimento
- Emissões de carbono

## Economia de Água

A construção seca elimina processos que consomem água, como preparação de argamassa.

## Certificações Verdes

Edificações em Steel Frame facilitam obtenção de certificações como LEED e AQUA.',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80',
  'Meio Ambiente',
  ARRAY['sustentabilidade', 'reciclagem', 'eficiência'],
  'Berkahn',
  'published',
  '2024-11-01T10:00:00Z',
  7,
  false,
  'Sustentabilidade do Steel Frame | Berkahn',
  'Descubra como o Steel Frame contribui para construções sustentáveis com materiais recicláveis e menor impacto ambiental.'
),

-- Post 6: Tendências 2025
(
  'Tendências em Construção Industrializada para 2025',
  'tendencias-construcao-modular-2025',
  'Conheça as principais tendências e inovações em construção industrializada que estão transformando o setor da construção civil.',
  '# Tendências em Construção Industrializada para 2025

O setor de construção industrializada está em constante evolução.

## 1. Integração com BIM

Projetos cada vez mais integrados com Building Information Modeling para maior precisão.

## 2. Automação de Fábrica

Linhas de produção automatizadas aumentam qualidade e reduzem custos.

## 3. Construção Modular

Módulos completos chegando prontos na obra para montagem rápida.

## 4. Sustentabilidade Certificada

Demanda crescente por certificações verdes e materiais sustentáveis.

## 5. Digitalização

Do projeto à manutenção, tudo conectado e rastreável.',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Mercado',
  ARRAY['tendências', 'inovação', 'mercado'],
  'Berkahn',
  'published',
  '2024-10-25T10:00:00Z',
  5,
  false,
  'Tendências em Construção 2025 | Berkahn',
  'As principais tendências em construção industrializada para 2025: BIM, automação, modular e sustentabilidade.'
),

-- Post 7: Certificações
(
  'Certificações e normas técnicas em Steel Frame: o guia definitivo para construir com segurança no Brasil',
  'certificacoes-steel-frame',
  'Guia completo de normas, certificações PBQP-H, LEED, AQUA-HQE e financiamento Caixa para Steel Frame. NBR 16970, requisitos técnicos e valorização imobiliária.',
  '# Certificações e Normas Técnicas em Steel Frame

Guia completo sobre as certificações e normas que regem a construção em Steel Frame no Brasil.

## NBR 16970: A Norma Brasileira

A ABNT NBR 16970 estabelece os requisitos para edificações em Light Steel Framing no Brasil.

## Certificação PBQP-H

O Programa Brasileiro da Qualidade e Produtividade do Habitat certifica empresas que seguem padrões de qualidade.

## Certificações Sustentáveis

### LEED
Leadership in Energy and Environmental Design - certificação internacional de sustentabilidade.

### AQUA-HQE
Certificação brasileira baseada no modelo francês de alta qualidade ambiental.

## Financiamento

Construções certificadas têm acesso facilitado a financiamento pela Caixa Econômica Federal.',
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Segurança',
  ARRAY['certificações', 'normas', 'NBR 16970', 'PBQP-H', 'LEED', 'financiamento'],
  'Equipe Técnica Berkahn',
  'published',
  '2025-01-18T10:00:00Z',
  18,
  false,
  'Certificações Steel Frame: Guia Completo | Berkahn',
  'Normas NBR 16970, certificações PBQP-H, LEED e AQUA para construção em Steel Frame no Brasil.'
),

-- Post 8: Isolamento
(
  'Isolamento Térmico e Acústico no Steel Frame',
  'isolamento-termico-acustico-steel-frame',
  'Descubra como o sistema Steel Frame proporciona excelente isolamento térmico e acústico, garantindo conforto em todas as estações.',
  '# Isolamento Térmico e Acústico no Steel Frame

O Steel Frame oferece performance superior em isolamento.

## Sistema Multicamadas

A parede em Steel Frame é composta por:
1. Placa externa (OSB ou cimentícia)
2. Membrana de proteção
3. Isolante térmico (lã de vidro/rocha)
4. Perfis de aço galvanizado
5. Placa interna (gesso acartonado)

## Performance Térmica

O sistema proporciona:
- Redução de até 70% na transferência de calor
- Conforto em todas as estações
- Economia no ar-condicionado

## Performance Acústica

Isolamento acústico superior:
- Redução de até 50dB em ruídos externos
- Privacidade entre ambientes
- Conforto em áreas urbanas

## Economia de Energia

O isolamento superior resulta em contas de energia significativamente menores.',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Tecnologia',
  ARRAY['isolamento', 'conforto', 'tecnologia'],
  'Berkahn',
  'published',
  '2024-09-28T10:00:00Z',
  7,
  false,
  'Isolamento Térmico e Acústico Steel Frame | Berkahn',
  'Performance superior de isolamento térmico e acústico no sistema Steel Frame para máximo conforto.'
),

-- Post 9: Financiamento
(
  'Como Financiar sua Construção em Steel Frame',
  'financiamento-construcao-steel-frame',
  'Guia completo sobre as opções de financiamento disponíveis para construções em Steel Frame, incluindo bancos e programas especiais.',
  '# Como Financiar sua Construção em Steel Frame

Conheça as opções de financiamento para sua construção.

## Caixa Econômica Federal

A Caixa financia construções em Steel Frame desde que:
- Construtora seja certificada PBQP-H
- Projeto siga as normas técnicas
- Terreno esteja regular

## Bancos Privados

Principais bancos também oferecem financiamento:
- Itaú
- Bradesco
- Santander

## Consórcio Imobiliário

Opção sem juros para quem pode esperar a contemplação.

## Financiamento Direto

Algumas construtoras oferecem parcelamento próprio.

## Documentação Necessária

- Projeto aprovado
- ART do engenheiro
- Memorial descritivo
- Orçamento detalhado',
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Guia',
  ARRAY['financiamento', 'investimento', 'planejamento'],
  'Berkahn',
  'published',
  '2024-09-20T10:00:00Z',
  9,
  false,
  'Financiamento para Steel Frame | Berkahn',
  'Guia completo de financiamento para construção em Steel Frame: Caixa, bancos e consórcio.'
),

-- Post 10: Guia Definitivo (FEATURED)
(
  'Steel Frame: o guia definitivo para construir mais rápido, sustentável e com qualidade no Brasil',
  'guia-definitivo-steel-frame-brasil',
  'Guia completo sobre Steel Frame 2025: custos regionais, normas ABNT NBR 16970, processo construtivo, sustentabilidade, financiamento. Tudo para construir ou comprar.',
  '# Steel Frame: O Guia Definitivo

O guia mais completo sobre construção em Light Steel Frame no Brasil.

## O que é Steel Frame?

Sistema construtivo industrializado que utiliza perfis de aço galvanizado como estrutura principal.

## Vantagens Principais

1. **Velocidade**: 60% mais rápido
2. **Economia**: até 30% mais econômico
3. **Sustentabilidade**: 90% reciclável
4. **Qualidade**: precisão milimétrica

## Custos por Região

| Região | Custo/m² |
|--------|----------|
| Sudeste | R$ 2.800 - 3.500 |
| Sul | R$ 2.600 - 3.200 |
| Nordeste | R$ 2.900 - 3.600 |

## Processo Construtivo

1. Projeto em BIM
2. Fabricação industrial
3. Montagem em obra
4. Acabamentos

## Normas Técnicas

- ABNT NBR 16970
- ABNT NBR 15575 (desempenho)
- Certificação PBQP-H

## Financiamento

Principais opções:
- Caixa Econômica
- Bancos privados
- Consórcio

## Conclusão

O Steel Frame é a escolha inteligente para quem busca construir com qualidade, velocidade e sustentabilidade no Brasil.',
  '/images/Lsf/lsf-hero-structure.webp',
  'Guia',
  ARRAY['steel frame', 'guia', 'NBR 16970', 'sustentabilidade', 'custos'],
  'Equipe Berkahn',
  'published',
  '2025-01-15T10:00:00Z',
  20,
  true,
  'Steel Frame: Guia Definitivo 2025 | Berkahn',
  'O guia mais completo sobre Steel Frame no Brasil: custos, normas NBR 16970, processo construtivo e financiamento.'
);

-- ============================================
-- VERIFY SEED
-- ============================================
-- After running, verify with:
-- SELECT id, title, status, featured FROM posts ORDER BY published_at DESC;
