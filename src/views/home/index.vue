<template>
  <div class="layout_main">
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in cardList" :key="index">
        <el-card style="margin-bottom: 10px">
          <el-row>
            <el-col :span="10">
              <img :src="item.imgUrl">
            </el-col>
            <el-col :span="12" style="text-align: center">
              <h2>{{ item.value }}</h2>
              <p>{{ item.name }}</p>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <h2>业务类型占比情况</h2>
          <pie
            :data="businessList"
            :height="200"
            :loading="isBusinessLoading"
            :sum="0"
            myRef="business"
            ref="pieBusiness"
          />
          <h1
            style="color: #ff0000; text-align: center; margin: 92px auto"
            v-if="this.businessList.length === 0"
          >暂无数据</h1>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <h2>各省流向占比情况</h2>
          <pie
            :data="provinceList"
            :height="200"
            :loading="isProvinceLoading"
            :sum="0"
            myRef="province"
            ref="pieProvince"
            v-show="this.provinceList.length"
          />
          <h1
            style="color: #ff0000; text-align: center; margin: 92px auto"
            v-if="this.provinceList.length === 0"
          >暂无数据</h1>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px" v-if="isPlat">
      <el-col>
        <broken-line
          :data="ticketOrderHistoryData"
          :loading="isTicketOrderHistoryLoading"
          :title="'当月委托单情况'"
          :xAxisData="ticketOrderHistoryDataXAxis"
          myRef="ticketOrderHistory"
          ref="lineTicketOrderHistory"
        />
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col>
        <broken-line
          :data="orderHistoryData"
          :loading="isOrderHistoryLoading"
          :title="'当月订单情况'"
          :xAxisData="orderHistoryDataXAxis"
          myRef="orderHistory"
          ref="lineOrderHistory"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import request from '@/utils/request'
import brokenLine from '@/components/Charts/brokenLine'
import pie from '@/components/Charts/pie'

export default {
  components: {
    brokenLine,
    pie
  },
  data() {
    return {
      isPlat: false,
      // 为了防止eslint报错，所以要加下面的注释
      /* global require */
      imgPlatList: [
        require('../../assets/img/totalOrderNum.png'),
        require('../../assets/img/todayOrderNum.png'),
        require('../../assets/img/receivedOrderNum.png'),
        require('../../assets/img/amount.png'),
        require('../../assets/img/totalOrderNum.png'),
        require('../../assets/img/todayOrderNum.png'),
        require('../../assets/img/receivedOrderNum.png'),
        require('../../assets/img/amount.png')
      ],
      imgList: [
        require('../../assets/img/totalOrderNum.png'),
        require('../../assets/img/todayOrderNum.png'),
        require('../../assets/img/receivedOrderNum.png'),
        require('../../assets/img/amount.png')
      ],
      cardList: [],
      // 图标的loading
      isBusinessLoading: true,
      isProvinceLoading: true,
      isTicketOrderHistoryLoading: true,
      isOrderHistoryLoading: true,
      // 饼图
      businessList: [
        {
          name: '',
          value: ''
        }
      ],
      provinceList: [
        {
          name: '',
          value: ''
        }
      ],
      // 折线图委托单
      ticketOrderHistoryData: [],
      ticketOrderHistoryDataXAxis: [],
      // 折线图订单
      orderHistoryData: [],
      orderHistoryDataXAxis: []
    }
  },
  created() {
    if (this.$store.state.user.user.companyType === '2') {
      this.isPlat = false
    } else {
      this.isPlat = true
    }
    this.updateStatsInfo()
    this.updateBusinessList()
    this.updateProviceList()
    if (this.isPlat) {
      this.updateTicketOrderHistoryList()
    }
    this.updateOrderHistoryList()
  },
  methods: {
    // 顶部的卡片内容
    updateStatsInfo() {
      request({
        url: 'core/omssrvorder/ordercount',
        method: 'get'
      }).then(res => {
        if (this.isPlat) {
          this.cardList = res.data
        } else {
          this.cardList = res.data.filter(item => item.type === 'TMS')
        }
        this.cardList.forEach((item, index) => {
          if (this.isPlat) {
            item.imgUrl = this.imgPlatList[index]
          } else {
            item.imgUrl = this.imgList[index]
          }
        })
      })
    },
    // 业务类型的饼图
    updateBusinessList() {
      this.$nextTick(() => {
        this.$refs.pieBusiness.init()
        request({
          url: 'core/omssrvorder/buscount',
          method: 'get'
        }).then(res => {
          this.isBusinessLoading = false
          this.businessList = res.data
          this.$refs.pieBusiness.init()
        })
      })
    },
    // 各省流向的饼图
    updateProviceList() {
      this.$nextTick(() => {
        this.$refs.pieProvince.init()
        request({
          url: 'core/omssrvorder/provinceorder',
          method: 'get'
        }).then(res => {
          this.isProvinceLoading = false
          this.provinceList = res.data
          this.$refs.pieProvince.init()
        })
      })
    },
    updateTicketOrderHistoryList() {
      this.$nextTick(() => {
        this.$refs.lineTicketOrderHistory.init()
        request({
          url: 'core/omssrvorder/tmslinechart',
          method: 'get'
        }).then(res => {
          this.isTicketOrderHistoryLoading = false
          this.ticketOrderHistoryData = res.data.map(item => item.value)
          this.ticketOrderHistoryDataXAxis = res.data.map(item => item.name)
          this.$refs.lineTicketOrderHistory.init()
        })
      })
    },
    updateOrderHistoryList() {
      this.$nextTick(() => {
        this.$refs.lineOrderHistory.init()
        request({
          url: 'core/omssrvorder/linechart',
          method: 'get'
        }).then(res => {
          this.isOrderHistoryLoading = false
          this.orderHistoryData = res.data.map(item => item.value)
          this.orderHistoryDataXAxis = res.data.map(item => item.name)
          this.$refs.lineOrderHistory.init()
        })
      })
    }
  }
}
</script>
