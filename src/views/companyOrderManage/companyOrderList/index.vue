<template>
  <div class="layout_main">
    <div v-if="$store.state.companyOrder.status === 'list'">
      <list/>
    </div>
    <div v-else-if="$store.state.companyOrder.status === 'addOrder'">
      <add-order/>
    </div>
    <div v-else-if="$store.state.companyOrder.status === 'detail'">
      <order-detail/>
    </div>
    <div v-else-if="$store.state.companyOrder.status === 'sendCar'">
      <send-car/>
    </div>
  </div>
</template>
<script>
import list from './list'
import addOrder from './addOrder'
import orderDetail from './detail'
import sendCar from './sendCar'

export default {
  components: {
    list,
    addOrder,
    orderDetail,
    sendCar
  }
}
</script>
