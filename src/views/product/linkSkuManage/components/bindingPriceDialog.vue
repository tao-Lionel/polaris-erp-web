<template>
  <el-dialog title="绑定核价记录" :visible.sync="showDialog" width="80%">
    <avue-crud :data="tableData" :option="bindingPriceOption">
      <template slot="auditStatus" slot-scope="scope">
        <div :style="{ color: scope.row.auditStatus === '1' ? '#67C23A' : '#F56C6C' }">
          {{ scope.row.auditStatus === "1" ? "已绑定" : "未绑定" }}
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
import { bindingPriceOption } from "../list.js"
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
    openDialog({ site, platform, parentSkuCode, id, linkSkuCode, storeAccount, storeId }) {
      this.showDialog = true
      this.id = id
      this.platform = platform
      this.site = site
      this.linkSkuCode = linkSkuCode
      this.storeAccount = storeAccount
      this.parentSkuCode = parentSkuCode
      this.storeId = storeId
      this.getList()
    },
    async getList() {
      this.tableData = []
      const params = {
        type: 1,
        siteCode: this.site,
        parentSkuCode: this.parentSkuCode,
        platformCode: this.platform,
        storeId: this.storeId
      }
      const { data } = await findLinkSkusOrCalculsApi(params)
      if (data.code === 0) {
        this.tableData = data.data.calculateDetailRecordVos
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
        calIds: [row.id],
        operateType: 0,
        storeAccount: this.storeAccount,
        skuCode: row.skuCode,
        linkSkuCode: this.linkSkuCode,
        platformCode: this.platform,
        siteCode: this.site
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
