<template>
  <div class="avue-top">
    <div class="top-bar__left">
      <div class="avue-breadcrumb" v-if="showCollapse">
        <i
          class=""
          :class="[{ 'icon-shouqi menu_collapse': !isCollapse, 'icon-zhankai menu_collapse': isCollapse }]"
          @click="setCollapse"
        ></i>
      </div>
    </div>
    <h1 class="top-bar__title">
      <div class="top-bar__item top-bar__item--show" v-if="showMenu">
        <top-menu></top-menu>
      </div>
      <div class="top-bar__item" v-if="showSearch">
        <top-search></top-search>
      </div>
    </h1>
    <div class="top-bar__right">
      <el-tooltip v-if="showColor" effect="dark" content="主题色" placement="bottom">
        <div class="top-bar__item">
          <top-color></top-color>
        </div>
      </el-tooltip>
      <el-tooltip v-if="!userInfo.outerUser" effect="dark" content="下载列表" placement="bottom">
        <div class="top-bar__item">
          <topDownload />
        </div>
      </el-tooltip>
      <el-tooltip
        v-if="showDebug && !userInfo.outerUser"
        effect="dark"
        :content="logsFlag ? '没有错误日志' : `${logsLen}条错误日志`"
        placement="bottom"
      >
        <div class="top-bar__item">
          <top-logs></top-logs>
        </div>
      </el-tooltip>
      <el-tooltip v-if="showLock" effect="dark" content="锁屏" placement="bottom">
        <div class="top-bar__item">
          <top-lock></top-lock>
        </div>
      </el-tooltip>
      <el-tooltip v-if="showTheme" effect="dark" content="特色主题" placement="bottom">
        <div class="top-bar__item top-bar__item--show">
          <top-theme></top-theme>
        </div>
      </el-tooltip>
      <el-tooltip v-if="showFullScren" effect="dark" :content="isFullScren ? '退出全屏' : '全屏'" placement="bottom">
        <div class="top-bar__item">
          <i :class="isFullScren ? 'icon-tuichuquanping' : 'icon-quanping'" @click="handleScreen"></i>
        </div>
      </el-tooltip>
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userInfo.displayname }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/">首页</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/info/index">个人信息</router-link>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout" divided>退出系统</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <top-setting v-if="!userInfo.outerUser"></top-setting>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex"
import { fullscreenToggel, listenfullscreen } from "@/util/util"
import topDownload from "./top-download"
import topLock from "./top-lock"
import topMenu from "./top-menu"
import topSearch from "./top-search"
import topBreadcrumb from "./top-breadcrumb"
import topColor from "./top-color"
import topTheme from "./top-theme"
import topLogs from "./top-logs"
import topSetting from "./top-setting"
import { fixedTableHeader } from "@/util/tool.js"
export default {
  components: { topDownload, topLock, topMenu, topSearch, topBreadcrumb, topColor, topTheme, topLogs, topSetting },
  name: "top",
  data() {
    return {}
  },
  filters: {},
  created() {},
  mounted() {
    listenfullscreen(this.setScreen)
  },
  computed: {
    ...mapState({
      showDebug: (state) => state.common.showDebug,
      showColor: (state) => state.common.showColor,
      showTheme: (state) => state.common.showTheme,
      showLock: (state) => state.common.showLock,
      showFullScren: (state) => state.common.showFullScren,
      showCollapse: (state) => state.common.showCollapse,
      showSearch: (state) => state.common.showSearch,
      showMenu: (state) => state.common.showMenu
    }),
    ...mapGetters(["userInfo", "isFullScren", "tagWel", "tagList", "isCollapse", "tag", "logsLen", "logsFlag"])
  },
  methods: {
    handleScreen() {
      fullscreenToggel()
    },
    setCollapse() {
      this.$store.commit("SET_COLLAPSE")
      /**
       * 处理菜单栏在缩放时，表格头部不能缩放
       */
      this.$nextTick(function () {
        this.$parent.$children.map((val) => {
          const leftSidebar = val.$el.classList.contains("avue-sidebar")
          if (leftSidebar) {
            val.$el.parentNode.addEventListener(
              "transitionend",
              function () {
                let scrollView = Array.from(document.getElementsByClassName("scrollView"))[0]
                fixedTableHeader(scrollView)
              },
              false
            )
          }
        })
      })
    },
    setScreen() {
      this.$store.commit("SET_FULLSCREN")
    },
    logout() {
      this.$confirm("是否退出系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            this.$router.push({ path: "/login" })
          })
        })
        .catch((res) => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.menu_collapse {
  line-height: 50px;
  font-size: 21px !important;
  cursor: pointer;
}
</style>
