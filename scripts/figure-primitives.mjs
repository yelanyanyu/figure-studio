// Editable live graph recipes. This module creates operations, never diagram XML.
export const theme={font:'Times New Roman',cjkFont:'PingFang SC',ink:'#203864',blue:'#31589A',green:'#009900',orange:'#914007',purple:'#AC43C4',paleBlue:'#D4DFF3',paleGreen:'#DDEED1',paleOrange:'#F8D1B5',palePurple:'#EEDBF2',background:'#FFFFFF',line:2,gap:40}
export function builder(){
 const ops=[]
 const shape=(id,x,y,w,h,kind='rectangle',fill='none',stroke=theme.ink,extra='',label='')=>{
  const names={text:'rectangle',rounded:'rectangle',diamond:'rhombus',cylinder:'cylinder3'}
  ops.push({type:'shape',id,x,y,width:w,height:h,shape:kind,label,style:`shape=${names[kind]||kind};rounded=${kind==='rounded'?1:0};fillColor=${fill};strokeColor=${stroke};strokeWidth=2;fontFamily=${theme.font};fontSize=26;fontColor=${theme.ink};html=1;whiteSpace=wrap;align=center;verticalAlign=middle;spacing=8;${extra}`})
 }
 const text=(id,label,x,y,w,h,size=26,color=theme.ink,bold=false,align='left')=>shape(id,x,y,w,h,'text','none','none',`fontSize=${size};fontColor=${color};fontStyle=${bold?1:0};align=${align};spacing=0;`,label)
 const edge=(id,source,target,options={})=>ops.push({type:'edge',id,source,target,color:theme.blue,width:2.5,end_arrow:'block',style:'edgeStyle=none;rounded=0;endFill=1;',...options})
 const line=(id,x1,y1,x2,y2,options={})=>ops.push({type:'line',id,begin_x:x1,begin_y:y1,end_x:x2,end_y:y2,color:theme.blue,width:3,end_arrow:'block',...options})
 const group=(id,start)=>ops.push({type:'group',id,cell_ids:ops.slice(start).filter(o=>o.type!=='group').map(o=>o.id)})
 const icon=(id,x,y,color=theme.green,s=1)=>{
  const start=ops.length
  shape(id+'-frame',x,y,49*s,44*s,'rectangle','none',color,`strokeWidth=${3*s};`)
  line(id+'-header',x,y+10*s,x+49*s,y+10*s,{color,width:3*s,end_arrow:'none'})
  for(const k of [12,36])line(id+'-tab'+k,x+k*s,y-5*s,x+k*s,y+5*s,{color,width:3*s,end_arrow:'none'})
  shape(id+'-start',x+11*s,y+15*s,7*s,7*s,'ellipse',theme.background,color,`strokeWidth=${3*s};`)
  shape(id+'-end',x+31*s,y+32*s,6*s,6*s,'ellipse',theme.background,color,`strokeWidth=${3*s};`)
  edge(id+'-route',id+'-start',id+'-end',{color,width:3*s,end_arrow:'none',style:'edgeStyle=none;curved=1;',waypoints:[[28,19],[31,23],[27,27],[20,27],[18,31],[22,35]].map(p=>({x:x+p[0]*s,y:y+p[1]*s}))})
  group(id,start)
 }
 const cylinder=(id,x,y,w,h,label,fill=theme.paleBlue)=>{
  shape(id+'-container',x,y,w,h,'cylinder',fill,theme.ink,'boundedLbl=1;backgroundOutline=1;size=15;')
  text(id+'-label',label,x+12,y+42,w-24,35,27,theme.ink,true,'center')
 }
 const header=(id,label,x,y,w=360)=>{shape(id+'-band',x,y,w,44,'rectangle',theme.blue,'none');text(id+'-label',label,x+14,y+6,w-28,32,26,'#FFFFFF',true)}
 const node=(id,label,x,y,w=230,h=90,fill=theme.paleBlue)=>shape(id,x,y,w,h,'rounded',fill,theme.ink,'fontStyle=1;arcSize=12;',label)
 return {ops,shape,text,edge,line,group,icon,cylinder,header,node}
}
