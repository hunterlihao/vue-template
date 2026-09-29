import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
import { viteMockServe } from 'vite-plugin-mock';

export default defineConfig({
  plugins: [
    vue(),
    viteMockServe({
      // mock 文件目录
      mockPath: 'mock',
      // 以 _ 开头的文件是共享数据/工具,不注册成 mock 路由
      ignore: /^_/,
      // 开启本地 mock(只在 dev server 生效,不会影响 build)
      enable: true,
      logger: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // scss全局变量配置
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/variable.scss";',
      },
    },
  },
  server: {
    allowedHosts: true,
    open: true,
    hmr: true,
    host: '0.0.0.0',
    port: 5050,
    // 添加代理配置
    proxy: {
      '/api': {
        target: process.env.VITE_SERVER || 'http://localhost:8100',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});
