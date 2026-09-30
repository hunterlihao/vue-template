import { onBeforeUnmount, onMounted, shallowRef, type Ref } from 'vue';
import {
  init,
  use,
  type EChartsCoreOption,
  type EChartsType,
} from 'echarts/core';
import { BarChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

/**
 * 按需注册 echarts 模块。
 *
 * 之前是 `import * as echarts from 'echarts'`,会把整个 echarts(约 1MB)
 * 打进产物;这里只注册实际用到的图表与组件,首屏体积可显著下降。
 * 新增图表类型时记得在这里补注册,否则图表渲染不出来。
 */
use([
  BarChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  CanvasRenderer,
]);

/**
 * ECharts 封装:统一处理初始化、窗口自适应与销毁。
 *
 * 用法:
 *   const el = ref<HTMLElement>();
 *   useEcharts(el, { xAxis: {...}, series: [...] });
 */
export default function useEcharts(
  elRef: Ref<HTMLElement | null | undefined>,
  option: EChartsCoreOption | (() => EChartsCoreOption),
) {
  const chart = shallowRef<EChartsType>();
  let observer: ResizeObserver | undefined;

  /** 取当前配置 */
  const resolveOption = () =>
    typeof option === 'function' ? option() : option;

  /** 初始化实例 */
  function initChart() {
    if (!elRef.value || chart.value) return;
    chart.value = init(elRef.value);
    chart.value.setOption(resolveOption());
  }

  /** 重设配置 */
  function setOption(next: EChartsCoreOption) {
    chart.value?.setOption(next);
  }

  /** 自适应尺寸 */
  function resize() {
    chart.value?.resize();
  }

  /** 销毁实例 */
  function dispose() {
    chart.value?.dispose();
    chart.value = undefined;
  }

  onMounted(() => {
    initChart();
    // 容器尺寸变化(侧边栏折叠、布局变动)时自适应
    if (elRef.value && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => resize());
      observer.observe(elRef.value);
    }
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = undefined;
    dispose();
  });

  return { chart, init: initChart, setOption, resize, dispose };
}
