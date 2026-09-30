<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage, type FormInstance } from 'element-plus';
import { useUserStore } from '@/store/modules/user.ts';
import type { SysUser } from '@/api/user/type.ts';
import { getCurrentUserInfoApi, updateCurrentUserInfoApi } from '@/api/user';
import { emailRules, nickNameRules, phoneRules, sexRules } from '@/const/rules';
import AvatarUpload from './AvatarUpload.vue';

const userStore = useUserStore();

// 表单 ref 与绑定对象
const userInfoRef = ref<FormInstance>();
const userInfoModel = reactive<SysUser>({
  userId: '',
  username: '',
  password: '',
  phone: '',
  email: '',
  sex: '',
  nickName: '',
  roleId: '',
});

// 表单校验规则(公共规则见 @/const/rules)
const userInfoRules = reactive({
  nickName: nickNameRules,
  sex: sexRules,
  phone: phoneRules,
  email: emailRules,
});

// 获取当前用户信息
const getCurrentUserInfo = async () => {
  const userId = userStore.getUserId;
  if (!userId) return;
  const res = await getCurrentUserInfoApi(userId);
  if (res && res.code === 200) {
    Object.assign(userInfoModel, res.data);
  }
};

// 提交用户信息
const submitUserInfo = () => {
  userInfoRef.value?.validate(async (valid) => {
    if (!valid) return;
    const res = await updateCurrentUserInfoApi(userInfoModel);
    if (res && res.code === 200) {
      ElMessage.success('用户信息更新成功');
      // 更新仓库即可:持久化由 pinia 的 persist 插件负责,不再手工读写 localStorage
      userStore.setNickName(userInfoModel.nickName);
      userStore.setAvatar(userInfoModel.avatarUrl || '');
    }
  });
};

onMounted(getCurrentUserInfo);
</script>

<template>
  <el-row :gutter="20">
    <!-- 头像区域 -->
    <el-col :span="8">
      <AvatarUpload v-model:url="userInfoModel.avatarUrl" />
    </el-col>

    <!-- 用户信息表单 -->
    <el-col :span="16">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>个人信息</span>
          </div>
        </template>
        <el-form
          :model="userInfoModel"
          ref="userInfoRef"
          :rules="userInfoRules"
          label-width="100px"
          :inline="false"
          size="default"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="姓名:" prop="nickName">
                <el-input v-model="userInfoModel.nickName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别:" prop="sex">
                <el-radio-group v-model="userInfoModel.sex">
                  <el-radio :value="0">男</el-radio>
                  <el-radio :value="1">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="手机号:" prop="phone">
                <el-input v-model="userInfoModel.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱:" prop="email">
                <el-input v-model="userInfoModel.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="账户:">
                <el-input v-model="userInfoModel.username" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item>
            <el-button type="primary" @click="submitUserInfo">
              保存信息
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.card-header {
  font-size: 16px;
  font-weight: bold;
}
</style>
