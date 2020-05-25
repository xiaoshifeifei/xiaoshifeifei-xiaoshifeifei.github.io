<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :isActive="sidebar.opened" :toggleClick="toggleSideBar" class="hamburger-container"></hamburger>
    <!-- <breadcrumb></breadcrumb> -->
    <breadcrumb class="breadcrumb-container"/>
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <error-log class="errLog-container right-menu-item"/>

        <el-tooltip content="是否全屏" effect="dark" placement="bottom">
          <screenfull class="international right-menu-item"/>
        </el-tooltip>
        <el-tooltip content="首页" effect="dark" placement="bottom">
          <div class="international right-menu-item" style="cursor:pointer;">
            <router-link to="/">
              <i class="fa fa-home"></i>
            </router-link>
          </div>
        </el-tooltip>
        <el-tooltip content="注销登录" effect="dark" placement="bottom">
          <div class="international right-menu-item" style="cursor:pointer;">
            <span @click="logout" style="display:block;">
              <i class="fa fa-sign-in-alt fa-1hax"></i>
            </span>
          </div>
        </el-tooltip>
        <el-tooltip content="当前企业" effect="dark" placement="bottom">
          <span style="padding: 0 20px;"><strong style="color: #ff0000">{{ $store.state.user.user.userName }}</strong></span>
        </el-tooltip>
      </template>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import * as z from '@/utils/com.js'
import request from '@/utils/request.js'
import $ from 'jquery'

export default {
  data() {
    return {
      closeState: 1
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'avatar', 'device'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
      $('.el-menu.el-menu--popup')
        .eq(0)
        .css({
          backgroundColor: 'transparent',
          display: 'none'
        })
      $('.el-menu.el-menu--popup.el-menu--popup-right-start')
        .eq(0)
        .css({
          backgroundColor: 'transparent',
          display: 'none'
        })
    },
    logout() {
      this.$confirm('此操作将注销用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        z.ld()
        request({
          url: '/sys/login/logout',
          method: 'get'
        })
          .then(() => {
            z.lc()
            window.localStorage.setItem(
              'loginInfo',
              JSON.stringify(this.closeState) // 为1表示主动退出 否则是cookie失效退出
            )

            z.clearCookie('detailname')
            z.clearCookie('staticname')
            z.clearCookie('volumename')
            this.$store.dispatch('LogOut')
            location.href = '/'
          })
          .catch(() => {
            z.lc()
            this.$message({
              type: 'info',
              message: '已取消注销'
            })
          })
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px; //47
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
      height: 20px;
      margin-top: 15px;
      line-height: 20px;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px; //4
        // margin-bottom: 1px;//
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
        // .user-avatar {
        //   width: 40px;
        //   height: 40px;
        //   border-radius: 10px;
        // }
        .fa .fa-user {
          // position: absolute;
          // right: -20px;
          // top: 20px;
          // font-size: 12px;
        }
      }
    }
  }
}
</style>
