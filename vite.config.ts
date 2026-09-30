/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
import { viteMockServe } from 'vite-plugin-mock';

export default defineConfig(({ mode }) => {
  // 第三个参数传 '' 表示读取全部变量(不限 VITE_ 前缀,代理目标也需要)
  const env = loadEnv(mode, process.cwd(), '');
  // mock 开关由环境变量控制:纯前端演示为 true,接真实后端改成 false
  const useMock = env.VITE_APP_USE_MOCK === 'true';
  const serverUrl = env.VITE_SERVER || 'http://localhost:8100';
  // 单元测试不需要 mock 中间件(它持有开发服务器的 watcher,会让 vitest 无法退出)
  const isTest = mode === 'test';

  return {
    plugins: [
      vue(),
      ...(isTest
        ? []
        : [
            viteMockServe({
              // mock 文件目录
              mockPath: 'mock',
              // 以 _ 开头的文件是共享数据/工具,不注册成 mock 路由
              ignore: /^_/,
              // 只在开发环境按开关启用,生产构建不会包含 mock
              enable: useMock,
              logger: true,
            }),
          ]),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // scss全局变量配置
    // 用 @use ... as * 注入(Sass 已弃用 @import,@import 将在 Dart Sass 3.0 移除)
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/styles/variable.scss" as *;',
        },
      },
    },
    build: {
      // 产物按 vendor 拆分:第三方库不随业务代码变动,便于浏览器长期缓存
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia', 'pinia-plugin-persistedstate'],
            'element-plus': ['element-plus', '@element-plus/icons-vue'],
            echarts: [
              'echarts/core',
              'echarts/charts',
              'echarts/components',
              'echarts/renderers',
            ],
          },
        },
      },
      // element-plus / echarts 单个 vendor chunk 本身就接近 1MB,避免无意义告警
      chunkSizeWarningLimit: 1200,
    },
    server: {
      // 默认只监听本机;需要局域网/移动端调试时运行 `pnpm dev --host`
      host: '127.0.0.1',
      port: 5050,
      // 未被 mock 覆盖的 /api 请求转发到真实后端
      proxy: {
        '/api': {
          target: serverUrl,
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: 'node',
      include: ['src/**/__tests__/**/*.spec.ts'],
    },
  };
});
