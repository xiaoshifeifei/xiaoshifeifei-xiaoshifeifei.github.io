import { Message, MessageBox, Loading } from 'element-ui'

export const imageUrl = ' '

export function success(msg, time) {
  Message({
    message: msg,
    type: 'success',
    duration: time ? time : 3000
  })
}

export function warning(msg, time) {
  Message({
    message: msg,
    type: 'warning',
    duration: time ? time : 3000
  })
}

export function info(msg, time) {
  Message({
    message: msg,
    type: 'info',
    duration: time ? time : 3000
  })
}

export function error(msg, time) {
  Message({
    message: msg,
    type: 'error',
    duration: time ? time : 3000
  })
}

export function confirm(msg, fnSuccess, fnError) {
  MessageBox.confirm(msg, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      if (typeof fnSuccess == 'function') {
        fnSuccess()
      }
    })
    .catch(() => {
      if (typeof fnError == 'function') {
        fnError()
      }
    })
}

export function alert(msg, fnSuccess) {
  MessageBox.alert(msg, '提示', {
    confirmButtonText: '确定',
    type: 'warning'
  })
    .then(() => {
      if (typeof fnSuccess == 'function') {
        fnSuccess()
      }
    })
}

export function url(url) {
  if (!url) {
    url = location.search.substring(1)
  } else {
    url = url.substr(url.indexOf('?') + 1)
  }
  const args = {}
  const query = decodeURI(url)
  const pairs = query.split('&')
  for (let i = 0; i < pairs.length; i++) {
    const pos = pairs[i].indexOf('=')
    if (pos === -1) {
      continue
    }
    const argname = pairs[i].substring(0, pos)
    const value = pairs[i].substring(pos + 1)
    args[argname] = decodeURI(value)
  }
  return args
}

let loadingInstance = {}

export function ld() {
  loadingInstance = Loading.service({
    fullscreen: true,
    background: 'rgba(255,255,255,.5)'
  })
}

export function lc() {
  loadingInstance.close()
}

export function formatDate(date, fmt) {
  const dates = new Date(date)
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (dates.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  const o = {
    'M+': dates.getMonth() + 1,
    'd+': dates.getDate(),
    'h+': dates.getHours(),
    'm+': dates.getMinutes(),
    's+': dates.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length)
      )
    }
  }
  return fmt
}

// 获取地址栏参数
export function ctoUrlParam(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return decodeURI(r[2])
  }
  return null
}

export function Trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

// 设置cookie
export function setCookie(name, value) {
  document.cookie = name + '=' + value + ';path=/;'
}
// 清除cookie
export function clearCookie(name) {
  document.cookie = name + '=;  expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}
// 获取cookie
export function getCookie(name) {
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  const arr = document.cookie.match(reg)
  if (arr) {
    return unescape(arr[2])
  } else {
    return null
  }
}
