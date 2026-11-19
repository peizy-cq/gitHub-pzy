import { defineConfig } from 'vitepress'
import { memoirApiPlugin } from './memoir-api.mts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/gitHub-pzy/',//实际仓库名
  title: "gitHub-pzy",
  description: "前端搬砖人✨",
  // 回忆录的读写接口，仅开发期挂载（npm run docs:dev）
  vite: {
    plugins: [memoirApiPlugin()]
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/javascript/closure' }, // 点击直接跳转到该分类的第一篇文章
      // { text: '回忆录', link: '/posts/memoir/' },
      // { text: 'javascript', link: '/posts/javascript/closure' }
    ],

    // 按目录分菜单：文章页看 javascript，回忆录页看我的作品
    sidebar: {
      '/posts/javascript/': [
        {
          text: 'javascript',
          collapsed: false,
          items: [
            { text: '闭包', link: '/posts/javascript/closure' },
            { text: '原型链', link: '/posts/javascript/prototype' }
          ]
        }
      ],
      '/posts/memoir/': [
        {
          text: '我的作品',
          collapsed: false,
          items: [
            { text: '生活回忆录', link: '/posts/memoir/' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
