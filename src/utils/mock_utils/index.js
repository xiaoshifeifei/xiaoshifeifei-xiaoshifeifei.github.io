/*
 * @Description:
 * @Date: 2019-10-08 22:27:09
 * @LastEditors: 自己洗小红花
 * @LastEditTime: 2020-03-16 10:47:52
 */
// 引入mockjs
import {
  GET
} from './types/get'
import {
  POST
} from './types/post'
import {
  DELETE
} from './types/delete'

const Mock = require('mockjs')
Mock.setup({
  timeout: '500-2000' // 表示响应时间介于 200 和 600 毫秒之间，默认值是'10-100'。
})

for (const api in GET) {
  // Mock.mock(api, 'get', GET[api])
  Mock.mock(RegExp(api + '\\?.*'), 'get', GET[api])
}
for (const api in POST) {
  Mock.mock(api, 'post', POST[api])
}
for (const api in DELETE) {
  Mock.mock(RegExp(api + '\\?.*'), 'delete', DELETE[api])
}

/** 详细请查看 https://github.com/nuysoft/Mock/wiki/Basic
 Type             Method
 Basic            boolean, natural, integer, float, character, string, range, date, time, datetime, now
 Image            image, dataImage
 Color            color
 Text             paragraph, sentence, word, title, cparagraph, csentence, cword, ctitle
 Name             first, last, name, cfirst, clast, cname
 Web              url,domain, email, ip, tld
 Address          area, region
 Helper           capitalize, upper, lower, pick, shuffle
 Miscellaneous    guid, id
 */
