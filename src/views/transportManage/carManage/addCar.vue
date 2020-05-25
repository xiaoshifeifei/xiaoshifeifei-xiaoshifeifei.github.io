<template>
  <!-- 车辆管理添加编辑详情 -->
  <el-card>
    <div class="clearfix" slot="header">
      <span>添加车辆</span>
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
    <!-- <el-collapse @change="handleChangeCollapse" v-model="activeNames">
      <el-collapse-item name="2" title="保险信息">
        <div class="insurance_box">
          <el-table :data="carFormInfo.data.carLinelistFake" style="width: 100%">
            <el-table-column label="保险公司" prop="safeCompany">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`carLinelistFake[${scope.$index}].safeCompany`"
                  :rules="rules.safeCompany"
                  label="保险公司"
                >
                  <el-input
                    :disabled="isDetailShow"
                    placeholder="请输入保险公司"
                    v-model="scope.row.safeCompany"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="保单单号" prop="warrantyNum">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`carLinelistFake[${scope.$index}].warrantyNum`"
                  :rules="rules.warrantyNum"
                  label="保单单号"
                >
                  <el-input
                    :disabled="isDetailShow"
                    placeholder="请输入保单单号"
                    v-model="scope.row.warrantyNum"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="险种" prop="safeType">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`carLinelistFake[${scope.$index}].safeType`"
                  :rules="rules.safeType"
                  label="险种"
                >
                  <el-input
                    :disabled="isDetailShow"
                    placeholder="请输入险种"
                    v-model="scope.row.safeType"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="开始时间" prop="startTime">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`carLinelistFake[${scope.$index}].startTime`"
                  :rules="rules.startTime"
                  label="开始时间"
                >
                  <el-date-picker
                    :disabled="isDetailShow"
                    format="yyyy-MM-dd"
                    placeholder="选择日期"
                    type="date"
                    v-model="scope.row.startTime"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="结束时间" prop="overTime">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`carLinelistFake[${scope.$index}].overTime`"
                  :rules="rules.overTime"
                  label="结束时间"
                >
                  <el-date-picker
                    :disabled="isDetailShow"
                    format="yyyy-MM-dd"
                    placeholder="选择日期"
                    type="date"
                    v-model="scope.row.overTime"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="经办人" prop="operator">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`carLinelistFake[${scope.$index}].operator`"
                  :rules="rules.operator"
                  label="经办人"
                >
                  <el-input
                    :disabled="isDetailShow"
                    placeholder="请输入经办人"
                    v-model="scope.row.operator"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="保险金额" prop="insuranceAmount">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`carLinelistFake[${scope.$index}].insuranceAmount`"
                  :rules="rules.insuranceAmount"
                  label="保险金额"
                >
                  <el-input
                    :disabled="isDetailShow"
                    placeholder="请输入保险金额"
                    v-model="scope.row.insuranceAmount"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="right" v-if="!isDetailShow">
              <template slot="header" slot-scope="scope">
                <el-button @click="addOneInsure()" icon="el-icon-plus" type="primary"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button @click="delOneInsure(scope)" icon="el-icon-minus" type="primary"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>

      <el-collapse-item name="3" title="GPS信息">
        <div class="insurance_box">
          <el-table :data="carFormInfo.data.cargpslistFake" style="width: 100%">
            <el-table-column label="设备号" prop="deviceId">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`cargpslistFake[${scope.$index}].deviceId`"
                  :rules="rules.deviceId"
                  label="设备号"
                >
                  <el-input
                    :disabled="isDetailShow"
                    placeholder="请输入设备号"
                    v-model="scope.row.deviceId"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="sim卡号" prop="simId">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`cargpslistFake[${scope.$index}].simId`"
                  :rules="rules.simId"
                  label="sim卡号"
                >
                  <el-input
                    :disabled="isDetailShow"
                    placeholder="请输入sim卡号"
                    v-model="scope.row.simId"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="设备类型" prop="deviceType">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`cargpslistFake[${scope.$index}].deviceType`"
                  :rules="rules.deviceType"
                  label="设备类型"
                >
                  <el-select
                    :disabled="isDetailShow"
                    placeholder="请选择"
                    v-model="scope.row.deviceType"
                  >
                    <el-option label="设备1" value="1"></el-option>
                    <el-option label="设备2" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="激活日期" prop="activationDate">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`cargpslistFake[${scope.$index}].activationDate`"
                  :rules="rules.activationDate"
                  label="激活日期"
                >
                  <el-date-picker
                    :disabled="isDetailShow"
                    format="yyyy-MM-dd"
                    placeholder="选择日期"
                    type="date"
                    v-model="scope.row.activationDate"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="到期日期" prop="dueDate">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`cargpslistFake[${scope.$index}].dueDate`"
                  :rules="rules.dueDate"
                  label="到期日期"
                >
                  <el-date-picker
                    :disabled="isDetailShow"
                    format="yyyy-MM-dd"
                    placeholder="选择日期"
                    type="date"
                    v-model="scope.row.dueDate"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="安装日期" prop="installDate">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`cargpslistFake[${scope.$index}].installDate`"
                  :rules="rules.installDate"
                  label="安装日期"
                >
                  <el-date-picker
                    :disabled="isDetailShow"
                    format="yyyy-MM-dd"
                    placeholder="选择日期"
                    type="date"
                    v-model="scope.row.installDate"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="right" v-if="!isDetailShow">
              <template slot="header" slot-scope="scope">
                <el-button @click="addOneGps()" icon="el-icon-plus" type="primary"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button @click="delOneGps(scope)" icon="el-icon-minus" type="primary"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>-->
  </el-card>
</template>

<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import { carFormInfo, listTypeInfo } from './data.js'

export default {
  data() {
    return {
      carFormInfo: {},
      belongedCompanyList: [],

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
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    getCarrierData() {
      request({
        url: '/org/orgcompany/page',
        method: 'post',
        params: { pageNo: 0, pageSize: 500 }
      })
        .then(res => {
          this.belongedCompanyList = res.data.list
        })
    },
    // 上传照片
    handleUploadSuccess(res, file, name) {
      this.carFormInfo.data[name] = res.url
    },
    handleError() {
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
    // delOneGps(scope) {
    //   this.carFormInfo.data.cargpslistFake.splice(scope.$index, 1)
    //   this.$refs.carForm.clearValidate()
    // },
    // handleChangeCollapse(val) {
    //   if (this.pageType == 'add') return
    //   for (let i = 0; i < val.length; i++) {
    //     if (val[i] == '1') {
    //       if (this.activeNameBool1) {
    //         request({
    //           url: '/carrier/carline/findlist',
    //           method: 'post',
    //           params: { carId: this.carId || '' }
    //         })
    //           .then(res => {
    //             this.carFormInfo.data.carLinelistFake = res.data
    //             this.activeNameBool1 = false
    //           })
    //           .catch(err => {
    //             console.log(err)
    //           })
    //       }
    //     }
    //     if (val[i] == '2') {
    //       if (this.activeNameBool2) {
    //         request({
    //           url: '/carrier/carsafe/findlist',
    //           method: 'post',
    //           params: { carId: this.carId || '' }
    //         })
    //           .then(res => {
    //             this.carFormInfo.data.carLinelistFake = res.data
    //             this.activeNameBool2 = false
    //           })
    //           .catch(err => {
    //             console.log(err)
    //           })
    //       }
    //     }
    //     if (val[i] == '3') {
    //       if (this.activeNameBool3) {
    //         request({
    //           url: '/carrier/cargps/findlist',
    //           method: 'post',
    //           params: { carId: this.carId || '' }
    //         })
    //           .then(res => {
    //             this.carFormInfo.data.cargpslistFake = res.data
    //             this.activeNameBool3 = false
    //           })
    //           .catch(err => {
    //             console.log(err)
    //           })
    //       }
    //     }
    //   }
    // },
    // addOneInsure() {
    //   this.carFormInfo.data.carLinelistFake.push({
    //     safeCompany: '',
    //     warrantyNum: '',
    //     safeType: '',
    //     startTime: '',
    //     overTime: '',
    //     operator: '',
    //     insuranceAmount: ''
    //   })
    // },
    // delOneInsure(scope) {
    //   this.carFormInfo.data.carLinelistFake.splice(scope.$index, 1)
    //   this.$refs.carForm.clearValidate()
    // },
    // addOneGps() {
    //   this.carFormInfo.data.cargpslistFake.push({
    //     deviceId: '',
    //     simId: '',
    //     deviceType: '',
    //     activationDate: '',
    //     dueDate: '',
    //     installDate: ''
    //   })
    // },
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
          delete this.carFormInfo.data.carLinelistFake
          delete this.carFormInfo.data.carSafelistFake
          delete this.carFormInfo.data.cargpslistFake
          request({
            url: '/basic/orgcar/save',
            method: 'post',
            data: this.carFormInfo.data
          }).then(() => {
            z.success('操作成功')
            this.goBack()
          })
        }
      })
    }
  }
}
</script>
