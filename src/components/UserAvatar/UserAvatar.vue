<template>
  <el-avatar
    class="user-avatar"
    :size="props.size"
    :shape="props.shape"
    :src="avatarSrc"
    :alt="props.alt"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import setting from '@/setting.ts';

/**
 * 用户头像。
 *
 * 统一处理"没有头像"的情况:接口返回空字符串时回落到内置的默认头像
 * (public/avatar.svg),避免页面上出现裂图。
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

const avatarSrc = computed(() => props.url || setting.defaultAvatar);
</script>

<style lang="scss" scoped>
.user-avatar {
  flex-shrink: 0;
  background-color: transparent;
}
</style>
