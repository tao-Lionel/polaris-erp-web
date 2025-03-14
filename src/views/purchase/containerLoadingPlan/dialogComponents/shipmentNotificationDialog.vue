<template>
  <el-dialog title="关联出货通知单" :visible.sync="visible" width="30%" :before-close="handleClose">
    <div class="purchase-box">
      <el-form ref="form" :model="purchaseForm">
        <span v-for="(item, index) in purchaseForm.shippingNoticeNoList" :key="index">
          <el-form-item
            :label-width="'120px'"
            :label="`出货通知单号${index + 1}`"
            :prop="`shippingNoticeNoList[${index}].shippingNoticeNo`"
            :rules="rules.purchaseNo"
          >
            <el-input
              style="width: 80%"
              size="small"
              v-model="item.shippingNoticeNo"
              :placeholder="`请输入`"
              clearable
            ></el-input>
            <i style="margin-left: 10px" class="el-icon-plus" @click="handleAdd"></i>
          </el-form-item>
        </span>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="handleConfirm">确 定</el-button>
      <el-button size="small" @click="visible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex"
import { relatedShippingNotice } from "@/api/purchase/containerLoadingPlan/index.js"

export default {
  name: "shipmentNotificationDialog",
  components: {},
  data() {
    return {
      visible: false,
      purchaseForm: {
        deliveryPlanCode: "",
        shippingNoticeNoList: [
          {
            shippingNoticeNo: ""
          }
        ]
      },
      rules: {
        purchaseNo: [{ required: true, message: "请输入出货通知单号", trigger: "blur" }]
      }
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    openDialog(row) {
      this.visible = true
      this.purchaseForm.deliveryPlanCode = row.deliveryPlanCode
      this.purchaseForm.shippingNoticeNoList = [{ shippingNoticeNo: "" }]
    },
    handleAdd() {
      this.purchaseForm.shippingNoticeNoList.push({ shippingNoticeNo: "" })
    },
    handleConfirm() {
      this.$refs.form.validate((vaild) => {
        if (vaild) {
          const postData = {
            deliveryPlanCode: this.purchaseForm.deliveryPlanCode,
            shippingNoticeNoList: this.purchaseForm.shippingNoticeNoList.map((item) => item.shippingNoticeNo)
          }
          console.log(" this.purchaseForm", postData)
          relatedShippingNotice(postData).then((res) => {
            if (res.data.code == 0) {
              this.$message.success("关联成功")
              this.$emit("success")
              this.visible = false
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.purchase-box {
  padding: 20px;
  .el-icon-plus {
    cursor: pointer;
  }
}
::v-deep .el-form-item__content {
  margin-left: 0 !important;
}
</style>
