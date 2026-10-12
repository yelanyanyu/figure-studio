# 系统架构图

适用于模块、分层结构与接口。[source.drawio](source.drawio) 为可编辑起点，[preview.png](preview.png) 为 2000 px 预览；准确的对象 ID、几何和连线规划见 [design-spec.json](design-spec.json)。

初始构图为接口、应用、资源三层；每层三列，接口到模块、模块到资源为纵向附着线。按系统模块数量增删列；按部署/逻辑边界增删层。重新确定横向关系、接口名称与资源数量，圆柱形状不限定为数据库。模板结构按图件需求改变，不能把默认连线当作已经得到证明的关系。

主要编辑槽：`architecture-interface-*、architecture-module-*、architecture-store-*`；同时替换页面标题、说明、关系文字和可选提示。先用 `npm run new -- <project> <figure> --template system-architecture` 建立本地副本，再连接实时画布打开副本并编辑。完成后执行逐区域及全图 QA，保存与导出，详见[资产使用规则](../../README.md)。
