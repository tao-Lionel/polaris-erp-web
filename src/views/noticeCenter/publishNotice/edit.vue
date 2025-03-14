<template>
  <div>
    <add></add>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import add from "./add"

export default {
  name: "publishNoticeEdit",
  components: { add },
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
