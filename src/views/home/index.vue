<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
import { getTime } from '@/utils/time';
import { useUserStore } from '@/store/modules/user.ts';
import useEcharts from '@/hooks/useEcharts.ts';

const userStore = useUserStore();
const mainHeight = ref(300);

// 三个图表容器
const barRef = ref<HTMLElement>();
const pieRef = ref<HTMLElement>();
const ringRef = ref<HTMLElement>();

// 柱状图:订单统计
useEcharts(barRef, {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
    },
  ],
});

// 饼图:热门商品
useEcharts(pieRef, {
  title: {
    subtext: 'Fake Data',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
});

// 环形图:最受欢迎
useEcharts(ringRef, {
  tooltip: {
    trigger: 'item',
  },
  legend: {
    top: '5%',
    left: 'center',
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' },
      ],
    },
  ],
});

onMounted(() => {
  nextTick(() => {
    mainHeight.value = window.innerHeight - 320;
  });
});
</script>

<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatarUrl" alt="" class="avatar" />
      <div class="bottom">
        <h3 class="title">{{ getTime() }}好呀! {{ userStore.nickName }}</h3>
        <p class="subtitle">System</p>
      </div>
    </div>
  </el-card>
  <el-main :style="{ height: mainHeight + 'px' }">
    <div style="display: flex">
      <el-card style="flex: 1">
        <template #header>
          <div class="card-header">订单统计</div>
        </template>
        <div ref="barRef" :style="{ width: '100%', height: '300px' }"></div>
      </el-card>
      <el-card style="flex: 1; margin-left: 20px">
        <template #header>
          <div class="card-header">热门商品</div>
        </template>
        <div ref="pieRef" :style="{ width: '100%', height: '300px' }"></div>
      </el-card>
      <el-card style="flex: 1; margin-left: 20px">
        <template #header>
          <div class="card-header">最受欢迎</div>
        </template>
        <div ref="ringRef" :style="{ width: '100%', height: '300px' }"></div>
      </el-card>
    </div>
  </el-main>
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
      margin-bottom: 30px;
      font-size: 30px;
      font-weight: 900;
    }

    .subtitle {
      font-style: italic;
      color: skyblue;
    }
  }
}
</style>
