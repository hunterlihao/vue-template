import { getCurrentInstance } from 'vue';

/**
 * 取当前组件实例上的全局属性(主要是 main.ts 挂的 $myConfirm)。
 * getCurrentInstance 在 setup 之外会返回 null,这里直接报错而不是靠类型断言蒙过去。
 */
export default function useInstance() {
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error('useInstance 必须在 setup 中调用');
  }
  return {
    global: instance.appContext.config.globalProperties,
    proxy: instance.proxy,
  };
}
