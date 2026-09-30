import { describe, expect, it } from 'vitest';
import { confirmPasswordRules, required } from '@/const/rules.ts';

type Validator = (
  rule: unknown,
  value: string,
  callback: (error?: Error) => void,
) => void;

/** 取出 confirmPasswordRules 里的自定义校验函数 */
function getConfirmValidator(currentPassword: string): Validator {
  const rules = confirmPasswordRules(() => currentPassword);
  return rules[1].validator as unknown as Validator;
}

describe('required', () => {
  it('默认 blur 触发', () => {
    expect(required('请输入姓名')).toEqual([
      { required: true, message: '请输入姓名', trigger: 'blur' },
    ]);
  });

  it('可以指定 change 触发', () => {
    expect(required('请选择性别', 'change')[0].trigger).toBe('change');
  });
});

describe('confirmPasswordRules', () => {
  it('两次输入一致时通过', () => {
    const validate = getConfirmValidator('123456');
    let error: Error | undefined;
    validate({}, '123456', (err) => {
      error = err;
    });
    expect(error).toBeUndefined();
  });

  it('两次输入不一致时报错', () => {
    const validate = getConfirmValidator('123456');
    let error: Error | undefined;
    validate({}, '654321', (err) => {
      error = err;
    });
    expect(error?.message).toBe('两次输入的密码不一致');
  });

  it('为空时报必填错误', () => {
    const validate = getConfirmValidator('123456');
    let error: Error | undefined;
    validate({}, '', (err) => {
      error = err;
    });
    expect(error?.message).toBe('请再次输入新密码');
  });
});
