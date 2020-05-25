<template>
  <div class="executesql">
    <div class="layout_main" style="overflow:auto;">
      <div>
        <el-form :inline="true" :model="searchForm" :rules="rules" ref="searchForm">
          <el-row>
            <el-form-item label="运行类型" prop="iexec_type">
              <el-select
                @change="showbtntext"
                filterable
                style="width:120px;"
                v-model="searchForm.iexec_type"
              >
                <el-option :value="10" label="查询"></el-option>
                <el-option :value="20" label="修改"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="SQL查询语句" prop="sql_decode64">
              <el-input
                :rows="5"
                @keyup.enter.native="Fnsearch"
                clearable
                placeholder="请输入内容"
                style="width:600px;"
                type="textarea"
                v-model="searchForm.sql_decode64"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button @click="handleSearch" icon="el-icon-edit-outline" type="primary">{{texts}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                @click="handleDownload"
                icon="el-icon-download"
                type="primary"
                v-if="downloadstate==10"
              >下载表格</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="clearData" icon="el-icon-delete" type="primary">清空数据</el-button>
            </el-form-item>

            <el-form-item>
              <el-button @click="resetForm('searchForm')" icon="el-icon-refresh" type="default">重 置</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>

      <div style="height:660px;overflow:auto;">
        <div v-if="statecode==20">
          <table class="select_table" style="text-align:center">
            <tr>
              <td :key="index" v-for="(item,index) of titleData">{{index}}</td>
            </tr>
            <tr :key="index" v-for="(item,index) of tableData">
              <td :key="indexs" v-for="(list,indexs) of item">{{list}}</td>
            </tr>
          </table>
        </div>
        <div v-if="statecode==10">
          <p>
            受影响的行：
            <span style="color:red;">{{influenceline}}</span>
          </p>
          <p>
            执行语句：
            <span style="color:red;">{{this.searchForm.sql_decode64}}</span>
          </p>
          <p>
            执行的时间：
            <span style="color:red;">{{timestampNowShow}}s</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as z from '@/utils/com.js'
import request from '@/utils/request'
import Base64 from '@/utils/base64utils.js'
export default {
  name: 'executesql',
  data() {
    return {
      searchForm: {
        /* eslint-disable */
        total: 0,
        page: 0,
        page_size: 100,
        sql_decode64: '',
        iexec_type: 10
      },
      tableData: [],
      titleData: [],
      influenceline: '',
      timestampPast: '',
      timestampNow: '',
      statecode: '',
      downloadstate: '',
      texts: '查询',
      rules: {
        /* eslint-disable */
        iexec_type: [
          {
            required: true,
            message: '请选择运行类型',
            trigger: ['blur', 'change']
          }
        ],
        /* eslint-disable */
        sql_decode64: [
          {
            required: true,
            message: '请输入SQL查询语句',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.searchForm.resetFields()
    },
    clearData() {
      this.tableData = []
      this.titleData = []
      this.downloadstate = ''
    },

    indexMethod(index) {
      return index * 1 + 1
    },

    showbtntext() {
      if (this.searchForm.iexec_type == 10) {
        this.texts = '查询'
      } else if (this.searchForm.iexec_type == 20) {
        this.texts = '修改'
      }
    },
    //
    handleSearch() {
      this.timestampPast = new Date().getTime()
      this.statecode = ''
      this.$refs.searchForm.validate(valid => {
        if (valid) {
          z.ld()
          request({
            method: 'post',
            url: '/sql/runsql',
            params: {
              /* eslint-disable */
              sql_decode64: Base64.encode(this.searchForm.sql_decode64),
              iexec_type: this.searchForm.iexec_type
            }
          })
            .then(res => {
              if (typeof res.data == 'number') {
                this.statecode = 10
                this.influenceline = res.data
                this.timestampNow = new Date().getTime()
                this.timestampNowShow = (this.timestampNow - this.timestampPast) / 1000
              } else if (typeof res.data == 'object') {
                this.statecode = 20
                this.titleData = res.data[0]
                this.tableData = res.data
                this.downloadstate = 10
              }

              z.lc()
              z.success('请求完成')
            })
            .catch(() => {
              this.statecode = ''
              this.downloadstate = ''
              z.lc()
            })
        }
      })
    },
    handleDownload() {
      let keys1 = []
      for (const i in this.titleData) {
        if (Object.prototype.hasOwnProperty.call(this.titleData, i)) {
          keys1.push(i)
        }
      }
      // 下载显示表格数据内的对象
      this.tableData.forEach(val => {
        for (const j1 in val) {
          if (typeof val[j1] == 'object') {
            val[j1] = JSON.stringify(val[j1])
          }
        }
      })
      import('@/vendor/Export2Excel').then(res => {
        const tHeader = keys1
        const filterVal = keys1
        const data = this.formatJson(filterVal, this.tableData)
        res.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'SQL查询数据列表'
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
<style>
.select_table {
  border-top: 1px solid #ccc !important;
  border-left: 1px solid #ccc !important;
  border-collapse: collapse;
  font-size: 13px;
}
.select_table tr:nth-of-type(1) {
  height: 37px;
  font-size: 13px;
}
.select_table td {
  font-size: 13px;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  text-align: center;
  height: 28px;
  white-space: nowrap;
  padding: 0 10px;
}
.select_table tr:nth-of-type(2n-1) {
  background: #ebeef5;
}
.select_table tr:hover {
  background: #f2f6fc;
}
</style>
