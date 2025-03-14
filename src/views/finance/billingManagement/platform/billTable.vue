<template>
  <div>
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :option="billTableOptions"
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
        <el-button v-if="permissions.finance_bill_settlement_import" type="primary" size="small" @click="handleImport">
          导入
        </el-button>
        <export-btn
          v-if="permissions.finance_bill_settlement_export"
          :pageName="pageName"
          pageUrl="/settlement/billPageList"
          moduleName="finance"
          :columns="billTableOptions.column"
          :pageReq="pageReq"
        ></export-btn>

        <el-dropdown v-if="permissions.finance_bill_settlement_download_invoice" style="margin-right: 10px">
          <el-button type="primary" size="small">
            批量下载发票/SBOL<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handleBatchDownload(1)">已勾选数据</el-dropdown-item>
            <el-dropdown-item @click.native="handleBatchDownload(2)">全部数据</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <!-- 搜索栏 -->
      <template slot="search">
        <el-form :model="searchForm" ref="searchFormRef" :inline="true">
          <el-form-item prop="feeType">
            <!-- <el-select v-model="searchForm.feeType" filterable size="small" placeholder="费用类型" clearable multiple>
              <el-option v-for="item in costTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select> -->
            <el-input
              v-model="searchForm.feeType"
              size="small"
              placeholder="费用类型,支持多个"
              clearable
              v-search-input
            ></el-input>
          </el-form-item>
          <el-form-item prop="platSettlementNo">
            <el-input
              v-model="searchForm.platSettlementNo"
              size="small"
              placeholder="结算单,支持多个"
              clearable
              v-search-input
            ></el-input>
          </el-form-item>
          <el-form-item prop="platBillNo">
            <el-input
              v-model="searchForm.platBillNo"
              size="small"
              placeholder="账单单号,支持多个"
              clearable
              v-search-input
            ></el-input>
          </el-form-item>
          <!-- <el-form-item prop="poAdjustOrder">
            <el-input
              v-model="searchForm.poAdjustOrder"
              size="small"
              placeholder="PO/调整单,支持多个"
              clearable
              v-search-input
            ></el-input>
          </el-form-item> -->
          <el-form-item prop="storeId">
            <el-select v-model="searchForm.storeId" filterable size="small" placeholder="店铺" clearable multiple>
              <el-option
                v-for="item in storeOptions"
                :key="item.storeId"
                :label="item.storeAccount"
                :value="item.storeId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="searchAdvanced">
        <el-form :model="searchForm" ref="searchAdvancedRef" :inline="true">
          <el-form-item prop="platform">
            <el-select v-model="searchForm.platform" filterable size="small" placeholder="平台" clearable multiple>
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
            <el-select v-model="searchForm.site" filterable size="small" placeholder="站点" clearable multiple>
              <el-option v-for="item in siteOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="billDate">
            <el-date-picker
              v-model="searchForm.billDate"
              type="daterange"
              size="small"
              start-placeholder="账单开始日期"
              end-placeholder="账单结束日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="paymentDate">
            <el-date-picker
              v-model="searchForm.paymentDate"
              type="daterange"
              size="small"
              start-placeholder="支付开始日期"
              end-placeholder="支付结束日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="billVoucherUrl">
            <el-select v-model="searchForm.billVoucherUrl" size="small" placeholder="是否有附件" clearable>
              <el-option label="是" value="NOT_EQUAL"> </el-option>
              <el-option label="否" value="EQUAL"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>

      <template slot="platSettlementNo" slot-scope="scope">
        <copy-text hoverToShow>
          <a @click="handleDetail(scope.row)">{{ scope.row.platSettlementNo }}</a>
        </copy-text>
      </template>

      <template slot="billAttachmentCount" slot-scope="scope">
        <a v-if="scope.row.billAttachmentCount > 0" @click="downloadFile(scope.row.billVoucherUrl)">
          {{ scope.row.billAttachmentCount }}
        </a>
        <span v-else> {{ scope.row.billAttachmentCount }} </span>
      </template>

      <template slot="operate" slot-scope="scope">
        <avue-crud-ctrl :list="getCtrlList(scope)" :defaultShowNumber="1"></avue-crud-ctrl>
      </template>
    </avue-crud>

    <batchUploadFile ref="batchUploadFileRef" @updateList="getList"></batchUploadFile>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { billTableOptions } from "./list"
import { getPlayTypeAll } from "@/api/order/orderManage"
import batchUploadFile from "./components/batchUploadFile.vue"
import { getTokenUrl, setFiltering, setOrderBy, downloadBlob } from "@/util/auth"
import { getBillPageListApi, downloadBillPageApi } from "@/api/finance/billingManagement"
import { getCountry } from "@/api/baseSetup/bsecountry"
import { getAll } from "@/api/baseSetup/bsestore.js"

export default {
  name: "BillingManagementPlatformBillTable",
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
        this.searchForm.paymentDate?.length
          ? this.searchForm.paymentDate[0] + "至" + this.searchForm.paymentDate[1]
          : ""
      }账单`
    },
    pageReq() {
      return { filtering: setFiltering(this.searchForm) }
    }
  },
  data() {
    return {
      searchForm: {
        feeType: "",
        poAdjustOrder: "",
        platform: [],
        site: [],
        storeId: [],
        billDate: [],
        paymentDate: [],
        platSettlementNo: "",
        platBillNo: "",
        billVoucherUrl: ""
      },
      billTableOptions,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableData: [],
      selectList: [],
      platformOptions: [],
      siteOptions: [],
      storeOptions: [],
      costTypeOptions: [],
      orderBy: [
        { field: "billDate", order: "desc" }
        // { field: "paymentDate", order: "desc" },
        // { filed: "storeAccount", order: "asc" }
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
  methods: {
    async init() {
      await Promise.all([
        this.getCostTypeList(),
        this.getPlatformList(),
        this.getAllCountry(),
        this.getStoreList(),
        this.getList()
      ])
    },

    // 获取国家
    async getAllCountry() {
      const { data } = await getCountry()
      this.siteOptions = data.data.map((item) => ({
        label: item.countryCode,
        value: item.countryCode
      }))
    },

    // 获取费用类型
    async getCostTypeList() {
      this.costTypeOptions = []
    },

    // 获取平台
    async getPlatformList() {
      const { data } = await getPlayTypeAll()
      if (data.code == 0) {
        this.platformOptions = data.data
      }
    },

    // 获取店铺
    async getStoreList() {
      const { data } = await getAll()
      this.storeOptions = data.data
    },

    //加载列表数据
    async getList(column = null) {
      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        filtering: setFiltering(this.searchForm),
        orderBy: setOrderBy(column, this.orderBy),
        aggregate: [{ field: "amount", function: "sum" }]
      }

      if (this.searchForm.billVoucherUrl === "NOT_EQUAL") {
        params.filtering.forEach((item) => {
          if (item.field === "billVoucherUrl") {
            item.operator = "NOT_EQUAL"
            item.value = ""
          }
        })
      } else if (this.searchForm.billVoucherUrl === "EQUAL") {
        params.filtering.forEach((item) => {
          if (item.field === "billVoucherUrl") {
            item.operator = "EQUAL"
            item.value = ""
          }
        })
      }

      const { data } = await getBillPageListApi(params)

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
    // 导出
    handleExport() {
      console.log("导出")
    },
    // 排序
    sortChange(column) {
      this.getList(column)
    },
    getCtrlList(scope) {
      return [
        {
          title: "明细",
          item: scope,
          clickFn: (scope) => {
            this.$emit("switchTab", "billDetail", { platBillNo: scope.row.platBillNo })
          },
          show: true
        },
        // {
        //   title: "查看Excel文件",
        //   item: scope,
        //   clickFn: (scope) => {
        //     if (!scope.row.excelUrl) {
        //       this.$message.warning("暂无文件")
        //       return
        //     }
        //     window.open(window.location.origin + "/#/previewExcel?url=" + encodeURIComponent(scope.row.excelUrl))
        //   },
        //   show: true
        // },
        // {
        //   title: "下载Excel文件",
        //   item: scope,
        //   clickFn: (scope) => {
        //     if (!scope.row.excelUrl) {
        //       this.$message.warning("暂无文件")
        //       return
        //     }
        //     window.location.href = getTokenUrl(scope.row.excelUrl)
        //   },
        //   show: true
        // },
        {
          title: "查看PDF账单",
          item: scope,
          clickFn: (scope) => {
            if (!scope.row.billVoucherUrl) {
              this.$message.warning("暂无文件")
              return
            }
            window.open(getTokenUrl(scope.row.billVoucherUrl) + "&type=previewPdf")
          },
          show: true
        },
        {
          title: "下载PDF账单",
          item: scope,
          clickFn: (scope) => {
            if (!scope.row.billVoucherUrl) {
              this.$message.warning("暂无文件")
              return
            }
            this.downloadFile(scope.row.billVoucherUrl)
          },
          show: true
        }
      ]
    },
    handleDetail(row) {
      this.$emit("switchTab", "settlement", { platSettlementNo: row.platSettlementNo })
    },
    downloadFile(billVoucherUrl) {
      window.location.href = getTokenUrl(billVoucherUrl)
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (column.property === "storeAccount") {
          sums[index] = "总计："
        } else if (column.property === "amount") {
          sums[index] = this.aggregateRecord.amount
        }
      })
      return sums
    },
    async handleBatchDownload(type) {
      let params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        filtering: setFiltering(this.searchForm),
        orderBy: setOrderBy(null, this.orderBy)
      }

      if (this.searchForm.billVoucherUrl === "NOT_EQUAL") {
        params.filtering.forEach((item) => {
          if (item.field === "billVoucherUrl") {
            item.operator = "NOT_EQUAL"
            item.value = ""
          }
        })
      } else if (this.searchForm.billVoucherUrl === "EQUAL") {
        params.filtering.forEach((item) => {
          if (item.field === "billVoucherUrl") {
            item.operator = "EQUAL"
            item.value = ""
          }
        })
      }
      if (type === 1) {
        if (this.selectList.length === 0) {
          this.$message.warning("请选择需要下载的账单")
          return
        }
        const platBillNoList = this.selectList.map((item) => item.platBillNo)
        params.filtering = setFiltering({ platBillNo: platBillNoList })
      }

      const res = await downloadBillPageApi(params)
      const filename = res?.headers["content-disposition"].split("=")[1]
      downloadBlob(res.data, filename, "application/zip")
    }
  }
}
</script>

<style lang="scss" scoped></style>
