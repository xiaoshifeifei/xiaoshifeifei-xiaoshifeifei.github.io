<template>
  <div>
    <el-table
      :data="data"
      :default-sort="sort"
      :ref="myRef"
      :style="{ height: tableHeight + 'px'}"
      @row-click="clickRow"
      @selection-change="handleSelectionChange"
      border
      class="custom-table"
      stripe
      tooltip-effect="dark"
    >
      <el-table-column
        :key="index"
        :label="item.label"
        :type="item.type"
        align="center"
        v-for="(item, index) in columnsTypeArray"
      />
      <el-table-column
        :align="col.align"
        :fixed="col.isFixed"
        :key="`${col.prop}${index}`"
        :label="col.label"
        :prop="col.prop"
        :sortable="col.sortable"
        :type="col.type"
        :width="col.width"
        show-overflow-tooltip
        v-for="(col, index) in columns"
      >
        <template :scope="scope" slot-scope="scope">
          <span v-if="col.slotName">
            <slot :name="col.slotName" :row="scope.row"/>
          </span>
          <div v-else>
            <!-- 意味着父组件想渲染的时候必须要用slot了 -->
            <div v-if="!data[scope.$index].isEdit">
              <span>{{scope.row[col.prop]}}</span>
            </div>
            <div v-else>
              <el-input
                :placeholder="`请输入${col.label}`"
                :type="col.type"
                v-if="col.type === 'input' || col.type === 'number'"
                v-model="scope.row[col.prop]"
              />
              <el-select
                :placeholder="`请选择${col.label}`"
                v-else-if="col.type === 'select'"
                v-model="scope.row[col.prop]"
              >
                <el-option
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  v-for="item in col.options"
                ></el-option>
              </el-select>
            </div>
          </div>
        </template>
      </el-table-column>
      <slot name="append"></slot>
    </el-table>

    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="pageSizeArray"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      class="pagination"
      layout="total, sizes, prev, pager, next, jumper"
      v-if="hasPage"
    />
  </div>
</template>

<script>
export default {
  name: 'CustomTable',
  props: {
    myRef: {
      type: String,
      default: 'customTable'
    },
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    sort: {
      type: Object,
      default: () => ({
        prop: 'id',
        order: 'ascending'
      })
    },
    columnsTypeArray: {
      type: Array,
      default: () => []
    },
    height: {
      type: [String, Number],
      default: 460
    },
    hasPage: {
      type: Boolean,
      default: true
    },
    currentPage: {
      type: [String, Number],
      default: 1
    },
    pageSize: {
      type: [String, Number],
      default: 1
    },
    total: {
      type: [String, Number],
      default: 0
    },
    pageSizeArray: {
      type: Array,
      default: () => [10, 20, 50, 100, 200, 500, 1000]
    }
  },
  data() {
    return {
      tableHeight: window.innerHeight - 270
    }
  },
  methods: {
    handleSelectionChange(e) {
      this.$emit('selection-change', e)
    },
    clickRow(e) {
      this.$refs.customTable.toggleRowSelection(e)
      this.$emit('row-click', e)
    },
    handleSizeChange(e) {
      this.$emit('change-size', e)
    },
    handleCurrentChange(e) {
      this.$emit('change-current-page', e)
    }
  }
}
</script>
