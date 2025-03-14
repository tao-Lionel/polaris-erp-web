<template>
  <div>
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :option="feeDetailTableOption"
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
          v-if="permissions.finance_bill_head_export"
          :pageName="pageName"
          pageUrl="/finLogisticsHeadBill/pageListDetail"
          moduleName="finance"
          :columns="feeDetailTableOption.column"
          :pageReq="pageReq"
        ></export-btn>
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
          <el-form-item prop="containerNumber">
            <el-input
              v-model="searchForm.containerNumber"
              size="small"
              placeholder="柜号,支持多个"
              clearable
              v-search-input
            ></el-input>
          </el-form-item>
          <el-form-item prop="feeType">
            <el-select v-model="searchForm.feeType" filterable size="small" placeholder="费用类型" clearable multiple>
              <el-option v-for="item in feeTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="feeItem">
            <el-input
              v-model="searchForm.feeItem"
              size="small"
              placeholder="费用项,支持多个"
              clearable
              v-search-input
            ></el-input>
          </el-form-item>
        </el-form>
      </template>

      <template slot="searchAdvanced">
        <el-form :model="searchForm" ref="searchAdvancedRef" :inline="true">
          <el-form-item prop="departurePort">
            <el-select
              clearable
              v-model="searchForm.departurePort"
              filterable
              multiple
              placeholder="出发港口"
              size="small"
            >
              <el-option
                v-for="item in departureHarbourOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="destinationPort">
            <el-select
              clearable
              v-model="searchForm.destinationPort"
              filterable
              multiple
              placeholder="目的港口"
              size="small"
            >
              <el-option
                v-for="item in intoHarbourOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="destinationWarehouse">
            <el-select
              v-model="searchForm.destinationWarehouse"
              filterable
              size="small"
              placeholder="目的仓"
              clearable
              multiple
            >
              <el-option
                v-for="item in destinationWarehouseOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
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

      <template slot="containerNumber" slot-scope="scope">
        <copy-text hoverToShow>
          <a @click="handleDetail(scope.row)">{{ scope.row.containerNumber }}</a>
        </copy-text>
      </template>

      <template slot="transferNo" slot-scope="scope">
        <!-- 默认显示前三个 -->
        <copy-text hoverToShow v-for="(item, index) in scope.row.transferNo.slice(0, 3)" :key="item">
          <a @click="handleDetail(scope.row.transferId[index], 'transfer')">{{ item }}</a>
        </copy-text>

        <el-popover placement="bottom" width="200" trigger="hover" v-if="scope.row.transferNo.length > 3">
          <a
            v-for="(item, index) in scope.row.transferNo.slice(3)"
            :key="item"
            @click="handleDetail(scope.row.transferId[index], 'transfer')"
          >
            {{ item }}
          </a>
          <span style="font-weight: bold; color: black; cursor: pointer" slot="reference">......</span>
        </el-popover>
      </template>

      <template slot="feeType" slot-scope="scope">
        {{ feeTypeOptions.find((item) => item.value === scope.row.feeType)?.label }}
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { feeDetailTableOption } from "./list"
import { getDictByType, downloadBlob, setFiltering, setOrderBy } from "@/util/auth"
import { getHeadBillFeeDetailPageListApi } from "@/api/finance/billingManagement"
import { getAllWarehouse as getAllWarehouseApi } from "@/api/baseSetup/bsewarehouse"
import { fetchList as getLogisticsCompanyApi } from "@/api/baseSetup/bsetransportcarrier/bsetransportcarrier.js"
import { getAll as getAllCorporationApi } from "@/api/baseSetup/bsecorporation"

export default {
  name: "BillingManagementFirstLegFeeDetail",
  components: {},
  computed: {
    ...mapGetters(["permissions"]),
    pageName() {
      return `${
        this.searchForm.month?.length ? this.searchForm.month[0] + "至" + this.searchForm.month[1] : ""
      }头程费用明细`
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
        containerNumber: "",
        feeType: [],
        feeItem: "",
        departurePort: [],
        destinationPort: [],
        destinationWarehouse: [],
        settlementCompanyName: [],
        supplierName: []
      },
      feeDetailTableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableData: [],
      selectList: [],
      departureHarbourOptions: [],
      intoHarbourOptions: [],
      destinationWarehouseOptions: [],
      feeTypeOptions: [],
      feeItemOptions: [],
      settlementCompanyNameOptions: [],
      supplierNameOptions: [],
      orderBy: [
        { field: "month", order: "desc" },
        { filed: "containerNumber", order: "asc" },
        { filed: "feeType", order: "asc" }
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
      const [intoHarbourOptions, departureHarbourOptions, feeTypeOptions] = await Promise.all([
        getDictByType("into_harbour"),
        getDictByType("departure_harbour"),
        getDictByType("head_bill_fee_type")
      ])

      //目的港
      this.intoHarbourOptions = intoHarbourOptions
      //起运港
      this.departureHarbourOptions = departureHarbourOptions
      this.feeTypeOptions = feeTypeOptions
      this.getAllWarehouse()
      this.getSettlementCompany()
      this.getLogisticsCompany()
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

    // 获取仓库
    async getAllWarehouse() {
      getAllWarehouseApi({
        funcState: "1",
        delFlag: "0"
      }).then((res) => {
        this.destinationWarehouseOptions = res.data.data.map((item) => {
          return {
            label: item.warehouseName,
            value: item.warehouseId
          }
        })
      })
    },

    //加载列表数据
    async getList(column = null) {
      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        filtering: setFiltering(this.searchForm, { month: "BETWEEN" }),
        orderBy: setOrderBy(column, this.orderBy),
        aggregate: [{ field: "fee", function: "sum" }]
      }

      const { data } = await getHeadBillFeeDetailPageListApi(params)

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
    handleDetail(row, type = "feeSummary") {
      switch (type) {
        case "feeSummary":
          this.$emit("switchTab", "feeSummary", { containerNumber: row.containerNumber })
          break
        case "transfer":
          this.$router.push({
            path: "/transfer/fristMileTransfer/detail",
            query: {
              id: row,
              type: "detail"
            }
          })
          break
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (column.property === "month") {
          sums[index] = "总计："
        } else if (column.property === "fee") {
          sums[index] = this.aggregateRecord.fee
        }
      })
      return sums
    }
  }
}
</script>

<style lang="scss" scoped></style>
