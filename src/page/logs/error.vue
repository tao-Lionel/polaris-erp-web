<template>
  <basic-container>
    <p>请打开浏览器控制台，然后点击下面的按钮</p>
    <el-button type="danger" @click="handleNewError">触发一个错误</el-button>
  </basic-container>
</template>

<script>
export default {
  methods: {
    handleNewError() {
      console.log(a) // eslint-disable-line
    }
  }
}
</script>
