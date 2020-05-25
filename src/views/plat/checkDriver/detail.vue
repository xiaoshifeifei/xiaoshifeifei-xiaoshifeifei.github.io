<template>
  <div>
    <el-card>
      <div slot="header">
        <span>司机信息</span>
        <div style="float:right; margin-top: -5px">
          <template v-if="info.status === 3">
            <el-button @click="handleAction(0)" type="success">通过</el-button>
            <el-button @click="handleAction(4)" type="danger">不通过</el-button>
          </template>
          <el-button @click="goBack" type="primary">返回</el-button>
        </div>
      </div>
      <custom-form
        :data="driverFormInfo.data"
        :field-list="driverFormInfo.fieldList"
        :label-width="driverFormInfo.labelWidth"
        :labelPosition="driverFormInfo.labelPosition"
        :ref-obj.sync="driverFormInfo.ref"
      >
        <div slot="form-idFrontImgUrl">
          <el-image
            :preview-src-list="[driverFormInfo.data.idFrontImgUrl]"
            :src="driverFormInfo.data.idFrontImgUrl"
            class="avatar"
          />
        </div>
        <div slot="form-idBackImgUrl">
          <el-image
            :preview-src-list="[driverFormInfo.data.idBackImgUrl]"
            :src="driverFormInfo.data.idBackImgUrl"
            class="avatar"
          />
        </div>
        <div slot="form-licenseFrontImgUrl">
          <el-image
            :preview-src-list="[driverFormInfo.data.licenseFrontImgUrl]"
            :src="driverFormInfo.data.licenseFrontImgUrl"
            class="avatar"
          />
        </div>
        <div slot="form-licenseBackImgUrl">
          <el-image
            :preview-src-list="[driverFormInfo.data.licenseBackImgUrl]"
            :src="driverFormInfo.data.licenseBackImgUrl"
            class="avatar"
          />
        </div>
        <div slot="form-employmentCertImgUrl">
          <el-image
            :preview-src-list="[driverFormInfo.data.employmentCertImgUrl]"
            :src="driverFormInfo.data.employmentCertImgUrl"
            class="avatar"
            v-if="driverFormInfo.data.employmentCertImgUrl"
          />
          <h1 v-else>暂无</h1>
        </div>
        <div slot="form-otherEmploymentCertImgUrl">
          <el-image
            :preview-src-list="[driverFormInfo.data.otherEmploymentCertImgUrl]"
            :src="driverFormInfo.data.otherEmploymentCertImgUrl"
            class="avatar"
            v-if="driverFormInfo.data.otherEmploymentCertImgUrl"
          />
          <h1 v-else>暂无</h1>
        </div>
      </custom-form>
    </el-card>
  </div>
</template>
<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import { driverFormInfo } from './data.js'

export default {
  name: 'companyInfo',
  props: {
    info: {
      type: Object,
      // eslint-disable-next-line
      default: () => {}
    }
  },
  data() {
    return {
      driverFormInfo: {}
    }
  },
  created() {
    this.driverFormInfo = driverFormInfo()
    this.driverFormInfo.data = this.info
    this.setFormDisabled()
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    handleAction(status) {
      request({
        url: 'carrier/carrierdriver/modify',
        method: 'post',
        params: {
          id: this.info.id,
          orgUserId: this.info.orgUserId,
          status: status
        }
      }).then(() => {
        z.success('审核成功')
        this.goBack()
      })
    },
    setFormDisabled() {
      this.driverFormInfo.fieldList.forEach(item => {
        item.disabled = true
      })
    }
  }
}
</script>
