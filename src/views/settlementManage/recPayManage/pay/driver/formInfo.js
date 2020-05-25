export const recPayOrderFormInfo = () => {
  return {
    ref: {},
    data: {
      recPay: 'payDriver',
      oppositePayer: '',
      oppositeAccountName: '',
      oppositeOpeningBank: '',
      oppositeBankAccount: '',
      sumPrice: '',
      notes: '',
      attachmentUrl: '',
      checkNo: ''
    },
    fieldList: [
      {
        label: '收款方名称',
        value: 'oppositeAccountName',
        type: 'input'
      },
      {
        label: '收款方开户行',
        value: 'oppositeOpeningBank',
        type: 'input'
      },
      {
        label: '收款方开户名',
        value: 'oppositeBankAccount',
        type: 'input'
      },
      {
        label: '总金额',
        value: 'sumPrice',
        type: 'input'
      },
      {
        label: '备注',
        value: 'notes',
        type: 'input'
      },
      {
        label: '付款号',
        value: 'checkNo',
        type: 'input'
      },
      {
        label: '未核销金额',
        value: 'notVerification',
        type: 'input'
      }
    ],
    rules: {
      oppositePayer: [
        {
          required: true,
          message: '请输入收款方公司名称',
          trigger: ['blur', 'change']
        }
      ],
      oppositeAccountName: [
        {
          required: true,
          message: '请输入收款方名称',
          trigger: ['blur', 'change']
        }
      ],
      oppositeOpeningBank: [
        {
          required: true,
          message: '请输入收款方开户行',
          trigger: ['blur', 'change']
        }
      ],
      oppositeBankAccount: [
        {
          required: true,
          message: '请输入收款方开户名',
          trigger: ['blur', 'change']
        }
      ],
      sumPrice: [
        {
          required: true,
          message: '请输入总金额',
          trigger: ['blur', 'change']
        }
      ],
      checkNo: [
        {
          required: true,
          message: '请输入付款号',
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
        label: '全部核销',
        value: 'ALL'
      },
      {
        label: '部分核销',
        value: 'PART'
      },
      {
        label: '未核销',
        value: 'NONE'
      }
    ]
  }
}
