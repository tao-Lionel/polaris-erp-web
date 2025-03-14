<template>
  <el-dialog title="提交审核" :visible.sync="showDialog" width="400px">
    <div>
      <!-- <el-form :model="form" ref="form" :rules="rules" inline>
        <el-form-item label="备注" prop="reviewMsg">
          <el-input v-model="form.reviewMsg" size="small" placeholder="请输入备注" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form> -->
      <div style="text-align: center; font-size: 16px; font-weight: 600">
        <i class="el-icon-warning" style="color: #e6a23c; margin-right: 10px; font-size: 18px"></i>确认提交审核?
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="showDialog = false">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { submitReviewProductPricingDemandApi } from "@/api/product/pricing"

export default {
  name: "auditDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      form: {
        pricingDemandQueryDto: {},
        reviewMsg: ""
      },
      rules: {
        reviewMsg: [{ required: true, message: "请输入备注", trigger: "blur" }]
      }
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(filtering) {
      this.form.pricingDemandQueryDto = {
        filtering
      }
      this.form.reviewMsg = ""
      this.showDialog = true
    },
    async submit() {
      // this.$refs.form.validate(async (valid) => {
      //   if (valid) {
      const { data } = await submitReviewProductPricingDemandApi(this.form)
      if (data.code === 0) {
        this.$message.success("操作成功")
        this.$emit("updateList")
        this.showDialog = false
      }
      //   }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog__header {
    background: transparent !important;
    border-bottom: none !important;
  }
  .el-dialog__footer {
    border-top: none !important;
    background: transparent !important;
  }
}
</style>
