/**
 * 为 @vitepress-demo-preview 展开的 demo 源码块做客户端 Shiki 高亮。
 * 插件渲染的是带 class="language-*" 的 div，但未经过 VitePress markdown 高亮流水线，
 * 此处对这类块做后处理，用 Shiki 生成高亮 HTML 并替换。
 */

import { createHighlighter } from 'shiki';

const DEMO_SOURCE_SELECTOR = '[class*="vitepress-demo-preview"][class*="source"] .language-vue, [class*="vitepress-demo-preview"][class*="source"] .language-ts, [class*="vitepress-demo-preview"][class*="source"] .language-tsx, [class*="vitepress-demo-preview"][class*="source"] .language-js, [class*="vitepress-demo-preview"][class*="source"] .language-jsx';
const SHIKI_MARK = 'data-shiki-highlighted';

const langFromClass = (classList: DOMTokenList): string => {
  for (const c of classList) {
    if (c.startsWith('language-')) return c.replace('language-', '');
  }
  return 'vue';
};

let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null;

async function getHighlighter() {
  if (highlighter) return highlighter;
  highlighter = await createHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: ['vue', 'ts', 'tsx', 'js', 'jsx', 'html', 'css', 'json'],
  });
  return highlighter;
}

export async function highlightDemoBlocks(container: ParentNode = document) {
  const blocks = container.querySelectorAll(DEMO_SOURCE_SELECTOR);
  if (blocks.length === 0) return;

  const hl = await getHighlighter();
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const theme = isDark ? 'github-dark' : 'github-light';

  blocks.forEach((el) => {
    if (el.hasAttribute(SHIKI_MARK)) return;
    const code = (el as HTMLElement).innerText ?? (el as HTMLElement).textContent ?? '';
    if (!code.trim()) return;
    const lang = langFromClass((el as HTMLElement).classList);
    try {
      const html = hl.codeToHtml(code, { lang, theme });
      (el as HTMLElement).innerHTML = html;
      (el as HTMLElement).setAttribute(SHIKI_MARK, 'true');
    } catch {
      // 高亮失败时保留原文
    }
  });
}

export function observeAndHighlight(container: ParentNode = document.body) {
  highlightDemoBlocks(container);

  const observer = new MutationObserver(() => {
    highlightDemoBlocks(container);
  });
  observer.observe(container, {
    childList: true,
    subtree: true,
  });

  // 深色模式切换时清除已高亮标记并重新高亮，以匹配当前主题
  const themeObserver = new MutationObserver(() => {
    container.querySelectorAll(`[${SHIKI_MARK}]`).forEach((el) => {
      el.removeAttribute(SHIKI_MARK);
    });
    highlightDemoBlocks(container);
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  return () => {
    observer.disconnect();
    themeObserver.disconnect();
  };
}
