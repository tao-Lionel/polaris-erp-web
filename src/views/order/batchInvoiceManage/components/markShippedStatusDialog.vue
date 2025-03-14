<template>
  <!-- 标记已发货-->
  <el-dialog
    title="标记已发货"
    :visible.sync="showDialog"
    width="80%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div>
      <el-table :data="sendTableData" :border="true" :max-height="400" style="width: 100%">
        <el-table-column prop="orderCode" label="发货单号"></el-table-column>
        <el-table-column prop="soOrderCode" label="系统单号"></el-table-column>
        <el-table-column prop="sourceCode" label="平台单号"></el-table-column>
        <el-table-column prop="skuList" label="商品">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.skuList" :key="index">{{ item + "\n" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="warehouseName" label="发货仓库"> </el-table-column>
        <el-table-column prop="logisticsChannel" label="物流方式"> </el-table-column>
        <el-table-column
          prop="trackingNo"
          label="跟踪号"
          v-if="orderBusinessType !== 'PO' && orderBusinessType !== 'DI'"
        >
          <template slot="header" slot-scope="scope">
            <span style="color: red">*</span>
            <span> 跟踪号 </span>
            <span style="color: #4299eb; margin-left: 10px; cursor: pointer" @click="batWrite(scope)">批量</span>
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.trackingNo" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="sendOpe" label="操作">
          <template slot-scope="scope">
            <div style="text-align: center">
              <el-button type="text" style="color: red" @click="removeSend(scope.$index, scope.row)">移除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: center; margin-top: 20px">
      <el-button size="small" style="padding: 9px 30px" @click="showDialog = false">取消</el-button>
      <el-button size="small" style="padding: 9px 30px" type="primary" @click="sendConfirm">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getMarkShippedListApi } from "@/api/order/batchInvoiceManage"

export default {
  name: "markShippedStatusDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      sendTableData: [],
      orderBusinessType: ""
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(ids, orderBusinessType) {
      this.showDialog = true
      this.orderBusinessType = orderBusinessType
      this.getDetail(ids)
    },
    async getDetail(ids) {
      let { data } = await getMarkShippedListApi(ids)
      this.sendTableData = data.data
    },
    batWrite(val) {
      let label = val.column.property
      if (label === "trackingNo") {
        let trackingNo = this.sendTableData[0].trackingNo
        this.sendTableData.forEach((item) => {
          this.$set(item, "trackingNo", trackingNo)
        })
      }
      if (label === "warehouse") {
        let warehouse = this.sendTableData[0].warehouse
        this.sendTableData.forEach((item) => {
          this.$set(item, "warehouse", warehouse)
        })
      }
      if (label === "bseOverseaCarrierCode") {
        let bseOverseaCarrierCode = this.sendTableData[0].bseOverseaCarrierCode
        this.sendTableData.forEach((item) => {
          this.$set(item, "bseOverseaCarrierCode", bseOverseaCarrierCode)
        })
      }
    },
    removeSend(index, row) {
      this.sendTableData.splice(index, 1)
    },
    async sendConfirm() {
      this.showDialog = false
      this.$emit("sendConfirm", this.sendTableData)
    }
  }
}
</script>

<style lang="scss" scoped></style>
