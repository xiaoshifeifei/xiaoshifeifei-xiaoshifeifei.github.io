<template>
  <div>
    <!-- 派车 -->
    <el-card>
      <div slot="header">
        <span>派车</span>
        <el-button
          @click="changeShowPage('list')"
          size="medium"
          style="margin-left:20px;float:right;padding:3px 0;"
          type="text"
        >返回</el-button>
        <el-button
          @click="handleClickSendCar"
          size="medium"
          style="margin-right:10px;float:right;padding:3px 0;"
          type="text"
        >派车</el-button>
      </div>
      <custom-form
        :data="sendCarFormInfo.data"
        :field-list="sendCarFormInfo.fieldList"
        :haveBorder="false"
        :label-width="sendCarFormInfo.labelWidth"
        :labelPosition="sendCarFormInfo.labelPosition"
        :list-type-info="listTypeInfo"
        :ref-obj.sync="sendCarFormInfo.ref"
        :rules="sendCarFormInfo.rules"
        @handleEvent="handleEvent"
        ref="sendCarForm"
      >
        <div slot="form-vehicleNumberType">
          <el-input
            placeholder="请输入车牌类型"
            readonly
            style="width: 160px"
            v-if="sendCarFormInfo.data.vehicleNumberType === 'YELLOW_BLACK'"
            value="黄底黑字"
          ></el-input>
          <el-input
            placeholder="请输入车牌类型"
            readonly
            style="width: 160px"
            v-else-if="sendCarFormInfo.data.vehicleNumberType === 'BLUE_WHITE'"
            value="蓝底白字"
          ></el-input>
          <el-input
            placeholder="请输入车牌类型"
            readonly
            style="width: 160px"
            v-else-if="sendCarFormInfo.data.vehicleNumberType === 'GREEN_BLACK'"
            value="绿底黑字"
          ></el-input>
          <el-input placeholder="请输入车牌类型" readonly style="width: 160px" v-else value></el-input>
        </div>
      </custom-form>
      <custom-table
        :columns="goodsTableDataColumns"
        :columnsTypeArray="[{ label: '', type: 'selection' }]"
        :data="goodsTableData"
        :hasPage="false"
        @selection-change="handleSelectGoods"
        height="200"
        ref="goodsTable"
        style="margin-bottom: 10px"
      >
        <template slot="goodsType" slot-scope="scope">
          <span>{{ scope.row.goodsType | formatGoodsType }}</span>
        </template>
        <template slot="unit" slot-scope="scope">
          <span>{{ scope.row.unit | formatGoodsUnitType }}</span>
        </template>
        <template slot="sendNumber" slot-scope="scope">
          <span v-if="scope.row.resudusNumber === 0">余量不足，无法派发</span>
          <el-input-number
            :max="scope.row.resudusNumber"
            :min="1"
            @change="handleChangeGoodsNum(scope.row)"
            v-else
            v-model="scope.row.sendNumber"
          />
        </template>
      </custom-table>
    </el-card>
    <el-card style="margin-top: 10px">
      <div slot="header">
        <span>已派车订单</span>
      </div>
      <custom-table
        :columns="sendCarTableDataColumns"
        :data="sendCarTableData"
        :page-size="sendvehicleParams.pageSize"
        :total="sendvehicleParams.total"
        @change-current-page="handleCurrentChange"
        @change-size="handleSizeChange"
        height="200"
      >
        <el-table-column align="center" fixed="right" label="操作" slot="append">
          <template slot-scope="scope">
            <el-button @click="handleClickInfo(scope.row.sendvehicleId)" type="primary">详情</el-button>
          </template>
        </el-table-column>
      </custom-table>
      <el-dialog :visible.sync="isSendvehicleOrderInfo">
        <custom-table
          :columns="sendvehicleOrderGoodsDataColumns"
          :data="sendvehicleOrderInfo.goodsList"
          :hasPage="false"
          height="200"
        >
          <template slot="goodsType" slot-scope="scope">
            <span>{{ scope.row.goodsType | formatGoodsType }}</span>
          </template>
          <template slot="unit" slot-scope="scope">
            <span>{{ scope.row.unit | formatGoodsUnitType }}</span>
          </template>
        </custom-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import { sendCarFormInfo } from './data.js'

export default {
  data() {
    return {
      currentTableIndex: 0,
      info: {},
      sendCarFormInfo: {},
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
          prop: 'sendNumber',
          label: '派发数量',
          slotName: 'sendNumber',
          align: 'center'
        },
        {
          prop: 'resudusNumber',
          label: '剩余数量',
          align: 'center'
        },
        {
          prop: 'resudusWeight',
          label: '重量(吨)',
          type: 'number',
          align: 'center'
        },
        {
          prop: 'resudusVolume',
          label: '体积',
          type: 'number',
          align: 'center'
        }
      ],
      // 派车单表格
      sendvehicleParams: {
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
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
      isSendvehicleOrderInfo: false,
      // 派车单详情
      sendvehicleOrderInfo: {},
      sendvehicleOrderGoodsDataColumns: [
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
          label: '派发数量',
          align: 'center'
        },
        {
          prop: 'weight',
          label: '派发重量',
          align: 'center'
        },
        {
          prop: 'volume',
          label: '派发体积',
          align: 'center'
        }
      ],
      goodsEntities: [],
      listTypeInfo: {
        driverTypeList: [
          {
            label: '编外司机',
            value: 'OUT'
          },
          {
            label: '内部人员',
            value: 'IN'
          }
        ],
        cars: [],
        drivers: []
      }
    }
  },
  created() {
    this.info = this.$store.state.companyOrder.info
    this.sendCarFormInfo = sendCarFormInfo()
    this.sendCarFormInfo.data.companyId = this.info.companyId
    this.sendCarFormInfo.data.companyName = this.info.companyName
    this.sendCarFormInfo.data.orderNo = this.info.orderNo
    this.sendCarFormInfo.data.orderId = this.info.orderId

    this.updateCarsList(this.sendCarFormInfo.data.companyId)
    this.updateDriverList()
    this.updateGoodsData()
    this.updateSendOrderList()
  },
  methods: {
    changeShowPage(e) {
      this.$store.state.companyOrder.status = e
    },
    handleEvent(event, data) {
      /* eslint-disable */
      switch (event) {
        case 'handleChangeVehicleId':
          this.handleChangeVehicleId(data)
          break
        case 'updateDriverList':
          this.driverType = data
          this.updateDriverList(data)
          break
        case 'handleChangeMainDriver':
          this.handleChangeMainDriver(data)
          break
      }
    },
    // 获取此单已经派车的派车单列表
    updateSendOrderList() {
      this.sendvehicleParams.orderId = this.info.orderId
      request({
        url: '/order/srvwaybillsend/findDispatchCarsList',
        method: 'post',
        params: this.sendvehicleParams
      }).then(res => {
        this.sendCarTableData = res.data.list
        this.sendvehicleParams.total = res.data.totalCount
      })
    },
    handleClickSendCar() {
      if (this.goodsEntities.length === 0) {
        z.error('至少选择一条货物并且派发数量充足')
        return
      }
      this.sendCarFormInfo.ref.validate(valid => {
        if (valid) {
          let params = {
            ...this.sendCarFormInfo.data,
            goodsEntities: JSON.stringify(this.goodsEntities)
          }
          request({
            url: '/srv/srvwaybillsend/save',
            method: 'post',
            params: params
          }).then(res => {
            z.success('派车成功')
            this.sendCarFormInfo.ref.resetFields()
            this.updateCarsList(this.sendCarFormInfo.data.companyId)
            this.updateGoodsData()
            this.updateSendOrderList()
            this.updateDriverList()
          })
        }
      })
    },
    handleChangeVehicleId(val) {
      let obj = this.listTypeInfo.cars.find(item => {
        return item.id === val
      })
      this.sendCarFormInfo.data.vehicleNumber = obj.vehicleNo
      this.sendCarFormInfo.data.vehicleNumberType = obj.vehicleNoType
      this.sendCarFormInfo.data.roadTransportCertificate = obj.roadTransportCertificate
      this.sendCarFormInfo.data.vehicleTonnage = obj.ratedTonnage
    },
    // 获取车辆列表
    updateCarsList() {
      request({
        url: '/basic/orgcar/page',
        method: 'post',
        params: {
          pageNo: 1,
          pageSize: 10000,
          status: 0,
          dispatchStatus: 1,
          type: this.carType
        }
      }).then(res => {
        this.listTypeInfo.cars = res.data.list
      })
    },
    // 更改司机类型时获取司机列表
    updateDriverList() {
      this.sendCarFormInfo.data.driverId = ''
      this.sendCarFormInfo.data.driverName = ''
      this.sendCarFormInfo.data.driverTel = ''
      this.sendCarFormInfo.data.copilotId = ''
      request({
        url: 'basic/orgdriver/page',
        method: 'post',
        params: {
          pageNo: 1,
          pageSize: 10000,
          inOut: this.driverType,
          status: 0,
          dispatchStatus: 1
        }
      }).then(res => {
        this.listTypeInfo.drivers = res.data.list
      })
    },
    // 选择主驾驶
    handleChangeMainDriver(val) {
      let obj = {}
      obj = this.listTypeInfo.drivers.find(item => {
        return item.id === val
      })
      this.sendCarFormInfo.data.driverName = obj.username
      this.sendCarFormInfo.data.driverTel = obj.phone
    },
    // 获取物品信息
    updateGoodsData() {
      request({
        url: '/order/srvordergoods/findGoodsByOrderId',
        method: 'get',
        params: {
          orderId: this.sendCarFormInfo.data.orderId
        }
      }).then(res => {
        this.goodsTableData = res.data
      })
    },
    // 选择物品
    handleSelectGoods(val) {
      this.goodsEntities = val
        .filter(item => {
          return item.resudusNumber !== 0
        })
        .map(item => {
          return {
            goodsType: item.goodsType,
            goodsName: item.goodsName,
            unit: item.unit,
            goodsId: item.goodsId,
            sendNumber: item.sendNumber,
            sendVolume: ((item.volume / item.number) * item.sendNumber).toFixed(2),
            sendWeight: ((item.weight / item.number) * item.sendNumber).toFixed(2)
          }
        })
    },
     // 增加或者减少物品数量
    handleChangeGoodsNum(row) {
      this.$refs.goodsTable.$refs.customTable.toggleRowSelection(row)
    },
    handleClickInfo(sendvehicleId) {
      request({
        url: '/srv/srvwaybillsend/info',
        method: 'get',
        params: { sendvehicleId }
      }).then(res => {
        this.isSendvehicleOrderInfo = true
        this.sendvehicleOrderInfo = res.data
      })
    },
    handleCurrentChange(val) {
      this.sendvehicleParams.pageNo = val
      this.updateSendOrderList()
    },
    handleSizeChange(val) {
      this.sendvehicleParams.pageNo = 1
      this.sendvehicleParams.pageSize = val
      this.updateSendOrderList()
    }
  }
}
</script>
