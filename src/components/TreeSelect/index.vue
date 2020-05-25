<!--
    /**
     * 树形下拉选择组件，下拉框展示树形结构，提供选择某节点功能，方便其他模块调用
     * @author ljn
     * @date 2019-03-04
     * 调用示例：
     * <tree-select :height="400" // 下拉框中树形高度
     *              :width="200" // 下拉框中树形宽度
     *              size="small"  // 输入框的尺寸: medium/small/mini
     *              :data="data" // 树结构的数据
     *              :defaultProps="defaultProps" // 树结构的props
     *              multiple   // 多选
     *              checkStrictly // 多选时，严格遵循父子不互相关联
     *              :nodeKey="nodeKey"   // 绑定nodeKey，默认绑定'id'
     *              :checkedKeys="defaultCheckedKeys"  // 传递默认选中的节点key组成的数组
     *              @popoverHide="popoverHide"> // 事件有两个参数：第一个是所有选中的节点ID，第二个是所有选中的节点数据
     *              </tree-select>
     */
-->
<template>
  <div>
    <div @click="isShowSelect = !isShowSelect" class="mask" v-show="isShowSelect"></div>
    <el-popover
      :width="width+20"
      @hide="popoverHide"
      placement="bottom-start"
      trigger="manual"
      v-model="isShowSelect"
    >
      <el-tree
        :check-strictly="checkStrictly"
        :data="data"
        :expand-on-click-node="false"
        :highlight-current="true"
        :node-key="nodeKey"
        :props="defaultProps"
        :show-checkbox="multiple"
        :style="style"
        @check-change="handleCheckChange"
        @node-click="handleNodeClick"
        class="common-tree"
        default-expand-all
        ref="tree"
      ></el-tree>
      <el-select
        :multiple="multiple"
        :size="size"
        :style="selectStyle"
        @click.native="isShowSelect = !isShowSelect"
        class="tree-select"
        ref="select"
        slot="reference"
        v-model="selectedData"
      >
        <el-option
          :key="item.value"
          :label="item.label"
          :value="item.value"
          v-for="item in options"
        ></el-option>
      </el-select>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'tree-select',
  props: {
    // 树结构数据
    data: {
      type: Array,
      default() {
        return []
      }
    },
    defaultProps: {
      type: Object,
      default() {
        return {}
      }
    },
    // 配置是否可多选
    multiple: {
      type: Boolean,
      default() {
        return false
      }
    },
    nodeKey: {
      type: String,
      default() {
        return 'id'
      }
    },
    // 显示复选框情况下，是否严格遵循父子不互相关联
    checkStrictly: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 默认选中的节点key数组
    checkedKeys: {
      type: Array,
      default() {
        return []
      }
    },
    size: {
      type: String,
      default() {
        return 'small'
      }
    },
    width: {
      type: Number,
      default() {
        return 200
      }
    },
    height: {
      type: Number,
      default() {
        return 300
      }
    }
  },
  data() {
    return {
      isShowSelect: false, // 是否显示树状选择器
      options: [],
      selectedData: [], // 选中的节点
      style: `width:${this.width}px;height:${this.height}px;`,
      selectStyle: `width:${this.width}px;`,
      checkedIds: [],
      checkedData: []
    }
  },
  mounted() {
    this.initCheckedData()
  },
  methods: {
    initCheckedData() {
      if (this.multiple) {
        if (this.checkedKeys.length > 0) {
          // 勾选上传进来的节点
          this.$refs.tree.setCheckedKeys(this.checkedKeys)
        } else {
          // 清空所有勾选
          const checkedKeys = this.$refs.tree.getCheckedKeys() // 所有被选中的节点的 key 所组成的数组数据
          for (let i = 0; i < checkedKeys.length; i++) {
            this.$refs.tree.setChecked(checkedKeys[i], false)
          }
        }
      } else {
        if (this.checkedKeys.length > 0) {
          // 选中传进来的节点
          const item = this.checkedKeys[0]
          this.$refs.tree.setCurrentKey(item)
          const node = this.$refs.tree.getNode(item)
          this.selectedData = node.label
        } else {
          // 清空选中
          this.selectedData = ''
          this.$refs.tree.setCurrentKey(null)
        }
      }
    },
    popoverHide() {
      if (this.multiple) {
        this.checkedIds = this.$refs.tree.getCheckedKeys() // 所有被选中的节点的 key 所组成的数组数据
        this.checkedData = this.$refs.tree.getCheckedNodes() // 所有被选中的节点所组成的数组数据
      } else {
        this.checkedIds = this.$refs.tree.getCurrentKey()
        this.checkedData = this.$refs.tree.getCurrentNode()
      }
      this.$emit('popoverHide', this.checkedIds, this.checkedData)
    },
    // 节点被点击时的回调,返回被点击的节点数据
    handleNodeClick(data, node) {
      if (!this.multiple) {
        const tmpMap = {
          value: node.key,
          label: node.label
        }
        this.options = []
        this.options.push(tmpMap)
        this.selectedData = node.label
        this.isShowSelect = !this.isShowSelect
      }
    },
    // 节点选中状态发生变化时的回调
    handleCheckChange() {
      const checkedKeys = this.$refs.tree.getCheckedKeys() // 所有被选中的节点的 key 所组成的数组数据
      this.options = checkedKeys.map(item => {
        const node = this.$refs.tree.getNode(item) // 所有被选中的节点对应的node
        const tmpMap = {
          value: node.key,
          label: node.label
        }
        return tmpMap
      })
      this.selectedData = this.options.map(item => {
        return item.label
      })
    }
  },
  watch: {
    isShowSelect() {
      // 隐藏select自带的下拉框
      this.$refs.select.blur()
    },
    checkedKeys(val) {
      if (!val) {
        return
      }
      this.checkedKeys = val
      this.initCheckedData()
    }
  }
}
</script>

<style scoped>
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
}
.common-tree {
  overflow: auto;
}
.tree-select .el-select__tags .el-tag .el-tag__close {
  display: none;
}
.tree-select .el-select__tags .el-tag .el-icon-close {
  display: none;
}
</style>
