<template>
  <div class="execution" id="outQuantityInfo">
    <basic-container>
      <!--查看关单详情(调拨出库生成报关)-->
      <el-dialog title="报关单信息" :visible.sync="showDialog" width="26%" height="60%">
        <el-table :data="outQuantityTableData" height="280" border>
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column
            property="outQuantity"
            width="90"
            label="报关数量"
            v-if="isShowOutQuantity"
          ></el-table-column>
          <el-table-column property="declareCustomNo" label="报关单号"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="showDialog = false">关闭</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { getOutQuantityShowByPurnoAndSkuAndPrice } from "@/api/finance/purchaseinvoice/purchaseinvoice"
import { getOutQuantityShowByInvoiceId } from "@/api/finance/purchaseinvoice/purchaseinvoice"
import { mapGetters } from "vuex"

export default {
  name: "outQuantityInfo",
  props: {
    isShowOutQuantity: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showDialog: false,
      outQuantityTableData: []
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    //通过param查询关单信息
    findOutQuantityView(param) {
      this.outQuantityTableData = []
      if (this.isShowOutQuantity) {
        getOutQuantityShowByPurnoAndSkuAndPrice(param).then((response) => {
          this.outQuantityTableData = response.data.data
          this.showDialog = true
        })
      } else {
        getOutQuantityShowByInvoiceId(param.invoiceId).then((response) => {
          this.outQuantityTableData = response.data.data
          this.showDialog = true
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
