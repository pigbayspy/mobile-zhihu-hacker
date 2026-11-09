/**
 * 知乎前端基于 React。DOM 元素上的 `__reactFiber$xxx` 属性指向其 fiber 节点，
 * 沿 fiber.return 向上遍历可以找到挂在 props 上的数据层动作（如 loadRecommendTopstorys）。
 * 注意：本文件代码必须运行在 MAIN world，ISOLATED world 看不到 fiber 属性。
 */

interface FiberLike {
  memoizedProps?: Record<string, unknown> | null;
  return?: FiberLike | null;
}

/** 从元素 fiber 向上查找名为 propName 的函数属性 */
export function findFiberProp(
  element: Element,
  propName: string,
  maxHops = 60
): ((...args: unknown[]) => unknown) | null {
  const key = Object.keys(element).find((k) => k.startsWith("__reactFiber$"));
  if (!key) return null;

  let fiber: FiberLike | null | undefined =
    (element as unknown as Record<string, FiberLike>)[key];
  let hops = 0;
  while (fiber && hops < maxHops) {
    const props = fiber.memoizedProps;
    if (props && typeof props[propName] === "function") {
      return props[propName] as (...args: unknown[]) => unknown;
    }
    fiber = fiber.return;
    hops++;
  }
  return null;
}
