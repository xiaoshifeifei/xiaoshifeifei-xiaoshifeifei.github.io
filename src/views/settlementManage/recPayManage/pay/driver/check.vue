<template>
  <div>
    <el-card>
      <div slot="header">
        <span>付款派车单</span>
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
        :currentPage="searchCheckOrderParams.pageNo"
        :data="checkOrderTableData"
        :page-size="searchCheckOrderParams.pageSize"
        :total="searchCheckOrderParams.total"
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
            >派车单列表</el-button>
          </template>
        </el-table-column>
      </custom-table>
      <!-- 派车单列表 -->
      <el-dialog
        :show-close="false"
        :visible.sync="isOrderListDialog"
        @close="handleCloseDialog"
        width="60%"
      >
        <template slot="title">
          <span>派车单列表</span>
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
        type: 3,
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      recPayOrderFormInfo: {},
      checkOrderTableData: [],
      // 付款账单表格
      checkOrderTableDataColumns: [
        {
          prop: 'reconciliationNo',
          label: '编号',
          align: 'center'
        },
        {
          prop: 'receivable',
          label: '应付款金额',
          align: 'center'
        },
        {
          prop: 'recpits',
          label: '实付款金额',
          align: 'center'
        },
        {
          prop: 'uncollected',
          label: '未付款金额',
          align: 'center'
        },
        {
          prop: 'status',
          label: '核销状态',
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
      // 派车单列表弹框
      selectionOrder: [],
      isOrderListDialog: false,
      orderTableData: [],
      orderTableDataColumns: [
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
        params: this.searchCheckOrderParams
      })
        .then(res => {
          z.lc()
          this.checkOrderTableData = res.data.list
          this.searchCheckOrderParams.total = res.data.totalCount
        })
        .catch(() => {
          z.lc()
        })
    },
    // 获取对账单的详情（内含派车单列表）
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
          this.orderTableData = res.data.waybillSendList
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
          url: '/settle/checkreconciliation/save',
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
    // 核销一个对账单里部分的派车单
    handleCheckOrder() {
      if (this.checkOrderParams.reconciliationEntities[0]) {
        if (
          this.checkOrderParams.reconciliationEntities[0].waybillSendIds.length
        ) {
          this.checkOrderParams.checkId = this.info.id
          this.checkOrderParams.reconciliationEntities[0].id = this.currentCheckOrderId
          this.checkOrderParams.reconciliationEntities = JSON.stringify(
            this.checkOrderParams.reconciliationEntities
          )
          z.ld()
          request({
            url: '/settle/checkreconciliation/save',
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
          z.error('至少选择一条派车单')
        }
      } else {
        z.error('至少选择一条派车单')
      }
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
    // 选择核销单中的一条派车单
    handleSelectOrder(list) {
      if (!this.checkOrderParams.reconciliationEntities.length) {
        this.checkOrderParams.reconciliationEntities = [
          {
            orderIds: [],
            waybillSendIds: []
          }
        ]
      }
      this.checkOrderParams.reconciliationEntities[0].waybillSendIds = list.map(
        item => item.sendvehicleId
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
      this.searchCheckOrderParams.pageNo = 1
      this.searchCheckOrderParams.pageSize = val
      this.updateCheckOrderList()
    },
    handleCurrentChange(val) {
      this.searchCheckOrderParams.pageNo = val
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
