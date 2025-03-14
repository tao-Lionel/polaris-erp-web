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
  <div class="execution" id="wmsinbound">
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
          <el-button type="primary" @click="inStoreOperate" size="small" v-if="permissions.wmsInbound_inStore"
            >入库</el-button
          >
          <el-button type="primary" @click="exportList" size="small" v-if="permissions.wmsInbound_export"
            >导出</el-button
          >
          <el-button type="primary" @click="showImport" size="small" v-if="permissions.wmsInbound_export"
            >导入入库</el-button
          >
        </template>
        <!-- <template slot-scope="scope"
                  slot="menu">
          <el-button type="text"
                     v-if="permissions.warehouse_wmsinbound_edit"
                     icon="el-icon-check"
                     size="small"
                     plain
                     @click="handleEdit(scope.row,scope.index)">编辑</el-button>
          <el-button type="text"
                     v-if="permissions.warehouse_wmsinbound_del"
                     icon="el-icon-delete"
                     size="small"
                     plain
                     @click="handleDel(scope.row,scope.index)">删除</el-button>
        </template> -->

        <template slot-scope="scope" slot="search">
          <el-form
            @keyup.enter.native="searchChange"
            :model="searchForm"
            :inline="true"
            ref="searchForm"
            style="float: left"
          >
            <el-form-item prop="inboundDateArr">
              <!-- <el-date-picker
                v-model="searchForm.inboundDateArr"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker> -->

              <el-date-picker
                size="small"
                v-model="searchForm.inboundDateArr"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                type="daterange"
                align="left"
                unlink-panels
                range-separator="至"
                start-placeholder="入库开始日期"
                end-placeholder="入库结束日期"
                :picker-options="pickerOptions2"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item prop="shippingContainerNo">
              <el-input
                v-search-input
                clearable
                v-model="searchForm.shippingContainerNo"
                placeholder="出货柜号,支持多个"
                size="small"
              ></el-input>
            </el-form-item>

            <el-form-item prop="status">
              <el-select v-model="searchForm.status" size="small" placeholder="入库状态" clearable>
                <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-button native-type="submit" v-show="false" @click="searchChange"></el-button> -->
          </el-form>
        </template>
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="supplierName"
              ><!--此处需要绑定搜索变量，否则清空会失败-->
              <el-input
                v-model="searchForm.supplierName"
                size="small"
                placeholder="供应商"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="wmsSignNo">
              <el-input
                v-model="searchForm.wmsSignNo"
                size="small"
                placeholder="签收单号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="corporationName">
              <el-input
                v-model="searchForm.corporationName"
                size="small"
                placeholder="法人主体"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="skuCode">
              <el-input v-model="searchForm.skuCode" size="small" placeholder="SKU" v-search-input clearable></el-input>
            </el-form-item>

            <el-form-item prop="purchaseOrderNo">
              <el-input
                v-model="searchForm.purchaseOrderNo"
                size="small"
                placeholder="采购单号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="poContractNo">
              <el-input
                v-model="searchForm.poContractNo"
                size="small"
                placeholder="合同单号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="taxType">
              <el-select v-model="searchForm.taxType" size="small" placeholder="税别" clearable>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="deliveryNo">
              <el-input
                v-model="searchForm.deliveryNo"
                size="small"
                placeholder="送货单号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="cabinetCode">
              <el-input
                v-model="searchForm.cabinetCode"
                size="small"
                placeholder="排柜号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="inboundUserDisplayName">
              <el-input
                v-model="searchForm.inboundUserDisplayName"
                size="small"
                placeholder="制单员"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="wmsQualityControlNo"
              ><!--此处需要绑定搜索变量，否则清空会失败-->
              <el-input
                v-model="searchForm.wmsQualityControlNo"
                size="small"
                placeholder="质检单号"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="wmsInboundNo ">
              <el-input
                v-model="searchForm.wmsInboundNo"
                size="small"
                placeholder="入库单号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="displayname">
              <el-input
                v-search-input
                clearable
                style="max-width: 500px"
                v-model="searchForm.displayname"
                placeholder="采购员"
                size="small"
                class="searchInput"
              ></el-input>
            </el-form-item>
            <el-form-item prop="wmsInboundBatchNo">
              <el-input
                v-model="searchForm.wmsInboundBatchNo"
                size="small"
                placeholder="入库批次号"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="warehouseId">
              <el-select v-model="searchForm.warehouseId" size="small" filterable clearable placeholder="仓库">
                <el-option
                  v-for="item in warehouseOptions"
                  :key="item.warehouseId"
                  :label="item.warehouseName"
                  :value="item.warehouseId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <template slot-scope="scope" slot="deliveryNo">
          <!-- <el-button type="text" style="padding:0;" @click="showDetail(scope.row)">{{ scope.row.deliveryNo }}</el-button> -->
          <copy-text hoverToShow>
            <a style="padding: 0" @click="showDetail(scope.row)">{{ scope.row.deliveryNo }}</a>
          </copy-text>
        </template>
      </avue-crud>
      <!-- 入库选择库位 -->
      <!-- <el-dialog title="请选择库位" :visible.sync="inboundDialogVisible" width="30%" center>
        <el-form>
          <el-form-item label="请选择库位">
            <el-select v-model="locationIdSel" size="small" placeholder="请选择">
              <el-option v-for="item in locationOptions" :key="item.stockLocationId" :label="item.locationCode"
                :value="item.stockLocationId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="inboundDialogVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="ensureInstore">确 定</el-button>
        </span>
      </el-dialog> -->

      <!-- 确认入库 -->
      <el-dialog title="确认入库" :visible.sync="inboundDialogVisible" width="90%" center @close="cancelInstore">
        <div>
          <span>法人主体:{{ inboundSpan.corporationName }}</span>
          &nbsp;
          <span>入库仓库:{{ inboundSpan.warehouseCode }}</span>
          &nbsp;
          <span>供应商:{{ inboundSpan.supplierName }}</span>
        </div>
        <!-- <el-form @submit.prevent.native :model="inboundTableObj" :inline="true" ref="inboundTableObj" style="float:left">
          <el-form-item label="入库仓库" prop="warehouseId" style="margin:5px 0 5px;" required>
            <el-select v-model="inboundTableObj.warehouseId" size="small" filterable clearable
              placeholder="请选择">
              <el-option v-for="item in warehouseOptions" :key="item.warehouseId" :label="item.warehouseName"
                :value="item.warehouseId"></el-option>
            </el-select>
          </el-form-item>
        </el-form>     -->
        <el-table
          :data="inboundTable"
          show-summary
          :summary-method="getSummaries"
          border
          max-height="500"
          style="margin-top: 20px"
        >
          <el-table-column prop="wmsQualityControlNo" label="质检单号"></el-table-column>
          <el-table-column prop="purchaseOrderNo" label="采购单号"></el-table-column>
          <el-table-column prop="deliveryNo" label="送货单号"></el-table-column>
          <el-table-column prop="skuCode" label="SKU"></el-table-column>
          <el-table-column prop="skuName" label="产品名称"></el-table-column>
          <el-table-column prop="platform" label="平台"></el-table-column>
          <el-table-column prop="site" label="站点"></el-table-column>
          <el-table-column prop="currency" label="币种"></el-table-column>
          <el-table-column prop="price" label="单价"></el-table-column>
          <el-table-column prop="boxCount" label="箱数"></el-table-column>
          <el-table-column prop="" label="包装长*宽*高(cm)">
            <template slot-scope="{ row }">
              {{ row.packageLength + "*" + row.packageWidth + "*" + row.packageHeight }}
            </template>
          </el-table-column>
          <el-table-column prop="packageVolume" label="包装体积(cm³)"></el-table-column>
          <el-table-column prop="skuGrossWeight" label="产品毛重(kg)"></el-table-column>
          <el-table-column prop="deliveryQuantity" label="送货数量" width="160"></el-table-column>
          <el-table-column prop="alreadyInCount" label="已入库数量" width="120"></el-table-column>
          <el-table-column label="入库数量" width="140">
            <template slot="header"> <span style="color: red; font-size: 14px">*</span>入库数量 </template>
            <template slot-scope="{ row }">
              <el-input v-model="row.inboundQuantity" size="mini" type="number"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="库位" width="130">
            <template slot="header"> <span style="color: red; font-size: 14px">*</span>库位 </template>
            <template slot-scope="{ row }">
              <el-select v-model="row.stockLocationId" size="small" placeholder="请选择">
                <el-option
                  v-for="item in locationOptions"
                  :key="item.stockLocationId"
                  :label="item.locationCode"
                  :value="item.stockLocationId"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancelInstore">取 消</el-button>
          <el-button size="small" type="primary" @click="ensureInstore">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 送货单详情 -->
      <el-dialog title="送货单详情" :visible.sync="deliveryStatus" width="90%" center>
        <div style="margin-bottom: 10px">法人主体：{{ deliveryData.length ? deliveryData[0].supplierName : "" }}</div>
        <avue-crud ref="deliveryCrud" :data="deliveryData" :option="deliveryOption"></avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="deliveryStatus = false">关 闭</el-button>
        </span>
      </el-dialog>
    </basic-container>

    <newCommonImport
      ref="commonImport"
      :downloadUrl="downloadTempUrl"
      :previewUrl="previewUrl"
      :uploadUrl="uploadUrl"
      downloadTitle="批量入库导入模板"
      @import="importExcelBtn"
    >
    </newCommonImport>
  </div>
</template>

<script>
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  inStore,
  getStockLocation,
  getDetail,
  getConfirmInBoundDetailApi,
  confirmInBound
} from "@/api/warehouse/wmsinbound.js"
import { tableOption, deliveryOption } from "@/const/crud/warehouse/wmsinbound.js"
import newCommonImport from "@/views/cockpit/newCommonImport"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import { getTokenUrl, getTokenUrlFile } from "@/util/auth"
export default {
  name: "wmsinbound",
  components: {
    newCommonImport
  },
  data() {
    return {
      downloadTempUrl: "/warehouse/wmsinbound/downLoad",
      previewUrl: "/warehouse/wmsinbound/importInBoundPreview",
      uploadUrl: "/warehouse/wmsinbound/importInBoundConfirm",
      //搜索条件，和前端控件绑定
      searchForm: {
        inboundDateArr: [],
        inboundDateStart: "",
        inboundDateEnd: "",
        wmsQualityControlNo: "",
        supplierName: "",
        wmsSignNo: "",
        corporationName: "",
        skuCode: "",
        purchaseOrderNo: "",
        poContractNo: "",
        taxType: "",
        deliveryNo: "",
        status: "",
        cabinetCode: "",
        inboundUserDisplayName: "",
        wmsInboundNo: "",
        displayname: "",
        wmsInboundBatchNo: ""
      },
      selectList: [], //列表勾选
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      inboundDialogVisible: false,
      locationOptions: [],
      options: [
        {
          value: "1",
          label: "含税"
        },
        {
          value: "2",
          label: "非税"
        }
      ],
      options2: [
        {
          value: "1",
          label: "已入库"
        },
        {
          value: "2",
          label: "待入库"
        }
      ],

      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit("pick", [start, end])
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit("pick", [start, end])
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit("pick", [start, end])
            }
          }
        ]
      },
      locationIdSel: "",
      locationId: "",
      wmsQualityControlNos: "",
      inboundTable: [],
      inboundSpan: {
        corporationName: "",
        warehouseCode: "",
        supplierName: ""
      },
      deliveryStatus: false,
      deliveryOption: deliveryOption,
      deliveryData: [],
      inboundTableObj: {
        warehouseId: ""
      },
      warehouseOptions: []
    }
  },
  created() {
    getAllWarehouse().then((res) => {
      if (res.data.code === 0) {
        this.warehouseOptions = res.data.data.filter((item) => item.funcState === "1")
      }
    })
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    showDetail(row) {
      getDetail([{ deliveryNo: row.deliveryNo }]).then((res) => {
        if (res.data.code === 0) {
          res.data.data.forEach((item) => {
            item.inboundQuantity = item.deliveryQuantity
            if (this.isNulls(item.stockLocationId)) {
              item.stockLocationId = this.locationOptions[0].stockLocationId
            }
          })
          this.deliveryData = res.data.data
          this.deliveryStatus = true
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      let inboundSum = 0
      let acountSum = 0
      if (data.length > 0) {
        data.forEach((item) => {
          inboundSum += item.inboundQuantity * 1
          acountSum += item.price * item.inboundQuantity * 1
        })
      }
      sums[13] = "汇总金额：" + acountSum.toFixed(2)
      sums[15] = "汇总数量：" + inboundSum

      return sums
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

    showImport() {
      // const params = this.tableData.map(item => {
      //   return {
      //     skuCode: item.skuCode
      //   }
      // })
      this.$refs.commonImport.syncFn({
        downloadParams: {},
        uploadParams: {}
      })
    },

    importExcelBtn() {
      this.getList(this.page, this.searchFormConfirm)
    },

    // setLocation () {
    //   this.locationId = this.locationIdSel
    // },
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
      this.$confirm("是否确认删除ID为" + row.wmsInboundNo, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.wmsInboundNo)
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
      this.searchForm.inboundDateArr = this.searchForm.inboundDateArr ? this.searchForm.inboundDateArr : []
      if (this.searchForm.inboundDateArr.length > 0) {
        this.searchForm.inboundDateStart = this.searchForm.inboundDateArr[0]
        this.searchForm.inboundDateEnd = this.searchForm.inboundDateArr[1]
      } else {
        this.searchForm.inboundDateStart = ""
        this.searchForm.inboundDateEnd = ""
      }
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
    //入库
    inStoreOperate() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var checkFlag = true
      this.wmsQualityControlNos = ""
      var wmsQualityControlNos = ""
      this.locationId = ""
      this.locationIdSel = ""
      this.locationOptions = []

      //仓库id
      var warehouseId = this.selectList[0].warehouseId
      for (var i = 0; i < this.selectList.length; i++) {
        var wmsInboundNo = this.selectList[i].wmsInboundNo
        var supplierName = this.selectList[i].supplierName
        var corporationId = this.selectList[i].corporationId
        if (!this.isNulls(wmsInboundNo)) {
          this.$message.error("勾选的单据含有已入库的数据，请检查！")
          checkFlag = false
          break
        }

        if (warehouseId != this.selectList[i].warehouseId) {
          this.$message.error("勾选多条数据,入库仓需要相同!")
          checkFlag = false
          break
        }

        if (supplierName != this.selectList[i].supplierName) {
          this.$message.error("勾选多条数据,供应商需要相同!")
          checkFlag = false
          break
        }

        if (corporationId != this.selectList[i].corporationId) {
          this.$message.error("勾选多条数据,法人主体需要相同!")
          checkFlag = false
          break
        }

        var qualityControlNo = this.selectList[i].wmsQualityControlNo
        if (i == 0) {
          wmsQualityControlNos = qualityControlNo
        } else {
          wmsQualityControlNos = wmsQualityControlNos + "," + qualityControlNo
        }
      }

      if (!checkFlag) {
        return
      }
      this.wmsQualityControlNos = wmsQualityControlNos
      // 暂废弃获取库位信息
      var locationSkuId = ""
      if (this.selectList.length == 1) {
        locationSkuId = this.selectList[0].skuId
      }
      var params = {
        warehouseId: warehouseId,
        locationSkuId: locationSkuId
      }
      getStockLocation(params).then((response) => {
        if (response.data.code == 0) {
          if (response.data.data.locationList != null || response.data.data.locationList.length > 0) {
            this.locationOptions = response.data.data.locationList

            if (!this.isNulls(response.data.data.ensureLactionId)) {
              this.locationId = response.data.data.ensureLactionId
              this.locationIdSel = response.data.data.ensureLactionCode
            }
          }
        }
      })

      let quality = []
      this.selectList.forEach((item) => {
        quality.push({
          deliveryNo: item.deliveryNo
        })
      })
      console.log(quality)
      getConfirmInBoundDetailApi(quality).then((res) => {
        if (res.data.code === 0) {
          res.data.data.forEach((item) => {
            item.inboundQuantity = item.deliveryQuantity
            if (this.isNulls(item.stockLocationId)) {
              item.stockLocationId = this.locationOptions[0].stockLocationId
            }
          })
          this.inboundTable = res.data.data
          console.log(this.inboundTable)
          this.inboundSpan.corporationName = res.data.data[0].corporationName
          this.inboundSpan.supplierName = res.data.data[0].supplierName
          this.inboundSpan.warehouseCode = res.data.data[0].warehouseCode
        } else {
          this.$message.error(res.data.msg)
        }
      })
      this.inboundDialogVisible = true
    },

    cancelInstore() {
      this.inboundTableObj.warehouseId = ""
      this.inboundTable.forEach((item) => {
        item.warehouseId = ""
        item.warehouseCode = ""
      })
      this.inboundDialogVisible = false
    },
    ensureInstore() {
      // if (this.isNulls(this.locationId)) {
      //   this.$message.warning("请选择库位信息!")
      //   return
      // }
      for (let obj of this.inboundTable) {
        if (this.isNulls(obj.inboundQuantity)) {
          this.$message.warning("请填写入库数量!")
          return
        }
        if (this.isNulls(obj.stockLocationId)) {
          this.$message.warning("请选择选择库位!")
          return
        }
      }

      // var obj = {
      //   'wmsQualityControlNos': this.wmsQualityControlNos,
      //   'locationId': this.locationId
      // }
      // inStore(obj).then(response => {
      //   console.log(response)
      //   if (response.data.code == 0) {
      //     var map = response.data.data
      //     var successList = map.success
      //     var errorList = map.error
      //     var successMsg = ''
      //     for (var k = 0; k < successList.length; k++) {
      //       successMsg = successMsg + successList[k] + "; "
      //     }
      //     if (!this.isNulls(successMsg)) {
      //       this.$message.success(successMsg + "入库成功")
      //     }
      //     var errorMsg = ''
      //     for (var k = 0; k < errorList.length; k++) {
      //       errorMsg = errorMsg + errorList[k] + "; "
      //     }
      //     if (!this.isNulls(errorMsg)) {
      //       this.$message.error("入库失败的数据" + errorMsg)
      //     }
      //     this.inboundDialogVisible = false
      //     //刷新页面
      //     this.$refs.crud.selectClear()
      //     this.getList(this.page)
      //   } else {
      //     this.$message.error("入库操作失败!")
      //   }
      // }).finally(() => {
      // })

      confirmInBound(this.inboundTable).then((res) => {
        console.log(res.data.data)
        if (res.data.code === 0) {
          this.$message.success("操作成功")
          this.inboundDialogVisible = false
          this.refreshChange()
        } else {
          this.$message.error(res.data.msg)
          this.inboundDialogVisible = false
        }
      })
    },

    //导出数据
    exportList() {
      var param = ""
      if (this.selectList.length > 0) {
        var list = this.selectList
        // var wmsInboundNo = ''
        // var wmsQualityControlNo = ''
        // for (var i = 0; i < list.length; i++) {
        //   if (!this.isNulls(list[i].wmsInboundNo)) {
        //     wmsInboundNo = wmsInboundNo + list[i].wmsInboundNo + ", ,"
        //   }
        //   wmsQualityControlNo = wmsQualityControlNo + list[i].wmsQualityControlNo + ", ,"

        // }
        // param = "?wmsInboundNo=" + wmsInboundNo + "&wmsQualityControlNo=" + wmsQualityControlNo
        var deliveryNo = ""
        for (var i = 0; i < list.length; i++) {
          if (!this.isNulls(list[i].deliveryNo)) {
            deliveryNo = deliveryNo + list[i].deliveryNo + ", ,"
          }
        }
        param = "?deliveryNo=" + deliveryNo
      } else {
        var obj = this.searchFormConfirm
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

      this.downloadUrl = getTokenUrlFile("/api/warehouse/wmsinbound/exportData" + param)
      window.location.href = this.downloadUrl
      this.$message.success("导出成功!")
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

<style lang="scss">
#wmsinbound {
}
</style>
