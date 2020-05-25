export const orderFormInfo = () => {
  return {
    ref: {},
    labelWidth: '80px',
    data: {
      type: '1', // 代表询价
      price: '',
      beginaddr: '',
      beginaddrcode: '',
      endaddr: '',
      endaddrcode: '',
      status: '1',
      enddate: ''
    },
    fieldList: [
      {
        label: '起始点',
        value: 'beginaddr',
        type: 'slot'
      },
      {
        label: '终点',
        value: 'endaddr',
        type: 'slot'
      },
      {
        label: '截止时间',
        value: 'enddate',
        type: 'date',
        dateType: 'datetime'
      }
    ],
    rules: {
      price: [
        {
          required: true,
          message: '请输入价格',
          trigger: ['blur', 'change']
        }
      ],
      beginaddr: [
        {
          required: true,
          message: '请选择起始地',
          trigger: ['blur', 'change']
        }
      ],
      endaddr: [
        {
          required: true,
          message: '请选择终点',
          trigger: ['blur', 'change']
        }
      ],
      enddate: [
        {
          required: true,
          message: '请选择截止时间',
          trigger: ['blur', 'change']
        }
      ]
    }
  }
}
