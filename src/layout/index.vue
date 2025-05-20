<script lang="ts" setup>
//获取路由对象
import { useRoute } from 'vue-router';
import { useLayOutSettingStore } from '@/store/modules/setting';
// 引入左侧菜单logo组件
import Logo from '@/layout/lago/index.vue';
// 引入动态菜单组件
import Menu from '@/layout/menu/index.vue';
// 引入内容区域组件
import Main from '@/layout/main/index.vue';
// 引入顶部导航栏组件
import Tabbar from '@/layout/tabbar/index.vue';
// 引入标签组件
import Tabs from '@/layout/tabbar/tabs/index.vue';
// 获取用户相关的仓库
import { useUserStore } from '@/store/modules/user.ts';

const $route = useRoute();
// 引入布局设置仓库
const LayOutSettingStore = useLayOutSettingStore();

const useStore = useUserStore();
</script>

<script lang="ts">
export default {
  name: 'Layout',
};
</script>
<template>
  <div class="layout_container">
    <!--  左侧菜单  -->
    <div :class="{ fold: !!LayOutSettingStore.fold }" class="layout_slider">
      <Logo />
      <!-- 滚动样式 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          :collapse="!!LayOutSettingStore.fold"
          :default-active="$route.path"
          background-color="#ffffff"
          text-color="black"
        >
          <!-- 根据路由动态生成菜单 -->
          <Menu :menuList="useStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!--  顶部导航区域  -->
    <div :class="{ fold: !!LayOutSettingStore.fold }" class="layout_tabbar">
      <!-- 顶部导航栏 -->
      <Tabbar class="tabbar_component"></Tabbar>
      <!-- 标签栏 -->
      <Tabs class="tabs_component"></Tabs>
    </div>
    <!--  内容区域  -->
    <div :class="{ fold: !!LayOutSettingStore.fold }" class="layout_main">
      <Main></Main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'index';
</style>
