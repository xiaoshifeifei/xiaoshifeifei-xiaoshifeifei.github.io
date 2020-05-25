<template >
  <div class="layout_main">
    <div v-show="isShow">
      <div style="padding-bottom:10px;">
        <el-button @click="handleAdd" icon="el-icon-plus" type="primary">添 加</el-button>
        <el-button @click="doDel()" icon="el-icon-delete" type="danger">批量删除</el-button>
        <el-button @click="handleStatus(0)" icon="el-icon-edit" type="primary">运行</el-button>
        <el-button @click="handleStatus(1)" icon="el-icon-edit" type="danger">暂停</el-button>
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
        <el-form :inline="true" :model="searchForm" label-width="150px" ref="searchForm">
          <el-row class="form-row">
            <el-form-item label="spring bean名称" prop="beanName">
              <el-input
                @keyup.enter.native="fnSearch"
                clearable
                placeholder="请输入spring bean名称"
                style="width:170px;"
                v-model="searchForm.beanName"
              ></el-input>
            </el-form-item>
            <el-form-item label="方法名" prop="methodName">
              <el-input
                @keyup.enter.native="fnSearch"
                clearable
                placeholder="请输入方法名"
                style="width:170px;"
                v-model="searchForm.methodName"
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
        <el-table :data="tableData" @selection-change="handleSelectionChange" border stripe>
          <el-table-column align="center" fixed type="selection"></el-table-column>
          <el-table-column align="center" label="序号" type="index"></el-table-column>
          <el-table-column align="center" label="spring bean名称" prop="beanName"></el-table-column>
          <el-table-column align="center" label="方法名" prop="methodName"></el-table-column>
          <el-table-column align="center" label="参数" prop="params"></el-table-column>
          <el-table-column align="center" label="cron表达式" prop="cronExpression"></el-table-column>
          <el-table-column align="center" label="状态" prop="status">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">暂停</span>
              <span v-if="scope.row.status == 0">运行</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注" prop="remark"></el-table-column>
          <el-table-column align="center" label="创建时间" prop="createTime" width="140px"></el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="200px">
            <template slot-scope="scope">
              <el-button @click="handelEdit(scope.row)" type="text">编辑</el-button>
              <el-button @click="doDel('single',scope.row)" type="text">删除</el-button>
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
        <el-form-item label="spring bean名称" prop="beanName">
          <el-input clearable placeholder="请输入spring bean名称" v-model="ruleForm.beanName"></el-input>
        </el-form-item>
        <el-form-item label="方法名" prop="methodName">
          <el-input clearable placeholder="请输入方法名" v-model="ruleForm.methodName"></el-input>
        </el-form-item>
        <el-form-item label="cron表达式" prop="cronExpression">
          <el-input clearable placeholder="请输入cron表达式" v-model="ruleForm.cronExpression"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="ruleForm.status ">
            <el-radio :label="0">运行</el-radio>
            <el-radio :label="1">暂停</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="参数" prop="params">
          <el-input clearable placeholder="请输入参数" v-model="ruleForm.params"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input clearable placeholder="请输入备注" v-model="ruleForm.remark"></el-input>
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
        beanName: '',
        methodName: ''
      },

      dialogTitleType: '',
      showCard: false,

      ruleForm: {
        jobId: '',
        beanName: '',
        methodName: '',
        cronExpression: '',
        status: 0,
        params: '',
        remark: ''
      },

      rules: {
        beanName: [
          {
            required: true,
            message: '请输入spring bean名称',
            trigger: ['blur', 'change']
          }
        ],
        methodName: [
          {
            required: true,
            message: '请输入方法名',
            trigger: ['blur', 'change']
          }
        ],
        cronExpression: [
          {
            required: true,
            message: '请输入cron表达式',
            trigger: ['blur', 'change']
          }
        ],
        status: [{
          required: true,
          message: '请选择状态',
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
        url: '/sys/job/page',
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
            url = '/sys/job/save'
          } else {
            url = '/sys/job/modify'
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

      const data = Object.assign({}, row)
      this.ruleForm.jobId = data.jobId
      this.ruleForm.beanName = data.beanName
      this.ruleForm.methodName = data.methodName
      this.ruleForm.params = data.params
      this.ruleForm.cronExpression = data.cronExpression
      this.ruleForm.status = data.status
      this.ruleForm.remark = data.remark

      this.dialogTitleType = '编辑'
      this.showCard = true
      this.isShow = false
    },
    doDel(opt, row) {
      let list = []

      if (opt === 'single') {
        if (row.jobId) {
          list.push(row.jobId)
        }
      } else {
        for (const key in this.selection) {
          list.push(this.selection[key].jobId)
        }
      }
      if (list.length <= 0) {
        z.warning('请选择要删除的记录')
        return
      } else {
        list = list.join(',')
      }
      z.confirm('确定删除吗？', () => {
        z.ld()
        request({
          url: '/sys/job/remove',
          method: 'post',
          params: { jobIds: list }
        })
          .then(() => {
            z.lc()
            z.success('删除成功')
            this.resetSearch()
          })
          .catch(() => {
            z.lc()
          })
      })
    },
    handleStatus(state) {
      let list = []
      let msg = ''
      let url = ''
      if (this.selection.length <= 0) {
        if (state === 0) {
          z.warning('请选择要启动的记录')
          return
        } else if (state === 1) {
          z.warning('请选择要暂停的记录')
          return
        } else {
          return
        }
      }
      for (const key in this.selection) {
        list.push(this.selection[key].jobId)
      }
      list = list.join(',')
      if (state === 0) {
        msg = '确定立即运行定时任务？'
        url = '/sys/job/runbatch'
      } else if (state === 1) {
        msg = '确定立即暂停定时任务？'
        url = '/sys/job/pause'
      } else {
        return
      }
      z.confirm(msg, () => {
        z.ld()
        request({
          url,
          method: 'post',
          params: { jobIds: list }
        })
          .then(() => {
            z.lc()
            z.success('操作成功')
            this.resetSearch()
          })
          .catch(() => {
            z.lc()
          })
      })
    }
  },
  mounted() {
    this.searchData()
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
