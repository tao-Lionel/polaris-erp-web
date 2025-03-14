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
          <el-button type="primary" @click="exportExcel" size="small" v-if="permissions.stock_report_export"
            >导 出</el-button
          >
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button
            type="text"
            v-if="permissions.report_stockreporteveryday_edit"
            icon="el-icon-check"
            size="small"
            plain
            @click="handleEdit(scope.row, scope.index)"
            >编辑</el-button
          >
          <el-button
            type="text"
            v-if="permissions.report_stockreporteveryday_del"
            icon="el-icon-delete"
            size="small"
            plain
            @click="handleDel(scope.row, scope.index)"
            >删除</el-button
          >
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
            <el-form-item label="" prop="warehouseId">
              <el-select
                v-model="searchForm.warehouseId"
                size="small"
                multiple
                collapse-tags
                filterable
                clearable
                placeholder="仓库"
              >
                <el-option
                  v-for="item in warehouseOptions"
                  :key="item.warehouseId"
                  :label="item.warehouseName"
                  :value="item.warehouseId"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="" prop="skuCode">
              <el-input clearable v-model="searchForm.skuCode" size="small" placeholder="SKU" v-search-input></el-input>
            </el-form-item>

            <!-- <el-form-item label="平台SKU" prop="platformSkuCode">
              <el-input
                clearable
                v-model="searchForm.platformSkuCode"
                size="small"
                placeholder="请输入平台SKU搜索"
                v-search-input
              ></el-input>
            </el-form-item> -->
          </el-form>
        </template>
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchFormAdvance">
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
            <el-form-item label="" prop="corporationId">
              <el-select
                v-model="searchForm.corporationId"
                size="small"
                multiple
                collapse-tags
                filterable
                clearable
                placeholder="法人主体"
              >
                <el-option
                  v-for="item in corporationOptions"
                  :key="item.corporationId"
                  :label="item.corporationName"
                  :value="item.corporationId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, getObj, addObj, putObj, delObj } from "@/api/report/stockreporteveryday"
import { getUrlConcatToken } from "@/util/auth"
import { formatDate, parseTime } from "@/filters/index"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import { getGroupAllByParams } from "@/api/adminUser/adminGroup"
import { getAll as getCorporationList } from "@/api/baseSetup/bsecorporation"
import { tableOption } from "@/const/crud/report/stockreporteveryday"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "stockreporteveryday",
  data() {
    return {
      warehouseOptions: [],
      salesGroupOptions: [],
      corporationOptions: [],
      //搜索条件，和前端控件绑定
      searchForm: {
        searchDate: [],
        warehouseId: [],
        groupId: [],
        corporationId: [],
        skuCode: "",
        platformSkuCode: ""
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
    this.getCorporation()
    this.getAllWarehouse()
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
      if (this.searchFormConfirm.warehouseId) {
        this.searchFormConfirm.warehouseId.forEach((item) => {
          param = param + "&warehouseId=" + item
        })
      }
      if (this.searchFormConfirm.corporationId) {
        this.searchFormConfirm.corporationId.forEach((item) => {
          param = param + "&corporationId=" + item
        })
      }
      if (this.searchFormConfirm.groupId) {
        this.searchFormConfirm.groupId.forEach((item) => {
          param = param + "&groupId=" + item
        })
      }
      window.location = getUrlConcatToken("/api/report/stockreporteveryday/exportExcel") + param
    },
    /**
     * 查询销售组
     */
    getGroupAll: function () {
      var params = {
        groupFunctionName: "销售类",
        authority: false
      }
      getGroupAllByParams(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.salesGroupOptions = data
        }
      })
    },
    /**
     * 查法人
     */
    getCorporation() {
      getCorporationList().then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.corporationOptions = data
        }
      })
    },
    /**
     * 查询仓库
     */
    getAllWarehouse: function () {
      var query = {
        funcState: "1",
        delFlag: "0",
        isFba: false
      }
      this.warehouseInOptions = []
      getAllWarehouse(query).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.warehouseOptions = data
          for (let index = 0; index < data.length; index++) {
            const element = data[index]
          }
        }
      })
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
