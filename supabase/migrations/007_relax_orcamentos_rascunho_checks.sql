-- ============================================
-- BERKAHN ADMIN - ORCAMENTOS (relaxar CHECKs pra suportar rascunhos parciais)
-- ============================================
-- Run this migration in your Supabase SQL Editor.
-- Permite que rascunhos sejam salvos com projeto_area_m2 = 0 (campo
-- ainda não preenchido). A validação > 0 fica no wizard (UI) ao
-- finalizar — não no DB.

ALTER TABLE orcamentos
  DROP CONSTRAINT IF EXISTS orcamentos_projeto_area_m2_check;

ALTER TABLE orcamentos
  ADD CONSTRAINT orcamentos_projeto_area_m2_check
  CHECK (projeto_area_m2 >= 0);

-- Os demais CHECKs (valor_min/max >= 0, valor_max >= valor_min,
-- valor_m2_min/max >= 0, validade_dias > 0, projeto_pavimentos > 0)
-- já são compatíveis com initialState() do wizard, não precisam alterar.
