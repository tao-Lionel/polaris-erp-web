<template>
  <div class="execution" style="height: 100%; padding: 0 10px 10px">
    <iframe
      style="width: 100%; height: 100%"
      src="https://app.powerbi.com/view?r=eyJrIjoiM2QyMDQ0YzEtY2FmNC00ODRjLTgwMjEtMzljODJiMjIxNjlkIiwidCI6IjU2NDQ2MmE1LTk1OGYtNGVlZS05OWJiLTRkYTAyYTA4ZDUzZSIsImMiOjF9"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script>
import { fetchList } from "@/api/report/stockreporteveryday"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "stockreporteveryday",
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
