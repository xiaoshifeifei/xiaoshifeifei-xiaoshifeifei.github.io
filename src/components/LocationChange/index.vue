<template>
  <div class="loc_item">
    <el-cascader
      :disabled="disabled"
      :options="options1"
      @change="addressChange1"
      v-model="resultArr"
    ></el-cascader>
  </div>
</template>
<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  data() {
    return {
      options1: regionData,
      result: []
    }
  },
  computed: {
    resultArr: {
      get() {
        if (this.resultStr === '') {
          return []
        }
        const arr = this.resultStr.split('-')
        const final = []
        for (let i = 0; i < arr.length; i++) {
          final.push(TextToCode[arr[0]].code) // 省市区县回值
          final.push(TextToCode[arr[0]][arr[1]].code)
          if (arr[2]) {
            final.push(TextToCode[arr[0]][arr[1]][arr[2]].code)
          }
        }
        return final
      },
      set(val) {
        return val
      }
    }
  },
  props: {
    tableIndex: {
      type: Number
    },
    resultStr: {
      type: String,
      default: () => ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    addressChange1(arr) {
      const str = CodeToText[arr[0]] + '-' + CodeToText[arr[1]] + '-' + CodeToText[arr[2]]
      this.result = arr
      this.$emit('changeLoc', {
        result: this.result,
        idx: this.tableIndex,
        str: str
      })
    }
  }
}
</script>
<style lang="less" scoped >
.loc_item {
  width: 200px;
}
</style>
