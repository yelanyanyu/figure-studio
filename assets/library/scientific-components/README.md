# Scientific components

这是可直接导入 draw.io 的原生组件库。[library.xml](library.xml) 包含 12 个可编辑条目，[source.drawio](source.drawio) 是组件图集，[preview.png](preview.png) 是 2000 px 预览。双击组内文字可编辑；取消组合后可以分别调整线条、端点、容器和文字。

四色轨迹图标共享几何结构，颜色可以改写。圆柱容器与标题分开编辑，标题放在顶部弧线下方；椭圆说明卡片的标题和正文独立。标题条、虚线区域和样式板是组合对象，三种线是原生边对象。线条独立插入后应将两端附着到实际节点，线的颜色和虚实不自动确定科学含义。

通过仓库 `use-asset` 命令复制后，从图件副本的 `library.xml` 打开库；使用规则见 [资产目录](../../README.md)。Agent 可读取 [recipes.json](recipes.json) 的逐区域 graph 操作以及 [tokens.json](tokens.json) 的字体、颜色和间距。新增实例需使用独立 ID，根据本图文本长度调整几何并重新 QA。
