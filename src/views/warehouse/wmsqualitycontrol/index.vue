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
  <div class="execution" id="wmsqualitycontrol">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @selection-change="selectionChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="rowDel"
      >
        <template slot="menuLeft">
          <el-button
            type="primary"
            @click="showQualityInfo()"
            size="small"
            v-if="permissions.warehouse_wmsqualitycontrol_quality"
            >质检</el-button
          >
          <!-- <el-button type="primary"
                     @click="changeStandardStatus(1)"
                     size="small"
                     v-if="permissions.warehouse_wmsqualitycontrol_standard">合 格</el-button>
          <el-button type="primary"
                     @click="changeStandardStatus(2)"
                     size="small"
                     v-if="permissions.warehouse_wmsqualitycontrol_unstandard">不合格</el-button> -->
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="timeArray">
              <el-date-picker
                v-model="searchForm.timeArray"
                type="daterange"
                size="small"
                start-placeholder="质检开始日期"
                end-placeholder="质检结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="wmsQualityControlNo">
              <el-input
                v-model.trim="searchForm.wmsQualityControlNo"
                size="small"
                placeholder="质检编号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="statusArray" collapse-tags clearable size="small" placeholder="质检状态" multiple>
                <el-option label="待检" value="0"></el-option>
                <el-option label="不合格" value="2"></el-option>
                <el-option label="部分合格" value="3"></el-option>
                <el-option label="合格" value="1"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-button native-type="submit" v-show="false" @click="searchChange"></el-button> -->
          </el-form>
        </template>
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="supplierName">
              <el-input v-model.trim="searchForm.supplierName" size="small" placeholder="供应商"></el-input>
            </el-form-item>
            <el-form-item prop="wmsSignNo">
              <el-input
                v-model.trim="searchForm.wmsSignNo"
                size="small"
                placeholder="签收编号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="corporationName">
              <el-input v-model.trim="searchForm.corporationName" size="small" placeholder="法人主体"></el-input>
            </el-form-item>
            <el-form-item prop="skuCode">
              <el-input v-model.trim="searchForm.skuCode" size="small" placeholder="SKU" v-search-input></el-input>
            </el-form-item>
            <el-form-item prop="purchaseOrderNo">
              <el-input
                v-model.trim="searchForm.purchaseOrderNo"
                size="small"
                placeholder="采购单号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="poContractNo">
              <el-input
                v-model.trim="searchForm.poContractNo"
                size="small"
                placeholder="合同编号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="taxType">
              <el-select v-model="searchForm.taxType" clearable size="small" placeholder="税别">
                <el-option label="含税" value="1"></el-option>
                <el-option label="非税" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="deliveryNo">
              <el-input
                v-model.trim="searchForm.deliveryNo"
                size="small"
                placeholder="送货单号"
                v-search-input
              ></el-input>
            </el-form-item>
            <!-- <el-button native-type="submit" v-show="false" @click="searchChange"></el-button> -->
          </el-form>
        </template>
      </avue-crud>

      <el-dialog title="不合格原因" :visible.sync="unstandardDialog" width="400px">
        <el-input
          type="textarea"
          :rows="3"
          :maxlength="100"
          placeholder="请输入不合格原因，不得超过100个字符。"
          v-model.trim="unstandardReason"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="unstandardConfrim()">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="质检" :visible.sync="qualityDialog" width="900px" class="zhi_dialog">
        <p class="float_p">
          <span>sku:{{ wmsQualityInfo.skuCode }}</span>
          <span>签收编号:{{ wmsQualityInfo.wmsSignNo }}</span>
          <span>签收数量:{{ wmsQualityInfo.deliveryQuantity }}</span>
        </p>
        <el-form :inline="true" class="demo-form-inline form-line">
          <el-form-item label="良品数量(PCS)：">
            <el-input
              size="mini"
              v-model.trim="qualityForm.standardQuantity"
              @change="standardQuantityChange"
            ></el-input>
          </el-form-item>
          <el-form-item label="不良品数量(PCS)：">
            <span size="mini">{{ qualityForm.unstandardQuantity }}</span>
          </el-form-item>
          <el-form-item label="不良原因：">
            <el-input
              type="textarea"
              :rows="2"
              maxlength="20"
              placeholder="限制20字符以内"
              autosize
              v-model.trim="qualityForm.remarks"
            ></el-input>
          </el-form-item>
        </el-form>
        <table class="dialog_table">
          <tr>
            <td>产品尺寸(cm)</td>
            <td>产品重量(kg)</td>
            <td>包装尺寸(cm)</td>
            <td>装箱信息(cm)</td>
            <td style="width: 140px"></td>
          </tr>
          <tr>
            <td>长：{{ wmsQualityInfo.skuLength }}</td>
            <td>产品净重：{{ wmsQualityInfo.skuWeight }}</td>
            <td>包装长：{{ wmsQualityInfo.packageLength }}</td>
            <td>外箱长：{{ wmsQualityInfo.outerBoxLength }}</td>
            <td>单箱数量：{{ wmsQualityInfo.boxs }}</td>
          </tr>
          <tr>
            <td>宽：{{ wmsQualityInfo.skuWidth }}</td>
            <td>产品毛重：{{ wmsQualityInfo.skuGrossWeight }}</td>
            <td>包装宽：{{ wmsQualityInfo.packageWidth }}</td>
            <td>外箱宽：{{ wmsQualityInfo.outerBoxWidth }}</td>
            <td></td>
          </tr>
          <tr>
            <td>高：{{ wmsQualityInfo.skuHeight }}</td>
            <td>外箱重量：{{ wmsQualityInfo.boxGrossWeight }}</td>
            <td>包装高：{{ wmsQualityInfo.packageHeight }}</td>
            <td>外箱高：{{ wmsQualityInfo.outerBoxHeight }}</td>
            <td></td>
          </tr>
        </table>

        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="qualityDialog = false">取 消</el-button>
          <el-button size="small" type="primary" @click="submitQuantityData()">确 定</el-button>
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
  changeStatus,
  getWmsQualityInfo
} from "@/api/warehouse/wmsqualitycontrol"
import { tableOption } from "@/const/crud/warehouse/wmsqualitycontrol"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "wmsqualitycontrol",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        startTime: "",
        endTime: "",
        wmsQualityControlNo: "",
        supplierName: "",
        status: "",
        wmsSignNo: "",
        corporationName: "",
        skuCode: "",
        purchaseOrderNo: "",
        poContractNo: "",
        taxType: "",
        deliveryNo: "",
        timeArray: []
      },
      statusArray: [],
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },

      tableOption: tableOption,
      unstandardDialog: false,
      unstandardReason: "",
      selectList: [],
      wmsQualityInfo: {
        skuCode: "",
        wmsSignNo: "",
        deliveryQuantity: "",
        skuLength: "",
        skuWidth: "",
        skuHeight: "",
        skuWeight: "",
        skuGrossWeight: "",
        boxGrossWeight: "",
        packageLength: "",
        packageWidth: "",
        packageHeight: "",
        outerBoxLength: "",
        outerBoxWidth: "",
        outerBoxHeight: "",
        boxs: "",
        deliveryDetailId: ""
      },
      qualityDialog: false,
      qualityForm: {
        standardQuantity: "",
        unstandardQuantity: "",
        remarks: ""
      }
    }
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    checkNumberAndZero(data) {
      var reg = /^(([1-9][0-9]*)|0)$/
      if (!reg.test(data)) {
        return false
      } else {
        return true
      }
    },
    submitQuantityData() {
      if (!this.checkQuantityData()) {
        return false
      }
      if (this.qualityForm.unstandardQuantity) {
        if (!this.qualityForm.remarks) {
          this.$message.error("不良原因不能为空")
          return false
        }
      }
      changeStatus({
        deliveryDetailIds: this.wmsQualityInfo.deliveryDetailId,
        standardQuantity: this.qualityForm.standardQuantity,
        remarks: this.qualityForm.remarks
      }).then(({ data }) => {
        this.$refs.crud.selectClear()
        if (data.code == 0) {
          this.$message({
            message: "质检操作成功",
            type: "success"
          })
          this.qualityDialog = false
          this.getList(this.page)
        } else if (data.code == 1 && data.msg) {
          this.$message.error(data.msg)
        } else {
          this.$message.error("质检操作失败")
        }
      })
    },
    standardQuantityChange() {
      if (!this.checkQuantityData()) {
        return false
      }
      this.qualityForm.unstandardQuantity =
        parseInt(this.wmsQualityInfo.deliveryQuantity) - parseInt(this.qualityForm.standardQuantity)
    },
    checkQuantityData() {
      var standardQuantity = this.qualityForm.standardQuantity
      var deliveryQuantity = this.wmsQualityInfo.deliveryQuantity
      if (!this.checkNumberAndZero(standardQuantity)) {
        this.$message.error("良品数量不是数字，请修改")
        this.qualityForm.unstandardQuantity = ""
        return false
      }
      if (parseInt(standardQuantity) > parseInt(deliveryQuantity)) {
        this.$message.error("良品数量不能大于签收数量，请修改")
        this.qualityForm.unstandardQuantity = ""
        return false
      }
      return true
    },
    showQualityInfo() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      if (this.selectList.length != 1) {
        this.$message.error("只能勾选一条数据")
        return
      }
      var deliveryDetailId = this.selectList[0].deliveryDetailId
      var nowStatus = this.selectList[0].status
      if (nowStatus && (nowStatus == 1 || nowStatus == 2 || nowStatus == 3)) {
        this.$message.error("该票件已经进行过质检操作，请检查")
        return false
      }
      getWmsQualityInfo({ deliveryDetailId: deliveryDetailId }).then(({ data }) => {
        if (data.code == 0) {
          this.wmsQualityInfo = data.data
          this.qualityForm = {
            standardQuantity: "",
            unstandardQuantity: "",
            remarks: ""
          }
          this.qualityDialog = true
        } else {
          this.$message.error("查询质检信息失败")
        }
      })
    },
    changeStandardStatus(status) {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      for (var i = 0; i < this.selectList.length; i++) {
        var nowStatus = this.selectList[i].status
        if (nowStatus && (nowStatus == 1 || nowStatus == 2)) {
          this.$message.error("存在质检状态为合格或不合格的质检编号，请检查")
          return false
        }
      }
      if (status == 1) {
        this.changeStandardStatusConfirm(status, null)
      }
      if (status == 2) {
        this.unstandardDialog = true
      }
    },
    changeStandardStatusConfirm(status, remarks) {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var deliveryDetailIds = []
      for (var i = 0; i < this.selectList.length; i++) {
        var nowStatus = this.selectList[i].status
        var deliveryDetailId = this.selectList[i].deliveryDetailId
        if (nowStatus && (nowStatus == 1 || nowStatus == 2)) {
          this.$message.error("存在质检状态为合格或不合格的质检编号，请检查")
          return false
        }
        deliveryDetailIds.push(deliveryDetailId)
      }

      changeStatus({
        deliveryDetailIds: deliveryDetailIds.join(","),
        status: status,
        remarks: remarks
      }).then(({ data }) => {
        this.$refs.crud.selectClear()
        if (data.code == 0) {
          this.$message({
            message: "操作成功",
            type: "success"
          })
          this.getList(this.page)
        } else if (data.code == 1 && data.msg) {
          this.$message.error(data.msg)
        } else {
          this.$message.error("操作失败")
        }
      })
    },
    unstandardConfrim() {
      if (this.unstandardReason && this.unstandardReason != "") {
        this.unstandardDialog = false
        this.changeStandardStatusConfirm(2, this.unstandardReason)
      } else {
        this.$message.error("请填写不合格原因")
        return false
      }
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
      this.searchForm.status = this.statusArray.join(",")
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
      this.statusArray = []
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
#wmsqualitycontrol {
  .zhi_dialog {
    .el-dialog__body {
      overflow: hidden;
    }

    .form-line {
      margin: 10px 0;

      .el-form-item {
        width: 33%;
        float: left;
        margin: 0;
        padding: 0 10px 5px 0;
        box-sizing: border-box;
      }
    }

    .float_p {
      margin-top: 10px;
      overflow: hidden;

      span {
        width: 33%;
        float: left;
        margin-right: 0px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .dialog_table {
      width: 100%;
      // 这里是滚动
      display: block;
      overflow-x: auto;

      td {
        padding: 5px;
        box-sizing: border-box;
        white-space: nowrap;
        width: 20%;
        //这里是省略
        // width: 20%;
        // display: inline-block;
        // overflow: hidden;
        // text-overflow: ellipsis;
      }

      tr:nth-child(1) td {
        color: #0066cc;
      }
    }
  }
}
</style>
