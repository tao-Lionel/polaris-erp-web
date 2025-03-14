<template>
  <div class="basic-container" :class="{ 'basic-container--block': block }">
    <el-card>
      <slot></slot>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "basicContainer",
  props: {
    block: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.basic-container {
  padding: 8px 10px;
  border-radius: 10px;
  box-sizing: border-box;
  .el-card {
    width: 100%;
    .el-card__body {
      padding: 10px 10px;
    }
  }
  .el-tabs__header {
    margin: 0 0 10px;
  }
  &:first-child {
    padding-top: 0;
  }
  &--block {
    height: 100%;
    .el-card {
      height: 100%;
    }
  }
}
</style>
