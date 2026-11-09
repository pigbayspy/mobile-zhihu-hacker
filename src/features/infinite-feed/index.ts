import type { Feature } from "../../core/feature";
import { waitFor } from "../../core/dom";
import { findFiberProp } from "../../core/zhihu-react";

/**
 * 功能：推荐流无限下滑
 *
 * 原理：知乎移动版前端把无限滚动组件的 isDrained 硬编码为 true，
 * 滚动到底部时从不触发加载。但数据层的 loadRecommendTopstorys 动作
 * 完好地挂在 React fiber 上，这里取出它并在滚动接近底部时手动调用。
 */

/** 距底部多少像素时触发加载 */
const BOTTOM_THRESHOLD_PX = 800;
/** 触发节流 ms（等待 API 返回，避免并发请求） */
const THROTTLE_MS = 1500;

export const infiniteFeed: Feature = {
  name: "推荐流无限下滑",

  matches(url) {
    // 首页推荐流（桌面端 www.zhihu.com 首页即是 Topstory）
    return url.hostname === "www.zhihu.com" && (url.pathname === "/" || url.pathname === "");
  },

  init() {
    let loadMore: ((...args: unknown[]) => unknown) | null = null;
    let busy = false;

    // fiber 在 React 挂载后才存在，轮询等待；找到后缓存，避免每次滚动都遍历
    waitFor(
      () => {
        const root = document.querySelector(".TopstoryMain");
        return root ? findFiberProp(root, "loadRecommendTopstorys") : null;
      },
      (loader) => {
        loadMore = loader;
      }
    );

    window.addEventListener(
      "scroll",
      () => {
        if (busy || !loadMore) return;
        const nearBottom =
          window.innerHeight + window.scrollY >=
          document.body.scrollHeight - BOTTOM_THRESHOLD_PX;
        if (!nearBottom) return;

        busy = true;
        try {
          loadMore();
        } catch {
          // 静默降级：知乎改版导致动作失效时不影响页面
        }
        window.setTimeout(() => {
          busy = false;
        }, THROTTLE_MS);
      },
      { passive: true }
    );
  },
};
