<template>
  <div class="layout_main">
    <div>
      <div style="padding-bottom:10px;">
        <el-button @click="fnNew" icon="el-icon-plus" type="primary">添 加</el-button>
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
        <el-form :inline="true" :model="searchForm" label-width="100px" ref="searchForm">
          <el-row
            style="display:flex;flex-wrap:wrap;padding:10px 0;margin-bottom:12px;border:1px solid #ddd"
          >
            <el-form-item label="角色" prop="roleName">
              <el-input
                @keyup.enter.native="fnsearch"
                placeholder="角色"
                v-model="searchForm.roleName"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="fnsearch" icon="el-icon-search" type="primary">搜索</el-button>
              <el-button
                @click="resetSearch('searchForm')"
                icon="el-icon-refresh"
                type="default"
              >重 置</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </div>

    <div style="display: flex;">
      <div style="flex:1;">
        <el-table :data="roleList" @row-click="handleClick" border ref="tb_role" stripe>
          <el-table-column
            :index="indexMethod"
            align="center"
            fixed
            label="序号"
            type="index"
            width="80"
          ></el-table-column>
          <el-table-column align="center" label="角色名称" prop="roleName" width="200"></el-table-column>
          <el-table-column label="描述" prop="roleDesc"></el-table-column>
        </el-table>
        <el-pagination
          :current-page="searchForm.pageNo"
          :page-size="searchForm.pageSize"
          :page-sizes="[10,20,50,100,200,500,1000]"
          :total="searchForm.total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          class="pagination"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>

      <el-card class="box-card" style="margin-left:50px;width:340px;height:700px;">
        <div class="clearfix" slot="header">
          <span>{{action=='new'?'新 增':'编 辑'}}</span>
          <el-button @click="fnDel" class="btn" type="text">删 除</el-button>
          <el-button @click="fnSave" class="btn" style="margin-right:10px;" type="text">保 存</el-button>
        </div>
        <div>
          <el-form :model="form" :rules="rules" label-width="80px" ref="form">
            <el-form-item label="角色名称" prop="roleName">
              <el-input placeholder="角色名称" v-model="form.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色状态" prop="roleState">
              <el-switch :active-value="10" :inactive-value="40" v-model="form.roleState"></el-switch>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input placeholder="角色描述" v-model="form.roleDesc"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <el-tree
          :data="treeData"
          :props="defaultProps"
          class="tree"
          default-expand-all
          highlight-current
          node-key="permitId"
          ref="tree"
          show-checkbox
          style="overflow-y: auto;height:450px;"
        >
          <span class="custom-tree-node" slot-scope="{ node }">
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'

export default {
  name: 'rolemanage',
  data() {
    return {
      isSearchShow: true,

      searchForm: {
        roleName: '',
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      roleList: [],
      treeData: [],
      action: 'new',
      defaultProps: {
        children: 'zones',
        label: 'title'
      },
      form: {
        roleId: '',
        roleName: '',
        roleState: 10,
        roleDesc: '',
        permitId: ''
      },

      rules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },

  methods: {
    resetForm(name) {
      this.$refs[name].resetFields()
    },
    resetSearch() {
      if (this.$refs.searchForm !== undefined) {
        this.$refs.searchForm.resetFields()
      }
      this.fnsearch()
    },
    fnInitTree() {
      // 初始化权限数据
      z.ld()
      request({
        url: '/sys/menu/menutree',
        method: 'post'
      })
        .then(res => {
          z.lc()
          this.treeData = res.data
        })
        .catch(() => {
          z.lc()
        })
    },

    fnList() {
      z.ld()
      request({
        url: '/sys/role/page',
        method: 'post',
        params: this.searchForm
      })
        .then(res => {
          z.lc()
          this.roleList = res.data.list
          this.searchForm.total = res.data.totalCount
        })
        .catch(() => {
          z.lc()
        })
    },

    fnsearch() {
      this.roleList = []
      this.searchForm.pageNo = 1
      this.fnList()

      this.action = 'new'
      this.$refs.form.resetFields()
      this.form.roleId = ''
    },

    fnNew() {
      this.action = 'new'
      this.resetForm('form')
      this.$refs.tree.setCheckedNodes([])
    },
    fnSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let url = ''
          if (this.action === 'edit') {
            // 更新
            url = '/sys/role/modify'
          } else {
            // 添加
            url = '/sys/role/save'
          }
          const checkedData = this.$refs.tree.getCheckedKeys()
          const halfCheckedData = this.$refs.tree.getHalfCheckedKeys()
          const data = checkedData.concat(halfCheckedData)
          this.form.permitId = data.join(',')
          if (this.form.permitId === '') {
            z.warning('请选择权限')
          } else {
            z.ld()
            request({
              url,
              method: 'post',
              params: this.form
            })
              .then(() => {
                z.lc()
                z.success('保存成功')
                this.fnsearch()
                this.action = 'new'
                this.resetForm('form')
                this.$refs.tree.setCheckedNodes([])
              })
              .catch(() => {
                z.lc()
              })
          }
        }
      })
    },

    fnDel() {
      // 删除角色信息
      if (!this.form.roleId) {
        z.warning('请先选择角色')
        return
      }
      z.confirm(`确定删除【${this.form.roleName}】吗？`, () => {
        z.ld()
        request({
          url: '/sys/role/remove',
          method: 'delete',
          params: this.form
        })
          .then(() => {
            z.lc()
            z.success('删除成功')
            // 删除成功清除页面信息
            this.resetForm('form')
            this.$refs.tree.setCheckedNodes([])
            this.fnsearch()
          })
          .catch(() => {
            z.lc()
          })
      })
    },

    handleClick(row) {
      // 显示角色信息
      this.action = 'edit'
      z.ld()
      request({
        url: '/sys/role/info',
        method: 'get',
        params: { roleId: row.roleId }
      })
        .then(res => {
          z.lc()
          const arr = ['root']
          const parentIds = this.getAllParentId(arr, this.$refs.tree.data)
          const keys = res.data.permitIdList
          const datas = new Array()
          for (const i in keys) {
            if (parentIds.indexOf(keys[i]) === -1) {
              datas.push(keys[i])
            }
          }

          this.$refs.tree.setCheckedKeys(datas)

          for (const key in this.form) {
            if (Object.prototype.hasOwnProperty.call(this.form, key)) {
              this.form[key] = row[key]
            }
          }
          this.$refs.form.validate()
        })
        .catch(() => {
          z.lc()
        })
    },
    getAllParentId(arr, treeData) {
      for (const i in treeData) {
        if (treeData[i].zones != null) {
          if (treeData[i].parentId != null) {
            arr.push(treeData[i].zones[0].parentId)
          }
          this.getAllParentId(arr, treeData[i].zones)
        }
      }
      return arr
    },
    handleSizeChange(val) {
      // 每页数量切换
      this.searchForm.pageNo = 1
      this.searchForm.pageSize = val
      this.fnList()
    },
    handleCurrentChange(val) {
      // 分页
      this.searchForm.pageNo = val
      this.fnList()
    },
    indexMethod(index) {
      return index * 1 + 1
    }
  },

  mounted() {
    this.fnInitTree()
    this.fnList()
  }
}
</script>

<style scoped>
.btn {
  float: right;
  padding: 3px 0;
}
</style>
