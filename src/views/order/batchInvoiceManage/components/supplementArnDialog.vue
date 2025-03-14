<template>
  <el-dialog title="填写ARN/排柜号" :visible.sync="showDialog" width="500px">
    <div>
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="ARN/排柜号" prop="platformFoOrder">
          <el-input v-model="form.platformFoOrder" size="small" placeholder="ARN/排柜号"></el-input>
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
import { updateArnApi } from "@/api/order/batchInvoiceManage"

export default {
  name: "supplementArnDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      form: {
        batchOrderCode: "",
        platformFoOrder: "",
        shopId: ""
      },
      rules: {
        platformFoOrder: [{ required: true, message: "请输入ARN/排柜号", trigger: "blur" }]
      }
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog({ batchOrderCode, shopId, extendCode }) {
      this.form.batchOrderCode = batchOrderCode
      this.form.platformFoOrder = extendCode
      this.form.shopId = shopId
      this.showDialog = true
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          updateArnApi(this.form).then((res) => {
            this.$message.success("修改成功")
            this.$emit("updateList")
            this.showDialog = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
