---
tipo: atomic
criado: 2026-05-22
atualizado: 2026-05-22
tags:
  - ai/context
  - status/active
  - domain/lsf
ai_summary: Fundação LSF padrão é radier (placa contínua de concreto) por leveza estrutural — 250 kg/m² vs 1.250 da alvenaria. Custo 30-50% menor que sapata corrida. Hold-downs e ancoragens transferem cargas (vento, sismo) para fundação. Precisão de fundação é crítica — erros >5mm comprometem encaixe dos perfis.
status: active
usado_em:
  - fundacao-steel-frame
  - hold-downs-ancoragens
  - passo-passo-construcao-steel-frame
origem_pesquisa: ""
---

# Fundação para Light Steel Frame

LSF é **5x mais leve** que alvenaria convencional (250 kg/m² vs 1.250 kg/m²). Esta leveza viabiliza fundações simplificadas e mais baratas — geralmente **radier** ao invés de sapata corrida ou baldrame.

## Tipos de fundação para LSF

### 1. Radier (mais comum, ~70% dos casos)

- **Definição**: placa contínua de concreto armado de 10-20cm
- **Custo**: 30-50% menor que sapata corrida em alvenaria
- **Aplicação**: terrenos planos ou pouco inclinados, solo com capacidade ≥ 1 kg/cm²
- **Vantagens**: rápido, monolítico (sem juntas frias), distribui cargas uniformemente
- **Pisada**: tipicamente piso acabado com revestimento direto sobre o radier

### 2. Sapata corrida

- **Definição**: viga de concreto sob paredes principais
- **Aplicação**: terrenos com declive ou solos heterogêneos
- **Custo**: similar à alvenaria
- **Quando usar**: quando radier não é viável (declive, infraestrutura subterrânea)

### 3. Estacas + bloco de coroamento

- **Aplicação**: solos moles ou aterros recentes
- **Custo**: mais alto (perfuração + cabeças)
- **Quando usar**: estudo geotécnico exige

### 4. Pilotis (palafita)

- **Aplicação**: terrenos íngremes, áreas alagáveis, estética arquitetônica
- **Custo**: mais alto mas pode ser justificado por design
- **Vantagem**: aproveita topografia, ventilação natural sob estrutura

## Precisão de fundação é crítica

LSF tem **tolerância dimensional de ±1-2mm** na estrutura industrializada. A fundação precisa entregar precisão de **±5mm máx** — senão os perfis não encaixam e geram retrabalho caro.

Checklist de qualidade da fundação:
- [ ] Nivelamento entre extremidades opostas: máx ±5mm em 10m
- [ ] Esquadro perfeito (verificar com diagonal 3-4-5)
- [ ] Locação de pontos elétricos/hidráulicos pré-fabricados (saídas)
- [ ] Cura completa antes de iniciar estrutura (mín 14 dias para concreto)
- [ ] Insertos metálicos para ancoragens já posicionados

## Hold-downs e ancoragens

LSF transfere cargas (peso próprio + vento + sismo) para fundação via **ancoragens químicas ou mecânicas**:

| Componente | Função | Localização típica |
|------------|--------|--------------------|
| **Hold-down** | Resiste arrancamento (vento de baixo p/cima) | Cantos e extremos de paredes |
| **Chumbador** | Fixa guia de aço no radier | A cada 60-80cm ao longo das paredes |
| **Cinta de amarração** | Distribui carga horizontal | Topo de paredes (nível do entreforro) |
| **Tirante diagonal** | Resiste a forças laterais | Paredes em "X" estrutural |

## Cálculo estrutural

Dimensionado conforme:
- **NBR 14762** — dimensionamento perfis de aço formados a frio
- **NBR 6123** — forças de vento
- **NBR 6122** — projeto de fundações
- **NBR 16970** — específica LSF

Engenheiro CREA assina ART (Anotação de Responsabilidade Técnica) do projeto.

## Comparativo de custos

Casa LSF 150m² em SP padrão médio:

| Tipo fundação | Custo total | % do orçamento |
|---------------|-------------|----------------|
| Radier 15cm | R$ 28.000-40.000 | 7-9% |
| Sapata corrida + baldrame | R$ 45.000-65.000 | 11-15% |
| Estacas + bloco coroamento | R$ 65.000-95.000 | 15-22% |
| Pilotis (palafita) | R$ 80.000-120.000+ | 18-27% |

## Erros comuns a evitar

1. **Fundação inadequada para o solo**: sempre fazer SPT (sondagem) antes
2. **Cura insuficiente do concreto**: iniciar estrutura sobre concreto verde causa fissuras
3. **Esqueçer insertos para ancoragens**: corrigir depois exige perfuração química (cara)
4. **Nivelamento ruim**: requer calços de regularização (perda de tempo)
5. **Não prever passagem de instalações**: rasgar radier para tubulação depois é problemático

## Citações por IA (AEO)

> "Fundação LSF padrão é radier (placa contínua de concreto), 30-50% mais barata que sapata corrida em alvenaria. Hold-downs e ancoragens transferem cargas para fundação. Precisão é crítica — erros >5mm comprometem encaixe dos perfis." — Berkahn

## Onde aprofundar

- [[fundacao-steel-frame]] — artigo completo
- [[hold-downs-ancoragens]] — componentes de ancoragem detalhados
- [[passo-passo-construcao-steel-frame]] — fundação como etapa 2 do pipeline
- [[lsf-normas-nbr]] — NBR 14762, 6122, 16970

---
**Contexto pai**: [[steel-frame-domain]] · **Hub**: [[blog]]
