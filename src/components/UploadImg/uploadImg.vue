<template>
  <el-upload
    v-bind="$attrs"
    :action="UPLOAD_IMG_URL"
    :on-preview="handlePictureCardPreview"
    :headers="{ 'access-token': useUserStore().token }"
    :before-upload="beforeUpload"
    :on-error="handleUploadError"
    :on-success="handleUploadSuccess"
    :accept="acceptTypes"
    :limit="maxFiles"
    :on-exceed="handleExceed"
    :multiple="false"
  >
    <el-icon>
      <Plus />
    </el-icon>
    <template #tip>
      <div class="el-upload__tip">
        支持 jpg/png/gif 格式，单个文件不超过 {{ maxSize }}MB
      </div>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible" width="50%" destroy-on-close>
    <el-image
      :src="dialogImageUrl"
      fit="contain"
      :preview-src-list="[dialogImageUrl]"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { UPLOAD_IMG_URL } from '@/api/file';
import { ref } from 'vue';
import {
  type UploadFile,
  type UploadFiles,
} from 'element-plus/es/components/upload/src/upload';
import { useUserStore } from '@/store/modules/user';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

// 配置项
const maxSize = 5; // 最大文件大小（MB）
const maxFiles = 1; // 最大文件数量
const acceptTypes = '.jpg,.jpeg,.png,.gif'; // 允许的文件类型

// 预览相关
const dialogImageUrl = ref('');
const dialogVisible = ref(false);

// 文件类型检查
const isValidFileType = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  return validTypes.includes(file.type);
};

// 文件大小检查（转换为MB）
const isValidFileSize = (file: File): boolean => {
  const sizeInMB = file.size / (1024 * 1024);
  return sizeInMB <= maxSize;
};

// 上传前验证
const beforeUpload = (file: File): boolean | Promise<File> => {
  // 检查文件类型
  if (!isValidFileType(file)) {
    ElMessage.error('只能上传JPG/PNG/GIF格式的图片！');
    return false;
  }

  // 检查文件大小
  if (!isValidFileSize(file)) {
    ElMessage.error(`文件大小不能超过 ${maxSize}MB！`);
    return false;
  }

  return true;
};

// 处理上传错误
const handleUploadError = (error: Error, file: UploadFile): void => {
  ElMessage.error('上传失败，请重试');
  console.error('Upload error:', error);
};

// 处理上传成功
const handleUploadSuccess = (response: any, file: UploadFile): void => {
  // 验证响应数据
  if (!response || typeof response !== 'object') {
    ElMessage.error('上传失败：服务器响应异常');
    return;
  }

  // 检查响应状态
  if (response.code !== 200) {
    ElMessage.error(response.message || '上传失败');
    return;
  }

  ElMessage.success('上传成功');
};

// 处理超出文件数量限制
const handleExceed = (files: File[], uploadFiles: UploadFiles): void => {
  ElMessage.warning(`最多只能上传 ${maxFiles} 个文件`);
};

// 处理图片预览
const handlePictureCardPreview = (uploadFile: UploadFile) => {
  if (!uploadFile.url) {
    ElMessage.error('预览图片地址无效');
    return;
  }

  // 验证URL格式（只允许HTTP(S)和相对路径）
  const urlPattern = /^(https?:\/\/|\/)/i;
  if (!urlPattern.test(uploadFile.url)) {
    ElMessage.error('预览图片地址无效');
    return;
  }

  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
};
</script>

<style scoped lang="scss">
.el-upload__tip {
  font-size: 12px;
  color: #606266;
  margin-top: 8px;
}
</style>
