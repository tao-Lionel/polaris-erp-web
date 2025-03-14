<template>
  <div class="mobile-df">
    <ul class="m-history" v-if="historyViewed && historyViewed.length > 0">
      <li class="m-menu">
        <p class="m-menu-title">
          <span>历史浏览</span>
          <van-button @click="cleanHistory" class="m-clean-his" size="mini" type="primary">清 空</van-button>
        </p>
      </li>
      <li class="m-menu-item" @click="setViewLogAndRouterFn(v)" v-for="(v, k) in historyViewed" :key="k">
        <i :style="[{ color: v.color }]" :class="[v.icon, 'm-menu-icon']"></i>
        <p class="m-menu-name el-row-text">{{ v.name }}</p>
      </li>
    </ul>
    <van-tabs v-model="active" border sticky color="#2a8efe" @scroll="tabsScroll" @click="tabsChange">
      <van-tab
        v-for="(t, i) in filterMenu(menu)"
        :key="i"
        v-if="t.hasMobileRouter && t.hasMobileRouter === true"
        :title="t.name"
      ></van-tab>
      <div
        v-for="(item, index) in filterMenu(menu)"
        :ref="'menuContent_' + index"
        class="m-menu"
        v-if="item.hasMobileRouter"
        :key="index"
      >
        <p :id="index" class="m-menu-title">{{ item.name }}</p>
        <ul>
          <li
            class="m-menu-item"
            :class="{ 'm-disable-router': v.disableMobileRouter }"
            @click="setViewLogAndRouterFn(v)"
            v-for="(v, k) in item.children"
            :key="k"
            v-if="v.children.length === 0 && v.hasMobileRouter"
          >
            <i :style="[{ color: v.color }]" :class="[v.icon, 'm-menu-icon']"></i>
            <p class="m-menu-name el-row-text">{{ v.name }}</p>
          </li>
          <li
            class="m-menu-item"
            @click="setViewLogAndRouterFn(v)"
            v-for="(vc, kc) in formatMenu(item.children)"
            :key="kc"
            v-if="item.children.length !== 0 && vc.hasMobileRouter"
          >
            <i :style="[{ color: v.color }]" :class="[vc.icon, 'm-menu-icon']"></i>
            <p class="m-menu-name el-row-text">{{ vc.name }}</p>
          </li>
        </ul>
      </div>
    </van-tabs>
  </div>
</template>
<script>
import { vantTabsScrollToTarget } from "../../util/util"
import { preventShake } from "@/util/tool"
import { mapGetters } from "vuex"
import { getStore, setStore, removeStore } from "@/util/store"
import { Dialog } from "vant"
import { menuAuthConfig } from "../../util/menuAuthConfig"
import Toast from "vant/es/toast"
// import Cookies from 'js-cookie'
export default {
  name: "mobile_df",
  data: () => ({
    active: 0,
    tabsList: [],
    historyViewed: null
  }),
  computed: {
    ...mapGetters(["menu"])
  },
  activated() {
    this.historyViewed = (this.getStoreViewed() || []).reverse()
  },
  methods: {
    tabsChange(key) {
      let ele = this.$refs[`menuContent_${key}`]
      vantTabsScrollToTarget(ele)
    },
    tabsScroll() {
      let _this = this
      preventShake.preventShake(function (bool) {
        if (bool) {
          let vantTabs = document.getElementsByClassName("van-tabs")[0]
          let vantContent = document.getElementsByClassName("van-tabs__content")[0]

          vantTabs = vantTabs || null
          if (vantTabs) {
            const refsList = Object.keys(_this.$refs).filter((item) => {
              return item.includes("menuContent_")
            })
            refsList &&
              refsList.forEach((item, index) => {
                if (_this.$refs[item] && _this.$refs[item].length > 0) {
                  // const vTop = vantTabs.offsetTop;
                  const vTop = vantTabs.getBoundingClientRect().top
                  const top = _this.$refs[item][0].getBoundingClientRect().top
                  const height = _this.$refs[item][0].offsetHeight
                  const mMenu = vantContent.querySelector(".m-menu")

                  if (mMenu) {
                    const firstEleAbsoluteTop = mMenu.getBoundingClientRect().top

                    if (index === 0 && firstEleAbsoluteTop > vantContent.offsetTop && _this.active !== 0) {
                      _this.active = 0
                    }

                    if (top < vantContent.offsetTop && top > vTop - height) {
                      _this.active = Number(item.split(/_/g)[1])
                    }
                  }
                }
              })
          }
        }
      }, 100)
    },
    setViewLogAndRouterFn(v) {
      if (v.disableMobileRouter) {
        console.log(this)
        Toast("开发规划中，敬请期待...")
        return
      }
      const log = this.getStoreViewed()
      if (!v.path) return
      const obj = { name: v.name, path: v.path, icon: v.icon, color: v.color }
      let result = log.filter((item) => item.path !== v.path)
      result.push(obj)
      if (result.length > 12) {
        result.splice(-12)
      }
      // Cookies.set('m_viewed', result, { path: '' });
      setStore({ name: "m_viewed", content: result })

      this.$router.push(`/mobile${v.path}`)
    },
    getStoreViewed: () => getStore({ name: "m_viewed" }) || [],
    cleanHistory() {
      Dialog.confirm({
        title: "提示",
        message: "是否清除历史浏览记录？"
      })
        .then((res) => {
          removeStore({ name: "m_viewed" })
          this.historyViewed = []
        })
        .catch((err) => {})
    },
    formatMenu(list) {
      let new_list = []
      list.forEach((item) => {
        if (item.children.length > 0) {
          item.children.map((v) => {
            new_list.push(v)
          })
        }
      })
      return new_list
    },
    filterMenu(menu) {
      function mapMenu(list, oldItem) {
        if (list instanceof Array) {
          list.forEach((item) => {
            // const verifyPath = menuAuthConfig.indexOf(item.path);

            const verifyPath = menuAuthConfig.map((val) => val.path).indexOf(item.path)
            if (verifyPath > -1) {
              if (oldItem) {
                // 一级目录
                oldItem.hasMobileRouter = true
              }
              item.hasMobileRouter = true
              if (menuAuthConfig[verifyPath].color) {
                item.color = menuAuthConfig[verifyPath].color
              }

              if (verifyPath > 4) {
                /*
                 * 暂未开发完成的手机端路由映射,判断中的1为： menuAuthConfig.js文件中可用的下标
                 * */
                item.disableMobileRouter = true
              }
            }

            item.children && mapMenu(item.children, item)
          })
        }
      }

      // console.log(menu);
      console.log(4)

      mapMenu(menu)
      return menu
    }
  }
}
</script>
<style lang="scss" scoped>
/*@import "./style.scss";*/
</style>
