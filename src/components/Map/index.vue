<template>
    <div id="near">
      <div id="amap-main" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"></div>
    </div>
</template>

<script>
import request from "@/utils/request";
import * as t from "@/utils/index.js";
import * as z from "@/utils/com.js";

export default {
  name: 'Map',
  props: {
    index:{
      type: Boolean,
      default () {
        return false;
      }
    },
    flag:{
      type: Boolean,
      default () {
        return false;
      }
    },
    vehicleNumber:{
      type: String,
      default () {
        return "";
      }
    },
    beginTime:{
      type: String,
      default () {
        return "";
      }
    },
    endTime:{
      type: String,
      default () {
        return "";
      }
    }
  },
  data () {
    return {
      map: "",
      marker: "",
      lineArr: [],
      beginTimeNow: "",
      endTimeNow: "",
      lineArr1: [],
      loading: true
    }
  },
  watch:{
    index(val){
      this.loading = true;
      if(val){
        if(this.flag){
          this.fnLocation();
        }else{
          this.fnLine();
        }
      }else{
        this.loading = false;
        this.marker = "";
        this.map = "";
        this.lineArr1 = new Array();
        this.lineArr = new Array();
        this.beginTimeNow = "";
      }
    },
    beginTimeNow(val){
      if(this.endTime != ""){
        var endTimeStamp = new Date(this.endTime).getTime();
        var beginTimeNowStamp = new Date(val).getTime();
        if(endTimeStamp < beginTimeNowStamp){
          this.loading = false;
          this.setLine();
        }else{
          this.fnLineArr(val,this.endTimeNow,this.vehicleNumber);
        }
      }
    }
  },
  methods: {
    fnLocation(){
      let carNum = this.vehicleNumber;
      if(carNum != ""){
        request({
          url: "/srv/srvtrack/queryBusLastAddr",
          method: "post",
          params: {
            busNum : carNum
          }
        })
        .then(res => {
          let Lat = res.data.bdata.Lat;
          let Lon = res.data.bdata.Lon;
          this.initMap(Lat,Lon);
        })
        .catch(res => {
        });
      }
    },
    initMap(Lat,Lon){
      this.loading = false;
      if(Lat == ""){
        Lat = 39.90923;
      }
      if(Lon == ""){
        Lat = 116.397428;
      }
      this.map = new AMap.Map('amap-main', {
        center: [Lon, Lat],
        resizeEnable: true,
        zoom: 15
      })

      this.marker = new AMap.Marker({
        position: this.map.getCenter(),
        icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
        offset: new AMap.Pixel(-13, -30)
      });

      this.marker.setMap(this.map);

      this.marker.setLabel({
        offset: new AMap.Pixel(20, 20),  //设置文本标注偏移量
        content: "<div class='info'>当前货车位置</div>", //设置文本标注内容
        direction: 'right' //设置文本标注方位
      })
    },
    fnLine(){
      var beginTime = this.beginTime;
      var endTime = this.endTime;
      var vehicleNumber = this.vehicleNumber;
      endTime = this.setTime(beginTime);
      this.fnLineArr(beginTime,endTime,vehicleNumber);
    },
    setTime(time){
      var beginTimeStamp = new Date(time).getTime();
      //1小时为一个时间间隔
      var endTimeStame = beginTimeStamp + 3600000;
      var endTime = t.parseTime(endTimeStame);
      return endTime;
    },
    fnLineArr(beginTime,endTime,vehicleNumber){
      request({
        url: "/srv/srvtrack/queryBusTrack",
        method: "post",
        params: {
          beginTime: beginTime,
          endTime: endTime,
          busNum: vehicleNumber
        }
      })
      .then(res => {
        for(let i in res.data.bdata){
          var arr = [];
          arr.push(res.data.bdata[i].Lon,res.data.bdata[i].Lat);
          this.lineArr.push(arr);
        }
        var length = res.data.bdata.length;

        if(this.lineArr1.length == 0){
          this.lineArr1 = this.lineArr[0];
          if(length == 0){
            this.initMapNew();
            this.loading = false;
          }else{
            this.init();
            this.beginTimeNow = endTime.toLocaleString();
            this.endTimeNow = this.setTime(endTime);
          }  
        }else{
          this.beginTimeNow = endTime.toLocaleString();
          this.endTimeNow = this.setTime(endTime);
        }
      })
      .catch(res => {
        this.loading = false;
        z.error("查询出错了");
      });
    },
    initMapNew(){
      this.map = new AMap.Map('amap-main', {
        //center: [116.397428, 39.90923],
        resizeEnable: true,
        zoom: 10
      })
    },
    init(){
      this.map = new AMap.Map('amap-main', {
        center: this.lineArr1,
        resizeEnable: true,
        zoom: 12
      })
      this.marker = new AMap.Marker({
        map: this.map,
        position: this.lineArr1,
        icon: "https://webapi.amap.com/images/car.png",
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle:-90,
      });
    },
    setLine(){
      // 绘制轨迹
      let polyline = new AMap.Polyline({
        map: this.map,
        path: this.lineArr,
        showDir:true,
        strokeColor: "#28F",  //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6,      //线宽
        // strokeStyle: "solid"  //线样式
      });
      let passedPolyline = new AMap.Polyline({
        map: this.map,
        // path: lineArr,
        strokeColor: "#AF5",  //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6,      //线宽
        // strokeStyle: "solid"  //线样式
      });
      this.marker.on('moving', function (e) {
        passedPolyline.setPath(e.passedPath);
      });
      this.map.setFitView();
      this.startAnimation();
    },
    startAnimation(){
      let speed = 0;
      if(this.lineArr.length > 500){
        speed = 5000;
      }else if(this.lineArr.length <= 100){
        speed = 50;
      }else{
        speed = 200;
      }
      this.marker.moveAlong(this.lineArr, speed);
    }
  },
  mounted() {
  }
}
</script>
<style scoped>
#amap-main{
  width:100%;
  height:560px;
}
</style>

