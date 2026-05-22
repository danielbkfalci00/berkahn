---
tipo: context
criado: 2025-12-01
atualizado: 2026-05-21
tags:
  - ai/context
  - project/material
  - project/site
  - domain/brand
ai_summary: Guia de design para materiais físicos/digitais Berkahn — informações da empresa para copiar (dados de contato, CNPJ), regras visuais, paleta, tipografia. Complementa o design-principles do site.
status: active
escopo: berkahn
---

# Guia de Design - Materiais BERKAHN

> [!info] Migração para vault
> Migrado de `Docs/brand/GUIA-DESIGN-BERKAHN.md`. Identidade conceitual em [[berkahn-brand]]. Sistema visual do site em [[design-principles]].

## Informações da Empresa (COPIAR EXATAMENTE)

```
BERKAHN
Erguendo o amanhã

contato.berkahn@gmail.com
+55 (11) 96641-5742
São Paulo, SP - Brasil
CNPJ: 39.455.932/0001-64
berkahn.vercel.app

Instagram: @berkahn
LinkedIn: /company/berkahn
```

---

## Paleta de Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Preto Puro | `#000000` | Fundos, textos principais |
| Branco Puro | `#FFFFFF` | Fundos, textos sobre preto |
| Cinza Escuro | `#1A1A1A` | Fundos alternativos |
| Cinza Médio | `#666666` | Textos secundários |
| Cinza Claro | `#999999` | Labels, subtextos |
| Preto 70% | `#4D4D4D` | Textos sobre branco |
| Branco 70% | `rgba(255,255,255,0.7)` | Textos sobre preto |
| Branco 50% | `rgba(255,255,255,0.5)` | Taglines sobre preto |

---

## Tipografia

### Fonte Principal: **Manrope**
- Disponível no Google Fonts e no Canva
- Alternativa: Montserrat ou Inter

### Hierarquia Tipográfica

| Elemento | Peso | Tamanho | Espaçamento |
|----------|------|---------|-------------|
| Nome BERKAHN (grande) | ExtraBold (800) | 48-72pt | +10% tracking |
| Tagline | Light (300) | 14-18pt | +15% tracking |
| Títulos de seção | Medium (500) | 10-12pt | +20% tracking, UPPERCASE |
| Texto de serviço | SemiBold (600) | 14-16pt | Normal |
| Informações de contato | Regular (400) | 10-12pt | Normal |
| Labels pequenos | Regular (400) | 8-9pt | +10% tracking |

---

## FLYER A5

### Configuração no Canva
- **Tamanho:** A5 (148 x 210 mm)
- **Orientação:** Retrato (vertical)
- **Sangria:** Adicionar 3mm em cada lado se for imprimir

### Layout - 3 Zonas

```
┌─────────────────────────────────┐
│                                 │
│         ZONA A - HERO           │  45% do flyer
│     (Imagem + Logo + Tagline)   │  (~95mm de altura)
│                                 │
├─────────────────────────────────┤
│                                 │
│       ZONA B - SERVIÇOS         │  35% do flyer
│    (Ícones + Especialização)    │  (~73mm de altura)
│                                 │
├─────────────────────────────────┤
│                                 │
│       ZONA C - CONTATO          │  20% do flyer
│     (Info + QR Code)            │  (~42mm de altura)
│                                 │
└─────────────────────────────────┘
```

### ZONA A - Hero (Topo)

**Fundo:**
- Opção 1: Foto de estrutura steel frame com overlay diagonal preto
- Opção 2: Fundo preto sólido com elemento geométrico diagonal
- Overlay: Gradiente diagonal 45° (preto 90% → preto 30%)

**Conteúdo:**
```
BERKAHN
Erguendo o amanhã
────────
```

**Especificações:**
- "BERKAHN" - Manrope ExtraBold, 48-60pt, branco, centralizado
- "Erguendo o amanhã" - Manrope Light, 16pt, branco 50% opacidade
- Linha decorativa - 40px largura, 1px altura, branco 30%

### ZONA B - Serviços (Meio)

**Fundo:** Branco

**Conteúdo:**
```
NOSSOS SERVIÇOS

[🏠]        [🏢]        [🏭]
Residencial  Comercial   Industrial

Especialistas em Light Steel Frame
```

**Especificações:**
- "NOSSOS SERVIÇOS" - Manrope Medium, 10pt, cinza #666, uppercase, tracking +20%
- Ícones - 40x40px, stroke 1.5px, preto
- Nomes dos serviços - Manrope SemiBold, 14pt, preto
- "Especialistas em..." - Manrope Regular, 12pt, cinza #666

### ZONA C - Contato (Rodapé)

**Fundo:** Preto

**Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│  ✉ contato.berkahn@gmail.com   [QR] │
│  📞 +55 (11) 96641-5742        [QR] │
│  📍 São Paulo, SP - Brasil     [QR] │
│                                     │
│                          Acesse     │
│                          nosso site │
└─────────────────────────────────────┘
```

**Especificações:**
- Ícones - 14px, branco 50%
- Texto contato - Manrope Regular, 11pt, branco 70%
- QR Code - 80x80px, branco sobre preto
- "Acesse nosso site" - 8pt, branco 40%

---

## CARTÃO DE VISITA

### Configuração no Canva
- **Tamanho:** 90 x 50 mm (padrão brasileiro)
- **Sangria:** 3mm em cada lado para impressão

### FRENTE (Fundo Branco)

```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│              [LOGO B]                  │
│                                        │
│              BERKAHN                   │
│                                        │
│         Erguendo o amanhã              │
│                                        │
└────────────────────────────────────────┘
```

**Especificações:**
- Logo "B" - Centralizado, ~15-20mm de altura
- "BERKAHN" - Manrope ExtraBold, 16pt, preto, tracking +10%
- "Erguendo o amanhã" - Manrope Light, 9pt, preto 50%
- Espaçamento generoso (respiro visual)

**Efeito Premium (opcional para impressão):**
- Relevo seco no logo
- Hot stamping preto fosco
- Verniz localizado no logo

### VERSO (Fundo Preto)

```
┌────────────────────────────────────────┐
│ BERKAHN                                │
│ ─────                                  │
│                                        │
│ ✉ contato.berkahn@gmail.com            │
│ 📞 +55 (11) 96641-5742          [QR]   │
│ 📍 São Paulo, SP - Brasil       [QR]   │
│ 🌐 berkahn.vercel.app           [QR]   │
│ 📄 CNPJ: 39.455.932/0001-64            │
└────────────────────────────────────────┘
```

**Especificações:**
- "BERKAHN" (topo) - Manrope Bold, 9pt, branco 25% (fantasma)
- Linha - 15px, branco 15%
- Ícones - 10px, branco 40%
- Textos - Manrope Regular, 8pt, branco 70%
- QR Code - 15x15mm, canto inferior direito
- Espaçamento entre linhas: ~5mm

---

## Iconografia

### Ícones para Serviços (Estilo Line/Outline)

**Residencial** 🏠
- Casa simples com telhado triangular
- Stroke: 1.5px
- Buscar no Canva: "house line icon", "home outline"

**Comercial** 🏢
- Prédio com janelas em grid
- Stroke: 1.5px
- Buscar no Canva: "building line icon", "office outline"

**Industrial** 🏭
- Fábrica com chaminé
- Stroke: 1.5px
- Buscar no Canva: "factory line icon", "industrial outline"

### Ícones para Contato (Estilo Minimalista)

| Info | Ícone | Buscar no Canva |
|------|-------|-----------------|
| Email | ✉ | "mail line", "envelope outline" |
| Telefone | 📞 | "phone line", "call outline" |
| Localização | 📍 | "location pin line", "map marker outline" |
| Website | 🌐 | "globe line", "world outline" |
| CNPJ | 📄 | "document line", "file outline" |

**Estilo dos ícones:**
- Line/Outline (não preenchido)
- Stroke: 1-1.5px
- Corners: Rounded
- Cor: Mesmo tom do texto adjacente

---

## QR Code

### Gerar o QR Code

**URL:** `https://berkahn.vercel.app`

**Sites para gerar:**
- https://www.qrcode-monkey.com (permite customizar)
- https://www.qr-code-generator.com

**Configurações:**
- Correção de erro: High (H)
- Formato: PNG ou SVG
- Cor: Branco sobre fundo transparente (para usar no fundo preto)

**Tamanhos:**
- Flyer: 80x80px
- Cartão: 15x15mm

---

## Dicas de Design Premium

### Para Público Alto Padrão:

1. **Espaço em branco generoso** - Não encha tudo, deixe respirar
2. **Menos é mais** - Remova qualquer elemento que não seja essencial
3. **Alinhamento perfeito** - Use guias do Canva
4. **Consistência** - Mesmos espaçamentos, tamanhos, cores
5. **Tipografia limpa** - Evite muitas variações de tamanho
6. **Contraste forte** - Preto e branco puro, sem cinzas intermediários demais

### Erros a Evitar:

❌ Ícones coloridos ou muito detalhados
❌ Muitas fontes diferentes
❌ Textos muito grandes
❌ Elementos tocando as bordas
❌ Sombras ou gradientes exagerados
❌ Excesso de informação

### O que Transmite Luxo:

✅ Muito espaço em branco
✅ Tipografia fina e elegante
✅ Ícones minimalistas (line/outline)
✅ Contraste preto/branco
✅ Hierarquia clara
✅ Simplicidade extrema

---

## Checklist Final

### Flyer:
- [ ] Informações de contato conferidas
- [ ] Logo alinhado e proporcional
- [ ] Ícones no mesmo estilo (line)
- [ ] Textos com 5mm de margem das bordas
- [ ] QR Code funcional (testar scan)
- [ ] Arquivo em alta resolução (PDF para impressão)

### Cartão:
- [ ] Frente minimalista (não sobrecarregar)
- [ ] Verso com todas as informações
- [ ] CNPJ incluído
- [ ] QR Code pequeno mas escaneável
- [ ] Arquivo em alta resolução (PDF)

---

## Arquivos para Download

Para facilitar, você pode baixar:
- Logo: `Docs/Identidade Visual/logo_berkahn.png`
- QR Code: Gerar em qrcode-monkey.com

---

*Guia criado para materiais BERKAHN - Público Alto Padrão*
