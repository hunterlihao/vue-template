<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { ElNotification } from 'element-plus';
import { reqGetCode } from '@/api/user';
import { registerRules } from '../utils/rule';

// 获取el-form组件
const registerForms = ref();
// 定义变量控制按钮加载效果
const loading = ref(false);

// 收集注册数据
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  captchaKey: '',
  captchaCode: '',
});

// 动态生成注册表单校验规则
const dynamicRegisterRules = registerRules(registerForm);

// 验证码数据
const captcha = ref({
  image: '',
  key: '',
});

// 获取验证码
const getCaptcha = async () => {
  try {
    const result = await reqGetCode();
    captcha.value.image = result.data.image;
    captcha.value.key = result.data.key;
    registerForm.captchaKey = result.data.key;
  } catch (error) {
    console.log(error);
  }
};

// 初始获取验证码
getCaptcha();

// 注册按钮回调
const register = async () => {
  // 保证全部表单校验通过再发请求
  await registerForms.value.validate();
  // 加载效果:开始加载
  loading.value = true;

  try {
    // 这里应该调用注册API，目前仅做演示
    // await useStore.register(registerForm);

    // 注册成功提示
    ElNotification({
      type: 'success',
      message: '注册成功，请登录',
      title: '注册成功',
    });

    // 触发切换到登录页面
    emit('switchMode', 'login');

    // 注册成功加载效果消失
    loading.value = false;
  } catch (error) {
    // 注册失败加载效果消失
    loading.value = false;
    // 注册失败提示信息
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    });
  }
};

// 定义事件
const emit = defineEmits(['switchMode']);

// 切换到登录页面
const switchToLogin = () => {
  emit('switchMode', 'login');
};
</script>

<template>
  <el-form
    ref="registerForms"
    :model="registerForm"
    :rules="dynamicRegisterRules"
    class="register_form"
  >
    <div class="form_header">
      <h1>注册</h1>
      <h2>创建您的账户</h2>
    </div>
    <el-form-item class="form_item" prop="username">
      <el-input
        v-model="registerForm.username"
        prefix-icon="User"
        placeholder="请输入用户名"
      ></el-input>
    </el-form-item>
    <el-form-item class="form_item" prop="password">
      <el-input
        v-model="registerForm.password"
        prefix-icon="Lock"
        placeholder="请输入密码"
        show-password
        type="password"
      ></el-input>
    </el-form-item>
    <el-form-item class="form_item" prop="confirmPassword">
      <el-input
        v-model="registerForm.confirmPassword"
        prefix-icon="Lock"
        placeholder="请确认密码"
        show-password
        type="password"
      ></el-input>
    </el-form-item>
    <el-form-item class="form_item" prop="captchaCode">
      <el-input
        v-model.trim="registerForm.captchaCode"
        prefix-icon="Key"
        autocomplete="off"
        placeholder="请输入验证码"
      >
        <template #append>
          <div class="captcha-container" @click="getCaptcha">
            <img :src="captcha.image" alt="验证码" class="captcha-img" />
          </div>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="form_item">
      <el-button
        :loading="loading"
        class="register_btn"
        size="default"
        type="primary"
        @click="register"
      >
        注册
      </el-button>
    </el-form-item>
    <div class="form_footer">
      <span>已有账号？</span>
      <a href="javascript:" @click="switchToLogin">登录</a>
    </div>
  </el-form>
</template>

<style lang="scss" scoped>
@import '../utils/index';
@import 'index';
</style>
