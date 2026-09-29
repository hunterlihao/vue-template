<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, type UploadProps } from 'element-plus';
import { ElImageViewer } from 'element-plus';
import { UPLOAD_IMG_URL } from '@/api/file';
import { useUserStore } from '@/store/modules/user.ts';

// 头像地址由父组件通过 v-model:url 双向绑定
const props = defineProps<{ url?: string }>();
const emit = defineEmits<{ (e: 'update:url', value: string): void }>();

const userStore = useUserStore();
// 上传需要携带 token
const uploadHeaders = ref({ token: userStore.getToken || '' });

// 预览相关
const previewVisible = ref(false);
const previewImage = ref('');

// 显示头像预览
const showPreview = () => {
  if (props.url) {
    previewImage.value = props.url;
    previewVisible.value = true;
  }
};

// 上传成功:把地址抛给父组件
const handleSuccess: UploadProps['onSuccess'] = (response) => {
  if (response && response.code === 200) {
    emit('update:url', response.data);
  } else {
    ElMessage.error('头像上传失败');
  }
};

// 上传前校验
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('头像图片必须是 JPG 或 PNG 格式!');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像图片大小不能超过 2MB!');
    return false;
  }
  return true;
};
</script>

<template>
  <el-card class="avatar-card">
    <div class="avatar-wrapper">
      <el-avatar
        :size="120"
        :src="props.url || undefined"
        @click="showPreview"
        class="avatar-preview"
      />
      <div class="avatar-upload">
        <el-upload
          class="avatar-uploader"
          :action="UPLOAD_IMG_URL"
          :headers="uploadHeaders"
          :show-file-list="false"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
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
</style>
