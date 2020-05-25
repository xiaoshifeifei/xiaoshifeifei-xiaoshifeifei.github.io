<template>
  <div class="layout_main">
    <div v-if="showPage === 'list'">
      <div style="padding-bottom:10px;">
        <el-button @click="refresh" icon="el-icon-refresh" type="primary">刷新</el-button>
        <el-button
          @click="changeShowPage('add')"
          icon="el-icon-plus"
          type="primary"
        >新增已完成托运单</el-button>
        <el-button
          :icon="isSearchShow? 'el-icon-arrow-down' : 'el-icon-arrow-left'"
          :title="isSearchShow? '搜索框隐藏' : '搜索框显示'"
          @click="isSearchShow = !isSearchShow"
          style="float:right"
          type="primary"
        >{{isSearchShow?'隐藏搜索':'显示搜索'}}</el-button>
      </div>
      <search-form
        :excludeFieldList="['status']"
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
        <template slot="transportMode" slot-scope="scope">
          <span>{{ scope.row.transportMode | formatTransportMode }}</span>
        </template>
        <template slot="paymentMode" slot-scope="scope">
          <span>{{ scope.row.paymentMode | formatSettleType }}</span>
        </template>
        <el-table-column align="center" fixed="right" label="操作" slot="append">
          <template slot-scope="scope">
            <el-button @click="handleDetail(scope.row)" type="primary">详情</el-button>
          </template>
        </el-table-column>
      </custom-table>
    </div>
    <div v-if="showPage === 'add'">
      <info @goBack="changeShowPage('list')"/>
    </div>
    <div v-if="showPage === 'detail'">
      <info :info="orderInfo" @goBack="changeShowPage('list')"/>
    </div>
  </div>
</template>
<script>
import request from '@/utils/request'
import info from './info'

export default {
  components: {
    info
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
      searchFormInfo: {},
      orderInfo: {
        currentOrderId: '',
        orderStatus: true
      },
      tableData: [],
      tableDataColumns: [
        {
          prop: 'orderNo',
          label: '托运单号',
          align: 'center'
        },
        {
          prop: 'distributionTime',
          label: '托运（派车）日期',
          align: 'center'
        },
        {
          prop: 'takeDeliveryTime',
          label: '配送（到货）日期',
          align: 'center'
        },
        {
          prop: 'freightRevenue',
          label: '运费收入',
          align: 'center'
        },
        {
          prop: 'carrierCompanyName',
          label: '客户',
          align: 'center'
        },
        {
          prop: 'shipperAddress',
          label: '起始地',
          align: 'center'
        },
        {
          prop: 'receiverAddress',
          label: '目的地',
          align: 'center'
        }
      ]
    }
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
    handleDetail(info) {
      this.orderInfo.currentOrderId = info.orderId
      this.orderInfo.orderStatus = info.isConfirm
      this.changeShowPage('detail')
    },
    searchData() {
      request({
        url: '/srv/omssrvcomorder/page',
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
    handleCurrentChange(val) {
      this.searchForm.pageNo = val
      this.searchData()
    },
    handleSizeChange(val) {
      this.searchForm.pageNo = 1
      this.searchForm.pageSize = val
      this.searchData()
    }
  },
  mounted: function() {
    this.doSearch()
  }
}
</script>
