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
    // 获取对账单的详情（内含派车单列表）
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
        this.orderTableData = res.data.waybillSendList
      })
    },
    showOrderList(id, index, type) {
      this.isOrderListDialog = true
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
