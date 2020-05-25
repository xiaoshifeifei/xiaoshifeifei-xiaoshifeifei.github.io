<template>
  <div>
    <el-card>
      <div slot="header">
        <span>订单详情</span>
        <div style="float: right;">
          <el-button
            @click="handleAction('', true)"
            type="primary"
            v-if="$store.state.companyOrder.info.orderStatus === 1"
          >接受</el-button>
          <el-button
            @click="isRefuse = true"
            type="danger"
            v-if="$store.state.companyOrder.info.orderStatus === 1"
          >拒绝</el-button>
          <el-button @click="changeShowPage('list')" type="primary">返回</el-button>
        </div>
      </div>
      <el-card style="margin-bottom: 10px">
        <div slot="header">
          <span>基本信息</span>
        </div>
        <custom-form
          :data="baseFormInfo.data"
          :field-list="baseFormInfo.fieldList"
          :haveBorder="false"
          :label-width="baseFormInfo.labelWidth"
          :labelPosition="baseFormInfo.labelPosition"
          :list-type-info="listTypeInfo"
          :ref-obj.sync="baseFormInfo.ref"
          ref="baseForm"
        />
      </el-card>
      <!-- 发货方信息和收货方信息 -->
      <el-row :gutter="10" style="margin-bottom: 10px">
        <el-col :span="12">
          <!-- 发货方信息 -->
          <el-card>
            <div slot="header">
              <span>发货方信息</span>
            </div>
            <custom-form
              :data="sendFormInfo.data"
              :field-list="sendFormInfo.fieldList"
              :haveBorder="false"
              :label-width="sendFormInfo.labelWidth"
              :labelPosition="sendFormInfo.labelPosition"
              :list-type-info="listTypeInfo"
              :ref-obj.sync="sendFormInfo.ref"
              ref="sendForm"
            >
              <div slot="form-shipperAddress" style="width: 160px">
                <el-tooltip
                  :content="sendFormInfo.data.shipperAddress"
                  :disabled="areaForm.sendArea.length <= 0"
                  effect="dark"
                  placement="top-start"
                >
                  <el-cascader
                    :disabled="true"
                    :options="listTypeInfo.areaList"
                    @change="handleChangeAddress('sendFormInfo', $event, 'shipperAddress', 'shipperAddressCode')"
                    style="width: 100%"
                    v-model="areaForm.sendArea"
                  />
                </el-tooltip>
              </div>
            </custom-form>
          </el-card>
        </el-col>
        <el-col :span="12">
          <!-- 收货方信息 -->
          <el-card>
            <div slot="header">
              <span>收货方信息</span>
            </div>
            <custom-form
              :data="getFormInfo.data"
              :field-list="getFormInfo.fieldList"
              :haveBorder="false"
              :label-width="getFormInfo.labelWidth"
              :labelPosition="getFormInfo.labelPosition"
              :list-type-info="listTypeInfo"
              :ref-obj.sync="getFormInfo.ref"
              ref="getForm"
            >
              <div slot="form-receiverAddress" style="width: 160px">
                <el-tooltip
                  :content="getFormInfo.data.receiverAddress"
                  :disabled="areaForm.getArea.length <= 0"
                  effect="dark"
                  placement="top-start"
                >
                  <el-cascader
                    :disabled="true"
                    :options="listTypeInfo.areaList"
                    @change="handleChangeAddress('getFormInfo', $event, 'receiverAddress', 'receiverAddressCode')"
                    style="width: 100%"
                    v-model="areaForm.getArea"
                  />
                </el-tooltip>
              </div>
            </custom-form>
          </el-card>
        </el-col>
      </el-row>
      <!-- 货物信息 -->
      <el-card style="margin-bottom: 10px">
        <div slot="header">
          <span>货物信息</span>
        </div>
        <custom-table :columns="tableDataColumns" :data="goodsTableData" :hasPage="false" height="200">
          <template slot="goodsType" slot-scope="scope">
            <span>{{ scope.row.goodsType | formatGoodsType }}</span>
          </template>
          <template slot="unit" slot-scope="scope">
            <span>{{ scope.row.unit | formatGoodsUnitType }}</span>
          </template>
        </custom-table>
      </el-card>
      <!-- 派车单列表 -->
      <el-card style="margin-bottom: 10px">
        <div slot="header">
          <span>派车单列表</span>
        </div>
        <custom-table
          :columns="sendCarTableDataColumns"
          :data="sendCarTableData"
          :hasPage="false"
          height="200"
        />
      </el-card>
      <!-- 结算信息 -->
      <el-card style="margin-bottom: 10px">
        <div slot="header">
          <span>结算信息</span>
        </div>
        <custom-form
          :data="settleFormInfo.data"
          :field-list="settleFormInfo.fieldList"
          :label-width="settleFormInfo.labelWidth"
          :labelPosition="settleFormInfo.labelPosition"
          :list-type-info="listTypeInfo"
          :ref-obj.sync="settleFormInfo.ref"
          :rules="settleFormInfo.rules"
          ref="settleForm"
        />
      </el-card>
      <el-card style="margin-bottom: 10px">
        <div slot="header">
          <span>附件照片</span>
        </div>
        <el-image
          :preview-src-list="[attachmentUrl]"
          :src="attachmentUrl"
          class="avatar"
          v-if="attachmentUrl"
        />
        <span v-else>暂无</span>
      </el-card>
      <el-button
        @click="handleConfirmChangeOrder"
        size="large"
        type="primary"
        v-if="$store.state.companyOrder.info.orderStatus === 4"
      >确定</el-button>
    </el-card>
    <!-- 拒绝理由 -->
    <el-dialog
      :visible.sync="isRefuse"
      @close="handleCloseDialog('isRefuse', 'refuseForm')"
      title="拒绝理由"
      width="30%"
    >
      <el-form :model="refuseForm" :rules="refuseFormRules" label-width="100px" ref="refuseForm">
        <el-form-item label="拒绝理由" prop="notes">
          <el-input placeholder="请输入理由" v-model="refuseForm.notes"/>
        </el-form-item>
        <el-form-item label="附件" prop="tmsRefuseUrl">
          <el-upload
            :before-upload="beforeAvatarUpload"
            :data="{ title: 'eusinss' }"
            :on-success="handleUploadRefuseSuccess"
            :show-file-list="false"
            accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PNG, .GIF"
            action="platform/core/omssrvorder/uploads"
            class="avatar-uploader"
          >
            <img :src="refuseForm.tmsRefuseUrl" class="avatar" v-if="refuseForm.tmsRefuseUrl">
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="handleCloseDialog('isRefuse', 'refuseForm')">取消</el-button>
        <el-button @click="handleConfirmRefuse()" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  baseFormInfo,
  sendFormInfo,
  getFormInfo,
  settleFormInfo,
  listTypeInfo
} from './data.js'
import * as z from '@/utils/com.js'
import request from '@/utils/request'

export default {
  name: 'orderDetail',
  data() {
    return {
      orderId: '',
      goodsName: '',
      // 四个表单
      baseFormInfo: {},
      sendFormInfo: {},
      getFormInfo: {},
      settleFormInfo: {},
      areaForm: {
        sendArea: '',
        getArea: ''
      },
      attachmentUrl: '',
      // 物品表格
      goodsTableData: [],
      tableDataColumns: [
        {
          prop: 'goodsType',
          label: '货物类型',
          slotName: 'goodsType',
          align: 'center'
        },
        {
          prop: 'goodsName',
          label: '货物名称',
          type: 'input',
          align: 'center'
        },
        {
          prop: 'unit',
          label: '包装单位',
          slotName: 'unit',
          align: 'center'
        },
        {
          prop: 'number',
          label: '数量',
          type: 'number',
          align: 'center'
        },
        {
          prop: 'weight',
          label: '重量(吨)',
          type: 'number',
          align: 'center'
        },
        {
          prop: 'volume',
          label: '体积',
          type: 'number',
          align: 'center'
        }
      ],
      // 派车单表格
      sendCarTableData: [],
      sendCarTableDataColumns: [
        {
          prop: 'sendvehicleNo',
          label: '派车单号',
          align: 'center'
        },
        {
          prop: 'driverName',
          label: '司机',
          align: 'center'
        },
        {
          prop: 'driverTel',
          label: '司机电话',
          align: 'center'
        },
        {
          prop: 'price',
          label: '司机运费',
          align: 'center'
        }
      ],
      isRefuse: false,
      refuseForm: {
        notes: '',
        tmsRefuseUrl: ''
      },
      refuseFormRules: {
        notes: {
          required: true,
          message: '请输入拒绝理由',
          trigger: ['blur', 'change']
        }
      }
    }
  },
  created() {
    this.orderId = this.$store.state.companyOrder.info.orderId
    this.baseFormInfo = baseFormInfo()
    this.sendFormInfo = sendFormInfo()
    this.getFormInfo = getFormInfo()
    this.settleFormInfo = settleFormInfo()
    this.listTypeInfo = listTypeInfo()
    this.updateInfo()
    this.updateSendOrderList()
    this.handleSetFormDisabled()
  },
  methods: {
    changeShowPage(e) {
      this.$store.state.companyOrder.status = e
    },
    // 赋值表单
    updateInfo() {
      request({
        url: '/order/srvorder/getOrderInfo',
        method: 'get',
        params: { orderId: this.orderId }
      }).then(res => {
        this.baseFormInfo.data = res.data
        this.sendFormInfo.data = res.data
        this.getFormInfo.data = res.data
        this.settleFormInfo.data = res.data
        this.attachmentUrl = res.data.attachmentUrl
        this.goodsTableData = JSON.parse(res.data.goodsEntities)

        this.areaForm.sendArea = res.data.shipperAddressCode.split(',')
        this.areaForm.getArea = res.data.receiverAddressCode.split(',')
      })
    },
    // 获取此单已经派车的派车单列表
    updateSendOrderList() {
      request({
        url: '/order/srvwaybillsend/findDispatchCarsList',
        method: 'post',
        params: {
          orderId: this.orderId,
          total: 0,
          pageNo: 1,
          pageSize: 1000
        }
      }).then(res => {
        this.sendCarTableData = res.data.list
      })
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!')
      }
      return isLt2M
    },
    handleUploadRefuseSuccess(res) {
      this.refuseForm.tmsRefuseUrl = res.url
    },
    handleConfirmRefuse() {
      this.$refs.refuseForm.validate(valid => {
        if (valid) {
          this.handleAction(
            this.refuseForm.notes,
            false,
            this.refuseForm.tmsRefuseUrl
          )
          this.handleCloseDialog('isRefuse', 'refuseForm')
        }
      })
    },
    handleAction(tmsNotes = '', status, tmsRefuseUrl) {
      request({
        url: '/srv/srvorder/modifyIsConfirm',
        method: 'post',
        params: {
          orderId: this.orderId,
          tmsNotes: tmsNotes,
          isConfirm: status,
          tmsRefuseUrl: tmsRefuseUrl
        }
      }).then(() => {
        z.success('操作成功')
        this.changeShowPage('list')
      })
    },
    handleConfirmChangeOrder() {
      this.settleFormInfo.ref.validate(validate => {
        if (validate) {
          const data = {
            ...this.baseFormInfo.data,
            ...this.sendFormInfo.data,
            ...this.getFormInfo.data,
            ...this.settleFormInfo.data
          }
          data.goodsEntities = JSON.stringify(this.goodsTableData)
          data.status = 2
          delete data.createTime
          delete data.actionTime
          delete data.goodsList

          request({
            url: '/srv/srvorder/modifyReturnOrder',
            method: 'post',
            params: data
          }).then(() => {
            this.$message.success('修改成功')
            this.changeShowPage('list')
          })
        }
      })
    },
    handleCloseDialog(dialog, form) {
      this[dialog] = false
      this[form].tmsRefuseUrl = ''
      this.$refs[form].resetFields()
    },
    // 设置表单的可编辑与不可编辑
    handleSetFormDisabled() {
      // eslint-disable-next-line
      let formList = ['baseFormInfo', 'sendFormInfo', 'getFormInfo']
      // 判断是不是被拒绝订单，因为被拒绝订单类型中结算信息除了运费收入，其他的都可以被修改
      if (this.$store.state.companyOrder.info.orderStatus !== 4) {
        formList.push('settleFormInfo')
      } else {
        this.settleFormInfo.fieldList.forEach(item => {
          if (item.value === 'freightRevenue') {
            item.disabled = true
          }
        })
      }
      formList.forEach(item => {
        this[item].fieldList.forEach(item => {
          item.disabled = true
        })
      })
    }
  }
}
</script>
