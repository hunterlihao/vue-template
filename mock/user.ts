// 用户 / 认证相关 mock
import type { MockMethod } from 'vite-plugin-mock';
import {
  allCodes,
  codesForRole,
  fail,
  findUser,
  menuTree,
  ok,
  publicUser,
  users,
  type MockMenuItem,
} from './_data';

// ---------------------------------------------------------------- 验证码
/** 当前有效的验证码(单次有效,带过期时间) */
let captcha = { key: '', code: '', expireAt: 0 };
/** 验证码有效期:2 分钟 */
const CAPTCHA_TTL = 2 * 60 * 1000;

/** 作废当前验证码 */
function invalidateCaptcha() {
  captcha = { key: '', code: '', expireAt: 0 };
}

function randomCode(len = 4): string {
  let code = '';
  for (let i = 0; i < len; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

/** 用内联 SVG 生成验证码图片(纯前端,无需后端) */
function captchaImage(code: string): string {
  const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399'];
  let chars = '';
  for (let i = 0; i < code.length; i++) {
    const x = 18 + i * 26;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const rotate = Math.floor(Math.random() * 31) - 15;
    chars +=
      `<text x="${x}" y="30" font-size="26" font-family="Arial" font-weight="bold"` +
      ` fill="${color}" transform="rotate(${rotate} ${x} 30)">${code[i]}</text>`;
  }
  let noise = '';
  for (let i = 0; i < 4; i++) {
    noise += `<line x1="${Math.floor(Math.random() * 120)}" y1="${Math.floor(
      Math.random() * 40,
    )}" x2="${Math.floor(Math.random() * 120)}" y2="${Math.floor(
      Math.random() * 40,
    )}" stroke="${colors[i % colors.length]}" stroke-width="1" opacity="0.5"/>`;
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40">` +
    `<rect width="120" height="40" fill="#f5f7fa"/>${noise}${chars}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export default [
  // 验证码
  {
    url: '/api/admin/user/login/captcha',
    method: 'get',
    response: () => {
      const code = randomCode();
      const key = `captcha-${Date.now()}`;
      captcha = { key, code, expireAt: Date.now() + CAPTCHA_TTL };
      return ok({ key, image: captchaImage(code) });
    },
  },
  // 登录
  {
    url: '/api/admin/user/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password, captchaCode, captchaKey } = body || {};
      // 校验验证码:必须带 key、未过期、且一次性使用
      if (!captchaKey || captchaKey !== captcha.key) {
        return fail('验证码已失效,请刷新后重试');
      }
      if (Date.now() > captcha.expireAt) {
        invalidateCaptcha();
        return fail('验证码已过期,请刷新后重试');
      }
      if (!captchaCode || String(captchaCode).trim() !== captcha.code) {
        // 失败即作废,避免被反复试错
        invalidateCaptcha();
        return fail('验证码错误');
      }
      invalidateCaptcha();

      const user = users.find((item) => item.username === username);
      if (!user || user.password !== password) {
        return fail('用户名或密码错误');
      }
      if (user.isEnabled !== 1) {
        return fail('该账号已被禁用,请联系管理员');
      }
      return ok({
        userId: user.userId,
        nickName: user.nickName,
        token: `mock-token-${user.userId}-${Date.now()}`,
        avatarUrl: user.avatarUrl,
      });
    },
  },
  // 退出登录
  {
    url: '/api/admin/user/logout',
    method: 'get',
    response: () => ok(null, '退出成功'),
  },
  // 用户权限信息(权限码 + 用户信息)
  {
    url: '/api/admin/user/info',
    method: 'get',
    response: ({ query }) => {
      const user = findUser(String(query.userId || '1'));
      return ok({
        // 按角色返回权限码,不再对所有用户都返回全量
        permissions: codesForRole(user.roleId),
        user: {
          userId: user.userId,
          nickName: user.nickName,
          avatarUrl: user.avatarUrl,
        },
      });
    },
  },
  // 获取当前登录用户信息(不含密码)
  {
    url: '/api/admin/user/getCurrentUser',
    method: 'get',
    response: ({ query }) =>
      ok(publicUser(findUser(String(query.userId || '1')))),
  },
  // 修改当前用户信息
  {
    url: '/api/admin/user/updateUserInfo',
    method: 'put',
    response: ({ body }) => {
      const user = users.find((item) => item.userId === body?.userId);
      if (!user) return fail('用户不存在');
      Object.assign(user, {
        nickName: body.nickName ?? user.nickName,
        phone: body.phone ?? user.phone,
        email: body.email ?? user.email,
        sex: body.sex ?? user.sex,
        avatarUrl: body.avatarUrl ?? user.avatarUrl,
      });
      return ok(null, '修改成功');
    },
  },
  // 修改密码
  {
    url: '/api/admin/user/updatePassword',
    method: 'post',
    response: ({ body }) => {
      const user = users.find((item) => item.userId === body?.userId);
      if (!user) return fail('用户不存在');
      if (user.password !== body?.oldPassword) return fail('原密码错误');
      user.password = body?.password;
      return ok(null, '密码修改成功');
    },
  },
  // 用户列表(分页 + 关键字)
  {
    url: '/api/admin/user/list',
    method: 'post',
    response: ({ body }) => {
      const current = Number(body?.current) || 1;
      const size = Number(body?.size) || 10;
      const keyword = String(body?.params ?? '').trim();
      const list = keyword
        ? users.filter(
            (item) =>
              item.nickName.includes(keyword) ||
              item.username.includes(keyword) ||
              item.phone.includes(keyword),
          )
        : users;
      const start = (current - 1) * size;
      return ok({
        // 去掉密码字段再返回
        records: list.slice(start, start + size).map(publicUser),
        total: list.length,
      });
    },
  },
  // 根据用户 id 查询角色
  {
    url: '/api/admin/user/getRoleList',
    method: 'get',
    response: ({ query }) => {
      const user = findUser(String(query.userId || '1'));
      return ok(
        String(user.roleId || '')
          .split(',')
          .filter(Boolean),
      );
    },
  },
  // 查询菜单树(分配菜单弹窗)
  {
    url: '/api/admin/menu/getAssignTree',
    method: 'get',
    response: ({ query }) => {
      const roleId = String(query.roleId || '1');
      // 简单模拟:超级管理员拥有全部菜单,其它角色只有查看类菜单
      const checkList =
        roleId === '1'
          ? allMenuIds(menuTree)
          : allMenuIds(menuTree).filter((id) => id.length <= 2);
      return ok({ menuList: menuTree, checkList });
    },
  },
  // 新增用户
  {
    url: '/api/admin/user',
    method: 'post',
    response: ({ body }) => {
      const id = String(
        users.reduce((max, item) => Math.max(max, Number(item.userId)), 0) + 1,
      );
      users.unshift({
        userId: id,
        username: body?.username ?? '',
        password: body?.password || '123456',
        nickName: body?.nickName ?? '',
        phone: body?.phone ?? '',
        email: body?.email ?? '',
        sex: Number(body?.sex) || 0,
        roleId: body?.roleId ?? '2',
        isEnabled: body?.isEnabled === 0 ? 0 : 1,
        isAdmin: body?.isAdmin === 1 ? 1 : 0,
        avatarUrl: '',
      });
      return ok(null, '新增成功');
    },
  },
  // 修改用户
  {
    url: '/api/admin/user',
    method: 'put',
    response: ({ body }) => {
      const user = users.find((item) => item.userId === body?.userId);
      if (!user) return fail('用户不存在');
      Object.assign(user, {
        username: body.username ?? user.username,
        nickName: body.nickName ?? user.nickName,
        phone: body.phone ?? user.phone,
        email: body.email ?? user.email,
        sex: Number(body.sex ?? user.sex),
        roleId: body.roleId ?? user.roleId,
        isEnabled: Number(body.isEnabled ?? user.isEnabled),
        isAdmin: Number(body.isAdmin ?? user.isAdmin),
      });
      return ok(null, '修改成功');
    },
  },
  // 重置密码
  {
    url: '/api/admin/user/resetPassword',
    method: 'post',
    response: ({ body }) => {
      const user = users.find((item) => item.userId === body?.userId);
      if (!user) return fail('用户不存在');
      user.password = '123456';
      return ok(null, '重置成功');
    },
  },
  // 删除用户(放在最后,避免 :userId 抢先匹配 /list 等固定路径)
  {
    url: '/api/admin/user/:userId',
    method: 'delete',
    response: ({ query }) => {
      const userId = String(query.userId);
      const index = users.findIndex((item) => item.userId === userId);
      if (index === -1) return fail('用户不存在');
      if (users[index].isAdmin === 1) return fail('超级管理员不能删除');
      users.splice(index, 1);
      return ok(null, '删除成功');
    },
  },
] as MockMethod[];

/** 收集菜单树的所有 id */
function allMenuIds(items: MockMenuItem[]): string[] {
  const ids: string[] = [];
  const walk = (list: MockMenuItem[]) => {
    list.forEach((item) => {
      ids.push(item.menuId);
      if (item.children) walk(item.children);
    });
  };
  walk(items);
  return ids;
}
