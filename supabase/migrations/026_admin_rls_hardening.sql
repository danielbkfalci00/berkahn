-- BERKAHN — HARDENING DO ADMIN E DADOS COMERCIAIS
-- Migration aditiva. As migrations anteriores já foram aplicadas em produção.

-- A aplicação tem uma única conta administrativa canônica. Um JWT apenas
-- autenticado não basta para ler ou alterar dados internos.

DROP POLICY IF EXISTS "Allow authenticated users to manage presentations" ON presentations;
CREATE POLICY "Berkahn admin manage presentations"
  ON presentations FOR ALL TO authenticated
  USING (public.is_berkahn_admin())
  WITH CHECK (public.is_berkahn_admin());

-- A policy antiga usava USING (true) e tornava todas as linhas enumeráveis.
-- Qualquer compartilhamento futuro por token deve validar o token numa rota
-- server-side antes de consultar com service role.
DROP POLICY IF EXISTS "Allow public to view presentations by token" ON presentations;

DROP POLICY IF EXISTS "Allow authenticated users to manage proposals" ON proposals;
CREATE POLICY "Berkahn admin manage proposals"
  ON proposals FOR ALL TO authenticated
  USING (public.is_berkahn_admin())
  WITH CHECK (public.is_berkahn_admin());

DROP POLICY IF EXISTS "Allow public to view proposals by token" ON proposals;

DROP POLICY IF EXISTS "Allow authenticated users to manage orcamentos" ON orcamentos;
CREATE POLICY "Berkahn admin manage orcamentos"
  ON orcamentos FOR ALL TO authenticated
  USING (public.is_berkahn_admin())
  WITH CHECK (public.is_berkahn_admin());

DROP POLICY IF EXISTS "Authenticated admin SELECT" ON documentos;
CREATE POLICY "Berkahn admin read documentos"
  ON documentos FOR SELECT TO authenticated
  USING (public.is_berkahn_admin());

-- A migration 024 restringia apenas logs de lead e deixava os demais logs
-- visíveis para qualquer conta authenticated.
DROP POLICY IF EXISTS "Authenticated users view scoped activity logs" ON activity_logs;
DROP POLICY IF EXISTS "Authenticated users insert scoped activity logs" ON activity_logs;
CREATE POLICY "Berkahn admin read activity logs"
  ON activity_logs FOR SELECT TO authenticated
  USING (public.is_berkahn_admin());
CREATE POLICY "Berkahn admin insert activity logs"
  ON activity_logs FOR INSERT TO authenticated
  WITH CHECK (public.is_berkahn_admin());

