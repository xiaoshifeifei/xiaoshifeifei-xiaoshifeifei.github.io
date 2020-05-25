<template>
  <div>
    <h4 style="display: inline-block; width: 100px; text-align: right; padding-right: 12px">客户类型</h4>
    <el-radio-group :disabled="!isChangeType" @change="handleChangeComType" v-model="comTypeClone">
      <el-radio :label="1" border>单位</el-radio>
      <el-radio :label="2" border>个人</el-radio>
    </el-radio-group>
    <custom-form
      :data="customFormCompanyInfo.data"
      :field-list="customFormCompanyInfo.fieldList"
      :label-width="customFormCompanyInfo.labelWidth"
      :list-type-info="listTypeInfo"
      :ref-obj.sync="customFormCompanyInfo.ref"
      :rules="customFormCompanyInfo.rules"
      v-if="comTypeClone === 1"
    >
      <div slot="form-addressName" style="width: 160px">
        <el-tooltip
          :content="customFormCompanyInfo.data.addressName"
          :disabled="customFormCompanyInfo.data.addressName.length <= 0"
          effect="dark"
          placement="top-start"
        >
          <el-cascader
            :options="listTypeInfo.areaList"
            @change="handleChangeAddress('customFormCompanyInfo', $event, 'addressName', 'addressCode')"
            style="width: 100%"
            v-model="customFormCompanyInfo.data.addressCode"
          />
        </el-tooltip>
      </div>
      <div class="id_card el-upload el-upload--text" slot="form-blUrl">
        <el-upload
          :before-upload="beforeAvatarUpload"
          :data="{ title: 'business' }"
          :on-success="handleBlUrl"
          :show-file-list="false"
          accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PNG, .GIF"
          action="file/upload/uploads"
          class="avatar-uploader"
        >
          <img :src="customFormCompanyInfo.data.blUrl" class="avatar" v-if="customFormCompanyInfo.data.blUrl">
          <i class="el-icon-plus avatar-uploader-icon" v-else></i>
        </el-upload>
      </div>
      <div class="id_card el-upload el-upload--text" slot="form-tblUrl">
        <el-upload
          :before-upload="beforeAvatarUpload"
          :data="{ title: 'road' }"
          :on-success="handletblUrl"
          :show-file-list="false"
          accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PNG, .GIF"
          action="file/upload/uploads"
          class="avatar-uploader"
        >
          <img :src="customFormCompanyInfo.data.tblUrl" class="avatar" v-if="customFormCompanyInfo.data.tblUrl">
          <i class="el-icon-plus avatar-uploader-icon" v-else></i>
        </el-upload>
      </div>
    </custom-form>
    <custom-form
      :data="customFormPersonInfo.data"
      :field-list="customFormPersonInfo.fieldList"
      :label-width="customFormPersonInfo.labelWidth"
      :list-type-info="listTypeInfo"
      :ref-obj.sync="customFormPersonInfo.ref"
      :rules="customFormPersonInfo.rules"
      v-if="comTypeClone === 2"
    />
  </div>
</template>

<script>
import { regionData, CodeToText } from 'element-china-area-data'
import { checkPhone } from '@/utils/validate'

export default {
  name: 'chooseCustomer',
  props: {
    isChangeType: {
      type: Boolean,
      default: false
    },
    comType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      comTypeClone: '',
      customFormCompanyInfo: {
        ref: {},
        labelWidth: '140px',
        data: {
          name: '',
          shortName: '',
          socialUnifiedCode: '',
          contacts: '',
          contactsTel: '',
          accountName: '',
          openingBank: '',
          bankAccount: '',
          legalperson: '',
          registeredCapital: '',
          addressCode: '',
          addressName: '',
          address: '',
          businessScope: '',
          blUrl: '123',
          tblUrl: '123',
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
            trigger: ['blur', 'change']
          }],
          socialUnifiedCode: [{
            required: true,
            message: '请输入社会统一信用代码',
            trigger: ['blur', 'change']
          }],
          contacts: [{
            required: true,
            message: '请输入联系人姓名',
            trigger: ['blur', 'change']
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
            trigger: ['blur', 'change']
          }],
          openingBank: [{
            required: true,
            message: '请输入开户行',
            trigger: ['blur', 'change']
          }],
          bankAccount: [
            {
              required: true,
              message: '请输入银行账号',
              trigger: ['blur', 'change']
            },
            {
              pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
              message: '必须为数字值',
              trigger: ['blur', 'change']
            }
          ],
          legalperson: [{
            required: true,
            message: '请输入法定代表人',
            trigger: ['blur', 'change']
          }],
          addressName: [{
            required: true,
            message: '请选择省市区县',
            trigger: ['blur', 'change']
          }],
          address: [{
            required: true,
            message: '请输入详细地址',
            trigger: ['blur', 'change']
          }],
          blUrl: [{
            required: true,
            message: '请上传营业执照',
            trigger: ['blur', 'change']
          }],
          tblUrl: [{
            required: true,
            message: '请上传道路运输证',
            trigger: ['blur', 'change']
          }],
          registeredCapital: [
            {
              pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
              message: '必须为数字值',
              trigger: ['blur', 'change']
            }
          ]
        },
      },
      customFormPersonInfo: {
        ref: {},
        labelWidth: '100px',
        data: {
          name: '',
          contacts: '',
          contactsTel: '',
          bankAccount: '',
          accountName: '',
          openingBank: '',
          isRegistered: false
        },
        fieldList: [
          {
            label: '姓名',
            value: 'name',
            type: 'input'
          },
          {
            label: '联系人',
            value: 'contacts',
            type: 'input'
          },
          {
            label: '联系电话',
            value: 'contactsTel',
            type: 'number'
          },
          {
            label: '开户账号',
            value: 'bankAccount',
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
          }
        ],
        rules: {
          name: [{
            required: true,
            message: '请输入姓名',
            trigger: ['blur', 'change']
          }],
          contacts: [{
            required: true,
            message: '请输入联系人姓名',
            trigger: ['blur', 'change']
          }],
          contactsTel: [
            {
              required: true,
              message: '请输入联系电话',
              trigger: ['blur', 'change']
            },
            {
              validator: checkPhone,
              message: '请输入正确的电话号码',
              trigger: ['blur', 'change']
            }
          ],
          bankAccount: {
            required: true,
            message: '请输入开户账号',
            trigger: ['blur', 'change']
          },
          accountName: {
            required: true,
            message: '请输入开户名',
            trigger: ['blur', 'change']
          },
          openingBank: {
            required: true,
            message: '请输入开户行',
            trigger: ['blur', 'change']
          }
        }
      },
      listTypeInfo: {
        areaList: regionData,
        carrierList: [],
        addrList: []
      }
    }
  },
  created() {
    this.comTypeClone = this.comType
  },
  watch: {
    comType: {
      handler: function(val) {
        this.comTypeClone = val
      }
    }
  },
  methods: {
    handleBlUrl(res) {
      this.customFormCompanyInfo.data.blUrl = res.url
    },
    handletblUrl(res) {
      this.customFormCompanyInfo.data.tblUrl = res.url
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!')
      }
      return isLt2M
    },
    handleChangeAddress(formName, arr, address, addressCode) {
      this[formName].data[address] = ''
      this[formName].data[addressCode] = ''
      arr.forEach(item => {
        this[formName].data[address] += CodeToText[item] + ','
        this[formName].data[addressCode] += item + ','
      })
      this[formName].data[address] = this[formName].data[address].slice(0, -1)
      this[formName].data[addressCode] = this[formName].data[addressCode].slice(0, -1)
    },
    clearCustomForm() {
      if (this.comTypeClone === 1) {
        this.customFormCompanyInfo.ref.resetFields()
      } else {
        this.customFormPersonInfo.ref.resetFields()
      }
      for (const [key] of Object.entries(
        this.customFormCompanyInfo.data
      )) {
        this.customFormCompanyInfo.data[key] = ''
      }
      for (const [key] of Object.entries(
        this.customFormPersonInfo.data
      )) {
        this.customFormPersonInfo.data[key] = ''
      }
    },
    handleChangeComType() {
      if (this.comTypeClone === 1) {
        this.customFormCompanyInfo.ref.clearValidate()
      } else {
        this.customFormPersonInfo.ref.clearValidate()
      }
      this.$emit('changeType', this.comTypeClone)
    }
  }
}
</script>
