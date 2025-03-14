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
  <div class="podeliveryplan" id="podeliveryplan">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="rowDel"
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-button type="primary" @click="deletePlan" size="small" v-if="permissions.purchase_podeliveryplan_delete"
            >删除</el-button
          >
          <el-button type="primary" @click="submitPlan" size="small" v-if="permissions.purchase_podeliveryplan_submit"
            >提交</el-button
          >
          <el-button
            type="primary"
            @click="confirmPlan"
            size="small"
            v-if="permissions.purchase_podeliveryplan_confirmPlan"
            >确认计划</el-button
          >
          <el-button
            type="primary"
            @click="cancelConfirm"
            size="small"
            v-if="permissions.purchase_podeliveryplan_cancelConfirm"
            >撤销确认</el-button
          >
          <el-button
            type="primary"
            @click="rejectPlan"
            size="small"
            v-if="permissions.purchase_podeliveryplan_rejectPlan"
            >拒绝计划</el-button
          >
          <el-button type="primary" @click="remarks" size="small" v-if="permissions.purchase_podeliveryplan_remarks"
            >备 注</el-button
          >
          <el-button type="primary" @click="exportData" size="small" v-if="permissions.purchase_podeliveryplan_export"
            >导 出</el-button
          >
          <el-button
            type="primary"
            @click="createDeliveyPlan"
            size="small"
            v-if="permissions.purchase_podeliveryplan_createPlan"
            >制作交货计划</el-button
          >
          <el-button type="primary" @click="forceEnd" size="small" v-if="permissions.purchase_podeliveryplan_forceEnd"
            >强制完结</el-button
          >
        </template>
        <template slot="remarks" slot-scope="scope">
          <a @click="showRemarks(scope.row)">查看</a>
        </template>

        <template slot="purchaseConfirmStatus" slot-scope="scope">
          <a @click="showOperateLog(scope.row.deliveryPlanId)">{{ formatData(scope.row.purchaseConfirmStatus) }}</a>
        </template>

        <template slot="deliveryStatus" slot-scope="scope">
          <a @click="showDeliveryInfo(scope.row.deliveryPlanNo)">{{
            formatDeliveryStatus(scope.row.deliveryStatus)
          }}</a>
        </template>

        <template slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="submitTime">
              <el-date-picker
                v-model="searchForm.submitTime"
                type="daterange"
                size="small"
                start-placeholder="提交开始日期"
                end-placeholder="提交结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="deliveryPlanNo">
              <el-input
                v-model.trim="searchForm.deliveryPlanNo"
                size="small"
                placeholder="交货计划单号,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="requisitionNo">
              <el-input
                v-model.trim="searchForm.requisitionNo"
                size="small"
                placeholder="请购单号,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="skuCode">
              <el-input
                v-model.trim="searchForm.skuCode"
                size="small"
                placeholder="SKU,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>
        <template slot="searchAdvanced">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="platformSkuCode">
              <el-input
                v-model.trim="searchForm.platformSkuCode"
                size="small"
                placeholder="平台SKU,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="purchaseOrderNo">
              <el-input
                v-model.trim="searchForm.purchaseOrderNo"
                size="small"
                placeholder="采购单号,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="poContractNo">
              <el-input
                v-model.trim="searchForm.poContractNo"
                size="small"
                placeholder="合同编号,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="purchaseUserName">
              <el-input
                v-model.trim="searchForm.purchaseUserName"
                size="small"
                placeholder="采购员"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="requisitionUserName">
              <el-input
                v-model.trim="searchForm.requisitionUserName"
                size="small"
                placeholder="销售员"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="statusArray" collapse-tags clearable size="small" placeholder="采购确认状态" multiple>
                <el-option label="未处理" value="0"></el-option>
                <el-option label="待确认" value="1"></el-option>
                <el-option label="已确认" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="deliveryStatusArray"
                collapse-tags
                clearable
                size="small"
                placeholder="送货状态"
                multiple
              >
                <el-option label="未送货" value="0"></el-option>
                <el-option label="部分送货" value="1"></el-option>
                <el-option label="全部送货" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="supplierName">
              <el-select v-model="searchForm.supplierName" size="small" placeholder="供应商" filterable>
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="saleGroupArray" clearable collapse-tags size="small" placeholder="销售小组" multiple>
                <el-option
                  v-for="item in saleGroupOptions"
                  :key="item.groupId"
                  :label="item.name"
                  :value="item.groupId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>
      </avue-crud>

      <el-dialog title="采购备注" :visible.sync="remarksDialog" width="35%">
        <el-input
          type="textarea"
          :rows="4"
          :maxlength="200"
          placeholder="不得超过200个字符"
          v-model.trim="remarksContent"
        ></el-input>
        <span slot="footer">
          <el-button size="small" type="primary" @click="remarkConfirm">确认</el-button>
        </span>
      </el-dialog>

      <el-dialog title="查看备注" :visible.sync="showRemarksDialog" class="showRemarks">
        <el-row v-for="(k, v) in remarkList" :key="v">
          <el-col style="text-align: left; color: #999">{{ k.createTime }} 备注:</el-col>
          <el-col style="text-align: left; padding-left: 15px">{{ k.remark }}</el-col>
        </el-row>
      </el-dialog>

      <el-dialog title="查看送货信息" :visible.sync="showDeliveryInfoDialog">
        <avue-crud
          :data="deliveryInfoData"
          :option="deliveryInfoOptions"
          :page="deliveryInfoPage"
          @current-change="deliveryInfoCurrentChange"
        >
        </avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDeliveryInfoDialog = false" size="small">关闭</el-button>
        </span>
      </el-dialog>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  changeStatus,
  insertRemarks,
  getRemarks,
  getDeliveryDetail,
  updateDeliveryStateEndForce,
  getUserSaleGroup
} from "@/api/purchase/podeliveryplan"
import { tableOption, deliveryInfoOptions } from "@/const/crud/purchase/podeliveryplan"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getTokenUrlFile, getTokenUrl } from "@/util/auth"
import operationlog from "@/views/purchase/log/index"
import { getAll as getAllSupplierApi } from "@/api/supplier/posupplier"

export default {
  name: "podeliveryplan",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        submitTime: [],
        submitTimeStart: "",
        submitTimeEnd: "",
        requisitionNo: "",
        platformSkuCode: "",
        purchaseConfirmStatus: "",
        skuCode: "",
        purchaseOrderNo: "",
        poContractNo: "",
        requisitionUserName: "",
        purchaseUserName: "",
        deliveryPlanNo: "",
        deliveryStatusArra: "",
        supplierName: "",
        saleGroup: ""
      },
      saleGroupArray: [],
      deliveryStatusArray: [],
      statusArray: [],
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },

      tableOption: tableOption,
      selectList: [],
      remarksDialog: false,
      remarksContent: "",
      showRemarksDialog: false,
      remarkList: [],
      showDeliveryInfoDialog: false,
      deliveryInfoData: [],
      deliveryInfoOptions: deliveryInfoOptions,
      deliveryInfoPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      selectDeliveryPlanNo: "",
      saleGroupOptions: [],
      supplierOptions: []
    }
  },
  created() {
    getUserSaleGroup().then(({ data }) => {
      if (data.code == 0) {
        this.saleGroupOptions = data.data
      }
    })
  },
  mounted: function () {
    this.getSupplierAll()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  components: {
    operationlog
  },
  methods: {
    formatData(id) {
      const obj = {
        0: "未处理",
        1: "待确认",
        2: "已确认"
      }
      return obj[id]
    },
    formatDeliveryStatus(id) {
      const obj = {
        0: "未送货",
        1: "部分送货",
        2: "全部送货"
      }
      return obj[id]
    },
    showDeliveryInfo(deliveryPlanNo) {
      this.selectDeliveryPlanNo = deliveryPlanNo
      this.deliveryInfoCurrentChange(this.deliveryInfoPage.currentPage)
    },
    deliveryInfoCurrentChange(page) {
      console.info()
      getDeliveryDetail({
        current: page,
        size: page.pageSize,
        deliveryPlanNo: this.selectDeliveryPlanNo
      }).then(({ data }) => {
        if (data.code == 0) {
          if (data.data == null || data.data.total == 0) {
            this.$message.info("未查询到送货信息")
            return
          }
          this.deliveryInfoData = data.data.records
          this.deliveryInfoPage.total = data.data.total
          this.showDeliveryInfoDialog = true
        } else {
          this.$message.info("查询送货信息出错")
          return
        }
      })
    },
    // 查看日志
    showOperateLog(deliveryPlanId) {
      this.$refs.operationlog.showOperateLogDialog(deliveryPlanId, 20)
    },
    selectionChange(list) {
      this.selectList = list
    },
    deletePlan() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var deliveryPlanIdArray = []
      for (var i = 0; i < this.selectList.length; i++) {
        var purchaseConfirmStatus = this.selectList[i].purchaseConfirmStatus
        if (purchaseConfirmStatus != 0) {
          this.$message.error("存在状态不是未处理的数据，请检查")
          return false
        }
        deliveryPlanIdArray.push(this.selectList[i].deliveryPlanId)
      }
      var params = {
        type: 4,
        deliveryPlanIds: deliveryPlanIdArray.join(","),
        newStatus: 0,
        info: "存在状态不是未处理或者已经删除的数据，请检查",
        log: "提交交货计划"
      }

      changeStatus(params)
        .then(({ data }) => {
          if (data.code == 0) {
            this.$refs.crud.selectClear()
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success"
            })
            this.getList(this.page)
          } else if (data.code == 1 && data.msg) {
            this.$message.error(data.msg)
          } else {
            this.$message.error("删除失败")
          }
        })
        .finally(() => {})
    },
    submitPlan() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var deliveryPlanIdArray = []
      for (var i = 0; i < this.selectList.length; i++) {
        var purchaseConfirmStatus = this.selectList[i].purchaseConfirmStatus
        if (purchaseConfirmStatus != 0) {
          this.$message.error("存在状态不是未处理的数据，请检查")
          return false
        }
        deliveryPlanIdArray.push(this.selectList[i].deliveryPlanId)
      }
      var params = {
        type: 3,
        deliveryPlanIds: deliveryPlanIdArray.join(","),
        newStatus: 1,
        info: "存在状态不是未处理或者已经删除的数据，请检查",
        log: "提交交货计划"
      }

      changeStatus(params)
        .then(({ data }) => {
          if (data.code == 0) {
            this.$refs.crud.selectClear()
            this.$message({
              showClose: true,
              message: "提交成功",
              type: "success"
            })
            this.getList(this.page)
          } else if (data.code == 1 && data.msg) {
            this.$message.error(data.msg)
          } else {
            this.$message.error("提交失败")
          }
        })
        .finally(() => {})
    },
    confirmPlan() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var deliveryPlanIdArray = []
      for (var i = 0; i < this.selectList.length; i++) {
        var purchaseConfirmStatus = this.selectList[i].purchaseConfirmStatus
        if (!purchaseConfirmStatus || purchaseConfirmStatus != 1) {
          this.$message.error("存在状态不是待确认的数据，请检查")
          return false
        }
        deliveryPlanIdArray.push(this.selectList[i].deliveryPlanId)
      }
      var params = {
        type: 0,
        deliveryPlanIds: deliveryPlanIdArray.join(","),
        newStatus: 2,
        info: "存在状态不是待确认或者已经删除的数据，请检查",
        log: "确认计划"
      }

      changeStatus(params)
        .then(({ data }) => {
          if (data.code == 0) {
            this.$refs.crud.selectClear()
            this.$message({
              showClose: true,
              message: "确认计划成功",
              type: "success"
            })
            this.getList(this.page)
          } else if (data.code == 1 && data.msg) {
            this.$message.error(data.msg)
          } else {
            this.$message.error("确认计划失败")
          }
        })
        .finally(() => {})
    },
    cancelConfirm() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var deliveryPlanIdArray = []
      for (var i = 0; i < this.selectList.length; i++) {
        var purchaseConfirmStatus = this.selectList[i].purchaseConfirmStatus
        if (!purchaseConfirmStatus || purchaseConfirmStatus != 2) {
          this.$message.error("存在状态不是已确认的数据，请检查")
          return false
        }
        deliveryPlanIdArray.push(this.selectList[i].deliveryPlanId)
      }
      var params = {
        type: 1,
        deliveryPlanIds: deliveryPlanIdArray.join(","),
        newStatus: 1,
        info: "存在状态不是已确认或者已经删除的数据，请检查",
        log: "撤销确认"
      }

      changeStatus(params)
        .then(({ data }) => {
          if (data.code == 0) {
            this.$refs.crud.selectClear()
            this.$message({
              showClose: true,
              message: "撤销确认成功",
              type: "success"
            })
            this.getList(this.page)
          } else if (data.code == 1 && data.msg) {
            this.$message.error(data.msg)
          } else {
            this.$message.error("撤销确认失败")
          }
        })
        .finally(() => {})
    },
    // 强制完结
    forceEnd() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var deliveryPlanNoArray = []
      for (var i = 0; i < this.selectList.length; i++) {
        var deliveryStatus = this.selectList[i].deliveryStatus
        if (deliveryStatus != "1") {
          this.$message.error("存在送货状态不是部分送货的数据，请检查")
          return false
        }
        deliveryPlanNoArray.push(this.selectList[i].deliveryPlanNo)
      }
      var params = { deliveryPlanNos: deliveryPlanNoArray.join(",") }
      this.$confirm("确定强制完结选中的交货计划吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          updateDeliveryStateEndForce(params)
            .then(({ data }) => {
              if (data.code == 0) {
                this.$refs.crud.selectClear()
                this.$message({
                  showClose: true,
                  message: "强制完结成功",
                  type: "success"
                })
                this.getList(this.page)
              } else if (data.code == 1 && data.msg) {
                this.$message.error(data.msg)
              } else {
                this.$message.error("强制完结失败")
              }
            })
            .finally(() => {})
        })
        .catch((res) => {})
    },
    rejectPlan() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var deliveryPlanIdArray = []
      for (var i = 0; i < this.selectList.length; i++) {
        var purchaseConfirmStatus = this.selectList[i].purchaseConfirmStatus
        if (!purchaseConfirmStatus || purchaseConfirmStatus != 1) {
          this.$message.error("存在状态不是待确认的数据，请检查")
          return false
        }
        deliveryPlanIdArray.push(this.selectList[i].deliveryPlanId)
      }
      var params = {
        type: 2,
        deliveryPlanIds: deliveryPlanIdArray.join(","),
        newStatus: 0,
        info: "存在状态不是待确认或者已经删除的数据，请检查",
        log: "拒绝计划"
      }

      changeStatus(params)
        .then(({ data }) => {
          if (data.code == 0) {
            this.$refs.crud.selectClear()
            this.$message({
              showClose: true,
              message: "拒绝计划成功",
              type: "success"
            })
            this.getList(this.page)
          } else if (data.code == 1 && data.msg) {
            this.$message.error(data.msg)
          } else {
            this.$message.error("拒绝计划失败")
          }
        })
        .finally(() => {})
    },
    remarks() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      this.remarksContent = ""
      this.remarksDialog = true
    },
    remarkConfirm() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var deliveryPlanIdArray = []
      for (var i = 0; i < this.selectList.length; i++) {
        deliveryPlanIdArray.push(this.selectList[i].deliveryPlanId)
      }
      if (!this.remarksContent || this.remarksContent == "") {
        this.$message.error("采购备注不能为空")
        return
      }

      insertRemarks({
        deliveryPlanIds: deliveryPlanIdArray.join(","),
        remarks: this.remarksContent
      })
        .then(({ data }) => {
          if (data.code == 0) {
            this.$refs.crud.selectClear()
            this.$message({
              showClose: true,
              message: "添加备注成功",
              type: "success"
            })
            this.remarksDialog = false
          } else if (data.code == 1 && data.msg) {
            this.$message.error(data.msg)
          } else {
            this.$message.error("添加备注失败")
          }
        })
        .finally(() => {})
    },
    showRemarks(row) {
      var deliveryPlanId = row.deliveryPlanId
      getRemarks(deliveryPlanId).then(({ data }) => {
        if (data.code == 0) {
          this.remarkList = data.data
          if (data.data && data.data.length > 0) {
            this.showRemarksDialog = true
          } else {
            this.$message({
              showClose: true,
              message: "暂无备注信息"
            })
          }
        } else if (data.code == 1) {
          this.$message.error("查询备注信息失败")
        }
      })
    },
    exportData() {
      if (!this.selectList || this.selectList.length == 0) {
        var submitTimeStart = this.searchFormConfirm.submitTimeStart
        var submitTimeEnd = this.searchFormConfirm.submitTimeEnd
        var requisitionNo = this.searchFormConfirm.requisitionNo
        var platformSkuCode = this.searchFormConfirm.platformSkuCode
        var purchaseConfirmStatus = this.searchFormConfirm.purchaseConfirmStatus
        var skuCode = this.searchFormConfirm.skuCode
        var purchaseOrderNo = this.searchFormConfirm.purchaseOrderNo
        var poContractNo = this.searchFormConfirm.poContractNo
        var requisitionUserName = this.searchFormConfirm.requisitionUserName
        var purchaseUserName = this.searchFormConfirm.purchaseUserName
        var deliveryPlanNo = this.searchFormConfirm.deliveryPlanNo
        var deliveryStatus = this.searchFormConfirm.deliveryStatus
        var supplierName = this.searchFormConfirm.supplierName
        var saleGroup = this.searchFormConfirm.saleGroup
        if (!submitTimeStart) {
          submitTimeStart = ""
        }
        if (!submitTimeEnd) {
          submitTimeEnd = ""
        }
        if (!requisitionNo) {
          requisitionNo = ""
        }
        if (!platformSkuCode) {
          platformSkuCode = ""
        }
        if (!purchaseConfirmStatus) {
          purchaseConfirmStatus = ""
        }
        if (!skuCode) {
          skuCode = ""
        }
        if (!purchaseOrderNo) {
          purchaseOrderNo = ""
        }
        if (!poContractNo) {
          poContractNo = ""
        }
        if (!requisitionUserName) {
          requisitionUserName = ""
        }
        if (!purchaseUserName) {
          purchaseUserName = ""
        }
        if (!deliveryPlanNo) {
          deliveryPlanNo = ""
        }
        if (!deliveryStatus) {
          deliveryStatus = ""
        }
        if (!supplierName) {
          supplierName = ""
        }
        if (!saleGroup) {
          saleGroup = ""
        }

        this.downloadUrl = getTokenUrlFile(
          "/api/purchase/podeliveryplan/download?submitTimeStart=" +
            submitTimeStart +
            "&submitTimeEnd=" +
            submitTimeEnd +
            "&requisitionNo=" +
            requisitionNo +
            "&platformSkuCode=" +
            platformSkuCode +
            "&purchaseConfirmStatus=" +
            purchaseConfirmStatus +
            "&skuCode=" +
            skuCode +
            "&purchaseOrderNo=" +
            purchaseOrderNo +
            "&poContractNo=" +
            poContractNo +
            "&requisitionUserName=" +
            requisitionUserName +
            "&purchaseUserName=" +
            purchaseUserName +
            "&deliveryPlanNo=" +
            deliveryPlanNo +
            "&deliveryStatus=" +
            deliveryStatus +
            "&supplierName=" +
            supplierName +
            "&saleGroup=" +
            saleGroup
        )
        window.location.href = this.downloadUrl
      } else {
        var deliveryPlanIdArray = []
        for (var i = 0; i < this.selectList.length; i++) {
          var purchaseConfirmStatus = this.selectList[i].purchaseConfirmStatus
          deliveryPlanIdArray.push(this.selectList[i].deliveryPlanId)
        }
        var deliveryPlanIds = deliveryPlanIdArray.join(",")
        this.downloadUrl = getTokenUrlFile("/api/purchase/podeliveryplan/download?deliveryPlanIds=" + deliveryPlanIds)
        window.location.href = this.downloadUrl
      }
    },
    createDeliveyPlan() {
      this.$router.push({
        path: "/createDeliveryPlan/index",
        query: {}
      })
    },
    getList(page, params) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }

      this.page.currentPage = page.currentPage
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchFormConfirm
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    /**
     * @title 打开新增窗口
     * @detail 调用crud的handleadd方法即可
     *
     **/
    handleAdd: function () {
      this.$refs.crud.rowAdd()
    },
    handleEdit(row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    handleDel(row, index) {
      this.$refs.crud.rowDel(row, index)
    },
    rowDel: function (row, index) {
      var _this = this
      this.$confirm("是否确认删除ID为" + row.deliveryPlanId, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.deliveryPlanId)
        })
        .then((data) => {
          _this.tableData.splice(index, 1)
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          })
          this.getList(this.page)
        })
        .catch(function (err) {})
    },
    /**
     * @title 数据更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     *
     **/
    handleUpdate: function (row, index, done) {
      putObj(row).then((data) => {
        this.tableData.splice(index, 1, Object.assign({}, row))
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        })
        done()
        this.getList(this.page)
      })
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    handleSave: function (row, done) {
      addObj(row).then((data) => {
        this.tableData.push(Object.assign({}, row))
        this.$message({
          showClose: true,
          message: "添加成功",
          type: "success"
        })
        done()
        this.getList(this.page)
      })
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page)
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      this.searchForm.purchaseConfirmStatus = this.statusArray.join(",")
      this.searchForm.deliveryStatus = this.deliveryStatusArray.join(",")
      this.searchForm.saleGroup = this.saleGroupArray.join(",")
      if (this.searchForm.submitTime && this.searchForm.submitTime.length == 2) {
        this.searchForm.submitTimeStart = this.searchForm.submitTime[0]
        this.searchForm.submitTimeEnd = this.searchForm.submitTime[1]
      } else {
        this.searchForm.submitTimeStart = ""
        this.searchForm.submitTimeEnd = ""
      }
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(page, params)
    },
    searchReset() {
      this.statusArray = []
      this.deliveryStatusArray = []
      this.saleGroupArray = []
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
    },
    //获取供应商
    async getSupplierAll() {
      const { data } = await getAllSupplierApi()
      if (data.code === 0) {
        data.data.forEach((item) => {
          this.supplierOptions.push({
            value: item.supplierName,
            label: item.supplierName
          })
        })
      }
    }
  }
}
</script>

<style lang="scss">
#podeliveryplan {
  .showRemarks {
    .el-dialog__body {
      max-height: 550px;
      overflow-y: auto;
      overflow-x: hidden;
      word-wrap: break-word;
    }
  }
}
</style>
