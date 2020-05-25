<template>
  <div>
    <el-card>
      <div slot="header">
        <span>收款订单</span>
        <el-button @click="goBack" style="float: right; margin-top: -5px" type="primary">返回</el-button>
      </div>
      <custom-form
        :data="invoiceFormInfo.data"
        :field-list="invoiceFormInfo.fieldList"
        :label-width="invoiceFormInfo.labelWidth"
        :list-type-info="listTypeInfo"
        :ref-obj.sync="invoiceFormInfo.ref"
      />
    </el-card>
    <el-card style="margin-top: 10px">
      <div slot="header">
        <span>核销收款单列表</span>
        <el-button
          @click="handleCheckAllOrder"
          style="float: right; margin-top: -5px"
          type="primary"
        >核销</el-button>
      </div>
      <custom-table
        :columns="recPayOrderTableDataColumns"
        :columnsTypeArray="[{ label: '', type: 'selection' }, { label: '序号', type: 'index' }]"
        :currentPage="searchRecPayOrderParams.pageNo"
        :data="recPayOrderTableData"
        :page-size="searchRecPayOrderParams.pageSize"
        :total="searchRecPayOrderParams.total"
        @change-current-page="handleCurrentChange"
        @change-size="handleSizeChange"
        @selection-change="handleSelectCheckOrder"
        ref="recPayOrderRef"
      >
        <template slot="status" slot-scope="scope">
          <span>{{ scope.row.payStatus | formatCheckStatus }}</span>
        </template>
        <el-table-column align="center" fixed="right" label="操作" slot="append">
          <template slot-scope="scope">
            <el-button @click.stop="handleCheckOrder(scope.row.id)" type="primary">核销</el-button>
          </template>
        </el-table-column>
      </custom-table>
    </el-card>
  </div>
</template>

<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import { invoiceFormInfo, listTypeInfo } from './formInfo'

export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          id: '',
          recPay: ''
        }
      }
    }
  },
  data() {
    return {
      currentCheckOrderId: '',
      searchRecPayOrderParams: {
        recPay: 'recAll',
        payStatus: 'NONE',
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      invoiceFormInfo: {},
      recPayOrderTableData: [],
      recPayOrderTableDataColumns: [
        {
          prop: 'checkNo',
          label: '收款号',
          align: 'center'
        },
        {
          prop: 'sumPrice',
          label: '总金额',
          align: 'center'
        },
        {
          prop: 'notes',
          label: '备注',
          align: 'center'
        },
        {
          prop: 'payStatus',
          label: '对账状态',
          slotName: 'status',
          align: 'center'
        }
      ],
      // 核销对账单参数
      recPayOrderParams: {
        checkEntities: []
      },
      listTypeInfo: {}
    }
  },
  created() {
    this.invoiceFormInfo = invoiceFormInfo()
    this.listTypeInfo = listTypeInfo()
    this.updateRecPayOrderInfo(this.info.id)
    this.updateOrderList()
    this.handleDisabledForm()
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    // 获取发票详情
    updateRecPayOrderInfo(id) {
      z.ld()
      request({
        url: '/bill/invoice/info',
        method: 'get',
        params: { id }
      })
        .then(res => {
          z.lc()
          this.invoiceFormInfo.data = res.data
        })
        .catch(() => {
          z.lc()
        })
    },
    // 获取收款订单列表
    updateOrderList() {
      z.ld()
      request({
        url: '/settle/settlecheck/page',
        method: 'post',
        params: this.searchRecPayOrderParams
      })
        .then(res => {
          z.lc()
          this.recPayOrderTableData = res.data.list
          this.searchRecPayOrderParams.total = res.data.totalCount
        })
        .catch(() => {
          z.lc()
        })
    },
    // 核销多个收款订单
    handleCheckAllOrder() {
      if (this.recPayOrderParams.checkEntities.length) {
        this.recPayOrderParams.billId = this.info.id
        this.recPayOrderParams.checkEntities = JSON.stringify(
          this.recPayOrderParams.checkEntities
        )
        z.ld()
        request({
          url: 'settle/billinvoicecheck/save',
          method: 'post',
          params: this.recPayOrderParams
        })
          .then(() => {
            z.success('核销成功')
            this.recPayOrderParams = {
              billId: '',
              checkEntities: []
            }
            this.$refs.recPayOrderRef.$children[0].clearSelection()
            this.updateRecPayOrderInfo(this.info.id)
            this.updateOrderList()
            z.lc()
          })
          .catch(() => {
            this.$refs.recPayOrderRef.$children[0].clearSelection()
            this.recPayOrderParams = {
              billId: '',
              checkEntities: []
            }
            z.lc()
          })
      } else {
        z.error('至少选择一条收款单')
      }
    },
    // 核销一个收款订单
    handleCheckOrder(id) {
      this.recPayOrderParams.billId = this.info.id
      this.recPayOrderParams.checkEntities.push(id)
      this.recPayOrderParams.checkEntities = JSON.stringify(
        this.recPayOrderParams.checkEntities
      )
      z.ld()
      request({
        url: 'settle/billinvoicecheck/save',
        method: 'post',
        params: this.recPayOrderParams
      })
        .then(() => {
          z.success('核销成功')
          this.updateRecPayOrderInfo(this.info.id)
          this.updateOrderList()
          this.recPayOrderParams = {
            billId: '',
            checkEntities: []
          }
          z.lc()
        })
        .catch(() => {
          this.recPayOrderParams = {
            billId: '',
            checkEntities: []
          }
          z.lc()
        })
    },
    // 选择多个收款订单
    handleSelectCheckOrder(list) {
      this.recPayOrderParams.checkEntities = list.map(item => item.id)
    },
    handleSizeChange(val) {
      this.searchRecPayOrderParams.pageNo = 1
      this.searchRecPayOrderParams.pageSize = val
      this.updateOrderList()
    },
    handleCurrentChange(val) {
      this.searchRecPayOrderParams.pageNo = val
      this.updateOrderList()
    },
    // 禁用表单
    handleDisabledForm() {
      this.invoiceFormInfo.fieldList.forEach(item => {
        item.disabled = true
      })
    }
  }
}
</script>
