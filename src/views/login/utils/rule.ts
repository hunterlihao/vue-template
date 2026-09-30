// 登录表单校验规则
import type { FormItemRule, FormRules } from 'element-plus';

/** 与 Element Plus 的校验函数签名保持一致(避免手写 any) */
type ValidatorFn = NonNullable<FormItemRule['validator']>;

/**
 * 用户名校验规则
 * @param _rule 校验规则对象
 * @param value 表单元素文本内容
 * @param callback 回调函数:通过则直接调用,不通过则传入 Error
 */
export const validatorUserName: ValidatorFn = (_rule, value, callback) => {
  if (String(value ?? '').length >= 5) {
    callback();
  } else {
    callback(new Error('账号长度至少五位'));
  }
};

/** 密码校验规则 */
export const validatorPassword: ValidatorFn = (_rule, value, callback) => {
  if (String(value ?? '').length >= 6) {
    callback();
  } else {
    callback(new Error('密码长度至少六位'));
  }
};

/** 验证码校验规则 */
export const validatorCaptcha: ValidatorFn = (_rule, value, callback) => {
  if (String(value ?? '').length === 4) {
    callback();
  } else {
    callback(new Error('验证码长度必须为4位'));
  }
};

/**
 * 登录表单校验规则。
 * required: 字段必填;min: 文本长度下限;trigger: change 输入即校验 / blur 失焦校验
 */
export const loginRules: FormRules = {
  username: [{ trigger: 'change', validator: validatorUserName }],
  password: [{ trigger: 'change', validator: validatorPassword }],
  captchaCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { trigger: 'change', validator: validatorCaptcha },
  ],
};
