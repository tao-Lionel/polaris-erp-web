<template>
  <div>
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :option="billDetailTableOption"
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
          v-if="permissions.finance_bill_settlement_export"
          :pageName="pageName"
          pageUrl="/settlement/billDetailPageList"
          moduleName="finance"
          :columns="billDetailTableOption.column"
          :pageReq="pageReq"
        ></export-btn>
      </template>
      <!-- 搜索栏 -->
      <template slot="search">
        <el-form :model="searchForm" ref="searchFormRef" :inline="true">
          <el-form-item prop="platSettlementNo">
            <el-input
              v-model="searchForm.platSettlementNo"
              size="small"
              placeholder="结算单号,支持多个"
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
          <el-form-item prop="poAdjustOrder">
            <el-input
              v-model="searchForm.poAdjustOrder"
              size="small"
              placeholder="订单/调整单,支持多个"
              clearable
              v-search-input
            ></el-input>
          </el-form-item>
          <el-form-item prop="linkSku">
            <el-input
              v-model="searchForm.linkSku"
              size="small"
              placeholder="链接SKU,支持多个"
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
          <el-form-item prop="feeType">
            <!-- <el-select v-model="searchForm.feeType" filterable size="small" placeholder="费用类型" clearable>
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
        </el-form>
      </template>

      <template slot="platBillNo" slot-scope="scope">
        <copy-text hoverToShow>
          <a @click="handleDetail(scope.row, 'bill')">{{ scope.row.platBillNo }}</a>
        </copy-text>
      </template>

      <template slot="poAdjustOrder" slot-scope="scope">
        <copy-text hoverToShow>
          <span v-if="scope.row.orderId">
            <a @click="handleDetail(scope.row, 'order')">{{ scope.row.poAdjustOrder }}</a>
          </span>
          <span v-else>
            {{ scope.row.poAdjustOrder }}
          </span>
        </copy-text>
      </template>

      <template slot="platSettlementNo" slot-scope="scope">
        <copy-text hoverToShow>
          <a @click="handleDetail(scope.row, 'settlement')">{{ scope.row.platSettlementNo }}</a>
        </copy-text>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { billDetailTableOption } from "./list"
import { getPlayTypeAll } from "@/api/order/orderManage"
import { setFiltering, setOrderBy } from "@/util/auth"
import { getBillDetailPageListApi } from "@/api/finance/billingManagement"
import { getCountry } from "@/api/baseSetup/bsecountry"
import { getAll } from "@/api/baseSetup/bsestore.js"

export default {
  name: "BillingManagementPlatformBillDetailTable",
  components: {},
  computed: {
    ...mapGetters(["permissions"]),
    pageName() {
      return `${
        this.searchForm.paymentDate?.length
          ? this.searchForm.paymentDate[0] + "至" + this.searchForm.paymentDate[1]
          : ""
      }账单明细`
    },
    pageReq() {
      return { filtering: setFiltering(this.searchForm, {}, "LIKE_RIGHT") }
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
        platSettlementNo: "",
        feeType: "",
        poAdjustOrder: "",
        platform: [],
        site: [],
        storeId: [],
        billDate: [],
        platBillNo: "",
        paymentDate: [],
        paymentNo: "",
        linkSku: ""
      },
      billDetailTableOption,
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
      orderBy: [
        { field: "billDate", order: "desc" }
        // { field: "paymentDate", order: "desc" },
        // { filed: "storeAccount", order: "asc" },
        // { filed: "platBillNo", order: "asc" }
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
        filtering: setFiltering(this.searchForm, {}, "LIKE_RIGHT"),
        orderBy: setOrderBy(column, this.orderBy),
        aggregate: [
          { field: "detailAmount", function: "sum" },
          { field: "quantity", function: "sum" }
        ]
      }

      const { data } = await getBillDetailPageListApi(params)

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
    // 导出
    handleExport() {
      console.log("导出")
    },
    // 排序
    sortChange(column) {
      this.getList(column)
    },
    handleDetail(row, type) {
      switch (type) {
        case "bill":
          this.$emit("switchTab", "bill", { platBillNo: row.platBillNo })
          break
        case "order":
          this.$router.push({
            path: "/order/orderManages/detail",
            query: { id: row.orderId }
          })
          break
        case "settlement":
          this.$emit("switchTab", "settlement", { platSettlementNo: row.platSettlementNo })
          break
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (column.property === "storeAccount") {
          sums[index] = "总计："
        } else if (column.property === "detailAmount") {
          sums[index] = this.aggregateRecord.detailAmount
        } else if (column.property === "quantity") {
          sums[index] = this.aggregateRecord.quantity
        }
      })
      return sums
    }
  }
}
</script>

<style lang="scss" scoped></style>
