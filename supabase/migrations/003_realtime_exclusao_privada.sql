-- Correção incremental para exclusão lógica ocultada pela RLS de demandas.
-- Mantém public.excluir_demanda, as políticas de negócio e os registros intactos.
-- Envia SOMENTE {} em um tópico privado; o cliente reconsulta a fila pela RLS.
-- Executar no SQL Editor do projeto, depois das migrações 001 e 002.
BEGIN;

DO $$ BEGIN
  IF to_regprocedure('realtime.send(jsonb,text,text,boolean)') IS NULL THEN
    RAISE EXCEPTION 'Função realtime.send indisponível; conferir a instalação Realtime.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='realtime' AND c.relname='messages' AND c.relrowsecurity) THEN
    RAISE EXCEPTION 'RLS de realtime.messages deve estar habilitada pela plataforma.';
  END IF;
END $$;

-- Somente leitura do tópico novo para a identidade autenticada ativa.
-- Não concede INSERT ao cliente. Não altera propriedade/RLS da tabela gerenciada.
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT SELECT ON TABLE realtime.messages TO authenticated;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='realtime'
    AND tablename='messages' AND policyname='le_invalidate_demandas_003') THEN
    CREATE POLICY le_invalidate_demandas_003 ON realtime.messages
      FOR SELECT TO authenticated USING (
        extension='broadcast'
        AND (SELECT realtime.topic())='livreescolha-demandas-invalidate'
        AND (SELECT private.funcionario_ativo()) IS TRUE
      );
  END IF;
  -- Restringe somente este tópico mesmo se já existir uma política permissiva
  -- de outro sistema. Não muda a autorização dos demais tópicos.
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='realtime'
    AND tablename='messages' AND policyname='protege_leitura_invalidate_003') THEN
    CREATE POLICY protege_leitura_invalidate_003 ON realtime.messages AS RESTRICTIVE
      FOR SELECT TO PUBLIC USING (
        CASE WHEN topic='livreescolha-demandas-invalidate' AND extension='broadcast'
          THEN (SELECT auth.uid()) IS NOT NULL AND (SELECT private.funcionario_ativo()) IS TRUE
          ELSE true END
      );
  END IF;
  -- O navegador não pode fabricar notificações desse tópico, mesmo que haja
  -- permissões de envio em outros tópicos. O trigger executa no ambiente confiável.
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='realtime'
    AND tablename='messages' AND policyname='impede_envio_cliente_invalidate_003') THEN
    CREATE POLICY impede_envio_cliente_invalidate_003 ON realtime.messages AS RESTRICTIVE
      FOR INSERT TO PUBLIC WITH CHECK (topic IS DISTINCT FROM 'livreescolha-demandas-invalidate');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION private.notificar_exclusao_demanda_003()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
  -- Nenhum ID, cliente, perfil ou conteúdo é incluído no aviso.
  PERFORM realtime.send('{}'::jsonb, 'invalidate', 'livreescolha-demandas-invalidate', true);
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION private.notificar_exclusao_demanda_003() FROM PUBLIC, anon, authenticated;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid='public.demandas'::regclass
    AND tgname='notificar_exclusao_demanda_003' AND NOT tgisinternal) THEN
    CREATE TRIGGER notificar_exclusao_demanda_003
      AFTER UPDATE OF excluido_em ON public.demandas FOR EACH ROW
      WHEN (OLD.excluido_em IS NULL AND NEW.excluido_em IS NOT NULL)
      EXECUTE FUNCTION private.notificar_exclusao_demanda_003();
  END IF;
END $$;
COMMIT;
