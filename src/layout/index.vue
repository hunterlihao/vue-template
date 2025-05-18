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
    <div
      :class="{ fold: LayOutSettingStore.fold ? true : false }"
      class="layout_slider"
    >
      <Logo />
      <!-- 滚动样式 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          :collapse="LayOutSettingStore.fold ? true : false"
          :default-active="$route.path"
          background-color="#ffffff"
          text-color="black"
        >
          <!-- 根据路由动态生成菜单 -->
          <Menu :menuList="useStore.menuRouters"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!--  顶部导航  -->
    <div
      :class="{ fold: LayOutSettingStore.fold ? true : false }"
      class="layout_tabbar"
    >
      <Tabbar></Tabbar>
    </div>
    <!--  内容区域  -->
    <div
      :class="{ fold: LayOutSettingStore.fold ? true : false }"
      class="layout_main"
    >
      <Main></Main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-background;
    transition: all 0.3s;

    .scrollbar {
      width: $base-menu-width;
      height: calc(100vh - $base-menu-logo-height);

      .em-menu {
        border-right: none;
      }
    }

    &.fold {
      width: $base-menu-min-width;
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    background-color: white;
    top: 0px;
    left: $base-menu-width;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    background-color: #ffffff;
    top: $base-tabbar-height;
    left: $base-menu-width;
    padding: 10px;
    overflow: auto;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
