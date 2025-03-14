<template>
  <div>
    <create></create>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import create from "./create"

export default {
  name: "purchasePoOrderEdit",
  components: { create },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  created() {},
  mounted: function () {},
  methods: {}
}
</script>

<style lang="scss" scoped></style>
