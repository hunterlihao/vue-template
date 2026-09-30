export type Tab = {
  title: string;
  path: string;
};

// 定义state类型
export type TabState = {
  tabsList: Tab[];
};

// 定义返回值类型:后端统一响应结构
// 默认 T = unknown:调用方要用 data 就必须声明它是什么,避免"无脑 any"。
export interface Result<T = unknown> {
  code: number;
  message: string;
  data: T;
}

/** 分页返回结构 */
export interface PageResult<T> {
  records: T[];
  total: number;
}

/**
 * 列表查询参数。
 * 之前在 4 个 api 模块的 type.ts 里各复制了一份 { params, current, size, total };
 * 现在统一到这里,并用泛型承载关键字之外的筛选条件。
 */
export interface PageParm<TFilter = Record<string, never>> {
  current: number;
  size: number;
  total: number;
  /** 关键字 */
  params: string;
  /** 额外筛选条件(默认空对象) */
  filter: TFilter;
}

// 通用弹窗的 props
export interface DialogProps {
  title?: string;
  visible?: boolean;
  /** 宽度:数字按 px 处理,字符串(如 '60%')原样使用 */
  width?: number | string;
  /** 确定按钮的 loading 状态 */
  loading?: boolean;
}

/** 弹窗的内部状态(内容区高度自适应,无需调用方指定) */
export type DialogModel = {
  title: string;
  visible: boolean;
  width: number | string;
};

/** 挂到 app.config.globalProperties 上的方法(见 main.ts) */
declare module 'vue' {
  interface ComponentCustomProperties {
    /** 二次确认,返回是否点了确定 */
    $myConfirm: (text: string, title?: string) => Promise<boolean>;
  }
}

export {};
