<template>
  <div>
    <div :ref="myRef" :style="{width: '100%', height: `${height}px`, marginLeft: `0px`}"></div>
  </div>
</template>

<script>
/* global require */
const echarts = require('echarts')
export default {
  name: 'pie',
  props: {
    data: {
      type: Array,
      require: true,
      default: () => []
    },
    myRef: {
      type: String,
      require: true
    },
    height: {
      type: [Number, String],
      require: true
    },
    sum: {
      type: Number,
      default: 0
    },
    colorList: {
      type: Array,
      default: () => [
        '#6C76F9',
        '#FF9AAA',
        '#a1a130',
        '#d7b7ff',
        '#f97f54',
        '#cde40d',
        '#0de48b',
        '#0de4e4',
        '#333333',
        '#363e4f'
      ]
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
  methods: {
    init() {
      const myChart = echarts.init(this.$refs[this.myRef])
      if (this.loading) {
        myChart.showLoading()
        return
      }
      myChart.hideLoading()
      myChart.setOption({
        tooltip: {
          trigger: 'item'
        },
        color: this.colorList,
        legend: {
          type: 'scroll',
          orient: 'vertical',
          left: '50%',
          data: this.getData(this.data)
        },
        series: [
          {
            type: 'pie',
            radius: ['60%', '80%'],
            center: ['25%', '50%'],
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: '{b}\n{c}',
                align: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold',
                  lineHeight: 34
                }
              }
            },
            data: this.data
          }
        ]
      })
    },
    getData(data) {
      data.map(item => {
        return item.name
      })
    }
  }
}
</script>

<style>
.sum {
  position: absolute;
  width: 100px;
  text-align: center;
  top: 120px;
  left: 70px;
}
</style>
