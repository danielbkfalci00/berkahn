-- ============================================
-- BERKAHN ADMIN - ANALYTICS TASKS (Sprint 7)
-- ============================================
-- Sistema de tarefas/ações priorizadas tipo Notion para o dashboard /admin/analytics.
-- Tarefas globais (não atadas ao mês do snapshot). Idempotente.

CREATE TABLE IF NOT EXISTS analytics_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'p1' CHECK (priority IN ('p0', 'p1', 'p2')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'done')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('system', 'manual')),
  origin_signal TEXT,
  completion_note TEXT,
  completed_by TEXT,
  completed_at TIMESTAMPTZ,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_tasks_status ON analytics_tasks(status);
CREATE INDEX IF NOT EXISTS idx_analytics_tasks_priority ON analytics_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_analytics_tasks_sort_order ON analytics_tasks(sort_order);

-- Trigger updated_at (reusa a função criada na migration 001)
DROP TRIGGER IF EXISTS update_analytics_tasks_updated_at ON analytics_tasks;
CREATE TRIGGER update_analytics_tasks_updated_at
  BEFORE UPDATE ON analytics_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS: authenticated users podem CRUD (mesmo padrão de posts/proposals)
ALTER TABLE analytics_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to manage analytics tasks" ON analytics_tasks;
CREATE POLICY "Allow authenticated users to manage analytics tasks"
  ON analytics_tasks
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Estende activity_logs.entity_type para aceitar 'task'
ALTER TABLE activity_logs DROP CONSTRAINT IF EXISTS activity_logs_entity_type_check;
ALTER TABLE activity_logs ADD CONSTRAINT activity_logs_entity_type_check
  CHECK (entity_type IN ('post', 'proposal', 'presentation', 'task'));
