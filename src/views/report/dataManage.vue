<template>
  <div style="height: 100%; padding: 0 10px 10px">
    <iframe v-show="oaToken" ref="iframeRef" style="width: 100%; height: 100%" :src="url" frameborder="0"></iframe>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { getDataManagerTokenApi } from "@/api/common"
import { getStore } from "@/util/store"

export default {
  name: "reportDataManage",
  props: {},
  components: {},
  data() {
    return {
      oaToken: "",
      url: `${process.env.VUE_APP_OA_URL}/datamanage/datamanage`
    }
  },
  watch: {
    oaToken: {
      handler(newVal) {
        console.log("newVal", newVal)
        if (newVal) {
          this.setOaUrl()
        }
      }
    }
  },
  async created() {
    this.oaToken = ""
    await this.getDataManagerToken()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    setOaUrl() {
      let iframeRef = this.$refs.iframeRef
      console.log("iframeRef", iframeRef)
      if (iframeRef) {
        iframeRef.onload = () => {
          console.log("iframe加载完成")
          iframeRef.contentWindow.postMessage(
            {
              oaToken: this.oaToken
            },
            this.url
          )
        }
      }
    },
    async getDataManagerToken() {
      const userInfo = getStore({ name: "user_info", type: "session" })
      const { username } = userInfo
      const { data } = await getDataManagerTokenApi({ username })
      if (data.code === 0) {
        this.oaToken = data.data
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
