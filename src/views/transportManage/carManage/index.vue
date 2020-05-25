<template>
  <div class="layout_main">
    <div v-if="showPage === 'list'">
      <div style="padding-bottom:10px;">
        <el-button @click="handleAdd()" icon="el-icon-plus" type="primary">添加</el-button>
        <el-button @click="handleDeleteBatch()" icon="el-icon-delete" type="danger">批量删除</el-button>
        <el-button @click="resetSearch()" icon="el-icon-refresh" type="primary">刷新</el-button>
        <el-button
          :icon="isSearchShow ? 'el-icon-arrow-down' : 'el-icon-arrow-left'"
          :title="isSearchShow ? '搜索框隐藏' : '搜索框显示'"
          @click="isSearchShow?isSearchShow = false : isSearchShow = true"
          style="float: right"
          type="primary"
        >{{ isSearchShow ? '隐藏搜索' : '显示搜索' }}</el-button>
      </div>
      <custom-form
        :data="searchFormInfo.data"
        :field-list="searchFormInfo.fieldList"
        :haveBorder="false"
        :label-width="searchFormInfo.labelWidth"
        :ref-obj.sync="searchFormInfo.ref"
        :listTypeInfo="listTypeInfo"
        ref="searchForm"
        class="search-form"
        v-show="isSearchShow"
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
        :columnsTypeArray="[{ label: '', type: 'selection' }, { label: '序号', type: 'index' }]"
        :currentPage="searchForm.pageNo"
        :data="tableData"
        :page-size="searchForm.pageSize"
        :total="searchForm.total"
        @selection-change="handleSelectionChange"
        @change-current-page="handleCurrentChange"
        @change-size="handleSizeChange"
      >
        <template slot="carType" slot-scope="scope">
          <span>{{ scope.row.type | formatCarType }}</span>
        </template>
        <template slot="powerType" slot-scope="scope">
          <span v-if="scope.row.powerType === 0">普通货车</span>
          <span v-else-if="scope.row.dispatchStatus === 1">纯电动货车</span>
          <span v-else>插电混动货车</span>
        </template>
        <template slot="isMineVehicle" slot-scope="scope">
          <span v-if="scope.row.isMineVehicle">是</span>
          <span v-else>否</span>
        </template>
        <template slot="dispatchStatus" slot-scope="scope">
          <span v-if="scope.row.dispatchStatus === '1'">空闲</span>
          <span v-else-if="scope.row.dispatchStatus === '2'">调度中</span>
          <span v-else-if="scope.row.dispatchStatus === '3'">出车</span>
        </template>
        <el-table-column align="center" fixed="right" label="操作" slot="append">
          <template slot-scope="scope">
            <el-button @click.native.prevent="handleEdit(scope.row.carId)" type="text">编辑</el-button>
            <el-button @click.native.prevent="handleDelete(scope.row.carId)" type="text" style="color: #ff0000">删除</el-button>
          </template>
        </el-table-column>
      </custom-table>
    </div>
    <div v-if="showPage === 'add'">
      <add-car @goBack="changeShowPage('list')" />
    </div>
    <div v-if="showPage === 'edit'">
      <edit-car :carId="carId" @goBack="changeShowPage('list')" />
    </div>
  </div>
</template>
<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import addCar from './addCar'
import editCar from './editCar'
import { listTypeInfo } from './data.js'

export default {
  components: {
    addCar,
    editCar
  },
  data() {
    return {
      showPage: 'list',
      carId: '',
      // 搜索显示隐藏
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
          vehicleNo: '',
          dispatchStatus: ''
        },
        fieldList: [
          {
            label: '车牌号',
            value: 'vehicleNo',
            type: 'input'
          },
          {
            label: '车辆状态',
            value: 'dispatchStatus',
            type: 'select',
            list: 'dispatchStatusList',
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
      selection: [],
      tableData: [],
      tableDataColumns: [
        {
          prop: 'vehicleNo',
          label: '车牌号',
          align: 'center'
        },
        {
          prop: 'type',
          label: '车辆类型',
          align: 'center',
          slotName: 'carType'
        },
        {
          prop: 'powerType',
          label: '车辆动力类型',
          align: 'center',
          slotName: 'powerType'
        },
        {
          prop: 'isMineVehicle',
          label: '是否本企业车辆',
          align: 'center',
          slotName: 'isMineVehicle'
        },
        {
          prop: 'dispatchStatus',
          label: '车辆状态',
          align: 'center',
          slotName: 'dispatchStatus'
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
    formatCarType(value) {
      let result = ''
      const list = listTypeInfo()
      list.carTypeList.forEach(item => {
        if (value === item.value) {
          result = item.label
        }
      })
      return result
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
        url: '/basic/orgcar/page',
        method: 'post',
        params: {
          ...this.searchForm,
          ...this.searchFormInfo.data
        }
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
    doSearch() {
      this.tableData = []
      this.searchForm.pageNo = 1
      this.searchData()
    },
    // 编辑
    handleEdit(carId) {
      this.carId = carId
      this.changeShowPage('edit')
    },
    // 添加
    handleAdd() {
      this.changeShowPage('add')
    },
    // 删除
    handleDelete(carId) {
      z.confirm('确定删除这条记录吗？', () => {
        request({
          url: '/basic/orgcar/remove',
          method: 'delete',
          params: { carId }
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
        list.push(selection[key].carId)
      }
      list = list.join(',')
      z.confirm('确定删除[' + selection.length + ']条记录吗？', () => {
        request({
          url: '/basic/orgcar/deletebatch',
          method: 'delete',
          params: {
            carIds: list
          }
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
  }
}
</script>
