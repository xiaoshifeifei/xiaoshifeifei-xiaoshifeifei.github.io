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
        <span>订单列表</span>
      </div>
      <custom-table
        :columns="orderTableDataColumns"
        :data="orderTableData"
        :hasPage="false"
        height="200"
        ref="goodsTable"
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
      orderTableData: [],
      orderTableDataColumns: [
        {
          prop: 'orderNo',
          label: '订单号',
          align: 'center'
        },
        {
          prop: 'driverPrice',
          label: '价格',
          align: 'center'
        },
        {
          prop: 'consignorAddressName',
          label: '发货地点',
          align: 'center'
        },
        {
          prop: 'consigneeAddressName',
          label: '收货地点',
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
    // 获取对账单详情和里面的订单列表
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
          this.orderTableData = res.data.orderList
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
