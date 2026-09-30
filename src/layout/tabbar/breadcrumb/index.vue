<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { Expand, Fold } from '@element-plus/icons-vue';
import { useLayOutSettingStore } from '@/store/modules/setting';
import { iconOf } from '@/components/icons.ts';

defineOptions({ name: 'Breadcrumb' });

const layoutSettingStore = useLayOutSettingStore();
const $route = useRoute();

/** 折叠 / 展开侧边栏 */
const toggleFold = () => {
  layoutSettingStore.fold = !layoutSettingStore.fold;
};
</script>

<template>
  <!-- 顶部左侧:折叠按钮(用 button 而不是可点击的图标,键盘也能操作) -->
  <el-button
    link
    class="fold-btn"
    :aria-label="layoutSettingStore.fold ? '展开侧边栏' : '收起侧边栏'"
    :title="layoutSettingStore.fold ? '展开侧边栏' : '收起侧边栏'"
    @click="toggleFold"
  >
    <el-icon :size="22">
      <component :is="layoutSettingStore.fold ? Expand : Fold" />
    </el-icon>
  </el-button>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 面包动态展示路由名字与标题 -->
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      v-show="item.meta.title"
      :key="index"
    >
      <span class="breadcrumb-item">
        <el-icon v-if="item.meta.icon" :size="20">
          <component :is="iconOf(item.meta.icon)" />
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.fold-btn {
  margin-right: 10px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  font-size: 20px;

  span {
    margin-left: 5px;
  }
}
</style>
