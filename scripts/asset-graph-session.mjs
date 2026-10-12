// Only graph/document APIs on an isolated draw.io session; no OS input control.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs'
const [action,portValue='9345',...args]=process.argv.slice(2),port=Number(portValue)
const targets=await(await fetch(`http://127.0.0.1:${port}/json/list`)).json()
const target=targets.find(t=>t.type==='page'&&t.url.includes('drawio'))
if(!target)throw new Error('draw.io page unavailable')
const ws=new WebSocket(target.webSocketDebuggerUrl)
await new Promise(r=>ws.addEventListener('open',r,{once:true}))
let requestId=0
function call(method,params){const id=++requestId;return new Promise(resolve=>{const listener=e=>{const m=JSON.parse(e.data);if(m.id===id){ws.removeEventListener('message',listener);resolve(m.result)}};ws.addEventListener('message',listener);ws.send(JSON.stringify({id,method,params}))})}
// Resolve the editor object from draw.io event closures using read-only CDP introspection.
async function findUi(){
 const existing=await call('Runtime.evaluate',{expression:'!!window.__codexDrawioUi',returnByValue:true});if(existing.result?.value)return
 const list=await call('Runtime.evaluate',{expression:"document.querySelector('.geDiagramContainer')?.mxListenerList?.map(x=>x.f).filter(Boolean)||[]"});
 const props=async id=>(await call('Runtime.getProperties',{objectId:id,ownProperties:true}));
 const fs=await props(list.result.objectId)
 for(const f of fs.result.filter(x=>/^\d+$/.test(x.name)&&x.value?.objectId)){
  const p=await call('Runtime.getProperties',{objectId:f.value.objectId,ownProperties:false});const scopes=p.internalProperties?.find(x=>x.name==='[[Scopes]]')?.value?.objectId;if(!scopes)continue
  const ss=await props(scopes)
  for(const scope of ss.result.filter(x=>/^\d+$/.test(x.name)&&x.value?.objectId&&/Closure/.test(x.value.description||''))){
   const vs=await props(scope.value.objectId)
   for(const v of vs.result.filter(x=>x.value?.objectId&&x.value.type==='object')){
    const r=await call('Runtime.callFunctionOn',{objectId:v.value.objectId,functionDeclaration:"function(){if(this?.editor?.graph){window.__codexDrawioUi=this;return true}return false}",returnByValue:true});if(r.result?.value)return
   }
  }
 }
}
if(['discover','new-page','library-api','import-library'].includes(action))await findUi()
const expressionFor=body=>`(()=>{const ui=window.__codexDrawioUi||Object.keys(window).map(k=>{try{return window[k]}catch{return null}}).find(u=>u?.editor?.graph);const g=window.__codexDrawioGraph||ui?.editor?.graph;if(!g)throw new Error('graph unavailable');${body}})()`
let body
if(action==='page')body=`g.pageFormat=new mxRectangle(0,0,${Number(args[0])},${Number(args[1])});g.pageScale=1;g.pageVisible=true;g.clearSelection();g.view.validate();g.sizeDidChange();return {width:g.pageFormat.width,height:g.pageFormat.height};`
else if(action==='discover')body=`return {methods:Object.getOwnPropertyNames(Object.getPrototypeOf(ui)).filter(k=>/page|file|library/i.test(k)),hasInsertPage:typeof ui.insertPage,hasDiagramPage:typeof DiagramPage};`
else if(action==='library-api')body=`let proto=ui,methods={};while(proto){for(const k of Object.getOwnPropertyNames(proto).filter(k=>/loadLibrary|libraryLoaded|openLibrary|createLibrary|addLibrary|insertPage/.test(k)))if(typeof ui[k]==='function')methods[k]=ui[k].toString().slice(0,6500);proto=Object.getPrototypeOf(proto)}return {methods,localLibrary:typeof LocalLibrary==='function'?LocalLibrary.toString():null,sidebar:typeof ui.sidebar?.addPalette};`
else if(action==='new-page')body=`if(typeof ui.insertPage!=='function')throw new Error('insertPage unavailable');ui.insertPage();g.clearSelection();return {cells:Object.keys(g.getModel().cells).length,pages:ui.pages?.length};`
else if(action==='import-library'){
 const xml=readFileSync(args[0],'utf8')
 body=`ui.insertPage();const file=new LocalLibrary(ui,${JSON.stringify(xml)},'Scientific components.xml');ui.loadLibrary(file,true);const entries=JSON.parse(mxUtils.getTextContent(mxUtils.parseXml(file.getData()).documentElement));const imported=[];for(let i=0;i<entries.length;i++){const e=entries[i],x=50+(i%3)*480,y=80+Math.floor(i/3)*330;g.insertVertex(g.getDefaultParent(),'entry-label-'+e.title.toLowerCase().replace(/[^a-z]+/g,'-'),e.title,x,y-50,400,35,'fillColor=none;strokeColor=none;fontFamily=Times New Roman;fontSize=25;fontColor=#203864;align=left;');const cells=ui.stringToCells(e.xml);if(!cells.length)throw new Error('Empty imported entry '+e.title);const result=g.importCells(cells,x,y);const nameCells=(original,clone)=>{const m=g.getModel();delete m.cells[clone.id];clone.setId('import-'+original.id);m.cells[clone.id]=clone;for(let j=0;j<(original.children||[]).length;j++)nameCells(original.children[j],clone.children[j])};for(let j=0;j<cells.length;j++)nameCells(cells[j],result[j]);imported.push({title:e.title,roots:result.map(c=>c.id)});if(e.title==='Description card'){const find=c=>{if(g.convertValueToString(c)==='Description')return c;for(const ch of c.children||[]){const f=find(ch);if(f)return f}};const title=find(result[0]);if(!title)throw new Error('Editable description missing');g.getModel().setValue(title,'Edited label');}}g.pageFormat=new mxRectangle(0,0,1440,1400);g.clearSelection();g.view.validate();g.sizeDidChange();return {libraryLoaded:ui.openLibraries.some(l=>l.file===file),entryCount:entries.length,imported,editedLabel:Object.values(g.getModel().cells).some(c=>g.convertValueToString(c)==='Edited label'),imageCells:Object.values(g.getModel().cells).filter(c=>/shape=image/.test(c.style||'')).length};`
}
else if(action==='reopen'){
 const xml=readFileSync(args[0],'utf8')
 body=`const doc=mxUtils.parseXml(${JSON.stringify(xml)});const node=doc.getElementsByTagName('mxGraphModel')[0];const model=new mxGraphModel();new mxCodec(doc).decode(node,model);g.getModel().setRoot(model.getRoot());g.pageFormat=new mxRectangle(0,0,Number(node.getAttribute('pageWidth')),Number(node.getAttribute('pageHeight')));g.clearSelection();g.view.validate();g.sizeDidChange();return {reopened:true,cells:Object.keys(g.getModel().cells).length};`
}else throw new Error('Unknown graph action')
const result={result:await call('Runtime.evaluate',{expression:expressionFor(body),returnByValue:true})};ws.close()
if(result.error||result.result?.exceptionDetails)throw new Error(JSON.stringify(result))
console.log(JSON.stringify(result.result?.result?.value))
