<template>
  <div class="layout_main">
    <div v-if="showPage === 'list'">
      <div style="padding-bottom:10px;">
        <el-button @click="refresh" icon="el-icon-refresh" type="primary">刷新</el-button>
        <el-button
          @click="changeShowPage('addOrder')"
          icon="el-icon-plus"
          type="primary"
          v-if="isPlat"
        >新增询价单</el-button>
        <el-button
          :icon="isSearchShow? 'el-icon-arrow-down' : 'el-icon-arrow-left'"
          :title="isSearchShow? '搜索框隐藏' : '搜索框显示'"
          @click="isSearchShow = !isSearchShow"
          style="float:right"
          type="primary"
        >{{isSearchShow?'隐藏搜索':'显示搜索'}}</el-button>
      </div>
      <search-form
        :excludeFieldList="['orderNo', 'status']"
        :searchFormInfo.sync="searchFormInfo"
        @onSearch="doSearch"
        ref="searchFormInfoRef"
        v-show="isSearchShow"
      />
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
          <span v-if="!isPlat">
            <span v-if="scope.row.status == '2'">已结束</span>
            <span v-else>{{ scope.row.statusjj | formatFreightOrderStatus }}</span>
          </span>
          <span v-else>{{ scope.row.status | formatPlatFreightOrderStatus }}</span>
        </template>
        <el-table-column align="center" fixed="right" label="操作" slot="append" width="150">
          <template slot-scope="scope">
            <el-button
              @click="handleEdit(scope.row)"
              type="primary"
            >{{ isPlat ? '详情' : scope.row.status != '4' && scope.row.status != '2' ? '编辑' : '详情' }}</el-button>
            <el-button @click="handleDelete(scope.row.id)" type="danger" v-if="isPlat">删除</el-button>
          </template>
        </el-table-column>
      </custom-table>
    </div>
    <div v-if="showPage === 'addOrder'">
      <add-order @goBack="changeShowPage('list')"/>
    </div>
    <div v-if="showPage === 'editOrder'">
      <edit-order
        :currentCompanyId="currentCompanyId"
        :id="currentId"
        :pageType="pageType"
        @goBack="changeShowPage('list')"
      />
    </div>
  </div>
</template>
<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import addOrder from './addOrder'
import editOrder from './editOrder'

export default {
  components: {
    addOrder,
    editOrder
  },
  data() {
    return {
      showPage: 'list',
      isSearchShow: true,
      isPlat: false,
      currentId: '',
      currentCompanyId: '',

      pageType: 'edit',

      searchForm: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        companyId: '',
        type: '1'
      },
      searchFormInfo: {},
      tableData: [],
      tableDataColumns: [
        {
          prop: 'beginaddr',
          label: '起点',
          align: 'center'
        },
        {
          prop: 'endaddr',
          label: '终点',
          align: 'center'
        },
        {
          prop: 'status',
          label: '状态',
          align: 'center',
          slotName: 'status'
        },
        {
          prop: 'enddate',
          label: '截止时间',
          align: 'center'
        }
      ]
    }
  },
  created() {
    this.searchForm.companyId = this.$store.state.user.user.companyId
    if (
      this.$store.state.user.user.companyId === 'b59dc41383294a86aeb2c69cb14363c5'
    ) {
      this.isPlat = true
    }
    this.doSearch()
  },
  methods: {
    changeShowPage(e) {
      this.showPage = e
      this.refresh()
    },
    refresh() {
      this.$nextTick(() => {
        if (this.$refs.searchFormInfoRef) {
          this.$refs.searchFormInfoRef.resetFields()
        }
      })
    },
    doSearch() {
      this.searchForm.pageNo = 1
      this.searchData()
    },
    searchData() {
      let url = ''
      if (this.isPlat) {
        this.type = 2
        url = '/price/omspriceinquiry/page'
      } else {
        url = '/price/omspricebidcompany/pages'
      }
      request({
        url,
        method: 'post',
        params: Object.assign(this.searchForm, this.searchFormInfo.data)
      }).then(res => {
        this.tableData = res.data.list
        this.searchForm.total = res.data.totalCount
      })
    },
    handleEdit(row) {
      this.currentId = row.id
      this.currentCompanyId = row.companyId
      if (this.isPlat) {
        if (row.status === '2' || row.status === '4') {
          this.pageType = 'info'
        } else {
          this.pageType = 'edit'
        }
      } else {
        if (row.status === '2') {
          this.pageType = 'info'
        } else {
          if (row.statusjj === '4') {
            this.pageType = 'edit'
          } else {
            this.pageType = 'info'
          }
        }
      }
      this.changeShowPage('editOrder')
    },
    handleDelete(id) {
      z.confirm('确认删除吗', () => {
        request({
          url: '/price/omspriceinquiry/remove',
          method: 'post',
          params: { id }
        }).then(() => {
          this.searchData()
        })
      })
    },
    handleCurrentChange(val) {
      this.searchForm.pageNo = val
      this.searchData()
    },
    handleSizeChange(val) {
      this.searchForm.pageNo = 1
      this.searchForm.pageSize = val
      this.searchData()
    }
  }
}
</script>
