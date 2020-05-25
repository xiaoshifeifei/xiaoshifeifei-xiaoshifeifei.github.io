<template>
  <div>
    <el-card>
      <div slot="header">
        <span>基本信息</span>
        <el-button
          @click="goBack"
          size="medium"
          style="margin-left:20px;float:right;padding:3px 0;"
          type="text"
        >返回</el-button>
      </div>
      <custom-form
        :data="orderFormInfo.data"
        :field-list="orderFormInfo.fieldList"
        :haveBorder="false"
        :label-width="orderFormInfo.labelWidth"
        :labelPosition="orderFormInfo.labelPosition"
        :list-type-info="listTypeInfo"
        :ref-obj.sync="orderFormInfo.ref"
        :rules="orderFormInfo.rules"
        ref="orderFormRef"
      />
    </el-card>
    <el-card style="margin-top: 10px">
      <div slot="header">
        <span>派车单列表</span>
      </div>
      <custom-table
        :columns="sendCarOrderTableDataColumns"
        :data="sendCarOrderTableData"
        :hasPage="false"
        height="300"
        ref="orderTable"
      />
    </el-card>
  </div>
</template>

<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import { orderFormInfo } from './data.js'

export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          id: '',
          type: ''
        }
      }
    }
  },
  data() {
    return {
      orderFormInfo: {},
      sendCarOrderTableData: [],
      sendCarOrderTableDataColumns: [
        {
          prop: 'sendvehicleNo',
          label: '派车单号',
          align: 'center'
        },
        {
          prop: 'roadTransportCertificate',
          label: '车牌号',
          align: 'center'
        },
        {
          prop: 'driverName',
          label: '司机姓名',
          align: 'center'
        },
        {
          prop: 'price',
          label: '司机运费',
          align: 'center'
        }
      ],
      listTypeInfo: {}
    }
  },
  created() {
    this.orderFormInfo = orderFormInfo()
    this.handleDisabledForm()
    this.updateInfo(this.info.id)
  },
  methods: {
    goBack() {
      this.$refs.orderFormRef.resetFields()
      this.$emit('goBack')
    },
    // 获取对账单详情和里面的派车列表
    updateInfo(id) {
      z.ld()
      request({
        url: '/settle/settlereconciliation/info',
        method: 'get',
        params: {
          id,
          isCheckInfo: false,
          type: this.info.type
        }
      })
        .then(res => {
          z.lc()
          this.orderFormInfo.data = res.data
          this.sendCarOrderTableData = res.data.waybillSendList
        })
        .catch(() => {
          z.lc()
        })
    },
    // 禁用表单
    handleDisabledForm() {
      this.orderFormInfo.fieldList.forEach(item => {
        item.disabled = true
      })
    }
  }
}
</script>
