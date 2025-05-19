//用户信息数据
function createUserList() {
  return [
    {
      userId: 1,
      avatar:
        'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'admin',
      password: '111111',
      desc: '平台管理员',
      roles: ['平台管理员'],
      buttons: ['cuser.detail'],
      routes: ['home'],
      token: 'Admin Token',
    },
    {
      userId: 2,
      avatar:
        'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'system',
      password: '111111',
      desc: '系统管理员',
      roles: ['系统管理员'],
      buttons: ['cuser.detail', 'cuser.user'],
      routes: ['home'],
      token: 'System Token',
    },
  ];
}

export default [
  // 用户登录接口
  {
    url: '/api/user/login', //请求地址
    method: 'post', //请求方式
    response: ({ body }) => {
      //获取请求体携带过来的用户名与密码
      const { username, password, captchaCode, captchaKey } = body;
      //调用获取用户信息函数,用于判断是否有此用户
      const checkUser = createUserList().find(
        (item) => item.username === username && item.password === password,
      );
      //没有用户返回失败信息
      if (!checkUser) {
        return { code: 201, data: { message: '账号或者密码不正确' } };
      }
      // 验证码校验
      if (
        captchaKey != 'admin:login:24cc3f1f-5a6f-4cd9-a52a-9f01fc30b2e7' &&
        captchaCode != 'NAFG'
      ) {
        return { code: 201, data: { message: '验证码错误' } };
      }
      //如果有返回成功信息
      const { token } = checkUser;
      return { code: 200, data: { token } };
    },
  },
  // 获取用户信息
  {
    url: '/api/user/info',
    method: 'get',
    response: (request) => {
      //获取请求头携带token
      const token = request.headers.token;
      //查看用户信息是否包含有次token用户
      const checkUser = createUserList().find((item) => item.token === token);
      //没有返回失败的信息
      if (!checkUser) {
        return { code: 201, data: { message: '获取用户信息失败' } };
      }
      //如果有返回成功信息
      return { code: 200, data: { checkUser } };
    },
  },
  {
    url: '/api/user/code',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          image:
            'data:image/png;base64,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',
          key: 'admin:login:24cc3f1f-5a6f-4cd9-a52a-9f01fc30b2e7',
        },
      };
    },
  },
  {
    url: '/api/user/logout',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          message: '退出成功',
        },
      };
    },
  },
];
