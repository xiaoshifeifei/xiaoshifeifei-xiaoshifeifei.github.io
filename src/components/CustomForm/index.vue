<template>
  <el-form
    :class="className"
    :inline="inline"
    :label-position="labelPosition"
    :label-width="labelWidth"
    :model="data"
    :rules="rules"
    :size="size"
    class="page-form"
    ref="form"
  >
    <el-form-item
      :class="item.className"
      :key="index"
      :label="item.label"
      :label-width="item.labelWidth"
      :prop="item.value"
      v-for="(item, index) in getConfigList()"
    >
      <!-- solt -->
      <template v-if="item.type === 'slot'">
        <slot :name="'form-' + item.value"/>
      </template>
      <!-- 普通输入框 -->
      <el-input
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
        :type="item.type"
        @input="handleEvent(item.event)"
        v-if="item.type === 'input' || item.type === 'password' || item.type === 'number'"
        v-model="data[item.value]"
      />
      <!-- 文本输入框 -->
      <el-input
        :autosize="item.autosize || {minRows: 2, maxRows: 10}"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
        :style="{ width: item.width }"
        :type="item.type"
        @focus="handleEvent(item.event)"
        v-if="item.type === 'textarea'"
        v-model.trim="data[item.value]"
      />
      <!-- 计数器 -->
      <el-input-number
        :max="item.max"
        :min="item.min"
        @change="handleEvent(item.event)"
        size="small"
        v-if="item.type === 'inputNumber'"
        v-model="data[item.value]"
      />
      <!-- 选择框 -->
      <el-select
        :clearable="item.clearable"
        :disabled="item.disabled"
        :filterable="item.filterable"
        :multiple="item.selectMultiple || false"
        :placeholder="getPlaceholder(item)"
        @change="handleEvent(item.event, data[item.value])"
        v-if="item.type === 'select'"
        v-model="data[item.value]"
      >
        <el-option
          :key="childIndex"
          :label="childItem[item.selectKey]"
          :value="childItem[item.selectValue]"
          v-for="(childItem, childIndex) in listTypeInfo[item.list]"
        />
      </el-select>
      <!-- 日期选择框 -->
      <el-date-picker
        :clearable="item.clearable"
        :disabled="item.disabled"
        :picker-options="item.TimePickerOptions"
        :placeholder="getPlaceholder(item)"
        :type="item.dateType"
        @focus="handleEvent(item.event)"
        style="width: 180px"
        v-if="item.type === 'date'"
        v-model="data[item.value]"
        :value-format="item.dateFormat ? item.dateFormat : 'yyyy-MM-dd HH:mm:ss'"
      />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'customForm',
  props: {
    // 自定义类名
    className: {
      type: String
    },
    inline: {
      type: Boolean,
      default: true
    },
    // 表单数据
    data: {
      type: Object
    },
    // 相关字段
    fieldList: {
      type: Array
    },
    // 验证规则
    rules: {
      type: Object
    },
    // 相关的列表
    listTypeInfo: {
      type: Object
    },
    // 尺寸
    size: {
      type: String,
      default: 'mini'
    },
    // label宽度
    labelWidth: {
      type: String,
      default: '150px'
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    refObj: {
      type: Object
    }
  },
  data() {
    return {}
  },
  watch: {
    data: {
      handler: function() {
        // 将form实例返回到父级
        this.$emit('update:refObj', this.$refs.form)
      },
      deep: true // 深度监听
    }
  },
  mounted() {
    // 将form实例返回到父级
    this.$emit('update:refObj', this.$refs.form)
  },
  methods: {
    // 获取字段列表
    getConfigList() {
      return this.fieldList.filter(
        item => !Object.prototype.hasOwnProperty.call(item, 'show') || (Object.prototype.hasOwnProperty.call(item, 'show') && item.show)
      )
    },
    // 得到placeholder的显示
    getPlaceholder(row) {
      let placeholder = ''
      if (row.type === 'input' || row.type === 'textarea') {
        placeholder = `请输入${row.label}`
      } else if (
        row.type === 'select' || row.type === 'time' || row.type === 'date'
      ) {
        placeholder = `请选择${row.label}`
      } else {
        placeholder = row.label
      }
      return placeholder
    },
    // 绑定的相关事件
    handleEvent(event, data) {
      this.$emit('handleEvent', event, data)
    },
    // 派发按钮点击事件
    handleClick(event, data) {
      this.$emit('handleClick', event, data)
    },
    resetFields() {
      this.$refs.form.resetFields()
    },
    clearValidate() {
      this.$refs.form.clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-input--prefix .el-input__inner {
  padding-right: 0 !important;
}
.page-form {
  .el-form-item {
    .el-form-item__content {
      .el-input,
      .el-select,
      .el-textarea {
        width: 160px !important;
      }
      .el-input-number {
        .el-input {
          width: inherit;
        }
      }
    }
  }
  .el-form-block {
    display: block;
    width: 100%;
    .el-form-item__content {
      .el-textarea {
        width: 100%;
      }
    }
  }
}
.page-form-block {
  .el-form-item {
    display: block;
    .el-form-item__content {
      .el-input,
      .el-select,
      .el-textarea {
        width: inherit;
      }
      .el-input-number {
        .el-input {
          width: inherit;
        }
      }
    }
  }
  .el-form-block {
    display: block;
    width: 100%;
    .el-form-item__content {
      .el-textarea {
        width: 100%;
      }
    }
  }
}
</style>
