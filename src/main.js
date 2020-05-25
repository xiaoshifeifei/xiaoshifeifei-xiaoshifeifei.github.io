import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import filterList from './utils/filters'

Vue.use(filterList)


// //  mock假数据，对接是可以去掉
import './utils/mock_utils/index'


import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import CustomTable from '@/components/Table'

Vue.use(CustomTable) // 自定义全局组件的时候需要Vue.use();

Vue.component('custom-table', CustomTable) // 初始化组件

import CustomForm from '@/components/CustomForm'

Vue.use(CustomForm) // 自定义全局组件的时候需要Vue.use();

Vue.component('custom-form', CustomForm) // 初始化组件

import searchForm from '@/views/components/searchForm'
Vue.use(searchForm) // 自定义全局组件的时候需要Vue.use();
Vue.component('search-form', searchForm) // 初始化组件

import '@/styles/index.scss' // global css
import './styles/fontawesome.css'
import './styles/iconfont.css'

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

import './styles/symbolIcon.css'

import './permission'

import md5 from 'js-md5'
Vue.prototype.$md5 = md5

Vue.use(Element, {
  size: 'mini'
  /* eslint-disable */
})

Vue.use(Viewer)
Viewer.setDefaults({
  Options: {
    inline: true,
    button: true,
    navbar: true,
    title: true,
    toolbar: true,
    tooltip: true,
    movable: true,
    zoomable: true,
    rotatable: true,
    scalable: false,
    transition: true,
    fullscreen: false,
    keyboard: true,
    url: 'data-source'
  },
  zIndex: 9999
})

import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
