<script lang="ts" setup>
import { useRouter, type RouteRecordRaw } from 'vue-router';
import { iconOf } from '@/components/icons.ts';

// 递归组件需要名字(defineOptions 替代原来的 options API script 块)
defineOptions({ name: 'Menu' });

// 父组件传递过来的路由数组
const props = defineProps<{ menuList: RouteRecordRaw[] }>();

const router = useRouter();

/** 点击菜单的回调 */
const goRoute = (path: string) => {
  router.push(path);
};

/** 可见的子路由(hidden 的不参与展示) */
const visibleChildren = (route: RouteRecordRaw) =>
  (route.children ?? []).filter((child) => !child.meta?.hidden);

/** 菜单图标:未登记的图标会回落到默认图标,避免渲染空白 */
const menuIcon = (name?: string) => iconOf(name);
</script>

<template>
  <template v-for="item in props.menuList" :key="item.path">
    <!--没有子路由-->
    <el-menu-item
      v-if="!item.children && !item.meta?.hidden"
      :index="item.path"
      @click="goRoute(item.path)"
    >
      <el-icon>
        <component :is="menuIcon(item.meta?.icon)" />
      </el-icon>
      <template #title>
        <span>{{ item.meta?.title }}</span>
      </template>
    </el-menu-item>
    <!-- 有子路由但是只有一个可见子路由:直接展示这个子路由 -->
    <el-menu-item
      v-else-if="visibleChildren(item).length === 1"
      :index="visibleChildren(item)[0].path"
      @click="goRoute(visibleChildren(item)[0].path)"
    >
      <el-icon>
        <component :is="menuIcon(visibleChildren(item)[0].meta?.icon)" />
      </el-icon>
      <template #title>
        <span>{{ visibleChildren(item)[0].meta?.title }}</span>
      </template>
    </el-menu-item>
    <!-- 有多个子路由:递归渲染 -->
    <el-sub-menu
      v-else-if="visibleChildren(item).length > 1"
      :index="item.path"
    >
      <template #title>
        <el-icon>
          <component :is="menuIcon(item.meta?.icon)" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <Menu :menuList="item.children ?? []"></Menu>
    </el-sub-menu>
  </template>
</template>
