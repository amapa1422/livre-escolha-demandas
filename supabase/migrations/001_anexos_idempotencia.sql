-- Incremental para o esquema fornecido em 03/11/2026. Executar no SQL Editor.
-- Não recria tabelas, não remove registros e não altera as três RPCs existentes.
-- Requer perfis/demandas/anexos, storage.objects e private.funcionario_ativo().
BEGIN;

-- Não consolidar duplicatas automaticamente. Se houver, abortar para revisão.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM public.demandas WHERE chave_criacao IS NOT NULL
    GROUP BY criado_por, chave_criacao HAVING count(*) > 1) THEN
    RAISE EXCEPTION 'Existem chaves de criação duplicadas. Revisar antes de aplicar; nenhum dado foi removido.';
  END IF;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS demandas_criador_chave_supabase_uidx
  ON public.demandas(criado_por, chave_criacao) WHERE chave_criacao IS NOT NULL;

-- Escrita de metadados somente por operação protegida; não concede INSERT
-- direto em anexos, UPDATE/DELETE em demandas nem escrita em histórico/perfis.
CREATE OR REPLACE FUNCTION public.registrar_anexo_demanda(
  p_demanda_id bigint, p_arquivo_path text, p_nome_original text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_usuario uuid := auth.uid();
  v_criador uuid;
  v_excluido timestamptz;
  v_metadata jsonb;
  v_mime text;
  v_bytes bigint;
  v_id uuid;
  v_path text;
BEGIN
  IF v_usuario IS NULL OR private.funcionario_ativo() IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Funcionário ativo necessário.' USING ERRCODE = '42501';
  END IF;
  SELECT criado_por, excluido_em INTO v_criador, v_excluido FROM public.demandas
    WHERE id = p_demanda_id FOR UPDATE;
  IF NOT FOUND OR v_excluido IS NOT NULL OR v_criador <> v_usuario THEN
    RAISE EXCEPTION 'Somente o criador pode anexar um print à sua demanda ativa.' USING ERRCODE = '42501';
  END IF;
  IF p_arquivo_path IS NULL OR
    p_arquivo_path !~ ('^' || v_usuario::text || '/' || p_demanda_id::text || '/[a-f0-9-]{36}\.(webp|png|jpg|jpeg)$') THEN
    RAISE EXCEPTION 'Caminho de anexo inválido.' USING ERRCODE = '22023';
  END IF;
  -- Informações obtidas do objeto armazenado, nunca de bytes/MIME arbitrários
  -- enviados como parâmetros do navegador.
  SELECT metadata INTO v_metadata FROM storage.objects
    WHERE bucket_id = 'prints-demandas' AND name = p_arquivo_path;
  IF NOT FOUND THEN RAISE EXCEPTION 'Arquivo não encontrado no bucket privado.'; END IF;
  v_mime := v_metadata->>'mimetype';
  v_bytes := (v_metadata->>'size')::bigint;
  IF v_mime IS NULL OR v_mime NOT IN ('image/png','image/jpeg','image/webp')
      OR v_bytes IS NULL OR v_bytes <= 0 OR v_bytes > 1048576
      OR (v_mime = 'image/png' AND p_arquivo_path !~ '\.png$')
      OR (v_mime = 'image/jpeg' AND p_arquivo_path !~ '\.jpe?g$')
      OR (v_mime = 'image/webp' AND p_arquivo_path !~ '\.webp$') THEN
    RAISE EXCEPTION 'Print deve ser PNG, JPEG ou WebP, com até 1 MB.' USING ERRCODE = '22023';
  END IF;
  SELECT id, arquivo_path INTO v_id, v_path FROM public.anexos
    WHERE demanda_id = p_demanda_id ORDER BY criado_em, id LIMIT 1;
  IF FOUND THEN
    IF v_path = p_arquivo_path THEN RETURN v_id; END IF;
    RAISE EXCEPTION 'Esta demanda já possui um print; o arquivo existente foi preservado.';
  END IF;
  INSERT INTO public.anexos(demanda_id, arquivo_path, nome_original, mime_type, tamanho_bytes, criado_por)
    VALUES (p_demanda_id, p_arquivo_path, left(p_nome_original,255), v_mime, v_bytes, v_usuario)
    RETURNING id INTO v_id;
  -- Notifica o canal de demandas já publicado, após registrar o anexo.
  UPDATE public.demandas SET atualizado_em = now(), versao = versao + 1 WHERE id = p_demanda_id;
  RETURN v_id;
END;
$$;
REVOKE ALL ON FUNCTION public.registrar_anexo_demanda(bigint,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.registrar_anexo_demanda(bigint,text,text) TO authenticated;
COMMENT ON FUNCTION public.registrar_anexo_demanda(bigint,text,text) IS
  'Registra um print existente no bucket privado para o criador ativo, com bloqueio/idempotência e metadados conferidos no Storage.';
COMMIT;
