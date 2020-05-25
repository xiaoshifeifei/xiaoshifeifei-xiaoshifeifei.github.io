<template>
  <custom-form
    :data="searchFormInfo.data"
    :field-list="searchFormInfo.fieldList"
    :label-width="searchFormInfo.labelWidth"
    :labelPosition="searchFormInfo.labelPosition"
    :listTypeInfo="listTypeInfo"
    :ref-obj.sync="searchFormInfo.ref"
    class="search-form"
  >
    <div slot="form-shipperAddressCode" style="width: 160px">
      <el-tooltip
        :content="shipperAddressName"
        :disabled="areaForm.sendArea.length <= 0"
        effect="dark"
        placement="top-start"
      >
        <el-cascader
          :options="listTypeInfo.areaList"
          @change="handleChangeAddress('shipperAddressCode', 'shipperAddressName', $event)"
          style="width: 100%"
          v-model="areaForm.sendArea"
        />
      </el-tooltip>
    </div>
    <div slot="form-receiverAddressCode" style="width: 160px">
      <el-tooltip
        :content="receiverAddressName"
        :disabled="areaForm.getArea.length <= 0"
        effect="dark"
        placement="top-start"
      >
        <el-cascader
          :options="listTypeInfo.areaList"
          @change="handleChangeAddress('receiverAddressCode', 'receiverAddressName', $event)"
          style="width: 100%"
          v-model="areaForm.getArea"
        />
      </el-tooltip>
    </div>
    <el-button
      @click="$emit('onSearch')"
      icon="el-icon-search"
      slot="form-searchBtn"
      type="primary"
    >搜 索</el-button>
    <el-button @click="resetFields()" icon="el-icon-refresh" slot="form-resetBtn" type="default">重 置</el-button>
  </custom-form>
</template>

<script>
import { regionData, CodeToText } from 'element-china-area-data'
export default {
  name: 'searchForm',
  props: {
    excludeFieldList: {
      type: Array,
      default: () => []
    },
    extraInfo: {
      type: Object,
      default: () => {
        return {
          list: [
            {
              data: '',
              fieldDetail: {}
            }
          ],
          listTypeInfo: {}
        }
      }
    }
  },
  data() {
    return {
      shipperAddressName: '',
      receiverAddressName: '',
      areaForm: {
        sendArea: '',
        getArea: ''
      },
      searchFormInfo: {
        ref: {},
        labelWidth: '80px',
        data: {
          orderNo: '',
          shipperAddressCode: '',
          receiverAddressCode: '',
          status: ''
        },
        fieldList: [
          {
            label: '单号',
            value: 'orderNo',
            type: 'input'
          },
          {
            label: '起始地',
            value: 'shipperAddressCode',
            type: 'slot',
            labelWidth: '60px'
          },
          {
            label: '目的地',
            value: 'receiverAddressCode',
            type: 'slot',
            labelWidth: '60px'
          },
          {
            label: '状态',
            value: 'status',
            type: 'select',
            list: 'statusList',
            selectKey: 'label',
            selectValue: 'value',
            labelWidth: '60px'
          },
          {
            label: '',
            value: 'searchBtn',
            type: 'slot'
          },
          {
            label: '',
            value: 'resetBtn',
            type: 'slot'
          }
        ]
      },
      listTypeInfo: {
        areaList: regionData,
        statusList: [
          {
            label: '待接单',
            value: 1
          },
          {
            label: '被拒绝',
            value: 'REFUSE_RECEIVE'
          },
          {
            label: '待派单',
            value: 2
          },
          {
            label: '已派单',
            value: '1'
          },
          {
            label: '企业已接单',
            value: 3
          },
          {
            label: '企业已派车',
            value: 'SEND_CAR'
          },
          {
            label: '已完成',
            value: 12
          }
        ]
      }
    }
  },
  watch: {
    data: {
      handler: function() {
        this.$emit('update:searchFormInfo', this.searchFormInfo)
      },
      deep: true // 深度监听
    }
  },
  created() {
    // 数组去除父组件指定的值
    this.searchFormInfo.fieldList = [...this.searchFormInfo.fieldList].filter(
      item => !this.excludeFieldList.includes(item.value)
    )
    // 数组添加父组件指定的值
    this.extraInfo.list.forEach(item => {
      this.searchFormInfo.data[item.data] = ''
      this.searchFormInfo.fieldList.splice(this.searchFormInfo.fieldList.length - 2, 0, item.fieldDetail)
    })
    this.listTypeInfo = {
      ...this.listTypeInfo,
      ...this.extraInfo.listTypeInfo
    }
  },
  mounted() {
    this.$emit('update:searchFormInfo', this.searchFormInfo)
  },
  methods: {
    handleChangeAddress(data, name, e) {
      this[name] = ''
      this.searchFormInfo.data[data] = e.join(',')
      e.forEach(item => {
        this[name] += CodeToText[item] + ','
      })
      this[name] = this[name].slice(0, -1)
    },
    resetFields() {
      this.searchFormInfo.ref.resetFields()
      this.areaForm.sendArea = ''
      this.areaForm.getArea = ''
      this.$emit('onSearch')
    }
  }
}
</script>
