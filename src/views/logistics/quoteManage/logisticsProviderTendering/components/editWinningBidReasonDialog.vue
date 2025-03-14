<template>
  <el-dialog title="修改中标物流商原因" :visible.sync="showDialog" width="500px">
    <div>
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="修改原因" prop="reason">
          <el-input v-model="form.reason" size="small" placeholder="修改原因" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button size="small" @click="showDialog = false">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "editWinningBidReasonDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      form: {
        reason: ""
      },
      rules: {
        reason: [{ required: true, message: "请输入修改原因", trigger: "blur" }]
      }
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog() {
      this.showDialog = true
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit("save", this.form.reason)
          this.showDialog = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
