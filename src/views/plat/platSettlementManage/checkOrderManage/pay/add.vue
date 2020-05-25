<template>
  <el-card>
    <div slot="header">
      <span>添加对账单</span>
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
    <custom-table
      :columns="orderTableDataColumns"
      :columnsTypeArray="[{ label: '', type: 'selection' }]"
      :data="orderTableData"
      :hasPage="false"
      @selection-change="handleChooseOrder"
      ref="orderTable"
      style="margin-bottom: 10px"
    ></custom-table>
  </el-card>
</template>

<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import { orderFormInfo } from './data.js'

export default {
  data() {
    return {
      orderFormInfo: {},
      orderTableData: [],
      orderTableDataColumns: [
        {
          prop: 'orderNo',
          label: '委托单单号',
          align: 'center'
        },
        {
          prop: 'freightCost',
          label: '价格',
          align: 'center'
        },
        {
          prop: 'shipperAddress',
          label: '发货地点',
          align: 'center'
        },
        {
          prop: 'receiverAddress',
          label: '收货地点',
          align: 'center'
        }
      ],
      orderIdList: [],
      listTypeInfo: {}
    }
  },
  created() {
    this.orderFormInfo = orderFormInfo()
    this.updateOrderList()
  },
  methods: {
    goBack() {
      this.$refs.orderFormRef.resetFields()
      this.$emit('goBack')
    },
    // 获取订单列表
    updateOrderList() {
      request({
        url: 'settle/settlereconciliation/omsorderpaypage',
        method: 'post',
        params: {
          pageNo: 1,
          pageSize: 10000
        }
      }).then(res => {
        this.orderTableData = res.data.list
      })
    },
    handleChooseOrder(e) {
      this.orderIdList = e.map(item => item.orderId)
    },
    handleSave() {
      if (this.orderIdList.length === 0) {
        z.error('至少选择一条订单')
        return
      }
      this.orderFormInfo.ref.validate(valid => {
        if (valid) {
          const params = {
            ...this.orderFormInfo.data,
            orderIdList: JSON.stringify(this.orderIdList)
          }
          z.ld()
          request({
            url: 'settle/settlereconciliation/omssave',
            method: 'post',
            params: params
          })
            .then(() => {
              z.lc()
              z.success('添加成功')
              this.orderFormInfo.ref.resetFields()
              this.updateOrderList()
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
