<template >
  <div class="layout_main">
    <div v-show="isShow">
      <div style="padding-bottom:10px;">
        <el-button @click="handleAdd" icon="el-icon-plus" type="primary">添 加</el-button>
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
        <el-form :inline="true" :model="searchForm" label-width="80px" ref="searchForm">
          <el-row
            style="display:flex;flex-wrap:wrap;padding:10px 0;margin-bottom:12px;border:1px solid #ddd"
          >
            <el-form-item label="键" prop="key">
              <el-input
                @keyup.enter.native="fnSearch"
                clearable
                placeholder="请输入键"
                style="width:170px;"
                v-model="searchForm.key"
              ></el-input>
            </el-form-item>
            <el-form-item label="值" prop="value">
              <el-input
                @keyup.enter.native="fnSearch"
                clearable
                placeholder="请输入值"
                style="width:170px;"
                v-model="searchForm.value"
              ></el-input>
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
        <el-table :data="tableData" border stripe>
          <el-table-column align="center" label="序号" type="index"></el-table-column>
          <el-table-column align="center" label="键" prop="key"></el-table-column>
          <el-table-column align="center" label="值" prop="value"></el-table-column>
          <el-table-column align="center" label="规则" prop="rule"></el-table-column>
          <el-table-column align="center" label="描述" prop="note"></el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="100px">
            <template slot-scope="scope">
              <el-button @click="handelEdit(scope.row)" type="text">编辑</el-button>
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
        <el-form-item label="键" prop="key" v-if="dialogTitleType == '添加'">
          <el-input clearable placeholder="请输入键" v-model="ruleForm.key"></el-input>
        </el-form-item>
        <el-form-item label="键" prop="key" v-if="dialogTitleType == '编辑'">
          <el-input clearable disabled placeholder="请输入键" readonly v-model="ruleForm.key"></el-input>
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input clearable placeholder="请输入值" v-model="ruleForm.value"></el-input>
        </el-form-item>
        <el-form-item label="规则" prop="rule">
          <el-input clearable placeholder="请输入规则" v-model="ruleForm.rule"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="note">
          <el-input clearable placeholder="请输入描述" v-model="ruleForm.note"></el-input>
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
        type: '',
        value: ''
      },

      dialogTitleType: '',
      showCard: false,

      ruleForm: {
        key: '',
        value: '',
        rule: '',
        note: ''
      },

      rules: {
        key: [{
          required: true,
          message: '请输入键',
          trigger: ['blur', 'change']
        }],
        value: [{
          required: true,
          message: '请输入值',
          trigger: ['blur', 'change']
        }],
        rule: [{
          required: true,
          message: '请输入规则',
          trigger: ['blur', 'change']
        }]
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
        url: '/sys/params/page',
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
    handleSizeChange(val) {
      this.searchForm.pageNo = 1
      this.searchForm.pageSize = val
      this.searchData()
    },
    handleCurrentChange(val) {
      this.searchForm.pageNo = val
      this.searchData()
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
            url = '/sys/params/save'
          } else {
            url = '/sys/params/modify'
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
    }
  },
  mounted() {
    this.searchData()
  }
}
</script>
