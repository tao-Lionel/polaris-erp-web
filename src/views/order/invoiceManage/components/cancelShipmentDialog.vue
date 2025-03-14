<template>
  <el-dialog title="撤销发货" :visible.sync="showDialog" width="500px">
    <div style="color: red">
      <div>提示：</div>
      <div>若北极星的发货单状态为“已发货”，但仓库无法正常发货，此时可以使用“撤销发货”功能。</div>
      <div style="margin-bottom: 10px">
        成功撤销发货后，发货单状态将变更为“撤销发货”，撤销发货的SKU数量回退至待确认数量，可在【订单管理】重新确认订单、生成发货单！
      </div>
    </div>
    <el-form :model="form" ref="form" :rules="rules" inline>
      <el-form-item label="撤销发货原因" prop="deleteType">
        <el-select v-model="form.deleteType" size="small" placeholder="请选择作废原因" clearable>
          <el-option v-for="item in cancelReason" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button size="small" @click="showDialog = false">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { batchRevokeApi } from "@/api/order/invoiceManage"
import { getDictByType } from "@/util/auth"

export default {
  name: "cancelShipmentDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      form: {
        deleteType: ""
      },
      selectRows: [],
      rules: {
        deleteType: [{ required: true, message: "请选择撤销发货原因", trigger: "change" }]
      },
      cancelReason: []
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    async openDialog(selectRows) {
      this.showDialog = true
      this.form = { deleteType: "" }
      this.selectRows = selectRows
      this.cancelReason = await getDictByType("fo_order_revoke_type")
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          console.log(this.form)
          const params = {
            orderCodeList: this.selectRows.map((item) => item.orderCode),
            deleteType: this.form.deleteType,
            deleteReason: ""
          }
          const { data } = await batchRevokeApi(params)
          if (data.code === 0) {
            this.$message.success("撤销发货成功")
            this.$emit("updateList")
            this.showDialog = false
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
