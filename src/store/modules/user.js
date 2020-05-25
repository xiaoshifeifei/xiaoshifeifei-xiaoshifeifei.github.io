import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    user: null,
    token: getToken(),
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_TOKEN: (state, tokenInfo) => {
      state.token = tokenInfo
    },
    SET_USER: (state, userInfo) => {
      state.user = userInfo
    },
    SET_SETTING: (state, settingInfo) => {
      state.setting = settingInfo
    }
  },

  actions: {
    LogOn({ commit }, tokenInfo) {
      commit('SET_TOKEN', tokenInfo)
      setToken(tokenInfo)
    },

    setUser({ commit }, userInfo) {
      commit('SET_USER', userInfo)
    },

    LogOut({ commit }) {
      commit('SET_TOKEN', '')
      removeToken()
    }
  }
}

export default user
