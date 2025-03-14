<template>
  <el-dialog title="入库延迟原因" :visible.sync="showDialog" width="500px">
    <div>
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="入库延迟原因" prop="inboundDelayReason">
          <el-input
            type="textarea"
            maxlength="500"
            :autosize="{ minRows: 3, maxRows: 5 }"
            v-model.trim="form.inboundDelayReason"
            placeholder="请输入入库延迟原因，不得超过500个字符。"
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
import { inboundDelayReasonApi } from "@/api/logistics/transfer/fristMileTransfer"

export default {
  name: "remarkDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      form: {
        inboundDelayReason: "",
        transferId: undefined
      },
      rules: {
        inboundDelayReason: [{ required: true, message: "请输入入库延迟原因", trigger: "blur" }]
      }
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    openDialog({ id, inboundDelayReason }) {
      this.form.inboundDelayReason = inboundDelayReason
      this.form.transferId = id
      this.showDialog = true
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { data } = await inboundDelayReasonApi(this.form)
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
