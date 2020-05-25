<template>
  <div :ref="myRef" :style="{height: '300px'}"></div>
</template>

<script>
// eslint-disable-next-line
const echarts = require('echarts')
export default {
  name: 'brokenLine',
  props: {
    myRef: {
      type: String,
      require: true
    },
    title: {
      type: String,
      default: ''
    },
    xAxisData: {
      data: {
        type: Array,
        require: () => []
      }
    },
    data: {
      type: Array,
      // eslint-disable-next-line
      require: () => []
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    loading: {
      handler(val) {
        if (!val) {
          this.init()
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      const myChart = echarts.init(this.$refs[this.myRef])
      if (this.loading) {
        myChart.showLoading()
        return
      }
      myChart.hideLoading()
      myChart.setOption({
        color: ['#2db7f5'],
        title: {
          text: this.title,
          textStyle: {
            fontSize: '14'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: this.xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '订单数量',
            type: 'line',
            stack: '总量',
            data: this.data
          }
        ]
      })
    }
  }
}
</script>
