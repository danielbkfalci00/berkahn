import { createClient } from "@/lib/supabase/server";
import { PostEditor } from "@/components/admin/posts/PostEditor";
import { notFound } from "next/navigation";
import type { Post } from "@/types/admin";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // TODO: Replace with real Supabase query when table is created
  // const { data: post, error } = await supabase
  //   .from('posts')
  //   .select('*')
  //   .eq('id', id)
  //   .single();

  // Mock data for development
  const mockPosts: Record<string, Post> = {
    "1": {
      id: "1",
      title: "5 Vantagens Decisivas do Light Steel Frame",
      slug: "5-vantagens-decisivas-light-steel-frame",
      excerpt:
        "Descubra por que o Steel Frame está revolucionando a construção civil brasileira com suas vantagens incomparáveis.",
      content: `# 5 Vantagens Decisivas do Light Steel Frame

O **Light Steel Frame** (LSF) está transformando a construção civil no Brasil. Neste artigo, exploramos as cinco principais vantagens que fazem dessa tecnologia uma escolha inteligente.

## 1. Velocidade de Construção

Uma das maiores vantagens do Steel Frame é a **velocidade de execução**. Enquanto uma casa em alvenaria convencional pode levar de 12 a 18 meses, uma construção em LSF pode ser concluída em apenas 3 a 4 meses.

## 2. Sustentabilidade

O Steel Frame é uma construção **seca**, que gera muito menos resíduos e consome menos água durante a obra. Além disso, os perfis de aço são 100% recicláveis.

## 3. Precisão Dimensional

Com projetos desenvolvidos em software BIM, cada peça é cortada com precisão milimétrica, eliminando desperdícios e garantindo um encaixe perfeito.

## 4. Conforto Térmico e Acústico

Os sistemas de isolamento utilizados no Steel Frame proporcionam excelente conforto térmico e acústico, superando a alvenaria convencional.

## 5. Durabilidade

Contrário ao senso comum, o Steel Frame é extremamente durável. Os perfis são galvanizados, garantindo proteção contra corrosão por décadas.

---

Interessado em construir com Steel Frame? [Entre em contato](/contato) conosco!`,
      cover_image: "/images/atualidade/steel-frame-vantagens.webp",
      category: "Tecnologia",
      tags: ["steel-frame", "construção", "sustentabilidade", "velocidade"],
      author: "Berkahn",
      status: "published",
      published_at: "2024-01-15T10:00:00Z",
      scheduled_at: null,
      read_time: 8,
      featured: true,
      meta_title: "5 Vantagens do Steel Frame para sua Construção | Berkahn",
      meta_description:
        "Conheça as 5 vantagens decisivas do Light Steel Frame: velocidade, sustentabilidade, precisão, conforto e durabilidade.",
      created_at: "2024-01-10T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
    "2": {
      id: "2",
      title: "Steel Frame vs Alvenaria: Comparativo Completo",
      slug: "steel-frame-vs-alvenaria",
      excerpt:
        "Uma análise detalhada comparando os dois métodos construtivos mais utilizados no Brasil.",
      content: `# Steel Frame vs Alvenaria: Comparativo Completo

Neste artigo, vamos comparar detalhadamente o **Steel Frame** com a **Alvenaria Convencional** para ajudá-lo a tomar a melhor decisão para seu projeto.

## Tempo de Construção

| Critério | Steel Frame | Alvenaria |
|----------|-------------|-----------|
| Casa 150m² | 90 dias | 180+ dias |
| Prédio 4 andares | 6 meses | 18+ meses |

## Custo Total

O custo inicial do Steel Frame pode ser ligeiramente superior, mas quando consideramos:
- Menor tempo de obra (menos custos com mão de obra)
- Menor desperdício de materiais
- Economia com energia a longo prazo

O **custo-benefício do Steel Frame é superior**.

## Sustentabilidade

- **Steel Frame**: Construção seca, 100% reciclável
- **Alvenaria**: Alto consumo de água, mais resíduos

## Conclusão

Para projetos que valorizam velocidade, sustentabilidade e precisão, o Steel Frame é a escolha ideal.`,
      cover_image: "/images/atualidade/comparativo.webp",
      category: "Análise",
      tags: ["steel-frame", "alvenaria", "comparativo", "construção"],
      author: "Berkahn",
      status: "published",
      published_at: "2024-01-20T10:00:00Z",
      scheduled_at: null,
      read_time: 12,
      featured: false,
      meta_title: null,
      meta_description: null,
      created_at: "2024-01-18T10:00:00Z",
      updated_at: "2024-01-20T10:00:00Z",
    },
    "3": {
      id: "3",
      title: "Novo Artigo em Desenvolvimento",
      slug: "novo-artigo-desenvolvimento",
      excerpt: "Este artigo está sendo preparado...",
      content: "# Rascunho\n\nConteúdo em desenvolvimento...",
      cover_image: null,
      category: "Guia",
      tags: [],
      author: "Berkahn",
      status: "draft",
      published_at: null,
      scheduled_at: null,
      read_time: 5,
      featured: false,
      meta_title: null,
      meta_description: null,
      created_at: "2024-01-25T10:00:00Z",
      updated_at: "2024-01-25T10:00:00Z",
    },
  };

  const post = mockPosts[id];

  if (!post) {
    notFound();
  }

  return <PostEditor post={post} />;
}
