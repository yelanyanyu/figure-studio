# draw.io 工作流

## 已确认范围

2026-10-12：用户确认 `figure-studio` 名称、多项目工作区与项目数据边界，并明确当前只需要 draw.io，工作流采用 icebird1998/scientific-illustrator。当前不安装 Python 绘图环境。

## 本地集成

上游固定提交保存在 `vendor/scientific-illustrator`，未修改上游文件。项目 `.codex/config.toml` 仅接入 drawio-live 与 drawio-file-utils；相关五个上游技能通过 `.agents/skills/` 链接发现。未注册全局 marketplace 或修改全局 Codex 配置。配置需在此目录的可信项目会话中加载；当前聊天不会自动获得新 MCP 工具。

## 每张图的路径

`projects/<project>/figures/<figure>/` 保存 `brief.md`、`design-spec.md`、`source.drawio`、`assets/` 和 `qa/`。项目级 `references/` 保存来源材料，`data/` 保存研究专属数据。统一交付目录为 `exports/<project>/<figure>/`。

## 绘制与审查

1. 用 `npm run new -- <project> <figure>` 建立图件目录，写清科学信息、受众、精确文字、面板与不确定性。
2. 先用 `drawio_live_get_capabilities` 检查能力，再连接实时画布，确认 `graph_ready=true`，检查现有内容；不得擅自清空用户画布。
3. Designer 制定设计；Drawer 通过实时图模型 API 创建对象；Reviewer 检查结构和当前渲染；Corrector 给出最小对象修正。角色可以由同一 agent 分阶段承担，不要求并发 agent。
4. 每区域完成后截图、结构审计、修正并复查；通过后再绘制下一区域，最后审查全图。不得先生成 XML 充当实时绘制。
5. 用 `drawio_live_save_snapshot` 保存到该图的 `source.drawio`；用 `drawio_validate` 验证后执行统一导出。
6. 将设计、审查、截图和残留歧义保存到 `qa/`，不把工具调用成功等同于视觉或科学正确。

## 资产复用

用户已确认：资产历史由 GitHub 管理，不设置额外版本号或资产锁文件。使用时复制到图件，旧图保持独立；复用前按 [资产目录](../assets/README.md) 选择组件或适合图类型的模板，并遵守其中的编辑与 QA 顺序。共享库改动不自动传播到已有图件。

## 输出

`npm run export -- <project> <figure>` 先验证已保存源图，导出 PNG（2000 px 宽）、SVG、PDF，并复制源图到统一目录；写出来源 SHA-256 与导出清单。导出只证明文件生成，不代表 Reviewer 已通过；当前 QA 记录另行保留。

## Desktop 路径

优先使用 `DRAWIO_PATH`，其次查 `/Applications`、`~/Applications`，最后查 `/Volumes` 挂载盘。本轮最终验证应用位于 `/Applications/draw.io.app`。若弹出该卷，需将 app 放入常规应用目录或设置有效的 `DRAWIO_PATH`，再运行 doctor。工作区不会搬动应用或修改全局环境。
