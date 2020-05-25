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
          <el-table-column align="center" label="图片" prop="pic" width="300">
            <template slot-scope="scope">
              <img :src="scope.row.pic" alt style="display:inline-block;width:250px;height:90px">
            </template>
          </el-table-column>
          <el-table-column align="center" label="作用" prop="use">
            <template slot-scope="scope">
              <span v-if="scope.row.use==10">首页</span>
              <span v-if="scope.row.use==20">返利页面</span>
              <span v-if="scope.row.use==30">APP首页</span>
              <span v-if="scope.row.use==40">APP返利页面</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="网址" prop="url" width="300"></el-table-column>
          <el-table-column align="center" label="标题" prop="title"></el-table-column>
          <el-table-column align="center" label="排序" prop="sort" sortable></el-table-column>
          <el-table-column align="center" label="语言" prop="lang" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.lang=='en'">英文</span>
              <span v-if="scope.row.lang=='zh'">中文</span>
              <span v-if="scope.row.lang=='kr'">韩文</span>
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
        :page-sizes="[10,15,20,25,30]"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <el-card style="width:500px;" v-show="showCard">
      <div class="clearfix" slot="header">
        <span>{{diallogTitleType}}</span>
      </div>

      <el-form
        :model="ruleForm"
        :rules="rules"
        :validate-on-rule-change="false"
        label-width="100px"
        ref="ruleForm"
      >
        <el-form-item label="图片上传" prop="pic">
          <el-input style="display:none" v-model="ruleForm.pic"></el-input>
          <el-upload
            :before-upload="beforeAvatarUpload"
            accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.PNG,.GIF"
            :data="{ title: 'banner' }"
            :on-error="uploadError"
            :on-success="handleAvatarSuccess"
            :show-file-list="false"
            action="file/upload/uploads"
            class="avatar-uploader"
          >
            <img :src="imageUrl" class="avatar" v-if="imageUrl">
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转网址" prop="url">
          <el-input clearable v-model="ruleForm.url"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input clearable type="age" v-model="ruleForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="语言" prop="lang">
          <el-select filterable placeholder="请选择" style="width:100%;" v-model="ruleForm.lang">
            <el-option
              :key="item.index"
              :label="item.dict_name"
              :value="item.dict_value"
              v-for="item in langData"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input clearable v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="作用" prop="use">
          <el-select style="width:100%;" v-model="ruleForm.use">
            <el-option
              :key="index"
              :label="item.dict_name"
              :value="item.dict_value"
              v-for="(item,index) in useDroplist"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="handleClose"
            icon="el-icon-back"
            style="margin-left:15px; float:right;"
            type="primary"
          >返回</el-button>
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
  name: 'banner',
  data() {
    return {
      ruleForm: {
        pic: '',
        url: '',
        sort: '',
        title: '',
        use: '',
        id: '',
        lang: ''
      },
      rules: {
        pic: [
          {
            required: true,
            message: '请选择上传图片',
            trigger: ['change', 'blur', 'input']
          }
        ],
        url: [{
          required: true,
          message: '请输入网址',
          trigger: 'change'
        }],
        sort: [
          {
            required: true,
            message: '请输入排序',
            trigger: 'change'
          },
          {
            pattern: /^([1-9]\d*|[0]{1,1})$/,
            message: '请输入整型数据'
          }
        ],
        title: [{
          required: true,
          message: '请输入标题',
          trigger: 'change'
        }],
        use: [{
          required: true,
          message: '请选择作用',
          trigger: 'change'
        }],
        lang: [{
          required: true,
          message: '请选择语言',
          trigger: 'change'
        }]
      },
      allData: [],
      tableData: [],
      langData: [],
      delData: [],
      index: 1,
      imageUrl: '',

      page: 0,
      pageSize: 10,
      total: 0,

      isShow: true,
      showCard: false,

      diallogTitleType: '',
      multipleSelection: [],
      useDroplist: []
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
          parm_key: 'flash',
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
    fnUseDropList() {
      z.ld()
      request({
        url: '/sys/dict/droplist',
        method: 'post',
        params: {
          /* eslint-disable */
          dict_type: 'flash',
          dict_id: 'use'
        }
      })
        .then(res => {
          z.lc()
          this.useDroplist = res.data.use
        })
        .catch(() => {
          z.lc()
        })
    },
    submit() {
      if (this.diallogTitleType === '添加') {
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
                parm_key: 'flash',
                dict_type: 't_sys_lang',
                dict_id: 'lang_type',
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
                parm_key: 'flash',
                dict_type: 't_sys_lang',
                dict_id: 'lang_type',
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
            // eslint-disable-next-line
            parm_key: 'flash',
             // eslint-disable-next-line
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
      this.diallogTitleType = '添加'
      this.showCard = true
      this.isShow = false
      this.imageUrl = ''
      this.$nextTick(() => {
        this.resetForm('ruleForm')
      })
    },
    handelEdit(row) {
      this.$refs.ruleForm.clearValidate()
      this.diallogTitleType = '编辑'
      this.index = row.$index
      this.showCard = true
      this.isShow = false
      this.ruleForm = Object.assign({}, row.row)
      this.imageUrl = this.ruleForm.pic
    },
    handleClose() {
      this.showCard = false
      this.isShow = true
      this.$refs.ruleForm.clearValidate()
    },
    uploadError() {
      z.warning('图片上传失败')
    },

    handleAvatarSuccess(res, file) {
      this.ruleForm.pic = res.data
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
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
    this.fnDropList()
    this.fnUseDropList()
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 220px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  max-width: 360px !important;
  height: 80px;
  display: block;
}
</style>

