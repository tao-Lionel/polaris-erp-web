<template>
  <component :is="detailTemplate" v-bind:options="options"></component>
</template>
<script>
import t1 from "./t1.vue"
import t2 from "./t2.vue"
export default {
  name: "detail-template",
  data() {
    return {
      detailTemplate: null
    }
  },
  props: {
    options: Object
  },
  created() {
    switch (this.options.template) {
      case 1:
        this.detailTemplate = t1
        break
      case 2:
        this.detailTemplate = t2
    }
  }
}
</script>
