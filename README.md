# mobile-zhihu-hacker

[![CI](https://github.com/pigbayspy/mobile-zhihu-hacker/actions/workflows/ci.yml/badge.svg)](https://github.com/pigbayspy/mobile-zhihu-hacker/actions/workflows/ci.yml)

知乎移动网页版功能增强 Edge 浏览器扩展（Manifest V3）。

知乎移动网页版通过前端代码人为限制了部分功能（如推荐流无法无限下滑、频繁弹出 App 诱导组件），本扩展在页面主世界注入脚本解除这些限制。

## 当前功能

- **推荐流无限下滑**：解除移动版首页推荐流的加载截断，滚动到底部自动加载更多内容
- **屏蔽 App 诱导组件**：隐藏「App 内打开」悬浮按钮和「是否在知乎 App 内阅读全文」弹窗（含遮罩层与滚动锁解除）

## 特性

- 零浏览器权限：仅通过 `content_scripts` 注入，不申请任何 API 权限
- 不收集任何数据：扩展不发起任何网络请求
- 静默降级：知乎改版导致功能失效时，仅表现为功能不生效，不影响页面正常使用
