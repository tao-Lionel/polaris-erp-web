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
<!--发票池-->
<template>
  <div class="execution" id="purchaseinvoice">
    <basic-container>
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
          <el-button type="primary" @click="invoicepoolAudit" size="small" v-if="permissions.invoicepool_audit"
            >审核</el-button
          >
          <el-button type="primary" @click="exportList" size="small" v-if="permissions.invoicepool_export"
            >导出</el-button
          >
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="invoiceNumber" label="">
              <el-input v-model="searchForm.invoiceNumber" size="small" placeholder="发票号" v-search-input></el-input>
            </el-form-item>

            <!-- <el-form-item prop="enterStartTime" label="录入日期">
              <el-date-picker
                v-model="searchForm.enterStartTime"
                type="date"
                size="small"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item> -->

            <el-form-item prop="enterStartTime" label="">
              <el-date-picker
                size="small"
                v-model="searchForm.enterStartTime"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="录入开始日期"
                end-placeholder="录入结束日期"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item prop="approveStatus" label="">
              <el-select v-model="searchForm.approveStatus" size="small" placeholder="审核状态" collapse-tags>
                <el-option
                  v-for="item in approveStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot-scope="scope" slot="searchAdvanced">
          <el-form @submit.native.prevent :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="supplierName" label="">
              <el-input v-model="searchForm.supplierName" size="small" placeholder="供应商" v-search-input></el-input>
            </el-form-item>
            <el-form-item prop="skuCode" label="">
              <el-input v-model="searchForm.skuCode" size="small" placeholder="SKU" v-search-input></el-input>
            </el-form-item>
          </el-form>
        </template>

        <!-- 关联单据 -->
        <template slot-scope="scope" slot="relationNum">
          <!-- <el-tag > -->
          <a class="el-row-text" @click="relationBillByInvoiceId(scope.row)"> {{ scope.row.relationNum }}</a>
          <!-- </el-tag>     -->
        </template>

        <!-- 查看日志 -->
        <template slot-scope="scope" slot="operationLog">
          <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row)"></i>
        </template>
      </avue-crud>

      <!-- 审核 -->
      <el-dialog v-bind:title="auditTitle" :visible.sync="auditDialog" width="30%">
        <el-input
          type="textarea"
          :rows="5"
          :maxlength="100"
          placeholder="请填写拒绝原因，不得超过100个字符。拒绝，必填"
          v-model="auditTextarea"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="info" size="small" @click="dialogResult(false)">拒 绝</el-button>
          <el-button type="primary" size="small" @click="dialogResult(true)">通 过</el-button>
        </span>
      </el-dialog>

      <!-- 关联单据详情 -->
      <div>
        <el-dialog title="关联详情" :visible.sync="relationBillDialog" width="60%" height="60%" center>
          <avue-crud
            ref="crud"
            class="app-container close-table-select"
            :data="relationBillTableData"
            :option="relationBillTableOption"
          >
            <template slot="relationCustomBill" slot-scope="scope">
              <a @click="outQuantityShow(scope.row)">点击查看报关单号</a>
            </template>
          </avue-crud>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="relationBillDialog = false">关 闭</el-button>
          </span>
        </el-dialog>
      </div>

      <!-- 关联单据的报关单号详情 -->
      <outQuantityInfo :is-show-out-quantity="false" ref="outQuantityInfo"></outQuantityInfo>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, handleAudit, relationBillByInvoiceId } from "@/api/finance/invoicepool/invoicepool"
import { tableOption, relationBillTableOption } from "@/const/crud/finance/invoicepool/invoicepool"
import outQuantityInfo from "@/views/finance/purchaseinvoice/outQuantityInfo"
import operationlog from "@/views/finance/log/index"
import { preventShake } from "@/util/tool"
import { getUrlConcatToken } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"

export default {
  name: "purchaseinvoice",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        invoiceNumber: "",
        enterStartTime: "",
        approveStatus: "",
        skuCode: ""
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
      //报关数量相关
      relationBillDialog: false,
      relationBillTableOption: relationBillTableOption,
      relationBillTableData: [],
      //审核相关
      approveStatusOptions: [
        { value: 1, label: "待审核" },
        { value: 2, label: "已审核" }
      ],
      auditTitle: "审核",
      auditDialog: false,
      auditType: "1",
      auditTextarea: null,
      //查看关联单据中报关详情的发票id
      showCusByInvoiceId: -1
    }
  },
  components: {
    outQuantityInfo,
    operationlog
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
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
    /** 审核*/
    invoicepoolAudit() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请选择数据")
        return
      }
      //已审核数据不能再审
      let faildata = []
      this.selectRows.forEach((obj) => {
        if (obj.approveStatus == 2) {
          faildata.push(obj.invoiceNumber)
        }
      })
      if (faildata.length > 0) {
        this.$message.warning("发票号:" + faildata + "，已审核过，不能重新审核")
        return
      }

      this.auditType = "1"
      this.auditTextarea = ""
      // this.auditDialog = true;

      //直接通过
      let ids = []
      this.selectRows.filter((obj) => {
        ids.push(obj.purchaseInvoiceId)
      })
      var _this = this
      var obj = {
        purchaseInvoiceIds: ids,
        confirmType: this.auditType,
        message: this.auditTextarea
      }

      this.$confirm("是否继续此操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          handleAudit(obj)
            .then((response) => {
              if (response.data.code == 0) {
                _this.$message.success("审核成功")
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

      // preventShake.preventShake(bool => {
      //   if (bool) {

      //   }
      // });
    },
    //dialog样式修改后添加
    dialogResult(dialogFlage) {
      if (dialogFlage) {
        this.auditType = 1
      } else {
        this.auditType = 2
      }
      this.handleAuditSave()
    },
    handleAuditSave() {
      if (this.auditType == "2" && !this.auditTextarea && this.auditTextarea.trim() == "") {
        this.$message.warning("请填写拒绝原因")
        return
      }
      let ids = []
      this.selectRows.filter((obj) => {
        ids.push(obj.purchaseInvoiceId)
      })
      var _this = this
      var obj = {
        purchaseInvoiceIds: ids,
        confirmType: this.auditType,
        message: this.auditTextarea
      }
      preventShake.preventShake((bool) => {
        if (bool) {
          handleAudit(obj)
            .then((response) => {
              if (response.data.code == 0) {
                _this.$message.success("审核成功")
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
        }
      })
    },
    //关联单据，根据发票id查询
    relationBillByInvoiceId(row) {
      if (!row) {
        this.$message.warning("选择数据不存在")
        return
      }
      console.log(row)
      this.showCusByInvoiceId = row.purchaseInvoiceId

      relationBillByInvoiceId(row.purchaseInvoiceId).then((response) => {
        this.relationBillTableData = response.data.data
        this.relationBillDialog = true
      })
    },
    /**列表导出 */
    exportList() {
      let par = ""
      if (this.selectRows.length > 0) {
        var keys = []
        this.selectRows.forEach((row) => {
          keys.push(row.purchaseInvoiceId)
        })
        par += "&purchaseInvoiceIds=" + keys
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
      window.location = getUrlConcatToken(`/api/finance/invoicepool/handleExport`) + par
    },
    //查看报关单号信息
    outQuantityShow(row) {
      if (!row) {
        this.$message.warning("选择数据不存在")
        return
      }
      var param = {
        invoiceId: this.showCusByInvoiceId
      }
      this.$refs.outQuantityInfo.findOutQuantityView(param)
    },
    // 查看日志
    showOperateLog(row) {
      this.$refs.operationlog.showOperateLogDialog(row.purchaseInvoiceId, 2)
    }
  }
}
</script>
