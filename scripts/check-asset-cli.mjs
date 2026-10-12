import{spawnSync}from'node:child_process'
import{existsSync,readFileSync,writeFileSync,rmSync}from'node:fs'
import{resolve}from'node:path'
import assert from'node:assert/strict'
const figure='cli-check-'+process.pid,dir=resolve('projects/asset-studio/figures',figure)
assert(!existsSync(dir));let created=false,count=0
function run(args,success=true){const r=spawnSync(process.execPath,['scripts/studio.mjs',...args],{encoding:'utf8'});assert.equal(r.status,success?0:1,r.stderr);count++;return r}
try{
 run(['new','asset-studio',figure,'--template','missing-template'],false);assert(!existsSync(dir))
 run(['new','asset-studio',figure,'--unknown','process-flow'],false);assert(!existsSync(dir))
 run(['new','../invalid',figure],false)
 run(['new','asset-studio',figure,'--template','process-flow']);created=true
 const shared=resolve('assets/templates/process-flow/source.drawio'),original=readFileSync(shared,'utf8')
 assert.equal(readFileSync(resolve(dir,'source.drawio'),'utf8'),original)
 assert(!existsSync(resolve(dir,'assets.lock.json')))
 assert(existsSync(resolve(dir,'assets/template-process-flow/template.json')))
 writeFileSync(resolve(dir,'source.drawio'),original.replace('Input / stage','Local test input'))
 assert.equal(readFileSync(shared,'utf8'),original)
 run(['new','asset-studio',figure],false)
 run(['use-asset','asset-studio',figure,'scientific-components'])
 assert.equal(readFileSync(resolve(dir,'assets/scientific-components/library.xml'),'utf8'),readFileSync('assets/library/scientific-components/library.xml','utf8'))
 run(['use-asset','asset-studio',figure,'scientific-components'],false)
 run(['use-asset','asset-studio',figure,'scientific-components','v1'],false)
 run(['use-asset','asset-studio',figure,'../bad'],false)
 run(['use-asset','asset-studio',figure,'missing-asset'],false)
 console.log(JSON.stringify({passed:true,cli_cases:count,copy_isolation:true,no_asset_lock:true,overwrite_refused:true}))
}finally{if(created)rmSync(dir,{recursive:true})}
