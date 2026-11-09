/**
 * 功能模块接口。
 * 每个功能自包含：自行判断适用页面、初始化、可选清理。
 * 所有功能失效时必须静默降级（不报错、不破坏页面）。
 */
export interface Feature {
  /** 功能名，用于日志 */
  readonly name: string;
  /** 判断该功能是否适用于当前页面 */
  matches(url: URL): boolean;
  /** 初始化。返回可选的清理函数（如 SPA 路由切换时调用） */
  init(): void | (() => void);
}
