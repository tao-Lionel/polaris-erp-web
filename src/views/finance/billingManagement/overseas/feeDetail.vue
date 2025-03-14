<template>
  <div>
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :option="feeDetailTableOptions"
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
          pageName="海外仓账单-费用明细"
          pageUrl="/finOverseaWarehouseBillDetail/pageList"
          moduleName="finance"
          :columns="feeDetailTableOptions.column"
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
          <el-form-item prop="warehouseCode">
            <el-input
              v-model="searchForm.warehouseCode"
              size="small"
              placeholder="仓库,支持多个"
              clearable
              v-search-input
            ></el-input>
          </el-form-item>
          <el-form-item prop="parentBusinessNo">
            <el-input
              v-model="searchForm.parentBusinessNo"
              size="small"
              placeholder="业务单号,支持多个"
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
          <el-form-item prop="feeItem">
            <el-select v-model="searchForm.feeItem" filterable size="small" placeholder="费用项" clearable multiple>
              <el-option v-for="item in feeItemOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>

      <template slot="searchAdvanced">
        <el-form :model="searchForm" ref="searchAdvancedRef" :inline="true">
          <el-form-item prop="site">
            <el-select v-model="searchForm.site" filterable size="small" placeholder="站点" clearable multiple>
              <el-option v-for="item in siteOptions" :key="item.value" :label="item.label" :value="item.value">
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

      <template slot="feeType" slot-scope="scope">
        {{ scope.row.feeTypeDesc }}
      </template>
      <template slot="warehouseCode" slot-scope="scope">
        <copy-text hoverToShow>
          <a @click="handleDetail('warehouseFees', scope.row)">{{ scope.row.warehouseCode }}</a>
        </copy-text>
      </template>
      <template slot="billCode" slot-scope="scope">
        <copy-text hoverToShow>
          <a @click="handleDetail('bill', scope.row)">{{ scope.row.billCode }}</a>
        </copy-text>
      </template>
      <template slot="parentBusinessNo" slot-scope="scope">
        <copy-text hoverToShow>
          <a @click="handleDetail('business', scope.row)">{{ scope.row.parentBusinessNo }}</a>
        </copy-text>
      </template>
    </avue-crud>

    <batchUploadFile ref="batchUploadFileRef" @updateList="getList"></batchUploadFile>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { feeDetailTableOptions } from "./list"
import batchUploadFile from "./components/batchUploadFile.vue"
import { getTokenUrl, setFiltering, setOrderBy, getDictByType } from "@/util/auth"
import { getOverseaBillDetailPageApi } from "@/api/finance/billingManagement"
import { getCountry } from "@/api/baseSetup/bsecountry"

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
    pageReq() {
      return { filtering: setFiltering(this.searchForm, { billTime: "BETWEEN" }) }
    }
  },
  data() {
    return {
      searchForm: {
        billTime: [],
        site: [],
        feeType: [],
        feeItem: [],
        warehouseCode: "",
        billCode: "",
        parentBusinessNo: ""
      },
      feeDetailTableOptions,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableData: [],
      selectList: [],
      siteOptions: [],
      warehouseOptions: [],
      costTypeOptions: [],
      feeItemOptions: [],
      orderBy: [
        { field: "billTime", order: "desc" },
        { field: "warehouseCode", order: "asc" },
        { field: "skuCode", order: "asc" },
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
      this.feeItemOptions = await getDictByType("oversea_warehouse_fee_item")

      await Promise.all([this.getAllCountry(), this.getList()])
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
        aggregate: [
          { field: "quantity", function: "sum" },
          { field: "amount", function: "sum" }
        ]
      }

      const { data } = await getOverseaBillDetailPageApi(params)

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
    handleDetail(type, row) {
      switch (type) {
        case "business":
          const businessNoId = row.businessNoId
          if (!businessNoId) return
          if (row.parentBusinessNo.substring(0, 2) === "SO") {
            this.$router.push({
              path: "/order/orderManages/detail",
              query: { id: businessNoId }
            })
          } else {
            this.$router.push({
              path: "/transfer/fristMileTransfer/detail",
              query: {
                id: businessNoId,
                type: "detail"
              }
            })
          }
          break
        case "warehouseFees":
          this.$emit("switchTab", type, { warehouseCode: row.warehouseCode })
          break
        case "bill":
          this.$emit("switchTab", type, { billCode: row.billCode })
          break
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (column.property === "billTime") {
          sums[index] = "总计："
        } else if (column.property === "quantity") {
          sums[index] = this.aggregateRecord.quantity
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
