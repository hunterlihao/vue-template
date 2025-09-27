import { useUserStore } from '@/store/modules/user.ts';

export default function hasPerm(value: any) {
  // 按钮权限字段
  const store = useUserStore();
  const codeList = JSON.parse(localStorage.getItem('codeList') || '[]');
  if (value && value instanceof Array && value.length > 0) {
    // 判断按钮权限是否存在
    const permissionRoles = value;
    const roleList = store.getCodeList || codeList;
    return roleList.some((role: any) => {
      return permissionRoles.includes(role);
    });
  } else {
    throw new Error(
      ` v-if="global.$hasPerm(['sys:user:add','sys:user:update']")`,
    );
  }
}
