
<template>
  <div class="layout_main">
    <div style="padding-bottom:10px;">
      <el-button @click="fnNew" icon="el-icon-plus" type="primary">添加</el-button>
      <el-button @click="fnDel" icon="el-icon-delete" type="danger">批量删除</el-button>
      <el-button @click="fnPassword" icon="el-icon-edit" type="primary">修改密码</el-button>
      <el-button @click="resetSearch('searchForm')" icon="el-icon-refresh" type="primary">刷新</el-button>
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
          <el-form-item label="登录名" prop="loginName">
            <el-input
              @keyup.enter.native="fnSearch"
              clearable
              placeholder="请输入登录名"
              style="width:170px;"
              v-model="searchForm.loginName"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input
              @keyup.enter.native="fnSearch"
              clearable
              placeholder="请输入用户名"
              style="width:170px;"
              v-model="searchForm.userName"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="userTel">
            <el-input
              @keyup.enter.native="fnSearch"
              clearable
              placeholder="请输入手机号"
              style="width:170px;"
              v-model="searchForm.userTel"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="fnSearch" icon="el-icon-search" type="primary">查 询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetSearch('searchForm')" icon="el-icon-refresh" type="default">重 置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div>
      <div style="float:left; width:60%;">
        <el-table
          :data="tableData"
          @row-click="handleClick"
          @selection-change="handleSelectionChange"
          border
          ref="tb_user"
          stripe
          tooltip-effect="dark"
        >
          <el-table-column align="center" fixed type="selection"></el-table-column>
          <el-table-column align="center" label="序号" type="index"></el-table-column>
          <el-table-column align="center" label="登录名" prop="loginName"></el-table-column>
          <el-table-column align="center" label="用户名" prop="userName"></el-table-column>
          <el-table-column align="center" label="手机号" prop="userTel"></el-table-column>
          <el-table-column align="center" label="Email" prop="userMail"></el-table-column>
          <el-table-column align="center" label="用户类型" prop="accountType">
            <template slot-scope="scope">
              <span v-if="scope.row.accountType === '0'">后台</span>
              <span v-else-if="scope.row.accountType === '1'">司机app</span>
              <span v-else-if="scope.row.accountType === '2'">货主</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" prop="userState">
            <template slot-scope="scope">
              <span v-if="scope.row.userState == false">禁用</span>
              <span v-if="scope.row.userState == true">启用</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间" prop="createTime" sortable width="140px"></el-table-column>
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
      <div style="float:left; width:33%;">
        <el-card class="box-card" style="width:350px; margin-left:50px; height:658px">
          <div class="clearfix" slot="header">
            <span>{{action=='new'?'新 增':'编 辑'}}</span>
            <el-button @click="fnDel('single')" class="btn" type="text">删除</el-button>
            <el-button @click="fnSave" class="btn" style="margin-right: 10px;" type="text">保 存</el-button>
          </div>
          <div>
            <el-form :model="ruleForm" :rules="rules" label-width="80px" ref="ruleForm">
              <el-form-item label="登录名" prop="loginName" v-if="action == 'new'">
                <el-input placeholder="请输入登录名" v-model="ruleForm.loginName"></el-input>
              </el-form-item>
              <el-form-item label="用户名" prop="userName">
                <el-input placeholder="请输入用户名" v-model="ruleForm.userName"></el-input>
              </el-form-item>
              <el-form-item label="用户状态" prop="userState">
                <el-select placeholder="请选择" style="width:100%" v-model="ruleForm.userState">
                  <el-option
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    v-for="item in options"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="密码" prop="password" v-if="action == 'new'">
                <el-input
                  autocomplete="off"
                  placeholder="请输入密码"
                  type="password"
                  v-model="ruleForm.password"
                ></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="repassword" v-if="action == 'new'">
                <el-input type="password" v-model="ruleForm.repassword"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="userTel">
                <el-input placeholder="请输入手机号" v-model="ruleForm.userTel"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="userMail">
                <el-input placeholder="请输入邮箱" v-model="ruleForm.userMail"></el-input>
              </el-form-item>
              <el-form-item label="角色选择" prop="roleId" v-if="!isCompanyAdmin">
                <el-select
                  multiple
                  placeholder="请选择角色"
                  style="width:100%"
                  v-model="ruleForm.roleId"
                >
                  <el-option
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    v-for="item in roleList"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="角色" prop v-if="isCompanyAdmin">
                <el-input readonly value="企业管理员"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="userNote">
                <el-input placeholder="请输入备注" v-model="ruleForm.userNote"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog
      :before-close="handleClosePassword"
      :close-on-press-escape="false"
      :visible.sync="dialogTableVisiblepwd"
      title="修改密码"
    >
      <el-form :model="ruleForm1" :rules="rules1" label-width="100px" ref="ruleForm1">
        <el-form-item label="原密码" prop="password">
          <el-input
            placeholder="请输入原密码"
            style="width:400px"
            type="password"
            v-model="ruleForm1.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="repassword">
          <el-input
            placeholder="请输入新密码"
            style="width:400px"
            type="password"
            v-model="ruleForm1.repassword"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            placeholder="请再次输入密码"
            style="width:400px"
            type="password"
            v-model="ruleForm1.confirmPassword "
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="handleOpenPwdDialog"
            class="confirm"
            style="float:right;"
            type="primary"
          >提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import md5 from 'js-md5'
import TreeSelect from '@/components/TreeSelect'
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === this.ruleForm.password) {
        callback()
      } else {
        callback(new Error('两次输入密码不一致!'))
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === this.ruleForm1.repassword) {
        callback()
      } else {
        callback(new Error('两次输入密码不一致!'))
      }
    }

    return {
      isSearchShow: true,
      roleList: [],
      tableData: [],
      rootData: [],

      searchForm: {
        total: 0,
        pageNo: 0,
        pageSize: 10,
        loginName: '',
        userName: '',
        userTel: ''
      },

      action: 'new',
      selection: [],

      options: [
        {
          value: true,
          label: '启用'
        },
        {
          value: false,
          label: '禁用'
        }
      ],

      ruleForm: {
        userId: '',
        loginName: '',
        userName: '',
        userState: '',
        password: '',
        repassword: '',
        userTel: '',
        userMail: '',
        roleId: '',
        companyId: '',
        userNote: ''
      },

      rules: {
        loginName: [
          {
            required: true,
            message: '请输入登录名',
            trigger: ['blur', 'change']
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: ['blur', 'change']
          }
        ],
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: ['blur', 'change']
          }
        ],
        personneuserStatelState: [
          {
            required: true,
            message: '请选择用户状态',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符之间',
            trigger: ['blur', 'change']
          }
        ],
        repassword: [
          {
            required: true,
            validator: validatePass,
            trigger: ['blur', 'change']
          }
        ],
        userTel: [
          {
            required: true,
            message: '请输入手机号',
            trigger: ['blur', 'change']
          },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '请输入正确手机号'
          }
        ],
        userMail: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        roleId: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'blur'
          }
        ],
        companyId: [
          {
            required: true,
            message: '请选择公司',
            trigger: 'blur'
          }
        ]
      },

      dialogTableVisiblepwd: false,
      ruleForm1: {
        userId: '',
        password: '',
        repassword: '',
        confirmPassword: ''
      },
      rules1: {
        password: [
          {
            required: true,
            message: '请输入原密码',
            trigger: ['blur', 'change']
          }
        ],
        repassword: [
          {
            required: true,
            message: '请输入新密码',
            trigger: ['blur', 'change']
          },
          {
            min: 6,
            max: 20,
            message: '密码长度在 6 到 20 个字符之间',
            trigger: ['blur', 'change']
          }
        ],
        confirmPassword: [
          {
            required: true,
            message: '请输入确认密码',
            trigger: ['blur', 'change']
          },
          {
            validator: validatePass2,
            trigger: ['blur', 'change']
          }
        ]
      },
      isCompanyAdmin: false
    }
  },
  components: { TreeSelect },
  methods: {
    // 初始化角色列表
    fnInitRoleList() {
      z.ld()
      request({
        url: '/sys/role/page',
        method: 'post',
        params: {
          pageNo: 1,
          pageSize: 9999
        }
      })
        .then(res => {
          z.lc()
          const data = res.data.list
          for (const key in data) {
            this.roleList.push({
              label: data[key].roleName,
              value: data[key].roleId
            })
          }
        })
        .catch(() => {
          z.lc()
        })
    },
    // 查询分页查询系统用户列表接口
    fnList() {
      z.ld()
      request({
        url: '/sys/user/page',
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
      this.fnList()
    },
    handleCurrentChange(val) {
      this.searchForm.pageNo = val
      this.fnList()
    },
    resetSearch() {
      if (this.$refs.searchForm !== undefined) {
        this.$refs.searchForm.resetFields()
      }
      this.fnSearch()
    },
    fnSearch() {
      this.tableData = []
      this.searchForm.pageNo = 1
      this.fnList()
      this.action = 'new'
      this.$refs.ruleForm.resetFields()
      this.ruleForm.userId = ''
    },
    fnNew() {
      this.action = 'new'
      this.resetForm('ruleForm')
      this.isCompanyAdmin = false
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    fnSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let url = ''
          const data = {
            userName: this.ruleForm.userName,
            userState: this.ruleForm.userState,
            userTel: this.ruleForm.userTel,
            userMail: this.ruleForm.userMail,
            companyId: this.ruleForm.companyId,
            userNote: this.ruleForm.userNote,
            departId: this.ruleForm.departId
          }
          if (this.action === 'edit') {
            url = '/sys/user/modify'
            data.roleId = this.ruleForm.roleId.join(',')
            data.userId = this.ruleForm.userId
          } else if (this.action === 'new') {
            url = '/sys/user/save'
            data.loginName = this.ruleForm.loginName
            data.password = this.ruleForm.password
              ? md5(this.ruleForm.password)
              : ''
            data.repassword = this.ruleForm.repassword
              ? md5(this.ruleForm.repassword)
              : ''
            data.roleId = this.ruleForm.roleId.join(',')
          }
          z.ld()
          request({
            url,
            method: 'post',
            params: data
          })
            .then(() => {
              z.lc()
              z.success('保存成功')
              this.resetForm('ruleForm')
              this.fnSearch()
            })
            .catch(() => {
              z.lc()
            })
        }
      })
    },
    handleClick(row) {
      this.action = 'edit'
      request({
        url: '/sys/user/info',
        method: 'get',
        params: { userId: row.userId }
      }).then(res => {
        // 清除校验
        this.resetForm('ruleForm')
        const data = res.sysUserEntity
        this.ruleForm.userId = data.userId
        this.ruleForm.userName = data.userName
        this.ruleForm.userState = data.userState
        this.ruleForm.userTel = data.userTel
        this.ruleForm.userMail = data.userMail
        this.ruleForm.userNote = data.userNote
        this.ruleForm.companyId = data.companyId
        this.isCompanyAdmin = data.isCompanyAdmin
        if (!data.isCompanyAdmin) {
          this.ruleForm.roleId = res.roles
        }
      })
    },
    fnDel(opt) {
      let list = []
      if (opt === 'single') {
        if (this.ruleForm.userId) {
          list.push(this.ruleForm.userId)
        }
      } else {
        for (const key in this.selection) {
          list.push(this.selection[key].userId)
        }
      }
      if (list.length === 0) {
        z.warning('请先选择人员')
        return
      } else {
        list = list.join(',')
      }
      z.confirm('确定删除吗？', () => {
        z.ld()
        request({
          url: '/sys/user/deletebatch',
          method: 'delete',
          params: { userIds: list }
        })
          .then(() => {
            z.lc()
            z.success('删除成功')
            this.resetForm('ruleForm')
            this.fnSearch()
          })
          .catch(() => {
            z.lc()
          })
      })
    },
    fnPassword() {
      if (this.selection.length <= 0) {
        z.warning('请选择人员')
        return
      } else if (this.selection.length > 1) {
        z.warning('请选择一个人员')
        return
      }
      this.dialogTableVisiblepwd = true
      this.ruleForm1.userId = this.selection[0].userId
    },
    handleClosePassword() {
      this.dialogTableVisiblepwd = false
      this.$refs.ruleForm1.resetFields()
    },
    handleOpenPwdDialog() {
      this.$refs.ruleForm1.validate(valid => {
        if (valid) {
          z.ld()
          request({
            method: 'post',
            url: '/sys/user/modifypassword',
            params: {
              userId: this.ruleForm1.userId,
              password: this.ruleForm1.password
                ? md5(this.ruleForm1.password)
                : '',
              repassword: this.ruleForm1.repassword
                ? md5(this.ruleForm1.repassword)
                : ''
            }
          })
            .then(() => {
              z.lc()
              z.success('重置成功')
              this.resetForm('ruleForm')
              this.fnSearch()
              this.dialogTableVisiblepwd = false
            })
            .catch(() => {
              z.lc()
            })
        }
      })
    }
  },
  mounted() {
    this.fnInitRoleList()
    this.fnList()
  }
}
</script>
<style scoped>
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
