import type { Feature } from "../../core/feature";
import { injectStyle, waitFor } from "../../core/dom";

/**
 * 功能：恢复移动端搜索栏
 *
 * 机制：移动版首页搜索栏是假输入框，点击触发 `location.href = "zhihu://search?..."`
 * 深链拉 App；浏览器无 scheme 处理器时入口完全失效（代码里的 2s 兜底跳转实测不生效）。
 * 但 https://www.zhihu.com/search?type=content&q= 页面在移动模式下功能完整。
 *
 * 方案（不依赖哈希类名，语义定位）：
 * 1. 在 main.App-main 内找文本恰为「搜索」的叶子元素，向上取文本 < 40 字符的
 *    最大祖先作为搜索栏容器；
 * 2. 捕获阶段拦截栏内全部点击，阻断知乎的深链跳转；
 * 3. 把左侧热词占位区替换为原生 <input>（热词文本作为 placeholder）；
 * 4. 点击「搜索」按钮或输入框内回车 → 整页跳转到移动版搜索结果页；
 * 5. MutationObserver 监听 main 子树，React 重绘冲掉改造后自动重新执行。
 */

const SEARCH_URL = "https://www.zhihu.com/search?type=content&q=";
const MARK_ATTR = "data-zhe-search";
const INPUT_CLASS = "zhe-search-input";

/** 在 main 内定位搜索栏容器；同时返回「搜索」叶子元素 */
function findSearchBar(
  main: HTMLElement
): { bar: HTMLElement; searchLeaf: HTMLElement } | null {
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_ELEMENT);
  let node = walker.nextNode() as HTMLElement | null;
  let leaf: HTMLElement | null = null;
  while (node) {
    if (node.children.length === 0 && (node.textContent || "").trim() === "搜索") {
      leaf = node;
      break;
    }
    node = walker.nextNode() as HTMLElement | null;
  }
  if (!leaf) return null;

  // 向上取「文本长度 < 40」的最大祖先：栏内文本 = 热词 + 搜索，很短；
  // 再往上会并入头部/信息流，文本暴增
  let bar = leaf;
  let cur = leaf.parentElement;
  while (cur && cur !== main) {
    if ((cur.textContent || "").trim().length >= 40) break;
    bar = cur;
    cur = cur.parentElement;
  }
  return { bar, searchLeaf: leaf };
}

/** 把搜索栏改造为可用状态（幂等） */
function enhance(bar: HTMLElement, searchLeaf: HTMLElement): void {
  if (bar.hasAttribute(MARK_ATTR)) return;

  // 布局行：搜索叶子向上，第一个「有多个子元素」的父容器。
  // 其直接子元素中，包含搜索叶子的是按钮分支，其余是输入区
  let buttonBranch: Element = searchLeaf;
  while (
    buttonBranch.parentElement &&
    buttonBranch.parentElement.children.length < 2 &&
    buttonBranch.parentElement !== bar
  ) {
    buttonBranch = buttonBranch.parentElement;
  }
  const row = buttonBranch.parentElement;
  if (!row) return;
  const inputArea = [...row.children].find((c) => c !== buttonBranch) as
    | HTMLElement
    | undefined;
  if (!inputArea) return;

  // 热词文本复用为 placeholder
  const hotword = (inputArea.textContent || "").trim();

  // 替换为原生输入框
  const input = document.createElement("input");
  input.type = "text";
  input.className = INPUT_CLASS;
  input.placeholder = hotword || "搜索你感兴趣的内容";
  input.setAttribute("enterkeyhint", "search");
  inputArea.replaceChildren(input);

  const doSearch = () => {
    const q = input.value.trim();
    window.location.assign(q ? SEARCH_URL + encodeURIComponent(q) : SEARCH_URL);
  };

  input.addEventListener("keydown", (ev) => {
    if ((ev as KeyboardEvent).key === "Enter") doSearch();
    ev.stopPropagation();
  });

  // 捕获阶段统一拦截：阻断知乎的 zhihu:// 深链；
  // 点按钮 → 搜索；点输入框以外区域 → 聚焦输入框
  bar.addEventListener(
    "click",
    (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const target = ev.target as Element;
      if (buttonBranch.contains(target)) {
        doSearch();
      } else if (target !== input) {
        input.focus();
      }
    },
    true
  );

  bar.setAttribute(MARK_ATTR, "1");
}

export const searchEntry: Feature = {
  name: "恢复移动端搜索栏",

  matches(url) {
    return url.hostname === "www.zhihu.com" && url.pathname === "/";
  },

  init() {
    injectStyle(
      `.${INPUT_CLASS}{width:100%;height:100%;border:none;outline:none;` +
        `background:transparent;font:inherit;color:inherit;padding:0;margin:0}` +
        `.${INPUT_CLASS}::placeholder{color:#8590a6}`
    );

    waitFor(
      () => document.querySelector("main.App-main") as HTMLElement | null,
      (main) => {
        const tryEnhance = () => {
          const found = findSearchBar(main);
          if (found && !found.bar.hasAttribute(MARK_ATTR)) {
            enhance(found.bar, found.searchLeaf);
          }
        };
        tryEnhance();

        // React 重绘（热词轮播、SPA 返回等）会冲掉改造，监听后自动恢复。
        // 无限下滑会持续触发 DOM 变更，这里 500ms 节流，避免频繁全树扫描
        let pending = false;
        new MutationObserver(() => {
          if (pending) return;
          pending = true;
          window.setTimeout(() => {
            pending = false;
            tryEnhance();
          }, 500);
        }).observe(main, { childList: true, subtree: true });
      }
    );
  },
};
