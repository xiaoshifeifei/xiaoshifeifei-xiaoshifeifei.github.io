<template>
  <div>
    <el-card>
      <div slot="header">
        <span>付款订单</span>
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
          id: ''
        }
      }
    }
  },
  data() {
    return {
      currentCheckOrderId: '',
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
      z.ld()
      request({
        url: '/settle/settlecheck/info',
        method: 'get',
        params: { id }
      })
        .then(res => {
          z.lc()
          this.recPayOrderFormInfo.data = res.data
          this.checkOrderTableData = res.data.settleReconciliationEntityList
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
          checkId: this.info.id,
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
    showOrderList(id, index, type) {
      this.isOrderListDialog = true
      this.currentCheckOrderId = id
      this.currentCheckOrderIndex = index
      this.currentCheckOrderType = type
      this.$refs.checkOrderRef.$children[0].clearSelection()
      this.updateCheckOrderInfo(id)
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
