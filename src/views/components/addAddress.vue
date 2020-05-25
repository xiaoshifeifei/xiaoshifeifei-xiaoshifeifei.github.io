<template>
  <div>
    <custom-form
      ref="addressFormInfoRef"
      :data="addressFormInfo.data"
      :field-list="addressFormInfo.fieldList"
      :label-width="addressFormInfo.labelWidth"
      :list-type-info="listTypeInfo"
      :ref-obj.sync="addressFormInfo.ref"
      :rules="addressFormInfo.rules"
    >
      <div slot="form-addrArea" style="width: 160px">
        <el-tooltip
          :content="addressFormInfo.data.addrArea"
          :disabled="area.length <= 0"
          effect="dark"
          placement="top-start"
        >
          <el-cascader
            :options="listTypeInfo.areaList"
            @change="handleChangeAddress"
            ref="cascaderAddr"
            style="width: 100%"
            v-model="area"
          />
        </el-tooltip>
      </div>
    </custom-form>
    <span class="dialog-footer" slot="footer">
      <el-button @click="handleCloseDialog">取消</el-button>
      <el-button @click="handleConfirm" type="primary">确定</el-button>
    </span>
  </div>
</template>

<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import { checkPhone } from '@/utils/validate'
import { regionData, CodeToText } from 'element-china-area-data'

export default {
  data() {
    return {
      area: '',
      addressFormInfo: {
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
          addrDetail: {
            required: true,
            message: '请输入详细地址',
            trigger: ['blur', 'change']
          }
        }
      },
      listTypeInfo: {
        areaList: regionData
      }
    }
  },
  methods: {
    handleChangeAddress(arr) {
      this.addressFormInfo.data.addrArea = ''
      this.addressFormInfo.data.addrCode = ''
      arr.forEach(item => {
        this.addressFormInfo.data.addrArea += CodeToText[item] + ','
        this.addressFormInfo.data.addrCode += item + ','
      })
      this.addressFormInfo.data.addrArea = this.addressFormInfo.data.addrArea.slice(0, -1)
      this.addressFormInfo.data.addrCode = this.addressFormInfo.data.addrCode.slice(0, -1)
    },
    handleConfirm() {
      this.addressFormInfo.ref.validate(valid => {
        if (valid) {
          request({
            url: 'basic/orgcompanyaddress/addCompanyAddress',
            method: 'post',
            params: this.addressFormInfo.data
          }).then(() => {
            z.success('操作成功')
            this.handleCloseDialog()
          })
        }
      })
    },
    handleCloseDialog() {
      this.$emit('on-close', false)
    },
    resetForm() {
      this.addressFormInfo.ref.resetFields()
      this.area = ''
    }
  }
}
</script>
