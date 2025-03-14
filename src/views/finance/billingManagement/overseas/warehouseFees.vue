<template>
  <div>
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :option="warehouseFeesTableOptions"
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
        <export-btn
          v-if="permissions.finance_bill_overseas_export"
          :pageName="pageName"
          pageUrl="/finOverseaWarehouseBillDetail/warehousePageList"
          moduleName="finance"
          :columns="warehouseFeesTableOptions.column"
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
          <el-form-item prop="warehouseCode">
            <el-input
              v-model="searchForm.warehouseCode"
              size="small"
              placeholder="仓库,支持多个"
              clearable
              v-search-input
            ></el-input>
          </el-form-item>
          <el-form-item prop="feeType">
            <el-select v-model="searchForm.feeType" filterable size="small" placeholder="费用类型" clearable multiple>
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

      <template slot="searchAdvanced">
        <el-form :model="searchForm" ref="searchAdvancedRef" :inline="true">
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

      <template slot="feeType" slot-scope="scope">
        {{ scope.row.feeTypeDesc }}
      </template>
      <template slot="billCode" slot-scope="scope">
        <a @click="handleDetail(scope.row)">{{ scope.row.billCode }}</a>
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
import { warehouseFeesTableOptions } from "./list"
import batchUploadFile from "./components/batchUploadFile.vue"
import { getTokenUrl, setFiltering, setOrderBy, getDictByType } from "@/util/auth"
import { getOverseaWarehousePageApi } from "@/api/finance/billingManagement"
import { getCountry } from "@/api/baseSetup/bsecountry"
import { getAll as getWarehouseProviderApi } from "@/api/baseSetup/bsewarehouseprovider"

export default {
  name: "BillingManagementOverseasWarehouseFees",
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
      }海外仓库费用汇总`
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
        warehouseCode: "",
        providerCode: "",
        settlementOrg: [],
        feeType: [],
        billCode: ""
      },
      warehouseFeesTableOptions,
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
        { field: "warehouseCode", order: "asc" },
        { field: "feeType", order: "asc" }
      ],
      aggregateRecord: {}
    }
  },
  created() {},
  mounted: async function () {
    await this.init()
    if (this.params) {
      console.log("111", this.params)

      Object.assign(this.searchForm, this.params)
    }
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

      const { data } = await getOverseaWarehousePageApi(params)

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
            this.$emit("switchTab", "feeDetail", {
              billCode: scope.row.billCode,
              feeType: [scope.row.feeType],
              warehouseCode: scope.row.warehouseCode
            })
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
