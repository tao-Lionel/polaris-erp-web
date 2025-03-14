<template>
  <el-dialog
    title="修改备注"
    :visible.sync="showDialog"
    width="40%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div style="padding: 10px 20px">
      <el-form :model="formData" ref="markValidateForm" label-width="100px" class="mark-ruleForm">
        <el-form-item label="备注" prop="mark" :rules="[{ required: true, message: '备注不能为空' }]">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入内容"
            v-model="formData.mark"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div style="text-align: center; margin-top: 20px">
      <el-button size="small" style="padding: 9px 30px" @click="showDialog = false">取消</el-button>
      <el-button size="small" style="padding: 9px 30px" type="primary" @click="sendConfirm">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { uploadOmsFoBatchMark } from "@/api/order/batchInvoiceManage"
export default {
  name: "changeMark",
  components: {},
  data() {
    return {
      showDialog: false,
      sendTableData: [],
      orderBusinessType: "",
      formData: {
        mark: "",
        platformFoOrder: []
      },
      selectRows: []
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    openDialog(selectRows) {
      this.selectRows = selectRows
      this.showDialog = true
      this.formData = {
        mark: "",
        platformFoOrder: []
      }
      this.$refs["markValidateForm"].resetFields()
    },

    async sendConfirm() {
      if (this.selectRows.some((item) => !item.extendCode)) {
        this.$message.warning("选中的数据中有ARN/排柜号为空的")
        return
      }
      this.formData.platformFoOrder = this.selectRows.map(({ extendCode }) => extendCode)
      const { data } = await uploadOmsFoBatchMark(this.formData)
      if (data.code == 0) {
        this.$message.success("修改成功")
        this.$emit("success")
        this.showDialog = false
        this.formData = {
          mark: "",
          platformFoOrder: []
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .mark-ruleForm .el-form-item__content {
  margin-left: 0 !important;
}
</style>
