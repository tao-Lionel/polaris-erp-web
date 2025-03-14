<!--
  -    Copyright (c) 2018-2025, Aukey All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the trob4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: wangbin (AukeyIT@aukeys.com)
  -->

<template>
  <div id="purchasereconciliation">
    <basic-container>
      <avue-crud
        ref="accountCrud"
        :page="accountPage"
        :data="accountTableData"
        :option="accountTableOption"
        @on-load="getAccountList"
        @search-change="searchAccountChange"
        @search-reset="searchAccountReset"
        @size-change="accountSizeChange"
        v-if="reconciliationType == 1"
      >
        <template slot="menuLeft">
          <el-button
            type="primary"
            @click="exportAccount"
            size="small"
            style="margin-right: 20px"
            v-if="permissions.finance_purchasereconciliation_export"
            >导 出</el-button
          >
          <!-- <el-radio v-model="reconciliationType" label="1"  size="small">按资金</el-radio>
          <el-radio v-model="reconciliationType" label="2"  size="small">按数量</el-radio> -->
        </template>
        <template slot="search">
          <el-form
            @submit.prevent.native
            :model="accountSearchForm"
            :inline="true"
            ref="accountSearchForm"
            style="float: left"
          >
            <el-form-item prop="timeArray">
              <el-date-picker
                v-model="accountSearchForm.timeArray"
                type="daterange"
                size="small"
                start-placeholder="单据开始日期"
                end-placeholder="单据结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="docType">
              <el-select
                v-model="accountSearchForm.docType"
                collapse-tags
                clearable
                size="small"
                placeholder="单据类型"
              >
                <el-option label="采购请款单" value="采购请款单"></el-option>
                <el-option label="采购付款单" value="采购付款单"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item prop="supplierName" label="往来单位">
              <el-input v-model.trim="accountSearchForm.supplierName" size="small" placeholder="往来单位搜索"></el-input>
            </el-form-item> -->
            <el-form-item prop="supplierNo">
              <el-select
                v-model="accountSearchForm.supplierNo"
                size="small"
                popper-class="y-form-select"
                placeholder="往来单位(供应商)"
                filterable
                clearable
              >
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-button native-type="submit" @click="searchAccountChange" v-show="false"></el-button> -->
          </el-form>
        </template>
        <template slot="searchAdvanced">
          <el-form @submit.prevent.native :model="accountSearchForm" :inline="true" ref="accountSearchFormAdvance">
            <!-- <el-form-item prop="corporationName" label="结算组织">
              <el-input v-model.trim="accountSearchForm.corporationName" size="small" placeholder="结算组织搜索"></el-input>
            </el-form-item> -->
            <el-form-item prop="corporationId">
              <el-select
                size="small"
                v-model="accountSearchForm.corporationId"
                clearable
                filterable
                placeholder="结算组织(法人主体)"
              >
                <el-option
                  v-for="item in bsecorporationList"
                  :key="item.corporationId"
                  :label="item.corporationName"
                  :value="item.corporationId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="createUser">
              <el-input v-model.trim="accountSearchForm.createUser" size="small" placeholder="制单人"></el-input>
            </el-form-item>
            <el-form-item prop="docNo">
              <el-input
                v-model.trim="accountSearchForm.docNo"
                size="small"
                placeholder="单据编号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="purchaseOrderNo">
              <el-input
                v-model="accountSearchForm.purchaseOrderNo"
                size="small"
                placeholder="采购单号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="accountSearchForm.warehouseId" size="small" placeholder="入库仓" filterable clearable>
                <el-option
                  v-for="item in warehouse"
                  :key="item.warehouseId"
                  :label="item.warehouseName"
                  :value="item.warehouseId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="poContractNo">
              <el-input
                v-model.trim="accountSearchForm.poContractNo"
                size="small"
                placeholder="合同编号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="skuCode" label="">
              <el-input
                v-model.trim="accountSearchForm.skuCode"
                size="small"
                placeholder="SKU"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item label="" prop="payStatus">
              <el-select
                v-model="accountSearchForm.payStatus"
                collapse-tags
                clearable
                size="small"
                placeholder="支付状态"
              >
                <el-option label="待付" value="1"></el-option>
                <el-option label="已付" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="businessDescriptionArray">
              <el-select
                v-model="accountSearchForm.businessDescriptionArray"
                collapse-tags
                clearable
                size="small"
                placeholder="业务描述"
                multiple
              >
                <el-option label="货款" value="货款"></el-option>
                <el-option label="优惠金额" value="优惠金额"></el-option>
                <el-option label="应收款使用金额" value="应收款使用金额"></el-option>
                <el-option label="实付款发生额" value="实付款发生额"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="cabinetCode" label="">
              <el-input
                v-model.trim="accountSearchForm.cabinetCode"
                size="small"
                placeholder="排柜号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-button native-type="submit" @click="getAccountList" v-show="false"></el-button>
          </el-form>
        </template>
      </avue-crud>

      <avue-crud
        ref="quantityCrud"
        :page="quantityPage"
        :data="quantityTableData"
        :option="quantityTableOption"
        @on-load="getQuantityList"
        @search-change="searchQuantityChange"
        @search-reset="searchQuantityReset"
        @size-change="quantitySizeChange"
        @selection-change="selectionChange"
        v-else-if="reconciliationType == 2"
      >
        <template slot="menuLeft">
          <el-button
            type="primary"
            @click="exportAccount"
            size="small"
            v-if="permissions.finance_purchasereconciliation_export"
            >导 出</el-button
          >
          <el-button type="primary" @click="setOrder" size="small">生成请款单</el-button>
          <!-- <el-dropdown @command="allAndManyOrder" trigger="click" style="margin-left: 10px">
            <el-button type="primary" size="small">生成请款单</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="1">批量生成</el-dropdown-item>
              <el-dropdown-item :command="2">全部生成</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <el-button type="primary" style="margin-left: 10px" @click="setUpSettment" size="small">生成对账单</el-button>
          <el-button type="primary" @click="setUpCost" size="small">生成商业发票</el-button>
          <!-- <el-radio v-model="reconciliationType" label="1"  size="small">按资金</el-radio>
          <el-radio v-model="reconciliationType" label="2"  size="small">按数量</el-radio> -->
        </template>
        <template slot="search">
          <el-form
            @submit.prevent.native
            :model="quantitySearchForm"
            :inline="true"
            ref="quantitySearchForm"
            style="float: left"
          >
            <el-form-item prop="timeArray">
              <el-date-picker
                v-model="quantitySearchForm.timeArray"
                type="daterange"
                size="small"
                start-placeholder="单据开始日期"
                end-placeholder="单据结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="docType">
              <el-select
                v-model="quantitySearchForm.docType"
                collapse-tags
                clearable
                size="small"
                placeholder="单据类型"
              >
                <el-option label="采购入库单" value="采购入库单"></el-option>
                <el-option label="采购退货单" value="采购退货单"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="supplierNo" label="">
              <el-select
                v-model="quantitySearchForm.supplierNo"
                size="small"
                popper-class="y-form-select"
                placeholder="往来单位(供应商)"
                filterable
                clearable
              >
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- currencyArray -->
            <el-form-item label="" prop="currency">
              <el-select v-model="quantitySearchForm.currency" clearable size="small" placeholder="币种">
                <el-option
                  v-for="(item, index) in currencyOptions"
                  :key="index"
                  :label="item.currency"
                  :value="item.currency"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button native-type="submit" @click="searchQuantityChange" v-show="false"></el-button>
          </el-form>
        </template>
        <template slot="searchAdvanced">
          <el-form @submit.prevent.native :model="quantitySearchForm" :inline="true" ref="quantitySearchFormAdvance">
            <el-form-item prop="corporationId" label="">
              <el-select
                size="small"
                v-model="quantitySearchForm.corporationId"
                clearable
                filterable
                placeholder="结算组织(法人主体)"
              >
                <el-option
                  v-for="item in bsecorporationList"
                  :key="item.corporationId"
                  :label="item.corporationName"
                  :value="item.corporationId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="poRequestAccountStatus" label="">
              <el-select
                size="small"
                v-model="quantitySearchForm.poRequestAccountStatus"
                clearable
                filterable
                placeholder="请款状态"
              >
                <el-option label="未请款" value="未请款"></el-option>
                <el-option label="已请款" value="已请款"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="relationNo" label="">
              <el-input
                v-model="quantitySearchForm.relationNo"
                size="small"
                placeholder="采购单号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="docNo" label="">
              <el-input
                v-model="quantitySearchForm.docNo"
                size="small"
                placeholder="单据编号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="warehouseIds" label="">
              <el-select
                v-model="quantitySearchForm.warehouseIds"
                size="small"
                placeholder="入库仓"
                filterable
                clearable
                multiple
              >
                <el-option
                  v-for="item in warehouse"
                  :key="item.warehouseId"
                  :label="item.warehouseName"
                  :value="item.warehouseId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="cabinetCode" label="">
              <el-input
                v-model.trim="quantitySearchForm.cabinetCode"
                size="small"
                placeholder="排柜号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="shippingContainerNo" label="">
              <el-input
                v-model.trim="quantitySearchForm.shippingContainerNo"
                size="small"
                placeholder="出货柜号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="purchaseName" label="">
              <el-input v-model="quantitySearchForm.purchaseName" size="small" placeholder="采购员"></el-input>
            </el-form-item>
            <el-form-item prop="skuCode" label="">
              <el-input v-model="quantitySearchForm.skuCode" size="small" placeholder="SKU" v-search-input></el-input>
            </el-form-item>
            <el-form-item prop="poContractNo" label="">
              <el-input
                v-model="quantitySearchForm.poContractNo"
                size="small"
                placeholder="合同编号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item label="" prop="taxType">
              <el-select v-model="quantitySearchForm.taxType" collapse-tags clearable size="small" placeholder="税别">
                <el-option label="含税" value="1"></el-option>
                <el-option label="非税" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="createDocName" label="">
              <el-input
                v-model="quantitySearchForm.createDocName"
                size="small"
                placeholder="制单员"
                v-search-input
              ></el-input>
            </el-form-item>
            <!-- <el-button native-type="submit" @click="searchQuantityChange" v-show="false"></el-button> -->
          </el-form>
        </template>
        <template slot="tableBeforeSlot">
          <div style="position: relative; font-size: 13px">
            <div style="position: absolute; top: 7px; left: 300px; z-index: 4">
              <span>汇总数量：</span><span>{{ quantityTotal }}</span> <span style="margin-left: 30px">汇总金额：</span
              ><span>{{ amountTotal }}</span>
            </div>
          </div>
        </template>
      </avue-crud>
    </basic-container>

    <!-- 生成请款单 -->
    <el-dialog
      title="生成请款单"
      :visible.sync="qkStatus"
      width="35%"
      @close="cancelOrder"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        @submit.prevent.native
        :model="submitForm"
        :inline="true"
        ref="submitForm"
        :rules="rules"
        label-width="200px"
      >
        <el-row>
          <el-col :span="12" style="margin-bottom: 0">
            <el-form-item prop="expectePaymentTime" label="单据日期：" style="margin-bottom: 14px">
              <el-date-picker
                v-model="submitForm.expectePaymentTime"
                type="date"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 0">
            <el-form-item prop="supplierNo" label="供应商：" style="margin-bottom: 14px">
              <el-select
                v-model="submitForm.supplierNo"
                size="small"
                placeholder="供应商"
                filterable
                clearable
                disabled
              >
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" style="margin-bottom: 0">
            <el-form-item prop="currency" label="付款币种：" style="margin-bottom: 14px">
              <el-select v-model="submitForm.currency" clearable size="small" placeholder="全部" disabled>
                <el-option
                  v-for="(item, index) in currencyOptions"
                  :key="index"
                  :label="item.currency"
                  :value="item.currency"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 0">
            <el-form-item prop="supplierAccountType" label="账号类型：">
              <el-radio-group v-model="submitForm.supplierAccountType">
                <el-radio :label="0">对公</el-radio>
                <el-radio :label="1">对港</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="margin-bottom: 0">
            <el-form-item prop="remark" label="请款说明：" style="margin-bottom: 14px" label-width="153px">
              <el-input v-model="submitForm.remark" size="small" type="textarea" :rows="3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelOrder">取 消</el-button>
        <el-button size="small" type="primary" @click="saveOrder">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPurchaseReconciliationAccountPage,
  getPurchaseReconciliationQuantityPage,
  getPurchaseReconciliationQuantityPageV2,
  checkRequestAccount,
  saveDataV2,
  exportQuantityData,
  createInvoice,
  createStatement,
  saveDataAllQuery
} from "@/api/finance/purchasereconciliation/purchasereconciliation"
import {
  accountTableOption,
  quantityTableOption
} from "@/const/crud/finance/purchasereconciliation/purchasereconciliation"
import { mapGetters } from "vuex"
import { downloadBlob } from "@/util/auth"
import { getAllWarehouse } from "@/api/order/orderRule"
import { getAll as getAllSupplier } from "@/api/supplier/posupplier"
import { getAll as getAllBsecorporation } from "@/api/baseSetup/bsecorporation"
import { getAll as getBseCurrency } from "@/api/baseSetup/bsecurrency"
import { getTokenUrl, getTokenUrlFile } from "@/util/auth"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "purchasereconciliation",
  data() {
    return {
      //搜索条件，和前端控件绑定
      accountSearchForm: {
        timeArray: [],
        startTime: "",
        endTime: "",
        docType: "",
        supplierName: "",
        businessDescriptionArray: [],
        businessDescription: "",
        corporationName: "",
        createUser: "",
        docNo: "",
        poContractNo: "",
        skuCode: "",
        payStatus: ""
      },
      //确定的搜索条件
      accountSearchFormConfirm: {},
      accountTableData: [],
      accountPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },

      accountTableOption: accountTableOption,
      currencyOptions: [],

      reconciliationType: "2",
      quantitySearchForm: {
        timeArray: [],
        startTime: "",
        endTime: "",
        docType: "",
        taxType: "",
        docNo: "",
        poContractNo: "",
        skuCode: "",
        purchaseName: "",
        // currencyArray: [],
        currency: "",
        supplierNo: "",
        corporationId: "",
        purchaseOrderNo: "",
        warehouseId: "",
        cabinetCode: "",
        createName: "",
        createDocName: "",
        poRequestAccountStatus: ""
      },
      //确定的搜索条件
      quantitySearchFormConfirm: {},
      quantityTableData: [],
      quantityPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [20, 30, 40, 50, 100, 500]
      },

      quantityTableOption: quantityTableOption,
      supplierOptions: [],
      bsecorporationList: [],
      warehouse: [],
      qkStatus: false,
      submitForm: {
        requestAccountNo: null,
        discountAmount: 0,
        receiveAccountUsed: 0.0,
        requestAccountType: 2,
        expectePaymentTime: "",
        supplierNo: "",
        requestAccount: "",
        currency: "",
        supplierAccountType: "",
        remark: "",
        purchaseReconciliationByQuantities: []
      },
      selectList: [],
      quantityTotal: 0,
      amountTotal: 0,
      rules: {
        supplierNo: [{ required: true, message: "请选择供应商", trigger: "change" }],
        currency: [{ required: true, message: "请选择付款币种", trigger: "change" }],
        supplierAccountType: [{ required: true, message: "请选择账号类型", trigger: "change" }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() //如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
      setOrderType: 1
    }
  },
  created() {
    getBseCurrency().then(({ data }) => {
      if (data.code == 0) {
        this.currencyOptions = data.data
      }
    })
    //获取供应商
    getAllSupplier().then((res) => {
      if (res.data.code === 0) {
        res.data.data.forEach((item) => {
          this.supplierOptions.push({
            value: item.supplierNo,
            label: item.supplierName
          })
        })
      }
    })
    getAllBsecorporation().then((res) => {
      if (res.data.code === 0) {
        this.bsecorporationList = res.data.data
      }
    })
    getAllWarehouse().then((res) => {
      if (res.data.code === 0) {
        this.warehouse = res.data.data.filter((item) => item.funcState === "1")
        this.mateWarehouse = deepClone(res.data.data)
      }
    })
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    allAndManyOrder(val) {
      this.setOrderType = val
      if (val === 1) {
        this.setOrder()
      }
      if (val === 2) {
        this.setAllOrder()
      }
    },
    setUpCost() {
      if (!this.selectList.length) {
        this.$message.warning("请勾选数据")
        return
      }
      const status = this.selectList.every((item) => {
        return (
          item.corporationId === this.selectList[0].corporationId &&
          item.currency === this.selectList[0].currency &&
          item.supplierNo === this.selectList[0].supplierNo
        )
      })
      if (!status) {
        this.$message.warning("请确保所勾选的数据供应商、法人主体、币种保持一致！")
        return
      }
      const params = {
        purchaseReconciliationByQuantityList: this.selectList,
        supplierNo: this.selectList[0].supplierNo,
        currency: this.selectList[0].currency,
        corporationId: this.selectList[0].corporationId
      }
      createInvoice(params).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("生成商业发票成功")
          this.getQuantityList(this.quantityPage, this.quantitySearchFormConfirm)
          this.$refs.quantityCrud.selectClear()
        }
      })
    },
    setUpSettment() {
      if (!this.selectList.length) {
        this.$message.warning("请勾选数据")
        return
      }
      const status = this.selectList.every((item) => {
        return (
          item.corporationId === this.selectList[0].corporationId &&
          item.currency === this.selectList[0].currency &&
          item.supplierNo === this.selectList[0].supplierNo
        )
      })
      if (!status) {
        this.$message.warning("请确保所勾选的数据供应商、法人主体、币种保持一致！")
        return
      }
      const params = {
        purchaseReconciliationByQuantityList: this.selectList,
        supplierNo: this.selectList[0].supplierNo,
        currency: this.selectList[0].currency,
        corporationId: this.selectList[0].corporationId
      }
      createStatement(params).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("生成供应商对账单成功")
          this.getQuantityList(this.quantityPage, this.quantitySearchFormConfirm)
          this.$refs.quantityCrud.selectClear()
        }
      })
    },
    setAllOrder() {
      if (!this.quantitySearchForm.currency || !this.quantitySearchForm.supplierNo) {
        this.$message.warning("请先选择搜索条件的【往来单位(供应商)和币种】！")
        return
      }
      this.submitForm.currency = this.quantitySearchForm.currency
      this.submitForm.supplierNo = this.quantitySearchForm.supplierNo
      this.qkStatus = true
    },
    setOrder() {
      if (!this.selectList.length) {
        this.$message.warning("请勾选数据")
        return
      }
      checkRequestAccount(this.selectList).then((res) => {
        if (res.data.data) {
          this.submitForm.currency = this.selectList[0].currency
          this.submitForm.supplierNo = this.selectList[0].supplierNo
          this.qkStatus = true
        }
      })
    },
    cancelOrder() {
      this.$refs["submitForm"].resetFields()
      this.submitForm.currency = ""
      this.submitForm.supplierNo = ""
      this.qkStatus = false
      this.getQuantityList(this.quantityPage, this.quantitySearchFormConfirm)
    },
    saveOrder() {
      this.$refs["submitForm"].validate((valid) => {
        if (valid) {
          if (this.setOrderType === 1) {
            this.submitForm.purchaseReconciliationByQuantities = this.selectList
            saveDataV2(this.submitForm).then((res) => {
              if (res.data.code === 0) {
                this.$message.success("批量生成请款单成功")
                this.qkStatus = false
                this.getQuantityList(this.quantityPage, this.quantitySearchFormConfirm)
                this.$refs.quantityCrud.selectClear()
              } else {
                this.$message.error(res.data.msg)
              }
            })
          } else if (this.setOrderType === 2) {
            const params = deepClone(this.quantitySearchForm)
            saveDataAllQuery(Object.assign(params, this.submitForm)).then((res) => {
              if (res.data.code === 0) {
                this.$message.success("全部生成请款单成功")
                this.qkStatus = false
                this.getQuantityList(this.quantityPage, this.quantitySearchFormConfirm)
                this.$refs.quantityCrud.selectClear()
              } else {
                this.$message.error(res.data.msg)
              }
            })
          }
        }
      })
    },
    exportAccount() {
      // if(this.reconciliationType=='1'){
      //   var obj = deepCloneIgnoreNull(this.accountSearchFormConfirm);
      //   var param = '';
      //   var count = 0;
      //   for (var index in obj){
      //       if(count == 0){
      //         param = "?" + index + "=" + obj[index];
      //       }else{
      //         param = param + "&" + index + "=" + obj[index];
      //       }
      //       count ++;
      //   }
      //   this.downloadUrl = getTokenUrlFile(
      //   "/api/finance/purchasereconciliation/exportAccountData" + param);
      //    window.location.href = this.downloadUrl;
      // }else{
      //   var obj = deepCloneIgnoreNull(this.quantitySearchFormConfirm);
      //   var param = '';
      //   var count = 0;
      //   for (var index in obj){
      //       if(count == 0){
      //         param = "?" + index + "=" + obj[index];
      //       }else{
      //         param = param + "&" + index + "=" + obj[index];
      //       }
      //       count ++;
      //   }
      //   this.downloadUrl = getTokenUrlFile(
      //   "/api/finance/purchasereconciliation/exportQuantityData" + param);
      //    window.location.href = this.downloadUrl;
      // }
      exportQuantityData(this.quantitySearchFormConfirm)
        .then((res) => {
          downloadBlob(res.data, "采购对账单导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getAccountList(page, params) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }

      this.accountPage.currentPage = page.currentPage
      getPurchaseReconciliationAccountPage(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.accountSearchFormConfirm
        )
      ).then((response) => {
        this.accountTableData = response.data.data.records
        this.accountPage.total = response.data.data.total
      })
    },
    selectionChange(list, tableSelectListAll) {
      this.selectList = tableSelectListAll

      this.quantityTotal = tableSelectListAll.reduce((pre, cur) => {
        return pre + cur.quantity
      }, 0)
      this.amountTotal = tableSelectListAll
        .reduce((pre, cur) => {
          return pre + cur.goodValue
        }, 0)
        .toFixed(2)
    },

    /**
     * 搜索回调
     */
    searchAccountChange(params, page) {
      this.accountSearchForm.businessDescription = this.accountSearchForm.businessDescriptionArray.join(",")
      if (this.accountSearchForm.timeArray && this.accountSearchForm.timeArray.length == 2) {
        this.accountSearchForm.startTime = this.accountSearchForm.timeArray[0]
        this.accountSearchForm.endTime = this.accountSearchForm.timeArray[1]
      } else {
        this.accountSearchForm.startTime = ""
        this.accountSearchForm.endTime = ""
      }
      //将搜索的条件放入到确认的搜索条件中
      this.accountSearchFormConfirm = deepCloneIgnoreNull(this.accountSearchForm)
      this.getAccountList(page, params)
    },
    searchAccountReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["accountSearchForm"].resetFields()
      if (this.$refs["accountSearchFormAdvance"]) this.$refs["accountSearchFormAdvance"].resetFields()
    },
    // 页大小回调
    accountSizeChange(val) {
      this.accountPage.pageSize = val
    },

    getQuantityList(page, params) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }

      this.quantityPage.currentPage = page.currentPage
      getPurchaseReconciliationQuantityPageV2(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.quantitySearchFormConfirm
        )
      ).then((response) => {
        this.quantityTableData = response.data.data?.ipageData.records
        this.quantityPage.total = response.data.data?.ipageData.total
        // this.quantityTotal = response.data.data.totalQuantity
        // this.amountTotal = response.data.data.totalAmount
      })
    },

    /**
     * 搜索回调
     */
    searchQuantityChange(params, page) {
      // this.quantitySearchForm.currency = this.quantitySearchForm.currencyArray.join(",")
      if (this.quantitySearchForm.timeArray && this.quantitySearchForm.timeArray.length == 2) {
        this.quantitySearchForm.startTime = this.quantitySearchForm.timeArray[0]
        this.quantitySearchForm.endTime = this.quantitySearchForm.timeArray[1]
      } else {
        this.quantitySearchForm.startTime = ""
        this.quantitySearchForm.endTime = ""
      }
      //将搜索的条件放入到确认的搜索条件中
      this.quantitySearchFormConfirm = deepCloneIgnoreNull(this.quantitySearchForm)
      this.getQuantityList(page, params)
    },
    searchQuantityReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["quantitySearchForm"].resetFields()
      if (this.$refs["quantitySearchFormAdvance"]) this.$refs["quantitySearchFormAdvance"].resetFields()
    },
    // 页大小回调
    quantitySizeChange(val) {
      this.quantityPage.pageSize = val
    }
  }
}
</script>
<style lang="scss" scoped></style>
