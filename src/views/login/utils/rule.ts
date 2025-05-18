// 登录表单校验规则

/**
 * 用户名校验规则
 * @param _rule
 * @param value 表单元素文本内容
 * @param callback 回调函数
 */
export const validatorUserName = (_rule: any, value: any, callback: any) => {
  //rule:即为校验规则对象
  //value:即为表单元素文本内容
  //函数:如果符合条件callBack放行通过即为
  //如果不符合条件callBack方法,注入错误提示信息
  if (value.length >= 5) {
    callback();
  } else {
    callback(new Error('账号长度至少五位'));
  }
};

/**
 * 密码校验规则
 * @param _rule
 * @param value 表单元素文本内容
 * @param callback 回调函数
 */
export const validatorPassword = (_rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback();
  } else {
    callback(new Error('密码长度至少六位'));
  }
};

/**
 * 登录表单校验规则配置对象
 * 规则对象属性:
 * required: 代表这个字段务必要校验的
 * min: 文本长度至少多少位
 * max: 文本长度最多多少位
 * message: 错误的提示信息
 * trigger: 触发校验表单的时机 change->文本发生变化触发校验,blur:失去焦点的时候触发校验规则
 */
export const loginRules = {
  username: [
    // { required: true, min: 6, max: 10, message: '账号长度至少六位', trigger: 'change' }
    { trigger: 'change', validator: validatorUserName },
  ],
  password: [
    // { required: true, min: 6, max: 15, message: '密码长度至少6位', trigger: 'change' }
    { trigger: 'change', validator: validatorPassword },
  ],
};
