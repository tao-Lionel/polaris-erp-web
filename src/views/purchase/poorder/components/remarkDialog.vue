<template>
  <el-dialog title="编辑备注" :visible.sync="showDialog" width="500px">
    <div>
      <el-form :model="form" ref="form">
        <el-form-item label="备注">
          <el-input
            type="textarea"
            maxlength="500"
            :autosize="{ minRows: 3, maxRows: 5 }"
            v-model.trim="form.remark"
            placeholder="请输入备注，不得超过500个字符。"
          ></el-input>
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
import { updatePoorderRemarkApi } from "@/api/purchase/order/poorder"

export default {
  name: "remarkDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      form: {
        remark: "",
        purchaseOrderNo: undefined
      }
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    openDialog(remarks, purchaseOrderNo) {
      this.form.remark = remarks
      this.form.purchaseOrderNo = purchaseOrderNo
      this.showDialog = true
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { data } = await updatePoorderRemarkApi(this.form)
          if (data.code === 0) {
            this.$message.success("备注修改成功！")
          }
          this.$emit("updateList")
          this.showDialog = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
