<template >
  <div class="layout_main">
    <div v-show="isShow">
      <el-form :inline="true" :model="searchForm" ref="searchForm">
        <el-row>
          <el-form-item label="多语言类型" prop="lang_type">
            <el-select
              filterable
              placeholder="请选择"
              style="width:100%;"
              v-model="searchForm.lang_type"
            >
              <el-option value>请选择</el-option>
              <el-option
                :key="index"
                :label="item.dict_name"
                :value="item.dict_value"
                v-for="(item,index) in langData"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="多语言key值" prop="lang_key">
            <el-input
              @keyup.enter.native="fnSearch"
              clearable
              placeholder="请输入"
              v-model="searchForm.lang_key"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="fnSearch" icon="el-icon-search" type="primary">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetSearch('searchForm')" type="default">重 置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleAdd" icon="el-icon-plus" type="primary">添 加</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <div style="display: flex;">
        <el-table :data="tableData" border stripe>
          <el-table-column
            :index="indexMethod"
            align="center"
            fixed
            label="序号"
            type="index"
            width="80"
          ></el-table-column>
          <el-table-column align="center" label="多语言排序" prop="lang_sort"></el-table-column>
          <el-table-column align="center" label="多语言的值" prop="lang_value"></el-table-column>
          <el-table-column align="center" label="多语言key值" prop="lang_key"></el-table-column>
          <el-table-column align="center" label="多语言类型" prop="lang_type">
            <template slot-scope="scope">
              <span v-if="scope.row.lang_type == 'en'">英文</span>
              <span v-if="scope.row.lang_type == 'zh'">中文</span>
              <span v-if="scope.row.lang_type == 'kr'">韩文</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="多语言备注" prop="lang_note" width="300"></el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="handelEdit(scope.row)" icon="el-icon-edit" type="primary">编辑</el-button>
              <el-button @click="handleDel(scope.row)" icon="el-icon-edit" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    <el-card style="width:500px;" v-show="showCard">
      <div class="clearfix" slot="header">
        <span>{{dialogTitleType}}</span>
      </div>
      <el-form :model="ruleForm" :rules="rules" label-width="120px" ref="ruleForm">
        <el-form-item label="多语言排序" prop="lang_sort">
          <el-input clearable v-model="ruleForm.lang_sort"></el-input>
        </el-form-item>
        <el-form-item label="多语言的值" prop="lang_value">
          <el-input clearable v-model="ruleForm.lang_value"></el-input>
        </el-form-item>
        <el-form-item label="多语言key值" prop="lang_key">
          <el-input clearable v-model="ruleForm.lang_key"></el-input>
        </el-form-item>

        <el-form-item label="多语言类型" prop="lang_type">
          <el-select filterable placeholder="请选择" style="width:100%;" v-model="ruleForm.lang_type">
            <el-option
              :key="index"
              :label="item.dict_name"
              :value="item.dict_value"
              v-for="(item,index) in langData"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="多语言备注" prop="lang_note">
          <el-input clearable v-model="ruleForm.lang_note"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="handleClose"
            icon="el-icon-back"
            style="margin-left:15px;float:right;"
            type="primary"
          >取消</el-button>
          <el-button
            @click="handleSubmit"
            icon="el-icon-edit"
            style="float:right;"
            type="primary"
          >保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
export default {
  name: 'languages',
  data() {
    return {
      ruleForm: {
        /* eslint-disable */
        lang_sort: '',
        lang_value: '',
        lang_key: '',
        lang_type: '',
        lang_note: '',
        sys_id: ''
      },
      searchForm: {
        /* eslint-disable */
        total: 0,
        page: 0,
        page_size: 100,
        lang_type: '',
        lang_key: ''
      },
      rules: {
        /* eslint-disable */
        lang_sort: [
          {
            required: true,
            message: '请输入整型数据',
            trigger: ['blur', 'change']
          },
          {
            pattern: /^([1-9]\d*|[0]{1,1})$/,
            message: '请输入整型数字',
            trigger: 'blur'
          }
        ],
        lang_value: [
          {
            required: true,
            message: '请输入多语言的值',
            trigger: 'blur'
          }
        ],
        lang_key: [
          {
            required: true,
            message: '请输入多语言的Key值',
            trigger: 'blur'
          }
        ],
        lang_type: [
          {
            required: true,
            message: '请选择语言的类型',
            trigger: 'change'
          }
        ],
        lang_note: [
          {
            required: true,
            message: '请输入多语言备注',
            trigger: 'blur'
          }
        ]
      },
      tableData: [],
      langData: [],
      isShow: true,
      showCard: false,
      dialogTitleType: ''
    }
  },
  methods: {
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    resetSearch() {
      this.$refs.searchForm.resetFields()
      this.fnSearch()
    },
    fnList() {
      z.ld()
      request({
        method: 'post',
        url: '/sys/lang/listPage',
        params: this.searchForm
      })
        .then(res => {
          z.lc()
          this.tableData = res.data.rsList
          this.searchForm.total = res.data.total
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

    fnDropList() {
      z.ld()
      request({
        method: 'post',
        url: '/sys/dict/droplist',
        params: {
          /* eslint-disable */
          dict_type: 't_sys_lang',
          dict_id: 'lang_type'
        }
      })
        .then(res => {
          z.lc()
          this.langData = res.data.lang_type
        })
        .catch(() => {
          z.lc()
        })
    },

    handleSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let fun = ''
          if (this.dialogTitleType === '添加') {
            fun = 'insert'
          } else {
            fun = 'update'
          }
          z.ld()
          request({
            method: 'post',
            url: `/sys/lang/${fun}`,
            params: this.ruleForm
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
    },
    handleDel(row) {
      z.confirm('确定删除吗？', () => {
        z.ld()
        request({
          method: 'post',
          url: '/sys/lang/delete',
          /* eslint-disable */
          params: { sys_id: row.sys_id }
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
      this.dialogTitleType = '编辑'
      this.$refs.ruleForm.clearValidate()
      this.showCard = true
      this.isShow = false
      this.ruleForm = Object.assign({}, row)
    },
    handleClose() {
      this.showCard = false
      this.isShow = true
      this.$refs.ruleForm.clearValidate()
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
    },
    indexMethod(index) {
      return index * 1 + 1
    }
  },
  mounted() {
    this.fnList()
    this.fnDropList()
  }
}
</script>
