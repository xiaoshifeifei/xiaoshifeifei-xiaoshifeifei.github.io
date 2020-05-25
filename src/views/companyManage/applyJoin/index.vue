<template>
  <div class="layout_main">
    <div class="create_join_btn">
      <el-button @click="doAdd" size="small" type="primary">创建团队</el-button>
      <el-button @click="doAdd2" size="small" type="primary">加入团队</el-button>
    </div>

    <!--加入企业table-->
    <el-card style="margin-top: 20px" v-show="isShow">
      <div slot="header">
        <span>加入企业</span>
        <el-input
          class="inline-input"
          placeholder="请输入团队"
          style="margin-left:30px;width:160px"
          v-model="state1"
        ></el-input>
        <el-button
          @click="searchOneCompany"
          icon="el-icon-search"
          style="margin-left:10px"
          type="primary"
        >搜索</el-button>
        <el-button
          @click="resetSearch"
          icon="el-icon-refresh"
          style="margin-left:10px"
          type="default"
        >重置</el-button>
      </div>
      <div style="float:left; width:100%;">
        <el-table
          :data="tableData"
          :default-sort="{prop: 'id', order: 'ascending'}"
          @row-click="clickRow"
          border
          ref="tb_user"
          stripe
          tooltip-effect="dark"
        >
          <el-table-column align="center" label="序号" type="index"></el-table-column>
          <el-table-column
            align="center"
            label="企业名称"
            min-width="200px"
            prop="name"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" label="法人" prop="legalperson" width="180px"></el-table-column>
          <el-table-column align="center" label="省市区县" prop="addressName" width="220px"></el-table-column>
          <el-table-column
            align="center"
            label="详细地址"
            min-width="200px"
            prop="address"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="180px">
            <template slot-scope="scope">
              <div v-if="isCompanyAdmin && isAuthen != 2">
                <el-button
                  disabled
                  style="color:#56C6C"
                  type="text"
                  v-if="scope.row.joinStatus == 0"
                >申请加入</el-button>
              </div>
              <div v-else>
                <el-button
                  @click.native.prevent="applyJoin(scope)"
                  style="color:#56C6C"
                  type="text"
                  v-if="scope.row.joinStatus == 0 || scope.row.joinStatus == 3"
                >申请加入</el-button>
                <el-button
                  @click.native.prevent="cancleHandle(scope)"
                  style="color:#56C6C"
                  type="text"
                  v-if="scope.row.joinStatus == 1"
                >撤销申请</el-button>
                <el-button
                  disabled
                  style="color:green"
                  type="text"
                  v-if="scope.row.joinStatus == 2"
                >审核通过</el-button>
              </div>
            </template>
          </el-table-column>
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
        <br>
      </div>
    </el-card>

    <!-- 创建企业 -->
    <el-card style="margin-top: 20px" v-show="dialogTableVisible">
      <div slot="header">
        <span>创建团队</span>
        <el-button
          @click="doHandle"
          size="medium"
          style="margin-right:10px;float:right;padding:3px 0;"
          type="text"
          v-if="checkCompany == 0 && isAuthen != 0"
        >{{pass == 1 ?'重新提交':'创 建'}}</el-button>
      </div>
      <el-form
        :inline="true"
        :model="ruleForm"
        :rules="rules"
        label-position="right"
        label-width="150px"
        ref="ruleForm"
      >
        <div class="box_card_car_inner">
          <el-form-item label="企业名称" prop="name">
            <el-input class="input" placeholder="请输入企业名称" v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="企业简称" prop="shortName">
            <el-input class="input" placeholder="请输入企业简称" v-model="ruleForm.shortName"></el-input>
          </el-form-item>
          <el-form-item label="营业执照号" prop="businessLicense">
            <el-input class="input" placeholder="请输入营业执照号" v-model="ruleForm.businessLicense"></el-input>
          </el-form-item>
          <el-form-item label="组织机构代码" prop="organizationCode">
            <el-input class="input" placeholder="请输入组织机构代码" v-model="ruleForm.organizationCode"></el-input>
          </el-form-item>
          <el-form-item label="运输经营许可证" prop="transportBusinessLicense">
            <el-input
              class="input"
              placeholder="请输入运输经营许可证"
              v-model="ruleForm.transportBusinessLicense"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系人姓名" prop="contacts">
            <el-input class="input" placeholder="请输入联系人姓名" v-model="ruleForm.contacts"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话" prop="contactsTel">
            <el-input class="input" placeholder="请输入联系人电话" v-model="ruleForm.contactsTel"></el-input>
          </el-form-item>
          <el-form-item label="社会统一信用代码" prop="socialUnifiedCode">
            <el-input class="input" placeholder="请输入社会统一信用代码" v-model="ruleForm.socialUnifiedCode"></el-input>
          </el-form-item>
          <el-form-item label="法定代表人" prop="legalperson">
            <el-input class="input" placeholder="请输入法定代表人" v-model="ruleForm.legalperson"></el-input>
          </el-form-item>
          <el-form-item label="开户名" prop="accountName">
            <el-input class="input" placeholder="请输入户名" v-model="ruleForm.accountName"></el-input>
          </el-form-item>
          <el-form-item label="开户行" prop="openingBank">
            <el-input class="input" placeholder="请输入开户行" v-model="ruleForm.openingBank"></el-input>
          </el-form-item>
          <el-form-item label="银行账号" prop="bankAccount">
            <el-input class="input" placeholder="请输入银行账号" v-model="ruleForm.bankAccount"></el-input>
          </el-form-item>
          <el-form-item label="纳税人开户行" prop="taxpayerOpeningBank">
            <el-input class="input" placeholder="请输入纳税人开户行" v-model="ruleForm.taxpayerOpeningBank"></el-input>
          </el-form-item>
          <el-form-item label="纳税人银行账号" prop="taxpayerBankAccount">
            <el-input class="input" placeholder="请输入纳税人银行账号" v-model="ruleForm.taxpayerBankAccount"></el-input>
          </el-form-item>
          <el-form-item label="纳税人姓名" prop="taxpayerName">
            <el-input class="input" placeholder="请输入纳税人姓名" v-model="ruleForm.taxpayerName"></el-input>
          </el-form-item>
          <el-form-item label="纳税人地址" prop="taxpayerAddress">
            <el-input class="input" placeholder="请输入纳税人地址" v-model="ruleForm.taxpayerAddress"></el-input>
          </el-form-item>
          <el-form-item label="纳税人电话" prop="taxpayerTel">
            <el-input class="input" placeholder="请输入纳税人电话" v-model="ruleForm.taxpayerTel"></el-input>
          </el-form-item>
          <el-form-item label="注册资本" prop="registeredCapital">
            <el-input class="input" placeholder="请输入注册资本" v-model="ruleForm.registeredCapital"></el-input>
          </el-form-item>
          <el-form-item label="省市区县" prop="addressName">
            <el-tooltip
              :content="ruleForm.addressName"
              :disabled="ruleForm.addressName.length <= 0"
              effect="dark"
              placement="top-start"
            >
              <el-cascader
                :options="optionsArea"
                @change="handleChangeAddress"
                size="small"
                style="width:160px"
                v-model="selectedOptionsAddress"
              ></el-cascader>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input class="input" placeholder="请输入详细地址" v-model="ruleForm.address"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              :autosize="{ minRows: 2, maxRows: 4}"
              class="input"
              placeholder="请输入备注"
              type="textarea"
              v-model="ruleForm.remark"
            ></el-input>
          </el-form-item>
          <el-form-item label="经营范围" prop="businessScope">
            <el-input
              :autosize="{ minRows: 2, maxRows: 4}"
              class="input"
              placeholder="请输入经营范围"
              type="textarea"
              v-model="ruleForm.businessScope"
            ></el-input>
          </el-form-item>
        </div>
        <div
          class="pic_box"
          style="border:1px dashed #ebeef5;padding-top:10px;display:flex;flex-wrap:wrap;"
        >
          <el-form-item label="营业执照" prop="blUrl">
            <div class="id_card el-upload el-upload--text">
              <el-upload
                :before-upload="beforeAvatarUpload"
                :data="{ title: 'business' }"
                :on-success="handleBlUrl"
                :show-file-list="false"
                action="file/upload/uploads"
                class="avatar-uploader"
              >
                <img :src="`${blUrlSrc}`" class="avatar" v-if="ruleForm.blUrl">
                <i class="el-icon-plus avatar-uploader-icon" v-else></i>
              </el-upload>
            </div>
            <br>
            <div style="width:200px;word-break:break-all;">
              <span style="color:red;">允许上传图片的格式为:gif,jpeg,png,jpg</span>
            </div>
          </el-form-item>
          <el-form-item label="道路运输证" prop="tblUrl">
            <div class="id_card el-upload el-upload--text">
              <el-upload
                :before-upload="beforeAvatarUpload"
                :data="{ title: 'road' }"
                :on-success="handletblUrl"
                :show-file-list="false"
                action="file/upload/uploads"
                class="avatar-uploader"
              >
                <img :src="`${tblUrlSrc}`" class="avatar" v-if="ruleForm.tblUrl">
                <i class="el-icon-plus avatar-uploader-icon" v-else></i>
              </el-upload>
            </div>
            <br>
            <div style="width:200px;word-break:break-all;">
              <span style="color:red;">允许上传图片的格式为:gif,jpeg,png,jpg</span>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import {
  regionData,
  CodeToText,
} from 'element-china-area-data'

export default {
  data() {
    return {
      active: 0,
      statusBox: ['未提交审核', '审核中', '审核通过'],
      description: '',
      finalStepStyle: '',

      dialogTableVisible: false,
      isShow: true,

      state1: '',
      userId: '',

      checkCompany: '',
      isCompanyAdmin: '',
      pass: '',
      isAuthen: '',

      searchForm: {
        total: 1,
        pageNo: 1,
        pageSize: 10,

        isClient: 0,
        isJoin: true,
        userId: '',
        name: ''
      },

      tableData: [],

      selectedOptionsAddress: [],
      optionsArea: regionData,

      ruleForm: {
        name: '',
        shortName: '',
        organizationCode: '',
        transportBusinessLicense: '',
        address: '',
        socialUnifiedCode: '',
        openingBank: '',
        bankAccount: '',
        taxpayerOpeningBank: '',
        taxpayerBankAccount: '',
        taxpayerName: '',
        taxpayerAddress: '',
        taxpayerTel: '',
        businessLicense: '',
        blUrl: '',
        tblUrl: '',
        legalperson: '',
        registeredCapital: '',
        businessScope: '',
        remark: '',
        code: '',
        pcode: '',
        detail: '',
        addressCode: '',
        addressName: '',
        comType: 2,
        contacts: '',
        contactsTel: '',
        id: '',
        isRegistered: true,
        accountName: '',
        isClient: 0
      },
      rules: {
        accountName: [{
          required: true,
          message: '请输入开户名',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '请输入企业名称',
          trigger: 'blur'
        }],
        organizationCode: [{
          required: true,
          message: '请输入组织机构代码',
          trigger: 'blur'
        }],
        transportBusinessLicense: [{
          required: true,
          message: '请填写道路运输许可证',
          trigger: 'blur'
        }],
        address: [{
          required: true,
          message: '请输入详细地址',
          trigger: 'blur'
        }],
        socialUnifiedCode: [{
          required: true,
          message: '请输入社会统一信用代码',
          trigger: 'blur'
        }],
        openingBank: [{
          required: true,
          message: '请输入开户行',
          trigger: 'blur'
        }],
        businessLicense: [{
          required: true,
          message: '请输入营业执照号',
          trigger: 'blur'
        }],
        legalperson: [{
          required: true,
          message: '请输入法定代表人',
          trigger: 'blur'
        }],
        pcode: [{
          required: true,
          message: '请选择父企业编码',
          trigger: 'blur'
        }],
        contacts: [{
          required: true,
          message: '请输入联系人姓名',
          trigger: 'blur'
        }],
        contactsTel: [
          {
            required: true,
            message: '请输入联系人电话',
            trigger: 'blur'
          },
          {
            pattern: /^1[34578]\d{9}$/,
            message: '请输入手机正确格式',
            trigger: 'blur'
          }
        ],
        bankAccount: [{
          required: true,
          message: '请输入银行账号',
          trigger: 'blur'
        }],
        blUrl: [{
          required: true,
          message: '请上传营业执照',
          trigger: 'blur'
        }],
        tblUrl: [{
          required: true,
          message: '请上传道路运输证',
          trigger: 'blur'
        }],
        addressName: [
          {
            required: true,
            message: '请选择省市区县',
            trigger: ['blur', 'change']
          }
        ]
      },

      imgCropperData: {
        accept: 'image/gif,image/jpeg,image/png,image/jpg'
      },

      blUrlSrc: '',
      tblUrlSrc: ''
    }
  },
  // 创建团队(创建公司)
  methods: {
    getData(flag) {
      this.getLoginInfo().then(res => {
        if (flag === 1) {
          this.fnList(res.userId)
          this.statusManage(res)
        } else if (flag === 2) {
          this.statusManage(res)
        } else if (flag === 3) {
          this.fnList(res.userId)
        }
        this.userId = res.userId
      })
    },
    getLoginInfo() {
      return new Promise(resolve => {
        request({
          url: 'sys/login/getlogininfo',
          method: 'get'
        }).then(res => {
          resolve(res.data)
        })
      })
    },
    fnList(userId) {
      this.searchForm.userId = userId
      z.ld()
      request({
        url: '/org/orgcompany/pagejoin',
        method: 'post',
        params: this.searchForm
      })
        .then(res => {
          z.lc()
          this.tableData = res.data.list.filter(
            item => item.id !== 'b59dc41383294a86aeb2c69cb14363c5'
          )
          this.searchForm.total = res.data.totalCount
        })
        .catch(() => {
          z.lc()
        })
    },
    statusManage(opt) {
      this.checkCompany = opt.checkCompany
      this.isCompanyAdmin = opt.isCompanyAdmin
      if (opt.companyInfo != null) {
        this.isAuthen = opt.companyInfo.isAuthen
      } else {
        this.isAuthen = -1
      }
      if (this.isCompanyAdmin) {
        if (opt.pass) {
          this.pass = 1
        } else {
          this.pass = 0
        }
      }

      const userCompany = opt.userCompany ? ':' + opt.userCompany : ''
      const behaviorType = this.isShow ? '加入团队' : '创建团队'

      if (this.isShow) {
        // 加入团队
        this.description = behaviorType
        this.active = 1
        this.finalStepStyle = ''
        this.statusBox.splice(2, 1, '审核通过')
      } else {
        // 创建团队
        this.$refs.ruleForm.resetFields()
        this.selectedOptionsAddress = []
        this.description = behaviorType

        if (opt.isCompanyAdmin) {
          // 有创建企业
          if (opt.pass) {
            // 被拒绝
            this.active = 3
            this.statusBox.splice(2, 1, '审核不通过')
            this.finalStepStyle = 'error'
            this.description = behaviorType + ' ' + userCompany

            // 回显
            const companyInfo = opt.companyInfo
            this.ruleForm.id = companyInfo.id
            this.ruleForm.isRegistered = companyInfo.isRegistered
            this.ruleForm.isClient = companyInfo.isClient
            this.ruleForm.name = companyInfo.name
            this.ruleForm.shortName = companyInfo.shortName
            this.ruleForm.businessLicense = companyInfo.businessLicense
            this.ruleForm.organizationCode = companyInfo.organizationCode
            this.ruleForm.transportBusinessLicense = companyInfo.transportBusinessLicense
            this.ruleForm.contacts = companyInfo.contacts
            this.ruleForm.contactsTel = companyInfo.contactsTel
            this.ruleForm.socialUnifiedCode = companyInfo.socialUnifiedCode
            this.ruleForm.legalperson = companyInfo.legalperson
            this.ruleForm.accountName = companyInfo.accountName
            this.ruleForm.openingBank = companyInfo.openingBank
            this.ruleForm.bankAccount = companyInfo.bankAccount
            this.ruleForm.taxpayerOpeningBank = companyInfo.taxpayerOpeningBank
            this.ruleForm.taxpayerBankAccount = companyInfo.taxpayerBankAccount
            this.ruleForm.taxpayerName = companyInfo.taxpayerName
            this.ruleForm.taxpayerAddress = companyInfo.taxpayerAddress
            this.ruleForm.taxpayerTel = companyInfo.taxpayerTel
            this.ruleForm.registeredCapital = companyInfo.registeredCapital
            this.selectedOptionsAddress = companyInfo.addressCode.split(',')
            this.ruleForm.addressName = companyInfo.addressName
            this.ruleForm.address = companyInfo.address
            this.ruleForm.remark = companyInfo.remark
            this.ruleForm.businessScope = companyInfo.businessScope
            this.ruleForm.blUrl = companyInfo.blUrl
            this.ruleForm.tblUrl = companyInfo.tblUrl
          } else {
            this.active = 2
            this.finalStepStyle = ''
            this.description = behaviorType + ' ' + userCompany
          }

          if (this.isAuthen === 1) {
            this.active = 3
            this.statusBox.splice(2, 1, '审核通过')
            this.finalStepStyle = 'success'
            this.description = behaviorType + ' ' + userCompany
          }
        } else {
          // 没有创建企业
          this.active = 1
          this.finalStepStyle = ''
          this.statusBox.splice(2, 1, '审核通过')
        }
      }
    },
    clickRow(row) {
      if (row.joinStatus === '0') {
        // 未申请
        this.active = 1
        this.description = '加入团队'
        this.statusBox.splice(2, 1, '审核通过')
        this.finalStepStyle = ''
      } else if (row.joinStatus === '1') {
        // 待审核
        this.active = 2
        this.description = '加入团队 ' + row.name
        this.statusBox.splice(2, 1, '审核通过')
        this.finalStepStyle = ''
      } else if (row.joinStatus === '2') {
        this.active = 3
        this.description = '加入团队 ' + row.name
        this.finalStepStyle = 'success'
        this.statusBox.splice(2, 1, '审核通过')
      } else if (row.joinStatus === '3') {
        this.active = 3
        this.description = '加入团队 ' + row.name
        this.statusBox.splice(2, 1, '审核不通过')
        this.finalStepStyle = 'error'
      }
    },
    doAdd() {
      this.dialogTableVisible = true
      this.isShow = false
      this.getData(2)
    },
    // 加入公司
    doAdd2() {
      this.dialogTableVisible = false
      this.isShow = true
      this.getData(1)
    },
    searchOneCompany() {
      this.searchForm.name = this.state1
      this.getData(3)
    },
    // 重置表单（刷新）
    resetSearch() {
      this.state1 = ''
      this.searchForm.name = ''
      if (this.$refs.searchForm !== undefined) {
        this.$refs.searchForm.resetFields()
      }
      this.getData(3)
    },
    applyJoin(scope) {
      z.confirm('确认申请加入该团队吗？', () => {
        z.ld()
        request({
          url: '/org/orguser/modifycompany',
          method: 'post',
          data: {
            userId: this.searchForm.userId,
            companyId: scope.row.id
          }
        })
          .then(() => {
            z.lc()
            z.success('申请加入成功，审核中...')
            this.getData(1)
          })
          .catch(() => {
            z.lc()
          })
      })
    },
    cancleHandle(scope) {
      this.$confirm('确定撤销该申请吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.userWithdrawcompany(scope.row.id)
        })
        .catch()
    },
    userWithdrawcompany(companyId) {
      z.ld()
      request({
        url: '/org/orguser/userWithdrawcompany',
        method: 'post',
        params: {
          id: this.userId,
          companyId: companyId
        }
      })
        .then(() => {
          z.lc()
          z.success('撤销成功')
          this.getData(1)
        })
        .catch(() => {
          z.lc()
        })
    },
    handleSizeChange(val) {
      this.searchForm.pageNo = 1
      this.searchForm.pageSize = val
      this.getData(3)
    },
    handleCurrentChange(val) {
      this.searchForm.pageNo = val
      this.getData(3)
    },
    doHandle() {
      let urls = ''
      const ruleForm = this.$refs.ruleForm
      const data = this.ruleForm

      if (this.pass === 1) {
        urls = '/org/orgcompany/modify'
        data.isAuthen = Number(0)
      } else {
        urls = '/org/orgcompany/save'
      }
      if (data.comType === '不详') {
        data.comType = 0
      } else if (data.comType === '货主') {
        data.comType = 1
      } else if (data.comType === '承运商') {
        data.comType = 2
      } else if (data.comType === '本平台') {
        data.comType = 3
      }
      ruleForm.validate(valid => {
        if (valid) {
          delete data.createTime
          delete data.removed
          delete data.updateTime
          request({
            url: urls,
            method: 'post',
            data: data
          })
            .then(() => {
              z.lc()
              z.success('操作成功')
              this.dialogTableVisible = false
              this.isShow = true
              this.$refs.ruleForm.resetFields()
              this.getData(2)
            })
            .catch(() => {
              this.dialogTableVisible = false
              this.isShow = true
              z.lc()
            })
        }
      })
    },
    handleChangeAddress(arr) {
      this.ruleForm.addressName = CodeToText[arr[0]] + ',' + CodeToText[arr[1]] + ',' + CodeToText[arr[2]]
      this.ruleForm.addressCode = arr.join(',')
    },
    handleBlUrl(res) {
      this.ruleForm.blUrl = res.url
      this.blUrlSrc = z.imageUrl + res.url
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      const type = file.type
      if (this.imgCropperData.accept.indexOf(type) === -1) {
        this.$message.error('上传图片格式错误!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!')
        return false
      }
      return true
    },
    handletblUrl(res) {
      this.ruleForm.tblUrl = res.url
      this.tblUrlSrc = z.imageUrl + res.url
    }
  },
  mounted: function() {
    this.getData(1)
  }
}
</script>

<style lang="less" scoped>
/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #222 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/ .avatar-uploader .el-upload:hover {
  border-color: #409eff !important;
}
/deep/ .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 160px !important;
  height: 100px !important;
  line-height: 100px !important;
  text-align: center;
}
/deep/ .avatar {
  width: 160px;
  height: 100px;
  display: block;
}
</style>
