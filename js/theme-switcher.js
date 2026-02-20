/* ═══════════════════════════════════
   theme-switcher.js — 主题切换 + 布局切换 + localStorage 持久化
═══════════════════════════════════ */

(function () {
  /* ─── Theme ─── */
  var THEME_KEY = 'menu-theme';
  var DEFAULT_THEME = 'default';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (_) {
      /* localStorage 不可用时静默失败 */
    }
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
    } catch (_) {
      return DEFAULT_THEME;
    }
  }

  /* ─── Layout ─── */
  var LAYOUT_KEY = location.pathname.indexOf('a4') !== -1 ? 'a4-layout' : 'wall-layout';
  var DEFAULT_LAYOUT = 'a';

  function applyLayout(layout) {
    document.documentElement.setAttribute('data-layout', layout);
    try {
      localStorage.setItem(LAYOUT_KEY, layout);
    } catch (_) {
      /* localStorage 不可用时静默失败 */
    }
  }

  function getSavedLayout() {
    try {
      return localStorage.getItem(LAYOUT_KEY) || DEFAULT_LAYOUT;
    } catch (_) {
      return DEFAULT_LAYOUT;
    }
  }

  /* iframe 嵌入检测 — 去除独立页面的预览缩放，由 Gallery 统一缩放 */
  if (window !== window.parent) {
    document.documentElement.classList.add('in-iframe');
  }

  /* 页面加载时应用已保存的主题和布局 */
  applyTheme(getSavedTheme());
  applyLayout(getSavedLayout());

  /* 监听来自 Gallery 页面的消息 */
  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'theme-change' && e.data.theme) {
      applyTheme(e.data.theme);
    }
    if (e.data && e.data.type === 'layout-change' && e.data.layout) {
      applyLayout(e.data.layout);
    }
  });

  /* 暴露全局 API 供控制台或外部调用 */
  window.MenuTheme = {
    apply: applyTheme,
    current: function () {
      return document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
    }
  };

  window.MenuLayout = {
    apply: applyLayout,
    current: function () {
      return document.documentElement.getAttribute('data-layout') || DEFAULT_LAYOUT;
    }
  };
})();
