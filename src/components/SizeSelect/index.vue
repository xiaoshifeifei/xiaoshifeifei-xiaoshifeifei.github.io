<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div>
      <i class="fas fa-exchange-alt"></i>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="size==='medium'" command="medium">Medium</el-dropdown-item>
      <el-dropdown-item :disabled="size==='small'" command="small">Small</el-dropdown-item>
      <el-dropdown-item :disabled="size==='mini'" command="mini">Mini</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  //element ui 组件大小选择器
  computed: {
    size() {
      return this.$store.getters.size;
    }
  },
  methods: {
    handleSetSize(size) {
      this.$ELEMENT.size = size;
      this.$store.dispatch("setSize", size);
      this.refreshView();
      this.$message({
        message: "Switch Size Success",
        type: "success"
      });
    },
    refreshView() {
      // In order to make the cached page re-rendered
      this.$store.dispatch("delAllCachedViews", this.$route);

      const { fullPath } = this.$route;

      this.$nextTick(() => {
        this.$router.replace({
          path: "/redirect" + fullPath
        });
      });
    }
  }
};
</script>

<style scoped>
.fa-exchange-alt {
  color: #000000;
  font-size: 20px;
  cursor: pointer;
}
</style>

