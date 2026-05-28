-- ============================================
-- BERKAHN - ANALYTICS SNAPSHOTS
-- ============================================
-- Run this migration in your Supabase SQL Editor
-- Stores monthly GA4 + GSC snapshots for /admin/analytics dashboard

CREATE TABLE IF NOT EXISTS analytics_snapshots (
  month DATE PRIMARY KEY,                     -- 2026-04-01 (1st of month)
  ga4_data JSONB NOT NULL,                    -- raw GA4 result
  gsc_data JSONB NOT NULL,                    -- raw GSC result
  ga4_prev JSONB,                             -- previous month GA4 (for MoM)
  gsc_prev JSONB,                             -- previous month GSC (for MoM)
  context JSONB NOT NULL,                     -- enriched (titles, insights, actions, indexation)
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_month_desc
  ON analytics_snapshots (month DESC);

-- ============================================
-- RLS
-- ============================================
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;

-- service_role bypassa RLS (cron INSERT/UPSERT)
-- Authenticated users (admin login) podem SELECT
DROP POLICY IF EXISTS "Authenticated admin SELECT" ON analytics_snapshots;
CREATE POLICY "Authenticated admin SELECT"
  ON analytics_snapshots FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE analytics_snapshots IS 'Monthly performance snapshots populated by berkahn-performance-mensal cron. Read by /admin/analytics dashboard.';
COMMENT ON COLUMN analytics_snapshots.month IS 'First day of the analyzed month (e.g., 2026-04-01 represents April 2026).';
COMMENT ON COLUMN analytics_snapshots.context IS 'Enriched render context: indexation, insights, actionsP0/P1/P2, summary, period metadata.';
