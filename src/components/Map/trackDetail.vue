<template>
  <div>
    <div id="allmap"></div>
  </div>
</template>

<script>
import request from '@/utils/request'
import BMap from 'BMap'
import BMapLib from 'BMapLib'

export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          busNum: '',
          beginTime: '',
          endTime: ''
        }
      }
    }
  },
  data() {
    return {
      pointArr: []
    }
  },
  mounted() {
    this.updateInfo()
  },
  methods: {
    updateInfo() {
      this.info.busNum = this.info.vehicleNumber
      delete this.info.sendvehicleId
      delete this.info.sendvehicleNo
      delete this.info.orderNo
      delete this.info.vehicleNumber
      request({
        url: '/srv/srvtrack/queryBusTrack',
        method: 'post',
        params: this.info
      }).then(res => {
        this.pointArr = res.data
        this.initMap()
      })
    },
    initMap() {
      const map = new BMap.Map('allmap')
      map.disableScrollWheelZoom()
      const arrPois = this.pointArr.map(item => {
        return new BMap.Point(item.lng, item.lat)
      })
      map.addOverlay(new BMap.Polyline(arrPois, { strokeColor: '#000' }))
      map.setViewport(arrPois)

      const lushu = new BMapLib.LuShu(map, arrPois, {
        defaultContent: '',
        autoView: true,
        icon: new BMap.Icon(
          'https://webapi.amap.com/images/car.png',
          new BMap.Size(52, 26),
          { anchor: new BMap.Size(27, 13) }
        ),
        speed: 4500,
        landmarkPois: []
      })
      lushu.start()
    }
  }
}
</script>

<style scoped>
#allmap {
  width: 100%;
  height: 500px;
  overflow: hidden;
  margin: 0;
  font-family: '微软雅黑';
}
</style>
