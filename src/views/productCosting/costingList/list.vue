<template>
  <div class="execution" id="costingList">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
        @sort-change="sortChange"
      >
        <template slot="menuLeft">
          <el-tabs v-model="costingTab" @tab-click="changeCostingTab">
            <el-tab-pane
              v-for="item in generateStatusOptions"
              :key="item.key"
              :label="item.statusName"
              :name="item.key"
            ></el-tab-pane>
          </el-tabs>

          <el-dropdown
            v-if="permissions.product_pricing_info_audit && costingTab === 'PENDING_REVIEW'"
            style="margin-right: 10px"
          >
            <el-button type="primary" size="small">
              提交审核<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleAudit(null)">已勾选数据</el-dropdown-item>
              <el-dropdown-item @click.native="handleAuditBatch">全部数据</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown @command="handleExport">
            <el-button type="primary" size="small"> 导出<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="permissions.product_pricing_info_export" command="33">列表导出</el-dropdown-item>
              <el-dropdown-item v-if="permissions.product_pricing_info_export_detail" command="34"
                >明细导出</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchFormRef">
            <el-form-item prop="pricingInfoCode">
              <el-input
                v-model="searchForm.pricingInfoCode"
                size="small"
                placeholder="核价编号,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="platform">
              <el-select
                v-model="searchForm.platform"
                size="small"
                placeholder="平台,支持多选"
                filterable
                clearable
                multiple
              >
                <el-option
                  v-for="item in platformOptions"
                  :key="item.platformTypeCode"
                  :label="item.platformTypeName"
                  :value="item.platformTypeCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="site">
              <el-select
                v-model="searchForm.site"
                size="small"
                filterable
                placeholder="站点,支持多选"
                clearable
                multiple
              >
                <el-option v-for="item in siteOptions" :key="item.value" :label="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="spuCode">
              <el-input
                v-model="searchForm.spuCode"
                size="small"
                placeholder="标准SPU,支持多个"
                clearable
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="standardSkuCode">
              <el-input
                v-model="searchForm.standardSkuCode"
                size="small"
                placeholder="标准SKU,支持多个"
                clearable
                v-search-input
              ></el-input>
            </el-form-item>
          </el-form>
        </template>

        <template slot="searchAdvanced">
          <el-form :model="searchForm" ref="searchAdvancedFormRef" :inline="true">
            <el-form-item prop="categoryGrouping">
              <el-select
                v-model="searchForm.categoryGrouping"
                size="small"
                filterable
                placeholder="品类分组,支持多选"
                clearable
                multiple
              >
                <el-option
                  v-for="item in categoryGroupingOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="orderBusinessType">
              <el-select
                v-model="searchForm.orderBusinessType"
                size="small"
                filterable
                placeholder="销售模式,支持多选"
                clearable
                multiple
              >
                <el-option
                  v-for="item in platformModel"
                  :key="item.description"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="logisticsDeliveryMode">
              <el-select
                v-model="searchForm.logisticsDeliveryMode"
                size="small"
                filterable
                placeholder="配送方式,支持多选"
                clearable
                multiple
              >
                <el-option
                  v-for="item in logisticsDeliveryModeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <avue-crud-search-item ref="searchCrudItemRef" :searchFields="searchFields" @updateField="updateField">
            </avue-crud-search-item>
          </el-form>
        </template>

        <!-- 含税售价 -->
        <template slot-scope="scope" slot="salePrice">
          {{ scope.row.salePriceStr }}
          <br />
          {{ calculateUSDValue(scope.row.calSalePrice, scope.row.exchangeRate) }}
        </template>

        <!-- 非税售价 -->
        <template slot-scope="scope" slot="nonTaxPrice">
          {{ scope.row.nonTaxPriceStr }}
          <br />
          {{ calculateUSDValue(scope.row.nonTaxPrice, scope.row.exchangeRate) }}
        </template>

        <!-- 供货价 -->
        <template slot-scope="scope" slot="supplyPrice">
          {{ scope.row.supplyPriceStr }}
          <br />
          {{ calculateUSDValue(scope.row.calSupplyPrice, scope.row.exchangeRate) }}
        </template>

        <!-- 核价链接 -->
        <template slot-scope="scope" slot="pricingRecordLinkSkuList">
          <a v-if="scope.row?.pricingRecordLinkSkuList?.length" @click="handleConnected(scope.row)">
            {{ scope.row?.pricingRecordLinkSkuList?.length }}
          </a>
          <span v-else>-</span>
        </template>

        <!-- 状态 -->
        <template slot-scope="scope" slot="pricingInfoStatus">
          <span :style="{ color: pricingInfoStatusColor[scope.row.pricingInfoStatus] }">{{
            scope.row.pricingInfoStatusName
          }}</span>
        </template>

        <!-- 创建人/创建时间 -->
        <template slot-scope="scope" slot="demandCreateTime">
          {{ scope.row.demandCreateByName }}
          <br />
          {{ scope.row.demandCreateTime }}
        </template>

        <!-- 更新人/更新时间 -->
        <template slot-scope="scope" slot="demandUpdateTime">
          {{ scope.row.demandUpdateByName }}
          <br />
          {{ scope.row.demandUpdateTime }}
        </template>

        <!-- 备注 -->
        <template slot="infoRemark" slot-scope="scope">
          <el-popover v-if="scope.row.infoRemark !== ''" placement="top-start" width="200" trigger="hover">
            <copy-text hoverToShow slot="reference">
              {{ scope.row.infoRemark }}
            </copy-text>

            <div>{{ scope.row.infoRemark }}</div>
          </el-popover>
          <div v-else>{{ scope.row.infoRemark || "-" }}</div>
        </template>

        <template slot-scope="scope" slot="operation">
          <avue-crud-ctrl :list="getCtrlList(scope)" :defaultShowNumber="2"></avue-crud-ctrl>
        </template>
      </avue-crud>
    </basic-container>

    <connectedLinkDialog ref="connectedLinkDialogRef"></connectedLinkDialog>
    <auditDialog ref="auditDialogRef" @updateList="updateList"></auditDialog>
  </div>
</template>

<script>
import { tableOption } from "./list.js"
import { mapGetters } from "vuex"
import { getDictByType, setFiltering } from "@/util/auth"
import { getPlayTypeAll } from "@/api/order/orderManage"
import connectedLinkDialog from "./components/connectedLinkDialog.vue"
import {
  getProductPricingInfoPageApi,
  reviewProductPricingInfoApi,
  invalidProductPricingInfoApi,
  passProductPricingInfoApi,
  getOaProcessUrlApi
} from "@/api/product/pricing"
import { getCountry } from "@/api/baseSetup/bsecountry"
import { exportDataComApi } from "@/api/common/index"
import { getStore as getSession } from "@/util/store"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"
import auditDialog from "./components/auditDialog.vue"
import { getListByUserNameApi } from "@/api/admin/user.js"

export default {
  name: "costingList",
  components: {
    connectedLinkDialog,
    auditDialog
  },
  data() {
    return {
      searchForm: {
        pricingInfoCode: "",
        platform: "",
        site: "",
        spuCode: "",
        standardSkuCode: "",
        orderBusinessType: "",
        categoryGrouping: undefined,
        logisticsDeliveryMode: undefined
      },
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption,
      selectList: [],
      platformModel: [], // 模式
      platformOptions: [],
      siteOptions: [],
      costingTab: "PENDING_REVIEW",
      generateStatusOptions: [
        { statusName: "全部", key: "ALL" },
        { statusName: "待提审", key: "PENDING_REVIEW" },
        { statusName: "审核中", key: "UNDER_REVIEW" },
        { statusName: "待启用", key: "PENDING_ACTIVATION" },
        { statusName: "生效中", key: "ACTIVATED" },
        { statusName: "已驳回", key: "REVIEW_REJECTED" },
        { statusName: "已失效", key: "INACTIVE" }
      ],
      pricingInfoStatusOptions: [],
      pricingInfoStatusColor: {
        PENDING_REVIEW: "#303133",
        UNDER_REVIEW: "#409EFF",
        PENDING_ACTIVATION: "#E6A23C",
        ACTIVATED: "#67C23A",
        REVIEW_REJECTED: "#F56C6C",
        INACTIVE: "#909399"
      },
      orderBy: [
        {
          field: "demandUpdateTime",
          order: "desc"
        }
      ],
      categoryGroupingOptions: [],
      logisticsDeliveryModeOptions: [],
      searchFields: [
        { label: "创建人", value: "demandCreateByName", type: "input", default: true },
        { label: "创建时间", value: "demandCreateTime", type: "datetimerange" }
      ]
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  created() {},
  mounted: function () {
    this.initPageByTab()
    this.init()
  },
  activated() {
    this.clearSelectClear()
    this.initPageByTab()
  },
  methods: {
    initPageByTab() {
      this.searchForm.pricingInfoStatus = this.costingTab === "ALL" ? "" : this.costingTab
      this.getList()
    },

    async init() {
      this.getPlatform()
      this.getAllCountry()
      this.platformModel = await getDictByType("prd_pricing_sale_model")
      this.pricingInfoStatusOptions = await getDictByType("pricing_info_status")
      this.categoryGroupingOptions = await getDictByType("costing_category_grouping")
      this.logisticsDeliveryModeOptions = await getDictByType("logistics_delivery_method")
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page)
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      this.page.currentPage = 1
      this.getList()
    },
    searchReset() {
      this.$refs["searchFormRef"].resetFields()
      this.$refs.searchAdvancedFormRef?.resetFields()
      this.$refs.searchCrudItemRef.resetField()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    //选中行事件
    selectionChange(val) {
      this.selectList = val
    },
    clearSelectClear() {
      this.$refs.crud.selectClear()
    },
    async getList() {
      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        filtering: setFiltering(this.searchForm),
        orderBy: this.orderBy
      }

      const { data } = await getProductPricingInfoPageApi(params)
      if (data.code === 0) {
        this.tableData = data.data.records.map((item) => {
          return {
            ...item,
            salePriceStr: item.calSalePrice ? `${item.baseCurrencySymbol} ${item.calSalePrice.toFixed(2)}` : "-",
            nonTaxPriceStr: item.nonTaxPrice ? `${item.baseCurrencySymbol} ${item.nonTaxPrice.toFixed(2)}` : "-",
            supplyPriceStr: item.calSupplyPrice ? `${item.baseCurrencySymbol} ${item.calSupplyPrice.toFixed(2)}` : "-",
            promotionRatio: this.handlePercentString(item.promotionRatio),
            ppm: this.handlePercentString(item.ppm),
            freightLogicPPM: this.handlePercentString(item.freightLogicPPM),
            ppmDiff: this.handlePercentString(item.ppmDiff),
            profitStr: this.handleProfit(item.preTaxProfit, item.calSupplyPrice),
            operatingProfitStr: this.handleProfit(item.operatingProfit, item.calSupplyPrice)
          }
        })
        this.page.total = data.data.total
      }
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
    // 计算经营利润率、税前利润率 返回百分比格式 除以供货价
    handleProfit(value, calSupplyPrice) {
      if (value === undefined || value === null || !calSupplyPrice) return "-"
      return ((value / calSupplyPrice) * 100).toFixed(2) + "%"
    },
    async handleAudit(pricingInfoId = null) {
      let pricingInfoIds = []
      if (!pricingInfoId) {
        if (this.selectList.length === 0) {
          this.$message.warning("请选择需要提交的核价")
          return
        }
        pricingInfoIds = this.selectList.map((item) => item.pricingInfoId)
      } else {
        pricingInfoIds = [pricingInfoId]
      }

      const filtering = setFiltering({ pricingInfoId: pricingInfoIds })
      this.reviewAuditDialog(filtering)
    },
    async handleAuditBatch() {
      const filtering = setFiltering(this.searchForm)
      this.reviewAuditDialog(filtering)
    },
    async reviewAuditDialog(filtering) {
      const { data } = await reviewProductPricingInfoApi({ pricingDemandQueryDto: { filtering } })
      const { passed, total } = data.data

      if (total && total === passed) {
        this.$message.success(`${total}条已自动审批通过`)
        this.clearSelectClear()
        this.getList()
      } else {
        this.$refs.auditDialogRef.openDialog(filtering, total, passed)
      }
    },
    getCtrlList(scope) {
      return [
        {
          title: "提交审核",
          item: scope,
          clickFn: (scope) => {
            this.handleAudit(scope.row.pricingInfoId)
          },
          show: this.permissions.product_pricing_info_audit && scope.row.pricingInfoStatus === "PENDING_REVIEW" // 待提审
        },
        {
          title: "详情",
          item: scope,
          clickFn: (scope) => {
            this.$router.push({
              path: "/productCosting/costingList/detail",
              query: {
                pricingDemandId: scope.row.pricingDemandId
              }
            })
          },
          show: this.permissions.product_pricing_info_detail
        },
        {
          title: "审核进度",
          item: scope,
          clickFn: async (scope) => {
            // 打开OA该审批流，查看审批状态
            const { infoApprovalTmplCode, businessId } = scope.row
            const { data } = await getOaProcessUrlApi({ templateCode: infoApprovalTmplCode, businessId })
            if (data.code === 0) {
              window.open(data.data)
            }
          },
          show:
            this.permissions.product_pricing_info_review_progress &&
            ["UNDER_REVIEW"].includes(scope.row.pricingInfoStatus) //审核中
        },
        {
          title: "已关联链接",
          item: scope,
          clickFn: (scope) => {
            this.handleConnected(scope.row)
          },
          show: ["ACTIVATED", "INACTIVE"].includes(scope.row.pricingInfoStatus) //生效中、已失效
        },
        {
          title: "编辑",
          item: scope,
          clickFn: (scope) => {
            this.$router.push({
              path: `/productCosting/costingRequire/costing`,
              query: {
                id: scope.row.pricingDemandId
              }
            })
          },
          show:
            this.permissions.product_pricing_info_generate &&
            ["PENDING_SUBMIT", "PENDING_REVIEW"].includes(scope.row.pricingInfoStatus) // 待提审、待提交
        },
        {
          title: "作废",
          item: scope,
          clickFn: (scope) => {
            this.$confirm(`确定作废该核价吗?<br/> 作废后，无法恢复。`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
              dangerouslyUseHTMLString: true
            }).then(async () => {
              const { data } = await invalidProductPricingInfoApi([scope.row.pricingInfoId])
              if (data.code === 0) {
                this.$message.success("作废成功")
                this.getList()
              }
            })
          },
          show: this.permissions.product_pricing_info_del && scope.row.pricingInfoStatus === "PENDING_REVIEW" // 待提审
        }
      ]
    },
    handleConnected(row) {
      this.$refs.connectedLinkDialogRef.openDialog(row.pricingRecordLinkSkuList)
    },
    // 获取国家
    async getAllCountry() {
      const { data } = await getCountry()
      this.siteOptions = data.data.map((item) => ({
        label: item.countryShortName,
        value: item.countryCode
      }))
    },
    // 获取平台
    async getPlatform() {
      const { data } = await getPlayTypeAll()
      this.platformOptions = data.data
    },
    // 导出
    async handleExport(id) {
      const exportParams = []
      // 有勾选导出勾选的数据
      if (this.selectList.length > 0) {
        const pricingInfoCode = this.selectList.map((item) => item.pricingInfoCode)
        exportParams.push({ code: "pricingInfoCode", value: pricingInfoCode.join(",") })
      } else {
        // 没有勾选导出搜索的数据
        const obj = deepCloneIgnoreNull(this.searchForm)
        Object.keys(obj).forEach((item) => {
          if (Array.isArray(obj[item])) {
            exportParams.push({ code: item, value: obj[item].join(",") })
          } else {
            exportParams.push({ code: item, value: obj[item] })
          }
        })
      }

      const { data } = await exportDataComApi({
        id: Number(id),
        param: exportParams,
        exportModel: "ASYNC"
      })
      if (data.code === 0) {
        let count = getSession({ name: "downloadCount" })
        this.$store.commit("SET_DOWNLOAD_COUNT", Number(count) + 1)
        this.$message.success(`由于导出数据量较大，请点击右上角【下载列表】图标进行查看！`)
      }
    },

    changeCostingTab() {
      this.clearSelectClear()
      this.page.currentPage = 1
      if (this.costingTab === "ALL") {
        this.searchForm.pricingInfoStatus = ""
      } else {
        this.searchForm.pricingInfoStatus = this.costingTab
      }
      this.getList()
    },
    // 排序
    sortChange(column) {
      if (!column.prop || !column.order) {
        this.orderBy = [
          {
            field: "demandUpdateTime",
            order: "desc"
          }
        ]
        return
      }

      const orderMap = {
        descending: "desc",
        ascending: "asc"
      }

      this.orderBy = [
        {
          field: column.prop,
          order: orderMap[column.order]
        }
      ]

      this.getList()
    },
    updateList() {
      this.getList()
      this.clearSelectClear()
    },
    // 获取用户
    async getUserList(displayname) {
      const { data } = await getListByUserNameApi([displayname])
      this.searchForm.demandCreateBy = data?.[0]?.userId || -1
    },
    updateField(obj) {
      this.searchForm.demandCreateBy = ""
      if (obj.demandCreateByName) {
        this.getUserList(obj.demandCreateByName)
        return
      }

      Object.assign(this.searchForm, obj)
    }
  }
}
</script>

<style lang="scss" scoped></style>
