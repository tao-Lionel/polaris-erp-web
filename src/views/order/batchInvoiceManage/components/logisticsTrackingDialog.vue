<template>
  <el-dialog id="dialogBox" title="查看物流轨迹" :visible.sync="showDialog" center width="80%">
    <avue-crud
      ref="crud"
      :data="logisticsData"
      :option="tableOption"
      @on-load="getList"
      @refresh-change="refreshChange"
    >
      <template slot="time_raw" slot-scope="scope">
        <span>{{ scope.row.time_raw.date }} {{ scope.row.time_raw.time }}</span>
      </template>
    </avue-crud>

    <span slot="footer">
      <el-button size="small" @click="showDialog = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { logisticsTrackingOption } from "@/const/crud/order/invoiceManage/invoiceManage"
export default {
  name: "logisticsTracking",
  props: {
    // logisticsData: {
    //   type: Array,
    //   default: () => []
    // }
  },
  data() {
    return {
      logisticsData: [],
      tableOption: logisticsTrackingOption,
      showDialog: false,
      resizeObserver: null
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    async openDialog(data = []) {
      if (data.length === 0) {
        this.$message.warning("无物流轨迹数据")
        return
      }
      this.showDialog = true
      this.logisticsData = data
    }
  }
}
</script>

<style lang="scss" scoped></style>
