/*
 * @Description:
 * @Date: 2019-10-08 22:27:09
 * @LastEditors: 自己洗小红花
 * @LastEditTime: 2020-03-05 10:34:31
 */
import Mock from 'mockjs'
const Random = Mock.Random
export const POST = {
  //  登陆
  '/platform/sys/login/user': (req, res) => {
    console.log(22222222222222)
    const body = JSON.parse(req.body)
    return {
      success: true,
      message: '登录成功',
      code: 200,
      result: {
        id: 'a75d45a015c44384a04449ee80dc3503',
        username: 'jeecg',
        realname: 'jeecg测试',
        avatar: 'user/20190220/e1fe9925bc315c60addea1b98eb1cb1349547719_1550656892940.jpg',
        birthday: null,
        sex: 2,
        email: '418799587@qq.com',
        phone: '',
        orgCode: 'A01A04',
        status: 1,
        delFlag: '0',
        workNo: 'A002',
        post: '002',
        telephone: null,
        createBy: 'admin',
        createTime: '2019-02-13 16:02:36',
        updateBy: 'admin',
        updateTime: '2020-02-24 15:32:08',
        activitiSync: '1',
        identity: 1,
        departIds: '',
        departs: [],
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODI3ODgyMzIsInVzZXJuYW1lIjoiamVlY2cifQ.egxCYNeOD-Dcl0u1tANDjz28kl8nFGXIc8sipSYtEAI'
      },
      timestamp: 1582786432130
    }
  },

}
