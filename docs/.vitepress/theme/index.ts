import DefaultTheme from 'vitepress/theme';
import { ElementPlusContainer } from '@vitepress-demo-preview/component';
import { defineClientComponentConfig } from '@vitepress-demo-preview/core';
import { NolebaseGitChangelogPlugin } from '@nolebase/vitepress-plugin-git-changelog/client';
import { NolebaseEnhancedReadabilitiesPlugin } from '@nolebase/vitepress-plugin-enhanced-readabilities/client';
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import PortalVue from 'portal-vue';

import '@vitepress-demo-preview/component/dist/style.css';
import '@nolebase/vitepress-plugin-git-changelog/client/style.css';
import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css';
import '@shikijs/vitepress-twoslash/style.css';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
// import '@element-plus-lab/components/style.css';
import './styles/global.css';

// import { useGlobalComp } from '../utils/useGlobalComp';
import SiteLayout from './components/site-layout.vue';
import type { EnhanceAppContext, Theme } from 'vitepress';

export default {
  async enhanceApp(ctx: EnhanceAppContext) {
    const { app } = ctx;
    // useGlobalComp(app);

    defineClientComponentConfig({
      // Keep backward compatibility
      copySuccessText: 'Code copied to clipboard!',
      vueApp: app,
      defaultLanguage: 'zh',
    });

    app.use(ElementPlus);
    app.use(PortalVue);
    app.component('DemoPreview', ElementPlusContainer);
    app.use(NolebaseGitChangelogPlugin);
    app.use(NolebaseEnhancedReadabilitiesPlugin);
    app.use(TwoslashFloatingVue);
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  },
  extends: DefaultTheme,
  Layout: SiteLayout,
} satisfies Theme;
