import type { Feature } from "./feature";

const features: Feature[] = [];

/** 注册一个功能模块 */
export function registerFeature(feature: Feature): void {
  features.push(feature);
}

/**
 * 启动所有适用于当前页面的功能。
 * 单个功能抛错不影响其他功能（静默降级原则）。
 */
export function startFeatures(): void {
  const url = new URL(window.location.href);
  for (const feature of features) {
    try {
      if (feature.matches(url)) {
        feature.init();
        console.debug(`[zhihu-enhancer] 功能已启用: ${feature.name}`);
      }
    } catch (e) {
      console.debug(`[zhihu-enhancer] 功能启动失败（已跳过）: ${feature.name}`, e);
    }
  }
}
