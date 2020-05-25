export const companyFormInfo = () => {
  return {
    ref: {},
    labelWidth: '150px',
    data: {
      name: '',
      shortName: '',
      contacts: '',
      contactsTel: '',
      socialUnifiedCode: '',
      comType: '',
      addressName: '',
      address: '',
      businessScope: '',
      blUrl: '',
      tblUrl: ''
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
        label: '社会统一信用代码',
        value: 'socialUnifiedCode',
        type: 'input'
      },
      {
        label: '企业类型',
        value: 'comType',
        type: 'select',
        list: 'comTypeList',
        selectKey: 'label',
        selectValue: 'value'
      },
      {
        label: '地址名称',
        value: 'addressName',
        type: 'input'
      },
      {
        label: '详细地址',
        value: 'address',
        type: 'input'
      },
      {
        label: '经营范围',
        value: 'businessScope',
        type: 'textarea'
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
    ]
  }
}
