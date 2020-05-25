<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :collapse="isCollapse"
      :default-active="$route.path"
      :show-timeout="200"
      active-text-color="#409EFF"
      background-color="#304156"
      mode="vertical"
      text-color="#bfcbd9"
    >
      <!-- <sidebar-item
        v-for="route in permissionRouters"
        :key="route.name"
        :item="route"
        :base-path="route.path"

            background-color="#304156"
      />-->
      <sidebar-item
        :base-path="route.path"
        :item="route"
        :key="route.path"
        v-for="route in permissionRouters"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import $ from 'jquery'

export default {
  components: { SidebarItem },
  mounted() {
    $('.el-menu.el-menu--popup')
      .eq(0)
      .css({
        backgroundColor: 'transparent',
        display: 'none'
      })
  },
  computed: {
    ...mapGetters(['permissionRouters', 'sidebar']),
    isCollapse() {
      $('.is-active').css('border-left', 'none')
      return !this.sidebar.opened
    }
  }
}
</script>
<style>
.menu-wrapper > .is-active {
  border-left: 4px solid rgb(66, 185, 131);
}
.is-active > .el-menu {
  border-left: 4px solid rgb(66, 185, 131);
}
</style>

