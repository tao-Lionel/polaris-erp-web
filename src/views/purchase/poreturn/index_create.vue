<template>
  <div class="poreturn_detail">
    <basic-container>
      <el-form ref="poreturnformRef" :model="poreturnform" class="form">
        <detail-template
          :value="1"
          :options="{
            template: 1,
            title: '采购退货单',
            list: [
              { label: '单据编号', value: poreturnform.returnNo },
              { label: '单据时间', value: poreturnform.createTime },
              { label: '制单人', value: poreturnform.createName }
            ]
          }"
        >
        </detail-template>

        <div class="iod-target-top border-rang mg-b-20 detail">
          <p class="iod-target target-title">退货双方</p>
          <el-row class="flex-spance-between target-edit iod-address">
            <el-col :span="12">
              <el-form-item
                label-width="70px"
                :inline="true"
                label="供应商:"
                prop="supplierName"
                :rules="[{ required: true, message: '供应商不能为空', trigger: 'change' }]"
              >
                <el-select
                  size="small"
                  :disabled="true || isSubmit"
                  placeholder="供应商"
                  v-model.trim="poreturnform.supplierName"
                  filterable
                  remote
                  :remote-method="getSupplier"
                  @change="supplierChange"
                >
                  <el-option
                    v-for="item in supplierList"
                    :key="item.supplierNo"
                    :label="item.supplierName"
                    :value="item.historySupplierNo"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label-width="85px"
                :inline="true"
                label="法人主体:"
                prop="corporationName"
                :rules="[{ required: true, message: '法人主体不能为空', trigger: 'change' }]"
              >
                <el-select
                  :disabled="true || isSubmit"
                  size="small"
                  placeholder="法人主体"
                  v-model.trim="poreturnform.corporationName"
                  filterable
                  remote
                  :remote-method="getCorporation"
                  @change="corporationChange"
                >
                  <el-option
                    v-for="item in corporationList"
                    :key="item.corporationId"
                    :label="item.corporationName"
                    :value="item.corporationId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="iod-target-top border-rang mg-b-20">
          <p class="iod-target target-title">退货明细</p>

          <div class="poContract-detail" style="display: flex; margin-left: 10px">
            <el-form-item label="采购组:" prop="purchaseGroupId">
              <el-select
                clearable
                size="small"
                filterable
                placeholder="请选择"
                style="width: 60%"
                v-model="poreturnform.purchaseGroupId"
                @change="changepurchaseGroup"
                :disabled="isSubmit"
              >
                <el-option
                  v-for="item in purchaseGroupOptions"
                  :key="item.groupId"
                  :label="item.name"
                  :value="item.groupId"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="币种:"
              prop="currency"
              :rules="[{ required: true, message: '币种不能为空', trigger: 'change' }]"
            >
              <el-select
                clearable
                size="small"
                filterable
                placeholder="币种"
                style="width: 60%"
                v-model="poreturnform.currency"
                @change="changeCurrency"
                :disabled="true || isSubmit"
              >
                <el-option
                  v-for="(item, index) in currencyOptions"
                  :key="index"
                  :label="item.currency"
                  :value="item.currency"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :disabled="isSubmit"
                style="padding: 8px 15px; font-size: 13px"
                @click="addPurchaseOrder"
                >添加采购单</el-button
              >
            </el-form-item>
          </div>

          <avue-crud :option="tableOption" ref="crud" :data="list">
            <template slot="skuCode" slot-scope="scope">
              <span>{{ scope.row.skuCode }}</span>
            </template>
            <template slot="returnCount" slot-scope="scope">
              <el-input-number
                style="width: 100%"
                v-model="scope.row.returnCount"
                size="small"
                min="0"
                @change="getAllRefundValue(scope.row)"
                :controls="false"
                clearable
              ></el-input-number>
            </template>
            <template slot="remark" slot-scope="scope">
              <el-input v-model="scope.row.remark" size="small" :disabled="isSubmit"></el-input>
            </template>
            <template slot="operator" slot-scope="scope">
              <div class="table-opration">
                <el-button
                  :disabled="isSubmit"
                  @click.native.prevent="deleteRow(scope.row.$index, list)"
                  type="text"
                  size="small"
                  style="padding: 0; margin-left: 10px"
                  ><i class="icon-shanchu"></i
                ></el-button>
              </div>
            </template>
          </avue-crud>

          <div style="padding: 10px 0 10px 10px">
            退货总货值：<span>{{ poreturnform.returnValueTotal }}</span>
          </div>
        </div>

        <div class="iod-target-top delive-box border-rang mg-b-20">
          <p class="iod-target target-title">退货备注</p>
          <el-form-item class="iod-address">
            <el-input
              type="textarea"
              rows="4"
              maxlength="500"
              placeholder="如有需要可填写备注信息，不得超过500个字符。"
              v-model="poreturnform.remark"
              :disabled="isSubmit"
              size="small"
            ></el-input>
          </el-form-item>
        </div>

        <el-row class="floatRight marginTopAndBottom">
          <el-col>
            <el-button size="small" :disabled="isSubmit" v-if="permissions.purchase_poreturn_save" @click="save">
              保存
            </el-button>
            <el-button
              type="primary"
              size="small"
              :disabled="isSubmit"
              @click="submit"
              v-if="permissions.purchase_poreturn_submit"
              >提交</el-button
            >
          </el-col>
        </el-row>
      </el-form>
      <el-dialog title="平台SKU退货数量" :visible.sync="stockDialog" width="850px">
        <avue-crud :option="stockOption" ref="stockCrud" :data="poReturnStockDetailList">
          <template slot="returnCount" slot-scope="scope">
            <el-input
              size="small"
              :disabled="isSubmit"
              v-model.trim="scope.row.returnCount"
              @change="returnCountChange(scope.row)"
              maxlength="12"
            ></el-input>
          </template>
          <template slot="refundMoney" slot-scope="scope">
            <el-input
              size="small"
              :disabled="isSubmit"
              v-model.trim="scope.row.refundMoney"
              @change="refundMoneyChange(scope.row)"
              maxlength="12"
            ></el-input>
          </template>
        </avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button @click="stockConfirm" v-if="!isSubmit" size="small">确定</el-button>
          <el-button @click="stockDialog = false" v-else size="small">关闭</el-button>
        </span>
      </el-dialog>

      <!-- 添加采购单 -->
      <el-dialog
        title="采购单-明细信息"
        :visible.sync="showPcStatus"
        width="80%"
        :before-close="purchaseDetailCancel"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center
      >
        <el-form ref="purchaseForm" :model="purchaseForm">
          <avue-crud
            ref="purchaseDetail"
            :data="purchaseDetailData"
            :option="purchaseDetailTableOption"
            @search-change="purchaseDetailSearch"
            @search-reset="purchaseDetailReset"
            @selection-change="purchaseDetailChange"
          >
            <template slot="search">
              <el-form-item label="采购单号" prop="purchaseOrderNo">
                <el-input
                  :disabled="$route.query.returnNo ? true : false"
                  v-model="purchaseForm.purchaseOrderNo"
                  size="small"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="SKU" prop="skuCode">
                <el-input v-model="purchaseForm.skuCode" size="small" clearable></el-input>
              </el-form-item>
            </template>
          </avue-crud>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="purchaseDetailCancel">取 消</el-button>
          <el-button size="small" type="primary" @click="purchaseDetailConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import {
  getSkuListByQuery,
  getDetailBySkuAndReturnNo,
  showEditReturnData,
  getReturnDetailByReturnNo,
  saveData,
  getReturnData,
  submitData,
  getPoOrderDetail
} from "@/api/purchase/poreturn/poreturndetail"
import { tableOption, stockOption, purchaseDetailTableOption } from "@/const/crud/purchase/poreturn/poreturndetail"
import { getSupplierLikeName, fetchList as getAllSupplier } from "@/api/supplier/posupplier.js"
import { getAll } from "@/api/baseSetup/bsecorporation.js"
import { mapGetters } from "vuex"
import { getAll as getBseCurrency } from "@/api/baseSetup/bsecurrency"
import { getGroupAllByParams } from "@/api/adminUser/adminGroup"
export default {
  name: "poreturndetail",
  data() {
    return {
      tableOption: tableOption,
      poreturnform: {
        returnNo: this.$route.query.returnNo,
        createTime: "",
        createName: "",
        supplierNo: "",
        supplierName: "",
        corporationId: "",
        corporationName: "",
        currency: "",
        purchaseGroupId: "",
        returnValueTotal: "",
        refundMoneyTotal: "",
        refundMode: "",
        remark: "",
        status: "",
        poReturnDetailVOList: [],
        purchaseOrderNo: "",
        warehouseId: ""
      },
      selectRow: "",
      poReturnStockDetailList: [],
      stockDialog: false,
      list: [],
      skuList: [],
      stockOption: stockOption,
      currencyCurrency: "",
      purchaseGroupId: "",
      supplierList: [],
      corporationList: [],
      purchaseGroupOptions: [],
      isSubmit: false,
      currentSupplierNo: "",
      currentSupplierName: "",
      currentCorporationName: "",
      currentCorporationId: "",
      currencyOptions: [],
      showPcStatus: false,
      purchaseForm: {},
      purchaseDetailData: [],
      purchaseDetailChoice: [],
      purchaseDetailTableOption: purchaseDetailTableOption
    }
  },
  created() {
    const params = {
      size: -1,
      current: -1
    }
    getAllSupplier(params).then((res) => {
      if (res.data.code === 0) {
        this.supplierList = res.data.data.records
      }
    })
    getAll(params).then((res) => {
      if (res.data.code === 0) {
        this.corporationList = res.data.data
      }
    })
  },
  mounted: function () {
    this.init(this.poreturnform.returnNo)
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    init(returnNo) {
      getBseCurrency().then(({ data }) => {
        if (data.code == 0) {
          this.currencyOptions = data.data
        }
      })
      //加载采购组
      var params = {
        groupFunctionName: "采购类",
        authority: true
      }
      getGroupAllByParams(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.purchaseGroupOptions = data
        }
        if (this.purchaseGroupOptions.length == 1) {
          this.poreturnform.purchaseGroupId = this.purchaseGroupOptions[0].groupId
        }
      })
      if (returnNo) {
        getReturnData({ returnNo: returnNo }).then(({ data }) => {
          if (data.code == 0) {
            this.poreturnform = data.data
            if (this.poreturnform.status == 0) {
              this.isSubmit = false
            } else {
              this.isSubmit = true
            }
            this.currencyCurrency = this.poreturnform.currency
            this.purchaseGroupId = this.poreturnform.purchaseGroupId
            this.currentSupplierNo = this.poreturnform.supplierNo
            this.currentSupplierName = this.poreturnform.supplierName
            this.currentCorporationId = this.poreturnform.corporationId
            this.currentCorporationName = this.poreturnform.corporationName
            getReturnDetailByReturnNo({ returnNo: returnNo }).then(({ data }) => {
              if (data.code == 0) {
                data.data.forEach((item) => {
                  item.platform = item.poReturnStockDetailList[0].platform
                  item.site = item.poReturnStockDetailList[0].site
                  item.availableQuantity = item.poReturnStockDetailList[0].availableQuantity
                  item.poPrice = item.poReturnStockDetailList[0].poPrice
                })
                this.list = data.data
                this.calculateTotalMoneyAndValue()
              } else {
                this.$message.error("查询退货明细失败")
              }
            })
          } else {
            this.$message.error("查询采购退货单信息失败")
          }
        })
      }
    },
    round(number) {
      if (number == null) {
        return null
      }
      return Math.round(number * 100) / 100
    },
    getAllRefundValue(row) {
      let returnValueTotal = 0
      let refundMoneyTotal = 0
      let returnValue = (row.returnCount * (row.poPrice * 100)) / 100
      this.$set(row, "returnValue", returnValue.toFixed(2))
      this.$set(row, "refundMoney", returnValue.toFixed(2))
      row.poReturnStockDetailList[0].returnCount = row.returnCount
      this.list.forEach((item) => {
        returnValueTotal += item.returnValue * 100
        refundMoneyTotal += item.returnValue * 100
      })
      returnValueTotal = returnValueTotal / 100
      this.poreturnform.returnValueTotal = returnValueTotal.toFixed(2)
      refundMoneyTotal = refundMoneyTotal / 100
      this.poreturnform.refundMoneyTotal = refundMoneyTotal.toFixed(2)
      row.poReturnStockDetailList[0].refundMoney = returnValue.toFixed(2)
    },
    getAllRefundMoney(row) {
      row.poReturnStockDetailList[0].refundMoney = row.refundMoney
      let refundMoneyTotal = 0
      this.list.forEach((item) => {
        refundMoneyTotal += item.refundMoney * 100
      })
      refundMoneyTotal = refundMoneyTotal / 100
      this.poreturnform.refundMoneyTotal = refundMoneyTotal.toFixed(2)
    },
    purchaseDetailSearch() {
      getPoOrderDetail(this.purchaseForm).then((res) => {
        if (res.data.code === 0) {
          this.purchaseDetailData = res.data.data
        }
      })
    },
    purchaseDetailReset() {
      this.purchaseForm = {}
    },
    purchaseDetailChange(val) {
      this.purchaseDetailChoice = val
    },
    purchaseDetailConfirm() {
      if (!this.purchaseDetailChoice.length) {
        this.$message.warning("请勾选要退货的采购明细！")
        return
      }
      let list = this.purchaseDetailChoice.map((item) => {
        return {
          skuId: item.skuId,
          skuCode: item.skuCode,
          skuName: item.skuName,
          returnCount: 0,
          refundMoney: 0,
          remark: "",
          returnValue: 0,
          platform: item.platform,
          site: item.site,
          poPrice: item.price,
          availableQuantity: item.availableQuantity,
          poReturnStockDetailList: [
            {
              returnCount: 0,
              refundMoney: 0,
              stockBatchId: item.stockBatchId,
              stockId: item.stockId,
              poPrice: item.price,
              availableQuantity: item.availableQuantity,
              platform: item.platform,
              site: item.site
            }
          ]
        }
      })
      if (this.purchaseDetailChoice && this.purchaseDetailChoice.length) {
        this.poreturnform.supplierNo = this.purchaseDetailChoice[0].supplierNo
        this.poreturnform.supplierName = this.purchaseDetailChoice[0].supplierNo
        this.poreturnform.corporationId = this.purchaseDetailChoice[0].corporationId
        this.poreturnform.corporationName = this.purchaseDetailChoice[0].corporationId
        this.poreturnform.currency = this.purchaseDetailChoice[0].currency
        this.poreturnform.purchaseOrderNo = this.purchaseDetailChoice[0].purchaseOrderNo
        this.poreturnform.warehouseId = this.purchaseDetailChoice[0].warehouseId
      }
      this.calculateTotalMoneyAndValue()
      this.purchaseForm = {}
      this.purchaseDetailData = []
      this.$refs.purchaseDetail.selectClear()

      let newArr = []
      list.forEach((item, index) => {
        const status = this.list.some((items) => {
          return items.skuCode == item.skuCode && items.platform == item.platform && items.site == item.site
        })
        if (!status) {
          newArr.push(item)
        }
      })
      this.list = [...this.list, ...newArr]
      this.showPcStatus = false
    },
    purchaseDetailCancel() {
      this.showPcStatus = false
      this.purchaseForm = {}
    },
    addPurchaseOrder() {
      if (this.poreturnform.purchaseOrderNo) {
        this.purchaseForm.purchaseOrderNo = this.poreturnform.purchaseOrderNo
        this.purchaseDetailSearch()
      }
      this.showPcStatus = true
    },
    refundMoneyChange(row) {
      var refundMoney = row.refundMoney
      if (!this.checkFloatAndZero(refundMoney)) {
        this.$message.error("退款金额仅只支持输入正数且仅支持保留两位小数，请检查")
        return false
      }
    },
    returnCountChange(row) {
      var returnCount = row.returnCount
      var availableQuantity = row.availableQuantity
      if (!this.checkNumberAndZero(returnCount)) {
        this.$message.error("退货数量需要是正整数或0，请检查")
        return false
      }
      if (parseInt(returnCount) > parseInt(availableQuantity)) {
        this.$message.error("退货数量不能大于当前可用库存，请检查")
        return false
      }
    },
    changeRefundMoney(row) {
      var refundMoney = row.refundMoney
      if (!this.checkFloat(refundMoney)) {
        this.$message.error("退款金额需要是两位小数")
        return false
      }
      this.calculateTotalMoneyAndValue()
    },
    checkFloat(data) {
      var reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      if (!reg.test(data)) {
        return false
      } else {
        return true
      }
    },
    checkNumber(data) {
      var reg = /^([1-9][0-9]*)$/
      if (!reg.test(data)) {
        return false
      } else {
        return true
      }
    },
    checkFloatAndZero(data) {
      var reg = /^(([1-9][0-9]*)|0|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      if (!reg.test(data)) {
        return false
      } else {
        return true
      }
    },
    checkNumberAndZero(data) {
      var reg = /^(([1-9][0-9]*)|0)$/
      if (!reg.test(data)) {
        return false
      } else {
        return true
      }
    },
    checkData() {
      var corporationId = this.poreturnform.corporationId
      var supplierNo = this.poreturnform.supplierNo
      var currency = this.poreturnform.currency
      var refundMode = this.poreturnform.refundMode

      if (!supplierNo || supplierNo == "") {
        this.$message.error("供应商不能为空，请检查")
        return false
      }
      if (!corporationId || corporationId == "") {
        this.$message.error("法人主体不能为空，请检查")
        return false
      }
      if (!currency || currency == "") {
        this.$message.error("币种不能为空，请检查")
        return false
      }
      if (!this.list || this.list.length == 0) {
        this.$message.error("退货明细不能为空，请检查")
        return false
      }
      for (var i = 0; i < this.list.length; i++) {
        var item = this.list[i]
        var skuId = item.skuId
        var returnCount = item.returnCount
        var refundMoney = item.refundMoney
        var poReturnStockDetailList = item.poReturnStockDetailList
        if (!skuId || skuId == "") {
          this.$message.error("退货明细存在SKU为空的数据，请检查")
          return false
        }
        if (!this.checkNumber(returnCount)) {
          this.$message.error("退货明细存在退货数量不是正整数的数据，请检查")
          return false
        }
        if (!this.checkFloat(refundMoney)) {
          this.$message.error("退货明细存在退款金额不是两位小数的数据，请检查")
          return false
        }
        console.info((refundMoney + "").length)
        if ((refundMoney + "").length >= 13) {
          this.$message.error("退货明细存在退款金额位数大于13位的数据，请检查")
          return false
        }
        if (!poReturnStockDetailList || poReturnStockDetailList.length == 0) {
          this.$message.error("退货明细存在平台SKU退货数量为空的数据，请检查")
          return false
        }
        for (var j = 0; j < poReturnStockDetailList.length; j++) {
          var row = poReturnStockDetailList[j]
          var returnCount1 = row.returnCount
          var refundMoney1 = row.refundMoney
          var availableQuantity = row.availableQuantity
          if (!this.checkNumberAndZero(returnCount1)) {
            this.$message.error("平台SKU退货数量需要是正整数或0，请检查")
            row.returnCount = 0
            return false
          }
          if (!this.checkFloatAndZero(refundMoney1)) {
            this.$message.error("退款金额仅只支持输入正数且仅支持保留两位小数，请检查")
            row.refundMoney1 = 0
            return false
          }
          if (parseInt(returnCount1) > parseInt(availableQuantity)) {
            this.$message.error("平台SKU退货数量不能大于当前可用库存，请检查")
            row.returnCount = 0
            return false
          }
        }
      }
      return true
    },
    save() {
      this.$set(this.poreturnform, "status", 0)
      this.poreturnform.poReturnDetailVOList = this.list
      if (!this.checkData()) {
        return false
      }
      saveData(this.poreturnform)
        .then(({ data }) => {
          if (data.code == 0) {
            this.poreturnform.returnNo = data.data
            this.init(this.poreturnform.returnNo)
            this.$message({
              showClose: true,
              message: "保存成功",
              type: "success"
            })
            if (this.$parent.$refs.tagNavigate) {
              this.$parent.$refs.tagNavigate.clearTagCache(this.$route.meta.parentPath)
              this.$parent.$refs.tagNavigate.closeTag(this.$route.fullPath, this.$route.meta.parentPath, true)
            }
          } else {
            this.$message.error(data.msg)
          }
        })
        .finally(() => {})
    },
    submit() {
      this.$set(this.poreturnform, "status", 1)
      this.poreturnform.poReturnDetailVOList = this.list
      if (!this.checkData()) {
        return false
      }
      submitData(this.poreturnform)
        .then(({ data }) => {
          if (data.code == 0) {
            this.poreturnform.returnNo = data.data
            this.init(this.poreturnform.returnNo)
            this.$message({
              showClose: true,
              message: "提交成功",
              type: "success"
            })
            if (this.$parent.$refs.tagNavigate) {
              this.$parent.$refs.tagNavigate.clearTagCache(this.$route.meta.parentPath)
              this.$parent.$refs.tagNavigate.closeTag(this.$route.fullPath, this.$route.meta.parentPath, true)
            }
          } else {
            this.$message.error(data.msg)
          }
        })
        .finally(() => {})
    },
    corporationChange() {
      var flag = true
      this.list.forEach((item) => {
        var returnCount = item.returnCount
        if (returnCount && returnCount != 0) {
          this.$message.error("请先删除有退货数据的sku，再进行法人主体切换")
          flag = false
          return false
        }
      })
      if (!flag) {
        this.poreturnform.corporationId = this.currentCorporationId
        this.poreturnform.corporationName = this.currentCorporationName
        return false
      }
      this.poreturnform.corporationId = this.poreturnform.corporationName
      this.currentCorporationId = this.poreturnform.corporationId
      this.currentCorporationName = this.poreturnform.corporationName
    },
    getCorporation(query) {
      if (query.trim() == "") {
        return
      }
      getAll({ corporationName: query.trim(), isHideLoading: true }).then(({ data }) => {
        if (data.code == 0) {
          this.corporationList = data.data
        }
      })
    },
    supplierChange() {
      var flag = true
      this.list.forEach((item) => {
        var returnCount = item.returnCount
        if (returnCount && returnCount != 0) {
          this.$message.error("请先删除有退货数据的sku，再进行供应商切换")
          flag = false
          return false
        }
      })
      if (!flag) {
        this.poreturnform.supplierNo = this.currentSupplierNo
        this.poreturnform.supplierName = this.currentSupplierName
        return false
      }
      this.poreturnform.supplierNo = this.poreturnform.supplierName
      this.currentSupplierNo = this.poreturnform.supplierNo
      this.currentSupplierName = this.poreturnform.supplierName
    },
    getSupplier(query) {
      if (query.trim() == "") {
        return
      }
      getSupplierLikeName({ supplierName: query.trim(), isHideLoading: true }).then(({ data }) => {
        if (data.code == 0) {
          this.supplierList = data.data
        }
      })
    },
    changeCurrency() {
      var flag = true
      this.list.forEach((item) => {
        var returnCount = item.returnCount
        if (returnCount && returnCount != 0) {
          this.$message.error("请先删除有退货数据的sku，再进行币种切换")
          flag = false
          return false
        }
      })
      if (!flag) {
        this.poreturnform.currency = this.currencyCurrency
        return false
      }
      this.currencyCurrency = this.poreturnform.currency
      this.list = [{ stockNativeData: [] }]
      this.skuList = []
      this.calculateTotalMoneyAndValue()
    },

    changepurchaseGroup() {
      // let flag = true
      for (let item of this.list) {
        let returnCount = item.returnCount
        if (returnCount && returnCount != 0) {
          this.$message.error("请先删除有退货数据的sku，再进行小组切换")
          this.poreturnform.purchaseGroupId = this.purchaseGroupId
          // flag = false
          return false
        }
      }
      // this.list.forEach((item) => {
      //   var returnCount = item.returnCount
      //   if (returnCount && returnCount != 0) {
      //     this.$message.error("请先删除有退货数据的sku，再进行小组切换")
      //     flag = false
      //     return false
      //   }
      // })
      // if (!flag) {
      //   this.poreturnform.purchaseGroupId = this.purchaseGroupId
      //   return false
      // }
      this.purchaseGroupId = this.poreturnform.purchaseGroupId
      this.list = [{ stockNativeData: [] }]
      this.skuList = []
      this.calculateTotalMoneyAndValue()
    },

    showEdit(row, type) {
      var skuId = row.skuId
      var returnDetailId = row.returnDetailId
      var currency = this.poreturnform.currency
      var supplierNo = this.poreturnform.supplierNo
      var corporationId = this.poreturnform.corporationId
      var purchaseGroupId = this.poreturnform.purchaseGroupId
      if (!skuId || skuId == "") {
        this.$message.error("请先选择SKU")
        return false
      }
      showEditReturnData({
        skuId: skuId,
        returnDetailId: returnDetailId,
        currency: currency,
        corporationId: corporationId,
        supplierNo: supplierNo,
        purchaseGroupId: purchaseGroupId,
        type: type
      }).then(({ data }) => {
        row.poReturnStockDetailList = data.data
        if (row.stockNativeData) {
          row.stockNativeData.forEach((item) => {
            row.poReturnStockDetailList.forEach((item1) => {
              if (item1.stockBatchId == item.stockBatchId) {
                item1.returnCount = item.returnCount
                item1.refundMoney = item.refundMoney
              }
            })
          })
        }
        this.selectRow = row
        this.poReturnStockDetailList = row.poReturnStockDetailList
        this.calculateTotalMoneyAndValue()
        this.stockDialog = true
      })
    },
    stockConfirm() {
      var poReturnStockDetailList = this.selectRow.poReturnStockDetailList
      var returnCount = 0
      var returnValue = 0
      var refundMoney = 0
      var flag = true
      poReturnStockDetailList.forEach((item) => {
        if (
          item.returnCount &&
          parseInt(item.returnCount) > 0 &&
          (!item.refundMoney || parseFloat(item.refundMoney) == 0)
        ) {
          this.$message.error("存在有退货数量没有退款金额的数据，请检查")
          flag = false
          return false
        }
        if (
          !item.returnCount &&
          parseInt(item.returnCount) == 0 &&
          item.refundMoney &&
          parseFloat(item.refundMoney) > 0
        ) {
          this.$message.error("存在有退款金额没有退货数量的数据，请检查")
          flag = false
          return false
        }
        if (!this.checkFloatAndZero(item.refundMoney)) {
          this.$message.error("退款金额仅只支持输入正数且仅支持保留两位小数,请检查")
          flag = false
          return false
        }
        if (!this.checkNumberAndZero(item.returnCount)) {
          this.$message.error("退货数量需要是正整数或0，请检查")
          flag = false
          return false
        }
        if (parseInt(item.returnCount) > parseInt(item.availableQuantity)) {
          this.$message.error("退货数量不能大于当前可用库存，请检查")
          flag = false
          return false
        }
      })
      if (!flag) {
        return false
      }
      this.selectRow.stockNativeData = []
      poReturnStockDetailList.forEach((item) => {
        this.selectRow.stockNativeData.push({
          stockBatchId: item.stockBatchId,
          returnCount: this.round(item.returnCount),
          refundMoney: this.round(item.refundMoney)
        })
        if (item.returnCount) {
          returnCount = parseInt(returnCount) + parseInt(item.returnCount)
        }
        if (item.returnCount && item.poPrice) {
          returnValue = parseFloat(returnValue) + parseFloat(item.returnCount * item.poPrice)
        }
        if (item.refundMoney) {
          refundMoney = parseFloat(refundMoney) + parseFloat(item.refundMoney)
        }
      })

      this.selectRow.returnCount = returnCount
      this.selectRow.returnValue = this.round(returnValue)
      this.selectRow.refundMoney = this.round(refundMoney)
      this.calculateTotalMoneyAndValue()
      this.stockDialog = false
    },
    getSku(query) {
      var currency = this.poreturnform.currency
      var supplierNo = this.poreturnform.supplierNo
      var corporationId = this.poreturnform.corporationId
      var purchaseGroupId = this.poreturnform.purchaseGroupId
      if (!supplierNo) {
        this.$message.error("请先选择供应商")
        return false
      }
      if (!corporationId) {
        this.$message.error("请先选择法人主体")
        return false
      }
      if (!purchaseGroupId) {
        this.$message.error("请先选择采购小组")
        return false
      }
      if (!currency) {
        this.$message.error("请先选择币种")
        return false
      }

      getSkuListByQuery({
        query: query.trim(),
        currency: currency,
        corporationId: corporationId,
        supplierNo: supplierNo,
        purchaseGroupId: purchaseGroupId,
        isHideLoading: true
      }).then(({ data }) => {
        if (data.code == 0) {
          this.skuList = data.data.records
        } else {
          this.$message.error("查询SKU信息失败")
        }
      })
    },
    skuChange(row) {
      row.skuId = row.skuCode
      var returnNo = this.poreturnform.returnNo
      var currency = this.poreturnform.currency
      var supplierNo = this.poreturnform.supplierNo
      var corporationId = this.poreturnform.corporationId
      if (!supplierNo || supplierNo == "") {
        this.$set(this.list, row.$index, {})
        this.calculateTotalMoneyAndValue()
        this.$message.error("请先选择供应商")
        return false
      }
      if (!corporationId || corporationId == "") {
        this.$set(this.list, row.$index, {})
        this.calculateTotalMoneyAndValue()
        this.$message.error("请先选择法人主体")
        return false
      }
      if (!currency || currency == "") {
        this.$set(this.list, row.$index, {})
        this.calculateTotalMoneyAndValue()
        this.$message.error("请先选择币种")
        return false
      }
      var filterData = this.list.filter((item) => item.skuId == row.skuId)
      if (filterData && filterData.length >= 2) {
        this.$set(this.list, row.$index, {})
        this.calculateTotalMoneyAndValue()
        this.$message.error("已存在该SKU")
        return false
      }
      getDetailBySkuAndReturnNo({
        skuId: row.skuId,
        returnNo: returnNo,
        currency: currency,
        corporationId: corporationId,
        supplierNo: supplierNo
      }).then(({ data }) => {
        data.data.stockNativeData = []
        this.$set(this.list, row.$index, data.data)
        this.calculateTotalMoneyAndValue()
      })
    },
    calculateTotalMoneyAndValue() {
      var returnValueTotal = 0
      var refundMoneyTotal = 0
      this.list.forEach((item) => {
        var refundMoney = item.refundMoney
        var returnValue = item.returnValue
        if (refundMoney) {
          refundMoneyTotal = parseFloat(refundMoneyTotal) + parseFloat(refundMoney)
        }
        if (returnValue) {
          returnValueTotal = parseFloat(returnValueTotal) + parseFloat(returnValue)
        }
      })

      this.$set(this.poreturnform, "returnValueTotal", this.round(returnValueTotal))
      this.$set(this.poreturnform, "refundMoneyTotal", this.round(refundMoneyTotal))
    },
    deleteRow(index, rows) {
      if (rows.length == 1) {
        this.$message.error("必须保留一行数据")
        return
      }
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          rows.splice(index, 1)
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./index.scss";

.detail {
  ::v-deep .el-form-item {
    margin: 0;
  }
}
</style>
