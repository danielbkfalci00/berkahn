-- Normaliza a taxonomia editorial de /atualidades em cinco categorias.
-- Idempotente: somente aliases legados participam do UPDATE.

UPDATE posts AS post
SET category = mapping.canonical
FROM (
  VALUES
    ('Guia', 'Guias e Tutoriais'),
    ('Guias', 'Guias e Tutoriais'),
    ('Guia Técnico', 'Guias e Tutoriais'),
    ('Educação', 'Guias e Tutoriais'),
    ('Tecnologia', 'Tecnologia e Inovação'),
    ('Arquitetura e Tecnologia', 'Tecnologia e Inovação'),
    ('Construção Industrializada', 'Tecnologia e Inovação'),
    ('Mercado', 'Mercado e Custos'),
    ('Análise', 'Mercado e Custos'),
    ('Segurança', 'Segurança e Normas'),
    ('Engenharia Estrutural', 'Segurança e Normas'),
    ('Meio Ambiente', 'Sustentabilidade'),
    ('Eficiência Energética', 'Sustentabilidade')
) AS mapping(alias, canonical)
WHERE post.category = mapping.alias;

-- Verificação esperada no conjunto de 40 posts existente em 2026-08-06:
-- Guias e Tutoriais       16
-- Tecnologia e Inovação    9
-- Mercado e Custos         8
-- Segurança e Normas       3
-- Sustentabilidade         4
-- A contagem é operacional; não vira constraint porque o acervo cresce.
