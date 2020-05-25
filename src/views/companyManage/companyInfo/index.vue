<template>
  <div class="layout_main">
    <el-card>
      <div slot="header">
        <span>企业信息</span>
      </div>
      <custom-form
        :data="companyFormInfo.data"
        :field-list="companyFormInfo.fieldList"
        :label-width="companyFormInfo.labelWidth"
        :labelPosition="companyFormInfo.labelPosition"
        :ref-obj.sync="companyFormInfo.ref"
        :listTypeInfo="listTypeInfo"
      >
        <div slot="form-blUrl">
          <el-image
            :preview-src-list="[companyFormInfo.data.blUrl, companyFormInfo.data.tblUrl]"
            :src="companyFormInfo.data.blUrl"
            class="avatar"
          />
        </div>
        <div slot="form-tblUrl">
          <el-image
            :preview-src-list="[companyFormInfo.data.tblUrl, companyFormInfo.data.blUrl]"
            :src="companyFormInfo.data.tblUrl"
            class="avatar"
          />
        </div>
      </custom-form>
    </el-card>
  </div>
</template>
<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import { companyFormInfo } from './data.js'

export default {
  name: 'companyInfo',
  data() {
    return {
      companyFormInfo: {},
      listTypeInfo: {
        comTypeList: [
          {
            label: '不详',
            value: 0
          },
          {
            label: '货主',
            value: 1
          },
          {
            label: '承运商',
            value: 2
          },
          {
            label: '本平台',
            value: 3
          }
        ]
      }
    }
  },
  created() {
    this.companyFormInfo = companyFormInfo()
    this.getLoginInfo().then(res => {
      this.updateInfo(res.companyId)
      this.setFormDisabled()
    })
  },
  methods: {
    updateInfo(companyId) {
      z.ld()
      request({
        url: '/basic/orgcompany/info',
        method: 'get',
        params: { companyId }
      }).then(res => {
        z.lc()
        this.companyFormInfo.data = res.data
      })
    },
    getLoginInfo() {
      return new Promise(resolve => {
        request({
          url: 'sys/login/getlogininfo',
          method: 'get'
        }).then(res => {
          resolve(res.data)
        })
      })
    },
    setFormDisabled() {
      this.companyFormInfo.fieldList.forEach(item => {
        item.disabled = true
      })
    }
  }
}
</script>
