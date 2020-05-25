<template >
  <div class="layout_main">
    <div v-show="isShow">
      <div style="margin-bottom:15px;">
        <el-button @click="handleAdd" icon="el-icon-plus" type="primary">添 加</el-button>
      </div>
      <div style="display: flex;">
        <el-table :data="tableData" border stripe>
          <el-table-column
            :index="indexMethod"
            align="center"
            fixed
            label="序号"
            prop="index"
            type="index"
            width="80"
          ></el-table-column>
          <el-table-column align="center" label=" 显示名称" prop="showname"></el-table-column>
          <el-table-column align="center" label=" 排序" prop="sort"></el-table-column>
          <el-table-column align="center" label="链接名称多语言key值" prop="langkey"></el-table-column>
          <el-table-column align="center" label="链接网址" prop="url" width="300"></el-table-column>
          <el-table-column align="center" label="状态" prop="member_nick">
            <template slot-scope="scope">
              <span v-if="scope.row.state == 10">启用</span>
              <span v-if="scope.row.state == 20">禁用</span>
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="handelEdit(scope)" icon="el-icon-edit" type="primary">编辑</el-button>
              <el-button @click="del(scope.$index)" icon="el-icon-edit" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        :current-page="page+1"
        :page-size="pageSize"
        :page-sizes="[50,100,200,500,1000,2000,5000]"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <el-card style="width:500px;" v-show="showCard">
      <div class="clearfix" slot="header">
        <span>{{dialogTitleType}}</span>
      </div>
      <el-form :model="ruleForm" :rules="rules" clearable label-width="130px" ref="ruleForm">
        <el-form-item label="排序" prop="sort">
          <el-input clearable v-model="ruleForm.sort"></el-input>
        </el-form-item>
        <el-form-item label=" 显示名称（US）" prop="showname">
          <el-input clearable v-model="ruleForm.showname"></el-input>
        </el-form-item>
        <el-form-item label="多语言key值" prop="langkey">
          <el-input clearable v-model="ruleForm.langkey"></el-input>
        </el-form-item>
        <el-form-item label="链接状态" prop="state">
          <template>
            <el-radio :label="10" v-model="ruleForm.state">启用</el-radio>
            <el-radio :label="20" v-model="ruleForm.state">禁用</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="链接网址" prop="url">
          <el-input clearable v-model="ruleForm.url"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="handleClose"
            icon="el-icon-back"
            style="margin-left:15px;float:right;"
            type="primary"
          >取消</el-button>
          <el-button @click="submit" icon="el-icon-edit" style="float:right;" type="primary">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import Base64 from '@/utils/base64utils.js'
export default {
  name: 'friendlink',
  data() {
    return {
      allData: [],
      tableData: [],
      delData: [],
      index: 1,
      pageSize: 100,
      page: 0,
      total: 0,
      isShow: true,
      showCard: false,
      dialogTitleType: '',
      multipleSelection: [],
      ruleForm: {
        state: 10,
        url: '',
        langkey: '',
        showname: '',
        sort: '',
        id: ''
      },
      rules: {
        state: [{
          required: true,
          message: '请选择状态',
          trigger: ['change', 'blur']
        }],
        url: [{
          required: true,
          message: '请输入链接网址',
          trigger: 'change'
        }],
        langkey: [
          {
            required: true,
            message: '请输入链接多语言Key值',
            trigger: 'change'
          }
        ],
        showname: [
          {
            required: true,
            message: '请输入显示名称',
            trigger: 'change'
          }
        ],
        sort: [
          {
            required: true,
            message: '请输入排序',
            trigger: 'change'
          },
          {
            pattern: /^([1-9]\d*|[0]{1,1})$/,
            message: '请输入整型数字',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    fnList() {
      z.ld()
      request({
        method: 'post',
        url: '/sys/parm/datepagelist',
        params: {
          /* eslint-disable */
          parm_key: 'links',
          page: this.page,
          page_size: this.pageSize
        }
      })
        .then(res => {
          z.lc()
          this.tableData = res.data.rsList
          this.allData = this.tableData
          this.delData = this.tableData
          this.total = res.data.total
        })
        .catch(() => {
          z.lc()
        })
    },
    submit() {
      if (this.dialogTitleType === '添加') {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            z.ld()
            this.allData.push(this.ruleForm)
            this.allData = JSON.stringify(this.allData)
            this.allData = Base64.encode(this.allData)
            request({
              method: 'post',
              url: '/sys/parm/update',
              params: {
                /* eslint-disable */
                parm_key: 'links',
                parm_data: this.allData
              }
            })
              .then(() => {
                z.lc()
                z.success('操作成功')
                this.showCard = false
                this.isShow = true
                this.fnList()
              })
              .catch(() => {
                z.lc()
              })
          }
        })
      } else {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            z.ld()
            this.delData.splice(this.index, 1, this.ruleForm)
            this.delData = JSON.stringify(this.delData)
            this.delData = Base64.encode(this.delData)
            request({
              method: 'post',
              url: '/sys/parm/update',
              params: {
                /* eslint-disable */
                parm_key: 'links',
                parm_data: this.delData
              }
            })
              .then(() => {
                z.lc()
                z.success('操作成功')
                this.showCard = false
                this.isShow = true
                this.resetForm('ruleForm')
                this.fnList()
              })
              .catch(() => {
                z.lc()
              })
          }
        })
      }
    },
    del(row) {
      z.confirm('确定删除吗？', () => {
        z.ld()
        this.allData.splice(row, 1)
        this.allData = JSON.stringify(this.allData)
        this.allData = Base64.encode(this.allData)
        request({
          method: 'post',
          url: '/sys/parm/update',
          params: {
            /* eslint-disable */
            parm_key: 'links',
            parm_data: this.allData
          }
        })
          .then(() => {
            z.lc()
            z.success('删除成功')
            this.fnList()
          })
          .catch(() => {
            z.lc()
          })
      })
    },
    handleAdd() {
      this.dialogTitleType = '添加'
      this.showCard = true
      this.isShow = false
      this.$nextTick(() => {
        this.resetForm('ruleForm')
      })
    },
    handelEdit(row) {
      this.$refs.ruleForm.clearValidate()
      this.dialogTitleType = '编辑'
      this.showCard = true
      this.isShow = false
      this.index = row.$index
      this.ruleForm = Object.assign({}, row.row)
    },
    handleClose() {
      this.showCard = false
      this.isShow = true
      this.$refs.ruleForm.clearValidate()
    },
    handleSizeChange(val) {
      this.page = 0
      this.pageSize = val
      this.fnList()
    },
    handleCurrentChange(val) {
      this.page = val - 1
      this.fnList()
    },
    indexMethod(index) {
      return index * 1 + 1
    }
  },
  mounted() {
    this.fnList()
  }
}
</script>
