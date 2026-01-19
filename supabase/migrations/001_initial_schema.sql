-- ============================================
-- BERKAHN ADMIN - INITIAL SCHEMA
-- ============================================
-- Run this migration in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- POSTS TABLE (Blog/Atualidade)
-- ============================================

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT NOT NULL DEFAULT 'Tecnologia',
  tags TEXT[] DEFAULT '{}',
  author TEXT NOT NULL DEFAULT 'Berkahn',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  read_time INTEGER NOT NULL DEFAULT 5,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PRESENTATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS presentations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  project_type TEXT NOT NULL,
  slides JSONB NOT NULL DEFAULT '[]',
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'sent', 'viewed')),
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  view_count INTEGER NOT NULL DEFAULT 0,
  access_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_presentations_status ON presentations(status);
CREATE INDEX IF NOT EXISTS idx_presentations_access_token ON presentations(access_token);

CREATE TRIGGER update_presentations_updated_at
  BEFORE UPDATE ON presentations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PROPOSALS TABLE
-- ============================================

-- Create sequence for proposal numbers
CREATE SEQUENCE IF NOT EXISTS proposal_number_seq START 1;

CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_number TEXT NOT NULL UNIQUE DEFAULT 'BRK-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('proposal_number_seq')::TEXT, 3, '0'),
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  client_address TEXT,
  project_type TEXT NOT NULL,
  project_description TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount_type TEXT NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'approved', 'rejected', 'expired')),
  valid_until DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  payment_terms TEXT,
  notes TEXT,
  internal_notes TEXT,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  access_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_access_token ON proposals(access_token);
CREATE INDEX IF NOT EXISTS idx_proposals_client_name ON proposals(client_name);

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ACTIVITY LOG TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('post', 'proposal', 'presentation')),
  entity_id UUID NOT NULL,
  entity_name TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Posts: Authenticated users can CRUD
CREATE POLICY "Allow authenticated users to manage posts"
  ON posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Posts: Public can read published posts
CREATE POLICY "Allow public to read published posts"
  ON posts
  FOR SELECT
  TO anon
  USING (status = 'published');

-- Presentations: Authenticated users can CRUD
CREATE POLICY "Allow authenticated users to manage presentations"
  ON presentations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Presentations: Public can read by access token
CREATE POLICY "Allow public to view presentations by token"
  ON presentations
  FOR SELECT
  TO anon
  USING (true); -- Token validation should be done in application

-- Proposals: Authenticated users can CRUD
CREATE POLICY "Allow authenticated users to manage proposals"
  ON proposals
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Proposals: Public can read by access token
CREATE POLICY "Allow public to view proposals by token"
  ON proposals
  FOR SELECT
  TO anon
  USING (true); -- Token validation should be done in application

-- Activity logs: Authenticated users can read/insert
CREATE POLICY "Allow authenticated users to view activity logs"
  ON activity_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert activity logs"
  ON activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Run these in the Supabase Dashboard > Storage

-- Create bucket for post images
-- INSERT INTO storage.buckets (id, name, public) VALUES ('posts', 'posts', true);

-- Create bucket for presentation assets
-- INSERT INTO storage.buckets (id, name, public) VALUES ('presentations', 'presentations', true);

-- Create bucket for proposal attachments
-- INSERT INTO storage.buckets (id, name, public) VALUES ('proposals', 'proposals', false);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'posts', json_build_object(
      'total', (SELECT COUNT(*) FROM posts),
      'published', (SELECT COUNT(*) FROM posts WHERE status = 'published'),
      'drafts', (SELECT COUNT(*) FROM posts WHERE status = 'draft'),
      'scheduled', (SELECT COUNT(*) FROM posts WHERE status = 'scheduled')
    ),
    'proposals', json_build_object(
      'total', (SELECT COUNT(*) FROM proposals),
      'pending', (SELECT COUNT(*) FROM proposals WHERE status IN ('draft', 'sent')),
      'approved', (SELECT COUNT(*) FROM proposals WHERE status = 'approved'),
      'rejected', (SELECT COUNT(*) FROM proposals WHERE status = 'rejected'),
      'total_value', COALESCE((SELECT SUM(total) FROM proposals WHERE status = 'approved'), 0)
    ),
    'presentations', json_build_object(
      'total', (SELECT COUNT(*) FROM presentations),
      'sent', (SELECT COUNT(*) FROM presentations WHERE status = 'sent'),
      'viewed', (SELECT COUNT(*) FROM presentations WHERE status = 'viewed')
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
