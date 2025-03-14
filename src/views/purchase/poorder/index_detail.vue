<template>
  <div id="poorder_detail">
    <basic-container>
      <detail-template
        :value="1"
        :options="{
          template: 1,
          title: '采购订单',
          list: [
            { label: '单据编号', value: poorderform.purchaseOrderNo },
            { label: '单据时间', value: poorderform.createTime },
            { label: '采购员', value: poorderform.displayname },
            { label: '采购组', value: poorderform.purchaseGroupName }
          ]
        }"
      ></detail-template>

      <el-form :inline="true" ref="poorderform" :model="poorderform" class="form" :rules="poorderformRules">
        <detail-wrapper :options="{ title: '基础信息' }">
          <el-row>
            <el-col :span="12">
              <el-form-item label="供应商:">
                <span>{{ poorderform.supplierName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结算方式:" prop="settleaccountTypeId">
                <span>
                  <el-select
                    clearable
                    size="mini"
                    filterable
                    :disabled="poorderform.status != 0 || poorderform.revokeStatus != 0"
                    placeholder="请选择"
                    @change="selectChange"
                    v-model="settleaccountValue"
                  >
                    <el-option
                      v-for="item in posettleaccountList"
                      :key="item.settleaccountTypeId"
                      :label="item.settleaccountName"
                      :value="item.settleaccountTypeId"
                    ></el-option>
                  </el-select>
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="法人主体:" prop="corporationId">
                <span>
                  <el-select
                    clearable
                    filterable
                    size="mini"
                    :disabled="poorderform.status != 0 || poorderform.revokeStatus != 0"
                    placeholder="请选择"
                    v-model="poorderform.corporationId"
                    @change="changeCorporationId"
                  >
                    <el-option
                      v-for="item in corporationList"
                      :key="item.corporationId"
                      :label="item.corporationName"
                      :value="item.corporationId"
                    ></el-option>
                  </el-select>
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="入库仓库:" prop="warehouseId">
                <span>
                  <el-select
                    clearable
                    filterable
                    size="mini"
                    :disabled="poorderform.status != 0 || poorderform.revokeStatus != 0"
                    placeholder="请选择"
                    v-model="warehouseValue"
                    @change="changeWarehouseId"
                  >
                    <el-option
                      v-for="item in warehouseList"
                      :key="item.warehouseId"
                      :label="item.warehouseName"
                      :value="item.warehouseId"
                    ></el-option>
                  </el-select>
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="币别:">
                <span>{{ poorderform.currency }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="税别:">
                <el-radio-group
                  v-model="poorderform.taxType"
                  @change="taxChange"
                  :disabled="taxTypeTag || poorderform.status != 0 || poorderform.revokeStatus != 0"
                >
                  <el-radio :label="1">含税</el-radio>
                  <el-radio :label="2">非税</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="仓库地址:">
                <span>{{ poorderform.warehouseAddress }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </detail-wrapper>
        <!-- 采购明细 -->
        <detail-wrapper
          :options="{
            title: '采购明细',
            openPadding: true,
            left: true,
            subHeader: [
              { label: '汇总数量', value: skuCount },
              { label: '汇总金额', value: amount }
            ]
          }"
          v-if="isTax"
        >
          <el-table class="cancelFixedTop" :data="taxTable" style="width: 100%" max-height="250" border key="taxTable">
            <el-table-column align="center" prop="skuCode" label="SKU" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="el-row-text">{{ scope.row.skuCode }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="skuName" width="100px" label="产品名称" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="el-row-text">{{ scope.row.skuName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="purchaseQuantity"
              label="采购数量"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column align="center" prop="price" label="含税单价" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="platformCode" label="平台" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="sitCode" label="站点" show-overflow-tooltip></el-table-column>
            <el-table-column
              align="center"
              prop="vatRate"
              width="100"
              label="增值税率%"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              align="center"
              prop="taxRate"
              width="100"
              label="交易税率%"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column align="center" prop="priceSum" label="价税合计" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="el-row-text">{{ scope.row.priceSum }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" prop="requisitionNo" label="请购单号" width="150px;" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="el-row-text">{{ scope.row.requisitionNo }}</span>
              </template>
            </el-table-column> -->
            <el-table-column width="200px" align="center" label="采购预计交期">
              <template slot-scope="scope">
                <el-date-picker
                  size="small"
                  v-model="scope.row.planDelivery"
                  value-format="yyyy-MM-dd"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions"
                  :disabled="poorderform.status != 0 || poorderform.revokeStatus != 0"
                ></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button
                  :disabled="poorderform.status != 0 || poorderform.revokeStatus != 0"
                  @click.native.prevent="deleteRow(scope.$index, taxTable)"
                  type="text"
                  size="small"
                  ><i class="icon-shanchu"></i
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </detail-wrapper>
        <detail-wrapper
          :options="{
            title: '采购明细',
            openPadding: true,
            left: true,
            subHeader: [
              { label: '汇总数量', value: skuCount },
              { label: '汇总金额', value: amount }
            ]
          }"
          v-else
        >
          <el-table
            class="cancelFixedTop"
            :data="untaxTable"
            style="width: 100%"
            max-height="250"
            border
            key="untaxTable"
          >
            <el-table-column width="180" align="center" prop="skuCode" label="SKU" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="el-row-text">{{ scope.row.skuCode }}</span>
              </template>
            </el-table-column>
            <el-table-column width="100px" align="center" prop="skuName" label="产品名称" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="el-row-text">{{ scope.row.skuName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="purchaseQuantity"
              label="采购数量"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              align="center"
              prop="noneTaxPrice"
              label="非税单价"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column align="center" prop="noneTaxPriceSum" label="金额"></el-table-column>
            <el-table-column align="center" prop="platformCode" label="平台"></el-table-column>
            <el-table-column align="center" prop="sitCode" label="站点"></el-table-column>
            <!-- <el-table-column align="center" prop="requisitionNo" label="请购单号" width="150">
              <template slot-scope="scope">
                <span class="el-row-text">{{ scope.row.requisitionNo }}</span>
              </template>
            </el-table-column> -->
            <el-table-column align="center" label="采购预计交期" width="170px">
              <template slot-scope="scope">
                <el-date-picker
                  size="small"
                  v-model="scope.row.planDelivery"
                  value-format="yyyy-MM-dd"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions"
                  :disabled="poorderform.status != 0 || poorderform.revokeStatus != 0"
                ></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column width="60" align="center" fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button
                  :disabled="poorderform.status != 0 || poorderform.revokeStatus != 0"
                  @click.native.prevent="deleteRow(scope.$index, untaxTable)"
                  type="text"
                  size="small"
                  ><i class="icon-shanchu"></i
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </detail-wrapper>

        <detail-wrapper :options="{ title: '单据备注', openPadding: true }">
          <el-input
            type="textarea"
            class="rm-border"
            maxlength="500"
            :autosize="{ minRows: 3, maxRows: 5 }"
            v-model.trim="poorderform.remarks"
            placeholder="如有需要可填写单据备注信息，不得超过500个字符。"
            :disabled="poorderform.status != 0 || poorderform.revokeStatus != 0"
          ></el-input>
        </detail-wrapper>

        <el-row class="floatRight marginTopAndBottom">
          <el-col>
            <el-button
              size="small"
              type="primary"
              @click="saveOrSubmitForm(1)"
              v-if="poorderform.status == 0 && permissions.purchase_poorder_save && poorderform.revokeStatus == 0"
              >保存</el-button
            >
            <el-button
              size="small"
              type="primary"
              @click="saveOrSubmitForm(2)"
              v-if="poorderform.status == 0 && permissions.purchase_poorder_submit && poorderform.revokeStatus == 0"
              >提交</el-button
            >
            <el-button
              size="small"
              type="primary"
              @click="cancelSubmit"
              v-if="poorderform.status == 1 && permissions.purchase_poorder_submit && poorderform.revokeStatus == 0"
              >撤销提交</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { round } from "@/components/avue/utils/util"
import { dateFtt } from "@/components/avue/utils/dateUtil"
import { fetchList, reverse } from "@/api/purchase/order/poorder"
import {
  getInfoByPurchaseOrderNo,
  getPriceAndRateByPurchaseOrderNo,
  saveOrSubmit
} from "@/api/purchase/order/poorderdetail"
import { getCorporation } from "@/api/purchase/porequisiton"
import { dateFormat } from "@/filters/index"
import { getWarehouseByCorpCodeApi } from "@/api/baseSetup/bsewarehouse"
import { getAllPosettleaccount } from "@/api/purchase/posettleaccounttype"

export default {
  name: "poorder_detail",
  data() {
    return {
      warehouseValue: "",
      settleaccountValue: "",
      //根据税别 控制只读或可选
      taxTypeTag: false,
      //后台采购单的数据
      poorderData: {},
      //页面表单相关
      poorderform: {
        purchaseOrderNo: "",
        createTime: "",
        corporationId: "",
        displayname: "",
        purchaseGroupName: "",
        supplierName: "",
        corporationName: "",
        warehouseName: "",
        warehouseId: "",
        warehouseAddress: "",
        currency: "",
        taxType: "",
        settleaccountName: "",
        settleaccountTypeId: "",
        remarks: "",
        status: "",
        iniTaxType: "",
        revokeStatus: ""
      },
      taxTable: [],
      untaxTable: [],
      isTax: true,
      warehouseList: [],
      corporationList: [],
      posettleaccountList: [],
      poorderformRules: {
        settleaccountTypeId: [{ required: true, message: "结算方式不能为空", trigger: "change" }],
        corporationId: [{ required: true, message: "法人主体为空", trigger: "blur" }],
        taxType: [{ required: true, message: "税别不能为空", trigger: "change" }]
      },

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime()
        }
      },
      amount: 0,
      skuCount: 0
    }
  },
  created() {
    var purchaseOrderNo = this.$route.query.purchaseOrderNo
    getAllPosettleaccount({ status: 0 }).then(({ data }) => {
      if (data.code == 0) {
        this.posettleaccountList = data.data
      } else {
        this.$message.error("查询结算方式失败!!!")
      }
    })
    //后台请求采购数据，动态渲染页面
    this.init(purchaseOrderNo)
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  watch: {},
  methods: {
    selectChange(val) {
      this.poorderform.settleaccountTypeId = val
    },
    init(purchaseOrderNo) {
      fetchList({ purchaseOrderNo: purchaseOrderNo, size: 20 }).then(({ data }) => {
        if (data.code == 0) {
          console.log("初始化", data)
          var record = data.data.records[0]
          //console.info(record);
          this.poorderform = {
            purchaseOrderNo: record.purchaseOrderNo,
            createTime: record.createTime,
            corporationId: record.corporationId,
            displayname: record.displayname,
            purchaseGroupName: record.purchaseGroupName,
            supplierName: record.supplierName,
            corporationName: record.corporationName,
            warehouseName: record.warehouseName,
            warehouseId: record.warehouseId,
            warehouseAddress: record.warehouseAddress,
            currency: record.currency,
            taxType: record.taxType,
            settleaccountName: record.settleaccountName,
            settleaccountTypeId: record.settleaccountTypeId, //id
            remarks: record.remarks,
            status: record.status,
            iniTaxType: record.iniTaxType,
            revokeStatus: record.revokeStatus,
            supplierNo: record.supplierNo
          }
          // this.settleaccountValue = record.settleaccountName
          this.settleaccountValue = record.settleaccountTypeId
          this.warehouseValue = record.warehouseId
          this.amount = record.amount
          this.skuCount = record.skuCount
          this
          getInfoByPurchaseOrderNo(this.poorderform.purchaseOrderNo).then(({ data }) => {
            if (data.code == 0) {
              var poOrderDetails = data.data
              var details1 = []
              var details2 = []
              for (var i = 0; i < poOrderDetails.length; i++) {
                var poOrderDetail = poOrderDetails[i]
                var expectDelivery = null
                if (poOrderDetail.expectDelivery && poOrderDetail.expectDelivery != "") {
                  expectDelivery = dateFtt("yyyy-MM-dd", new Date(poOrderDetail.expectDelivery))
                }
                var price = null
                var priceSum = null
                if (poOrderDetail.price) {
                  price = round(poOrderDetail.price)
                  if (poOrderDetail.purchaseQuantity) {
                    priceSum = round(poOrderDetail.purchaseQuantity * poOrderDetail.price)
                  }
                }
                var noneTaxPrice = null
                var noneTaxPriceSum = null
                if (poOrderDetail.price) {
                  noneTaxPrice = round(poOrderDetail.price)
                  if (poOrderDetail.purchaseQuantity) {
                    noneTaxPriceSum = round(poOrderDetail.purchaseQuantity * poOrderDetail.price)
                  }
                }

                const currentDate = new Date()
                var detail1 = {
                  poDetailId: poOrderDetail.poDetailId,
                  skuCode: poOrderDetail.sku,
                  skuName: poOrderDetail.skuName,
                  purchaseQuantity: poOrderDetail.purchaseQuantity,
                  price: price,
                  noneTaxPrice: noneTaxPrice,
                  taxRate: poOrderDetail.taxRate * 100,
                  vatRate: poOrderDetail.vatRate * 100,
                  priceSum: priceSum,
                  noneTaxPriceSum: noneTaxPriceSum,
                  requisitionNo: poOrderDetail.requisitionNo,
                  remarks: poOrderDetail.remarks,
                  expectDelivery: expectDelivery,
                  planDelivery: poOrderDetail.planDelivery
                    ? poOrderDetail.planDelivery
                    : dateFormat(new Date(currentDate.setDate(currentDate.getDate() + 1)), "yyyy/MM/dd").replace(
                        /\//g,
                        "-"
                      ),
                  platformCode: poOrderDetail.platformCode,
                  sitCode: poOrderDetail.sitCode
                }
                var detail2 = {
                  poDetailId: poOrderDetail.poDetailId,
                  skuCode: poOrderDetail.sku,
                  skuName: poOrderDetail.skuName,
                  purchaseQuantity: poOrderDetail.purchaseQuantity,
                  price: null,
                  noneTaxPrice: null,
                  taxRate: null,
                  vatRate: null,
                  priceSum: null,
                  noneTaxPriceSum: null,
                  requisitionNo: poOrderDetail.requisitionNo,
                  remarks: poOrderDetail.remarks,
                  expectDelivery: expectDelivery,
                  planDelivery: poOrderDetail.planDelivery
                    ? poOrderDetail.planDelivery
                    : dateFormat(new Date(currentDate.setDate(currentDate.getDate() + 1)), "yyyy/MM/dd").replace(
                        /\//g,
                        "-"
                      ),
                  platformCode: poOrderDetail.platformCode,
                  sitCode: poOrderDetail.sitCode
                }
                details1.push(detail1)
                details2.push(detail2)
              }
              if (this.poorderform.taxType == 1) {
                this.taxTable = details1
                this.untaxTable = details2
                this.isTax = true
              } else {
                this.taxTable = details2
                this.untaxTable = details1
                this.isTax = false
              }
            }
          })

          //控制税别
          if (this.poorderform.iniTaxType == 1) {
            //1-含税可以修改

            this.taxTypeTag = false
          } else {
            //2-非税 不能修改置位只读

            this.taxTypeTag = true
          }

          this.getCorporationBySupplierNo()
        } else {
          this.$message.error("查询采购订单信息失败!!!")
        }
      })
    },
    changeWarehouseId(warehouseId) {
      this.poorderform.warehouseId = warehouseId
      var selectWarehouse = this.warehouseList.filter((item) => item.warehouseId == warehouseId)
      if (selectWarehouse && selectWarehouse.length > 0) {
        this.poorderform.warehouseAddress = selectWarehouse[0].warehouseAddress
      } else {
        this.poorderform.warehouseAddress = ""
      }
    },
    cancelSubmit() {
      var params = {
        purchaseOrderNos: this.poorderform.purchaseOrderNo,
        reverseNewStatus: 0,
        confrimErrorMsg: "采购订单的状态不是采购一审或者被删除，请检查",
        logRemark: "撤销提交"
      }

      reverse(params)
        .then(({ data }) => {
          if (data.code == 0) {
            this.$message({
              message: "撤销提交成功",
              type: "success"
            })
            this.init(this.poorderform.purchaseOrderNo)
            if (this.$parent.$refs.tagNavigate) {
              this.$parent.$refs.tagNavigate.clearTagCache(this.$route.meta.parentPath)
            }
          } else if (data.code == 1 && data.msg) {
            this.$message.error(data.msg)
          } else {
            this.$message.error("撤销提交失败")
          }
        })
        .finally(() => {})
    },
    saveOrSubmitForm(type) {
      this.$refs["poorderform"].validate((valid) => {
        if (valid) {
          if (this.poorderform.taxType == 1) {
            for (var i = 0; i < this.taxTable.length; i++) {
              var planDelivery = this.taxTable[i].planDelivery
              //console.info(planDelivery);
              if (!(planDelivery && planDelivery != "")) {
                this.$message.error("存在采购预计交期为空的数据，请检查")
                return false
              } else if (new Date(planDelivery) < new Date(new Date(new Date().toLocaleDateString()).getTime())) {
                this.$message.error("存在采购预计交期小于当前日期的数据，请检查")
                return false
              }
            }

            saveOrSubmit({
              poOrderDetailList: this.taxTable,
              purchaseOrderNo: this.poorderform.purchaseOrderNo,
              taxType: 1,
              warehouseId: this.poorderform.warehouseId,
              settleaccountTypeId: this.poorderform.settleaccountTypeId,
              corporationId: this.poorderform.corporationId,
              type: type,
              remarks: this.poorderform.remarks
            })
              .then(({ data }) => {
                if (data.code == 0) {
                  if (type == 1) {
                    this.$message({
                      message: "保存成功",
                      type: "success"
                    })
                  } else {
                    this.$message({
                      message: "提交成功",
                      type: "success"
                    })
                  }
                  this.init(this.poorderform.purchaseOrderNo)
                  if (this.$parent.$refs.tagNavigate) {
                    this.$parent.$refs.tagNavigate.clearTagCache(this.$route.meta.parentPath)
                  }
                } else if (data.code == 1 && data.msg) {
                  this.$message.error(data.msg)
                } else {
                  if (type == 1) {
                    this.$message.error("保存失败")
                  } else {
                    this.$message.error("提交失败")
                  }
                }
              })
              .finally(() => {})
          }
          if (this.poorderform.taxType == 2) {
            for (var i = 0; i < this.untaxTable.length; i++) {
              var planDelivery = this.untaxTable[i].planDelivery
              console.info(planDelivery)
              if (!(planDelivery && planDelivery != "")) {
                this.$message.error("存在采购预计交期为空的数据，请检查")
                return false
              } else if (new Date(planDelivery) < new Date(new Date(new Date().toLocaleDateString()).getTime())) {
                this.$message.error("存在采购预计交期小于当前日期的数据，请检查")
                return false
              }
            }

            saveOrSubmit({
              poOrderDetailList: this.untaxTable,
              purchaseOrderNo: this.poorderform.purchaseOrderNo,
              taxType: 2,
              warehouseId: this.poorderform.warehouseId,
              settleaccountTypeId: this.poorderform.settleaccountTypeId,
              corporationId: this.poorderform.corporationId,
              type: type,
              remarks: this.poorderform.remarks
            })
              .then(({ data }) => {
                if (data.code == 0) {
                  if (type == 1) {
                    this.$message({
                      message: "保存成功",
                      type: "success"
                    })
                  } else {
                    this.$message({
                      message: "提交成功",
                      type: "success"
                    })
                  }
                  this.init(this.poorderform.purchaseOrderNo)
                  if (this.$parent.$refs.tagNavigate) {
                    this.$parent.$refs.tagNavigate.clearTagCache(this.$route.meta.parentPath)
                  }
                } else if (data.code == 1 && data.msg) {
                  this.$message.error(data.msg)
                } else {
                  if (type == 1) {
                    this.$message.error("保存失败")
                  } else {
                    this.$message.error("提交失败")
                  }
                }
              })
              .finally(() => {})
          }
        }
      })
    },
    deleteRow(index, rows) {
      if (rows.length == 1) {
        this.$message({
          type: "info",
          message: "只有一条数据，无法删除"
        })
        return
      }
      if (rows.length >= 2) {
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
    },

    // 根据供应商查找法人
    getCorporationBySupplierNo() {
      this.corporationList = []
      getCorporation({ supplierNo: this.poorderform.supplierNo }).then((res) => {
        if (res.data.code === 0) {
          if (res.data.data && res.data.data.length) {
            this.corporationList = res.data.data
            this.changeCorporationId(this.poorderform.corporationId, this.warehouseValue)
          } else {
            this.$message.warning("该供应商没有对应的法人主体，请前往供应商详情页面配置【使用组织】！")
          }
        }
      })
    },
    //法人主体里面是写饭的，1代表非税，2代表含税
    taxChange() {
      var paramObj = {}
      if (this.poorderform.taxType == 1) {
        paramObj = {
          taxQualification: 2
        }
      } else {
        paramObj = {
          taxQualification: 1
        }
      }

      this.taxTypeTag = true
      getPriceAndRateByPurchaseOrderNo({
        purchaseOrderNo: this.poorderform.purchaseOrderNo,
        taxType: this.poorderform.taxType
      })
        .then(({ data }) => {
          if (data.code == 0) {
            var priceAndTaxRates = data.data
            if (this.poorderform.taxType == 1) {
              for (var i = 0; i < this.taxTable.length; i++) {
                var priceAndTaxRate = priceAndTaxRates.filter((item) => (item.poDetailId = this.taxTable[i].poDetailId))
                if (priceAndTaxRate && priceAndTaxRate.length > 0) {
                  var price = null
                  var priceSum = null
                  if (priceAndTaxRate[i].price) {
                    price = round(priceAndTaxRate[i].price)
                    if (this.taxTable[i].purchaseQuantity) {
                      priceSum = round(this.taxTable[i].purchaseQuantity * priceAndTaxRate[i].price)
                    }
                  }
                  this.taxTable[i].price = price
                  this.taxTable[i].taxRate = priceAndTaxRate[i].taxRate
                  this.taxTable[i].vatRate = priceAndTaxRate[i].vatRate
                  this.taxTable[i].priceSum = priceSum
                } else {
                  this.taxTable[i].price = null
                  this.taxTable[i].taxRate = null
                  this.taxTable[i].priceSum = null
                  this.taxTable[i].vatRate = null
                }
              }
              this.isTax = true
            } else {
              for (var i = 0; i < this.untaxTable.length; i++) {
                var priceAndTaxRate = priceAndTaxRates.filter(
                  (item) => (item.poDetailId = this.untaxTable[i].poDetailId)
                )
                if (priceAndTaxRate && priceAndTaxRate.length > 0) {
                  var noneTaxPrice = null
                  var noneTaxPriceSum = null
                  if (priceAndTaxRate[i].noneTaxPrice) {
                    noneTaxPrice = round(priceAndTaxRate[i].noneTaxPrice)
                    if (this.taxTable[i].purchaseQuantity) {
                      noneTaxPriceSum = round(this.taxTable[i].purchaseQuantity * priceAndTaxRate[i].noneTaxPrice)
                    }
                  }
                  this.untaxTable[i].noneTaxPrice = noneTaxPrice
                  this.untaxTable[i].noneTaxPriceSum = noneTaxPriceSum
                } else {
                  this.untaxTable[i].noneTaxPrice = null
                  this.untaxTable[i].noneTaxPriceSum = null
                }
              }
              this.isTax = false
              //请求法人主体数据，并修改法人主体
            }
          } else {
            this.$message.error("查询采购明细价格失败")
          }
        })
        .finally(() => {
          this.taxTypeTag = false
        })
    },
    // 改变法人主体
    changeCorporationId(val, warehouseValue) {
      this.warehouseList = []
      this.warehouseValue = warehouseValue ? warehouseValue : null
      if (!val) return
      let { corporationCode } = this.corporationList.find((item) => item.corporationId === val)
      // 获取仓库
      getWarehouseByCorpCodeApi(corporationCode, { funcState: 1 }).then((res) => {
        if (res.data.code === 0) {
          this.warehouseList = res.data.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#poorder_detail {
  .el-form-item {
    margin-bottom: 0px;
  }

  .form .height3pxAndBackground {
    height: 3px;
    background: #e0e0e0;
  }

  .form .floatRight {
    float: right;
  }

  .form .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
</style>
