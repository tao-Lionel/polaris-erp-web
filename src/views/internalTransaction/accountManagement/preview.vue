<template>
  <div style="height: 100%; padding: 0 10px 10px">
    <div>
      <el-button type="primary" @click="back" size="small">返回</el-button>
    </div>

    <iframe :src="src" frameborder="0" width="100%" height="100%" scrolling="auto"></iframe>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { getTokenUrl } from "@/util/auth"

export default {
  name: "accountManagementPreview",
  components: {},
  data() {
    return {
      type: this.$route.query.type,
      url: this.$route.query.url,
      src: ""
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  created() {},
  mounted: function () {
    this.openFile()
  },
  methods: {
    openFile() {
      this.src = getTokenUrl(this.url)
    }
  }
}
</script>

<style lang="scss" scoped></style>
