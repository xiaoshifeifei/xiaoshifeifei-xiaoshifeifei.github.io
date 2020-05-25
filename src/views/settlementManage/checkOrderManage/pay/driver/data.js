export const orderFormInfo = () => {
  return {
    ref: {},
    labelWidth: '110px',
    data: {
      type: '1',
      reconciliationNo: '',
      notes: '',
      attachmentUrl: ''
    },
    fieldList: [
      {
        label: '对账单号',
        value: 'reconciliationNo',
        type: 'input'
      },
      {
        label: '备注',
        value: 'notes',
        type: 'input'
      }
    ],
    rules: {
      reconciliationNo: [
        {
          required: true,
          message: '请输入对账单号',
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
    typeList: [
      {
        label: '企业对账单',
        value: '2'
      },
      {
        label: '司机对账单',
        value: '3'
      }
    ]
  }
}
