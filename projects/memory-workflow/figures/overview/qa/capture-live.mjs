import {writeFileSync} from 'node:fs'
import {connect,value} from '../../../../../scripts/rpc.mjs'
const rpc=await connect('live')
try {
 const shot=await rpc.call('drawio_live_screenshot',{})
 const image=shot.content.find(c=>c.type==='image')
 if(!image)throw new Error('No live renderer image returned')
 writeFileSync(new URL('./whole-live.png',import.meta.url),Buffer.from(image.data,'base64'))
 const audit=value(await rpc.call('drawio_live_audit_figure',{max_findings:100}))
 writeFileSync(new URL('./whole-audit.json',import.meta.url),JSON.stringify(audit,null,2)+'\n')
 console.log(JSON.stringify({saved:'whole-live.png',audit: audit.passed,counts:audit.object_counts}))
}finally{rpc.close()}
