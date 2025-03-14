<!-- 详情两栏或者多栏，自适应 -->
<template>
  <base-contain :options="options">
    <div class="flex-spance-between target-edit">
      <div class="flex-1" :style="listClassFilter(i)" v-for="(item, i) in options.list" :key="i">
        <span>{{ item.label }}：</span>
        <span>{{ item.value }}</span>
      </div>
    </div>
  </base-contain>
</template>
<script>
import baseContain from "../base.vue"
export default {
  data() {
    return {}
  },
  props: {
    options: Object
  },
  methods: {
    listClassFilter(index) {
      if (this.options && this.options.list && this.options.list.length > 0) {
        if (index < this.options.list.length - 1) {
          return {
            borderRight: "1px solid #e7ebef"
          }
        }
      }
    }
  },
  components: {
    baseContain
  }
}
</script>
