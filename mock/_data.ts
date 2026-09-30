// mock 共享的种子数据与工具函数
// 说明:文件名以 "_" 开头,vite.config.ts 中通过 ignore 排除,不会注册成 mock 路由

export interface MockUser {
  userId: string;
  username: string;
  password: string;
  nickName: string;
  phone: string;
  email: string;
  sex: number; // 0 男 1 女
  roleId: string;
  isEnabled: number; // 1 启用 0 禁用
  isAdmin: number; // 1 是 0 否
  avatarUrl: string;
}

export interface MockRole {
  roleId: string;
  roleName: string;
  remark: string;
}

export interface MockMenuItem {
  menuId: string;
  parentId: string;
  title: string;
  code: string;
  name: string;
  path: string;
  url: string;
  type: number; // 0 目录 1 菜单 2 按钮
  icon: string;
  parentName: string;
  orderNum: string;
  children?: MockMenuItem[];
}

/** 统一成功返回体 */
export function ok<T>(data: T, message = '操作成功') {
  return { code: 200, message, data };
}

/** 统一失败返回体 */
export function fail(message: string, code = 500) {
  return { code, message, data: null };
}

// ---------------------------------------------------------------- 角色
export const roles: MockRole[] = [
  { roleId: '1', roleName: '超级管理员', remark: '拥有系统全部权限' },
  { roleId: '2', roleName: '普通用户', remark: '仅拥有查看权限' },
  { roleId: '3', roleName: '商品管理员', remark: '负责商品与分类维护' },
];

// ---------------------------------------------------------------- 物资类型(分类)
export interface MockCategory {
  categoryId: string;
  categoryName: string;
  categoryCode: string;
  orderNum: string;
  remark: string;
}

export const categories: MockCategory[] = [
  {
    categoryId: '1',
    categoryName: '办公用品',
    categoryCode: 'OFFICE',
    orderNum: '1',
    remark: '纸张、笔、文件夹等日常办公耗材',
  },
  {
    categoryId: '2',
    categoryName: '电子设备',
    categoryCode: 'DEVICE',
    orderNum: '2',
    remark: '电脑、显示器及外设',
  },
  {
    categoryId: '3',
    categoryName: '劳保用品',
    categoryCode: 'LABOR',
    orderNum: '3',
    remark: '安全帽、手套等防护用品',
  },
  {
    categoryId: '4',
    categoryName: '清洁用品',
    categoryCode: 'CLEAN',
    orderNum: '4',
    remark: '拖把、清洁剂等',
  },
];

// ---------------------------------------------------------------- 商品
export interface MockGoods {
  goodsId: string;
  goodsName: string;
  categoryId: string;
  price: number;
  stock: number;
  unit: string;
  remark: string;
}

export const goodsList: MockGoods[] = [
  {
    goodsId: '1',
    goodsName: 'A4 复印纸',
    categoryId: '1',
    price: 25.5,
    stock: 320,
    unit: '包',
    remark: '70g 500 张/包',
  },
  {
    goodsId: '2',
    goodsName: '中性笔',
    categoryId: '1',
    price: 3.5,
    stock: 1200,
    unit: '支',
    remark: '黑色 0.5mm',
  },
  {
    goodsId: '3',
    goodsName: '24 寸显示器',
    categoryId: '2',
    price: 899,
    stock: 26,
    unit: '台',
    remark: '1920x1080 IPS',
  },
  {
    goodsId: '4',
    goodsName: '无线键鼠套装',
    categoryId: '2',
    price: 129,
    stock: 58,
    unit: '套',
    remark: '2.4G 无线',
  },
  {
    goodsId: '5',
    goodsName: '安全帽',
    categoryId: '3',
    price: 45,
    stock: 180,
    unit: '顶',
    remark: 'ABS 材质 红色',
  },
  {
    goodsId: '6',
    goodsName: '防割手套',
    categoryId: '3',
    price: 18.5,
    stock: 240,
    unit: '副',
    remark: '5 级防割',
  },
  {
    goodsId: '7',
    goodsName: '拖把',
    categoryId: '4',
    price: 32,
    stock: 64,
    unit: '把',
    remark: '旋转脱水',
  },
  {
    goodsId: '8',
    goodsName: '多用途清洁剂',
    categoryId: '4',
    price: 15.8,
    stock: 96,
    unit: '瓶',
    remark: '500ml',
  },
];

/** 按 id 取类型名称 */
export function categoryName(categoryId: string): string {
  return (
    categories.find((item) => item.categoryId === categoryId)?.categoryName ??
    ''
  );
}

// ---------------------------------------------------------------- 用户
export const users: MockUser[] = [
  {
    userId: '1',
    username: 'admin',
    password: '123456',
    nickName: '超级管理员',
    phone: '13800138000',
    email: 'admin@example.com',
    sex: 0,
    roleId: '1',
    isEnabled: 1,
    isAdmin: 1,
    avatarUrl: '',
  },
];

const surnames = [
  '张',
  '李',
  '王',
  '赵',
  '刘',
  '陈',
  '杨',
  '黄',
  '周',
  '吴',
  '徐',
  '孙',
  '马',
  '朱',
];
const givenNames = ['伟', '芳', '娜', '敏', '静', '磊', '强', '洋', '艳', '勇'];

for (let i = 0; i < 14; i++) {
  const id = String(i + 2);
  users.push({
    userId: id,
    username: `user${id}`,
    password: '123456',
    nickName: `${surnames[i % surnames.length]}${givenNames[i % givenNames.length]}`,
    phone: `139${String(10000000 + i * 137).slice(0, 8)}`,
    email: `user${id}@example.com`,
    sex: i % 2,
    roleId: String((i % 3) + 1),
    isEnabled: i % 5 === 0 ? 0 : 1,
    isAdmin: 0,
    avatarUrl: '',
  });
}

// ---------------------------------------------------------------- 菜单
interface MenuSeed {
  id: string;
  title: string;
  code: string;
  name: string;
  path: string;
  url: string;
  icon: string;
  type: number;
  order: string;
  children?: MenuSeed[];
}

const button = (
  id: string,
  title: string,
  code: string,
  name: string,
  order: string,
): MenuSeed => ({
  id,
  title,
  code,
  name,
  path: '',
  url: '',
  icon: '',
  type: 2,
  order,
});

const menuSeed: MenuSeed[] = [
  {
    id: '1',
    title: '系统管理',
    code: 'sys',
    name: 'System',
    path: '/system',
    url: '',
    icon: 'Setting',
    type: 0,
    order: '1',
    children: [
      {
        id: '11',
        title: '用户管理',
        code: 'sys:user:list',
        name: 'SysUser',
        path: '/system/user',
        url: '/system/User/UserList.vue',
        icon: 'User',
        type: 1,
        order: '1',
        children: [
          button('111', '新增用户', 'sys:user:add', 'SysUserAdd', '1'),
          button('112', '修改用户', 'sys:user:update', 'SysUserUpdate', '2'),
          button('113', '删除用户', 'sys:user:delete', 'SysUserDelete', '3'),
          button(
            '114',
            '重置密码',
            'sys:user:updatePassword',
            'SysUserResetPwd',
            '4',
          ),
        ],
      },
      {
        id: '12',
        title: '角色管理',
        code: 'sys:role:list',
        name: 'SysRole',
        path: '/system/role',
        url: '/system/Role/RoleList.vue',
        icon: 'Avatar',
        type: 1,
        order: '2',
        children: [
          button('121', '新增角色', 'sys:role:add', 'SysRoleAdd', '1'),
          button('122', '修改角色', 'sys:role:update', 'SysRoleUpdate', '2'),
          button('123', '删除角色', 'sys:role:delete', 'SysRoleDelete', '3'),
          button(
            '124',
            '分配菜单',
            'sys:role:allotMenu',
            'SysRoleAllotMenu',
            '4',
          ),
        ],
      },
      {
        id: '13',
        title: '菜单管理',
        code: 'sys:menu:list',
        name: 'SysMenu',
        path: '/system/menu',
        url: '/system/Menu/MenuList.vue',
        icon: 'Menu',
        type: 1,
        order: '3',
        children: [
          button('131', '新增菜单', 'sys:menu:add', 'SysMenuAdd', '1'),
          button('132', '修改菜单', 'sys:menu:update', 'SysMenuUpdate', '2'),
          button('133', '删除菜单', 'sys:menu:delete', 'SysMenuDelete', '3'),
        ],
      },
    ],
  },
  {
    id: '2',
    title: '商品管理',
    code: 'goods',
    name: 'Goods',
    path: '/goods',
    url: '',
    icon: 'Goods',
    type: 0,
    order: '2',
    children: [
      {
        id: '21',
        title: '分类管理',
        code: 'goods:category:list',
        name: 'GoodsCategory',
        path: '/goods/category',
        url: '/category/CategoryList.vue',
        icon: 'Files',
        type: 1,
        order: '1',
        children: [
          button(
            '211',
            '新增类型',
            'goods:category:add',
            'GoodsCategoryAdd',
            '1',
          ),
          button(
            '212',
            '修改类型',
            'goods:category:update',
            'GoodsCategoryUpdate',
            '2',
          ),
          button(
            '213',
            '删除类型',
            'goods:category:delete',
            'GoodsCategoryDelete',
            '3',
          ),
        ],
      },
      {
        id: '22',
        title: '商品列表',
        code: 'goods:list:list',
        name: 'GoodsList',
        path: '/goods/list',
        url: '/goods/GoodsList.vue',
        icon: 'ShoppingCart',
        type: 1,
        order: '2',
        children: [
          button('221', '新增商品', 'goods:list:add', 'GoodsAdd', '1'),
          button('222', '修改商品', 'goods:list:update', 'GoodsUpdate', '2'),
          button('223', '删除商品', 'goods:list:delete', 'GoodsDelete', '3'),
        ],
      },
    ],
  },
];

function buildMenu(
  seeds: MenuSeed[],
  parentId = '0',
  parentName = '顶级菜单',
): MockMenuItem[] {
  return seeds.map((seed) => {
    const item: MockMenuItem = {
      menuId: seed.id,
      parentId,
      title: seed.title,
      code: seed.code,
      name: seed.name,
      path: seed.path,
      url: seed.url,
      type: seed.type,
      icon: seed.icon,
      parentName,
      orderNum: seed.order,
    };
    if (seed.children && seed.children.length > 0) {
      item.children = buildMenu(seed.children, seed.id, seed.title);
    }
    return item;
  });
}

/** 菜单树(菜单管理页 / 上级菜单下拉 / 分配菜单树共用) */
export const menuTree: MockMenuItem[] = buildMenu(menuSeed);

/** 收集菜单树里所有的权限字段,作为登录用户的 codeList */
export const allCodes: string[] = (() => {
  const list: string[] = [];
  const walk = (items: MockMenuItem[]) => {
    items.forEach((item) => {
      if (item.code) list.push(item.code);
      if (item.children) walk(item.children);
    });
  };
  walk(menuTree);
  return list;
})();

/** 把菜单树转换成前端动态路由需要的结构(排除按钮) */
export function toDynamicMenus(items: MockMenuItem[]): any[] {
  return items
    .filter((item) => item.type !== 2)
    .map((item) => {
      const route: any = {
        path: item.path,
        component: item.type === 0 ? 'Layout' : item.url,
        name: item.name,
        meta: {
          title: item.title,
          icon: item.icon,
          roles: [] as string[],
        },
      };
      const children = item.children ? toDynamicMenus(item.children) : [];
      if (children.length > 0) route.children = children;
      return route;
    });
}

/** 在菜单树中按 id 查找节点 */
export function findMenu(
  items: MockMenuItem[],
  menuId: string,
): MockMenuItem | undefined {
  for (const item of items) {
    if (item.menuId === menuId) return item;
    if (item.children) {
      const hit = findMenu(item.children, menuId);
      if (hit) return hit;
    }
  }
  return undefined;
}

/** 在菜单树中删除节点,返回是否删除成功 */
export function removeMenu(items: MockMenuItem[], menuId: string): boolean {
  const index = items.findIndex((item) => item.menuId === menuId);
  if (index > -1) {
    items.splice(index, 1);
    return true;
  }
  return items.some((item) =>
    item.children ? removeMenu(item.children, menuId) : false,
  );
}

/** 按 userId 查用户(找不到时回落到第一个用户) */
export function findUser(userId: string): MockUser {
  return users.find((item) => item.userId === userId) || users[0];
}

/** 去掉密码等敏感字段后的用户信息 */
export function publicUser(user: MockUser) {
  return {
    userId: user.userId,
    username: user.username,
    nickName: user.nickName,
    phone: user.phone,
    email: user.email,
    sex: user.sex,
    roleId: user.roleId,
    isEnabled: user.isEnabled,
    isAdmin: user.isAdmin,
    avatarUrl: user.avatarUrl,
  };
}

/**
 * 按角色返回权限码。
 *  - 1 超级管理员:全部
 *  - 3 商品管理员:商品与分类相关
 *  - 其它(2 普通用户):目录码 + 只读的 :list
 * 这样不同账号登录后按钮级权限才有差异(旧实现对所有 userId 都返回全部权限)。
 */
export function codesForRole(roleId: string): string[] {
  if (roleId === '1') return allCodes;
  if (roleId === '3')
    return allCodes.filter((code) => code.startsWith('goods'));
  return allCodes.filter(
    (code) => code === 'sys' || code === 'goods' || code.endsWith(':list'),
  );
}

/** 按角色过滤菜单树:保留自身可见、或存在可见子节点的节点 */
export function menuTreeForRole(roleId: string): MockMenuItem[] {
  const codes = new Set(codesForRole(roleId));
  const filter = (items: MockMenuItem[]): MockMenuItem[] =>
    items
      .map((item) => ({
        ...item,
        children: item.children ? filter(item.children) : undefined,
      }))
      .filter((item) => {
        const selfVisible = !item.code || codes.has(item.code);
        const hasVisibleChild = Boolean(item.children && item.children.length);
        return selfVisible || hasVisibleChild;
      });
  return filter(menuTree);
}
