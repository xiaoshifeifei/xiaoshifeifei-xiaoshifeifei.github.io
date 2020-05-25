export const invoiceFormInfo = () => {
  return {
    ref: {},
    labelWidth: '100px',
    data: {
      recPay: 'pay',
      invoiceCode: '',
      invoiceNo: '',
      invoiceType: '',
      sumPrice: '',
      notes: ''
    },
    fieldList: [
      {
        label: '发票编号',
        value: 'invoiceNo',
        type: 'input'
      },
      {
        label: '发票代号',
        value: 'invoiceCode',
        type: 'input'
      },
      {
        label: '发票类型',
        value: 'invoiceType',
        type: 'select',
        list: 'invoiceTypeList',
        selectKey: 'label',
        selectValue: 'value'
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
        label: '未核销金额',
        value: 'undistributed',
        type: 'input'
      }
    ],
    rules: {
      invoiceType: [
        {
          required: true,
          message: '请选择发票类型',
          trigger: ['blur', 'change']
        }
      ],
      invoiceNo: [
        {
          required: true,
          message: '请输入发票号',
          trigger: ['blur', 'change']
        }
      ],
      invoiceCode: [
        {
          required: true,
          message: '请输入发票代号',
          trigger: ['blur', 'change']
        }
      ],
      sumPrice: [
        {
          required: true,
          message: '请输入总金额',
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
    ],
    invoiceTypeList: [
      {
        label: '普通发票',
        value: 1
      },
      {
        label: '增值税发票',
        value: 2
      }
    ]
  }
}
