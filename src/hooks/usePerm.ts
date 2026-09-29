import { useUserStore } from '@/store/modules/user.ts';

/**
 * 按钮级权限判断。
 *
 * 统一了原先三套并存的机制:
 *  1. main.ts 挂在 globalProperties 上的 $hasPerm
 *  2. directive/hasPerm.ts 里的同名函数
 *  3. directive/permission.ts 里从未启用的指令
 *
 * 现在只保留这一个入口。页面里:
 *   const { hasPerm } = usePerm();
 *   模板:v-if="hasPerm(['sys:user:add'])"
 *
 * 之所以不用指令(如 v-perm)统一:部分调用点位于 <el-table-column> 上,
 * 它是无根元素组件,指令拿不到真实 DOM,删不掉元素会静默失效;
 * 而 v-if 对任何组件/元素都成立。
 */
export default function usePerm() {
  const userStore = useUserStore();

  /**
   * 传入权限码数组,命中任意一个即返回 true
   */
  const hasPerm = (codes: string[]): boolean => {
    if (!Array.isArray(codes) || codes.length === 0) {
      throw new Error(
        "hasPerm 需要传入非空的权限码数组,例如 hasPerm(['sys:user:add'])",
      );
    }
    const stored: string[] = JSON.parse(
      localStorage.getItem('codeList') || '[]',
    );
    // 仓库里没有时回退到本地存储
    const codeList = userStore.getCodeList?.length
      ? userStore.getCodeList
      : stored;
    return codeList.some((code: string) => codes.includes(code));
  };

  return { hasPerm };
}
