<template>
  <div></div>
</template>

<script>
import request from "@/router/axios"
import { mapGetters } from "vuex"
export default {
  name: "authredirect",
  computed: {
    ...mapGetters(["tagWel"])
  },
  created() {
    const params = this.$route.query
    const state = params.state
    const code = params.code
    const type = params.type
    console.log("authredirect", params)
    if (type === "BIND") {
      request({
        url: "/admin/social/bind",
        method: "post",
        params: { state, code }
      }).then(() => {
        this.$alert("企业微信绑定成功", "成功", {
          confirmButtonText: "确定",
          callback: (action) => {
            window.close()
          }
        })
      })
    } else {
      // window.close()
      console.log("url================", `${window.location.origin}/#/login?state=${state}&code=${code}`)
      // window.opener.location.href = `${window.location.origin}/login?state=${state}&code=${code}`
      window.location.replace(`${window.location.origin}/#/login?state=${state}&code=${code}`)
    }
  }
}
</script>

<style></style>
