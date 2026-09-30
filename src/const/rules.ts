import type { FormItemRule } from 'element-plus';

/**
 * 表单校验规则集中定义。
 *
 * 原来同一批字段在多个页面各写一遍,而且宽严不一:
 * 例如手机号/邮箱在 UserList 有格式校验、在 userInfo 只有必填。
 * 这里统一成一份,页面按需引用。
 */

/** 必填规则 */
export function required(
  message: string,
  trigger: 'blur' | 'change' = 'blur',
): FormItemRule[] {
  return [{ required: true, message, trigger }];
}

/** 姓名 */
export const nickNameRules: FormItemRule[] = required('请输入姓名');

/** 性别 */
export const sexRules: FormItemRule[] = required('请选择性别');

/** 手机号:必填 + 格式 */
export const phoneRules: FormItemRule[] = [
  { required: true, message: '请输入手机号', trigger: 'blur' },
  {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入正确的手机号格式',
    trigger: 'blur',
  },
];

/** 邮箱:必填 + 格式 */
export const emailRules: FormItemRule[] = [
  { required: true, message: '请输入邮箱', trigger: 'blur' },
  {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: '请输入正确的邮箱格式',
    trigger: 'blur',
  },
];

/** 密码:必填 + 至少 6 位 */
export const passwordRules: FormItemRule[] = [
  { required: true, message: '请输入密码', trigger: 'blur' },
  { min: 6, message: '密码长度至少六位', trigger: 'blur' },
];

/** 确认密码:必须与 getPassword() 的返回值一致 */
export function confirmPasswordRules(
  getPassword: () => string,
): FormItemRule[] {
  return [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      // 参数类型由 FormItemRule 推导,不需要手写 any
      validator: (_rule, value: string, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'));
        } else if (value !== getPassword()) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ];
}
