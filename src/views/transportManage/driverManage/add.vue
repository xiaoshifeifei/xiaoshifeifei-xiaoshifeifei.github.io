<template>
  <el-card>
    <div class="clearfix" slot="header">
      <span>添加司机</span>
      <el-button
        @click="goBack"
        size="medium"
        style="margin-left:20px;float:right;padding:3px 0;"
        type="text"
      >返 回</el-button>
      <el-button
        @click="handleSave"
        size="medium"
        style="margin-right:10px;float:right;padding:3px 0;"
        type="text"
      >保 存</el-button>
    </div>
    <custom-form
      :data="driverFormInfo.data"
      :field-list="driverFormInfo.fieldList"
      :haveBorder="false"
      :label-width="driverFormInfo.labelWidth"
      :labelPosition="driverFormInfo.labelPosition"
      :list-type-info="listTypeInfo"
      :ref-obj.sync="driverFormInfo.ref"
      :rules="driverFormInfo.rules"
      @handleEvent="handleEvent"
      ref="driverForm"
    >
      <div class="el-upload el-upload--text" slot="form-employmentCertImgUrl">
        <el-upload
          :before-upload="beforeAvatarUpload"
          :data="{ title: 'job' }"
          :on-success="(res, file) => handleUploadSuccess(res, file, 'employmentCertImgUrl')"
          :show-file-list="false"
          accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PNG, .GIF"
          action="file/upload/uploads"
          class="avatar-uploader"
        >
          <img
            :src="driverFormInfo.data.employmentCertImgUrl"
            class="avatar"
            v-if="driverFormInfo.data.employmentCertImgUrl"
          >
          <i class="el-icon-plus avatar-uploader-icon" v-else></i>
        </el-upload>
      </div>
      <div class="el-upload el-upload--text" slot="form-idFrontImgUrl">
        <el-upload
          :before-upload="beforeAvatarUpload"
          :data="{ title: 'idcard' }"
          :on-success="(res, file) => handleUploadSuccess(res, file, 'idFrontImgUrl')"
          :show-file-list="false"
          accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PNG, .GIF"
          action="file/upload/uploads"
          class="avatar-uploader"
        >
          <img
            :src="driverFormInfo.data.idFrontImgUrl"
            class="avatar"
            v-if="driverFormInfo.data.idFrontImgUrl"
          >
          <i class="el-icon-plus avatar-uploader-icon" v-else></i>
        </el-upload>
      </div>
      <div class="el-upload el-upload--text" slot="form-idBackImgUrl">
        <el-upload
          :before-upload="beforeAvatarUpload"
          :data="{ title: 'idcard' }"
          :on-success="(res, file) => handleUploadSuccess(res, file, 'idBackImgUrl')"
          :show-file-list="false"
          accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PNG, .GIF"
          action="file/upload/uploads"
          class="avatar-uploader"
        >
          <img
            :src="driverFormInfo.data.idBackImgUrl"
            class="avatar"
            v-if="driverFormInfo.data.idBackImgUrl"
          >
          <i class="el-icon-plus avatar-uploader-icon" v-else></i>
        </el-upload>
      </div>
      <div class="el-upload el-upload--text" slot="form-licenseFrontImgUrl">
        <el-upload
          :before-upload="beforeAvatarUpload"
          :data="{ title: 'drivercard' }"
          :on-success="(res, file) => handleUploadSuccess(res, file, 'licenseFrontImgUrl')"
          :show-file-list="false"
          accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PNG, .GIF"
          action="file/upload/uploads"
          class="avatar-uploader"
        >
          <img
            :src="driverFormInfo.data.licenseFrontImgUrl"
            class="avatar"
            v-if="driverFormInfo.data.licenseFrontImgUrl"
          >
          <i class="el-icon-plus avatar-uploader-icon" v-else></i>
        </el-upload>
      </div>
      <div class="el-upload el-upload--text" slot="form-licenseBackImgUrl">
        <el-upload
          :before-upload="beforeAvatarUpload"
          :data="{ title: 'drivercard' }"
          :on-success="(res, file) => handleUploadSuccess(res, file, 'licenseBackImgUrl')"
          :show-file-list="false"
          accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PNG, .GIF"
          action="file/upload/uploads"
          class="avatar-uploader"
        >
          <img
            :src="driverFormInfo.data.licenseBackImgUrl"
            class="avatar"
            v-if="driverFormInfo.data.licenseBackImgUrl"
          >
          <i class="el-icon-plus avatar-uploader-icon" v-else></i>
        </el-upload>
      </div>
      <div class="el-upload el-upload--text" slot="form-otherEmploymentCertImgUrl">
        <el-upload
          :before-upload="beforeAvatarUpload"
          :data="{ title: 'otherjob' }"
          :on-success="(res, file) => handleUploadSuccess(res, file, 'otherEmploymentCertImgUrl')"
          :show-file-list="false"
          accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PNG, .GIF"
          action="file/upload/uploads"
          class="avatar-uploader"
        >
          <img
            :src="driverFormInfo.data.otherEmploymentCertImgUrl"
            class="avatar"
            v-if="driverFormInfo.data.otherEmploymentCertImgUrl"
          >
          <i class="el-icon-plus avatar-uploader-icon" v-else></i>
        </el-upload>
      </div>
    </custom-form>
  </el-card>
</template>

<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import { driverFormInfo } from './data.js'
import { driverStatusList, driverLicenseTypeList } from './listTypeInfo.js'

export default {
  data() {
    return {
      driverFormInfo: {},
      listTypeInfo: {
        userList: [],
        driverStatusList: []
      }
    }
  },
  created() {
    this.driverFormInfo = driverFormInfo()
    this.listTypeInfo.driverStatusList = driverStatusList
    this.listTypeInfo.driverLicenseTypeList = driverLicenseTypeList
    this.getUserData()
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    handleEvent(event, data) {
      /* eslint-disable */
      switch (event) {
        case 'handleChooseDriver':
          this.handleChooseDriver(data)
          break
      }
    },
    getUserData() {
      request({
        url: '/sys/user/findNotDirver',
        method: 'post',
        params: {
          pageNo: 1,
          pageSize: 500
        }
      }).then(res => {
        this.listTypeInfo.userList = res.data
      })
    },
    handleChooseDriver(val) {
      this.listTypeInfo.userList.forEach(item => {
        if (item.userId === val) {
          this.driverFormInfo.data.createUserName = item.userName
        }
      })
    },
    // 上传照片
    handleUploadSuccess(res, file, name) {
      this.driverFormInfo.data[name] = res.url
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!')
        return false
      }
      return true
    },
    handleSave() {
      this.driverFormInfo.ref.validate(valid => {
        if (valid) {
          request({
            url: '/basic/orgdriver/save',
            method: 'post',
            data: this.driverFormInfo.data
          })
            .then(() => {
              z.lc()
              z.success('操作成功')
              this.goBack()
            })
            .catch(() => {
              z.lc()
            })
        }
      })
    }
  }
}
</script>
