<template>
  <div>
    <el-card>
      <div slot="header">
        <span>{{ info.currentOrderId ? '运单详情' : '添加运单' }}</span>
        <div style="float: right; margin-top: -5px">
          <template v-if="info.currentOrderId && info.orderStatus == false">
            <el-button @click="handleConfirm('/srv/omssrvcomorder/modify', 'put')" type="primary">修改</el-button>
            <el-button @click="handleReset">重置</el-button>
          </template>
          <template v-if="!info.currentOrderId">
            <el-button @click="handleConfirm('/srv/omssrvcomorder/save', 'post')" type="primary">确定</el-button>
            <el-button @click="handleReset">重置</el-button>
          </template>
          <el-button @click="goBack" type="primary">返回</el-button>
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
          :rules="baseFormInfo.rules"
          @handleEvent="handleEvent"
          ref="baseForm"
        ></custom-form>
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
              <span>{{ scope.row.goodsType | formatGoodsType }}</span>
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
          <el-table-column align="center" fixed="right" label="操作" slot="append">
            <template slot-scope="scope">
              <el-button @click="handleDelete(scope.$index, tableData)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </custom-table>
      </el-card>
      <!-- 配载信息 -->
      <el-card style="margin-bottom: 10px">
        <div slot="header">
          <span>配载信息</span>
        </div>
        <custom-form
          :data="stowageFormInfo.data"
          :field-list="stowageFormInfo.fieldList"
          :label-width="stowageFormInfo.labelWidth"
          :labelPosition="stowageFormInfo.labelPosition"
          :list-type-info="listTypeInfo"
          :ref-obj.sync="stowageFormInfo.ref"
          :rules="stowageFormInfo.rules"
          ref="stowageForm"
        >
          <span class="plate-no" slot="form-plate">{{ stowageFormInfo.data.vehicleNumber }}</span>
        </custom-form>
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
          @handleEvent="handleEvent"
          ref="settleForm"
        />
      </el-card>
    </el-card>
    <!-- 添加客户或者修改客户 -->
    <el-dialog
      :visible.sync="isCustomerDialog"
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
  stowageFormInfo,
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
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          currentOrderId: '',
          orderStatus: true
        }
      }
    }
  },
  data() {
    return {
      goodsName: '',
      selection: [],
      baseFormInfo: {},
      sendFormInfo: {},
      getFormInfo: {},
      settleFormInfo: {},
      stowageFormInfo: {},

      isCustomerDialog: false,
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
      listTypeInfo: {}
    }
  },
  created() {
    this.baseFormInfo = baseFormInfo()
    this.sendFormInfo = sendFormInfo()
    this.getFormInfo = getFormInfo()
    this.settleFormInfo = settleFormInfo()
    this.stowageFormInfo = stowageFormInfo()
    this.listTypeInfo = listTypeInfo()

    this.updateCustomerList()
    this.updateAddressList()
    // 获取物品信息
    this.updateGoodsList()
    // 获取承运商列表
    this.updateCarrierList()
    if (this.info.currentOrderId) {
      this.updateInfo(this.info.currentOrderId)
    }
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
        case 'hanldeChangeCarrier':
          this.hanldeChangeCarrier(data)
          break
        case 'handleChangeDifferentceRate':
          this.handleChangeDifferentceRate(data)
          break
        case 'handleChangeProfitRate':
          this.handleChangeProfitRate(data)
          break
      }
    },
    // 获取具体的某一个记录信息
    updateInfo(orderId) {
      request({
        url: 'srv/omssrvcomorder/info',
        method: 'get',
        params: { orderId }
      }).then(res => {
        this.baseFormInfo.data = res.data
        this.sendFormInfo.data = res.data
        this.getFormInfo.data = res.data
        this.stowageFormInfo.data = res.data
        this.settleFormInfo.data = res.data
        this.tableData = res.data.goodsList
        // 转换地址编码
        this.areaForm.sendArea = res.data.shipperAddressCode.split(',')
        this.areaForm.getArea = res.data.receiverAddressCode.split(',')
      })
    },
    goBack() {
      this.$emit('goBack')
    },
    handleCloseDialog() {
      this.isCustomerDialog = false
      this.$refs.chooseCustomer.clearCustomForm()
    },
    handleAddCustomer() {
      this.isCustomerDialog = true
    },
    handleChangeCusType(e) {
      this.cusType = e
    },
    handleAction(data) {
      request({
        url: '/base/omsbasecus/save',
        method: 'post',
        params: Object.assign(data, { cusType: this.cusType })
      }).then(() => {
        z.success('添加成功')
        this.handleCloseDialog()
        this.updateCustomerList()
      })
    },
    // 获取客户列表
    updateCustomerList() {
      request({
        url: '/org/orgcompany/page',
        method: 'post',
        params: {
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
          this.baseFormInfo.data.customerName = item.allName
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
      this.addrType = type
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
    // 获取承运商列表
    updateCarrierList() {
      request({
        url: '/org/orgcompany/page',
        method: 'post',
        params: {
          pageNo: '1',
          pageSize: '1000'
        }
      }).then(res => {
        this.listTypeInfo.carrierList = res.data.list
      })
    },
    // 选择承运商
    hanldeChangeCarrier(data) {
      this.listTypeInfo.carrierList.forEach(item => {
        if (item.name === data) {
          this.settleFormInfo.data.carrierCompanyId = item.id
        }
      })
    },
    // 验证所有的表单，最后验证是否添加了物品信息
    handleConfirm(url, method) {
      const formList = [
        'baseFormInfo',
        'sendFormInfo',
        'getFormInfo',
        'settleFormInfo',
        'stowageFormInfo'
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
          ...this.settleFormInfo.data,
          ...this.stowageFormInfo.data
        }
        data.goodsEntities = JSON.stringify(this.tableData)
        delete data.goodsList

        request({
          url,
          method,
          params: data
        }).then(() => {
          this.$message.success('操作成功')
          this.$emit('goBack')
        })
      }
    },
    // 清空所有的表单和物品信息表格
    handleReset() {
      const formList = [
        'baseFormInfo',
        'sendFormInfo',
        'getFormInfo',
        'settleFormInfo',
        'stowageFormInfo'
      ]
      formList.forEach(item => {
        this[item].ref.resetFields()
      })
      this.areaForm.sendArea = ''
      this.areaForm.getArea = ''
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
    },
    handleChangeDifferentceRate() {
      const data = this.settleFormInfo.data
      this.handleChangeProfitRate()
      if (
        data.freightRevenue === 0 ||
        !data.freightRevenue ||
        !data.driverPrice
      ) {
        return
      }
      data.differentceRate =
        (
          (data.freightRevenue - data.driverPrice) /
          data.freightRevenue
        ).toFixed(2) *
          100 +
        '%'
    },
    handleChangeProfitRate() {
      const data = this.settleFormInfo.data
      if (
        data.freightRevenue === 0 ||
        !data.freightRevenue ||
        !data.freightCost
      ) {
        return
      }
      data.profitRate =
        (
          ((data.freightRevenue - data.freightCost) / data.freightRevenue) *
          100
        ).toFixed(2) + '%'
    }
  }
}
</script>

<style scoped>
.plate-no {
  display: inline-block;
  width: 160px;
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
}
.goods-total {
  display: inline-block;
  text-align: left;
  width: 30px;
  color: #ff0000;
}
</style>
