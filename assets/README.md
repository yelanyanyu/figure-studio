# 可复用资产与模板

先根据图的表达任务选构图，再选局部组件。流程图强调顺序与分支，架构图强调层次与接口，机制图强调实体与作用关系；模板中的节点数量和连线都可以增删。它们提供编辑起点，科学内容、关系含义和证据由具体图件决定。

| 类型 | 入口 | 适用任务 |
| --- | --- | --- |
| 组件库 | [scientific-components](library/scientific-components/README.md) · [预览](library/scientific-components/preview.png) | 12 个原生条目：四色轨迹图标、圆柱、说明卡片、标题条、虚线区域、三种线、样式板 |
| 基础样式 | [scientific-basic](library/scientific-basic/asset.json) | 既有基础色板、字号和间距建议 |
| 流程模板 | [process-flow](templates/process-flow/README.md) · [预览](templates/process-flow/preview.png) | 顺序、条件分支、可选精炼层 |
| 架构模板 | [system-architecture](templates/system-architecture/README.md) · [预览](templates/system-architecture/preview.png) | 接口、应用模块、资源分层 |
| 机制模板 | [mechanism-relations](templates/mechanism-relations/README.md) · [预览](templates/mechanism-relations/preview.png) | 实体、定向作用、可选反馈 |

## 创建和复用

在仓库根目录执行：

```bash
npm run new -- my-paper overview --template process-flow
npm run use-asset -- my-paper overview scientific-components
npm run export -- my-paper overview
```

`new --template` 把模板源图复制成图件的 `source.drawio`，同时保留模板材料副本；`use-asset` 把组件包复制到图件自己的 `assets/scientific-components/`。打开本地副本编辑，旧图保持独立。历史由 GitHub 管理，无额外资产版本号或锁文件；再次引入同名资产时命令拒绝覆盖，更新需明确选择副本并重新 QA。

人工使用时，在 draw.io 的“文件 → 打开库 → 设备”选择图件副本中的 `library.xml`，从侧栏拖入组件。原生库以 XML 图模型条目保存可编辑对象，格式和加载入口见 [draw.io 官方说明](https://www.drawio.com/docs/reference/format-custom-shape-library/) 与 [自定义库手册](https://www.drawio.com/docs/manual/advanced/custom-shape-libraries/)。

## Agent 使用顺序

1. 读取图件 brief 和所选模板 README，按表达任务选择模板；三类都不合适时重新设计构图。完成条件：design-spec 写清实际区域、文字、节点数量与关系。
2. 复制模板或组件到图件目录。先检查 live capabilities、graph_ready 和当前画布，再在新页面打开已保存模板副本或从原生库导入已有组件。保留用户原画布。
3. 新对象通过 live graph/model API 构建；`recipes.json` 提供组件配方，`design-spec.json` 提供模板的逐区域操作。为新实例换用唯一 ID，并按本图重新布局；圆柱文字放在顶部弧线下，连接关系使用附着线。
4. 替换标题、节点、关系文字和颜色；按科学含义增删区域、节点与连接。英文占位词及模板提示文字在正式图中应替换或移除。中文文字设置本机中文字体并复查换行。
5. 每区域都检查当前结构和实时截图，有缺陷先修正；全图检查可编辑性、文字边界、箭头、遮挡和语义。完成条件：QA 留存结构审计、截图及未解决项。
6. 保存图件 `source.drawio`，通过根目录 export 命令导出 2000 px PNG、SVG、PDF。PNG 仅用于预览。

## 维护与证据

组件和模板来自 `projects/asset-studio/figures/` 中逐区域实时构建后保存的源图。`scripts/package-starter-assets.py` 仅规范化已保存快照并提取其子图为原生库；图件内容不是由预生成 XML 替代实时绘制。维护时先修改 live 画布、完成 QA、保存源图、导出，再重新打包共享目录与预览。

QA、重新打开检查和实际复用示例见 [验证记录](../projects/asset-studio/README.md)。共享库保留中性标签和视觉结构；项目研究数据、原始参考图、特定论文结论以及脑/地球近似图标留在项目内。当前未包含统计图表模板或模板编辑器。
