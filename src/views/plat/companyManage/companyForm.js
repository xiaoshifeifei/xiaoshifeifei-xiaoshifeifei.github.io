import { checkPhone } from '@/utils/validate'

export const searchFormInfo = () => {
  return {
    ref: {},
    labelWidth: '100px',
    data: {
      name: '',
      contactsTel: '',
      legalperson: ''
    },
    fieldList: [
      {
        label: '企业名称',
        value: 'name',
        type: 'input'
      },
      {
        label: '联系人电话',
        value: 'contactsTel',
        type: 'input'
      },
      {
        label: '法定代表人',
        value: 'legalperson',
        type: 'input'
      },
      {
        label: '',
        value: 'searchBtn',
        type: 'slot'
      },
      {
        label: '',
        value: 'resetBtn',
        type: 'slot'
      }
    ]
  }
}

export const companyFormInfo = () => {
  return {
    ref: {},
    labelWidth: '140px',
    data: {
      name: '',
      shortName: '',
      businessLicense: '',
      organizationCode: '',
      transportBusinessLicense: '',
      socialUnifiedCode: '',
      contacts: '',
      accountName: '',
      openingBank: '',
      bankAccount: '',
      taxpayerOpeningBank: '',
      taxpayerBankAccount: '',
      taxpayerName: '',
      taxpayerAddress: '',
      contactsTel: '',
      legalperson: '',
      registeredCapital: '',
      addressCode: '',
      addressName: '',
      address: '',
      remark: '',
      businessScope: '',
      blUrl: '',
      tblUrl: '',
      comType: '',
      isRegistered: false
    },
    fieldList: [
      {
        label: '企业名称',
        value: 'name',
        type: 'input'
      },
      {
        label: '企业简称',
        value: 'shortName',
        type: 'input'
      },
      {
        label: '营业执照号',
        value: 'businessLicense',
        type: 'input'
      },
      {
        label: '组织机构代码',
        value: 'organizationCode',
        type: 'input'
      },
      {
        label: '运输经营许可证',
        value: 'transportBusinessLicense',
        type: 'input'
      },
      {
        label: '社会统一信用代码',
        value: 'socialUnifiedCode',
        type: 'input'
      },
      {
        label: '联系人姓名',
        value: 'contacts',
        type: 'input'
      },
      {
        label: '联系人电话',
        value: 'contactsTel',
        type: 'input'
      },
      {
        label: '开户名',
        value: 'accountName',
        type: 'input'
      },
      {
        label: '开户行',
        value: 'openingBank',
        type: 'input'
      },
      {
        label: '银行账号',
        value: 'bankAccount',
        type: 'input'
      },
      {
        label: '纳税人开户行',
        value: 'taxpayerOpeningBank',
        type: 'input'
      },
      {
        label: '纳税人银行账号',
        value: 'taxpayerBankAccount',
        type: 'input'
      },
      {
        label: '法定代表人',
        value: 'legalperson',
        type: 'input'
      },
      {
        label: '注册资本',
        value: 'registeredCapital',
        type: 'input'
      },
      {
        label: '省市区县',
        value: 'addressName',
        type: 'slot'
      },
      {
        label: '详细地址',
        value: 'address',
        type: 'input'
      },
      {
        label: '备注',
        value: 'remark',
        type: 'input'
      },
      {
        label: '经营范围',
        value: 'businessScope',
        type: 'input'
      },
      {
        label: '营业执照',
        value: 'blUrl',
        type: 'slot'
      },
      {
        label: '道路运输证',
        value: 'tblUrl',
        type: 'slot'
      }
    ],
    rules: {
      name: [{
        required: true,
        message: '请输入企业名称',
        trigger: 'blur'
      }],
      businessLicense: [{
        required: true,
        message: '请输入营业执照号',
        trigger: 'blur'
      }],
      organizationCode: [{
        required: true,
        message: '请输入组织机构代码',
        trigger: 'blur'
      }],
      socialUnifiedCode: [{
        required: true,
        message: '请输入社会统一信用代码',
        trigger: 'blur'
      }],
      contacts: [{
        required: true,
        message: '请输入联系人姓名',
        trigger: 'blur'
      }],
      contactsTel: [
        {
          required: true,
          message: '请输入联系人电话',
          trigger: ['blur', 'change']
        },
        {
          validator: checkPhone,
          message: '请输入正确的电话号码',
          trigger: ['blur', 'change']
        }
      ],
      accountName: [{
        required: true,
        message: '请输入开户名',
        trigger: 'blur'
      }],
      openingBank: [{
        required: true,
        message: '请输入开户行',
        trigger: 'blur'
      }],
      bankAccount: [
        {
          required: true,
          message: '请输入银行账号',
          trigger: 'blur'
        },
        {
          pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
          message: '必须为数字值',
          trigger: 'blur'
        }
      ],
      legalperson: [{
        required: true,
        message: '请输入法定代表人',
        trigger: 'blur'
      }],
      addressName: [{
        required: true,
        message: '请选择省市区县',
        trigger: 'blur'
      }],
      address: [{
        required: true,
        message: '请输入详细地址',
        trigger: 'blur'
      }],
      blUrl: [{
        required: true,
        message: '请上传营业执照',
        trigger: 'blur'
      }],
      tblUrl: [{
        required: true,
        message: '请上传道路运输证',
        trigger: 'blur'
      }],
      taxpayerTel: [
        {
          required: true,
          message: '请输入联系人电话',
          trigger: ['blur', 'change']
        },
        {
          validator: checkPhone,
          message: '请输入正确的电话号码',
          trigger: ['blur', 'change']
        }
      ],
      registeredCapital: [
        {
          pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
          message: '必须为数字值',
          trigger: 'blur'
        }
      ]
    }
  }
}
