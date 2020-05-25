<template>
  <div class="layout_main">
    <el-tabs v-model="$store.state.checkOrder.driverCompany">
      <el-tab-pane label="企业对账单" name="company">
        <!-- 用v-if是为了让每次切换页签的时候都触发create周期 -->
        <company v-if="$store.state.checkOrder.driverCompany === 'company'" />
      </el-tab-pane>
      <el-tab-pane label="司机对账单" name="driver">
        <driver v-if="$store.state.checkOrder.driverCompany === 'driver'" />
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
