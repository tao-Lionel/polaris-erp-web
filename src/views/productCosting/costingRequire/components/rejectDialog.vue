<template>
  <el-dialog title="核价需求-驳回" :visible.sync="showDialog" width="500px">
    <div>
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="驳回原因" prop="rejectReason">
          <el-input
            v-model="form.rejectReason"
            size="small"
            placeholder="驳回原因"
            type="textarea"
            :rows="5"
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
import { rejectProductPricingDemandApi } from "@/api/product/pricing"

export default {
  name: "rejectDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      form: {
        pricingDemandList: "",
        rejectReason: ""
      },
      rules: {
        rejectReason: [{ required: true, message: "请输入驳回原因", trigger: "blur" }]
      }
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(pricingDemandIds) {
      this.form.pricingDemandList = pricingDemandIds
      this.form.rejectReason = ""
      this.showDialog = true
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { data } = await rejectProductPricingDemandApi(this.form)
          if (data.code === 0) {
            this.$message.success("操作成功")
            this.$emit("updateList")
            this.showDialog = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
