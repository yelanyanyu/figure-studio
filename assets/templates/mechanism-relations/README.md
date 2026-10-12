# 机制关系图

适用于实体、驱动/响应与定向作用。[source.drawio](source.drawio) 为可编辑起点，[preview.png](preview.png) 为 2000 px 预览；准确的对象 ID、几何和连线规划见 [design-spec.json](design-spec.json)。

初始构图为中心实体、左右输入/输出、上方上下文以及外围可选反馈通道。按证据替换实体和作用标签；反馈可删除，正负作用或关联需明确标签/图例。节点数量和中心位置可以改变，重新规划外围连线以避开实体。模板结构按图件需求改变，不能把默认连线当作已经得到证明的关系。

主要编辑槽：`mechanism-context/input/central/output、mechanism-effect-*、mechanism-feedback`；同时替换页面标题、说明、关系文字和可选提示。先用 `npm run new -- <project> <figure> --template mechanism-relations` 建立本地副本，再连接实时画布打开副本并编辑。完成后执行逐区域及全图 QA，保存与导出，详见[资产使用规则](../../README.md)。
