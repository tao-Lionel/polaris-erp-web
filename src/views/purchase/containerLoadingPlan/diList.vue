<template>
  <div>
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
        <el-button type="primary" size="small" v-if="permissions.purchase_container_generate" @click="handleGenerate"
          >生成排柜计划</el-button
        >
        <export-btn
          v-if="permissions.purchase_container_export"
          pageName="待排柜（DI订单）"
          pageUrl="/deliveryPlan/pageDiUnPlan"
          moduleName="purchase"
          :columns="tableOption.column"
          :pageReq="{ filtering: exportFiltering }"
        ></export-btn>
      </template>
      <template slot="search">
        <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
          <el-form-item prop="code">
            <el-input
              size="small"
              v-model="searchForm.code"
              clearable
              placeholder="平台订单号"
              v-search-input
            ></el-input>
          </el-form-item>
          <el-form-item prop="standardSkuCode">
            <el-input
              size="small"
              clearable
              placeholder="标准SKU"
              v-model="searchForm.standardSkuCode"
              v-search-input
            ></el-input>
          </el-form-item>
          <el-form-item prop="skuCode">
            <el-input
              size="small"
              clearable
              placeholder="工厂SKU"
              v-model="searchForm.skuCode"
              v-search-input
            ></el-input>
          </el-form-item>
          <el-form-item prop="asin">
            <el-input size="small" clearable placeholder="ASIN" v-model="searchForm.asin" v-search-input></el-input>
          </el-form-item>
          <el-form-item prop="categoryId">
            <el-cascader
              placeholder="品类"
              size="small"
              expand-trigger="hover"
              :props="props"
              v-model="searchForm.categoryId"
              :show-all-levels="false"
              :options="selectOptionData.treeCategoryData"
              @change="handleChange"
              clearable
              filterable
              collapse-tags
            ></el-cascader>
          </el-form-item>

          <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
        </el-form>
      </template>

      <template slot="searchAdvanced">
        <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
          <el-form-item prop="platform">
            <el-select
              v-model="searchForm.platform"
              size="small"
              placeholder="平台"
              multiple
              filterable
              clearable
              @change="platformChange"
            >
              <el-option
                v-for="item in selectOptionData.platform"
                :key="item.platformTypeCode"
                :label="item.platformTypeName"
                :value="item.platformTypeCode"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="site">
            <el-select
              v-model="searchForm.site"
              size="small"
              placeholder="站点"
              filterable
              multiple
              clearable
              @visible-change="visibleChangeSit"
            >
              <el-option
                v-for="item in marketOption"
                :key="item.sitEnName"
                :label="item.sitEnName"
                :value="item.sitEnName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="store">
            <el-select v-model="searchForm.store" size="small" placeholder="店铺" filterable clearable>
              <el-option v-for="item in store" :key="item.storeId" :label="item.storeAccount" :value="item.storeId">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="shipWindowLeft">
            <el-date-picker
              size="small"
              v-model="searchForm.shipWindowLeft"
              type="date"
              placeholder="window start"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="shipWindowRight">
            <el-date-picker
              size="small"
              v-model="searchForm.shipWindowRight"
              type="date"
              placeholder="window end"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
        </el-form>
      </template>
    </avue-crud>
  </div>
</template>
<script>
import { diTableOption } from "./index.js"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getSit, getStore, getStoreBySitIds } from "@/api/order/orderManage"
import { getDiList } from "@/api/purchase/containerLoadingPlan/index.js"
import { setFiltering, setOrderBy } from "@/util/auth"

export default {
  name: "diList",
  components: {},
  props: {
    selectOptionData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      props: { multiple: false },
      searchForm: {
        code: "",
        standardSkuCode: "",
        skuCode: "",
        asin: "",
        categoryId: "",
        platform: "",
        site: "",
        store: "",
        shipWindowLeft: "",
        shipWindowRight: ""
      },
      operatorParams: {
        // code: "LIKE",
        // standardSkuCode: "LIKE",
        // skuCode: "LIKE",
        shipWindowLeft: "GREATER_THAN",
        shipWindowRight: "LESS_THAN"
      },
      statusArray: [],
      currencyArray: [],
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 20,
        pageSizes: [10, 20, 30, 40, 50, 100, 200, 500]
      },
      tableOption: diTableOption,
      marketOption: [],
      store: [],
      selectList: [],
      orderBy: [
        {
          field: "updateTime",
          order: "desc"
        }
      ]
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions"]),
    exportFiltering() {
      return setFiltering(
        {
          ...this.searchForm
        },
        this.operatorParams
      )
    }
  },
  watch: {
    "searchForm.platform"(val) {
      if (!val.length) {
        this.searchForm.site = []
        this.marketOption = []
        this.searchForm.store = []
        this.store = []
        this.getStoreList()
      }
    },
    "searchForm.site"(val) {
      this.searchForm.store = []
      this.store = []
      // 有平台没站点的情况 根据平台获取店铺
      if (this.searchForm.platform?.length && !val.length) {
        this.getStoreList(this.searchForm.platform)
      }
      // 没站点没平台的情况，获取所有店铺
      else if (!val.length && !this.searchForm.platform?.length) {
        this.getStoreList()
      }
    }
  },
  methods: {
    // 根据站点获取店铺
    async getStoreBySit(marketId) {
      let ids = []
      marketId.forEach((item) => {
        ids.push(this.marketOption.find((s) => s.sitName === item)?.bsePlatformSitId)
      })
      const { data } = await getStoreBySitIds(ids)
      if (data.code === 0) {
        this.store = data.data
      }
    },
    // 站点下拉回调
    visibleChangeSit(status) {
      if (!status) {
        this.searchForm.shopIds = []
        if (!this.searchForm.site?.length) return
        this.getStoreBySit(this.searchForm.site)
      }
    },
    platformChange(val) {
      console.log(val)
      this.searchForm.site = []
      this.getPlatformSit(val)
    },
    handleGenerate() {
      if (this.selectList.length === 0) {
        this.$message({
          type: "warning",
          message: "未选中数据"
        })
        return
      }
      this.$router.push({
        path: "/purchase/containerLoadingPlan/generate",
        query: {
          type: "DI"
        }
      })
      localStorage.setItem(
        "containerIds",
        JSON.stringify(this.selectList?.map((item) => item.id).filter((i) => i != ""))
      )
    },

    selectionChange(list) {
      this.selectList = list
    },

    getList(opt) {
      const { categoryId } = this.searchForm
      const postData = deepClone({
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        ...opt,
        filtering: setFiltering(
          {
            ...this.searchForm,
            categoryId: categoryId ? categoryId[categoryId.length - 1] : ""
          },
          this.operatorParams
        ),
        orderBy: setOrderBy(null, this.orderBy)
      })

      getDiList(postData).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },

    /**
     * 刷新回调
     */
    refreshChange() {
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList({
        page: 1
      })
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      this.getList()
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.statusArray = []
      this.currencyArray = []
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    //根据平台查询站点
    getPlatformSit(param) {
      getSit(param).then((res) => {
        this.marketOption = res.data
      })
    },
    // 获取店铺
    async getStoreList(platformCode = []) {
      const { data } = await getStore(platformCode)
      this.store = data.filter((item) => item.state === "0")
    }
  }
}
</script>

<style lang="scss" scoped></style>
