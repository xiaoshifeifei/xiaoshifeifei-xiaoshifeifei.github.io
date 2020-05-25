<template>
  <div class="layout_main">
    <div style="padding-bottom:10px;">
      <el-button @click="refresh" icon="el-icon-refresh" type="primary">刷新</el-button>
      <el-button @click="handleAddAddress" icon="el-icon-plus" type="primary">新增地址</el-button>
      <el-button
        :icon="isSearchShow? 'el-icon-arrow-down' : 'el-icon-arrow-left'"
        @click="isSearchShow = !isSearchShow"
        style="float: right"
        type="primary"
      >{{isSearchShow?'隐藏搜索':'显示搜索'}}</el-button>
    </div>
    <custom-form
      :data="searchFormInfo.data"
      :field-list="searchFormInfo.fieldList"
      :label-width="searchFormInfo.labelWidth"
      :labelPosition="searchFormInfo.labelPosition"
      :ref-obj.sync="searchFormInfo.ref"
      ref="searchForm"
      v-show="isSearchShow"
      class="search-form"
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
      <el-table-column align="center" fixed="right" label="操作" slot="append">
        <template slot-scope="scope">
          <el-button @click="handleChange(scope.row.addrId)" type="primary">修改</el-button>
          <el-button @click="handleDelete(scope.row.addrId)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </custom-table>
    <!-- 添加地址或者修改地址 -->
    <el-dialog
      v-if="isDialog"
      :title="isAdd ? '添加地址' : '修改地址'"
      :visible.sync="isDialog"
      @close="handleCloseDialog"
    >
      <custom-form
        :data="addressFormInfo.data"
        :field-list="addressFormInfo.fieldList"
        :label-width="addressFormInfo.labelWidth"
        :list-type-info="listTypeInfo"
        :ref-obj.sync="addressFormInfo.ref"
        :rules="addressFormInfo.rules"
        ref="addressFormRef"
      >
        <div slot="form-addrArea" style="width: 160px">
          <el-tooltip
            :content="addressFormInfo.data.addrArea"
            :disabled="area.length <= 0"
            effect="dark"
            placement="top-start"
          >
            <el-cascader
              :options="listTypeInfo.areaList"
              @change="handleChangeAddress"
              ref="cascaderAddr"
              style="width: 100%"
              v-model="area"
            />
          </el-tooltip>
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
import { regionData, CodeToText } from 'element-china-area-data'
import { addressFormInfo } from './addressForm.js'

export default {
  data() {
    return {
      isSearchShow: true,
      isAdd: true,

      searchForm: {
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      searchFormInfo: {
        ref: {},
        labelWidth: '100px',
        data: {
          addrUnit: '',
          addrName: '',
          addrTel: ''
        },
        fieldList: [
          {
            label: '单位名称',
            value: 'addrUnit',
            type: 'input',
            labelWidth: '80px'
          },
          {
            label: '联系人姓名',
            value: 'addrName',
            type: 'input'
          },
          {
            label: '联系电话',
            value: 'addrTel',
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
      isDialog: false,
      area: '',
      addressFormInfo: {},
      tableData: [],
      tableDataColumns: [
        {
          prop: 'addrUnit',
          label: '单位名称',
          align: 'center'
        },
        {
          prop: 'addrName',
          label: '联系人姓名',
          align: 'center'
        },
        {
          prop: 'addrTel',
          label: '联系电话',
          align: 'center'
        },
        {
          prop: 'addrArea',
          label: '省市县',
          align: 'center'
        },
        {
          prop: 'addrDetail',
          label: '详细地址',
          align: 'center'
        },
        {
          prop: 'createTime',
          label: '添加时间',
          align: 'center'
        }
      ],
      listTypeInfo: {
        areaList: regionData
      }
    }
  },
  created() {
    this.addressFormInfo = addressFormInfo()
    this.doSearch()
  },
  methods: {
    refresh() {
      this.searchFormInfo.ref.resetFields()
      this.doSearch()
    },
    handleChangeAddress(arr) {
      this.addressFormInfo.data.addrArea = ''
      this.addressFormInfo.data.addrCode = ''
      arr.forEach(item => {
        this.addressFormInfo.data.addrArea += CodeToText[item] + ','
        this.addressFormInfo.data.addrCode += item + ','
      })
      this.addressFormInfo.data.addrArea = this.addressFormInfo.data.addrArea.slice(0, -1)
      this.addressFormInfo.data.addrCode = this.addressFormInfo.data.addrCode.slice(0, -1)
    },
    handleAddAddress() {
      this.isAdd = true
      this.isDialog = true
    },
    handleDelete(addrId) {
      z.confirm('确定删除吗', () => {
        request({
          url: 'basic/orgcompanyaddress/remove',
          method: 'delete',
          params: { addrId }
        }).then(() => {
          z.success('删除成功')
          this.searchData()
        })
      })
    },
    doSearch() {
      this.searchForm.pageNo = 1
      this.searchData()
    },
    handleAction(url, method, params) {
      request({
        url,
        method,
        params
      }).then(() => {
        z.success('操作成功')
        this.handleCloseDialog()
        this.searchData()
      })
    },
    handleChange(addrId) {
      this.isDialog = true
      this.isAdd = false
      request({
        url: 'basic/orgcompanyaddress/info',
        method: 'get',
        params: { addrId }
      }).then(res => {
        this.addressFormInfo.data = res.data
        // 赋值给code，为了显示
        this.area = res.data.addrCode.split(',')
      })
    },
    handleCloseDialog() {
      this.isDialog = false
      this.area = ''
      this.addressFormInfo.ref.resetFields()
      // 还原初始值
      this.addressFormInfo.data = {
        addrUnit: '',
        addrName: '',
        addrTel: '',
        addrArea: '',
        addrCode: '',
        addrDetail: ''
      }
    },
    handleConfirm() {
      // 判断是不是平台，如果不是，则传入companyId
      if (this.$store.state.user.user.userType !== '0') {
        this.addressFormInfo.data.companyId = this.$store.state.user.user.companyId
      }
      this.addressFormInfo.ref.validate(valid => {
        if (valid) {
          if (this.isAdd) {
            this.handleAction(
              'basic/orgcompanyaddress/addCompanyAddress',
              'post',
              this.addressFormInfo.data
            )
          } else {
            delete this.addressFormInfo.data.createTime
            this.handleAction(
              'basic/orgcompanyaddress/modify',
              'put',
              this.addressFormInfo.data
            )
          }
        }
      })
    },
    searchData() {
      const data = {
        ...this.searchForm,
        ...this.searchFormInfo.data
      }
      request({
        url: 'basic/orgcompanyaddress/findAddressPage',
        method: 'post',
        params: data
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
  }
}
</script>
