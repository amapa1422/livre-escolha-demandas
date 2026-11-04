/* Assinaturas RPC confirmadas pelo proprietário em 03/11/2026.
 * A autorização e a concorrência devem ser impostas pelas RPCs no banco.
 */
(function () {
  'use strict';
  function demandId(value) {
    // bigint pode exceder a precisão de Number; preservar a representação decimal.
    if (typeof value === 'number' && !Number.isSafeInteger(value)) {
      throw new Error('Identificador de demanda fora da precisão segura. Utilize uma string decimal.');
    }
    if (!['string', 'number'].includes(typeof value) || !/^[1-9][0-9]*$/.test(String(value))
        || BigInt(value) > 9223372036854775807n) {
      throw new Error('Identificador de demanda inválido.');
    }
    return String(value);
  }
  window.LivreEscolhaSupabaseOperations = function (client) {
    if (typeof client?.rpc !== 'function') throw new Error('Cliente Supabase indisponível.');
    async function invoke(name, args) {
      const { data, error } = await client.rpc(name, args);
      if (error) throw new Error(error.message || 'Não foi possível concluir a operação.');
      return data;
    }
    return Object.freeze({
      async action(id, action, body = {}) {
        const p_id = demandId(id);
        if (action === 'finalizar') return invoke('finalizar_demanda', { p_id });
        if (action !== 'assumir') throw new Error('Ação de demanda inválida.');
        if (typeof body.assigneeId !== 'string'
            || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(body.assigneeId)) {
          throw new Error('Selecione um responsável válido.');
        }
        return invoke('assumir_demanda', { p_id, p_responsavel: body.assigneeId });
      },
      async remove(id) { return invoke('excluir_demanda', { p_id: demandId(id) }); }
    });
  };
})();
