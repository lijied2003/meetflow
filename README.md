# MeetFlow AI 产品展示

静态发布文件适配 `/meetflow/` 路径。仓库名称使用 `meetflow`。

上传本目录内的 `docs/` 和 `README.md` 到仓库根目录，保持 `docs/index.html` 层级，保留 `docs/.nojekyll`。在 Settings → Pages 选择 Deploy from a branch，发布源为 **main** 分支的 **/docs**。无需在线构建。

正式网址以 Pages 成功部署后显示的地址为准。当前项目按钮保留真实既有网址。未自动创建仓库或部署。

只包含公开网页与必要静态资源，不包含原始 Word、未确认 PDF、密钥、依赖包、测试日志或备份。不要上传上级 `.validation` 或原项目全目录。更新时仍使用同一仓库与 docs。

完整中文教程和测试报告在本地交付总目录中。

后续推荐使用交付总目录中的 update-sites.cjs，将原源码构建结果同步到 GitHub Desktop 克隆仓库；然后在 Desktop 手动 Commit to main / Push origin。教程第 10 节有完整步骤，脚本和配置不需要上传公开仓库。
