<template>
  <div class="mobile">
    <transition name="van-fade">
      <keep-alive>
        <router-view />
      </keep-alive>
    </transition>
  </div>
</template>
<script>
import Vue from "vue"
import { Button, Tab, Tabs, Popup, Icon, Dialog, Toast, List, Cell, Field } from "vant"
import "vant/lib/index.css"

Vue.use(Button)
Vue.use(Icon)
Vue.use(Dialog)
Vue.use(Field)
Vue.use(Popup)
Vue.use(Toast)
Vue.use(Tab).use(Tabs)
Vue.use(List).use(Cell)

import { flexible, isPhone, initMenu } from "../../util/util"
import router from "@/router/router"
import store from "@/store"

// Vue.use(Tab,Button).use(Tabs);
// Vue.use(Icon, List,Popup,Field,Dialog,Toast)

export default {
  name: "mobile",
  created() {
    flexible()
    console.log("this.$router.$avueRouter.routerList", this.$router.$avueRouter.routerList)
    // debugger
    if (isPhone() && this.$router.$avueRouter.routerList.length <= 1) {
      initMenu(store, router)
    }
  },
  data: () => ({}),
  methods: {}
}
</script>
<style lang="scss">
[data-dpr] #app {
  overflow: auto;
}

[data-dpr] {
  *::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: unset;
  }
}

.m-auto-comp {
  top: pxToRem(100) !important;
}

@import "./style.scss";
</style>
