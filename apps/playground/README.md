# Zenmark Playground

用于本地开发/调试 `zenmark-editor` 的最小示例应用。

包含：
- 顶部工具栏：示例选择（EN/ZH/Quick）、Auto Sync、换行、左侧宽度调节、导入/导出/复制等
- 左侧 Markdown 文本区：支持自动同步到编辑器（可关），字数统计，清空
- 右侧是 `ZenmarkEditor` 组件：在编辑器内按 `Cmd/Ctrl + S` 保存会回写左侧文本

启动与构建：
- 安装依赖：`pnpm install`
- 先构建库：`pnpm --filter zenmark-editor build`
- 开发模式：`pnpm --filter playground dev`
- 生产构建：`pnpm --filter playground build`

