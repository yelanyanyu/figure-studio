import {mkdirSync,writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {root} from './runtime.mjs'
import {builder,theme} from './figure-primitives.mjs'
const plans=[]
function plan(id,title,w,h){
 const b=builder(),regions=[],entries=[]
 function region(name,draw){const start=b.ops.length;draw();regions.push({id:name,operations:b.ops.slice(start)})}
 function entry(id,title,draw){const start=b.ops.length;draw();b.group(id,start);entries.push({id,title})}
 region('heading',()=>{b.shape(id+'-bg',0,0,w,h,'rectangle','#FFFFFF','none');b.text(id+'-title',title,60,35,w-120,55,40,theme.ink,true)})
 const p={id,title,width:w,height:h,regions,entries,b,region,entry};plans.push(p);return p
}
{
 const p=plan('components','Scientific components',1440,1000),{b,region,entry}=p
 region('trajectory',()=>{
  b.header('trajectory-heading','Trajectory icons',60,130,390)
  for(const [name,color,x]of [['green',theme.green,90],['blue',theme.ink,180],['orange',theme.orange,270],['purple',theme.purple,360]]){
   b.icon('trajectory-'+name,x,220,color,1.15);p.entries.push({id:'trajectory-'+name,title:'Trajectory · '+name})
  }
  b.text('trajectory-note','Editable strokes and endpoints',70,320,370,40,23)
 })
 region('containers',()=>{
  b.header('containers-heading','Cluster container',525,130,390)
  entry('cluster-container','Cluster container',()=>{b.cylinder('cluster-example',600,198,240,150,'Cluster',theme.paleGreen)})
 })
 region('cards',()=>{
  b.header('cards-heading','Description card',990,130,390)
  entry('description-card','Description card',()=>{
   b.shape('description-card-frame',1010,212,350,112,'ellipse',theme.palePurple,theme.purple)
   b.text('description-card-title','Description',1050,234,270,37,29,theme.ink,true,'center')
   b.text('description-card-detail','Replace supporting text',1050,273,270,30,23,theme.ink,false,'center')
  })
 })
 region('sections',()=>{
  b.header('sections-heading','Sections and regions',60,460,390)
  entry('section-title','Section title',()=>b.header('section-example','Section title',85,540,340))
  entry('dashed-region','Dashed region',()=>{b.shape('region-frame',85,625,340,205,'rounded','none','#9AC67A','dashed=1;dashPattern=4 3;arcSize=6;');b.text('region-heading','Region',110,647,290,36,27,theme.green,true)})
 })
 region('connections',()=>{
  b.header('connections-heading','Connections',525,460,390)
  for(const [id,title,y,options]of [['flow-arrow','Process / effect',570,{}],['feedback-arrow','Feedback (optional)',675,{dashed:true}],['association-line','Association',780,{end_arrow:'none'}]]){
   b.text(id+'-caption',title,550,y-38,340,30,23)
   b.line(id,570,y,870,y,options);p.entries.push({id,title})
  }
 })
 region('style',()=>{
  b.header('style-heading','Style palette',990,460,390)
  entry('style-palette','Style palette',()=>{
   const colors=[['Blue',theme.blue],['Green',theme.green],['Orange',theme.orange],['Purple',theme.purple]]
   colors.forEach(([label,color],i)=>{b.shape('style-'+label,1010+i*86,550,72,48,'rectangle',color,'none');b.text('style-'+label+'-label',label,1003+i*86,611,86,30,21,theme.ink,false,'center')})
   b.text('style-type-title','Title / heading',1015,690,340,44,32,theme.ink,true)
   b.text('style-type-body','Times New Roman · editable',1015,750,340,36,24)
  })
 })
 region('footer',()=>b.text('components-footer','Components carry visual structure; labels and scientific meaning belong to each figure.',60,912,1320,40,24))
}
{
 const p=plan('process-flow','Process flow',1440,900),{b,region}=p
 region('intro',()=>b.text('process-intro','A layout for sequence, branching and an optional refinement layer.',60,100,1320,38,25))
 region('main-flow',()=>{
  b.node('process-input','Input / stage',90,250,240,100,theme.paleGreen)
  b.shape('process-decision',490,235,190,130,'diamond',theme.paleBlue,theme.ink,'fontStyle=1;','Condition?')
  b.node('process-path-a','Path A / result',1000,180,270,95,theme.paleOrange)
  b.node('process-path-b','Path B / result',1000,375,270,95,theme.palePurple)
  b.edge('process-input-next','process-input','process-decision',{exit_x:1,exit_y:.5,entry_x:0,entry_y:.5})
  b.edge('process-branch-a','process-decision','process-path-a',{exit_x:1,exit_y:.5,entry_x:0,entry_y:.5,waypoints:[{x:830,y:300},{x:830,y:227.5}]})
  b.edge('process-branch-b','process-decision','process-path-b',{exit_x:1,exit_y:.5,entry_x:0,entry_y:.5,waypoints:[{x:830,y:300},{x:830,y:422.5}]})
  b.text('process-a-label','Condition A',850,187,140,30,22)
  b.text('process-b-label','Condition B',850,382,140,30,22)
 })
 region('refinement',()=>{
  b.header('process-refinement','Optional refinement layer',60,545,410)
  const names=['Refine','Validate','Deliver'];names.forEach((name,i)=>b.node('process-refine-'+name,name,90+i*450,675,270,95,theme.palePurple))
  b.edge('process-refine-forward','process-refine-Refine','process-refine-Validate',{exit_x:1,exit_y:.5,entry_x:0,entry_y:.5})
  b.edge('process-refine-finish','process-refine-Validate','process-refine-Deliver',{exit_x:1,exit_y:.5,entry_x:0,entry_y:.5})
  b.text('process-layer-note','Add cross-layer links only where the workflow requires them.',500,550,870,38,24)
 })
}
{
 const p=plan('system-architecture','System architecture',1440,900),{b,region}=p
 region('intro',()=>b.text('architecture-intro','Modules, layers and explicit interfaces.',60,100,1320,38,25))
 region('interfaces',()=>{
  b.shape('architecture-interface-bg',60,165,1320,150,'rounded','#EFF3FA','none')
  b.text('architecture-interface-title','Interface',85,210,220,45,30,theme.blue,true)
  for(const [i,name]of ['Client','API','Operator'].entries())b.node('architecture-interface-'+name,name,350+i*340,210,250,70,theme.paleBlue)
 })
 region('modules',()=>{
  b.shape('architecture-module-bg',60,365,1320,200,'rounded','#EFF7E9','none')
  b.text('architecture-module-title','Application',85,425,220,45,30,theme.green,true)
  for(const [i,name]of ['Module A','Module B','Module C'].entries())b.node('architecture-module-'+i,name,350+i*340,420,250,90,theme.paleGreen)
  for(let i=0;i<2;i++)b.edge('architecture-module-link-'+i,'architecture-module-'+i,'architecture-module-'+(i+1),{exit_x:1,exit_y:.5,entry_x:0,entry_y:.5})
  for(const [i,name]of ['Client','API','Operator'].entries())b.edge('architecture-interface-link-'+name,'architecture-interface-'+name,'architecture-module-'+i,{exit_x:.5,exit_y:1,entry_x:.5,entry_y:0})
 })
 region('stores',()=>{
  b.shape('architecture-data-bg',60,615,1320,190,'rounded','#FFF1E7','none')
  b.text('architecture-data-title','Data / resources',85,673,225,45,29,theme.orange,true)
  for(let i=0;i<3;i++){
   b.cylinder('architecture-store-'+i,350+i*340,650,250,120,'Resource '+String.fromCharCode(65+i),theme.paleOrange)
   b.edge('architecture-store-link-'+i,'architecture-module-'+i,'architecture-store-'+i+'-container',{exit_x:.5,exit_y:1,entry_x:.5,entry_y:0})
  }
 })
}
{
 const p=plan('mechanism-relations','Mechanism relations',1440,900),{b,region}=p
 region('intro',()=>b.text('mechanism-intro','Entities, directed effects and optional feedback.',60,100,1320,38,25))
 region('entities',()=>{
  b.node('mechanism-context','Context / mediator',560,175,320,95,theme.paleBlue)
  b.node('mechanism-input','Input / driver',100,365,260,115,theme.paleGreen)
  b.shape('mechanism-central',560,350,320,145,'ellipse',theme.palePurple,theme.ink,'fontStyle=1;','Focal entity / process')
  b.node('mechanism-output','Response / outcome',1080,365,260,115,theme.paleOrange)
 })
 region('effects',()=>{
  b.edge('mechanism-effect-input','mechanism-input','mechanism-central',{exit_x:1,exit_y:.5,entry_x:0,entry_y:.5})
  b.edge('mechanism-effect-output','mechanism-central','mechanism-output',{exit_x:1,exit_y:.5,entry_x:0,entry_y:.5})
  b.edge('mechanism-context-link','mechanism-context','mechanism-central',{exit_x:.5,exit_y:1,entry_x:.5,entry_y:0})
  b.text('mechanism-left-label','Effect',410,380,120,30,23,theme.ink,false,'center')
  b.text('mechanism-right-label','Effect',930,380,120,30,23,theme.ink,false,'center')
 })
 region('feedback',()=>{
  b.edge('mechanism-feedback','mechanism-output','mechanism-input',{exit_x:.5,exit_y:1,entry_x:.5,entry_y:1,dashed:true,color:theme.purple,waypoints:[{x:1210,y:650},{x:230,y:650}]})
  b.text('mechanism-feedback-label','Feedback (optional)',540,675,360,40,26,theme.purple,true,'center')
  b.text('mechanism-note','Choose arrow meaning and direction from evidence. Remove unsupported links.',150,780,1140,44,25,theme.ink,false,'center')
 })
}
for(const p of plans){
 for(const region of p.regions)for(const op of region.operations)if(['architecture-intro','mechanism-intro'].includes(op.id))op.style=op.style.replace('html=1;','html=0;').replace('whiteSpace=wrap;','whiteSpace=nowrap;')
 const dir=resolve(root,'projects/asset-studio/figures',p.id);mkdirSync(resolve(dir,'qa'),{recursive:true});mkdirSync(resolve(dir,'assets'),{recursive:true})
 const spec={id:p.id,title:p.title,canvas:{width:p.width,height:p.height},theme,regions:p.regions,library_entries:p.entries,raster:[],acceptance:'Editable primitives; every region and whole canvas requires audit plus screenshot; neutral placeholders; no scientific claim.'}
 writeFileSync(resolve(dir,'design-spec.json'),JSON.stringify(spec,null,2)+'\n')
 writeFileSync(resolve(dir,'brief.md'),`# ${p.title}\n\nReusable ${p.id==='components'?'component atlas':'template'} with neutral placeholders. Typography and palette derive from the user-approved reference style. All content is editable; no raster fields or research data.\n`)
 writeFileSync(resolve(dir,'design-spec.md'),`# Design specification\n\nSee design-spec.json for exact object IDs, geometry, styles, regions and connector routes. Build regions in order through the live graph API; inspect each before continuing. Canvas ${p.width} × ${p.height}.\n`)
 writeFileSync(resolve(dir,'sources.md'),'# Sources\n\nVisual grammar abstracted from the user-approved memory-workflow reconstruction. Recreated with native editable primitives, neutral labels, and independent layouts. No reference image or study-specific text is included.\n\nCustom library format: https://www.drawio.com/docs/reference/format-custom-shape-library/\n')
}
console.log(plans.map(p=>({id:p.id,regions:p.regions.length,operations:p.b.ops.length})))
