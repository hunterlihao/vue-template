<script lang="ts" setup>
import { getTime } from '@/utils/time';
import { useUserStore } from '@/store/modules/user.ts';
import useInstance from '@/hooks/useInstance.ts';
import { nextTick, onMounted, reactive, ref } from 'vue';

const { global } = useInstance();
const mainHeight = ref(300);
const myChart = ref(null);
const myChart1 = ref(null);
const myChart2 = ref(null);

// 柱状图
const charts1 = () => {
  const chartInstance = global.$echarts.init(myChart.value);
  let option = reactive({
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
  chartInstance.setOption(option);
};
// 饼图
const charts2 = () => {
  const myChart = global.$echarts.init(myChart1.value);
  let option = reactive({
    title: {
      // text: 'Referer of a Website',
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
  myChart.setOption(option);
};
// 环形图
const charts3 = () => {
  const myChart = global.$echarts.init(myChart2.value);
  let option = reactive({
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
  myChart.setOption(option);
};
onMounted(() => {
  charts1();
  charts2();
  charts3();
  nextTick(() => {
    mainHeight.value = window.innerHeight - 320;
  });
});
const userStore = useUserStore();
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
        <div ref="myChart" :style="{ width: '100%', height: '300px' }"></div>
      </el-card>
      <el-card style="flex: 1; margin-left: 20px">
        <template #header>
          <div class="card-header">热门商品</div>
        </template>
        <div ref="myChart1" :style="{ width: '100%', height: '300px' }"></div>
      </el-card>
      <el-card style="flex: 1; margin-left: 20px">
        <template #header>
          <div class="card-header">最受欢迎</div>
        </template>
        <div ref="myChart2" :style="{ width: '100%', height: '300px' }"></div>
      </el-card>
    </div>
  </el-main>
  <!--  <div class="bottoms">
    <svg-icon height="300px" name="welcome" width="600px"></svg-icon>
  </div>-->
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
