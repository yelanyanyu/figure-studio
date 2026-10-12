import {readFileSync,writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {execFileSync} from 'node:child_process'
import {connect,value} from './rpc.mjs'
const [id,index]=process.argv.slice(2),dir=resolve('projects/asset-studio/figures',id),spec=JSON.parse(readFileSync(resolve(dir,'design-spec.json')))
const r=await connect('live')
try{
 await r.call('drawio_live_launch',{port:9345,include_screenshot:false,step_delay_ms:60})
 if(index!=='check'){
  const region=spec.regions[Number(index)];if(!region)throw new Error('Unknown region')
  await r.call('drawio_live_draw_sequence',{operations:region.operations,step_delay_ms:60,screenshot_after:false})
 }
 execFileSync(process.execPath,['scripts/asset-graph-session.mjs','page','9345',String(spec.canvas.width),String(spec.canvas.height)])
 const audit=value(await r.call('drawio_live_audit_figure',{max_findings:100}))
 const shot=await r.call('drawio_live_fit',{}),im=shot.content.find(x=>x.type==='image')
 const name=index==='check'?'whole':spec.regions[Number(index)].id
 writeFileSync(resolve(dir,'qa',name+'-audit.json'),JSON.stringify(audit,null,2)+'\n')
 if(im)writeFileSync(resolve(dir,'qa',name+'-live.png'),Buffer.from(im.data,'base64'))
 if(index==='check')await r.call('drawio_live_save_snapshot',{output_path:resolve(dir,'source.drawio'),page_name:spec.title,overwrite:true})
 console.log(JSON.stringify({id,region:name,audit,screenshot:resolve(dir,'qa',name+'-live.png')}))
}finally{r.close()}
