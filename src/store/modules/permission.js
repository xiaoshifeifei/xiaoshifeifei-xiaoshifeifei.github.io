import { constantRouterMap } from '@/router'

// 这页是动态生成路由的permission

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    // 动态添加菜单
    GenerateRoutes({ commit }, root) {
      return new Promise(resolve => {
        const accessedRouters = []

        function createMenu(router) {
          // 修改menu menutree
          const menu = {
            path: router.url ? router.url : '',
            name: router.name,
            component: () => import(`@/views/${router.component}`),
            redirect: router.redirect, // 重定向
            alwaysShow: router.alwaysShow, // 总是可见
            hidden: router.hidden, // 是否隐藏
            meta: {
              title: router.name,
              icon: router.icon,
              noCache: router.cache,
              keepAlive: router.cache
            }
          }

          if (router.zones) {
            let item = ''
            menu.children = []
            for (let i = 0; i < router.zones.length; i++) {
              item = router.zones[i]
              if (!item.hidden) {
                menu.children.push(createMenu(item))
              }
            }
          }
          return menu
        }

        for (let i = 0; i < root.zones.length; i++) {
          if (!root.zones[i].hidden) {
            accessedRouters.push(createMenu(root.zones[i]))
          }
        }

        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
