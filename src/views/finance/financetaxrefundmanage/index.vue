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
  退税预审管理
  -->

<template>
  <div class="execution" id="financetaxrefundmanage">
    <!-- <basic-container> -->
    <avue-crud
      ref="crud"
      class="handle-cell-hidden"
      :page="page"
      :data="tableData"
      :option="tableOption"
      @on-load="getList"
      @refresh-change="refreshChange"
      @search-change="searchChange"
      @search-reset="searchReset"
      @size-change="sizeChange"
      @selection-change="selectionChange"
    >
      <template slot="menuLeft">
        <el-dropdown-button
          type="primary"
          id="multi-el-button"
          size="small"
          buttonText="审 核"
          command="1"
          v-if="permissions.financetaxrefundmanage_audit"
          @command="handleCommand"
        >
          <el-dropdown-item command="2">反审核</el-dropdown-item>
        </el-dropdown-button>
        <el-button
          type="primary"
          @click="handlePrediction"
          size="small"
          v-if="permissions.financetaxrefundmanage_prediction"
          >预 报</el-button
        >
        <el-button type="primary" @click="handleExport" size="small" v-if="permissions.financetaxrefundmanage_export"
          >导 出</el-button
        >
      </template>

      <template slot-scope="scope" slot="search">
        <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
          <el-form-item prop="declareCustomNo" label="">
            <el-input
              v-model="searchForm.declareCustomNo"
              size="small"
              placeholder="报关单号"
              v-search-input
            ></el-input>
          </el-form-item>
          <el-form-item prop="customsNumber" label="">
            <el-input v-model="searchForm.customsNumber" size="small" placeholder="海关单号" v-search-input></el-input>
          </el-form-item>
          <el-form-item prop="invoiceNumber" label="">
            <el-input v-model="searchForm.invoiceNumber" size="small" placeholder="发票号" v-search-input></el-input>
          </el-form-item>
          <el-form-item prop="invoiceStatusList" label="">
            <el-select
              v-model="searchForm.invoiceStatusList"
              size="small"
              placeholder="开票状态"
              collapse-tags
              multiple
            >
              <el-option v-for="item in invoiceStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot-scope="scope" slot="searchAdvanced">
        <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchFormAdvance">
          <el-form-item prop="approveStatusList" label="">
            <el-select v-model="searchForm.approveStatusList" size="small" placeholder="状态" collapse-tags multiple>
              <el-option v-for="item in approveStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="supplierName" label="">
            <el-input v-model="searchForm.supplierName" size="small" placeholder="供应商" v-search-input></el-input>
          </el-form-item>
          <el-form-item prop="declareDateStartAndEnd" label="">
            <el-date-picker
              size="small"
              v-model="searchForm.declareDateStartAndEnd"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="申报开始日期"
              end-placeholder="申报结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="skuCode" label="">
            <el-input v-model="searchForm.skuCode" size="small" placeholder="SKU" v-search-input></el-input>
          </el-form-item>
          <el-form-item prop="categoryName" label="">
            <el-input v-model="searchForm.categoryName" size="small" placeholder="品名" v-search-input></el-input>
          </el-form-item>
          <el-form-item prop="modelName" label="">
            <el-input v-model="searchForm.modelName" size="small" placeholder="型号" v-search-input></el-input>
          </el-form-item>
        </el-form>
      </template>

      <!-- 海关单号 -->
      <template slot-scope="scope" slot="customsNumber">
        <span class="el-row-text">
          <el-tag>
            <a class="el-row-text" @click="customsNumberInfo(scope.row)" :title="scope.row.customsNumber">
              {{ scope.row.customsNumber }}</a
            >
          </el-tag>
        </span>
      </template>

      <!-- 报关数量 -->
      <template slot-scope="scope" slot="declareQuantity">
        <el-tag>
          <a class="el-row-text" @click="declareQuantityInfo(scope.row)"> {{ scope.row.declareQuantity }}</a>
        </el-tag>
      </template>
      <!-- 开票数量 -->
      <template slot-scope="scope" slot="quantityOfInvoice">
        <el-tag>
          <a class="el-row-text" @click="quantityOfInvoiceInfo(scope.row)"> {{ scope.row.quantityOfInvoice }}</a>
        </el-tag>
      </template>

      <!-- 查看日志 -->
      <template slot-scope="scope" slot="operationLog">
        <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row)"></i>
      </template>
    </avue-crud>

    <!-- 申报数量-报关信息 -->
    <div>
      <el-dialog title="报关信息" :visible.sync="declareBillDialog" width="50%" height="60%" center>
        <el-table :data="declareBillTableData" height="260" border>
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column property="purchaseOrderNo" label="采购单号"></el-table-column>
          <el-table-column property="skuCode" label="SKU"></el-table-column>
          <el-table-column property="declareQuantity" label="数量"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="declareBillDialog = false">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 开票数量-发票信息 -->
    <div>
      <el-dialog title="发票信息" :visible.sync="invoiceDialog" width="50%" height="60%" center>
        <el-table :data="invoiceTableData" height="260" border>
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column property="invoiceNumber" label="发票号"></el-table-column>
          <el-table-column property="quantityOfInvoice" label="数量"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="invoiceDialog = false">关 闭</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 预览 -->
    <pdfdownlook ref="pdfDownLook" :download="true"></pdfdownlook>
    <!-- 日志 -->
    <operationlog ref="operationlog"></operationlog>
    <!-- </basic-container> -->
  </div>
</template>

<script>
import {
  fetchList,
  handleAuditSave,
  getDeclareCustomInfo,
  getInvoiceInfo,
  exportTaxRefund
} from "@/api/finance/financetaxrefundmanage/financetaxrefundmanage"
import { tableOption } from "@/const/crud/finance/financetaxrefundmanage/financetaxrefundmanage"
import pdfdownlook from "@/components/yvue/pdf/index"
import { getUrlConcatToken } from "@/util/auth"
import operationlog from "@/views/finance/log/index"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "financetaxrefundmanage",
  data() {
    return {
      //查询相关
      invoiceStatusOptions: [
        { value: "未开票", label: "未开票" },
        { value: "部分开票", label: "部分开票" },
        { value: "全部开票", label: "全部开票" }
      ],
      approveStatusOptions: [
        { value: 1, label: "未审核" },
        { value: 2, label: "待预报" },
        { value: 3, label: "待收款" },
        { value: 4, label: "已收款" }
      ],
      //搜索条件，和前端控件绑定
      searchForm: {
        declareCustomNo: "",
        customsNumber: "",
        invoiceNumber: "",
        invoiceStatusList: [],
        approveStatusList: [],
        supplierName: "",
        declareDateStartAndEnd: "",
        skuCode: "",
        categoryName: "",
        modelName: ""
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
      //审核相关
      approveForm: {
        fromState: 0,
        toState: 0,
        declareCustomNo: ""
      },
      //申报数量-报关信息 相关
      declareBillDialog: false,
      declareBillTableData: [],
      //开票数量-发票信息
      invoiceDialog: false,
      invoiceTableData: []
    }
  },
  components: {
    pdfdownlook,
    operationlog
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    /**  刷新回调 */
    refreshChange() {
      this.getList(this.page)
    },
    /** 搜索回调 */
    searchChange(params, page) {
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      page = page || { currentPage: 1 }
      this.getList(page, params)
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    },
    clearSelectClear() {
      // this.$refs.crud.selectClear();
      this.$refs.crud.toggleSelection()
    },
    getList(page, params) {
      // this.page.currentPage=page.currentPage;
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
    handleCommand(command) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }
      if (command == "1") {
        //审核通过
        this.handleOperation(1, 2, "未审核")
      } else {
        //反审核
        this.handleOperation(2, 1, "待预报")
      }
    },
    handleOperation(fromState, toState, msg) {
      var nos = []
      var declareCustomNos = []
      this.selectRows.forEach((row) => {
        if (row.approveStatus != fromState && !nos.includes(row.declareCustomNo)) {
          nos.push(row.declareCustomNo)
        }
        if (!declareCustomNos.includes(row.declareCustomNo)) {
          declareCustomNos.push(row.declareCustomNo)
        }
      })
      if (nos.length > 0) {
        this.$message.warning("报关单:" + nos + "不是" + msg + "状态，请选择" + msg + "单据操作")
        return
      }
      this.approveForm = {
        fromState: fromState,
        toState: toState,
        declareCustomNo: declareCustomNos.join(",")
      }

      var _this = this
      this.$confirm("是否继续此操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //请求后端接口
          handleAuditSave(this.approveForm)
            .then((response) => {
              if (response.data.code == 0) {
                _this.$message.success("操作成功")
                _this.clearSelectClear()
                _this.refreshChange()
                _this.auditDialog = false
              } else if (response.data.code == 1) {
                _this.$message.warning(response.data.msg)
                return
              } else {
                _this.$message.error("操作失败")
                return
              }
            })
            .catch(() => {
              _this.$message.error("操作失败")
              return
            })
        })
        .catch(() => {})
    },
    //预报
    handlePrediction() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }
      this.handleOperation(2, 3, "待预报")
    },
    //导出
    handleExport() {
      let par = ""
      if (this.selectRows.length > 0) {
        var keys = []
        this.selectRows.forEach((row) => {
          keys.push(row.declareCustomNo + "/" + row.itemNo)
        })
        par += "&selectKeys=" + keys
      } else {
        Object.keys(this.searchFormConfirm).forEach((key) => {
          if (this.searchFormConfirm[key]) {
            par += "&" + key + "=" + this.searchFormConfirm[key]
          }
        })
      }

      this.$notify({
        title: "成功",
        message: "正在导出（注意：最多可导出6W条数据）",
        type: "success",
        duration: 2000
      })

      window.location = getUrlConcatToken(`/api/finance/financetaxrefundmanage/exportTaxRefund`) + par
    },
    //海关单号
    customsNumberInfo(row) {
      if (!row.annexFileAddr) {
        this.$message.warning("附件为空")
        return
      }
      this.$refs.pdfDownLook.pdfFn(row.annexFileAddr)
    },
    declareQuantityInfo(row) {
      var param = {
        declareCustomNo: row.declareCustomNo,
        itemNo: row.itemNo
      }
      getDeclareCustomInfo(param).then((response) => {
        this.declareBillTableData = response.data.data
        this.declareBillDialog = true
      })
    },
    quantityOfInvoiceInfo(row) {
      var param = {
        declareCustomNo: row.declareCustomNo,
        itemNo: row.itemNo
      }
      getInvoiceInfo(param).then((response) => {
        this.invoiceTableData = response.data.data
        this.invoiceDialog = true
      })
    },
    showOperateLog(row) {
      var declareCustomNo = row.declareCustomNo
      this.$refs.operationlog.showOperateLogDialog(declareCustomNo, 3)
    }
  }
}
</script>

<style lang="scss">
#financetaxrefundmanage {
  #multi-el-button {
    margin-right: 10px;
  }
}
</style>
