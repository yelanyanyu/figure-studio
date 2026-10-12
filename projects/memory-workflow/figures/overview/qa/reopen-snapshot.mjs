import {readFileSync} from 'node:fs'
const xml=readFileSync(new URL('../source.drawio',import.meta.url),'utf8')
const targets=await(await fetch('http://127.0.0.1:9344/json/list')).json()
const t=targets.find(t=>t.type==='page'&&t.url.includes('drawio'))
const ws=new WebSocket(t.webSocketDebuggerUrl)
await new Promise(r=>ws.addEventListener('open',r,{once:true}))
const expression=`(()=>{
 const g=window.__codexDrawioGraph;
 if(!g)throw new Error('Live graph unavailable');
 const doc=mxUtils.parseXml(${JSON.stringify(xml)});
 const node=doc.getElementsByTagName('mxGraphModel')[0];
 const model=new mxGraphModel();
 new mxCodec(doc).decode(node,model);
 g.getModel().setRoot(model.getRoot());
 g.pageFormat=new mxRectangle(0,0,1986,1018);g.pageScale=1;g.pageVisible=true;
 g.clearSelection();g.view.validate();g.sizeDidChange();
 return {reopenedFromSavedSnapshot:true,cells:Object.keys(model.cells).length};
})()`
const response=new Promise(r=>ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id===1)r(m)}))
ws.send(JSON.stringify({id:1,method:'Runtime.evaluate',params:{expression,returnByValue:true}}))
const result=await response;console.log(JSON.stringify(result));ws.close()
if(result.error||result.result?.exceptionDetails)process.exitCode=1
