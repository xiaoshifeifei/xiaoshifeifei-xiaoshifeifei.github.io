<template>
  <div>
    <div v-if="showPage === 'list'">
      <div style="padding-bottom:10px;">
        <el-button @click="refresh" icon="el-icon-refresh" type="primary">刷新</el-button>
        <el-button @click="handleAdd" icon="el-icon-plus" type="primary">新增</el-button>
        <el-button
          :icon="isSearchShow? 'el-icon-arrow-down' : 'el-icon-arrow-left'"
          :title="isSearchShow? '搜索框隐藏' : '搜索框显示'"
          @click="isSearchShow = !isSearchShow"
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
        ref="searchFormInfoRef"
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
        <el-table-column align="center" fixed="right" label="操作" slot="append">
          <template slot-scope="scope">
            <el-button @click="handleDetail(scope.row.id, scope.row.type)" type="primary">详情</el-button>
            <el-button :disabled="scope.row.status !== 'NONE'" @click="handleDelete(scope.row.id)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </custom-table>
    </div>
    <div v-if="showPage === 'add'">
      <add @goBack="changeShowPage('list')"/>
    </div>
    <div v-if="showPage === 'detail'">
      <detail :info="info" @goBack="changeShowPage('list')"/>
    </div>
  </div>
</template>
<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import { listTypeInfo } from './data.js'
import add from './add'
import detail from './detail'

export default {
  components: {
    add,
    detail
  },
  data() {
    return {
      showPage: 'list',
      isSearchShow: true,

      searchForm: {
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      searchFormInfo: {
        ref: {},
        labelWidth: '90px',
        data: {
          reconciliationNo: '',
          sendVehicleNo: '',
          status: '',
          type: '3'
        },
        fieldList: [
          {
            label: '对账单编号',
            value: 'reconciliationNo',
            type: 'input'
          },
          {
            label: '派车单编号',
            value: 'sendVehicleNo',
            type: 'input'
          },
          {
            label: '对账单状态',
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
      info: {},
      tableData: [],
      tableDataColumns: [
        {
          prop: 'reconciliationNo',
          label: '对账单编号',
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
      listTypeInfo: {}
    }
  },
  created() {
    this.doSearch()
    this.listTypeInfo = listTypeInfo()
  },
  methods: {
    changeShowPage(e) {
      this.showPage = e
      this.doSearch()
    },
    refresh() {
      this.$nextTick(() => {
        if (this.$refs.searchFormInfoRef) {
          this.$refs.searchFormInfoRef.resetFields()
        }
        this.doSearch()
      })
    },
    doSearch() {
      this.searchForm.pageNo = 1
      this.updateList()
    },
    updateList() {
      const data = {
        ...this.searchForm,
        ...this.searchFormInfo.data
      }
      request({
        url: '/settle/settlereconciliation/page',
        method: 'post',
        params: data
      }).then(res => {
        this.tableData = res.data.list
        this.searchForm.total = res.data.totalCount
      })
    },
    handleAdd() {
      this.searchFormInfo.data.type = '3'
      this.changeShowPage('add')
    },
    handleDetail(id, type) {
      this.info.id = id
      this.info.type = type
      this.changeShowPage('detail')
    },
    handleDelete(id) {
      z.confirm('确定删除吗', () => {
        request({
          url: '/settle/settlereconciliation/remove',
          method: 'delete',
          params: { id }
        }).then(() => {
          z.success('删除成功')
          this.doSearch()
        })
      })
    },
    handleCurrentChange(val) {
      this.searchForm.pageNo = val
      this.updateList()
    },
    handleSizeChange(val) {
      this.searchForm.pageNo = 1
      this.searchForm.pageSize = val
      this.updateList()
    }
  }
}
</script>
