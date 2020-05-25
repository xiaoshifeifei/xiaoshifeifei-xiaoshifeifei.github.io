<template>
  <div class="layout_main">
    <div v-if="$store.state.ticketOrder.status === 'list'">
      <list/>
    </div>
    <div v-else-if="$store.state.ticketOrder.status === 'addOrder'">
      <add-order @goBack="changeShowPage('list')"/>
    </div>
    <div v-else-if="$store.state.ticketOrder.status === 'detail'">
      <order-detail @goBack="changeShowPage('list')"/>
    </div>
  </div>
</template>
<script>
import list from './list'
import addOrder from './addOrder'
import orderDetail from './detail'

export default {
  components: {
    list,
    addOrder,
    orderDetail
  }
}
</script>
