# mobile-zhihu-hacker

[![CI](https://github.com/pigbayspy/mobile-zhihu-hacker/actions/workflows/ci.yml/badge.svg)](https://github.com/pigbayspy/mobile-zhihu-hacker/actions/workflows/ci.yml)

知乎移动网页版功能增强 Edge 浏览器扩展（Manifest V3）。

知乎移动网页版通过前端代码人为限制了部分功能（如推荐流无法无限下滑、频繁弹出 App 诱导组件），本扩展在页面主世界注入脚本解除这些限制。

## 当前功能

- **推荐流无限下滑**：解除移动版首页推荐流的加载截断，滚动到底部自动加载更多内容
- **屏蔽 App 诱导组件**：隐藏「App 内打开」悬浮按钮和「是否在知乎 App 内阅读全文」弹窗（含遮罩层与滚动锁解除）
- **恢复移动端搜索栏**：将首页假搜索框改造为可输入的真搜索框，直接跳转到移动版搜索结果页

## 特性

- 零浏览器权限：仅通过 `content_scripts` 注入，不申请任何 API 权限
- 不收集任何数据：扩展不发起任何网络请求
- 静默降级：知乎改版导致功能失效时，仅表现为功能不生效，不影响页面正常使用

---

## English

A Microsoft Edge extension (Manifest V3) that enhances the mobile web version of Zhihu.

Zhihu's mobile web version deliberately restricts certain features in its frontend code (e.g., the recommendation feed cannot scroll infinitely, and app-promotion components pop up frequently). This extension injects scripts into the page's main world to lift these restrictions.

### Features

- **Infinite feed scrolling**: removes the loading cutoff in the mobile homepage feed; more content loads automatically as you approach the bottom
- **Block app-promotion components**: hides the "Open in App" floating button and the "Read in Zhihu App" modal (including its backdrop and scroll lock)
- **Restore the mobile search bar**: turns the fake search box on the homepage into a real, typeable input that jumps straight to the mobile search results page

### Highlights

- **Zero browser permissions**: works solely through `content_scripts` injection; no API permissions requested
- **No data collection**: the extension never makes any network requests
- **Silent degradation**: if a Zhihu update breaks a feature, it simply stops working without affecting normal page usage
