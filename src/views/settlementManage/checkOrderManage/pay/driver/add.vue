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
        <el-button
          @click="handleSave"
          size="medium"
          style="margin-right:10px;float:right;padding:3px 0;"
          type="text"
        >保存</el-button>
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
        :columnsTypeArray="[{ label: '', type: 'selection' }]"
        :data="sendCarOrderTableData"
        :hasPage="false"
        @selection-change="handleChooseSendCarOrder"
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
      waybillSendIdList: [],
      listTypeInfo: {}
    }
  },
  created() {
    this.orderFormInfo = orderFormInfo()
    this.orderFormInfo.data.type = '3'
    this.updateSendCarOrderList()
  },
  methods: {
    goBack() {
      this.$refs.orderFormRef.resetFields()
      this.$emit('goBack')
    },
    // 获取订单列表
    updateSendCarOrderList() {
      z.ld()
      request({
        url: 'settle/settlereconciliation/tmswaybillsendpage',
        method: 'post',
        params: {
          companyId: this.$store.state.user.user.companyId,
          pageNo: 1,
          pageSize: 10000
        }
      })
        .then(res => {
          z.lc()
          this.sendCarOrderTableData = res.data.list
        })
        .catch(() => {
          z.lc()
        })
    },
    handleChooseSendCarOrder(e) {
      this.waybillSendIdList = e.map(item => item.sendvehicleId)
    },
    handleSave() {
      if (this.waybillSendIdList.length === 0) {
        z.error('至少选择一条订单')
        return
      }
      this.orderFormInfo.ref.validate(valid => {
        if (valid) {
          const params = {
            ...this.orderFormInfo.data,
            waybillSendIdList: JSON.stringify(this.waybillSendIdList)
          }
          z.ld()
          request({
            url: '/settle/settlereconciliation/save',
            method: 'post',
            params: params
          })
            .then(() => {
              z.lc()
              z.success('添加成功')
              this.orderFormInfo.ref.resetFields()
              this.updateSendCarOrderList()
            })
            .catch(() => {
              z.lc()
            })
        }
      })
    }
  }
}
</script>
