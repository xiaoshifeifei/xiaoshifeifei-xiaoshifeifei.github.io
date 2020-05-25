/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const validMap = ['admin', 'editor']
  return validMap.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  /* eslint-disable */
  const re = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
  return re.test(email)
}

export function checkPhone(rule, value, callback) {
  const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
  if (!value) {
    return callback(new Error('电话号码不能为空'))
  }
  setTimeout(() => {
    if (!Number.isInteger(+value)) {
      callback(new Error('请输入数字值'))
    } else if (phoneReg.test(value)) {
      callback()
    } else {
      callback(new Error('电话号码格式不正确'))
    }
  }, 100)
}
