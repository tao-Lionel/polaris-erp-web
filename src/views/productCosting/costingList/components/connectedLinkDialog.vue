<template>
  <el-dialog title="已关联链接" :visible.sync="showDialog" width="80%">
    <div>
      <avue-crud :data="tableData" :option="connectedLinkTableOption">
        <template slot-scope="scope" slot="linkSkuCode">
          <a @click="handleLinkSku(scope.row)">{{ scope.row.linkSkuCode }}</a>
        </template>

        <template slot="bindingStatus" slot-scope="scope">
          <span :style="{ color: scope.row.bindingStatus === 'VALID' ? '#67C23A' : '#F56C6C' }">
            {{ scope.row.bindingStatus === "VALID" ? "生效中" : "已失效" }}
          </span>
        </template>

        <template slot-scope="scope" slot="enableTime">
          {{ scope.row.enableByName }}
          <br />
          {{ scope.row.enableTime }}
        </template>
        <template slot-scope="scope" slot="disableTime">
          {{ scope.row.disableByName }}
          <br />
          {{ scope.row.disableTime }}
        </template>
      </avue-crud>
    </div>
    <span slot="footer">
      <el-button size="small" @click="showDialog = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { connectedLinkTableOption } from "../list"

export default {
  name: "connectedLinkDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      tableData: [],
      connectedLinkTableOption
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    openDialog(pricingRecordLinkSkuList) {
      this.showDialog = true
      this.tableData = pricingRecordLinkSkuList
    },
    handleLinkSku(row) {
      this.showDialog = false
      this.$router.push({
        path: `/product/linkSkuManage/list`,
        query: {
          storeId: row.storeId,
          linkSkuCode: row.linkSkuCode
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
