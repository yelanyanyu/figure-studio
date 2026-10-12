# Issue tracker: GitHub

本仓库的任务与规格保存在 `yelanyanyu/figure-studio` 的 GitHub Issues。
使用 gh CLI，命令显式指定仓库。

## 常用操作

- 创建：`gh issue create --repo yelanyanyu/figure-studio --title "..." --body-file <path>`
- 读取：`gh issue view <number> --repo yelanyanyu/figure-studio --json number,title,body,labels,comments`
- 列表：`gh issue list --repo yelanyanyu/figure-studio --state open --json number,title,body,labels`
- 评论：`gh issue comment <number> --repo yelanyanyu/figure-studio --body-file <path>`
- 添加或移除标签：`gh issue edit <number> --repo yelanyanyu/figure-studio --add-label "..."` 或 `--remove-label "..."`
- 关闭：`gh issue close <number> --repo yelanyanyu/figure-studio`

多行正文先写入文件，再通过 --body-file 提交。

## Pull requests as a triage surface

**PRs as a request surface: no.**

## 技能约定

“发布到 issue tracker”表示创建 GitHub Issue。
“获取相关 ticket”表示读取对应 Issue。

## Wayfinding operations

- Map：一个带 `wayfinder:map` 标签的 Issue，保存 Notes、Decisions-so-far 和 Fog。
- Child ticket：关联到 Map 的子 Issue，类型标签为
  `wayfinder:research`、`wayfinder:prototype`、`wayfinder:grilling` 或 `wayfinder:task`。
- 子任务关联优先使用 GitHub sub-issues；不可用时在 Map 中维护任务列表，
  并在子任务正文顶部写 `Part of #<map>`。
- 阻塞关系优先使用 GitHub 原生 issue dependencies；
  不可用时在正文顶部写 `Blocked by: #<n>, #<n>`。
  所有阻塞任务关闭后，该任务才可开始。
- Frontier：按 Map 中的顺序选择未关闭、未分配且无未完成阻塞项的子任务。
- Claim：开始工作前将任务分配给当前执行者。
- Resolve：追加答案评论，关闭任务，再向 Map 的 Decisions-so-far
  追加结论摘要与任务链接。
- Wayfinder 标签在使用该流程时按需创建。
