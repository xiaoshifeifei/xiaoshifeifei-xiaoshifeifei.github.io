<template>
  <!-- 服务跟踪 -->
  <el-card>
    <div slot="header">
      <div style="float:left;">
        <el-form :inline="true" :model="ruleForm" :rules="rules" label-width="120px" ref="ruleForm">
          <el-form-item label="派车单号" prop="sendvehicleNo" style="margin:0px">
            <el-input readonly style="width:200px;" v-model="ruleForm.sendvehicleNo"></el-input>
          </el-form-item>
          <el-form-item label="订单号" prop="orderNo" style="margin:0px">
            <el-input readonly style="width:200px;" v-model="ruleForm.orderNo"></el-input>
          </el-form-item>
          <el-form-item label="车牌号" prop="vehicleNumber" style="margin:0px">
            <el-input readonly style="width:200px;" v-model="ruleForm.vehicleNumber"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div style="height:32px;">
        <el-button
          @click="goBack"
          size="medium"
          style="margin-left:20px;float:right;padding:3px 0;line-height:32px;"
          type="text"
        >返 回</el-button>
        <el-button
          @click="updateList(info.sendvehicleId)"
          size="medium"
          style="margin-right:10px;float:right;padding:3px 0;line-height:32px;"
          type="text"
        >刷 新</el-button>
      </div>
    </div>
    <el-row>
      <el-col :span="18">
        <div style="width:100%;">
          <track-detail :info="info"/>
        </div>
      </el-col>
      <el-col :span="6" style="overflow-y:scroll;height:560px;">
        <div style="margin-top: 10px">
          <el-timeline :reverse="true">
            <el-timeline-item
              :key="index"
              :type="item.type"
              hide-timestamp
              v-for="(item, index) in tradeData"
            >
              <div>
                <span>{{ item.status | formatCompanyOrderStatus }}</span>
              </div>
              <div style="margin-top:5px">操作人:{{item.createName}}</div>
              <br>
              <div class="timeStamp">
                <div>{{item.data}}</div>
                <div>{{item.time}}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import trackDetail from '@/components/Map/trackDetail'
import { listTypeInfo } from './data.js'

export default {
  components: {
    trackDetail
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          sendvehicleId: '',
          sendvehicleNo: '',
          vehicleNumber: '',
          orderNo: '',
          beginTime: '',
          endTime: ''
        }
      }
    }
  },
  filters: {
    formatCompanyOrderStatus(value) {
      let result = ''
      const list = listTypeInfo()
      list.statusList.forEach(item => {
        if (value === item.value) {
          result = item.label
        }
      })
      return result
    }
  },
  data() {
    return {
      tradeData: [],

      ruleForm: {
        sendvehicleNo: '',
        orderNo: '',
        vehicleNumber: '',
        sendvehicleId: ''
      },
      rules: {
        carId: [
          {
            required: true,
            message: '请选择车辆',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  created() {
    this.updateList(this.info.sendvehicleId)
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    updateList(sendvehicleId) {
      request({
        url: '/srv/srvtrack/findlist',
        method: 'post',
        params: {
          sendvehicleId
        }
      }).then(res => {
        if (res.data.length === 1) {
          const state = res.data[0].status
          if (state !== 'NEW') {
            this.beginTime = this.info.beginTime
            this.endTime = this.info.endTime
          }
        } else {
          if (res.data.length !== 0) {
            this.beginTime = this.info.beginTime
            this.endTime = this.info.endTime
          } else {
            z.warning('该派车单暂无服务')
            return
          }
        }

        this.ruleForm = this.info

        this.vehicleNumber = this.info.vehicleNumber
        const arr = res.data
        for (const i in arr) {
          arr[i].time = z.formatDate(arr[i].createTime, 'hh:mm')
          arr[i].data = z.formatDate(arr[i].createTime, 'yyyy-MM-dd ')
          if (arr[i].createName === '' || arr[i].createName === null || arr[i].createName === 'null') {
            arr[i].createName = '未知'
          }
          if (i === 0 || i === arr.length - 1) {
            arr[i].type = 'primary'
          }
        }
        this.tradeData = arr
      })
    }
  }
}
</script>
