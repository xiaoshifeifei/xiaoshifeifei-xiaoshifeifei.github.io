import { checkPhone } from '@/utils/validate'

export const driverFormInfo = () => {
  return {
    ref: {},
    labelWidth: '170px',
    data: {
      createUser: '',
      createUserName: '',
      driverLicenseType: '',
      driverLicense: '',
      driverLicenseIssueDate: '',
      check: 'driver',
      status: 0,
      phone: '',
      employmentCertNo: '',
      employmentCertImgUrl: '1',
      idFrontImgUrl: '1',
      idBackImgUrl: '1',
      licenseFrontImgUrl: '1',
      licenseBackImgUrl: '1',
      otherEmploymentCertNo: '',
      otherEmploymentCertImgUrl: '1'
    },
    fieldList: [
      {
        label: '姓名',
        value: 'createUser',
        type: 'select',
        list: 'userList',
        selectKey: 'userName',
        selectValue: 'userId',
        event: 'handleChooseDriver'
      },
      {
        label: '联系方式',
        value: 'phone',
        type: 'number'
      },
      {
        label: '驾驶证类型',
        value: 'driverLicenseType',
        type: 'select',
        list: 'driverLicenseTypeList',
        selectKey: 'label',
        selectValue: 'value'
      },
      {
        label: '驾驶证号',
        value: 'driverLicense',
        type: 'input'
      },
      {
        label: '初次领证日期',
        value: 'driverLicenseIssueDate',
        type: 'date',
        dateFormat: 'yyyy-MM-dd'
      },
      {
        label: '司机状态',
        value: 'status',
        type: 'select',
        list: 'driverStatusList',
        selectKey: 'label',
        selectValue: 'value'
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
        label: '从业资格证图片',
        value: 'employmentCertImgUrl',
        type: 'slot'
      },
      {
        label: '身份证正面照片',
        value: 'idFrontImgUrl',
        type: 'slot'
      },
      {
        label: '身份证背面照片',
        value: 'idBackImgUrl',
        type: 'slot'
      },
      {
        label: '驾驶证正页',
        value: 'licenseFrontImgUrl',
        type: 'slot'
      },
      {
        label: '驾驶证副页',
        value: 'licenseBackImgUrl',
        type: 'slot'
      },
      {
        label: '其他从业资格证图片地址',
        value: 'otherEmploymentCertImgUrl',
        type: 'slot'
      }
    ],
    rules: {
      driverLicenseType: [
        {
          required: true,
          message: '请选择驾驶证类型',
          trigger: 'blur'
        }
      ],
      driverLicense: [
        {
          required: true,
          message: '请输入驾驶证号',
          trigger: 'blur'
        }
      ],
      driverLicenseIssueDate: [
        {
          required: true,
          message: '请选择初次领证日期',
          trigger: 'blur'
        }
      ],
      createUser: [
        {
          required: true,
          message: '请选择司机',
          trigger: 'change'
        }
      ],
      phone: [
        {
          required: true,
          message: '请输入联系方式',
          trigger: 'blur'
        },
        {
          validator: checkPhone,
          message: '请输入正确的电话号码',
          trigger: ['blur', 'change']
        }
      ],
      employmentCertNo: [
        {
          required: true,
          message: '请输入从业资格证号',
          trigger: 'blur'
        }
      ],
      employmentCertImgUrl: [
        {
          required: true,
          message: '请上传从业资格证图片地址',
          trigger: 'blur'
        }
      ],
      idFrontImgUrl: [
        {
          required: true,
          message: '请上传身份证正面图片地址',
          trigger: 'blur'
        }
      ],
      idBackImgUrl: [
        {
          required: true,
          message: '请上传身份证反面图片地址',
          trigger: 'blur'
        }
      ],
      licenseFrontImgUrl: [
        {
          required: true,
          message: '请上传驾驶证正页',
          trigger: 'blur'
        }
      ],
      licenseBackImgUrl: [
        {
          required: true,
          message: '请上传驾驶证副页',
          trigger: 'blur'
        }
      ]
    }
  }
}
