# Figure Studio

科研图件工作区。当前以 draw.io Desktop 和 Scientific Illustrator 的实时绘制、检查、修正工作流为核心。多项目共享工具、可编辑组件和按图类型划分的模板，研究资料按项目管理，交付结果集中保存。

```bash
cd /Users/yelanyanyu/code/figure-studio
npm run doctor
npm run new -- my-paper overview --template process-flow
npm run use-asset -- my-paper overview scientific-components
# 在本目录的 Codex 会话中完成实时绘制与保存，再导出
npm run export -- my-paper overview
```

无需 npm install：工作区脚本与上游 draw.io 服务只使用 Node.js 内置模块，要求 Node.js >=22。

```text
.codex/config.toml                  仅 draw.io 的两个 MCP 服务
.agents/skills/                     上游绘制、设计、审查与修正技能
vendor/scientific-illustrator/      原样固定的上游工作流
assets/library/<asset>/            共享视觉资产
assets/templates/<type>/           按图类型划分的模板
projects/<project>/
  references/                      参考材料
  data/                            项目专属研究数据
  figures/<figure>/
    brief.md                       科学信息与需求
    design-spec.md                 设计与对象规划
    source.drawio                  实时绘制后保存的可编辑源图
    assets/                        此图采用的资产快照
    qa/                            审查、截图与修正记录
exports/<project>/<figure>/        PNG、SVG、PDF、源图与来源清单
```

组件、模板选择和预览见 [资产目录](assets/README.md)。资产历史由 GitHub 管理，使用时复制到图件，公共库更新不会自动修改旧图。

## 第一次使用

在 `figure-studio` 目录创建项目会话，使项目级 MCP 配置生效。若工具未出现，重新打开该项目会话并检查项目是否受信任。工具应包含 `drawio_live_get_capabilities`、`drawio_live_status`、`drawio_validate` 与 `drawio_export`。`npm run doctor` 只检查环境，不等于实时连接成功。

当前已验证 `/Applications/draw.io.app`。执行 doctor 可以确认目前实际采用的位置；应用迁移后也可设置 `DRAWIO_PATH`。

## 给 agent 的任务示例

> 在项目 my-paper 的 overview 图件目录工作。使用 Scientific Illustrator 的 draw.io 实时工作流，先阅读 brief 和 design-spec，检查能力与当前画布。按区域绘制可编辑对象，每个区域都审查并修正。完成后保存 source.drawio，保留 QA 记录，通过统一 export 命令导出。不要把参考图片整体粘贴为最终图。

详细约定见 `docs/WORKFLOW.md`，术语见 `GLOSSARY.md`，上游版本见 `workflow.lock.json`。验证状态见 `docs/SETUP-VALIDATION.json`。
