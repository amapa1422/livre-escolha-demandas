-- Aplicar somente após autorização, depois de 001–003. Sem alterações nas RLS existentes.
BEGIN;
CREATE TABLE public.edicoes_demandas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  demanda_id bigint NOT NULL REFERENCES public.demandas(id),
  usuario_id uuid NOT NULL REFERENCES public.perfis(id),
  criado_em timestamptz NOT NULL DEFAULT now(),
  alteracoes jsonb NOT NULL CHECK (jsonb_typeof(alteracoes) = 'array' AND jsonb_array_length(alteracoes) > 0)
);
CREATE INDEX ON public.edicoes_demandas(demanda_id, criado_em);
ALTER TABLE public.edicoes_demandas ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.edicoes_demandas FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.edicoes_demandas TO authenticated;
CREATE POLICY ler_edicoes ON public.edicoes_demandas FOR SELECT TO authenticated
  USING (private.funcionario_ativo() AND EXISTS
    (SELECT 1 FROM public.demandas d WHERE d.id = demanda_id AND d.excluido_em IS NULL));

-- Garante revisão monotônica inclusive nas operações antigas que atualizam a linha.
CREATE FUNCTION private.revisao_edicao_004() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  NEW.versao := greatest(coalesce(NEW.versao, 0), coalesce(OLD.versao, 0) + 1);
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION private.revisao_edicao_004() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER zz_revisao_edicao_004 BEFORE UPDATE ON public.demandas
  FOR EACH ROW EXECUTE FUNCTION private.revisao_edicao_004();

CREATE FUNCTION public.editar_demanda(p_id bigint, p_versao bigint, p_valores jsonb,
  p_imagem_acao text DEFAULT 'manter', p_arquivo_path text DEFAULT NULL, p_nome_original text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_old public.demandas%ROWTYPE;
  v_before jsonb; v_changes jsonb := '[]'::jsonb; v_values jsonb;
  v_key text; v_path text; v_meta jsonb; v_mime text; v_size bigint;
BEGIN
  -- Bloqueia inativação/troca de papel durante a transação.
  PERFORM 1 FROM public.perfis WHERE id = v_uid AND ativo = true
    AND papel IN ('admin','funcionario') FOR SHARE;
  IF NOT FOUND OR private.funcionario_ativo() IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Funcionário ativo necessário.' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO v_old FROM public.demandas WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR v_old.excluido_em IS NOT NULL THEN
    RAISE EXCEPTION 'Demanda indisponível.' USING ERRCODE = '42501';
  END IF;
  IF p_versao IS NULL OR v_old.versao IS DISTINCT FROM p_versao THEN
    RAISE EXCEPTION 'A demanda foi alterada por outro operador. Recarregue os dados.' USING ERRCODE = '40001';
  END IF;
  IF p_valores IS NULL OR jsonb_typeof(p_valores) <> 'object' THEN
    RAISE EXCEPTION 'Campos inválidos.' USING ERRCODE = '22023';
  END IF;
  IF EXISTS (SELECT 1 FROM jsonb_object_keys(p_valores) k WHERE k NOT IN
    ('client','category','requester','priority','description')) THEN
    RAISE EXCEPTION 'Campo não editável.' USING ERRCODE = '22023';
  END IF;
  FOREACH v_key IN ARRAY ARRAY['client','category','requester','priority','description'] LOOP
    IF jsonb_typeof(p_valores->v_key) IS DISTINCT FROM 'string' THEN
      RAISE EXCEPTION 'Preencha todos os campos editáveis.' USING ERRCODE = '22023';
    END IF;
  END LOOP;
  v_values := jsonb_build_object('client', btrim(p_valores->>'client'),
    'category', p_valores->>'category', 'requester', btrim(p_valores->>'requester'),
    'priority', p_valores->>'priority', 'description', btrim(p_valores->>'description'));
  IF length(v_values->>'client') NOT BETWEEN 1 AND 100
    OR length(v_values->>'requester') NOT BETWEEN 1 AND 80
    OR length(v_values->>'description') > 2500
    OR v_values->>'category' NOT IN ('CANCELAMENTO','CONSULTA DE FIDELIDADE','TRANSFERÊNCIA DE TITULARIDADE','MUDANÇA')
    OR v_values->>'priority' NOT IN ('Normal','Alta') THEN
    RAISE EXCEPTION 'Verifique os campos obrigatórios e limites.' USING ERRCODE = '22023';
  END IF;
  IF p_imagem_acao IS NULL OR p_imagem_acao NOT IN ('manter','substituir','remover') THEN
    RAISE EXCEPTION 'Ação de imagem inválida.' USING ERRCODE = '22023';
  END IF;
  v_before := to_jsonb(v_old);
  FOREACH v_key IN ARRAY ARRAY['client','category','requester','priority','description'] LOOP
    IF coalesce(v_before->>v_key, '') IS DISTINCT FROM v_values->>v_key THEN
      v_changes := v_changes || jsonb_build_array(jsonb_build_object('campo',v_key,
        'anterior',coalesce(v_before->>v_key,''),'novo',v_values->>v_key));
    END IF;
  END LOOP;
  IF (SELECT count(*) FROM public.anexos WHERE demanda_id = p_id) > 1 THEN
    RAISE EXCEPTION 'Mais de um anexo encontrado; revisão administrativa necessária.';
  END IF;
  SELECT arquivo_path INTO v_path FROM public.anexos WHERE demanda_id = p_id FOR UPDATE;
  IF p_imagem_acao = 'substituir' THEN
    IF p_arquivo_path IS NULL OR p_arquivo_path !~
      ('^' || v_uid::text || '/' || p_id::text || '/[a-f0-9-]{36}\.(png|jpg|jpeg|webp)$') THEN
      RAISE EXCEPTION 'Caminho de print inválido.' USING ERRCODE = '22023';
    END IF;
    SELECT metadata INTO v_meta FROM storage.objects
      WHERE bucket_id = 'prints-demandas' AND name = p_arquivo_path FOR SHARE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Print não encontrado no Storage.'; END IF;
    v_mime := v_meta->>'mimetype'; v_size := (v_meta->>'size')::bigint;
    IF v_size IS NULL OR v_size NOT BETWEEN 1 AND 1048576 OR v_mime IS NULL
      OR NOT ((v_mime = 'image/png' AND p_arquivo_path ~ '\.png$')
      OR (v_mime = 'image/jpeg' AND p_arquivo_path ~ '\.jpe?g$')
      OR (v_mime = 'image/webp' AND p_arquivo_path ~ '\.webp$')) THEN
      RAISE EXCEPTION 'Print deve ser PNG, JPEG ou WebP de até 1 MB.' USING ERRCODE = '22023';
    END IF;
    IF p_arquivo_path IS DISTINCT FROM v_path THEN
      v_changes := v_changes || jsonb_build_array(jsonb_build_object('campo','image',
        'evento',CASE WHEN v_path IS NULL THEN 'Imagem adicionada' ELSE 'Imagem substituída' END));
      DELETE FROM public.anexos WHERE demanda_id = p_id;
      INSERT INTO public.anexos(demanda_id,arquivo_path,nome_original,mime_type,tamanho_bytes,criado_por)
        VALUES(p_id,p_arquivo_path,left(p_nome_original,255),v_mime,v_size,v_uid);
    END IF;
  ELSIF p_imagem_acao = 'remover' AND v_path IS NOT NULL THEN
    DELETE FROM public.anexos WHERE demanda_id = p_id;
    v_changes := v_changes || '[{"campo":"image","evento":"Imagem removida"}]'::jsonb;
  END IF;
  IF jsonb_array_length(v_changes) = 0 THEN RETURN jsonb_build_object('alterada',false); END IF;
  UPDATE public.demandas SET client = v_values->>'client', category = v_values->>'category',
    requester = v_values->>'requester', priority = v_values->>'priority', description = v_values->>'description',
    cliente_id = CASE WHEN client IS DISTINCT FROM v_values->>'client' THEN NULL ELSE cliente_id END,
    atualizado_em = now(), versao = versao + 1 WHERE id = p_id;
  INSERT INTO public.edicoes_demandas(demanda_id,usuario_id,alteracoes) VALUES(p_id,v_uid,v_changes);
  RETURN jsonb_build_object('alterada',true);
END;
$$;
REVOKE ALL ON FUNCTION public.editar_demanda(bigint,bigint,jsonb,text,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.editar_demanda(bigint,bigint,jsonb,text,text,text) TO authenticated;
COMMIT;
