-- Corrige um rotulo sem alterar o slug canonico nem as associacoes existentes.
-- A migration 015 ja foi aplicada e, por regra, permanece imutavel.

UPDATE conteudo_tags
SET label = U&'Integra\00E7\00F5es',
    atualizado_em = NOW()
WHERE slug = 'domain/integrations'
  AND label <> U&'Integra\00E7\00F5es';
