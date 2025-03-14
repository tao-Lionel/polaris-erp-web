<template>
  <div class="el-custom-info">
    <i class="el-icon-warning icon-curstom-wn"></i>
    <span v-if="typeof title === 'string'" class="el-custom-tip">{{ title }}</span>
    <ul v-else class="el-custom-tip">
      <li v-for="(v, k) in title" :key="k">{{ v }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "commonTip",
  props: {
    title: String || Array
  }
}
</script>

<style lang="scss" scoped>
.el-custom-info {
  background: #edf3ff;
  border: 1px solid #b7cefe;
  display: flex;
  padding: 10px;
  border-radius: 4px;
  align-items: center;
  margin-bottom: 10px;
  .icon-curstom-wn {
    margin-right: 10px;
    color: #4a85fd;
    font-size: 16px;
  }
  .el-custom-tip {
    color: #585a5d;
  }
}
</style>
