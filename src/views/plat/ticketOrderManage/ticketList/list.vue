<template>
  <div>
    <div style="padding-bottom:10px;">
      <el-button @click="refresh" icon="el-icon-refresh" type="primary">刷新</el-button>
      <el-button @click="changeShowPage('addOrder')" icon="el-icon-plus" type="primary">新增托运单</el-button>
      <el-button
        :icon="isSearchShow? 'el-icon-arrow-down' : 'el-icon-arrow-left'"
        :title="isSearchShow? '搜索框隐藏' : '搜索框显示'"
        @click="isSearchShow = !isSearchShow"
        style="float:right"
        type="primary"
      >{{isSearchShow?'隐藏搜索':'显示搜索'}}</el-button>
    </div>
    <search-form
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
      <template slot="status" slot-scope="scope">
        <span style="color: #ff0000" v-if="scope.row.status === 'CUS_REFUSE_RECEIVE'">已拒绝</span>
        <span style="color: #ff0000" v-else-if="scope.row.status === 'REFUSE_RECEIVE'">被拒绝</span>
        <span v-else>{{ scope.row.status | formatCompanyOrderStatus }}</span>
      </template>
      <el-table-column align="center" fixed="right" label="操作" slot="append" width="200">
        <template slot-scope="scope">
          <el-button
            :type="scope.row.status === 'REFUSE_RECEIVE' ? 'danger' : 'primary'"
            @click="handleDetail(scope.row.orderId, scope.row.status)"
          >{{ scope.row.status === 'REFUSE_RECEIVE' ? '修改' : '详情' }}</el-button>
          <el-button
            :disabled="scope.row.status !== 2"
            @click="handleSend(scope.row)"
            type="primary"
          >派单</el-button>
        </template>
      </el-table-column>
    </custom-table>
    <el-dialog :visible.sync="isChooseCarrier" @close="handleCloseDialog" title="选择企业">
      <custom-form
        :data="carrierFormInfo.data"
        :field-list="carrierFormInfo.fieldList"
        :label-width="carrierFormInfo.labelWidth"
        :list-type-info="listTypeInfo"
        :ref-obj.sync="carrierFormInfo.ref"
        :rules="carrierFormInfo.rules"
        @handleEvent="handleEvent"
        ref="carrierForm"
      >
        <div slot="form-attachmentUrl" style="width: 160px">
          <el-upload
            :before-upload="beforeAvatarUpload"
            :data="{ title: 'eusinss' }"
            :on-success="handleUploadSuccess"
            :show-file-list="false"
            accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PNG, .GIF"
            action="platform/core/omssrvorder/uploads"
            class="avatar-uploader"
          >
            <img
              :src="carrierFormInfo.data.attachmentUrl"
              class="avatar"
              v-if="carrierFormInfo.data.attachmentUrl"
            >
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
        </div>
      </custom-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button @click="handleConfirm" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import { carrierFormInfo } from './data.js'

export default {
  data() {
    return {
      isSearchShow: true,

      searchForm: {
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      searchFormInfo: {},
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
          prop: 'customerName',
          label: '客户',
          align: 'center'
        },
        {
          prop: 'status',
          label: '状态',
          slotName: 'status',
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
      ],
      isChooseCarrier: false,
      carrierFormInfo: {},
      listTypeInfo: {
        carrierList: []
      }
    }
  },
  created() {
    this.refresh()
    this.carrierFormInfo = carrierFormInfo()
  },
  methods: {
    changeShowPage(e) {
      this.$store.state.ticketOrder.status = e
    },
    handleEvent(event, data) {
      /* eslint-disable */
      switch (event) {
        case 'handleChangeCarrier':
          this.hanldeChangeCarrier(data)
          break
      }
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
    handleDetail(orderId, orderStatus) {
      this.$store.state.ticketOrder.orderId = orderId
      this.$store.state.ticketOrder.orderStatus = orderStatus
      this.changeShowPage('detail')
    },
    searchData() {
      const data = {
        ...this.searchForm,
        ...this.searchFormInfo.data
      }
      request({
        url: 'core/omssrvorder/page',
        method: 'post',
        params: data
      }).then(res => {
        this.tableData = res.data.list
        this.searchForm.total = res.data.totalCount
      })
    },
    // 获取承运商列表
    updateCarrierList() {
      request({
        url: 'org/orgcompany/page',
        method: 'post',
        params: {
          isClient: '0',
          isJoin: true,
          pageNo: '1',
          pageSize: '1000'
        }
      }).then(res => {
        this.listTypeInfo.carrierList = res.data.list
      })
    },
    // 点击派单按钮
    handleSend(e) {
      this.isChooseCarrier = true
      this.carrierFormInfo.data.orderId = e.orderId
      this.updateCarrierList()
    },
    hanldeChangeCarrier(data) {
      this.listTypeInfo.carrierList.forEach(item => {
        if (item.name === data) {
          this.carrierFormInfo.data.carrierCompanyId = item.id
        }
      })
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!')
      }
      return isLt2M
    },
    handleUploadSuccess(res) {
      this.carrierFormInfo.data.attachmentUrl = res.url
    },
    handleCloseDialog() {
      this.isChooseCarrier = false
      this.carrierFormInfo.ref.resetFields()
    },
    handleConfirm() {
      this.carrierFormInfo.ref.validate(valid => {
        if (valid) {
          const data = this.carrierFormInfo.data
          request({
            url: 'core/omssrvorder/modifysend',
            method: 'put',
            params: data
          }).then(() => {
            z.success('派单成功')
            this.handleCloseDialog()
            this.searchData()
          })
        }
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
