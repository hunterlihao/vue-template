<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElNotification, type FormInstance } from 'element-plus';
//引入获取当前时间的函数
import { getTime } from '@/utils/time';
//引入用户相关的小仓库
import { useUserStore } from '@/store/modules/user.ts';
//引入标签页仓库
import { useTabsStore } from '@/store/modules/tabs.ts';
//引入登录表单校验规则
import { loginRules } from './utils/rule';
import { getCaptchaApi, loginApi } from '@/api/user';

const { setUserId, setNickName, setToken, setAvatar } = useUserStore(); //获取el-form组件
const tabsStore = useTabsStore();
// el-form 实例
const loginForms = ref<FormInstance>();
// 提交中标记:防止重复点击/回车重复提交
const submitting = ref(false);
//获取路由器
const $router = useRouter();
//路由对象
const $route = useRoute();

//收集账号与密码的数据(演示账号,方便直接体验;接真实后端时请清空)
const loginForm = reactive({
  username: 'admin',
  password: '123456',
  captchaKey: '',
  captchaCode: '',
});
// 验证码数据
const captcha = ref({
  image: '',
  key: '',
});
onMounted(() => {
  getCaptcha();
});
// 获取验证码
const getCaptcha = async () => {
  const res = await getCaptchaApi();
  if (res && res.code === 200) {
    captcha.value.image = res.data.image;
    captcha.value.key = res.data.key;
    loginForm.captchaKey = res.data.key;
  }
};

//登录按钮回调
const login = async () => {
  if (submitting.value) return;
  //保证全部表单项校验通过再发请求(校验失败时 validate 会 reject)
  const valid = await loginForms.value?.validate().catch(() => false);
  if (!valid) return;

  submitting.value = true;
  try {
    const res = await loginApi(loginForm);
    if (res && res.code === 200) {
      // 清除之前的标签页状态
      tabsStore.closeAllTabs();

      // 设置用户信息:setToken 内部会写入本地存储,持久化由 store 的 persist 负责
      setUserId(res.data.userId);
      setNickName(res.data.nickName);
      setToken(res.data.token);
      setAvatar(res.data.avatarUrl);

      const redirect = $route.query.redirect as string | undefined;
      await $router.push({ path: redirect || '/' });

      //登录成功提示信息
      ElNotification({
        type: 'success',
        message: '欢迎回来',
        title: `HI,${getTime()}好`,
      });
    }
  } finally {
    submitting.value = false;
  }
};

// 添加回车事件处理函数
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    login();
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
        @keydown="handleKeyDown"
      >
        <div class="form_header">
          <h1>登录</h1>
          <h2>SYSTEM MANAGEMENT</h2>
        </div>
        <el-form-item class="form_item" prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="User"
            aria-label="用户名"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item class="form_item" prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="Lock"
            aria-label="密码"
            placeholder="请输入密码"
            show-password
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="form_item" prop="captchaCode">
          <el-input
            v-model.trim="loginForm.captchaCode"
            prefix-icon="Key"
            aria-label="验证码"
            autocomplete="off"
            placeholder="请输入验证码"
          >
            <template #append>
              <div
                class="captcha-container"
                role="button"
                tabindex="0"
                title="点击刷新验证码"
                @click="getCaptcha"
                @keydown.enter="getCaptcha"
              >
                <img :src="captcha.image" alt="验证码" class="captcha-img" />
              </div>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item class="form_item">
          <el-button
            class="login_btn"
            size="default"
            type="primary"
            :loading="submitting"
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
@use './utils/index' as *;
</style>
