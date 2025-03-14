<template>
  <div>
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
      >
        <!-- 操作按钮栏 -->
        <template slot="menuLeft">
          <el-button v-if="permissions.platformSafety_stock_add" type="primary" @click="handleAdd" size="small">
            新 增
          </el-button>
          <el-button v-if="permissions.platformSafety_stock_import" type="primary" @click="handleImport" size="small">
            导 入
          </el-button>
          <el-button v-if="permissions.platformSafety_stock_export" type="primary" @click="handleExport" size="small">
            导 出
          </el-button>
        </template>
        <!-- 搜索栏 -->
        <template slot="search">
          <el-form :model="searchForm" ref="searchFormRef" :inline="true">
            <el-form-item prop="skuCode">
              <el-input
                v-model="searchForm.skuCode"
                size="small"
                placeholder="标准SKU,支持多个"
                clearable
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="platformList">
              <el-select
                v-model="searchForm.platformList"
                size="small"
                placeholder="平台,支持多个"
                filterable
                clearable
                multiple
                collapse-tags
                @change="changePlatform"
              >
                <el-option
                  v-for="item in platformList"
                  :key="item.platformTypeCode"
                  :label="item.platformTypeCode"
                  :value="item.platformTypeCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="platformSiteList">
              <el-select
                v-model="searchForm.platformSiteList"
                size="small"
                filterable
                placeholder="站点,支持多个"
                clearable
                multiple
                collapse-tags
              >
                <el-option v-for="item in siteList" :key="item.sitName" :label="item.sitName" :value="item.sitName">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="brandIdList">
              <el-select
                v-model="searchForm.brandIdList"
                size="small"
                placeholder="品牌"
                clearable
                multiple
                collapse-tags
              >
                <el-option
                  v-for="item in brandOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="categoryId" class="exclude-label">
              <el-cascader
                size="small"
                expand-trigger="hover"
                :props="{ multiple: true }"
                v-model="categoryId"
                :show-all-levels="false"
                :options="treeCategoryData"
                @change="changeCategory"
                clearable
                collapse-tags
                placeholder="品类"
              ></el-cascader>
            </el-form-item>
            <el-form-item prop="minSafeDays">
              <div style="display: flex; align-items: center">
                <el-input-number
                  v-model="searchForm.minSafeDays"
                  size="small"
                  placeholder="安全库存天数最小值"
                  :min="0"
                  :max="searchForm.maxSafeDays"
                  :controls="false"
                  :precision="0"
                ></el-input-number>
                <div style="display: inline-flex; justify-content: center; width: 40px">~</div>
                <el-form-item prop="maxSafeDays" style="margin-top: 0px">
                  <el-input-number
                    v-model="searchForm.maxSafeDays"
                    size="small"
                    placeholder="安全库存天数最大值"
                    :min="searchForm.minSafeDays"
                    :controls="false"
                    :precision="0"
                  ></el-input-number>
                </el-form-item>
              </div>
            </el-form-item>
          </el-form>
        </template>

        <!-- 操作列 -->
        <template slot="operate" slot-scope="scope">
          <a v-if="permissions.platformSafety_stock_edit" @click="handleEdit(scope.row)">编辑</a>
        </template>
      </avue-crud>
    </basic-container>

    <addDialog ref="addDialogRef" @updateList="getList"></addDialog>
    <newCommonImport
      ref="newCommonImportRef"
      :downloadUrl="newDownloadUrl"
      :previewUrl="newPreviewUrl"
      :uploadUrl="newUploadUrl"
      :downloadTitle="newDownloadTitle"
      @import="importExcel"
    >
    </newCommonImport>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { tableOption } from "./list"
import { fetchBrandAll } from "@/api/product/prdskubrand"
import { fetchTreeList } from "@/api/product/prdskucategory"
import addDialog from "./components/addDialog"
import { downloadBlob } from "@/util/auth"
import newCommonImport from "@/views/cockpit/newCommonImport"
import { getSafetyStockPageApi, exportSafetyStockApi } from "@/api/warehouse/platformSafetyStock"
import { getPlaTypeAll } from "@/api/baseSetup/bseplatformtype"
import { getSit } from "@/api/order/orderManage"
import { getSitInfo } from "@/api/baseSetup/bseplatformsit"

export default {
  name: "safetyStockList",
  components: { addDialog, newCommonImport },
  data() {
    return {
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption,
      tableData: [],
      searchForm: {
        brandIdList: [],
        skuCode: "",
        categoryIdList: [],
        minSafeDays: undefined,
        maxSafeDays: undefined,
        platformSiteList: undefined,
        platformList: undefined
      },
      treeCategoryData: [],
      brandOption: [],
      categoryId: [],
      newDownloadUrl: "/warehouse/wmssafestock/downloadPlatformTemplate",
      newPreviewUrl: "/warehouse/wmssafestock/batchImportPlatformPreview",
      newUploadUrl: "/warehouse/wmssafestock/batchImportPlatformData",
      newDownloadTitle: "平台仓安全库存配置",
      platformList: [],
      siteList: []
    }
  },
  created() {},
  mounted: function () {
    this.getList()
    this.getTreeCategoryData()
    this.getBrandOption()
    this.getPlatformList()
    this.getSitAll()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    async getPlatformList() {
      const { data } = await getPlaTypeAll()
      if (data.code == 0) {
        this.platformList = data.data
      }
    },
    // 获取所有站点
    async getSitAll() {
      const { data } = await getSitInfo()
      if (data.code === 0) {
        this.siteList = data.data
      }
    },
    async changePlatform(val, row) {
      this.searchForm.platformSiteList = []
      const { data } = await getSit(this.searchForm.platformList)
      this.siteList = data
    },
    //获取品牌
    async getBrandOption() {
      const { data } = await fetchBrandAll()
      if (data.code === 0) {
        data.data.records.forEach((item) => {
          this.brandOption.push({
            value: item.brandId,
            label: item.brandName
          })
        })
      }
    },
    // 获取品类
    async getTreeCategoryData() {
      const { data } = await fetchTreeList()
      this.treeCategoryData = data.data
    },
    // 改变品类的回调
    changeCategory() {
      this.searchForm.categoryIdList = []
      this.categoryId.forEach((item) => {
        this.searchForm.categoryIdList.push(item[item.length - 1])
      })
    },
    //加载列表数据
    async getList() {
      console.log("this.searchForm", this.searchForm)
      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        ...this.searchForm,
        type: 1
      }
      const { data } = await getSafetyStockPageApi(params)
      if (data.code === 0) {
        this.tableData = data.data.records
        this.page.total = data.data.total
      }
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
      this.$refs.searchFormRef.resetFields()
      this.categoryId = []
      this.searchForm.categoryIdList = []
      this.getSitAll()
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
    // 新增
    handleAdd() {
      this.$refs.addDialogRef.openDialog()
    },
    // 编辑
    handleEdit(row) {
      this.$refs.addDialogRef.openDialog(row)
    },
    // 导入
    handleImport() {
      this.$refs.newCommonImportRef.syncFn({
        downloadParams: {},
        uploadParams: {}
      })
    },
    // 导出
    async handleExport() {
      const { data } = await exportSafetyStockApi({ ...this.searchForm, ...this.page, type: 1 })
      downloadBlob(data, "导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
    },
    importExcel() {
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .avue-crud__menu .el-input {
  width: 140px;
}
</style>
