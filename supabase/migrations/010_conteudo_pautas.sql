-- ============================================
-- BERKAHN - QUADRO DE CONTEÚDO (/admin/conteudo)
-- ============================================
-- Uma linha = uma PAUTA (assunto), não um artigo. O card agrega insights,
-- pesquisa, artigo, post de LinkedIn e as duas capas. Replica o "Cronograma
-- Conteúdo" do Notion, que hoje é preenchido à mão e fora da ferramenta.
--
-- Nada aqui escreve em `posts`. O quadro só REFERENCIA o artigo por FK e LÊ
-- `posts.status` para exibir. Arrastar um card para "Publicado" move o card,
-- não publica o artigo — publicar continua sendo ato explícito no editor.
--
-- Naming em português seguindo as migrations 008 e 009: as colunas de domínio
-- (trilha, funil, intencao) não têm tradução usável, e `title` ao lado de
-- `funil` é pior que `titulo` ao lado de `funil`. Única exceção: `post_id`,
-- que nomeia a tabela estrangeira e tem o mesmo nome nas duas línguas.
--
-- Idempotente.

CREATE TABLE IF NOT EXISTS conteudo_pautas (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- ---------- Identidade ----------
  titulo            TEXT NOT NULL CHECK (char_length(titulo) BETWEEN 1 AND 300),

  -- Discrimina o que o card promete entregar. 'linkedin-acervo' são os 22 posts
  -- derivados de artigos já publicados: não há artigo a escrever nem capa de
  -- blog. Sem o discriminador, a única forma de distinguir seria "tem post_id e
  -- não tem keyword" — inferência frágil que quebra ao vincular um refresh.
  tipo              TEXT NOT NULL DEFAULT 'pauta'
                    CHECK (tipo IN ('pauta', 'linkedin-acervo')),

  -- ---------- Kanban ----------
  -- Slugs ASCII, nunca os rótulos do Notion. 'Decisão LK/Blog' tem acento e
  -- barra: viraria query string quebrada e comparação sensível a NFC/NFD.
  -- O rótulo vive no TS (COLUNA_LABEL em types/conteudo.ts).
  coluna            TEXT NOT NULL DEFAULT 'decisao'
                    CHECK (coluna IN ('decisao', 'pesquisa', 'envelopar',
                                      'produzido', 'aprovado', 'publicado')),

  -- Mesma semântica de analytics_tasks.sort_order (005).
  ordem             INTEGER NOT NULL DEFAULT 0,

  -- ---------- Planejamento editorial ----------
  -- Todos nullable: card criado à mão no quadro não vem do calendário.
  keyword           TEXT,

  -- Enums em ASCII com label no TS. O vault traz 'objeção' e 'pós-venda' e o
  -- seed normaliza. Acento em CHECK sobrevive, mas dói no dia em que virar
  -- query string ou chave de Record<> no TypeScript.
  intencao          TEXT CHECK (intencao IS NULL OR intencao IN
                    ('transacional', 'informacional', 'comparativa', 'objecao')),
  funil             TEXT CHECK (funil IS NULL OR funil IN
                    ('topo', 'meio', 'fundo', 'pos-venda')),

  -- Coluna P do calendário. Observados 2..5; faixa aberta em 1..5 para não
  -- travar card manual.
  prioridade        SMALLINT CHECK (prioridade IS NULL OR prioridade BETWEEN 1 AND 5),
  trilha            TEXT CHECK (trilha IS NULL OR trilha IN ('core', 'expansao')),

  -- Número puro (1..22), não 'S1'. Como TEXT, 'S10' < 'S2' e o quadro exibiria
  -- as semanas fora de ordem. A UI renderiza 'S' || semana.
  semana            SMALLINT CHECK (semana IS NULL OR semana BETWEEN 1 AND 53),

  -- Segunda-feira da semana. DATE e não TIMESTAMPTZ: é data de calendário, não
  -- instante — fuso num campo que nunca tem hora só cria bug.
  data_alvo         DATE,

  -- ---------- Os 6 blocos do card ----------
  insights          TEXT,   -- "Insights & Referências"  (fonte da verdade aqui)
  pesquisa_conteudo TEXT,   -- "Pesquisa Conteúdo"       (fonte da verdade aqui)
                            -- nome longo de propósito: `pesquisa` colidiria na
                            -- leitura com o valor 'pesquisa' de `coluna`.

  -- "Artigo Finalizado": REFERÊNCIA, nunca cópia. O artigo vive em `posts` +
  -- markdown no vault.
  --   SET NULL e não CASCADE: o card carrega semanas de pesquisa, insights,
  --   texto e capas — apagar o post não pode destruir isso.
  --   SET NULL e não RESTRICT: RESTRICT faria o delete em /admin/posts falhar
  --   por causa de uma tabela que aquela tela nem conhece.
  post_id           UUID REFERENCES posts(id) ON DELETE SET NULL,

  capa_blog_url     TEXT,   -- "Capa Blog"      → URL pública do bucket post-images
  capa_linkedin_url TEXT,   -- "Capa Linkedin"  → idem, outro prefixo
  linkedin_texto    TEXT,   -- "Texto Linkedin" (fonte da verdade aqui)

  -- Ângulo + dado-âncora vindos do calendário. Separado de `linkedin_texto`
  -- porque é INSUMO, não entregável: despejar o ângulo no campo final faria o
  -- card nascer parecendo pronto, e o /linkedin sobrescreveria a única cópia
  -- do briefing.
  linkedin_briefing TEXT,

  -- Array e não dois booleanos: a lista cresce (Instagram, newsletter) sem
  -- migration. O operador `<@` valida os elementos — um CHECK comum não
  -- alcança item de array.
  plataformas       TEXT[] NOT NULL DEFAULT '{}'
                    CHECK (plataformas <@ ARRAY['blog', 'linkedin']::TEXT[]),

  -- ---------- Rastreio ----------
  criado_por        TEXT,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Não há coluna de rastreio do seed: ele roda uma vez numa tabela vazia e é
-- gerador de SQL, não importador idempotente. Se sair errado, o conserto é
-- `DELETE FROM conteudo_pautas;` e gerar de novo.

-- ============================================
-- ÍNDICES
-- ============================================
-- Leitura dominante do quadro: "todos os cards, por coluna, na ordem". O
-- composto cobre o ORDER BY inteiro; dois índices separados não cobririam.
CREATE INDEX IF NOT EXISTS idx_pautas_coluna_ordem
  ON conteudo_pautas (coluna, ordem);

CREATE INDEX IF NOT EXISTS idx_pautas_data_alvo
  ON conteudo_pautas (data_alvo) WHERE data_alvo IS NOT NULL;

-- Um artigo pertence a UM card. Parcial porque 44 das 66 linhas do seed nascem
-- com post_id NULL. Esta constraint VAI disparar: quatro pautas Core são
-- refresh declarado de artigo existente. Disparar é o comportamento certo —
-- significa "esses dois cards são o mesmo assunto, funda". Quem trata a
-- mensagem é vincularPost(), com pré-check, para não vazar erro do Postgres.
CREATE UNIQUE INDEX IF NOT EXISTS uq_pautas_post
  ON conteudo_pautas (post_id) WHERE post_id IS NOT NULL;

-- ============================================
-- TRIGGER
-- ============================================
-- NÃO usar update_updated_at_column() da 001: ela faz `NEW.updated_at = NOW()`
-- e esta tabela usa `atualizado_em`. Com a função errada TODO UPDATE falha com
-- `record "new" has no field "updated_at"` — inclusive o drag-and-drop, que é
-- a interação principal do quadro. Mesma armadilha documentada na 009.
-- Redeclarada com CREATE OR REPLACE (corpo idêntico ao da 009) para esta
-- migration ser replayável sem depender da ordem.
CREATE OR REPLACE FUNCTION update_atualizado_em_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_conteudo_pautas_updated_at ON conteudo_pautas;
CREATE TRIGGER update_conteudo_pautas_updated_at
  BEFORE UPDATE ON conteudo_pautas
  FOR EACH ROW
  EXECUTE FUNCTION update_atualizado_em_column();

-- ============================================
-- RLS
-- ============================================
-- Obrigatória: o middleware protege a ROTA, não a TABELA — a anon key alcança
-- o PostgREST direto. Mesmo padrão de 005 e 009. Sem policy para anon: pauta é
-- planejamento interno e não tem superfície pública.
ALTER TABLE conteudo_pautas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated manage pautas" ON conteudo_pautas;
CREATE POLICY "Authenticated manage pautas"
  ON conteudo_pautas FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- ACTIVITY LOGS
-- ============================================
-- Estende entity_type para aceitar 'pauta'.
--
-- ⚠️ A lista é reescrita INTEIRA (DROP + ADD, não ADD VALUE). A 006 já havia
-- estendido para 'orcamento'; copiar a lista da 005 aqui APAGARIA esse valor e
-- todo INSERT em activity_logs vindo de app/admin/orcamentos/actions.ts
-- passaria a estourar em produção. Os seis valores abaixo são o estado real.
ALTER TABLE activity_logs DROP CONSTRAINT IF EXISTS activity_logs_entity_type_check;
ALTER TABLE activity_logs ADD CONSTRAINT activity_logs_entity_type_check
  CHECK (entity_type IN ('post', 'proposal', 'presentation', 'task', 'orcamento', 'pauta'));

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE  conteudo_pautas IS 'Quadro de conteúdo. Uma linha = uma pauta (assunto). Agrega insights, pesquisa, artigo (FK), post de LinkedIn e capas.';
COMMENT ON COLUMN conteudo_pautas.post_id IS 'Artigo do blog. Só referência: o conteúdo vive em posts + markdown no vault. O quadro nunca escreve em posts.status.';
COMMENT ON COLUMN conteudo_pautas.coluna IS 'Coluna do quadro. Independente de posts.status: mover para publicado não publica o artigo.';
COMMENT ON COLUMN conteudo_pautas.linkedin_briefing IS 'Ângulo + dado-âncora do calendário editorial. Insumo, não entregável — o texto final vai em linkedin_texto.';
COMMENT ON COLUMN conteudo_pautas.tipo IS 'pauta = assunto do calendário. linkedin-acervo = post de LinkedIn para artigo já publicado, sem artigo a escrever.';
