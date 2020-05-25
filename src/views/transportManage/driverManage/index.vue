<template>
  <div class="layout_main">
    <div v-if="showPage === 'list'">
      <div style="padding-bottom:10px;">
        <el-button @click="handleAdd()" icon="el-icon-plus" type="primary">添加</el-button>
        <el-button @click="handleDeleteBatch()" icon="el-icon-delete" type="danger">批量删除</el-button>
        <el-button @click="resetSearch()" icon="el-icon-refresh" type="primary">刷新</el-button>
        <el-select
          @change="resetSearch()"
          placeholder="请选择人员类型"
          style="margin-left: 10px"
          v-model="searchFormInfo.data.inOut"
        >
          <el-option label="编外司机" value="OUT"></el-option>
          <el-option label="内部人员" value="IN"></el-option>
        </el-select>
        <el-button
          :icon="isSearchShow? 'el-icon-arrow-down' : 'el-icon-arrow-left'"
          :title="isSearchShow? '搜索框隐藏' : '搜索框显示'"
          @click="isSearchShow?isSearchShow = false: isSearchShow = true"
          style="float:right"
          type="primary"
        >{{isSearchShow?'隐藏搜索':'显示搜索'}}</el-button>
      </div>
      <div v-if="isSearchShow">
        <custom-form
          :data="searchFormInfo.data"
          :field-list="searchFormInfo.fieldList"
          :haveBorder="false"
          :label-width="searchFormInfo.labelWidth"
          :ref-obj.sync="searchFormInfo.ref"
          ref="searchForm"
          class="search-form"
          v-show="isSearchShow"
        >
          <el-button
            @click="doSearch"
            icon="el-icon-search"
            slot="form-searchBtn"
            type="primary"
          >搜 索</el-button>
          <el-button
            @click="resetSearch()"
            icon="el-icon-refresh"
            slot="form-resetBtn"
            type="default"
          >重 置</el-button>
        </custom-form>
      </div>
      <custom-table
        :columns="tableDataColumns"
        :columnsTypeArray="[{ label: '', type: 'selection' }, { label: '序号', type: 'index' }]"
        :currentPage="searchForm.pageNo"
        :data="tableData"
        :page-size="searchForm.pageSize"
        :total="searchForm.total"
        @change-current-page="handleCurrentChange"
        @change-size="handleSizeChange"
        @selection-change="handleSelectionChange"
      >
        <template slot="status" slot-scope="scope">
          <span>{{ scope.row.status | formatDriverStatus }}</span>
        </template>
        <el-table-column align="center" fixed="right" label="操作" slot="append">
          <template slot-scope="scope">
            <el-button @click.native.prevent="doEdit(scope.row.driverId)" type="text">编辑</el-button>
            <el-button @click.native.prevent="handleDelete(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </custom-table>
    </div>
    <div v-else-if="showPage === 'add'">
      <add @goBack="changeShowPage('list')"/>
    </div>
    <div v-else-if="showPage === 'edit'">
      <edit :driverId="driverId" @goBack="changeShowPage('list')"/>
    </div>
  </div>
</template>
<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import add from './add.vue'
import edit from './edit.vue'

export default {
  components: {
    add,
    edit
  },
  data() {
    return {
      showPage: 'list',
      driverId: '',
      isSearchShow: true,
      searchForm: {
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      searchFormInfo: {
        ref: {},
        labelWidth: '80px',
        data: {
          inOut: 'IN',
          createUserName: '',
          phone: '',
          driverLicense: ''
        },
        fieldList: [
          {
            label: '司机姓名',
            value: 'createUserName',
            type: 'input'
          },
          {
            label: '联系方式',
            value: 'phone',
            type: 'input'
          },
          {
            label: '驾驶证号',
            value: 'driverLicense',
            type: 'input'
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
          prop: 'createUserName',
          label: '司机姓名',
          align: 'center'
        },
        {
          prop: 'phone',
          label: '联系方式',
          align: 'center'
        },
        {
          prop: 'driverLicenseType',
          label: '驾驶证类型',
          align: 'center'
        },
        {
          prop: 'driverLicense',
          label: '驾驶证号',
          align: 'center'
        },
        {
          prop: 'driverLicenseIssueDate',
          label: '初次领证日期',
          align: 'center'
        },
        {
          prop: 'status',
          label: '司机状态',
          align: 'center',
          slotName: 'status'
        }
      ]
    }
  },
  filters: {
    formatDriverStatus(val) {
      if (val === 0) {
        return '正常'
      } else if (val === 1) {
        return '吊销'
      } else {
        return '注销'
      }
    }
  },
  methods: {
    changeShowPage(e) {
      this.selection = []
      this.showPage = e
      this.resetSearch()
    },
    // 重置表单（刷新）
    resetSearch() {
      if (this.$refs.searchForm !== undefined) {
        this.$refs.searchForm.resetFields()
      }
      this.searchData()
    },
    // 首次进去获取表格数据
    searchData() {
      z.ld()
      request({
        url: '/basic/orgdriver/findMyDirver',
        method: 'post',
        params: {
          ...this.searchForm,
          ...this.searchFormInfo.data
        }
      }).then(res => {
        this.tableData = res.data
        this.searchForm.total = res.data.totalCount
      })
    },
    doSearch() {
      this.tableData = []
      this.searchForm.pageNo = 1
      this.searchData()
    },
    // 编辑
    doEdit(driverId) {
      this.driverId = driverId
      this.changeShowPage('edit')
    },
    // 添加
    handleAdd() {
      this.changeShowPage('add')
    },
    // 删除
    handleDelete(row) {
      z.confirm('确定删除这条记录吗？', () => {
        z.ld()
        request({
          url: '/basic/orgdriver/remove',
          method: 'delete',
          params: {
            driverId: row.driverId
          }
        }).then(() => {
          z.success('删除成功')
          this.searchData()
        })
      })
    },
    handleDeleteBatch() {
      let list = []
      const selection = this.selection

      if (selection.length <= 0) {
        z.warning('请选择要删除的记录')
        return
      }

      for (const key in selection) {
        list.push(selection[key].driverId)
      }
      list = list.join(',')
      z.confirm('确定删除[' + selection.length + ']条记录吗？', function() {
        request({
          url: '/basic/orgdriver/deletebatch',
          method: 'delete',
          params: { ids: list }
        }).then(() => {
          z.success('删除成功')
          this.searchData()
        })
      })
    },
    handleSelectionChange(selection) {
      this.selection = selection
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
  },
  created() {
    this.searchData()
  }
}
</script>
