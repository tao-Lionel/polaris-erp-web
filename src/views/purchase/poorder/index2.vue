<template>
  <div id="poorder">
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
          <el-button type="primary" @click="handleDel" size="small" v-if="permissions.purchase_poorder_delete"
            >删 除</el-button
          >
          <el-button
            type="primary"
            @click="handleCommand('提交')"
            size="small"
            v-if="permissions.purchase_poorder_submit"
          >
            提交
          </el-button>

          <el-dropdown-button
            type="primary"
            size="small"
            buttonText="采购审核"
            command="采购审核"
            @command="handleCommand"
            v-if="permissions.purchase_poorder_secondVerify"
          >
            <el-dropdown-item command="采购审核反审">采购审核反审</el-dropdown-item>
          </el-dropdown-button>
          <el-dropdown @command="createAndimportDelivery" trigger="click" style="margin-left: 10px">
            <el-button type="primary" size="small">生成送货单</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="1">生成送货</el-dropdown-item>
              <el-dropdown-item :command="2">导入送货</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-button style="margin-left: 10px" type="primary" size="small" @click="exportData">导出</el-button>
          <el-button
            v-if="permissions.purchase_poorder_createContract"
            style="margin-left: 10px"
            type="primary"
            size="small"
            @click="handleCreateContract(null)"
          >
            生成合同
          </el-button>
        </template>
        <template slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="purchaseNoTime" label="">
              <el-form-item prop="requisitionBatchNo">
                <el-input
                  v-model="searchForm.requisitionBatchNo"
                  size="small"
                  clearable
                  placeholder="请购单批次号"
                  v-search-input
                ></el-input>
              </el-form-item>
              <el-date-picker
                style="width: 240px"
                v-model="searchForm.purchaseNoTime"
                clearable
                type="daterange"
                size="small"
                start-placeholder="单据开始日期"
                end-placeholder="单据结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="purchaseOrderNo">
              <el-input
                v-model="searchForm.purchaseOrderNo"
                size="small"
                clearable
                placeholder="采购单号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="supplierName">
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
        <template slot="searchAdvanced">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="poContractNo">
              <el-input
                v-model="searchForm.poContractNo"
                size="small"
                clearable
                placeholder="合同编号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="statusArray" collapse-tags clearable size="small" placeholder="订单状态" multiple>
                <el-option label="未处理" value="0"></el-option>
                <el-option label="采购审核" value="2"></el-option>
                <el-option label="审核完成" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="corporationName">
              <el-select v-model="searchForm.corporationName" size="small" placeholder="法人主体" filterable clearable>
                <el-option
                  v-for="item in corporationList"
                  :key="item.corporationId"
                  :label="item.corporationName"
                  :value="item.corporationName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="skuCode">
              <el-input v-model="searchForm.skuCode" size="small" v-search-input clearable placeholder="SKU"></el-input>
            </el-form-item>
            <el-form-item prop="taxType">
              <el-select v-model="searchForm.taxType" clearable size="small" placeholder="税别">
                <el-option label="含税" value="1"></el-option>
                <el-option label="非税" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="currencyArray" clearable collapse-tags size="small" placeholder="币别" multiple>
                <el-option
                  v-for="(item, index) in currencyOptions"
                  :key="index"
                  :label="item.currency"
                  :value="item.currency"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="revokeStatus">
              <el-select v-model="searchForm.revokeStatus" collapse-tags clearable size="small" placeholder="撤销状态">
                <el-option label="正常" value="0"></el-option>
                <el-option label="异常" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="createByName" label="">
              <el-input
                v-model="searchForm.createByName"
                size="small"
                v-search-input
                clearable
                placeholder="请购人"
              ></el-input>
            </el-form-item>
            <el-form-item prop="purchaseByName">
              <el-input
                v-model="searchForm.purchaseByName"
                size="small"
                v-search-input
                clearable
                placeholder="采购员"
              ></el-input>
            </el-form-item>
            <el-form-item prop="warehouseId">
              <el-select v-model="searchForm.warehouseId" size="small" filterable clearable placeholder="入库仓">
                <el-option
                  v-for="item in warehouseOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="cabinetCode" label="">
              <el-input
                v-model="searchForm.cabinetCode"
                size="small"
                v-search-input
                clearable
                placeholder="排柜号"
              ></el-input>
            </el-form-item>
            <el-form-item label="" prop="inboundStatus">
              <el-select v-model="searchForm.inboundStatus" collapse-tags clearable size="small" placeholder="入库状态">
                <el-option label="未入库" value="0"></el-option>
                <el-option label="全部入库" value="2"></el-option>
                <el-option label="部分入库" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="poContractStatus">
              <el-select
                multiple
                collapse-tags
                v-model="searchForm.poContractStatus"
                size="small"
                clearable
                placeholder="合同状态"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="priceModel">
              <el-select v-model="searchForm.priceModel" size="small" clearable placeholder="价格模式">
                <el-option
                  v-for="item in priceModelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button native-type="submit" v-show="false" @click="searchChange"></el-button>
          </el-form>
        </template>

        <template slot="purchaseOrderNo" slot-scope="scope">
          <copy-text hoverToShow>
            <router-link :to="{ path: '/orderUpdate', query: { purchaseOrderNo: scope.row.purchaseOrderNo } }">{{
              scope.row.purchaseOrderNo
            }}</router-link>
          </copy-text>
        </template>

        <template slot="skuCount" slot-scope="scope">
          <a @click="showSkuInfo(scope.row.purchaseOrderNo)">{{ scope.row.skuCount }}笔</a>
        </template>

        <template slot="requestAccountNo" slot-scope="scope">
          <span v-if="scope.row.requestAccountNoCount == 1">{{ scope.row.requestAccountNo }}</span>
          <a v-if="scope.row.requestAccountNoCount > 1" @click="showRequestAccountNos(scope.row.requestAccountNo)"
            >查看</a
          >
        </template>

        <template slot="poContractNo" slot-scope="scope">
          <copy-text hoverToShow>
            <router-link
              :to="'/showNonTaxContractPic/index?paramcontractNo=' + scope.row.poContractNo"
              :title="scope.row.poContractNo"
              >{{ scope.row.poContractNo }}</router-link
            >
          </copy-text>
        </template>

        <template slot="inboundStatus" slot-scope="scope">
          <a @click="showInboundInfo(scope.row.purchaseOrderNo)">{{ formatData(scope.row.inboundStatus) }}</a>
        </template>

        <template slot="status" slot-scope="scope">
          <a @click="showOperateLog(scope.row.purchaseOrderNo)">{{ formatStatus(scope.row.status) }}</a>
        </template>

        <template slot="tableBeforeSlot">
          <div style="position: relative; font-size: 13px">
            <div style="position: absolute; top: 7px; left: 300px; z-index: 100">
              <span>汇总数量：</span><span>{{ purchaseQuantityTotal }}</span>
              <span style="margin-left: 30px">汇总金额：</span><span>{{ amountTotal }}</span>
            </div>
          </div>
        </template>

        <template slot="operation" slot-scope="scope">
          <avue-crud-ctrl :list="getCtrlList(scope.row)"></avue-crud-ctrl>
        </template>
      </avue-crud>

      <el-dialog v-bind:title="confrimTitle" :visible.sync="confrimDialog" width="520px">
        <el-input
          type="textarea"
          :rows="2"
          :maxlength="100"
          placeholder="请填写原因，不得超过100个字符。(拒绝必填)"
          v-model.trim="confrimTextarea"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="info" size="small" @click="dialogResult(false)">拒 绝</el-button>
          <el-button type="primary" size="small" @click="dialogResult(true)">通 过</el-button>
        </span>
      </el-dialog>

      <el-dialog v-resize-dialog title="采购明细" :visible.sync="skuInfoDialog">
        <avue-crud :data="skuInfoData" :option="skuInfoDialogOption">
          <template slot-scope="scope">
            <span :title="scope.row.skuName" class="el-row-text">{{ scope.row.skuName }}</span>
          </template>
        </avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button @click="skuInfoDialog = false" size="small">关闭</el-button>
        </span>
      </el-dialog>

      <el-dialog v-resize-dialog title="入库情况" :visible.sync="inboundInfoDialog">
        <avue-crud :data="inboundInfoData" :option="inboundOptions">
          <template slot-scope="scope">
            <span :title="scope.row.skuName" class="el-row-text">{{ scope.row.skuName }}</span>
          </template>
        </avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button @click="inboundInfoDialog = false" size="small">关闭</el-button>
        </span>
      </el-dialog>

      <el-dialog title="查看请款单号" :visible.sync="requestAccountNoModel">
        <span>{{ requestAccountNoContent }}</span>
        <div slot="footer" class="dialog-footer">
          <el-button width="100%" size="small" @click="requestAccountNoModel = false">关 闭</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="生成合同-选择合同条款"
        :visible.sync="createContractStatus"
        width="30%"
        :before-close="createContractCancel"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center
      >
        <avue-crud
          ref="createContractCrud"
          :page="createContractPage"
          :data="createContractData"
          :option="createContractTableOption"
          @selection-change="createContractSelectionChange"
        >
        </avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="createContractCancel">取 消</el-button>
          <el-button size="small" type="primary" @click="createContractConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <commonImport
        ref="commonImport"
        :excelStatus="false"
        :excelDangerStatus="false"
        :downloadUrl="'/purchase/podelivery/poDeliveryDownload'"
        :fileSuffix="'.xlsx'"
        @import="importExcelBtn"
      >
      </commonImport>

      <!-- 日志 -->
      <operationlog ref="operationlog"></operationlog>

      <remarkDialog ref="remarkDialogRef" @updateList="refreshChange"></remarkDialog>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  addObj,
  putObj,
  delObj,
  agree,
  reject,
  removeBatch,
  reverse as reverseApi,
  showSkuInfo,
  showInboundInfo,
  createContractBatch,
  checkAdvancePayAble,
  importData,
  exportPoOrderData
} from "@/api/purchase/order/poorder"
import { downloadBlob } from "@/util/auth"
import { getListBySupplierNo } from "@/api/supplier/posupplierOther"
import {
  tableOption,
  inboundOptions,
  skuInfoDialogOption,
  createContractTableOption
} from "@/const/crud/purchase/order/poorder"
import { mapGetters } from "vuex"
import { getAll as getAllSupplierApi } from "@/api/supplier/posupplier"
import { getAll as getBseCurrency } from "@/api/baseSetup/bsecurrency"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import operationlog from "@/views/purchase/log/index"
import { getPoChangList } from "@/api/purchase/pochange/poorderchangedetail"
import commonImport from "@/views/cockpit/commonImport"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"
import { getDictByType } from "@/util/auth"
import remarkDialog from "./components/remarkDialog"
import { getAll as getAllCorporationApi } from "@/api/baseSetup/bsecorporation"

export default {
  name: "poorder",
  components: {
    operationlog,
    commonImport,
    remarkDialog
  },
  data() {
    return {
      skuInfoDialogOption: skuInfoDialogOption,
      inboundOptions: inboundOptions,
      //搜索条件，和前端控件绑定
      searchForm: {
        createTimeStart: "",
        createTimeEnd: "",
        purchaseOrderNo: "",
        poContractNo: "",
        supplierNo: "",
        status: "",
        corporationName: "",
        skuCode: "",
        taxType: "",
        currency: "",
        purchaseNoTime: [],
        revokeStatus: "",
        createByName: "",
        purchaseByName: "",
        cabinetCode: "",
        warehouseName: "",
        supplierName: "",
        poContractStatus: [],
        warehouseId: "",
        inboundStatus: "",
        priceModel: ""
      },
      statusArray: [],
      currencyArray: [],
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },

      tableOption: tableOption,
      confrimTitle: "",
      confrimDialog: false,
      confrimType: "",
      confrimTextarea: "",
      confrimErrorMsg: "",
      agreeNewStatus: "",
      rejectNewStatus: "",
      reverseNewStatus: "",
      selectList: [],
      rejectVisiable: true,
      agreeLogRemark: "",
      rejectLogRemark: "",

      skuInfoDialog: false,
      skuInfoData: [],
      currencyOptions: [],
      inboundInfoDialog: false,
      inboundInfoData: [],
      requestAccountNoModel: false,
      requestAccountNoContent: "",
      purchaseQuantityTotal: 0,
      amountTotal: 0,
      createContractStatus: false,
      createContractData: [],
      createContractPage: {
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      createContractTableOption: createContractTableOption,
      createContractSelectionList: [],
      warehouseOptions: [],
      statusOptions: [
        {
          value: "0",
          label: "未处理"
        },
        {
          value: "1",
          label: "财务审核"
        },
        {
          value: "2",
          label: "审核通过"
        }
      ],
      priceModelOptions: [],
      supplierOptions: [],
      corporationList: []
    }
  },
  created() {
    getAllWarehouse().then((res) => {
      if (res.data.code === 0) {
        let arr = res.data.data.filter((item) => item.funcState === "1")
        this.warehouseOptions = arr.map((item) => {
          return {
            label: item.warehouseName,
            value: item.warehouseId
          }
        })
      }
    })

    getBseCurrency().then(({ data }) => {
      if (data.code == 0) {
        this.currencyOptions = data.data
      }
    })

    this.getPriceModelAll()
    this.getSupplierAll()
    this.getCorporation()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    createAndimportDelivery(val) {
      if (val === 1) {
        this.createDeliverys()
      }
      if (val === 2) {
        this.importDeliverys()
      }
    },
    importDeliverys() {
      this.$refs.commonImport.syncFn()
    },
    importExcelBtn(file) {
      if (file != null) {
        this.$refs.commonImport.openFullScreen()
        var _this = this
        this.loading = true
        let formdata = new FormData()
        formdata.append("file", file.raw)
        importData(formdata).then((res) => {
          _this.loading = false
          if (res.data.code == 0) {
            _this.clearSelectClear()
            _this.refreshChange()
            _this.$message.success("导入送货单成功")
            _this.$refs.commonImport.syncFn()
          } else {
            _this.$message.warning(res.data.msg)
          }
          _this.$refs.commonImport.closeFullScreen()
        })
      }
    },
    exportData() {
      exportPoOrderData(this.searchFormConfirm)
        .then((res) => {
          downloadBlob(res.data, "采购单导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 生成预付单
    createRequestAndPre(row) {
      const { purchaseOrderNo } = row
      let parma = {
        purchaseOrderNo,
        command: 2
      }
      checkAdvancePayAble(parma)
        .then((response) => {
          console.log(response)
          if (response.data.data) {
            this.$router.push({ path: "/requestDetail", query: { purchaseOrderNos: purchaseOrderNo, command: 2 } })
          } else if (!response.data.data) {
            this.$message.error(`该订单不支持生成预付单`)
          } else {
            this.$message.error("操作失败")
          }
        })
        .catch(() => {})
    },

    createDeliverys() {
      this.list = []
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      if (this.selectList.length > 1) {
        this.$message.error("生成送货单只支持单条数据")
        return
      }

      var flag = true
      var tip = ""
      for (let index = 0; index < this.selectList.length; index++) {
        const element = this.selectList[index]
        if (element.status != 2 && element.status != 3) {
          tip = "只有在[审核通过、部分转单]状态下的请购单才可以生成订单"
          flag = false
          break
        } else {
          this.list.push(element.purchaseOrderNo)
        }
      }
      if (!flag) {
        this.list = []
        this.$message.error(tip)
        return
      }

      this.$router.push({
        path: "/purchase/poorder/generateDeliveryNote/index",
        query: {
          warehouseId: this.selectList[0].warehouseId,
          purchaseOrderNo: this.list[0],
          corporationCode: this.selectList[0].corporationCode,
          poContractNo: this.selectList[0].poContractNo,
          requisitionBatchNo: this.selectList[0].requisitionBatchNo
        }
      })
    },

    showRequestAccountNos(requestAccountNos) {
      this.requestAccountNoContent = requestAccountNos
      this.requestAccountNoModel = true
    },
    formatStatus(id) {
      const obj = {
        0: "未处理",
        // "1":"采购一审",
        2: "采购审核",
        3: "审核完成"
      }
      return obj[id]
    },
    // 查看日志
    showOperateLog(purchaseOrderNo) {
      this.$refs.operationlog.showOperateLogDialog(purchaseOrderNo, 7)
    },
    formatData(id) {
      const obj = {
        0: "未入库",
        1: "部分入库",
        2: "入库完成"
      }
      return obj[id]
    },
    //dialog样式修改后添加
    dialogResult(dialogFlage) {
      if (dialogFlage) {
        this.confrimType = 1
      } else {
        this.confrimType = 2
      }
      this.handleConfrim()
    },
    //dialog样式修改后添加结束
    showSkuInfo(purchaseOrderNo) {
      showSkuInfo({ purchaseOrderNo: purchaseOrderNo }).then(({ data }) => {
        console.info(data.data)
        if (data.code == 0) {
          this.skuInfoDialog = true
          this.skuInfoData = data.data
        } else {
          this.$message.error("查询采购明细失败")
          return
        }
      })
    },
    showInboundInfo(purchaseOrderNo) {
      showInboundInfo({ purchaseOrderNo: purchaseOrderNo }).then(({ data }) => {
        // console.info(data.data);
        if (data.code == 0) {
          this.inboundInfoDialog = true
          this.inboundInfoData = data.data
        } else {
          this.$message.error("查询入库情况失败")
          return
        }
      })
    },
    handleCommand(command) {
      if (command == "提交") {
        this.poOrderConfirm([0], 2, 0, "提交", "未处理状态才能进行提交操作", false, "提交审核", "拒绝提交")
      }
      // if(command=='采购一审'){
      //   this.poOrderConfirm([1],2,0,'采购一审','采购一审状态才能进行采购一审操作',true,'采购一审同意','采购一审拒绝')
      // }
      if (command == "采购审核") {
        this.poOrderConfirm(
          [2],
          3,
          0,
          "采购审核",
          "采购审核状态才能进行采购审核操作",
          true,
          "采购审核同意",
          "采购审核拒绝"
        )
      }
      // if (command == "撤销提交") {
      //   this.reverse([2], 0, "采购订单的状态不是采购审核，请检查", "撤销提交")
      // }
      if (command == "采购审核反审") {
        this.reverse([3], 2, "采购订单的状态不是审核完成，请检查", "采购审核反审")
      }
      if (command == "一审反审") {
        this.reverse([2], 1, "采购订单的状态不是采购审核，请检查", "采购一审反审")
      }
      if (command == "二审反审") {
        this.reverse([3], 2, "采购订单的状态不是审核完成状态，请检查", "采购审核反审")
      }
    },
    reverse(oldStatus, reverseNewStatus, confrimErrorMsg, logRemark) {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var purchaseOrderNoArray = []
      for (var i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].revokeStatus != 0) {
          this.$message.error(this.selectList[i].purchaseOrderNo + "的撤销状态是异常的，无法操作")
          return false
        }
        var status = this.selectList[i].status
        if (oldStatus.indexOf(status) == -1) {
          console.log(1)
          this.$message.error(confrimErrorMsg)
          return false
        }
        purchaseOrderNoArray.push(this.selectList[i].purchaseOrderNo)
      }
      var params = {
        purchaseOrderNos: purchaseOrderNoArray.join(","),
        reverseNewStatus: reverseNewStatus,
        confrimErrorMsg: confrimErrorMsg,
        logRemark: logRemark
      }
      this.reverseRes(params)
    },
    reverseRes(params) {
      reverseApi(params)
        .then(({ data }) => {
          if (data.code == 0) {
            this.$refs.crud.selectClear()
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
        .finally(() => {})
    },

    createContractCancel() {
      this.$refs.createContractCrud.selectClear()
      this.createContractStatus = false
      this.createContractData = []
    },
    createContractConfirm() {
      if (!this.createContractSelectionList.length) {
        this.$message.error("请勾选数据")
        return
      }
      if (this.createContractSelectionList.length > 1) {
        this.$message.error("只能选择一个合同条款")
        return
      }

      let params = {
        informationId: this.createContractSelectionList[0].informationId,
        purchaseOrderNo: this.contractPurchaseOrderNo
      }

      console.log(params)
      createContractBatch(params).then((res) => {
        if (res.data.code === 0) {
          this.$refs.crud.selectClear()
          this.$message({
            message: "生成合同成功",
            type: "success"
          })
          this.createContractCancel()
          this.getList(this.page)
        } else if (res.data.code === 1 && res.data.msg) {
          this.$message.error(data.msg)
        } else {
          this.$message.error("生成合同失败")
        }
      })
    },
    createContractSelectionChange(list) {
      this.createContractSelectionList = list
    },
    handleCreateContract(row) {
      let supplierNo = ""
      if (row) {
        let { contractStatus, status, purchaseOrderNo } = row
        this.contractPurchaseOrderNo = purchaseOrderNo
        supplierNo = row.supplierNo

        if (status != 3) {
          this.$message.warning("存在着不是审核完成状态的订单，请检查！")
          return
        }

        if (contractStatus) {
          this.$message.warning("存在已经生成合同的订单，请检查")
          return
        }
      } else {
        if (this.selectList && this.selectList.length === 0) {
          this.$message.warning("请选择数据")
          return
        }

        const supplierNoArr = this.selectList.map((item) => item.supplierNo)
        const supplierNoSet = new Set(supplierNoArr)
        if (supplierNoSet.size > 1) {
          this.$message.warning("请选择一样的供应商")
          return
        }

        for (let item of this.selectList) {
          if (item.status != 3) {
            this.$message.warning("存在着不是审核完成状态的订单，请检查！")
            return
          }

          if (item.contractStatus) {
            this.$message.warning("存在已经生成合同的订单，请检查")
            return
          }
        }

        supplierNo = supplierNoArr[0]
        this.contractPurchaseOrderNo = this.selectList.map((item) => item.purchaseOrderNo).join(",")
      }

      getListBySupplierNo(supplierNo).then((res) => {
        if (res.data.code === 0) {
          if (res.data.data && res.data.data.length === 0) {
            this.$message.warning("该供应商合同条款未配置，请先配置合同条款！")
            return
          }
          this.createContractData = res.data.data
          this.createContractStatus = true
        } else {
          this.$message.error(res.data.msg)
        }
      })

      return
    },
    selectionChange(list) {
      this.selectList = list
      this.purchaseQuantityTotal = this.selectList.reduce((prev, cuv) => {
        return prev + (cuv.purchaseQuantityTotal ? cuv.purchaseQuantityTotal : 0)
      }, 0)

      let amountTotal = this.selectList.reduce((prev, cuv) => {
        return prev + (cuv.amount ? cuv.amount : 0)
      }, 0)
      this.amountTotal = amountTotal.toFixed(2)
    },
    poOrderConfirm(
      oldStatus,
      agreeNewStatus,
      rejectNewStatus,
      confrimTitle,
      confrimErrorMsg,
      rejectVisiable,
      agreeLogRemark,
      rejectLogRemark
    ) {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      for (var i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].revokeStatus != 0) {
          this.$message.error(this.selectList[i].purchaseOrderNo + "的撤销状态是异常的，无法操作")
          return false
        }
        var status = this.selectList[i].status
        if (oldStatus.indexOf(status) == -1) {
          this.$message.error(confrimErrorMsg)
          return false
        }
        if (!this.selectList[i].warehouseId) {
          this.$message.error("存在入库仓为空的数据,请检查")
          return false
        }
        if (!this.selectList[i].settleaccountTypeId) {
          this.$message.error("存在结算方式为空的数据,请检查")
          return false
        }
      }
      this.agreeNewStatus = agreeNewStatus
      this.rejectNewStatus = rejectNewStatus
      this.confrimTitle = confrimTitle
      this.confrimErrorMsg = confrimErrorMsg
      this.confrimType = "1"
      this.rejectVisiable = rejectVisiable
      this.agreeLogRemark = agreeLogRemark
      this.rejectLogRemark = rejectLogRemark
      this.confrimTextarea = ""
      if (confrimTitle == "提交") {
        this.handleConfrim("提交")
      } else {
        this.confrimDialog = true
      }
    },
    handleConfrim(value) {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var purchaseOrderNoArray = []
      for (var i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].revokeStatus != 0) {
          this.$message.error(this.selectList[i].purchaseOrderNo + "的撤销状态是异常的，无法操作")
          return false
        }
        purchaseOrderNoArray.push(this.selectList[i].purchaseOrderNo)
      }
      if (this.confrimType == "1") {
        if (this.confrimTextarea && this.confrimTextarea != "") {
          this.agreeLogRemark = this.agreeLogRemark + ":" + this.confrimTextarea
        }
        var params = {
          purchaseOrderNos: purchaseOrderNoArray.join(","),
          newStatus: this.agreeNewStatus,
          confrimErrorMsg: this.confrimErrorMsg,
          logRemark: this.agreeLogRemark
        }

        agree(params)
          .then(({ data }) => {
            if (data.code === 0) {
              this.$refs.crud.selectClear()
              this.confrimDialog = false
              if (!value) {
                this.$message({
                  message: "审核成功",
                  type: "success"
                })
              } else {
                this.$message({
                  message: value + "成功",
                  type: "success"
                })
              }
              this.getList(this.page)
            } else if (data.code === 1 && data.msg) {
              this.$message.error(data.msg)
            } else {
              if (!value) {
                this.$message.error("审核失败")
              } else {
                this.$message.error(value + "失败")
              }
            }
          })
          .finally(() => {})
      }
      if (this.confrimType == "2") {
        if (this.confrimTextarea && this.confrimTextarea != "") {
          this.rejectLogRemark = this.rejectLogRemark + ":" + this.confrimTextarea
        } else {
          this.$message.error("请填写拒绝原因!!!")
          return false
        }
        var params = {
          purchaseOrderNos: purchaseOrderNoArray.join(","),
          rejectNewStatus: this.rejectNewStatus,
          confrimErrorMsg: this.confrimErrorMsg,
          logRemark: this.rejectLogRemark
        }

        reject(params)
          .then(({ data }) => {
            if (data.code === 0) {
              this.$refs.crud.selectClear()
              this.confrimDialog = false
              this.$message({
                message: "拒绝成功",
                type: "success"
              })
              this.getList(this.page)
            } else if (data.code === 1 && data.msg) {
              this.$message.error(data.msg)
            } else {
              this.$message.error("拒绝失败")
            }
          })
          .finally(() => {})
      }
    },
    getList(page, params) {
      if (!page) {
        page = {
          currentPage: 1,
          pageSize: 20
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
    handleDel() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var purchaseOrderNoArray = []
      for (var i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].revokeStatus != 0) {
          this.$message.error(this.selectList[i].purchaseOrderNo + "的撤销状态是异常的，无法操作")
          return false
        }
        if (this.selectList[i].status != 0) {
          this.$message.error("存在不是未处理状态的单号，请检查")
          return false
        }
        purchaseOrderNoArray.push(this.selectList[i].purchaseOrderNo)
      }
      this.$confirm("此操作将永久删除该采购单号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          removeBatch({ purchaseOrderNos: purchaseOrderNoArray.join(",") })
            .then(({ data }) => {
              if (data.code === 0) {
                this.$refs.crud.selectClear()
                this.$message({
                  message: "删除成功",
                  type: "success"
                })
                this.getList(this.page)
              } else if (data.code === 1 && data.msg) {
                this.$message.error(data.msg)
              } else {
                this.$message.error("删除失败")
              }
            })
            .finally(() => {})
        })
        .catch(() => {})
    },
    rowDel: function (row, index) {
      var _this = this
      this.$confirm("是否确认删除ID为" + row.purchaseOrderNo, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return delObj(row.purchaseOrderNo)
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
    clearSelectClear() {
      // this.$refs.crud.selectClear();
      this.$refs.crud.toggleSelection()
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.page)
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      //将搜索的条件放入到确认的搜索条件中
      this.searchForm.status = this.statusArray.join(",")
      this.searchForm.currency = this.currencyArray.join(",")
      if (this.searchForm.purchaseNoTime && this.searchForm.purchaseNoTime.length == 2) {
        this.searchForm.createTimeStart = this.searchForm.purchaseNoTime[0]
        this.searchForm.createTimeEnd = this.searchForm.purchaseNoTime[1]
      } else {
        this.searchForm.createTimeStart = ""
        this.searchForm.createTimeEnd = ""
      }
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(page, params)
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.statusArray = []
      this.currencyArray = []
      console.log(123)
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
    },
    // 采购变更
    createChange(row) {
      const { purchaseOrderNo, contractStatus, inboundStatus } = row

      if (contractStatus !== 2) {
        this.$message.warning("选项合同状态必须为审核通过")
        return
      }
      if (inboundStatus === 2) {
        this.$message.warning(purchaseOrderNo + "已入库完成，不可发起变更")
        return
      }

      let params = {
        poOrderNos: [purchaseOrderNo]
      }
      getPoChangList(params).then((res) => {
        if (res.data.code === 0) {
          const poOrderNos = purchaseOrderNo
          this.$router.push({
            path: "/pochange/edit",
            query: {
              poOrderNos,
              isChangeList: false
            }
          })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },

    // 获取价格模式
    async getPriceModelAll() {
      this.priceModelOptions = await getDictByType("price_model")
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
    },
    getCtrlList(row) {
      return [
        {
          title: "生成合同",
          item: row,
          clickFn: (row) => {
            this.handleCreateContract(row)
          },
          show: this.permissions.purchase_poorder_createContract && row.status === 3 && row.contractStatus === null // 审核完成状态的订单、未生成合同
        },
        {
          title: "发起变更",
          item: row,
          clickFn: (row) => {
            this.createChange(row)
          },
          show: this.permissions.purchase_poorder_pochange && row.contractStatus === 2 && row.inboundStatus !== 2 // 合同状态必须为审核通过、订单是未入库状态
        },
        {
          title: "撤销提交",
          item: row,
          clickFn: (row) => {
            this.handleUndoSubmit(row)
          },
          show: this.permissions.purchase_poorder_submit && row.revokeStatus === 0 && row.status === 2 // 撤销状态不是异常、采购订单的状态是采购审核
        },
        {
          title: "生成预付单",
          item: row,
          clickFn: (row) => {
            this.createRequestAndPre(row)
          },
          show: row.status === 3
        },
        {
          title: "编辑备注",
          item: row,
          clickFn: (row) => {
            this.handleEditRemark(row)
          },
          show: true
        }
      ]
    },
    // 撤销提交
    handleUndoSubmit(row) {
      const { revokeStatus, purchaseOrderNo, status } = row
      if (revokeStatus != 0) {
        this.$message.error(purchaseOrderNo + "的撤销状态是异常的，无法操作")
        return
      }
      if (![2].includes(status)) {
        this.$message.error("采购订单的状态不是采购审核，请检查")
        return
      }
      let params = {
        purchaseOrderNos: purchaseOrderNo,
        reverseNewStatus: 0,
        confrimErrorMsg: "采购订单的状态不是采购审核，请检查",
        logRemark: "撤销提交"
      }
      this.reverseRes(params)
    },
    handleEditRemark(row) {
      const { remarks, purchaseOrderNo } = row
      this.$refs.remarkDialogRef.openDialog(remarks, purchaseOrderNo)
    },
    // 获取法人主体
    async getCorporation() {
      const { data } = await getAllCorporationApi()
      if (data.code === 0) {
        this.corporationList = data.data
      }
    }
  }
}
</script>

<style lang="scss">
#poorder {
  // 弹框样式修改
  .el-dialog__header {
    height: 30px;
    line-height: 30px;
    background-color: #f7f9fb;
    border-radius: 4px 4px 0 0;
    border-bottom: 1px solid #eff1f4;
  }

  .el-textarea__inner {
    height: 90px;
  }

  #createOrderDialog .el-cascader__tags {
    height: 25px;
    overflow: hidden;
  }

  //弹框样式修改完毕
  @media (max-width: 1279px) {
    .avue-crud__menu .avue-crud__right {
      top: 0;
      position: absolute;
    }
  }

  @media (max-width: 1010px) {
    .avue-crud__menu .avue-crud__right {
      top: unset;
      position: relative;
    }
  }
}
</style>
