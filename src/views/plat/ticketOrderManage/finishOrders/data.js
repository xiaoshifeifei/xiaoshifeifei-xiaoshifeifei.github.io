import { regionData } from 'element-china-area-data'

export const baseFormInfo = () => {
  return {
    ref: {},
    data: {
      customerId: '',
      customerName: '',
      createTime: '',
      distributionTime: '',
      businessType: '',
      transportMode: '',
      transportType: '',
      orderNo: '',
      deliveryType: '',
      takeDeliveryTime: '',
      notes: ''
    },
    labelWidth: '100px',
    fieldList: [
      {
        label: '客户名称',
        value: 'customerId',
        type: 'select',
        filterable: true,
        list: 'customerList',
        selectKey: 'name',
        selectValue: 'id',
        event: 'handleSelectCustomer'
      },
      {
        label: '派车日期',
        value: 'distributionTime',
        type: 'date',
        dateType: 'datetime'
      },
      {
        label: '下单日期',
        value: 'createTime',
        type: 'date',
        dateType: 'datetime'
      },
      {
        label: '运单号',
        value: 'orderNo',
        type: 'input'
      },
      {
        label: '业务类型',
        value: 'businessType',
        type: 'select',
        list: 'businessTypeList',
        selectKey: 'label',
        selectValue: 'value'
      },
      {
        label: '运输模式',
        value: 'transportMode',
        type: 'select',
        list: 'transprotModeList',
        selectKey: 'label',
        selectValue: 'value'
      },
      {
        label: '运输类型',
        value: 'transportType',
        type: 'select',
        list: 'transportTypeList',
        selectKey: 'label',
        selectValue: 'value'
      },
      {
        label: '配送方式',
        value: 'deliveryType',
        type: 'select',
        list: 'deliveryTypeList',
        selectKey: 'label',
        selectValue: 'value'
      },
      {
        label: '到货日期',
        value: 'takeDeliveryTime',
        type: 'date',
        dateType: 'datetime'
      },
      {
        label: '备注',
        value: 'notes',
        type: 'input'
      }
    ],
    rules: {
      customerId: [
        {
          required: true,
          message: '请选择客户名称',
          trigger: ['blur', 'change']
        }
      ],
      distributionTime: [
        {
          required: true,
          message: '请选择派车日期',
          trigger: ['blur', 'change']
        }
      ],
      createTime: [
        {
          required: true,
          message: '请下单日期',
          trigger: ['blur', 'change']
        }
      ],
      orderNo: [
        {
          required: true,
          message: '请输入运单号',
          trigger: ['blur', 'change']
        }
      ],
      businessType: [
        {
          required: true,
          message: '请选择业务类型',
          trigger: ['blur', 'change']
        }
      ],
      transportMode: [
        {
          required: true,
          message: '请选择运输模式',
          trigger: ['blur', 'change']
        }
      ],
      transportType: [
        {
          required: true,
          message: '请选择运输类型',
          trigger: ['blur', 'change']
        }
      ],
      deliveryType: [
        {
          required: true,
          message: '请选择配送方式',
          trigger: ['blur', 'change']
        }
      ],
      takeDeliveryTime: [
        {
          required: true,
          message: '请选择到货日期',
          trigger: ['blur', 'change']
        }
      ]
    }
  }
}

export const sendFormInfo = () => {
  return {
    ref: {},
    labelWidth: '80px',
    data: {
      shipperUnit: '',
      shipperPerson: '',
      shipperTel: '',
      shipperAddress: '',
      shipperAddressCode: '',
      shipperAddressDetial: ''
    },
    fieldList: [
      {
        label: '发货单位',
        value: 'shipperUnit',
        type: 'select',
        list: 'addressList',
        selectKey: 'consigneeUnit',
        selectValue: 'consigneeId',
        event: 'handleChangeShipperUnit'
      },
      {
        label: '发货人',
        value: 'shipperPerson',
        type: 'input'
      },
      {
        label: '联系电话',
        value: 'shipperTel',
        type: 'number'
      },
      {
        label: '详细地址',
        value: 'shipperAddressDetial',
        type: 'input'
      },
      {
        label: '发货地区',
        value: 'shipperAddress',
        type: 'slot'
      }
    ],
    rules: {
      shipperUnit: [
        {
          required: true,
          message: '请选择发货单位',
          trigger: ['blur', 'change']
        }
      ],
      shipperPerson: [
        {
          required: true,
          message: '请输入发货人姓名',
          trigger: ['blur', 'change']
        }
      ],
      shipperTel: [
        {
          required: true,
          message: '请输入发货人联系电话',
          trigger: ['blur', 'change']
        }
      ],
      shipperAddress: [
        {
          required: true,
          message: '请选择发货地区',
          trigger: ['blur', 'change']
        }
      ]
    }
  }
}

export const getFormInfo = () => {
  return {
    ref: {},
    labelWidth: '80px',
    data: {
      receiverUnit: '',
      receiverPerson: '',
      receiverTel: '',
      receiverAddress: '',
      receiverAddressCode: '',
      receiverAddressDetial: ''
    },
    fieldList: [
      {
        label: '收货单位',
        value: 'receiverUnit',
        type: 'select',
        list: 'addressList',
        selectKey: 'consigneeUnit',
        selectValue: 'consigneeId',
        event: 'handleChangeReceiverUnit'
      },
      {
        label: '收货人',
        value: 'receiverPerson',
        type: 'input'
      },
      {
        label: '联系电话',
        value: 'receiverTel',
        type: 'number'
      },
      {
        label: '详细地址',
        value: 'receiverAddressDetial',
        type: 'input'
      },
      {
        label: '收货地区',
        value: 'receiverAddress',
        type: 'slot'
      }
    ],
    rules: {
      receiverUnit: [
        {
          required: true,
          message: '请输入收货单位',
          trigger: ['blur', 'change']
        }
      ],
      receiverPerson: [
        {
          required: true,
          message: '请输入收货人姓名',
          trigger: ['blur', 'change']
        }
      ],
      receiverTel: [
        {
          required: true,
          message: '请输入收货人联系电话',
          trigger: ['blur', 'change']
        }
      ],
      receiverAddress: [
        {
          required: true,
          message: '请选择收货地区',
          trigger: ['blur', 'change']
        }
      ]
    }
  }
}

export const stowageFormInfo = () => {
  return {
    ref: {},
    data: {
      vehicleNumber: '',
      licenseColor: '',
      driverName: '',
      driverTel: '',
      driverIdCard: '',
      payeeName: '',
      payeeAccount: '',
      payeeOpeningAccount: ''
    },
    labelWidth: '100px',
    fieldList: [
      {
        label: '车牌号',
        value: 'vehicleNumber',
        type: 'input'
      },
      {
        label: '车牌颜色',
        value: 'licenseColor',
        type: 'select',
        list: 'licenseColorList',
        selectKey: 'label',
        selectValue: 'value'
      },
      {
        label: '车牌',
        value: 'plate',
        type: 'slot'
      },
      {
        label: '司机',
        value: 'driverName',
        type: 'input'
      },
      {
        label: '联系方式',
        value: 'driverTel',
        type: 'input'
      },
      {
        label: '身份证号',
        value: 'driverIdCard',
        type: 'input'
      },
      {
        label: '收款人',
        value: 'payeeName',
        type: 'input'
      },
      {
        label: '银行账号',
        value: 'payeeAccount',
        type: 'number'
      },
      {
        label: '开户行',
        value: 'payeeOpeningAccount',
        type: 'input'
      }
    ],
    rules: {
      vehicleNumber: [
        {
          required: true,
          message: '请输入车牌号',
          trigger: ['blur', 'change']
        }
      ],
      licenseColor: [
        {
          required: true,
          message: '请选择车辆颜色',
          trigger: ['blur', 'change']
        }
      ],
      driverName: [
        {
          required: true,
          message: '请输入司机姓名',
          trigger: ['blur', 'change']
        }
      ],
      driverTel: [
        {
          required: true,
          message: '请输入联系方式',
          trigger: ['blur', 'change']
        }
      ],
      driverIdCard: [
        {
          required: true,
          message: '请输入身份证号',
          trigger: ['blur', 'change']
        }
      ],
      payeeName: [
        {
          required: true,
          message: '请输入收款人',
          trigger: ['blur', 'change']
        }
      ],
      payeeAccount: [
        {
          required: true,
          message: '请输入银行账号',
          trigger: ['blur', 'change']
        }
      ],
      payeeOpeningAccount: [
        {
          required: true,
          message: '请输入开户行',
          trigger: ['blur', 'change']
        }
      ]
    }
  }
}

export const settleFormInfo = () => {
  return {
    ref: {},
    data: {
      freightRevenue: '',
      driverPrice: '',
      differentceRate: '',
      carrierCompanyId: '',
      carrierCompanyName: '',
      freightCost: '',
      profitRate: '',
      payType: '',
      paymentMode: '',
      settleDays: ''
    },
    labelWidth: '100px',
    fieldList: [
      {
        label: '运费收入',
        value: 'freightRevenue',
        type: 'input',
        event: 'handleChangeDifferentceRate'
      },
      {
        label: '司机运费',
        value: 'driverPrice',
        type: 'input',
        event: 'handleChangeDifferentceRate'
      },
      {
        label: '差额率',
        value: 'differentceRate',
        type: 'input',
        disabled: true
      },
      {
        label: '承运商',
        value: 'carrierCompanyName',
        type: 'select',
        list: 'carrierList',
        selectKey: 'name',
        selectValue: 'name',
        event: 'hanldeChangeCarrier'
      },
      {
        label: '承运商运费',
        value: 'freightCost',
        type: 'input',
        event: 'handleChangeProfitRate'
      },
      {
        label: '利润率',
        value: 'profitRate',
        type: 'input',
        disabled: true
      },
      {
        label: '付款方式',
        value: 'payType',
        type: 'select',
        list: 'payTypeList',
        selectKey: 'label',
        selectValue: 'value'
      },
      {
        label: '结算方式',
        value: 'paymentMode',
        type: 'select',
        list: 'paymentModeList',
        selectKey: 'label',
        selectValue: 'value'
      },
      {
        label: '结算天数',
        value: 'settleDays',
        type: 'input'
      }
    ],
    rules: {
      freightRevenue: [
        {
          required: true,
          message: '请输入运费收入',
          trigger: ['blur', 'change']
        }
      ],
      driverPrice: [
        {
          required: true,
          message: '请输入司机运费',
          trigger: ['blur', 'change']
        }
      ],
      differentceRate: [
        {
          required: true,
          message: '请输入差额率',
          trigger: ['blur', 'change']
        }
      ],
      carrierCompanyName: [
        {
          required: true,
          message: '请选择承运商',
          trigger: ['blur', 'change']
        }
      ],
      freightCost: [
        {
          required: true,
          message: '请输入承运商运费',
          trigger: ['blur', 'change']
        }
      ],
      profitRate: [
        {
          required: true,
          message: '请输入利润率',
          trigger: ['blur', 'change']
        }
      ],
      payType: [
        {
          required: true,
          message: '请选择付款方式',
          trigger: ['blur', 'change']
        }
      ],
      paymentMode: [
        {
          required: true,
          message: '请选择结算方式',
          trigger: ['blur', 'change']
        }
      ],
      settleDays: [
        {
          required: true,
          message: '请输入结算天数',
          trigger: ['blur', 'change']
        }
      ]
    }
  }
}

export const listTypeInfo = () => {
  return {
    customerList: [],
    businessTypeList: [
      {
        label: '干线普货运输',
        value: 'ARTERY_GENERAL_CARGO'
      },
      {
        label: '集装箱运输',
        value: 'CONTAINER_TRANSPORTATION'
      },
      {
        label: '城市配送',
        value: 'CITY'
      },
      {
        label: '农村配送',
        value: 'VILLAGE'
      },
      {
        label: '其他',
        value: 'OTHER'
      }
    ],
    transprotModeList: [
      {
        label: '整车',
        value: 'WHOLE'
      },
      {
        label: '零担',
        value: 'LTL'
      }
    ],
    transportTypeList: [
      {
        label: '海上运输',
        value: 'SHIPPING'
      },
      {
        label: '铁路运输',
        value: 'RAILWAY'
      },
      {
        label: '公路运输',
        value: 'HIGHWAY'
      },
      {
        label: '航空运输',
        value: 'AIR'
      }
    ],
    goodsTypeList: [
      {
        label: '电子产品',
        value: '90'
      },
      {
        label: '商品汽车',
        value: '92'
      },
      {
        label: '冷藏货物',
        value: '93'
      },
      {
        label: '大宗货物',
        value: '94'
      },
      {
        label: '快速消费',
        value: '95'
      },
      {
        label: '农产品',
        value: '96'
      },
      {
        label: '其他',
        value: '999'
      }
    ],
    unitList: [
      {
        label: '件',
        value: 'THING'
      },
      {
        label: '包',
        value: 'PACKAGE'
      },
      {
        label: '箱',
        value: 'BOX'
      },
      {
        label: '托',
        value: 'STIPULES'
      }
    ],
    addressList: [],
    deliveryTypeList: [
      {
        label: '上门自取',
        value: 'TAKE'
      },
      {
        label: '送货上门',
        value: 'DELIVERY'
      }
    ],
    payTypeList: [
      {
        label: '现金转账',
        value: 0
      },
      {
        label: '承兑汇票',
        value: 1
      }
    ],
    paymentModeList: [
      {
        label: '到付',
        value: 1
      },
      {
        label: '月结',
        value: 2
      },
      {
        label: '现结',
        value: 3
      }
    ],
    goodsList: [],
    licenseColorList: [
      {
        label: '黄',
        value: 'YELLOW'
      },
      {
        label: '白',
        value: 'WHITE'
      },
      {
        label: '黑',
        value: 'BLACK'
      },
      {
        label: '蓝',
        value: 'BLUE'
      },
      {
        label: '绿',
        value: 'GREEN'
      }
    ],
    carrierList: [],
    areaList: regionData
  }
}
