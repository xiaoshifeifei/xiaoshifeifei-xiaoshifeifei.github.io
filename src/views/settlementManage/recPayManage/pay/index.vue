<template>
  <div class="layout_main">
    <el-tabs v-model="$store.state.orderType.recPayType">
      <el-tab-pane label="企业付款单" name="pay">
        <!-- 用v-if是为了让每次切换页签的时候都触发create周期 -->
        <company v-if="$store.state.orderType.recPayType === 'pay'" />
      </el-tab-pane>
      <el-tab-pane label="司机付款单" name="payDriver">
        <driver v-if="$store.state.orderType.recPayType === 'payDriver'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import company from './company'
import driver from './driver'

export default {
  components: {
    company,
    driver
  }
}
</script>
