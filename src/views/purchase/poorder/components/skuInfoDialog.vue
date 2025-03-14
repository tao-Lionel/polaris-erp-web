<template>
  <el-dialog v-resize-dialog title="采购明细" :visible.sync="showDialog" width="80%">
    <div>
      <avue-crud :data="skuInfoData" :option="skuInfoDialogOption">
        <template slot-scope="scope">
          <span :title="scope.row.skuName" class="el-row-text">{{ scope.row.skuName }}</span>
        </template>
      </avue-crud>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showDialog = false" size="small">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { skuInfoDialogOption } from "../list.js"
import { showSkuInfo } from "@/api/purchase/order/poorder"

export default {
  name: "purchasePoOrderSkuInfoDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      skuInfoData: [],
      skuInfoDialogOption
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(purchaseOrderNo) {
      this.showDialog = true
      showSkuInfo({ purchaseOrderNo }).then(({ data }) => {
        if (data.code == 0) {
          this.skuInfoData = data.data
        } else {
          this.$message.error("查询采购明细失败")
          return
        }
      })
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit("updateList")
          this.showDialog = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
