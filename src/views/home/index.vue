<script lang="ts" setup>
import { getTime } from '@/utils/time';
import { useUserStore } from '@/store/modules/user.ts';

const userStore = useUserStore();
</script>

<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatarUrl" alt="" class="avatar" />
      <div class="bottom">
        <h3 class="title">{{ getTime() }}好呀{{ userStore.nickName }}</h3>
        <p class="subtitle">System</p>
      </div>
    </div>
  </el-card>
  <div class="bottoms">
    <svg-icon height="300px" name="welcome" width="600px"></svg-icon>
  </div>
</template>

<style lang="scss" scoped>
.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;

    .title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 30px;
    }

    .subtitle {
      font-style: italic;
      color: skyblue;
    }
  }
}

.bottoms {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
