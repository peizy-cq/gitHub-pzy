import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // base: '/peizy-cq/',//实际仓库名
  title: "gitHub-pzy",
  description: "前端搬砖人✨",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/javascript/closure' }, // 点击直接跳转到该分类的第一篇文章
      // { text: 'javascript', link: '/posts/javascript/closure' }
    ],

    sidebar: [
      {
        text: 'html', // 一级分类名
        collapsed: false, // 是否默认折叠，false 为默认展开
        items: [
          { text: '语义化标签', link: '/posts/html/语义化标签' },
        ]
      },
      {
        text: 'javascript',
        collapsed: false,
        items: [
          { text: '闭包', link: '/posts/javascript/closure' },
          { text: '原型链', link: '/posts/javascript/prototype' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
