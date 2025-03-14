<template>
  <div>
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :option="billTableOption"
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
        <el-button v-if="permissions.finance_bill_head_import" type="primary" size="small" @click="handleUpload">
          导入
        </el-button>
        <export-btn
          v-if="permissions.finance_bill_head_export"
          :pageName="pageName"
          pageUrl="/finLogisticsHeadBill/pageList"
          moduleName="finance"
          :columns="billTableOption.column"
          :pageReq="pageReq"
        ></export-btn>
        <el-button v-if="permissions.finance_bill_head_delete" type="primary" size="small" @click="handleDelete()"
          >删除</el-button
        >
      </template>
      <!-- 搜索栏 -->
      <template slot="search">
        <el-form :model="searchForm" ref="searchFormRef" :inline="true">
          <el-form-item prop="month">
            <el-date-picker
              v-model="searchForm.month"
              size="small"
              type="monthrange"
              value-format="yyyy-MM"
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="settlementCompanyName">
            <el-select
              v-model="searchForm.settlementCompanyName"
              filterable
              size="small"
              placeholder="结算公司"
              clearable
              multiple
            >
              <el-option
                v-for="item in settlementCompanyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="supplierName">
            <el-select
              v-model="searchForm.supplierName"
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
        </el-form>
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
import { billTableOption } from "./list"
import { getDictByType, setFiltering, setOrderBy, getTokenUrl } from "@/util/auth"
import { getHeadBillPageListApi, deleteHeadBillApi } from "@/api/finance/billingManagement"
import batchUploadFile from "./components/batchUploadFile.vue"
import { fetchList as getLogisticsCompanyApi } from "@/api/baseSetup/bsetransportcarrier/bsetransportcarrier.js"
import { getAll as getAllCorporationApi } from "@/api/baseSetup/bsecorporation"

export default {
  name: "BillingManagementFirstLegBillTable",
  components: { batchUploadFile },
  computed: {
    ...mapGetters(["permissions"]),
    pageName() {
      return `${
        this.searchForm.month?.length ? this.searchForm.month[0] + "至" + this.searchForm.month[1] : ""
      }头程账单`
    },
    pageReq() {
      return { filtering: setFiltering(this.searchForm, { month: "BETWEEN" }) }
    }
  },
  props: {
    params: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      searchForm: {
        month: [],
        settlementCompanyName: [],
        supplierName: []
      },
      billTableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableData: [],
      selectList: [],
      supplierOptions: [],
      settlementCompanyOptions: [],
      orderBy: [
        { field: "month", order: "desc" },
        { filed: "supplierName", order: "asc" }
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
      this.getLogisticsCompany()
      this.getSettlementCompany()
      this.getList()
    },

    // 获取结算公司
    async getSettlementCompany() {
      const { data } = await getAllCorporationApi()
      if (data.code === 0) {
        this.settlementCompanyOptions = data.data.map((item) => {
          return {
            label: item.corporationName,
            value: item.corporationName
          }
        })
      }
    },

    // 获取物流商
    async getLogisticsCompany() {
      const { data } = await getLogisticsCompanyApi({ current: 1, size: 9999 })
      this.supplierOptions = data.data.records.map((item) => {
        return {
          label: item.carrierName,
          value: item.carrierName
        }
      })
    },

    //加载列表数据
    async getList(column = null) {
      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        filtering: setFiltering(this.searchForm, { month: "BETWEEN" }),
        orderBy: setOrderBy(column, this.orderBy),
        aggregate: [{ field: "amount", function: "sum" }]
      }

      const { data } = await getHeadBillPageListApi(params)

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
    // 排序
    sortChange(column) {
      this.getList(column)
    },
    getCtrlList(scope) {
      return [
        {
          title: "费用汇总",
          item: scope,
          clickFn: (scope) => {
            this.$emit("switchTab", "feeSummary", {
              month: [scope.row.month, scope.row.month],
              settlementCompanyName: [scope.row.settlementCompanyName],
              supplierName: [scope.row.supplierName]
            })
          },
          show: true
        },
        {
          title: "明细",
          item: scope,
          clickFn: (scope) => {
            this.$emit("switchTab", "feeDetail", {
              month: [scope.row.month, scope.row.month],
              settlementCompanyName: [scope.row.settlementCompanyName],
              supplierName: [scope.row.supplierName]
            })
          },
          show: true
        },
        {
          title: "查看Excel文件",
          item: scope,
          clickFn: (scope) => {
            if (!scope.row.excelFilePath) {
              this.$message.warning("暂无文件")
              return
            }
            window.open(window.location.origin + "/#/previewExcel?url=" + encodeURIComponent(scope.row.excelFilePath))
          },
          show: true
        },
        {
          title: "下载Excel文件",
          item: scope,
          clickFn: (scope) => {
            if (!scope.row.excelFilePath) {
              this.$message.warning("暂无文件")
              return
            }
            window.location.href = getTokenUrl(scope.row.excelFilePath)
          },
          show: true
        },
        {
          title: "查看PDF账单",
          item: scope,
          clickFn: (scope) => {
            if (!scope.row.pdfFilePath) {
              this.$message.warning("暂无文件")
              return
            }
            window.open(getTokenUrl(scope.row.pdfFilePath) + "&type=previewPdf")
          },
          show: true
        },
        {
          title: "下载PDF账单",
          item: scope,
          clickFn: (scope) => {
            if (!scope.row.pdfFilePath) {
              this.$message.warning("暂无文件")
              return
            }
            window.location.href = getTokenUrl(scope.row.pdfFilePath)
          },
          show: true
        },
        {
          title: "删除",
          item: scope,
          clickFn: (scope) => {
            this.handleDelete([scope.row.billCode])
          },
          show: this.permissions.finance_bill_head_delete
        }
      ]
    },
    // 删除
    handleDelete(ids = null) {
      if (!ids) {
        if (this.selectList.length === 0) {
          this.$message.warning("请先选择数据")
          return
        }
        ids = this.selectList.map((item) => item.billCode)
      }

      this.$confirm("删除后将无法恢复，确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const { data } = await deleteHeadBillApi(ids)
        if (data.code === 0) {
          this.$message.success("删除成功")
          this.getList()
        }
      })
    },

    handleUpload() {
      this.$refs.batchUploadFileRef.openDialog()
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (column.property === "month") {
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
