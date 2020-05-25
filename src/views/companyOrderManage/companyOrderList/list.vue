<template>
  <div>
    <div style="padding-bottom:10px;">
      <el-button @click="refresh" icon="el-icon-refresh" type="primary">刷新</el-button>
      <el-button @click="changeShowPage('addOrder')" icon="el-icon-plus" type="primary">新增订单</el-button>
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
      :extraInfo="searchFormExtraInfo"
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
      <template slot="orderType" slot-scope="scope">
        <span v-if="scope.row.orderType === 'PROPRIETARY_TRADING'">企业订单</span>
        <span v-else-if="scope.row.orderType === 'OMS'">OMS订单</span>
      </template>
      <template slot="status" slot-scope="scope">
        <span>{{ scope.row.status | formatCompanyOrderStatus }}</span>
      </template>
      <el-table-column align="center" fixed="right" label="操作" slot="append" width="250">
        <template slot-scope="scope">
          <el-button
            :type="scope.row.status === 4 ? 'danger' : 'primary'"
            @click="handleDetail(scope.row)"
          >{{ scope.row.status === 4 ? '修改' : '详情' }}</el-button>
          <el-button
            :disabled="scope.row.status !== 6 && scope.row.status !== 8 && scope.row.status !== 10 || scope.row.isPayApply"
            @click="handleSendCar(scope.row)"
            type="primary"
          >派车</el-button>
          <el-button
            :disabled="scope.row.status !== 6"
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
      // 动态添加搜索框额外字段
      searchFormExtraInfo: {
        list: [
          {
            data: 'orderNo',
            fieldDetail: {
              label: '订单号',
              value: 'orderNo',
              type: 'input',
              labelWidth: '60px'
            }
          },
          {
            data: 'status',
            fieldDetail: {
              label: '状态',
              value: 'status',
              type: 'select',
              list: 'statusList',
              selectKey: 'label',
              selectValue: 'value',
              labelWidth: '60px'
            }
          }
        ],
        listTypeInfo: {
          statusList: [
            {
              label: '待接单',
              value: 1
            },
            {
              label: '被拒绝',
              value: 4
            },
            {
              label: '调度中',
              value: 6
            },
            {
              label: '已派单',
              value: 7
            },
            {
              label: '部分派车',
              value: 8
            },
            {
              label: '运输中',
              value: 9
            },
            {
              label: '部分签收',
              value: 10
            },
            {
              label: '签收',
              value: 11
            },
            {
              label: '完成',
              value: 12
            }
          ]
        }
      },
      carrierFormInfo: {},
      isChooseCarrier: false,
      tableData: [],
      tableDataColumns: [
        {
          prop: 'orderNo',
          label: '订单号',
          align: 'center',
          width: '150'
        },
        {
          prop: 'distributionTime',
          width: '150',
          label: '托运（派车）日期',
          align: 'center'
        },
        {
          prop: 'takeDeliveryTime',
          width: '150',
          label: '配送（到货）日期',
          align: 'center'
        },
        {
          prop: 'orderType',
          label: '订单类型',
          slotName: 'orderType',
          align: 'center'
        },
        {
          prop: 'status',
          label: '状态',
          slotName: 'status',
          align: 'center',
          width: '150'
        },
        {
          prop: 'freightRevenue',
          label: '运费收入',
          align: 'center'
        },
        {
          prop: 'ownerName',
          label: '客户',
          align: 'center',
          width: 150
        },
        {
          prop: 'shipperAddress',
          label: '起始地',
          align: 'center',
          width: 150
        },
        {
          prop: 'receiverAddress',
          label: '目的地',
          align: 'center',
          width: 150
        }
      ],
      listTypeInfo: {
        carrierList: []
      }
    }
  },
  created() {
    this.carrierFormInfo = carrierFormInfo()
    this.doSearch()
  },
  methods: {
    handleEvent(event, data) {
      /* eslint-disable */
      switch (event) {
        case 'handleChangeCarrier':
          this.handleChangeCarrier(data)
          break
      }
    },
    changeShowPage(e) {
      this.$store.state.companyOrder.status = e
    },
    refresh() {
      this.$nextTick(() => {
        if (this.$refs.searchFormInfoRef) {
          this.$refs.searchFormInfoRef.resetFields()
        }
      })
      this.doSearch()
    },
    doSearch() {
      this.searchForm.pageNo = 1
      this.searchData()
    },
    searchData() {
      const data = {
        ...this.searchFormInfo.data,
        ...this.searchForm,
        orderType: 'PROPRIETARY_TRADING'
      }
      z.ld()
      request({
        url: 'order/srvorder/findOrderList',
        method: 'get',
        params: data
      }).then(res => {
        z.lc()
        this.tableData = res.data.list
        this.searchForm.total = res.data.totalCount
      })
    },
    handleDetail(e) {
      this.$store.state.companyOrder.info.orderId = e.orderId
      this.$store.state.companyOrder.info.orderNo = e.orderNo
      this.$store.state.companyOrder.info.orderStatus = e.status
      this.changeShowPage('detail')
    },
    // 获取承运商列表
    updateCarrierList() {
      request({
        url: 'basic/orgcompany/page',
        method: 'post',
        params: {
          pageNo: 1,
          pageSize: 1000
        }
      }).then(res => {
        this.listTypeInfo.carrierList = res.data.list.filter(item => {
          return item.companyId !== this.$store.state.user.user.companyId
        })
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
    // 点击派车
    handleSendCar(e) {
      this.$store.state.companyOrder.info.orderId = e.orderId
      this.$store.state.companyOrder.info.orderNo = e.orderNo
      this.$store.state.companyOrder.info.companyId = e.carrierCompanyId
      this.$store.state.companyOrder.info.companyName = e.carrierCompanyName
      this.changeShowPage('sendCar')
    },
    // 点击派单按钮
    handleSend(e) {
      this.isChooseCarrier = true
      this.carrierFormInfo.data.orderId = e.orderId
      this.updateCarrierList()
    },
    handleChangeCarrier(data) {
      this.listTypeInfo.carrierList.forEach(item => {
        if (item.name === data) {
          this.carrierFormInfo.data.carrierCompanyId = item.companyId
          this.carrierFormInfo.data.carrierCompanyName = item.name
        }
      })
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
            url: 'order/srvorder/transferOrder',
            method: 'post',
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
