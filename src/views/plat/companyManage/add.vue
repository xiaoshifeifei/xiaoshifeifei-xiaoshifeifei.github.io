<template>
  <div>
    <el-card>
      <div class="clearfix" slot="header">
        <span>添加企业</span>
        <el-button
          @click="$emit('goBack')"
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
        :data="companyFormInfo.data"
        :field-list="companyFormInfo.fieldList"
        :label-width="companyFormInfo.labelWidth"
        :ref-obj.sync="companyFormInfo.ref"
        :rules="companyFormInfo.rules"
        ref="companyFormInfo"
      >
        <div slot="form-addressName" style="width: 160px">
          <el-tooltip
            :content="companyFormInfo.data.addressName"
            :disabled="companyFormInfo.data.addressName.length <= 0"
            effect="dark"
            placement="top-start"
          >
            <el-cascader
              :options="areaList"
              @change="handleChangeAddress('companyFormInfo', $event, 'addressName', 'addressCode')"
              style="width: 100%"
              v-model="companyFormInfo.data.addressCode"
            />
          </el-tooltip>
        </div>
        <div class="id_card el-upload el-upload--text" slot="form-blUrl">
          <el-upload
            :before-upload="beforeAvatarUpload"
            :data="{ title: 'business' }"
            :on-success="handleBlUrl"
            :show-file-list="false"
            accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PNG, .GIF"
            action="file/upload/uploads"
            class="avatar-uploader"
          >
            <img :src="`${blUrlSrc}`" class="avatar" v-if="companyFormInfo.data.blUrl">
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
        </div>
        <div class="id_card el-upload el-upload--text" slot="form-tblUrl">
          <el-upload
            :before-upload="beforeAvatarUpload"
            :data="{ title: 'road' }"
            :on-success="handletblUrl"
            :show-file-list="false"
            accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PNG, .GIF"
            action="file/upload/uploads"
            class="avatar-uploader"
          >
            <img :src="`${tblUrlSrc}`" class="avatar" v-if="companyFormInfo.data.tblUrl">
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
        </div>
      </custom-form>
    </el-card>
  </div>
</template>

<script>
import { regionData, CodeToText } from 'element-china-area-data'
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import { companyFormInfo } from './companyForm.js'

export default {
  data() {
    return {
      companyFormInfo: {},
      areaList: regionData,
      address: '',
      blUrlSrc: '',
      tblUrlSrc: ''
    }
  },
  created() {
    this.companyFormInfo = companyFormInfo()
  },
  methods: {
    handleBlUrl(res) {
      this.companyFormInfo.data.blUrl = res.url
      this.blUrlSrc = z.imageUrl + res.url
    },
    handletblUrl(res) {
      this.companyFormInfo.data.tblUrl = res.url
      this.tblUrlSrc = z.imageUrl + res.url
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!')
      }
      return isLt2M
    },
    handleChangeAddress(formName, arr, address, addressCode) {
      this[formName].data[address] = ''
      this[formName].data[addressCode] = ''
      arr.forEach(item => {
        this[formName].data[address] += CodeToText[item] + ','
        this[formName].data[addressCode] += item + ','
      })
      this[formName].data[address] = this[formName].data[address].slice(0, -1)
      this[formName].data[addressCode] = this[formName].data[addressCode].slice(0, -1)
    },
    handleSave() {
      this.companyFormInfo.ref.validate(valid => {
        if (valid) {
          request({
            url: '/org/orgcompany/save',
            method: 'post',
            data: this.companyFormInfo.data
          })
            .then(() => {
              z.lc()
              z.success('保存成功')
              this.$emit('goBack')
            })
            .catch(() => {
              z.lc()
            })
        }
      })
    },
    changeShowPage(e) {
      this.showPage = e
      this.refresh()
    }
  }
}
</script>

<style lang="less">
.cargo {
  .avatar-uploader .el-upload {
    border: 1px dashed #222 !important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff !important;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 160px !important;
    height: 100px !important;
    line-height: 100px !important;
    text-align: center;
  }
  .avatar {
    width: 160px;
    height: 100px;
    display: block;
  }
}
</style>
