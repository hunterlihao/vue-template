import { onBeforeUnmount, onMounted, shallowRef, type Ref } from 'vue';
import * as echarts from 'echarts';
import type { ECharts, EChartsOption } from 'echarts';

/**
 * ECharts 封装:统一处理初始化、窗口自适应与销毁。
 *
 * 原来每个图表都手写一遍 `global.$echarts.init(el)` + `setOption`,
 * 既没有 resize 监听(侧边栏折叠、窗口缩放后图表不会自适应),
 * 也没有 dispose(切换路由后实例泄漏)。
 *
 * 用法:
 *   const el = ref<HTMLElement>();
 *   useEcharts(el, { xAxis: {...}, series: [...] });
 */
export default function useEcharts(
  elRef: Ref<HTMLElement | null | undefined>,
  option: EChartsOption | (() => EChartsOption),
) {
  const chart = shallowRef<ECharts>();
  let observer: ResizeObserver | undefined;

  /** 取当前配置 */
  const resolveOption = () =>
    typeof option === 'function' ? option() : option;

  /** 初始化实例 */
  function init() {
    if (!elRef.value || chart.value) return;
    chart.value = echarts.init(elRef.value);
    chart.value.setOption(resolveOption());
  }

  /** 重设配置 */
  function setOption(next: EChartsOption) {
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
    init();
    // 容器尺寸变化(侧边栏折叠、布局变动)时自适应
    if (elRef.value && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => resize());
      observer.observe(elRef.value);
    }
    window.addEventListener('resize', resize);
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = undefined;
    window.removeEventListener('resize', resize);
    dispose();
  });

  return { chart, init, setOption, resize, dispose };
}
