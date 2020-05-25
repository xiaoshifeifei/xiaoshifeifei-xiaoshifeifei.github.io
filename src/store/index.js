import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import ticketOrder from './modules/ticketOrder'
import checkOrder from './modules/checkOrder'
import companyOrder from './modules/companyOrder'
import orderType from './modules/orderType'

import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    user,
    ticketOrder,
    checkOrder,
    companyOrder,
    orderType
  },
  getters
})

export default store
