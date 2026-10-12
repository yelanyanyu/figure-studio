import{readFileSync,writeFileSync}from'node:fs'
import{resolve}from'node:path'
import{execFileSync}from'node:child_process'
import{connect,value}from'./rpc.mjs'
const r=await connect('live');try{
 await r.call('drawio_live_launch',{port:9345,include_screenshot:false})
 for(const[id,cell]of[['system-architecture','architecture-intro'],['mechanism-relations','mechanism-intro']]){
 const dir=resolve('projects/asset-studio/figures',id),spec=JSON.parse(readFileSync(resolve(dir,'design-spec.json')))
 const op=spec.regions.flatMap(r=>r.operations).find(o=>o.id===cell);op.style=op.style.replace('html=1;','html=0;').replace('whiteSpace=wrap;','whiteSpace=nowrap;');op.label=id==='system-architecture'?'Modules, layers and explicit interfaces.':'Entities, directed effects and optional feedback.'
 execFileSync(process.execPath,['scripts/asset-graph-session.mjs','new-page','9345']);execFileSync(process.execPath,['scripts/asset-graph-session.mjs','reopen','9345',resolve(dir,'source.drawio')])
 await r.call('drawio_live_update_cell',{id:cell,style:op.style,label:op.label})
 execFileSync(process.execPath,['scripts/asset-graph-session.mjs','page','9345','1440','900'])
 const audit=value(await r.call('drawio_live_audit_figure',{max_findings:100}));writeFileSync(resolve(dir,'qa/final-text-audit.json'),JSON.stringify(audit,null,2)+'\n')
 const shot=await r.call('drawio_live_fit',{});writeFileSync(resolve(dir,'qa/final-text-live.png'),Buffer.from(shot.content.find(x=>x.type==='image').data,'base64'))
 await r.call('drawio_live_save_snapshot',{output_path:resolve(dir,'source.drawio'),page_name:spec.title,overwrite:true})
 writeFileSync(resolve(dir,'design-spec.json'),JSON.stringify(spec,null,2)+'\n');console.log({id,passed:audit.passed})
 }
}finally{r.close()}
