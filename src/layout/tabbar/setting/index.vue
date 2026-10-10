<script lang="ts" setup>
import { useRouter } from 'vue-router';
//获取用户相关的小仓库
import { useUserStore } from '@/store/modules/user';
//获取骨架的小仓库
import { useLayOutSettingStore } from '@/store/modules/setting';
import { ElMessage } from 'element-plus';
import useInstance from '@/hooks/useInstance.ts';
//获取标签页仓库
import { useTabsStore } from '@/store/modules/tabs.ts';
import UserAvatar from '@/components/UserAvatar/UserAvatar.vue';

defineOptions({ name: 'Setting' });

//获取全局global
const { global } = useInstance();
const layoutSettingStore = useLayOutSettingStore();
const userStore = useUserStore();
const tabsStore = useTabsStore();
//获取路由器对象
const $router = useRouter();
//刷新按钮点击回调
const updateRefsh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh;
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
  if (confirm) {
    // 清空用户数据(logout 内部会清状态、存储与动态路由,且不会抛异常)
    await userStore.logout();
    // 清除标签页状态
    tabsStore.closeAllTabs();
    ElMessage.success('退出登录成功');
    //跳转到登录页面，退出登录后不需要携带redirect参数
    await $router.push({ path: '/login' });
  }
};
</script>

<template>
  <el-button
    circle
    icon="Refresh"
    aria-label="刷新页面"
    title="刷新页面"
    @click="updateRefsh"
  ></el-button>
  <el-button
    circle
    icon="FullScreen"
    aria-label="全屏切换"
    title="全屏切换"
    @click="fullScreen"
  ></el-button>
  <UserAvatar :url="userStore.avatarUrl" :size="28" style="margin: 0 10px" />
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
</template>
