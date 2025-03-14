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
  退税管理
  -->

<template>
  <div class="execution">
    <!-- <basic-container> -->
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :option="tableDrawtackOption"
      @on-load="getList"
      @refresh-change="refreshChange"
      @search-change="searchChange"
      @search-reset="searchReset"
      @size-change="sizeChange"
      @selection-change="selectionChange"
    >
      <template slot="menuLeft">
        <el-button
          type="primary"
          @click="handleUnPrediction"
          size="small"
          v-if="permissions.financetaxrefundmanage_cancel_prediction"
          >预报撤销</el-button
        >
        <el-button type="primary" @click="confirmReceipt" size="small" v-if="permissions.financetaxrefundmanage_receipt"
          >收款确认</el-button
        >
        <el-button type="primary" @click="handleExport" size="small" v-if="permissions.financetaxrefundmanage_export"
          >导 出</el-button
        >
      </template>

      <template slot-scope="scope" slot="search">
        <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
          <el-form-item prop="customsNumber" label="">
            <el-input v-model="searchForm.customsNumber" size="small" placeholder="海关单号" v-search-input></el-input>
          </el-form-item>
          <el-form-item prop="approveStatus" label="">
            <el-select v-model="searchForm.approveStatus" size="small" placeholder="状态" collapse-tags>
              <el-option v-for="item in approveStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot-scope="scope" slot="searchAdvanced">
        <el-form :model="searchForm" :inline="true" ref="searchFormAdvance">
          <el-form-item prop="value2">
            <el-input v-model="searchForm.value2" size="small" placeholder="此为预留，可删除"></el-input>
          </el-form-item>
        </el-form>
      </template>

      <!-- 报关单号 -->
      <template slot-scope="scope" slot="declareCustomNo">
        <span class="el-row-text">
          <el-tag>
            <a @click="declareCustomNoInfo(scope.row)"> {{ scope.row.declareCustomNo }}</a>
          </el-tag>
        </span>
      </template>

      <!-- 查看日志 -->
      <template slot-scope="scope" slot="operationLog">
        <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row)"></i>
      </template>
    </avue-crud>
    <!-- 报关单-关联信息 -->
    <div>
      <el-dialog title="关联信息" :visible.sync="declareBillDialog" width="50%" height="60%" center>
        <el-table :data="declareBillTableData" height="260" border>
          <el-table-column property="itemNo" label="项号" width="50"></el-table-column>
          <el-table-column property="customsCode" label="海关编号"></el-table-column>
          <el-table-column property="skuCode" label="SKU"></el-table-column>
          <el-table-column property="categoryName" label="品名">
            <template slot-scope="scope">
              <span class="el-row-text" :title="scope.row.categoryName"> {{ scope.row.categoryName }}</span>
            </template>
          </el-table-column>
          <el-table-column property="declareQuantity" label="报关数量" width="90"></el-table-column>
          <el-table-column property="taxAmount" label="含税金额" width="90"></el-table-column>
          <el-table-column property="legalRefundRate" label="退税率" width="76"></el-table-column>
          <el-table-column property="refundTaxAmount" label="退税金额" width="90"></el-table-column>
          <el-table-column property="invoiceNumber" label="发票号">
            <template slot-scope="scope">
              <span class="el-row-text" :title="scope.row.invoiceNumber"> {{ scope.row.invoiceNumber }}</span>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="declareBillDialog = false">关 闭</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 日志 -->
    <operationlog ref="operationlog"></operationlog>
    <!-- </basic-container> -->
  </div>
</template>

<script>
import {
  fetchDrawbackList,
  handleAuditSave,
  getDeclareInfo,
  exportDrawback
} from "@/api/finance/financetaxrefundmanage/financetaxrefundmanage"
import { tableDrawtackOption } from "@/const/crud/finance/financetaxrefundmanage/financetaxrefundmanage"
import operationlog from "@/views/finance/log/index"
import { getUrlConcatToken } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "financetaxrefundmanage",
  data() {
    return {
      //查询相关
      approveStatusOptions: [
        { value: 3, label: "待收款" },
        { value: 4, label: "已收款" }
      ],
      //搜索条件，和前端控件绑定
      searchForm: {
        customsNumber: "",
        approveStatus: []
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableDrawtackOption: tableDrawtackOption,
      selectRows: [],
      //审核相关
      approveForm: {
        fromState: 0,
        toState: 0,
        declareCustomNo: ""
      },
      //报关单-关联信息
      declareBillDialog: false,
      declareBillTableData: []
    }
  },
  components: {
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
      fetchDrawbackList(
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
    handleOperation(fromState, toState, msg) {
      var nos = []
      var declareCustomNos = []
      this.selectRows.forEach((row) => {
        if (row.approveStatus != fromState) {
          nos.push(row.declareCustomNo)
        }
        declareCustomNos.push(row.declareCustomNo)
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
    //预报撤销
    handleUnPrediction() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }
      this.handleOperation(3, 2, "待收款")
    },
    //收款确认
    confirmReceipt() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }
      this.handleOperation(3, 4, "待收款")
    },
    //导出
    handleExport() {
      let par = ""
      if (this.selectRows.length > 0) {
        var keys = []
        this.selectRows.forEach((row) => {
          keys.push(row.declareCustomNo)
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
      window.location = getUrlConcatToken(`/api/finance/financetaxrefundmanage/exportDrawback`) + par
    },
    declareCustomNoInfo(row) {
      var param = {
        declareCustomNo: row.declareCustomNo
      }
      getDeclareInfo(param).then((response) => {
        this.declareBillTableData = response.data.data
        this.declareBillDialog = true
      })
    },
    showOperateLog(row) {
      var declareCustomNo = row.declareCustomNo
      this.$refs.operationlog.showOperateLogDialog(declareCustomNo, 4)
    }
  }
}
</script>

<style lang="scss" scoped></style>
