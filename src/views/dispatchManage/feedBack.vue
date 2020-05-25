<template>
  <el-card>
    <div slot="header">
      <span>信息反馈</span>
      <el-button
        @click="goBack"
        size="medium"
        style="margin-left:20px;float:right;padding:3px 0;"
        type="text"
      >返回</el-button>
    </div>
    <custom-table
      :columns="tableDataColumns"
      :columnsTypeArray="[{ label: '序号', type: 'index' }]"
      :currentPage="searchForm.pageNo"
      :data="tableData"
      :page-size="searchForm.pageSize"
      :total="searchForm.total"
      @change-current-page="handleCurrentChange"
      @change-size="handleSizeChange"
    >
      <template slot="exceptionType" slot-scope="scope">
        <span v-if="scope.row.exceptionType == 'WEATHER'">天气</span>
        <span v-if="scope.row.exceptionType == 'TRAFFIC'">堵车</span>
        <span v-if="scope.row.exceptionType == 'ROAD'">路况</span>
        <span v-if="scope.row.exceptionType == 'ACCIDENT'">事故</span>
        <span v-if="scope.row.exceptionType == 'OVERLOAD'">查超</span>
        <span v-if="scope.row.exceptionType == 'OIL'">加油</span>
        <span v-if="scope.row.exceptionType == 'TOLL'">路费</span>
        <span v-if="scope.row.exceptionType == 'OTHER'">其他</span>
      </template>
      <template slot="feedBackState" slot-scope="scope">
        <span v-if="scope.row.feedBackState == false">待处理</span>
        <span v-if="scope.row.feedBackState == true">已处理</span>
      </template>
      <template slot="feedBackType" slot-scope="scope">
        <span v-if="scope.row.feedBackType == false">在途反馈</span>
        <span v-if="scope.row.feedBackType == true">异常反馈</span>
      </template>
    </custom-table>
  </el-card>
</template>

<script>
import request from '@/utils/request'

export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          sendvehicleId: ''
        }
      }
    }
  },
  data() {
    return {
      searchForm: {
        sendvehicleId: '',
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      tableData: [],
      tableDataColumns: [
        {
          prop: 'address',
          label: '反馈地点',
          align: 'center'
        },
        {
          prop: 'exceptionType',
          label: '异常反馈类型',
          align: 'center',
          slotName: 'exceptionType'
        },
        {
          prop: 'feedBackHandleTime',
          label: '反馈处理时间',
          align: 'center'
        },
        {
          prop: 'feedBackResult',
          label: '反馈处理结果',
          align: 'center'
        },
        {
          prop: 'feedBackState',
          label: '反馈状态',
          align: 'center',
          slotName: 'exceptionType'
        },
        {
          prop: 'feedBackTime',
          label: '反馈时间',
          align: 'center'
        },
        {
          prop: 'feedBackType',
          label: '反馈类型',
          align: 'center',
          slotName: 'feedBackType'
        },
        {
          prop: 'remark',
          label: '反馈描述',
          align: 'center'
        },
        {
          prop: 'feedBackRemark',
          label: '反馈备注',
          align: 'center'
        }
      ]
    }
  },
  created() {
    this.updateList()
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    updateList() {
      this.searchForm.sendvehicleId = this.info.sendvehicleId
      request({
        url: '/srv/srvfeedback/page',
        method: 'post',
        params: this.searchForm
      }).then(res => {
        this.tableData = res.data.list
      })
    },
    handleSizeChange(val) {
      this.searchForm.pageNo = 1
      this.searchForm.pageSize = val
      this.updateList()
    },
    handleCurrentChange(val) {
      this.searchForm.pageNo = val
      this.updateList()
    }
  }
}
</script>
