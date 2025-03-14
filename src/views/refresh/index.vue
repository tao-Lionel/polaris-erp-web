<script>
export default {
  activated() {
    const { params, query } = this.$route
    const { path } = params
    //跳转回原来页面
    this.$router.replace({ path: "/" + path, query })
  },
  render: function (h) {
    return h()
  }
}
</script>
