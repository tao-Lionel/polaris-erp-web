<template>
  <div>
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :option="feeSummaryTableOptions"
      @refresh-change="refreshChange"
      @search-change="searchChange"
      @search-reset="searchReset"
      @size-change="sizeChange"
      @current-change="currentChange"
      @selection-change="selectionChange"
      @sort-change="sortChange"
      :summaryMethod="getSummaries"
    >
      <!-- 操作按钮栏 -->
      <template slot="menuLeft">
        <el-button v-if="permissions.finance_bill_overseas_import" type="primary" size="small" @click="handleImport">
          导入
        </el-button>
        <export-btn
          v-if="permissions.finance_bill_overseas_export"
          :pageName="pageName"
          pageUrl="/finOverseaWarehouseBillDetail/feePageList"
          moduleName="finance"
          :columns="feeSummaryTableOptions.column"
          :pageReq="pageReq"
        ></export-btn>
      </template>
      <!-- 搜索栏 -->
      <template slot="search">
        <el-form :model="searchForm" ref="searchFormRef" :inline="true">
          <el-form-item prop="billTime">
            <el-date-picker
              v-model="searchForm.billTime"
              size="small"
              type="monthrange"
              value-format="yyyy-MM"
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="site">
            <el-select v-model="searchForm.site" filterable size="small" placeholder="站点" clearable multiple>
              <el-option v-for="item in siteOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="providerCode">
            <el-select
              v-model="searchForm.providerCode"
              filterable
              size="small"
              placeholder="供应商"
              clearable
              multiple
            >
              <el-option v-for="item in supplierOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="settlementOrg">
            <el-input
              v-model="searchForm.settlementOrg"
              size="small"
              placeholder="结算公司,支持多个"
              clearable
              v-search-input
            ></el-input>
          </el-form-item>
        </el-form>
      </template>

      <template slot="searchAdvanced">
        <el-form :model="searchForm" ref="searchAdvancedRef" :inline="true">
          <el-form-item prop="feeType">
            <el-select v-model="searchForm.feeType" filterable size="small" placeholder="费用类型" clearable>
              <el-option v-for="item in costTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="billCode">
            <el-input
              v-model="searchForm.billCode"
              size="small"
              placeholder="账单号,支持多个"
              clearable
              v-search-input
            ></el-input>
          </el-form-item>
        </el-form>
      </template>

      <template slot="billCode" slot-scope="scope">
        <a @click="handleDetail(scope.row)">{{ scope.row.billCode }}</a>
      </template>

      <template slot="operate" slot-scope="scope">
        <avue-crud-ctrl :list="getCtrlList(scope)" :defaultShowNumber="2"></avue-crud-ctrl>
      </template>
    </avue-crud>

    <batchUploadFile ref="batchUploadFileRef" @updateList="getList"></batchUploadFile>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { feeSummaryTableOptions } from "./list"
import batchUploadFile from "./components/batchUploadFile.vue"
import { getTokenUrl, setFiltering, setOrderBy, getDictByType } from "@/util/auth"
import { getOverseaFeePageApi } from "@/api/finance/billingManagement"
import { getCountry } from "@/api/baseSetup/bsecountry"
import { getAll as getWarehouseProviderApi } from "@/api/baseSetup/bsewarehouseprovider"

export default {
  name: "BillingManagementOverseasFeeSummary",
  components: { batchUploadFile },
  props: {
    params: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters(["permissions"]),
    pageName() {
      return `${
        this.searchForm.billTime?.length ? this.searchForm.billTime[0] + "至" + this.searchForm.billTime[1] : ""
      }海外仓费用汇总`
    },
    pageReq() {
      return { filtering: setFiltering(this.searchForm, { billTime: "BETWEEN" }) }
    }
  },
  data() {
    return {
      searchForm: {
        billTime: [],
        site: [],
        providerCode: [],
        settlementOrg: "",
        feeType: [],
        billCode: ""
      },
      feeSummaryTableOptions,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableData: [],
      selectList: [],
      siteOptions: [],
      supplierOptions: [],
      settlementCompanyOptions: [],
      costTypeOptions: [],
      orderBy: [
        { field: "billTime", order: "desc" },
        { field: "providerCode", order: "asc" },
        { field: "feeType", order: "asc" }
      ],
      aggregateRecord: {}
    }
  },
  created() {},
  mounted: async function () {
    if (this.params) {
      Object.assign(this.searchForm, this.params)
    }
    this.init()
  },
  async activated() {},
  methods: {
    async init() {
      this.costTypeOptions = await getDictByType("oversea_warehouse_fee_type")
      await Promise.all([this.getAllCountry(), this.getAllSupplier(), this.getList()])
    },

    // 获取供应商
    async getAllSupplier() {
      const { data } = await getWarehouseProviderApi()
      this.supplierOptions = data.data.map((item) => ({
        label: item.providerName,
        value: item.providerCode
      }))
    },

    // 获取国家
    async getAllCountry() {
      const { data } = await getCountry()
      this.siteOptions = data.data.map((item) => ({
        label: item.countryCode,
        value: item.countryCode
      }))
    },

    //加载列表数据
    async getList(column = null) {
      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        filtering: setFiltering(this.searchForm, { billTime: "BETWEEN" }),
        orderBy: setOrderBy(column, this.orderBy),
        aggregate: [{ field: "amount", function: "sum" }]
      }

      const { data } = await getOverseaFeePageApi(params)

      this.tableData = data.data.records
      this.page.total = data.data.total
      this.aggregateRecord = data.data.aggregateRecord
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
      this.$refs.searchAdvancedRef?.resetFields()
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
    // 导入
    handleImport() {
      this.$refs.batchUploadFileRef.openDialog()
    },
    // 排序
    sortChange(column) {
      this.getList(column)
    },
    getCtrlList(scope) {
      return [
        {
          title: "仓库费用",
          item: scope,
          clickFn: (scope) => {
            this.$emit("switchTab", "warehouseFees", {
              billCode: scope.row.billCode,
              feeType: [scope.row.feeType]
            })
          },
          show: true
        },
        {
          title: "明细",
          item: scope,
          clickFn: (scope) => {
            this.$emit("switchTab", "feeDetail", {
              billCode: scope.row.billCode,
              feeType: [scope.row.feeType]
            })
          },
          show: true
        },
        {
          title: "查看Excel文件",
          item: scope,
          clickFn: (scope) => {
            if (!scope.row.excelFileUrl) {
              this.$message.warning("暂无文件")
              return
            }
            window.open(window.location.origin + "/#/previewExcel?url=" + encodeURIComponent(scope.row.excelFileUrl))
          },
          show: true
        },
        {
          title: "下载Excel文件",
          item: scope,
          clickFn: (scope) => {
            if (!scope.row.excelFileUrl) {
              this.$message.warning("暂无文件")
              return
            }
            window.location.href = getTokenUrl(scope.row.excelFileUrl)
          },
          show: true
        },
        {
          title: "查看PDF账单",
          item: scope,
          clickFn: (scope) => {
            if (!scope.row.pdfFileUrl) {
              this.$message.warning("暂无文件")
              return
            }
            window.open(getTokenUrl(scope.row.pdfFileUrl) + "&type=previewPdf")
          },
          show: true
        },
        {
          title: "下载PDF账单",
          item: scope,
          clickFn: (scope) => {
            if (!scope.row.pdfFileUrl) {
              this.$message.warning("暂无文件")
              return
            }
            window.location.href = getTokenUrl(scope.row.pdfFileUrl)
          },
          show: true
        }
      ]
    },
    handleDetail(row) {
      this.$emit("switchTab", "bill", { billCode: row.billCode })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (column.property === "billTime") {
          sums[index] = "总计："
        } else if (column.property === "amount") {
          sums[index] = this.aggregateRecord.amount
        }
      })
      return sums
    }
  }
}
</script>

<style lang="scss" scoped></style>
