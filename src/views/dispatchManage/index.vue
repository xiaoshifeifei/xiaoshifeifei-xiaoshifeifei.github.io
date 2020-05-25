<template>
  <div class="layout_main">
    <div v-if="showPage === 'list'">
      <div style="padding-bottom:10px;">
        <el-button @click="resetSearch()" icon="el-icon-refresh" type="primary">刷新</el-button>
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
        :haveBorder="false"
        :label-width="searchFormInfo.labelWidth"
        :listTypeInfo="listTypeInfo"
        :ref-obj.sync="searchFormInfo.ref"
        ref="searchForm"
        v-show="isSearchShow"
        class="search-form"
      >
        <el-button @click="doSearch" icon="el-icon-search" slot="form-searchBtn" type="primary">搜 索</el-button>
        <el-button
          @click="resetSearch()"
          icon="el-icon-refresh"
          slot="form-resetBtn"
          type="default"
        >重 置</el-button>
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
          <span>{{ scope.row.status | formatCompanyOrderStatus }}</span>
        </template>
        <el-table-column align="center" fixed="right" label="操作" slot="append" width="290">
          <template slot-scope="scope">
            <el-button @click="handleClickDetail(scope.row)" type="text">详情</el-button>
            <el-button
              :disabled="scope.row.status == 'new' || scope.row.status == 'NEW'"
              @click="handleClickServerFollow(scope.row)"
              type="text"
            >服务跟踪</el-button>
            <el-button
              :disabled="scope.row.status != 12"
              @click="handleClickFinshServer(scope.row)"
              style="width:40px;"
              type="text"
            >结束服务</el-button>
            <el-button @click="handleClickFeedBack(scope.row)" style="margin-left: 25px" type="text">信息反馈查询</el-button>
          </template>
        </el-table-column>
      </custom-table>
    </div>
    <!-- 服务跟踪 -->
    <div v-if="showPage === 'serverFollow'">
      <server-follow :info="info" @goBack="changeShowPage('list')"/>
    </div>
    <!-- 详情 -->
    <div v-if="showPage === 'detail'">
      <detail :info="info" @goBack="changeShowPage('list')"/>
    </div>
    <!-- 信息反馈 -->
    <div v-if="showPage === 'feedBack'">
      <feed-back :info="info" @goBack="changeShowPage('list')"/>
    </div>
  </div>
</template>

<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import { listTypeInfo } from './data.js'
import detail from './detail'
import feedBack from './feedBack'
import serverFollow from './serverFollow'

export default {
  components: {
    detail,
    feedBack,
    serverFollow
  },
  data() {
    return {
      showPage: 'list',
      // 搜索显示隐藏
      isSearchShow: true,
      info: {},
      searchForm: {
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      searchFormInfo: {
        ref: {},
        labelWidth: '80px',
        data: {
          sendvehicleNo: '',
          driverName: '',
          vehicleNumber: '',
          status: ''
        },
        fieldList: [
          {
            label: '派车单号',
            value: 'sendvehicleNo',
            type: 'input'
          },
          {
            label: '司机姓名',
            value: 'driverName',
            type: 'input'
          },
          {
            label: '车牌号',
            value: 'vehicleNumber',
            type: 'input'
          },
          {
            label: '状态',
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
      tableData: [],
      tableDataColumns: [
        {
          prop: 'sendvehicleNo',
          label: '派车单号',
          align: 'center'
        },
        {
          prop: 'orderNo',
          label: '订单号',
          align: 'center'
        },
        {
          prop: 'driverName',
          label: '司机姓名',
          align: 'center'
        },
        {
          prop: 'driverTel',
          label: '司机手机号',
          align: 'center'
        },
        {
          prop: 'vehicleNumber',
          label: '车牌号',
          align: 'center'
        },
        {
          prop: 'status',
          label: '状态',
          align: 'center',
          slotName: 'status'
        }
      ],
      listTypeInfo: {}
    }
  },
  created() {
    this.listTypeInfo = listTypeInfo()
    this.searchData()
  },
  filters: {
    formatCompanyOrderStatus(value) {
      let result = ''
      const list = listTypeInfo()
      list.statusList.forEach(item => {
        if (value === item.value) {
          result = item.label
        }
      })
      return result
    }
  },
  methods: {
    changeShowPage(e) {
      this.showPage = e
      this.resetSearch()
    },
    // 重置表单（刷新）
    resetSearch() {
      if (this.$refs.searchForm !== undefined) {
        this.$refs.searchForm.resetFields()
      }
      this.doSearch()
    },
    // 首次进去获取表格数据
    searchData() {
      request({
        url: '/srv/srvwaybillsend/page',
        method: 'post',
        params: {
          ...this.searchForm,
          ...this.searchFormInfo.data
        }
      }).then(res => {
        this.tableData = res.data.list
        this.searchForm.total = res.data.totalCount
      })
    },
    doSearch() {
      this.tableData = []
      this.searchForm.pageNo = 1
      this.searchData()
    },
    handleClickFeedBack(row) {
      this.info.sendvehicleId = row.sendvehicleId
      this.changeShowPage('feedBack')
    },
    handleClickServerFollow(row) {
      this.info.sendvehicleId = row.sendvehicleId
      this.info.sendvehicleNo = row.sendvehicleNo
      this.info.vehicleNumber = row.vehicleNumber
      this.info.beginTime = row.acceptTime
      this.info.endTime = row.signTime
      this.info.orderNo = row.orderNo
      this.changeShowPage('serverFollow')
    },
    handleClickFinshServer(row) {
      let state = ''
      if (row.status === 12) {
        state = 'FINISH'
      }
      request({
        url: '/srv/srvwaybillsend/modifystatus',
        method: 'post',
        params: {
          sendvehicleId: row.sendvehicleId,
          status: state
        }
      }).then(() => {
        z.success('保存成功')
        this.resetSearch()
      })
    },
    // 详情
    handleClickDetail(row) {
      if (row.status === 'NEW') {
        this.info.type = 'edit'
      } else {
        this.info.type = 'info'
      }
      this.info.sendvehicleId = row.sendvehicleId
      this.info.companyId = row.companyId
      this.changeShowPage('detail')
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
