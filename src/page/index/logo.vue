<template>
  <div class="avue-logo">
    <transition name="fade">
      <span v-if="keyCollapse" class="avue-logo_subtitle" key="0">
        <i :class="website.logo"></i>
      </span>
    </transition>
    <transition-group name="fade">
      <template v-if="!keyCollapse">
        <span class="avue-logo_title" key="1">{{ isOuterUser ? "ERP系统" : website.indexTitle }}</span>
      </template>
    </transition-group>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { getStore } from "@/util/store"

export default {
  name: "logo",
  data() {
    return {}
  },
  created() {},
  computed: {
    ...mapGetters(["website", "keyCollapse"]),
    isOuterUser() {
      const userInfo = getStore({ name: "user_info", type: "session" })
      return userInfo?.outerUser
    }
  },
  methods: {}
}
</script>

<style lang="scss">
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-active {
  transition: opacity 2.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.avue-logo {
  position: fixed;
  top: 0;
  left: 0;
  width: 220px;
  height: 50px;
  line-height: 50px;
  background-color: #20222a;
  font-size: 20px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  color: rgba(255, 255, 255, 0.8);
  z-index: 1024;
  &_title {
    display: block;
    text-align: center;
    font-weight: 300;
    font-size: 16px;
  }
  &_subtitle {
    display: block;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
  }
}
</style>
