# Zenmark Playground

用于本地开发/调试 `zenmark-editor` 的最小示例应用。

包含：
- 左侧 Markdown 文本区，可编辑并一键推送到编辑器
- 右侧是 `ZenmarkEditor` 组件，会在保存时回写左侧文本

启动与构建：
- 安装依赖：`pnpm install`
- 先构建库：`pnpm --filter zenmark-editor build`
- 开发模式：`pnpm --filter playground dev`
- 生产构建：`pnpm --filter playground build`

