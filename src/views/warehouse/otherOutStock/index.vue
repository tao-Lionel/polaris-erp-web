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
        class="handle-row-text"
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @selection-change="selectionChange"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="rowDel"
      >
        <template slot="menuLeft">
          <el-button type="primary" @click="openNewWindow" size="small" v-if="permissions.other_out_stock_create"
            >新 增</el-button
          >

          <el-dropdown-button
            v-if="permissions.other_out_stock_export"
            type="primary"
            size="small"
            buttonText="导出"
            command="导出"
            @command="handleCommand"
          >
            <el-dropdown-item command="列表导出">列表导出</el-dropdown-item>
            <el-dropdown-item command="明细导出">明细导出</el-dropdown-item>
          </el-dropdown-button>
          <el-button type="primary" @click="delRow" size="small" v-if="permissions.other_out_stock_del">删除</el-button>
          <el-button
            type="primary"
            @click="approvalProcess(0, 'approve')"
            size="small"
            v-if="permissions.other_out_stock_approve"
            >提交</el-button
          >
          <el-button
            type="primary"
            @click="approvalProcess(1, 'reverse')"
            size="small"
            v-if="permissions.other_out_stock_approve"
            >撤销提交</el-button
          >

          <el-dropdown-button
            type="primary"
            size="small"
            buttonText="财务审核"
            command="财务审核"
            v-if="permissions.other_out_stock_financial_approve"
            @command="handleCommand"
          >
            <el-dropdown-item command="财务反审核">财务反审核</el-dropdown-item>
          </el-dropdown-button>

          <el-dropdown-button
            type="primary"
            size="small"
            buttonText="物流审核"
            command="物流审核"
            v-if="permissions.other_out_stock_logistics_approve"
            @command="handleCommand"
          >
            <el-dropdown-item command="物流反审核">物流反审核</el-dropdown-item>
          </el-dropdown-button>

          <el-button
            type="primary"
            style="margin-left: 10px"
            @click="showConfrim(3, '仓库审核')"
            size="small"
            v-if="permissions.other_out_stock_warehouse_approve"
            >仓库审核</el-button
          >
        </template>
        <template slot="orderNo" slot-scope="scope">
          <copy-text hoverToShow>
            <router-link
              class="el-row-text"
              :to="'/otherOutStock/create?orderNo=' + scope.row.orderNo"
              :title="scope.row.orderNo"
              >{{ scope.row.orderNo }}</router-link
            >
          </copy-text>
        </template>
        <!--数量-->
        <template slot="sumOutNum" slot-scope="scope">
          <el-button type="text" @click="showDetail(scope.row.orderNo)">{{ scope.row.sumOutNum }}</el-button>
        </template>
        <!-- 操作日志 -->
        <template slot="operateLog" slot-scope="scope">
          <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row.orderNo)"></i>
        </template>
        <template slot-scope="scope" slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="orderNo">
              <el-input
                clearable
                v-model="searchForm.orderNo"
                size="small"
                placeholder="单据编号,支持多个"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item class="form-label" prop="searchDate">
              <el-date-picker
                size="small"
                v-model="searchForm.searchDate"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd"
                start-placeholder="单据开始日期"
                end-placeholder="单据结束日期"
              ></el-date-picker>
            </el-form-item>

            <el-form-item prop="warehouseId">
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
            <el-form-item prop="dataStatus">
              <el-select
                v-model="searchForm.dataStatus"
                size="small"
                multiple
                collapse-tags
                filterable
                clearable
                placeholder="状态"
              >
                <el-option
                  v-for="item in dataStatusOptions"
                  :key="item.dataStatus"
                  :label="item.statusDescribe"
                  :value="item.dataStatus"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </avue-crud>
      <!-- 操作日志 -->
      <pooperatelog ref="pooperatelog" title="出库记录"></pooperatelog>
      <el-dialog v-bind:title="confrimTitle" :visible.sync="confrimDialog" width="30%">
        <!-- :before-close="handleClose"> -->
        <!-- <el-radio v-model="confrimType" label="1">同意</el-radio>
        <el-radio v-model="confrimType" label="2">拒绝</el-radio>-->
        <el-input
          type="textarea"
          :rows="2"
          :maxlength="100"
          placeholder="拒绝时填写信息，不得超过100个字符。"
          v-model="rejMsg"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="confrimDialog = false">取 消</el-button> -->
          <!-- <el-button type="primary" @click="handleConfrim()">确 定</el-button> -->
          <el-button type="info" size="small" @click="approvalProcess(null, 'reject')">拒 绝</el-button>
          <el-button type="primary" size="small" @click="approvalProcess(null, 'approve')">通 过</el-button>
        </span>
      </el-dialog>
      <!--明细-->
      <el-dialog title="sku信息" :visible.sync="detailTableVisible">
        <el-table :data="detailTableData" height="400px" border style="width: 100%">
          <!-- <el-table-column prop="platformSkuCode" label="FNSKU" width="180"></el-table-column> -->
          <!-- <el-table-column prop="spuCode" label="标准SPU" width="150px"></el-table-column> -->
          <el-table-column prop="skuCode" label="SKU" width="150px"></el-table-column>
          <el-table-column prop="skuName" label="产品名称" width="200px"></el-table-column>
          <el-table-column prop="locationCode" label="库位"></el-table-column>
          <el-table-column prop="platform" label="平台"></el-table-column>
          <el-table-column prop="site" label="站点"></el-table-column>
          <el-table-column prop="operateQuantity" label="数量"></el-table-column>
        </el-table>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import pooperatelog from "@/views/warehouse/wmsoperatelog"
import { getUrlConcatToken } from "@/util/auth"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  delRows,
  approvalProcess,
  getSavedInfo,
  getNumInfo
} from "@/api/warehouse/otherOutStock/wmsotheroutstock"
import { tableOption } from "@/const/crud/warehouse/otherOutStock/wmsotheroutstock"
import { mapGetters } from "vuex"
import { getStatusByFuncName } from "@/api/baseSetup/bsestatusorderrecord"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
export default {
  name: "wmsotheroutstock",
  components: {
    pooperatelog
  },
  data() {
    return {
      dataStatusOptions: [],
      // loading: false,
      detailTableData: [],
      detailTableVisible: false,
      rejMsg: "",
      order: "",
      confrimTitle: "",
      confrimDialog: false,
      selectRows: [],
      warehouseOptions: [],
      //搜索条件，和前端控件绑定
      searchForm: {
        orderNo: "",
        searchDate: [],
        value1: "",
        value2: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      // tableLoading: false,
      tableOption: tableOption
    }
  },
  created() {
    this.loadAll()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    loadAll() {
      this.getAllWarehouse()
      this.getStatusByFuncName()
    },
    /**
     * 查状态
     */
    getStatusByFuncName() {
      var query = {
        funcName: "other_out_stock_v2"
      }
      getStatusByFuncName(query).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.dataStatusOptions = data
        }
      })
    },
    goToDetail(row) {
      this.$router.push({
        path: "/order/orderManages/detail",
        query: { id: row.id }
      })
    },
    //查看明细
    showDetail(orderNo) {
      getNumInfo({ orderNo }).then((response) => {
        var data = response.data.data
        if (response.data.code == 0) {
          this.detailTableData = data
          this.detailTableVisible = true
          // this.$set(this.otherInStock, "tableData", data.saveDetailList);
        } else {
          this.$message.error("加载页面失败")
          return
        }
      })
    },
    /**
     * 查看操作日志
     */
    showOperateLog: function (orderNo) {
      this.$refs.pooperatelog.showOperateLogDialog(orderNo, 1)
    },
    //选中数据
    selectionChange(tableData) {
      this.selectRows = tableData
    },
    //拉下选择
    handleCommand(command) {
      if (command == "列表导出") {
        this.exportExcel("main")
      } else if (command == "明细导出") {
        this.exportExcel("detail")
      } else if (command == "物流审核") {
        this.showConfrim(2, command)
      } else if (command == "物流反审核") {
        this.approvalProcess(3, "reverse")
      } else if (command == "财务审核") {
        this.showConfrim(1, command)
      } else if (command == "财务反审核") {
        this.approvalProcess(2, "reverse")
      }
    },
    showConfrim(order, command) {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }

      this.rejMsg = ""
      this.order = order
      this.confrimTitle = command
      this.confrimDialog = true
    },
    //提交或撤销提交 0提交 1撤销
    approvalProcess(order, functionName) {
      if (order == null) {
        order = this.order
      }
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }

      if (functionName === "reject" && !this.rejMsg) {
        this.$message.warning("请填写拒绝原因")
        return
      }

      for (let index = 0; index < this.selectRows.length; index++) {
        const element = this.selectRows[index]
      }
      var approvalProcessVo = {
        wmsOtherOutStockList: this.selectRows,
        rejMsg: this.rejMsg
      }
      // this.loading = true;
      approvalProcess(approvalProcessVo, order, functionName).then((response) => {
        if (response.data.code == 0) {
          this.$notify({
            title: "成功",
            message: "操作成功",
            type: "success",
            duration: 2000
          })
          this.confrimDialog = false
          this.getList(this.page)
          this.$refs.crud.selectClear()
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("操作失败")
          return
        }
      })
      // .finally(() => {
      //   this.loading = false;
      // });
    },
    //删除
    delRow() {
      if (!this.selectRows || this.selectRows.length == 0) {
        this.$message.warning("请勾选数据操作")
        return
      }
      var orderNoList = []
      var dataStatusFlag = true
      this.selectRows.forEach((item) => {
        if (item.dataStatus != 0) {
          dataStatusFlag = false
        }
        orderNoList.push(item.orderNo)
      })
      if (!dataStatusFlag) {
        this.$message.warning("请勾选状态为[未处理]数据")
        return
      }
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delRows(orderNoList).then((response) => {
            //this.tableData.splice(this.selectList[0].$index, 1, Object.assign({}, selectRow))
            if (response.data.code == 0) {
              this.getList(this.page)
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              })
              // 手动调用清除选择
              this.$refs.crud.selectClear()
              //刷新父页面不关闭
              if (this.$parent.$refs.tagNavigate) {
                this.$parent.$refs.tagNavigate.clearTagCache(this.$route.meta.parentPath)
              }
            } else if (response.data.code == 1) {
              this.$message.error(response.data.msg)
              return
            } else {
              this.$message.error("删除失败")
              return
            }
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    },
    //导出
    exportExcel(type) {
      if (!this.tableData || this.tableData.length == 0) {
        this.$message.error("没有可导出数据")
        return
      }
      var param = "&type=" + type
      if (this.selectRows && this.selectRows.length > 0) {
        this.selectRows.forEach((item) => {
          param = param + "&selectNo=" + item.orderNo
        })
      }

      if (this.searchFormConfirm.orderNo) {
        param = param + "&orderNo=" + this.searchFormConfirm.orderNo
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
      if (this.searchFormConfirm.dataStatus) {
        this.searchFormConfirm.dataStatus.forEach((item) => {
          param = param + "&dataStatus=" + item
        })
      }
      window.location = getUrlConcatToken("/api/warehouse/wmsotheroutstock/exportExcel") + param
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
    //新建
    openNewWindow() {
      this.$router.push({
        path: "/otherOutStock/create",
        query: {}
      })
    },
    getList(page, params) {
      if (!page) {
        page = {
          currentPage: 1
        }
      }
      // this.tableLoading = true;
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
        // this.tableLoading = false;
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
      this.$confirm("是否确认删除ID为" + row.orderNo, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.orderNo)
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
    }
  }
}
</script>
