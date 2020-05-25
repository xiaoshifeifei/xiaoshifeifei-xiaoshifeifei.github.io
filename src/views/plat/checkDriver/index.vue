<template>
  <div class="layout_main">
    <div v-if="showPage === 'list'">
      <div style="padding-bottom:10px;">
        <el-button @click="refresh" icon="el-icon-refresh" type="primary">刷新</el-button>
        <el-button
          :icon="isSearchShow? 'el-icon-arrow-down' : 'el-icon-arrow-left'"
          :title="isSearchShow? '搜索框隐藏' : '搜索框显示'"
          @click="isSearchShow = !isSearchShow"
          style="float:right"
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
        ref="searchFormInfoRef"
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
        <template slot="status" slot-scope="scope">
          <span>{{ scope.row.status | formatDriverStatus }}</span>
        </template>
        <el-table-column align="center" fixed="right" label="操作" slot="append">
          <template slot-scope="scope">
            <el-button @click="handleDetail(scope.$index)" type="primary">详情</el-button>
          </template>
        </el-table-column>
      </custom-table>
    </div>
    <div v-if="showPage === 'detail'">
      <detail :info="driverInfo" @goBack="changeShowPage('list')"/>
    </div>
  </div>
</template>
<script>
import request from '@/utils/request'
import detail from './detail'

export default {
  components: {
    detail
  },
  data() {
    return {
      showPage: 'list',
      isSearchShow: true,
      currentDriverId: '',

      searchForm: {
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      searchFormInfo: {
        ref: {},
        labelWidth: '80px',
        data: {
          status: '',
          username: '',
          phone: ''
        },
        fieldList: [
          {
            label: '司机姓名',
            value: 'username',
            type: 'input'
          },
          {
            label: '司机号码',
            value: 'phone',
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
      driverInfo: {},
      tableData: [],
      tableDataColumns: [
        {
          prop: 'username',
          label: '司机姓名',
          align: 'center'
        },
        {
          prop: 'phone',
          label: '司机电话',
          align: 'center'
        },
        {
          prop: 'status',
          label: '状态',
          slotName: 'status',
          align: 'center'
        }
      ],
      listTypeInfo: {
        statusList: [
          {
            label: '待审核',
            value: '3'
          },
          {
            label: '未通过',
            value: '4'
          },
          {
            label: '通过',
            value: '0'
          },
          {
            label: '所有',
            value: ''
          }
        ]
      }
    }
  },
  created() {
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
        this.doSearch()
      })
    },
    doSearch() {
      this.searchForm.pageNo = 1
      this.updateList()
    },
    updateList() {
      const data = {
        ...this.searchForm,
        ...this.searchFormInfo.data
      }
      request({
        url: '/carrier/carrierdriver/pagewithdriver',
        method: 'post',
        params: data
      }).then(res => {
        this.tableData = res.data.list
        this.searchForm.total = res.data.totalCount
      })
    },
    handleDetail(index) {
      this.driverInfo = this.tableData[index]
      this.changeShowPage('detail')
    },
    handleCurrentChange(val) {
      this.searchForm.pageNo = val
      this.updateList()
    },
    handleSizeChange(val) {
      this.searchForm.pageNo = 1
      this.searchForm.pageSize = val
      this.updateList()
    }
  }
}
</script>
