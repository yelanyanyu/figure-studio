"""Post-live packaging only: normalize saved snapshots and extract their existing subgraphs."""
from pathlib import Path
import json,copy,xml.etree.ElementTree as E
root=Path(__file__).resolve().parent.parent
ids=['components','process-flow','system-architecture','mechanism-relations']
for ident in ids:
 d=root/'projects/asset-studio/figures'/ident
 spec=json.loads((d/'design-spec.json').read_text());tree=E.parse(d/'source.drawio');model=tree.find('.//mxGraphModel')
 model.set('pageWidth',str(spec['canvas']['width']));model.set('pageHeight',str(spec['canvas']['height']));model.set('page','1');model.set('pageScale','1')
 for outer in model.find('root'):
  if outer.tag!='mxCell':
   cell=outer.find('mxCell')
   if cell is not None and 'id' not in cell.attrib:cell.set('id',outer.get('id'))
 tree.write(d/'source.drawio',encoding='utf-8',xml_declaration=True)
 if ident!='components':
  target=root/'assets/templates'/ident;target.mkdir(parents=True,exist_ok=True)
  for filename in ['source.drawio','design-spec.json','brief.md','sources.md']:(target/filename).write_bytes((d/filename).read_bytes())
  (target/'template.json').write_text(json.dumps({'id':ident,'title':spec['title'],'source':'source.drawio','canvas':spec['canvas'],'editable':True,'raster_count':0,'regions':[r['id']for r in spec['regions']],'copy_policy':'Independent local copy; history in GitHub; no asset lock'},indent=2)+'\n')
 else:
  target=root/'assets/library/scientific-components';target.mkdir(parents=True,exist_ok=True)
  (target/'source.drawio').write_bytes((d/'source.drawio').read_bytes())
  (target/'recipes.json').write_text(json.dumps(spec,indent=2)+'\n')
  (target/'tokens.json').write_text(json.dumps(spec['theme'],indent=2)+'\n')
  nodes=list(model.find('root'));byid={n.get('id'):n for n in nodes}
  def cell(n):return n if n.tag=='mxCell' else n.find('mxCell')
  lib=[]
  for entry in spec['library_entries']:
   eid=entry['id'];selected={eid}
   while True:
    grown=selected|{n.get('id')for n in nodes if cell(n).get('parent')in selected}
    if grown==selected:break
    selected=grown
   m=E.Element('mxGraphModel');r=E.SubElement(m,'root');E.SubElement(r,'mxCell',id='0');E.SubElement(r,'mxCell',id='1',parent='0')
   clones=[copy.deepcopy(n)for n in nodes if n.get('id')in selected]
   outer=next(n for n in clones if n.get('id')==eid);c=cell(outer);c.set('parent','1');geo=c.find('mxGeometry')
   if c.get('edge')=='1':
    points=geo.findall('.//mxPoint');xs=[float(p.get('x','0'))for p in points];ys=[float(p.get('y','0'))for p in points];x=min(xs);y=min(ys)
    for p in points:p.set('x',str(float(p.get('x','0'))-x));p.set('y',str(float(p.get('y','0'))-y))
    w=max(xs)-x;h=max(ys)-y
   else:
    w=float(geo.get('width'));h=float(geo.get('height'));geo.set('x','0');geo.set('y','0')
   r.extend(clones);lib.append({'xml':E.tostring(m,encoding='unicode'),'w':max(w,1),'h':max(h,1),'title':entry['title']})
  library=E.Element('mxlibrary');library.text=json.dumps(lib,ensure_ascii=False);E.ElementTree(library).write(target/'library.xml',encoding='utf-8',xml_declaration=True)
  (target/'asset.json').write_text(json.dumps({'id':'scientific-components','title':'Scientific editable components','library':'library.xml','source':'source.drawio','entries':spec['library_entries'],'raster_count':0,'provenance':'Abstracted visual grammar from user-approved reference reconstruction; no research-specific content','copy_policy':'Independent figure copy; history in GitHub'},ensure_ascii=False,indent=2)+'\n')
print('Packaged 12 editable library entries and 3 distinct templates from saved live snapshots.')
