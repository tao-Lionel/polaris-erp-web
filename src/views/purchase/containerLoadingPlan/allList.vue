<template>
  <div id="allList">
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
        <!-- <el-button type="primary" size="small" v-if="permissions.purchase_container_audit"  @click="handleAudit">
          提交审核
        </el-button> -->

        <el-dropdown-button
          style="margin-right: 10px; margin-left: 0"
          v-if="permissions.purchase_container_audit"
          type="primary"
          size="small"
          buttonText="提交审核"
          command="提交审核"
          @command="handleAudit"
        >
          <el-dropdown-item command="反审核">反审核</el-dropdown-item>
        </el-dropdown-button>
        <export-btn
          v-if="permissions.purchase_container_export"
          pageName="已排柜（全部）"
          pageUrl="/deliveryPlan/pageAlreadyPlan"
          moduleName="purchase"
          :columns="allcolumn"
          :pageReq="{ filtering: exportFiltering }"
        ></export-btn>
      </template>
      <template slot="search">
        <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
          <el-form-item prop="deliveryPlanCode">
            <el-input
              size="small"
              clearable
              placeholder="排柜号"
              v-model="searchForm.deliveryPlanCode"
              v-search-input
            ></el-input>
          </el-form-item>
          <el-form-item prop="purchaseOrderAttribute">
            <el-select
              v-model="searchForm.purchaseOrderAttribute"
              size="small"
              placeholder="采购单属性"
              filterable
              clearable
            >
              <el-option label="DI订单" value="DI"></el-option>
              <el-option label="非DI订单" value="other"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="documentStatus">
            <el-select v-model="searchForm.documentStatus" size="small" placeholder="单据状态" filterable clearable>
              <el-option
                v-for="item in shippingPlanList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="poOrderNo">
            <el-select
              size="small"
              clearable
              class="search-select"
              @change="orderKeyChange"
              v-model="orderKey"
              placeholder="请选择"
            >
              <el-option v-for="(item, index) in orderTypeOption" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-input
              size="small"
              clearable
              placeholder="请输入内容"
              v-model="orderValue"
              v-search-input
              @change="orderValueChange"
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

          <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
        </el-form>
      </template>
      <template slot="searchAdvanced">
        <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
          <el-form-item label-width="100px">
            <el-select size="small" clearable filterable v-model="searchForm.containerType" placeholder="箱型/车型">
              <el-option
                v-for="item in boxCarTypeList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="minLoadRate">
            <el-input
              size="small"
              clearable
              placeholder="装载率最小值"
              v-model="searchForm.loadRate[0]"
              v-search-input
            ></el-input>
          </el-form-item>
          <el-form-item prop="maxLoadRate">
            <el-input
              size="small"
              clearable
              placeholder="装载率最大值"
              v-model="searchForm.loadRate[1]"
              v-search-input
            ></el-input>
          </el-form-item>
          <el-form-item label-width="100px">
            <el-select size="small" clearable filterable v-model="searchForm.departurePort" placeholder="起运港口">
              <el-option
                v-for="item in selectOptionData.departureHarbourList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="100px">
            <el-select size="small" clearable filterable v-model="searchForm.destinationPort" placeholder="目的港口">
              <el-option
                v-for="item in selectOptionData.departureHarbourList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="warehouseId">
            <el-select v-model="searchForm.warehouseId" size="small" placeholder="采购单入库仓库" filterable clearable>
              <el-option
                v-for="item in selectOptionData.warehouseOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
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
            <el-select v-model="searchForm.site" size="small" placeholder="站点" filterable multiple clearable>
              <el-option
                v-for="item in marketOption"
                :key="item.sitEnName"
                :label="item.sitEnName"
                :value="item.sitEnName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="purchaseOrganizationName">
            <el-select
              v-model="searchForm.purchaseOrganizationCode"
              size="small"
              placeholder="采购组织"
              filterable
              clearable
            >
              <el-option
                v-for="item in selectOptionData.corporationList"
                :key="item.corporationCode"
                :label="item.corporationName"
                :value="item.corporationCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="supplierNo">
            <el-select v-model="searchForm.supplierNo" size="small" placeholder="供应商" filterable clearable>
              <el-option
                v-for="item in selectOptionData.supplierOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="urgentFlag">
            <el-select v-model="searchForm.urgentFlag" size="small" placeholder="是否加急" filterable clearable>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
        </el-form>
      </template>
      <template slot="totalVolume" slot-scope="scope">
        <span>{{ Math.ceil((scope.row.totalVolume / 1000000) * 100) / 100 }}</span>
      </template>

      <template slot="purchaseOrderAttribute" slot-scope="scope">
        <span>{{ scope.row.purchaseOrderAttribute == "DI" ? "DI订单" : "非DI订单" }}</span>
      </template>
      <template slot="deliveryPlanCode" slot-scope="scope">
        <copy-text hoverToShow>
          <a @click="goDetail(scope.row)">{{ scope.row.deliveryPlanCode }}</a>
        </copy-text>
      </template>
      <template slot="documentStatus" slot-scope="scope">
        <span>{{ getLabel(shippingPlanList, scope.row.documentStatus) }}</span>
      </template>
      <template slot="warehouseId" slot-scope="scope">
        <span>{{ getLabel(selectOptionData.warehouseOptions, scope.row.warehouseId) }}</span>
      </template>
      <template slot="createTime" slot-scope="scope">
        <span>{{ scope.row.createUserName }}</span>
        <br v-if="scope.row.createUserName" />
        <span>{{ scope.row.createTime }}</span>
      </template>
      <template slot="opeSolt" slot-scope="scope">
        <div>
          <a
            class="operator-button"
            v-if="
              (scope.row.documentStatus == 3 && permissions.purchase_container_genrate_delivery) ||
              (scope.row.documentStatus == 7 && permissions.purchase_container_genrate_delivery)
            "
            @click="generateDeliveryNote(scope.row)"
            >生成送货单</a
          >

          <a
            class="operator-button"
            v-if="
              scope.row.purchaseOrderAttribute !== 'DI' &&
              scope.row.documentStatus == 5 &&
              permissions.purchase_container_genrate_transfer
            "
            @click="handleTransfer(scope.row)"
            >生成调拨单</a
          >
          <a
            class="operator-button"
            v-if="
              scope.row.purchaseOrderAttribute == 'DI' &&
              scope.row.documentStatus == 4 &&
              permissions.purchase_container_genrate_pruchase_plan
            "
            @click="handleGeneratePurchasePlan(scope.row)"
            >生成采购计划</a
          >
          <a
            class="operator-button"
            v-if="scope.row.purchaseOrderAttribute == 'DI' && permissions.purchase_container_relate_pruchase_plan"
            @click="handleLinkExistingPurchasePlans(scope.row)"
            >关联已有采购计划</a
          >
          <!-- <a
            class="operator-button"
            v-if="permissions.purchase_container_relate_notification && scope.row.documentStatus !== 8"
            @click="handleLinkShipmentNotification(scope.row)"
            >关联出货通知单</a
          > -->
          <a
            class="operator-button"
            v-if="permissions.purchase_container_invalid && scope.row.documentStatus !== 8"
            @click="handleAbort(scope.row)"
            >作废</a
          >
        </div>
      </template>
    </avue-crud>
    <PurchaseDialog ref="purchasePlan" @success="getList"> </PurchaseDialog>
    <ShipmentNotificationDialog ref="ShipmentNotification" @success="getList"></ShipmentNotificationDialog>

    <el-dialog title="生成调拨单" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div class="transfer-content">
        <el-form ref="transferBusinessTypeForm" :rules="rules" :model="transferForm">
          <el-form-item label-width="100px" label="业务类型" prop="transferBusinessType">
            <el-select
              v-model="transferForm.transferBusinessType"
              class="custom-select"
              size="mini"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in transferBusinessTypeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmJumpTransfer">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { allTableOption, allcolumn } from "./index.js"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import PurchaseDialog from "./dialogComponents/purchaseDialog.vue"
import ShipmentNotificationDialog from "./dialogComponents/shipmentNotificationDialog.vue"
import { getSit } from "@/api/order/orderManage"
import { getAlreadyList, abandon, submitAudit, reverseApproval } from "@/api/purchase/containerLoadingPlan/index.js"
import { setFiltering, setOrderBy } from "@/util/auth"
import { getObjByType } from "@/api/admin/dict.js"
import { listPage } from "@/api/logistics/boxCarManage/index.js"

export default {
  name: "allList",
  components: { PurchaseDialog, ShipmentNotificationDialog },
  props: {
    selectOptionData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      props: { multiple: false },
      //搜索条件，和前端控件绑定
      searchForm: {
        deliveryPlanCode: "",
        containerType: "",
        departurePort: "",
        destinationPort: "",
        purchaseOrderAttribute: "",
        documentStatus: "",
        poOrderNo: "",
        skuCode: "",
        warehouseId: "",
        platform: [],
        site: [],
        corporationId: "",
        supplierNo: "",
        urgentFlag: "",
        expectedLoadingDate: "",
        loadRate: []
      },
      operatorParams: {
        factoryEstimatedDeliveryDate: "BETWEEN",
        loadRate: "BETWEEN",
        urgentFlag: "IN",
        supplierNo: "EQUAL",
        purchaseOrganizationCode: "EQUAL"
      },
      orderTypeOption: [
        {
          value: "purchaseOrderNo",
          label: "采购单号"
        },
        {
          value: "platformOrderCode",
          label: "平台订单号"
        },
        {
          value: "shippingContainerNo",
          label: "出货柜号"
        },
        {
          value: "deliveryNo",
          label: "供应商送货单号"
        },
        {
          value: "transferNo",
          label: "头程调拨单号"
        }
      ],
      orderKey: "",
      orderValue: "", // 绑定多单号的值
      statusArray: [],
      currencyArray: [],
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      allcolumn: allcolumn,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },

      tableOption: allTableOption,
      activeName: "first",
      purchaseDialogVisible: false,
      purchaseForm: {},
      marketOption: [],
      dialogVisible: false,
      transferBusinessTypeArr: [],
      shippingPlanList: [],
      transferForm: {
        transferBusinessType: "",
        shipmentPlanCode: ""
      },
      rules: {
        transferBusinessType: [{ required: true, message: "请选择业务类型", trigger: "change" }]
      },
      orderBy: [
        {
          field: "updateTime",
          order: "desc"
        }
      ],
      boxCarTypeList: [],
      selectList: []
    }
  },
  created() {
    getObjByType("transfer_business_type").then((res) => {
      if (res.data.code === 0) {
        this.transferBusinessTypeArr = res.data.data
      }
    })
    getObjByType("po_shipping_plan_status").then((res) => {
      if (res.data.code === 0) {
        this.shippingPlanList = res.data.data
      }
    })
    this.getBoxCarList()
  },
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
    orderKey(val, oldVal) {
      this.searchForm[oldVal] = ""
    }
  },
  methods: {
    orderValueChange(val) {
      if (this.orderKey) {
        this.searchForm[this.orderKey] = this.orderValue
      }
    },
    orderKeyChange(val) {
      this.orderValue = ""
    },
    getBoxCarList() {
      listPage({
        page: 1,
        pageSize: 9999,
        filtering: [
          {
            field: "disabled",
            operator: "IN",
            value: [0]
          }
        ]
      }).then((res) => {
        if (res.data.code === 0) {
          this.boxCarTypeList = res.data.data.records.filter(
            (record, index, self) => self.findIndex((r) => r.code === record.code) === index
          )
        }
      })
    },

    handleAudit(command) {
      if (this.selectList.length === 0) {
        this.$message.warning("请选择数据！")
        return
      }
      const deliveryPlanCodes = this.selectList.map((item) => item.deliveryPlanCode)
      let action = command === "提交审核" ? submitAudit : reverseApproval
      const statusList = this.selectList.map((item) => Number(item.documentStatus))
      if (command === "提交审核") {
        if (!statusList.every((status) => [0, 2].includes(status))) {
          return this.$message.warning("只允许状态是待审核、审核不通过的状态提审")
        }
      } else if (!statusList.every((status) => status === 1)) {
        return this.$message.warning("选中数据中有单据状态不是审核中的")
      }
      action(deliveryPlanCodes).then((res) => {
        if (res.data.code === 0) {
          this.$message.success(`${command}成功`)
          this.getList()
          this.selectList = []
          this.$refs.crud.selectClear()
        }
      })
    },
    platformChange(val) {
      this.searchForm.site = []
      this.getPlatformSit(val)
    },
    handleLinkShipmentNotification(row) {
      this.$refs.ShipmentNotification?.openDialog(row)
    },
    handleAbort(row) {
      this.$confirm("确定要作废吗?", "作废", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "el-button--danger",
        type: "error"
      })
        .then(() => {
          abandon(row.deliveryPlanCode).then((res) => {
            if (res.data.code === 0) {
              this.$message.success("作废成功")
              this.getList()
            }
          })
        })
        .catch(() => {
          console.log("用户点击了取消按钮") // 在这里处理用户点击取消的情况
        })
    },

    handleGeneratePurchasePlan(row) {
      this.$router.push({
        path: "/purchase/procurementPlan/create",
        query: {
          type: "container",
          deliveryPlanCode: row.deliveryPlanCode
        }
      })
    },
    handleLinkExistingPurchasePlans(row) {
      this.$refs.purchasePlan?.openDialog(row)
    },
    goDetail(row) {
      console.log("row", row)
      this.$router.push({
        path: "/purchase/containerLoadingPlan/details",
        query: {
          deliveryPlanCode: row.deliveryPlanCode,
          type: row.purchaseOrderAttribute,
          id: row.id
        }
      })
    },

    selectionChange(list) {
      this.selectList = list
    },

    getList(opt) {
      const postData = deepClone({
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        ...opt,

        orderBy: setOrderBy(null, this.orderBy),
        filtering: setFiltering(
          {
            ...this.searchForm
          },
          this.operatorParams
        )
      })

      getAlreadyList(postData).then((response) => {
        this.tableData = response.data.data.records.map((item) => {
          return {
            ...item,
            urgentFlag: item.urgentFlag == 1 ? "是" : "否",
            loadRateStr: item.loadRate + "%"
          }
        })
        this.page.total = response.data.data.total
      })
    },

    /**
     * 刷新回调
     */
    refreshChange() {
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList()
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      this.getList()
    },
    searchReset() {
      this.orderKey = ""
      this.orderValue = ""
      this.searchForm.loadRate = []

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
    //根据平台查询站点
    getPlatformSit(param) {
      getSit(param).then((res) => {
        this.marketOption = this.sortArray(res.data, "sitName")
      })
    },
    // 排序
    sortArray(arr, field) {
      return arr.sort((a, b) => {
        const nameA = a[field].toUpperCase() // 忽略大小写
        const nameB = b[field].toUpperCase() // 忽略大小写
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
    },
    generateDeliveryNote(row) {
      console.log("生成送货单 ", row)
      const { deliveryPlanCode } = row
      this.$router.push({
        path: "/purchase/poorder/generateDeliveryNote/index",
        query: {
          from: "containerLoadingPlan",
          deliveryPlanCode: deliveryPlanCode
        }
      })
    },
    handleTransfer(row) {
      this.dialogVisible = true
      const { shipmentPlanCode, deliveryPlanCode } = row
      this.transferForm.shipmentPlanCode = shipmentPlanCode
      this.transferForm.deliveryPlanCode = deliveryPlanCode
      this.transferForm.transferBusinessType = ""

      // this.dialogVisible = false

      // this.$router.push({
      //   path: "/transfer/fristMileTransfer/add",
      //   query: {
      //     from: "containerGenerate",
      //     shipmentPlanCode,
      //     type: "add"
      //   }
      // })
      // 不要弹窗了 直接跳转 因为在调拨单页面他必须要填写调入组织才能带出数据 所以调整页面带基础数据就习惯了
    },
    async confirmJumpTransfer() {
      await this.$refs.transferBusinessTypeForm.validate()

      this.dialogVisible = false

      const { transferBusinessType, shipmentPlanCode, deliveryPlanCode } = this.transferForm
      this.$router.push({
        path: "/transfer/fristMileTransfer/add",
        query: {
          from: "containerGenerate",
          transferBusinessType,
          deliveryPlanCode,
          type: "add"
        }
      })
    },
    getLabel(data = [], value) {
      return data.find((item) => item.value == value)?.label || ""
    }
  }
}
</script>

<style lang="scss" scoped>
.operator-button {
  display: block;
}
</style>
<style lang="scss">
.transfer-content {
  padding: 20px;
  .el-form-item__content {
    margin-left: 0px !important;
  }
}
.search-select .el-input {
  width: 120px;
}
</style>
