<template>
  <div>
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :option="settlementTableOptions"
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
        <el-button
          v-if="permissions.finance_bill_settlement_delete"
          type="primary"
          size="small"
          @click="handleDelete()"
        >
          删除
        </el-button>
        <export-btn
          v-if="permissions.finance_bill_settlement_export"
          :pageName="pageName"
          pageUrl="/settlement/settlementPageList"
          moduleName="finance"
          :columns="settlementTableOptions.column"
          :pageReq="pageReq"
        ></export-btn>
      </template>
      <!-- 搜索栏 -->
      <template slot="search">
        <el-form :model="searchForm" ref="searchFormRef" :inline="true">
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
          <el-form-item prop="platSettlementNo">
            <el-input
              v-model="searchForm.platSettlementNo"
              size="small"
              placeholder="结算单,支持多个"
              clearable
              v-search-input
            ></el-input>
          </el-form-item>
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
          <el-form-item prop="settlementVoucherUrl">
            <el-select v-model="searchForm.settlementVoucherUrl" size="small" placeholder="是否有附件" clearable>
              <el-option label="是" value="NOT_EQUAL"> </el-option>
              <el-option label="否" value="EQUAL"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>

      <template slot="settlementAttachmentQuantity" slot-scope="scope">
        <a v-if="scope.row.settlementAttachmentQuantity > 0" @click="downloadFile(scope.row.settlementVoucherUrl)">
          {{ scope.row.settlementAttachmentQuantity }}
        </a>
        <span v-else> {{ scope.row.settlementAttachmentQuantity }} </span>
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
import { settlementTableOptions } from "./list"
import { getPlayTypeAll } from "@/api/order/orderManage"
import { getTokenUrl, setFiltering, setOrderBy } from "@/util/auth"
import batchUploadFile from "./components/batchUploadFile.vue"
import { getSettlementPageListApi, deleteSettlementApi } from "@/api/finance/billingManagement"
import { getCountry } from "@/api/baseSetup/bsecountry"
import { getAll } from "@/api/baseSetup/bsestore.js"

export default {
  name: "BillingManagementPlatformSettlementTable",
  components: {
    batchUploadFile
  },
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
      }结算单`
    },
    pageReq() {
      return { filtering: setFiltering(this.searchForm) }
    }
  },
  data() {
    return {
      searchForm: {
        paymentDate: [],
        platSettlementNo: "",
        platform: [],
        site: [],
        storeId: [],
        settlementVoucherUrl: ""
      },

      settlementTableOptions,
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
      orderBy: [{ field: "paymentDate", order: "desc" }],
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
      await Promise.all([this.getPlatformList(), this.getAllCountry(), this.getStoreList(), this.getList()])
    },

    // 获取国家
    async getAllCountry() {
      const { data } = await getCountry()
      this.siteOptions = data.data.map((item) => ({
        label: item.countryCode,
        value: item.countryCode
      }))
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
        aggregate: [
          { field: "amount", function: "sum" },
          { field: "billQuantity", function: "sum" }
        ]
      }

      if (this.searchForm.settlementVoucherUrl === "NOT_EQUAL") {
        params.filtering.forEach((item) => {
          if (item.field === "settlementVoucherUrl") {
            item.operator = "NOT_EQUAL"
            item.value = ""
          }
        })
      } else if (this.searchForm.settlementVoucherUrl === "EQUAL") {
        params.filtering.forEach((item) => {
          if (item.field === "settlementVoucherUrl") {
            item.operator = "EQUAL"
            item.value = ""
          }
        })
      }

      const { data } = await getSettlementPageListApi(params)

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
    // 删除
    handleDelete(ids = null) {
      if (!ids) {
        if (this.selectList.length === 0) {
          this.$message.warning("请先选择数据")
          return
        }
        ids = this.selectList.map((item) => item.settlementCode)
      }

      this.$confirm("删除后将无法恢复，确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const { data } = await deleteSettlementApi(ids)
        if (data.code === 0) {
          this.$message.success("删除成功")
          this.getList()
        }
      })
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
            this.$emit("switchTab", "bill", { platSettlementNo: scope.row.platSettlementNo })
          },
          show: true
        },
        {
          title: "查看Excel文件",
          item: scope,
          clickFn: (scope) => {
            if (!scope.row.settlementVoucherUrl) {
              this.$message.warning("暂无文件")
              return
            }
            window.open(
              window.location.origin + "/#/previewExcel?url=" + encodeURIComponent(scope.row.settlementVoucherUrl)
            )
          },
          show: true
        },
        {
          title: "下载Excel文件",
          item: scope,
          clickFn: (scope) => {
            if (!scope.row.settlementVoucherUrl) {
              this.$message.warning("暂无文件")
              return
            }
            this.downloadFile(scope.row.settlementVoucherUrl)
          },
          show: true
        },
        // {
        //   title: "查看PDF账单",
        //   item: scope,
        //   clickFn: (scope) => {
        //     if (!scope.row.pdfUrl) {
        //       this.$message.warning("暂无文件")
        //       return
        //     }
        //     window.open(getTokenUrl(scope.row.pdfUrl) + "&type=previewPdf")
        //   },
        //   show: true
        // },
        // {
        //   title: "下载PDF账单",
        //   item: scope,
        //   clickFn: (scope) => {
        //     if (!scope.row.pdfUrl) {
        //       this.$message.warning("暂无文件")
        //       return
        //     }
        //     window.location.href = getTokenUrl(scope.row.pdfUrl)
        //   },
        //   show: true
        // },
        {
          title: "删除",
          item: scope,
          clickFn: (scope) => {
            this.handleDelete([scope.row.settlementCode])
          },
          show: this.permissions.finance_bill_settlement_delete
        }
      ]
    },
    downloadFile(settlementVoucherUrl) {
      window.location.href = getTokenUrl(settlementVoucherUrl)
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (column.property === "storeAccount") {
          sums[index] = "总计："
        } else if (column.property === "amount") {
          sums[index] = this.aggregateRecord.amount
        } else if (column.property === "billQuantity") {
          sums[index] = this.aggregateRecord.billQuantity
        }
      })
      return sums
    }
  }
}
</script>

<style lang="scss" scoped></style>
