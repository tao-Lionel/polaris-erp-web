<template>
  <div style="height: 100%; padding: 0 10px 10px">
    <iframe v-if="url" style="width: 100%; height: 100%" :src="url" frameborder="0"></iframe>
    <div v-else>{{ msg }}</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import biReport from "@/mixins/biReport"

export default {
  name: "storageAgeReport",
  mixins: [biReport("d5346abcdf6a4287bb05a1314aa5b6e8")],
  data() {
    return {
      url: "",
      msg: ""
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {}
}
</script>
