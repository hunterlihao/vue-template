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
      enable: true,
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
    allowedHosts : true,
    open: true
  }
});
