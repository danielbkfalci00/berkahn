---
tipo: meta
criado: 2026-06-02
atualizado: 2026-06-02
tags:
  - project/site
  - status/active
ai_summary: Checklist de intake para substituir os 4 arquitetos mockup da curadoria por 3 parceiros reais (Rosmari Calefe, Airos, Maria Isabel Bianchi). Define o que a automacao captura vs o que Bruno entrega manual, onde soltar os arquivos e quais campos nao-raspaveis precisam ser confirmados.
status: active
projeto: site
---

# Intake — Parceiros reais da Curadoria

Substituicao dos 4 arquitetos ficticios em `lib/architects-data.ts` por 3 reais. Contexto: [[blog]] nao; projeto [[site]]. Pipeline tecnico no plano aprovado.

## Onde soltar material manual

Pasta local (gitignored, nao vai pro repo):

```
scripts/.cache/architects-intake/{slug}/
  rosmari-calefe/
  airos/
  maria-isabel-bianchi/
```

Pode soltar qualquer imagem (jpg/png/webp). O `optimize-architect-images.mjs` filtra tamanho, deduplica, converte pra webp e joga em `public/images/arquitetos/{slug}/`. Nomeie de forma simples (ex: `projeto-casa-x-01.jpg`) que ajuda na curadoria.

## O que a automacao captura sozinha

| Arquiteto | Texto (WebFetch) | Imagens (scraper) |
|---|---|---|
| Rosmari Calefe | Bio, 5 projetos c/ specs, contato (IMB) | IMB + Google Sites |
| Maria Isabel Bianchi | Curriculo completo (formacao, skills, contato) | Portfolio Wix |
| Airos | Pouco (Lovable e SPA pobre) | Best-effort Lovable |

## O que depende de voce (manual)

Marque conforme for entregando:

### Todos os arquitetos
- [x] **Permissao/credito de imagens** confirmada (ja sao parceiros) · WhatsApp Berkahn resolvido (mesmo do site: 5511966415742)
- [ ] **Metricas reais e honestas** (nao podem ser zero): anos de atuacao, nº de projetos entregues, m² construidos
- [ ] **Status real da parceria com a Berkahn** (para o bloco de parceria e a timeline; sem inventar marcos)
- [ ] **Foto do(a) arquiteto(a)** (headshot/portrait) de cada um

### Rosmari Calefe (`rosmari-calefe/`)
- [ ] Imagens do Instagram (@arq.rosmaricalefe), se quiser usar alem do portfolio
- [ ] Confirmar metricas e cidade-base (Cerquilho-SP, pelo IMB)

### Airos (`airos/`) — maior lacuna
- [ ] **Bio** do estudio (o Lovable nao tem texto util)
- [ ] **Lista de projetos** (nome, cidade, area, ano, programa)
- [ ] **Contato** (site, Instagram, telefone, email)
- [ ] **Imagens dos projetos** (o Lovable rende pouco; idealmente originais hi-res)

### Maria Isabel Bianchi (`maria-isabel-bianchi/`)
- [ ] **Enquadramento**: ela e recem-formada (Mackenzie 2020-2024). Decidir como apresentar (projetos academicos/conceituais/iniciais) sem soar inflado
- [ ] Imagens-chave do Instagram, se houver
- [ ] Originais hi-res do portfolio, se tiver (melhor que raspar do Wix)

## Minimos tecnicos por arquiteto (pra pagina nao quebrar)

- 1 projeto ancora com **>= 4 imagens** (vira hero + grade 2x2)
- **>= 1 projeto** alem do ancora (senao a galeria fica vazia)
- `completedProjects` honesto e **> 0** (senao aparece "0+")

Se algum arquiteto real nao atingir o minimo, sinalizo no checkpoint pra gente decidir o ajuste.

## Fluxo

1. Rodar scraper + WebFetch (Rosmari piloto)
2. Otimizar imagens
3. Montar dados na voz de marca ([[copy-sem-travessao]]: zero travessao; LSF na 1ª mencao)
4. Doc de revisao por arquiteto -> seu OK
5. Trocar os 4 mock pelos 3 reais + tracking GA4
6. QA + deploy (segue noindex/privada)

## Decisoes travadas (2026-06-02)
- **Posicionamento**: o arquiteto assina o projeto e a **Berkahn constroi em Light Steel Frame**. As bios descrevem a especialidade REAL de cada arquiteto, sem forcar discurso de steel frame. Ajustar copy do hub + PathChooser no Sprint 3.
- **Ritmo**: piloto Rosmari validado; Bianchi + Airos adiantados em paralelo a revisao da Rosmari.

## Follow-up aberto (Fase 2)
- [ ] **Bianchi — projeto residencial**: a capa/galeria dela hoje usa obras Are (comercial/institucional), re-curada para as menos industriais (arena Pacaembu). Quando Bruno enviar imagens de um **projeto residencial real dela** (o CV cita um freelance), trocar capa + galeria. Dropar em `architects-intake/maria-isabel-bianchi/`.
- [ ] **Rosmari — headshot** real (hoje o portrait e um render).
- [ ] **Airos — foto dos fundadores** (confirmar qual e Matheus/Gustavo; ideal foto dupla).
