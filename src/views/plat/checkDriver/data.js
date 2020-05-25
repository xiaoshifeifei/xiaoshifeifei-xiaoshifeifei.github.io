export const driverFormInfo = () => {
  return {
    ref: {},
    labelWidth: '150px',
    data: {
      username: '',
      phone: '',
      driverIdcard: '',
      idBackImgUrl: '',
      idFrontImgUrl: '',

      driverLicenseType: '',
      driverLicense: '',
      driverLicenseIssueDate: '',
      licenseFrontImgUrl: '',
      licenseBackImgUrl: '',

      employmentCertNo: '',
      employmentCertImgUrl: '',

      otherEmploymentCertNo: '',
      otherEmploymentCertImgUrl: ''
    },
    fieldList: [
      {
        label: '姓名',
        value: 'username',
        type: 'input'
      },
      {
        label: '联系方式',
        value: 'phone',
        type: 'input'
      },
      {
        label: '身份证号码',
        value: 'driverIdcard',
        type: 'input'
      },
      {
        label: '驾驶证类型',
        value: 'driverLicenseType',
        type: 'input'
      },
      {
        label: '驾驶证号',
        value: 'driverLicense',
        type: 'input'
      },
      {
        label: '初次领证时间',
        value: 'driverLicenseIssueDate',
        type: 'input'
      },
      {
        label: '从业资格证号',
        value: 'employmentCertNo',
        type: 'input'
      },
      {
        label: '其他从业资格证号',
        value: 'otherEmploymentCertNo',
        type: 'input'
      },
      {
        label: '身份证正面',
        value: 'idFrontImgUrl',
        type: 'slot'
      },
      {
        label: '身份证背面',
        value: 'idBackImgUrl',
        type: 'slot'
      },
      {
        label: '驾驶证正面',
        value: 'licenseFrontImgUrl',
        type: 'slot'
      },
      {
        label: '驾驶证背面',
        value: 'licenseBackImgUrl',
        type: 'slot'
      },
      {
        label: '从业资格证',
        value: 'employmentCertImgUrl',
        type: 'slot'
      },
      {
        label: '其他从业资格证',
        value: 'otherEmploymentCertImgUrl',
        type: 'slot'
      }
    ]
  }
}
