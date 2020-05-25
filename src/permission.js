import router from './router'
import store from './store/index.js'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import request from '@/utils/request'
import * as z from '@/utils/com.js'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect', '/signupSubmit'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (whiteList.indexOf(to.path) === -1) {
    // 在免登录白名单，直接进入
    if (location.hash === '#/' || localStorage.loginInfo === 1) {
      next('/login') // 否则全部重定向到登录页
      NProgress.done()
    } else if (store.getters.user === null) {
      // 判断当前用户是否已拉取完user_info信息
      request({
        // url: '/user/info',
        url: 'sys/login/getlogininfo',
        method: 'get' // 新的是get
      }).then(res => {
        const user = res.data
        store.dispatch('setUser', user)
        request({
          url: '/core/sysmenu/authtree',
          method: 'post',
          data: {
            roleId: user.roleId
          }
        }).then(resChild => {
          // 生成可访问的路由表
          if (resChild.data.zones) {
            store
              .dispatch('GenerateRoutes', resChild.data)
              .then(() => {
                console.log(store.getters.addRouters)
                router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                if (
                  user.roleId &&
                  user.roleId === 'bd9ac80a34274513be1f98f3cd40d4bd'
                ) {
                  router.push('/home')
                  next()
                } else {
                  next({
                    ...to,
                    replace: true
                  }) // hack方法 确保addRoutes已完成 ,set the replace: true 所以导航不会留下历史记录
                }

                NProgress.done()
              })
              .catch(err => {
                store.dispatch('LogOut').then(() => {
                  z.error(err.message || '验证失败，请重新登录！')
                  next({
                    path: '/login'
                  })
                })
              })
          } else {
            next({
              ...to,
              replace: true
            })
          }
        })
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
