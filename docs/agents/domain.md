# Domain Docs

本仓库采用 single-context 布局：
根目录 `GLOSSARY.md` 保存领域术语，`docs/adr/` 保存架构决策。

## 阅读规则

探索代码前读取根目录 GLOSSARY.md，并读取与当前工作相关的 ADR。
若以后出现 GLOSSARY-MAP.md，先按其中的指引读取相关上下文的术语表。

文档缺失时静默继续；由 domain-modeling 在术语或决策形成时按需创建。

## 使用术语

Issue、设计建议、假设和测试名称采用 GLOSSARY.md 定义的术语，
遵循其中的 Avoid 约定。遇到术语空缺时，先检查是否已有对应概念；
确有缺口则交给 domain-modeling 处理。

## 决策冲突

方案与已有 ADR 冲突时，明确指出冲突的 ADR、理由及需要重新讨论的决策，
再推进变更。
