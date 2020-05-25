/*
 * @Description:
 * @Date: 2020-03-05 11:09:43
 * @LastEditors: 自己洗小红花
 * @LastEditTime: 2020-03-19 11:51:02
 */
import {
  util
} from '../util'
export const DELETE = {
  '/order/myorder/delete': (req, res) => {

    return {
      code: 200,
      message: '作废订单成功',
      result: null,
      success: true,
    }
  },
  '/order/myorder/deleteBatch': (req, res) => {
    return {
      code: 200,
      message: '作废订单成功',
      result: null,
      success: true,
    }
  },
  '/basics/delete': (req, res) => {
    return {
      code: 200,
      message: '删除成功',
      result: null,
      success: true,
    }
  },
  '/basics/deleteBatch': (req, res) => {
    return {
      code: 200,
      message: '删除成功',
      result: null,
      success: true,
    }
  },
  '/customer/delete': (req, res) => {
    return {
      code: 200,
      message: '删除成功',
      result: null,
      success: true,
    }
  },
  '/customer/deleteBatch': (req, res) => {
    return {
      code: 200,
      message: '删除成功',
      result: null,
      success: true,
    }
  },

  //  禁用启用
  '/basics/customer/deleteStatus': (req, res) => {
    return {
      code: 200,
      message: '禁用/启用成功',
      result: null,
      success: true,
    }
  },

  //  禁用启用
  '/basics/carrier/deleteStatus': (req, res) => {
    return {
      code: 200,
      message: '禁用/启用成功',
      result: null,
      success: true,
    }
  },
  '/basics/carrier/deleteBatch': (req, res) => {
    return {
      code: 200,
      message: '删除成功',
      result: null,
      success: true,
    }
  },
  '/order/createOrder/deleteBatch': (req, res) => {
    return {
      code: 200,
      message: '删除成功',
      result: null,
      success: true,
    }
  },
}
