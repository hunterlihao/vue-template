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
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/styles/variable.scss";',
        },
      },
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
