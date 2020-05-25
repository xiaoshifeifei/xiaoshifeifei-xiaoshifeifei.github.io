import { regionData } from 'element-china-area-data'
import { checkPhone } from '@/utils/validate'

export const baseFormInfo = () => {
  return {
    ref: {},
    labelWidth: '80px',
    data: {
      businessType: '',
      distributionTime: '',
      transportMode: '',
      transportType: '',
      takeDeliveryWay: '',
      carAsk: '',
      carType: '',
      deliveryType: '',
      takeDeliveryTime: '',
      notes: ''
    },
    fieldList: [
      {
        label: '业务类型',
        value: 'businessType',
        type: 'select',
        list: 'businessTypeList',
        selectKey: 'label',
        selectValue: 'value'
      },
      {
        label: '派车日期',
        value: 'distributionTime',
        type: 'date',
        dateType: 'datetime'
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
        label: '提货方式',
        value: 'takeDeliveryWay',
        type: 'select',
        list: 'takeDeliveryWayList',
        selectKey: 'label',
        selectValue: 'value'
      },
      {
        label: '车辆要求',
        value: 'carAsk',
        type: 'select',
        list: 'carAskList',
        selectKey: 'label',
        selectValue: 'value'
      },
      {
        label: '车辆类型',
        value: 'carType',
        type: 'select',
        list: 'carTypeList',
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
      businessType: [
        {
          required: true,
          message: '请选择业务类型',
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
      takeDeliveryWay: [
        {
          required: true,
          message: '请选择提货方式',
          trigger: ['blur', 'change']
        }
      ],
      carAsk: [
        {
          required: true,
          message: '请选择车辆要求',
          trigger: ['blur', 'change']
        }
      ],
      carType: [
        {
          required: true,
          message: '请选择车辆类型',
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
      shipperId: '',
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
        filterable: true,
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
      shipperAddressDetial: [
        {
          required: true,
          message: '请输入详细地址',
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
      receiverId: '',
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
        filterable: true,
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
          message: '请选择收货单位',
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
      receiverAddressDetial: [
        {
          required: true,
          message: '请输入详细地址',
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

export const settleFormInfo = () => {
  return {
    ref: {},
    data: {
      freightRevenue: '',
      payType: '',
      paymentMode: '',
      settleDays: ''
    },
    labelWidth: '100px',
    fieldList: [
      {
        label: '运费收入',
        value: 'freightRevenue',
        type: 'number'
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
        type: 'number'
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

export const carrierFormInfo = () => {
  return {
    ref: {},
    labelWidth: '110px',
    data: {
      orderId: '',
      carrierCompanyId: '',
      carrierCompanyName: '',
      freightRevenue: '',
      attachmentUrl: ''
    },
    fieldList: [
      {
        label: '企业',
        value: 'carrierCompanyName',
        type: 'select',
        list: 'carrierList',
        selectKey: 'name',
        selectValue: 'name',
        event: 'handleChangeCarrier'
      },
      {
        label: '承运商运费',
        value: 'freightRevenue',
        type: 'number'
      },
      {
        label: '附件',
        value: 'attachmentUrl',
        type: 'slot'
      }
    ],
    rules: {
      carrierCompanyName: {
        required: true,
        message: '请选择承运商',
        trigger: ['blur', 'change']
      },
      freightRevenue: {
        required: true,
        message: '请输入承运商运费',
        trigger: ['blur', 'change']
      }
    }
  }
}

export const sendCarFormInfo = () => {
  return {
    ref: {},
    labelWidth: '110px',
    data: {
      companyId: '',
      companyName: '',
      inOut: 'IN',

      driverId: '',
      driverName: '',
      driverTel: '',
      copilotId: '',
      price: '',

      orderId: '',
      orderNo: '',

      vehicleId: '',
      vehicleNumber: '',
      vehicleNumberType: '',
      roadTransportCertificate: '',
      vehicleTonnage: ''
    },
    fieldList: [
      {
        label: '车牌号',
        value: 'vehicleId',
        type: 'select',
        list: 'cars',
        selectKey: 'vehicleNo',
        selectValue: 'id',
        event: 'handleChangeVehicleId'
      },
      {
        label: '车牌类型',
        value: 'vehicleNumberType',
        type: 'slot'
      },
      {
        label: '道路运输证',
        value: 'roadTransportCertificate',
        type: 'input'
      },
      {
        label: '额定载重',
        value: 'vehicleTonnage',
        type: 'input'
      },
      {
        label: '司机类型',
        value: 'inOut',
        type: 'select',
        list: 'driverTypeList',
        selectKey: 'label',
        selectValue: 'value',
        event: 'updateDriverList'
      },
      {
        label: '主驾驶',
        value: 'driverName',
        type: 'select',
        list: 'drivers',
        selectKey: 'username',
        selectValue: 'id',
        event: 'handleChangeMainDriver'
      },
      {
        label: '主驾驶手机号',
        value: 'driverTel',
        type: 'input'
      },
      {
        label: '副驾驶',
        value: 'copilotId',
        type: 'select',
        list: 'drivers',
        selectKey: 'username',
        selectValue: 'id'
      },
      {
        label: '司机运费',
        value: 'price',
        type: 'input'
      }
    ],
    rules: {
      companyId: [
        {
          required: true,
          message: '请选择承运商',
          trigger: ['blur', 'change']
        }
      ],
      vehicleId: [
        {
          required: true,
          message: '请选择车辆',
          trigger: ['blur', 'change']
        }
      ],
      roadTransportCertificate: [
        {
          required: true,
          message: '请输入道路运输证',
          trigger: ['blur', 'change']
        }
      ],
      vehicleTonnage: [
        {
          required: true,
          message: '请输入额定载重',
          trigger: ['blur', 'change']
        }
      ],
      driverName: [
        {
          required: true,
          message: '请选择主驾驶',
          trigger: ['blur', 'change']
        }
      ],
      driverTel: [
        {
          required: true,
          message: '请输入主驾驶手机号',
          trigger: ['blur', 'change']
        },
        {
          validator: checkPhone,
          message: '请输入正确的电话号码',
          trigger: ['blur', 'change']
        }
      ],
      price: [
        {
          required: true,
          message: '请输入司机运费',
          trigger: ['blur', 'change']
        },
        {
          pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
          message: '请输入整数或小数',
          trigger: ['blur', 'change']
        }
      ],
      goodsId: [
        {
          required: true,
          message: '请选择货物',
          trigger: ['blur', 'change']
        }
      ]
    }
  }
}

export const listTypeInfo = () => {
  return {
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
    takeDeliveryWayList: [
      {
        label: '到站装货',
        value: 1
      },
      {
        label: '指定地点装货',
        value: 2
      }
    ],
    carAskList: [
      {
        label: '4.2米',
        value: '42'
      },
      {
        label: '6.5米',
        value: '65'
      },
      {
        label: '9.6米',
        value: '96'
      }
    ],
    carTypeList: [
      {
        value: 'H01',
        label: '普通货车'
      },
      {
        value: 'H02',
        label: '厢式货车'
      },
      {
        value: 'H04',
        label: '罐式货车'
      },
      {
        value: 'Q00',
        label: '牵引车'
      },
      {
        value: 'G01',
        label: '普通挂车'
      },
      {
        value: 'G03',
        label: '罐式挂车'
      },
      {
        value: 'G05',
        label: '仓栅式货车'
      },
      {
        value: 'H09',
        label: '集装箱挂车'
      },
      {
        value: 'H03',
        label: '封闭货车'
      },
      {
        value: 'H05',
        label: '平板货车'
      },
      {
        value: 'H06',
        label: '集装箱车'
      },
      {
        value: 'H07',
        label: '自卸货车'
      },
      {
        value: 'H08',
        label: '特殊结构货车'
      },
      {
        value: 'Z00',
        label: '专项作业车'
      },
      {
        value: 'G02',
        label: '厢式挂车'
      },
      {
        value: 'G07',
        label: '仓栅式挂车'
      },
      {
        value: 'G04',
        label: '平板挂车'
      },
      {
        value: 'G06',
        label: '自卸挂车'
      },
      {
        value: 'G09',
        label: '专项作业挂车'
      },
      {
        value: 'X91',
        label: '车辆运输车'
      },
      {
        value: 'X92',
        label: '车辆运输车(单排)'
      }
    ],
    addressList: [],
    deliveryTypeList: [
      {
        label: '上门自取',
        value: 1
      },
      {
        label: '送货上门',
        value: 2
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
    unit: [
      {
        label: '件',
        value: '件'
      }
    ],
    areaList: regionData
  }
}
