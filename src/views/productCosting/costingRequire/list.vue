<template>
  <div>
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
        <!-- 操作按钮栏 -->
        <template slot="menuLeft">
          <el-tabs v-model="costingTab" @tab-click="changeCostingTab">
            <el-tab-pane
              v-for="item in generateStatusTabOptions"
              :key="item.value"
              :label="item.label"
              :name="item.value"
            ></el-tab-pane>
          </el-tabs>

          <el-button
            v-if="permissions.product_pricing_demand_add && ['NOT_GENERATED', 'FAIL'].includes(costingTab)"
            type="primary"
            @click="handleAdd"
            size="small"
          >
            新增需求
          </el-button>

          <el-dropdown
            v-if="permissions.product_pricing_demand_generate && costingTab !== 'GENERATING'"
            style="margin-right: 10px"
          >
            <el-button type="primary" size="small">
              批量核价<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleBatchCosting">已勾选需求</el-dropdown-item>
              <el-dropdown-item @click.native="handleBatchCostingFilter">全部需求</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-button
            v-if="permissions.product_pricing_demand_import && ['NOT_GENERATED', 'FAIL'].includes(costingTab)"
            type="primary"
            @click="handleImport"
            size="small"
          >
            导入
          </el-button>
          <el-button v-if="permissions.product_pricing_demand_export" type="primary" @click="handleExport" size="small">
            导出
          </el-button>

          <el-dropdown
            v-if="permissions.product_pricing_demand_audit && costingTab !== 'GENERATING'"
            style="margin-right: 10px"
          >
            <el-button type="primary" size="small">
              提交审核<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleBatchAudit(null)">已勾选需求</el-dropdown-item>
              <el-dropdown-item @click.native="handleBatchAuditFilter">全部需求</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            v-if="
              permissions.product_pricing_demand_reject && ['NOT_GENERATED', 'FAIL', 'SUCCESS'].includes(costingTab)
            "
            type="primary"
            @click="handleBatchReject"
            size="small"
          >
            批量驳回
          </el-button>
        </template>
        <!-- 搜索栏 -->
        <template slot="search">
          <el-form :model="searchForm" ref="searchFormRef" :inline="true">
            <el-form-item prop="pricingDemandCode">
              <el-input
                v-model="searchForm.pricingDemandCode"
                size="small"
                placeholder="需求编码,支持多个"
                clearable
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
            <el-form-item prop="pricingDemandStatus">
              <el-select
                v-model="searchForm.pricingDemandStatus"
                size="small"
                filterable
                placeholder="需求状态,支持多选"
                clearable
                multiple
              >
                <el-option
                  v-for="item in pricingDemandStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="pricingType">
              <el-select
                v-model="searchForm.pricingType"
                size="small"
                filterable
                placeholder="类型,支持多选"
                clearable
                multiple
              >
                <el-option v-for="item in pricingTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
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
                  v-for="item in orderBusinessTypeOptions"
                  :key="item.value"
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

        <!-- 需求编码 -->
        <template slot="pricingDemandCode" slot-scope="scope">
          <copy-text hoverToShow>
            {{ scope.row.pricingDemandCode }}
          </copy-text>
        </template>

        <!-- 需求状态 -->
        <template slot="pricingDemandStatusName" slot-scope="scope">
          <span :style="{ color: pricingDemandStatusColor[scope.row.pricingDemandStatus] }">
            {{ scope.row.pricingDemandStatusName }}
          </span>
        </template>

        <!-- 生成状态 -->
        <template slot="pricingGenerateStatus" slot-scope="scope">
          <span :style="{ color: pricingGenerateStatusColor[scope.row.pricingGenerateStatus] }">
            {{ scope.row.pricingGenerateStatusName }}
          </span>
        </template>

        <!-- 创建人/创建时间 -->
        <template slot="demandCreateTime" slot-scope="scope">
          <div>{{ scope.row.demandCreateByName }}</div>
          <div>{{ scope.row.demandCreateTime }}</div>
        </template>

        <!-- 更新人/更新时间 -->
        <template slot="demandUpdateTime" slot-scope="scope">
          <div>{{ scope.row.demandUpdateByName }}</div>
          <div>{{ scope.row.demandUpdateTime }}</div>
        </template>

        <!-- 备注 -->
        <template slot="remarkString" slot-scope="scope">
          <el-popover v-if="scope.row.remarkString !== '-'" placement="top-start" width="200" trigger="hover">
            <copy-text hoverToShow slot="reference">
              {{ scope.row.remarkString }}
            </copy-text>

            <div>{{ scope.row.remarkString }}</div>
          </el-popover>
          <div v-else>{{ scope.row.remarkString }}</div>
        </template>

        <template slot="operate" slot-scope="scope">
          <avue-crud-ctrl :list="getCtrlList(scope)"></avue-crud-ctrl>
        </template>
      </avue-crud>

      <commonImport
        ref="commonImportRef"
        :excelStatus="false"
        :excelDangerStatus="excelDangerStatus"
        @import="importExcelBtn"
        @export="exportDangerExcel"
        :customDownload="customDownload"
      >
        <template slot="importTip">
          <div v-if="successCount + errorCount > 0">
            总条数<span style="font-size: 16px"> {{ successCount + errorCount }} </span> 条，成功导入<span
              style="color: #67c23a; font-size: 16px"
            >
              {{ successCount }}
            </span>
            条，失败
            <span style="color: #f56c6c; font-size: 16px">
              {{ errorCount }}
            </span>
            条
          </div>
        </template>
      </commonImport>

      <addCostingRequireDialog ref="addCostingRequireDialogRef" @updateList="updateList"></addCostingRequireDialog>
      <rejectDialog ref="rejectDialogRef" @updateList="updateList"></rejectDialog>
      <auditDialog ref="auditDialogRef" @updateList="updateList"></auditDialog>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { tableOption, pricingGenerateStatusColor, pricingDemandStatusColor } from "./list"
import { downloadBlob, setFiltering, getDictByType } from "@/util/auth"
import commonImport from "@/views/cockpit/commonImport.vue"
import { getPlayTypeAll } from "@/api/order/orderManage"
import addCostingRequireDialog from "./components/addCostingRequireDialog.vue"
import rejectDialog from "./components/rejectDialog.vue"
import {
  getProductPricingDemandPageApi,
  invalidProductPricingDemandApi,
  getProductPricingSyncCalculateApi,
  productDownloadTemplateApi,
  importPricingDemandApi,
  exportErrorDataApi,
  getOaProcessUrlApi,
  checkPricingDemandApi
} from "@/api/product/pricing"
import { getCountry } from "@/api/baseSetup/bsecountry"
import { getListByUserNameApi } from "@/api/admin/user.js"
import { exportDataComApi } from "@/api/common/index"
import { getStore as getSession } from "@/util/store"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"
import auditDialog from "./components/auditDialog.vue"

export default {
  name: "costingRequireList",
  components: { commonImport, addCostingRequireDialog, rejectDialog, auditDialog },
  computed: {
    ...mapGetters(["permissions"])
  },
  data() {
    return {
      searchForm: {
        pricingDemandCode: undefined,
        platform: undefined,
        site: undefined,
        spuCode: undefined,
        standardSkuCode: undefined,
        pricingDemandStatus: undefined,
        pricingType: undefined,
        pricingGenerateStatus: undefined,
        categoryGrouping: undefined,
        orderBusinessType: undefined,
        logisticsDeliveryMode: undefined
      },
      tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableData: [],
      selectList: [],
      platformOptions: [],
      siteOptions: [],
      pricingTypeOptions: [],
      searchFields: [
        { label: "创建人", value: "demandCreateByName", type: "input", default: true },
        { label: "创建时间", value: "demandCreateTime", type: "datetimerange" }
      ],
      costingTab: "NOT_GENERATED",
      generateStatusTabOptions: [
        { label: "未生成", value: "NOT_GENERATED" },
        { label: "生成失败", value: "FAIL" },
        { label: "生成中", value: "GENERATING" },
        { label: "已生成", value: "SUCCESS" }
      ],
      pricingGenerateStatusOptions: [],
      pricingDemandStatusOptions: [],
      pricingDemandStatusColor,
      pricingGenerateStatusColor,
      excelDangerStatus: false, // 是否可下载错误文件
      errorData: [], // 错误数据
      successCount: 0, // 成功导入条数
      errorCount: 0, // 失败条数
      orderBy: [
        {
          field: "demandUpdateTime",
          order: "desc"
        }
      ],
      categoryGroupingOptions: [],
      orderBusinessTypeOptions: [],
      logisticsDeliveryModeOptions: []
    }
  },
  created() {},
  mounted: async function () {
    this.init()
    await Promise.all([this.getPlatform(), this.getAllCountry()])
    this.handleRouteQuery()
    this.initPageByTab()
  },
  activated() {
    this.initPageByTab()
    this.clearSelectClear()
  },
  methods: {
    async init() {
      const [
        pricingGenerateStatusOptions,
        pricingDemandStatusOptions,
        pricingTypeOptions,
        orderBusinessTypeOptions,
        logisticsDeliveryModeOptions,
        categoryGroupingOptions
      ] = await Promise.all([
        getDictByType("pricing_generate_status"),
        getDictByType("pricing_demand_status"),
        getDictByType("pricing_type"),
        getDictByType("prd_pricing_sale_model"),
        getDictByType("logistics_delivery_method"),
        getDictByType("costing_category_grouping")
      ])
      this.pricingGenerateStatusOptions = pricingGenerateStatusOptions
      this.pricingDemandStatusOptions = pricingDemandStatusOptions
      this.pricingTypeOptions = pricingTypeOptions
      this.orderBusinessTypeOptions = orderBusinessTypeOptions
      this.logisticsDeliveryModeOptions = logisticsDeliveryModeOptions
      this.categoryGroupingOptions = categoryGroupingOptions
    },
    initPageByTab() {
      this.searchForm.pricingGenerateStatus = this.costingTab
      this.getList()
    },
    // 处理路由参数
    handleRouteQuery() {
      const query = this.$route?.query || {}
      const params = {}
      Object.keys(query).forEach((key) => {
        params[key] = [query[key]]
      })
      Object.assign(this.searchForm, params)
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

    // 处理百分比 乘100,返回百分比格式
    handlePercentString(value) {
      return value || value === 0 ? (value * 100).toFixed(2) + "%" : "-"
    },
    // 处理字段显示
    handleFieldString(value) {
      return value || value === 0 ? value : "-"
    },
    //加载列表数据
    async getList() {
      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        filtering: setFiltering(this.searchForm),
        orderBy: this.orderBy
      }

      const { data } = await getProductPricingDemandPageApi(params)
      if (data.code === 0) {
        this.tableData = data.data.records.map((item) => {
          item.salePriceString = this.handleFieldString(item.salePrice)
          item.supplyPriceString = this.handleFieldString(item.supplyPrice)
          item.demandDescriptionString = this.handleFieldString(item.demandDescription)
          item.remarkString = this.handleFieldString(item.remark)
          item.promotionExpensesString = this.handlePercentString(item.promotionExpenses)
          item.profitString = this.handlePercentString(item.preTaxProfitRatio)
          return item
        })
        this.page.total = data.data.total
      }
    },

    //刷新回调
    refreshChange() {
      this.getList()
    },
    //搜索回调
    searchChange(params, page) {
      this.page.currentPage = 1
      this.getList()
    },
    //重置搜索条件
    searchReset() {
      console.log("重置")
      this.$refs.searchFormRef.resetFields()
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
    //选中数据
    selectionChange(tableData) {
      this.selectList = tableData
    },
    getCtrlList(scope) {
      return [
        {
          title: "核价信息",
          item: scope,
          clickFn: (scope) => {
            this.$router.push({
              path: "/productCosting/costingList/detail",
              query: {
                pricingDemandId: scope.row.pricingDemandId
              }
            })
          },
          show: this.permissions.product_pricing_demand_detail && scope.row.pricingGenerateStatus === "SUCCESS" // 已生成
        },
        {
          title: "编辑",
          item: scope,
          clickFn: (scope) => {
            this.$refs.addCostingRequireDialogRef.openDialog(scope.row)
          },
          show:
            this.permissions.product_pricing_demand_edit &&
            ["FAIL", "NOT_GENERATED"].includes(scope.row.pricingGenerateStatus) &&
            scope.row.pricingDemandStatus === "INITIAL_PENDING" // 未生成、生成失败、待处理
        },
        {
          title: "核价",
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
            this.permissions.product_pricing_demand_generate &&
            ["FAIL", "NOT_GENERATED"].includes(scope.row.pricingGenerateStatus) &&
            scope.row.pricingDemandStatus === "INITIAL_PENDING" // 未生成、生成失败、待处理
        },
        {
          title: "去编辑",
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
            this.permissions.product_pricing_demand_generate &&
            ["SUCCESS"].includes(scope.row.pricingGenerateStatus) &&
            scope.row.pricingDemandStatus === "INITIAL_PENDING" // 已生成、待处理
        },
        {
          title: "驳回",
          item: scope,
          clickFn: (scope) => {
            this.$refs.rejectDialogRef.openDialog([scope.row.pricingDemandId])
          },
          show:
            this.permissions.product_pricing_demand_reject &&
            ["NOT_GENERATED", "FAIL", "SUCCESS"].includes(scope.row.pricingGenerateStatus) &&
            scope.row.pricingDemandStatus === "INITIAL_PENDING" // 未生成、生成失败、待处理
        },
        {
          title: "提交审核",
          item: scope,
          clickFn: (scope) => {
            this.handleBatchAudit(scope.row.pricingDemandId)
          },
          show: this.permissions.product_pricing_demand_audit && scope.row.pricingDemandStatus === "PENDING_APPROVAL" // 待审核
        },
        {
          title: "审核进度",
          item: scope,
          clickFn: async (scope) => {
            // 打开OA该审批流，查看审批状态
            const { demandApprovalTmplCode, demandApprovalBusinessId } = scope.row
            const { data } = await getOaProcessUrlApi({
              templateCode: demandApprovalTmplCode,
              businessId: demandApprovalBusinessId
            })
            if (data.code === 0) {
              window.open(data.data)
            }
          },
          show:
            this.permissions.product_pricing_demand_review_progress &&
            ["UNDER_APPROVAL"].includes(scope.row.pricingDemandStatus) //审核中
        },
        {
          title: "作废",
          item: scope,
          clickFn: (scope) => {
            this.$confirm("确定作废该需求吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(async () => {
              const { data } = await invalidProductPricingDemandApi([scope.row.pricingDemandId])
              if (data.code === 0) {
                this.$message.success("作废成功")
                this.getList()
              }
            })
          },
          show:
            this.permissions.product_pricing_demand_del &&
            ["FAIL", "NOT_GENERATED"].includes(scope.row.pricingGenerateStatus) &&
            scope.row.pricingDemandStatus === "INITIAL_PENDING" // 未生成、生成失败、待处理
        }
      ]
    },
    handleAdd() {
      this.$refs.addCostingRequireDialogRef.openDialog(null)
    },
    // 批量去核价勾选
    async handleBatchCosting() {
      if (this.selectList.length === 0) {
        this.$message.warning("请先选择需求")
        return
      }
      const pricingDemandIdList = this.selectList.map((item) => item.pricingDemandId)
      const filtering = setFiltering(Object.assign({ pricingDemandId: pricingDemandIdList }))
      this.checkPRicingAndSetFiltering(filtering)
    },

    // 批量去核价筛选
    async handleBatchCostingFilter() {
      const filtering = setFiltering(this.searchForm)
      this.checkPRicingAndSetFiltering(filtering)
    },
    async checkPRicingAndSetFiltering(filtering) {
      this.$store.commit("SYNC_CALC_FILTERING", filtering)
      const { data } = await checkPricingDemandApi({ filtering })
      if (data.code === 0) {
        this.gotoBatchCosting()
      } else {
        this.$message.error(data.msg)
      }
    },
    gotoBatchCosting() {
      this.$router.push({
        path: `/productCosting/costingRequire/batchCosting`
        // query: { batchNo }
      })
    },

    // 导入
    handleImport() {
      this.$refs.commonImportRef.syncFn()
    },

    // 下载模板
    async customDownload() {
      const { data } = await productDownloadTemplateApi({ templateName: "核价需求导入模板" })
      downloadBlob(data, "核价需求导入模板.xlsx", "application/vnd.ms-excel;charset=utf-8")
    },
    // 导入数据
    async importExcelBtn(file) {
      if (!file) {
        this.$message.error("请上传文件!")
        return
      }
      this.$refs.commonImportRef.openFullScreen()
      let formData = new FormData()
      formData.append("file", file.raw)
      const { data } = await importPricingDemandApi(formData)
      if (data.code === 0) {
        this.successCount = data.data.successData?.length
        this.errorCount = data.data.errorData?.length
        this.errorData = data.data.errorData

        if (this.errorCount > 0) {
          this.$message.error("导入的excel表格数据有误，请点击异常文件下载查看原因")
          this.excelDangerStatus = true
        } else {
          this.$message.success("导入成功")
          this.excelDangerStatus = false
          this.updateList()
          this.$refs.commonImportRef.closeFullScreen()
        }
      }
    },
    // 下载错误文件
    async exportDangerExcel() {
      const { data } = await exportErrorDataApi({ templateName: "核价需求导入模板", errorList: this.errorData })
      downloadBlob(data, "核价需求错误数据.xlsx", "application/vnd.ms-excel;charset=utf-8")
    },

    // 导出
    async handleExport() {
      const exportParams = []
      // 有勾选导出勾选的数据
      if (this.selectList.length > 0) {
        const pricingDemandCode = this.selectList.map((item) => item.pricingDemandCode)
        exportParams.push({ code: "pricingDemandCode", value: pricingDemandCode.join(",") })
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
        id: 32,
        param: exportParams,
        exportModel: "ASYNC"
      })
      if (data.code === 0) {
        let count = getSession({ name: "downloadCount" })
        this.$store.commit("SET_DOWNLOAD_COUNT", Number(count) + 1)
        this.$message.success(`由于导出数据量较大，请点击右上角【下载列表】图标进行查看！`)
      }
    },
    updateList() {
      this.clearSelectClear()
      this.getList()
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
    },
    clearSelectClear() {
      this.$refs.crud?.selectClear()
    },
    // 切换标签
    changeCostingTab() {
      this.clearSelectClear()
      this.page.currentPage = 1
      this.initPageByTab()
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
    //  提交审核
    handleBatchAudit(pricingDemandId = null) {
      let pricingDemandIds = []
      if (!pricingDemandId) {
        if (this.selectList.length === 0) {
          this.$message.warning("请选择需要提交的核价")
          return
        }
        for (const item of this.selectList) {
          if (item.pricingDemandStatus !== "PENDING_APPROVAL") {
            this.$message.warning("请选择待审核的核价")
            return
          }
          pricingDemandIds.push(item.pricingDemandId)
        }
      } else {
        pricingDemandIds = [pricingDemandId]
      }

      const filtering = setFiltering({ pricingDemandId: pricingDemandIds })
      this.$refs.auditDialogRef.openDialog(filtering)
    },
    //  提交审核
    handleBatchAuditFilter() {
      const filtering = setFiltering(this.searchForm)
      this.$refs.auditDialogRef.openDialog(filtering)
    },
    handleBatchReject() {
      if (this.selectList.length === 0) {
        this.$message.warning("请选择数据")
        return
      }

      const pricingDemandIds = this.selectList.map((item) => item.pricingDemandId)
      this.$refs.rejectDialogRef.openDialog(pricingDemandIds)
    }
  }
}
</script>

<style lang="scss" scoped></style>
