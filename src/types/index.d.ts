// 定义标签栏类型
export type Tab = {
  title: string;
  path: string;
};

// 定义state类型
export type TabState = {
  tabsList: Tab[];
};

// 定义返回值类型
export interface Result<T = any> {
  code: number;
  message: string;
  data: T;
}

// 定义参数类型
export interface DialogProps {
  title: string;
  visible: boolean;
  width: number;
  height: number;
}

export type DialogModel = {
  title: string;
  visible: boolean;
  width: number;
  height: number;
};
