// 角色相关 mock
import type { MockMethod } from 'vite-plugin-mock';
import { fail, ok, roles } from './_data';

let autoId = 100;

/** 记录每个角色已分配的菜单 id */
const roleMenus: Record<string, string[]> = {
  '1': [],
  '2': [],
  '3': [],
};

export default [
  // 角色下拉列表(用户新增/编辑时选择角色)
  {
    url: '/api/admin/role/selectList',
    method: 'get',
    response: () =>
      ok(
        roles.map((role) => ({
          value: role.roleId,
          label: role.roleName,
        })),
      ),
  },
  // 角色列表(分页 + 关键字)
  {
    url: '/api/admin/role/list',
    method: 'post',
    response: ({ body }) => {
      const current = Number(body?.current) || 1;
      const size = Number(body?.size) || 10;
      const keyword = String(body?.params ?? '').trim();
      const list = keyword
        ? roles.filter(
            (role) =>
              role.roleName.includes(keyword) || role.remark.includes(keyword),
          )
        : roles;
      const start = (current - 1) * size;
      return ok({
        records: list.slice(start, start + size),
        total: list.length,
      });
    },
  },
  // 新增角色
  {
    url: '/api/admin/role',
    method: 'post',
    response: ({ body }) => {
      autoId += 1;
      const roleId = String(autoId);
      roles.push({
        roleId,
        roleName: body?.roleName ?? '',
        remark: body?.remark ?? '',
      });
      roleMenus[roleId] = [];
      return ok(null, '新增成功');
    },
  },
  // 修改角色
  {
    url: '/api/admin/role',
    method: 'put',
    response: ({ body }) => {
      const role = roles.find((item) => item.roleId === body?.roleId);
      if (!role) return fail('角色不存在');
      role.roleName = body.roleName ?? role.roleName;
      role.remark = body.remark ?? role.remark;
      return ok(null, '修改成功');
    },
  },
  // 分配菜单
  {
    url: '/api/admin/role/saveRoleMenu',
    method: 'post',
    response: ({ body }) => {
      const roleId = String(body?.roleId ?? '');
      if (!roleId) return fail('请选择角色');
      roleMenus[roleId] = (body?.list ?? []).map((id: string) => String(id));
      return ok(null, '分配成功');
    },
  },
  // 删除角色(放在最后,避免 :roleId 抢先匹配固定路径)
  {
    url: '/api/admin/role/:roleId',
    method: 'delete',
    response: ({ query }) => {
      const roleId = String(query.roleId);
      const index = roles.findIndex((item) => item.roleId === roleId);
      if (index === -1) return fail('角色不存在');
      if (roleId === '1') return fail('超级管理员角色不能删除');
      roles.splice(index, 1);
      delete roleMenus[roleId];
      return ok(null, '删除成功');
    },
  },
] as MockMethod[];
