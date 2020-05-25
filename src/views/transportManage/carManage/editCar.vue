<template>
  <!-- 车辆管理添加编辑详情 -->
  <el-card>
    <div class="clearfix" slot="header">
      <span>编辑车辆</span>
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
      :data="carFormInfo.data"
      :field-list="carFormInfo.fieldList"
      :haveBorder="false"
      :label-width="carFormInfo.labelWidth"
      :labelPosition="carFormInfo.labelPosition"
      :list-type-info="listTypeInfo"
      :ref-obj.sync="carFormInfo.ref"
      :rules="carFormInfo.rules"
      ref="carForm"
    >
      <div class="id_card el-upload el-upload--text" slot="form-drivinLicenseFrontImgUrl">
        <el-upload
          :before-upload="beforeAvatarUpload"
          :data="{ title: 'drivingLicense' }"
          :on-error="handleError"
          :on-success="(res, file) => handleUploadSuccess(res, file, 'drivinLicenseFrontImgUrl')"
          :show-file-list="false"
          accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PNG, .GIF"
          action="file/upload/uploads"
          class="avatar-uploader"
        >
          <img
            :src="`${carFormInfo.data.drivinLicenseFrontImgUrl}`"
            class="avatar"
            v-if="carFormInfo.data.drivinLicenseFrontImgUrl"
          >
          <i class="el-icon-plus avatar-uploader-icon" v-else></i>
        </el-upload>
      </div>
      <div class="id_card el-upload el-upload--text" slot="form-drivinLicenseBackImgUrl">
        <el-upload
          :before-upload="beforeAvatarUpload"
          :data="{ title: 'drivingLicense' }"
          :on-error="handleError"
          :on-success="(res, file) => handleUploadSuccess(res, file, 'drivinLicenseBackImgUrl')"
          :show-file-list="false"
          accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PNG, .GIF"
          action="file/upload/uploads"
          class="avatar-uploader"
        >
          <img
            :src="carFormInfo.data.drivinLicenseBackImgUrl"
            class="avatar"
            v-if="carFormInfo.data.drivinLicenseBackImgUrl"
          >
          <i class="el-icon-plus avatar-uploader-icon" v-else></i>
        </el-upload>
      </div>
      <div class="id_card el-upload el-upload--text" slot="form-vehicleImgUrl">
        <el-upload
          :before-upload="beforeAvatarUpload"
          :data="{ title: 'car' }"
          :on-error="handleError"
          :on-success="(res, file) => handleUploadSuccess(res, file, 'vehicleImgUrl')"
          :show-file-list="false"
          accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PNG, .GIF"
          action="file/upload/uploads"
          class="avatar-uploader"
        >
          <img
            :src="carFormInfo.data.vehicleImgUrl"
            class="avatar"
            v-if="carFormInfo.data.vehicleImgUrl"
          >
          <i class="el-icon-plus avatar-uploader-icon" v-else></i>
        </el-upload>
      </div>
      <div class="id_card el-upload el-upload--text" slot="form-roadTransCertUrl">
        <el-upload
          :before-upload="beforeAvatarUpload"
          :data="{ title: 'road' }"
          :on-error="handleError"
          :on-success="(res, file) => handleUploadSuccess(res, file, 'roadTransCertUrl')"
          :show-file-list="false"
          accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PNG, .GIF"
          action="file/upload/uploads"
          class="avatar-uploader"
        >
          <img
            :src="carFormInfo.data.roadTransCertUrl"
            class="avatar"
            v-if="carFormInfo.data.roadTransCertUrl"
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
import { carFormInfo, listTypeInfo } from './data.js'

export default {
  props: {
    carId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      carFormInfo: {},

      activeNames: [],
      activeNameBool1: true,
      activeNameBool2: true,
      activeNameBool3: true,

      listTypeInfo: {}
    }
  },
  created() {
    this.carFormInfo = carFormInfo()
    this.listTypeInfo = listTypeInfo()
    this.updateInfo()
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    updateInfo() {
      request({
        url: '/basic/orgcar/info',
        method: 'get',
        params: {
          carId: this.carId
        }
      }).then(res => {
        this.carFormInfo.data = res.data
      })
    },
    //上传照片
    handleUploadSuccess(res, file, name) {
      this.carFormInfo.data[name] = res.url
    },
    handleError(e) {
      this.$message.error('上传图片失败')
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!')
        return false
      }
      return true
    },
    // 提交表单
    handleSave() {
      this.carFormInfo.data.carLinelist = JSON.stringify(
        this.carFormInfo.data.carLinelistFake
      )
      this.carFormInfo.data.carSafelist = JSON.stringify(
        this.carFormInfo.data.carSafelistFake
      )
      this.carFormInfo.data.cargpslist = JSON.stringify(
        this.carFormInfo.data.cargpslistFake
      )
      this.carFormInfo.ref.validate(valid => {
        if (valid) {
          delete this.carFormInfo.data.createTime
          delete this.carFormInfo.data.updateTime
          delete this.carFormInfo.data.carLinelistFake
          delete this.carFormInfo.data.carSafelistFake
          delete this.carFormInfo.data.cargpslistFake
          z.ld()
          request({
            url: '/basic/orgcar/modify',
            method: 'put',
            data: this.carFormInfo.data
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
