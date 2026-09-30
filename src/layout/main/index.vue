<script lang="ts" setup>
import { watch, ref, nextTick } from 'vue';
import { useLayOutSettingStore } from '@/store/modules/setting';

defineOptions({ name: 'Main' });

const layOutSettingStore = useLayOutSettingStore();
//控制当前组件是否销毁重建
const flag = ref(true);
//监听仓库内部数据是否发生变化,如果发生变化，说明用户点击过刷新按钮
watch(
  () => layOutSettingStore.refresh,
  () => {
    //点击刷新按钮:路由组件销毁
    flag.value = false;
    nextTick(() => {
      flag.value = true;
    });
  },
);
</script>

<template>
  <!-- 路由组件出口的位置 -->
  <router-view v-slot="{ Component }">
    <!-- 直接渲染,不做切换动画 -->
    <component :is="Component" v-if="flag" />
  </router-view>
</template>
