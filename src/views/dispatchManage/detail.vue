<template>
  <el-card>
    <div slot="header">
      <span>详情</span>
      <el-button
        @click="goBack"
        size="medium"
        style="margin-left:20px;float:right;padding:3px 0;"
        type="text"
      >返回</el-button>
      <el-button
        v-if="info.type === 'edit'"
        @click="handleSave"
        size="medium"
        style="margin-right:10px;float:right;padding:3px 0;"
        type="text"
      >保存</el-button>
    </div>
    <custom-form
      :data="sendvehicleOrderForm.data"
      :field-list="sendvehicleOrderForm.fieldList"
      :haveBorder="false"
      :label-width="sendvehicleOrderForm.labelWidth"
      :listTypeInfo="listTypeInfo"
      :ref-obj.sync="sendvehicleOrderForm.ref"
      :rules="sendvehicleOrderForm.rules"
      @handleEvent="handleEvent"
      ref="sendvehicleOrderForm"
    />
    <custom-table
      :columns="goodsTableDataColumns"
      :data="goodsTableData"
      :hasPage="false"
      :height="250"
      style="margin-bottom: 10px"
    >
      <template slot="goodsType" slot-scope="scope">
        <span>{{ scope.row.goodsType | formatGoodsType }}</span>
      </template>
      <template slot="unit" slot-scope="scope">
        <span v-if="scope.row.unit == 'THING'">件</span>
        <span v-if="scope.row.unit == 'PACKAGE'">包</span>
        <span v-if="scope.row.unit == 'BOX'">箱</span>
        <span v-if="scope.row.unit == 'STIPULES'">托</span>
      </template>
    </custom-table>
  </el-card>
</template>

<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import { sendvehicleOrderForm, listTypeInfo } from './data.js'

export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          sendvehicleId: '',
          companyId: '',
          type: 'info'
        }
      }
    }
  },
  data() {
    return {
      sendvehicleOrderForm: {},
      goodsTableData: [],
      goodsTableDataColumns: [
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
          align: 'center',
          slotName: 'unit'
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
    this.sendvehicleOrderForm = sendvehicleOrderForm()
    this.listTypeInfo = listTypeInfo()
    this.updateInfo(this.info.sendvehicleId)
    this.goodsData(this.info.sendvehicleId)
    this.updateCarList(this.info.companyId)
    if (this.info.type === 'info') {
      this.setFormDisabled()
    }
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    handleEvent(event, data) {
      /* eslint-disable */
      switch (event) {
        case 'handleSelectDriverType':
          this.handleSelectDriverType(data)
          break
        case 'handleSelectDriver':
          this.handleSelectDriver(data)
          break
        case 'handleSelectCar':
          this.handleSelectCar(data)
          break
      }
    },
    updateInfo(sendvehicleId) {
      request({
        url: '/srv/srvwaybillsend/info',
        method: 'get',
        params: { sendvehicleId }
      }).then(res => {
        this.sendvehicleOrderForm.data = res.data
        if (this.sendvehicleOrderForm.data.inOut === 'IN') {
          this.sendvehicleOrderForm.data.driverTypeUrl = '/carrier/carrierdriver/page'
        } else {
          this.sendvehicleOrderForm.data.driverTypeUrl = '/carrier/carrierdriver/pages'
        }
        delete this.sendvehicleOrderForm.data.goodsList
        delete this.sendvehicleOrderForm.data.acceptTime
        delete this.sendvehicleOrderForm.data.signTime
        delete this.sendvehicleOrderForm.data.actionTime
        this.updateDriverList()
      })
    },
    goodsData(sendvehicleId) {
      request({
        url: '/srv/srvgoods/findlist',
        method: 'post',
        params: { WaybillSendId: sendvehicleId }
      }).then(res => {
        this.goodsTableData = res.data
      })
    },
    updateCarList(companyId) {
      request({
        url: '/carrier/carriercar/page',
        method: 'post',
        params: {
          companyId,
          pageNo: 1,
          pageSize: 10000
        }
      }).then(res => {
        this.listTypeInfo.carList = res.data.list
      })
    },
    handleSave() {
      this.sendvehicleOrderForm.ref.validate(valid => {
        if (valid) {
          request({
            url: '/srv/srvwaybillsend/modify',
            method: 'post',
            params: this.sendvehicleOrderForm.data
          }).then(() => {
            z.success('修改成功')
            this.goBack()
          })
        }
      })
    },
    handleSelectDriverType() {
      this.sendvehicleOrderForm.data.driverId = ''
      this.sendvehicleOrderForm.data.driverName = ''
      this.sendvehicleOrderForm.data.driverTel = '',
      this.sendvehicleOrderForm.data.copilotId = ''
      this.updateDriverList()
    },
    updateDriverList() {
      request({
        url: this.sendvehicleOrderForm.data.driverTypeUrl,
        method: 'post',
        params: {
          pageNo: 1,
          pageSize: 10000
        }
      }).then(res => {
        this.listTypeInfo.driverList = res.data.list
      })
    },
    handleSelectDriver(val) {
      let obj = {}
      obj = this.listTypeInfo.driverList.find(item => {
        return item.id === val
      })
      this.sendvehicleOrderForm.data.driverName = obj.username
      this.sendvehicleOrderForm.data.driverTel = obj.phone
    },
    handleSelectCar(val) {
      let obj = {}
      obj = this.listTypeInfo.carList.find(item => {
        return item.id === val
      })
      this.sendvehicleOrderForm.data.vehicleNumber = obj.vehicleNo
      this.sendvehicleOrderForm.data.vehicleNumberType = obj.vehicleNoType
      this.sendvehicleOrderForm.data.roadTransportCertificate = obj.roadTransportCertificate
      this.sendvehicleOrderForm.data.vehicleTonnage = obj.ratedTonnage
    },
    setFormDisabled() {
      this.sendvehicleOrderForm.fieldList.forEach(item => {
        item.disabled = true
      })
    }
  }
}
</script>
