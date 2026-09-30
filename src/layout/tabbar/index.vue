<script lang="ts" setup>
import Breadcrumb from '@/layout/tabbar/breadcrumb/index.vue';
import Setting from '@/layout/tabbar/setting/index.vue';
</script>

<script lang="ts">
export default {
  name: 'Tabbar',
};
</script>

<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <!--  顶部左侧静态 -->
      <Breadcrumb></Breadcrumb>
    </div>
    <div class="tabbar_right">
      <!-- 顶部右侧静态 -->
      <Setting></Setting>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tabbar {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;

  .tabbar_left {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }

  .tabbar_right {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
}
</style>
