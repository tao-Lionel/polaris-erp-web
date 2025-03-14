<!-- 详情头部 -->
<template>
  <div style="overflow: hidden">
    <div class="iod-header-title" style="font-size: 20px; float: left">{{ options.title }}</div>
    <div class="pull-flex" style="overflow: hidden; float: right">
      <p v-show="item.value" class="de-t-item" v-for="(item, i) in options.list" :key="i">
        <span>{{ item.label }}：</span>
        <span style="color: #999">{{ item.value }}</span>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: {
    options: Object
  }
}
</script>
