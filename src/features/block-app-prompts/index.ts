import type { Feature } from "../../core/feature";
import { injectStyle } from "../../core/dom";

/**
 * 功能：屏蔽知乎 App 诱导组件
 *
 * 知乎移动网页版有两类诱导下载 App 的组件，均为纯 UI 干扰，与数据加载无关：
 * - .OpenInAppButton：悬浮的"App 内打开"按钮
 * - .OiaModal："是否在知乎 App 内阅读全文"模态框（由运行时配置 oia_modal 控制渲染）
 *
 * OiaModal 打开时的完整副作用（已实测）：
 * - 渲染兄弟节点 .MobileModal-backdrop（全屏遮罩）拦截点击
 * - 给 body 加内联 overflow:hidden 锁定滚动
 * 因此需要用 :has() 把遮罩和滚动锁一并处理；:has(.OiaModal) 保证
 * 只在目标弹窗存在时生效，不误伤知乎其他共用 MobileModal 的正常弹窗。
 *
 * 两个类名都是稳定语义类名（非构建哈希），抗更新能力较好。
 */
export const blockAppPrompts: Feature = {
  name: "屏蔽 App 诱导组件",

  matches(url) {
    return url.hostname.endsWith("zhihu.com");
  },

  init() {
    injectStyle(
      ".OpenInAppButton{display:none!important}" +
        // 遮罩与弹窗是兄弟节点，整个 wrapper 一起隐藏
        ".MobileModal-wrapper:has(.OiaModal){display:none!important}" +
        // 仅当 OiaModal 存在时解除 body 滚动锁
        "body:has(.OiaModal){overflow:auto!important}"
    );
  },
};
