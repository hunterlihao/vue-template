<script lang="ts" setup>
//import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
//获取用户相关的小仓库
import { useUserStore } from '@/store/modules/user';
//获取骨架的小仓库
import { useLayOutSettingStore } from '@/store/modules/setting';
import { ElMessage } from 'element-plus';
import useInstance from '@/hocks/useInstance.ts';
//获取标签页仓库
import { useTabsStore } from '@/store/modules/tabs.ts';
//获取菜单仓库
import { useMenuStore } from '@/store/modules/menu/index.ts';
import router from '@/router/index.ts';

//获取全局global
const { global } = useInstance();
const layoutSettingStore = useLayOutSettingStore();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const menuStore = useMenuStore();
//获取路由器对象
const $router = useRouter();
//获取路由对向
const $route = useRoute();
//收集开关的数据
// const dark = ref<boolean>(false);
//刷新按钮点击回调
const updateRefsh = () => {
  layoutSettingStore.refsh = !layoutSettingStore.refsh;
};
//全屏按钮点击的回调
const fullScreen = () => {
  //DOM对象的一个属性:可以用来判断当前是不是全屏模式[全屏:true,不是全屏:false]
  const full = document.fullscreenElement;
  //切换为全屏模式
  if (!full) {
    //文档根节点的方法requestFullscreen,实现全屏模式
    document.documentElement.requestFullscreen();
  } else {
    //变为不是全屏模式->退出全屏模式
    document.exitFullscreen();
  }
};
//退出登录点击回调
const logout = async () => {
  const confirm = await global.$myConfirm('确定要退出登录吗？');
  //第一件事情:需要向服务器发请求[退出登录接口]******
  //第二件事情:仓库当中关于用于相关的数据清空[token|username|avatar]
  //第三件事情:跳转到登录页面
  if (confirm) {
    await userStore.logout();
    // 清除标签页状态
    tabsStore.closeAllTabs();
    // 清除菜单路由状态
    menuStore.clearMenuRoutes();
    ElMessage.success('退出登录成功');
    //跳转到登录页面，退出登录后不需要携带redirect参数
    await $router.push({ path: '/login' });
  }
};
</script>

<script lang="ts">
export default {
  name: 'Setting',
};
</script>
<template>
  <el-button circle icon="Refresh" @click="updateRefsh"></el-button>
  <el-button circle icon="FullScreen" @click="fullScreen"></el-button>
  <img
    :src="userStore.avatarUrl"
    style="width: 28px; height: 28px; margin: 0 10px; border-radius: 50%"
  />
  <!-- 下拉菜单 -->
  <el-dropdown placement="top" style="margin-right: 10px">
    <el-button link>{{ userStore.nickName }}</el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item icon="SwitchButton" @click="logout">
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!--
  <el-popover :width="300" placement="bottom" title="主题设置" trigger="hover">
    &lt;!&ndash; 表单元素 &ndash;&gt;
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          v-model="color"
          :predefine="predefineColors"
          show-alpha
          size="small"
          @change="setColor"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          v-model="dark"
          active-icon="MoonNight"
          class="mt-2"
          inactive-icon="Sunny"
          inline-prompt
          style="margin-left: 24px"
          @change="changeDark"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button circle icon="Setting"></el-button>
    </template>
  </el-popover>
--></template>

<style lang="scss" scoped></style>
