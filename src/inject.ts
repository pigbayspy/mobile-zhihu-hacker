import { registerFeature, startFeatures } from "./core/registry";
import { shouldInject } from "./core/guard";
import { infiniteFeed } from "./features/infinite-feed";
import { blockAppPrompts } from "./features/block-app-prompts";
import { searchEntry } from "./features/search-entry";

// 防止重复注入（如扩展更新后页面未刷新）
declare global {
  interface Window {
    __zhihuEnhancerLoaded?: boolean;
  }
}

if (!window.__zhihuEnhancerLoaded && shouldInject()) {
  window.__zhihuEnhancerLoaded = true;

  // ---- 功能注册表 ----
  // 新功能：在 src/features/ 下新建目录实现 Feature 接口，然后在此注册一行
  registerFeature(infiniteFeed);
  registerFeature(blockAppPrompts);
  registerFeature(searchEntry);

  startFeatures();
}
