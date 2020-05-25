<template>
  <div class="layout_main cargo">
    <div v-if="showPage === 'list'">
      <div style="padding-bottom:10px;">
        <el-button @click="changeShowPage('add')" icon="el-icon-plus" type="primary">添加</el-button>
        <el-button @click="refresh()" icon="el-icon-refresh" type="primary">刷新</el-button>
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
        :ref-obj.sync="searchFormInfo.ref"
        ref="searchForm"
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
        <template slot="isAuthen" slot-scope="scope">
          <span v-if="scope.row.isAuthen === 0">待审核</span>
          <span style="color: #42b983" v-if="scope.row.isAuthen === 1">审核通过</span>
          <span style="color: #ff0000" v-if="scope.row.isAuthen === 2">审核不通过</span>
        </template>
        <el-table-column align="center" fixed="right" label="操作" slot="append" width="270px">
          <template slot-scope="scope">
            <el-button @click.native.prevent="handleEdit(scope.row.id)" type="text">编辑</el-button>
            <el-button @click.native.prevent="handleAudit(scope, '1')" type="text" :disabled="scope.row.isAuthen !== 0">审核通过</el-button>
            <el-button @click.native.prevent="handleAudit(scope, '2')" type="text" :disabled="scope.row.isAuthen !== 0">审核不通过</el-button>
            <el-button
              @click.native.prevent="changeUseStatus(scope)"
              style="color: #ff0000"
              type="text"
              v-if="scope.row.status=='NORMAL'"
            >禁用</el-button>
            <el-button
              @click.native.prevent="changeUseStatus(scope)"
              style="color: #42b983"
              type="text"
              v-else
            >启用</el-button>
            <el-button @click.native.prevent="handleDelete(scope)" type="text" style="color: #ff0000">删除</el-button>
          </template>
        </el-table-column>
      </custom-table>
    </div>
    <div v-if="showPage === 'add'">
      <add @goBack="changeShowPage('list')"/>
    </div>
    <div v-if="showPage === 'edit'">
      <edit :companyId="companyId" @goBack="changeShowPage('list')"/>
    </div>
  </div>
</template>

<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import { searchFormInfo } from './companyForm.js'
import add from './add'
import edit from './edit'

export default {
  components: {
    add,
    edit
  },
  data() {
    return {
      // 搜索显示隐藏
      showPage: 'list',
      isSearchShow: true,
      isShow: true,
      companyId: '',
      searchFormInfo: {},
      searchForm: {
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      tableDataColumns: [
        {
          prop: 'name',
          label: '企业名称',
          align: 'center'
        },
        {
          prop: 'businessLicense',
          label: '营业执照号',
          align: 'center'
        },
        {
          prop: 'contactsTel',
          label: '联系人电话',
          align: 'center'
        },
        {
          prop: 'legalperson',
          label: '法定代表人',
          align: 'center'
        },
        {
          prop: 'address',
          label: '详细地址',
          align: 'center'
        },
        {
          prop: 'isAuthen',
          label: '状态',
          slotName: 'isAuthen',
          align: 'center'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          align: 'center'
        }
      ],
      tableData: []
    }
  },
  created() {
    this.searchFormInfo = searchFormInfo()
    this.searchData()
  },
  methods: {
    changeShowPage(e) {
      this.showPage = e
      this.refresh()
    },
    doSearch() {
      this.searchFormInfo.pageNo = 1
      this.searchData()
    },
    refresh() {
      this.$nextTick(() => {
        if (this.$refs.searchForm) {
          this.$refs.searchForm.resetFields()
          this.doSearch()
        }
      })
    },
    searchData() {
      const data = {
        ...this.searchFormInfo.data,
        ...this.searchForm
      }
      z.ld()
      request({
        url: '/org/orgcompany/page',
        method: 'post',
        params: data
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
    handleEdit(id) {
      this.companyId = id
      this.changeShowPage('edit')
    },
    handleAudit(e, isAuthen) {
      request({
        url: '/org/orgcompany/updatestatus',
        method: 'post',
        params: {
          id: e.row.id,
          isAuthen: isAuthen,
          name: e.row.name,
          addressName: e.row.addressName,
          socialUnifiedCode: e.row.socialUnifiedCode
        }
      })
        .then(() => {
          z.lc()
          z.success('修改成功')
          this.doSearch()
        })
        .catch(() => {
          z.lc()
        })
    },
    changeUseStatus(scope) {
      const status = scope.row.status
      z.confirm(
        `确认${status === 'NORMAL' ? '禁用' : '启用'}吗？`,
        () => {
          z.lc()
          request({
            url: '/org/orgcompany/updatestatus',
            method: 'post',
            data: {
              id: scope.row.id,
              status: status === 'NORMAL' ? 'DISABLE' : 'NORMAL'
            }
          })
            .then(() => {
              z.ld()
              z.success('操作成功')
              this.searchData()
            })
            .catch(() => {
              z.ld()
            })
        }
      )
    },
    // 删除
    handleDelete(scope) {
      const id = scope.row.id
      this.$confirm('确定删除这条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        z.ld()
        request({
          url: '/org/orgcompany/remove',
          method: 'delete',
          params: { companyId: id }
        })
          .then(() => {
            z.lc()
            z.success('删除成功')
            this.searchData()
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
