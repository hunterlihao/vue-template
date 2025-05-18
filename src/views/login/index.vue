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
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/back.jpeg') no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(2px);
    z-index: 1;
  }

  .login_form_wrapper {
    z-index: 2;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login_form {
    position: relative;
    width: 450px;
    max-width: 90%;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px 50px;
    border-radius: 12px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
    z-index: 2;
    animation: fadeIn 0.8s ease-out;
    transform: translateY(0);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    }

    .form_header {
      margin-bottom: 30px;

      h1 {
        color: white;
        font-size: 42px;
        text-align: center;
        margin-bottom: 10px;
        font-weight: 600;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      h2 {
        font-size: 18px;
        color: rgba(255, 255, 255, 0.9);
        margin: 15px 0 0;
        text-align: center;
        font-weight: 400;
        letter-spacing: 0.5px;
      }
    }

    .form_item {
      margin-bottom: 25px;
      opacity: 0;
      animation: slideUp 0.5s ease forwards;

      &:nth-child(2) {
        animation-delay: 0.1s;
      }

      &:nth-child(3) {
        animation-delay: 0.2s;
      }

      &:nth-child(4) {
        animation-delay: 0.3s;
      }
    }

    .el-input {
      --el-input-bg-color: rgba(255, 255, 255, 0.15);
      --el-input-border-color: rgba(255, 255, 255, 0.2);
      --el-input-hover-border-color: rgba(255, 255, 255, 0.4);
      --el-input-focus-border-color: rgba(255, 255, 255, 0.6);
      --el-input-text-color: rgba(255, 255, 255, 0.9);
      --el-input-placeholder-color: rgba(255, 255, 255, 0.6);

      :deep(.el-input__wrapper) {
        box-shadow: 0 0 0 1px var(--el-input-border-color);
        border-radius: 8px;
        padding: 0 15px;
        transition: all 0.3s ease;

        &:hover {
          box-shadow: 0 0 0 1px var(--el-input-hover-border-color);
        }

        &.is-focus {
          box-shadow: 0 0 0 1px var(--el-input-focus-border-color);
        }
      }

      :deep(.el-input__inner) {
        height: 45px;
        color: var(--el-input-text-color);

        &::placeholder {
          color: var(--el-input-placeholder-color);
        }
      }

      :deep(.el-input__icon) {
        color: rgba(255, 255, 255, 0.7);
        font-size: 18px;
      }
    }

    .login_btn {
      width: 100%;
      height: 45px;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 1px;
      border-radius: 8px;
      margin-top: 10px;
      background: linear-gradient(135deg, #42b983, #33a06f);
      border: none;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(66, 185, 131, 0.4);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
