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
        @selection-change="selectionChange"
      >
        <!-- 操作按钮栏 -->
        <template slot="menuLeft">
          <el-button v-if="permissions.product_linksku_add" type="primary" @click="handleAdd" size="small">
            新 增
          </el-button>
          <!-- <el-button
            type="primary"
            v-if="permissions.product_pricing_demand_add"
            @click="handleAddPriceRequire(null)"
            size="small"
          >
            添加核价需求
          </el-button> -->

          <el-dropdown-button
            type="primary"
            size="small"
            buttonText="  核 价 需 求      "
            command="1"
            style="margin-right: 10px"
          >
            <el-dropdown-item
              style="padding-left: 10px; padding-right: 10px"
              @click.native="handleAddPriceRequire(null)"
              v-if="permissions.product_pricing_demand_add"
              >添加核价需求</el-dropdown-item
            >
            <el-dropdown-item
              style="padding-left: 10px; padding-right: 10px"
              @click.native="handleImportLinkRequire"
              v-if="permissions.product_pricing_demand_add"
              >导入链接核价需求</el-dropdown-item
            >
          </el-dropdown-button>

          <el-dropdown-button
            type="primary"
            size="small"
            buttonText="批量审核"
            v-if="permissions.product_linksku_audit"
            command="1"
            @command="handleAudit"
            style="margin-right: 10px"
          >
            <el-dropdown-item command="2">批量反审核</el-dropdown-item>
          </el-dropdown-button>
          <el-dropdown size="small" @command="handleBatchOperation" style="margin-right: 10px">
            <el-button type="primary" size="small">
              批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="permissions.product_linksku_distribute" command="分配运营">
                分配运营
              </el-dropdown-item>
              <el-dropdown-item v-if="permissions.product_linksku_distribute" command="分配运营导入">
                分配运营导入
              </el-dropdown-item>
              <!-- <el-dropdown-item v-if="permissions.product_linksku_product_status" command="产品状态">
                新老品
              </el-dropdown-item> -->
              <el-dropdown-item v-if="permissions.product_linksku_sale_status" command="销售状态">
                销售状态
              </el-dropdown-item>
              <el-dropdown-item command="重点SKU"> 重点SKU </el-dropdown-item>
              <el-dropdown-item command="开售时间"> 开售时间 </el-dropdown-item>

              <el-dropdown-item command="删除" v-if="permissions.product_linksku_del">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button v-if="permissions.product_linksku_import" type="primary" @click="handleImport" size="small">
            导入
          </el-button>
          <el-button v-if="permissions.product_linksku_export" type="primary" @click="handleExport" size="small">
            导出
          </el-button>
          <el-button
            v-if="permissions.product_linksku_import_edit_price"
            type="primary"
            @click="handleExportEditPrice"
            size="small"
          >
            导入修改价格
          </el-button>
        </template>
        <!-- 搜索栏 -->
        <template slot="search">
          <el-form :model="searchForm" ref="searchFormRef" :inline="true">
            <el-form-item prop="spuCode">
              <el-input
                v-model="searchForm.spuCode"
                size="small"
                placeholder="标准SPU,支持多个"
                clearable
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="parentSkuCode">
              <el-input
                v-model="searchForm.parentSkuCode"
                size="small"
                placeholder="标准SKU,支持多个"
                clearable
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="linkSkuCode">
              <el-input
                v-model="searchForm.linkSkuCode"
                size="small"
                placeholder="链接SKU,支持多个"
                clearable
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="asin">
              <el-input
                v-model="searchForm.asin"
                size="small"
                placeholder="ASIN,支持多个"
                clearable
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="storeIds">
              <el-select size="small" v-model="searchForm.storeIds" clearable filterable multiple placeholder="店铺">
                <el-option
                  v-for="item in storeIdOptions"
                  :key="item.storeId"
                  :label="item.storeAccount"
                  :value="item.storeId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot="searchAdvanced">
          <el-form :model="searchForm" ref="searchAdvancedRef" :inline="true">
            <el-form-item prop="linkSpuCode">
              <el-input
                v-model="searchForm.linkSpuCode"
                size="small"
                placeholder="链接SPU,支持多个"
                clearable
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="brandId">
              <el-select v-model="searchForm.brandId" size="small" placeholder="品牌" clearable>
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
                :props="props"
                v-model="categoryId"
                :show-all-levels="false"
                :options="treeCategoryData"
                @change="handleCascaderChange"
                clearable
                collapse-tags
                placeholder="品类"
              ></el-cascader>
            </el-form-item>
            <el-form-item prop="platform">
              <el-select
                v-model="searchForm.platform"
                size="small"
                placeholder="平台,支持多选"
                filterable
                clearable
                multiple
                collapse-tags
                @change="changePlatform"
              >
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
              <select-all
                ref="selectAllRef"
                :selectValue.sync="searchForm.site"
                size="small"
                placeholder="站点,支持多个"
                @change="changeSit"
                :options="siteOptions"
                keyName="sitName"
                labelName="sitName"
              >
              </select-all>
            </el-form-item>
            <el-form-item prop="saleStatus">
              <el-select size="small" v-model="searchForm.saleStatus" clearable filterable placeholder="销售状态">
                <el-option
                  v-for="item in saleStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="auditStatus">
              <el-select size="small" v-model="searchForm.auditStatus" clearable filterable placeholder="审核状态">
                <el-option
                  v-for="item in auditStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="productStatus">
              <el-select size="small" v-model="searchForm.productStatus" clearable filterable placeholder="产品状态">
                <el-option
                  v-for="item in productStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="firstLeaderName">
              <el-select
                v-model="searchForm.firstLeaderName"
                filterable
                clearable
                remote
                size="small"
                reserve-keyword
                :remote-method="remoteMethod"
                placeholder="一级负责人"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="secondLeaderName">
              <el-select
                v-model="searchForm.secondLeaderName"
                filterable
                clearable
                remote
                size="small"
                reserve-keyword
                :remote-method="remoteMethod"
                placeholder="二级负责人"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="operatorName">
              <el-select
                v-model="searchForm.operatorName"
                filterable
                clearable
                remote
                size="small"
                reserve-keyword
                :remote-method="remoteMethod"
                placeholder="运营"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="focusStatus">
              <el-select size="small" v-model="searchForm.focusStatus" clearable filterable placeholder="是否重点SKU">
                <el-option
                  v-for="item in focusStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="pricingDemandStatus">
              <el-select
                size="small"
                v-model="searchForm.pricingDemandStatus"
                clearable
                filterable
                placeholder="核价需求"
              >
                <el-option
                  v-for="item in pricingDemandStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="isBound">
              <el-select size="small" v-model="searchForm.isBound" clearable filterable placeholder="是否有启用核价">
                <el-option label="有" value="0"> </el-option>
                <el-option label="无" value="1"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="isAvailable">
              <el-select
                size="small"
                v-model="searchForm.isAvailable"
                clearable
                filterable
                placeholder="是否有待启用核价"
              >
                <el-option label="有" value="0"> </el-option>
                <el-option label="无" value="1"> </el-option>
              </el-select>
            </el-form-item>
            <avue-crud-search-item
              ref="searchCrudItemRef"
              :searchFields="searchFields"
              @updateField="updateField"
            ></avue-crud-search-item>
          </el-form>
        </template>

        <!-- 产品状态 -->
        <template slot="productStatus" slot-scope="{ row }">
          <div>
            {{ row.productStatus ? productStatusOptions.find((item) => item.value == row.productStatus)?.label : "" }}
          </div>
        </template>

        <!-- 开售时间 -->
        <!-- <template slot="saleStartTime" slot-scope="{ row }">
          <el-date-picker
            style="width: 190px"
            v-model="row.saleStartTime"
            size="mini"
            type="datetime"
            :clearable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开售时间"
            @change="changeSaleStartTime(row)"
          >
          </el-date-picker>
        </template> -->
        <!-- 是否审核 -->
        <template slot="auditStatus" slot-scope="{ row }">
          <div :style="{ color: row.auditStatus === '1' ? '#67C23A' : '#F56C6C' }">
            {{ auditStatusOptions?.find((item) => item.value == row.auditStatus)?.label }}
          </div>
        </template>
        <!-- 销售状态 -->
        <template slot="saleStatus" slot-scope="{ row }">
          <div>{{ saleStatusOptions?.find((item) => item.value == row.saleStatus)?.label }}</div>
        </template>
        <!-- 是否同步库存到平台 -->
        <template slot="syncPlatformStock" slot-scope="{ row }">
          <div>{{ row.syncPlatformStock === "1" ? "是" : "否" }}</div>
        </template>
        <!-- 重点sku -->
        <template slot="focusStatus" slot-scope="{ row }">
          {{ row.focusStatus === "1" ? "是" : "否" }}
          <!-- <el-switch
            v-model="row.focusStatus"
            active-text="是"
            inactive-text="否"
            active-value="1"
            inactive-value="0"
            @change="changeFocusStatus($event, row)"
          >
          </el-switch> -->
        </template>
        <!-- 核价需求 -->
        <template slot="pricingDemandStatusName" slot-scope="{ row }">
          <span :style="{ color: pricingDemandStatusColor[row.pricingDemandStatusEnum] }">
            {{ row.pricingDemandStatusName }}
          </span>
        </template>
        <!-- 是否核价 -->
        <template slot="auditPriceStatus" slot-scope="{ row }">
          <div :style="{ color: row.auditPriceStatus === '1' ? '#67C23A' : '#F56C6C' }">
            {{ row.auditPriceStatus === "1" ? "已核价" : "未核价" }}
          </div>
        </template>

        <template slot="platformItemId" slot-scope="{ row }">
          <span>{{
            row.platform === "WALMART" ||
            row.platform === "WALMARTDSV" ||
            row.platform === "TIKTOK" ||
            row.platform === "TEMU"
              ? row.platformItemId
              : ""
          }}</span>
        </template>
        <template slot="platformSkuCode" slot-scope="{ row }">
          <span>{{ row.platform === "WALMART" || row.platform === "WALMARTDSV" ? row.platformSkuCode : "" }}</span>
        </template>
        <template slot="platformSkuId" slot-scope="{ row }">
          <span>{{
            row.platform === "WALMART" ||
            row.platform === "WALMARTDSV" ||
            row.platform === "TIKTOK" ||
            row.platform === "TEMU"
              ? row.platformSkuId
              : ""
          }}</span>
        </template>

        <template slot="bound" slot-scope="{ row }">
          <span :class="{ 'blue-text': row.bound > 0 }" @click="handleOpenCosting(row, 'bound')">{{ row.bound }}</span>
        </template>

        <template slot="available" slot-scope="{ row }">
          <span :class="{ 'blue-text': row.available > 0 }" @click="handleOpenCosting(row, 'available')">{{
            row.available
          }}</span>
        </template>

        <template slot="operate" slot-scope="scope">
          <avue-crud-ctrl :list="getCtrlList(scope)" :defaultShowNumber="2"></avue-crud-ctrl>
        </template>
      </avue-crud>
    </basic-container>

    <updateDialog ref="updateDialogRef" @updateDate="updateDate"></updateDialog>
    <distributeDialog ref="distributeDialogRef" @updateDate="updateDate"></distributeDialog>
    <newCommonImport
      ref="newCommonImportRef"
      :downloadUrl="newDownloadUrl"
      :previewUrl="newPreviewUrl"
      :uploadUrl="newUploadUrl"
      :downloadTitle="newDownloadTitle"
      @import="importExcel"
    >
    </newCommonImport>

    <commonImport
      ref="commonImport"
      :excelStatus="false"
      :excelDangerStatus="excelDangerStatus"
      @import="importExcelBtn"
      @export="exportDangerExcel"
      :customDownload="customDownload"
    >
    </commonImport>

    <commonImport
      ref="commonImportRef"
      :excelStatus="false"
      :excelDangerStatus="excelDangerStatusDistribute"
      @import="importExcelBtnDistribute"
      @export="exportDangerExcelDistribute"
      :customDownload="customDownloadDistribute"
    >
      <template slot="importTip">
        <div v-if="successCount + errorCount > 0">
          总条数<span style="font-size: 16px"> {{ successCount + errorCount }} </span> 条，成功导入<span
            style="color: #67c23a; font-size: 16px"
          >
            {{ successCount }}
          </span>
          条，失败
          <span style="color: #f56c6c; font-size: 16px">
            {{ errorCount }}
          </span>
          条
        </div>
      </template>
    </commonImport>

    <commonImport
      ref="importLinkRequireRef"
      :excelStatus="false"
      :excelDangerStatus="excelLinkRequireDangerStatus"
      @import="importLinkRequireExcelBtn"
      @export="exportLinkRequireDangerExcel"
      :customDownload="linkRequireDownload"
    >
      <template slot="importTip">
        <div v-if="linkSuccessCount + linkErrorCount > 0">
          总条数<span style="font-size: 16px"> {{ linkSuccessCount + linkErrorCount }} </span> 条，成功导入<span
            style="color: #67c23a; font-size: 16px"
          >
            {{ linkSuccessCount }}
          </span>
          条，失败
          <span style="color: #f56c6c; font-size: 16px">
            {{ linkErrorCount }}
          </span>
          条
        </div>
      </template>
    </commonImport>

    <!-- 日志 -->
    <logDialog ref="logDialogRef"></logDialog>

    <costingDialog ref="costingDialogRef" @addCostingRequire="addCostingRequire"></costingDialog>
    <distributeLogDialog ref="distributeLogDialogRef"></distributeLogDialog>
    <addCostingRequireDialog ref="addCostingRequireDialogRef" @updateDate="updateDate"></addCostingRequireDialog>
    <bindingPriceDialog ref="bindingPriceDialogRef" @updateDate="updateDate"></bindingPriceDialog>
  </div>
</template>

<script>
import { getPlayTypeAll, getSit, getStore, getStoreBySitIds } from "@/api/order/orderManage"
import {
  getPageListApi,
  updateOtherInfoApi,
  exportExcelLinkSkuApi,
  linkSkuDownloadUrlApi,
  linkSkuPreviewUrlApi,
  linkSkuUploadUrlApi,
  batchUpdateApi,
  downloadEditPriceApi,
  importEditPriceApi,
  distributeImportApi,
  LinkRequireDataPreview
} from "@/api/product/linkSkuMange"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"
import { getDictByType, downloadFileByUrl } from "@/util/auth"
import { tableOption } from "./list"
import updateDialog from "./components/updateDialog"
import distributeDialog from "./components/distributeDialog"
import { fetchBrandAll } from "@/api/product/prdskubrand"
import { fetchList } from "@/api/admin/user"
import { fetchTreeList } from "@/api/product/prdskucategory"
import newCommonImport from "@/views/cockpit/newCommonImport"
import { downloadBlob } from "@/util/auth"
import logDialog from "./components/logDialog"
import { getSitInfo } from "@/api/baseSetup/bseplatformsit"
import commonImport from "@/views/cockpit/commonImport"
import costingDialog from "./components/costingDialog.vue"
import distributeLogDialog from "./components/distributeLogDialog.vue"
import addCostingRequireDialog from "./components/addCostingRequireDialog.vue"
import {
  checkLinkSkuPricingApi,
  exportErrorDataApi,
  productDownloadTemplateApi,
  saveProductPricingDemandApi
} from "@/api/product/pricing"
import bindingPriceDialog from "./components/bindingPriceDialog"

export default {
  name: "linkSkuManageList",
  components: {
    updateDialog,
    distributeDialog,
    newCommonImport,
    logDialog,
    commonImport,
    costingDialog,
    distributeLogDialog,
    bindingPriceDialog,
    addCostingRequireDialog
  },
  data() {
    return {
      focusStatusOptions: [
        { label: "是", value: "1" },
        { label: "否", value: "0" }
      ],
      props: { multiple: true },
      categoryId: [],
      platformOptions: [],
      siteOptions: [],
      storeIdOptions: [],
      auditStatusOptions: [],
      //搜索条件，和前端控件绑定
      searchForm: {
        linkSpuCode: "",
        linkSkuCode: "",
        platformSkuCode: "",
        platformSkuId: "",
        storeIds: [],
        site: [],
        platform: [],
        syncPlatformStock: "",
        auditStatus: "",
        createUserName: "",
        updateUserName: "",
        beginCreateTime: "",
        endCreateTime: "",
        beginUpdateTime: "",
        endUpdateTime: "",
        saleStatus: "",
        productStatus: "",
        brandId: "",
        linkSkuCategoryId: "",
        firstLeader: "",
        secondLeader: "",
        operator: "",
        focusStatus: "",
        parentSkuCode: "",
        linkSkuCode: "",
        asin: "",
        spuCode: "",
        pricingDemandStatus: ""
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption,
      tableData: [],
      treeCategoryData: [],
      brandOption: [],
      productStatusOptions: [],
      saleStatusOptions: [],
      options: [],
      newDownloadUrl: linkSkuDownloadUrlApi,
      newPreviewUrl: linkSkuPreviewUrlApi,
      newUploadUrl: linkSkuUploadUrlApi,
      newDownloadTitle: "导入链接SKU关系",
      searchFields: [
        { label: "创建人", value: "createUserName", type: "input", default: true },
        { label: "创建时间", value: "createTime", type: "datetimerange" }
      ],
      excelDangerStatus: false,
      importData: null,
      excelDangerStatusDistribute: false, // 是否可下载错误文件
      errorData: [], // 错误数据
      successCount: 0, // 成功导入条数
      errorCount: 0, // 失败条数
      pricingDemandStatusColor: {
        INITIAL_PENDING: "#E6A23C",
        DEMAND_REJECTED: "#F56C6C",
        DEMAND_COMPLETE: "#67C23A",
        DEMAND_CANCEL: "#909399"
      },
      pricingDemandStatusOptions: [],
      excelLinkRequireDangerStatus: false,
      linkRequireDangerData: [],
      linkSuccessCount: 0,
      linkErrorCount: 0
    }
  },
  watch: {},
  created() {},
  mounted: async function () {
    await this.init()
    const { storeId, linkSkuCode } = this.$route.query
    if (storeId && linkSkuCode) {
      this.searchForm.storeIds = [Number(storeId)]
      this.searchForm.linkSkuCode = linkSkuCode
    }
    console.log("222", 33321)
    this.getList()
  },
  async activated() {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    async init() {
      const [pricingDemandStatus, platformData, treeData, brandData, productStatus, saleStatus, auditStatus] =
        await Promise.all([
          getDictByType("pricing_demand_status"),
          getPlayTypeAll(),
          fetchTreeList(),
          fetchBrandAll(),
          getDictByType("link_sku_product_status"),
          getDictByType("link_sku_sale_status"),
          getDictByType("link_sku_audit_status")
        ])
      this.pricingDemandStatusOptions = pricingDemandStatus
      this.platformOptions = this.sortArray(platformData.data.data, "platformTypeName")
      this.treeCategoryData = treeData.data.data
      this.brandOption = brandData.data.data.records.map((item) => ({
        value: item.brandId,
        label: item.brandName
      }))
      // 产品状态
      this.productStatusOptions = productStatus
      // 销售状态
      this.saleStatusOptions = saleStatus
      // 审核状态
      this.auditStatusOptions = auditStatus

      await Promise.all([this.getStoreList(), this.getSitAll()])

      // 存到本地，防止新增、编辑页接口请求太多
      localStorage.setItem("link_sku_product_status", JSON.stringify(this.productStatusOptions))
      localStorage.setItem("link_sku_sale_status", JSON.stringify(this.saleStatusOptions))
      localStorage.setItem("brand_option", JSON.stringify(this.brandOption))
      localStorage.setItem("platform_options", JSON.stringify(this.platformOptions))
    },
    // 获取所有站点
    async getSitAll() {
      const { data } = await getSitInfo()
      if (data.code === 0) {
        this.siteOptions = this.sortArray(data.data, "sitName")
      }
    },
    async remoteMethod(query) {
      if (query !== "") {
        const { data } = await fetchList({
          current: 1,
          size: 9999,
          displayname: query
        })
        this.options = data.data.records.map((item) => {
          return { value: item.userId, label: item.displayname }
        })
      } else {
        this.options = []
      }
    },
    handleCascaderChange() {
      this.searchForm.categoryId = []
      this.categoryId.forEach((item) => {
        this.searchForm.categoryId.push(item[item.length - 1])
      })
    },
    //加载列表数据
    async getList() {
      const searchForm = deepCloneIgnoreNull(this.searchForm)
      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        ...searchForm
      }

      const { data } = await getPageListApi(params)
      this.tableData = data.data.records
      this.page.total = data.data.total
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
      //将默认的搜索条件放入到搜索条件中
      this.dateValueArr = []
      this.$refs.searchFormRef.resetFields()
      this.$refs?.searchAdvancedRef?.resetFields()
      this.categoryId = []
      this.$refs.searchCrudItemRef.resetField()
      this.getSitAll()
      this.getStoreList()
      this.$refs.selectAllRef.resetSelectAll()
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
    selectionChange(tableData, tableSelectListAll) {
      this.selectList = tableSelectListAll
    },
    //清除选中
    clearSelectClear() {
      this.$refs.crud.selectClear()
    },
    // 修改
    handleEdit(row) {
      this.$router.push({
        path: "/product/linkSkuManage/edit",
        query: {
          id: row.id
        }
      })
    },
    // 新增
    handleAdd() {
      this.$router.push({
        path: "/product/linkSkuManage/create"
      })
    },
    // 批量审核、同步库存、产品定级、销售状态、产品状态、是否重点SKU
    handleUpdate(type) {
      if (!this.selectList || this.selectList.length === 0) {
        this.$message.warning(`请勾选数据`)
        return
      }
      this.$refs.updateDialogRef.openDialog(type, this.selectList)
    },
    updateDate() {
      this.clearSelectClear()
      this.getList()
    },
    // 分配运营
    handleDistribute(row) {
      let ids = []
      if (!row) {
        if (!this.selectList || this.selectList.length === 0) {
          this.$message.warning(`请勾选数据`)
          return
        }
        ids = this.selectList.map((item) => item.id)
        // let firstLeaderArr = []
        // let secondLeaderArr = []
        // let operatorArr = []

        // for (let item of this.selectList) {
        //   firstLeaderArr.push(item.firstLeaderName)
        //   secondLeaderArr.push(item.secondLeaderName)
        //   operatorArr.push(item.operatorName)
        // }
        // if (this.hasDifferentValues(firstLeaderArr)) {
        //   this.$message.warning(`一级负责人不一样`)
        //   return
        // }
        // if (this.hasDifferentValues(secondLeaderArr)) {
        //   this.$message.warning(`二级负责人不一样`)
        //   return
        // }
        // if (this.hasDifferentValues(operatorArr)) {
        //   this.$message.warning(`运营不一样`)
        //   return
        // }
        row = this.selectList[0]
      } else {
        ids.push(row.id)
      }

      this.$refs.distributeDialogRef.openDialog(ids, row)
    },
    // 有一样的值
    hasDifferentValues(arr) {
      return new Set(arr).size !== 1
    },
    // 开售时间
    async changeSaleStartTime(row) {
      const { saleStartTime, id } = row
      let ids = [id]
      const { data } = await updateOtherInfoApi({ saleStartTime, ids })
      if (data.code === 0) {
        this.$message.success(`操作成功`)
        this.getList()
      }
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
      const searchForm = deepCloneIgnoreNull(this.searchForm)
      const { data } = await exportExcelLinkSkuApi({ ...searchForm, ...this.page })
      downloadBlob(data, "导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
    },
    importExcel() {
      this.getList()
    },
    // 1审核 2 反审核
    async handleAudit(command) {
      if (!this.selectList || this.selectList.length === 0) {
        this.$message.warning(`请勾选数据`)
        return
      }

      for (let item of this.selectList) {
        if (command === "1") {
          // 已审核
          if (item.auditStatus === "1") {
            this.$message.warning(`请勾选未审核的数据`)
            return
          }
        } else {
          // 未审核
          if (item.auditStatus === "0") {
            this.$message.warning(`请勾选已审核的数据`)
            return
          }
        }
      }
      let idList = this.selectList.map((item) => item.id)
      let auditStatus = command === "1" ? "1" : "0"
      const { data } = await batchUpdateApi({ auditStatus, idList })
      if (data.code === 0) {
        this.$message.success(data.data)
        this.updateDate()
      } else {
        this.$message.error(data.msg)
      }
    },
    showOperateLog(id) {
      this.$refs.logDialogRef.showOperateLogDialog(id)
    },
    // 获取店铺
    async getStoreList(platformCode = []) {
      this.storeIdOptions = []
      const { data } = await getStore(platformCode)
      this.storeIdOptions = this.sortArray(
        data.filter((item) => item.state === "0"),
        "storeAccount"
      )
    },
    // 根据站点获取店铺
    async getStoreBySit(site) {
      let ids = []
      site.forEach((item) => {
        ids.push(this.siteOptions.find((s) => s.sitName === item).bsePlatformSitId)
      })
      const { data } = await getStoreBySitIds(ids)
      if (data.code === 0) {
        this.storeIdOptions = this.sortArray(data.data, "storeAccount")
      }
    },
    // 排序
    sortArray(arr, field) {
      return arr.sort((a, b) => {
        const nameA = a[field]?.toUpperCase() // 忽略大小写
        const nameB = b[field]?.toUpperCase() // 忽略大小写
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
    },
    getCtrlList(scope) {
      return [
        {
          title: "发起核价需求",
          item: scope,
          clickFn: async (scope) => {
            // 判断该链接的（平台+站点+标准SKU）是否存在有未绑定，且核价状态=待启用或生效中的核价信息
            const { data } = await checkLinkSkuPricingApi(scope.row.id)
            if (data.code === 0) {
              if (data.data.avaliablePricingInfoList.length <= 0) {
                if (this.permissions.product_pricing_demand_add) {
                  this.$refs.addCostingRequireDialogRef.openDialog(scope.row)
                } else {
                  this.$message.warning("您没有添加核价需求的权限")
                }
              } else {
                this.$refs.costingDialogRef.openDialog(scope.row)
              }
            }
          },
          show: true
        },
        {
          title: "启用核价",
          item: scope,
          clickFn: (scope) => {
            this.$refs.costingDialogRef.openDialog(scope.row)
          },
          show: this.permissions.product_linksku_enable_pricing
        },
        {
          title: "编辑",
          item: scope,
          clickFn: (scope) => {
            this.handleEdit(scope.row)
          },
          show: this.permissions.product_linksku_edit && scope.row.auditStatus === "0"
        },
        {
          title: "查看核价需求",
          item: scope,
          clickFn: (scope) => {
            this.$refs.costingDialogRef.openDialog(scope.row, "require")
          },
          show: true
        },
        {
          title: "已关联核价",
          item: scope,
          clickFn: (scope) => {
            this.$refs.costingDialogRef.openDialog(scope.row)
          },
          show: true
        },
        {
          title: "分配运营",
          item: scope,
          clickFn: (scope) => {
            this.handleDistribute(scope.row)
          },
          show: this.permissions.product_linksku_distribute
        },
        {
          title: "运营变更记录",
          item: scope,
          clickFn: (scope) => {
            this.$refs.distributeLogDialogRef.openDialog(scope.row)
          },
          show: true
        },
        {
          title: "操作日志",
          item: scope,
          clickFn: (scope) => {
            this.showOperateLog(scope.row.id)
          },
          show: true
        }
        // {
        //   title: "绑定核价-旧",
        //   item: scope,
        //   clickFn: (scope) => {
        //     this.$refs.bindingPriceDialogRef.openDialog(scope.row)
        //   },
        //   show: this.permissions.product_linksku_binding_price && scope.row.auditStatus === "1"
        // }
      ]
    },
    handleOpenCosting(row, key) {
      if (row[key] > 0) {
        this.$refs.costingDialogRef.openDialog(row)
      }
    },
    // 是否重点SKU
    async changeFocusStatus(val, row) {
      const { data } = await batchUpdateApi({ focusStatus: val, idList: [row.id] })
      if (data.code === 0) {
        this.$message.success(data.data)
        this.getList()
      } else {
        this.$message.error(data.msg)
      }
    },
    handleBatchOperation(command) {
      switch (command) {
        case "删除":
          this.handleDel()
          break
        case "销售状态":
          this.handleUpdate(4)
          break
        case "产品状态":
          this.handleUpdate(5)
          break
        case "分配运营":
          this.handleDistribute(null)
          break
        case "重点SKU":
          this.handleUpdate(6)
          break
        case "开售时间":
          this.handleUpdate(7)
          break
        case "分配运营导入":
          this.successCount = 0
          this.errorCount = 0
          this.errorData = 0
          this.excelDangerStatusDistribute = false
          this.$refs.commonImportRef.syncFn()
          break
      }
    },
    handleDel() {
      if (!this.selectList || this.selectList.length === 0) {
        this.$message.warning(`请勾选数据`)
        return
      }

      for (let item of this.selectList) {
        if (item.auditStatus === "1") {
          this.$message.warning("请勾选未审核的数据")
          return
        }
      }

      let idList = this.selectList.map((item) => item.id)
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const { data } = await batchUpdateApi({ idList, isDelete: "1" })
        if (data.code === 0) {
          this.$message.success(data.data)
          this.getList()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    updateField(obj) {
      let beginCreateTime,
        endCreateTime = ""

      if (obj.createTime) {
        beginCreateTime = obj.createTime[0]
        endCreateTime = obj.createTime[1]
      } else {
        beginCreateTime = undefined
        endCreateTime = undefined
      }
      Object.assign(this.searchForm, obj, { beginCreateTime, endCreateTime })
    },
    handleExportEditPrice() {
      this.$refs.commonImport.syncFn({})
    },
    // 导入修改价格数据
    importExcelBtn(file) {
      if (!file) {
        this.$message.error("请上传文件!")
        return
      }
      this.$refs.commonImport.openFullScreen()
      let formData = new FormData()
      formData.append("file", file.raw)
      importEditPriceApi(formData).then((res) => {
        this.importData = res.data.data
        if (res.data.code == 0 && !res.data.data) {
          this.excelDangerStatus = false
          this.$message.success("导入成功")
        } else {
          this.$message.error("导入的excel表格数据有误，请点击异常文件下载查看原因")
          this.excelDangerStatus = true
        }
        this.updateDate()
        this.$refs.commonImport.closeFullScreen()
      })
    },
    // 下载错误文件
    async exportDangerExcel() {
      downloadFileByUrl(this.importData, "异常文件.xlsx")
    },
    // 下载模板
    async customDownload() {
      const { data } = await downloadEditPriceApi()
      downloadBlob(data, "链接SKU修改价格导入模板.xlsx", "application/vnd.ms-excel;charset=utf-8")
    },
    // 打开添加核价需求弹窗
    handleAddPriceRequire(row) {
      this.$refs.addCostingRequireDialogRef.openDialog(row)
    },
    // 添加核价需求
    addCostingRequire(row) {
      this.updateDate()
      this.handleAddPriceRequire(row)
    },
    handleImportLinkRequire() {
      this.$refs.importLinkRequireRef.syncFn()
    },
    importLinkRequireExcelBtn(file) {
      if (!file) {
        this.$message.error("请上传文件!")
        return
      }
      this.$refs.importLinkRequireRef.openFullScreen()
      let formData = new FormData()
      formData.append("file", file.raw)
      LinkRequireDataPreview(formData).then(async (res) => {
        this.linkRequireDangerData = res.data.data.filter((item) => {
          return item.isError
        })

        if (this.linkRequireDangerData.length > 0) {
          this.$message.error("导入的excel表格数据有误，请点击异常文件下载查看原因")
          this.excelLinkRequireDangerStatus = true
        } else {
          this.excelLinkRequireDangerStatus = false
          //  遍历新增
          for (const it of res.data.data) {
            await saveProductPricingDemandApi({ ...it, pricingType: "NEW" })
          }
          this.$message.success("导入成功")
          this.$refs.importLinkRequireRef.syncFn()
        }
        this.updateDate()
        this.$refs.commonImport.closeFullScreen()
      })
    },
    async linkRequireDownload() {
      const { data } = await productDownloadTemplateApi({
        templateName: "链接核价需求导入模板"
      })
      downloadBlob(data, "链接核价需求导入模板.xlsx", "application/vnd.ms-excel;charset=utf-8")
    },
    // 下载错误文件
    async exportLinkRequireDangerExcel() {
      const { data } = await exportErrorDataApi({
        templateName: "链接核价需求导入模板",
        errorList: this.linkRequireDangerData
      })
      downloadBlob(data, "链接核价需求-异常文件.xlsx", "application/vnd.ms-excel;charset=utf-8")
    },

    // 下载模板
    async customDownloadDistribute() {
      const { data } = await productDownloadTemplateApi({ templateName: "运营导入模板" })
      downloadBlob(data, "分配运营导入模板.xlsx", "application/vnd.ms-excel;charset=utf-8")
    },
    // 导入数据
    async importExcelBtnDistribute(file) {
      if (!file) {
        this.$message.error("请上传文件!")
        return
      }
      this.$refs.commonImportRef.openFullScreen()
      let formData = new FormData()
      formData.append("file", file.raw)
      const { data } = await distributeImportApi(formData)
      if (data.code === 0) {
        this.successCount = data.data.successData?.length
        this.errorCount = data.data.errorData?.length
        this.errorData = data.data.errorData

        if (this.errorCount > 0) {
          this.$message.error("导入的excel表格数据有误，请点击异常文件下载查看原因")
          this.excelDangerStatusDistribute = true
        } else {
          this.$message.success("导入成功")
          this.excelDangerStatusDistribute = false
          this.updateDate()
          this.$refs.commonImportRef.closeFullScreen()
        }
      }
    },
    // 下载错误文件
    async exportDangerExcelDistribute() {
      const { data } = await exportErrorDataApi({ templateName: "运营导入模板", errorList: this.errorData })
      downloadBlob(data, "分配运营错误数据.xlsx", "application/vnd.ms-excel;charset=utf-8")
    },

    //根据平台查询站点
    getPlatformSit(param) {
      getSit(param).then((res) => {
        this.siteOptions = this.sortArray(res.data, "sitName")
      })
    },
    //选中平台操作获取该平台下的站点
    changePlatform(val) {
      console.log(val)
      this.searchForm.site = []
      this.searchForm.storeIds = []
      if (val && val.length) {
        if (!this.searchForm.platform?.length) return
        this.getPlatformSit(this.searchForm.platform)
        // 根据平台获取店铺
        this.getStoreList(this.searchForm.platform)
      }
    },
    // 站点下拉回调
    changeSit(val) {
      console.log("val===", val)
      this.searchForm.storeIds = []
      if (val && val.length) {
        if (!this.searchForm.site?.length) return
        this.getStoreBySit(this.searchForm.site)
      } else {
        this.getStoreList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.blue-text {
  color: rgb(64, 158, 255);
  cursor: pointer;
}
</style>
