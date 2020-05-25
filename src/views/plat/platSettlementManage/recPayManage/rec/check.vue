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
        <el-button
          @click="handleCheckAllOrder"
          style="float: right; margin-top: -5px"
          type="primary"
        >核销</el-button>
      </div>
      <custom-table
        :columns="checkOrderTableDataColumns"
        :columnsTypeArray="[{ label: '', type: 'selection' }, { label: '序号', type: 'index' }]"
        :currentPage="searchRecPayOrderParams.pageNo"
        :data="checkOrderTableData"
        :page-size="searchRecPayOrderParams.pageSize"
        :total="searchRecPayOrderParams.total"
        @change-current-page="handleCurrentChange"
        @change-size="handleSizeChange"
        @selection-change="handleSelectCheckOrder"
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
      <el-dialog :show-close="false" :visible.sync="isOrderListDialog" width="60%" @close="handleCloseDialog">
        <template slot="title">
          <span>订单列表</span>
          <el-button @click="handleCloseDialog" style="float: right" type="primary">关闭</el-button>
          <el-button
            @click="handleCheckOrder"
            style="float: right; margin-right: 10px"
            type="primary"
          >核销</el-button>
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
import { recPayOrderFormInfo } from './data.js'

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
      searchRecPayOrderParams: {
        type: 4,
        total: 0,
        pageNo: 1,
        pageSize: 10
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
      currentCheckOrderIndex: 0,
      currentCheckOrderType: '',
      // 订单列表弹框
      selectionOrder: [],
      isOrderListDialog: false,
      orderTableData: [],
      orderTableDataColumns: [
        {
          prop: 'orderNo',
          label: '委托单单号',
          align: 'center'
        },
        {
          prop: 'freightRevenue',
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
      ]
    }
  },
  created() {
    this.recPayOrderFormInfo = recPayOrderFormInfo()
    this.updateRecPayOrderInfo(this.info.id)
    this.updateCheckOrderList()
    this.handleDisabledForm()
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    // 获取付款订单详情
    updateRecPayOrderInfo(id) {
      z.ld()
      request({
        url: '/settle/settlecheck/info',
        method: 'get',
        params: { id }
      })
        .then(res => {
          z.lc()
          this.recPayOrderFormInfo.data = res.data
        })
        .catch(() => {
          z.lc()
        })
    },
    // 获取对账单列表
    updateCheckOrderList() {
      z.ld()
      request({
        url: '/settle/settlereconciliation/checkpage',
        method: 'post',
        params: this.searchRecPayOrderParams
      })
        .then(res => {
          z.lc()
          this.checkOrderTableData = res.data.list
          this.searchRecPayOrderParams.total = res.data.totalCount
        })
        .catch(() => {
          z.lc()
        })
    },
    // 获取对账单的详情（内含订单列表）
    updateCheckOrderInfo(id) {
      z.ld()
      request({
        url: '/settle/settlereconciliation/info',
        method: 'get',
        params: {
          id,
          isCheckInfo: true,
          type: this.currentCheckOrderType
        }
      })
        .then(res => {
          z.lc()
          this.orderTableData = res.data.omsSrvOrderList
        })
        .catch(() => {
          z.lc()
        })
    },
    // 核销多个对账单
    handleCheckAllOrder() {
      if (this.checkOrderParams.reconciliationEntities.length) {
        this.checkOrderParams.checkId = this.info.id
        this.checkOrderParams.reconciliationEntities = JSON.stringify(
          this.checkOrderParams.reconciliationEntities
        )
        z.ld()
        request({
          url: 'settle/checkreconciliation/omssave',
          method: 'post',
          params: this.checkOrderParams
        })
          .then(() => {
            z.success('核销成功')
            this.$refs.checkOrderRef.$children[0].clearSelection()
            this.updateRecPayOrderInfo(this.info.id)
            this.updateCheckOrderList()
            z.lc()
          })
          .catch(() => {
            this.$refs.checkOrderRef.$children[0].clearSelection()
            z.lc()
          })
      } else {
        z.error('至少选择一条核销单')
      }
    },
    // 核销一个对账单里部分的订单
    handleCheckOrder() {
      if (this.checkOrderParams.reconciliationEntities[0]) {
        if (
          this.checkOrderParams.reconciliationEntities[0].omsOrderIds.length
        ) {
          this.checkOrderParams.checkId = this.info.id
          this.checkOrderParams.reconciliationEntities[0].id = this.currentCheckOrderId
          this.checkOrderParams.reconciliationEntities = JSON.stringify(
            this.checkOrderParams.reconciliationEntities
          )
          z.ld()
          request({
            url: 'settle/checkreconciliation/omssave',
            method: 'post',
            params: this.checkOrderParams
          })
            .then(() => {
              z.lc()
              z.success('核销成功')
              this.updateRecPayOrderInfo(this.info.id)
              this.updateCheckOrderList()
              this.checkOrderParams = {
                checkId: '',
                reconciliationEntities: []
              }
              this.isOrderListDialog = false
            })
            .catch(() => {
              z.lc()
              this.checkOrderParams = {
                checkId: '',
                reconciliationEntities: []
              }
              this.isOrderListDialog = false
            })
        } else {
          z.error('至少选择一条订单')
        }
      } else {
        z.error('至少选择一条订单')
      }
    },
    showOrderList(id, index, type) {
      this.isOrderListDialog = true
      this.currentCheckOrderId = id
      this.currentCheckOrderIndex = index
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
          omsOrderIds: []
        })
      })
    },
    // 选择核销单中的一条订单
    handleSelectOrder(list) {
      if (!this.checkOrderParams.reconciliationEntities.length) {
        this.checkOrderParams.reconciliationEntities = [
          {
            omsOrderIds: []
          }
        ]
      }
      this.checkOrderParams.reconciliationEntities[0].omsOrderIds = list.map(
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
    handleSizeChange(val) {
      this.searchRecPayOrderParams.pageNo = 1
      this.searchRecPayOrderParams.pageSize = val
      this.updateCheckOrderList()
    },
    handleCurrentChange(val) {
      this.searchRecPayOrderParams.pageNo = val
      this.updateCheckOrderList()
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
