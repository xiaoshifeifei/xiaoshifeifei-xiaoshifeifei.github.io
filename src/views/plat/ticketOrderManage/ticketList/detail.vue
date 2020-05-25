<template>
  <div>
    <el-card>
      <div slot="header">
        <span>运单详情</span>
        <div style="float: right; margin-top: -5px">
          <template v-if="$store.state.ticketOrder.orderStatus === 1">
            <el-button @click="handleAction(orderId, '', true)" type="primary">接受</el-button>
            <el-button @click="isRefuse = true" type="danger">拒绝</el-button>
          </template>
          <template v-if="$store.state.ticketOrder.orderStatus === 'REFUSE_RECEIVE'">
            <el-button @click="handleEditRefuseOrder()" type="primary">确定</el-button>
          </template>
          <el-button @click="changeShowPage('list')" type="primary">返回</el-button>
        </div>
      </div>
      <!-- 基本信息 -->
      <el-card style="margin-bottom: 10px">
        <div slot="header">
          <span>基本信息</span>
        </div>
        <custom-form
          :data="baseFormInfo.data"
          :field-list="baseFormInfo.fieldList"
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
                    style="width: 100%"
                    v-model="areaForm.getArea"
                  />
                </el-tooltip>
              </div>
            </custom-form>
          </el-card>
        </el-col>
      </el-row>
      <!-- 物品信息 -->
      <el-card style="margin-bottom: 10px">
        <div slot="header">
          <span>物品信息</span>
        </div>
        <el-row justify="space-between" style="margin-bottom: 10px" type="flex">
          <el-col style="text-align: right">
            <span>
              总数量:
              <span class="goods-total">{{ getTotalQuantity }}</span>
            </span>
            <span>
              总重量:
              <span class="goods-total">{{ getTotalWeight }}</span>
            </span>
            <span>
              总体积:
              <span class="goods-total">{{ getTotalVolume }}</span>
            </span>
          </el-col>
        </el-row>
        <custom-table
          :columns="tableDataColumns"
          :data="tableData"
          :hasPage="false"
          style="margin-bottom: 10px"
        >
          <template slot="goodsType" slot-scope="scope">
            <el-select placeholder="请选择货物类型" v-if="scope.row.isEdit" v-model="scope.row.goodsType">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in listTypeInfo.goodsTypeList"
              ></el-option>
            </el-select>
            <div v-else>
              <span>{{scope.row.goodsType | formatGoodsType }}</span>
            </div>
          </template>
          <template slot="unit" slot-scope="scope">
            <el-select placeholder="请选择包装单位" v-if="scope.row.isEdit" v-model="scope.row.unit">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in listTypeInfo.unitList"
              ></el-option>
            </el-select>
            <div v-else>
              <span>{{scope.row.unit | formatGoodsUnitType }}</span>
            </div>
          </template>
        </custom-table>
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
        <el-row style="margin-bottom: 20px">
          <el-col :span="4">
            <span>下单附件：</span>
            <div style="margin-top: 10px">
              <el-image
                :preview-src-list="[attachmentUrl, omsRefuseUrl, tmsRefuseUrl]"
                :src="attachmentUrl"
                class="avatar"
                v-if="attachmentUrl"
              />
              <span v-else>无</span>
            </div>
          </el-col>
          <el-col :span="4">
            <span>被平台拒绝附件：</span>
            <div style="margin-top: 10px">
              <el-image
                :preview-src-list="[omsRefuseUrl, tmsRefuseUrl, attachmentUrl]"
                :src="omsRefuseUrl"
                class="avatar"
                v-if="omsRefuseUrl"
              />
              <span v-else>无</span>
            </div>
          </el-col>
          <el-col :span="4">
            <span>被企业拒绝附件：</span>
            <div style="margin-top: 10px">
              <el-image
                :preview-src-list="[tmsRefuseUrl, attachmentUrl, omsRefuseUrl]"
                :src="tmsRefuseUrl"
                class="avatar"
                v-if="tmsRefuseUrl"
              />
              <span v-else>无</span>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-card>
    <!-- 拒绝理由 -->
    <el-dialog
      :visible.sync="isRefuse"
      @close="handleCloseDialog()"
      title="拒绝理由"
      width="30%"
    >
      <el-form :model="refuseForm" :rules="refuseFormRules" label-width="100px" ref="refuseForm">
        <el-form-item label="拒绝理由" prop="notes">
          <el-input placeholder="请输入理由" v-model="refuseForm.notes"/>
        </el-form-item>
        <el-form-item label="附件" prop="omsRefuseUrl">
          <el-upload
            :before-upload="beforeAvatarUpload"
            :data="{ title: 'eusinss' }"
            :on-success="handleUploadRefuseSuccess"
            :show-file-list="false"
            accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PNG, .GIF"
            action="platform/core/omssrvorder/uploads"
            class="avatar-uploader"
          >
            <img :src="refuseForm.omsRefuseUrl" class="avatar" v-if="refuseForm.omsRefuseUrl">
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="handleCloseDialog()">取消</el-button>
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
  data() {
    return {
      // 当前委托单id
      orderId: '',

      baseFormInfo: {},
      sendFormInfo: {},
      getFormInfo: {},
      settleFormInfo: {},
      areaForm: {
        sendArea: '',
        getArea: ''
      },
      tableData: [],
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
      // 拒绝表单
      isRefuse: false,
      refuseForm: {
        notes: '',
        omsRefuseUrl: ''
      },
      refuseFormRules: {
        notes: {
          required: true,
          message: '请输入拒绝理由',
          trigger: ['blur', 'change']
        }
      },
      // 附件图片
      attachmentUrl: '',
      omsRefuseUrl: '',
      tmsRefuseUrl: ''
    }
  },
  created() {
    this.orderId = this.$store.state.ticketOrder.orderId
    this.baseFormInfo = baseFormInfo()
    this.sendFormInfo = sendFormInfo()
    this.getFormInfo = getFormInfo()
    this.settleFormInfo = settleFormInfo()
    this.listTypeInfo = listTypeInfo()
    this.updateInfo(this.orderId)
    this.handleSetFormDisabled()
  },
  computed: {
    getTotalQuantity() {
      let sum = 0
      this.tableData.forEach(item => {
        sum += Number(item.number)
      })
      return sum
    },
    getTotalWeight() {
      let sum = 0
      this.tableData.forEach(item => {
        sum += Number(item.weight)
      })
      return sum
    },
    getTotalVolume() {
      let sum = 0
      this.tableData.forEach(item => {
        sum += Number(item.volume)
      })
      return sum
    }
  },
  methods: {
    changeShowPage(e) {
      this.$store.state.ticketOrder.status = e
    },
    updateInfo(orderId) {
      request({
        url: 'core/omssrvorder/info',
        method: 'get',
        params: { orderId }
      }).then(res => {
        this.baseFormInfo.data = res.data
        this.sendFormInfo.data = res.data
        this.getFormInfo.data = res.data
        this.settleFormInfo.data = res.data
        this.attachmentUrl = res.data.attachmentUrl
        // 收付款地址
        this.areaForm.sendArea = res.data.shipperAddressCode.split(',')
        this.areaForm.getArea = res.data.receiverAddressCode.split(',')
        // 物品信息
        this.tableData = res.data.goodsList
        // 附件图片
        this.omsRefuseUrl = res.data.omsRefuseUrl
        this.attachmentUrl = res.data.attachmentUrl
        this.tmsRefuseUrl = res.data.tmsRefuseUrl
      })
    },
    // 接受或者拒绝调用接口
    handleAction(orderId, notes = '', isAccept, omsRefuseUrl) {
      const data = {
        orderId: orderId,
        notes: notes,
        isAccept: isAccept,
        omsRefuseUrl: omsRefuseUrl
      }
      request({
        url: 'core/omssrvorder/modifyisaccept',
        method: 'put',
        params: data
      }).then(() => {
        z.success('操作成功')
        this.changeShowPage('list')
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
      this.refuseForm.omsRefuseUrl = res.url
    },
    // 确认拒绝
    handleConfirmRefuse() {
      this.$refs.refuseForm.validate(valid => {
        if (valid) {
          this.handleAction(
            this.orderId,
            this.refuseForm.notes,
            false,
            this.refuseForm.omsRefuseUrl
          )
          this.handleCloseDialog()
        }
      })
    },
    // 关闭拒绝表单的弹框
    handleCloseDialog() {
      this.isRefuse = false
      this.refuseForm.omsRefuseUrl = ''
      this.$refs.refuseForm.resetFields()
    },
    // 确定修改托运单
    handleEditRefuseOrder() {
      this.settleFormInfo.ref.validate(validate => {
        if (validate) {
          const data = {
            ...this.baseFormInfo.data,
            ...this.sendFormInfo.data,
            ...this.getFormInfo.data,
            ...this.settleFormInfo.data
          }
          data.goodsEntities = JSON.stringify(this.tableData)
          data.status = 2
          delete data.createTime
          delete data.goodsList

          request({
            url: '/core/omssrvorder/modify',
            method: 'put',
            params: data
          }).then(() => {
            this.$message.success('修改成功')
            this.$store.state.ticketOrder.status = 'list'
          })
        }
      })
    },
    // 设置表单的可编辑与不可编辑
    handleSetFormDisabled() {
      // eslint-disable-next-line
      let formList = ['baseFormInfo', 'sendFormInfo', 'getFormInfo']
      // 在detail页面更改“选择客户名称”输入框类型，如果不更改的话就会显示一串编号，因为后端设计了三个不同的字段，select只能接受两个字段，label和value
      if (this.$store.state.ticketOrder.status === 'detail') {
        this.baseFormInfo.fieldList.forEach(item => {
          if (item.value === 'customerId') {
            item.type = 'input'
            item.value = 'customerName'
          }
        })
      }
      // 判断是不是被拒绝订单，因为被拒绝订单类型中结算信息除了运费收入，其他的都可以被修改
      if (this.$store.state.ticketOrder.orderStatus !== 'REFUSE_RECEIVE') {
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

<style lang="less" scoped>
.goods-total {
  display: inline-block;
  text-align: left;
  width: 30px;
  color: #ff0000;
}
</style>
