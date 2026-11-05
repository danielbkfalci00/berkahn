-- Qualificação de lead: área aproximada da obra e se o terreno já foi adquirido.
-- Ambos opcionais, preenchidos pelo formulário residencial. Idempotente.

BEGIN;

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS area_obra_m2 INTEGER,
  ADD COLUMN IF NOT EXISTS terreno_adquirido TEXT;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'leads_area_obra_m2_check') THEN
    ALTER TABLE leads ADD CONSTRAINT leads_area_obra_m2_check
      CHECK (area_obra_m2 IS NULL OR (area_obra_m2 > 0 AND area_obra_m2 <= 100000));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'leads_terreno_adquirido_check') THEN
    ALTER TABLE leads ADD CONSTRAINT leads_terreno_adquirido_check
      CHECK (terreno_adquirido IS NULL OR terreno_adquirido IN ('sim', 'nao'));
  END IF;
END $$;

COMMENT ON COLUMN leads.area_obra_m2 IS 'Área construída aproximada informada pelo lead (m²). Opcional.';
COMMENT ON COLUMN leads.terreno_adquirido IS 'sim | nao. Opcional, informado pelo lead.';

COMMIT;
