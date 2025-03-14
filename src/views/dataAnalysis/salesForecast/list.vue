<template>
  <div>
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableDataCopy"
        :option="tableOptionCopy"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
      >
        <!-- 操作按钮栏 -->
        <template slot="menuLeft">
          <el-button type="primary" v-if="permissions.sales_forecast_import" @click="handleImport" size="small">
            导 入
          </el-button>

          <el-dropdown v-if="permissions.sales_forecast_lock" style="margin-right: 10px">
            <el-button type="primary" size="small">
              锁定预测销量<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleLocking">已勾选数据</el-dropdown-item>
              <el-dropdown-item @click.native="handleLockingAll">全部数据</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown v-if="permissions.sales_forecast_cancel_lock" style="margin-right: 10px">
            <el-button type="primary" size="small">
              取消锁定<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="cancelLocking">已勾选数据</el-dropdown-item>
              <el-dropdown-item @click.native="cancelLockingAll">全部数据</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-button type="primary" v-if="permissions.sales_forecast_export" @click="handleExport" size="small">
            导出
          </el-button>

          <el-dropdown v-if="permissions.sales_forecast_delete" style="margin-right: 10px">
            <el-button type="primary" size="small">
              批量删除<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleDelete">已勾选数据</el-dropdown-item>
              <el-dropdown-item @click.native="handleDeleteAll">全部数据</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <!-- 搜索栏 -->
        <template slot="search">
          <el-form :model="searchForm" ref="searchForm" :inline="true">
            <el-form-item prop="linkSku">
              <el-input
                v-model="searchForm.linkSku"
                size="small"
                placeholder="链接SKU,支持多个"
                clearable
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="linkSpu">
              <el-input
                v-model="searchForm.linkSpu"
                size="small"
                placeholder="链接SPU,支持多个"
                clearable
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="sku">
              <el-input
                v-model="searchForm.sku"
                size="small"
                placeholder="标准SKU,支持多个"
                clearable
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="spu">
              <el-input
                v-model="searchForm.spu"
                size="small"
                placeholder="标准SPU,支持多个"
                clearable
                v-search-input
              ></el-input>
            </el-form-item>
          </el-form>
        </template>

        <template slot="searchAdvanced">
          <el-form :model="searchForm" ref="searchForm" :inline="true">
            <el-form-item prop="platform">
              <el-select
                v-model="searchForm.platform"
                size="small"
                placeholder="平台"
                filterable
                clearable
                multiple
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
            <el-form-item prop="storeAccountList">
              <el-select size="small" v-model="searchForm.storeAccountList" clearable multiple placeholder="店铺">
                <el-option
                  v-for="item in storeIdOptions"
                  :key="item.storeAccount"
                  :label="item.storeAccount"
                  :value="item.storeAccount"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="brandId">
              <el-select v-model="searchForm.brandIdList" size="small" placeholder="品牌" clearable multiple>
                <el-option
                  v-for="item in brandOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="categoryIdList" class="category exclude-label">
              <el-cascader
                size="small"
                expand-trigger="hover"
                :props="{ multiple: true }"
                v-model="categoryIdList"
                :show-all-levels="false"
                :options="treeCategoryData"
                @change="handleCascaderChange"
                collapse-tags
                clearable
                placeholder="品类"
              ></el-cascader>
            </el-form-item>
            <el-form-item prop="lockStatus">
              <el-select
                size="small"
                v-model="searchForm.lockStatusStr"
                clearable
                filterable
                placeholder="锁定状态"
                @change="changeLockStatus"
              >
                <el-option
                  v-for="item in lockStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="currentProductStatus">
              <el-select
                size="small"
                v-model="searchForm.currentProductStatusStr"
                clearable
                filterable
                placeholder="产品状态"
                @change="changeCurrentProductStatusStr"
              >
                <el-option
                  v-for="item in currentProductStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="productPositioning">
              <el-select
                size="small"
                v-model="searchForm.productPositioning"
                multiple
                clearable
                filterable
                placeholder="产品定位"
              >
                <el-option
                  v-for="item in productPositioningOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="saleStatus">
              <el-select
                size="small"
                v-model="searchForm.saleStatusStr"
                clearable
                filterable
                placeholder="销售状态"
                @change="changeSaleStatusStr"
              >
                <el-option
                  v-for="item in saleStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="dateValueArr"
                size="small"
                type="monthrange"
                value-format="yyyy-MM"
                range-separator="至"
                start-placeholder="预测开始月份"
                end-placeholder="预测结束月份"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item class="needChangeSelect">
              <el-input placeholder="请输入内容" v-model="selectValue" clearable size="small">
                <el-select v-model="selectLabel" slot="prepend" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in searchNameList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-form>
        </template>

        <template slot="tableBeforeSlot">
          <div style="color: red; margin-bottom: 10px">
            提示：红色字体，代表预测销量状态为“锁定”；黑色字体，代表预测销量状态为“未锁定”
          </div>
        </template>

        <template slot="linkSku" slot-scope="{ row }">
          <copy-text hoverToShow>
            <a v-if="permissions.sales_forecast_check" @click="handleCheck(row)">{{ row.linkSku }}</a>
            <div v-else>{{ row.linkSku }}</div>
          </copy-text>
        </template>

        <!-- 当前产品状态 -->
        <template slot="currentProductStatus" slot-scope="{ row }">
          <div>
            {{
              row.currentProductStatus && currentProductStatusOptions.length
                ? currentProductStatusOptions.find((item) => item.value == row.currentProductStatus).label
                : row.currentProductStatus
            }}
          </div>
        </template>

        <template slot="platform" slot-scope="{ row }">
          <div>{{ row.platform }} / {{ row.site }}</div>
          <div></div>
        </template>
        <!-- 销售状态 -->
        <template slot="saleStatus" slot-scope="{ row }">
          <div>{{ saleStatusOptions?.find((item) => item.value == row.saleStatus)?.label }}</div>
        </template>

        <template v-for="item in dynamicDateCol" :slot="item.label" slot-scope="scope">
          <div
            :key="item.label"
            :style="
              scope.row.dynamicInformation.find((i) => i.dayAndMonthKey === item.label).lockStatus ? 'color:red' : ''
            "
          >
            {{ scope.row[item.label] }}
          </div>
        </template>

        <!-- 产品定位 -->
        <template slot="productPositioning" slot-scope="{ row }">
          <div>
            {{
              row.productPositioning && productPositioningOptions.length
                ? productPositioningOptions.find((item) => item.value === row.productPositioning).label
                : ""
            }}
          </div>
        </template>

        <!-- <template slot="createName" slot-scope="{ row }">
          <div>{{ row.createName }}</div>
          <div>{{ row.createTime }}</div>
        </template>
        <template slot="updateName" slot-scope="{ row }">
          <div>{{ row.updateName }}</div>
          <div>{{ row.updateTime }}</div>
        </template> -->
      </avue-crud>

      <commonImport
        ref="commonImport"
        :excelStatus="false"
        :excelDangerStatus="excelDangerStatus"
        @import="importExcelBtn"
        @export="exportDangerExcel"
        :customDownload="customDownload"
        :maxSize="50"
      >
      </commonImport>

      <lockingDialog ref="lockingDialogRef" @updateDate="updateDate"></lockingDialog>

      <cancelLockingDialog ref="cancelLockingDialogRef" @updateDate="updateDate"></cancelLockingDialog>

      <checkDialog ref="checkDialogRef"></checkDialog>

      <deleteDialog ref="deleteDialogRef" @updateDate="updateDate"></deleteDialog>
    </basic-container>
  </div>
</template>

<script>
import { getPlayTypeAll, getSit, getStore, getStoreBySitIds } from "@/api/order/orderManage"
import { getObjByType } from "@/api/admin/dict"
import {
  getPageList,
  exportData,
  exportForecastTemplateApi,
  importForecastExcelApi
} from "@/api/dataAnalysis/salesForecast"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { downloadBlob, downloadFileByUrl, getDictByType } from "@/util/auth"
import { lockStatusOptions, tableOption } from "./list"
import lockingDialog from "./components/lockingDialog.vue"
import cancelLockingDialog from "./components/cancelLockingDialog.vue"
import checkDialog from "./components/checkDialog.vue"
import dayjs from "dayjs"
import { getStore as getSession } from "@/util/store"
import { fetchBrandAll } from "@/api/product/prdskubrand"
import { fetchTreeList } from "@/api/product/prdskucategory"
import commonImport from "@/views/cockpit/commonImport"
import { getSitInfo } from "@/api/baseSetup/bseplatformsit"
import deleteDialog from "./components/deleteDialog.vue"

export default {
  name: "salesForecastList",
  components: {
    commonImport,
    lockingDialog,
    cancelLockingDialog,
    checkDialog,
    deleteDialog
  },
  data() {
    return {
      excelDangerStatus: false,
      lockStatusOptions,
      currentProductStatusOptions: [],
      productPositioningOptions: [],
      skuOptions: [],
      saleStatusOptions: [],
      platformOptions: [],
      siteOptions: [],
      //搜索条件，和前端控件绑定
      searchForm: {
        linkSpu: "",
        linkSku: "",
        spu: "",
        sku: "",
        lockStatus: "",
        currentProductStatus: "",
        productPositioning: "",
        skuGrade: "",
        platform: [],
        site: [],
        saleStatus: "",
        firstResponsiblePerson: "",
        forecastBeginTime: "",
        forecastEndTime: "",
        createBeginTime: "",
        createEndTime: ""
      },
      dateValueArr: [],
      searchNameList: [
        { label: "运营", value: "operationsPerson" },
        { label: "一级负责人", value: "firstResponsiblePerson" },
        { label: "二级负责人", value: "secondResponsiblePerson" }
        // { label: "创建人", value: "createName" }
      ],
      selectLabel: "operationsPerson",
      selectValue: "",
      //确定的搜索条件
      searchFormConfirm: {},

      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      tableOptionCopy: tableOption,
      tableData: [],
      tableDataCopy: [],
      minDate: null,
      pickerOptions: {
        onPick: ({ minDate, maxDate }) => {
          this.minDate = minDate
        },
        disabledDate: (time) => {
          if (this.minDate !== null) {
            let date = dayjs(this.minDate)
            let lastYear = date.subtract(12, "month")
            let nextYear = date.add(12, "month")
            return time.valueOf() < lastYear.valueOf() || time.valueOf() > nextYear.valueOf()
          }
          return false
        }
      },
      dynamicDateCol: [],
      serarchTime: [
        { label: "创建时间", value: "createTime" },
        { label: "更新时间", value: "updateTime" }
      ],
      timeLabel: "createTime",
      timeValue: "",
      brandOption: [],
      treeCategoryData: [],
      categoryIdList: [],
      storeIdOptions: [],
      importData: null
    }
  },
  created() {
    this.init()
  },
  mounted: function () {
    this.getList(this.page, this.searchFormConfirm)
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    async init() {
      //产品定位
      const { data } = await getObjByType("product_positioning")
      this.productPositioningOptions = data.data
      const res = await getPlayTypeAll()
      this.platformOptions = res.data.data
      //品类
      fetchTreeList().then((response) => {
        this.treeCategoryData = response.data.data
        console.log("品类", this.treeCategoryData)
      })
      //品牌
      fetchBrandAll().then((res) => {
        res.data.data.records.forEach((item) => {
          if (res.data.code === 0) {
            this.brandOption.push({
              value: item.brandId,
              label: item.brandName
            })
          }
        })
      })
      // 产品状态
      let resProductStatus = await getObjByType("link_sku_product_status")
      this.currentProductStatusOptions = resProductStatus.data.data
      // 产品定级
      getObjByType("link_sku_product_level").then((res) => {
        this.skuOptions = res.data.data
      })
      // 店铺
      this.getStoreList()
      this.getSitAll()
      // 销售状态
      this.saleStatusOptions = await getDictByType("link_sku_sale_status")
    },
    handleCascaderChange() {
      this.searchForm.categoryIdList = []
      this.categoryIdList.forEach((item) => {
        this.searchForm.categoryIdList.push(item[item.length - 1])
      })
      console.log("处理后的数组", this.searchForm.categoryIdList)
    },
    //加载列表数据
    async getList(page, params) {
      let tableData = deepCloneIgnoreNull(this.tableData)
      let tableOption = deepCloneIgnoreNull(this.tableOption)

      this.tableLoading = true
      page.current = page.currentPage
      page.size = page.pageSize

      const { data } = await getPageList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchFormConfirm
        )
      )
      tableData = data.data.records
      if (tableData.length === 0) {
        this.tableDataCopy = tableData
        this.tableOptionCopy = tableOption
        this.page.total = data.data.total
        return
      }
      this.page.total = data.data.total

      // 处理数据
      tableData.forEach((item) => {
        item.dynamicInformation.forEach((citem) => {
          item[citem.dayAndMonthKey] = citem.saleQuantity
        })
      })

      console.log("最终的数据源", tableData)

      // 处理表格动态列
      let dateCol = tableData[0].dynamicInformation.map((item) => {
        return {
          label: item.dayAndMonthKey === "total" ? "销量预测汇总" : item.dayAndMonthKey,
          prop: item.dayAndMonthKey,
          width: 110,
          sortable: false,
          solt: true
        }
      })

      tableData[0].dynamicInformation.forEach((item) => {
        this.dynamicDateCol.push({ label: item.dayAndMonthKey, value: item.lockStatus })
      })

      console.log("this..dynamicDateCol====", this.dynamicDateCol)

      // 合并表格列
      tableOption.column = [...tableOption.column, ...dateCol]

      console.log("最终的数据列表", tableOption)
      this.tableDataCopy = deepCloneIgnoreNull(tableData)
      this.tableOptionCopy = deepCloneIgnoreNull(tableOption)
    },

    //刷新回调
    refreshChange() {
      this.getList(this.page)
    },
    //搜索回调
    searchChange(params, page) {
      console.log("搜索")

      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.page.currentPage = 1
      if (this.selectLabel) {
        this.searchFormConfirm[this.selectLabel] = this.selectValue
      }

      if (this.timeLabel && this.timeValue) {
        if (this.timeLabel === "createTime") {
          this.searchFormConfirm.createBeginTime = this.timeValue[0]
          this.searchFormConfirm.createEndTime = this.timeValue[1]
        } else {
          this.searchFormConfirm.updateBeginTime = this.timeValue[0]
          this.searchFormConfirm.updateEndTime = this.timeValue[1]
        }
      } else {
        this.searchFormConfirm.createBeginTime = ""
        this.searchFormConfirm.createEndTime = ""
        this.searchFormConfirm.updateBeginTime = ""
        this.searchFormConfirm.updateEndTime = ""
      }

      if (this.dateValueArr && this.dateValueArr.length > 0) {
        this.searchFormConfirm.forecastBeginTime = this.dateValueArr[0]
        this.searchFormConfirm.forecastEndTime = this.dateValueArr[1]
      } else {
        this.searchFormConfirm.forecastBeginTime = ""
        this.searchFormConfirm.forecastEndTime = ""
      }

      this.getStoreList()
      this.getSitAll()

      console.log("this.searchFormConfirm", this.searchFormConfirm)
      params = Object.assign(params, this.searchFormConfirm)
      console.log("params", params)

      this.getList(this.page, params)
    },
    //重置搜索条件
    searchReset() {
      console.log("重置")
      //将默认的搜索条件放入到搜索条件中
      this.dateValueArr = []
      // this.searchFormConfirm = {}
      this.selectValue = ""
      this.timeValue = ""
      this.searchForm = {
        linkSpu: "",
        linkSku: "",
        spu: "",
        sku: "",
        lockStatus: "",
        currentProductStatus: "",
        productPositioning: "",
        skuGrade: "",
        platform: [],
        site: [],
        saleStatus: "",
        firstResponsiblePerson: "",
        forecastBeginTime: "",
        forecastEndTime: "",
        createBeginTime: "",
        createEndTime: ""
      }
      this.categoryIdList = []
      this.$refs.selectAllRef.resetSelectAll()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.getList(this.page, this.searchFormConfirm)
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      this.getList(this.page, this.searchFormConfirm)
    },
    //选中数据
    selectionChange(tableData) {
      this.selectList = tableData
      console.log("勾选的数据", this.selectList)
    },
    //清除选中
    clearSelectClear() {
      this.$refs.crud.selectClear()
    },
    handleCheck(row) {
      console.log("查看", row)
      this.$refs.checkDialogRef.openDialog(row, this.searchFormConfirm)
    },
    // 导入
    handleImport() {
      this.$refs.commonImport.syncFn({
        downloadParams: {},
        uploadParams: {}
      })
    },
    // // 导出
    async handleExport() {
      console.log("导出", this.searchFormConfirm)
      exportData(Object.assign(this.searchFormConfirm, this.page))
        .then((res) => {
          console.log("res=======", res)
          let count = getSession({ name: "downloadCount" })
          this.$store.commit("SET_DOWNLOAD_COUNT", Number(count) + 1)
          this.$message.success(`由于导出数据量较大，请点击右上角【下载列表】图标进行查看！`)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 锁定
    handleLocking() {
      console.log("锁定")
      if (!this.selectList || this.selectList.length === 0) {
        this.$message.warning(`请勾选数据`)
        return
      }
      this.$refs.lockingDialogRef.openDialog(this.selectList, this.searchFormConfirm, this.tableDataCopy?.[0])
    },
    //  锁定全部
    handleLockingAll() {
      // 如果searchFormConfirm 中的元素都是空，则返回
      let isEmpty = Object.values(this.searchFormConfirm).every(
        (value) => value === "" || value === undefined || value === null || value?.length === 0
      )
      if (isEmpty) {
        this.$message.warning(`请先选择筛选条件`)
        return
      }

      this.$refs.lockingDialogRef.openDialog(this.selectList, this.searchFormConfirm, this.tableDataCopy?.[0])
    },
    // 取消锁定
    cancelLocking() {
      if (!this.selectList || this.selectList.length === 0) {
        this.$message.warning(`请勾选数据`)
        return
      }
      this.$refs.cancelLockingDialogRef.openDialog(this.selectList, this.searchFormConfirm, this.tableDataCopy?.[0])
    },
    //  取消锁定全部
    cancelLockingAll() {
      // 如果searchFormConfirm 中的元素都是空，则返回
      let isEmpty = Object.values(this.searchFormConfirm).every(
        (value) => value === "" || value === undefined || value === null || value?.length === 0
      )
      if (isEmpty) {
        this.$message.warning(`请先选择筛选条件`)
        return
      }

      this.$refs.cancelLockingDialogRef.openDialog(this.selectList, this.searchFormConfirm, this.tableDataCopy?.[0])
    },
    //更新数据
    updateDate() {
      console.log("更新数据")
      this.getList(this.page, this.searchFormConfirm)
    },
    changeLockStatus() {
      if (this.searchForm.lockStatusStr || this.searchForm.lockStatusStr === 0) {
        this.searchForm.lockStatus = []
        this.searchForm.lockStatus = [this.searchForm.lockStatusStr]
      } else {
        this.searchForm.lockStatus = undefined
      }
    },
    changeCurrentProductStatusStr() {
      if (this.searchForm.currentProductStatusStr || this.searchForm.currentProductStatusStr === 0) {
        this.searchForm.currentProductStatus = []
        this.searchForm.currentProductStatus = [this.searchForm.currentProductStatusStr]
      } else {
        this.searchForm.currentProductStatus = undefined
      }
    },
    changeSaleStatusStr() {
      if (this.searchForm.saleStatusStr || this.searchForm.saleStatusStr === 0) {
        this.searchForm.saleStatus = []
        this.searchForm.saleStatus = [this.searchForm.saleStatusStr]
      } else {
        this.searchForm.saleStatus = undefined
      }
    },
    // 下载模板
    async customDownload() {
      const { data } = await exportForecastTemplateApi()
      downloadBlob(data, "销量预测导入模板.xlsx", "application/vnd.ms-excel;charset=utf-8")
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
      importForecastExcelApi(formData).then((res) => {
        console.log(res)
        this.importData = res.data.data
        // 销量预测导入的文件大需要特殊处理
        if (res.data.code == 0) {
          this.excelDangerStatus = false
          this.$message.warning({
            message: "异步导入中，请稍后刷新页面查看导入结果。如若发生异常，请点击右上角【下载列表】图标进行查看",
            duration: 5000
          })
        }
        this.updateDate()
        this.$refs.commonImport.closeFullScreen()
      })
    },
    // 下载错误文件
    async exportDangerExcel(file) {
      downloadFileByUrl(this.importData, "销量预测异常文件.xlsx")
    },
    //选中平台操作获取该平台下的站点
    changePlatform(val) {
      this.searchForm.site = []
      this.searchForm.storeAccountList = []
      if (val && val.length) {
        if (!this.searchForm.platform?.length) return
        this.getPlatformSit(this.searchForm.platform)
        // 根据平台获取店铺
        this.getStoreList(this.searchForm.platform)
      } else {
        this.getStoreList()
        this.getSitAll()
      }
    },
    // 站点下拉回调
    changeSit(val) {
      this.searchForm.storeAccountList = []
      if (val && val.length) {
        if (!this.searchForm.site?.length) return
        this.getStoreBySit(this.searchForm.site)
      } else {
        this.getStoreList()
      }
    },
    //根据平台查询站点
    getPlatformSit(param) {
      getSit(param).then((res) => {
        this.siteOptions = res.data
      })
    },
    // 获取店铺
    async getStoreList(platformCode = []) {
      const { data } = await getStore(platformCode)
      this.storeIdOptions = data.filter((item) => item.state === "0")
    },
    // 根据站点获取店铺
    async getStoreBySit(val) {
      let ids = []
      val.forEach((item) => {
        ids.push(this.siteOptions.find((s) => s.sitName === item).bsePlatformSitId)
      })
      const { data } = await getStoreBySitIds(ids)
      if (data.code === 0) {
        this.storeIdOptions = data.data
      }
    },
    // 获取所有站点
    async getSitAll() {
      const { data } = await getSitInfo()
      if (data.code === 0) {
        this.siteOptions = data.data
      }
    },
    // 批量删除
    handleDelete() {
      if (!this.selectList || this.selectList.length === 0) {
        this.$message.warning(`请勾选数据`)
        return
      }

      this.$refs.deleteDialogRef.openDialog(this.selectList, this.searchFormConfirm, this.tableDataCopy?.[0])
    },
    //  批量删除全部
    handleDeleteAll() {
      // 如果searchFormConfirm 中的元素都是空，则返回
      let isEmpty = Object.values(this.searchFormConfirm).every(
        (value) => value === "" || value === undefined || value === null || value?.length === 0
      )
      if (isEmpty) {
        this.$message.warning(`请先选择筛选条件`)
        return
      }

      this.$refs.deleteDialogRef.openDialog(this.selectList, this.searchFormConfirm, this.tableDataCopy?.[0])
    }
  }
}
</script>

<style lang="scss" scoped></style>
