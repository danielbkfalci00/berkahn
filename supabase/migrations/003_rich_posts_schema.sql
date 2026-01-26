-- Migration: Add rich components support to posts
-- This enables posts to have structured components like stats, tables, charts, etc.

-- Add components JSONB column for rich content
ALTER TABLE posts ADD COLUMN IF NOT EXISTS components JSONB DEFAULT '{}';

-- Add scheduled_at for post scheduling
ALTER TABLE posts ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

-- Add index for faster queries on scheduled posts
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at ON posts(scheduled_at) WHERE scheduled_at IS NOT NULL;

-- Add index for faster queries by status
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);

-- Comment explaining the components structure
COMMENT ON COLUMN posts.components IS 'Rich components JSON structure:
{
  "stats": [{ "value": number, "suffix": string, "prefix": string, "label": string, "description": string }],
  "tables": [{ "id": string, "headers": string[], "rows": string[][], "highlightColumn": number, "caption": string }],
  "charts": [{ "id": string, "type": "bar"|"line"|"radar"|"pie", "title": string, "data": array }],
  "myths": [{ "myth": string, "truth": string }],
  "gallery": { "images": [{ "src": string, "alt": string, "caption": string }] },
  "checklist": { "title": string, "items": [{ "text": string, "checked": boolean }] },
  "process": [{ "step": number, "title": string, "description": string, "duration": string }],
  "quotes": [{ "text": string, "author": string, "role": string }]
}';

-- Update get_dashboard_stats to include scheduled posts count
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
      'pending', (SELECT COUNT(*) FROM proposals WHERE status = 'pending'),
      'approved', (SELECT COUNT(*) FROM proposals WHERE status = 'approved'),
      'rejected', (SELECT COUNT(*) FROM proposals WHERE status = 'rejected'),
      'total_value', COALESCE((SELECT SUM(value) FROM proposals), 0)
    ),
    'presentations', json_build_object(
      'total', (SELECT COUNT(*) FROM presentations),
      'sent', (SELECT COUNT(*) FROM presentations WHERE status = 'sent'),
      'viewed', (SELECT COUNT(*) FROM presentations WHERE status = 'viewed')
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
