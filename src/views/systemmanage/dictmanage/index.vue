<template >
  <div class="layout_main">
    <div v-show="isShow">
      <div style="padding-bottom:10px;">
        <el-button @click="handleAdd" icon="el-icon-plus" type="primary">添 加</el-button>
        <el-button @click="doDel()" icon="el-icon-delete" type="danger">批量删除</el-button>
        <el-button @click="resetSearch()" icon="el-icon-refresh" type="primary">刷新</el-button>
        <el-button
          :icon="isSearchShow? 'el-icon-arrow-down' : 'el-icon-arrow-left'"
          :title="isSearchShow? '搜索框隐藏' : '搜索框显示'"
          @click="isSearchShow?isSearchShow = false: isSearchShow = true"
          style="float:right"
          type="primary"
        >{{isSearchShow?'隐藏搜索':'显示搜索'}}</el-button>
      </div>
      <div v-if="isSearchShow">
        <el-form :inline="true" :model="searchForm" label-width="120px" ref="searchForm">
          <el-row class="form-row">
            <el-form-item label="字典类型" prop="type">
              <el-select filterable placeholder="请选择" style="width:100%;" v-model="searchForm.type">
                <el-option value>请选择</el-option>
                <el-option
                  :key="index"
                  :label="item.type"
                  :value="item.type"
                  v-for="(item,index) in droplist"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="fnSearch" icon="el-icon-search" type="primary">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                @click="resetSearch('searchForm')"
                icon="el-icon-refresh"
                type="default"
              >重 置</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>

      <div style="display: flex;">
        <el-table :data="tableData" @selection-change="handleSelectionChange" border stripe>
          <el-table-column align="center" fixed type="selection"></el-table-column>
          <el-table-column align="center" label="序号" type="index"></el-table-column>
          <el-table-column align="center" label="字典类型" prop="type"></el-table-column>
          <el-table-column align="center" label="字典值" prop="value"></el-table-column>
          <el-table-column align="center" label="字典名称" prop="name"></el-table-column>
          <el-table-column align="center" label="字典排序" prop="sort"></el-table-column>
          <el-table-column align="center" label="字典备注" prop="note"></el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="200px">
            <template slot-scope="scope">
              <el-button @click="handelEdit(scope.row)" type="text">编辑</el-button>
              <el-button @click="handleDel(scope.row)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        :current-page="searchForm.pageNo"
        :page-size="searchForm.pageSize"
        :page-sizes="[10,50,100,200,500,1000,2000,5000]"
        :total="searchForm.total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>

    <el-card
      class="box-card"
      style="display:inline-block;width:500px;height:600px;min-width:500px;"
      v-show="showCard"
    >
      <div class="clearfix" slot="header">
        <span>{{dialogTitleType}}</span>
        <el-button
          @click="handleClose"
          size="medium"
          style="margin-left:20px;float:right;padding:3px 0;"
          type="text"
        >返 回</el-button>
        <el-button
          @click="handleSubmit"
          size="medium"
          style="margin-right:10px;float:right;padding:3px 0;"
          type="text"
        >保 存</el-button>
      </div>
      <el-form
        :inline="true"
        :model="ruleForm"
        :rules="rules"
        clearable
        label-width="150px"
        ref="ruleForm"
      >
        <el-form-item label="字典类型" prop="type">
          <el-input clearable placeholder="请输入字典类型" v-model="ruleForm.type"></el-input>
        </el-form-item>
        <el-form-item label="字典值" prop="value">
          <el-input clearable placeholder="请输入字典值" v-model="ruleForm.value"></el-input>
        </el-form-item>
        <el-form-item label="字典名称" prop="name">
          <el-input clearable placeholder="请输入字典名称" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="字典排序" prop="sort">
          <el-input clearable placeholder="请输入字典排序" v-model="ruleForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="字典备注" prop="note">
          <el-input clearable placeholder="请输入字典备注" v-model="ruleForm.note"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
export default {
  data() {
    return {
      isSearchShow: true,
      selection: [],
      tableData: [],

      isShow: true,
      droplist: [],

      searchForm: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        type: ''
      },

      dialogTitleType: '',
      showCard: false,

      ruleForm: {
        dictId: '',
        type: '',
        value: '',
        name: '',
        sort: '',
        note: ''
      },

      rules: {
        type: [
          {
            required: true,
            message: '请输入字典类型',
            trigger: ['blur', 'change']
          }
        ],
        value: [
          {
            required: true,
            message: '请输入字典值',
            trigger: ['blur', 'change']
          }
        ],
        name: [
          {
            required: true,
            message: '请输入字典名称',
            trigger: ['blur', 'change']
          }
        ],
        sort: [
          {
            required: true,
            message: '请输入字典排序',
            trigger: ['blur', 'change']
          },
          {
            pattern: /^([1-9]\d*|[0]{1,1})$/,
            message: '请输入整型数字',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    resetSearch() {
      if (this.$refs.searchForm !== undefined) {
        this.$refs.searchForm.resetFields()
      }
      this.fnSearch()
    },
    // 首次进去获取表格数据
    searchData() {
      z.ld()
      request({
        url: '/sys/dict/page',
        method: 'post',
        params: this.searchForm
      })
        .then(res => {
          z.lc()
          this.searchForm.total = res.data.totalCount
          this.tableData = res.data.list
        })
        .catch(() => {
          z.lc()
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
    },
    fnDropList() {
      request({
        method: 'post',
        url: '/sys/dict/getType'
      }).then(res => {
        this.droplist = res.data
      })
    },
    fnSearch() {
      this.tableData = []
      this.searchForm.pageNo = 1
      this.searchData()
    },
    handleAdd() {
      this.dialogTitleType = '添加'
      this.showCard = true
      this.isShow = false
      this.$nextTick(() => {
        this.resetForm('ruleForm')
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    handleClose() {
      this.resetSearch()
      this.showCard = false
      this.isShow = true
      this.$refs.ruleForm.clearValidate()
      this.$refs.ruleForm.resetFields()
    },
    handleSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let url = ''
          if (this.dialogTitleType === '添加') {
            url = '/sys/dict/save'
          } else {
            url = '/sys/dict/modify'
          }
          z.ld()
          request({
            method: 'post',
            url,
            params: this.ruleForm
          })
            .then(() => {
              z.lc()
              z.success('操作成功')
              this.showCard = false
              this.isShow = true
              this.handleClose()
              this.fnDropList()
            })
            .catch(() => {
              z.lc()
            })
        }
      })
    },
    handelEdit(row) {
      this.$refs.ruleForm.clearValidate()

      this.ruleForm = Object.assign({}, row)

      this.dialogTitleType = '编辑'
      this.showCard = true
      this.isShow = false
    },
    handleDel(row) {
      z.confirm('确定删除吗？', () => {
        z.ld()
        request({
          method: 'delete',
          url: '/sys/dict/remove',
          params: { dictId: row.dictId }
        })
          .then(() => {
            z.lc()
            z.success('删除成功')
            this.resetSearch()
            this.fnDropList()
          })
          .catch(() => {
            z.lc()
          })
      })
    },
    doDel() {
      if (this.selection.length <= 0) {
        z.warning('请选择要删除的记录')
        return
      }
      let list = []
      for (const key in this.selection) {
        list.push(this.selection[key].dictId)
      }
      list = list.join(',')
      z.confirm(`确定删除[${this.selection.length}]条记录吗？`, () => {
        z.ld()
        request({
          url: '/sys/dict/deletebatch',
          method: 'delete',
          params: { dictIds: list }
        })
          .then(() => {
            z.lc()
            z.success('删除成功')
            this.resetSearch()
            this.fnDropList()
          })
          .catch(() => {
            z.lc()
          })
      })
    }
  },
  mounted() {
    this.searchData()
    this.fnDropList()
  }
}
</script>

<style>
.form-row {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0;
  margin-bottom: 12px;
  border: 1px solid #ddd;
}
</style>

