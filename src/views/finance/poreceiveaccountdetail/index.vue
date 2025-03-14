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
  <div class="execution" id="poreceiveaccountdetail">
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
          <el-button
            type="primary"
            @click="handleWriteOff"
            size="small"
            v-if="permissions.finance_poreceiveaccountdetail_writeOff"
            >核 销</el-button
          >
          <el-button
            type="primary"
            @click="handleExport"
            size="small"
            v-if="permissions.finance_poreceiveaccountdetail_export"
            >导出</el-button
          >
        </template>
        <template slot="receiveUsedMoney" slot-scope="scope">
          <a class="el-row-text" @click="showReceiveUsedInfo(scope.row.receiveAccountDetailId)">{{
            round(scope.row.receiveUsedMoney)
          }}</a>
        </template>
        <template slot-scope="scope" slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="timeArray">
              <el-date-picker
                v-model="searchForm.timeArray"
                type="daterange"
                size="small"
                start-placeholder="单据开始日期"
                end-placeholder="单据结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="" prop="type">
              <el-select v-model="searchForm.type" collapse-tags clearable size="small" placeholder="单据类型">
                <el-option label="采购退货单" value="0"></el-option>
                <el-option label="采购变更单" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="currencyArray">
              <el-select
                v-model="searchForm.currencyArray"
                clearable
                collapse-tags
                size="small"
                placeholder="币别"
                multiple
              >
                <el-option
                  v-for="(item, index) in currencyOptions"
                  :key="index"
                  :label="item.currency"
                  :value="item.currency"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="supplierName" label="">
              <el-input v-model.trim="searchForm.supplierName" size="small" placeholder="供应商"></el-input>
            </el-form-item>
            <el-form-item prop="documentsName" label="">
              <el-input v-model.trim="searchForm.documentsName" size="small" placeholder="制单人"></el-input>
            </el-form-item>
            <el-form-item prop="documentsNo" label="">
              <el-input
                v-model.trim="searchForm.documentsNo"
                size="small"
                placeholder="单据编号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="corporationName" label="">
              <el-input v-model.trim="searchForm.corporationName" size="small" placeholder="法人主体"></el-input>
            </el-form-item>
            <el-form-item prop="skuCode" label="">
              <el-input v-model.trim="searchForm.skuCode" size="small" placeholder="SKU" v-search-input></el-input>
            </el-form-item>
          </el-form>
        </template>
      </avue-crud>

      <el-dialog
        title="应收款去向"
        :visible.sync="receiveUsedInfoDialog"
        width="500px"
        style="max-height: 550px; overflow-y: auto; overflow-x: hidden; word-wrap: break-word"
      >
        <el-row v-for="(k, v) in receiveUsedInfoList" :key="v">
          <el-col style="text-align: left; font-weight: bold">{{ k.createTime }}</el-col>
          <el-col style="text-align: left; margin-left: 15px"
            >请款单{{ k.relationNo }}，使用{{ k.money }}{{ k.currency }}</el-col
          >
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="receiveUsedInfoDialog = false">确 定</el-button>
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
  writeOff,
  showReceiveUsedInfo
} from "@/api/finance/poreceiveaccountdetail/poreceiveaccountdetail"
import { tableOption } from "@/const/crud/finance/poreceiveaccountdetail/poreceiveaccountdetail"
import { mapGetters } from "vuex"
import { getAll as getBseCurrency } from "@/api/baseSetup/bsecurrency"
import { getTokenUrl, getTokenUrlFile } from "@/util/auth"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "poreceiveaccountdetail",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        timeArray: [],
        startTime: "",
        endTime: "",
        type: "",
        currencyArray: [],
        currency: "",
        supplierName: "",
        documentsName: "",
        documentsNo: "",
        corporationName: "",
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

      currencyOptions: [],
      selectList: [],
      receiveUsedInfoDialog: false,
      receiveUsedInfoList: []
    }
  },
  created() {
    getBseCurrency().then(({ data }) => {
      if (data.code == 0) {
        this.currencyOptions = data.data
      }
    })
    if (this.$route.query.supplierName) {
      this.searchForm.supplierName = this.$route.query.supplierName
    }
    if (this.$route.query.currency) {
      this.searchForm.currencyArray.push(this.$route.query.currency)
      this.searchForm.currency = this.searchForm.currencyArray.join(",")
    }
    if (this.$route.query.corporationName) {
      this.searchForm.corporationName = this.$route.query.corporationName
    }
    this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    summaryMethod(param) {
      // console.info("jinru")
      // //alert("haha");
      //   // const { columns, data } = param;
      //   // columns.forEach((column, index) => {
      //   //   console.info("column is"+column);
      //   //   console.info("index is"+index);
      //   // });
      //   console.info(param);
    },
    round(number) {
      if (number == null) {
        return null
      }
      return Math.round(number * 100) / 100
    },
    // 查看应收款去向
    showReceiveUsedInfo(receiveAccountDetailId) {
      showReceiveUsedInfo({ receiveAccountDetailId: receiveAccountDetailId })
        .then(({ data }) => {
          if (data.code == 0) {
            if (!data.data || data.data.length == 0) {
              this.$message("没有查询到应收款去向记录")
              return
            } else {
              this.receiveUsedInfoList = data.data
              this.receiveUsedInfoDialog = true
            }
          } else {
            this.$message.error("查询应收款去向记录失败")
            return
          }
        })
        .finally(() => {})
    },
    // 导出
    handleExport() {
      var obj = deepCloneIgnoreNull(this.searchFormConfirm)
      var param = ""
      if (this.selectList.length > 0) {
        var receiveAccountDetailIds = ""
        for (var i = 0; i < this.selectList.length; i++) {
          if (i == 0) {
            receiveAccountDetailIds = this.selectList[i].receiveAccountDetailId
          } else {
            receiveAccountDetailIds = receiveAccountDetailIds + "," + this.selectList[i].receiveAccountDetailId
          }
        }
        param = "?receiveAccountDetailIds=" + receiveAccountDetailIds
      } else {
        var count = 0
        for (var index in obj) {
          if (count == 0) {
            param = "?" + index + "=" + obj[index]
          } else {
            param = param + "&" + index + "=" + obj[index]
          }
          count++
        }
      }
      this.downloadUrl = getTokenUrlFile("/api/finance/poreceiveaccountdetail/exportData" + param)
      window.location.href = this.downloadUrl
    },
    // 核销
    handleWriteOff() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var receiveAccountDetailIdArray = []
      for (var i = 0; i < this.selectList.length; i++) {
        var status = this.selectList[i].status
        var documentsNo = this.selectList[i].documentsNo
        if (status != 0) {
          this.$message.error(documentsNo + "核销状态不是未核销，请检查")
          return
        }
        receiveAccountDetailIdArray.push(this.selectList[i].receiveAccountDetailId)
      }

      writeOff({ receiveAccountDetailIds: receiveAccountDetailIdArray.join(",") })
        .then(({ data }) => {
          if (data.code == 0) {
            this.$refs.crud.selectClear()
            this.getList(this.page)
            this.$message({
              showClose: true,
              message: "核销成功",
              type: "success"
            })
          } else {
            this.$message.error(data.msg)
          }
        })
        .finally(() => {})
    },
    getList(page, params) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }
      console.info(this.searchFormConfirm)
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
      this.$confirm("是否确认删除ID为" + row.receiveAccountDetailId, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.receiveAccountDetailId)
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
      this.searchForm.currency = this.searchForm.currencyArray.join(",")
      if (this.searchForm.timeArray && this.searchForm.timeArray.length == 2) {
        this.searchForm.startTime = this.searchForm.timeArray[0]
        this.searchForm.endTime = this.searchForm.timeArray[1]
      } else {
        this.searchForm.startTime = ""
        this.searchForm.endTime = ""
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
    selectionChange(list) {
      this.selectList = list
    }
  }
}
</script>

<style lang="scss">
#poreceiveaccountdetail {
  ::v-deep .el-table__footer-wrapper .has-gutter td:first-child div {
    padding: 0;
    white-space: nowrap;
    text-align: center;
  }
}
</style>
