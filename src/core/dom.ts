/** 向页面注入一段 CSS */
export function injectStyle(css: string): void {
  const style = document.createElement("style");
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
}

/**
 * 轮询等待一个条件成立。
 * @param probe 返回非 null 表示条件成立
 * @param onReady 条件成立后的回调
 * @param tries 最大尝试次数（默认 20）
 * @param interval 轮询间隔 ms（默认 500）
 */
export function waitFor<T>(
  probe: () => T | null,
  onReady: (value: T) => void,
  tries = 20,
  interval = 500
): void {
  let count = 0;
  const timer = window.setInterval(() => {
    const value = probe();
    if (value !== null) {
      window.clearInterval(timer);
      onReady(value);
    } else if (++count >= tries) {
      window.clearInterval(timer);
    }
  }, interval);
}
