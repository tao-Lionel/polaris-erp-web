<template>
  <el-dialog title="发起OA审批" :visible.sync="showDialog" width="500px">
    <div>
      <div class="tip">
        <span>
          <span style="font-size: 18px; color: #67c23a">{{ passed }}</span>
          条已自动审核通过
        </span>
        <br />
        <span>
          <span style="font-size: 18px; color: #f56c6c">{{ total - passed }}</span>
          条自动审核失败，需补充申请理由， 发起OA审批流程
        </span>
      </div>
      <el-form :model="form" ref="form" :rules="rules" inline>
        <el-form-item label="申请理由" prop="reviewMsg">
          <el-input
            v-model="form.reviewMsg"
            size="small"
            placeholder="请输入申请理由"
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
import { reviewProductPricingInfoBatchApi } from "@/api/product/pricing"

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
        reviewMsg: [{ required: true, message: "请输入申请理由", trigger: "blur" }]
      },
      flag: true,
      total: 0,
      passed: 0
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(filtering, total = 0, passed = 0) {
      this.form.pricingDemandQueryDto = {
        filtering
      }
      this.total = total
      this.passed = passed
      this.form.reviewMsg = ""
      this.showDialog = true
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { data } = await reviewProductPricingInfoBatchApi(this.form)
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

<style lang="scss" scoped>
.tip {
  background-color: #f5f7fa;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
}
::v-deep .el-dialog {
  height: 380px !important;
}
::v-deep .el-dialog .el-dialog__body {
  height: 250px !important;
}
</style>
