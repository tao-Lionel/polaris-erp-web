<template>
  <el-dialog title="绑定链接关系" :visible.sync="showDialog" width="90%">
    <avue-crud :data="tableData" :option="bindingPriceOption">
      <template slot="auditStatus" slot-scope="scope">
        <div :style="{ color: scope.row.auditStatus === '1' ? '#67C23A' : '#F56C6C' }">
          {{ scope.row.auditStatus === "1" ? "已审核" : "未审核" }}
        </div>
      </template>
      <template slot="operate" slot-scope="scope">
        <avue-crud-ctrl :list="getCtrlList(scope)"></avue-crud-ctrl>
      </template>
    </avue-crud>
    <span slot="footer">
      <el-button size="small" @click="showDialog = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { bindingPriceOption } from "./list.js"
import { findLinkSkusOrCalculsApi } from "@/api/product/linkSkuMange"
import { getPrdCalculateRecordInvalidApi } from "@/api/baseSetup/bseplatformtype"

export default {
  name: "bindingPriceDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      tableData: [],
      bindingPriceOption,
      id: "",
      platform: "",
      site: "",
      linkSkuCode: "",
      storeAccount: "",
      parentSkuCode: "",
      selectList: [],
      storeId: ""
    }
  },
  created() {},
  mounted: function () {},
  computed: {},
  methods: {
    openDialog({ sitName, platformName, parentSku, id, linkSku, storeName, storeId }) {
      this.showDialog = true
      this.id = id
      this.platform = platformName
      this.site = sitName
      this.linkSkuCode = linkSku
      this.storeAccount = storeName
      this.parentSkuCode = parentSku
      this.storeId = storeId
      this.getList()
    },
    async getList() {
      this.tableData = []
      const params = {
        type: 0,
        siteCode: this.site,
        parentSkuCode: this.parentSkuCode,
        platformCode: this.platform,
        storeId: this.storeId
      }
      const { data } = await findLinkSkusOrCalculsApi(params)
      if (data.code === 0) {
        this.tableData = data.data.prdLinkSkuVos
      }
    },
    getCtrlList(scope) {
      return [
        {
          title: "绑定",
          item: scope,
          clickFn: (scope) => {
            this.handleBinding(scope.row)
          },
          show: true
        }
      ]
    },
    async handleBinding(row) {
      const params = {
        calIds: [this.id],
        operateType: 0,
        storeAccount: row.storeName,
        skuCode: row.skuCode,
        linkSkuCode: row.linkSkuCode,
        platformCode: row.platform,
        siteCode: row.site
      }
      const { data } = await getPrdCalculateRecordInvalidApi(params)
      if (data.code === 0) {
        this.$message.success("绑定成功，生成销售SKU关系成功！")
        this.$emit("updateDate")
        this.showDialog = false
      } else {
        this.$message.error(data.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
