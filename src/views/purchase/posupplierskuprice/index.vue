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
  <div class="execution" id="posupplierskuprice">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @refresh-change="refreshChange"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="rowDel"
        @search-reset="searchReset"
        @search-change="handleFilter"
        @selection-change="selectionChange"
        @current-change="currentChange"
        @size-change="sizeChange"
      >
        <template slot="menuLeft">
          <el-button
            type="primary"
            @click="setDefault"
            size="small"
            v-if="permissions.purchase_posupplierskuprice_set_default"
            >设为默认</el-button
          >
          <el-button
            type="primary"
            @click="exportData"
            size="small"
            v-if="permissions.purchase_posupplierskuprice_export"
            >导出</el-button
          >
        </template>

        <!-- 自定义搜索条件 -->
        <template slot="search">
          <el-form @submit.prevent.native :model="search" :inline="true" ref="search" style="float: left">
            <el-form-item>
              <avue-crud-input v-model="search.skuCode" size="small" placeholder="SKU"></avue-crud-input>
            </el-form-item>
            <el-form-item>
              <avue-crud-input
                v-model="search.skuName"
                size="small"
                @change="modifySkuName"
                placeholder="产品名称"
              ></avue-crud-input>
            </el-form-item>
            <el-form-item>
              <avue-crud-input v-model="search.modelName" size="small" placeholder="产品长宽高(cm)"></avue-crud-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="search.supplierName" size="small" placeholder="供应商" filterable>
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select size="small" v-model="search.isDefault" clearable placeholder="是否默认供应商">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-button native-type="submit" v-show="false" @click="handleFilter"></el-button>
            </el-form-item>
          </el-form>
        </template>
        <template slot="startPriceValidity" slot-scope="scope">
          <span v-if="scope.row.startPriceValidity">{{ scope.row?.startPriceValidity?.split(" ")?.[0] }} 至 </span>
          <span>{{ scope.row?.endPriceValidity?.split(" ")?.[0] }}</span>
        </template>
        <!-- 查看历史价格 -->
        <template slot="priceHistorySlot" slot-scope="scope">
          <i
            class="icon-rizhi y-reviews"
            @click="showPriceHistory(scope.row.supplierNo, scope.row.skuId, scope.row.priceModel)"
          ></i>
          <!-- <span @click="showPriceHistory(scope.row.supplierNo,scope.row.skuId)" style="color:#F90">查看</span> -->
        </template>
      </avue-crud>

      <!-- 引入子组件-历史价格信息 -->
      <priceHistory ref="priceHistory"></priceHistory>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, getObj, addObj, putObj, delObj, setDefault, exportData } from "@/api/purchase/posupplierskuprice"
import { tableOption } from "@/const/crud/purchase/posupplierskuprice"
import priceHistory from "./priceHistory"
import { downloadBlob } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getAll as getAllSupplierApi } from "@/api/supplier/posupplier"

export default {
  name: "posupplierskuprice",
  components: {
    priceHistory
  },
  data() {
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      selectList: [],
      //搜索对象
      search: {
        skuCode: "",
        skuName: "",
        modelName: "",
        supplierName: "",
        isDefault: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      options: [
        {
          value: "0",
          label: "是"
        },
        {
          value: "1",
          label: "否"
        }
      ],
      supplierOptions: []
    }
  },
  created() {},
  mounted: function () {
    this.getList(this.page, this.search)
    this.getSupplierAll()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    exportData() {
      exportData(this.searchFormConfirm)
        .then((res) => {
          downloadBlob(res.data, "采购价目导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
        })
        .catch((err) => {
          console.log(err)
        })
    },
    modifySupplier(val) {
      this.search.supplierName = val.replace(/,/g, " ")
      if (this.search.supplierName.indexOf("BEAUTIFUL") !== -1) {
        this.search.supplierName = this.search.supplierName.replace(".", ".,")
      }
    },
    modifySkuName(val) {
      this.search.skuName = val.replace(",", " ")
    },
    getList(page, params) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
      })
    },
    /**
     * 重置搜索条件
     */
    searchReset() {
      this.search = {}
    },
    /**
     * 重新搜索条件
     */
    handleFilter(param) {
      console.log(11111, this.search)
      this.page.currentPage = 1
      this.searchFormConfirm = deepClone(this.search)
      this.getList(this.page, this.search)
      this.clearSelectClear()
    },
    /**
     * 选中数据
     */
    selectionChange(tableData) {
      this.selectList = tableData
    },
    /**
     * 清除选中
     */
    clearSelectClear() {
      this.$refs.crud.selectClear()
    },
    /**
     * 当前第几页
     */
    currentChange(val) {
      this.page.currentPage = val
      this.getList(this.page, this.searchFormConfirm)
    },
    /**
     * 每页显示几条
     */
    sizeChange(val) {
      this.page.pageSize = val
      this.getList(this.page, this.searchFormConfirm)
    },
    /**
     * 设置默认供应商
     */
    setDefault() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      } else if (this.selectList.length != 1) {
        this.$message.error("只能勾选一条数据")
        return
      }
      var data = this.selectList[0]
      if (data.isDefault == 0) {
        this.$message.error("供应商：" + data.supplierName + "，是默认供应商，不需要在设置")
        return
      }
      var query = {
        skuId: data.skuId,
        supplierNo: data.supplierNo
      }
      this.$confirm("是否确认将供应商：" + data.supplierName + "，设为默认供应商", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return setDefault(query)
        })
        .then((response) => {
          if (response.data.code == 0) {
            this.clearSelectClear()
            this.getList(this.page, this.search)
            this.$notify({
              title: "成功",
              message: "设置成功",
              type: "success",
              duration: 2000
            })
          } else if (response.data.code == 1) {
            this.$message.error(response.data.msg)
            return
          } else {
            this.$message.error("操作失败")
            return
          }
        })
        .catch(function (err) {})
    },
    /**
     * 历史价格信息
     */
    showPriceHistory(supplierNo, skuId, priceModel) {
      this.$refs.priceHistory.loadAll(supplierNo, skuId, priceModel)
    },
    /**
     * @title 打开新增窗口
     * @detail 调用crud的handleadd方法即可
     *
     **/
    handleAdd: function () {
      // this.$refs.crud.rowAdd()
    },
    handleEdit(row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    handleDel(row, index) {
      this.$refs.crud.rowDel(row, index)
    },
    rowDel: function (row, index) {
      var _this = this
      this.$confirm("是否确认删除ID为" + row.supplierNo, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.supplierNo)
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
      this.handleFilter(this.search)
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
#posupplierskuprice {
}
</style>
