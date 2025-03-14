<template>
  <div class="execution" v-loading.fullscreen.lock="loading" element-loading-text="正在处理中">
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
        :summaryMethod="getSummaries"
      >
        <!-- 操作按钮栏 -->
        <template slot="menuLeft">
          <el-button
            type="primary"
            @click="handleExport"
            size="small"
            v-if="permissions.transfer_tmstransfercost_export"
            >导 出</el-button
          >
          <!-- <el-button type="primary" @click="showLockCost" size="small" v-if="false">锁定费用</el-button> -->
          <el-button type="primary" @click="showImport" size="small">导入对账</el-button>
          <el-button type="primary" @click="showEstimate" size="small">导入预估</el-button>
        </template>
        <!-- 搜索栏 -->
        <template slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="sourceNo">
              <avue-crud-input v-model="searchForm.sourceNo" size="small" placeholder="业务单号"></avue-crud-input>
            </el-form-item>
            <el-form-item prop="trackingNo">
              <avue-crud-input v-model="searchForm.trackingNo" size="small" placeholder="物流跟踪号"></avue-crud-input>
            </el-form-item>
            <el-form-item prop="costLockStatus">
              <el-select size="small" v-model="searchForm.costLockStatus" clearable filterable placeholder="对账状态">
                <el-option
                  v-for="item in costLockStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="costType">
              <el-select size="small" v-model="searchForm.costType" clearable filterable placeholder="费用类型">
                <el-option
                  v-for="item in costOperateTypeOptions"
                  :key="item.tmsLogisticsCostTypeCode"
                  :label="item.tmsLogisticsCostTypeName"
                  :value="item.tmsLogisticsCostTypeCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="transportCarrierCode">
              <el-select
                size="small"
                v-model="searchForm.transportCarrierCode"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="物流商"
              >
                <el-option
                  v-for="item in getCarriersOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <template slot="searchAdvanced">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="handleStatus">
              <el-select size="small" v-model="searchForm.handleStatus" clearable filterable placeholder="处理状态">
                <el-option
                  v-for="item in handleStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="corporationId">
              <el-select size="small" clearable v-model="searchForm.corporationId" filterable placeholder="结算组织">
                <el-option v-for="item in corporationOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="createTime">
              <el-date-picker
                v-model="searchForm.createTime"
                type="daterange"
                size="small"
                start-placeholder="创建开始日期"
                end-placeholder="创建结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="invoiceDate">
              <el-date-picker
                v-model="searchForm.invoiceDate"
                type="daterange"
                size="small"
                start-placeholder="单据开始日期"
                end-placeholder="单据结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </template>

        <!-- 调拨单号列 -->
        <!-- <template slot="transferNo" slot-scope="scope">
              <router-link
                :to="{ path: '/transfer/detail/' + scope.row.transferType, query: { transferType: scope.row.transferType, transferNo: scope.row.transferNo } }">{{
                  scope.row.transferNo }}</router-link>
            </template> -->
        <template slot="sourceNo" slot-scope="scope">
          <copy-text hoverToShow>
            <router-link :to="'/transfer/fristMileTransfer/detail?id=' + scope.row.sourceId + '&type=detail'">{{
              scope.row.sourceNo
            }}</router-link>
          </copy-text>
        </template>

        <template slot="operate" slot-scope="scope">
          <el-button type="text" v-if="scope.row.abnormalFlag === 'Y'" @click="handleAbnormal(scope.row)"
            >处理异常</el-button
          >
        </template>
      </avue-crud>

      <!-- sku信息 -->
      <el-dialog class="sku-dialog" v-bind:title="dialogTitil" :visible.sync="skuDialog" center>
        <div style="margin-left: 20px; font-size: 14px">
          <span><strong>总箱数：</strong> </span
          ><span
            ><strong>{{ tmstransfer.total }}</strong> </span
          ><span><strong>箱</strong> </span> <span style="margin-left: 80px"><strong>总毛重：</strong> </span
          ><span
            ><strong>{{ tmstransfer.boxWeight }}</strong> </span
          ><span><strong>KG</strong> </span>
        </div>
        <avue-crud class="app-container" :data="tmstransfer.tableData" :option="tmstransfer.tableOption"> </avue-crud>
      </el-dialog>

      <!-- 上传文件 -->
      <el-dialog
        class="upload-dialog"
        title="导入物流单号"
        :visible.sync="uploadDialog"
        width="450px"
        center
        @close="importReset"
      >
        <!-- <div>上传数据：</div>
            <div>
              <el-upload
                class="upload-inq inline-class"
                ref="upload"
                accept=".xls,.xlsx"
                action="String"
                :auto-upload="false"
                :on-change="signFileChange"
                :show-file-list="false"
              >
                <el-button type="primary" size="small">选择文件</el-button>
                &nbsp;&nbsp;
                <span>{{upload.attachmentFileName}}</span>
              </el-upload>
            </div>
            <div><span>模板下载：</span><el-button type="text" @click="downloadTemplate">下载</el-button></div>
            <div style="border: 1px solid #ccc6c6;">
              <div style="float: left;padding: 10px;">注意事项：</div>
              <div style="float: left;">
                <div style="padding: 10px;">1、必须按照导出模板导入</div>
                <div style="padding: 10px;">2、导入的物流单号必须在[调拨管理-导入物流单号]导入过</div>
                <div style="padding: 10px;">3、若[物流单号+费用类型]已审核，不允许导入</div>
              </div>
              <div style="clear:both"></div>
            </div> -->

        <tip
          type="list"
          :title="[
            '1、必须按照导出模板导入',
            '2、导入的物流单号必须在[调拨管理-导入物流单号]导入过',
            '3、若[物流单号+费用类型]已审核，不允许导入'
          ]"
        />
        <el-upload
          class="upload-inq inline-class"
          ref="upload"
          accept=".xls,.xlsx"
          action="String"
          :auto-upload="false"
          :on-change="signFileChange"
          :show-file-list="false"
        >
          <el-button type="primary" size="small">上传数据</el-button>
        </el-upload>
        <P class="attachmentFileName">{{ upload.attachmentFileName }}</P>
        <el-button type="default" size="small" @click="downloadTemplate">模板下载</el-button>

        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="submitUpload()">确定</el-button>
        </span>
      </el-dialog>

      <!-- 锁定费用 -->
      <el-dialog title="锁定费用" :visible.sync="lockCostDialog" width="77%" center>
        <span style="color: red; margin-left: 20px">提示：锁定费用之后，只能录入调整费用，您确定锁定以下费用吗？</span>
        <el-table :data="lockCostData" @selection-change="handleCost">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="调拨单号" prop="transferNo"></el-table-column>
          <el-table-column label="物流商" prop="transportCarrierName"></el-table-column>
          <el-table-column label="费用项" prop="costType">
            <template slot-scope="{ row }">
              <span>{{ costTypeObj[row.costType] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="费用" prop="cost">
            <template slot-scope="{ row }">
              <span>{{ row.cost + " " + row.costCurrency }}</span>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="lockConfirm">确认</el-button>
          <el-button size="small" @click="lockCostDialog = false">取消</el-button>
        </span>
      </el-dialog>

      <!-- 异常处理 -->
      <div>
        <el-dialog title="异常处理" :visible.sync="abnormaStatus" width="30%" @close="abnormaCancel">
          <el-form
            ref="abnormaForm"
            label-width="120px"
            :inline="true"
            :model="abnormaForm"
            :rules="abnormaRules"
            size="small"
            status-icon
          >
            <el-form-item label="业务单号：" style="margin-bottom: 0">
              <span style="margin-right: 10px">{{ rowDetail.sourceNo }}</span>
              <router-link :to="'/transfer/fristMileTransfer/detail?id=' + rowDetail.sourceId + '&type=detail'"
                >查看</router-link
              >
            </el-form-item>
            <el-form-item label="柜号：" style="margin-bottom: 0">
              <span>{{ rowDetail.trackingNo }}</span>
            </el-form-item>
            <el-form-item label="物流商：" style="margin-bottom: 0">
              <span>{{ rowDetail.transportCarrierName }}</span>
            </el-form-item>
            <el-form-item label="费用类型：" style="margin-bottom: 0">
              <span>{{ rowDetail.costTypeName }}</span>
            </el-form-item>
            <el-form-item label="预估费用：" style="margin-bottom: 0">
              <span>{{ rowDetail.costMsg }}</span>
            </el-form-item>
            <el-form-item label="原实际费用：" style="margin-bottom: 0">
              <span>{{ rowDetail.actualCostMsg }}</span>
            </el-form-item>
            <el-form-item label="实际费用：" prop="actualCost">
              <el-input v-model="abnormaForm.actualCost" size="small" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="核销原因：" prop="verificationReason">
              <el-input
                v-model="abnormaForm.verificationReason"
                size="small"
                placeholder="请输入"
                type="textarea"
                :rows="3"
              ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="abnormaCancel">取 消</el-button>
            <el-button type="primary" size="small" @click="abnormaConfirm">确 定</el-button>
          </span>
        </el-dialog>
      </div>

      <!-- 导入对账 -->
      <logictisCostImport
        ref="logictisCostImport"
        :downloadUrl="downloadUrl"
        :downloadTitle="'头程费用对账导入模板'"
        @import="importExcelBtn"
      >
      </logictisCostImport>

      <!-- 导入对账记录差异预览 -->
      <el-dialog
        title="对账记录处理"
        :visible.sync="recordStatus"
        width="60%"
        @close="recordCancel"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="`差异记录(${diffRecord.length})`" name="first"></el-tab-pane>
          <el-tab-pane :label="`失败记录(${failRecord.length})`" name="second"></el-tab-pane>
          <el-tab-pane :label="`正常记录(${normalRecord.length})`" name="third"></el-tab-pane>
        </el-tabs>
        <avue-crud
          ref="recordCrud"
          :data="activeName === 'first' ? diffRecord : activeName === 'second' ? failRecord : normalRecord"
          :option="recordTableOption"
          @size-change="recordSizeChange"
          @current-change="recordCurrentChange"
          id="estimateStatusDialog"
        >
          <template slot="abnormalFlag" slot-scope="scope">
            <el-switch v-model="scope.row.abnormalFlag"> </el-switch>
          </template>
          <template slot="diffCost" slot-scope="scope">
            <span style="color: rgb(136, 9, 9)" v-if="scope.row.diffCost > 0">{{ scope.row.diffCost }}</span>
            <span style="color: rgb(82, 155, 46)" v-else>{{ scope.row.diffCost }}</span>
          </template>
        </avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="importCancel">取消导入</el-button>
          <el-button size="small" type="primary" @click="importConfirm">确定导入</el-button>
        </span>
      </el-dialog>

      <!-- 导入预估 -->
      <logictisCostImport
        ref="estimateImport"
        :downloadUrl="estimateUrl"
        :downloadTitle="'物流费用预估导入模板'"
        @import="importEstimate"
      >
      </logictisCostImport>

      <!-- 导入预估差异预览 -->
      <el-dialog
        title="预估记录处理"
        :visible.sync="estimateStatus"
        width="50%"
        @close="estimateCancel"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-tabs v-model="estimateName" @tab-click="estimateClick">
          <el-tab-pane :label="`失败记录(${failEstimate.length})`" name="first"></el-tab-pane>
          <el-tab-pane :label="`正常记录(${normalEstimate.length})`" name="second"></el-tab-pane>
        </el-tabs>
        <avue-crud
          ref="estimateCrud"
          :page="estimatePage"
          :data="estimateList"
          :option="estimateTableOption"
          @current-change="estimateCurrentChange"
          id="estimateStatusDialog"
        >
        </avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="estimateCancel">取消导入</el-button>
          <el-button size="small" type="primary" @click="estimateConfirm">确定导入</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  // getCostTypeAll,
  // importObj,
  // auditObj,
  exportData,
  getCarriers,
  lockCostShow,
  lockCost,
  handleAbnormal,
  getCheckBillInfo,
  batchImportDataPreview,
  batchImportData,
  saveCheckBill
} from "@/api/logistics/transfer/tmstransfercost"
import { getObjByType } from "@/api/admin/dict"
import { getPlatformSkuInfo } from "@/api/logistics/transfer/tmstransferdetail"
import {
  tableOption,
  skuTableOption,
  recordTableOption,
  estimateTableOption
} from "@/const/crud/logistics/transfer/tmstransfercost"
import { getAll as getBsestoreAll } from "@/api/baseSetup/bsestore"
import { getCountry } from "@/api/baseSetup/bsecountry"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import logictisCostImport from "@/views/cockpit/logictisCostImport"
import { getAll as getBsecorporationAll } from "@/api/baseSetup/bsecorporation"

import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getUrlConcatToken, getTokenUrl, downloadBlob } from "@/util/auth"
import tip from "@/views/cockpit/tip"
import { costListAll } from "@/api/logistics/transfer/fristMileTransfer"

export default {
  name: "tmstransfercost",
  data() {
    return {
      //搜索条件，和前端控件绑定
      searchForm: {
        sourceNo: "",
        trackingNo: "",
        costLockStatus: "",
        handleStatus: "",
        createTime: "",
        invoiceDate: "",
        costType: "",
        transportCarrierCode: "",
        corporationId: ""
      },
      //确定的搜索条件
      searchFormConfirm: [],
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      loading: false,
      selectList: [],
      costTypeOptions: [],
      storeOptions: [],
      bsecountryOptions: [],
      countryOptions: [],
      warehouseOptions: [],
      transferStatusOptions: [],
      costLockStatusOptions: [],
      dialogTitil: "",
      tmstransfer: {
        total: 0,
        boxWeight: 0.0,
        tableData: [],
        tableOption: skuTableOption
      },
      skuDialog: false,
      uploadDialog: false,
      upload: {
        attachmentFileName: "",
        file: null
      },
      costOperateTypeOptions: [],
      getCarriersOptions: [],
      lockCostDialog: false,
      costTypeObj: {},

      abnormaRules: {
        actualCost: [{ required: true, message: "请填写实际费用", trigger: "blur" }],
        verificationReason: [{ required: true, message: "请填写核销原因", trigger: "blur" }]
      },
      abnormaStatus: false,
      abnormaForm: {},
      recordStatus: false,
      recordPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      diffRecord: [],
      failRecord: [],
      normalRecord: [],
      recordTableOption: recordTableOption,
      activeName: "first",
      corporationOptions: [],
      rowDetail: {},
      handleStatusOptions: [],
      downloadUrl: "/warehouse/basis/downloadTemplate",
      estimateUrl: "/warehouse/transfercost/downloadImportCostTemplate",
      estimateStatus: false,
      estimateName: "first",
      failEstimate: [],
      normalEstimate: [],
      estimateList: [],
      estimateTableOption: estimateTableOption,
      estimatePage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 100, // 每页显示多少条
        pageSizes: [100]
      },
      aggregateRecord: {}
    }
  },
  created() {
    //加载所有费用类型
    // getCostTypeAll().then(response => {
    //   var data = response.data.data
    //   if (data && data.length > 0) {
    //     this.costTypeOptions = data
    //   }
    // })
    //加载店铺
    var params = {
      isUse: false,
      authority: false
    }
    getBsestoreAll(params).then((response) => {
      var data = response.data.data
      if (data && data.length > 0) {
        this.storeOptions = data
      }
    })
    //加载国家
    getCountry().then((response) => {
      var data = response.data.data
      if (data && data.length > 0) {
        data.forEach((item) => {
          this.countryOptions.push({
            label: item.countryShortName,
            value: item.countryId
          })
        })
      }
    })
    //加载仓库
    getAllWarehouse({
      funcState: "0",
      delFlag: "0"
    }).then((res) => {
      res.data.data.forEach((item) => {
        this.warehouseOptions.push({
          label: item.warehouseName,
          value: item.warehouseId
        })
      })
    })
    //加载物流商
    getCarriers().then((res) => {
      res.data.data.forEach((item) => {
        this.getCarriersOptions.push({
          label: item.carrierShortName,
          value: item.transportCarrierCode
        })
      })
    })
    getObjByType("transfer_status").then((res) => {
      this.transferStatusOptions = res.data.data
    })
    // getObjByType('cost_operate_type').then(res => {
    //   this.costOperateTypeOptions = res.data.data
    // })

    // 对账状态
    getObjByType("cost_lock_status").then((res) => {
      this.costLockStatusOptions = res.data.data
    })
    // 费用类型
    // getObjByType("logistics_cost_type").then((res) => {
    //   this.costOperateTypeOptions = res.data.data;
    // });
    costListAll().then((res) => {
      if (res.data.code === 0) {
        this.costOperateTypeOptions = res.data.data
      }
    })
    // 结算组织
    getBsecorporationAll().then((res) => {
      res.data.data.forEach((item) => {
        this.corporationOptions.push({
          label: item.corporationName,
          value: item.corporationId
        })
      })
    })
    // 处理状态
    getObjByType("handle_status").then((res) => {
      this.handleStatusOptions = res.data.data
    })
  },
  mounted: function () {
    this.getList(this.page, this.searchFormConfirm)
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    abnormaCancel() {
      this.abnormaForm = {}
      this.abnormaStatus = false
    },
    abnormaConfirm() {
      this.$refs.abnormaForm.validate((valid) => {
        if (valid) {
          this.abnormaForm.id = this.rowDetail.id
          handleAbnormal(this.abnormaForm).then((res) => {
            if (res.data.code === 0) {
              this.$message.success("处理异常成功")
              this.abnormaStatus = false
              this.getList(this.page, this.searchFormConfirm)
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    // 对账导入数据处理
    importConfirm() {
      const params = [...this.diffRecord, ...this.normalRecord]
      saveCheckBill(params).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("导入成功")
          this.importCancel()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    importCancel() {
      this.activeName = "first"
      this.recordStatus = false
    },
    handleAbnormal(row) {
      this.rowDetail = row
      this.abnormaStatus = true
    },
    handleClick() {
      const activeNameObj = {
        first: "diffRecord",
        second: "failRecord",
        third: "normalRecord"
      }
      this.recordTableData = this[activeNameObj[this.activeName]]
      const columnIndex = [6, 7, 8]
      const activeNameHidden = {
        first: [true, false, false],
        second: [false, true, true],
        third: [true, true, true]
      }
      columnIndex.forEach((item, index) => {
        this.recordTableOption.column[item].hidden = activeNameHidden[this.activeName][index]
      })
    },
    recordSizeChange(page) {
      console.log(page)
    },
    recordCurrentChange(page) {
      console.log(page)
    },
    showEstimate() {
      this.$refs.estimateImport.syncFn()
    },
    estimateCancel() {
      this.estimateName = "first"
      this.estimateStatus = false
    },
    estimateConfirm() {
      if (!this.normalEstimate.length) {
        this.$message.warning("正常记录为0，无法导入，请检查导入数据是否正确！")
        return
      }
      batchImportData(this.normalEstimate).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("导入成功")
          this.estimateStatus = false
          this.getList(this.page, this.searchFormConfirm)
        }
      })
    },
    estimateClick() {
      this.estimatePage.currentPage = 1
      this.$refs.estimateCrud.defaultPage.currentPage = 1
      let arr = this.estimateName === "first" ? this.failEstimate : this.normalEstimate
      this.estimateList = arr.slice(0, this.estimatePage.pageSize)
      this.estimatePage.total = this.estimateName === "first" ? this.failEstimate.length : this.normalEstimate.length
      this.estimateTableOption.column[5].hidden = this.estimateName === "first" ? false : true
    },
    estimateCurrentChange(val) {
      let arr = this.estimateName === "first" ? this.failEstimate : this.normalEstimate
      this.estimateList = arr.slice((val - 1) * this.estimatePage.pageSize, val * this.estimatePage.pageSize)
    },
    importEstimate(file) {
      if (!file) {
        this.$message.error("请上传文件!")
        return
      }
      this.$refs.estimateImport.openFullScreen()
      let formdata = new FormData()
      formdata.append("file", file.raw)
      batchImportDataPreview(formdata).then((res) => {
        if (res.data.code === 0) {
          this.$refs.estimateImport.syncFn()
          this.$refs.estimateImport.closeFullScreen()
          this.estimateStatus = true
          this.failEstimate = res.data.data.errorData
          this.normalEstimate = res.data.data.normalData
          this.estimateList = res.data.data.errorData.slice(0, this.estimatePage.pageSize)
          this.estimatePage.total = this.failEstimate.length
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 导入
    showImport() {
      this.$refs.logictisCostImport.syncFn()
    },
    // 文件上传
    importExcelBtn(file) {
      if (!file) {
        this.$message.error("请上传文件!")
        return
      }
      this.$refs.logictisCostImport.openFullScreen()
      let formdata = new FormData()
      formdata.append("file", file.raw)
      getCheckBillInfo(formdata).then((res) => {
        if (res.data.code === 0) {
          this.$refs.logictisCostImport.syncFn()
          this.$refs.logictisCostImport.closeFullScreen()
          this.recordStatus = true
          res.data.data.diff.forEach((item) => {
            item.abnormalFlag = false
          })
          this.diffRecord = res.data.data.diff
          this.failRecord = res.data.data.fail
          this.normalRecord = res.data.data.done
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    showLockCost() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.warning("请先选择数据")
        return
      }
      let param = this.selectList.map((item) => item.id)
      lockCostShow(param).then((res) => {
        if (res.data.code == 0) {
          this.lockCostData = res.data.data
          this.lockCostDialog = true
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    lockConfirm() {
      if (!this.costListData || this.costListData.length == 0) {
        this.$message.warning("请先选择要锁定的费用！")
        return
      }
      lockCost(this.costListData).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("操作成功")
          this.lockCostDialog = false
          this.refreshChange()
        } else {
          this.$message.error(res.data.msg)
          this.lockCostDialog = false
        }
      })
    },
    handleCost(row) {
      this.costListData = row.reduce((acc, obj) => {
        let existItem = acc.find((item) => item.transferNo === obj.transferNo)
        if (existItem) {
          existItem.transferCostIds.push(obj.id)
        } else {
          acc.push({ transferNo: obj.transferNo, transferCostIds: [obj.id] })
        }
        return acc
      }, [])
      console.log(this.costListData)
    },

    //加载列表数据
    getList(page, params) {
      this.tableLoading = true
      this.page.currentPage = page.currentPage
      fetchList(
        Object.assign(
          {
            page: page.currentPage,
            pageSize: page.pageSize,
            filtering: this.searchFormConfirm,
            aggregate: [
              { field: "cost", function: "sum" },
              { field: "actualCost", function: "sum" }
            ]
          },
          params
        )
      ).then((res) => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.records
          this.page.total = res.data.data.total
          this.tableLoading = false
          this.aggregateRecord = res.data.data.aggregateRecord
        }
      })
    },
    //处理搜索条件
    transformSearchForm(searchForm) {
      let result = []
      for (let key in searchForm) {
        let value = searchForm[key]
        if (typeof value === "string") {
          value = value.split(",")
        }
        result.push({
          field: key,
          value: value
        })
      }
      return result
    },
    //刷新回调
    refreshChange() {
      this.getList(this.page)
    },
    //搜索回调
    searchChange(params, page) {
      this.page.currentPage = 1
      // page=page||{currentPage:1}
      this.handleSearchFilter()
      this.getList(this.page, params)
    },
    //搜索条件处理
    handleSearchFilter() {
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.searchFormConfirm = this.transformSearchForm(this.searchFormConfirm)
    },
    //重置搜索条件
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
      if (this.$refs["searchFormAdvance"]) this.$refs["searchFormAdvance"].resetFields()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.getList(this.page, this.searchFormConfirm)
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      this.getList(this.page, this.searchFormConfirm)
    },
    //选中数据
    selectionChange(tableData) {
      this.selectList = tableData
    },
    //清除选中
    clearSelectClear() {
      this.$refs.crud.selectClear()
    },
    //处理响应
    handleResponse(response, operationCode, operation) {
      this.loading = false
      if (response.data.code == 0) {
        this.clearSelectClear()
        this.handleSearchFilter()
        this.getList(this.page, this.searchFormConfirm)
        if (operationCode == "uploadFile") {
          this.uploadDialog = false
        }
        this.$notify({
          title: "成功",
          message: operation + "成功",
          type: "success",
          duration: 2000
        })
      } else if (response.data.code == 1) {
        this.$message.error(response.data.msg)
        return
      } else if (response.data.code == 2) {
        this.clearSelectClear()
        this.handleSearchFilter()
        this.getList(this.page, this.searchFormConfirm)
        if (operationCode == "uploadFile") {
          this.uploadDialog = false
        }
        this.$message.error(response.data.msg)
        return
      } else {
        this.$message.error("操作失败")
        return
      }
    },
    importReset() {
      this.upload.attachmentFileName = ""
      this.upload.file = null
    },
    //导入物流单号
    signFileChange(file, fileList) {
      if (!file.name) {
        this.$message.warning("请选择需要上传的文件!!")
        return
      }
      var arr = file.name.split(".")
      if (arr[arr.length - 1] != "xls" && arr[arr.length - 1] != "xlsx") {
        this.$message.warning("请选EXCEL文件上传!!")
        return
      }
      if (file.size / 1024 / 1024 > 5) {
        this.$message.warning("文件文件限制为5M以内!!")
        return
      }
      this.upload.attachmentFileName = file.name
      this.upload.file = file
    },
    submitUpload() {
      if (!this.upload.file) {
        this.$message.warning("请选择需要上传的文件!!")
        return
      }
      let formdata = new FormData()
      formdata.append("listId", "-1")
      formdata.append("file", this.upload.file.raw)
      // importObj(formdata).then((response) => {
      //   this.handleResponse(response, "uploadFile", "导入")
      //   //加载所有费用类型
      //   // getCostTypeAll().then((response) => {
      //   //   this.costTypeOptions = response.data.data
      //   // })
      // })
    },
    //下载导入物流单号模板
    downloadTemplate() {
      // window.location = getUrlConcatToken(`/api/transfer/tmstransfercost/export/template/import-tmstransfercost-excel`);
      window.location = getTokenUrl("yiyuan/tmsTransfer/导入调拨费用模板.xls")
    },
    //导出
    handleExport() {
      this.handleSearchFilter()
      // let params = {
      //   pageUrl: '/transfercost/costListPage',
      //   columnList: [],
      //   pageName: '调拨费用',
      //   pageReq: {
      //     ...this.page,
      //     filtering: this.searchFormConfirm
      //   }
      // }
      // this.tableOption.column.forEach(item => {
      //   params.columnList.push({
      //     title: item.label,
      //     name: item.prop
      //   })
      // })
      // if (!this.tableData || this.tableData.length == 0) {
      //   this.$message.error('没有可导出数据')
      //   return
      // }
      // this.$notify({
      //   title: "成功",
      //   message: "正在导出（注意：最多可导出6W条数据）",
      //   type: "success",
      //   duration: 2000
      // })
      exportData(
        Object.assign({
          page: -1,
          pageSize: -1,
          filtering: this.searchFormConfirm
        })
      )
        .then((res) => {
          console.log(res.data.data)
          downloadBlob(res.data, "导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //审核
    handleAudit() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请先勾选数据")
        return
      }
      var list = []
      var flag = true
      if (this.selectList && this.selectList.length > 0) {
        //选中数据
        for (let index = 0; index < this.selectList.length; index++) {
          const element = this.selectList[index]
          if (element.costStatus == 2) {
            this.$message.error(element.logisticsNo + "(" + element.costType + ")已审核")
            flag = false
            break
          } else {
            list.push(element.transferCostId)
          }
        }
      }
      if (flag) {
        let _this = this
        this.$confirm("是否确认审核选中单据", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(function () {
            _this.loading = true
            // return auditObj(list)
          })
          .then((response) => {
            this.handleResponse(response, "", "审核")
          })
          .catch((res) => {})
      }
    },
    //查看SKU详情
    showSkuDetail: function (transferNo) {
      getPlatformSkuInfo(transferNo).then((response) => {
        var total = 0
        var boxWeight = 0
        if (response.data.code === 0) {
          let records = response.data.data || []
          records.forEach((item, i) => {
            total = total + item.deliveryBoxs
            boxWeight = boxWeight + item.boxWeight
          })
        }
        this.dialogTitil = "sku信息"
        this.tmstransfer.total = total
        this.tmstransfer.boxWeight = boxWeight.toFixed(5)
        this.tmstransfer.tableData = response.data.data
        this.skuDialog = true
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (column.property === "sourceNo") {
          sums[index] = "总计："
        } else if (column.property === "costMsg") {
          sums[index] = this.aggregateRecord.cost
        } else if (column.property === "actualCostMsg") {
          sums[index] = this.aggregateRecord.actualCost
        }
      })
      return sums
    }
  },
  components: {
    tip,
    logictisCostImport
  }
}
</script>

<style lang="scss" scoped>
::v-deep td:first-child {
  text-align: left !important;
}
::v-deep #estimateStatusDialog {
  .el-row-text {
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
}
.attachmentFileName {
  padding: 10px 0;
}
</style>
