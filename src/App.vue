<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    this.$nextTick(() => {
      window.onresize = () => {
        this.doTableAdaptive()
      }
    })
  },
  methods: {
    doTableAdaptive() {
      const form = document.querySelector('.search-form')
      const table = document.querySelector('.custom-table')
      if (form) {
        if (form.style.display !== 'none') {
          const searchHeight = form.offsetHeight
          table.style.height = window.innerHeight - 235 - searchHeight + 'px'
        }
      } else if (table) {
        table.style.height = window.innerHeight - 235 + 'px'
      }
    }
  }
}
</script>

<style lang="less">
.avatar-uploader .el-upload {
  border: 1px dashed #222 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff !important;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 160px !important;
  height: 100px !important;
  line-height: 100px !important;
  text-align: center;
}
.avatar {
  width: 160px;
  height: 100px;
  display: block;
}
</style>
