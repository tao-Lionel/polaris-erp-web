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
      >
        <template slot="menuLeft">
          <el-tabs v-model="searchForm.pricingTrialStatus" @tab-click="tabClick">
            <el-tab-pane label="正常" name="NORMAL"></el-tab-pane>
            <el-tab-pane label="作废" name="CANCEL"></el-tab-pane>
          </el-tabs>

          <el-button
            type="primary"
            size="small"
            @click="handleAudit"
            v-if="permissions.product_pricing_newProductCalc_add"
            >新增</el-button
          >
          <el-button
            size="small"
            @click="handleCancel(selectRows, true)"
            v-if="permissions.product_pricing_newProductCalc_invalid"
            >作废</el-button
          >

          <el-dropdown size="small" split-button type="primary">
            导 出
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <export-btn
                  v-if="permissions.product_pricing_newProductCalc_export"
                  :pageName="exportListName"
                  pageUrl="/pricing/trial/page"
                  moduleName="product"
                  :columns="tableColumn"
                  :pageReq="{ filtering: exportFiltering }"
                  type="text"
                  buttonText="导出列表"
                ></export-btn>
              </el-dropdown-item>
              <el-dropdown-item>
                <export-btn
                  v-if="permissions.product_pricing_newProductCalc_export"
                  :pageName="exportDetailName"
                  pageUrl="/pricing/trial/page"
                  moduleName="product"
                  :columns="detailColumnLists"
                  :pageReq="{ filtering: exportFiltering }"
                  type="text"
                  buttonText="导出明细"
                ></export-btn
              ></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="pricingTrialCode">
              <el-input
                v-model="searchForm.pricingTrialCode"
                size="small"
                placeholder="请输入试算编码"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="site">
              <el-select v-model="searchForm.site" size="small" filterable placeholder="站点,支持多选" clearable>
                <el-option v-for="item in siteOptions" :key="item.value" :label="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="platform">
              <el-select v-model="searchForm.platform" size="small" placeholder="平台,支持多选" filterable clearable>
                <el-option
                  v-for="item in platformOptions"
                  :key="item.platformTypeCode"
                  :label="item.platformTypeName"
                  :value="item.platformTypeCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="standardSkuCode">
              <el-input
                v-model="searchForm.standardSkuCode"
                size="small"
                placeholder="标准SKU,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="spuCode">
              <el-input
                v-model="searchForm.spuCode"
                size="small"
                placeholder="标准SPU,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="orderBusinessType">
              <el-select
                v-model="searchForm.orderBusinessType"
                size="small"
                clearable
                filterable
                placeholder="销售模式"
              >
                <el-option v-for="item in platformModel" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
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
        <template slot-scope="scope" slot="createTime">
          {{ scope.row.createName }}
          <br v-if="scope.row.createName" />
          {{ scope.row.createTime }}
        </template>
        <template slot-scope="scope" slot="updateTime">
          {{ scope.row.updateName }}
          <br v-if="scope.row.updateName" />
          {{ scope.row.updateTime }}
        </template>
        <template slot-scope="{ row }" slot="opeSlot">
          <a class="brandSolt_ope" v-if="permissions.product_pricing_newProductCalc_detail" @click="goToDetail(row)"
            >详情</a
          >
          <a
            class="brandSolt_ope"
            v-if="permissions.product_pricing_newProductCalc_edit && row.pricingTrialStatus === 'NORMAL'"
            @click="handleEdit(row)"
            >编辑</a
          >
          <a
            class="brandSolt_ope"
            v-if="permissions.product_pricing_newProductCalc_invalid && row.pricingTrialStatus === 'NORMAL'"
            @click="handleCancel(row)"
            style="color: #f56c6c"
            >作废</a
          >
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { tableOption, detailColumnList, tableColumn } from "./index.js"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getTrialListPage, trialCancel, trialSave } from "@/api/product/newProductCalc"
import { cloneDeep } from "lodash"
import { getCountry } from "@/api/baseSetup/bsecountry"
import { getPlayTypeAll } from "@/api/order/orderManage"
import { setFiltering, getDictByType } from "@/util/auth"
import dayjs from "dayjs"

export default {
  name: "costingList",
  data() {
    return {
      platformOptions: [],
      siteOptions: [],
      exchangeStatus: false,
      exchangeData: [],
      searchForm: {
        pricingTrialCode: "",
        standardSkuCode: "",
        platform: "",
        site: "",
        spuCode: "",
        orderBusinessType: "",
        pricingTrialStatus: "NORMAL"
      },
      operatorParams: {
        platform: "EQUAL",
        site: "EQUAL",
        orderBusinessType: "EQUAL",
        pricingTrialStatus: "EQUAL"
      },
      orderBy: [
        {
          field: "updateTime",
          order: "desc"
        }
      ],
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      selectRows: [],

      menuLeftModel: "NORMAL",
      platformModel: [], // 模式
      detailColumnLists: detailColumnList,
      tableColumn: tableColumn,
      exportListName: `试算信息${dayjs().format("YYYYMMDD")}`,
      exportDetailName: `试算明细${dayjs().format("YYYYMMDD")}`
    }
  },
  components: {},
  created() {
    this.init()
  },
  mounted() {},
  activated() {
    this.getList()
  },
  computed: {
    ...mapGetters(["permissions"]),
    exportFiltering() {
      return setFiltering(
        {
          ...this.searchForm,
          id: this.selectRows.map((item) => item.id)
        },
        this.operatorParams
      )
    }
  },
  methods: {
    async init() {
      this.getAllCountry()
      this.getPlatform()
      this.getList()
      this.platformModel = await getDictByType("order_business_type")
    },
    // 获取国家
    async getAllCountry() {
      const { data } = await getCountry()
      this.siteOptions = data.data.map((item) => ({
        label: item.countryShortName,
        value: item.countryCode
      }))
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
    handleProfit(value, supplyPrice) {
      if (value === undefined || value === null || !supplyPrice) return "-"
      return ((value / supplyPrice) * 100).toFixed(2) + "%"
    },
    // 获取平台
    async getPlatform() {
      const { data } = await getPlayTypeAll()
      this.platformOptions = data.data
    },
    handleAudit() {
      this.$router.push({
        path: "/productCosting/newProductCalc/add",
        query: {
          state: "add"
        }
      })
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
    searchChange() {
      this.getList()
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    },
    clearSelectClear() {
      this.$refs.crud.toggleSelection()
    },
    async getList(opt) {
      const postData = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        filtering: setFiltering(
          {
            ...this.searchForm
          },
          this.operatorParams
        ),
        orderBy: this.orderBy,
        ...opt
      }
      const { data } = await getTrialListPage(postData)
      if (data.code === 0) {
        // currency
        this.tableData = data.data.records.map((item) => {
          return {
            ...item,
            promotionExpenses: this.handlePercentString(item.promotionExpenses),
            ppm: this.handlePercentString(item.ppm),
            ppmDiff: this.handlePercentString(item.ppmDiff),
            profit: this.handlePercentString(item.profit),
            promotionRatio: this.handlePercentString(item.promotionRatio),
            operatingProfit: this.handlePercentString(item.operatingProfit),
            salePriceStr: `${item.baseCurrencySymbol} ${item.calSalePrice.toFixed(2)}`,
            nonTaxPriceStr: `${item.baseCurrencySymbol} ${item.nonTaxPrice.toFixed(2)}`,
            supplyPriceStr: `${item.baseCurrencySymbol} ${item.calSupplyPrice.toFixed(2)}`,
            profitStr: this.handleProfit(item.preTaxProfit, item.calSupplyPrice),
            operatingProfitStr: this.handleProfit(item.operatingProfit, item.calSupplyPrice)
          }
        })
        this.page.total = data.data.total
        this.page.currentPage = data.data.page
      }
    },

    formReset() {},
    goToDetail(row) {
      this.$router.push({
        path: "/productCosting/newProductCalc/detail",
        query: {
          id: row.id,
          state: "detail"
        }
      })
    },
    handleEdit(row) {
      this.$router.push({
        path: "/productCosting/newProductCalc/edit",
        query: {
          id: row.id,
          state: "edit"
        }
      })
    },
    async handleCancel(items, handleCancel = false) {
      if (handleCancel && !items.length)
        return this.$message({
          type: "warning",
          message: "请选择要作废的的记录"
        })
      const ids = Array.isArray(items) ? items.map((item) => item.id) : [items.id]
      const confirmText = "作废后，无法恢复！"
      const successMessage = Array.isArray(items) ? "批量作废成功!" : "作废成功!"

      const flag = await this.$confirm(confirmText, "确认作废？", {
        confirmButtonText: "作废",
        cancelButtonText: "取消",
        confirmButtonClass: "el-button--danger",
        type: "error",
        center: true
      })

      if (!flag) return
      await this.handleTrialCancel(ids)

      this.$message({
        type: "success",
        message: successMessage
      })

      this.getList()
    },
    tabClick(tab, event) {
      this.searchForm.pricingTrialStatus = tab.name
      this.page.currentPage = 1
      this.getList({
        page: 1
      })
    },
    async handleTrialCancel(ids = []) {
      try {
        const res = await trialCancel(ids)
        if (res.data.code === 0) {
          return res.data.data
        }
        throw new Error("作废失败")
      } catch (error) {
        throw error // 将错误抛出以便调用方捕获
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#costingList {
  .scene-content {
    background-color: #fff;
    margin: 0px 10px;
    padding: 8px 10px;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
  }
  .versions-tag-item {
    margin: 0 2px;
  }
  .brandSolt_ope {
    margin-right: 10px;
  }
}
</style>
