---
order: 0
---

# 关于 Element Plus Lab

Element Plus Lab 是一个专注于分享基于 **Vue 3** 和 **Element Plus** 的业务组件封装示例和演示的项目。

- **业务组件封装示例**：基于 Element Plus 的二次封装组件，展示实际业务场景中的最佳实践
- **完整的开发工具链**：包含封装好的组件、工具函数、Hooks、指令等完整的开发资源
- **详细的文档和演示**：提供完整的组件文档和在线演示，方便学习和使用
- **现代化的技术栈**：基于 Vue 3.5、TypeScript、Vite、Turborepo 等最新技术构建
- **portal-vue 开发模式**: 介绍如何使用 portal-vue 提高组件开发效率
<!-- - **实时演示环境**：内置 Playground 和文档站点，支持在线体验和调试 -->

本项目不是一个组件库，而是一个学习、交流和参考的资源库，帮助开发者快速上手 Vue 3 + Element Plus 的开发模式，提升开发效率。项目不一定全部都是 Element Plus 的封装，也会涉及一些第三方库的集成使用，但宗旨是紧扣实际业务、以业务为导向。

项目也会参考并收集社区中一些优秀的业务领域组件分享文章和开源的 Admin 项目中提供的实用组件进行整合和演示。

## 项目起源

项目最初是在作者实际工作开发过程中使用 portal-vue 进行组件封装时，发现其功能非常强大，灵活度极高，对一些复杂的业务组件（即**超级组件**）的开发非常友好，认为这是一种打破传统 Vue 组件开发模式的新思路和方向，因此决定分享出来，帮助更多的开发者了解和使用这种开发模式。

截止项目发布时，在国内各大内容分享平台（如掘金和知乎）并没有找到相关深入应用的分享文章，于是萌生了分享的想法。

最开始以一个极其常见的对话框组件（基于 `<el-dialog>`）封装作为第一个分享的组件并寄宿在开源项目 [vue-vben-admin](https://github.com/vbenjs/vue-vben-admin) （进行 Fork 后发布为 [vben-business-components](https://github.com/xjxl520303/vben-business-components)）中。因为 Vben Admin 过于复杂，很多内容是不需要的，二次分享有很多原项目相关的 Git 记录需要清理，所以最终决定自己重新搭建，但是又在搭建过程中会遇到很多问题，在尝试一番后放弃了（时间和精力不够，毕竟处于失业状态）。

现在的项目是基于 [vue3-turbo-component-lib-template](https://github.com/huangmingfu/vue3-turbo-component-lib-template) 进行修改的。感谢作者的付出，让我能专注于组件的分享，而不用关心项目搭建。因为项目的目的在于分享业务组件的封装并不是为了发布成为一个可被别的项目使用的 NPM 包（业务组件库会涉及大量第三方依赖并不适合单独发布），因此删除了原项目中相关的功能，只保留了文档部分的功能并在此基础上不断完善功能。

在完成最初的对话框功能与文档后，由于没有时间去撰写相关的推文去社区推广，于是通过 AI 根据项目内容生成了一篇名为 《[🚀 这个 ElDialog 封装方案，让我的代码量减少了 80%](https://juejin.cn/post/7589513539845898275)》的掘金文章，并引起了部分读者的关注。这里特别感谢用户 [前端开发yin](https://juejin.cn/user/4230576472077511)，提出了“**关闭后就直接销毁了, 有办法不销毁只是隐藏吗?**”的问题，促使组件功能日趋完善。

## 项目特殊说明

项目的目的在于分享基于 Element Plus 的业务组件封装示例，因此并没有提供基于 `@vue/repl` 的演练场（Playground）。因为每个组件并没有单独打包，简单的组件可以通过 `@vue/repl` 的 `useStore()` 导出的 `setFiles()` 来设置示例代码，但是复杂的组件就涉及太多的文件要配置，而且关联的第三方库要么直接通过 `<Repl />` 的 `previewOptions` 在 Iframe 头部引入，要么动态的通过 `importMap` 来配置。此外，文档中集成 `@vue/repl` 有一个问题，就是依赖的外部库加载比较慢，不如 Vitepress 的演示环境方便，只不过不能实时编辑。

<!-- <preview path="@/ui/button/basic.vue" /> -->

```vue twoslash
<script setup>
import { onMounted, ref } from 'vue';

// reactive state
const count = ref(0);

/*
 * functions that mutate state and trigger updates
 */
function increment() {
  count.value++;
}

onMounted(() => {
  console.log(`The initial count is ${count.value}.`);
});
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```
