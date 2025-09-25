import Layout from '@/layout/index.vue';
//对外暴露配置路由(常量路由):全部用户都可以访问到的路由
export const constantRoute = [
  {
    //登录
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
    meta: {
      title: '登录', //菜单标题
      hidden: true, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
      icon: 'Promotion', //菜单文字左侧的图标,支持element-plus全部图标
    },
  },
  {
    //登录成功以后展示数据的路由
    path: '/',
    component: Layout,
    name: 'layout',
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          hidden: false,
          icon: 'HomeFilled',
        },
      },
    ],
  },
  {
    //404
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
    meta: {
      title: '404',
      hidden: true,
      icon: 'DocumentDelete',
    },
  },
  {
    path: '/system',
    component: Layout,
    name: 'system',
    redirect: '/userList',
    meta: {
      title: '系统管理',
      icon: 'Setting',
      roles: ['sys:manage'],
    },
    children: [
      {
        path: '/system/userList',
        component: () => import('@/views/system/User/UserList.vue'),
        name: 'userList',
        meta: {
          title: '用户管理',
          icon: 'User',
          roles: ['sys:user'],
        },
      },
      {
        path: '/system/roleList',
        component: () => import('@/views/system/Role/RoleList.vue'),
        name: 'roleList',
        meta: {
          title: '角色管理',
          icon: 'UserFilled',
          roles: ['sys:role'],
        },
      },
      {
        path: '/system/menuList',
        component: () => import('@/views/system/Menu/MenuList.vue'),
        name: 'menuList',
        meta: {
          title: '菜单管理',
          icon: 'Monitor',
          roles: ['sys:menu'],
        },
      },
    ],
  },
  {
    path: '/goodsRoot',
    component: Layout,
    name: 'goodsRoot',
    redirect: '/category',
    meta: {
      title: '商品管理',
      icon: 'Goods',
      roles: ['sys:goodsRoot'],
    },
    children: [
      {
        path: '/goodsRoot/category',
        component: () => import('@/views/category/CategoryList.vue'),
        name: 'category',
        meta: {
          title: '商品类型',
          icon: 'UserFilled',
          roles: ['sys:category'],
        },
      },
      {
        path: '/goodsRoot/goodsList',
        component: () => import('@/views/goods/GoodsList.vue'),
        name: 'goodsList',
        meta: {
          title: '商品信息',
          icon: 'Wallet',
          roles: ['sys:goodsList'],
        },
      },
      {
        //任意路由
        path: '/:pathMatch(.*)*',
        redirect: '/404',
        name: 'Any',
        meta: {
          title: '任意路由',
          hidden: true,
          icon: 'DataLine',
        },
      },
    ],
  },
];
