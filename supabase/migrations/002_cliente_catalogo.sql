-- Vínculo de uma seleção explícita do catálogo local a public.clientes.
-- Sem importar catálogo em massa, sem atualizar clientes existentes ou conceder
-- INSERT/UPDATE genéricos. Somente funcionários ativos podem chamar a função.
BEGIN;
CREATE OR REPLACE FUNCTION public.obter_cliente_catalogo(p_nome text, p_logo_path text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_id uuid;
BEGIN
  IF auth.uid() IS NULL OR private.funcionario_ativo() IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Funcionário ativo necessário.' USING ERRCODE = '42501';
  END IF;
  IF p_nome IS NULL OR length(btrim(p_nome)) NOT BETWEEN 1 AND 100
      OR p_logo_path IS NULL OR p_logo_path !~ '^logos/[a-z0-9-]+\.(webp|png|jpg|jpeg)$' THEN
    RAISE EXCEPTION 'Seleção de cliente inválida.' USING ERRCODE = '22023';
  END IF;
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(lower(btrim(p_nome)), 0));
  SELECT id INTO v_id FROM public.clientes
    WHERE ativo AND lower(btrim(nome)) = lower(btrim(p_nome)) ORDER BY criado_em, id LIMIT 1;
  IF FOUND THEN RETURN v_id; END IF;
  INSERT INTO public.clientes(nome, nome_normalizado, logo_path)
    VALUES (btrim(p_nome), lower(btrim(p_nome)), p_logo_path) RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;
REVOKE ALL ON FUNCTION public.obter_cliente_catalogo(text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.obter_cliente_catalogo(text,text) TO authenticated;
COMMIT;
