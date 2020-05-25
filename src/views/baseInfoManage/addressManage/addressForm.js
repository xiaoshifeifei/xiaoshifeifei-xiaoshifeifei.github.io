import { checkPhone } from '@/utils/validate'

export const addressFormInfo = () => {
  return {
    ref: {},
    labelWidth: '100px',
    data: {
      addrUnit: '',
      addrName: '',
      addrTel: '',
      addrArea: '',
      addrCode: '',
      addrDetail: ''
    },
    fieldList: [
      {
        label: '单位名称',
        value: 'addrUnit',
        type: 'input'
      },
      {
        label: '联系人姓名',
        value: 'addrName',
        type: 'input'
      },
      {
        label: '联系电话',
        value: 'addrTel',
        type: 'number'
      },
      {
        label: '所属地区',
        value: 'addrArea',
        type: 'slot'
      },
      {
        label: '详细地址',
        value: 'addrDetail',
        type: 'input'
      }
    ],
    rules: {
      addrUnit: {
        required: true,
        message: '请输入单位名称',
        trigger: ['blur', 'change']
      },
      addrName: {
        required: true,
        message: '请输入联系人姓名',
        trigger: ['blur', 'change']
      },
      addrTel: {
        required: true,
        validator: checkPhone,
        message: '请输入正确的电话号码',
        trigger: ['blur', 'change']
      },
      addrArea: {
        required: true,
        message: '请选择所属地区',
        trigger: ['blur', 'change']
      },
      addrType: {
        required: true,
        message: '请选择地址类型',
        trigger: ['blur', 'change']
      },
      addrDetail: {
        required: true,
        message: '请输入详细地址',
        trigger: ['blur', 'change']
      }
    }
  }
}
