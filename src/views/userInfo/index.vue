<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage, type FormInstance, type UploadProps } from 'element-plus';
import { ElImageViewer } from 'element-plus';
import { useUserStore } from '@/store/modules/user.ts';
import type { SysUser, UpdatePwd } from '@/api/user/type.ts';
import {
  getCurrentUserInfoApi,
  updateCurrentUserInfoApi,
  updatePasswordApi,
} from '@/api/user';
import { UPLOAD_IMG_URL } from '@/api/file';
import {
  confirmPasswordRules,
  emailRules,
  nickNameRules,
  phoneRules,
  required,
  sexRules,
} from '@/const/rules';
import { useRouter } from 'vue-router';

//-----------------------------上面导入依赖---------------------------
//获取全局global
const userStore = useUserStore();
const $router = useRouter();

//表单ref属性
const userInfoRef = ref<FormInstance>();
const passwordRef = ref<FormInstance>();
const avatarRef = ref();

//表单绑定对象
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

//修改密码表单绑定对象
const passwordModel = reactive<UpdatePwd & { checkPassword: string }>({
  userId: '',
  oldPassword: '',
  password: '',
  checkPassword: '',
});

//头像上传相关
const avatarUrl = ref('');
const uploadHeaders = ref({
  token: '',
});

// 头像预览相关
const previewVisible = ref(false);
const previewImage = ref('');

// 显示头像预览
const showPreview = () => {
  if (avatarUrl.value) {
    previewImage.value = avatarUrl.value;
    previewVisible.value = true;
  }
};

// --------------------- 上面定义参数 下面定义方法--------------------
// 获取当前用户信息
const getCurrentUserInfo = async () => {
  const userId = userStore.getUserId;
  if (userId) {
    let res = await getCurrentUserInfoApi(userId);
    if (res && res.code === 200) {
      Object.assign(userInfoModel, res.data);
      avatarUrl.value = res.data.avatarUrl || '';
      passwordModel.userId = userId;
    }
  }
};

// 提交用户信息
const submitUserInfo = () => {
  userInfoRef.value?.validate(async (valid) => {
    if (valid) {
      // 更新用户信息
      let res = await updateCurrentUserInfoApi(userInfoModel);
      if (res && res.code === 200) {
        ElMessage.success('用户信息更新成功');
        // 更新用户仓库中的信息
        userStore.setNickName(userInfoModel.nickName);
        userStore.setAvatar(avatarUrl.value);

        // 更新本地存储的用户信息
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.nickName = userInfoModel.nickName;
        user.avatarUrl = avatarUrl.value;
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
  });
};

// 提交密码修改
const submitPassword = () => {
  passwordRef.value?.validate(async (valid) => {
    if (valid) {
      let res = await updatePasswordApi(passwordModel);
      if (res && res.code === 200) {
        ElMessage.success('密码修改成功，即将退出登录重新登录');
        // 重置表单
        Object.assign(passwordModel, {
          userId: passwordModel.userId,
          oldPassword: '',
          password: '',
          checkPassword: '',
        });
        passwordRef.value?.resetFields();

        // 延迟1秒后退出登录
        setTimeout(async () => {
          // 调用用户仓库中的退出登录方法
          await userStore.logout();

          // 跳转到登录页面
          await $router.push('/login');
        }, 1000);
      }
    }
  });
};

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

// 头像上传成功处理
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  if (response && response.code === 200) {
    avatarUrl.value = response.data;
    // 同时更新用户信息中的头像
    userInfoModel.avatarUrl = response.data;
  } else {
    ElMessage.error('头像上传失败');
  }
};

// 头像上传前处理
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('头像图片必须是 JPG 或 PNG 格式!');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像图片大小不能超过 2MB!');
    return false;
  }
  return true;
};

// 用户信息表单规则(公共规则见 @/const/rules)
const userInfoRules = reactive({
  nickName: nickNameRules,
  sex: sexRules,
  phone: phoneRules,
  email: emailRules,
});

// 修改密码表单规则
const passwordFormRules = reactive({
  oldPassword: required('请输入原密码'),
  password: required('请输入新密码'),
  checkPassword: confirmPasswordRules(() => passwordModel.password),
});

//挂载时操作
onMounted(() => {
  getCurrentUserInfo();
  // 设置上传头像的token
  uploadHeaders.value.token = userStore.getToken || '';
});
</script>

<template>
  <el-card>
    <el-tabs type="border-card">
      <!-- 用户信息标签页 -->
      <el-tab-pane label="基本信息">
        <el-row :gutter="20">
          <!-- 头像区域 -->
          <el-col :span="8">
            <el-card class="avatar-card">
              <div class="avatar-wrapper">
                <el-avatar
                  :size="120"
                  :src="avatarUrl || undefined"
                  @click="showPreview"
                  class="avatar-preview"
                />
                <div class="avatar-upload">
                  <el-upload
                    ref="avatarRef"
                    class="avatar-uploader"
                    :action="UPLOAD_IMG_URL"
                    :headers="uploadHeaders"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <el-button type="primary" size="small">更换头像</el-button>
                  </el-upload>
                </div>
              </div>
              <!-- 头像预览 -->
              <el-image-viewer
                v-if="previewVisible"
                :url-list="[previewImage]"
                @close="previewVisible = false"
              />
            </el-card>
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
                      <el-input
                        v-model="userInfoModel.username"
                        disabled
                      ></el-input>
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
      </el-tab-pane>

      <!-- 修改密码标签页 -->
      <el-tab-pane label="修改密码">
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
                    <el-button
                      type="primary"
                      @click="submitPassword"
                      icon="Edit"
                    >
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
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<style scoped lang="scss">
.avatar-card {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-wrapper {
  text-align: center;
}

.avatar-preview {
  cursor: pointer;
}

.avatar-preview:hover {
  opacity: 0.8;
}

.avatar-upload {
  margin-top: 20px;
}

.card-header {
  font-weight: bold;
  font-size: 16px;
}

.el-tabs {
  box-shadow: none;
}
</style>
