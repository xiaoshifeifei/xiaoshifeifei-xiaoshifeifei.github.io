<template>
  <div>
    <el-card>
      <div slot="header">
        <span>收款订单</span>
        <el-button @click="goBack" style="float: right; margin-top: -5px" type="primary">返回</el-button>
      </div>
      <custom-form
        :data="recPayOrderFormInfo.data"
        :field-list="recPayOrderFormInfo.fieldList"
        :label-width="recPayOrderFormInfo.labelWidth"
        :ref-obj.sync="recPayOrderFormInfo.ref"
      />
    </el-card>
    <el-card style="margin-top: 10px">
      <div slot="header">
        <span>对账单列表</span>
      </div>
      <custom-table
        :columns="checkOrderTableDataColumns"
        :columnsTypeArray="[{ label: '', type: 'selection' }, { label: '序号', type: 'index' }]"
        :data="checkOrderTableData"
        :hasPage="false"
        ref="checkOrderRef"
      >
        <template slot="status" slot-scope="scope">
          <span>{{ scope.row.status | formatCheckStatus }}</span>
        </template>
        <el-table-column align="center" fixed="right" label="操作" slot="append">
          <template slot-scope="scope">
            <el-button
              @click.stop="showOrderList(scope.row.id, scope.$index, scope.row.type)"
              type="primary"
            >订单列表</el-button>
          </template>
        </el-table-column>
      </custom-table>
      <!-- 订单列表 -->
      <el-dialog
        :show-close="false"
        :visible.sync="isOrderListDialog"
        @close="handleCloseDialog"
        width="60%"
      >
        <template slot="title">
          <span>订单列表</span>
          <el-button @click="handleCloseDialog" style="float: right" type="primary">关闭</el-button>
        </template>
        <custom-table
          :columns="orderTableDataColumns"
          :columnsTypeArray="[{ label: '', type: 'selection' }, { label: '序号', type: 'index' }]"
          :data="orderTableData"
          :hasPage="false"
          @selection-change="handleSelectOrder"
          ref="orderTableRef"
        />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import { recPayOrderFormInfo } from './formInfo'

export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          id: '',
          type: '',
          recPay: ''
        }
      }
    }
  },
  data() {
    return {
      currentCheckOrderId: '',
      searchCheckOrderParams: {
        type: '1',
        total: 0,
        pageNo: 1,
        pageSize: 100
      },
      recPayOrderFormInfo: {},
      checkOrderTableData: [],
      checkOrderTableDataColumns: [
        {
          prop: 'reconciliationNo',
          label: '编号',
          align: 'center'
        },
        {
          prop: 'receivable',
          label: '应收款金额',
          align: 'center'
        },
        {
          prop: 'recpits',
          label: '实收款金额',
          align: 'center'
        },
        {
          prop: 'uncollected',
          label: '未收款金额',
          align: 'center'
        },
        {
          prop: 'status',
          label: '状态',
          slotName: 'status',
          align: 'center'
        },
        {
          prop: 'notes',
          label: '备注',
          align: 'center'
        }
      ],
      // 核销对账单参数
      checkOrderParams: {
        checkId: '',
        reconciliationEntities: []
      },
      currentCheckOrderType: '',
      // 订单列表弹框
      selectionOrder: [],
      isOrderListDialog: false,
      orderTableData: [],
      orderTableDataColumns: [
        {
          prop: 'orderNo',
          label: '订单号',
          align: 'center'
        },
        {
          prop: 'price',
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
      ]
    }
  },
  created() {
    this.recPayOrderFormInfo = recPayOrderFormInfo()
    this.updateRecPayOrderInfo(this.info.id)
    this.handleDisabledForm()
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    // 获取付款订单详情
    updateRecPayOrderInfo(id) {
      request({
        url: '/settle/settlecheck/info',
        method: 'get',
        params: { id }
      }).then(res => {
        this.recPayOrderFormInfo.data = res.data
        this.checkOrderTableData = res.data.settleReconciliationEntityList
      })
    },
    // 获取对账单的详情（内含订单列表）
    updateCheckOrderInfo(id) {
      request({
        url: '/settle/settlereconciliation/info',
        method: 'get',
        params: {
          id,
          checkId: this.info.id,
          isCheckInfo: true,
          type: this.currentCheckOrderType
        }
      }).then(res => {
        this.orderTableData = res.data.orderList
      })
    },
    showOrderList(id, index, type) {
      this.isOrderListDialog = true
      this.currentCheckOrderId = id
      this.currentCheckOrderType = type
      this.$refs.checkOrderRef.$children[0].clearSelection()
      this.updateCheckOrderInfo(id)
    },
    // 选择多个核销单
    handleSelectCheckOrder(list) {
      this.checkOrderParams.reconciliationEntities = []
      list.forEach(item => {
        this.checkOrderParams.reconciliationEntities.push({
          id: item.id,
          orderIds: [],
          waybillSendIds: []
        })
      })
    },
    // 选择核销单中的一条订单
    handleSelectOrder(list) {
      if (!this.checkOrderParams.reconciliationEntities.length) {
        this.checkOrderParams.reconciliationEntities = [
          {
            orderIds: [],
            waybillSendIds: []
          }
        ]
      }
      this.checkOrderParams.reconciliationEntities[0].orderIds = list.map(
        item => item.orderId
      )
    },
    handleCloseDialog() {
      this.checkOrderParams = {
        checkId: '',
        reconciliationEntities: []
      }
      this.isOrderListDialog = false
    },
    // 禁用表单
    handleDisabledForm() {
      this.recPayOrderFormInfo.fieldList.forEach(item => {
        item.disabled = true
      })
    }
  }
}
</script>
