-- ============================================
-- BERKAHN - PROMPT DE IMAGEM DO LINKEDIN
-- ============================================
-- O /linkedin produzia um `briefing-imagem.md` no vault. Com o quadro de
-- conteúdo virando fonte da verdade, esse texto precisa de casa aqui — senão
-- volta para o vault e recria a dupla escrita que a 010 veio acabar.
--
-- Nenhuma coluna existente servia:
--   linkedin_briefing → é o ÂNGULO do calendário editorial, com 66 linhas já
--     preenchidas. A 010 documenta na linha 86 que sobrescrevê-lo destrói a
--     única cópia do briefing.
--   insights          → é a justificativa editorial, também vinda do seed.
--   linkedin_texto    → anexar ali quebraria o botão de copiar, que precisa
--     sair limpo para colar direto no LinkedIn.
--
-- Duas colunas e não uma: o prompt em inglês é o que ganha botão de copiar e
-- tem que sair sem a justificativa em português junto. É a mesma separação que
-- motivou linkedin_briefing ≠ linkedin_texto na 010.
--
-- Prefixo `linkedin_` deixa espaço para blog_imagem_prompt depois, sem rename.
--
-- Idempotente. NÃO toca no CHECK de activity_logs: a 010 (linha 174) documenta
-- que a lista é reescrita inteira e que copiar a versão errada apaga
-- 'orcamento', quebrando todo log de /admin/orcamentos.

ALTER TABLE conteudo_pautas
  ADD COLUMN IF NOT EXISTS linkedin_imagem_prompt   TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_imagem_briefing TEXT;

COMMENT ON COLUMN conteudo_pautas.linkedin_imagem_prompt IS
  'Prompt em inglês para gerar a imagem do post por IA. Sai limpo no botão de copiar — não misturar com justificativa.';

COMMENT ON COLUMN conteudo_pautas.linkedin_imagem_briefing IS
  'Direção visual em português (textos da imagem, referência, identidade). Insumo do prompt, não o prompt.';
