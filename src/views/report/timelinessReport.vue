<template>
  <div class="execution" style="height: 100%; padding: 0 10px 10px">
    <iframe style="width: 100%; height: 100%" :src="url" frameborder="0"></iframe>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
export default {
  name: "timelinessReport",
  data() {
    return {
      url: "http://192.168.1.92/decision/link/dEuO"
    }
  },
  created() {
    if (process.env.NODE_ENV === "development") {
      // 开发环境
      this.url = "http://192.168.1.92/decision/link/dEuO"
    } else {
      // 生产环境
      this.url = "https://report.sweetnight.com.cn/decision/link/dEuO"
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {}
}
</script>
