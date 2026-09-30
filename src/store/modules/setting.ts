//小仓库:layout组件相关配置仓库
import { defineStore } from 'pinia';

export const useLayOutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, //用户控制菜单折叠还是收起控制
      refresh: false, //用于控制内容区刷新(refsh 拼写已修正)
    };
  },
});
