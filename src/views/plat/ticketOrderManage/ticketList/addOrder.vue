<template>
  <div>
    <el-card>
      <div slot="header">
        <span>添加运单</span>
        <el-button
          @click="changeShowPage('list')"
          style="float: right; margin-top: -5px"
          type="primary"
        >返回</el-button>
      </div>
      <!-- 基本信息 -->
      <el-card style="margin-bottom: 10px">
        <div slot="header">
          <span>基本信息</span>
          <el-button
            @click="handleAddCustomer"
            icon="el-icon-plus"
            style="float: right; margin-top: -5px"
            type="primary"
          >快速添加客户</el-button>
        </div>
        <custom-form
          :data="baseFormInfo.data"
          :field-list="baseFormInfo.fieldList"
          :label-width="baseFormInfo.labelWidth"
          :labelPosition="baseFormInfo.labelPosition"
          :list-type-info="listTypeInfo"
          :ref-obj.sync="baseFormInfo.ref"
          :rules="baseFormInfo.rules"
          @handleEvent="handleEvent"
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
              <el-button
                @click="handleAddAddress(2)"
                icon="el-icon-plus"
                style="float: right; margin-top: -5px"
                type="primary"
              >快速添加地址</el-button>
            </div>
            <custom-form
              :data="sendFormInfo.data"
              :field-list="sendFormInfo.fieldList"
              :label-width="sendFormInfo.labelWidth"
              :labelPosition="sendFormInfo.labelPosition"
              :list-type-info="listTypeInfo"
              :ref-obj.sync="sendFormInfo.ref"
              :rules="sendFormInfo.rules"
              @handleEvent="handleEvent"
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
              <el-button
                @click="handleAddAddress(1)"
                icon="el-icon-plus"
                style="float: right; margin-top: -5px"
                type="primary"
              >快速添加地址</el-button>
            </div>
            <custom-form
              :data="getFormInfo.data"
              :field-list="getFormInfo.fieldList"
              :label-width="getFormInfo.labelWidth"
              :labelPosition="getFormInfo.labelPosition"
              :list-type-info="listTypeInfo"
              :ref-obj.sync="getFormInfo.ref"
              :rules="getFormInfo.rules"
              @handleEvent="handleEvent"
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
      <!-- 物品信息 -->
      <el-card style="margin-bottom: 10px">
        <div slot="header">
          <span>物品信息</span>
        </div>
        <el-row justify="space-between" style="margin-bottom: 10px" type="flex">
          <el-col>
            <el-select
              @change="handleChooseGoods"
              filterable
              placeholder="请选择物品"
              style="margin-right: 10px"
              v-model="goodsName"
            >
              <el-option
                :key="item.value"
                :label="item.goodsName"
                :value="item.goodsId"
                v-for="item in listTypeInfo.goodsList"
              ></el-option>
            </el-select>
            <el-button @click="handleAddGoods" type="success">新增</el-button>
          </el-col>
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
          <el-table-column align="center" fixed="right" label="操作" slot="append">
            <template slot-scope="scope">
              <el-button @click="handleDelete(scope.$index, tableData)" type="text">删除</el-button>
            </template>
          </el-table-column>
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
        <el-upload
          :before-upload="beforeAvatarUpload"
          :data="{ title: 'eusinss' }"
          :on-success="handleUploadSuccess"
          :show-file-list="false"
          accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .PNG, .GIF"
          action="platform/core/omssrvorder/uploads"
          class="avatar-uploader"
        >
          <img :src="attachmentUrl" class="avatar" v-if="attachmentUrl">
          <i class="el-icon-plus avatar-uploader-icon" v-else></i>
        </el-upload>
      </el-card>
      <el-button @click="handleConfirm" size="large" type="primary">确定</el-button>
      <el-button @click="handleReset" size="large">重置</el-button>
    </el-card>
    <!-- 添加客户或者修改客户 -->
    <el-dialog
      :visible.sync="isDialog"
      @close="handleCloseDialog"
      title="添加客户"
      top="5vh"
      width="80%"
    >
      <choose-customer
        :cusType="cusType"
        :isChangeType="true"
        @changeType="handleChangeCusType"
        ref="chooseCustomer"
      />
      <span class="dialog-footer" slot="footer">
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button @click="handleConfirmAddCustomer" type="primary">确定</el-button>
      </span>
    </el-dialog>
    <!-- 添加地址 -->
    <el-dialog :visible.sync="isAddAddress" @close="handleCloseAddress" title="添加地址">
      <addAddress @on-close="handleCloseAddress" ref="addAddress"/>
    </el-dialog>
  </div>
</template>

<script>
import { CodeToText } from 'element-china-area-data'
import {
  baseFormInfo,
  sendFormInfo,
  getFormInfo,
  settleFormInfo,
  listTypeInfo
} from './data.js'
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import chooseCustomer from '@/views/components/chooseCustomer'
import addAddress from '@/views/components/addAddress'

export default {
  components: {
    chooseCustomer,
    addAddress
  },
  data() {
    return {
      goodsName: '',
      selection: [],
      baseFormInfo: {},
      sendFormInfo: {},
      getFormInfo: {},
      settleFormInfo: {},
      attachmentUrl: '',
      isDialog: false,
      isAddAddress: false,
      cusType: 1,
      areaForm: {
        sendArea: '',
        getArea: ''
      },
      tableData: [],
      tableDataColumns: [
        {
          prop: 'goodsType',
          label: '货物类型',
          type: 'select',
          options: [
            {
              label: '电子产品',
              value: '90'
            },
            {
              label: '商品汽车',
              value: '92'
            },
            {
              label: '冷藏货物',
              value: '93'
            },
            {
              label: '大宗货物',
              value: '94'
            },
            {
              label: '快速消费',
              value: '95'
            },
            {
              label: '农产品',
              value: '96'
            },
            {
              label: '其他',
              value: '999'
            }
          ],
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
          type: 'select',
          options: [
            {
              label: '件',
              value: 'THING'
            },
            {
              label: '包',
              value: 'PACKAGE'
            },
            {
              label: '箱',
              value: 'BOX'
            },
            {
              label: '托',
              value: 'STIPULES'
            }
          ],
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
      listTypeInfo: {}
    }
  },
  created() {
    this.baseFormInfo = baseFormInfo()
    this.sendFormInfo = sendFormInfo()
    this.getFormInfo = getFormInfo()
    this.settleFormInfo = settleFormInfo()
    this.listTypeInfo = listTypeInfo()
    this.updateCustomerList()
    this.updateAddressList()
    // 获取物品信息
    this.updateGoodsList()
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
    handleEvent(event, data) {
      /* eslint-disable */
      switch (event) {
        case 'handleSelectCustomer':
          this.handleSelectCustomer(data)
          break
        case 'handleChangeReceiverUnit':
          this.handleChangeReceiverUnit(data)
          break
        case 'handleChangeShipperUnit':
          this.handleChangeShipperUnit(data)
          break
      }
    },
    changeShowPage(e) {
      this.$store.state.ticketOrder.status = e
    },
    handleCloseDialog() {
      this.isDialog = false
      this.$refs.chooseCustomer.clearCustomForm()
    },
    handleAddCustomer() {
      this.isDialog = true
    },
    handleChangeCusType(e) {
      this.cusType = e
    },
    handleAction(data) {
      request({
        url: '/org/orgcompany/save',
        method: 'post',
        params: Object.assign(data, { cusType: this.cusType })
      }).then(() => {
        z.success('添加成功')
        this.handleCloseDialog()
        this.updateCustomerList()
      })
    },
    updateCustomerList() {
      request({
        url: '/org/orgcompany/page',
        method: 'post',
        data: {
          isAuthen: '1',
          pageNo: 1,
          pageSize: 100
        }
      }).then(res => {
        this.listTypeInfo.customerList = res.data.list
      })
    },
    handleSelectCustomer(e) {
      this.listTypeInfo.customerList.forEach(item => {
        if (e === item.id) {
          this.baseFormInfo.data.customerName = item.name
        }
      })
    },
    handleConfirmAddCustomer() {
      const chooseCustomer = this.$refs.chooseCustomer
      if (this.cusType === 1) {
        chooseCustomer.customFormCompanyInfo.ref.validate(valid => {
          if (valid) {
            this.handleAction(chooseCustomer.customFormCompanyInfo.data)
          }
        })
      } else if (this.cusType === 2) {
        chooseCustomer.customFormPersonInfo.ref.validate(valid => {
          if (valid) {
            chooseCustomer.customFormPersonInfo.data.allName =
              chooseCustomer.customFormPersonInfo.data.name
            this.handleAction(chooseCustomer.customFormPersonInfo.data)
          }
        })
      }
    },
    // 获取发货单位和收货单位
    updateAddressList() {
      request({
        url: 'cus/consignee/page',
        method: 'post',
        params: {
          pageNo: 1,
          pageSize: 1000
        }
      }).then(res => {
        this.listTypeInfo.addressList = res.data.list
      })
    },
    handleChangeShipperUnit(data) {
      this.listTypeInfo.addressList.forEach(item => {
        if (item.consigneeId === data) {
          this.sendFormInfo.data.shipperUnit = item.consigneeUnit
          this.sendFormInfo.data.shipperPerson = item.consigneeName
          this.sendFormInfo.data.shipperTel = item.consigneeTel
          this.sendFormInfo.data.shipperAddress = item.consigneeCity
          this.sendFormInfo.data.shipperAddressCode = item.consigneeCityCode
          this.sendFormInfo.data.shipperAddressDetial = item.consigneeAddress
          this.areaForm.sendArea = item.consigneeCityCode.split(',')
        }
      })
    },
    handleChangeReceiverUnit(data) {
      this.listTypeInfo.addressList.forEach(item => {
        if (item.consigneeId === data) {
          this.getFormInfo.data.receiverUnit = item.consigneeUnit
          this.getFormInfo.data.receiverPerson = item.consigneeName
          this.getFormInfo.data.receiverTel = item.consigneeTel
          this.getFormInfo.data.receiverAddress = item.consigneeCity
          this.getFormInfo.data.receiverAddressCode = item.consigneeCityCode
          this.getFormInfo.data.receiverAddressDetial = item.consigneeAddress
          this.areaForm.getArea = item.consigneeCityCode.split(',')
        }
      })
    },
    handleAddAddress(type) {
      this.isAddAddress = true
    },
    handleChangeAddress(formName, arr, address, addressCode) {
      this[formName].data[address] = ''
      this[formName].data[addressCode] = ''
      arr.forEach(item => {
        this[formName].data[address] += CodeToText[item] + ','
        this[formName].data[addressCode] += item + ','
      })
      this[formName].data[address] = this[formName].data[address].slice(0, -1)
      this[formName].data[addressCode] = this[formName].data[addressCode].slice(
        0,
        -1
      )
    },
    handleCloseAddress() {
      this.isAddAddress = false
      this.$refs.addAddress.resetForm()
      this.updateAddressList()
    },
    updateGoodsList() {
      request({
        url: 'srv/srvgoods/page',
        method: 'post',
        params: {
          pageNo: 1,
          pageSize: 1000
        }
      }).then(res => {
        this.listTypeInfo.goodsList = res.data.list
      })
    },
    handleChooseGoods(id) {
      this.listTypeInfo.goodsList.forEach(item => {
        if (item.goodsId === id) {
          this.tableData.push({
            goodsType: item.goodsType,
            goodsName: item.goodsName,
            unit: item.unit,
            number: item.number,
            weight: item.weight,
            volume: item.volume,
            isEdit: true
          })
        }
      })
    },
    handleAddGoods() {
      this.tableData.push({
        goodsType: '',
        goodsName: '',
        unit: '',
        number: '',
        weight: '',
        volume: '',
        isEdit: true
      })
    },
    // 删除物品
    handleDelete(index) {
      this.tableData.splice(index, 1)
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!')
      }
      return isLt2M
    },
    handleUploadSuccess(res) {
      this.attachmentUrl = res.url
    },
    // 验证所有的表单，最后验证是否添加了物品信息
    handleConfirm() {
      const formList = [
        'baseFormInfo',
        'sendFormInfo',
        'getFormInfo',
        'settleFormInfo'
      ]
      let isValidate = true
      formList.forEach(item => {
        if (!isValidate) {
          return
        }
        this[item].ref.validate(validate => {
          isValidate = validate
        })
      })
      if (isValidate && this.haveGoodsInfo()) {
        const data = {
          ...this.baseFormInfo.data,
          ...this.sendFormInfo.data,
          ...this.getFormInfo.data,
          ...this.settleFormInfo.data
        }
        data.attachmentUrl = this.attachmentUrl
        data.goodsEntities = JSON.stringify(this.tableData)
        request({
          url: 'core/omssrvorder/save',
          method: 'post',
          params: data
        }).then(() => {
          this.$message.success('添加成功')
          this.changeShowPage('list')
        })
      }
    },
    // 清空所有的表单和物品信息表格
    handleReset() {
      const formList = [
        'baseFormInfo',
        'sendFormInfo',
        'getFormInfo',
        'settleFormInfo'
      ]
      formList.forEach(item => {
        this[item].ref.resetFields()
      })
      this.tableData = []
    },
    // 判断是否添加了物品，用布尔值是为了防止弹框多次
    haveGoodsInfo() {
      let isAdd = true
      if (this.tableData.length > 0) {
        this.tableData.forEach(item => {
          if (!isAdd) {
            return
          }
          for (const [key] of Object.entries(item)) {
            isAdd = true
            if (item[key] === '') {
              isAdd = false
              this.$message.error('请填写完整的物品信息')
              return
            }
          }
        })
        return isAdd
      } else {
        this.$message.error('请添加物品信息')
        return false
      }
    }
  }
}
</script>

<style lang="less">
.goods-total {
  display: inline-block;
  text-align: left;
  width: 30px;
  color: #ff0000;
}
</style>
