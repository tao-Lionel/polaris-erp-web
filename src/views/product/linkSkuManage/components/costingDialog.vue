<template>
  <div>
    <el-dialog title="核价" :visible.sync="showDialog" width="90%" top="10vh">
      <div>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="核价信息" name="info"></el-tab-pane>
          <el-tab-pane label="核价需求" name="require"></el-tab-pane>
        </el-tabs>
        <div class="info">
          <div>
            <span style="font-weight: bold">店铺：</span>
            <span>{{ detail.storeAccount }}</span>
          </div>
          <div>
            <span style="font-weight: bold">链接SKU：</span>
            <span>{{ detail.linkSkuCode }}</span>
          </div>
          <div v-if="detail.platform === 'AMAZONVC' || detail.platform === 'AMAZON'">
            <span style="font-weight: bold">ASIN：</span>
            <span>{{ detail.asin }}</span>
          </div>
        </div>

        <div v-if="activeName === 'info'">
          <detail-wrapper :options="{ title: '已关联核价', left: true, customContentStyle: { padding: '10px' } }">
            <template slot="custom"> <span>(正在使用或历史使用过的核价信息)</span> </template>
            <avue-crud :data="relationshipTableData" :option="relationshipTableOption">
              <!-- 含税售价 -->
              <template slot="salePrice" slot-scope="scope">
                {{ scope.row.salePriceStr }}
                <br />
                {{ calculateUSDValue(scope.row.calSalePrice, scope.row.exchangeRate) }}
              </template>

              <!-- 非税售价 -->
              <template slot="nonTaxPrice" slot-scope="scope">
                {{ scope.row.nonTaxPriceStr }}
                <br />
                {{ calculateUSDValue(scope.row.nonTaxPrice, scope.row.exchangeRate) }}
              </template>

              <!-- 供货价 -->
              <template slot="supplyPrice" slot-scope="scope">
                {{ scope.row.supplyPriceStr }}
                <br />
                {{ calculateUSDValue(scope.row.calSupplyPrice, scope.row.exchangeRate) }}
              </template>

              <template slot="bindingStatus" slot-scope="scope">
                <span :style="{ color: scope.row.bindingStatus === 'VALID' ? '#67C23A' : '#F56C6C' }">
                  {{ scope.row.bindingStatus === "VALID" ? "生效中" : "已失效" }}
                </span>
              </template>

              <template slot="enableTime" slot-scope="scope">
                <span>{{ scope.row.enableByName }}</span>
                <br />
                <span>{{ scope.row.enableTime }}</span>
              </template>

              <template slot="disableTime" slot-scope="scope">
                <span>{{ scope.row.disableByName }}</span>
                <br />
                <span>{{ scope.row.disableTime }}</span>
              </template>
            </avue-crud>
          </detail-wrapper>

          <detail-wrapper :options="{ title: '可启用核价', left: true, customContentStyle: { padding: '10px' } }">
            <template slot="custom"> <span>(根据平台+站点+标准SKU匹配的可启用核价信息)</span> </template>
            <avue-crud :data="canTableData" :option="canTableOption">
              <!-- 含税售价 -->
              <template slot="salePrice" slot-scope="scope">
                {{ scope.row.salePriceStr }}
                <br />
                {{ calculateUSDValue(scope.row.calSalePrice, scope.row.exchangeRate) }}
              </template>

              <!-- 非税售价 -->
              <template slot="nonTaxPrice" slot-scope="scope">
                {{ scope.row.nonTaxPriceStr }}
                <br />
                {{ calculateUSDValue(scope.row.nonTaxPrice, scope.row.exchangeRate) }}
              </template>

              <!-- 供货价 -->
              <template slot="supplyPrice" slot-scope="scope">
                {{ scope.row.supplyPriceStr }}
                <br />
                {{ calculateUSDValue(scope.row.calSupplyPrice, scope.row.exchangeRate) }}
              </template>

              <template slot="operate" slot-scope="scope">
                <a v-if="permissions.product_linksku_enable_pricing" @click="handleEnable(scope.row)">启用</a>
              </template>
            </avue-crud>
          </detail-wrapper>
        </div>
        <div v-if="activeName === 'require'">
          <!-- 核价需求 -->
          <avue-crud
            :data="requireTableData"
            :option="requireTableOption"
            :page="page"
            @refresh-change="refreshChange"
            @size-change="sizeChange"
            @current-change="currentChange"
          >
            <!-- 填写的含税售价 -->
            <template slot="salePrice" slot-scope="scope">
              {{ scope.row.salePrice }}
            </template>

            <!-- 填写的供货价 -->
            <template slot="supplyPrice" slot-scope="scope">
              {{ scope.row.supplyPrice }}
            </template>

            <!-- 计算的含税售价 -->
            <template slot="calSalePrice" slot-scope="scope">
              {{ scope.row.salePriceStr }} <br />
              {{ calculateUSDValue(scope.row.calSalePrice, scope.row.exchangeRate) }}
            </template>

            <!-- 计算的非税售价 -->
            <template slot="nonTaxPrice" slot-scope="scope">
              {{ scope.row.nonTaxPriceStr }} <br />
              {{ calculateUSDValue(scope.row.nonTaxPrice, scope.row.exchangeRate) }}
            </template>

            <!-- 计算的供货价 -->
            <template slot="calSupplyPrice" slot-scope="scope">
              {{ scope.row.supplyPriceStr }} <br />
              {{ calculateUSDValue(scope.row.calSupplyPrice, scope.row.exchangeRate) }}
            </template>

            <template slot="pricingDemandStatusName" slot-scope="scope">
              <span :style="{ color: pricingDemandStatusColor[scope.row.pricingDemandStatus] }">
                {{ scope.row.pricingDemandStatusName }}
              </span>
            </template>

            <template slot-scope="scope" slot="pricingInfoStatus">
              <span :style="{ color: pricingInfoStatusColor[scope.row.pricingInfoStatus] }">
                {{ scope.row.pricingInfoStatusName }}
              </span>
            </template>

            <template slot="demandCreateByName" slot-scope="scope">
              {{ scope.row.demandCreateByName }}
              <br />
              {{ scope.row.demandCreateTime }}
            </template>

            <template slot="operate" slot-scope="scope">
              <!-- 核价状态=待提审 -->
              <a
                v-if="scope.row.pricingInfoStatus === 'PENDING_REVIEW' && permissions.product_pricing_info_audit"
                @click="handleApproval(scope.row)"
              >
                提交审批
              </a>
            </template>
          </avue-crud>
        </div>
      </div>

      <span slot="footer">
        <el-button size="small" @click="showDialog = false">取 消</el-button>
        <el-button v-if="permissions.product_pricing_demand_add" size="small" type="primary" @click="submit">
          添加核价需求
        </el-button>
      </span>
    </el-dialog>

    <auditDialog ref="auditDialogRef" @updateList="getRequireTableData"></auditDialog>
  </div>
</template>

<script>
import { relationshipTableOption, canTableOption, requireTableOption } from "../list.js"
import {
  getProductPricingBoundByLinkSkuIdApi,
  getProductPricingAvailableByLinkSkuIdApi,
  checkPricingBindApi,
  bindPricingDemandApi,
  getProductPricingDemandPageApi,
  reviewProductPricingInfoApi
} from "@/api/product/pricing"
import auditDialog from "@/views/productCosting/costingList/components/auditDialog.vue"
import { setFiltering } from "@/util/auth"
import { mapGetters } from "vuex"

export default {
  name: "linkSkuManageCostingDialog",
  components: { auditDialog },
  data() {
    return {
      showDialog: false,
      activeName: "info",
      detail: {},
      relationshipTableData: [],
      relationshipTableOption,
      canTableData: [],
      canTableOption,
      requireTableData: [],
      requireTableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      pricingDemandStatusColor: {
        INITIAL_PENDING: "#E6A23C",
        DEMAND_REJECTED: "#F56C6C",
        DEMAND_COMPLETE: "#67C23A",
        DEMAND_CANCEL: "#909399"
      },
      pricingInfoStatusColor: {
        PENDING_REVIEW: "#303133",
        UNDER_REVIEW: "#409EFF",
        PENDING_ACTIVATION: "#E6A23C",
        ACTIVATED: "#67C23A",
        REVIEW_REJECTED: "#F56C6C",
        INACTIVE: "#909399"
      }
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  created() {},
  mounted: function () {},
  methods: {
    openDialog(row, type) {
      this.detail = row
      this.activeName = type || "info"
      this.showDialog = true
      this.init()
      this.getRequireTableData()
    },
    init() {
      this.getRelationshipTableData()
      this.getCanTableData()
    },
    // 已关联核价查询
    async getRelationshipTableData() {
      const { data } = await getProductPricingBoundByLinkSkuIdApi(this.detail.id)
      if (data.code === 0) {
        this.relationshipTableData = data.data.map((item) => {
          item.promotionExpenses = this.handlePercentString(item.promotionExpenses)
          item.profitStr = this.handleProfit(item.preTaxProfit, item.calSupplyPrice)
          // item.operatingProfitStr = this.handleProfit(item.operatingProfit, item.calSupplyPrice)
          item.ppm = this.handlePercentString(item.ppm)
          item.salePriceStr = item.calSalePrice ? `${item.baseCurrencySymbol} ${item.calSalePrice.toFixed(2)}` : "-"
          item.nonTaxPriceStr = item.nonTaxPrice ? `${item.baseCurrencySymbol} ${item.nonTaxPrice.toFixed(2)}` : "-"
          item.supplyPriceStr = item.calSupplyPrice
            ? `${item.baseCurrencySymbol} ${item.calSupplyPrice.toFixed(2)}`
            : "-"
          return item
        })
      }
    },
    // 获取可启用核价
    async getCanTableData() {
      const { data } = await getProductPricingAvailableByLinkSkuIdApi(this.detail.id)
      if (data.code === 0) {
        this.canTableData = data.data.map((item) => {
          item.promotionExpenses = this.handlePercentString(item.promotionExpenses)
          item.profitStr = this.handleProfit(item.preTaxProfit, item.calSupplyPrice)
          // item.operatingProfitStr = this.handleProfit(item.operatingProfit, item.calSupplyPrice)
          item.ppm = this.handlePercentString(item.ppm)
          item.salePriceStr = item.calSalePrice ? `${item.baseCurrencySymbol} ${item.calSalePrice.toFixed(2)}` : "-"
          item.nonTaxPriceStr = item.nonTaxPrice ? `${item.baseCurrencySymbol} ${item.nonTaxPrice.toFixed(2)}` : "-"
          item.supplyPriceStr = item.calSupplyPrice
            ? `${item.baseCurrencySymbol} ${item.calSupplyPrice.toFixed(2)}`
            : "-"
          return item
        })
      }
    },
    // 获取核价需求 分页
    async getRequireTableData() {
      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        filtering: [
          {
            field: "linkSkuId",
            value: this.detail.id
          }
        ]
      }
      const { data } = await getProductPricingDemandPageApi(params)
      if (data.code === 0) {
        this.requireTableData = data.data.records.map((item) => {
          item.promotionExpenses = this.handlePercentString(item.promotionExpenses)
          item.profitStr = this.handleProfit(item.preTaxProfit, item.calSupplyPrice)
          // item.operatingProfitStr = this.handleProfit(item.operatingProfit, item.calSupplyPrice)
          item.ppm = this.handlePercentString(item.ppm)
          item.salePriceStr = item.calSalePrice ? `${item.baseCurrencySymbol} ${item.calSalePrice.toFixed(2)}` : "-"
          item.nonTaxPriceStr = item.nonTaxPrice ? `${item.baseCurrencySymbol} ${item.nonTaxPrice.toFixed(2)}` : "-"
          item.supplyPriceStr = item.calSupplyPrice
            ? `${item.baseCurrencySymbol} ${item.calSupplyPrice.toFixed(2)}`
            : "-"
          item.demandDescription = item.demandDescription || "-"
          item.purchaseSupplierName = item.purchaseSupplierName || "-"
          return item
        })
        this.page.total = data.data.total
      }
    },
    // 计算经营利润率、税前利润率 返回百分比格式 除以供货价
    handleProfit(value, calSupplyPrice) {
      if (value === undefined || value === null || !calSupplyPrice) return "-"
      return ((value / calSupplyPrice) * 100).toFixed(2) + "%"
    },
    // 通过本位币计算美元
    calculateUSDValue(value, exchangeRate) {
      if (!value || !exchangeRate) return "-"
      return `$ ${(value * exchangeRate).toFixed(2)}`
    },
    // 处理百分比 乘100,返回百分比格式
    handlePercentString(value) {
      return value || value === 0 ? (value * 100).toFixed(2) + "%" : "-"
    },
    handleTabClick() {
      if (this.activeName === "require") {
        this.getRequireTableData()
      } else {
        this.init()
      }
    },
    // 启用
    async handleEnable(row) {
      const params = { pricingDemandId: row.pricingDemandId, linkSkuId: this.detail.id }
      const { data } = await checkPricingBindApi(params)

      if (data.code === 0) {
        this.$confirm(
          `${data.data ? data.data + "<br/>" : ""}
         确认启用新核价?`,
          "启用新核价",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            dangerouslyUseHTMLString: true
          }
        ).then(async () => {
          const { data } = await bindPricingDemandApi(params)
          if (data.code === 0) {
            this.$message.success("启用成功")
            this.init()
          }
        })
      }
    },
    // 提交审批
    async handleApproval({ pricingInfoId }) {
      const filtering = setFiltering({ pricingInfoId })
      const { data } = await reviewProductPricingInfoApi({ pricingDemandQueryDto: { filtering } })
      const { passed, total } = data.data

      if (total && total === passed) {
        this.$message.success(`${total}条已自动审批通过`)
        this.getRequireTableData()
      } else {
        this.$refs.auditDialogRef.openDialog(filtering, total, passed)
      }
    },
    submit() {
      this.$emit("addCostingRequire", this.detail)
      this.showDialog = false
    },
    refreshChange() {
      this.getRequireTableData()
    },
    sizeChange(val) {
      this.page.pageSize = val
      this.getRequireTableData()
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      this.getRequireTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.info {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #f2f2f2;
  padding: 15px 10px;
  margin-bottom: 10px;
}
::v-deep .el-dialog {
  height: 80vh;
  .el-dialog__body {
    overflow-y: auto;
    height: calc(100% - 130px);
  }
}
</style>
