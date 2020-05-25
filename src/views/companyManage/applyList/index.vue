<template>
  <div class="layout_main">
    <custom-table
      :columns="columns"
      :currentPage="searchForm.pageNo"
      :data="tableData"
      :page-size="searchForm.pageSize"
      :total="searchForm.total"
      @change-current-page="handleCurrentChange"
      @change-size="handleSizeChange"
    >
      <template slot="joinStatus" slot-scope="scope">
        <span style="color:#999" v-if="scope.row.joinStatus == 0">未提交审核</span>
        <span style="color:#85ce61" v-else-if="scope.row.joinStatus == 1">待审核</span>
        <span style="color:#F56C6C" v-else-if="scope.row.joinStatus == 2">审核通过</span>
        <span style="color:#F56C6C" v-else-if="scope.row.joinStatus == 3">审核不通过</span>
      </template>
      <el-table-column align="center" fixed="right" label="操作" slot="append">
        <template slot-scope="scope">
          <el-button @click.native.prevent="pass(scope, tableData, 2)" type="text">通过</el-button>
          <el-button @click.native.prevent="pass(scope, tableData, 3)" type="text">不通过</el-button>
        </template>
      </el-table-column>
    </custom-table>
  </div>
</template>
<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'

export default {
  name: 'consignee_manage',
  data() {
    return {
      tableData: [],
      columns: [
        {
          prop: 'loginName',
          label: '手机号',
          align: 'center'
        },
        {
          prop: 'joinStatus',
          label: '状态',
          align: 'center',
          slotName: 'joinStatus'
        }
      ],
      belongedCompanyList: [],
      searchForm: {
        total: 0,
        pageNo: 0,
        pageSize: 10
      }
    }
  },
  created() {
    this.getCarrierData()
    this.getLoginInfo().then(() => {
      this.searchData()
    })
  },
  methods: {
    // 首次进去获取表格数据
    searchData() {
      z.ld()
      request({
        url: '/org/orguser/pagejoin',
        method: 'post',
        params: this.searchForm
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
    pass(scope, tableData, num) {
      this.$confirm(`确定${num === 2 ? '通过' : '不通过'}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        z.ld()
        request({
          url: '/org/orguser/modifycompany',
          method: 'post',
          data: {
            id: scope.row.id,
            userId: scope.row.userId,
            joinStatus: num
          }
        })
          .then(() => {
            z.lc()
            z.success('处理成功')
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
    },
    getCarrierData() {
      request({
        url: '/org/orgcompany/page',
        method: 'post',
        params: {
          pageNo: 0,
          pageSize: 500
        }
      }).then(res => {
        this.belongedCompanyList = res.data.list
      })
    },
    getLoginInfo() {
      return new Promise(resolve => {
        request({
          url: 'sys/login/getlogininfo',
          method: 'get'
        }).then(res => {
          resolve(res.data)
        })
      })
    }
  }
}
</script>
