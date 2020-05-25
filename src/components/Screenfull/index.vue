<template>
  <div>
    <i @click="click" class="fas fa-expand-arrows-alt"></i>
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  // 全屏显示
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    }
  }
}
</script>

<style scoped>
.fa-expand-arrows-alt {
  font-size: 20px;
  cursor: pointer;
}
</style>
