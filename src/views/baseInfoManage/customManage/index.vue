<template>
  <div class="layout_main">
    <div style="padding-bottom:10px;">
      <el-button @click="refresh" icon="el-icon-refresh" type="primary">刷新</el-button>
      <el-button @click="handleAddcustom" icon="el-icon-plus" type="primary">新增客户</el-button>
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
      :list-type-info="listTypeInfo"
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
      <template slot="comType" slot-scope="scope">
        <span v-if="scope.row.comType == 1">单位客户</span>
        <span style="color: #1383e6" v-else-if="scope.row.comType == 2">个人客户</span>
        <span v-else>其他</span>
      </template>
      <el-table-column align="center" fixed="right" label="操作" slot="append" width="150">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.comType === 0" @click="handleChange(scope.row.companyId)" type="primary">修改</el-button>
        </template>
      </el-table-column>
    </custom-table>
    <!-- 添加客户或者修改客户 -->
    <el-dialog
      v-if="isDialog"
      :title="isAdd ? '添加客户' : '修改客户'"
      :visible.sync="isDialog"
      @close="handleCloseDialog"
      width="80%"
      top="5vh"
    >
      <choose-customer
        :comType="comType"
        :isChangeType="isChooseCustomerType"
        @changeType="handleChangeComType"
        ref="chooseCustomer"
      />
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
import chooseCustomer from '../../components/chooseCustomer'

export default {
  components: {
    chooseCustomer
  },
  data() {
    return {
      isSearchShow: true,
      isAdd: true,
      isChooseCustomerType: true, // 设置能否切换用户类型

      searchForm: {
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      searchFormInfo: {
        ref: {},
        labelWidth: '80px',
        data: {
          name: ''
        },
        fieldList: [
          {
            label: '客户名称',
            value: 'name',
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
      comType: 1,
      tableData: [],
      tableDataColumns: [
        {
          prop: 'name',
          label: '单位名称/客户名称',
          align: 'center'
        },
        {
          prop: 'comType',
          label: '客户类型',
          slotName: 'comType',
          align: 'center'
        },
        {
          prop: 'contacts',
          label: '联系人',
          align: 'center'
        },
        {
          prop: 'contactsTel',
          label: '联系电话',
          align: 'center'
        }
      ],
      listTypeInfo: {
        unitList: [
          {
            label: '件',
            value: 'THING'
          },
          {
            label: '包',
            value: 'PACKAGE'
          },
          {
            label: '箱',
            value: 'BOX'
          },
          {
            label: '托',
            value: 'STIPULES'
          }
        ]
      }
    }
  },
  methods: {
    refresh() {
      this.searchFormInfo.ref.resetFields()
      this.doSearch()
    },
    handleAddcustom() {
      this.isDialog = true
      this.isAdd = true
      this.isChooseCustomerType = true
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
    handleChangeComType(e) {
      this.comType = e
    },
    // 点击修改的时候，赋值给子组件
    handleChange(companyId) {
      this.isDialog = true
      this.isAdd = false
      this.isChooseCustomerType = false
      request({
        url: '/basic/orgcompany/info',
        method: 'get',
        params: { companyId }
      }).then(res => {
        const chooseCustomer = this.$refs.chooseCustomer
        this.comType = res.data.comType
        if (res.data.comType === 1) {
          chooseCustomer.customFormCompanyInfo.data = res.data
          chooseCustomer.customFormCompanyInfo.data.addressCode = res.data.addressCode.split(',')
        } else {
          chooseCustomer.customFormPersonInfo.data = res.data
        }
        chooseCustomer.customFormCompanyInfo.data.id = res.data.id
        chooseCustomer.customFormPersonInfo.data.id = res.data.id
      })
    },
    handleCloseDialog() {
      this.isDialog = false
      this.$refs.chooseCustomer.clearCustomForm()
    },
    handleConfirm() {
      const chooseCustomer = this.$refs.chooseCustomer
      if (this.isAdd) {
        if (this.comType === 1) {
          const formData = chooseCustomer.customFormCompanyInfo.data
          chooseCustomer.customFormCompanyInfo.ref.validate(valid => {
            if (valid) {
              delete formData.createTime
              delete formData.updateTime
              this.handleAction('/basic/orgcompany/saveCus', 'post', {
                ...formData,
                comType: this.comType
              })
            }
          })
        } else if (this.comType === 2) {
          const formData = chooseCustomer.customFormPersonInfo.data
          chooseCustomer.customFormPersonInfo.ref.validate(valid => {
            if (valid) {
              delete formData.createTime
              delete formData.updateTime
              formData.allName = formData.name
              this.handleAction('/basic/orgcompany/saveCus', 'post', {
                ...formData,
                comType: this.comType
              })
            }
          })
        }
      } else {
        if (this.comType === 1) {
          const formData = chooseCustomer.customFormCompanyInfo.data
          chooseCustomer.customFormCompanyInfo.ref.validate(valid => {
            if (valid) {
              delete formData.createTime
              delete formData.updateTime
              if (typeof formData.addressCode === 'object') {
                formData.addressCode = formData.addressCode.join(',')
              }
              this.handleAction('/basic/orgcompany/modify', 'post', {
                ...formData,
                comType: this.comType
              })
            }
          })
        } else if (this.comType === 2) {
          const formData = chooseCustomer.customFormPersonInfo.data
          chooseCustomer.customFormPersonInfo.ref.validate(valid => {
            if (valid) {
              delete formData.createTime
              delete formData.updateTime
              formData.allName = formData.name
              this.handleAction('/basic/orgcompany/modify', 'post', {
                ...formData,
                comType: this.comType
              })
            }
          })
        }
      }
    },
    searchData() {
      request({
        url: '/basic/orgcompany/page',
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
  mounted() {
    this.doSearch()
  }
}
</script>
