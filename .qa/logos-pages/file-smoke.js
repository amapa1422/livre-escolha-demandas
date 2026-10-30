(async () => {
  const el=id=>document.getElementById(id);
  if(location.protocol!=='file:')throw new Error('Teste destinado ao arquivo local em perfil isolado');
  el('openModal').click();el('client').value='Médio';el('client').dispatchEvent(new Event('input',{bubbles:true}));
  el('clientSuggestions').firstElementChild.click();el('category').value='CANCELAMENTO';el('requester').value='QA arquivo local';el('createForm').requestSubmit();
  await new Promise(resolve=>setTimeout(resolve,300));
  const logo=document.querySelector('.ticket .client-logo');
  await logo.decode();
  return {passed:location.protocol==='file:' && logo.naturalWidth>0 && getComputedStyle(document.querySelector('.app')).display==='grid',client:JSON.parse(localStorage.getItem('livre_escolha_demandas_demo_v1'))[0].client,logo:logo.src};
})()
