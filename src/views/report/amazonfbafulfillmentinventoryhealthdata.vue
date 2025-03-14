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
          <el-button type="primary" @click="exportExcel" size="small" v-if="permissions.report_fba_exportExcel"
            >导 出</el-button
          >
        </template>
        <!-- <template slot-scope="scope" slot="menu">
          <el-button
            type="text"
            v-if="permissions.report_amazonfbafulfillmentinventoryhealthdata_edit"
            icon="el-icon-check"
            size="small"
            plain
            @click="handleEdit(scope.row, scope.index)"
            >编辑</el-button
          >
          <el-button
            type="text"
            v-if="permissions.report_amazonfbafulfillmentinventoryhealthdata_del"
            icon="el-icon-delete"
            size="small"
            plain
            @click="handleDel(scope.row, scope.index)"
            >删除</el-button
          >
        </template> -->
        <template slot-scope="scope" slot="search">
          <el-form :model="searchForm" :inline="true" ref="searchForm" style="float: left">
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
            <el-form-item label="" prop="fnsku">
              <el-input
                clearable
                v-model="searchForm.fnsku"
                size="small"
                placeholder="平台SKU"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item label="" prop="storeAccount">
              <el-input
                clearable
                v-model="searchForm.storeAccount"
                size="small"
                placeholder="店铺"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item label="" prop="districtId">
              <el-select
                v-model="searchForm.districtId"
                multiple
                collapse-tags
                clearable
                size="small"
                filterable
                placeholder="站点区域"
              >
                <el-option
                  v-for="item in bsedistrictOptions"
                  :key="item.value"
                  :label="item.districtName"
                  :value="item.districtId"
                >
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
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, getObj, addObj, putObj, delObj } from "@/api/report/amazonfbafulfillmentinventoryhealthdata"
import { formatDate, parseTime } from "@/filters/index"
import { getDistrict } from "@/api/baseSetup/bsestore"
import { tableOption } from "@/const/crud/report/amazonfbafulfillmentinventoryhealthdata"
import { getUrlConcatToken } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "amazonfbafulfillmentinventoryhealthdata",
  data() {
    return {
      bsedistrictOptions: [],
      //搜索条件，和前端控件绑定
      searchForm: {
        searchDate: [],
        districtId: [],
        storeAccount: "",
        fnsku: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption
    }
  },
  created() {
    this.getDistrict()
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
      if (this.searchFormConfirm.storeAccount) {
        param = param + "&storeAccount=" + this.searchFormConfirm.storeAccount
      }
      if (this.searchFormConfirm.fnsku) {
        param = param + "&fnsku=" + this.searchFormConfirm.fnsku
      }
      if (this.searchFormConfirm.searchDate) {
        this.searchFormConfirm.searchDate.forEach((item) => {
          param = param + "&searchDate=" + item
        })
      }
      if (this.searchFormConfirm.districtId) {
        this.searchFormConfirm.districtId.forEach((item) => {
          param = param + "&districtId=" + item
        })
      }
      window.location = getUrlConcatToken("/api/report/amazonfbafulfillmentinventoryhealthdata/exportExcel") + param
    },
    //区域
    getDistrict() {
      //区域
      getDistrict().then((res) => {
        this.bsedistrictOptions = res.data.data
      })
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList(this.page, this.searchFormConfirm)
    },
    getList(page, params) {
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
      this.$confirm("是否确认删除ID为" + row.id, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.id)
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

<style lang="scss" scoped></style>
