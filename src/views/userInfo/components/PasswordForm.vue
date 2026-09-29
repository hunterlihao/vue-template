<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage, type FormInstance } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user.ts';
import type { UpdatePwd } from '@/api/user/type.ts';
import { updatePasswordApi } from '@/api/user';
import { confirmPasswordRules, required } from '@/const/rules';

const userStore = useUserStore();
const $router = useRouter();

// 表单 ref 与绑定对象
const passwordRef = ref<FormInstance>();
const passwordModel = reactive<UpdatePwd & { checkPassword: string }>({
  userId: userStore.getUserId,
  oldPassword: '',
  password: '',
  checkPassword: '',
});

// 表单校验规则(公共规则见 @/const/rules)
const passwordFormRules = reactive({
  oldPassword: required('请输入原密码'),
  password: required('请输入新密码'),
  checkPassword: confirmPasswordRules(() => passwordModel.password),
});

// 重置密码表单
const resetPasswordForm = () => {
  Object.assign(passwordModel, {
    userId: passwordModel.userId,
    oldPassword: '',
    password: '',
    checkPassword: '',
  });
  passwordRef.value?.resetFields();
};

// 提交密码修改
const submitPassword = () => {
  passwordRef.value?.validate(async (valid) => {
    if (!valid) return;
    const res = await updatePasswordApi(passwordModel);
    if (res && res.code === 200) {
      ElMessage.success('密码修改成功，即将退出登录重新登录');
      resetPasswordForm();

      // 延迟1秒后退出登录
      setTimeout(async () => {
        await userStore.logout();
        await $router.push('/login');
      }, 1000);
    }
  });
};
</script>

<template>
  <el-row justify="center">
    <el-col :span="12">
      <el-card shadow="always">
        <template #header>
          <div class="card-header">
            <el-icon><Lock /></el-icon>
            <span>修改密码</span>
          </div>
        </template>
        <el-form
          :model="passwordModel"
          ref="passwordRef"
          :rules="passwordFormRules"
          label-width="120px"
          size="default"
          label-position="right"
        >
          <el-row justify="center">
            <el-col :span="20">
              <el-form-item label="原密码:" prop="oldPassword">
                <el-input
                  type="password"
                  v-model="passwordModel.oldPassword"
                  show-password
                  placeholder="请输入原密码"
                  prefix-icon="Lock"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row justify="center">
            <el-col :span="20">
              <el-form-item label="新密码:" prop="password">
                <el-input
                  type="password"
                  v-model="passwordModel.password"
                  show-password
                  placeholder="请输入新密码"
                  prefix-icon="Unlock"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row justify="center">
            <el-col :span="20">
              <el-form-item label="确认密码:" prop="checkPassword">
                <el-input
                  type="password"
                  v-model="passwordModel.checkPassword"
                  show-password
                  placeholder="请再次输入新密码"
                  prefix-icon="Key"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row justify="center">
            <el-col :span="20" style="text-align: center">
              <el-button type="primary" @click="submitPassword" icon="Edit">
                修改密码
              </el-button>
              <el-button @click="resetPasswordForm" icon="Refresh">
                重置
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.card-header {
  font-weight: bold;
  font-size: 16px;
}
</style>
