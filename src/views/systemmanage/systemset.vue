
<template>
  <div class="layout_main" style="width:100%;">
    <div>
      <el-form :inline="true" :model="searchForm" ref="searchForm">
        <el-row>
          <el-form-item label="类型" prop="ptype">
            <el-input
              @keyup.enter.native="fnSearch"
              clearable
              placeholder="请输入内容"
              style="width:170px;"
              v-model="searchForm.ptype"
            ></el-input>
          </el-form-item>
          <el-form-item label="关键字" prop="pkeys">
            <el-input
              @keyup.enter.native="fnSearch"
              clearable
              placeholder="请输入内容"
              style="width:170px;"
              v-model="searchForm.pkeys"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="fnSearch" icon="el-icon-search" type="primary">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetSearch('searchForm')" icon="el-icon-refresh" type="default">重 置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="fnNew" icon="el-icon-plus" type="primary" v-if="addPerson==10">添加</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="fnDel" icon="el-icon-delete" type="danger" v-if="delPerson==10">删 除</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div>
      <div style="float:left; width:60%;">
        <el-table
          :data="tableData"
          :default-sort="{prop: 'id', order: 'ascending'}"
          @row-click="handleClick"
          @selection-change="handleSelectionChange"
          border
          highlight-current-row
          ref="tb_user"
          stripe
          tooltip-effect="dark"
        >
          <el-table-column align="center" label="序号" type="index"></el-table-column>
          <el-table-column align="center" label="参数类型" prop="ptype"></el-table-column>
          <el-table-column align="center" label="关键字" prop="pkeys"></el-table-column>
          <el-table-column align="center" label="参数值" prop="pvals"></el-table-column>
          <el-table-column align="center" label="备注" prop="pvals_note"></el-table-column>
        </el-table>
        <el-pagination
          :current-page="searchForm.page+1"
          :page-size="searchForm.page_size"
          :page-sizes="[50,100,200,500,1000,2000,5000]"
          :total="searchForm.total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          class="pagination"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
      <div style="float:left; width:30%;">
        <el-card
          class="box-card"
          style="width:350px; margin-left:50px; height:658px"
          v-if="addPerson==10||editPerson==10"
        >
          <div class="clearfix" slot="header">
            <span>{{action=='new'?'新 增':'编 辑'}}</span>
            <el-button @click="fnDel()" class="btn" type="text">删除</el-button>
            <el-button @click="fnSave" class="btn" style="margin-right: 10px;" type="text">保 存</el-button>
          </div>

          <div>
            <el-form :model="ruleForm" :rules="rules" label-width="80px" ref="ruleForm">
              <el-form-item label="关键字" prop="pkeys">
                <el-input placeholder="请输入关键字" v-model="ruleForm.pkeys"></el-input>
              </el-form-item>
              <el-form-item label="参数类型" prop="ptype">
                <el-input placeholder="请输入参数类型" v-model="ruleForm.ptype "></el-input>
              </el-form-item>
              <el-form-item label="参数值" prop="pvals">
                <el-input placeholder="请输入参数值" v-model="ruleForm.pvals "></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="pvals_note">
                <el-input v-model="ruleForm.pvals_note "></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>
    <div class="box"></div>
  </div>
</template>

<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'

export default {
  name: 'personmanage',
  data() {
    return {
      isReset: false,
      action: 'new',
      selection: [],
      roleList: [],
      tableData: [],
      addPerson: '',
      editPerson: '',
      delPerson: '',
      rootData: [],
      handleval: '',
      ruleForm: {
        /* eslint-disable */
        pkeys: '',
        ptype: '',
        pvals: '',
        pvals_note: ''
      },
      searchForm: {
        /* eslint-disable */
        total: 0,
        page: 0,
        page_size: 100,
        pkeys: '',
        ptype: ''
      },

      rules: {
        pkeys: [
          {
            required: true,
            message: '请输入关键字',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 50 个字符',
            trigger: 'blur'
          }
        ],
        ptype: [
          {
            required: true,
            message: '请输入类型',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 50 个字符',
            trigger: 'blur'
          }
        ],
        pvals: [
          {
            required: true,
            message: '请输入对应值',
            trigger: 'blur'
          },
          {
            pattern: /[1-9]\d*(\.\d*[1-9])?/,
            message: '请输入大于0的数字'
          }
        ]
      }
    }
  },

  methods: {
    resetSearch() {
      this.$refs.searchForm.resetFields()
      this.fnSearch()
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    fnInitRoleList() {
      z.ld()
      request({
        url: '/sys/role/rsList',
        method: 'post',
        params: {
          /* eslint-disable */
          page: 1,
          page_size: 9999
        }
      })
        .then(res => {
          z.lc()
          const data = res.data.rsList
          for (const key in data) {
            this.roleList.push({
              label: data[key].role_name,
              value: data[key].role_unique
            })
          }
        })
        .catch(() => {
          z.lc()
        })
    },
    fnList() {
      z.ld()
      request({
        url: '/sys/config/listpage',
        method: 'post',
        params: this.searchForm
      })
        .then(res => {
          z.lc()
          this.searchForm.total = res.data.total
          this.tableData = res.data.rsList
        })
        .catch(() => {
          z.lc()
        })
    },
    fnSearch() {
      this.tableData = []
      this.searchForm.page = 0
      this.fnList()
    },
    fnNew() {
      this.action = 'new'
      this.resetForm('ruleForm')
      this.isReset = false
    },

    handleClick(row) {
      this.action = 'edit'
      this.isReset = true
      this.handleval = row.sys_id
      this.ruleForm = {
        /* eslint-disable */
        pkeys: row.pkeys,
        ptype: row.ptype,
        pvals: row.pvals,
        pvals_note: row.pvals,
        sys_id: row.sys_id
      }
    },

    fnSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let url = ''
          if (this.action === 'edit') {
            url = '/sys/config/update'
          } else {
            url = '/sys/config/insert'
          }
          z.ld()
          request({
            url,
            method: 'post',
            params: this.ruleForm
          })
            .then(res => {
              z.lc()
              z.success('保存成功')
              this.resetForm('ruleForm')
              this.fnList()
            })
            .catch(() => {
              z.lc()
            })
        }
      })
    },

    fnDel() {
      if (!this.handleval) {
        z.warning('请先选择要删除的配置')
        return
      }
      z.confirm('确定删除吗？', () => {
        z.ld()
        request({
          url: '/sys/config/delete',
          method: 'post',
          params: { sys_id: this.handleval }
        })
          .then(() => {
            z.lc()
            z.success('删除成功')
            this.resetForm('ruleForm')
            this.action = 'new'
            this.fnList()
          })
          .catch(() => {
            z.lc()
          })
      })
    },

    rootList() {
      this.rootData = JSON.parse(localStorage.getItem('roleRootData'))
      for (const i in this.rootData) {
        const title1 = '系统管理'
        if (title1 === this.rootData[i].qx_title) {
          for (const j in this.rootData[i].zones) {
            const title2 = '人员管理'
            if (title2 === this.rootData[i].zones[j].qx_title) {
              for (const k in this.rootData[i].zones[j].zones) {
                if (this.rootData[i].zones[j].zones[k].qx_title === '添加人员') {
                  this.addPerson = 10
                } else if (this.rootData[i].zones[j].zones[k].qx_title === '编辑人员') {
                  this.editPerson = 10
                } else if (this.rootData[i].zones[j].zones[k].qx_title === '删除人员') {
                  this.delPerson = 10
                }
              }
            }
          }
        }
      }
    },
    handleSelectionChange(selection) {
      this.selection = selection
    },
    handleSizeChange(val) {
      this.searchForm.page = 0
      /* eslint-disable */
      this.searchForm.page_size = val
      this.fnList()
    },
    handleCurrentChange(val) {
      this.searchForm.page = val - 1
      this.fnList()
    }
  },
  mounted() {
    this.fnInitRoleList()
    this.fnList()
    this.rootList()
  }
}
</script>
<style>
.btn {
  float: right;
  padding: 3px 0;
}
.dia {
  width: 1000px;
  margin-left: 550px;
}
.addnew {
  margin-left: 50px;
  width: 350px;
  height: 658px;
}
@media screen and (max-width: 980px) {
  .addnew {
    margin-left: 50px;
    width: 350px;
    height: 658px;
  }
}
</style>
