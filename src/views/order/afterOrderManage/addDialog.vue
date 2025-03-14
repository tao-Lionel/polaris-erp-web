<template>
  <div>
    <div>
      <el-dialog
        class="mydialog-add"
        title="新增"
        :visible="value"
        width="70%"
        @open="handleOpen"
        @close="handleClose"
        @closed="formReset"
      >
        <el-form ref="addOrUpdateForm" :model="addWorkOrderData" :rules="addOrUpdateRules" status-icon>
          <div class="iod-target-top border-rang y-prd-info">
            <p class="iod-target target-title">工单信息</p>

            <div style="padding: 20px" class="flex4">
              <el-form-item class="f4-item" label="工单类型" prop="workOrderType">
                <el-select
                  size="small"
                  clearable
                  filterable
                  placeholder="请选择"
                  v-model="addWorkOrderData.workOrderType"
                  @change="workOrderTypeChange"
                >
                  <el-option v-for="item in workOrderTypeList" :key="item.key" :label="item.value" :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="f4-item" prop="reason" label="售后原因">
                <el-cascader
                  v-model="addWorkOrderData.reason"
                  :options="listAllReason"
                  :props="reasonProps"
                  clearable
                  @change="handleReasonChange"
                  size="small"
                ></el-cascader>
              </el-form-item>
              <el-form-item class="f4-item" label="投诉原文" prop="complainOriginalText">
                <el-input size="small" v-search-input-trim v-model="addWorkOrderData.complainOriginalText"></el-input>
              </el-form-item>
              <el-form-item class="f4-item" label="要点提取" prop="keyPointsExtractionText">
                <el-input
                  size="small"
                  v-search-input-trim
                  v-model="addWorkOrderData.keyPointsExtractionText"
                ></el-input>
              </el-form-item>
              <el-form-item class="f4-item" label="备注" prop="remark">
                <el-input
                  size="small"
                  type="textarea"
                  :rows="2"
                  v-search-input-trim
                  v-model="addWorkOrderData.remark"
                ></el-input>
              </el-form-item>
            </div>
          </div>

          <div class="iod-target-top border-rang y-prd-info" style="margin-top: 20px">
            <p class="iod-target target-title">原订单信息</p>
            <div style="padding: 20px" v-if="true">
              <div class="flex5" style="margin-bottom: 20px">
                <el-form-item
                  style="width: 250px; margin-bottom: 0; margin-right: 30px"
                  label="平台订单号"
                  prop="sourceCode"
                >
                  <el-input
                    size="small"
                    v-search-input-trim
                    v-model="addWorkOrderData.sourceCode"
                    clearable
                    @change="sourceCodeChange"
                  ></el-input>
                </el-form-item>
                <el-button type="primary" size="small" @click="handleCheck">查询订单</el-button>
                <!-- <el-button
                  type="primary"
                  size="small"
                  @click="handleAddProduct"
                  >手工添加商品</el-button
                > -->
              </div>
              <div class="flex5" style="margin-bottom: 20px">
                <el-form-item
                  style="width: 250px; margin-bottom: 0; margin-right: 30px"
                  prop="approveStatus"
                  label="订单号"
                >
                  <el-select
                    v-model="addWorkOrderData.orderCode"
                    size="small"
                    clearable
                    filterable
                    placeholder="请选择"
                    @change="orderChange"
                  >
                    <el-option
                      v-for="item in orderInfoList"
                      :key="item.orderCode"
                      :label="item.orderCode"
                      :value="item.orderCode"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item style="width: 250px; margin-bottom: 0; margin-right: 30px" prop="store" label="店铺">
                  <el-select
                    v-model="addWorkOrderData.store"
                    size="small"
                    placeholder="请选择"
                    clearable
                    @change="storeChange"
                  >
                    <!-- :disabled="checkedOrderItem.relationMsg" -->
                    <el-option
                      v-for="item in store"
                      :key="item.storeId"
                      :label="item.storeAccount"
                      :value="item.storeId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  style="width: 250px; margin-bottom: 0; margin-right: 30px"
                  prop="orderBusinessType"
                  label="交货模式"
                >
                  <el-select v-model="addWorkOrderData.orderBusinessType" size="small" placeholder="请选择" clearable>
                    <!-- :disabled="checkedOrderItem.relationMsg" -->
                    <el-option v-for="item in businessType" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>

              <p style="padding: 20px 0 0 20px; color: #d9001b" v-show="addWorkOrderData.sourceCode && relevanceOrder">
                该平台订单号{{ addWorkOrderData.sourceCode }},有以下关联工单:{{ relevanceOrder }}
              </p>
              <avue-crud
                ref="crud"
                :data="addWorkOrderData.cmdDetail"
                :option="addDetailOption"
                @current-change="currentChange"
                @selection-change="selectionChange"
              >
                <template slot-scope="scope" slot="returnQuantity">
                  <el-input-number
                    style="width: 150px"
                    :controls="false"
                    v-model="scope.row.returnQuantity"
                    :min="0"
                    :max="
                      addWorkOrderData.orderCode
                        ? scope.row.soOrderDetailQuantity - scope.row.applyReturnQuantity
                        : 'Infinity'
                    "
                    label="申请退货数量"
                    size="small"
                    :disabled="addWorkOrderData.workOrderType == 'REFUND'"
                    @change="returnQuantityChange($event, scope.row)"
                  ></el-input-number>
                </template>

                <template slot-scope="scope" slot="refundAmount">
                  <div class="select-box">
                    <el-input-number
                      :controls="false"
                      v-model.number="scope.row.refundAmount"
                      :min="0"
                      :max="addWorkOrderData.orderCode ? scope.row.amountHasTax : 'Infinity'"
                      label="退款金额"
                      size="small"
                      :disabled="addWorkOrderData.workOrderType == 'RESEND'"
                    ></el-input-number>

                    <el-select
                      slot="append"
                      placeholder="币种"
                      class="el-select--append"
                      v-model="scope.row.currencyHasTax"
                      style="width: 80px"
                      :disabled="addWorkOrderData.workOrderType == 'RESEND'"
                    >
                      <el-option
                        :label="item.currency"
                        :value="item.currency"
                        v-for="item in currencyArr"
                        :key="item.currency"
                      ></el-option>
                    </el-select>
                  </div>
                </template>
                <template slot="opeBtn" slot-scope="scope">
                  <el-button type="text" @click="deletePrd(scope.row)">删除</el-button>
                </template>
              </avue-crud>
            </div>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer" style="display: flex; justify-content: center">
          <el-button style="padding: 9px 30px" size="small" @click="handleClose">取 消</el-button>
          <el-button type="primary" size="small" style="padding: 9px 30px" @click="handleConfirm()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <manuallyAddDialog v-model="addProductVisible" @selectedProduct="selectedProduct"></manuallyAddDialog>
  </div>
</template>
<script>
import manuallyAddDialog from "./manuallyAddDialog.vue"
import { tableOption, addDetailOption, addOrUpdateRules } from "./index"
import {
  getOrderByCode,
  getAllWorkOrderType,
  getListAllReason,
  addWorkOrder,
  getObjByType,
  getStore,
  getCurrency,
  getSalesDetailById
} from "@/api/order/afterOrderManage.js"

export default {
  name: "addDialog",
  props: {
    value: {
      default: false,
      required: true,
      type: Boolean
    },

    form: {
      default: () => ""
    },
    id: {
      default: () => ""
    }
  },
  components: {
    manuallyAddDialog
  },
  data() {
    return {
      addProductVisible: false,
      searchForm: {
        platformCode: ""
      },
      // 选中订单号信息
      checkedOrderItem: {
        relationMsg: ""
      },
      //审核状态
      approveStatusOptions: [
        { value: 1, label: "待审核" },
        { value: 2, label: "已审核" }
      ],
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableOption: tableOption,
      addDetailOption: addDetailOption,
      addOrUpdateRules: addOrUpdateRules,
      orderInfoList: [],
      workOrderTypeList: [],
      listAllReason: [],
      reasonProps: {
        value: "id",
        label: "displayText"
      },
      addWorkOrderData: {
        workOrderType: "RETURN_AND_REFUND",
        reason: "",
        complainOriginalText: "",
        keyPointsExtractionText: "",
        remark: "",
        orderCode: "",
        sourceCode: "",
        store: "",
        storeAccount: "",
        freezeStatus: "",
        freezeStatusName: "",
        orderBusinessType: "",
        cmdDetail: [],
        platformOrderCode: "",
        orderId: "",
        totalAmountHasTaxCurrency: ""
      },
      relevanceOrder: "",
      selection: [],
      businessType: [],
      store: [],
      currencyArr: []
    }
  },
  mounted() {
    // 开发完 不需要执行
    this.init()
  },

  methods: {
    handleOpen() {
      console.log("打开")
      this.init()
      console.log("form", this.form, this.id)
      if (this.form == "ORDER_GIFT") {
        this.getSalesDetailById()
      }
    },
    init() {
      this.getAllWorkOrderType()
      this.getListAllReason()
      this.getObjByType()
      this.getStore()
      this.getCurrency()
    },
    handleClose() {
      // this.visible = false;
      this.$emit("input", false)
    },
    formReset() {
      //方法2
      this.$nextTick(function () {
        this.$refs["addOrUpdateForm"].resetFields()
        this.addWorkOrderData = {
          workOrderType: "",
          reason: "",
          complainOriginalText: "",
          keyPointsExtractionText: "",
          remark: "",
          orderCode: "",
          sourceCode: "",
          store: "",
          storeAccount: "",
          freezeStatus: "",
          freezeStatusName: "",
          orderBusinessType: "",
          cmdDetail: [],
          platformOrderCode: "",
          orderId: ""
        }
        this.relevanceOrder = ""
        this.orderInfoList = []
        this.selection = []
        this.$refs.crud.selectClear()
        this.page.total = 0
      })

      this.$emit("input", false)
    },
    async getSalesDetailById() {
      const { data } = await getSalesDetailById({
        orderId: this.id
      })
      console.log("data=====>", data.data)
      this.addWorkOrderData.sourceCode = data.data.sourceCode
      this.addWorkOrderData.store = data.data.shop
      this.addWorkOrderData.orderBusinessType = data.data.orderBusinessType
      this.getOrderByCode()
    },
    async handleAddProduct() {
      this.addProductVisible = true
    },

    getList() {},
    getStore() {
      getStore([]).then((res) => {
        if (res.status === 200) {
          this.store = res.data.filter((item) => item.state === "0")
        }
      })
    },
    getCurrency() {
      const params = {
        size: -1,
        current: -1
      }
      getCurrency(params).then((res) => {
        if (res.data.code === 0) {
          this.currencyArr = res.data.data.records
        }
      })
    },
    currentChange(val) {},
    searchChange() {
      this.getList()
    },
    searchReset() {
      this.addOrderSearchForm = {}
    },
    sourceCodeChange() {
      this.orderInfoList = []
      this.addWorkOrderData.orderCode = ""
      this.addWorkOrderData.store = ""
      this.addWorkOrderData.storeAccount = ""
      this.addWorkOrderData.orderBusinessType = ""
      this.addWorkOrderData.orderId = ""
      this.addWorkOrderData.platformOrderCode = ""
      this.checkedOrderItem = {}
      this.addWorkOrderData.cmdDetail = []
      this.page.total = 0
      this.$refs.crud.selectClear()
    },
    storeChange(val) {
      const fItem = this.store.find((item) => item.storeId == val)
      this.addWorkOrderData.storeAccount = fItem.storeAccount
    },
    getObjByType() {
      getObjByType("order_business_type").then((res) => {
        if (res.data.code === 0) {
          this.businessType = res.data.data
        }
      })
    },
    handleCheck() {
      this.selection = []
      this.$refs.crud.selectClear()
      this.checkedOrderItem = {}
      this.addWorkOrderData.orderCode = ""
      this.addWorkOrderData.store = ""
      this.addWorkOrderData.storeAccount = ""
      this.addWorkOrderData.orderBusinessType = ""
      this.addWorkOrderData.cmdDetail = []
      this.getOrderByCode()
    },
    // 获取订单详情
    async getOrderByCode() {
      if (this.addWorkOrderData.sourceCode == "") {
        this.$message({
          message: "平台订单号不能为空！",
          type: "warning"
        })
        return
      }
      const { data } = await getOrderByCode({
        sourceCode: this.addWorkOrderData.sourceCode
      })
      console.log(data.data)
      this.orderInfoList = data.data

      //  查出只有一个SO，就默认选上了 不用用户自己再选
      if (this.orderInfoList.length === 1) {
        this.addWorkOrderData.orderCode = this.orderInfoList[0].orderCode
        this.orderChange(this.orderInfoList[0].orderCode)
      }
      if (this.form == "ORDER_GIFT") {
        if (this.orderInfoList.length > 0) this.addWorkOrderData.orderCode = this.orderInfoList[0].orderCode
        this.addWorkOrderData.cmdDetail = this.orderInfoList[0].soOrderDetailInfoVoDetails.map((item) => {
          return {
            ...item,
            currencyHasTax: this.orderInfoList[0].totalAmountHasTaxCurrency
          }
        })
        // this.orderInfoList[0].soOrderDetailInfoVoDetails;
        this.addWorkOrderData.totalAmountHasTaxCurrency = this.orderInfoList[0].totalAmountHasTaxCurrency
      }
    },
    orderChange(val) {
      console.log(val)
      if (!val) {
        this.relevanceOrder = ""
        this.addWorkOrderData.store = ""
        this.addWorkOrderData.storeAccount = ""
        this.addWorkOrderData.cmdDetail = []
        this.addWorkOrderData.orderBusinessType = ""
        this.addWorkOrderData.platformOrderCode = ""
        this.addWorkOrderData.orderId = ""
        this.$refs.crud.selectClear()
      } else {
        this.checkedOrderItem = this.orderInfoList.find((item) => {
          return item.orderCode == val
        })
        this.relevanceOrder = this.checkedOrderItem.relationMsg || ""
        this.addWorkOrderData.store = this.checkedOrderItem.store || ""
        this.addWorkOrderData.storeAccount = this.checkedOrderItem.storeAccount
        this.addWorkOrderData.cmdDetail = this.checkedOrderItem.soOrderDetailInfoVoDetails.map((item) => {
          return {
            ...item,
            currencyHasTax: this.checkedOrderItem.totalAmountHasTaxCurrency,
            refundAmount: "",
            returnQuantity: ""
          }
        })
        this.addWorkOrderData.orderBusinessType = this.checkedOrderItem.orderBusinessType
        this.addWorkOrderData.platformOrderCode = this.checkedOrderItem.platformOrderCode
        this.addWorkOrderData.orderId = this.checkedOrderItem.orderId
        this.addWorkOrderData.totalAmountHasTaxCurrency = this.checkedOrderItem.totalAmountHasTaxCurrency
      }

      //   仅退款工单，退款金额=明细的实付总金额
      if (this.addWorkOrderData.workOrderType == "REFUND") {
        this.addWorkOrderData.cmdDetail.forEach((ele) => {
          ele.returnQuantity = 0
          ele.refundAmount = ele.amountHasTax
        })
      }
      this.page.total = this.addWorkOrderData.cmdDetail.length
      this.page.currentPage = 1
    },

    async handleConfirm() {
      console.log(this.addWorkOrderData)
      let postData = JSON.parse(JSON.stringify(this.addWorkOrderData))
      postData.reason = postData.reason[postData.reason.length - 1]
      postData.cmdDetail = this.selection
      delete postData.freezeStatus
      delete postData.freezeStatusName
      await this.$refs.addOrUpdateForm.validate()

      const { data } = await addWorkOrder(postData)
      if (data.code === 0) {
        this.$message.success({
          message: "提交成功",
          type: "success"
        })
        this.$emit("input", false)
        this.$emit("success")
      } else {
        this.$message.error(data.message)
      }
    },
    workOrderTypeChange(val) {
      if (this.addWorkOrderData.orderCode) {
        this.orderChange(this.addWorkOrderData.orderCode)
      }
    },
    /**
     * 工单类型
     */
    async getAllWorkOrderType() {
      const res = await getAllWorkOrderType()
      if (res.data.code === 0) {
        // GIFT_WORK_ORDER
        this.workOrderTypeList = res.data.data.filter((item) => item.key == "RETURN_AND_REFUND")
      }
    },
    async getListAllReason() {
      const res = await getListAllReason()
      if (res.data.code === 0) {
        this.listAllReason = this.removeEmptyChildren(res.data.data)
      }
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
    handleAdd() {
      this.addVisible = true
    },
    handleEdit(row) {
      this.editVisible = true
      this.editForm = { ...row }
    },
    handleReasonChange(value) {
      console.log(value)
    },
    returnQuantityChange(val, row) {
      // 除 仅退款单  其他类型都计算 重发也不计算
      if (
        this.addWorkOrderData.workOrderType == "REFUND" ||
        this.addWorkOrderData.workOrderType == "RETURN_AND_REFUND"
      ) {
        // 处理js计算因为浮点计算出现的精度问题
        row.refundAmount = Math.round(val * row.unitPriceHasTax * 100) / 100
      }
    },
    selectionChange(val) {
      this.selection = val
    },
    selectedProduct(data) {
      console.log("data9999", data)
      this.addWorkOrderData.cmdDetail = [
        ...this.addWorkOrderData.cmdDetail,
        ...data.map((item) => {
          return {
            returnQuantity: 0,
            refundAmount: 0,
            soOrderDetailId: 0,
            sku: item.skuCode,
            skuName: item.skuName,
            brand: "",
            brandName: item.brandName,
            category: "",
            categoryName: item.categoryName,
            soOrderDetailQuantity: 0,
            actualDeliveryNum: 0,
            unitPriceHasTax: 0,
            amountHasTax: 0,
            applyReturnQuantity: 0,
            applyRefundAmount: 0,
            currencyHasTax: ""
          }
        })
      ]

      this.page.currentPage = 1
      this.page.total = this.addWorkOrderData.cmdDetail.length
    },
    deletePrd(row) {
      this.addWorkOrderData.cmdDetail.splice(row.$index, 1)
      this.page.total = this.addWorkOrderData.cmdDetail.length
      this.selection = this.selection.filter((item) => item.$_id !== row.$_id)

      this.$refs.crud.$refs.table.toggleRowSelection(row, false)
    }
  }
}
</script>

<style lang="scss" scoped>
.flex4 {
  display: flex;
  flex-wrap: wrap;
  .f4-item {
    width: 25%;
  }
}
.flex5 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.select-box {
  display: flex;

  ::v-deep .el-input__inner {
    box-sizing: border-box;
    height: 32px !important;
  }

  ::v-deep .el-input__inner {
    box-sizing: border-box;
    height: 32px !important;
  }
}
</style>
