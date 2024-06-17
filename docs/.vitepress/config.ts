import { defineConfig } from 'vitepress'
import pkg from '../../packages/rzpack/package.json'

export default defineConfig({
  title: 'rzpack',
  description: '一款基于Webpack5开发的React打包工具',
  lastUpdated: true,
  metaChunk: true,
  rewrites: {
    'pages/guide/getting-started.md': 'index.md',
    'pages/features.md': 'features.md',
    'pages/problems.md': 'problems.md',
    'pages/configs.md': 'configs.md',
    'pages/:category/:page.md': ':category/:page.md',
  },
  head: [['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }]],
  themeConfig: {
    logo: {
      src: '/logo.png',
      style: 'border-radius: 50%;height: 32px;width: 32px;',
    },
    darkModeSwitchLabel: '主题',
    darkModeSwitchTitle: '切换到深色模式',
    lightModeSwitchTitle: '切换到浅色模式',
    siteTitle: 'rzpack',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
            },
          },
        },
      },
    },
    nav: [
      {
        text: pkg.version,
        link: '/',
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/renzp94/rzpack' },
    ],
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    sidebar: [
      {
        text: '简介',
        items: [
          { text: '什么是rzpack?', link: '/guide/what-is' },
          { text: '快速开始', link: '/' },
          { text: '命令行界面', link: '/guide/cli' },
          { text: '项目结构', link: '/guide/project-structure' },
        ],
      },
      {
        text: '功能',
        link: '/features',
      },
      {
        text: '配置',
        link: '/configs',
      },
      {
        text: '常见问题',
        link: '/problems',
      },
    ],
    editLink: {
      pattern: 'https://github.com/renzp94/rzpack/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面',
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
    notFound: {
      title: '迷途',
      quote: '前方已是未知路，望君回头。',
      linkLabel: '回到首页',
      linkText: '回到首页',
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    outline: {
      label: '页面导航',
    },
  },
})
