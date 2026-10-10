<template>
  <el-avatar
    class="user-avatar"
    :size="props.size"
    :shape="props.shape"
    :src="avatarSrc"
    :alt="props.alt"
    @error="onError"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import setting from '@/setting.ts';

/**
 * 用户头像。
 *
 * 统一处理"头像不可用"的两种情况,避免出现裂图或空圆:
 *  1. 接口返回空字符串  -> 直接用默认头像
 *  2. 地址加载失败(文件被删/域名换了/持久化的旧地址失效)
 *     el-avatar 加载失败后会渲染成空圆,所以要监听 error 回落到默认头像
 */
const props = withDefaults(
  defineProps<{
    /** 头像地址,为空时使用默认头像 */
    url?: string;
    /** 尺寸(px)或 Element Plus 预设值 */
    size?: number | 'large' | 'default' | 'small';
    shape?: 'circle' | 'square';
    alt?: string;
  }>(),
  {
    url: '',
    size: 40,
    shape: 'circle',
    alt: '用户头像',
  },
);

/** 加载失败标记 */
const loadFailed = ref(false);

// 换了地址就重新给一次机会,否则失败的旧标记会让新地址永远显示默认头像
watch(
  () => props.url,
  () => {
    loadFailed.value = false;
  },
);

const avatarSrc = computed(() =>
  loadFailed.value || !props.url ? setting.defaultAvatar : props.url,
);

const onError = () => {
  // 默认头像自身也加载失败时不再置标记,避免无限重试
  if (avatarSrc.value !== setting.defaultAvatar) {
    loadFailed.value = true;
  }
};
</script>

<style lang="scss" scoped>
.user-avatar {
  flex-shrink: 0;
  background-color: transparent;
}
</style>
