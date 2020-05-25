<template>
  <div>
    <div class="layout_main">
      <div style="display: flex;">
        <el-card class="box-card" style="width:500px;">
          <div class="clearfix" slot="header">
            <span class="title-font">网站参数项设置</span>
            <el-button @click="sysEdit" class="addbtn" icon="el-icon-edit" type="primary">编辑</el-button>
          </div>
          <el-form label-width="90px">
            <div style="padding:15px;">
              <el-form-item label="网站Logo">
                <div class="flex-warp">
                  <div style="width:350px;height:130px;border:2px solid #ebeef5;float:left;">
                    <img
                      :src="sysData.pic"
                      alt
                      readonly
                      style="width:340px;height:90px;margin-top:20px;"
                    >
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="网站网站">
                <div class="flex-warp">
                  <el-input class="input" readonly size="small" v-model="sysData.website"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="网站标题">
                <div class="flex-warp">
                  <el-input class="input" readonly size="small" v-model="sysData.title"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="网站名称">
                <div class="flex-warp">
                  <el-input class="input" readonly size="small" v-model="sysData.name"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="网站关键字">
                <div class="flex-warp">
                  <el-input class="input" readonly size="small" v-model="sysData.keyword"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="网站描述">
                <div class="flex-warp">
                  <el-input class="input" readonly size="small" v-model="sysData.description"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="版权信息">
                <div class="flex-warp">
                  <el-input class="input" readonly size="small" v-model="sysData.copyright"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="备案信息">
                <div class="flex-warp">
                  <el-input class="input" readonly size="small" v-model="sysData.filing"></el-input>
                </div>
              </el-form-item>
            </div>
          </el-form>
        </el-card>

        <div class="right">
          <div class="right-top">
            <el-card class="box-card">
              <div class="clearfix" slot="header">
                <span class="title-font">网站客服设置</span>
                <el-button @click="emailEdit" class="addbtn" icon="el-icon-edit" type="primary">编辑</el-button>
              </div>
              <el-form label-width="90px">
                <el-form-item label="客服电话">
                  <div class="flex-warp">
                    <el-input class="input" readonly size="small" v-model="emailData.tel"></el-input>
                  </div>
                </el-form-item>
                <el-form-item label="客服邮箱">
                  <div class="flex-warp">
                    <el-input class="input" readonly size="small" v-model="emailData.mail"></el-input>
                  </div>
                </el-form-item>
                <el-form-item label="电报群">
                  <div class="flex-warp">
                    <el-input class="input" readonly size="small" v-model="emailData.telegram"></el-input>
                  </div>
                </el-form-item>
                <el-form-item label="官方微博">
                  <div class="flex-warp">
                    <el-input class="input" readonly size="small" v-model="emailData.weibo"></el-input>
                  </div>
                </el-form-item>
              </el-form>
            </el-card>
          </div>
          <div class="right-bottom">
            <el-card class="box-card">
              <div class="clearfix" slot="header">
                <span class="title-font">语言设置</span>
                <el-button @click="langEdit" class="addbtn" icon="el-icon-edit" type="primary">编辑</el-button>
              </div>
              <el-form label-width="90px">
                <el-form-item label="多国语言">
                  <div class="flex-warp">
                    <el-input class="input" readonly size="small" v-model="langData.lang"></el-input>
                  </div>
                </el-form-item>
              </el-form>
            </el-card>
          </div>
        </div>
        <!-- =======弹窗======= -->
        <el-dialog
          :before-close="handleClose"
          :visible.sync="dialogVisible1"
          title="网站参数项设置"
          width="30%"
        >
          <el-form :model="ruleForm" :rules="rules" clearable label-width="100px" ref="ruleForm">
            <el-form-item label="网站logo" prop="logo">
              <el-upload
                :before-upload="beforeAvatarUpload"
                :data="{ title: 'logo' }"
                :on-success="handleAvatarSuccess"
                :show-file-list="false"
                accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PNG, .GIF"
                action="file/upload/uploads"
                class="avatar-uploader"
              >
                <img :src="imageUrl" class="avatar" v-if="imageUrl">
                <i class="el-icon-plus avatar-uploader-icon" v-else></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="网站网址" prop="website">
              <el-input clearable v-model="ruleForm.website"></el-input>
            </el-form-item>
            <el-form-item label="网站标题" prop="title">
              <el-input clearable v-model="ruleForm.title"></el-input>
            </el-form-item>
            <el-form-item label="网站名称" prop="name">
              <el-input clearable v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="网站关键字" prop="keyword">
              <el-input clearable v-model="ruleForm.keyword"></el-input>
            </el-form-item>
            <el-form-item label="网站描述" prop="description">
              <el-input clearable v-model="ruleForm.description"></el-input>
            </el-form-item>
            <el-form-item label="版权信息" prop="copyright">
              <el-input clearable v-model="ruleForm.copyright"></el-input>
            </el-form-item>
            <el-form-item label="备案信息" prop="filing">
              <el-input clearable v-model="ruleForm.filing"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                @click="dialogVisible1 = false"
                icon="el-icon-back"
                style="margin-left:15px; float:right;"
                type="primary"
              >取消</el-button>
              <el-button
                @click="sysSubmit"
                icon="el-icon-edit"
                style="float:right;"
                type="primary"
              >保存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog
          :before-close="handleClose"
          :visible.sync="dialogVisible2"
          title="网站客服设置"
          width="30%"
        >
          <el-form
            :model="emailRuleForm"
            :rules="emailRules"
            clearable
            label-width="100px"
            ref="emailRuleForm"
          >
            <el-form-item label="客服电话" prop="tel">
              <el-input clearable v-model="emailRuleForm.tel"></el-input>
            </el-form-item>
            <el-form-item label="客服邮箱" prop="mail">
              <el-input clearable v-model="emailRuleForm.mail"></el-input>
            </el-form-item>
            <el-form-item label="电报群" prop="telegram">
              <el-input clearable v-model="emailRuleForm.telegram"></el-input>
            </el-form-item>
            <el-form-item label="官方微博" prop="weibo">
              <el-input clearable v-model="emailRuleForm.weibo"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                @click="dialogVisible2 = false"
                icon="el-icon-back"
                style="margin-left:15px; float:right;"
                type="primary"
              >取消</el-button>
              <el-button
                @click="emailSubmit"
                icon="el-icon-edit"
                style="float:right;"
                type="primary"
              >保存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog
          :before-close="handleClose"
          :visible.sync="dialogVisible3"
          title="语言设置"
          width="30%"
        >
          <el-form
            :model="langRuleForm"
            :rules="langRules"
            clearable
            label-width="100px"
            ref="emailRuleForm"
          >
            <el-form-item label="多国语言" prop="lang">
              <el-input clearable v-model="langRuleForm.lang"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                @click="dialogVisible3 = false"
                icon="el-icon-back"
                style="margin-left:15px; float:right;"
                type="primary"
              >取消</el-button>
              <el-button
                @click="langSubmit"
                icon="el-icon-edit"
                style="float:right;"
                type="primary"
              >保存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
      <el-tooltip content="回到顶部" placement="top">
        <back-to-top
          :back-position="50"
          :custom-style="myBackToTopStyle"
          :visibility-height="300"
          transition-name="fade"
        />
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import Base64 from '@/utils/base64utils.js'
import BackToTop from '@/components/BackToTop'
export default {
  name: 'paramset',
  components: { BackToTop },
  data() {
    return {
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1', // 按钮的背景颜色 The background color of the button
        zIndex: '999'
      },
      tableData: [], // 表单数据
      sysData: [],
      emailData: [],
      langData: [],
      ruleForm: {
        copyright: '',
        description: '',
        filing: '',
        keyword: '',
        logo: '',
        name: '',
        title: '',
        website: ''
      },
      emailRuleForm: {
        mail: '',
        qrcode: '',
        tel: '',
        telegram: '',
        weibo: ''
      },
      langRuleForm: { lang: '' },
      datas: [],
      allData: [],
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      imageUrl: '',
      emailImageUrl: '',
      rules: {
        imageUrl: [{
          required: true,
          message: '请选择',
          trigger: 'change'
        }],
        copyright: [{
          required: true,
          message: '请选择',
          trigger: 'blur'
        }],
        title: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }],
        description: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }],
        filing: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }],
        keyword: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }],
        logo: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }],
        website: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }]
      },
      emailRules: {
        imageUrl: [{
          required: true,
          message: '请选择',
          trigger: 'change'
        }],
        mail: [{
          required: true,
          message: '请选择',
          trigger: 'blur'
        }],
        tel: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }],
        weibo: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }],
        telegram: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }]
      },
      langRules: {
        lang: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    fnSysList() {
      z.ld()
      request({
        method: 'post',
        url: '/sys/parm/datepageobject',
        params: {
          /* eslint-disable */
          parm_key: 'sys',
          page: this.nowPage,
          page_size: this.pageSize
        }
      })
        .then(res => {
          z.lc()
          this.sysData = res.data
          for (const i in this.sysData) {
            let item = []
            item[i] = this.sysData[i]
            this.datas.push(item)
          }
        })
        .catch(() => {
          z.lc()
        })
    },
    fnLangList() {
      z.ld()
      request({
        method: 'post',
        url: '/sys/parm/datepageobject',
        params: {
          /* eslint-disable */
          parm_key: 'lang',
          page: this.nowPage,
          page_size: this.pageSize
        }
      })
        .then(res => {
          z.lc()
          this.langData = res.data
        })
        .catch(() => {
          z.lc()
        })
    },
    fnEmailList() {
      z.ld()
      request({
        method: 'post',
        url: '/sys/parm/datepageobject',
        params: {
          /* eslint-disable */
          parm_key: 'email',
          page: this.nowPage,
          page_size: this.pageSize
        }
      })
        .then(res => {
          z.lc()
          this.emailData = res.data
        })
        .catch(() => {
          z.lc()
        })
    },
    sysEdit() {
      this.dialogVisible1 = true
      this.ruleForm = Object.assign({}, this.sysData)
      this.imageUrl = this.ruleForm.pic
    },
    sysSubmit() {
      this.allData = JSON.stringify(this.ruleForm)
      this.allData = Base64.encode(this.allData)
      z.ld()
      request({
        method: 'post',
        url: '/sys/parm/update',
        params: {
          /* eslint-disable */
          parm_key: 'sys',
          parm_data: this.allData
        }
      })
        .then(res => {
          z.lc()
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible1 = false
          }
          this.fnSysList()
        })
        .catch(() => {
          z.lc()
        })
    },
    emailEdit() {
      this.dialogVisible2 = true
      this.emailRuleForm = Object.assign({}, this.emailData)
      this.imageUrl = this.emailData.qrcode
    },
    emailSubmit() {
      this.allData = JSON.stringify(this.emailRuleForm)
      this.allData = Base64.encode(this.allData)
      z.ld()
      request({
        method: 'post',
        url: '/sys/parm/update',
        params: {
          /* eslint-disable */
          parm_key: 'email',
          parm_data: this.allData
        }
      })
        .then(res => {
          z.lc()
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible2 = false
          }
          this.fnEmailList()
        })
        .catch(() => {
          z.lc()
        })
    },
    langEdit() {
      this.dialogVisible3 = true
      this.langRuleForm = Object.assign({}, this.langData)
    },
    langSubmit() {
      this.allData = JSON.stringify(this.langRuleForm)
      this.allData = Base64.encode(this.allData)
      z.ld()
      request({
        method: 'post',
        url: '/sys/parm/update',
        params: {
          /* eslint-disable */
          parm_key: 'lang',
          parm_data: this.allData
        }
      })
        .then(res => {
          z.lc()
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialogVisible3 = false
          }
          this.fnLangList()
        })
        .catch(() => {
          z.lc()
        })
    },
    handleClose() {
      this.dialogVisible1 = false
    },
    handleAvatarSuccess(res, file) {
      this.ruleForm.pic = res.data
      this.emailRuleForm.qrcode = res.data
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
    }
  },
  mounted() {
    this.fnSysList()
    this.fnEmailList()
    this.fnLangList()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.clear {
  clear: both;
}
.left {
  width: 600px;
}
.param-div {
  width: 100%;
  height: 600px;
  border: 2px solid #ebeef5;
}
.top-title {
  width: 100%;
  height: 40px;
  background: rgb(245, 243, 243);
  text-align: center;
  border-bottom: 2px solid #ebeef5;
}
.right {
  width: 500px;
  height: 600px;
  margin-left: 30px;
}
.right .el-form-item {
  margin-bottom: 15px !important;
}
.param-content {
  width: 100%;
  height: 400px;
}
.right-top {
  width: 100%;
  // height: 450px;
  //   border: 2px solid #ebeef5;
}
.right-bottom {
  margin-top: 20px;
  width: 100%;
  height: 300px;
  //   border: 2px solid #ebeef5;
}
.addbtn {
  float: right;
  font-size: 12px;
  padding: 5px 8px;

  margin: 5px 10px;
}
.title-font {
  float: left;
  line-height: 40px;
  margin-left: 10px;
}
.input {
  width: 350px;
  float: left;
}
.flex-warp {
  width: 650px;
  height: 100%;
  display: flex;
  align-items: center;
}
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
  width: 220x;
  height: 80px;
  display: block;
}
</style>

