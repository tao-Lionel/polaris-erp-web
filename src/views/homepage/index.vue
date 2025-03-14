y
<!--
  -    Copyright (c) 2018-2025, aukeyit All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the trob4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: aukeyit (aukeyit@aukeyit.com)
  -->
<!--可根据不同角色增加不同的首页-->
<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import adminHomePage from "./admin"
import editorHomePage from "./editor"
import normalHomePage from "./normal"
import outerUserHomePage from "./outerUser"

export default {
  name: "homepage",
  components: { adminHomePage, editorHomePage, normalHomePage, outerUserHomePage },
  data() {
    return {
      currentRole: "normalHomePage"
    }
  },

  computed: {
    ...mapState({
      roles: (state) => state.user.roles,
      userInfo: (state) => state.user.userInfo
    }),
    ...mapGetters(["name", "roles"])
  },
  created() {
    //根据不同角色定义不同的首页
    if (this.userInfo?.outerUser) {
      this.currentRole = "outerUserHomePage"
    } else {
      this.currentRole = "normalHomePage"
    }

    if (this.userInfo.wxOpenid === null) {
      // 暂时关闭绑定企业微信
      return
      const h = this.$createElement
      this.$msgbox({
        title: "绑定企业微信",
        message: h("p", null, [
          h("span", null, "系统检测到您还未绑定企业微信，为了能更方便接收系统消息，请进行企业微信绑定")
        ]),
        showCancelButton: true,
        confirmButtonText: "去绑定",
        cancelButtonText: "取消"
      })
        .then((action) => {
          this.$router.push({ path: "/info/index" })
        })
        .catch(() => {})
    }
  }
}
</script>
