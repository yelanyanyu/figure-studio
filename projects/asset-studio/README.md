# 可复用资产构建与验证

用户确认了组件与模板分离、按图类型采用不同构图、GitHub 管理历史以及图件保留独立副本。本次按 Scientific Illustrator 的 Designer → Drawer → Reviewer → Corrector 顺序，在隔离 draw.io 会话逐区域构建；原参考复刻画布保留。

| 源图 | 结构与预览证据 | 用途 |
| --- | --- | --- |
| [components](figures/components/source.drawio) | [全图结构](figures/components/qa/whole-audit.json) · [截图](figures/components/qa/whole-live.png) | 12 个原生库条目的图集 |
| [process-flow](figures/process-flow/source.drawio) | [结构](figures/process-flow/qa/whole-audit.json) · [截图](figures/process-flow/qa/whole-live.png) | 分支流程与可选精炼层 |
| [system-architecture](figures/system-architecture/source.drawio) | [最终结构](figures/system-architecture/qa/final-text-audit.json) · [截图](figures/system-architecture/qa/final-text-live.png) | 分层模块与接口 |
| [mechanism-relations](figures/mechanism-relations/source.drawio) | [最终结构](figures/mechanism-relations/qa/final-text-audit.json) · [截图](figures/mechanism-relations/qa/final-text-live.png) | 实体与作用关系 |
| [import-check](figures/import-check/source.drawio) | [结构](figures/import-check/qa/native-library-import-audit.json) · [截图](figures/import-check/qa/native-library-import-live.png) | 库加载、全部条目导入与文字编辑 |
| [reuse-check](figures/reuse-check/source.drawio) | [隔离验证](figures/reuse-check/qa/reuse-verification.json) · [截图](figures/reuse-check/qa/template-content-replacement-live.png) | 创建模板副本、改字、复制组件包 |

四张资产源图总计 142 个原生或组合对象，0 张图片。逐区域审计及截图在各图 qa 目录；已保存源图重新打开后有 roundtrip 审计与截图。修正记录包括圆柱标题移到顶部弧线下方，以及两张模板说明改用原生单行文字并缩短文本；最新导出经过可视对照，PNG 宽度为 2000 px。

原生库通过 `LocalLibrary` 与 `ui.loadLibrary` 加载到侧栏，12 个条目分别用 `ui.stringToCells` 和 `graph.importCells` 导入新页面，并将说明卡片标题改为 Edited label。保留原始对象的语义 ID 后，结构审计无剩余发现；本次没有通过 OS 鼠标键盘或预生成图件 XML 绘制。[^ids]

复用验证用仓库 new 命令复制流程模板，用 use-asset 复制组件包，再在实时图模型把 Input / stage 改为 Local input；共享流程模板的 SHA-256 保持一致。10 个 CLI 集成检查覆盖模板复制、副本隔离、组件复制、禁止覆盖、非法名称、缺失资产/模板以及拒绝旧版本参数。运行 `node scripts/check-asset-cli.mjs` 可重新执行这些检查。

资产入口与维护步骤见 [assets/README.md](../../assets/README.md)。导出保存在 `exports/asset-studio/<figure>/`，含 PNG、SVG、PDF、可编辑源图和来源清单；不自动发布。

[^ids]: 首次导入生成的随机数字 ID 使审计把图标框当作无关实体，并把所有对象误认作同一重复序列；初始结果保存在 import-check/qa/initial-generated-ids-audit.json。保留语义 ID 不改变对象几何或连接关系，修正后重新执行结构与截图检查。
