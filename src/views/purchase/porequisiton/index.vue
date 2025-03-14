<template>
  <!-- 请购管理 -->
  <div class="execution" id="porequisitonList">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOption"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-button type="primary" @click="openCreatePage" size="small" v-if="permissions.purchase_porequisiton_create"
            >新 建</el-button
          >
          <!-- <el-dropdown-button
            type="primary"
            size="small"
            buttonText="提 交"
            command="提交"
            @command="handleCommand"
            v-if="permissions.purchase_porequisiton_submit"
          >
            <el-dropdown-item command="撤销提交">撤销提交</el-dropdown-item>
          </el-dropdown-button> -->

          <!-- <el-button
            type="primary"
            @click="handleCommand('提交')"
            size="small"
            v-if="permissions.purchase_porequisiton_submit"
          >
            提 交
          </el-button> -->

          <el-dropdown-button
            type="primary"
            size="small"
            buttonText="提交"
            command="提交"
            @command="handleCommand"
            v-if="permissions.purchase_porequisiton_submit"
          >
            <el-dropdown-item command="撤销提交">撤销提交</el-dropdown-item>
          </el-dropdown-button>

          <el-dropdown-button
            type="primary"
            size="small"
            buttonText="请购审核"
            command="请购审核"
            @command="handleCommand"
            v-if="permissions.purchase_porequisiton_audit"
          >
            <el-dropdown-item command="请购审核反审核">反审核</el-dropdown-item>
          </el-dropdown-button>
          <el-button type="primary" @click="exportData" size="small" v-if="permissions.purchase_porequisiton_exportData"
            >导出</el-button
          >
          <el-button
            type="primary"
            @click="handleDel(null, 'delete', '删除')"
            size="small"
            v-if="permissions.purchase_porequisiton_del"
          >
            批量删除
          </el-button>
        </template>

        <template slot-scope="scope" slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="time">
              <el-date-picker
                v-model="searchForm.time"
                type="daterange"
                size="small"
                start-placeholder="单据开始日期"
                end-placeholder="单据结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="requisitionBatchNo">
              <avue-crud-input
                v-model="searchForm.requisitionBatchNo"
                size="small"
                placeholder="请购单批次号"
              ></avue-crud-input>
            </el-form-item>
            <el-form-item prop="cabinetCode">
              <el-input v-model.trim="searchForm.cabinetCode" size="small" placeholder="排柜号" clearable></el-input>
            </el-form-item>
            <el-form-item prop="supplierName" label="">
              <el-select v-model="searchForm.supplierName" size="small" placeholder="供应商" filterable clearable>
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="status" label="">
              <el-select
                size="small"
                v-model="searchForm.status"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="处理环节"
              >
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="corporationId" label="">
              <el-select size="small" v-model="searchForm.corporationId" clearable filterable placeholder="法人主体">
                <el-option
                  v-for="item in bsecorporationList"
                  :key="item.corporationId"
                  :label="item.corporationName"
                  :value="item.corporationId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="revokeStatus">
              <el-select v-model="searchForm.revokeStatus" collapse-tags clearable size="small" placeholder="撤销状态">
                <el-option label="正常" value="0"></el-option>
                <el-option label="异常" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="createByName" label="">
              <el-input v-model="searchForm.createByName" size="small" placeholder="请购人" clearable></el-input>
            </el-form-item>
            <el-form-item prop="purchaseByName">
              <el-input v-model="searchForm.purchaseByName" size="small" placeholder="采购员" clearable></el-input>
            </el-form-item>
            <el-form-item prop="purchaseOrderNo">
              <el-input
                v-model="searchForm.purchaseOrderNo"
                size="small"
                placeholder="关联采购单号"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="poRequisitonType">
              <el-select v-model="searchForm.poRequisitonType" size="small" placeholder="单据类型" clearable>
                <el-option label="普通订单" :value="1"></el-option>
                <el-option label="DI订单" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>

        <!-- 操作列表中的某一列 -->
        <template slot="requisitionBatchNo" slot-scope="scope">
          <copy-text hoverToShow>
            <router-link
              :to="{ path: '/porequisiton/detail', query: { requisitionBatchNo: scope.row.requisitionBatchNo } }"
            >
              {{ scope.row.requisitionBatchNo }}
            </router-link>
          </copy-text>
        </template>
        <!-- 关联采购单号 -->
        <template slot="purchaseOrderNo" slot-scope="scope">
          <el-popover placement="bottom" width="200" trigger="click" v-if="scope.row.purchaseOrderNos.length">
            <router-link
              v-for="(item, index) in scope.row.purchaseOrderNos"
              :key="index"
              :to="'/orderUpdate/index?purchaseOrderNo=' + item"
              :title="item"
              >{{ item }}
            </router-link>

            <el-button slot="reference" size="small" tyep="primary">查看</el-button>
          </el-popover>
          <span v-else>暂无关联采购单号</span>
        </template>
        <!-- 供应商 -->
        <template slot="supplierName" slot-scope="scope">
          <span
            v-if="permissions.porequisiton_supplier_authority"
            :title="scope.row.supplierName"
            class="el-row-text"
            >{{ scope.row.supplierName }}</span
          >
          <span v-if="!permissions.porequisiton_supplier_authority">******</span>
        </template>
        <!-- 单价 -->
        <template slot="priceStr" slot-scope="scope">
          <span v-if="strSplitToArr(scope.row.priceStr).length == 0 && permissions.porequisiton_price_authority"></span>
          <span v-if="strSplitToArr(scope.row.priceStr).length == 1 && permissions.porequisiton_price_authority">{{
            scope.row.priceStr
          }}</span>
          <span v-if="strSplitToArr(scope.row.priceStr).length > 1 && permissions.porequisiton_price_authority">
            <el-button type="text" @click="getPriceDialogData(scope.row.requisitionNo)">查看</el-button>
          </span>
          <span v-if="!permissions.porequisiton_price_authority">******</span>
        </template>

        <!-- 单据类型 -->
        <template slot="poRequisitonType" slot-scope="scope">
          <span v-if="scope.row.poRequisitonType == 1">普通订单</span>
          <span v-if="scope.row.poRequisitonType == 2">DI订单</span>
        </template>

        <template slot="status" slot-scope="scope">
          <a @click="showOperateLog(scope.row.requisitionNo)">{{ formatData(scope.row.status) }}</a>
        </template>

        <!-- <template slot="skuCode" slot-scope="scope">
          <el-popover placement="bottom" width="300" trigger="click">
            <el-row>
              <el-col>
                <span style="font-weight: bold">国内中转仓库存</span>
              </el-col>
              <el-col>
                <span>实际库存：{{ poRequisitonSkuStock.domesticQuantity }}</span>
              </el-col>

              <el-col style="margin-top: 15px">
                <span style="font-weight: bold">海外中转仓库存</span>
              </el-col>
              <el-col>
                <span>实际库存：{{ poRequisitonSkuStock.overseasQuantity }}</span>
              </el-col>

              <el-col style="margin-top: 15px">
                <span style="font-weight: bold">在途库存</span>
              </el-col>
              <el-col>
                <span>采购在途：{{ poRequisitonSkuStock.purchaseOnwayQuantity }}</span>
                <span style="margin-left: 30px">国内调拨在途：{{ poRequisitonSkuStock.domesticOnwayQuantity }}</span>
              </el-col>
              <el-col>
                <span>海外调拨在途：{{ poRequisitonSkuStock.overseasOnwayQuantity }}</span>
              </el-col>

              <el-col style="margin-top: 15px">
                <span style="font-weight: bold">FBA库存</span>
              </el-col>
              <el-col>
                <span>实际库存：{{ poRequisitonSkuStock.fbaQuantity }}</span>
              </el-col>

              <el-col style="margin-top: 15px">
                <span style="font-weight: bold">销售数据</span>
              </el-col>
              <el-col>
                <span>30天销量：{{ poRequisitonSkuStock.unitsShippedLast30Days }}</span>
                <span style="margin-left: 30px">90天销量：{{ poRequisitonSkuStock.unitsShippedLast90Days }}</span>
              </el-col>
            </el-row>
            <a slot="reference" @click="getSkuStockInfo(scope.row.skuCode)">{{ scope.row.skuCode }}</a>
          </el-popover>
        </template> -->

        <!-- 处理环节 -->
        <template slot="statusName" slot-scope="scope">
          <div :style="{ color: statusOptions.find((item) => item.value === scope.row.status).color }">
            {{ statusOptions.find((item) => item.value === scope.row.status).label }}
          </div>
        </template>
        <!-- 操作 -->
        <template slot="operation" slot-scope="scope">
          <avue-crud-ctrl :list="getCtrlList(scope.row)"></avue-crud-ctrl>
        </template>
      </avue-crud>
      <!-- 查看价格 -->
      <el-dialog title="价格" :visible.sync="showPriceDialog" width="300px" center>
        <span>
          <el-table :data="subPricetableData">
            <el-table-column prop="price" label="价格"> </el-table-column>
            <el-table-column prop="quantity" label="数量"> </el-table-column>
          </el-table>
        </span>
      </el-dialog>
      <!-- 审核 -->
      <el-dialog class="audit-dialog" v-bind:title="auditTitle" :visible.sync="auditDialog" width="520px" center>
        <!-- <el-radio v-model="auditResult" label="1">同意</el-radio>
        <el-radio v-model="auditResult" label="2" style="margin-left: 30%;">拒绝</el-radio>
        <div style="width:100%;height: 20px;"></div> -->
        <el-input
          type="textarea"
          :rows="2"
          :maxlength="100"
          placeholder="拒绝必须填写原因，不得超过100个字符。"
          v-model="refuseReason"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="info"
            size="small"
            v-if="auditTitle == '请购审核'"
            @click="dialogResult(false, 'audit', 1, '请购审核', true)"
            >拒 绝</el-button
          >
          <el-button
            type="primary"
            size="small"
            v-if="auditTitle == '请购审核'"
            @click="dialogResult(true, 'audit', 1, '请购审核', true)"
            >通 过</el-button
          >

          <el-button
            type="info"
            size="small"
            v-if="auditTitle == '销售二审'"
            @click="dialogResult(false, 'auditSecond', 8, '销售二审', true)"
            >拒 绝</el-button
          >
          <el-button
            type="primary"
            size="small"
            v-if="auditTitle == '销售二审'"
            @click="dialogResult(true, 'auditSecond', 8, '销售二审', true)"
            >通 过</el-button
          >

          <el-button
            type="info"
            size="small"
            v-if="auditTitle == '销售三审'"
            @click="dialogResult(false, 'auditThird', 9, '销售三审', true)"
            >拒 绝</el-button
          >
          <el-button
            type="primary"
            size="small"
            v-if="auditTitle == '销售三审'"
            @click="dialogResult(true, 'auditThird', 9, '销售三审', true)"
            >通 过</el-button
          >
        </span>
      </el-dialog>

      <!-- 指派采购 -->
      <el-dialog class="assign-buyer-dialog" title="指派采购" :visible.sync="assignBuyerDialog" width="520px" center>
        <el-form ref="addOrUpdateForm" status-icon style="padding-bottom: 60px">
          <el-form-item label="采购员：">
            <el-select v-model="purchaseUserId" size="small" filterable placeholder="请选择">
              <el-option
                v-for="item in purchaseUserOptions"
                :key="item.userId"
                :label="item.displayname"
                :value="item.userId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancelAssignBuyer()">取 消</el-button>
          <el-button size="small" type="primary" @click="confirmAssignBuyer()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>
    </basic-container>
  </div>
</template>

<script>
import {
  totalPage,
  updateList,
  assignBuyer,
  checkRevokeable,
  getPriceData,
  exportData,
  getPoRequisitonSkuStockInfo
} from "@/api/purchase/porequisiton"
import { getPlayTypeAll, getSit } from "@/api/purchase/order/poorder"
import { getAll } from "@/api/baseSetup/bsecurrency"
import { downloadBlob } from "@/util/auth"
import { getAll as getAllBsecorporation } from "@/api/baseSetup/bsecorporation"
import { getMemberAllByGroupId } from "@/api/admin/user"
import { tableOption, statusOptions } from "@/const/crud/purchase/porequisiton"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import operationlog from "@/views/purchase/log/index"
import { getAll as getAllSupplierApi } from "@/api/supplier/posupplier"

export default {
  name: "porequisiton",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        currency: [],
        status: [],
        taxType: "",
        time: [],
        value1: "",
        value2: "",
        revokeStatus: "",
        cabinetCode: "",
        supplierName: "",
        corporationId: "",
        createByName: "",
        purchaseByName: "",
        purchaseOrderNo: "",
        poRequisitonType: ""
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

      selectList: [],
      list: [],
      auditTitle: "",
      auditDialog: false,
      auditResult: "", //1同意,2拒绝
      refuseReason: "",
      assignBuyerDialog: false,
      showPriceDialog: false,
      purchaseUserId: "",
      purchaseUserOptions: [],
      //处理环节
      statusOptions: statusOptions,
      taxTypeOptions: [
        {
          value: 1,
          label: "含税"
        },
        {
          value: 2,
          label: "非税"
        }
      ],
      currencyOptions: [],
      subPricetableData: [],
      poRequisitonSkuStock: {
        skuCode: "",
        domesticQuantity: "",
        overseasQuantity: "",
        purchaseOnwayQuantity: "",
        domesticOnwayQuantity: "",
        overseasOnwayQuantity: "",
        fbaQuantity: "",
        unitsShippedLast30Days: "",
        unitsShippedLast90Days: ""
      },
      platform: [],
      sit: [],
      bsecorporationList: [],
      supplierOptions: []
    }
  },
  activated() {
    this.getList(this.page)
  },
  created() {
    getPlayTypeAll().then((res) => {
      if (res.data.code === 0) {
        this.platform = res.data.data
      }
    })
    getAllBsecorporation().then((res) => {
      if (res.data.code === 0) {
        this.bsecorporationList = res.data.data
      }
    })
    this.getSupplierAll()
  },
  mounted: function () {
    this.getList(this.page)
    this.getCurrencyAll()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  components: {
    operationlog
  },
  methods: {
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
    },
    modifySupplier(val) {
      this.searchForm.supplierName = val.replace(/,/g, " ")
      if (this.searchForm.supplierName.indexOf("BEAUTIFUL") !== -1) {
        this.searchForm.supplierName = this.searchForm.supplierName.replace(".", ".,")
      }
    },
    getSit() {
      this.searchForm.sitCode = ""
      if (!this.searchForm.platformCode) return
      getSit([this.searchForm.platformCode]).then((res) => {
        if (res.status === 200) {
          this.sit = res.data
        }
      })
    },
    getSkuStockInfo(skuCode) {
      this.poRequisitonSkuStock = {
        skuCode: "",
        domesticQuantity: "",
        overseasQuantity: "",
        purchaseOnwayQuantity: "",
        domesticOnwayQuantity: "",
        overseasOnwayQuantity: "",
        fbaQuantity: "",
        unitsShippedLast30Days: "",
        unitsShippedLast90Days: ""
      }
      getPoRequisitonSkuStockInfo({ skuCode: skuCode }).then(({ data }) => {
        if (data.code === 0) {
          if (!data.data) {
            this.$message.warning("未查到sku相关信息")
            return
          }
          this.poRequisitonSkuStock = data.data
        } else {
          this.$message.error("获取sku库存信息失败")
        }
      })
    },
    showOperateLog(requisitionNo) {
      this.$refs.operationlog.showOperateLogDialog(requisitionNo, 10)
    },
    formatData(id) {
      const obj = {
        0: "未处理",
        1: "已提交",
        2: "审核通过",
        3: "订单处理",
        4: "合同处理",
        5: "未入库",
        6: "部分入库",
        7: "入库完成",
        8: "销售二审",
        9: "销售三审"
      }
      return obj[id]
    },
    //dialog样式修改后添加
    dialogResult(dialogFlage, operateCode, status, operation, isOperate) {
      if (dialogFlage) {
        this.auditResult = 1
      } else {
        this.auditResult = 2
      }
      this.handleUpdateList(operateCode, status, operation, isOperate)
    },
    cancelAssignBuyer() {
      this.assignBuyerDialog = false
    },
    //dialog 样式修改后添加结束
    getList(page, params) {
      if (!page) {
        page = {
          currentPage: 1,
          pageSize: 20
        }
      }

      this.page.currentPage = page.currentPage

      if (this.searchFormConfirm.status) {
        this.searchFormConfirm.status = this.searchFormConfirm.status.join(",")
      }
      if (this.searchFormConfirm.currency) {
        this.searchFormConfirm.currency = this.searchFormConfirm.currency.join(",")
      }
      if (this.searchFormConfirm.time && this.searchFormConfirm.time.length == 2) {
        this.searchFormConfirm.requisitionDateStart = this.searchFormConfirm.time[0]
        this.searchFormConfirm.requisitionDateEnd = this.searchFormConfirm.time[1]
      } else {
        this.searchFormConfirm.startTime = ""
        this.searchFormConfirm.endTime = ""
      }

      totalPage(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize
          },
          params,
          this.searchFormConfirm
        )
      ).then((response) => {
        console.log(1111, response)
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
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
      this.page.currentPage = 1
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
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page, this.searchFormConfirm)
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page, this.searchFormConfirm)
    },
    /**
     * 选中数据
     */
    selectionChange(tableData) {
      console.log(tableData)
      this.selectList = tableData
    },
    /**
     * 清除选中
     */
    clearSelectClear() {
      this.$refs.crud.selectClear()
    },
    /**
     * 查询国家地区
     */
    getCurrencyAll() {
      getAll().then((response) => {
        this.currencyOptions = response.data.data
      })
    },
    /**
     * 打开创建页面
     */
    openCreatePage: function (requisitionNo) {
      this.$router.push({
        path: "/porequisiton/create"
      })
    },
    /**
     * 打开详情页面
     */
    openDetailPage: function (requisitionNo) {
      this.$router.push({
        path: "/porequisiton/detail",
        query: {
          requisitionNo: requisitionNo
        }
      })
    },
    handleCommand(command) {
      if (command == "提交") {
        this.handleUpdateList("submit", 0, "提交", true)
      }
      if (command == "撤销提交") {
        this.handleUpdateList("withdrawSubmit", 1, "撤销提交", true)
      }
      if (command == "请购审核") {
        this.handleUpdateList("audit", 1, "请购审核", false)
      }
      if (command == "请购审核反审核") {
        this.handleUpdateList("reverseAudit", 2, "请购审核反审核", true)
      }
      if (command == "销售二审") {
        this.handleUpdateList("auditSecond", 8, "销售二审", false)
      }
      if (command == "销售二审反审核") {
        this.handleUpdateList("reverseAuditSecond", 9, "销售二审反审核", true)
      }
      if (command == "销售三审") {
        this.handleUpdateList("auditThird", 9, "销售三审", false)
      }
      if (command == "销售三审反审核") {
        this.handleUpdateList("reverseAuditThird", 2, "销售三审反审核", true)
      }
    },
    /**
     * 批量更新请购单
     */
    handleUpdateList: function (operateCode, status, operation, isOperate) {
      this.checkDataBefore(operateCode, status, operation)
      if (this.list.length == 0) {
        return
      }

      if (!isOperate) {
        this.auditResult = ""
        this.refuseReason = ""
        if (operateCode == "audit") {
          this.auditTitle = "请购审核"
        }
        if (operateCode == "auditSecond") {
          this.auditTitle = "销售二审"
        }
        if (operateCode == "auditThird") {
          this.auditTitle = "销售三审"
        }
        this.auditDialog = true
      } else {
        let remark = ""
        if (operateCode == "audit") {
          if (this.auditResult == 1) {
            operateCode = "auditAgree"
          } else {
            operateCode = "auditRefuse"
            remark = this.refuseReason
          }
        }

        if (operateCode == "auditSecond") {
          if (this.auditResult == 1) {
            operateCode = "auditAgreeSecond"
          } else {
            operateCode = "auditRefuseSecond"
            remark = this.refuseReason
          }
        }

        if (operateCode == "auditThird") {
          if (this.auditResult == 1) {
            operateCode = "auditAgreeThird"
          } else {
            operateCode = "auditRefuseThird"
            remark = this.refuseReason
          }
        }

        this.handleUpdateListCommon(operateCode, remark, operation)
      }
    },
    handleDel(row, operateCode, operation) {
      this.list = []
      if (row) {
        this.list.push(row.requisitionBatchNo)
      } else {
        if (!this.selectList || this.selectList.length == 0) {
          this.$message.error("请勾选数据")
          return
        }
        for (let item of this.selectList) {
          if (item.status !== 0) {
            this.$message.error("待提交才可以删除")
            return
          }
        }
        this.list = this.selectList.map((item) => item.requisitionBatchNo)
      }
      this.$confirm("此操作将删除选择行数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.handleUpdateListCommon(operateCode, "", operation)
        })
        .catch(() => {})
    },
    handleUpdateListCommon(operateCode, remark, operation) {
      updateList(this.list, operateCode, remark).then((response) => {
        if (response.data.code == 0) {
          this.auditDialog = false
          this.clearSelectClear()
          this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
          this.getList(this.page, this.searchFormConfirm)
          this.$notify({
            title: "成功",
            message: operation + "成功",
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
    },

    /**
     * 删除、提交、撤销提交、审核、反审核前校验数据
     */
    checkDataBefore: function (operateCode, status, operation) {
      this.list = []
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      if (this.auditDialog) {
        if (!this.auditResult) {
          this.$message.warning("请先确认同意还是拒绝")
          return
        }
        if (this.auditResult == 2) {
          if (!this.refuseReason) {
            this.$message.error("请填写拒绝原因")
            return
          }
        }
      }
      var flag = true
      var tip = ""
      for (let index = 0; index < this.selectList.length; index++) {
        const element = this.selectList[index]
        if (element.status != status) {
          var statusName = ""
          for (let a = 0; index < this.statusOptions.length; a++) {
            if (element.status == this.statusOptions[a].value) {
              statusName = this.statusOptions[a].label
              break
            }
          }
          tip = "请购单：" + element.requisitionBatchNo + "，状态为：" + statusName + ",不允许" + operation
          flag = false
          break
        } else {
          this.list.push(element.requisitionBatchNo)
        }
      }
      if (!flag) {
        this.list = []
        this.$message.error(tip)
        return
      }
    },
    /**
     * 指派采购员
     */
    handleAssignBuyer: function () {
      this.list = []
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var flag = true
      var tip = ""
      for (let index = 0; index < this.selectList.length; index++) {
        const element = this.selectList[index]
        if (element.status != 2) {
          tip = "只有在[生成订单]状态下的请购单才可以操作指派采购"
          flag = false
          break
        } else if (element.purchaseGroupId != this.selectList[0].purchaseGroupId) {
          tip = "批量指派采购采购组必须相同"
          flag = false
          break
        } else {
          this.list.push(element.requisitionNo)
        }
      }
      if (!flag) {
        this.list = []
        this.$message.error(tip)
        return
      }
      var query = {
        groupId: this.selectList[0].purchaseGroupId
      }
      getMemberAllByGroupId(query).then((response) => {
        if (response.data.data && response.data.data.length > 0) {
          this.purchaseUserOptions = response.data.data
        }
        this.assignBuyerDialog = true
      })
    },
    /**
     * 确定指派采购
     */
    confirmAssignBuyer: function () {
      if (!this.purchaseUserId) {
        this.$message.error("请先选择采购员")
        return
      }

      assignBuyer(this.list, this.purchaseUserId).then((response) => {
        if (response.data.code == 0) {
          this.assignBuyerDialog = false
          this.clearSelectClear()
          this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
          this.getList(this.page, this.searchFormConfirm)
          this.$notify({
            title: "成功",
            message: "指派采购成功",
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
    },
    /**
     * 生成订单
     */
    handleCreateOrder(row) {
      this.list = []
      var flag = true
      var tip = ""

      if (row.status != 2 && row.status != 3) {
        tip = "只有在[审核通过、部分转单]状态下的请购单才可以生成订单"
        flag = false
      } else {
        this.list.push(row.requisitionBatchNo)
      }

      if (!flag) {
        this.list = []
        this.$message.error(tip)
        return
      }

      const params = {
        size: -1,
        current: -1,
        requisitionBatchNo: this.list[0]
      }

      this.$router.push({
        path: `/purchase/porequisiton/generateOrder`,
        query: {
          requisitionBatchNo: this.list[0]
        }
      })
    },
    /**
     * 撤销请购
     */
    handleWithdraw(row) {
      let requisitionNos = row.requisitionBatchNo
      let parma = {
        requisitionNos
      }
      checkRevokeable(parma).then((response) => {
        if (response.data.code == 0) {
          this.auditDialog = false
          //跳转其它页面 新建请购撤销页面
          this.$router.push({ path: "/porequisitonCancel/edit", query: { requisitionNos } })
        } else if (response.data.code == 1) {
          this.$message.error(response.data.msg)
          return
        } else {
          this.$message.error("操作失败")
          return
        }
      })
    },
    getPriceDialogData(requisitionNo) {
      this.subPricetableData = []
      getPriceData(requisitionNo).then((response) => {
        if (response.data.code == 0) {
          this.subPricetableData = response.data.data
        }
      })
      this.showPriceDialog = true
    },

    exportData() {
      // let batchNo = this.selectList.map(item => item.requisitionBatchNo).join(',')
      exportData(this.searchFormConfirm)
        .then((res) => {
          downloadBlob(res.data, "请购单导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
        })
        .catch((err) => {
          console.log(err)
        })
    },
    /**
     * 检查字符串是否为空
     */
    isNulls(str) {
      if (typeof str == "undefined" || str == null || (str + "").trim() == "") {
        return true
      }
      return false
    },
    strSplitToArr(str) {
      var arr = []
      if (this.isNulls(str)) {
        return arr
      }

      return str.split(",")
    },
    // 更多操作
    moreOperation(obj) {
      switch (obj.title) {
        case "撤销提交":
          this.list = []
          this.list.push(obj.row.requisitionBatchNo)
          this.handleUpdateListCommon("withdrawSubmit", "", "撤销提交")
          break
      }
    },
    getCtrlList(row) {
      return [
        {
          title: "生成订单",
          item: row,
          clickFn: (row) => {
            this.handleCreateOrder(row)
          },
          show: this.permissions.purchase_porequisiton_create_order && [2, 3].includes(row.status) // 审核通过、部分转单
        },
        {
          title: "删除",
          item: row,
          clickFn: (row) => {
            this.handleDel(row, "delete", "删除")
          },
          show: this.permissions.purchase_porequisiton_del && row.status === 0 // 待提交
        },
        {
          title: "撤销请购",
          item: row,
          clickFn: (row) => {
            this.handleWithdraw(row)
          },
          show: this.permissions.purchase_porequisiton_withdraw && row.status === 2 // 审核通过
        },
        {
          title: "撤销提交",
          item: row,
          clickFn: (row) => {
            this.moreOperation({ title: "撤销提交", row })
          },
          show: row.status === 1 // 已提交
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped></style>
