<template>
  <div class="layout_main">
    <el-card>
      <div slot="header">
        <span>{{ pageType == 'edit' ? '编辑' : '详情' }}</span>
        <div style="float: right; margin-top: -5px">
          <el-button @click="handleSave" type="primary" v-if="!isPlat && pageType != 'info'">保存</el-button>
          <el-button @click="goBack" type="primary">返回</el-button>
        </div>
      </div>
      <!-- 基本信息 -->
      <el-card style="margin-bottom: 10px">
        <div slot="header">
          <span>基本信息</span>
        </div>
        <custom-form
          :data="orderFormInfo.data"
          :field-list="orderFormInfo.fieldList"
          :label-width="orderFormInfo.labelWidth"
          :labelPosition="orderFormInfo.labelPosition"
          :list-type-info="listTypeInfo"
          :ref-obj.sync="orderFormInfo.ref"
          :rules="orderFormInfo.rules"
        >
          <div slot="form-beginaddr" style="width: 160px">
            <el-tooltip
              :content="orderFormInfo.data.beginaddr"
              :disabled="areaForm.beginaddrcode.length <= 0"
              effect="dark"
              placement="top-start"
            >
              <el-cascader
                :options="listTypeInfo.areaList"
                @change="handleChangeAddress('orderFormInfo', $event, 'beginaddr', 'beginaddrcode')"
                disabled
                style="width: 100%"
                v-model="areaForm.beginaddrcode"
              />
            </el-tooltip>
          </div>
          <div slot="form-endaddr" style="width: 160px">
            <el-tooltip
              :content="orderFormInfo.data.endaddr"
              :disabled="areaForm.endaddrcode.length <= 0"
              effect="dark"
              placement="top-start"
            >
              <el-cascader
                :options="listTypeInfo.areaList"
                @change="handleChangeAddress('orderFormInfo', $event, 'endaddr', 'endaddrcode')"
                disabled
                style="width: 100%"
                v-model="areaForm.endaddrcode"
              />
            </el-tooltip>
          </div>
        </custom-form>
      </el-card>
      <!-- 物品信息 -->
      <el-card style="margin-bottom: 10px">
        <div slot="header">
          <span>物品信息</span>
        </div>
        <custom-table
          :columns="goodsTableDataColumns"
          :data="goodsTableData"
          :hasPage="false"
          style="margin-bottom: 10px"
        >
          <template slot="goodsType" slot-scope="scope">
            <el-select placeholder="请选择货物类型" v-if="scope.row.isEdit" v-model="scope.row.goodsType">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in listTypeInfo.goodsTypeList"
              ></el-option>
            </el-select>
            <div v-else>
              <span>{{scope.row.goodsType | formatGoodsType }}</span>
            </div>
          </template>
          <template slot="unit" slot-scope="scope">
            <el-select placeholder="请选择包装单位" v-if="scope.row.isEdit" v-model="scope.row.unit">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in listTypeInfo.unitList"
              ></el-option>
            </el-select>
            <div v-else>
              <span>{{scope.row.unit | formatGoodsUnitType }}</span>
            </div>
          </template>
        </custom-table>
      </el-card>
      <!-- 公司信息 -->
      <el-card style="margin-bottom: 10px" v-if="isPlat">
        <div slot="header">
          <span>公司信息</span>
        </div>
        <custom-table
          :columns="companyTableDataColumns"
          :data="companyTableData"
          :hasPage="false"
          style="margin: 10px 0"
        >
          <template slot="price" slot-scope="scope">
            <span v-if="scope.row.price != '0'">{{ scope.row.price }}</span>
            <span v-else>暂无</span>
          </template>
        </custom-table>
      </el-card>
    </el-card>
  </div>
</template>
<script>
import request from '@/utils/request'
import { regionData } from 'element-china-area-data'
import { orderFormInfo } from './orderFormInfo'

export default {
  name: 'biddingInfo',
  props: {
    pageType: {
      type: String,
      default: 'edit'
    },
    currentCompanyId: {
      type: [Number, String],
      default: ''
    },
    id: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      orderFormInfo: {},
      isPlat: false,

      areaForm: {
        beginaddrcode: '',
        endaddrcode: ''
      },
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
          slotName: 'unit',
          align: 'center'
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
      companyTableData: [],
      companyTableDataColumns: [
        {
          prop: 'companyName',
          label: '公司名称',
          align: 'center'
        },
        {
          prop: 'price',
          label: '价格',
          slotName: 'price',
          align: 'center'
        }
      ],
      listTypeInfo: {
        goodsTypeList: [
          {
            label: '电子产品',
            value: '90'
          },
          {
            label: '商品汽车',
            value: '92'
          },
          {
            label: '冷藏货物',
            value: '93'
          },
          {
            label: '大宗货物',
            value: '94'
          },
          {
            label: '快速消费',
            value: '95'
          },
          {
            label: '农产品',
            value: '96'
          },
          {
            label: '其他',
            value: '999'
          }
        ],
        unitList: [
          {
            label: '件',
            value: 'THING'
          },
          {
            label: '包',
            value: 'PACKAGE'
          },
          {
            label: '箱',
            value: 'BOX'
          },
          {
            label: '托',
            value: 'STIPULES'
          }
        ],
        areaList: regionData
      }
    }
  },
  created() {
    this.orderFormInfo = orderFormInfo()
    this.orderFormInfo.fieldList.forEach(item => (item.disabled = true))
    if (this.$store.state.user.user.companyId === 'b59dc41383294a86aeb2c69cb14363c5') {
      this.isPlat = true
    }
    if (!this.isPlat) {
      this.orderFormInfo.fieldList.push({
        label: '价格',
        value: 'price',
        type: 'number'
      })
    }
    this.updateInfo(this.id)
    if (this.isPlat || this.pageType === 'info') {
      this.handleDisableForm()
    }
  },
  methods: {
    goBack() {
      this.$emit('goBack', 'list')
    },
    // 获取具体的某一个记录信息
    updateInfo(id) {
      request({
        url: '/price/omspriceinquiry/info',
        method: 'post',
        params: {
          id,
          companyId: this.$store.state.user.user.companyId
        }
      }).then(res => {
        this.orderFormInfo.data = res.data
        this.goodsTableData = res.data.goodsList
        this.companyTableData = res.data.companyList
        // 转换地址编码
        this.areaForm.beginaddrcode = res.data.beginaddrcode.split(',')
        this.areaForm.endaddrcode = res.data.endaddrcode.split(',')
      })
    },
    handleSave() {
      request({
        url: '/price/omspricebidcompany/modify',
        method: 'post',
        params: {
          companyId: this.$store.state.user.user.companyId,
          inquiryId: this.id,
          price: this.orderFormInfo.data.price,
          status: '3'
        }
      }).then(() => {
        this.$message.success('确认成功')
        this.goBack()
      })
    },
    handleDisableForm() {
      this.orderFormInfo.fieldList.forEach(item => {
        item.disabled = true
      })
    }
  }
}
</script>

<style scoped>
.plate-no {
  display: inline-block;
  width: 160px;
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
}
.goods-total {
  display: inline-block;
  text-align: left;
  width: 30px;
  color: #ff0000;
}
</style>
