# 流程图

适用于顺序、条件分支以及可选精炼层。[source.drawio](source.drawio) 为可编辑起点，[preview.png](preview.png) 为 2000 px 预览；准确的对象 ID、几何和连线规划见 [design-spec.json](design-spec.json)。

初始构图为主流程输入、条件、两条结果分支；下方独立的 Refine → Validate → Deliver 层。替换条件与分支说明；按实际步骤增加或删除节点，并重排水平间距。精炼层可以整层删除，跨层连线按实际流程增加。模板结构按图件需求改变，不能把默认连线当作已经得到证明的关系。

主要编辑槽：`process-input、process-decision、process-path-a/b、process-refine-*`；同时替换页面标题、说明、关系文字和可选提示。先用 `npm run new -- <project> <figure> --template process-flow` 建立本地副本，再连接实时画布打开副本并编辑。完成后执行逐区域及全图 QA，保存与导出，详见[资产使用规则](../../README.md)。
