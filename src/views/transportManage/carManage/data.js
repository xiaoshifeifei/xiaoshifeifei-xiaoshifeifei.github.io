export const carFormInfo = () => {
  return {
    ref: {},
    labelWidth: '150px',
    data: {
      vehicleId: '',
      isMineVehicle: '',
      uniqueId: '',
      companyId: '',
      vehicleNoType: '',
      vehicleNo: '',
      type: '',
      powerType: '',
      axleNumber: '',
      contactUserId: '',
      ratedTonnage: '',
      ratedVolume: '',
      travelLicense: '',
      roadTransportCertificate: '',
      vehicleLength: '',
      vehicleWidth: '',
      vehicleHeight: '',
      engineNumber: '',
      vehicleframeNo: '',
      status: 0,
      vehicleIdCodeVin: '',

      drivinLicenseFrontImgUrl: '1',
      drivinLicenseBackImgUrl: '1',
      vehicleImgUrl: '1',
      roadTransCertUrl: '1',

      carSafelistFake: [
        {
          safeCompany: '',
          warrantyNum: '',
          safeType: '',
          startTime: '',
          overTime: '',
          operator: '',
          insuranceAmount: ''
        }
      ],
      cargpslistFake: [
        {
          deviceId: '',
          simId: '',
          deviceType: '',
          activationDate: '',
          dueDate: '',
          installDate: ''
        }
      ],
      carLinelistFake: [
        {
          origin: '',
          destination: ''
        }
      ]
    },
    fieldList: [
      {
        label: '车牌类型',
        value: 'vehicleNoType',
        type: 'select',
        list: 'carBrandTypeList',
        selectKey: 'label',
        selectValue: 'value'
      },
      {
        label: '车牌号',
        value: 'vehicleNo',
        type: 'input'
      },
      {
        label: '车辆类型',
        value: 'type',
        type: 'select',
        list: 'carTypeList',
        selectKey: 'label',
        selectValue: 'value'
      },
      {
        label: '动力类型',
        value: 'powerType',
        type: 'select',
        list: 'powerTypeList',
        selectKey: 'label',
        selectValue: 'value'
      },
      {
        label: '额定吨位(KG)',
        value: 'ratedTonnage',
        type: 'input'
      },
      {
        label: '额定体积(立方米)',
        value: 'ratedVolume',
        type: 'input'
      },
      {
        label: '车辆行驶证号',
        value: 'travelLicense',
        type: 'input'
      },
      {
        label: '车长(cm)',
        value: 'vehicleLength',
        type: 'input'
      },
      {
        label: '车宽(cm)',
        value: 'vehicleWidth',
        type: 'input'
      },
      {
        label: '车高(cm)',
        value: 'vehicleHeight',
        type: 'input'
      },
      {
        label: '道路运输证号',
        value: 'roadTransportCertificate',
        type: 'input'
      },
      {
        label: '发动机编号',
        value: 'engineNumber',
        type: 'input'
      },
      {
        label: '车架号',
        value: 'vehicleframeNo',
        type: 'input'
      },
      {
        label: '车轴数',
        value: 'axleNumber',
        type: 'input'
      },
      {
        label: '状态',
        value: 'status',
        type: 'select',
        list: 'statusList',
        selectKey: 'label',
        selectValue: 'value'
      },
      {
        label: '车辆识别代号VIN',
        value: 'vehicleIdCodeVin',
        type: 'input'
      },
      {
        label: '行驶证正页',
        value: 'drivinLicenseFrontImgUrl',
        type: 'slot'
      },
      {
        label: '行驶证副页',
        value: 'drivinLicenseBackImgUrl',
        type: 'slot'
      },
      {
        label: '车辆图片',
        value: 'vehicleImgUrl',
        type: 'slot'
      },
      {
        label: '道路运输许可证',
        value: 'roadTransCertUrl',
        type: 'slot'
      }
    ],
    rules: {
      vehicleNo: [
        {
          required: true,
          message: '请输入车牌号',
          trigger: ['blur', 'change']
        }
      ],
      vehicleNoType: [
        {
          required: true,
          message: '请选择车牌类型',
          trigger: ['blur', 'change']
        }
      ],
      type: [
        {
          required: true,
          message: '请选择车辆类型',
          trigger: ['blur', 'change']
        }
      ],
      ratedTonnage: [
        {
          required: true,
          message: '请输入额定吨位(KG)',
          trigger: ['blur', 'change']
        },
        {
          pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
          message: '请输入数字',
          trigger: ['blur', 'change']
        }
      ],
      ratedVolume: [
        {
          required: true,
          message: '请输入额定体积',
          trigger: ['blur', 'change']
        },
        {
          pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
          message: '请输入数字',
          trigger: ['blur', 'change']
        }
      ],
      vehicleLength: [
        {
          required: true,
          message: '请输入车长',
          trigger: ['blur', 'change']
        },
        {
          pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
          message: '请输入数字',
          trigger: ['blur', 'change']
        }
      ],
      vehicleWidth: [
        {
          required: true,
          message: '请输入车宽',
          trigger: ['blur', 'change']
        },
        {
          pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
          message: '请输入数字',
          trigger: ['blur', 'change']
        }
      ],
      vehicleHeight: [
        {
          required: true,
          message: '请输入车高',
          trigger: ['blur', 'change']
        },
        {
          pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
          message: '请输入数字',
          trigger: ['blur', 'change']
        }
      ],
      vehicleIdCodeVin: [
        {
          required: true,
          message: '请输入车辆识别代号VIN',
          trigger: ['blur', 'change']
        }
      ],
      drivinLicenseFrontImgUrl: [
        {
          required: true,
          message: '请上传行驶证正页',
          trigger: ['blur', 'change']
        }
      ],
      drivinLicenseBackImgUrl: [
        {
          required: true,
          message: '请上传行驶证副页',
          trigger: ['blur', 'change']
        }
      ],
      vehicleImgUrl: [
        {
          required: true,
          message: '请上传车辆图片地址',
          trigger: ['blur', 'change']
        }
      ],
      roadTransCertUrl: [
        {
          required: true,
          message: '请上传道路运输许可证',
          trigger: ['blur', 'change']
        }
      ],
      travelLicense: [
        {
          required: true,
          message: '请输入车辆行驶证',
          trigger: ['blur', 'change']
        }
      ],
      roadTransportCertificate: [
        {
          required: true,
          message: '请输入道路运输证号',
          trigger: ['blur', 'change']
        }
      ],
      engineNumber: [
        {
          required: true,
          message: '请输入发动机编号',
          trigger: ['blur', 'change']
        }
      ]
    }
  }
}

export const listTypeInfo = () => {
  return {
    dispatchStatusList: [
      {
        label: '空闲',
        value: '1'
      },
      {
        label: '调度中',
        value: '2'
      },
      {
        label: '出车',
        value: '3'
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
    carBrandTypeList: [
      {
        value: 'YELLOW_BLACK',
        label: '黄底黑字'
      },
      {
        value: 'BLUE_WHITE',
        label: '蓝底白字'
      },
      {
        value: 'GREEN_BLACK',
        label: '绿底黑字'
      }
    ],
    powerTypeList: [
      {
        label: '普通货车',
        value: 0
      },
      {
        label: '纯电动货车',
        value: 1
      },
      {
        label: '插电混动货车',
        value: 2
      }
    ],
    statusList: [
      {
        label: '正常',
        value: 0
      },
      {
        label: '报废',
        value: 1
      },
      {
        label: '年审未过',
        value: 2
      }
    ]
  }
}
