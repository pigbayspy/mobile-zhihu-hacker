/**
 * 注入守卫：仅在移动端浏览器注入扩展。
 * 知乎按 UA 决定渲染移动版还是桌面版，本扩展所有功能都针对移动版 DOM，
 * 桌面 UA 下注入只会空跑（静默降级），跳过可省掉无谓开销。
 */

/** 主流移动设备 UA 特征 */
const MOBILE_UA_RE =
  /Android|iPhone|iPod|iPad|Mobile|IEMobile|Opera Mini|BlackBerry|Windows Phone|webOS/i;

/** 调试开关：localStorage 置为 "1" 时强制注入，绕过 UA 检测 */
const DEBUG_FLAG_KEY = "__zhe_force__";

/** 判断当前是否应注入：移动端 UA，或已开启调试开关 */
export function shouldInject(): boolean {
  try {
    if (window.localStorage.getItem(DEBUG_FLAG_KEY) === "1") {
      return true;
    }
  } catch {
    // 隐私模式等 localStorage 不可用时忽略开关
  }

  return MOBILE_UA_RE.test(navigator.userAgent);
}
