// Narrow live graph operation: preserve all cells; set reference page dimensions.
const targets = await (await fetch('http://127.0.0.1:9344/json/list')).json()
const target = targets.find(t => t.type === 'page' && t.url.includes('drawio'))
if (!target) throw new Error('draw.io target unavailable')
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise(r => ws.addEventListener('open', r, {once:true}))
const expression = `(() => {
 const ui = Object.keys(window).map(k=>{try{return window[k]}catch{return null}}).find(u=>u?.editor?.graph);
 const g=window.__codexDrawioGraph || ui?.editor?.graph;
 if (!g) throw new Error('draw.io graph unavailable');
 g.pageFormat = new mxRectangle(0,0,1986,1018);
 g.pageScale=1; g.pageVisible=true; g.clearSelection();
 const model=g.getModel();
 model.beginUpdate();
 try {
  for(const id of ['init-to-evolution','evolution-to-inference']){
   const cell=model.getCell(id);if(cell)g.removeCells([cell],false);
  }
  for (const id of ['cluster-new-trajectory','cluster-new','cluster-a','cluster-b','cluster-c','cluster-c1','cluster-c2']) {
   const cell=model.getCell(id);
   if(cell){delete model.cells[id];cell.setId(id+'-container');model.cells[cell.id]=cell;}
  }
  const networkPairs=[[0,1],[0,2],[0,3],[2,4],[3,4],[3,5]];
  networkPairs.forEach((pair,i)=>{
   const e=model.getCell('cluster-network-link'+i);
   if(e){model.setTerminal(e,model.getCell('cluster-network-node'+pair[0]),true);model.setTerminal(e,model.getCell('cluster-network-node'+pair[1]),false);}
  });
  const routes={
   'distill-a-link':{source:'cluster-a-caption',points:[[618,628],[465,630],[465,753],[580,775],[580,835]],sx:.5,sy:1,tx:.14,ty:.12},
   'distill-b-link':{source:'cluster-b-caption',points:[[900,678],[851,714]],sx:.5,sy:1,tx:.5,ty:0},
   'distill-c1-link':{source:'cluster-c1-caption',points:[[1149,695],[1113,752],[1058,758],[1058,872]],sx:.5,sy:1,tx:.5,ty:0},
   'distill-c2-link':{source:'cluster-c2-caption',points:[[1375,682],[1287,709],[1260,744]],sx:.5,sy:1,tx:.5,ty:0}
  };
  for(const [id,r]of Object.entries(routes)){
   const e=model.getCell(id);if(!e)continue;
   model.setTerminal(e,model.getCell(r.source),true);
   const geo=e.geometry.clone();geo.points=r.points.map(p=>new mxPoint(...p));model.setGeometry(e,geo);
   let st=e.style.replace(/(?:^|;)exitX=[^;]*/g,'').replace(/(?:^|;)exitY=[^;]*/g,'').replace(/(?:^|;)entryX=[^;]*/g,'').replace(/(?:^|;)entryY=[^;]*/g,'').replace(/(?:^|;)strokeWidth=[^;]*/g,'');
   model.setStyle(e,st+';exitX='+r.sx+';exitY='+r.sy+';entryX='+r.tx+';entryY='+r.ty+';strokeWidth=6;');
  }
  for(const cell of Object.values(model.cells)) {
   if(!cell.edge || !cell.id.endsWith('-route'))continue;
   const prefix=cell.id.slice(0,-6);
   const start=model.getCell(prefix+'-start'), end=model.getCell(prefix+'-end');
   if(start && end){model.setTerminal(cell,start,true);model.setTerminal(cell,end,false);}
  }
 } finally {model.endUpdate()}
 g.view.validate(); g.sizeDidChange();
 return {width:g.pageFormat.width,height:g.pageFormat.height};
})()`
const response = new Promise(resolve => ws.addEventListener('message', event => {
 const m=JSON.parse(event.data); if(m.id===1)resolve(m)
}))
ws.send(JSON.stringify({id:1,method:'Runtime.evaluate',params:{expression,returnByValue:true}}))
const result=await response
console.log(JSON.stringify(result))
ws.close()
if(result.error||result.result?.exceptionDetails)process.exitCode=1
