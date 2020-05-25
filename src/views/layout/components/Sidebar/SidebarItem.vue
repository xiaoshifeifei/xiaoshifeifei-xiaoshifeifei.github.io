<template>
  <div class="menu-wrapper" v-if="!item.hidden&&item.children">
    <template v-if="hasOneShowingChild(item.children) && !onlyOneChild.children&&!item.alwaysShow">
      <a :href="onlyOneChild.path" @click="clickLink(onlyOneChild.path,$event)" target="_blank">
        <el-menu-item
          :class="{'submenu-title-noDropdown':!isNest}"
          :index="resolvePath(onlyOneChild.path)"
        >
          <item
            :icon="onlyOneChild.meta.icon"
            :title="onlyOneChild.meta.title"
            v-if="onlyOneChild.meta"
          />
        </el-menu-item>
      </a>
    </template>

    <el-submenu :index="item.name||item.path" v-else>
      <template slot="title">
        <!-- <svg-icon v-if="item.meta" :icon-class="item.meta.icon"></svg-icon> -->
        <item :icon="item.meta.icon" :title="item.meta.title" v-if="item.meta"/>
      </template>
      <template v-for="child in item.children">
        <template v-if="!child.hidden">
          <sidebar-item
            :base-path="resolvePath(child.path)"
            :is-nest="true"
            :item="child"
            :key="child.path"
            class="nest-menu"
            v-if="child.children && child.children.length>0"
          />
          <a
            :href="child.path"
            :key="child.name"
            @click="clickLink(child.path,$event)"
            target="_blank"
            v-else
          >
            <el-menu-item :index="resolvePath(child.path)">
              <item :icon="child.meta.icon" :title="child.meta.title" v-if="child.meta"/>
            </el-menu-item>
          </a>
        </template>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { validateURL } from '@/utils/validate'
import Item from './Item'

export default {
  name: 'SidebarItem',
  components: { Item },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return { onlyOneChild: null }
  },
  methods: {
    hasOneShowingChild(children) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          this.onlyOneChild = item
          return true
        }
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    },
    resolvePath(routePath) {
      return path.resolve(this.basePath, routePath)
    },
    isExternalLink(routePath) {
      return validateURL(routePath)
    },
    clickLink(routePath, e) {
      if (!this.isExternalLink(routePath)) {
        e.preventDefault()
        const tmp = path.resolve(this.basePath, routePath)
        this.$router.replace(tmp)
      }
    }
  }
}
</script>
<style scoped>
.menu-wrapper > .el-submenu {
  /* text-align: center; */
}
.menu-wrapper .submenu-title-noDropdown {
  /* padding-left: 65px !important; */
  /* text-align: left; */
  /* padding-right: 20px; */
}

/* 侧边栏样式    .menu-wrapper {
  marf-left: 40px !important;
} */
</style>

