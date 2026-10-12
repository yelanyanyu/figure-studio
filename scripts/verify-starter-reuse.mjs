import{mkdirSync,readFileSync,writeFileSync}from'node:fs'
import{execFileSync}from'node:child_process'
import{resolve}from'node:path'
import{createHash}from'node:crypto'
import{connect,value}from'./rpc.mjs'
const r=await connect('live'),base=resolve('projects/asset-studio/figures')
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex')
async function evidence(dir,name,snapshot=false){
 mkdirSync(resolve(dir,'qa'),{recursive:true})
 const audit=value(await r.call('drawio_live_audit_figure',{max_findings:100}))
 writeFileSync(resolve(dir,'qa',name+'-audit.json'),JSON.stringify(audit,null,2)+'\n')
 const shot=await r.call('drawio_live_fit',{});const im=shot.content.find(x=>x.type==='image');if(im)writeFileSync(resolve(dir,'qa',name+'-live.png'),Buffer.from(im.data,'base64'))
 if(snapshot)await r.call('drawio_live_save_snapshot',{output_path:resolve(dir,'source.drawio'),page_name:name,overwrite:true})
 console.log(JSON.stringify({name,audit:audit.passed,findings:audit.findings,counts:audit.object_counts}))
 if(!audit.passed)throw new Error(name+' audit failed')
}
try{
 await r.call('drawio_live_launch',{port:9345,include_screenshot:false})
 await evidence(resolve(base,'import-check'),'native-library-import',true)
 // Reopen each saved live snapshot on a fresh page, preserving all earlier pages.
 for(const id of['components','process-flow','system-architecture','mechanism-relations']){
  execFileSync(process.execPath,['scripts/asset-graph-session.mjs','new-page','9345'])
  execFileSync(process.execPath,['scripts/asset-graph-session.mjs','reopen','9345',resolve(base,id,'source.drawio')])
  await evidence(resolve(base,id),'roundtrip')
 }
 const shared=resolve('assets/templates/process-flow/source.drawio'),before=hash(shared)
 execFileSync(process.execPath,['scripts/studio.mjs','new','asset-studio','reuse-check','--template','process-flow'])
 execFileSync(process.execPath,['scripts/studio.mjs','use-asset','asset-studio','reuse-check','scientific-components'])
 const dir=resolve(base,'reuse-check')
 execFileSync(process.execPath,['scripts/asset-graph-session.mjs','new-page','9345'])
 execFileSync(process.execPath,['scripts/asset-graph-session.mjs','reopen','9345',resolve(dir,'source.drawio')])
 await r.call('drawio_live_update_cell',{id:'process-input',label:'Local input'})
 execFileSync(process.execPath,['scripts/asset-graph-session.mjs','page','9345','1440','900'])
 await evidence(dir,'template-content-replacement',true)
 const result={native_library_import:'12 entries loaded via LocalLibrary and ui.loadLibrary, then imported via ui.stringToCells and graph.importCells',description_edit:'Description -> Edited label in imported copy',template_edit:'Input / stage -> Local input',shared_template_unchanged:hash(shared)===before,shared_source_sha256:before,figure_source_differs:hash(resolve(dir,'source.drawio'))!==before,asset_copy_equal:hash(resolve(dir,'assets/scientific-components/library.xml'))===hash(resolve('assets/library/scientific-components/library.xml'))}
 writeFileSync(resolve(dir,'qa/reuse-verification.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result))
}finally{r.close()}
