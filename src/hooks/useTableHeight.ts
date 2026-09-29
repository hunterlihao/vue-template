import { onBeforeUnmount, onMounted, ref } from 'vue';

/**
 * 表格高度自适应:窗口高度减去固定偏移。
 *
 * 原来两个列表页各自写 window.innerHeight - 300,且只在 onMounted 算一次,
 * 窗口缩放后不会更新。这里补上了 resize 监听并在卸载时清理。
 */
export default function useTableHeight(offset = 300) {
  const tableHeight = ref(0);

  const update = () => {
    tableHeight.value = window.innerHeight - offset;
  };

  onMounted(() => {
    update();
    window.addEventListener('resize', update);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', update);
  });

  return { tableHeight, update };
}
