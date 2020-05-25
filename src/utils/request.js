import axios from 'axios'
import qs from 'qs'


import { Message } from 'element-ui'
import * as z from './com.js'

import router from '../router'

const service = axios.create({
  baseURL: '/platform', // api 的 base_url
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  transformRequest: [
    function(info) {
      let data = info
      // 转换data格式
      if (data instanceof FormData) {
        return data
      }
      data = qs.stringify(data)
      return data
    }
  ]
})

service.interceptors.request.use(
  config => {
    z.ld()
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    z.lc()
    const res = response.data
    if (res.code === 200) {
      return res
    } else if (res.code === 99999998) {
      router.push('/login')
    } else {
      z.error(res.msg)
      return Promise.reject(res.msg)
    }
  },

  error => {
    Message({
      message: '服务器繁忙，请重新刷新页面访问',
      type: 'error',
      duration: 2 * 1000
    })
    router.push('/login')
    return Promise.reject(error)
  }
)

export default service
