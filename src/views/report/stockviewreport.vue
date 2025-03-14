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
  <div class="execution">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @current-change="currentChange"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="rowDel"
      >
        <template slot="menuLeft">
          <el-button type="primary" @click="exportExcel" v-if="permissions.stock_view_report_export" size="small"
            >导 出</el-button
          >
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button
            type="text"
            v-if="permissions.report_stockvieweveryday_edit"
            icon="el-icon-check"
            size="small"
            plain
            @click="handleEdit(scope.row, scope.index)"
            >编辑</el-button
          >
          <el-button
            type="text"
            v-if="permissions.report_stockvieweveryday_del"
            icon="el-icon-delete"
            size="small"
            plain
            @click="handleDel(scope.row, scope.index)"
            >删除</el-button
          >
        </template>
        <!--国内库存-->
        <template slot="domesticQuantity" slot-scope="scope">
          <el-button type="text" @click="showDomesticQuantity(scope.row)">{{ scope.row.domesticQuantity }}</el-button>
        </template>
        <!--海外库存-->
        <template slot="overseasQuantity" slot-scope="scope">
          <el-button type="text" @click="showOverseasQuantity(scope.row)">{{ scope.row.overseasQuantity }}</el-button>
        </template>
        <!--采购在途-->
        <template slot="purchaseOnwayQuantity" slot-scope="scope">
          <el-button type="text" @click="showPurchaseOnwayQuantity(scope.row)">{{
            scope.row.purchaseOnwayQuantity
          }}</el-button>
        </template>
        <!--国内调拨在途-->
        <template slot="domesticOnwayQuantity" slot-scope="scope">
          <el-button type="text" @click="showDomesticOnwayQuantity(scope.row)">{{
            scope.row.domesticOnwayQuantity
          }}</el-button>
        </template>
        <!--海外调拨在途-->
        <template slot="overseasOnwayQuantity" slot-scope="scope">
          <el-button type="text" @click="showOverseasOnwayQuantity(scope.row)">{{
            scope.row.overseasOnwayQuantity
          }}</el-button>
        </template>
        <!--FBA库存-->
        <template slot="fbaQuantity" slot-scope="scope">
          <el-button type="text" @click="showFbaQuantity(scope.row)">{{ scope.row.fbaQuantity }}</el-button>
        </template>
        <!--30天销量-->
        <template slot="unitsShippedLast30Days" slot-scope="scope">
          <el-button type="text" @click="showUnitsShipped(scope.row)">{{ scope.row.unitsShippedLast30Days }}</el-button>
        </template>
        <!--90天销量-->
        <template slot="unitsShippedLast90Days" slot-scope="scope">
          <el-button type="text" @click="showUnitsShipped(scope.row)">{{ scope.row.unitsShippedLast90Days }}</el-button>
        </template>
        <template slot-scope="scope" slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item label="" prop="searchDate">
              <el-date-picker
                size="small"
                v-model="searchForm.searchDate"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd"
                start-placeholder="快照开始日期"
                end-placeholder="快照结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="" prop="skuCode">
              <el-input clearable v-model="searchForm.skuCode" size="small" placeholder="SKU" v-search-input></el-input>
            </el-form-item>
            <el-form-item label="" prop="platformSkuCode">
              <el-input
                clearable
                v-model="searchForm.platformSkuCode"
                size="small"
                placeholder="平台SKU"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item label="" prop="groupId" style="margin-bottom: 0px">
              <el-select
                v-model="searchForm.groupId"
                size="small"
                multiple
                collapse-tags
                filterable
                clearable
                placeholder="销售组"
              >
                <el-option
                  v-for="item in salesGroupOptions"
                  :key="item.groupId"
                  :label="item.name"
                  :value="item.groupId"
                ></el-option>
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
      </avue-crud>
    </basic-container>
    <!--库存table-->
    <el-dialog :title="stockTableTitle" :visible.sync="showStockTableVisible">
      <el-table :data="stockTableData" class="cancelFixedTop" height="400px">
        <el-table-column property="warehouseName" label="仓库名称"></el-table-column>
        <el-table-column property="corporationName" label="法人主体"></el-table-column>
        <el-table-column property="groupName" label="销售小组"></el-table-column>
        <el-table-column property="platformSkuCode" label="平台SKU"></el-table-column>
        <el-table-column property="skuCode" label="SKU"></el-table-column>
        <el-table-column property="actualQuantity" label="实际库存"></el-table-column>
      </el-table>
    </el-dialog>
    <!--采购在途table-->
    <el-dialog title="关联单号" :visible.sync="showPurchaseOnwayTableVisible">
      <el-table :data="purchaseOnwayTableData" class="cancelFixedTop" height="400px">
        <el-table-column property="purchaseOrderNo" label="采购单"></el-table-column>
        <el-table-column property="requisitionNo" label="请购单"></el-table-column>
        <el-table-column property="skuCode" label="SKU"></el-table-column>
        <el-table-column property="onwayQuantity" label="在途库存"></el-table-column>
      </el-table>
    </el-dialog>
    <!--调拨在途table-->
    <el-dialog :title="transferOnwayTitle" :visible.sync="showTransferOnwayTableVisible">
      <el-table :data="transferOnwayData" class="cancelFixedTop" height="400px">
        <el-table-column property="transferNo" label="调拨单号"></el-table-column>
        <el-table-column property="skuCode" label="SKU"></el-table-column>
        <el-table-column property="platformSkuCode" label="平台SKU"></el-table-column>
        <el-table-column property="onwayQuantity" label="在途库存"></el-table-column>
      </el-table>
    </el-dialog>
    <!--FBA库存table-->
    <el-dialog title="FBA库存" :visible.sync="showFBAQuantityTableVisible">
      <el-table border :data="FBAQuantityData" class="cancelFixedTop" height="400px">
        <el-table-column label="账号" property="storeAccount">
          <template slot-scope="scope">
            <span :title="scope.row.storeAccount" class="el-row-text">{{ scope.row.storeAccount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="大区" property="districtName"></el-table-column>
        <el-table-column label="亚马逊SKU" property="amazonSku">
          <template slot-scope="scope">
            <span :title="scope.row.amazonSku" class="el-row-text">{{ scope.row.amazonSku }}</span>
          </template>
        </el-table-column>
        <el-table-column label="平台SKU" property="fnsku">
          <template slot-scope="scope">
            <span :title="scope.row.fnsku" class="el-row-text">{{ scope.row.fnsku }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" property="productName">
          <template slot-scope="scope">
            <span :title="scope.row.productName" class="el-row-text">{{ scope.row.productName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商品价格" property="yourPrice"></el-table-column>
        <el-table-column label="实际库存" property="totalQuantity"></el-table-column>
        <el-table-column label="可用库存" property="sellableQuantity"></el-table-column>
        <el-table-column label="锁定库存" property="unsellableQuantity"></el-table-column>
      </el-table>
    </el-dialog>
    <!--FBA销量table-->
    <el-dialog title="FBA销量详情" :visible.sync="showUnitsShippedTableVisible">
      <el-table border :data="showUnitsShippedDate" class="cancelFixedTop" height="400px">
        <el-table-column label="账号" property="storeAccount">
          <template slot-scope="scope">
            <span :title="scope.row.storeAccount" class="el-row-text">{{ scope.row.storeAccount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="大区" property="districtName"></el-table-column>
        <el-table-column label="亚马逊SKU" width="150px" property="amazonSku">
          <template slot-scope="scope">
            <span :title="scope.row.amazonSku" class="el-row-text">{{ scope.row.amazonSku }}</span>
          </template>
        </el-table-column>
        <el-table-column label="平台SKU" property="fnsku">
          <template slot-scope="scope">
            <span :title="scope.row.fnsku" class="el-row-text">{{ scope.row.fnsku }}</span>
          </template>
        </el-table-column>
        <el-table-column label="24小时销量" property="unitsShippedLast24Hrs"></el-table-column>
        <el-table-column label="7天销量" property="unitsShippedLast7Days"></el-table-column>
        <el-table-column label="30天销量" property="unitsShippedLast30Days"></el-table-column>
        <el-table-column label="90天销量" property="unitsShippedLast90Days"></el-table-column>
        <el-table-column label="180天销量" property="unitsShippedLast180Days"></el-table-column>
        <el-table-column label="365天销量" property="unitsShippedLast365Days"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  showStockQuantity,
  showPurchaseOnwayQuantity,
  showTransferOnwayQuantity,
  showFbaQuantityDetail
} from "@/api/report/stockvieweveryday"
import { getGroupAllByParams } from "@/api/adminUser/adminGroup"
import { tableOption } from "@/const/crud/report/stockvieweveryday"
import { mapGetters } from "vuex"
import { getUrlConcatToken } from "@/util/auth"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { formatDate, parseTime } from "@/filters/index"
export default {
  name: "stockvieweveryday",
  data() {
    return {
      salesGroupOptions: [],
      stockTableTitle: "",
      transferOnwayTitle: "",
      stockTableData: [],
      purchaseOnwayTableData: [],
      transferOnwayData: [],
      FBAQuantityData: [],
      showUnitsShippedDate: [],
      showStockTableVisible: false,
      showPurchaseOnwayTableVisible: false,
      showTransferOnwayTableVisible: false,
      showFBAQuantityTableVisible: false,
      showUnitsShippedTableVisible: false,
      showWeeksOfCoverTableVisible: false,
      //搜索条件，和前端控件绑定
      searchForm: {
        platformSkuCode: "",
        skuCode: "",
        searchDate: [],
        groupId: []
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption
    }
  },
  created() {
    this.getGroupAll()
  },
  mounted: function () {
    let s = parseTime(new Date(new Date().getTime()), "{y}-{m}-{d}")
    this.searchForm.searchDate = [s, s]
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    /**
     * 导出
     */
    exportExcel: function () {
      if (!this.tableData || this.tableData.length == 0) {
        this.$message.error("没有可导出数据")
        return
      }
      var param = ""
      if (this.searchFormConfirm.skuCode) {
        param = param + "&skuCode=" + this.searchFormConfirm.skuCode
      }
      if (this.searchFormConfirm.platformSkuCode) {
        param = param + "&platformSkuCode=" + this.searchFormConfirm.platformSkuCode
      }
      if (this.searchFormConfirm.searchDate) {
        this.searchFormConfirm.searchDate.forEach((item) => {
          param = param + "&searchDate=" + item
        })
      }
      if (this.searchFormConfirm.groupId) {
        this.searchFormConfirm.groupId.forEach((item) => {
          param = param + "&groupId=" + item
        })
      }
      window.location = getUrlConcatToken("/api/report/stockvieweveryday/exportExcel") + param
    },
    /**
     * 查询销售组
     */
    getGroupAll: function () {
      var params = {
        groupFunctionName: "销售类",
        authority: false
      }
      //加载请购组
      getGroupAllByParams(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.salesGroupOptions = data
        }
      })
    },
    //周转次数
    showWeeksOfCover(row) {
      this.showWeeksOfCoverTableVisible = true
    },
    //FBA库存
    showFbaQuantity(row) {
      if (row.fbaQuantity == 0) {
        this.$message.warning("无数据展示")
        return
      }
      var params = {
        backUpDate: row.backUpDate,
        skuId: row.skuId,
        groupId: row.groupId
      }
      this.FBAQuantityData = []
      showFbaQuantityDetail(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.FBAQuantityData = data
        }
      })
      this.showFBAQuantityTableVisible = true
    },
    //销量
    showUnitsShipped(row) {
      var params = {
        backUpDate: row.backUpDate,
        skuId: row.skuId,
        groupId: row.groupId
      }
      this.showUnitsShippedDate = []
      showFbaQuantityDetail(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.showUnitsShippedDate = data
        }
      })
      this.showUnitsShippedTableVisible = true
    },
    //海外调拨在途
    showOverseasOnwayQuantity(row) {
      if (row.overseasOnwayQuantity == 0) {
        this.$message.warning("无数据展示")
        return
      }
      this.transferOnwayTitle = "海外调拨在途明细"
      var params = {
        backUpDate: row.backUpDate,
        skuId: row.skuId,
        groupId: row.groupId,
        type: "overseas"
      }
      ;(this.transferOnwayData = []),
        showTransferOnwayQuantity(params).then((response) => {
          var data = response.data.data
          if (data && data.length > 0) {
            this.transferOnwayData = data
            this.transferOnwayData.forEach((item) => {
              item.skuCode = row.skuCode
            })
          }
        })
      this.showTransferOnwayTableVisible = true
    },
    //国内调拨在途
    showDomesticOnwayQuantity(row) {
      if (row.domesticOnwayQuantity == 0) {
        this.$message.warning("无数据展示")
        return
      }
      this.transferOnwayTitle = "国内调拨在途明细"
      var params = {
        backUpDate: row.backUpDate,
        skuId: row.skuId,
        groupId: row.groupId,
        type: "domestic"
      }
      ;(this.transferOnwayData = []),
        showTransferOnwayQuantity(params).then((response) => {
          var data = response.data.data
          if (data && data.length > 0) {
            debugger
            this.transferOnwayData = data
            this.transferOnwayData.forEach((item) => {
              item.skuCode = row.skuCode
            })
          }
        })
      this.showTransferOnwayTableVisible = true
    },
    //查采购在途
    showPurchaseOnwayQuantity(row) {
      if (row.purchaseOnwayQuantity == 0) {
        this.$message.warning("无数据展示")
        return
      }
      var params = {
        backUpDate: row.backUpDate,
        skuId: row.skuId,
        groupId: row.groupId
      }
      this.purchaseOnwayTableData = []
      showPurchaseOnwayQuantity(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.purchaseOnwayTableData = data
          this.purchaseOnwayTableData.forEach((item) => {
            item.skuCode = row.skuCode
          })
        }
      })
      this.showPurchaseOnwayTableVisible = true
    },
    //查国内库存
    showDomesticQuantity(row) {
      if (row.domesticQuantity == 0) {
        this.$message.warning("无数据展示")
        return
      }
      this.stockTableTitle = "国内仓库存"
      var params = {
        backUpDate: row.backUpDate,
        skuId: row.skuId,
        groupId: row.groupId,
        type: "domestic"
      }
      this.stockTableData = []
      showStockQuantity(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.stockTableData = data
        }
      })
      this.showStockTableVisible = true
    },
    //查海外库存
    showOverseasQuantity(row) {
      if (row.overseasQuantity == 0) {
        this.$message.warning("无数据展示")
        return
      }
      this.stockTableTitle = "海外仓库存"
      var params = {
        backUpDate: row.backUpDate,
        skuId: row.skuId,
        groupId: row.groupId,
        type: "overseas"
      }
      this.stockTableData = []
      showStockQuantity(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.stockTableData = data
        }
      })
      this.showStockTableVisible = true
    },
    getList(page, params) {
      this.tableLoading = true
      page = page || { currentPage: 1 }
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
        this.tableLoading = false
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
      this.$confirm("是否确认删除ID为" + row.backUpDate, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.backUpDate)
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
    currentChange(val) {
      this.page.currentPage = val
      this.getList(this.page, this.searchFormConfirm)
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
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
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
      this.getList(this.page, this.searchFormConfirm)
    }
  }
}
</script>
