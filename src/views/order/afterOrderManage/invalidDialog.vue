<template>
  <el-dialog title="作废" :visible="value" width="40%" @closed="addCancel" @close="addCancel">
    <basic-container>
      <el-form ref="invalidForm" :model="addRemarkForm" :rules="addRemarkFormRules" status-icon>
        <div class="flex-invalid-input">
          <p style="color: #d9001b; margin-bottom: 10px">提示：作废售后工单，售后工单产生的新订单也会取消！</p>
          <el-form-item style="width: 350px; margin-bottom: 0; margin-right: 30px" label="作废原因" prop="remark">
            <el-input size="small" style="width: 250px" v-search-input-trim v-model="addRemarkForm.remark"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="flex-invalid" style="text-align: center; margin-top: 20px">
        <el-button size="small" style="padding: 9px 30px" @click="addCancel">取消</el-button>
        <el-button size="small" style="padding: 9px 30px" type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </basic-container>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex"

import { cancelWorkOrder } from "@/api/order/afterOrderManage.js"

export default {
  name: "addRemarkDialog",
  props: {
    value: {
      default: false,
      required: true,
      type: Boolean
    },
    workOrderCode: {
      required: true,
      default: "",
      type: String
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  watch: {
    workOrderCode(val, oldVal) {
      this.addRemarkForm.workOrderCode = val
    }
  },
  data() {
    return {
      searchForm: {},
      addRemarkForm: {
        remark: "",
        workOrderCode: ""
      },
      addRemarkFormRules: {
        remark: [{ required: true, message: "请输入作废原因", trigger: "change" }]
      }
    }
  },
  methods: {
    addCancel() {
      this.$emit("input", false)
      this.addRemarkForm.remark = ""
      // this.addRemarkForm.workOrderCode = ""
    },
    async handleConfirm() {
      await this.$refs.invalidForm.validate()
      const { data } = await cancelWorkOrder(this.addRemarkForm)
      if (data.code === 0) {
        this.$message.success("提交成功")
        this.$emit("input", false)
        this.$emit("success")
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flex-invalid-input {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.flex-invalid {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
