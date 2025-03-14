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
        <template slot="menuLeft">
          <el-dropdown-button
            v-if="permissions.purchase_order_audit"
            type="primary"
            size="small"
            buttonText="提交审核"
            command="提交审核"
            @command="handleAudit"
          >
            <el-dropdown-item command="反审核">反审核</el-dropdown-item>
          </el-dropdown-button>

          <el-button
            v-if="permissions.purchase_order_push_factory"
            type="primary"
            size="small"
            @click="handlePushFactory"
          >
            下发数夫
          </el-button>
          <el-button v-if="permissions.purchase_order_push_JE" type="primary" size="small" @click="handlePushJE">
            下发巨益
          </el-button>
          <el-button
            v-if="permissions.purchase_order_end_document"
            type="primary"
            size="small"
            @click="handleEndDocument"
          >
            完结单据
          </el-button>
          <el-dropdown v-if="permissions.purchase_order_export">
            <el-button type="primary" size="small"> 导出<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <export-btn
                  pageName="采购订单列表"
                  pageUrl="/poorder/v2/page"
                  moduleName="purchase"
                  :columns="tableOption.column"
                  :pageReq="pageReq"
                  type="text"
                  buttonText="导出列表"
                ></export-btn>
              </el-dropdown-item>
              <el-dropdown-item>
                <export-btn
                  pageName="采购订单明细"
                  pageUrl="/poorder/v2/pageDetail"
                  moduleName="purchase"
                  :columns="detailExportOption"
                  :pageReq="pageReq"
                  type="text"
                  buttonText="导出明细"
                ></export-btn
              ></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            v-if="permissions.purchase_order_createContract"
            style="margin-left: 10px"
            type="primary"
            size="small"
            @click="handleCreateContract(null)"
          >
            生成合同
          </el-button>
        </template>
        <template slot="search">
          <el-form @submit.prevent.native :model="searchForm" inline ref="searchForm">
            <el-form-item prop="purchaseOrderNo">
              <el-input
                v-model="searchForm.purchaseOrderNo"
                size="small"
                clearable
                placeholder="采购单号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="createTime">
              <el-date-picker
                v-model="searchForm.createTime"
                clearable
                type="daterange"
                size="small"
                start-placeholder="单据开始日期"
                end-placeholder="单据结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="purchasePlanCode">
              <el-input
                v-model="searchForm.purchasePlanCode"
                size="small"
                clearable
                placeholder="采购计划号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="corporationId">
              <el-select
                v-model="searchForm.corporationId"
                size="small"
                placeholder="采购组织"
                filterable
                clearable
                multiple
              >
                <el-option
                  v-for="item in corporationList"
                  :key="item.corporationId"
                  :label="item.corporationName"
                  :value="item.corporationId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="supplierNo">
              <el-select
                v-model="searchForm.supplierNo"
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
            </el-form-item>
          </el-form>
        </template>
        <template slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="status">
              <el-select v-model="searchForm.status" size="small" placeholder="采购状态" filterable clearable multiple>
                <el-option
                  v-for="item in purchaseStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="purchaseDocumentType">
              <el-select
                v-model="searchForm.purchaseDocumentType"
                size="small"
                placeholder="单据类型"
                filterable
                clearable
                multiple
              >
                <el-option
                  v-for="item in documentTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="purchaseAttributes">
              <el-select
                v-model="searchForm.purchaseAttributes"
                size="small"
                placeholder="采购单属性"
                filterable
                clearable
                multiple
              >
                <el-option
                  v-for="item in purchaseAttrOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="skuCode">
              <el-input
                v-model="searchForm.skuCode"
                size="small"
                v-search-input
                clearable
                placeholder="工厂SKU"
              ></el-input>
            </el-form-item>
            <el-form-item prop="purchasePlanner">
              <el-input
                v-model="searchForm.purchasePlanner"
                size="small"
                v-search-input
                clearable
                placeholder="采购计划员"
              ></el-input>
            </el-form-item>
            <el-form-item prop="purchaser">
              <el-input
                v-model="searchForm.purchaser"
                size="small"
                v-search-input
                clearable
                placeholder="采购员"
              ></el-input>
            </el-form-item>
            <el-form-item prop="warehouseId">
              <el-select
                v-model="searchForm.warehouseId"
                size="small"
                filterable
                clearable
                multiple
                placeholder="入库仓"
              >
                <el-option
                  v-for="item in warehouseOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="inboundStatus">
              <el-select
                v-model="searchForm.inboundStatus"
                multiple
                clearable
                filterable
                size="small"
                placeholder="入库状态"
              >
                <el-option label="未入库" value="0"></el-option>
                <el-option label="全部入库" value="2"></el-option>
                <el-option label="部分入库" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="paymentStatus">
              <el-select
                v-model="searchForm.paymentStatus"
                multiple
                clearable
                filterable
                size="small"
                placeholder="付款状态"
              >
                <el-option
                  v-for="item in paymentStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="currency">
              <el-select v-model="searchForm.currency" clearable size="small" placeholder="币别" multiple filterable>
                <el-option
                  v-for="item in currencyOptions"
                  :key="item.currency"
                  :label="item.currency"
                  :value="item.currency"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="priceModel">
              <el-select
                v-model="searchForm.priceModel"
                size="small"
                clearable
                multiple
                filterable
                placeholder="价格模式"
              >
                <el-option
                  v-for="item in priceModelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="poContractNo">
              <el-input
                v-model="searchForm.poContractNo"
                size="small"
                clearable
                placeholder="合同编号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="contractStatus">
              <el-select
                v-model="searchForm.contractStatus"
                size="small"
                clearable
                multiple
                collapse-tags
                filterable
                placeholder="合同状态"
              >
                <el-option
                  v-for="item in poContractStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="saleOrderIssuedSoonforStatus">
              <el-select
                v-model="searchForm.saleOrderIssuedSoonforStatus"
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
          </el-form>
        </template>

        <!-- 采购计划号 -->
        <template slot="purchasePlanCode" slot-scope="scope">
          <copy-text hoverToShow>
            <router-link
              :to="{
                path: '/purchase/procurementPlan/detail',
                query: { purchasePlanCode: scope.row.purchasePlanCode }
              }"
            >
              {{ scope.row.purchasePlanCode }}
            </router-link>
          </copy-text>
        </template>

        <!-- 采购单号 -->
        <template slot="purchaseOrderNo" slot-scope="scope">
          <copy-text hoverToShow>
            <router-link
              :to="{ path: '/purchase/poorder/detail', query: { purchaserOrderNo: scope.row.purchaseOrderNo } }"
            >
              {{ scope.row.purchaseOrderNo }}
            </router-link>
          </copy-text>
        </template>

        <!-- 采购状态 -->
        <template slot="poOrderStatusName" slot-scope="scope">
          <span :style="{ color: poOrderStatusArrColor[scope.row.status] }">
            {{ scope.row.poOrderStatusName }}
          </span>
        </template>

        <!-- 商品种数 -->
        <template slot="skuCount" slot-scope="scope">
          <a v-if="scope.row.skuCount > 0" @click="handleShowSkuInfo(scope.row.purchaseOrderNo)">
            {{ scope.row.skuCount }}笔
          </a>
          <div v-else>{{ scope.row.skuCount }}笔</div>
        </template>

        <!-- 下发数夫状态 -->
        <template slot="saleOrderIssuedSoonforStatusName" slot-scope="scope">
          <span :style="{ color: saleOrderIssuedSoonforStatusArrColor[scope.row.saleOrderIssuedSoonforStatus] }">
            {{ scope.row.saleOrderIssuedSoonforStatusName }}
          </span>
        </template>

        <!-- 合同编号 -->
        <template slot="poContractNo" slot-scope="scope">
          <copy-text hoverToShow>
            <router-link
              :to="'/showNonTaxContractPic/index?paramcontractNo=' + scope.row.poContractNo"
              :title="scope.row.poContractNo"
            >
              {{ scope.row.poContractNo }}
            </router-link>
          </copy-text>
        </template>

        <template slot="priceModel" slot-scope="scope">
          {{ priceModelOptions?.find((item) => item.value === scope.row.priceModel)?.label }}
        </template>

        <template slot="operation" slot-scope="scope">
          <avue-crud-ctrl :list="getCtrlList(scope.row)" :defaultShowNumber="3"></avue-crud-ctrl>
        </template>
      </avue-crud>

      <!-- 修改备注 -->
      <remarkDialog ref="remarkDialogRef" @updateList="updateList"></remarkDialog>
      <!-- 采购明细 -->
      <skuInfoDialog ref="skuInfoDialogRef"></skuInfoDialog>
      <batchProcurementPlanStatus
        ref="batchProcurementPlanStatusRef"
        @updateList="updateList"
      ></batchProcurementPlanStatus>
      <!-- 生成合同 -->
      <generateContractDialog ref="generateContractDialogRef" @updateList="updateList"></generateContractDialog>
    </basic-container>
  </div>
</template>

<script>
import {
  checkAdvancePayAble,
  completePoOrderApi,
  getPoOrderPageApi,
  cancelPoOrderPageApi,
  submitPoOrderPageApi,
  reversePoOrderPageApi,
  pushShufuPoOrderPageApi,
  pushPoOrderToJEApi
} from "@/api/purchase/order/poorder"
import { getDictByType, setFiltering, setOrderBy } from "@/util/auth"
import { mapGetters } from "vuex"
import { getAll as getAllSupplierApi } from "@/api/supplier/posupplier"
import { getAll as getBseCurrency } from "@/api/baseSetup/bsecurrency"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import remarkDialog from "./components/remarkDialog"
import { getAll as getAllCorporationApi } from "@/api/baseSetup/bsecorporation"
import { tableOption, detailExportOption, poOrderStatusArrColor, saleOrderIssuedSoonforStatusArrColor } from "./list"
import skuInfoDialog from "./components/skuInfoDialog"
import batchProcurementPlanStatus from "./components/batchProcurementPlanStatus"
import generateContractDialog from "./components/generateContractDialog"

export default {
  name: "purchasePoOrderList",
  components: {
    remarkDialog,
    skuInfoDialog,
    batchProcurementPlanStatus,
    generateContractDialog
  },
  data() {
    return {
      searchForm: {
        purchaseOrderNo: "",
        createTime: [],
        purchasePlanCode: "",
        corporationId: [],
        supplierNo: [],
        status: [],
        purchaseDocumentType: [],
        purchaseAttributes: [],
        skuCode: "",
        purchasePlanner: "",
        purchaser: "",
        warehouseId: [],
        inboundStatus: [],
        paymentStatus: [],
        currency: [],
        priceModel: [],
        poContractNo: "",
        contractStatus: [],
        saleOrderIssuedSoonforStatus: []
      },
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      selectList: [],
      currencyOptions: [],
      warehouseOptions: [],
      poContractStatusOptions: [],
      priceModelOptions: [],
      supplierOptions: [],
      corporationList: [],
      purchaseStatusOptions: [],
      documentTypeOptions: [],
      purchaseAttrOptions: [],
      paymentStatusOptions: [],
      orderBy: [{ field: "createTime", order: "desc" }],
      poOrderStatusArrColor,
      saleOrderIssuedSoonforStatusArrColor,
      operatorParams: {
        purchaseAttributes: "LIKE"
      },
      detailExportOption,
      issuedSoonforStatusOptions: []
    }
  },
  async created() {},
  async activated() {
    await Promise.all([
      this.getCurrencyAll(),
      this.getWarehouseAll(),
      this.getPriceModelAll(),
      this.getSupplierAll(),
      this.getCorporation(),
      this.getList()
    ])

    const [
      documentTypeOptions,
      purchaseAttrOptions,
      purchaseStatusOptions,
      paymentStatusOptions,
      issuedSoonforStatusOptions,
      poContractStatusOptions
    ] = await Promise.all([
      getDictByType("document_type"),
      getDictByType("plan_attributes"),
      getDictByType("po_order_status_v2"),
      getDictByType("po_pay_status"),
      getDictByType("issued_soonfor_status"),
      getDictByType("po_contract_status")
    ])
    this.documentTypeOptions = documentTypeOptions
    this.purchaseAttrOptions = purchaseAttrOptions
    this.purchaseStatusOptions = purchaseStatusOptions
    this.paymentStatusOptions = paymentStatusOptions
    this.issuedSoonforStatusOptions = issuedSoonforStatusOptions
    this.poContractStatusOptions = poContractStatusOptions
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"]),
    pageReq() {
      return { filtering: setFiltering(this.searchForm) }
    }
  },
  methods: {
    // 获取币别
    getCurrencyAll() {
      getBseCurrency().then(({ data }) => {
        if (data.code == 0) {
          this.currencyOptions = data.data
        }
      })
    },
    // 获取仓库
    getWarehouseAll() {
      getAllWarehouse().then((res) => {
        if (res.data.code === 0) {
          let arr = res.data.data.filter((item) => item.funcState === "1")
          this.warehouseOptions = arr.map((item) => {
            return {
              label: item.warehouseName,
              value: item.warehouseId
            }
          })
        }
      })
    },
    // 获取价格模式
    async getPriceModelAll() {
      this.priceModelOptions = await getDictByType("price_model")
    },
    //获取供应商
    async getSupplierAll() {
      const { data } = await getAllSupplierApi()
      if (data.code === 0) {
        data.data.forEach((item) => {
          this.supplierOptions.push({
            value: item.supplierNo,
            label: item.supplierName
          })
        })
      }
    },
    // 获取法人主体
    async getCorporation() {
      const { data } = await getAllCorporationApi()
      if (data.code === 0) {
        this.corporationList = data.data
      }
    },
    // 生成预付单
    createRequestAndPre(row) {
      const { purchaseOrderNo } = row
      let parma = {
        purchaseOrderNo,
        command: 2
      }
      checkAdvancePayAble(parma)
        .then((response) => {
          console.log(response)
          if (response.data.data) {
            this.$router.push({ path: "/requestDetail", query: { purchaseOrderNos: purchaseOrderNo, command: 2 } })
          } else if (!response.data.data) {
            this.$message.error(`该订单不支持生成预付单`)
          } else {
            this.$message.error("操作失败")
          }
        })
        .catch(() => {})
    },

    // 查看采购明细
    handleShowSkuInfo(purchaseOrderNo) {
      this.$refs.skuInfoDialogRef.openDialog(purchaseOrderNo)
    },
    selectionChange(list) {
      this.selectList = list
    },
    async getList(column = null) {
      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        filtering: setFiltering(this.searchForm, this.operatorParams),
        orderBy: setOrderBy(column, this.orderBy)
      }

      const { data } = await getPoOrderPageApi(params)
      this.tableData = data.data.records
      this.page.total = data.data.total
    },
    clearSelectClear() {
      this.$refs.crud.toggleSelection()
    },
    // 排序
    sortChange(column) {
      this.getList(column)
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList()
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      this.page.currentPage = 1
      this.getList()
    },
    searchReset() {
      this.$refs["searchForm"].resetFields()
      this.$refs["searchFormAdvance"]?.resetFields()
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
              path: "/purchase/poorder/edit",
              query: {
                id: row.id,
                purchaserOrderNo: row.purchaseOrderNo,
                type: "edit"
              }
            })
          },
          show: [10, 12].includes(Number(row.status)) && this.permissions.purchase_order_edit // 采购状态=待提审/审核不通过
        },
        {
          title: "拆分采购订单",
          item: row,
          clickFn: (row) => {
            this.$router.push({
              path: "/purchase/poorder/split",
              query: {
                id: row.id,
                purchaserOrderNo: row.purchaseOrderNo,
                type: "split"
              }
            })
          },
          show: [10, 12, 13].includes(Number(row.status)) // 采购状态=待提审/审核不通过/待收货
        },
        {
          title: "生成合同",
          item: row,
          clickFn: (row) => {
            this.handleCreateContract(row)
          },
          show:
            this.permissions.purchase_order_createContract &&
            [13, 14, 15].includes(row.status) &&
            [3].includes(row.contractStatus) // 订单===待收货\部分收货\已完结、并且未生成合同
        },
        {
          title: "生成预付单",
          item: row,
          clickFn: (row) => {
            this.createRequestAndPre(row)
          },
          show: this.permissions.purchase_order_generate_prepaid_order
        },
        {
          title: "编辑备注",
          item: row,
          clickFn: (row) => {
            this.handleEditRemark(row)
          },
          show: true
        },
        {
          title: "作废",
          item: row,
          clickFn: (row) => {
            this.$confirm("作废采购订单后，采购状态将变更为 '作废'，该采购订单不可再使用。您确定继续操作吗？", "作废", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(async () => {
              const purchaseOrderNos = [{ code: row.purchaseOrderNo }]

              const { data } = await cancelPoOrderPageApi(purchaseOrderNos)
              if (data.code === 0) {
                // this.$message.success("作废成功")
                // this.updateList()
                this.$refs.batchProcurementPlanStatusRef.openDialog(data.data)
              }
            })
          },
          show: this.permissions.purchase_order_cancel && ![16, 15].includes(Number(row.status)) // 采购状态!=已作废、已完结
        }
      ]
    },
    handleEditRemark(row) {
      const { remarks, purchaseOrderNo } = row
      this.$refs.remarkDialogRef.openDialog(remarks, purchaseOrderNo)
    },
    async handleAudit(command) {
      if (this.selectList.length <= 0) {
        this.$message.error("请选择数据")
        return
      }
      const purchaseOrderNos = this.selectList.map((item) => {
        return {
          code: item.purchaseOrderNo
        }
      })
      let fn = command === "提交审核" ? submitPoOrderPageApi : reversePoOrderPageApi
      const { data } = await fn(purchaseOrderNos)
      console.log("data===", data)
      if (data.code === 0) {
        // this.$message.success("提交成功")
        // this.updateList()
        this.$refs.batchProcurementPlanStatusRef.openDialog(data.data)
      }
    },
    async handlePushFactory() {
      if (this.selectList.length === 0) {
        this.$message.warning("请勾选数据")
        return
      }
      for (let item of this.selectList) {
        // 下发成功、无需下发数夫
        if ([1, 5].includes(item.saleOrderIssuedSoonforStatus)) {
          this.$message.warning("请勾选下发数夫状态为待下发、下发失败的数据")
          return
        }

        // 待收货\部分收货\已完结
        if (![13, 14, 15].includes(item.status)) {
          this.$message.warning("请勾选待收货、部分收货、已完结的数据")
          return
        }
      }

      const purchaseOrderNos = this.selectList.map((item) => {
        return {
          code: item.purchaseOrderNo
        }
      })
      const { data } = await pushShufuPoOrderPageApi(purchaseOrderNos)
      if (data.code === 0) {
        // this.$message.success("提交成功")
        // this.updateList()
        this.$refs.batchProcurementPlanStatusRef.openDialog(data.data)
      }
    },
    handleEndDocument() {
      if (this.selectList.length === 0) {
        this.$message.warning("请勾选数据")
        return
      }
      this.$confirm(
        `您勾选了 ${this.selectList.length} 条数据！完结采购订单后，不可对采购单做排柜、下发单据等操作，您确定继续操作吗？`,
        "完结单据",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(async () => {
        const purchaseOrderNos = this.selectList.map((item) => {
          return {
            code: item.purchaseOrderNo
          }
        })
        const { data } = await completePoOrderApi(purchaseOrderNos)
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
    // 生成合同
    handleCreateContract(row) {
      let supplierNo = ""
      let contractPurchaseOrderNo = ""
      if (row) {
        contractPurchaseOrderNo = row.purchaseOrderNo
        supplierNo = row.supplierNo
      } else {
        if (this.selectList && this.selectList.length === 0) {
          this.$message.warning("请选择数据")
          return
        }

        const supplierNoArr = this.selectList.map((item) => item.supplierNo)
        const supplierNoSet = new Set(supplierNoArr)
        if (supplierNoSet.size > 1) {
          this.$message.warning("请选择一样的供应商")
          return
        }

        for (let item of this.selectList) {
          if (![13, 14, 15].includes(item.status)) {
            this.$message.warning("存在着不是待收货、部分收货、已完结状态的订单，请检查！")
            return
          }

          if (item.contractStatus !== 3) {
            this.$message.warning("存在已经生成合同的订单，请检查")
            return
          }
        }

        supplierNo = supplierNoArr[0]
        contractPurchaseOrderNo = this.selectList.map((item) => item.purchaseOrderNo).join(",")
      }

      this.$refs.generateContractDialogRef.openDialog(contractPurchaseOrderNo, supplierNo)

      return
    },
    // 下发巨益
    async handlePushJE() {
      if (this.selectList && this.selectList.length === 0) {
        this.$message.warning("请选择数据")
        return
      }

      const purchaseOrderNos = this.selectList.map((item) => item.purchaseOrderNo)
      const { data } = await pushPoOrderToJEApi(purchaseOrderNos)
      if (data.code === 0) {
        this.$message.success("下发成功")
        this.updateList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .buttonClass {
  margin-left: 0px;
}
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
