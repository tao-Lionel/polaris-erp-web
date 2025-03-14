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
        @sort-change="sortChange"
      >
        <!-- 操作按钮栏 -->
        <template slot="menuLeft">
          <el-button v-if="permissions.purchase_plan_add" type="primary" @click="handleAdd" size="small">
            新增
          </el-button>

          <el-dropdown v-if="permissions.purchase_plan_import">
            <el-button type="primary" size="small">
              批量导入<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleImportAdd">导入新增</el-dropdown-item>
              <el-dropdown-item @click.native="handleImportUpdate">导入修改</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown-button
            v-if="permissions.purchase_plan_audit"
            type="primary"
            size="small"
            buttonText="提交审核"
            command="提交审核"
            @command="handleAudit"
          >
            <el-dropdown-item command="反审核">反审核</el-dropdown-item>
          </el-dropdown-button>

          <el-button
            v-if="permissions.purchase_plan_push_factory"
            type="primary"
            @click="handlePushFactory"
            size="small"
          >
            下发数夫
          </el-button>
          <el-button
            v-if="permissions.purchase_plan_end_document"
            type="primary"
            @click="handleEndDocument"
            size="small"
          >
            完结单据
          </el-button>

          <el-dropdown v-if="permissions.purchase_plan_end_export">
            <el-button type="primary" size="small"> 导出<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <export-btn
                  pageName="采购计划单列表"
                  pageUrl="/purchasePlan/page"
                  moduleName="purchase"
                  :columns="tableOption.column"
                  :pageReq="pageReq"
                  type="text"
                  buttonText="导出列表"
                ></export-btn>
              </el-dropdown-item>
              <el-dropdown-item>
                <export-btn
                  pageName="采购计划单明细"
                  pageUrl="/purchasePlan/pageDetail"
                  moduleName="purchase"
                  :columns="detailExportOption"
                  :pageReq="pageReq"
                  type="text"
                  buttonText="导出明细"
                ></export-btn
              ></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <!-- 搜索栏 -->
        <template slot="search">
          <el-form :model="searchForm" ref="searchFormRef" :inline="true">
            <el-form-item prop="documentTime">
              <el-date-picker
                v-model="searchForm.documentTime"
                type="daterange"
                size="small"
                start-placeholder="单据开始日期"
                end-placeholder="单据结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                clearable
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item prop="purchasePlanCode">
              <el-input
                size="small"
                v-model="searchForm.purchasePlanCode"
                placeholder="采购计划号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="cabinetCode">
              <el-input
                size="small"
                v-model="searchForm.cabinetCode"
                placeholder="排柜号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="documentStatus">
              <el-select
                v-model="searchForm.documentStatus"
                size="small"
                placeholder="单据状态"
                filterable
                clearable
                multiple
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item prop="supplierCode">
              <el-select
                v-model="searchForm.supplierCode"
                size="small"
                placeholder="供应商"
                filterable
                clearable
                multiple
              >
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item> -->
          </el-form>
        </template>

        <template slot="searchAdvanced">
          <el-form :model="searchForm" ref="searchAdvancedFormRef" :inline="true">
            <el-form-item prop="issuedSoonforStatus">
              <el-select
                v-model="searchForm.issuedSoonforStatus"
                size="small"
                placeholder="下发数夫状态"
                filterable
                clearable
                multiple
              >
                <el-option
                  v-for="item in issuedSoonforStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item prop="purchaseOrganizationName">
              <el-select
                size="small"
                v-model="searchForm.purchaseOrganizationName"
                clearable
                filterable
                multiple
                placeholder="采购组织"
              >
                <el-option
                  v-for="item in corporationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item prop="purchasePlanner">
              <el-input
                size="small"
                v-model="searchForm.purchasePlanner"
                placeholder="采购计划员,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <!-- <el-form-item prop="purchaser">
              <el-input
                size="small"
                v-model="searchForm.purchaser"
                placeholder="采购员,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item> -->
            <el-form-item prop="relationPurchaseOrderNo">
              <el-input
                size="small"
                v-model="searchForm.relationPurchaseOrderNo"
                placeholder="关联采购订单号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="documentType">
              <el-select
                v-model="searchForm.documentType"
                size="small"
                placeholder="单据类型"
                clearable
                filterable
                multiple
              >
                <el-option
                  v-for="item in purchasePlanTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="planAttributes">
              <el-select
                v-model="searchForm.planAttributes"
                size="small"
                placeholder="计划单属性"
                clearable
                multiple
                filterable
              >
                <el-option
                  v-for="item in purchasePlanAttrOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <!-- 采购计划号 -->
        <template slot="purchasePlanCode" slot-scope="{ row }">
          <copy-text hoverToShow>
            <router-link
              :to="{ path: '/purchase/procurementPlan/detail', query: { purchasePlanCode: row.purchasePlanCode } }"
              :title="item"
            >
              {{ row.purchasePlanCode }}
            </router-link>
          </copy-text>
        </template>
        <!-- 采购状态 -->
        <template slot="documentStatusName" slot-scope="{ row }">
          <span :style="{ color: documentStatusArrColor[row.documentStatus] }">{{ row.documentStatusName }}</span>
        </template>
        <!-- 下发数夫状态 -->
        <template slot="issuedSoonforStatusName" slot-scope="{ row }">
          <span :style="{ color: issuedSoonforStatusArrColor[row.issuedSoonforStatus] }">
            {{ row.issuedSoonforStatusName }}
          </span>
        </template>

        <!-- 关联采购单号 -->
        <template slot="relationPurchaseOrderNo" slot-scope="{ row }">
          <el-popover placement="bottom" width="200" trigger="hover" v-if="row.relationPurchaseOrderNoArray?.length">
            <div v-for="item in row.relationPurchaseOrderNoArray" :key="item">
              <copy-text hoverToShow>
                <router-link :to="'/purchase/poorder/detail?purchaserOrderNo=' + item" :title="item">
                  {{ item }}
                </router-link>
              </copy-text>
            </div>
            <el-button slot="reference" size="small" type="text">查看</el-button>
          </el-popover>
          <span v-else>暂无关联采购单号</span>
        </template>
        <!-- 排柜号 -->
        <template slot="relationDeliveryPlanCode" slot-scope="{ row }">
          <el-popover placement="bottom" width="200" trigger="hover" v-if="row.cabinetNoArray?.length">
            <div v-for="(item, index) in row.cabinetNoArray" :key="item">
              <router-link
                :to="`/purchase/containerLoadingPlan/details?deliveryPlanCode=${item}&type=${row.planAttributes}&id=${
                  row.relationDeliveryPlanId?.split(',')?.[index]
                }`"
                :title="item"
              >
                {{ item }}
              </router-link>
            </div>
            <el-button slot="reference" size="small" type="text">查看</el-button>
          </el-popover>
          <span v-else>暂无关联排柜号</span>
        </template>

        <template slot="operate" slot-scope="{ row }">
          <avue-crud-ctrl :list="getCtrlList(row)"></avue-crud-ctrl>
        </template>
      </avue-crud>

      <commonImport
        ref="commonImportRef"
        :excelStatus="false"
        :excelDangerStatus="excelDangerStatus"
        @import="importExcelBtn"
        @export="exportDangerExcel"
        :customDownload="customDownload"
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

      <batchProcurementPlanStatus
        ref="batchProcurementPlanStatusRef"
        @updateList="updateList"
      ></batchProcurementPlanStatus>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { tableOption, detailExportOption, documentStatusArrColor, issuedSoonforStatusArrColor } from "./list"
import { getAll as getAllSupplierApi } from "@/api/supplier/posupplier"
import { getAll as getAllBsecorporation } from "@/api/baseSetup/bsecorporation"
import { getDictByType, setFiltering, setOrderBy, downloadBlob } from "@/util/auth.js"
import {
  getPurchasePlanPageApi,
  closePurchasePlanByIdApi,
  submitPurchasePlanApi,
  pushShufuPurchasePlanApi,
  reversePurchasePlanApi,
  cancelPurchasePlanApi,
  importPurchasePlanApi,
  exportErrorDataApi,
  productDownloadTemplateApi
} from "@/api/purchase/procurementPlan"
import commonImport from "@/views/cockpit/commonImport.vue"
import batchProcurementPlanStatus from "./components/batchProcurementPlanStatus"

export default {
  name: "procurementPlanList",
  components: { commonImport, batchProcurementPlanStatus },
  computed: {
    ...mapGetters(["permissions"]),
    pageReq() {
      return { filtering: setFiltering(this.searchForm) }
    }
  },
  data() {
    return {
      searchForm: {
        documentTime: [],
        purchasePlanCode: "",
        cabinetCode: "",
        supplierCode: [],
        documentStatus: [],
        purchaseOrganizationName: [],
        purchasePlanner: "",
        purchaser: "",
        documentType: [],
        planAttributes: [],
        issuedSoonforStatus: [],
        relationPurchaseOrderNo: ""
      },
      tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableData: [],
      selectList: [],
      supplierOptions: [],
      statusOptions: [],
      corporationOptions: [],
      purchasePlanTypeOptions: [],
      purchasePlanAttrOptions: [],
      issuedSoonforStatusOptions: [],
      excelDangerStatus: false, // 是否可下载错误文件
      errorData: [], // 错误数据
      successCount: 0, // 成功导入条数
      errorCount: 0, // 失败条数
      orderBy: [{ field: "documentTime", order: "desc" }],
      documentStatusArrColor,
      issuedSoonforStatusArrColor,
      operatorParams: {
        purchaseOrganizationName: "LIKE",
        relationPurchaseOrderNo: "LIKE"
      },
      detailExportOption
    }
  },
  created() {},
  mounted: async function () {},
  activated() {
    this.init()
  },
  methods: {
    async init() {
      await Promise.all([this.getSupplierAll(), this.getCorporationOptions(), this.getList()])
      const [purchasePlanTypeOptions, purchasePlanAttrOptions, statusOptions, issuedSoonforStatusOptions] =
        await Promise.all([
          getDictByType("purchase_plan_document_type"),
          getDictByType("plan_attributes"),
          getDictByType("document_status"),
          getDictByType("issued_soonfor_status")
        ])
      this.purchasePlanTypeOptions = purchasePlanTypeOptions
      this.purchasePlanAttrOptions = purchasePlanAttrOptions
      this.statusOptions = statusOptions
      this.issuedSoonforStatusOptions = issuedSoonforStatusOptions
    },
    //获取供应商
    async getSupplierAll() {
      const { data } = await getAllSupplierApi()
      if (data.code === 0) {
        this.supplierOptions = data.data.map((item) => {
          return {
            value: item.supplierNo,
            label: item.supplierName
          }
        })
      }
    },

    // 获取采购组织（法人主体）
    async getCorporationOptions() {
      const { data } = await getAllBsecorporation()
      if (data.code === 0) {
        this.corporationOptions = data.data.map((item) => ({
          value: item.corporationCode,
          label: item.corporationName
        }))
      }
    },

    //加载列表数据
    async getList(column = null) {
      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        filtering: setFiltering(this.searchForm),
        orderBy: setOrderBy(column, this.orderBy)
      }

      const { data } = await getPurchasePlanPageApi(params)

      this.tableData = data.data.records.map((item) => {
        return {
          ...item,
          relationPurchaseOrderNoArray: item.relationPurchaseOrderNo ? item.relationPurchaseOrderNo?.split(",") : [],
          cabinetNoArray: item.relationDeliveryPlanCode ? item.relationDeliveryPlanCode?.split(",") : []
        }
      })
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
      console.log("重置")
      this.$refs.searchFormRef.resetFields()
      this.$refs.searchAdvancedFormRef?.resetFields()
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
    clearSelection() {
      this.$refs.crud.selectClear()
    },
    getCtrlList(row) {
      return [
        {
          title: "编辑",
          item: row,
          clickFn: (row) => {
            this.$router.push({
              path: "/purchase/procurementPlan/edit",
              query: { purchasePlanCode: row.purchasePlanCode }
            })
          },
          show: [0, 2].includes(Number(row.documentStatus)) && this.permissions.purchase_plan_edit // 待提审/OA审核不通过时
        },
        {
          title: "生成订单",
          item: row,
          clickFn: (row) => {
            this.$router.push({ path: "/purchase/poorder/create", query: { purchasePlanCode: row.purchasePlanCode } })
          },
          show: [3, 4].includes(Number(row.documentStatus)) && this.permissions.purchase_plan_generate_purchase_order // 单据状态=待采购/采购中时
        },
        {
          title: "作废",
          item: row,
          clickFn: (row) => {
            this.$confirm("作废采购计划单后，单据状态将变更为 '作废'，该计划单不可再使用。您确定继续操作吗？", "作废", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(async () => {
              const purchasePlanCodes = [{ code: row.purchasePlanCode }]

              const { data } = await cancelPurchasePlanApi(purchasePlanCodes)
              if (data.code === 0) {
                // this.$message.success("作废成功")
                // this.updateList()
                this.$refs.batchProcurementPlanStatusRef.openDialog(data.data)
              }
            })
          },
          show: ![6, 5].includes(Number(row.documentStatus)) && this.permissions.purchase_plan_cancel // 单据状态!==作废时、已完结
        }
      ]
    },
    handleAdd() {
      this.$router.push({ path: "/purchase/procurementPlan/create" })
    },
    handleImportAdd() {
      this.successCount = 0
      this.errorCount = 0
      this.errorData = []
      this.excelDangerStatus = false
      this.$refs.commonImportRef.syncFn()
    },
    handleImportUpdate() {
      this.successCount = 0
      this.errorCount = 0
      this.errorData = []
      this.excelDangerStatus = false
      this.$refs.commonImportRef.syncFn()
    },
    async handleAudit(command) {
      if (this.selectList.length <= 0) {
        this.$message.error("请选择数据")
        return
      }
      const purchasePlanCodes = this.selectList.map((item) => {
        return {
          code: item.purchasePlanCode
        }
      })
      let fn = command === "提交审核" ? submitPurchasePlanApi : reversePurchasePlanApi
      const { data } = await fn(purchasePlanCodes)
      console.log("data===", data)
      if (data.code === 0) {
        // this.$message.success("提交成功")
        // this.updateList()
        this.$refs.batchProcurementPlanStatusRef.openDialog(data.data)
      }
    },
    // 下发数夫
    async handlePushFactory() {
      if (this.selectList.length === 0) {
        this.$message.warning("请勾选数据")
        return
      }

      for (let item of this.selectList) {
        // 下发成功、无需下发数夫
        if ([1, 5].includes(item.issuedSoonforStatus)) {
          this.$message.warning("请勾选下发数夫状态为待下发、下发失败的数据")
          return
        }

        // 待采购、采购中、已完结
        if (![3, 4, 5].includes(item.documentStatus)) {
          this.$message.warning("请勾选待采购、采购中、已完结的数据")
          return
        }
      }

      const purchasePlanCodes = this.selectList.map((item) => {
        return {
          code: item.purchasePlanCode
        }
      })
      const { data } = await pushShufuPurchasePlanApi(purchasePlanCodes)
      if (data.code === 0) {
        // this.$message.success("提交成功")
        // this.updateList()
        this.$refs.batchProcurementPlanStatusRef.openDialog(data.data)
      }
    },
    // 完结单据
    handleEndDocument() {
      if (this.selectList.length === 0) {
        this.$message.warning("请勾选数据")
        return
      }
      this.$confirm(
        `您勾选了 ${this.selectList.length} 条数据！完结采购计划单后，不可再生成采购单，您确定继续操作吗？`,
        "完结单据",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(async () => {
        const purchasePlanCodes = this.selectList.map((item) => {
          return {
            code: item.purchasePlanCode
          }
        })
        const { data } = await closePurchasePlanByIdApi(purchasePlanCodes)
        if (data.code === 0) {
          this.$message.success("操作成功")
          this.updateList()
        }
      })
    },
    updateList() {
      this.clearSelection()
      this.getList()
    },
    sortChange(column) {
      this.getList(column)
    },

    // 下载模板
    async customDownload() {
      const { data } = await productDownloadTemplateApi({ templateName: "采购计划导入模板" })
      downloadBlob(data, "采购计划导入模板.xlsx", "application/vnd.ms-excel;charset=utf-8")
    },
    // 导入数据
    async importExcelBtn(file) {
      if (!file) {
        this.$message.error("请上传文件!")
        return
      }
      this.$refs.commonImportRef.openFullScreen()
      let formData = new FormData()
      formData.append("file", file.raw)
      const { data } = await importPurchasePlanApi(formData)
      if (data.code === 0) {
        this.successCount = data.data.successData?.length
        this.errorCount = data.data.errorData?.length
        this.errorData = data.data.errorData

        if (this.errorCount > 0) {
          this.$message.error("导入的excel表格数据有误，请点击异常文件下载查看原因")
          this.excelDangerStatus = true
        } else {
          this.$message.success("导入成功")
          this.excelDangerStatus = false
          this.updateList()
          this.$refs.commonImportRef.closeFullScreen()
          this.$refs.commonImportRef.syncFn()
        }
      }
    },
    // 下载错误文件
    async exportDangerExcel() {
      const { data } = await exportErrorDataApi({ templateName: "采购计划导入模板", errorList: this.errorData })
      downloadBlob(data, "采购计划错误数据.xlsx", "application/vnd.ms-excel;charset=utf-8")
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dropdown-menu__item {
  .el-button--text {
    color: #606266;
  }
}

::v-deep .el-dropdown-menu__item :hover {
  .el-button--text:hover {
    color: var(--primary-color);
  }
}
</style>
