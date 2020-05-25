<template>
  <div class="layout_main">
    <div style="padding-bottom:10px;">
      <el-button @click="refresh" icon="el-icon-refresh" type="primary">刷新</el-button>
      <el-button @click="handleAddGoods" icon="el-icon-plus" type="primary">新增物品</el-button>
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
      <template slot="goodsType" slot-scope="scope">
        <span>{{ scope.row.goodsType | formatGoodsType }}</span>
      </template>
      <template slot="unit" slot-scope="scope">
        <span>{{scope.row.unit | formatGoodsUnitType }}</span>
      </template>
      <el-table-column align="center" fixed="right" label="操作" slot="append" width="150">
        <template slot-scope="scope">
          <el-button @click="handleChange(scope.row.goodsId)" type="primary">修改</el-button>
          <el-button @click="handleDelete(scope.row.goodsId)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </custom-table>
    <!-- 添加物品或者修改物品 -->
    <el-dialog
      :title="isAdd ? '添加物品' : '修改物品'"
      :visible.sync="isDialog"
      @close="handleCloseDialog"
      width="45%"
    >
      <custom-form
        :data="goodsFormInfo.data"
        :field-list="goodsFormInfo.fieldList"
        :label-width="goodsFormInfo.labelWidth"
        :list-type-info="listTypeInfo"
        :ref-obj.sync="goodsFormInfo.ref"
        :rules="goodsFormInfo.rules"
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
          goodsName: '',
          goodsType: ''
        },
        fieldList: [
          {
            label: '货物名称',
            value: 'goodsName',
            type: 'input',
            labelWidth: '80px'
          },
          {
            label: '货物类型',
            value: 'goodsType',
            type: 'select',
            list: 'goodsTypeList',
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
      isDialog: false,
      goodsFormInfo: {
        ref: {},
        labelWidth: '100px',
        data: {
          goodsName: '',
          goodsType: '',
          number: '',
          unit: '',
          weight: '',
          volume: ''
        },
        fieldList: [
          {
            label: '物品名称',
            value: 'goodsName',
            type: 'input'
          },
          {
            label: '物品类型',
            value: 'goodsType',
            type: 'select',
            list: 'goodsTypeList',
            selectKey: 'label',
            selectValue: 'value'
          },
          {
            label: '物品数量',
            value: 'number',
            type: 'number'
          },
          {
            label: '物品单位',
            value: 'unit',
            type: 'select',
            list: 'unitList',
            selectKey: 'label',
            selectValue: 'value'
          },
          {
            label: '物品重量',
            value: 'weight',
            type: 'number'
          },
          {
            label: '物品体积',
            value: 'volume',
            type: 'number'
          }
        ],
        rules: {
          goodsName: {
            required: true,
            message: '请输入物品名称',
            trigger: ['blur', 'change']
          },
          goodsType: {
            required: true,
            message: '请选择物品类型',
            trigger: ['blur', 'change']
          },
          number: {
            required: true,
            message: '请输入物品数量',
            trigger: ['blur', 'change']
          },
          unit: {
            required: true,
            message: '请选择物品单位',
            trigger: ['blur', 'change']
          },
          weight: {
            required: true,
            message: '请输入物品重量',
            trigger: ['blur', 'change']
          },
          volume: {
            required: true,
            message: '请输入物品体积',
            trigger: ['blur', 'change']
          }
        }
      },
      tableData: [],
      tableDataColumns: [
        {
          prop: 'goodsName',
          label: '物品名称',
          align: 'center'
        },
        {
          prop: 'goodsType',
          label: '物品类型',
          slotName: 'goodsType',
          align: 'center'
        },
        {
          prop: 'number',
          label: '物品数量',
          align: 'center'
        },
        {
          prop: 'unit',
          label: '物品包装',
          slotName: 'unit',
          align: 'center'
        },
        {
          prop: 'weight',
          label: '物品重量(吨)',
          align: 'center'
        },
        {
          prop: 'volume',
          label: '物品体积(m³)',
          align: 'center'
        },
        {
          prop: 'createTime',
          label: '添加时间',
          width: '150',
          align: 'center'
        }
      ],
      listTypeInfo: {
        goodsTypeList: [
          {
            label: '电子产品',
            value: '90'
          },
          {
            label: '商品汽车',
            value: '92'
          },
          {
            label: '冷藏货物',
            value: '93'
          },
          {
            label: '大宗货物',
            value: '94'
          },
          {
            label: '快速消费',
            value: '95'
          },
          {
            label: '农产品',
            value: '96'
          },
          {
            label: '其他',
            value: '999'
          }
        ],
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
    handleAddGoods() {
      // 弹框
      this.isDialog = true
      this.isAdd = true
    },
    handleDelete(goodsId) {
      z.confirm('确定删除吗', () => {
        request({
          url: 'order/srvordergoods/remove',
          method: 'delete',
          params: { goodsId }
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
    handleChange(goodsId) {
      this.isDialog = true
      this.isAdd = false
      request({
        url: 'order/srvordergoods/getGoodsInfo',
        method: 'get',
        params: { goodsId }
      }).then(res => {
        this.goodsFormInfo.data = res.data
      })
    },
    handleCloseDialog() {
      this.isDialog = false
      this.areaAddr = ''
      this.goodsFormInfo.ref.resetFields()
      this.goodsFormInfo.data = {
        goodsName: '',
        goodsType: '',
        number: '',
        unit: '',
        weight: '',
        volume: ''
      }
    },
    handleConfirm() {
      this.goodsFormInfo.ref.validate(valid => {
        if (valid) {
          if (this.isAdd) {
            this.handleAction(
              'order/srvordergoods/addOrderGoods',
              'post',
              this.goodsFormInfo.data
            )
          } else {
            delete this.goodsFormInfo.data.createTime
            this.handleAction(
              'order/srvordergoods/modifyOrderGoods',
              'put',
              this.goodsFormInfo.data
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
        url: 'order/srvordergoods/queryOrderGoodsPage',
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
  },
  mounted: function() {
    this.doSearch()
  }
}
</script>
