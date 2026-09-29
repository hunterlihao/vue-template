<script setup lang="ts">
import { computed } from 'vue';
import { ElMessage, type UploadProps } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { UPLOAD_IMG_URL } from '@/api/file';
import { useUserStore } from '@/store/modules/user.ts';

/**
 * 通用图片上传组件。
 *
 * 统一处理:携带 token、类型/大小校验、成功/失败提示、超出数量限制,
 * 并通过 v-model:url 把上传后的图片地址抛给父组件。
 * 触发区域用默认插槽自定义(不写则显示一个 + 号)。
 */
const props = withDefaults(
  defineProps<{
    /** 已上传的图片地址(v-model:url) */
    url?: string;
    /** 单文件大小上限,单位 MB */
    maxSize?: number;
    /** 允许的扩展名,同时决定运行时类型校验 */
    accept?: string;
    /** 最多上传数量 */
    maxFiles?: number;
    /** 是否显示底部提示文案 */
    showTip?: boolean;
    /** 自定义提示文案,为空时按 maxSize 自动生成 */
    tip?: string;
  }>(),
  {
    url: '',
    maxSize: 5,
    accept: '.jpg,.jpeg,.png,.gif',
    maxFiles: 1,
    showTip: true,
    tip: '',
  },
);

const emit = defineEmits<{
  (e: 'update:url', value: string): void;
  (e: 'success', value: string): void;
  (e: 'error', error: Error): void;
}>();

const userStore = useUserStore();

// 扩展名 -> MIME,保证 accept 与运行时校验始终一致
const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
};

const extList = computed(() =>
  props.accept
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean),
);

const allowedTypes = computed(() =>
  extList.value.map((ext) => MIME_BY_EXT[ext]).filter(Boolean),
);

const typeText = computed(() =>
  extList.value.map((ext) => ext.replace('.', '').toUpperCase()).join('/'),
);

const tipText = computed(
  () =>
    props.tip ||
    `支持 ${typeText.value} 格式，单个文件不超过 ${props.maxSize}MB`,
);

const uploadHeaders = computed(() => ({ token: userStore.getToken || '' }));

// 上传前校验
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (!allowedTypes.value.includes(rawFile.type)) {
    ElMessage.error(`只能上传 ${typeText.value} 格式的图片！`);
    return false;
  }
  if (rawFile.size / 1024 / 1024 > props.maxSize) {
    ElMessage.error(`文件大小不能超过 ${props.maxSize}MB！`);
    return false;
  }
  return true;
};

// 上传成功
const handleSuccess: UploadProps['onSuccess'] = (response) => {
  if (!response || typeof response !== 'object') {
    ElMessage.error('上传失败：服务器响应异常');
    return;
  }
  if (response.code !== 200) {
    ElMessage.error(response.message || '上传失败');
    return;
  }
  ElMessage.success('上传成功');
  emit('update:url', response.data);
  emit('success', response.data);
};

// 上传失败
const handleError: UploadProps['onError'] = (error) => {
  ElMessage.error('上传失败，请重试');
  emit('error', error as Error);
};

// 超出数量限制
const handleExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning(`最多只能上传 ${props.maxFiles} 个文件`);
};
</script>

<template>
  <el-upload
    :action="UPLOAD_IMG_URL"
    :headers="uploadHeaders"
    :show-file-list="false"
    :before-upload="beforeUpload"
    :on-success="handleSuccess"
    :on-error="handleError"
    :on-exceed="handleExceed"
    :accept="props.accept"
    :limit="props.maxFiles"
    :multiple="false"
  >
    <slot>
      <el-icon><Plus /></el-icon>
    </slot>
    <template #tip v-if="props.showTip">
      <div class="el-upload__tip">{{ tipText }}</div>
    </template>
  </el-upload>
</template>

<style scoped lang="scss">
.el-upload__tip {
  font-size: 12px;
  color: #606266;
  margin-top: 8px;
}
</style>
