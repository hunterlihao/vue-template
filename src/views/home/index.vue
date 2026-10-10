<script lang="ts" setup>
import { ref } from 'vue';
import { getTime } from '@/utils/time';
import { useUserStore } from '@/store/modules/user.ts';
import useEcharts from '@/hooks/useEcharts.ts';
import useTableHeight from '@/hooks/useTableHeight.ts';
import setting from '@/setting.ts';
import UserAvatar from '@/components/UserAvatar/UserAvatar.vue';

const userStore = useUserStore();
// 内容区高度自适应(原来手写 window.innerHeight - 320,且不监听 resize)
const { tableHeight: mainHeight } = useTableHeight(320);

// 三个图表容器
const barRef = ref<HTMLElement>();
const pieRef = ref<HTMLElement>();
const ringRef = ref<HTMLElement>();

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

/** 演示数据 */
const visits = [
  { value: 1048, name: '搜索引擎' },
  { value: 735, name: '直接访问' },
  { value: 580, name: '邮件营销' },
  { value: 484, name: '联盟广告' },
  { value: 300, name: '视频广告' },
];

// 柱状图:订单统计
useEcharts(barRef, {
  xAxis: {
    type: 'category',
    data: weekDays,
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
    subtext: '演示数据',
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
      name: '访问来源',
      type: 'pie',
      radius: '50%',
      data: visits,
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
      name: '访问来源',
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
      data: visits,
    },
  ],
});
</script>

<template>
  <el-card>
    <div class="box">
      <UserAvatar :url="userStore.avatarUrl" :size="100" />
      <div class="bottom">
        <h3 class="title">{{ getTime() }}好呀! {{ userStore.nickName }}</h3>
        <p class="subtitle">{{ setting.title }}</p>
      </div>
    </div>
  </el-card>
  <el-main :style="{ minHeight: mainHeight + 'px' }">
    <div class="chart-row">
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">订单统计</div>
        </template>
        <div ref="barRef" class="chart"></div>
      </el-card>
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">热门商品</div>
        </template>
        <div ref="pieRef" class="chart"></div>
      </el-card>
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">最受欢迎</div>
        </template>
        <div ref="ringRef" class="chart"></div>
      </el-card>
    </div>
  </el-main>
</template>

<style lang="scss" scoped>
.box {
  display: flex;

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

.chart-row {
  display: flex;
  gap: 20px;

  .chart-card {
    flex: 1;

    .chart {
      width: 100%;
      height: 300px;
    }
  }
}
</style>
