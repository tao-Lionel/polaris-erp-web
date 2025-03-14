<template>
  <div class="execution" id="afterOrderManage">
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
          <el-button type="primary" size="small" @click="handleAdd">新增退货退款工单</el-button>
          <el-button type="primary" size="small" @click="handleAddGift">新增重发/赠品工单</el-button>
          <el-button type="primary" @click="handleExport()" size="small">导出</el-button>
        </template>

        <template slot-scope="scope" slot="search">
          <el-form :model="searchForm" :inline="true" ref="searchForm">
            <el-form-item prop="workOrderCode">
              <avue-crud-input
                v-model="searchForm.workOrderCode"
                size="small"
                placeholder="工单编号，支持多个"
                clearable
                v-search-input
              ></avue-crud-input>
            </el-form-item>
            <el-form-item prop="workOrderType">
              <el-select
                v-model="searchForm.workOrderType"
                size="small"
                clearable
                filterable
                multiple
                placeholder="工单类型,支持多选"
                @change="workOrderTypeChange"
              >
                <el-option v-for="item in allWorkOrderTypeList" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="workOrderStatus">
              <el-select
                v-model="searchForm.workOrderStatus"
                size="small"
                clearable
                filterable
                multiple
                placeholder="工单状态,支持多选"
                @change="workOrderStatusChange"
              >
                <el-option v-for="item in allWorkOrderStatusList" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="refundStatus">
              <el-select
                v-model="searchForm.refundStatus"
                size="small"
                clearable
                placeholder="退款单状态"
                @change="refundStatusChange"
              >
                <el-option v-for="(item, index) in refundStatusList" :key="index" :label="item.value" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="returnStatus">
              <el-select
                v-model="searchForm.returnStatus"
                size="small"
                clearable
                placeholder="退货单状态"
                @change="returnStatusChange"
              >
                <el-option v-for="item in returnStatusList" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="deliveryStatus">
              <el-select
                v-model="searchForm.deliveryStatus"
                size="small"
                clearable
                placeholder="重发单创建状态"
                @change="deliveryStatusChange"
              >
                <el-option
                  v-for="item in allFulfillmentStatusList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="reasonArr" class="exclude-label">
              <el-cascader
                v-model="searchForm.reasonArr"
                :options="allReasonList"
                :props="{
                  value: 'id',
                  label: 'displayText'
                }"
                clearable
                size="small"
                placeholder="售后原因"
                @change="reasonChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item prop="shop">
              <el-select
                v-model="searchForm.shop"
                size="small"
                clearable
                filterable
                multiple
                placeholder="店铺，支持多选"
                @change="shopeChange"
              >
                <el-option
                  v-for="item in allStore"
                  :key="item.storeId"
                  :label="item.storeAccount"
                  :value="item.storeId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="soOrderCode">
              <avue-crud-input
                v-model="searchForm.soOrderCode"
                size="small"
                placeholder="订单号，支持多个"
                v-search-input
              ></avue-crud-input>
            </el-form-item>
            <el-form-item prop="sourceCode">
              <avue-crud-input
                v-model="searchForm.sourceCode"
                size="small"
                placeholder="平台订单号，支持多个"
                v-search-input
              ></avue-crud-input>
            </el-form-item>
            <el-form-item prop="platformOrderCode">
              <avue-crud-input
                v-model="searchForm.platformOrderCode"
                size="small"
                placeholder="平台订单编码，支持多个"
                v-search-input
              ></avue-crud-input>
            </el-form-item>
            <el-form-item prop="createName">
              <avue-crud-input
                v-model="searchForm.createName"
                size="small"
                placeholder="创建人"
                v-search-input
              ></avue-crud-input>
            </el-form-item>
            <el-form-item prop="updateName">
              <avue-crud-input
                v-model="searchForm.updateName"
                size="small"
                placeholder="更新人"
                v-search-input
              ></avue-crud-input>
            </el-form-item>
          </el-form>
        </template>

        <template slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="sku">
              <avue-crud-input
                v-model="searchForm.sku"
                size="small"
                placeholder="SKU,支持多个"
                v-search-input
              ></avue-crud-input>
            </el-form-item>
            <el-form-item prop="createTimeArr">
              <el-date-picker
                v-model="searchForm.createTimeArr"
                @change="createTimeChange"
                type="daterange"
                size="small"
                start-placeholder="创建开始日期"
                end-placeholder="创建结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="updateTimeArr">
              <el-date-picker
                v-model="searchForm.updateTimeArr"
                @change="updateTimeChange"
                type="daterange"
                size="small"
                start-placeholder="更新开始日期"
                end-placeholder="更新结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </template>

        <template slot-scope="scope" slot="totalRefundAmount">
          {{ scope.row.totalRefundAmount }}{{ scope.row.totalRefundCurrency }}
        </template>
        <template slot-scope="scope" slot="workOrderCode">
          <copy-text hoverToShow>
            <a @click="toDetail(scope.row.workOrderCode)">{{ scope.row.workOrderCode }}</a>
          </copy-text>
        </template>
        <template slot-scope="scope" slot="relationStatus">
          {{ scope.row.refundStatusName }}
          <br v-if="scope.row.refundStatusName" />
          {{ scope.row.returnStatusName }}
        </template>

        <template slot-scope="scope" slot="skuReturnQuantity">
          <p v-for="(item, index) in scope.row.omsAfterSaleWorkDetailResultVo" :key="index">
            {{ item.sku }}
            <a class="brandSolt_ope" v-if="item.returnQuantity > 0">*{{ item.returnQuantity }}</a>
            {{ item.skuName }}
          </p>
        </template>

        <template slot-scope="scope" slot="totalRefundAmount">
          {{ scope.row.totalRefundAmount }} {{ scope.row.totalRefundCurrency }}
        </template>

        <template slot-scope="scope" slot="soOrderCodeNew">
          {{ scope.row.soOrderCodeNew }} / {{ scope.row.newOrderFulfillmentStatusName }}
        </template>
        <template slot-scope="scope" slot="createTime">
          {{ scope.row.createName }} / {{ scope.row.createTime }}
        </template>
        <template slot-scope="scope" slot="updateTime">
          {{ scope.row.updateName }} / {{ scope.row.updateTime }}
        </template>

        <template slot-scope="scope" slot="opeSolt">
          <a class="brandSolt_ope" @click="handleRefund(scope.row)">跟进退款</a>
          <a class="brandSolt_ope" @click="handleLogisticsNumber(scope.row)">填写物流单号</a>
          <a class="brandSolt_ope" @click="handleReturn(scope.row)">跟进退货</a>
          <el-dropdown trigger="click" @command="moreOperation($event, scope.row)">
            <a class="brandSolt_ope">更多操作</a>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{ title: 'invalid', row: scope.row }">作废</el-dropdown-item>
              <el-dropdown-item :command="{ title: 'addRemark', row: scope.row }">新增备注</el-dropdown-item>
              <el-dropdown-item
                v-if="scope.row.workOrderType == 'RESEND' && scope.row.workOrderStatus == 'HANDLING'"
                :command="{ title: 'addNewOrder', row: scope.row }"
                >创建新订单</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </avue-crud>

      <addDialog v-model="addOrUpdateDialog" @success="getList"></addDialog>
      <addRemarkDialog v-model="addRemarkVisible" @success="getList" :workOrderCode="workOrderCode"></addRemarkDialog>
      <invalidDialog v-model="invalidVisible" :workOrderCode="workOrderCode" @success="getList"></invalidDialog>
      <followRefundDialog
        v-model="followRefundVisible"
        :workOrderCode="workOrderCode"
        @success="getList"
      ></followRefundDialog>
      <followReturnDialog v-model="followReturnVisible" :workOrderCode="workOrderCode" @success="getList">
      </followReturnDialog>
      <logisticsNumberDialog
        v-model="logisticsNumberVisible"
        :logisticsWorkOrderCode="workOrderCode"
        @success="getList"
      ></logisticsNumberDialog>
    </basic-container>
  </div>
</template>

<script>
import { tableOption } from "./index"
import addDialog from "./addDialog.vue"
import addRemarkDialog from "./addRemarkDialog.vue"
import invalidDialog from "./invalidDialog.vue"
import followRefundDialog from "./followRefundDialog.vue"
import followReturnDialog from "./followReturnDialog.vue"
import logisticsNumberDialog from "./logisticsNumberDialog.vue"
import {
  getAfterOrderList,
  listAllWorkOrderStatus,
  listAllWorkOrderType,
  getListAllReason,
  listAllFulfillmentStatus,
  listAllReturnStatus,
  listAllRefundStatus,
  exportData
} from "@/api/order/afterOrderManage"
import { getStore } from "@/api/order/orderManage"
import { downloadBlob } from "@/util/auth"

export default {
  name: "afterOrderManage",
  components: {
    addDialog,
    addRemarkDialog,
    invalidDialog,
    followRefundDialog,
    followReturnDialog,
    logisticsNumberDialog
  },
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        workOrderCode: "",
        workOrderType: [],
        workOrderStatus: [],
        reason: "",
        reasonArr: [],
        soOrderCode: "",
        sourceCode: "",
        platformOrderCode: "",
        shop: [],
        shopAccount: "",
        createName: "",
        updateName: "",
        createBeginTime: "",
        createEndTime: "",
        updateBeginTime: "",
        updateEndTime: "",
        createTimeArr: [], // 用于绑定
        updateTimeArr: [], // 用于绑定
        sku: "",
        returnStatus: "",
        refundStatus: "",
        deliveryStatus: "",
        workOrderStatus: [],
        workOrderTypeName: [],
        workOrderStatusName: [],
        refundStatusName: "",
        deliveryStatusName: "",
        shopAccount: [],
        reasonName: ""
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
      addOrUpdateDialog: false,
      addOrUpdateForm: {
        isAdd: true,
        currency: null,
        currencyName: null,
        exchangeRate: null,
        averageExchangeRate: null
      },
      addOrUpdateDisabled: false,
      auditTitle: "审核",
      auditDialog: false,
      auditTextarea: null,
      exchangeRate: "正在加载...",

      addRemarkVisible: false,
      invalidVisible: false,
      followRefundVisible: false,
      followReturnVisible: false,
      logisticsNumberVisible: false,
      allWorkOrderStatusList: [],
      allWorkOrderTypeList: [],
      allReasonList: [],
      allStore: [],
      workOrderCode: "",
      allFulfillmentStatusList: [],
      returnStatusList: [],
      refundStatusList: []
    }
  },

  created() {
    this.init()
  },
  mounted() {},
  methods: {
    init() {
      this.getList()
      this.getWorkOrderStatus()
      this.getWorkOrderType()
      this.getListAllReason()
      this.getAllStore()
      this.listAllFulfillmentStatus()
      this.listAllReturnStatus()
      this.listAllRefundStatus()
    },
    async getList() {
      const postData = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        ...this.searchForm
      }
      postData.createTime = postData.createTimeArr.join(",")
      postData.updateTime = postData.updateTimeArr.join(",")
      delete postData.createTimeArr
      delete postData.updateTimeArr
      if (postData.reasonArr.length) {
        postData.reason = [postData.reasonArr[postData.reasonArr.length - 1]]
      }
      !postData.reason && delete postData.reason
      delete postData.reasonArr
      !postData.shop.length && delete postData.shop
      !postData.workOrderStatus.length && delete postData.workOrderStatus
      !postData.workOrderType.length && delete postData.workOrderType
      !postData.shopAccount.length && delete postData.shopAccount
      !postData.workOrderTypeName.length && delete postData.workOrderTypeName
      !postData.workOrderStatusName.length && delete postData.workOrderStatusName

      if (postData.deliveryStatus == "") delete postData.deliveryStatus
      if (postData.refundStatus == "") delete postData.refundStatus
      if (postData.returnStatus == "") delete postData.returnStatus

      const { data } = await getAfterOrderList(postData)
      console.log(data)
      if (data.code === 0) {
        this.tableData = data.data.records
        this.page.total = data.data.total
        this.page.currentPage = data.data.page
        this.page.pageSize = data.data.size
      }
    },
    async getWorkOrderStatus() {
      const { data } = await listAllWorkOrderStatus()
      if (data.code !== 0) return
      this.allWorkOrderStatusList = data.data
    },
    async getWorkOrderType() {
      const { data } = await listAllWorkOrderType()
      if (data.code !== 0) return
      this.allWorkOrderTypeList = data.data
    },
    async getListAllReason() {
      const { data } = await getListAllReason()
      if (data.code === 0) {
        this.allReasonList = this.removeEmptyChildren(data.data)
      }
    },
    async getAllStore() {
      const { data } = await getStore([])
      this.allStore = data
    },
    async listAllFulfillmentStatus() {
      const { data } = await listAllFulfillmentStatus()
      this.allFulfillmentStatusList = data.data
    },
    async listAllReturnStatus() {
      const { data } = await listAllReturnStatus()
      this.returnStatusList = data.data
    },
    async listAllRefundStatus() {
      const { data } = await listAllRefundStatus()
      this.refundStatusList = data.data
    },
    removeEmptyChildren(data) {
      if (!Array.isArray(data)) {
        throw new Error("Input data must be an array.")
      }

      return data.map((item) => {
        if (item.children && item.children.length === 0) {
          const { children, ...rest } = item
          return rest
        } else if (item.children && item.children.length > 0) {
          const children = this.removeEmptyChildren(item.children)
          return { ...item, children }
        } else {
          return item
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
    searchChange(params, page) {
      this.page.currentPage = 1
      this.getList()
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      this.searchForm.createTimeArr = []
      this.searchForm.updateTimeArr = []
      this.searchForm.createBeginTime = ""
      this.searchForm.createEndTime = ""
      this.searchForm.updateBeginTime = ""
      this.searchForm.updateEndTime = ""
      this.searchForm.deliveryStatusName = ""
      this.searchForm.reasonName = ""
      this.searchForm.refundStatusName = ""
      this.searchForm.returnStatusName = ""
      this.searchForm.shopAccount = []
      this.searchForm.workOrderStatusName = []
      this.searchForm.workOrderTypeName = []

      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getList()
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
      console.log(this.selectRows)
    },
    clearSelectClear() {
      // this.$refs.crud.selectClear();
      this.$refs.crud.toggleSelection()
    },
    /** 打开新增窗口**/
    handleAdd() {
      console.log("新增")
      this.addOrUpdateDialog = true
    },
    handleAddGift() {
      this.$router.push({
        path: "/order/afterOrderManage/addGiftWorkOrder"
      })
    },
    handleClose() {
      // this.addOrUpdateDialog = false;
    },
    handleEdit(row) {
      // if (!this.selectRows || this.selectRows.length == 0) {
      //   this.$message.warning('请选择数据')
      //   return
      // }
      // if (this.selectRows.length != 1) {
      //   this.$message.warning('请选择一条数据进行修改')
      //   return
      // }
      console.log(row)
    },
    submitForm(formName) {
      // var _this = this;
    },

    formReset() {
      //方法2
      this.$nextTick(function () {
        this.$refs["addOrUpdateForm"].resetFields()
        this.addOrUpdateForm = {
          isAdd: true,
          currency: null,
          currencyName: null,
          exchangeRate: null,
          averageExchangeRate: null
        }
      })
    },
    getPSkuByApproveStatusOk() {
      let currency = []
      var data = this.selectRows.filter((obj) => {
        if (obj.approveStatus == 2) {
          currency.push(obj.currency)
          return obj
        }
      })
      return currency
    },

    /**导出 */
    async handleExport() {
      console.log("导出")
      const filteredForm = this.removeByCode(
        this.filterSearchForm({
          ...this.searchForm,
          createTime: this.searchForm.createTimeArr ? this.searchForm.createTimeArr.join(",") : "",
          updateTime: this.searchForm.updateTimeArr ? this.searchForm.updateTimeArr.join(",") : "",
          shopAccount: this.searchForm.shopAccount.join(","),
          workOrderStatusName: this.searchForm.workOrderStatusName.join(","),
          workOrderTypeName: this.searchForm.workOrderTypeName.join(",")
        }),
        [
          "workOrderType",
          "workOrderStatus",
          "refundStatus",
          "shop",
          "createBeginTime",
          "reasonArr",
          "createEndTime",
          "updateBeginTime",
          "updateEndTime",
          "createTimeArr",
          "updateTimeArr",
          "returnStatus",
          "returnStatus",
          "deliveryStatus"
        ]
      )
      const res = await exportData({
        id: 2,
        param: filteredForm
      })

      downloadBlob(
        res.data,
        "导出数据.xls",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
      )
    },
    removeByCode(dataArray, codeArray) {
      return dataArray.filter((item) => !codeArray.includes(item.code))
    },
    filterSearchForm(searchForm) {
      const filteredArray = []

      for (const key in searchForm) {
        if (searchForm.hasOwnProperty(key)) {
          const value = searchForm[key]

          if (
            (Array.isArray(value) && value.length > 0) || // 数组不为空
            (typeof value === "string" && value.trim() !== "") || // 字符串不为空
            (!Array.isArray(value) && value !== null && value !== undefined && value !== "") // 非数组且非空值
          ) {
            // 添加有值的属性到结果数组中
            filteredArray.push({ code: key, value: value })
          }
        }
      }

      return filteredArray
    },
    handleRefund(row) {
      this.followRefundVisible = true
      this.workOrderCode = row.workOrderCode
    },
    handleReturn(row) {
      this.followReturnVisible = true
      this.workOrderCode = row.workOrderCode
    },
    handleLogisticsNumber(row) {
      console.log("row.workOrderCode", row.workOrderCode)
      this.logisticsNumberVisible = true
      this.workOrderCode = row.workOrderCode
    },
    moreOperation(obj, row) {
      this.workOrderCode = row.workOrderCode
      switch (obj.title) {
        case "invalid":
          this.invalidVisible = true
          break
        case "addRemark":
          this.addRemarkVisible = true
          break
        case "addNewOrder":
          this.$router.push({
            path: "/order/afterOrderManage/resendWorkOrder",
            query: {
              workOrderCode: row.workOrderCode,
              type: "RESEND",
              soOrderId: row.soOrderId
            }
          })
          break
      }
    },
    toDetail(id) {
      this.$router.push({
        path: "/order/afterOrderManage/afterOrderDetail",
        query: { id: id }
      })
    },
    createTimeChange(val) {
      console.log("val2323123", val)
      if (val) {
        this.searchForm.createBeginTime = val[0]
        this.searchForm.createEndTime = val[1]
      } else {
        this.searchForm.createBeginTime = ""
        this.searchForm.createEndTime = ""
      }
    },
    updateTimeChange(val) {
      if (val) {
        this.searchForm.updateBeginTime = val[0]
        this.searchForm.updateEndTime = val[1]
      } else {
        this.searchForm.updateBeginTime = ""
        this.searchForm.updateEndTime = ""
      }
    },
    workOrderTypeChange(val) {
      if (val) {
        let arr = []
        val.forEach((item) => {
          const fArr = this.allWorkOrderTypeList.filter((it) => it.key == item)
          arr = [...arr, ...fArr]
        })
        this.searchForm.workOrderTypeName = arr.map((item) => item.value)
      } else {
      }
    },
    workOrderStatusChange(val) {
      if (val) {
        let arr = []
        val.forEach((item) => {
          const fArr = this.allWorkOrderStatusList.filter((it) => it.key == item)
          arr = [...arr, ...fArr]
        })
        this.searchForm.workOrderStatusName = arr.map((item) => item.value)
      } else {
        this.searchForm.workOrderStatusName = ""
      }
    },
    refundStatusChange(val) {
      if (val) {
        const fItem = this.refundStatusList.find((item) => item.key == val)
        this.searchForm.refundStatusName = fItem.value
      } else {
        this.searchForm.refundStatusName = ""
      }
    },
    returnStatusChange(val) {
      if (val) {
        const fItem = this.returnStatusList.find((item) => item.key == val)
        this.searchForm.returnStatusName = fItem.value
      } else {
        this.searchForm.returnStatusName = ""
      }
    },
    deliveryStatusChange(val) {
      if (val) {
        const fItem = this.allFulfillmentStatusList.find((item) => item.key == val)
        this.searchForm.deliveryStatusName = fItem.value
      } else {
        this.searchForm.deliveryStatusName = ""
      }
    },
    shopeChange(val) {
      let arr = []
      val.forEach((item) => {
        const fArr = this.allStore.filter((it) => it.storeId == item)
        arr = [...arr, ...fArr]
      })
      this.searchForm.shopAccount = arr.map((item) => item.storeAccount)
    },
    reasonChange(val) {
      this.searchForm.reasonName = this.getDisplayTexts(this.allReasonList, val)
    },
    getDisplayTexts(data, selectedIds) {
      let result = []
      function traverse(node) {
        if (selectedIds.includes(node.id)) {
          result.push(node.displayText)
        }
        if (node.children && node.children.length > 0) {
          node.children.forEach((child) => traverse(child))
        }
      }

      data.forEach((node) => traverse(node))
      return result.join("-")
    }
  }
}
</script>

<style lang="scss" scoped>
#afterOrderManage {
  .el-textarea__inner {
    height: 90px;
  }

  .mydialog-add .el-form-item__label {
    width: 124px;
  }

  .brandSolt_ope {
    margin-right: 10px;
    text-decoration: none !important;
  }
}
</style>
