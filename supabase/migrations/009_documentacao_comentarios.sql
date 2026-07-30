-- ============================================
-- BERKAHN - COMENTÁRIOS INLINE nas documentações
-- ============================================
-- Run this migration in your Supabase SQL Editor
--
-- Comentários ancorados a trechos de texto dos documentos de /admin/documentacoes,
-- no modelo do Notion: selecionar trecho -> abrir thread -> responder -> resolver.
--
-- Duas tabelas e não uma auto-referenciada: a thread é dona da âncora e do
-- status; o comentário é dona do texto e da posição de quem escreveu. Numa
-- tabela só, toda resposta carregaria colunas de âncora nulas.
--
-- Por que a âncora é por TEXTO e não por id de elemento: o HTML dos documentos
-- é regenerado por upsert (o de performance, várias vezes dentro do mesmo mês
-- via `--partial`). Qualquer id posicional ou hash de bloco muda junto com os
-- números. Ancorar pelo trecho citado + contexto (modelo W3C Web Annotation)
-- degrada de forma honesta: quando o texto some, o comentário fica órfão e é
-- exibido como tal, em vez de apontar silenciosamente para o lugar errado.

-- ============================================
-- THREADS (âncora + status)
-- ============================================
CREATE TABLE IF NOT EXISTS documento_threads (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  documento_slug    TEXT NOT NULL REFERENCES documentos(slug) ON DELETE CASCADE,

  -- Âncora
  texto_exato       TEXT NOT NULL CHECK (char_length(texto_exato) BETWEEN 4 AND 2000),
  prefixo           TEXT CHECK (prefixo IS NULL OR char_length(prefixo) <= 100),
  sufixo            TEXT CHECK (sufixo IS NULL OR char_length(sufixo) <= 100),
  posicao_relativa  REAL CHECK (posicao_relativa IS NULL OR posicao_relativa BETWEEN 0 AND 1),
  ancora_secao      TEXT,
  doc_versao        TIMESTAMPTZ,

  -- Estado
  status            TEXT NOT NULL DEFAULT 'aberto'
                    CHECK (status IN ('aberto', 'resolvido')),
  resolvido_por     TEXT,
  resolvido_em      TIMESTAMPTZ,

  criado_por        TEXT NOT NULL,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_threads_documento
  ON documento_threads (documento_slug, criado_em DESC);

-- ============================================
-- COMENTÁRIOS (conteúdo)
-- ============================================
CREATE TABLE IF NOT EXISTS documento_comentarios (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id     UUID NOT NULL REFERENCES documento_threads(id) ON DELETE CASCADE,
  corpo         TEXT NOT NULL CHECK (char_length(corpo) BETWEEN 1 AND 5000),

  -- O tipo vive aqui e não na thread: quem responde registra a própria posição.
  -- Uma thread aberta como 'duvida' pode receber 'aprovacao' de outra pessoa
  -- sem deixar de ser uma pergunta. O tipo exibido para a thread é o do
  -- primeiro comentário.
  tipo          TEXT NOT NULL DEFAULT 'comentario'
                CHECK (tipo IN ('comentario', 'duvida', 'aprovacao', 'reprovacao')),

  autor_nome    TEXT NOT NULL,
  autor_user_id UUID,   -- auth.uid(). Hoje é sempre a mesma conta compartilhada;
                        -- gravar desde já evita migration quando houver contas reais.

  editado_em    TIMESTAMPTZ,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comentarios_thread
  ON documento_comentarios (thread_id, criado_em);

-- ============================================
-- TRIGGERS (update_updated_at_column vem da 001)
-- ============================================
DROP TRIGGER IF EXISTS update_documento_threads_updated_at ON documento_threads;
CREATE TRIGGER update_documento_threads_updated_at
  BEFORE UPDATE ON documento_threads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_documento_comentarios_updated_at ON documento_comentarios;
CREATE TRIGGER update_documento_comentarios_updated_at
  BEFORE UPDATE ON documento_comentarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS
-- ============================================
-- Obrigatória: o middleware protege a ROTA, não a TABELA — a anon key alcança
-- o PostgREST direto. Mesmo padrão de analytics_tasks (005).
ALTER TABLE documento_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE documento_comentarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated manage threads" ON documento_threads;
CREATE POLICY "Authenticated manage threads"
  ON documento_threads FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated manage comentarios" ON documento_comentarios;
CREATE POLICY "Authenticated manage comentarios"
  ON documento_comentarios FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE documento_threads IS 'Thread de comentários ancorada a um trecho de um documento. Uma thread = uma âncora + N comentários.';
COMMENT ON COLUMN documento_threads.texto_exato IS 'Trecho selecionado, normalizado (whitespace colapsado). Mínimo de 4 chars: quotes menores são ambíguos demais nas tabelas dos relatórios.';
COMMENT ON COLUMN documento_threads.prefixo IS 'Até 100 chars imediatamente antes do trecho. Desempata ocorrências repetidas.';
COMMENT ON COLUMN documento_threads.sufixo IS 'Até 100 chars imediatamente depois do trecho.';
COMMENT ON COLUMN documento_threads.posicao_relativa IS 'Offset dividido pelo tamanho total do texto (0..1). Relativo e não absoluto porque o documento cresce a cada mês.';
COMMENT ON COLUMN documento_threads.ancora_secao IS 'id ou texto do <h2> mais próximo. Bônus de score na resolução, nunca filtro: renomear a seção orfanaria tudo abaixo dela.';
COMMENT ON COLUMN documento_threads.doc_versao IS 'documentos.atualizado_em no momento em que a thread nasceu. Se estiver defasado, a UI avisa que o documento mudou desde o comentário.';
COMMENT ON COLUMN documento_comentarios.tipo IS 'Posição de quem escreveu: comentario | duvida | aprovacao | reprovacao. Por comentário, não por thread.';
COMMENT ON COLUMN documento_comentarios.autor_nome IS 'Nome digitado e guardado no localStorage do navegador. Não é identidade verificada — hoje todos entram com a mesma conta.';
