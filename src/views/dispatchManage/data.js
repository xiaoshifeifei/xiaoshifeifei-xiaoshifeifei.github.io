export const sendvehicleOrderForm = () => {
  return {
    ref: {},
    labelWidth: '110px',
    data: {
      driverTypeUrl: '/carrier/carrierdriver/page',
      sendvehicleId: '',

      companyId: '',
      companyName: '',

      driverId: '',
      driverName: '',
      driverTel: '',
      copilotId: '',
      price: '',

      vehicleId: '',
      vehicleNumber: '',
      roadTransportCertificate: ''
    },
    fieldList: [
      {
        label: '承运商',
        value: 'companyName',
        type: 'input',
        disabled: true
      },
      {
        label: '车牌号',
        value: 'vehicleId',
        type: 'select',
        list: 'carList',
        selectKey: 'vehicleNo',
        selectValue: 'id',
        event: 'handleSelectCar'
      },
      {
        label: '道路运输证',
        value: 'roadTransportCertificate',
        type: 'input',
        disabled: true
      },
      {
        label: '司机类型',
        value: 'driverTypeUrl',
        type: 'select',
        list: 'driverTypeList',
        selectKey: 'label',
        selectValue: 'value',
        event: 'handleSelectDriverType'
      },
      {
        label: '主驾驶',
        value: 'driverId',
        type: 'select',
        list: 'driverList',
        selectKey: 'username',
        selectValue: 'id',
        event: 'handleSelectDriver'
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
        list: 'driverList',
        selectKey: 'username',
        selectValue: 'id'
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
      driverId: [
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
          pattern: /^1[34578]\d{9}$/,
          message: '请输入手机正确格式',
          trigger: ['blur', 'change']
        }
      ],
      price: [
        {
          pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/,
          message: '请输入整数或小数',
          trigger: ['blur', 'change']
        }
      ]
    }
  }
}

export const listTypeInfo = () => {
  return {
    statusList: [
      {
        value: 'NEW',
        label: '新建'
      },
      {
        value: 'DISPATCHED',
        label: '已派车'
      },
      {
        value: 'PICKUP_PLACE_OF_DELIVERY',
        label: '前往提货地'
      },
      {
        value: 'ARRIVE_PLACE_OF_DELIVERY',
        label: '抵达提货点'
      },
      {
        value: 'LOADING_FINISHED',
        label: '装车完成'
      },
      {
        value: 9,
        label: '已发车'
      },
      {
        value: 'ARRIVE_PLACE_OF_DESTINATION',
        label: '抵达目的地'
      },
      {
        value: 'UNLOADING_FINISHED',
        label: '卸货完成'
      },
      {
        value: 11,
        label: '签收'
      },
      {
        value: 12,
        label: '完成'
      },
      {
        value: 'FINISH',
        label: '结束服务'
      }
    ],
    driverList: [],
    driverTypeList: [
      {
        label: '编外司机',
        value: '/carrier/carrierdriver/pages'
      },
      {
        label: '内部人员',
        value: '/carrier/carrierdriver/page'
      }
    ],
    carList: [],
  }
}
