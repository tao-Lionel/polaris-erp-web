<template>
  <!-- 反审核至订单 -->
  <el-dialog
    title="反审核至订单"
    :visible.sync="showDialog"
    width="30%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="confirm-tips">
      <div>场景：</div>
      <div>1、订单存在异常情况，需作废发货单，暂停发货；</div>
      <div style="margin-bottom: 10px">2、发货单地址、商品、数量等有误，需修改订单信息后重新生成发货单</div>
      <p>作废发货单需满足条件：发货单状态 不为 “已发货/已签收”</p>
      <p>【反审核至订单】操作成功后，发货单作废，并自动释放占用库存。如需发货，可在【订单管理】重新生成发货单！</p>
    </div>
    <p style="font-size: 15px; text-align: center; padding: 10px">
      共<span style="color: #1380e6">{{ selectRows.length }}</span>
      个发货单，确认作废发货单吗？
    </p>
    <el-form :model="invoiceCancelForm" ref="invoiceCancelForm" style="padding: 0 20px" :rules="invoiceCancelRule">
      <el-form-item label="作废发货单原因" prop="reason" style="margin-bottom: 16px">
        <el-select v-model="invoiceCancelForm.reason" size="small" placeholder="请选择作废原因" clearable>
          <el-option v-for="item in cancelReason" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop="remark"
        label="原因备注"
        style="margin-bottom: 16px"
        v-if="invoiceCancelForm.reason === 'OTHER'"
      >
        <el-input
          v-model="invoiceCancelForm.remark"
          size="small"
          type="textarea"
          :rows="2"
          clearable
          placeholder="请输入原因备注："
        ></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align: center; margin-top: 20px">
      <el-button size="small" style="padding: 9px 30px" @click="showDialog = false">取消</el-button>
      <el-button size="small" style="padding: 8px 30px" type="primary" @click="invoiceCancelConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { batchDeleteApi } from "@/api/order/batchInvoiceManage"

export default {
  name: "reverseReviewToOrderDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      invoiceCancelForm: {
        reason: "",
        remark: ""
      },
      invoiceCancelRule: {
        reason: [{ required: true, message: "请选择作废发货单原因", trigger: "change" }]
      },
      cancelReason: [
        { label: "订单异常", value: "ORDER_ERROR" },
        { label: "发货单信息有误", value: "FO_ORDER_ERROR" },
        { label: "其他", value: "OTHER" }
      ],
      selectRows: []
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(selectRows) {
      this.showDialog = true
      this.selectRows = selectRows
    },
    async invoiceCancelConfirm() {
      this.$refs.invoiceCancelForm.validate(async (valid) => {
        if (valid) {
          let orderCodeList = this.selectRows.map((item) => item.batchOrderCode)

          for (let i = 0; i < orderCodeList.length; i++) {
            let orderCode = orderCodeList[i]
            let res = await batchDeleteApi({
              orderCode,
              deleteType: this.invoiceCancelForm.reason,
              deleteReason: this.invoiceCancelForm.remark
            })
            if (res.data.code == 0) {
              this.$message.success("反审核成功")
              this.showDialog = false
              this.$emit("updateList")
            } else {
              this.$message.error(res.data.msg)
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
