import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

// 引入svg插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
// https://vite.dev/config/
import path from 'path';
import { viteMockServe } from 'vite-plugin-mock';

export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // 使用的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // 需要转换的图标名称
      symbolId: 'icon-[dir]-[name]',
    }),
    viteMockServe({
      // default
      mockPath: 'mock',
      enable: false,
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
