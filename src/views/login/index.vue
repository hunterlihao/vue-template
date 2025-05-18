<script lang="ts" setup>
import { Lock, User } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
//引入获取当前时间的函数
import { getTime } from '@/utils/time';
//引入用户相关的小仓库
import { useUserStore } from '@/store/modules/user.ts';
//引入登录表单校验规则
import { loginRules } from './utils/rule';

const useStore = useUserStore();
//获取el-form组件
const loginForms = ref();
//获取路由器
const $router = useRouter();
//路由对象
const $route = useRoute();
//定义变量控制按钮加载效果
const loading = ref(false);
//收集账号与密码的数据
const loginForm = reactive({
  username: 'admin',
  password: '111111',
});
//登录按钮回调
const login = async () => {
  //保证全部表单相校验通过再发请求
  await loginForms.value.validate();
  //加载效果:开始加载
  loading.value = true;
  //点击登录按钮以后干什么?
  //通知仓库发登录请求
  //请求成功->首页展示数据的地方
  //请求失败->弹出登录失败信息
  try {
    //保证登录成功
    await useStore.login(loginForm);
    //编程式导航跳转到展示数据首页
    //判断登录的时候,路由路径当中是否有query参数，如果有就往query参数挑战，没有跳转到首页
    const redirect: any = $route.query.redirect;
    await $router.push({ path: redirect || '/' });
    //登录成功提示信息
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `HI,${getTime()}好`,
    });
    //登录成功加载效果也消失
    loading.value = false;
  } catch (error) {
    //登录失败加载效果消息
    loading.value = false;
    //登录失败的提示信息
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    });
  }
};
//定义表单校验需要配置对象
const rules = loginRules;
</script>

<template>
  <div class="login_container">
    <div class="login_form_wrapper">
      <!-- 登录的表单 -->
      <el-form
        ref="loginForms"
        :model="loginForm"
        :rules="rules"
        class="login_form"
      >
        <div class="form_header">
          <h1>登录</h1>
          <h2>欢迎来到后台管理系统</h2>
        </div>
        <el-form-item class="form_item" prop="username">
          <el-input
            v-model="loginForm.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item class="form_item" prop="password">
          <el-input
            v-model="loginForm.password"
            :prefix-icon="Lock"
            placeholder="请输入密码"
            show-password
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="form_item">
          <el-button
            :loading="loading"
            class="login_btn"
            size="default"
            type="primary"
            @click="login"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './utils/index';
</style>
