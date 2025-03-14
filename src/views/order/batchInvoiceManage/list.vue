<template>
  <div>
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
        @selection-row="selectionRow"
        :cell-class-name="getCellClass"
        :span-method="spanMethod"
        :rowClassName="rowClassName"
        row-key="batchOrderCode"
        :span-selection="spanSelection"
        @selection-all="selectionAll"
      >
        <template slot="menuLeft">
          <el-tabs v-model="tabParam" @tab-click="changeMenu">
            <el-tab-pane
              v-for="item in orderAllStatus"
              :key="item.key"
              :label="item.statusName"
              :name="item.key"
            ></el-tab-pane>
          </el-tabs>

          <div>
            <el-button type="primary" size="small" @click="examine" v-if="permissions.oms_foorder_manage_distribute">
              下发至第三方仓
            </el-button>
            <!-- <el-button
              type="primary"
              size="small"
              @click="setLabel('')"
              :disabled="!selectRows.length"
              v-if="permissions.oms_order_manage_modify_label"
            >
              修改标签
            </el-button> -->

            <el-dropdown
              split-button
              type="primary"
              size="small"
              v-if="permissions.oms_order_manage_modify_label"
              style="margin-right: 10px"
            >
              修改功能
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :disabled="!selectRows.length" @click.native="setLabel('')"
                  >修改标签</el-dropdown-item
                >
                <el-dropdown-item :disabled="!selectRows.length" @click.native="hancdleChangeMark"
                  >修改备注</el-dropdown-item
                >
                <el-dropdown-item :disabled="!selectRows.length" @click.native="hancdleModifyDelivery"
                  >修改跟踪号</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>

            <el-button type="primary" size="small" @click="invoiceCancel" v-if="permissions.oms_foorder_manage_reverse">
              反审核至订单
            </el-button>
            <el-button type="primary" size="small" @click="toSend" v-if="permissions.oms_foorder_manage_lable_deliver">
              标记已发货
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="cancelAbnormal"
              :disabled="!selectRows.length"
              v-if="permissions.oms_fo_order_clear_abnormal"
            >
              取消异常标识
            </el-button>

            <el-dropdown size="small" style="margin-right: 10px" v-if="permissions.oms_foorder_manage_export">
              <el-button type="primary" size="small"> 导出<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="exportInvoice">导出-箱维度</el-dropdown-item>
                <el-dropdown-item @click.native="exportDetail">导出-SKU维度</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown
              v-if="permissions.oms_fo_batch_invoice_cancel"
              split-button
              type="primary"
              size="small"
              @click="handleCancel('0')"
              style="margin-right: 10px"
            >
              取消
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleCancel('1')">强制取消</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <!-- <el-button type="primary" size="small" @click="handleImportFile"> 上传附件 </el-button> -->

            <el-dropdown split-button type="primary" size="small" style="margin-right: 10px">
              导入
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleImportFile">上传附件</el-dropdown-item>
                <el-dropdown-item @click.native="handleImportTracking">跟踪号导入修改</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              v-if="permissions.oms_fo_batch_confirm_SBOL"
              type="primary"
              size="small"
              @click="handleConfirmSBOL"
            >
              核对SBOL
            </el-button>
            <el-button
              v-if="permissions.batch_invoice_manage_re_generation"
              type="primary"
              size="small"
              @click="handleReGeneration"
            >
              重新生成
            </el-button>
            <el-button type="primary" size="small" @click="handleDownLoadFile"> 下载附件 </el-button>
          </div>
        </template>

        <template slot="search">
          <el-form :model="searchForm" ref="searchFormRef" :inline="true">
            <el-form-item prop="batchOrderCode">
              <el-input
                size="small"
                v-model="searchForm.batchOrderCode"
                placeholder="发货批次单号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="soOrderNo">
              <el-input
                size="small"
                v-model="searchForm.soOrderNo"
                placeholder="订单号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="sourceNo">
              <el-input
                size="small"
                v-model="searchForm.sourceNo"
                placeholder="平台订单号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="platformOrderCode">
              <el-input
                size="small"
                v-model="searchForm.platformOrderCode"
                placeholder="平台订单编码,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="extendCode">
              <el-input
                size="small"
                v-model="searchForm.extendCode"
                placeholder="ARN/排柜号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="wmsCode">
              <el-input
                size="small"
                v-model="searchForm.wmsCode"
                placeholder="三方出库单单号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="trackingNo">
              <el-input
                size="small"
                v-model="searchForm.trackingNo"
                placeholder="跟踪号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="platform">
              <el-select
                v-model="searchForm.platform"
                filterable
                size="small"
                placeholder="平台"
                clearable
                multiple
                collapse-tags
                @change="changePlatform"
              >
                <el-option
                  v-for="item in platform"
                  :key="item.platformTypeCode"
                  :label="item.platformTypeName"
                  :value="item.platformTypeCode"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="platformSites">
              <select-all
                ref="selectAllRef"
                :selectValue.sync="searchForm.platformSites"
                size="small"
                placeholder="站点,支持多个"
                @change="changeSit"
                :options="marketOption"
                keyName="sitName"
                labelName="sitName"
              >
              </select-all>
            </el-form-item>

            <el-form-item prop="shopId">
              <el-select
                v-model="searchForm.shopId"
                filterable
                size="small"
                placeholder="店铺,支持多个"
                clearable
                multiple
              >
                <el-option
                  v-for="item in storeOptions"
                  :key="item.storeId"
                  :label="item.storeAccount"
                  :value="item.storeId"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="deliveryStatus">
              <el-select
                v-model="searchForm.deliveryStatus"
                filterable
                size="small"
                placeholder="发货批次单状态,支持多个"
                clearable
                multiple
                :disabled="isUsed"
                @change="handleCheckStatus"
              >
                <el-option
                  v-for="item in deliveryStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="deliveryStatusIsUsed">
              <el-select
                v-model="searchForm.deliveryStatusIsUsed"
                filterable
                size="small"
                placeholder="是否有效"
                clearable
                @change="handleStatus"
                :disabled="cancelStatus"
              >
                <el-option
                  v-for="item in isUsedArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="orderBusinessType">
              <el-select
                v-model="searchForm.orderBusinessType"
                filterable
                size="small"
                placeholder="交货模式"
                clearable
              >
                <el-option v-for="item in orderModel" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="orderTypes">
              <el-select
                v-model="searchForm.orderTypes"
                filterable
                size="small"
                multiple
                placeholder="订单类型"
                clearable
              >
                <el-option v-for="item in orderType" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="warehouseId">
              <el-select
                v-model="searchForm.warehouseId"
                filterable
                size="small"
                placeholder="发货仓库,支持多个"
                clearable
                multiple
                :filter-method="filterWarehouse"
                @visible-change="visibleWarehouse"
              >
                <el-option v-for="item in warehouse" :key="item.label" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot="searchAdvanced">
          <el-form :model="searchForm" ref="searchAdvancedFormRef" :inline="true">
            <el-form-item>
              <el-select
                size="small"
                v-model="searchForm.warehouseProviderId"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="仓库服务商,支持多选"
              >
                <el-option
                  v-for="item in bseWarehouseProviderOptions"
                  :key="item.value"
                  :label="item.providerName"
                  :value="item.warehouseProviderId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="logisticsChannelName">
              <el-select
                v-model="searchForm.logisticsChannelName"
                filterable
                size="small"
                placeholder="物流渠道"
                clearable
              >
                <el-option v-for="item in channelOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="abnormalType">
              <el-select
                v-model="searchForm.abnormalType"
                filterable
                size="small"
                placeholder="异常类型"
                clearable
                multiple
              >
                <el-option v-for="item in abnormalType" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="deliveryMethod">
              <el-select v-model="searchForm.deliveryMethod" filterable size="small" placeholder="发货方式" clearable>
                <el-option
                  v-for="item in deliveryMethodOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="exclude-label" prop="labelIdList">
              <el-select
                :key="searchForm.labelIdList?.length"
                ref="labelSelect"
                v-model="searchForm.labelIdList"
                @visible-change="handleExpend"
                size="small"
                placeholder="全部标签"
                clearable
                multiple
                filterable
                @clear="handleClear"
              >
                <el-option v-for="item in labels" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
            <avue-crud-search-item
              ref="searchCrudItemRef"
              :searchFields="searchFields"
              @updateField="updateField"
            ></avue-crud-search-item>
          </el-form>
        </template>

        <template slot="batchOrderCode" slot-scope="scope">
          <copy-text hoverToShow>
            <a @click="goOrderDetail(scope.row)">{{ scope.row.batchOrderCode }}</a>
          </copy-text>
        </template>

        <template slot="soOrderNo" slot-scope="scope">
          <copy-text hoverToShow>
            <span> {{ scope.row.soOrderNo }} </span>
          </copy-text>
          <el-tag v-if="scope.row.deliveryName" type="primary" size="mini" style="margin-right: 5px">{{
            scope.row.deliveryName
          }}</el-tag>
          <el-tag v-if="scope.row.orderBusinessType" type="primary" size="mini" style="margin-right: 5px">{{
            scope.row.orderBusinessType
          }}</el-tag>
          <el-tag type="danger" size="mini" v-if="scope.row.freezeStatus === 'FROZEN'">冻结</el-tag>
        </template>

        <template slot="spliceProducts" slot-scope="scope">
          <div v-for="(item, index) in scope.row.spliceProducts" :key="index">
            <span>{{ item.sku ? item.sku : "暂无SKU" }}</span>
            <span style="color: #1380e6">*{{ item.quantity }}</span>
            &nbsp;
            <span>{{ item.name }}</span>
          </div>
          <div style="text-align: center; font-size: 12px" v-if="scope.row.isMoreProducts">
            <a @click="goOrderDetail(scope.row)" style="font-weight: bold; color: black; letter-spacing: 2px">......</a>
          </div>
        </template>

        <template slot="asin" slot-scope="scope">
          <div v-for="(item, index) in scope.row.spliceProducts" :key="index">
            <span>{{ item.asin ? item.asin : "暂无SKU" }}</span>
            <span style="color: #1380e6">*{{ item.quantity }}</span>
          </div>
          <div style="text-align: center; font-size: 12px" v-if="scope.row.isMoreProducts">
            <a @click="goOrderDetail(scope.row)" style="font-weight: bold; color: black; letter-spacing: 2px">......</a>
          </div>
        </template>

        <template slot="interfaceSendFlag" slot-scope="scope">
          <span>{{ interfaceSendStatusObj[scope.row.interfaceSendFlag] }}</span>
          <el-popover
            placement="top-start"
            title="失败原因"
            width="200"
            trigger="hover"
            :content="scope.row.interfaceErrorDescription"
          >
            <div slot="reference">
              <span v-if="scope.row.interfaceErrorDescription && scope.row.interfaceSendFlag === 'F'">{{
                "/" + scope.row.spliceError
              }}</span>
            </div>
          </el-popover>
        </template>

        <template slot="remark" slot-scope="scope">
          <el-popover placement="top-start" width="200" trigger="hover">
            <copy-text hoverToShow slot="reference">
              {{ scope.row.remark }}
            </copy-text>

            <div>{{ scope.row.remark }}</div>
          </el-popover>
        </template>

        <template slot="createUserName" slot-scope="scope">
          <span>{{ scope.row.createUserName }}</span>
          <br />
          <span>{{ scope.row.createTime }}</span>
        </template>

        <template slot="updateUserName" slot-scope="scope">
          <span>{{ scope.row.updateUserName }}</span>
          <br />
          <span>{{ scope.row.updateTime }}</span>
        </template>

        <template slot="trackingNo" slot-scope="scope">
          <copy-text hoverToShow>
            <a @click="handleTrackingNo(scope.row)">{{ scope.row.trackingNo }}</a>
          </copy-text>
        </template>

        <template slot="wmsStatus" slot-scope="scope">
          <span>{{ scope.row.wmsStatus }}</span>
          <br v-if="scope.row.wmsStatus" />
          <span>{{ scope.row.shippingTime }}</span>
        </template>

        <template slot="labels" slot-scope="scope">
          <div v-if="scope.row.labels && scope.row.labels.length <= 3">
            <el-tag
              style="margin: 0 10px 5px 0"
              :type="item.labelColor"
              v-for="item in scope.row.labels"
              :key="item.id"
              >{{ item.name }}</el-tag
            >
          </div>
          <div v-else-if="scope.row.labels && scope.row.labels.length > 3">
            <el-popover placement="right" width="200" trigger="hover">
              <el-tag
                style="margin: 0 10px 5px 0"
                :type="item.labelColor"
                v-for="item in scope.row.labels"
                :key="item.id"
                >{{ item.name }}</el-tag
              >
              <div slot="reference">
                <el-tag
                  style="margin: 0 10px 5px 0"
                  :type="item.labelColor"
                  v-for="item in scope.row.labels.slice(0, 3)"
                  :key="item.id"
                  >{{ item.name }}</el-tag
                >
              </div>
            </el-popover>
          </div>
        </template>

        <template slot-scope="scope" slot="operation">
          <avue-crud-ctrl :list="getCtrlList(scope.row)"></avue-crud-ctrl>
        </template>
      </avue-crud>
    </basic-container>

    <!-- 查看面单 -->
    <imgDialog ref="imgDialogRef"></imgDialog>
    <!-- 物流轨迹 -->
    <logisticsTrackingDialog ref="logisticsTrackingDialogRef" @updateList="updateList"></logisticsTrackingDialog>
    <!-- 标记已发货 -->
    <markShippedStatusDialog ref="markShippedStatusDialogRef" @sendConfirm="sendConfirm"></markShippedStatusDialog>
    <!-- 标记发货提示 -->
    <markShippedDialog ref="markShippedDialogRef" @updateList="updateList"></markShippedDialog>
    <!-- 搜索标签 -->
    <searchLabelDialog ref="searchLabelDialogRef" @searchLabel="searchLabel"></searchLabelDialog>
    <!-- 标签设置 -->
    <setLabelDialog ref="setLabelDialogRef" @updateList="updateList"></setLabelDialog>
    <!-- 上传面单 -->
    <uploadDeliveryNoteDialog ref="uploadDeliveryNoteDialogRef" @updateList="updateList"></uploadDeliveryNoteDialog>
    <!-- 反审核至订单 -->
    <reverseReviewToOrderDialog
      ref="reverseReviewToOrderDialogRef"
      @updateList="updateList"
    ></reverseReviewToOrderDialog>
    <!-- 下发至第三方仓 -->
    <sendToThirdPartyWarehouseDialog
      ref="sendToThirdPartyWarehouseDialogRef"
      @sendToThirdPartyWarehouse="sendToThirdPartyWarehouse"
    ></sendToThirdPartyWarehouseDialog>
    <!-- 下发至第三方仓结果 -->
    <sendToThirdPartyWarehouseResDialog
      ref="sendToThirdPartyWarehouseResDialogRef"
      @updateList="updateList"
    ></sendToThirdPartyWarehouseResDialog>
    <!-- 查看附件 -->
    <viewAttachmentDialog ref="viewAttachmentDialogRef"></viewAttachmentDialog>
    <!-- 补充ARN -->
    <supplementArnDialog ref="supplementArnDialogRef" @updateList="updateList"></supplementArnDialog>
    <!-- 重新生成 -->
    <reGenerationDialog ref="reGenerationDialogRef" @updateList="updateList"></reGenerationDialog>
    <!-- 取消shipment -->
    <cancelShipmentDialog ref="cancelShipmentDialogRef" @updateList="updateList"></cancelShipmentDialog>
    <!-- 上传附件 -->
    <batchUploadFile ref="batchUploadFileRef" @updateList="updateList"></batchUploadFile>
    <!-- 对比附件 -->
    <compareFileDialog ref="compareFileDialogRef" @updateList="updateList"></compareFileDialog>

    <modifyTrackingNo ref="modifyTrackingNoRef" @success="updateList"></modifyTrackingNo>
    <changeMark ref="changeMarkNoRef" @success="updateList"></changeMark>
    <!-- <importTrackingNo ref="importTrackingNoRef" @success="updateList"></importTrackingNo> -->

    <commonImport
      ref="importTrackingNoRef"
      :excelStatus="false"
      :excelDangerStatus="excelDangerStatus"
      @import="importExcelBtn"
      @export="exportDangerExcel"
      :customDownload="customDownload"
    >
      <template slot="importTip">
        <div v-if="successCount + errorCount > 0">
          总条数<span style="font-size: 16px"> {{ successCount + errorCount }} </span> 条，成功导入<span
            style="color: #67c23a; font-size: 16px"
          >
            {{ successCount }}
          </span>
          条，失败
          <span style="color: #f56c6c; font-size: 16px">
            {{ errorCount }}
          </span>
          条
        </div>
      </template>
    </commonImport>
  </div>
</template>

<script>
import { tableOption } from "./list"
import { getAllChannel, previewImgAndPdf, logisticsTracking } from "@/api/order/invoiceManage"
import {
  getListPageV2Api,
  getListPageApi,
  cancelAbnormalApi,
  getStatusCountApi,
  exportBatchOrderApi,
  getPlatformFaceSheetsApi
} from "@/api/order/batchInvoiceManage"
import { getPlayTypeAll, getStore, getObjByType, getSit, getStoreBySitIds } from "@/api/order/orderManage"
import { getSitInfo } from "@/api/baseSetup/bseplatformsit"
import { getListPage } from "@/api/order/labelManage"
import { getAllWarehouse } from "@/api/order/orderRule"
import { downloadBlob, setFiltering, getDictByType } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"
import logisticsTrackingDialog from "./components/logisticsTrackingDialog.vue"
import markShippedDialog from "./components/markShippedDialog.vue"
import imgDialog from "./components/imgDialog.vue"
import searchLabelDialog from "./components/searchLabelDialog.vue"
import setLabelDialog from "./components/setLabelDialog.vue"
import uploadDeliveryNoteDialog from "./components/uploadDeliveryNoteDialog.vue"
import reverseReviewToOrderDialog from "./components/reverseReviewToOrderDialog.vue"
import markShippedStatusDialog from "./components/markShippedStatusDialog.vue"
import sendToThirdPartyWarehouseDialog from "./components/sendToThirdPartyWarehouseDialog.vue"
import sendToThirdPartyWarehouseResDialog from "./components/sendToThirdPartyWarehouseResDialog.vue"
import viewAttachmentDialog from "./components/viewAttachmentDialog.vue"
import supplementArnDialog from "./components/supplementArnDialog"
import reGenerationDialog from "./components/reGenerationDialog"
import { deepClone } from "@/util/util"
import cancelShipmentDialog from "./components/cancelShipmentDialog.vue"
import batchUploadFile from "./components/batchUploadFile.vue"
import compareFileDialog from "./components/compareFileDialog.vue"
import modifyTrackingNo from "./components/modifyTrackingNo.vue"
import changeMark from "./components/changeMark.vue"
import importTrackingNo from "./components/importTrackingNo.vue"
import { exportDataComApi } from "@/api/common/index"
import { getAll as getBseWarehouseProvider } from "@/api/baseSetup/bsewarehouseprovider"
import commonImport from "@/views/cockpit/commonImport.vue"
import { downloadTemplate, uploadFileBatchApi, uploadOmsFoBatchTruckingNumber } from "@/api/order/batchInvoiceManage.js"
import { exportErrorDataApi } from "@/api/common/index.js"
export default {
  name: "batchInvoiceManageList",
  components: {
    imgDialog,
    logisticsTrackingDialog,
    markShippedDialog,
    searchLabelDialog,
    setLabelDialog,
    uploadDeliveryNoteDialog,
    reverseReviewToOrderDialog,
    markShippedStatusDialog,
    sendToThirdPartyWarehouseDialog,
    sendToThirdPartyWarehouseResDialog,
    viewAttachmentDialog,
    supplementArnDialog,
    reGenerationDialog,
    cancelShipmentDialog,
    batchUploadFile,
    compareFileDialog,
    modifyTrackingNo,
    changeMark,
    importTrackingNo,
    commonImport
  },

  data() {
    return {
      searchForm: {
        batchOrderCode: undefined,
        soOrderNo: "",
        sourceNo: "",
        platformOrderCode: "",
        extendCode: "",
        wmsCode: "",
        trackingNo: "",
        platform: [],
        platformSites: [],
        shopId: [],
        orderBusinessType: "",
        orderTypes: "",
        warehouseId: "",
        logisticsChannelName: "",
        abnormalType: "",
        deliveryMethod: "",
        labelIdList: [],
        hasLabelIdList: [],
        noLabelIdList: [],
        hasLabelIdFlag: "",
        deliveryStatus: "",
        deliveryStatusIsUsed: "EFFICIENT",
        abnormalOrderFlag: undefined,
        warehouseProviderId: []
      },
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableOption: tableOption,
      selectRows: [],
      orderAllStatus: [
        { statusName: "全部", key: "TOTAL", countKey: "total" },
        { statusName: "创建", key: "CREATE", countKey: "create" },
        { statusName: "待下发", key: "UN_SEND", countKey: "unSend" },
        { statusName: "待发货", key: "UN_DELIVERY", countKey: "unDelivery" },
        { statusName: "已发货", key: "ALREADY_DELIVERY", countKey: "alreadyDelivery" },
        // { statusName: "已签收", key: "ALREADY_SIGN", countKey: "alreadySign" },
        // { statusName: "已取消", key: "CANCELED", countKey: "canceled" },
        { statusName: "异常", key: "PENDING_EXCEPTION", countKey: "pendingException" }
      ],
      deliveryMethodOptions: [
        { label: "平台仓发货", value: "PLATFORM" },
        { label: "海外仓发货", value: "WAREHOUSE" },
        { label: "中转仓发货", value: "TRANSIT" }
      ],
      platform: [],
      orderType: [],
      orderStatus: [],
      warehouse: [],
      warehouseInitOptions: [],
      deliveryStatusOptions: [],
      searchFields: [
        { label: "SKU", value: "skuCode", type: "input", default: true },
        { label: "平台SKU", value: "asin", type: "input" },
        { label: "发货单创建时间", value: "createTime", type: "datetimerange" },
        { label: "下发三方仓时间", value: "interfaceTransactionTime", type: "datetimerange" },
        { label: "ERP发货时间", value: "erpShippingTime", type: "datetimerange" },
        { label: "仓库发货时间", value: "shippingTime", type: "datetimerange" },
        { label: "要求发货时间", value: "requiredShipDate", type: "datetimerange" }
      ],
      interfaceSendStatus: [],
      abnormalType: [],
      marketOption: [],
      storeOptions: [],
      orderModel: [],
      channelOption: [],
      pdfData: "",
      imageData: "",
      labelSearchInfo: "",
      labelsArr: [],
      sysLabelsArr: [],
      customizeLabelsArr: [],
      isUsedArr: [
        { value: "ABROGATE", label: "作废" },
        { value: "EFFICIENT", label: "有效" }
      ],
      cancelStatus: false,
      isUsed: false,
      labels: [],
      tabParam: "TOTAL",
      otherParams: [
        "skuCode",
        "asin",
        "deliveryMethod",
        "soOrderNo",
        "sourceNo",
        "labelIdList",
        "hasLabelIdList",
        "noLabelIdList",
        "platformSites",
        "platformOrderCode",
        "orderTypes",
        "deliveryStatusIsUsed"
      ],
      cancelSelect: [], // 取消选中的数据
      excelDangerStatus: false, // 是否可下载错误文件
      errorData: [], // 错误数据
      successCount: 0, // 成功导入条数
      errorCount: 0, // 失败条数
      importTrackingNoData: []
    }
  },
  computed: {
    ...mapGetters(["permissions"]),
    interfaceSendStatusObj() {
      const result = {}
      this.interfaceSendStatus.forEach((item) => {
        const key = item.value
        result[key] = item.label
      })
      return result
    }
  },
  watch: {},
  async created() {
    await this.init()
    this.getList()
  },
  mounted: function () {},

  methods: {
    async handleTrackingNo(row) {
      const { orderCode } = row
      const { data } = await logisticsTracking(orderCode)
      if (!data.data || data.data.length == 0) {
        this.$message.warning("无物流轨迹数据")
        return
      }
      if (data.data.length) {
        this.$refs.logisticsTrackingDialogRef.openDialog(data.data)
      }
    },
    handleStatus(val) {
      if (val === "ABROGATE") {
        this.isUsed = true
      } else {
        this.isUsed = false
      }
    },
    handleCheckStatus(val) {
      if (val.length != 0) {
        this.cancelStatus = true
        this.searchForm.deliveryStatusIsUsed = ""
      }
      if (val.length == 0) {
        this.cancelStatus = false
        this.searchForm.deliveryStatusIsUsed = "EFFICIENT"
      }
    },
    // 标签设置
    async setLabel(row) {
      this.$refs.setLabelDialogRef.openDialog(this.selectRows, row)
    },
    // 标签筛选
    handleClear() {
      this.$refs.searchLabelDialogRef.clearLabel()
      this.searchForm.labelIdList = []
      this.searchForm.hasLabelIdList = []
      this.searchForm.noLabelIdList = []
    },

    searchLabel({ checkedLabel, searchForm }) {
      // this.searchForm.hasLabelIdFlag = searchForm.hasLabelIdFlag
      Object.assign(this.searchForm, {
        labelIdList: [...checkedLabel],
        hasLabelIdList: searchForm.hasLabelIdFlag ? [...checkedLabel] : [],
        noLabelIdList: searchForm.hasLabelIdFlag ? [] : [...checkedLabel]
      })
    },

    handleExpend(isVisible) {
      if (isVisible) {
        this.$refs.labelSelect.blur()
        this.labelSearchInfo = ""
        if (this.sysLabelsArr.length == 0 && this.customizeLabelsArr.length == 0) {
          getListPage({ page: -1, pageSize: -1, name: this.labelSearchInfo }).then((res) => {
            if (res.data.code === 0) {
              this.sysLabelsArr = res.data.data.records.filter((item) => item.labelType === "SYS")
              this.customizeLabelsArr = res.data.data.records.filter((item) => item.labelType === "CUSTOMIZE")
            }
          })
        }

        this.$refs.searchLabelDialogRef.openDialog(
          this.sysLabelsArr,
          this.customizeLabelsArr,
          this.labelsArr,
          this.searchForm.labelIdList,
          this.searchForm.hasLabelIdFlag
        )
      }
    },

    cancelAbnormal() {
      const params = this.selectRows.map((item) => item.batchOrderCode)
      cancelAbnormalApi(params).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("取消异常标识成功")
          this.clearSelectClear()
          this.refreshChange()
        }
      })
    },
    //查看面单弹窗
    showFacesheet(row) {
      if (!row.faceSheet) {
        this.$message.warning("该订单暂无面单！")
        return
      }
      previewImgAndPdf({ fileId: row.faceSheet }).then((res) => {
        if (res.data.type === "application/pdf") {
          const blob = new Blob([res.data], { type: "application/pdf" })
          this.pdfData = URL.createObjectURL(blob)
          window.open(this.pdfData)
        } else {
          const href = window.URL.createObjectURL(res.data)
          this.imageData = href
          this.$refs.imgDialogRef.showImgUrl(href)
        }
      })
    },
    //上传面单
    uploadFacesheet(row) {
      this.$refs.uploadDeliveryNoteDialogRef.openDialog(row)
    },
    async init() {
      this.deliveryStatusOptions = await getDictByType("order_batch_invoice")

      getBseWarehouseProvider().then((response) => {
        this.bseWarehouseProviderOptions = response.data.data
      })

      getPlayTypeAll().then((res) => {
        if (res.data.code == 0) {
          this.platform = this.sortArray(res.data.data, "platformTypeName")
        }
      })
      getObjByType("fulfillment_status").then((res) => {
        if (res.data.code === 0) {
          this.orderStatus = res.data.data
        }
      })

      getObjByType("interface_send_flag").then((res) => {
        if (res.data.code === 0) {
          this.interfaceSendStatus = res.data.data
        }
      })

      getObjByType("order_business_type").then((res) => {
        if (res.data.code === 0) {
          this.orderModel = res.data.data
        }
      })

      getObjByType("order_type").then((res) => {
        if (res.data.code === 0) {
          this.orderType = res.data.data
        }
      })

      getObjByType("fo_order_abnormal_type").then((res) => {
        if (res.data.code === 0) {
          this.abnormalType = res.data.data
        }
      })

      getAllWarehouse().then((res) => {
        if (res.data.code === 0) {
          res.data.data.forEach((item) => {
            this.warehouse.push({
              ...item,
              value: item.warehouseId,
              label: item.warehouseName
            })
          })
          this.warehouseInitOptions = deepClone(this.warehouse)
        }
      })

      getAllChannel().then((res) => {
        if (res.data.code === 0) {
          res.data.data.forEach((item) => {
            this.channelOption.push({
              value: item.bseChannelCode,
              label: item.bseChannelName
            })
          })
        }
      })
      getListPage({ page: -1, pageSize: -1 }).then((res) => {
        if (res.data.code === 0) {
          this.labels = res.data.data.records
          this.labelsArr = res.data.data.records
          this.sysLabelsArr = res.data.data.records.filter((item) => item.labelType === "SYS" && item.id != 37)
          this.customizeLabelsArr = res.data.data.records.filter((item) => item.labelType === "CUSTOMIZE")
        }
      })

      this.getStoreList()
      this.getSitAll()
    },

    // async getStatusCount(params) {
    //   const { data } = await getStatusCountApi(params)
    //   if (data.code === 0) {
    //     this.orderAllStatus.forEach((item) => {
    //       if (item.countKey !== "total") {
    //         item.statusName = item.statusName.replace(/(.*?)(\(\d*\))?$/, `$1(${data.data[item.countKey]})`)
    //       }
    //     })
    //   }
    // },

    //选中平台操作获取该平台下的站点
    changePlatform(val) {
      this.searchForm.platformSites = []
      this.searchForm.shopId = []
      if (val && val.length) {
        if (!this.searchForm.platform?.length) return
        this.getPlatformSit(this.searchForm.platform)
        // 根据平台获取店铺
        this.getStoreList(this.searchForm.platform)
      }
    },
    // 站点下拉回调
    changeSit(val) {
      this.searchForm.shopId = []
      if (val && val.length) {
        if (!this.searchForm.platformSites?.length) return
        this.getStoreBySit(this.searchForm.platformSites)
      }
    },
    //根据平台查询站点
    getPlatformSit(param) {
      getSit(param).then((res) => {
        this.marketOption = this.sortArray(res.data, "sitName")
      })
    },

    goOrderDetail(row) {
      this.$router.push({
        path: "/order/batchInvoiceManage/detail",
        query: { id: row.id, batchOrderCode: row.batchOrderCode }
      })
    },

    invoiceCancel() {
      if (!this.selectRows || this.selectRows.length === 0) {
        this.$message.error("请勾选数据")
        return
      }

      const typeAndFlags = this.selectRows.map((item) => ({
        orderBusinessType: item.orderBusinessType,
        interfaceSendFlag: item.interfaceSendFlag
      }))

      // 针对PO订单：
      // 有下发海外仓出库单的发货批次单，不允许操作【反审核至订单】
      for (const item of typeAndFlags) {
        if (item.orderBusinessType === "PO") {
          // if (item.interfaceSendFlag === "Y") {
          //   this.$message.error(`针对PO订单: 有下发海外仓出库单的发货批次单，不允许操作【反审核至订单】`)
          //   return
          // }
        } else {
          const invoiceStatus = this.selectRows.map((item) => item.deliveryStatus)
          const orderStatus = ["UN_SEND", "UN_DELIVERY", "VIRTUAL_SHIPPED"]
          for (const item of invoiceStatus) {
            if (!orderStatus.includes(item)) {
              this.$message.error("只有待下发/待发货/虚假发货成功状态的订单才可以反审核！")
              return
            }
          }
        }
      }

      this.$refs.reverseReviewToOrderDialogRef.openDialog(this.selectRows)
    },
    exportInvoice() {
      const obj = deepCloneIgnoreNull(this.searchForm)
      const batchOrderCode = this.selectRows.map((item) => item.batchOrderCode)
      const searchFormBatchOrderCode = obj?.batchOrderCode?.split(",") || []
      obj.batchOrderCode = [...new Set([...searchFormBatchOrderCode, ...batchOrderCode])].join(",")

      exportBatchOrderApi({
        filtering: this.handleSearchParams(this.otherParams, obj),
        ...this.filterSearchParams()
      }).then((res) => {
        downloadBlob(res.data, "导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
      })
    },
    // 标记已发货
    async toSend() {
      if (!this.selectRows || this.selectRows.length === 0) {
        this.$message.error("请勾选数据")
        return
      }
      let typeEqual = this.selectRows.every((obj) => obj.orderBusinessType === this.selectRows[0].orderBusinessType)
      if (!typeEqual) {
        this.$message.warning("交货模式相同，才能批量标记已发货！")
        return
      }
      let orderStatus = this.selectRows.map((item) => item.deliveryStatus)
      const status = orderStatus.includes("ABROGATE")
      if (status) {
        this.$message.error("不允许操作")
        return
      }
      let ids = this.selectRows.map((item) => item.id)
      this.$refs.markShippedStatusDialogRef.openDialog(ids, this.selectRows[0].orderBusinessType)
    },
    // 标记已发货队列
    sendConfirm(sendTableData) {
      this.$refs.markShippedDialogRef.openDialog(sendTableData)
    },
    // 下发第三方仓提示
    examine() {
      if (!this.selectRows || this.selectRows.length === 0) {
        this.$message.error("请勾选数据")
        return
      }
      this.$refs.sendToThirdPartyWarehouseDialogRef.openDialog(this.selectRows)
    },
    // 下发第三方仓结果
    sendToThirdPartyWarehouse() {
      this.$refs.sendToThirdPartyWarehouseResDialogRef.openDialog(this.selectRows)
    },
    getCellClass({ row }) {
      if (row.abnormalType && row.abnormalType !== "NON") {
        return "isAbnormalFlag"
      }
      if (row.freezeStatus === "FROZEN") {
        return "isFreezeFlag"
      }
    },
    hancdleChangeMark() {
      this.$refs.changeMarkNoRef.openDialog(this.selectRows)
    },
    hancdleModifyDelivery() {
      console.log("修改跟踪号====")
      this.$refs.modifyTrackingNoRef.openDialog(this.selectRows)
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList()
    },
    /**
     * 搜索回调
     */
    searchChange() {
      this.page.currentPage = 1
      this.getList()
    },
    searchReset() {
      this.$refs.searchFormRef.resetFields()
      this.$refs.searchAdvancedFormRef?.resetFields()
      this.$refs.searchCrudItemRef.resetField()

      if (this.tabParam === "PENDING_EXCEPTION") {
        this.searchForm.abnormalOrderFlag = "Y"
      } else {
        this.searchForm.abnormalOrderFlag = undefined
      }
      if (!["TOTAL", "PENDING_EXCEPTION"].includes(this.tabParam)) {
        this.searchForm.deliveryStatus = [this.tabParam]
      } else {
        this.searchForm.deliveryStatus = undefined
      }
      this.searchForm.hasLabelIdList = []
      this.searchForm.noLabelIdList = []
      this.cancelStatus = false
      this.isUsed = false
      this.getStoreList()
      this.getSitAll()
      this.$refs.selectAllRef.resetSelectAll()
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    },
    // 单选行事件
    selectionRow(selection, row) {
      // 判断是否选中
      const isSelect = selection.length && selection.indexOf(row) !== -1
      if (!isSelect) {
        // 取消选中
        this.cancelSelect.push(row)
      } else {
        // 选中后 过滤选中的数据
        this.cancelSelect = this.cancelSelect.filter((item) => item.batchOrderCode !== row.batchOrderCode)
      }
    },
    // 全选事件
    selectionAll(selection) {
      // 清空cancelSelect
      this.cancelSelect = []
      // 合并行后，表格的全选的数据需要特殊处理
      this.selectRows = this.spanSelection(selection)
      // 更新tableSelect
      this.$refs.crud.updateTableSelect(this.selectRows)
    },
    // 合并行后，表格的全选的数据需要特殊处理
    spanSelection(list) {
      // 根据 shipmentId  从 list 中移除取消选中的数据
      list = list.filter(
        (item) => !this.cancelSelect.some((cancelItem) => cancelItem.batchOrderCode === item.batchOrderCode)
      )

      // 按 batchOrderCode 分组
      const groups = list.reduce((acc, item) => {
        if (!acc[item.batchOrderCode]) {
          acc[item.batchOrderCode] = []
        }
        acc[item.batchOrderCode].push(item)
        return acc
      }, {})

      // 处理每个分组
      const result = Object.values(groups).map((group) => {
        // 找到父元素(_row > 0)
        const parent = group.find((item) => item._row > 0)
        // 如果没有找到父元素，使用第一个元素作为父元素
        const baseItem = parent || group[0]

        // 创建新的对象，避免修改原对象
        const processedItem = { ...baseItem }

        // 重置 orderInfos 数组
        processedItem.orderInfos = group.map((item) => ({
          soOrderNo: item.soOrderNo,
          sourceNo: item.sourceNo,
          platformOrderCode: item.platformOrderCode
        }))

        return processedItem
      })
      return result
    },
    clearSelectClear() {
      this.$refs.crud.selectClear()
    },

    // 处理搜索参数
    handleSearchParams(otherParams, searchForm) {
      const filteredSearchForm = Object.keys(searchForm).reduce((acc, key) => {
        if (!otherParams.includes(key)) {
          acc[key] = searchForm[key]
        }
        return acc
      }, {})

      const operatorParams = {
        createTime: "BETWEEN",
        interfaceTransactionTime: "BETWEEN",
        erpShippingTime: "BETWEEN",
        shippingTime: "BETWEEN",
        requiredShipDate: "BETWEEN",
        abnormalOrderFlag: "EQUAL"
      }

      return setFiltering(filteredSearchForm, operatorParams)
    },

    // 过滤筛选参数
    filterSearchParams() {
      this.searchForm = deepCloneIgnoreNull(this.searchForm)

      const searchParams = Object.keys(this.searchForm).reduce((acc, key) => {
        if (this.otherParams.includes(key)) {
          acc[key] = this.searchForm[key]
        }
        return acc
      }, {})

      return searchParams
    },

    async getList() {
      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        filtering: this.handleSearchParams(this.otherParams, this.searchForm),
        ...this.filterSearchParams()
      }

      // 清空表格数据
      this.tableData = []

      const { data } = await getListPageV2Api(params)
      if (data.code === 0) {
        const processProducts = (item) => {
          const isMoreProducts = item.productVOS?.length > 3
          return {
            spliceProducts: isMoreProducts ? item.productVOS.slice(0, 3) : item.productVOS,
            isMoreProducts
          }
        }

        const truncateErrorDescription = (description) => {
          if (!description) return ""
          return description?.length > 10 ? description?.substring(0, 10) : description
        }

        const processedData = data.data.records.map((item) => {
          return {
            ...item,
            ...processProducts(item),
            spliceError: truncateErrorDescription(item.interfaceErrorDescription),
            platformSlotText: `${item.platform} / ${item.market}`,
            abnormalTypeSlotText: this.abnormalType.find((d) => d.value === item.abnormalType)?.label,
            deliveryStatusSlotText:
              item.deliveryStatus === "ABROGATE"
                ? "作废"
                : this.deliveryStatusOptions.find((d) => d.value === item.deliveryStatus)?.label
          }
        })

        const customAggregateRecord = Object.keys(data.data.customAggregateRecord).reduce((acc, key) => {
          acc[key.toUpperCase()] = data.data.customAggregateRecord[key]
          return acc
        }, {})

        this.orderAllStatus.forEach((item) => {
          // 已签收、已取消逻辑还没有，所以默认都为0
          if (item.key === "CANCELED" || item.key === "ALREADY_SIGN") {
            item.statusName = item.statusName.replace(/(.*?)(\(\d*\))?$/, `$1(0)`)
          } else {
            item.statusName = item.statusName.replace(/(.*?)(\(\d*\))?$/, `$1(${customAggregateRecord[item.key]})`)
          }
        })

        this.tableData = this.setTableData(processedData)

        this.page.total = data.data?.total || 0
      }

      this.imageData = ""
      this.pdfData = ""
    },

    // 处理表格数据
    setTableData(data) {
      let arr = []
      let currentBatchCode = null
      let isStripe = false // 用于标记是否为斑马纹行

      data?.forEach((item) => {
        // 当遇到新的批次单号时，切换斑马纹标记
        if (currentBatchCode !== item.batchOrderCode) {
          currentBatchCode = item.batchOrderCode
          isStripe = !isStripe
        }
        const rowCount = item.orderInfos.length
        item.orderInfos.forEach((orderInfo, orderIndex) => {
          arr.push({
            ...item,
            ...orderInfo,
            classStripe: isStripe, // 添加斑马纹标记
            _row: orderIndex === 0 ? rowCount : 0, // 需要合并的行数，0代表不展示
            _col: orderIndex === 0 ? 1 : 0 // 需要合并的列数, 0代表不展示
          })
        })
      })
      return arr
    },

    // 合并行
    spanMethod({ row, column, rowIndex, columnIndex }) {
      const excludeColumns = ["soOrderNo", "sourceNo", "platformOrderCode"]
      if (!excludeColumns.includes(column.property)) {
        return {
          rowspan: row._row,
          colspan: row._col
        }
      }
    },
    changeMenu() {
      this.searchForm.abnormalOrderFlag = this.tabParam === "PENDING_EXCEPTION" ? "Y" : undefined
      if (!["TOTAL", "PENDING_EXCEPTION"].includes(this.tabParam)) {
        this.searchForm.deliveryStatus = [this.tabParam]
        this.cancelStatus = true
        this.isUsed = false
        this.searchForm.deliveryStatusIsUsed = ""
      } else {
        this.searchForm.deliveryStatus = undefined
        this.cancelStatus = false
        this.searchForm.deliveryStatusIsUsed = "EFFICIENT"
      }
      this.getList()
    },
    // 获取所有站点
    async getSitAll() {
      const { data } = await getSitInfo()
      if (data.code === 0) {
        this.marketOption = this.sortArray(data.data, "sitName")
      }
    },
    // 获取店铺
    async getStoreList(platformCode = []) {
      const { data } = await getStore(platformCode)
      this.storeOptions = this.sortArray(
        data.filter((item) => item.state === "0"),
        "storeAccount"
      )
    },
    // 根据站点获取店铺
    async getStoreBySit(marketId) {
      let ids = []
      marketId.forEach((item) => {
        ids.push(this.marketOption.find((s) => s.sitName === item).bsePlatformSitId)
      })
      const { data } = await getStoreBySitIds(ids)
      if (data.code === 0) {
        this.storeOptions = this.sortArray(data.data, "storeAccount")
      }
    },
    // 排序
    sortArray(arr, field) {
      return arr.sort((a, b) => {
        const nameA = a[field].toUpperCase() // 忽略大小写
        const nameB = b[field].toUpperCase() // 忽略大小写
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
    },
    updateList() {
      this.clearSelectClear()
      this.getList()
    },
    getCtrlList(row) {
      return [
        {
          title: "查看面单",
          item: row,
          clickFn: (row) => {
            this.showFacesheet(row)
          },
          show: true
        },
        {
          title: "上传面单",
          item: row,
          clickFn: (row) => {
            this.uploadFacesheet(row)
          },
          show: true
        },
        {
          title: "查看附件",
          item: row,
          clickFn: (row) => {
            this.viewAttachment(row)
          },
          show: true
        },
        // {
        //   title: "重新生成",
        //   item: row,
        //   clickFn: (row) => {
        //     this.$refs.reGenerationDialogRef.openDialog(row)
        //   },
        //   show: this.permissions.batch_invoice_manage_re_generation
        // },
        {
          title: "填写ARN/排柜号",
          item: row,
          clickFn: (row) => {
            this.$refs.supplementArnDialogRef.openDialog(row)
          },
          show: this.permissions.batch_invoice_manage_write_arn
        },
        {
          title: "获取平台附件",
          item: row,
          clickFn: async (row) => {
            const { batchOrderCode, extendCode, shopId, labels } = row
            if (labels) {
              for (let item of labels) {
                if (item.name === "面单获取中") {
                  this.$message.warning("附件正在获取中...，请勿重复操作")
                  return
                }
              }
            }

            const { data } = await getPlatformFaceSheetsApi({ batchOrderCode, platformFoOrder: extendCode, shopId })
            if (data.code === 0) {
              console.log(data.data)
              this.$message.success("获取平台附件中....")
              this.getList()
            }
          },
          show: this.permissions.batch_invoice_manage_platform_attachment
        }
      ]
    },
    updateField(obj) {
      let timeObj = {}

      Object.assign(this.searchForm, obj, timeObj)
    },

    // 行的 className 的回调方法
    rowClassName({ row }) {
      // 斑马纹
      if (row.classStripe) {
        return "stripe-row"
      }
    },
    // 查看附件
    viewAttachment(row) {
      const params = {
        filtering: this.handleSearchParams(this.otherParams, { batchOrderCode: row.batchOrderCode })
      }
      this.$refs.viewAttachmentDialogRef.openDialog(params)
    },
    filterWarehouse(val) {
      console.log("val", val)
      const warehouseList = deepClone(this.warehouseInitOptions)
      if (val) {
        const arr = val.trim().split(/[ \n,]+/)
        console.log("arr===", arr)
        let result = []
        arr.forEach((item) => {
          result.push(...warehouseList.filter((warehouse) => warehouse.warehouseCode.includes(item)))
        })
        // 去重
        this.warehouse = [...new Set(result)]
      }
    },
    visibleWarehouse(val) {
      if (val) {
        this.warehouse = deepClone(this.warehouseInitOptions)
      }
    },
    // 取消平台shipment
    async handleCancel(type) {
      if (this.selectRows.length <= 0) {
        this.$message.warning("请选择数据")
        return
      }

      this.$refs.cancelShipmentDialogRef.openDialog(this.selectRows, type)
    },
    handleImportFile() {
      this.$refs.batchUploadFileRef.openDialog()
    },
    handleImportTracking() {
      console.log("导入跟踪号 ")
      this.excelDangerStatus = false
      this.$refs.importTrackingNoRef.syncFn()
    },
    async importExcelBtn(file) {
      if (!file) {
        this.$message.error("请上传文件!")
        return
      }
      try {
        this.$refs.importTrackingNoRef.openFullScreen()
        let formData = new FormData()
        formData.append("file", file.raw)
        const { data } = await uploadFileBatchApi(formData)
        if (data.code === 0) {
          // this.$message.success("上传成功!")
          this.importTrackingNoData = data.data

          for (const item of this.importTrackingNoData) {
            try {
              await uploadOmsFoBatchTruckingNumber({
                truckingNo: item.truckingNumber,
                platformFoOrder: [item.platformOrderNo]
              })
              this.$set(item, "status", 0)
            } catch (error) {
              this.$set(item, "status", 1)
            }
          }
          this.successCount = this.importTrackingNoData.filter((item) => item.status === 0).length
          this.errorCount = this.importTrackingNoData.filter((item) => item.status === 1).length
          if (this.errorCount > 0) {
            this.$message.error("导入的excel表格数据有误，请点击异常文件下载查看原因")
            this.excelDangerStatus = true
          }
          // this.$message.success("上传完成")
          this.$refs.importTrackingNoRef.closeFullScreen()
        }
      } catch (e) {
        this.$refs.importTrackingNoRef.closeFullScreen()
      }
    },
    async exportDangerExcel() {
      console.log("？？？？")
      const { data } = await exportErrorDataApi("oms", {
        templateName: `跟踪单号修改导入模板.xlsx`,
        errorList: this.importTrackingNoData.filter((item) => item.status === 1)
      })
      downloadBlob(data, `跟踪单号-错误数据.xlsx`, "application/vnd.ms-excel;charset=utf-8")
    },
    async customDownload() {
      const { data } = await downloadTemplate({
        templateName: "跟踪单号修改导入模板"
      })
      downloadBlob(data, "跟踪单号修改导入模板.xlsx", "application/vnd.ms-excel;charset=utf-8")
    },
    handleConfirmSBOL() {
      if (this.selectRows.length <= 0) {
        this.$message.warning("请选择数据")
        return
      }

      this.$refs.compareFileDialogRef.openDialog(this.selectRows)
    },
    async exportDetail() {
      const exportParams = []
      // 没有勾选导出搜索的数据
      const obj = deepCloneIgnoreNull(this.searchForm)
      const batchOrderCode = this.selectRows.map((item) => item.batchOrderCode)
      const searchFormBatchOrderCode = obj?.batchOrderCode?.split(",") || []
      obj.batchOrderCode = [...new Set([...searchFormBatchOrderCode, ...batchOrderCode])].join(",")
      console.log("obj.batchOrderCode", obj.batchOrderCode)
      if (!obj.batchOrderCode) {
        delete obj.batchOrderCode
      }

      Object.keys(obj).forEach((item) => {
        if (Array.isArray(obj[item])) {
          exportParams.push({ code: item, value: obj[item].join(",") })
        } else {
          exportParams.push({ code: item, value: obj[item] })
        }
      })

      const { data } = await exportDataComApi({
        id: 43,
        param: exportParams,
        exportModel: "SYNC"
      })
      downloadBlob(data, "发货批次明细导出-SKU维度.xls", "application/vnd.ms-excel;charset=utf-8")
    },
    handleReGeneration() {
      if (this.selectRows.length <= 0) {
        this.$message.warning("请选择数据")
        return
      }
      const ids = this.selectRows.map((item) => item.id)

      this.$refs.reGenerationDialogRef.openDialog(ids)
    },
    // 批量下载文件
    handleDownLoadFile() {
      const searchForm = deepCloneIgnoreNull(this.searchForm)
      const batchOrderCode = this.selectRows.map((item) => item.batchOrderCode)
      const searchFormBatchOrderCode = searchForm?.batchOrderCode?.split(",") || []
      searchForm.batchOrderCode = [...new Set([...searchFormBatchOrderCode, ...batchOrderCode])].join(",")

      const params = {
        filtering: this.handleSearchParams(this.otherParams, searchForm),
        ...this.filterSearchParams()
      }
      this.$refs.viewAttachmentDialogRef.openDialog(params)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .avue-crud__menu {
  margin-bottom: 3px;
}

a {
  text-decoration: none;
}

::v-deep .isAbnormalFlag {
  background: rgba(244, 201, 51, 0.1) !important;
}

::v-deep .isFreezeFlag {
  background: #fbc4c4 !important;
}

::v-deep .stripe-row {
  background-color: #fafafa !important;
}

::v-deep table tbody tr:hover > td:not(.isAbnormalFlag):not(.isFreezeFlag) {
  background-color: unset !important;
}

#orderManage-dialog {
  ::v-deep .el-input-number {
    width: 100%;
  }

  ::v-deep .el-date-editor {
    width: 100%;
  }
}
::v-deep .el-button {
  margin-bottom: 5px;
}
</style>
