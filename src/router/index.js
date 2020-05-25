import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/redirect',
    /* eslint-disable */
    component: () => import('@/views/layout/Layout'),
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/a',
    component: () => import('@/views/layout/Layout'),
    meta: {
      title: '',
      icon: 'test'
    },
    alwaysShow: true,
    children: []
  },
  {
    path: '/',
    component: () => import('@/views/layout/Layout'),
    redirect: 'home',
    hidden: true,
    // alwaysShow: true,
    meta: {
      title: '首页',
      icon: 'fa fa-home'
    },
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index'),
        name: 'center',
        meta: {
          title: '首页',
          icon: 'fa fa-home',
          noCache: true
        },
        hidden: true
      }
    ]
  },
  {
    path: '/signupSubmit',
    name: 'signupSubmit',
    component: () => import('@/views/signupSubmit/index'),
    hidden: true
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
