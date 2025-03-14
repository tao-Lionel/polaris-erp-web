<template>
  <div class="execution" style="height: 100%; padding: 0 10px 10px">
    <iframe style="width: 100%; height: 100%" :src="url" frameborder="0"></iframe>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
export default {
  name: "storageAgeReport",
  data() {
    return {
      // https://report.sweetnight.com.cn/webroot/decision/link/3BcG  // 生产环境
      url: "http://192.168.1.249:8084/webroot/decision/link/e6Wf"
    }
  },
  created() {
    if (process.env.NODE_ENV === "development") {
      console.log("开发环境 ")
      this.url = "http://192.168.1.249:8084/webroot/decision/link/e6Wf"
    } else {
      console.log("生产环境 ")
      this.url = "https://report.sweetnight.com.cn/decision/link/3BcG"
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {}
}
</script>
