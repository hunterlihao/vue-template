// 菜单相关 mock
import type { MockMethod } from 'vite-plugin-mock';
import {
  fail,
  findMenu,
  findUser,
  menuTree,
  menuTreeForRole,
  ok,
  removeMenu,
  toDynamicMenus,
  type MockMenuItem,
} from './_data';

let autoId = 1000;

/** 生成新的菜单 id */
function nextId(): string {
  autoId += 1;
  return String(autoId);
}

export default [
  // 菜单列表(菜单管理页表格)
  {
    url: '/api/admin/menu/list',
    method: 'get',
    response: () => ok(menuTree),
  },
  // 上级菜单下拉
  {
    url: '/api/admin/menu/parent',
    method: 'get',
    response: () => ok(menuTree),
  },
  // 当前用户可访问的菜单(前端据此生成动态路由)
  {
    url: '/api/admin/menu/getMenuList',
    method: 'get',
    response: ({ query }) => {
      // 按登录用户的角色过滤菜单,不同账号看到的路由才不一样
      const user = findUser(String(query.userId || '1'));
      return ok(toDynamicMenus(menuTreeForRole(user.roleId)));
    },
  },
  // 导入菜单
  {
    url: '/api/admin/excel/uploadMenu',
    method: 'post',
    response: () => ok(null, '导入成功'),
  },
  // 导出菜单(mock 用 CSV 代替 xlsx,便于纯前端预览)
  {
    url: '/api/admin/excel/downloadMenu',
    method: 'get',
    rawResponse: (_req, res) => {
      const rows: string[][] = [
        ['菜单名称', '权限字段', '路由地址', '组件路径', '类型', '序号'],
      ];
      const walk = (items: MockMenuItem[], depth: number) => {
        items.forEach((item) => {
          rows.push([
            `${'　'.repeat(depth)}${item.title}`,
            item.code,
            item.path,
            item.url,
            item.type === 0 ? '目录' : item.type === 1 ? '菜单' : '按钮',
            item.orderNum,
          ]);
          if (item.children) walk(item.children, depth + 1);
        });
      };
      walk(menuTree, 0);
      const csv = rows.map((row) => row.join(',')).join('\r\n');
      res.setHeader('Content-Type', 'text/csv;charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename=menu.csv');
      // BOM 让 Excel 正确识别 UTF-8
      res.end('\uFEFF' + csv);
    },
  },
  // 新增菜单
  {
    url: '/api/admin/menu',
    method: 'post',
    response: ({ body }) => {
      const parentId = String(body?.parentId ?? '0');
      const parent =
        parentId === '0' ? undefined : findMenu(menuTree, parentId);
      const item: MockMenuItem = {
        menuId: nextId(),
        parentId,
        title: body?.title ?? '',
        code: body?.code ?? '',
        name: body?.name ?? '',
        path: body?.path ?? '',
        url: body?.url ?? '',
        type: Number(body?.type ?? 0),
        icon: body?.icon ?? '',
        parentName: parent ? parent.title : '顶级菜单',
        orderNum: body?.orderNum ?? '1',
      };
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(item);
      } else {
        menuTree.push(item);
      }
      return ok(null, '新增成功');
    },
  },
  // 修改菜单
  {
    url: '/api/admin/menu',
    method: 'put',
    response: ({ body }) => {
      const item = findMenu(menuTree, String(body?.menuId ?? ''));
      if (!item) return fail('菜单不存在');
      Object.assign(item, {
        title: body.title ?? item.title,
        code: body.code ?? item.code,
        name: body.name ?? item.name,
        path: body.path ?? item.path,
        url: body.url ?? item.url,
        type: Number(body.type ?? item.type),
        icon: body.icon ?? item.icon,
        orderNum: body.orderNum ?? item.orderNum,
      });
      return ok(null, '修改成功');
    },
  },
  // 删除菜单(放在最后,避免 :menuId 抢先匹配固定路径)
  {
    url: '/api/admin/menu/:menuId',
    method: 'delete',
    response: ({ query }) => {
      const menuId = String(query.menuId);
      if (!removeMenu(menuTree, menuId)) return fail('菜单不存在');
      return ok(null, '删除成功');
    },
  },
] as MockMethod[];
