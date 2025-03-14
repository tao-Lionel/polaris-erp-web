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
        @on-load="getList"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-button type="primary" @click="handleAdd" size="small" v-if="permissions.warehouse_wmsfbareturn_add"
            >新 增</el-button
          >
          <el-dropdown-button
            v-if="permissions.warehouse_wmsfbareturn_export"
            type="primary"
            size="small"
            buttonText="导出"
            command="导出"
            @command="handleCommand"
          >
            <el-dropdown-item command="列表导出">列表导出</el-dropdown-item>
            <el-dropdown-item command="明细导出">明细导出</el-dropdown-item>
          </el-dropdown-button>
          <!-- <el-button type="primary"
                     @click="handleExport"
                     size="small"
                     v-if="permissions.warehouse_wmsfbareturn_export">导 出</el-button> -->
          <el-button type="primary" @click="handleDelete" size="small" v-if="permissions.warehouse_wmsfbareturn_delete"
            >删 除</el-button
          >
          <el-button type="primary" @click="handleSubmit" size="small" v-if="permissions.warehouse_wmsfbareturn_submit"
            >提交审核</el-button
          >
          <el-button type="primary" @click="handleCancel" size="small" v-if="permissions.warehouse_wmsfbareturn_cancel"
            >撤销提交</el-button
          >
          <el-button type="primary" @click="handleVerify" size="small" v-if="permissions.warehouse_wmsfbareturn_verify"
            >审 核</el-button
          >
          <el-button type="primary" @click="handleArrive" size="small" v-if="permissions.warehouse_wmsfbareturn_arrive"
            >到货确认</el-button
          >
        </template>
        <template slot-scope="scope" slot="operate">
          <i class="icon-rizhi y-reviews" @click.stop="showOperateLog(scope.row.returnOrderNo)"></i>
        </template>

        <template slot-scope="scope" slot="showInfo">
          <a @click.stop="showInfo(scope.row.returnOrderNo)">详情</a>
        </template>

        <template slot="returnOrderNo" slot-scope="scope">
          <router-link
            class="el-row-text"
            :title="scope.row.returnOrderNo"
            :to="{ path: '/fbareturn/detail', query: { returnOrderNo: scope.row.returnOrderNo } }"
            >{{ scope.row.returnOrderNo }}</router-link
          >
          <!-- <span class="orangeColorPointerCursor" @click="enterDetail(scope.row.purchaseOrderNo)">{{scope.row.purchaseOrderNo}}</span> -->
        </template>

        <template slot-scope="scope" slot="search">
          <el-form :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="returnOrderNo">
              <el-input
                v-model.trim="searchForm.returnOrderNo"
                size="small"
                placeholder="单据编号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="timeArray">
              <el-date-picker
                v-model="searchForm.timeArray"
                type="daterange"
                size="small"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item prop="warehouseArray">
              <el-select
                v-model="searchForm.warehouseArray"
                clearable
                collapse-tags
                size="small"
                placeholder="仓库"
                multiple
              >
                <el-option
                  v-for="(item, index) in warehouseList"
                  :key="index"
                  :label="item.warehouseName"
                  :value="item.warehouseId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="statusArray">
              <el-select
                v-model="searchForm.statusArray"
                collapse-tags
                clearable
                size="small"
                placeholder="单据状态"
                multiple
              >
                <el-option label="草稿" value="0"></el-option>
                <el-option label="待审核" value="1"></el-option>
                <el-option label="已审核" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="arriveStatusArray">
              <el-select
                v-model="searchForm.arriveStatusArray"
                collapse-tags
                clearable
                size="small"
                placeholder="到货状态"
                multiple
              >
                <el-option label="未到货" value="0"></el-option>
                <el-option label="部分到货" value="1"></el-option>
                <el-option label="全部到货" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="fbaRemoveNo">
              <el-input
                v-model.trim="searchForm.fbaRemoveNo"
                size="small"
                placeholder="FBA移除号"
                v-search-input
              ></el-input>
            </el-form-item>
          </el-form>
        </template>
      </avue-crud>

      <!-- 到货确认弹框 -->
      <el-dialog v-resize-dialog title="到货确认" :visible.sync="arriveConfirmDialog">
        <avue-crud :data="arriveConfirmData" :option="arriveConfirmOptions">
          <template slot-scope="scope" slot="arriveQuantity">
            <el-input
              :maxlength="9"
              v-model.trim="scope.row.arriveQuantity"
              size="small"
              placeholder=""
              @change="arriveQuantityChange(scope.row)"
            ></el-input>
          </template>
          <template slot-scope="scope" slot="relationNo">
            <el-input
              :maxlength="50"
              v-model.trim="scope.row.relationNo"
              size="small"
              placeholder=""
              @change="relationNoChange(scope.row)"
            ></el-input>
          </template>
          <template slot-scope="scope" slot="stockLocationId">
            <el-select v-model="scope.row.stockLocationId" clearable size="mini" placeholder="请选择">
              <el-option
                v-for="item in stockLocationOptions"
                :key="item.stockLocationId"
                :label="item.locationCode"
                :value="item.stockLocationId"
              ></el-option>
            </el-select>
          </template>
          <template slot-scope="scope" slot="businessTypeDescribe">
            <el-select
              size="mini"
              placeholder="请选择"
              @change="businessTypeChange(scope.row)"
              v-model="scope.row.businessTypeDescribe"
            >
              <el-option
                v-for="item in businessTypeList"
                :key="item.businessTypeId"
                :label="item.businessTypeDescribe"
                :value="item.businessTypeId"
              ></el-option>
            </el-select>
          </template>
        </avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button type="info" @click="arriveConfirmDialog = false" size="small">取消</el-button>
          <el-button type="primary" @click="arriveConfirm" size="small">确认</el-button>
        </span>
      </el-dialog>

      <el-dialog v-bind:title="confrimTitle" :visible.sync="confrimDialog" width="520px">
        <el-input
          type="textarea"
          :rows="2"
          :maxlength="100"
          placeholder="请填写原因，不得超过100个字符。(拒绝必填)"
          v-model.trim="confrimTextarea"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="info" size="small" @click="verify(1)">拒 绝</el-button>
          <el-button type="primary" size="small" @click="verify(0)">通 过</el-button>
        </span>
      </el-dialog>

      <!-- 操作日志 -->
      <pooperatelog ref="pooperatelog"></pooperatelog>
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
  deleteBatch,
  submitBatch,
  cancelBatch,
  getArriveConfirmInfo,
  getInfoByTypes,
  submitArriveConfirm,
  verifyBatch
} from "@/api/warehouse/fbareturn/wmsfbareturn"
import pooperatelog from "@/views/warehouse/wmsoperatelog"
import { tableOption, arriveConfirmOptions } from "@/const/crud/warehouse/fbareturn/wmsfbareturn"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import { getTokenUrl, getTokenUrlFile } from "@/util/auth"
import { getStockLocationInfo as getStockLocationList } from "@/api/baseSetup/wmsstocklocation/wmsstocklocation"
export default {
  name: "wmsfbareturn",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        returnOrderNo: "",
        startTime: "",
        endTime: "",
        warehouseId: "",
        status: "",
        arriveStatus: "",
        fbaRemoveNo: "",
        timeArray: [],
        warehouseArray: [],
        statusArray: [],
        arriveStatusArray: []
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
      warehouseList: [],
      selectList: [],
      arriveConfirmDialog: false,
      arriveConfirmData: [],
      arriveConfirmOptions: arriveConfirmOptions,
      businessTypeList: [],
      selectReturnOrderNo: "",
      confrimTitle: "",
      confrimDialog: false,
      confrimTextarea: "",
      stockLocationOptions: []
    }
  },
  created() {
    getInfoByTypes({ types: "4,5" }).then(({ data }) => {
      if (data.code === 0) {
        this.businessTypeList = data.data
      }
    })
    getAllWarehouse({ isFba: false }).then(({ data }) => {
      if (data.code == 0 && data.data.length > 0) {
        this.warehouseList = data.data
      }
    })
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  components: {
    pooperatelog
  },
  methods: {
    getList(page, params) {
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
     * @title 新增
     * @detail 调用crud的handleadd方法即可
     *
     **/
    handleAdd: function () {
      this.$router.push({
        path: "/fbareturn/detail",
        query: {}
      })
    },
    /**
     * 查看详情
     */
    showInfo(returnOrderNo) {
      this.$router.push({
        path: "/fbareturn/info",
        query: {
          returnOrderNo: returnOrderNo
        }
      })
    },

    //拉下选择
    handleCommand(command) {
      if (command == "列表导出") {
        this.handleExport()
      } else if (command == "明细导出") {
        this.exportDetail()
      }
    },
    formatParam() {
      var obj = deepCloneIgnoreNull(this.searchFormConfirm)
      var param = ""
      if (this.selectList.length > 0) {
        var returnOrderNo = ""
        for (var i = 0; i < this.selectList.length; i++) {
          if (i == 0) {
            returnOrderNo = this.selectList[i].returnOrderNo
          } else {
            returnOrderNo = returnOrderNo + "," + this.selectList[i].returnOrderNo
          }
        }
        param = "?returnOrderNo=" + returnOrderNo
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

      return param
    },
    /**
     * 列表导出
     */
    handleExport() {
      var param = this.formatParam()
      this.downloadUrl = getTokenUrlFile("/api/warehouse/wmsfbareturn/exportData" + param)
      window.location.href = this.downloadUrl
      this.$message.success("导出成功!")
    },
    /**
     * 明细导出
     */
    exportDetail() {
      var param = this.formatParam()
      this.downloadUrl = getTokenUrlFile("/api/warehouse/wmsfbareturn/exportDetailData/" + param)
      window.location.href = this.downloadUrl
      this.$message.success("导出成功!")
    },
    /**
     * 删除
     */
    handleDelete() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var returnOrderNoArray = []
      for (var i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].status != 0) {
          this.$message.error(this.selectList[i].returnOrderNo + "不是草稿状态，无法操作")
          return false
        }
        returnOrderNoArray.push(this.selectList[i].returnOrderNo)
      }
      deleteBatch({ returnOrderNos: returnOrderNoArray.join(",") }).then(({ data }) => {
        if (data.code === 0) {
          this.$refs.crud.selectClear()
          this.$message({
            message: "删除成功",
            type: "success"
          })
          this.getList(this.page)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    /**
     * 提交确认
     */
    handleSubmit() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var returnOrderNoArray = []
      for (var i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].status != 0) {
          this.$message.error(this.selectList[i].returnOrderNo + "不是草稿状态，无法操作")
          return false
        }
        returnOrderNoArray.push(this.selectList[i].returnOrderNo)
      }
      submitBatch({ returnOrderNos: returnOrderNoArray.join(",") }).then(({ data }) => {
        if (data.code === 0) {
          this.$refs.crud.selectClear()
          this.$message({
            message: "提交审核成功",
            type: "success"
          })
          this.getList(this.page)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    /**
     * 撤销确认
     */
    handleCancel() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var returnOrderNoArray = []
      for (var i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].status != 1) {
          this.$message.error(this.selectList[i].returnOrderNo + "不是待审核状态，无法操作")
          return false
        }
        returnOrderNoArray.push(this.selectList[i].returnOrderNo)
      }
      cancelBatch({ returnOrderNos: returnOrderNoArray.join(",") }).then(({ data }) => {
        if (data.code === 0) {
          this.$refs.crud.selectClear()
          this.$message({
            message: "撤销提交成功",
            type: "success"
          })
          this.getList(this.page)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    /**
     * 打开审核弹框
     */
    handleVerify() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      for (var i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].status != 1) {
          this.$message.error(this.selectList[i].returnOrderNo + "不是待审核状态，无法操作")
          return false
        }
      }
      this.confrimTitle = "审核"
      this.confrimDialog = true
      this.confrimTextarea = ""
    },
    /**
     * 审核
     */
    verify(type) {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var returnOrderNoArray = []
      for (var i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].status != 1) {
          this.$message.error(this.selectList[i].returnOrderNo + "不是待审核状态，无法操作")
          return false
        }
        returnOrderNoArray.push(this.selectList[i].returnOrderNo)
      }
      if (type == 1 && !this.confrimTextarea) {
        this.$message.error("拒绝原因不能为空")
        return false
      }
      verifyBatch({
        returnOrderNos: returnOrderNoArray.join(","),
        type: type,
        rejectReason: this.confrimTextarea
      }).then(({ data }) => {
        if (data.code === 0) {
          this.$refs.crud.selectClear()
          var tip = "审核通过成功"
          if (type == 1) {
            var tip = "审核拒绝成功"
          }
          this.$message({
            message: tip,
            type: "success"
          })
          this.confrimDialog = false
          this.getList(this.page)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    /**
     * 打开到货确认弹框
     */
    handleArrive() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      if (!this.selectList || this.selectList.length != 1) {
        this.$message.error("只能选择一条数据")
        return
      }
      var status = this.selectList[0].status
      var arriveStatus = this.selectList[0].arriveStatus
      if (status != 2) {
        this.$message.error(this.selectList[0].returnOrderNo + "不是已审核状态，无法操作")
        return false
      }
      if (arriveStatus == 2) {
        this.$message.info(this.selectList[0].returnOrderNo + "已全部到货")
        return false
      }
      getArriveConfirmInfo(this.selectList[0].returnOrderNo).then(({ data }) => {
        if (data.code === 0) {
          this.selectReturnOrderNo = this.selectList[0].returnOrderNo
          this.arriveConfirmData = data.data
          var query = {
            warehouseId: this.selectList[0].warehouseId
          }
          getStockLocationList(query).then(({ data }) => {
            if (data.code === 0) {
              this.stockLocationOptions = data.data

              if (this.stockLocationOptions.length === 1) {
                for (var i = 0; i < this.arriveConfirmData.length; i++) {
                  this.$set(this.arriveConfirmData[i], "stockLocationId", this.stockLocationOptions[0].stockLocationId)
                }
              }
              this.arriveConfirmDialog = true
            }
          })
        } else {
          this.$message.error(data.msg)
          return
        }
      })
    },
    /**
     * 到货确认
     */
    arriveConfirm() {
      var flag = false
      for (var i = 0; i < this.arriveConfirmData.length; i++) {
        var item = this.arriveConfirmData[i]
        var arriveQuantity = item.arriveQuantity
        var fnsku = item.platformSkuCode
        var relationNo = item.relationNo
        var returnQuantity = item.returnQuantity
        var hasArriveQuantity = item.hasArriveQuantity
        var stockLocationId = item.stockLocationId
        var relationNo = item.relationNo
        for (var j = 0; j < this.businessTypeList.length; j++) {
          if (this.businessTypeList[j].stockLocationId === stockLocationId) {
            if (this.businessTypeList[j].type == 4 && !stockLocationId) {
              this.$message.error("FNsku:" + fnsku + "未选择库位，请检查")
              return false
            }
          }
        }
        if (arriveQuantity) {
          if (!this.checkNumberAndZero(arriveQuantity)) {
            this.$message.error("FNsku:" + fnsku + "本次到货数量需要为正整数，请修改")
            return false
          }
          if (parseInt(arriveQuantity) > parseInt(returnQuantity) - parseInt(hasArriveQuantity)) {
            this.$message.error("FNsku:" + fnsku + "本次到货数量大于剩余可用数量，请修改")
            return false
          }
          if (parseInt(arriveQuantity) > 0) {
            flag = true
            if (!relationNo) {
              this.$message.error("请填写FNsku:" + fnsku + "的关联单号")
              return false
            }
          }
          if (!this.checkRelationNo(relationNo)) {
            this.$message.error("FNsku:" + fnsku + "的关联单号需要是英文字母或者数字或者特殊字符，请修改")
            return false
          }
        }
      }
      if (!flag) {
        this.$message.error("所有FNsku本次到货数量均为0，请检查")
        return false
      }
      submitArriveConfirm({
        returnOrderNo: this.selectReturnOrderNo,
        wmsFbaReturnDetailList: this.arriveConfirmData
      }).then(({ data }) => {
        if (data.code === 0) {
          this.$refs.crud.selectClear()
          this.$message({
            message: "到货确认成功",
            type: "success"
          })
          this.arriveConfirmDialog = false
          this.getList(this.page)
        } else {
          this.$message.error(data.msg)
          return
        }
      })
    },
    /**
     * 改变本次到货数量
     */
    arriveQuantityChange(row) {
      var arriveQuantity = row.arriveQuantity
      var fnsku = row.platformSkuCode
      var returnQuantity = row.returnQuantity
      var hasArriveQuantity = row.hasArriveQuantity
      if (!arriveQuantity) {
        return
      }
      if (!this.checkNumberAndZero(arriveQuantity)) {
        this.$message.error("FNsku:" + fnsku + "本次到货数量需要为正整数，请修改")
        return false
      }
      if (parseInt(arriveQuantity) > parseInt(returnQuantity) - parseInt(hasArriveQuantity)) {
        this.$message.error("FNsku:" + fnsku + "本次到货数量大于剩余可用数量，请修改")
        return false
      }
    },
    /**
     *改变处理方式
     */
    businessTypeChange(row) {
      this.$set(row, "businessTypeId", row.businessTypeDescribe)
    },
    /**
     * 改变关联单号
     */
    relationNoChange(row) {
      var relationNo = row.relationNo
      var fnsku = row.platformSkuCode
      if (!this.checkRelationNo(relationNo)) {
        this.$message.error("FNsku:" + fnsku + "的关联单号需要是英文字母或者数字或者特殊字符，请修改")
        return false
      }
    },
    /**
     * 查看操作日志
     */
    showOperateLog: function (returnOrderNo) {
      this.$refs.pooperatelog.showOperateLogDialog(returnOrderNo, 5)
    },
    /**
     * 检查是否为0或者正整数
     */
    checkNumberAndZero(data) {
      var reg = /^(([1-9][0-9]*)|0)$/
      if (!reg.test(data)) {
        return false
      } else {
        return true
      }
    },
    /**
     * 关联单号的限制是50字符以内，英文字母或者数字或者特殊字符
     */
    checkRelationNo(data) {
      var reg = /^(([a-zA-Z0-9\.\@\!\-\_\#\$\%\^\&\*\(\)]{0,50})|0)$/
      if (!reg.test(data)) {
        return false
      } else {
        return true
      }
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
      this.searchForm.status = this.searchForm.statusArray.join(",")
      this.searchForm.warehouseId = this.searchForm.warehouseArray.join(",")
      this.searchForm.arriveStatus = this.searchForm.arriveStatusArray.join(",")
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
    /**
     * 改变勾选
     */
    selectionChange(list) {
      this.selectList = list
    }
  }
}
</script>

<style lang="scss" scoped></style>
