<template>
  <div>
    <create></create>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import create from "./create"

export default {
  name: "linkSkuManageEdit",
  components: { create },
  data() {
    return {}
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>
