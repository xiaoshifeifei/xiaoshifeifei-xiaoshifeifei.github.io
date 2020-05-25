const filterList = Vue => {
  Vue.filter('formatCompanyOrderStatus', status => {
    if (status === 1) {
      return '待接单'
    } else if (status === 4) {
      return '被拒绝'
    } else if (status === 6) {
      return '调度中'
    } else if (status === 7) {
      return '已派单'
    } else if (status === 8) {
      return '部分运输中'
    } else if (status === 9) {
      return '运输中'
    } else if (status === 10) {
      return '部分签收'
    } else if (status === 11) {
      return '已签收'
    } else if (status === 12) {
      return '已完成'
    }
  })

  Vue.filter('formatSettleType', type => {
    if (type === 1) {
      return '到付'
    } else if (type === 2) {
      return '月结'
    } else if (type === 3) {
      return '现结'
    }
  })

  Vue.filter('formatGoodsType', type => {
    if (type === '90') {
      return '电子产品'
    } else if (type === '92') {
      return '商品汽车'
    } else if (type === '93') {
      return '冷藏货物'
    } else if (type === '94') {
      return '大宗货物'
    } else if (type === '95') {
      return '快速消费'
    } else if (type === '96') {
      return '农产品'
    } else if (type === '999') {
      return '其他'
    }
  })

  Vue.filter('formatGoodsUnitType', type => {
    if (type === 'THING') {
      return '件'
    } else if (type === 'PACKAGE') {
      return '包'
    } else if (type === 'BOX') {
      return '箱'
    } else if (type === 'STIPULES') {
      return '托'
    }
  })

  Vue.filter('formatTransportMode', type => {
    if (type === 'WHOLE') {
      return '整车'
    } else if (type === 'LTL') {
      return '零担'
    }
  })

  Vue.filter('formatOrderConfirm', type => {
    if (type === true) {
      return '已确认'
    } else if (type === false) {
      return '待修改'
    } else {
      return '待确认'
    }
  })

  Vue.filter('formatFreightOrderStatus', type => {
    if (type === '1') {
      return '已出价'
    } else if (type === '2') {
      return '未中标'
    } else if (type === '3') {
      return '已答复'
    } else if (type === '4') {
      return '未答复'
    } else if (type === '5') {
      return '已中标'
    }
  })

  Vue.filter('formatPlatFreightOrderStatus', type => {
    if (type === 1) {
      return '询价中'
    } else if (type === 2) {
      return '竞价中'
    } else if (type === 3) {
      return '已结束'
    }
  })

  Vue.filter('formatOrderTrackStatus', type => {
    if (type === 6) {
      return '调度中'
    } else if (type === 9) {
      return '运输中'
    } else if (type === 11) {
      return '签收'
    } else if (type === 12) {
      return '已完成'
    }
  })

  Vue.filter('formatInvoiceType', type => {
    if (type === 1) {
      return '普通发票'
    } else if (type === 2) {
      return '增值税发票'
    }
  })

  Vue.filter('formatCheckStatus', type => {
    if (type === 'ALL') {
      return '全部核销'
    } else if (type === 'PART') {
      return '部分核销'
    } else if (type === 'NONE') {
      return '未核销'
    }
  })

  Vue.filter('formatDriverStatus', type => {
    if (type === 0) {
      return '通过'
    } else if (type === 3) {
      return '待审核'
    } else if (type === 4) {
      return '未通过'
    }
  })
}

// 我也不知道为什么一定要用install才可以，好像vue的prototype里是调用install方法
export default {
  install: filterList
}
