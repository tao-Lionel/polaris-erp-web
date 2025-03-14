<template>
  <div class="avue-contail" :class="{ 'avue--collapse': isCollapse }">
    <div class="avue-header">
      <!-- 顶部导航栏 -->
      <top />
    </div>

    <div class="avue-layout">
      <div class="avue-left">
        <!-- 左侧导航栏 -->
        <sidebar />
      </div>
      <div class="avue-main">
        <!-- 顶部标签卡 -->
        <tags ref="tagNavigate" />
        <!-- 主体视图层 -->
        <div class="scrollView">
          <keep-alive :max="20">
            <router-view class="avue-view" :key="key" v-if="$route.meta.$keepAlive" />
          </keep-alive>
          <router-view :key="key" v-if="!$route.meta.$keepAlive"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import tags from "./tags"
import top from "./top/"
import sidebar from "./sidebar/"
import admin from "@/util/admin"
import { validatenull } from "@/util/validate"
// import { calcDate } from "@/util/date.js";
import { getStore } from "@/util/store.js"
import { tableHeaderFixed, fixedTableHeader } from "@/util/tool"
import color from "@/mixins/color"
export default {
  name: "mainApplication",
  mixins: [color()],
  components: {
    top,
    tags,
    sidebar
  },
  name: "index",
  data() {
    return {
      //刷新token锁
      refreshLock: false,
      //刷新token的时间
      refreshTime: ""
    }
  },
  created() {
    //实时检测刷新token
    //this.refreshToken();
    this.$nextTick(function () {
      tableHeaderFixed()
    })
  },
  destroyed() {
    clearInterval(this.refreshTime)
  },
  updated() {
    // 防止路由滚动缓存
    this.$nextTick(() => {
      this.initTableHeader()
    })
  },
  mounted() {
    this.init()
  },
  computed: {
    ...mapGetters(["isLock", "isCollapse", "website", "expires_in"]),
    key() {
      return this.$route.fullPath
    }
  },
  props: [],
  methods: {
    // 屏幕检测
    init() {
      this.$store.commit("SET_SCREEN", admin.getScreen())
      window.onresize = () => {
        setTimeout(() => {
          this.$store.commit("SET_SCREEN", admin.getScreen())
        }, 0)
      }
    },
    // 实时检测刷新token
    refreshToken() {
      this.refreshTime = setInterval(() => {
        const token = getStore({
          name: "access_token",
          debug: true
        })

        if (validatenull(token)) {
          return
        }

        if (this.expires_in <= 50 && !this.refreshLock) {
          this.refreshLock = true
          this.$store.dispatch("RefreshToken").catch(() => {
            clearInterval(this.refreshTime)
          })
          this.refreshLock = false
        }
        this.$store.commit("SET_EXPIRES_IN", this.expires_in - 10)
      }, 10000)
    },
    initTableHeader() {
      let scrollView = document.getElementsByClassName("scrollView").item(0)
      if (scrollView) {
        fixedTableHeader(scrollView, this.isCollapse)
      }
    }
  }
}
</script>
<style lang="scss">
@import "./index.scss";

.y-form-select {
  // max-width: 550px;
}

.scrollView {
  height: calc(100% - 40px);
  // overflow: scroll;
  // 隐藏右边外部滚动条
  overflow: auto;
  //针对火狐浏览器滚动条样式
  // scrollbar-width: auto;
  scrollbar-width: auto; /* 设置滚动条宽度：auto, thin 或 none */
  //  添加全局的滚动条样式
  &::-webkit-scrollbar-track {
    background: #f0f0f0; /* 滚动条背景 */
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(188, 191, 193, 0.4); /* 滚动条滑块颜色 */
    border-radius: 6px; /* 滑块圆角 */
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(188, 191, 193, 0.75); /* 滑块悬停颜色 */
  }
}

#app .el-carousel__button {
  width: 5px;
  height: 5px;
  border-radius: 3px;
}

// @keyframes animateTop {
//   from {
//top: 97px;
// }
// to {
// top: 105px;
// }
// }

.fixedTop {
  position: fixed;
  transition: all 0.5s;
  // top: 0;
  z-index: 100;
  -moz-box-shadow: 0px 3px 6px #999;
  -webkit-box-shadow: 0px 3px 6px #999;
  box-shadow: 0px 3px 6px #999;
  // animation: animateTop 0.5s;
}

// @media screen and (max-width: 992px) {
//   .fixedTop {top: 55px;}
//   @keyframes animateTop {
//     from {top: 50px;}
//     to {top: 55px;}
//   }
// }
.fixedTop-checkBox {
  position: fixed;
  top: 110px;
  left: 276px;
}

.y-table-hide {
  display: none;
}

.avue-crud__menu {
  overflow: auto;
}
</style>
