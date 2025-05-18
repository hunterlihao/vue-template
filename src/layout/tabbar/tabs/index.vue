<script setup lang="ts">
import { computed, watch, ref, h } from 'vue';
import { useTabsStore } from '@/store/modules/tabs';
import { useRoute, useRouter } from 'vue-router';
import { useLayOutSettingStore } from '@/store/modules/setting';
import {
  Menu,
  FolderRemove,
  Close,
  FolderDelete,
  HomeFilled,
  Monitor,
  User,
  Goods,
  Platform,
  Setting,
  RefreshRight,
} from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const tabsStore = useTabsStore();
const layOutSettingStore = useLayOutSettingStore();

// 获取标签页列表
const tabsList = computed(() => tabsStore.tabsList);

// 固定的首页标签
const homeTab = computed(() => {
  // 尝试从标签页列表中获取首页
  const existingHome = tabsList.value.find((tab) => tab.path === '/home');
  // 如果存在则返回，否则创建一个默认的首页对象
  return (
    existingHome || {
      path: '/home',
      meta: { title: '首页' },
    }
  );
});

// 除首页外的其他标签
const otherTabs = computed(() => {
  return tabsList.value.filter((tab) => tab.path !== '/home');
});

// 激活的标签页
const activeTab = ref(route.path);

// 监听路由变化
watch(
  () => route.path,
  (path) => {
    activeTab.value = path;
    tabsStore.addTab(route);
  },
  { immediate: true },
);

// 格式化标签文本，添加图标
const formatLabel = (item: any) => {
  // 图标映射
  const iconMap: { [key: string]: any } = {
    '/home': HomeFilled,
    '/screen': Platform,
    '/acl': Monitor,
    '/acl/user': User,
    '/acl/role': User,
    '/acl/permission': Setting,
    '/product': Goods,
  };

  // 默认图标组件
  const IconComponent = iconMap[item.path] || Setting;

  // 返回带图标的标签
  return h('div', { class: 'custom-tab-label' }, [
    h(IconComponent, { class: 'custom-tab-icon' }),
    h('span', {}, item.meta.title),
  ]);
};

// 点击标签页
const tabClick = (tab: any) => {
  const path = tab.props.name;
  if (path !== route.path) {
    router.push(path);
  }
};

// 关闭标签页
const removeTab = (targetPath: string) => {
  const path = tabsStore.closeTab(targetPath);
  if (targetPath === route.path) {
    router.push(path);
  }
};

// 刷新当前页面
const refreshCurrentPage = () => {
  // 切换刷新状态，触发main组件的监听器
  layOutSettingStore.refsh = !layOutSettingStore.refsh;
};

// 标签页操作
const tabsMenuHandle = (command: string) => {
  switch (command) {
    case 'refreshCurrentTab':
      // 刷新当前页面
      refreshCurrentPage();
      break;
    case 'closeCurrentTab':
      // 当前不是首页才能关闭
      if (route.path !== '/home') {
        const path = tabsStore.closeCurrentTab(route.path);
        router.push(path);
      }
      break;
    case 'closeOtherTabs':
      tabsStore.closeOtherTabs(route.path);
      break;
    case 'closeAllTabs':
      // 关闭所有后，自动回到首页
      tabsStore.closeAllTabs();
      router.push('/home');
      break;
  }
};
</script>
<template>
  <div class="tabs-box">
    <div class="tabs-menu">
      <el-tabs
        v-model="activeTab"
        type="card"
        @tab-click="tabClick"
        @tab-remove="removeTab"
      >
        <!-- 固定的首页标签，不可关闭 -->
        <el-tab-pane
          :key="'/home'"
          :label="formatLabel(homeTab)"
          name="/home"
          :closable="false"
        ></el-tab-pane>
        <!-- 动态标签页列表，可关闭 -->
        <el-tab-pane
          v-for="item in otherTabs"
          :key="item.path"
          :label="formatLabel(item)"
          :name="item.path"
          :closable="true"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div class="tabs-action">
      <el-dropdown @command="tabsMenuHandle" style="margin-right: 10px">
        <el-icon color="rgba(0, 0, 0, 0.65)" :size="20">
          <Menu />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="refreshCurrentTab">
              <el-icon :size="14"><RefreshRight /></el-icon>
              刷新当前
            </el-dropdown-item>
            <el-dropdown-item command="closeCurrentTab">
              <el-icon :size="14"><FolderRemove /></el-icon>
              关闭当前
            </el-dropdown-item>
            <el-dropdown-item command="closeOtherTabs">
              <el-icon :size="14"><Close /></el-icon>
              关闭其他
            </el-dropdown-item>
            <el-dropdown-item command="closeAllTabs">
              <el-icon :size="14"><FolderDelete /></el-icon>
              关闭所有
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'index';
</style>
