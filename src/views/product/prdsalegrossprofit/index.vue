<template>
  <div class="execution" id="prdSaleGrossFit">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @current-change="currentChange"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @selection-change="selectionChange"
        @sort-change="sortChange"
      >
        <template slot="menuLeft">
          <el-tabs v-model="selectTab" @tab-click="changeTab">
            <el-tab-pane
              v-for="item in tabList"
              :key="item.key"
              :label="item.statusName"
              :name="item.key"
            ></el-tab-pane>
          </el-tabs>

          <el-button
            type="primary"
            v-if="permissions.baseSetup_bsecurrency_add"
            size="small"
            @click="openToDetail('ADD')"
            >新增测算
          </el-button>

          <el-button
            v-if="permissions.prdCalculateRecord_binding_price"
            type="primary"
            size="small"
            @click="handleBindingPrice()"
            :disabled="!selectRows.length"
          >
            绑定
          </el-button>

          <el-dropdown size="small" @command="handleBatchOperation">
            <el-button type="primary" size="small">
              批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="permissions.prdCalculateRecord_invalid && !['-1'].includes(selectTab)"
                command="批量失效"
              >
                批量失效
              </el-dropdown-item>
              <el-dropdown-item v-if="permissions.prdCalculateRecord_import" command="批量导入">
                批量导入
              </el-dropdown-item>
              <el-dropdown-item v-if="permissions.prdCalculateRecord_export_list" command="导出列表数据">
                导出列表数据
              </el-dropdown-item>
              <el-dropdown-item v-if="permissions.prdCalculateRecord_export_detail" command="导出明细数据">
                导出明细数据
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>

        <template slot="search">
          <el-form :model="searchForm" ref="searchForm" :inline="true">
            <el-form-item>
              <el-input
                v-model="searchForm.spuCode"
                v-search-input
                size="small"
                clearable
                placeholder="标准SPU,支持多个"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="searchForm.asin"
                v-search-input
                size="small"
                clearable
                placeholder="ASIN,支持多个"
              ></el-input>
            </el-form-item>
            <el-form-item prop="storeId">
              <el-select size="small" v-model="searchForm.storeId" clearable filterable placeholder="店铺">
                <el-option
                  v-for="item in storeIdOptions"
                  :key="item.storeId"
                  :label="item.storeAccount"
                  :value="item.storeId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="searchForm.parentSku"
                v-search-input
                size="small"
                clearable
                placeholder="标准SKU,支持多个"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="searchForm.skuCode"
                v-search-input
                size="small"
                clearable
                placeholder="工厂SKU,支持多个"
              ></el-input>
            </el-form-item>
          </el-form>
        </template>

        <template slot="searchAdvanced">
          <el-form :model="searchForm" ref="searchForm" :inline="true">
            <el-form-item>
              <el-input
                v-model="searchForm.linkSpu"
                v-search-input
                size="small"
                clearable
                placeholder="链接SPU,支持多个"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="searchForm.linkSku"
                v-search-input
                size="small"
                clearable
                placeholder="链接SKU,支持多个"
              ></el-input>
            </el-form-item>
            <el-form-item prop="categoryId" class="exclude-label">
              <el-cascader
                expand-trigger="hover"
                :prop="{ multiple: true }"
                size="small"
                v-model="categoryIdArr"
                :show-all-levels="false"
                clearable
                :options="treeCategoryData"
                placeholder="品类"
              ></el-cascader>
            </el-form-item>
            <el-form-item prop="platformTypeId">
              <el-select
                v-model="searchForm.platformTypeId"
                size="small"
                placeholder="平台"
                @change="getPlatformSit"
                clearable
              >
                <el-option
                  v-for="item in platform"
                  :key="item.platformTypeId"
                  :label="item.platformTypeName"
                  :value="item.platformTypeId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="salesSite">
              <el-select
                v-model="searchForm.salesSite"
                size="small"
                placeholder="站点"
                :disabled="!searchForm.platformTypeId"
              >
                <el-option
                  v-for="item in sitInfo"
                  :key="item.bsePlatformSitId"
                  :label="item.sitName"
                  :value="item.bsePlatformSitId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="salesModel">
              <el-select v-model="searchForm.salesModel" size="small" placeholder="模式" clearable>
                <el-option
                  v-for="item in platformModel"
                  :key="item.description"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="searchForm.batchId"
                size="small"
                placeholder="测算批次号,支持多个"
                clearable
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="currency">
              <el-select size="small" v-model="searchForm.currency" clearable filterable placeholder="币种">
                <el-option
                  v-for="item in currencyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <avue-crud-search-item
              ref="searchCrudItemRef"
              :searchFields="searchFields"
              @updateField="updateField"
            ></avue-crud-search-item>
          </el-form>
        </template>

        <!-- 定价状态 -->
        <template slot-scope="{ row }" slot="pricingState">
          <div :style="{ color: colorObj[row.pricingState] }">
            {{
              row.pricingState == -1
                ? "已失效"
                : row.pricingState == 1
                ? "已绑定"
                : row.pricingState == 2
                ? "已定价"
                : "待确认"
            }}
          </div>
        </template>

        <!-- 创建人/创建时间 -->
        <template slot-scope="{ row }" slot="createName">
          <div>{{ row.createName }}</div>
          <div>{{ row.createTime }}</div>
        </template>

        <!-- 更新人/更新时间 -->
        <template slot-scope="{ row }" slot="updateName">
          <div>{{ row.updateName }}</div>
          <div>{{ row.updateTime }}</div>
        </template>

        <template slot-scope="scope" slot="brandSolt">
          <avue-crud-ctrl :list="getCtrlList(scope)"></avue-crud-ctrl>
        </template>
      </avue-crud>

      <commonImport
        ref="commonImport"
        :excelStatus="false"
        :excelDangerStatus="excelDangerStatus"
        @import="importExcelBtn"
        @export="exportDangerExcel"
        :customDownload="customDownload"
      >
      </commonImport>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>

      <bindingPriceDialog ref="bindingPriceDialogRef" @updateDate="updateDate"></bindingPriceDialog>
    </basic-container>
  </div>
</template>

<script>
import {
  getPlaTypeAll,
  getObjByType,
  getprdSaleProfit,
  getCalcRecordsStatusApi,
  getPrdCalculateRecordInvalidApi,
  downloadTemplateCalculateApi
} from "@/api/baseSetup/bseplatformtype"
import { importRecord } from "@/api/ruleConfig/prdCalcRule/prdCalcRule"
import { getSitInfoByPlatformId } from "@/api/baseSetup/bseplatformsit"
import { fetchTreeList } from "@/api/product/prdskucategory"
import { tableOption } from "@/const/crud/product/prdsalegrossprofit"
import operationlog from "@/views/baseSetup/bseoperatelog/index"
import newCommonImport from "@/views/cockpit/newCommonImport"
import { downloadBlob } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"
import { getStore } from "@/api/order/orderManage"
import { getAll } from "@/api/baseSetup/bsecurrency"
import { exportDataComApi } from "@/api/common/index"
import { getStore as getSession } from "@/util/store"
import { downloadFileByUrl } from "@/util/auth"
import commonImport from "@/views/cockpit/commonImport.vue"
import bindingPriceDialog from "./bindingPriceDialog"

export default {
  name: "bsecurrency",
  components: {
    operationlog,
    newCommonImport,
    commonImport,
    bindingPriceDialog
  },
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        skuCode: "",
        creatorName: "",
        updaterName: "",
        searchCreateTimeBegin: "",
        searchCreateTimeEnd: "",
        searchUpdateTimeBegin: "",
        searchUpdateTimeEnd: "",
        platformTypeId: "",
        salesSite: "",
        salesModel: "",
        categoryId: "",
        pricingState: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      selectRows: [],
      platform: [], // 平台
      sitInfo: [], // 销售站点
      platformModel: [], // 模式
      treeCategoryData: [], // 品类
      pricing: [], // 定价状态
      categoryIdArr: [],
      createTime: [],
      updateTime: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6 //如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
      tabList: [
        { statusName: "全部", key: "99" },
        { statusName: "待确认", key: "0", countKey: "PRICING_STATE_UNCONFIRM" },
        // { statusName: "已定价", key: "2", countKey: "PRICING_STATE_CONFIRM" },
        { statusName: "已绑定", key: "1", countKey: "PRICING_STATE_UNCHECK" },
        { statusName: "已失效", key: "-1", countKey: "PRICING_STATE_INVALID" }
      ],
      selectTab: "99",
      storeIdOptions: [],
      currencyOptions: [],
      excelDangerStatus: false,
      importDataError: null,
      searchFields: [
        { label: "创建人", value: "createName", type: "input", default: true },
        { label: "更新人", value: "updateName", type: "input" },
        { label: "创建时间", value: "createTime", type: "daterange" },
        { label: "更新时间", value: "updateTime", type: "daterange" }
      ],
      colorObj: {
        "-1": "#F56C6C",
        1: "#67C23A",
        2: "#E6A23C",
        0: "#409EFF"
      }
    }
  },
  created() {
    this.dataInit()
  },
  mounted: async function () {
    let { skuCode, pricingState } = this.$route.query
    if (skuCode && pricingState) {
      this.searchForm.parentSku = skuCode
      this.searchFormConfirm.parentSku = skuCode
      await this.getTabCount()
      this.selectTab = pricingState + ""
      this.getList(this.page, this.searchForm)
    } else {
      this.getList(this.page, this.searchForm)
      await this.getTabCount()
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  watch: {
    categoryIdArr: function (val) {
      if (!val.length) {
        this.searchForm.categoryId = ""
      }
    }
  },
  methods: {
    importData() {
      this.$refs.commonImport.syncFn()
    },
    // 数据初始化
    async dataInit() {
      getPlaTypeAll().then((res) => {
        this.platform = res.data.data
      })
      getObjByType("sale_model").then((res) => {
        this.platformModel = res.data.data
      })
      getObjByType("pricing_state").then((res) => {
        this.pricing = res.data.data
      })
      fetchTreeList().then((res) => {
        this.treeCategoryData = res.data.data
      })
      getStore([]).then((res) => {
        this.storeIdOptions = res.data.filter((item) => item.state === "0")
      })
      //获取币别下拉列表
      getAll().then((response) => {
        response.data.data.forEach((item) => {
          if (response.data.code === 0) {
            this.currencyOptions.push({
              value: item.currency,
              label: item.currency
            })
          }
        })
      })
    },

    async getTabCount() {
      // 获取tab 统计数
      const res = await getCalcRecordsStatusApi()
      if (res.data.code === 0) {
        this.tabList.forEach((item) => {
          if (item?.countKey) {
            let countNum = res.data.data.find((f) => f.pricingDescription === item?.countKey)?.countNum
            if (/\(|\)/.test(item.statusName)) {
              item.statusName = item.statusName.replace(/\d+/g, countNum)
            } else {
              item.statusName = item.statusName + "(" + countNum + ")"
            }
          }
        })
      }
    },
    openToDetail(status, id) {
      const statusName = {
        DETAIL: "detail",
        RULE: "rule",
        ADD: "add"
      }
      this.$router.push({
        path: `/product/prdsalegrossprofits/${statusName[status]}/${id ? id : ""}`
      })
    },
    sortChange(val) {
      this.searchForm.orderByField = val.prop === "updateTime" ? "update_time" : "create_time"
      this.searchForm.orderByType = val.order === "descending" ? "des" : "asc"
      this.getList(this.page, this.searchForm)
    },
    //根据平台查询站点
    getPlatformSit(val) {
      this.searchForm.salesSite = ""
      let param = {
        platformTypeId: val
      }
      getSitInfoByPlatformId(param).then((res) => {
        this.sitInfo = res.data.data
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
    searchChange(params, page) {
      //将搜索的条件放入到确认的搜索条件中
      if (this.categoryIdArr.length) {
        this.searchForm.categoryId = this.categoryIdArr[this.categoryIdArr.length - 1]
      }
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      page = page || { currentPage: 1 }
      Object.assign(this.searchFormConfirm, params)
      this.getList(page, params)
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.categoryIdArr = []
      this.$refs["searchForm"].resetFields()
      this.searchForm = {}
      this.createTime = []
      this.updateTime = []
      this.searchFormConfirm = {}
      this.page.currentPage = 1
      this.$refs.searchCrudItemRef.resetField()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.getList(this.page, this.searchForm)
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList(this.page, this.searchForm)
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    },
    clearSelectClear() {
      // this.$refs.crud.selectClear();
      this.$refs.crud.toggleSelection()
    },
    getList(page, params) {
      // this.page.currentPage=page.currentPage;
      getprdSaleProfit(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchFormConfirm,
          { pricingState: this.selectTab == 99 ? undefined : this.selectTab }
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    // 切换tab
    changeTab() {
      this.clearSelectClear()
      this.page.currentPage = 1
      this.getList(this.page, this.searchForm)
    },
    // 失效
    handleInvalid(id) {
      let calIds = []
      if (id) {
        calIds.push(id)
      } else {
        if (!this.selectRows || this.selectRows.length === 0) {
          this.$message.warning("请选择数据")
          return
        }
        for (let item of this.selectRows) {
          if (item.pricingState === -1) {
            this.$message.warning("请选择未失效的数据")
            return
          }
        }
        calIds = this.selectRows.map((item) => item.id)
      }
      this.$confirm("确认失效吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        getPrdCalculateRecordInvalidApi({ operateType: "1", calIds })
          .then((res) => {
            if (res.data.code === 0) {
              this.$message.success("操作成功")
              this.refreshChange()
              this.clearSelectClear()
              this.getTabCount()
            }
          })
          .catch((err) => {})
      })
    },
    // 处理导出
    async onExport(val) {
      switch (val) {
        case 1:
          return
        case 2:
          this.handleAsyncExport(24)
          return
        case 3:
          this.handleAsyncExport(25)
          return
      }
    },
    async handleAsyncExport(id) {
      const exportParams = []

      const obj = deepCloneIgnoreNull({
        ...this.searchFormConfirm,
        pricingState: this.selectTab == 99 ? undefined : this.selectTab
      })
      const { searchCreateTimeBegin, searchCreateTimeEnd, searchUpdateTimeBegin, searchUpdateTimeEnd } = obj
      if (searchCreateTimeBegin && searchCreateTimeEnd) {
        obj.createTime = [searchCreateTimeBegin, searchCreateTimeEnd].join(",")
      }
      if (searchUpdateTimeBegin && searchUpdateTimeEnd) {
        obj.updateTime = [searchUpdateTimeBegin, searchUpdateTimeEnd].join(",")
      }
      delete obj.searchCreateTimeBegin
      delete obj.searchCreateTimeEnd
      delete obj.searchUpdateTimeBegin
      delete obj.searchUpdateTimeEnd

      Object.keys(obj).forEach((item) => {
        exportParams.push({ code: item, value: obj[item] })
      })

      console.log("exportParams", exportParams)

      const { data } = await exportDataComApi({
        id,
        param: exportParams,
        exportModel: "ASYNC"
      })
      if (data.code === 0) {
        let count = getSession({ name: "downloadCount" })
        this.$store.commit("SET_DOWNLOAD_COUNT", Number(count) + 1)
        this.$message.success(`由于导出数据量较大，请点击右上角【下载列表】图标进行查看！`)
      }
    },
    // 下载模板
    async customDownload() {
      const { data } = await downloadTemplateCalculateApi()
      downloadBlob(data, "测算导入模板.xlsx", "application/vnd.ms-excel;charset=utf-8")
    },
    // 下载错误文件
    async exportDangerExcel(file) {
      downloadFileByUrl(this.importDataError, "异常文件.xlsx")
    },
    // 导入数据
    importExcelBtn(file) {
      if (!file) {
        this.$message.error("请上传文件!")
        return
      }
      this.$refs.commonImport.openFullScreen()
      let formData = new FormData()
      formData.append("file", file.raw)
      importRecord(formData).then((res) => {
        console.log(res)
        this.importDataError = res.data.data
        if (res.data.code == 0 && !res.data.data) {
          this.excelDangerStatus = false
          this.$refs.commonImport.syncFn()
          this.$message.success("导入成功")
        } else {
          this.$message.error("导入的excel表格数据有误，请点击异常文件下载查看原因")
          this.excelDangerStatus = true
        }
        this.refreshChange()
        this.$refs.commonImport.closeFullScreen()
      })
    },
    handleBatchOperation(command) {
      switch (command) {
        case "批量失效":
          this.handleInvalid(null)
          break
        case "批量导入":
          this.importData()
          break
        case "导出列表数据":
          this.onExport(2)
          break
        case "导出明细数据":
          this.onExport(3)
          break
      }
    },
    handleBindingPrice(row) {
      if (!row && this.selectRows.length != 1) {
        this.$message.warning("请选择一条数据")
        return
      }
      for (let item of this.selectRows) {
        if (item.pricingState === -1) {
          this.$message.warning("请选择未失效的数据")
          return
        }
      }

      let params = row ? row : this.selectRows[0]
      this.$refs.bindingPriceDialogRef.openDialog(params)
    },
    getCtrlList(scope) {
      return [
        {
          title: "绑定",
          item: scope,
          clickFn: (scope) => {
            this.handleBindingPrice(scope.row)
          },
          show: scope.row.pricingState != -1 && this.permissions.prdCalculateRecord_binding_price
        },
        {
          title: "失效",
          item: scope,
          clickFn: (scope) => {
            this.handleInvalid(scope.row.id)
          },
          show: scope.row.pricingState != -1 && this.permissions.prdCalculateRecord_invalid
        },
        {
          title: "查看详情",
          item: scope,
          clickFn: (scope) => {
            this.openToDetail("DETAIL", scope.row.id)
          },
          show: this.permissions.prdCalculateRecord_detail
        }
      ]
    },
    updateDate() {
      this.refreshChange()
      this.clearSelectClear()
    },
    updateField(obj) {
      let createTime,
        updateTime = {}

      if (obj.createTime) {
        createTime = {
          searchCreateTimeBegin: obj.createTime[0] + " 00:00:00",
          searchCreateTimeEnd: obj.createTime[1] + " 23:59:59"
        }
      } else {
        createTime = {
          searchCreateTimeBegin: undefined,
          searchCreateTimeEnd: undefined
        }
      }

      if (obj.updateTime) {
        updateTime = {
          searchUpdateTimeBegin: obj.updateTime[0] + " 00:00:00",
          searchUpdateTimeEnd: obj.updateTime[1] + " 23:59:59"
        }
      } else {
        updateTime = {
          searchUpdateTimeBegin: undefined,
          searchUpdateTimeEnd: undefined
        }
      }
      Object.assign(this.searchForm, obj, createTime, updateTime)
    }
  }
}
</script>

<style lang="scss" scoped>
#prdSaleGrossFit {
  ::v-deep .el-textarea__inner {
    height: 90px;
  }
}
</style>
