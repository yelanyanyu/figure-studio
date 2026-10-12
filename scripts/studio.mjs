import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync, statSync } from 'node:fs'
import { resolve, relative } from 'node:path'
import { createHash } from 'node:crypto'
import { root, drawioPath } from './runtime.mjs'
import { connect, value } from './rpc.mjs'
const [command,...args]=process.argv.slice(2)
const slug=s=>{if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s??''))throw new Error('名称须为小写英文、数字和连字符');return s}
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex')
const json=(p,x)=>writeFileSync(p,JSON.stringify(x,null,2)+'\n')

try {
 if(command==='doctor') {
  if(Number(process.versions.node.split('.')[0])<22)throw new Error('需要 Node.js >=22')
  console.log(JSON.stringify({node:process.version,drawio:drawioPath(),mountedVolume:drawioPath().startsWith('/Volumes/'),workflow:JSON.parse(readFileSync(resolve(root,'workflow.lock.json'))),mcpConfig:existsSync(resolve(root,'.codex/config.toml'))},null,2))
 }else{
 const [project,figure]=args.map((s,i)=>i<2?slug(s):s)
 const dir=resolve(root,'projects',slug(project),'figures',slug(figure))
 if(command==='new') {
  if(!(args.length===2||(args.length===4&&args[2]==='--template')))throw new Error('用法：new <project> <figure> [--template <template>]')
  if(existsSync(dir))throw new Error('图件目录已存在，拒绝覆盖')
  const templateIndex=args.indexOf('--template')
  const template=templateIndex<0?null:slug(args[templateIndex+1])
  const templateDir=template?resolve(root,'assets/templates',template):null
  if(template&&!existsSync(resolve(templateDir,'source.drawio')))throw new Error('模板不存在：'+template)
  for(const d of ['qa','assets'])mkdirSync(resolve(dir,d),{recursive:true})
  for(const d of ['references','data'])mkdirSync(resolve(root,'projects',project,d),{recursive:true})
  writeFileSync(resolve(dir,'brief.md'),'# '+figure+'\n\n## 科学信息\n\n## 精确文字与证据\n\n## 受众、尺寸和输出\n\n## 未确定问题\n')
  writeFileSync(resolve(dir,'design-spec.md'),'# 设计规格\n\n先定义画布、阅读顺序、区域、对象 ID、几何、样式、连接线与验收条件，再实时绘制。\n')
  if(template){
   cpSync(templateDir,resolve(dir,'assets','template-'+template),{recursive:true})
   cpSync(resolve(templateDir,'source.drawio'),resolve(dir,'source.drawio'))
  }
  console.log(dir)
 }else if(command==='use-asset') {
  if(args.length!==3)throw new Error('用法：use-asset <project> <figure> <asset>；版本由 GitHub 管理')
  if(!existsSync(dir))throw new Error('请先创建图件')
  const asset=slug(args[2]);const source=resolve(root,'assets/library',asset)
  if(!existsSync(resolve(source,'asset.json')))throw new Error('资产不存在')
  const target=resolve(dir,'assets',asset)
  if(existsSync(target))throw new Error('图件内已有此资产副本，拒绝覆盖')
  cpSync(source,target,{recursive:true})
  console.log('已复制资产：'+asset)
 }else if(command==='export') {
  if(args.length!==2)throw new Error('用法：export <project> <figure>')
  const source=resolve(dir,'source.drawio');if(!existsSync(source))throw new Error('先通过实时画布保存 source.drawio，再导出')
  const out=resolve(root,'exports',project,figure);mkdirSync(out,{recursive:true})
  const rpc=await connect('files')
  try {
   const validation=value(await rpc.call('drawio_validate',{input_path:source}))
   if(validation.valid===false || validation.errors?.length)throw new Error('源图结构验证失败：'+JSON.stringify(validation))
   const outputs=[]
   for(const format of ['png','svg','pdf']){
    const output=resolve(out,figure+'.'+format)
    const result=value(await rpc.call('drawio_export',{input_path:source,format,output_path:output,embed:false,overwrite:true,...(format==='png'?{width:2000}:{})}))
    if(!existsSync(output)||statSync(output).size===0)throw new Error('输出为空：'+output)
    outputs.push({path:relative(root,output),sha256:hash(output),result})
   }
   cpSync(source,resolve(out,figure+'.drawio'))
   json(resolve(out,'export-manifest.json'),{source:relative(root,source),sourceSha256:hash(source),exportedAt:new Date().toISOString(),workflow:JSON.parse(readFileSync(resolve(root,'workflow.lock.json'))),validation,outputs,qaPassed:'see figure qa records; export is not a QA approval'})
   console.log(out)
  }finally{rpc.close()}
 }else throw new Error('用法：npm run doctor | new -- <project> <figure> [--template <template>] | use-asset -- <project> <figure> <asset> | export -- <project> <figure>')
 }
}catch(e){console.error(e.message);process.exitCode=1}
