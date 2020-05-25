<template>
  <div class="layout_main">
    <el-card>
      <div slot="header">
        <span>添加</span>
        <div style="float: right; margin-top: -5px">
          <el-button @click="handleSave" type="primary">保存</el-button>
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
        <el-row justify="space-between" style="margin-bottom: 10px" type="flex">
          <el-col>
            <el-select
              @change="handleChooseGoods"
              filterable
              placeholder="请选择物品"
              style="margin-right: 10px"
              v-model="goodsName"
            >
              <el-option
                :key="item.value"
                :label="item.goodsName"
                :value="item.goodsId"
                v-for="item in listTypeInfo.goodsList"
              ></el-option>
            </el-select>
            <el-button @click="handleAddGoods" type="success">新增</el-button>
          </el-col>
          <el-col style="text-align: right">
            <span>
              总数量:
              <span class="goods-total">{{ getTotalQuantity }}</span>
            </span>
            <span>
              总重量:
              <span class="goods-total">{{ getTotalWeight }}</span>
            </span>
            <span>
              总体积:
              <span class="goods-total">{{ getTotalVolume }}</span>
            </span>
          </el-col>
        </el-row>
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
              <span>{{ scope.row.goodsType | formatGoodsType }}</span>
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
              <span>{{ scope.row.unit | formatGoodsUnitType }}</span>
            </div>
          </template>
          <el-table-column align="center" fixed="right" label="操作" slot="append">
            <template slot-scope="scope">
              <el-button @click="handleDelete(scope.$index, 'goodsTableData')" type="text">删除</el-button>
            </template>
          </el-table-column>
        </custom-table>
      </el-card>
      <!-- 公司信息 -->
      <el-card style="margin-bottom: 10px">
        <div slot="header">
          <span>公司信息</span>
        </div>
        <el-select
          @change="handleChooseCompany"
          filterable
          placeholder="请选择公司"
          style="margin-right: 10px"
          v-model="companyName"
        >
          <el-option
            :key="item.value"
            :label="item.name"
            :value="item.id"
            v-for="item in listTypeInfo.companyList"
          ></el-option>
        </el-select>
        <custom-table
          :columns="companyTableDataColumns"
          :data="companyTableData"
          :hasPage="false"
          style="margin: 10px 0"
        >
          <el-table-column align="center" fixed="right" label="操作" slot="append">
            <template slot-scope="scope">
              <el-button @click="handleDelete(scope.$index, 'companyTableData')" type="text">删除</el-button>
            </template>
          </el-table-column>
        </custom-table>
      </el-card>
    </el-card>
  </div>
</template>
<script>
import request from '@/utils/request'
import { regionData, CodeToText } from 'element-china-area-data'
import { orderFormInfo } from './orderFormInfo'

export default {
  name: 'addBiddingInfo',
  computed: {
    getTotalQuantity() {
      let sum = 0
      this.goodsTableData.forEach(item => {
        sum += Number(item.number)
      })
      return sum
    },
    getTotalWeight() {
      let sum = 0
      this.goodsTableData.forEach(item => {
        sum += Number(item.weight)
      })
      return sum
    },
    getTotalVolume() {
      let sum = 0
      this.goodsTableData.forEach(item => {
        sum += Number(item.volume)
      })
      return sum
    }
  },
  data() {
    return {
      orderFormInfo: {},

      goodsName: '',
      companyName: '',

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
          prop: 'name',
          label: '公司名称',
          align: 'center'
        }
      ],
      listTypeInfo: {
        goodsList: [],
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
        companyList: [],
        areaList: regionData
      }
    }
  },
  created() {
    this.orderFormInfo = orderFormInfo()
    // 添加的时候删除价格和状态显示
    this.orderFormInfo.fieldList = this.orderFormInfo.fieldList.filter(item => {
      return item.value !== 'price' && item.value !== 'status'
    })

    this.updateGoodsList()
    this.updateCompanyList()
  },
  methods: {
    goBack() {
      this.$emit('goBack', 'list')
    },
    updateGoodsList() {
      request({
        url: 'srv/srvgoods/page',
        method: 'post',
        params: {
          pageNo: 1,
          pageSize: 1000
        }
      }).then(res => {
        this.listTypeInfo.goodsList = res.data.list
      })
    },
    updateCompanyList() {
      request({
        url: 'org/orgcompany/page',
        method: 'post',
        params: {
          isClient: '0',
          isJoin: true,
          pageNo: '1',
          pageSize: '1000'
        }
      }).then(res => {
        this.listTypeInfo.companyList = res.data.list.filter(
          item => item.id !== 'b59dc41383294a86aeb2c69cb14363c5'
        )
      })
    },
    handleChooseGoods(id) {
      this.listTypeInfo.goodsList.forEach(item => {
        if (item.goodsId === id) {
          this.goodsTableData.push({
            goodsType: item.goodsType,
            goodsName: item.goodsName,
            unit: item.unit,
            number: item.number,
            weight: item.weight,
            volume: item.volume,
            isEdit: true
          })
        }
      })
    },
    handleChooseCompany(id) {
      this.listTypeInfo.companyList.forEach(item => {
        if (item.id === id) {
          this.companyTableData.push({
            name: item.name,
            id: item.id
          })
        }
      })
      // 数组去重
      const hash = {}
      this.companyTableData = this.companyTableData.reduce((item, next) => {
        hash[next.name] ? '' : (hash[next.name] = true && item.push(next))
        return item
      }, [])
    },
    handleChangeAddress(formName, arr, address, addressCode) {
      this[formName].data[address] = ''
      this[formName].data[addressCode] = ''
      arr.forEach(item => {
        this[formName].data[address] += CodeToText[item] + ','
        this[formName].data[addressCode] += item + ','
      })
      this[formName].data[address] = this[formName].data[address].slice(0, -1)
      this[formName].data[addressCode] = this[formName].data[addressCode].slice(
        0,
        -1
      )
    },
    // 添加物品信息，没有isEdit会变成不可编辑状态
    handleAddGoods() {
      this.goodsTableData.push({
        goodsType: '',
        goodsName: '',
        unit: '',
        number: '',
        weight: '',
        volume: '',
        isEdit: true
      })
    },
    // 删除表格数据
    handleDelete(index, table) {
      this[table].splice(index, 1)
    },
    // 判断是否添加了物品，用布尔值是为了防止弹框多次
    haveGoodsInfo() {
      let isAdd = true
      if (this.goodsTableData.length > 0) {
        this.goodsTableData.forEach(item => {
          if (!isAdd) {
            return
          }
          for (const [key] of Object.entries(item)) {
            isAdd = true
            if (item[key] === '') {
              isAdd = false
              this.$message.error('请填写完整的物品信息')
              return
            }
          }
        })
        return isAdd
      } else {
        this.$message.error('请添加物品信息')
        return false
      }
    },
    // 判断是否有公司
    haveCompany() {
      if (this.companyTableData.length < 1) {
        this.$message.error('请添加需要询价的公司')
        return false
      }
      return true
    },
    handleSave() {
      this.orderFormInfo.ref.validate(validate => {
        if (validate && this.haveGoodsInfo() && this.haveCompany()) {
          const data = this.orderFormInfo.data
          data.goodsEntities = JSON.stringify(this.goodsTableData)
          data.companyEntities = JSON.stringify(this.companyTableData)
          request({
            url: '/price/omspriceinquiry/save',
            method: 'post',
            params: data
          }).then(() => {
            this.$message.success('添加成功')
            this.$emit('goBack')
          })
        }
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
