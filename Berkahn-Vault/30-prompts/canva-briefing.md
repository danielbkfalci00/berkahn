---
tipo: prompt
criado: 2026-04-13
atualizado: 2026-05-21
tags:
  - ai/prompt
  - project/material
ai_summary: Gerar briefing detalhado de material visual para criação no Canva (LinkedIn, posters, treinamentos). Criado por Claude — pode ser ajustado.
status: active
versao: 1.0
calibrado_em: 2026-04-13
---

> [!note] Prompt criado por Claude
> Mais flexível que prompts de Bruno (linkedin-post, blog-*). Pode ser ajustado com mais liberdade. Ver [[prompts-calibrados]].

Leia a identidade da marca em [[berkahn-brand]] e os princípios de design em [[design-principles]].

## Tarefa

Gerar um briefing completo e detalhado para criação de material visual no Canva para a Berkahn.

## Tipos de Material

O briefing pode ser para:
- **Flyer A5** (148 x 210mm, retrato, sangria 3mm)
- **Cartão de visita** (90 x 50mm, sangria 3mm)
- **Material de treinamento** (apresentação, guia visual)
- **Mockup de equipamento** (personalização visual)
- **Post para redes sociais** (1080x1080 ou 1080x1350)
- **Banner** (dimensão variável)
- **Outro** (especificar formato)

## Padrões Obrigatórios

### Identidade Visual
- **Paleta**: Preto (#000000), Branco (#FFFFFF), Cinza Escuro (#1A1A1A), Off-white (#F4F2EC)
- **Tipografia**: Manrope (Google Fonts / disponível no Canva). Alternativa: Montserrat ou Inter
- **Ícones**: Line/Outline, stroke 1-1.5px, rounded corners
- **Logo**: Usar variante apropriada de `Docs/brand/logos/`

### Hierarquia Tipográfica
| Elemento | Peso | Tamanho |
|----------|------|---------|
| Nome BERKAHN | ExtraBold (800) | 48-72pt |
| Tagline "Erguendo o amanhã" | Light (300) | 14-18pt |
| Títulos de seção | Medium (500), UPPERCASE | 10-12pt |
| Texto de serviço | SemiBold (600) | 14-16pt |
| Informações de contato | Regular (400) | 10-12pt |

### Informações da Empresa (copiar exatamente)
```
BERKAHN
Erguendo o amanhã

contato.berkahn@gmail.com
+55 (11) 96641-5742
São Paulo, SP - Brasil
CNPJ: 39.455.932/0001-64
berkahn.vercel.app
```

### Princípios Premium
- Espaço em branco generoso
- Menos é mais — remover o não essencial
- Alinhamento perfeito
- Contraste forte (preto/branco puro)
- Tipografia limpa

### O que evitar
- Ícones coloridos ou muito detalhados
- Muitas fontes diferentes
- Textos muito grandes
- Elementos tocando as bordas
- Sombras ou gradientes exagerados
- Excesso de informação

## Formato de Entrega do Briefing

Para cada peça, especificar:

1. **Formato e dimensões** — Tamanho exato, orientação, sangria
2. **Layout zone** — Diagrama ASCII das zonas (como o flyer A5 tem Zona A Hero, Zona B Serviços, Zona C Contato)
3. **Conteúdo por zona** — Textos exatos, pesos tipográficos, tamanhos, cores
4. **Imagem/visual** — Descrição concreta do que usar (foto, fundo sólido, textura, overlay)
5. **QR Code** — Se necessário, URL e configurações (cor branca sobre fundo transparente)
6. **Checklist de qualidade** — Itens para verificar antes de finalizar
7. **Notas para impressão** — Se aplicável (resolução, formato de arquivo, acabamento)
