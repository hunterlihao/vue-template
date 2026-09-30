/// <reference types="vite/client" />

/** 项目环境变量的类型(见 .env.example) */
interface ImportMetaEnv {
  /** 应用标题 */
  readonly VITE_APP_TITLE: string;
  /** 接口基础路径 */
  readonly VITE_APP_BASE_API: string;
  /** 是否启用本地 mock:'true' / 'false' */
  readonly VITE_APP_USE_MOCK: string;
  /** 真实后端地址(仅开发代理使用) */
  readonly VITE_SERVER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
