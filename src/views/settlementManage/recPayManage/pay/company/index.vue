<template>
  <div>
    <div v-if="showPage === 'list'">
      <div style="padding-bottom:10px;">
        <el-button @click="idAdd = true" icon="el-icon-plus" type="primary">新增</el-button>
        <el-button @click="refresh" icon="el-icon-refresh" type="primary">刷新</el-button>
        <el-button
          :icon="isSearchShow? 'el-icon-arrow-down' : 'el-icon-arrow-left'"
          :title="isSearchShow? '搜索框隐藏' : '搜索框显示'"
          @click="isSearchShow?isSearchShow = false: isSearchShow = true"
          style="float:right"
          type="primary"
        >{{isSearchShow?'隐藏搜索':'显示搜索'}}</el-button>
      </div>
      <custom-form
        :data="searchFormInfo.data"
        :field-list="searchFormInfo.fieldList"
        :label-width="searchFormInfo.labelWidth"
        :labelPosition="searchFormInfo.labelPosition"
        :list-type-info="listTypeInfo"
        :ref-obj.sync="searchFormInfo.ref"
        @handleEvent="handleEvent"
        class="search-form"
        v-show="isSearchShow"
      >
        <el-button @click="doSearch" icon="el-icon-search" slot="form-searchBtn" type="primary">搜 索</el-button>
        <el-button @click="refresh()" icon="el-icon-refresh" slot="form-resetBtn" type="default">重 置</el-button>
      </custom-form>
      <custom-table
        :columns="tableDataColumns"
        :columnsTypeArray="[{ label: '序号', type: 'index' }]"
        :currentPage="searchForm.pageNo"
        :data="tableData"
        :page-size="searchForm.pageSize"
        :total="searchForm.total"
        @change-current-page="handleCurrentChange"
        @change-size="handleSizeChange"
      >
        <template slot="status" slot-scope="scope">
          <span>{{ scope.row.status | formatCheckStatus }}</span>
        </template>
        <template slot="payStatus" slot-scope="scope">
          <span>{{ scope.row.payStatus | formatCheckStatus }}</span>
        </template>
        <el-table-column align="center" fixed="right" label="操作" slot="append" width="250">
          <template slot-scope="scope">
            <el-button @click="handleClickDetail(scope.row.id)" type="primary">详情</el-button>
            <el-button @click="handleClickCheckOrde(scope.row.id)" type="primary">核销</el-button>
            <el-button :disabled="scope.row.status !== 'NONE'" @click="handleDelete(scope.row.id)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </custom-table>
    </div>
    <el-dialog :visible.sync="idAdd" @close="handleCloseAddOrder" title="添加企业付款订单" width="50%">
      <custom-form
        :data="recPayOrderFormInfo.data"
        :field-list="recPayOrderFormInfo.fieldList"
        :label-width="recPayOrderFormInfo.labelWidth"
        :list-type-info="listTypeInfo"
        :ref-obj.sync="recPayOrderFormInfo.ref"
        :rules="recPayOrderFormInfo.rules"
      />
      <span slot="footer">
        <el-button @click="handleCloseAddOrder">取消</el-button>
        <el-button @click="handleAddOrder" type="primary">确定</el-button>
      </span>
    </el-dialog>
    <div v-if="showPage === 'detail'">
      <detail :info="info" @goBack="changeShowPage('list')"/>
    </div>
    <div v-if="showPage === 'check'">
      <check :info="info" @goBack="changeShowPage('list')"/>
    </div>
  </div>
</template>
<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import { recPayOrderFormInfo, listTypeInfo } from './formInfo'
import detail from './detail'
import check from './check'

export default {
  components: {
    detail,
    check
  },
  data() {
    return {
      showPage: 'list',
      currentOrderId: '',
      // 搜索显示隐藏
      isSearchShow: true,
      searchForm: {
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      info: {},
      searchFormInfo: {
        ref: {},
        labelWidth: '100px',
        data: {
          reconciliationNo: '',
          orderNo: '',
          status: '',
          recPay: 'pay'
        },
        fieldList: [
          {
            label: '对账单编号',
            value: 'reconciliationNo',
            type: 'input'
          },
          {
            label: '订单编号',
            value: 'orderNo',
            type: 'input'
          },
          {
            label: '核销状态',
            value: 'status',
            type: 'select',
            list: 'statusList',
            selectKey: 'label',
            selectValue: 'value'
          },
          {
            label: '',
            value: 'searchBtn',
            type: 'slot'
          },
          {
            label: '',
            value: 'resetBtn',
            type: 'slot'
          }
        ]
      },
      selection: [],
      tableData: [],
      tableDataColumns: [
        {
          prop: 'checkNo',
          label: '付款号',
          align: 'center'
        },
        {
          prop: 'oppositePayer',
          label: '收款方公司名称',
          align: 'center'
        },
        {
          prop: 'oppositeAccountName',
          label: '收款方名称',
          align: 'center'
        },
        {
          prop: 'oppositeOpeningBank',
          label: '收款方开户行',
          align: 'center'
        },
        {
          prop: 'oppositeBankAccount',
          label: '收款方开户名',
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
          prop: 'status',
          label: '核销状态',
          slotName: 'status',
          align: 'center'
        },
        {
          prop: 'payStatus',
          label: '被开票核销状态',
          slotName: 'payStatus',
          align: 'center'
        }
      ],
      idAdd: false,
      recPayOrderFormInfo: {},
      listTypeInfo: {}
    }
  },
  created() {
    this.recPayOrderFormInfo = recPayOrderFormInfo()
    this.recPayOrderFormInfo.fieldList = this.recPayOrderFormInfo.fieldList.filter(
      item => item.value !== 'notVerification'
    )
    this.listTypeInfo = listTypeInfo()
    this.searchData()
  },
  methods: {
    handleEvent(event) {
      /* eslint-disable */
      switch (event) {
        case 'handleChangeType':
          this.doSearch()
          break
      }
    },
    changeShowPage(e) {
      this.showPage = e
      this.doSearch()
    },
    // 重置表单（刷新）
    refresh() {
      this.searchFormInfo.ref.resetFields()
      this.searchData()
    },
    doSearch() {
      this.searchForm.pageNo = 1
      this.searchData()
    },
    // 首次进去获取表格数据
    searchData() {
      z.ld()
      request({
        url: '/settle/settlecheck/page',
        method: 'post',
        params: {
          ...this.searchForm,
          ...this.searchFormInfo.data
        }
      })
        .then(res => {
          z.lc()
          this.tableData = res.data.list
          this.searchForm.total = res.data.totalCount
        })
        .catch(() => {
          z.lc()
        })
    },
    handleCloseAddOrder() {
      this.recPayOrderFormInfo.ref.resetFields()
      this.idAdd = false
    },
    // 添加付款
    handleAddOrder() {
      this.recPayOrderFormInfo.ref.validate(validate => {
        if (validate) {
          this.recPayOrderFormInfo.data.recPay = this.searchFormInfo.data.recPay
          z.ld()
          request({
            url: '/settle/settlecheck/save',
            method: 'post',
            params: {
              ...this.recPayOrderFormInfo.data
            }
          })
            .then(() => {
              z.lc()
              this.handleCloseAddOrder()
              this.doSearch()
            })
            .catch(() => {
              z.lc()
            })
        }
      })
    },
    handleClickDetail(id) {
      this.info.id = id
      this.changeShowPage('detail')
    },
    // 核销
    handleClickCheckOrde(id) {
      this.info.id = id
      this.info.recPay = this.searchFormInfo.data.recPay
      this.changeShowPage('check')
    },
    // 删除付款记录
    handleDelete(id) {
      z.confirm('确定删除吗', () => {
        z.ld()
        request({
          url: '/settle/settlecheck/remove',
          method: 'delete',
          params: { id }
        })
          .then(() => {
            z.lc()
            this.doSearch()
          })
          .catch(() => {
            z.lc()
          })
      })
    },
    handleSizeChange(val) {
      this.searchForm.pageNo = 1
      this.searchForm.pageSize = val
      this.searchData()
    },
    handleCurrentChange(val) {
      this.searchForm.pageNo = val
      this.searchData()
    }
  }
}
</script>
