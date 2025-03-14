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
  <div class="execution" id="y-supplier-list">
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
          <el-button type="primary" v-if="permissions.posupplier_list_save" @click="openAddPage()" size="small">
            新 增
          </el-button>
          <el-button type="primary" v-if="permissions.posupplier_list_able" @click="operationStatus(0)" size="small">
            启用
          </el-button>
          <el-button type="primary" v-if="permissions.posupplier_list_unable" @click="operationStatus(1)" size="small">
            禁用
          </el-button>
          <el-button type="primary" v-if="permissions.posupplier_list_switch" @click="openDialog()" size="small">
            切换等级
          </el-button>
        </template>

        <template slot-scope="scope" slot="search">
          <el-form :model="searchForm" :inline="true" ref="searchForm" style="float: left" @submit.native.prevent>
            <el-form-item prop="historySupplierNo">
              <el-input
                v-model="searchForm.historySupplierNo"
                size="small"
                placeholder="供应商编码"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="supplierName">
              <!-- <el-input
                v-model="searchForm.supplierName"
                size="small"
                @change="modifySupplier"
                placeholder="供应商名称"
              ></el-input> -->
              <el-select v-model="searchForm.supplierName" size="small" placeholder="供应商" filterable clearable>
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="status">
              <el-select v-model="searchForm.status" size="small" placeholder="供应商状态" clearable>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="creditLevel">
              <el-select v-model="searchForm.creditLevel" size="small" placeholder="供应商等级" clearable>
                <el-option v-for="item in supplierLevel" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <!-- 高级搜索 -->
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="basicStatus">
              <el-select v-model="searchForm.basicStatus" size="small" placeholder="基本信息状态" clearable>
                <el-option v-for="item in optionStatus" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="accountStatus1">
              <el-select v-model="searchForm.accountStatus1" size="small" placeholder="对公账户状态" clearable>
                <el-option v-for="item in optionStatus2" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="accountStatus2">
              <el-select v-model="searchForm.accountStatus2" size="small" placeholder="香港账户状态" clearable>
                <el-option v-for="item in optionStatus2" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="taxStatus">
              <el-select v-model="searchForm.taxStatus" size="small" placeholder="税务资质" clearable>
                <el-option v-for="item in optionTax" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <!-- 操作列表中的某一列 -->
        <template slot="creditLevel" slot-scope="scope">
          <span v-for="item in supplierLevel" :key="item.value">
            <span v-if="scope.row.creditLevel == item.value">
              {{ item.label }}
            </span>
          </span>
        </template>
        <template slot="historySupplierNo" slot-scope="scope">
          <copy-text hoverToShow>
            <router-link
              :to="{ path: '/createSuppplier/index', query: { paramSupplierNo: scope.row.historySupplierNo } }"
              >{{ scope.row.historySupplierNo }}</router-link
            >
          </copy-text>
          <!-- <el-button
					type="text"
					size="mini"
					class="button-css"
					@click="openAddPage(scope.row.historySupplierNo)"
					>{{scope.row.historySupplierNo}}</el-button> -->
        </template>
      </avue-crud>

      <el-dialog title="切换等级" :visible.sync="centerDialogVisible" width="30%" center>
        <div>
          <el-form>
            <el-form-item label="供应商等级">
              <el-select v-model="switchCreditLevel" size="small" placeholder="全部">
                <el-option v-for="item in supplierLevel" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="centerDialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="updateLevel()">确定</el-button>
        </span>
      </el-dialog>
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
  operationStatus,
  switchLevel,
  getAll as getAllSupplierApi
} from "@/api/supplier/posupplier.js"
import { tableOption } from "@/const/crud/supplier/posupplier.js"
import { remote } from "@/api/admin/dict.js"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"

export default {
  name: "posupplier",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        historySupplierNo: "",
        supplierName: "",
        status: "",
        value2: "",
        taxQualification: "",
        basicStatus: "",
        creditLevel: "",
        accountStatus: "",
        accountStatus1: "",
        accountStatus2: "",
        taxStatus: ""
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
      options: [
        {
          value: "0",
          label: "启用中"
        },
        {
          value: "1",
          label: "禁用中"
        }
      ],
      optionStatus: [
        {
          value: "0",
          label: "未处理"
        },
        {
          value: "1",
          label: "审核中"
        },
        {
          value: "2",
          label: "已审核"
        }
      ],

      optionStatus2: [
        {
          value: "-1",
          label: "无"
        },
        {
          value: "0",
          label: "未处理"
        },
        {
          value: "1",
          label: "审核中"
        },
        {
          value: "2",
          label: "已审核"
        }
      ],
      optionTax: [
        {
          value: "-1",
          label: "无"
        },
        {
          value: "0",
          label: "未处理"
        },
        {
          value: "1",
          label: "审核中"
        },
        {
          value: "2",
          label: "已审核"
        }
      ],
      switchCreditLevel: "",
      centerDialogVisible: false,
      supplierLevel: [],
      selectList: [], //列表勾选
      supplierOptions: []
    }
  },
  created() {},
  mounted: function () {
    this.getSupplierLevel()
    this.getSupplierAll()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    modifySupplier(val) {
      this.searchForm.supplierName = val.replace(/,/g, " ")
    },
    reject() {
      console.info(this.switchCreditLevel)
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
    refreshChange(obj) {
      let { page, searchForm } = obj
      this.getList(page, searchForm)
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      if (typeof page == "undefined") {
        page = this.page
      }
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
    },
    //列表勾选
    selectionChange(list) {
      this.selectList = list
    },
    //获取供应商等级
    getSupplierLevel() {
      remote("supplier_level").then((response) => {
        if (response.data.code == 0) {
          this.supplierLevel = response.data.data
        }
        if (this.supplierLevel == null || this.supplierLevel.length == 0) {
          this.$message.error("供应商等级获取失败，请检查是否维护!")
        }
      })
    },
    //打开新增页面
    openAddPage(supplierNo) {
      this.$router.push({
        path: "/createSuppplier",
        query: {
          paramSupplierNo: supplierNo
        }
      })
    },
    //禁用启用
    operationStatus(lockFlag) {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
      } else {
        var enbleStatus = "启用"
        if (lockFlag == "1") {
          enbleStatus = "禁用"
        }
        var selectIds = []
        for (var i = 0; i < this.selectList.length; i++) {
          var status = this.selectList[i].status
          //   if(this.selectList[i].supplierNo == null){
          // 	this.$message.error(this.selectList[i].historySupplierNo+"还没有审核通过的数据不能修改禁启用状态!");
          // 	return;
          //   }
          if (lockFlag == status) {
            this.$message.error("勾选中存在着原本已经【" + enbleStatus + "】了的数据!")
            return
          }
          selectIds.push(this.selectList[i].historySupplierNo)
        }
        operationStatus(selectIds, lockFlag).then((response) => {
          if (response.data.code == 1) {
            this.$message.error("更新异常!")
            return
          }
          this.$message.success("更新成功!")
          //页面刷新
          this.$refs.crud.selectClear()
          //  this.refreshChange();
          this.getList(this.page)
        })
      }
    },
    openDialog() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      // for (var i = 0; i < this.selectList.length; i++) {
      // 	if(this.selectList[i].supplierNo == null){
      // 	this.$message.error(this.selectList[i].historySupplierNo+"还没有审核通过的数据不能修切换等级，请到详情页面进行编辑!");
      // 	return;
      // 	}
      // }
      //先清空
      this.switchCreditLevel = ""
      if (this.selectList.length == 1) {
        this.switchCreditLevel = this.selectList[0].creditLevel + ""
      }
      this.centerDialogVisible = true
    },
    //切换供应商等级
    updateLevel() {
      if (this.switchCreditLevel == "") {
        this.$message.error("请选择要切换的等级!")
        return
      }
      var selectIds = []
      for (var i = 0; i < this.selectList.length; i++) {
        selectIds.push(this.selectList[i].historySupplierNo)
      }
      switchLevel(selectIds, this.switchCreditLevel).then((response) => {
        if (response.data.code == 1) {
          this.$message.error("更新异常!")
          return
        }
        this.$message.success("更新成功!")
        //关闭对话框
        this.centerDialogVisible = false
        //页面刷新
        this.$refs.crud.selectClear()
        //  this.refreshChange();
        this.getList(this.page)
      })
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
