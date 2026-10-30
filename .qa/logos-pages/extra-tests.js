(async () => {
  const frame = document.querySelector('iframe');
  const win = frame.contentWindow, doc = frame.contentDocument;
  const el = id=>doc.getElementById(id), results=[];
  const check=(name,passed)=>{results.push({name,passed});if(!passed)throw new Error(name)};
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const key='livre_escolha_demandas_demo_v1';
  async function until(fn){for(let i=0;i<100;i++){if(fn())return;await wait(30)}throw new Error('Tempo esgotado')}
  async function add(blob,type){
    el('openModal').click();
    el('client').value='QA formato '+type;el('client').dispatchEvent(new win.Event('input',{bubbles:true}));
    el('category').value='MUDANÇA';el('requester').value='QA';
    const transfer=new win.DataTransfer();transfer.items.add(new win.File([blob],'print.'+type.split('/')[1],{type}));el('attachment').files=transfer.files;
    el('createForm').requestSubmit();await until(()=>!el('createOverlay').classList.contains('show'));
    return JSON.parse(win.localStorage.getItem(key))[0];
  }
  const source=blob=>new Promise(resolve=>{const r=new win.FileReader();r.onload=()=>resolve(r.result);r.readAsDataURL(blob)});
  const errors=[];
  try{
    await doc.fonts.ready;
    const fonts=[...doc.fonts].filter(f=>f.family==='Plus Jakarta Sans');
    check('Plus Jakarta Sans efetivamente carregada',fonts.length>0 && fonts.every(f=>f.status==='loaded'));
    const canvas=doc.createElement('canvas');canvas.width=80;canvas.height=80;const ctx=canvas.getContext('2d');
    const pixels=ctx.createImageData(80,80);for(let i=0;i<pixels.data.length;i++)pixels.data[i]=i%4===3?255:(i*71+i*i*29)%256;ctx.putImageData(pixels,0,0);
    const jpeg=await new Promise(r=>canvas.toBlob(r,'image/jpeg',.25));const jpgItem=await add(jpeg,'image/jpeg');
    check('JPEG aceito e preservado quando WebP não economiza',jpgItem.image===await source(jpeg));
    const webp=await new Promise(r=>canvas.toBlob(r,'image/webp',1));const webpItem=await add(webp,'image/webp');
    check('WebP aceito e preservado sem reprocessar',webpItem.image===await source(webp));
    el('openModal').click();el('client').focus();el('client').value='Sicoob';el('client').dispatchEvent(new win.Event('input',{bubbles:true}));
    el('client').dispatchEvent(new win.KeyboardEvent('keydown',{key:'Tab',bubbles:true}));
    check('Tab fecha sugestões sem selecionar empresa',el('clientSuggestions').hidden);
    doc.dispatchEvent(new win.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    check('Sem novos erros capturados',win.__qaErrors.length===0);
  }catch(error){errors.push(String(error))}
  return {results,errors,passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length};
})()
