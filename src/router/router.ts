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
    //登录成功以后展示数据的路由
    path: '/user',
    component: Layout,
    name: 'User',
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/user/userInfo',
    children: [
      {
        path: '/user/userInfo',
        component: () => import('@/views/userInfo/index.vue'),
        meta: {
          title: '个人信息',
          hidden: false,
          icon: 'User',
        },
      },
    ],
  },
  {
    //登录成功以后展示数据的路由
    path: '/ws',
    component: Layout,
    name: 'Ws',
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/ws/wsTest',
    children: [
      {
        path: '/ws/wsTest',
        component: () => import('@/views/ws/test/WsTest.vue'),
        meta: {
          title: 'ws测试',
          hidden: false,
          icon: 'ChatSquare',
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
];
