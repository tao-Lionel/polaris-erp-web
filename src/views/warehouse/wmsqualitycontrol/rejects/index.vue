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
  <div class="execution" id="rejects">
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
          <el-button type="primary" v-if="permissions.wmsquanlity_rejects_handle" @click="handleAdd" size="small"
            >处理</el-button
          >
          <el-button type="primary" v-if="permissions.wmsquanlity_rejects_turn" @click="handleReturn" size="small"
            >转良</el-button
          >
        </template>
        <!-- v-if="permissions.warehouse_wmsqualitycontrolrejects_add" -->
        <template slot-scope="scope" slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="qualityControlTime"
              ><!--此处需要绑定搜索变量，否则清空会失败-->
              <el-date-picker
                size="small"
                v-model="searchForm.qualityControlTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                type="daterange"
                unlink-panels
                range-separator="至"
                start-placeholder="质检开始日期"
                end-placeholder="质检结束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="skuCode">
              <el-input v-model="searchForm.skuCode" size="small" placeholder="SKU,支持多个" v-search-input></el-input>
            </el-form-item>
            <el-form-item prop="wmsQualityControlNo">
              <el-input
                v-model="searchForm.wmsQualityControlNo"
                size="small"
                placeholder="质检编号,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
            <!-- <el-button native-type="submit" v-show="false" @click="searchChange"></el-button> -->
          </el-form>
        </template>
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="deliveryNo">
              <el-input v-model="searchForm.deliveryNo" size="small" placeholder="送货单号" v-search-input></el-input>
            </el-form-item>
            <el-form-item prop="supplierName">
              <el-input v-model="searchForm.supplierName" size="small" placeholder="供应商" v-search-input></el-input>
            </el-form-item>
            <el-form-item prop="purchaseOrderNo">
              <el-input
                v-model="searchForm.purchaseOrderNo"
                size="small"
                placeholder="采购单号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="poContractNo">
              <el-input v-model="searchForm.poContractNo" size="small" placeholder="合同编号" v-search-input></el-input>
            </el-form-item>
            <el-form-item prop="taxType">
              <el-select size="small" v-model="searchForm.taxType" placeholder="税别">
                <el-option v-for="item in taxOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-button native-type="submit" v-show="false" @click="searchChange"></el-button> -->
          </el-form>
        </template>

        <template slot="turnDetail" slot-scope="scope">
          <span v-if="!isNulls(scope.row.turnDetail)">
            <el-button
              type="text"
              size="mini"
              class="button-css color-Warning"
              @click="showDetail(scope.row.wmsQualityControlNo)"
              >详情</el-button
            ></span
          >
        </template>
      </avue-crud>

      <el-dialog title="处理方案" :visible.sync="centerDialogVisible" width="30%" center>
        <div>
          <el-input
            type="textarea"
            :rows="4"
            maxlength="150"
            placeholder="请输入处理方案，不得超过150个字符。"
            v-model.trim="scheme"
          >
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="handelResult">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="我想成为良品" :visible.sync="turnDialogVisible" width="30%" center>
        <div>
          <el-form>
            <el-form-item label="转良品数">
              <el-input
                v-model.number="turnQuantity"
                size="small"
                placeholder="转数量"
                maxlength="9"
                :disabled="locking"
              ></el-input>
            </el-form-item>
            <el-form-item label="备注信息">
              <el-input
                type="textarea"
                :rows="4"
                maxlength="150"
                placeholder="请输入备注，不得超过150个字符。"
                v-model.trim="remark"
              >
              </el-input>
            </el-form-item>
          </el-form>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="turnResult">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="转良品详情" :visible.sync="detailTableVisible">
        <avue-crud :data="detailTableData" :option="detailTableOptions"></avue-crud>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="detailTableVisible = false">关 闭 </el-button>
        </div>
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
  saveData,
  rejectsTurn,
  showTrunDetail
} from "@/api/warehouse/wmsqualitycontrolrejects"
import { tableOption, detailTableOptions } from "@/const/crud/warehouse/wmsqualitycontrolrejects"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { remote } from "@/api/admin/dict.js"
export default {
  name: "wmsqualitycontrolrejects",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        qualityControlTime: "",
        skuCode: "",
        wmsQualityControlNo: "",
        deliveryNo: "",
        supplierName: "",
        purchaseOrderNo: "",
        poContractNo: "",
        taxType: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      detailTableData: [],
      detailTableOptions: detailTableOptions,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },

      tableOption: tableOption,

      taxOptions: [
        {
          value: "1",
          label: "含税"
        },
        {
          value: "2",
          label: "非税"
        }
      ],
      selectList: [],
      centerDialogVisible: false,
      turnDialogVisible: false,
      detailTableVisible: false,
      wmsQualityControlNos: [],
      scheme: "",
      remark: "",
      turnQuantity: "",
      locking: true
    }
  },
  created() {},
  mounted: function () {
    remote("quality_control_turn").then((response) => {
      if (response.data.code == 0 && response.data.data.length > 0 && response.data.data[0].value === "0") {
        this.locking = false
      }
    })
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
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
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }

      var checkNos = ""
      this.wmsQualityControlNos = []
      for (var i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].status != 0) {
          checkNos = checkNos + this.selectList[i].wmsQualityControlNo + ";"
          continue
        }
        this.wmsQualityControlNos.push(this.selectList[i].wmsQualityControlNo)
      }

      if (!this.isNulls(checkNos)) {
        this.$message.error(checkNos + "已经处理过了，不能多次处理!")
        return
      }
      //打开回话框
      this.scheme = ""
      this.centerDialogVisible = true
    },

    handleReturn() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }

      if (this.selectList.length != 1) {
        this.$message.error("一次只能操作一条数据")
        return
      }

      if (this.selectList[0].status != 0) {
        this.$message.error("非待处理状态单据，不可转良!")
        return
      }
      this.remark = ""
      this.turnQuantity = this.selectList[0].rejectsQuantity
      this.turnDialogVisible = true
    },

    //列表勾选
    selectionChange(list) {
      this.selectList = list
    },
    handleEdit(row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    handleDel(row, index) {
      this.$refs.crud.rowDel(row, index)
    },
    rowDel: function (row, index) {
      var _this = this
      this.$confirm("是否确认删除ID为" + row.wmsQualityControlNo, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.wmsQualityControlNo)
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
    },

    handelResult() {
      if (this.isNulls(this.scheme.trim())) {
        this.$message.error("处理方案不能为空!")
        return
      }
      var obj = {
        wmsQualityControlNos: this.wmsQualityControlNos,
        scheme: this.scheme
      }

      saveData(obj)
        .then((response) => {
          if (response.data.code == 0) {
            this.$message.success("处理成功")
            this.centerDialogVisible = false
            //页面刷新
            this.$refs.crud.selectClear()
            this.refreshChange()
          } else {
            this.$message.error(response.data.msg)
          }
        })
        .finally(() => {})
    },
    //转良处理
    turnResult() {
      //不良品数量
      var rejectsQuantity = this.selectList[0].rejectsQuantity
      //质检单号
      var wmsQualityControlNo = this.selectList[0].wmsQualityControlNo
      if (this.isNulls(this.turnQuantity)) {
        this.$message.error("转良品数，必填")
        return
      }
      var r = /^[0-9]*[1-9][0-9]*$/ //正整数
      if (!r.test(this.turnQuantity)) {
        this.$message.error("转良品数必须为正整数")
        return
      }
      if (this.turnQuantity > rejectsQuantity) {
        this.$message.error("最大转良品数" + rejectsQuantity)
        return
      }
      var obj = {
        wmsQualityControlNo: wmsQualityControlNo,
        remark: this.remark,
        turnQuantity: this.turnQuantity
      }
      rejectsTurn(obj).then((response) => {
        console.log(response)
        if (response.data.code == 0) {
          this.turnDialogVisible = false
          this.$message.success("操作成功!")
          //页面刷新
          this.$refs.crud.selectClear()
          this.refreshChange()
        } else {
          this.$message.error(response.data.msg)
        }
      })
    },

    showDetail(wmsQualityControlNo) {
      this.detailTableData = []
      showTrunDetail(wmsQualityControlNo).then((resp) => {
        this.detailTableData = resp.data.data
      })
      this.detailTableVisible = true
    },
    isNulls(str) {
      if (typeof str == "undefined" || str == null || (str + "").trim() == "") {
        return true
      }
      return false
    }
  }
}
</script>
<style lang="scss"></style>
