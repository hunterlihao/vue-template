<script setup lang="ts">
import { ref } from 'vue';
import { ElImageViewer } from 'element-plus';
import UploadImg from '@/components/UploadImg/uploadImg.vue';

// 头像地址由父组件通过 v-model:url 双向绑定
const props = defineProps<{ url?: string }>();
const emit = defineEmits<{ (e: 'update:url', value: string): void }>();

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
        <!-- 上传逻辑统一交给 UploadImg,只限制 jpg/png 且不超过 2MB -->
        <UploadImg
          :url="props.url"
          :max-size="2"
          accept=".jpg,.jpeg,.png"
          :show-tip="false"
          @update:url="(value: string) => emit('update:url', value)"
        >
          <el-button type="primary" size="small">更换头像</el-button>
        </UploadImg>
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
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
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
