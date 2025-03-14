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
  <!-- 调拨管理 -->
  <div class="execution" v-loading.fullscreen.lock="loading" element-loading-text="正在处理中" id="porequisitonList">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="tableOptionCompute"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
      >
        <template slot="menuLeft">
          <el-dropdown-button
            type="primary"
            size="small"
            buttonText="导 出"
            @command="handleCommand"
            v-if="permissions.transfer_tmstransfer_export"
            style="margin-right: -5px; margin-left: 0px; width: 100px"
          >
            <el-dropdown-item command="列表导出">列表导出</el-dropdown-item>
            <el-dropdown-item command="明细导出">明细导出</el-dropdown-item>
            <el-dropdown-item command="货物交接单" v-if="tabPositionModel == '4' || tabPositionModel == '5'"
              >货物交接单</el-dropdown-item
            >
          </el-dropdown-button>
          <el-button
            type="primary"
            @click="openNewPage"
            size="small"
            v-if="permissions.transfer_tmstransfer_add && tabPositionModel == '0'"
            >新 增</el-button
          >
          <el-button
            type="primary"
            @click="handleDel"
            size="small"
            v-if="permissions.transfer_tmstransfer_del && tabPositionModel == '1'"
            >删 除</el-button
          >
          <el-button
            type="primary"
            @click="handleSubmit"
            size="small"
            v-if="permissions.transfer_tmstransfer_submit && tabPositionModel == '1'"
            >提交审核</el-button
          >
          <el-button
            type="primary"
            @click="handleSaleAudit"
            size="small"
            v-if="permissions.transfer_tmstransfer_sale_audit && tabPositionModel == '6'"
            >主管审核</el-button
          >
          <el-button
            type="primary"
            @click="handleAudit"
            size="small"
            v-if="permissions.transfer_tmstransfer_audit && tabPositionModel == '2'"
            >物流审核</el-button
          >
          <el-button
            type="primary"
            @click="handleStockout"
            size="small"
            v-if="permissions.transfer_tmstransfer_stockout && tabPositionModel == '3'"
            >确认发货</el-button
          >
          <el-button
            type="primary"
            @click="handleCancelDeclare"
            size="small"
            v-if="
              permissions.transfer_tmstransfer_cancelDeclare &&
              (transferType == 1 || transferType == 2) &&
              tabPositionModel == '4'
            "
            >撤销关单</el-button
          >
          <el-button
            type="primary"
            @click="handleCreateDeclare"
            size="small"
            v-if="
              permissions.transfer_tmstransfer_createDeclare &&
              (transferType == 1 || transferType == 2) &&
              tabPositionModel == '4'
            "
            >生成关单</el-button
          >
          <el-button
            type="primary"
            @click="handleConfirmArrival"
            size="small"
            v-if="permissions.transfer_tmstransfer_confirm_arrival && tabPositionModel == '4'"
            >到货确认</el-button
          >
          <el-button
            type="primary"
            @click="handleConfirmBatchArrival"
            size="small"
            v-if="permissions.tmstransfer_confirm_batch_arrival && tabPositionModel == '4'"
            >批量到货确认</el-button
          >
          <el-button
            type="primary"
            @click="handleForceFinish"
            size="small"
            v-if="permissions.transfer_tmstransfer_forceFinish && tabPositionModel == '4'"
            >强制完成</el-button
          >
          <el-button
            type="primary"
            @click="uploadDialog = true"
            size="small"
            v-if="
              permissions.transfer_tmstransfer_import &&
              transferType != 5 &&
              (tabPositionModel == '4' || tabPositionModel == '5')
            "
            >导入物流单号</el-button
          >
          <el-button
            type="primary"
            @click="clearDeclareExport"
            size="small"
            v-if="
              permissions.transfer_tmstransfer_customsClearance &&
              (transferType == 1 || transferType == 2) &&
              (tabPositionModel == '3' || tabPositionModel == '4')
            "
            >清关导出</el-button
          >
          <el-button
            type="primary"
            @click="changeLogisticsProvider"
            size="small"
            v-if="
              permissions.tmstransfer_update_logistics_provider && (tabPositionModel == '3' || tabPositionModel == '4')
            "
            >物流商维护</el-button
          >
          <el-button
            type="primary"
            @click="changeTransportMode"
            size="small"
            v-if="permissions.tmstransfer_update_transport_mode && (tabPositionModel == '3' || tabPositionModel == '4')"
            >运输方式维护</el-button
          >
        </template>
        <template slot-scope="scope" slot="search">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchForm" style="float: left">
            <el-form-item prop="transferNo">
              <avue-crud-input v-model="searchForm.transferNo" size="small" placeholder="调拨订单号"></avue-crud-input>
            </el-form-item>
            <el-form-item prop="skuCode">
              <avue-crud-input v-model="searchForm.skuCode" size="small" placeholder="SKU"></avue-crud-input>
            </el-form-item>
            <el-form-item prop="warehouseOutId">
              <el-select
                size="small"
                v-model="searchForm.warehouseOutId"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="发货仓"
              >
                <el-option
                  v-for="item in warehouseOutOptions"
                  :key="item.warehouseId"
                  :label="item.warehouseName"
                  :value="item.warehouseId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <!-- 高级搜索 -->
        <template slot-scope="scope" slot="searchAdvanced">
          <el-form @submit.prevent.native :model="searchForm" :inline="true" ref="searchFormAdvance">
            <el-form-item prop="time">
              <el-date-picker
                v-model="searchForm.time"
                type="daterange"
                size="small"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="corporationId">
              <el-select
                size="small"
                v-model="searchForm.corporationId"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="法人"
              >
                <el-option
                  v-for="item in corporationOptions"
                  :key="item.corporationId"
                  :label="item.corporationName"
                  :value="item.corporationId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="warehouseInId">
              <el-select
                size="small"
                v-model="searchForm.warehouseInId"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="目的仓"
              >
                <el-option
                  v-for="item in warehouseInOptions"
                  :key="item.warehouseId"
                  :label="item.warehouseName"
                  :value="item.warehouseId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="transferStatus">
              <el-select
                size="small"
                v-model="searchForm.transferStatus"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="状态"
              >
                <el-option
                  v-for="item in transferStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="transportModeId">
              <el-select
                size="small"
                v-model="searchForm.transportModeId"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="运输方式"
              >
                <el-option
                  v-for="item in transportModeOptionsAll"
                  :key="item.transportModeId"
                  :label="item.transportModeName"
                  :value="item.transportModeId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="transportCarrierId">
              <el-select
                size="small"
                v-model="searchForm.transportCarrierId"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="物流商"
              >
                <el-option
                  v-for="item in transportCarrierOptions"
                  :key="item.transportCarrierId"
                  :label="item.carrierName"
                  :value="item.transportCarrierId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              prop="declareCustomNoType"
              v-if="(transferType == 1 || transferType == 2) && tabPositionModel == 4"
            >
              <el-select
                size="small"
                v-model="searchForm.declareCustomNoType"
                collapse-tags
                clearable
                filterable
                placeholder="报关状态"
              >
                <el-option
                  v-for="item in declareCustomNoTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="shipmentid" v-if="transferType == 2 || transferType == 3">
              <avue-crud-input v-model="searchForm.shipmentid" size="small" placeholder="Shipmentid"></avue-crud-input>
            </el-form-item>

            <el-form-item prop="outStockTime" v-if="tabPositionModel == 4 || tabPositionModel == 5">
              <el-date-picker
                v-model="searchForm.outStockTime"
                type="daterange"
                size="small"
                start-placeholder="确认发货开始日期"
                end-placeholder="确认发货结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item prop="taxType">
              <el-select
                size="small"
                v-model="searchForm.taxType"
                multiple
                collapse-tags
                clearable
                filterable
                placeholder="退税"
              >
                <el-option v-for="item in taxTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-button native-type="submit" @click="searchChange" v-show="false"></el-button>
          </el-form>
        </template>
        <template slot-scope="scope" slot="tableBeforeSlot">
          <el-radio-group
            size="small"
            @change="changeTabPosition"
            v-model="tabPositionModel"
            style="margin-bottom: 15px"
          >
            <el-radio-button label="0"
              >全部订单(<span>{{ tabPosition[0].count }}</span
              >)</el-radio-button
            >
            <el-radio-button label="1"
              >草稿(<span>{{ tabPosition[1].count }}</span
              >)</el-radio-button
            >
            <el-radio-button label="6"
              >主管审核(<span>{{ tabPosition[6].count }}</span
              >)</el-radio-button
            >
            <el-radio-button label="2"
              >物流审核(<span>{{ tabPosition[2].count }}</span
              >)</el-radio-button
            >
            <el-radio-button label="3"
              >待发货(<span>{{ tabPosition[3].count }}</span
              >)</el-radio-button
            >
            <el-radio-button label="4"
              >在途(<span>{{ tabPosition[4].count }}</span
              >)</el-radio-button
            >
            <el-radio-button label="5"
              >已完成(<span>{{ tabPosition[5].count }}</span
              >)</el-radio-button
            >
          </el-radio-group>
        </template>
        <!-- 调拨单号列 -->
        <template slot="transferNo" slot-scope="scope">
          <router-link
            :to="{
              path: '/transfer/detail/' + transferType,
              query: { transferType: transferType, transferNo: scope.row.transferNo }
            }"
            >{{ scope.row.transferNo }}</router-link
          >
        </template>
        <!-- 平台SKU种类列 -->
        <template slot="skuCount" slot-scope="scope">
          <el-button type="text" size="mini" class="button-css" @click="showSkuDetail(scope.row.transferNo)">{{
            scope.row.skuCount
          }}</el-button>
        </template>
        <!-- 操作日志 -->
        <template slot="operateLog" slot-scope="scope">
          <a @click="download(scope.row.transferAttach)">下载</a>
          <a style="margin-left: 10px" @click="showOperateLog(scope.row.transferNo)">日志</a>
          <!-- <i class="icon-rizhi y-reviews" @click="showOperateLog(scope.row.transferNo)"></i> -->
        </template>
      </avue-crud>
      <!-- 主管审核 -->
      <el-dialog class="audit-dialog" v-bind:title="dialogTitil" :visible.sync="saleAuditDialog" width="520px" center>
        <div style="text-align: center; margin: 20px">是否确认审核选中调拨单?</div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="confirmSaleAudit(false)">拒绝通过</el-button>
          <el-button size="small" type="primary" @click="confirmSaleAudit(true)">审核通过</el-button>
        </span>
      </el-dialog>
      <!-- 审核 -->
      <el-dialog
        class="audit-dialog"
        v-bind:title="dialogTitil"
        :visible.sync="auditDialog"
        width="520px"
        center
        @closed="formReset('auditForm')"
      >
        <el-form ref="auditForm" :model="audit" :rules="auditFormRules" status-icon label-width="45px">
          <el-form-item label="物流商：" prop="transportCarrierId">
            <el-select v-model="audit.transportCarrierId" size="small" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in transportCarrierUsableOptions"
                :key="item.transportCarrierId"
                :label="item.carrierName"
                :value="item.transportCarrierId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运输方式：" prop="transportModeId">
            <el-select
              v-model="audit.transportModeId"
              size="small"
              filterable
              clearable
              placeholder="请选择"
              @change="handleSelectTransportMode"
            >
              <el-option
                v-for="item in transportModeOptions"
                :key="item.transportModeId"
                :label="item.transportModeName"
                :value="item.transportModeId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="柜型"
            prop="transportCabinetTypeId"
            v-if="audit.involveCabinetFlag && audit.involveCabinetFlag === 1"
          >
            <el-select v-model="audit.transportCabinetTypeId" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in transportCabinetTypeOptions"
                :key="item.transportCabinetTypeId"
                :label="item.cabinetTypeName"
                :value="item.transportCabinetTypeId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="申报类型："
            prop="declareType"
            v-if="(transferType == 1 || transferType == 2) && (audit.taxType == 1 || audit.taxType == 3)"
          >
            <el-select v-model="audit.declareType" size="small" filterable clearable placeholder="请选择">
              <el-option v-for="item in declareTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="confirmAudit(false)">拒绝通过</el-button>
          <el-button size="small" type="primary" @click="confirmAudit(true)">审核通过</el-button>
        </span>
      </el-dialog>
      <!-- 产品详情 -->
      <el-dialog class="sku-dialog" v-bind:title="dialogTitil" :visible.sync="skuDialog" center>
        <avue-crud class="app-container" :data="skuTableData" :option="skuTableOptionCompute"> </avue-crud>
      </el-dialog>
      <!-- 确认发货 -->
      <el-dialog class="stockout-dialog" v-bind:title="dialogTitil" :visible.sync="stockoutDialog" center>
        <el-form ref="stockoutForm" :model="stockout" status-icon>
          <avue-crud
            v-merge-header-row="mergeData"
            class="app-container"
            :data="stockout.tableData"
            :option="stockoutTableOption"
            :spanMethod="spanMethod"
          >
            <!-- 实发箱数 -->
            <template slot="boxs" slot-scope="scope">
              <el-form-item :prop="'tableData[' + scope.row.$index + '].boxs'" :rules="tableInputRules.boxs">
                <el-input size="mini" clearable v-model="scope.row.boxs"></el-input>
              </el-form-item>
            </template>

            <!-- 实发数量 -->
            <template slot="quantity" slot-scope="scope">
              <el-form-item :prop="'tableData[' + scope.row.$index + '].quantity'" :rules="tableInputRules.quantity">
                <el-input size="mini" clearable v-model="scope.row.quantity"></el-input>
              </el-form-item>
            </template>

            <!-- 长 -->
            <template slot="boxLength" slot-scope="scope">
              <el-form-item :prop="'tableData[' + scope.row.$index + '].boxLength'" :rules="tableInputRules.boxLength">
                <el-input size="mini" clearable v-model="scope.row.boxLength"></el-input>
              </el-form-item>
            </template>

            <!-- 宽 -->
            <template slot="boxWidth" slot-scope="scope">
              <el-form-item :prop="'tableData[' + scope.row.$index + '].boxWidth'" :rules="tableInputRules.boxWidth">
                <el-input size="mini" clearable v-model="scope.row.boxWidth"></el-input>
              </el-form-item>
            </template>

            <!-- 高 -->
            <template slot="boxHeight" slot-scope="scope">
              <el-form-item :prop="'tableData[' + scope.row.$index + '].boxHeight'" :rules="tableInputRules.boxHeight">
                <el-input size="mini" clearable v-model="scope.row.boxHeight"></el-input>
              </el-form-item>
            </template>

            <!-- 单箱重量 -->
            <template slot="boxWeight" slot-scope="scope">
              <el-form-item :prop="'tableData[' + scope.row.$index + '].boxWeight'" :rules="tableInputRules.boxWeight">
                <el-input size="mini" clearable v-model="scope.row.boxWeight"></el-input>
              </el-form-item>
            </template>
          </avue-crud>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="confirmStockout(false)">拒 绝</el-button>
          <el-button type="primary" size="small" @click="confirmStockout(true)">确 认</el-button>
        </span>
      </el-dialog>
      <!-- 到货确认 -->
      <el-dialog class="confirmArrival-dialog" v-bind:title="dialogTitil" :visible.sync="confirmArrivalDialog" center>
        <el-form ref="confirmArrivalForm" :model="confirmArrival" status-icon>
          <avue-crud class="app-container" :data="confirmArrival.tableData" :option="confirmArrivalTableOptionCompute">
            <!-- 到货数量 -->
            <template slot="currentReceivingQuantity" slot-scope="scope">
              <el-form-item
                :prop="'tableData[' + scope.row.$index + '].currentReceivingQuantity'"
                :rules="tableInputRules.currentReceivingQuantity"
              >
                <el-input size="mini" clearable v-model="scope.row.currentReceivingQuantity"></el-input>
              </el-form-item>
            </template>

            <!-- 到货箱数 -->
            <template slot="currentReceivingBoxs" slot-scope="scope">
              <el-form-item
                :prop="'tableData[' + scope.row.$index + '].currentReceivingBoxs'"
                :rules="tableInputRules.currentReceivingBoxs"
              >
                <el-input size="mini" clearable v-model="scope.row.currentReceivingBoxs"></el-input>
              </el-form-item>
            </template>

            <!-- 库位 -->
            <template slot="stockLocationId" slot-scope="scope">
              <el-form-item
                :prop="'tableData[' + scope.row.$index + '].stockLocationId'"
                :rules="tableInputRules.stockLocationId"
              >
                <el-select
                  v-model="scope.row.stockLocationId"
                  filterable
                  placeholder="请选择"
                  size="mini"
                  :popper-append-to-body="true"
                >
                  <el-option
                    v-for="item in stockLocationOptions"
                    :key="item.stockLocationId"
                    :label="item.locationCode"
                    :value="item.stockLocationId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </avue-crud>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="confirmConfirmArrival()">确 认</el-button>
        </span>
      </el-dialog>
      <!-- 上传文件 -->
      <el-dialog
        class="upload-dialog"
        title="导入物流单号"
        :visible.sync="uploadDialog"
        width="500px"
        center
        @close="importReset"
      >
        <tip
          type="list"
          :title="[
            '1、必须按照导出模板导入',
            '2、导入调拨单号必须在系统存在',
            '3、若调拨单号已导入物流单号，且物流单号已审核，不允许导入'
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
        <p class="attachmentFileName">{{ upload.attachmentFileName }}</p>

        <el-button type="default" size="small" @click="downloadTemplate">模板下载</el-button>

        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="submitUpload()">确定</el-button>
        </span>
      </el-dialog>

      <!-- 物流商维护 -->
      <el-dialog
        class="assign-buyer-dialog"
        title="物流商维护"
        :visible.sync="logisticsProviderDialog"
        width="400px"
        center
      >
        <el-form ref="addOrUpdateForm" status-icon>
          <el-form-item label="更新物流商:">
            <el-select v-model="canChangeLogisticsProvider" size="small" filterable placeholder="请选择">
              <el-option
                v-for="item in transportCarrierUsableOptions"
                :key="item.transportCarrierId"
                :label="item.carrierName"
                :value="item.transportCarrierId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancelLogistics()">取 消</el-button>
          <el-button size="small" type="primary" @click="confirmLogistics()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 运输方式维护 -->
      <el-dialog
        class="assign-buyer-dialog"
        title="运输方式维护"
        :visible.sync="transportModeDialog"
        width="400px"
        center
      >
        <el-form ref="addOrUpdateTransportModeForm" status-icon>
          <el-form-item label="更新运输方式:">
            <el-select v-model="canChangeTransportMode" size="small" filterable placeholder="请选择">
              <el-option
                v-for="item in transportModeOptions"
                :key="item.transportModeId"
                :label="item.transportModeName"
                :value="item.transportModeId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancelTransportMode()">取 消</el-button>
          <el-button size="small" type="primary" @click="confirmTransportMode()">确 定</el-button>
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
  delObj,
  submitObj,
  saleAuditObj,
  auditObj,
  stockoutObj,
  confirmArrivalObj,
  importLogisticsNo,
  forceFinishObj,
  confirmBatchArrival,
  updateLogisticsProvider,
  cancelDeclare,
  createDeclare,
  updateTransportMode
} from "@/api/logistics/transfer/tmstransfer"
import { queryConfirmArrivalData, getBoxList, getPlatformSkuInfo } from "@/api/logistics/transfer/tmstransferdetail"
import { getAll as getBsetransportcarrierAll } from "@/api/baseSetup/bsetransportcarrier/bsetransportcarrier"
import {
  tableOption,
  transferStatusOptions,
  declareCustomNoTypeOptions,
  declareTypeOptions,
  stockoutTableOption,
  confirmArrivalTableOption,
  skuTableOption,
  tabPosition,
  hiddenTableOptionTransferType,
  hiddenTableOptionTabPosition,
  taxTypeOptions
} from "@/const/crud/logistics/transfer/tmstransfer"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import { getStockLocationInfo } from "@/api/baseSetup/wmsstocklocation/wmsstocklocation"
import { getAll as getBsecorporationAll } from "@/api/baseSetup/bsecorporation"
import { getAll as getBsetransportmodesAll } from "@/api/baseSetup/bsetransportmodes"
import { getAll as getBsetransportcabinettypeAll } from "@/api/baseSetup/bsetransportcabinettype"
import { mapGetters } from "vuex"
import pooperatelog from "@/views/logistics/transfer/tmstransferoperatelog/index"
import { getUrlConcatToken, getTokenUrl } from "@/util/auth"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { parse } from "path"
import tip from "@/views/cockpit/tip"
import { constants } from "crypto"
export default {
  name: "tmstransfer",
  components: {
    pooperatelog,
    tip
  },
  data() {
    /**是否是整数 */
    var validateNumber = (rule, value, callback) => {
      var reg = /^[+]{0,1}(\d+)$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error("只能输入整数"))
      }
    }
    /**是否非负数 */
    var validateFloat = (rule, value, callback) => {
      var reg = /^\d+(\.\d+)?$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error("只能输入非负数"))
      }
    }
    /**最多保留两位小数 */
    var validateFloatFourDigit = (rule, value, callback) => {
      var reg = /^\d+(\.\d{1,4})?$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error("最多保留四位小数"))
      }
    }
    /**最多保留两位小数 */
    var validateFloatFiveDigit = (rule, value, callback) => {
      var reg = /^\d+(\.\d{1,5})?$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error("最多保留五位小数"))
      }
    }
    //柜型验证
    var validateTransportCabinetType = (rule, value, callback) => {
      if (this.audit.involveCabinetFlag === 1 && !value) {
        callback(new Error(""))
      } else {
        callback()
      }
    }
    return {
      //页面切换配置
      tabPositionModel: "0",
      tabPosition: deepClone(tabPosition),
      //搜索条件，和前端控件绑定
      searchForm: {
        transferNo: "",
        skuCode: "",
        time: [],
        startTime: "",
        endTime: "",
        warehouseOutId: "",
        corporationId: "",
        warehouseInId: "",
        transferStatus: "",
        transportModeId: "",
        transportCarrierId: "",
        shipmentid: "",
        declareCustomNoType: "",
        outStockTime: [],
        outStockTimeStart: "",
        outStockTimeEnd: "",
        taxType: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      loading: false,
      hiddenTableOptionTransferType: hiddenTableOptionTransferType,
      hiddenTableOptionTabPosition: hiddenTableOptionTabPosition,
      selectList: [],
      transferType: "1",
      warehouseOutOptions: [],
      corporationOptions: [],
      warehouseInOptions: [],
      transferStatusOptions: deepClone(transferStatusOptions),
      transportModeOptions: [],
      transportModeOptionsAll: [],
      list: [],
      saleAuditDialog: false,
      dialogTitil: "",
      auditDialog: false,
      audit: {
        transportCarrierId: "",
        transportModeId: "",
        transportCabinetTypeId: "",
        declareType: "",
        involveCabinetFlag: "",
        taxType: ""
      },
      declareTypeOptions: declareTypeOptions,
      taxTypeOptions: taxTypeOptions,
      transportCarrierOptions: [],
      declareCustomNoTypeOptions: declareCustomNoTypeOptions,
      transportCarrierUsableOptions: [],
      transportCabinetTypeOptions: [],
      transportCabinetTypeOptionsAll: [],
      auditFormRules: {
        transportCarrierId: [{ required: true, message: "请先选择物流商", trigger: "change" }],
        transportModeId: [{ required: true, message: "请先选择运输方式", trigger: "change" }],
        transportCabinetTypeId: [
          { validator: validateTransportCabinetType, message: "请先选择柜型", trigger: "change" }
        ],
        declareType: [{ required: true, message: "请先选择申报类型", trigger: "change" }]
      },
      stockoutDialog: false,
      mergeData: [{ index: 7, col: 3 }],
      stockout: {
        tableData: []
      },
      stockoutTableOption: deepClone(stockoutTableOption),
      confirmArrivalDialog: false,
      confirmArrival: {
        tableData: []
      },
      confirmArrivalTableOption: confirmArrivalTableOption,
      stockLocationOptions: [],
      tableInputRules: {
        quantity: [
          { required: true, message: "实发数量不能为空", trigger: "blur" },
          { validator: validateNumber, message: "只能输入整数", trigger: "blur" }
        ],
        boxs: [
          { required: true, message: "实发箱数不能为空", trigger: "blur" },
          { validator: validateNumber, message: "只能输入整数", trigger: "blur" }
        ],
        boxLength: [
          { required: true, message: "箱规长不能为空", trigger: "blur" },
          { validator: validateFloat, message: "只能输入非负数", trigger: "blur" },
          { validator: validateFloatFourDigit, message: "最多保留四位小数", trigger: "blur" }
        ],
        boxWidth: [
          { required: true, message: "箱规宽不能为空", trigger: "blur" },
          { validator: validateFloat, message: "只能输入非负数", trigger: "blur" },
          { validator: validateFloatFourDigit, message: "最多保留四位小数", trigger: "blur" }
        ],
        boxHeight: [
          { required: true, message: "箱规高不能为空", trigger: "blur" },
          { validator: validateFloat, message: "只能输入非负数", trigger: "blur" },
          { validator: validateFloatFourDigit, message: "最多保留四位小数", trigger: "blur" }
        ],
        boxWeight: [
          { required: true, message: "单箱重量不能为空", trigger: "blur" },
          { validator: validateFloat, message: "只能输入非负数", trigger: "blur" },
          { validator: validateFloatFiveDigit, message: "最多保留五位小数", trigger: "blur" }
        ],
        currentReceivingQuantity: [
          { required: true, message: "到货数量不能为空", trigger: "blur" },
          { validator: validateNumber, message: "只能输入整数", trigger: "blur" }
        ],
        currentReceivingBoxs: [
          { required: true, message: "到货箱数不能为空", trigger: "blur" },
          { validator: validateNumber, message: "只能输入整数", trigger: "blur" }
        ],
        stockLocationId: [{ required: true, message: "请选择库位", trigger: "change" }]
      },
      skuTableOption: skuTableOption,
      skuTableData: [],
      skuDialog: false,
      uploadDialog: false,
      upload: {
        attachmentFileName: "",
        file: null
      },
      canChangeLogisticsProvider: "",
      canChangeLogisticsProviderOld: {
        transportCarrierId: "",
        transportModeId: "",
        transportCabinetTypeId: "",
        declareType: "",
        involveCabinetFlag: "",
        taxType: ""
      },
      logisticsProviderDialog: false,
      canChangeTransportMode: "",
      transportModeDialog: false
    }
  },
  created() {},
  mounted: function () {
    //初始化调拨类型
    this.transferType = this.$route.path.split("/")[3]
    //加载仓库
    this.getAllWarehouse()
    //加载法人主体
    this.getBsecorporationAll()
    //加载运输方式
    this.getBsetransportmodesAll()
    //加载物流商
    this.getBsetransportcarrierAll()
    this.getList(this.page)
  },
  computed: {
    ...mapGetters(["permissions"]),
    //监听tag---调拨列表
    tableOptionCompute() {
      let tableOptionsClone = deepClone(this.tableOption)
      tableOptionsClone.column = tableOptionsClone.column.filter((item) => {
        return (
          this.hiddenTableOptionTransferType[this.transferType].name.indexOf(item.prop) === -1 &&
          this.hiddenTableOptionTabPosition[parseInt(this.tabPositionModel)].name.indexOf(item.prop) === -1
        )
      })
      return tableOptionsClone
    },
    //监听tag---调拨详情展示弹框
    skuTableOptionCompute() {
      let tableOptionsClone = deepClone(this.skuTableOption)
      tableOptionsClone.column = tableOptionsClone.column.filter((item) => {
        return this.hiddenTableOptionTabPosition[parseInt(this.tabPositionModel)].name.indexOf(item.prop) === -1
      })
      return tableOptionsClone
    },
    //监听tag---确认到货选择弹框
    confirmArrivalTableOptionCompute() {
      let tableOptionsClone = deepClone(this.confirmArrivalTableOption)
      tableOptionsClone.column = tableOptionsClone.column.filter((item) => {
        return this.hiddenTableOptionTransferType[this.transferType].name.indexOf(item.prop) === -1
      })
      return tableOptionsClone
    }
  },
  methods: {
    //切换查询条件
    changeTabPosition() {
      this.searchForm.transferStatus = []
      let options = deepClone(transferStatusOptions)
      options = options.filter((item) => {
        return this.tabPosition[parseInt(this.tabPositionModel)].transferStatusArr.indexOf(item.value) !== -1
      })
      this.transferStatusOptions = options
      this.page.currentPage = 1
      this.searchForm.declareCustomNoType = ""
      this.searchForm.outStockTime = []
      this.searchForm.outStockTimeStart = ""
      this.searchForm.outStockTimeEnd = ""
      this.handleSearchFilter()
      this.getList(this.page, this.searchFormConfirm)
      this.clearSelectClear()
    },
    //删除
    handleDel() {
      let status = 1
      let operation = "删除"
      let isOne = false
      if (this.clickValidate(status, operation, isOne)) {
        let _this = this
        this.$confirm("是否确认删除选中调拨单", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(function () {
            _this.loading = true
            return delObj(_this.list, _this.transferType)
          })
          .then((response) => {
            this.handleResponse(response, "del", operation)
          })
          .catch((res) => {})
      }
    },
    //导出
    handleCommand(command) {
      if (command == "列表导出") {
        this.handleExport("list")
      }
      if (command == "明细导出") {
        this.handleExport("detail")
      }
      if (command == "货物交接单") {
        this.handleChecklistExport("goodsDeliveryReceipt")
      }
    },
    //导出
    handleExport(code) {
      this.handleSearchFilter()
      if (!this.tableData || this.tableData.length == 0) {
        this.$message.error("没有可导出数据")
        return
      }
      this.list = []
      if (this.selectList && this.selectList.length > 0) {
        //选中数据
        for (let index = 0; index < this.selectList.length; index++) {
          this.list.push(this.selectList[index].transferNo)
        }
        this.searchFormConfirm.transferNo = this.list.join(",")
      }
      this.searchFormConfirm.transferType = this.transferType
      this.searchFormConfirm.code = code
      this.searchFormConfirm.tabPositionModel = this.tabPositionModel
      //this.searchFormConfirm.declareCustomNoType = this.declareCustomNoType;
      this.searchFormConfirm.transferStatusAll =
        this.tabPosition[parseInt(this.tabPositionModel)].transferStatusArr.join(",")
      let par = ""
      Object.keys(this.searchFormConfirm).forEach((key) => {
        if (this.searchFormConfirm[key]) {
          par += "&" + key + "=" + this.searchFormConfirm[key]
        }
      })
      this.$notify({
        title: "成功",
        message: "正在导出（注意：最多可导出6W条数据）",
        type: "success",
        duration: 2000
      })
      window.location = getUrlConcatToken(`/api/transfer/tmstransfer/export`) + par
      this.handleSearchFilter()
    },
    //勾选导出
    handleChecklistExport(code) {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return false
      }
      var flag = true
      this.list = []
      for (let index = 0; index < this.selectList.length; index++) {
        if (index !== 0) {
          if (
            this.selectList[index].transferStatus != this.selectList[0].transferStatus ||
            this.selectList[index].transportModeId != this.selectList[0].transportModeId ||
            this.selectList[index].transportCarrierId != this.selectList[0].transportCarrierId
          ) {
            this.$message.error("请勾选勾选同一个物流商，同一个状态，同一个运输方式的调拨单")
            var flag = false
            return
          }
        }
        this.list.push(this.selectList[index].transferNo)
      }
      if (!flag) {
        return
      }
      let condition = {
        transferType: this.transferType,
        tabPositionModel: this.tabPositionModel,
        transferStatusAll: this.tabPosition[parseInt(this.tabPositionModel)].transferStatusArr.join(","),
        code: code,
        transferNo: this.list.join(",")
      }
      let par = ""
      Object.keys(condition).forEach((key) => {
        if (condition[key]) {
          par += "&" + key + "=" + condition[key]
        }
      })
      this.$notify({
        title: "成功",
        message: "正在导出",
        type: "success",
        duration: 2000
      })
      window.location = getUrlConcatToken(`/api/transfer/tmstransfer/export`) + par
    },
    //提交审核
    handleSubmit() {
      let status = 1
      let operation = "提交审核"
      let isOne = false
      if (this.clickValidate(status, operation, isOne)) {
        let _this = this
        this.$confirm("是否确认提交审核选中调拨单", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(function () {
            _this.loading = true
            return submitObj(_this.list, _this.transferType)
          })
          .then((response) => {
            this.handleResponse(response, "submit", operation)
          })
          .catch((res) => {})
      }
    },
    //主管审核
    handleSaleAudit() {
      let status = 8
      let operation = "主管审核"
      let isOne = true
      if (this.clickValidate(status, operation, isOne)) {
        this.dialogTitil = "主管审核"
        this.saleAuditDialog = true
      }
    },
    ////确认主管审核
    confirmSaleAudit(isAgree) {
      let _this = this
      let operation = "主管审核"
      _this.loading = true
      saleAuditObj(_this.list, _this.transferType, isAgree).then((response) => {
        this.handleResponse(response, "saleAudit", operation)
      })
    },
    //物流审核
    handleAudit() {
      let status = 2
      let operation = "物流审核"
      let isOne = true
      if (this.clickValidate(status, operation, isOne)) {
        this.audit = {
          transportCarrierId: "",
          transportModeId: this.selectList[0].transportModeId ? this.selectList[0].transportModeId : "",
          transportCabinetTypeId: this.selectList[0].transportCabinetTypeId
            ? this.selectList[0].transportCabinetTypeId
            : "",
          declareType: "",
          involveCabinetFlag: this.selectList[0].involveCabinetFlag ? this.selectList[0].involveCabinetFlag : "",
          taxType: this.selectList[0].taxType ? this.selectList[0].taxType : ""
        }
        //若选择运输方式涉及组柜--加载柜型
        if (this.selectList[0].involveCabinetFlag && this.selectList[0].involveCabinetFlag === 1) {
          if (!this.transportCabinetTypeOptionsAll || this.transportCabinetTypeOptionsAll.length == 0) {
            this.getBsetransportcabinettypeAll()
          } else {
            //当前运输方式柜型
            this.transportCabinetTypeOptions = deepClone(this.transportCabinetTypeOptionsAll).filter((obj) => {
              return obj.transportModeId == this.audit.transportModeId
            })
          }
        }
        this.dialogTitil = "物流审核"
        this.auditDialog = true
      }
    },
    //确认审核
    confirmAudit(isAgree) {
      let flag = true
      if (isAgree) {
        this.$refs["auditForm"].validate((valid, rules) => {
          if (!valid) {
            flag = false
          }
        })
      }
      if (flag) {
        let _this = this
        let operation = "审核"
        _this.loading = true
        auditObj(
          _this.list,
          _this.transferType,
          isAgree,
          _this.audit.transportCarrierId,
          _this.audit.transportModeId,
          _this.audit.transportCabinetTypeId,
          _this.audit.declareType
        ).then((response) => {
          this.handleResponse(response, "audit", operation)
        })
      }
    },
    //确认发货
    handleStockout() {
      let status = 3
      let operation = "确认发货"
      let isOne = true
      this.stockout.tableData = []
      if (this.clickValidate(status, operation, isOne)) {
        getBoxList(this.list).then((response) => {
          if (response.data.code === 0) {
            let concatData = []
            // 格式化数据结构
            let records = response.data.data || []
            records.forEach((item, i) => {
              item.tmsTransferDetailBoxList.forEach((val, key) => {
                Object.assign(val, {
                  transferDetailId: item.transferDetailId,
                  transferNo: item.transferNo,
                  platformSkuCode: item.platformSkuCode,
                  skuCode: item.skuCode,
                  transferQuantity: item.transferQuantity,
                  transferBoxs: item.transferBoxs,
                  taxType: item.taxType,
                  corporationId: item.corporationId
                })
                if (key === 0) {
                  //新建sku长度，为合并列表准备
                  val["itemLen"] = item.tmsTransferDetailBoxList.length
                }
              })
              concatData = concatData.concat(item.tmsTransferDetailBoxList)
            })
            this.stockout.tableData = concatData
            this.dialogTitil = "确认发货"
            this.stockoutDialog = true
          }
        })
      }
    },
    //合并单元格
    spanMethod(params) {
      if (
        params.columnIndex === 0 ||
        params.columnIndex === 1 ||
        params.columnIndex === 2 ||
        params.columnIndex === 3 ||
        params.columnIndex === 4
      ) {
        if (params.row.itemLen) {
          return {
            rowspan: params.row.itemLen,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    //确定确认发货
    confirmStockout(isAgree) {
      let flag = true
      if (isAgree) {
        this.$refs["stockoutForm"].validate((valid, rules) => {
          if (!valid) {
            flag = false
          }
        })
      }
      if (flag) {
        let detailBoxList = this.checkStockoutData()
        if (detailBoxList.length > 0) {
          let _this = this
          let operation = "确认发货"
          _this.loading = true
          stockoutObj(detailBoxList, _this.transferType, isAgree).then((response) => {
            this.handleResponse(response, "stockout", operation)
          })
        }
      }
    },
    //到货确认
    handleConfirmArrival() {
      this.confirmArrival.tableData = []
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      } else if (this.selectList.length != 1) {
        this.$message.error("只支持单个调拨单操作")
        return
      }
      let tt = this.selectList[0]
      if (tt.transferStatus != 4 && tt.transferStatus != 6) {
        let options = this.transferStatusOptions.filter((obj) => {
          return obj.value == tt.transferStatus
        })
        this.$message.error("调拨单：" + tt.transferNo + "，状态为：" + options[0].label + "，不允许到货确认")
        return
      }
      //查询确认到货信息
      queryConfirmArrivalData(tt.transferNo).then((response) => {
        const data = response.data.data
        for (let index = 0; index < data.length; index++) {
          const element = data[index]
          element.currentReceivingQuantity = element.deliveryQuantity - element.receivingQuantity
          element.currentReceivingBoxs = element.deliveryBoxs - element.receivingBoxs
          this.confirmArrival.tableData.push(element)
        }
        //国内调国内确认到货需选择入库仓库位
        if (this.transferType == 5) {
          var query = {
            warehouseId: this.selectList[0].warehouseInId
          }
          getStockLocationInfo(query).then((response) => {
            this.stockLocationOptions = response.data.data
          })
        }
        this.dialogTitil = "到货确认"
        this.confirmArrivalDialog = true
      })
    },
    //撤销关单
    handleCancelDeclare() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      if (this.selectList.length > 1) {
        this.$message.error("一次只能操作一条数据!")
        return
      }
      var obj = { transferNo: this.selectList[0].transferNo }
      this.$confirm("确认撤销该调拨单对应的关单吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        cancelDeclare(obj).then((response) => {
          this.handleResponse(response, "cancelDeclare", "撤销关单")
        })
      })
    },
    //生成关单
    handleCreateDeclare() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      if (this.selectList.length > 1) {
        this.$message.error("一次只能操作一条数据!")
        return
      }
      var obj = { transferNo: this.selectList[0].transferNo }
      this.$confirm("确定要生成关单吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        createDeclare(obj).then((response) => {
          this.handleResponse(response, "createDeclare", "生成关单")
        })
      })
    },
    //确定到货确认
    confirmConfirmArrival() {
      let flag = true
      this.$refs["confirmArrivalForm"].validate((valid, rules) => {
        if (!valid) {
          flag = false
        }
      })
      if (flag && this.checkConfirmArrivalData()) {
        //数据组装
        let confirmArrivalModel = {}
        let confirmArrivalDetailList = []
        this.confirmArrival.tableData.forEach((obj) => {
          if (parseInt(obj.currentReceivingQuantity) > 0) {
            confirmArrivalDetailList.push({
              skuId: obj.skuId,
              bsePlatformSkuId: obj.bsePlatformSkuId,
              taxType: obj.taxType,
              platformSkuCode: obj.platformSkuCode,
              stockLocationId: obj.stockLocationId,
              receivingQuantity: obj.currentReceivingQuantity,
              receivingBoxs: obj.currentReceivingBoxs,
              corporationId: obj.corporationId
            })
          }
        })
        if (confirmArrivalDetailList.length > 0) {
          confirmArrivalModel = {
            transferNo: this.confirmArrival.tableData[0].transferNo,
            detailList: confirmArrivalDetailList
          }
          let _this = this
          let operation = "到货确认"
          _this.loading = true
          confirmArrivalObj(confirmArrivalModel, _this.transferType).then((response) => {
            this.handleResponse(response, "confirmArrival", operation)
          })
        }
      }
    },
    //批量确认到货
    handleConfirmBatchArrival() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      var errorFlag = false
      var transferNoArr = []
      for (var i = 0; i < this.selectList.length; i++) {
        let tt = this.selectList[i]
        if (tt.transferStatus != 4 && tt.transferStatus != 6) {
          let options = this.transferStatusOptions.filter((obj) => {
            return obj.value == tt.transferStatus
          })
          this.$message.error("调拨单：" + tt.transferNo + "，状态为：" + options[0].label + "，不允许到货确认")
          errorFlag = true
          break
        }
        transferNoArr.push(this.selectList[i].transferNo)
      }
      if (errorFlag) {
        return
      }

      this.$confirm("此操作将对调拨单:【" + transferNoArr + "】到货确认, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        confirmBatchArrival(
          Object.assign({
            transferNos: transferNoArr,
            transferType: this.transferType
          })
        ).then((response) => {
          if (response.data.code != 0) {
            this.$message.error("批量确认到货异常!")
            return
          }
          var errorList = response.data.data.error
          var successList = response.data.data.success
          if (successList.length > 0) {
            this.$message.success(successList + "到货成功")
          }
          if (errorList.length > 0) {
            this.$message.error("到货异常的数据:" + errorList)
          }
          this.clearSelectClear()
          this.handleSearchFilter()
          this.getList(this.page, this.searchFormConfirm)
        })
      })
    },
    //操作前数据校验
    clickValidate(status, operation, isOne) {
      let flag = true
      this.list = []
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return false
      } else if (isOne && this.selectList.length != 1) {
        this.$message.error("只支持单个调拨单操作")
        return false
      }
      let options = this.selectList.filter((obj) => {
        return obj.transferStatus != status
      })
      if (options && options.length > 0) {
        let opt = options[0]
        options = this.transferStatusOptions.filter((obj) => {
          return obj.value == opt.transferStatus
        })
        this.$message.error("调拨单：" + opt.transferNo + "，状态为：" + options[0].label + "，不允许" + operation)
        return false
      }
      //操作数据
      for (let index = 0; index < this.selectList.length; index++) {
        this.list.push(this.selectList[index].transferNo)
      }
      return flag
    },
    //确认发货数据校验
    checkStockoutData() {
      let flag = true
      let tip = ""
      let sameFlag = true
      let quantity = 0
      let detailBoxList = []
      if (!this.stockout.tableData || this.stockout.tableData.length == 0) {
        this.$message.error("没有可操作数据")
        return false
      }
      for (let index = 0; index < this.stockout.tableData.length; index++) {
        const element = this.stockout.tableData[index]
        if (flag) {
          tip = "平台SKU:" + element.platformSkuCode + "（" + (element.taxType == 1 ? "含税" : "非税") + "）,"
          if (parseInt(element.boxs) == 0 && parseInt(element.quantity) > 0) {
            tip = tip + "箱数 = 0，发货数量 > 0"
            flag = false
            this.$message.error(tip)
            break
          } else if (parseInt(element.boxs) > 0 || parseInt(element.quantity) > 0) {
            if (flag && parseInt(element.boxs) > parseInt(element.quantity)) {
              tip = tip + "箱数 > 发货数量"
              flag = false
              this.$message.error(tip)
              break
            }
            if (flag && parseFloat(element.boxLength) == 0.0) {
              tip = tip + "箱规长不能为0"
              flag = false
              this.$message.error(tip)
              break
            }
            if (flag && parseFloat(element.boxWidth) == 0.0) {
              tip = tip + "箱规宽不能为0"
              flag = false
              this.$message.error(tip)
              break
            }
            if (flag && parseFloat(element.boxHeight) == 0.0) {
              tip = tip + "箱规高不能为0"
              flag = false
              this.$message.error(tip)
              break
            }
            if (flag && parseFloat(element.boxWeight) == 0.0) {
              tip = tip + "单箱重量不能为0"
              flag = false
              this.$message.error(tip)
              break
            }
            if (flag) {
              quantity = parseInt(quantity) + parseInt(element.quantity)
            }
          }
          if (flag) {
            sameFlag = true
            for (let i = 0; i < detailBoxList.length; i++) {
              if (element.transferDetailId == detailBoxList[i].transferDetailId) {
                sameFlag = false
                detailBoxList[i].deliveryQuantity =
                  parseInt(detailBoxList[i].deliveryQuantity) + parseInt(element.quantity)
                detailBoxList[i].deliveryBoxs = parseInt(detailBoxList[i].deliveryBoxs) + parseInt(element.boxs)
                detailBoxList[i].tmsTransferDetailBoxList.push({
                  boxs: element.boxs,
                  quantity: element.quantity,
                  boxLength: parseFloat(element.boxLength) * 100,
                  boxWidth: parseFloat(element.boxWidth) * 100,
                  boxHeight: parseFloat(element.boxHeight) * 100,
                  boxWeight: parseFloat(element.boxWeight) * 1000
                })
                if (flag && parseInt(detailBoxList[i].deliveryQuantity) > parseInt(element.transferQuantity)) {
                  tip = tip + "发货数量大于调拨数量"
                  flag = false
                  this.$message.error(tip)
                  break
                }
              }
            }
            if (sameFlag) {
              if (flag && parseInt(element.quantity) > parseInt(element.transferQuantity)) {
                tip = tip + "发货数量大于调拨数量"
                flag = false
                this.$message.error(tip)
                break
              }
              detailBoxList.push({
                transferDetailId: element.transferDetailId,
                corporationId: element.corporationId,
                transferNo: element.transferNo,
                platformSkuCode: element.platformSkuCode,
                skuCode: element.skuCode,
                transferQuantity: element.transferQuantity,
                transferBoxs: element.transferBoxs,
                deliveryQuantity: element.quantity,
                deliveryBoxs: element.boxs,
                taxType: element.taxType,
                tmsTransferDetailBoxList: [
                  {
                    boxs: element.boxs,
                    quantity: element.quantity,
                    boxLength: parseFloat(element.boxLength) * 100,
                    boxWidth: parseFloat(element.boxWidth) * 100,
                    boxHeight: parseFloat(element.boxHeight) * 100,
                    boxWeight: parseFloat(element.boxWeight) * 1000
                  }
                ]
              })
            }
          }
        }
      }
      if (flag && parseInt(quantity) <= 0) {
        flag = false
        this.$message.error("调拨单发货数量必须大于0")
      }
      if (!flag) {
        detailBoxList = []
      }
      return detailBoxList
    },
    // 到货确认数据校验
    checkConfirmArrivalData() {
      let flag = true
      let quantity = 0
      const data = this.confirmArrival.tableData
      if (!data || data.length == 0) {
        this.$message.error("没有可操作数据")
        return false
      }
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        if (flag && Number(element.currentReceivingBoxs) > Number(element.currentReceivingQuantity)) {
          flag = false
          this.$message.error("平台SKU:" + element.platformSkuCode + ",到货箱数 > 到货数量")
        }
        if (
          flag &&
          Number(element.currentReceivingQuantity) >
            Number(element.deliveryQuantity) - Number(element.receivingQuantity)
        ) {
          flag = false
          this.$message.error("平台SKU:" + element.platformSkuCode + ",本次到货数量 > 发货数量 - 已到货数量")
        }
        if (
          flag &&
          Number(element.currentReceivingBoxs) > Number(element.deliveryBoxs) - Number(element.receivingBoxs)
        ) {
          flag = false
          this.$message.error("平台SKU:" + element.platformSkuCode + ",本次到货箱数 > 发货箱数 - 已到货箱数")
        }
        quantity = quantity + parseInt(element.currentReceivingQuantity)
      }
      if (quantity === 0) {
        flag = false
        this.$message.error("到货数量 = 0")
      }
      return flag
    },
    //强制完成
    handleForceFinish() {
      let status = 6
      let operation = "强制完成"
      let isOne = false
      if (this.clickValidate(status, operation, isOne)) {
        let _this = this
        this.$confirm("是否确认强制完成选中调拨单", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(function () {
            _this.loading = true
            return forceFinishObj(_this.list, _this.transferType)
          })
          .then((response) => {
            this.handleResponse(response, "forceFinish", operation)
          })
          .catch((res) => {})
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
      formdata.append("transferType", this.transferType)
      importLogisticsNo(formdata).then((response) => {
        this.handleResponse(response, "uploadFile", "上传")
      })
    },
    //下载导入物流单号模板
    downloadTemplate() {
      // window.location = getUrlConcatToken(`/api/transfer/tmstransfer/export/template/import-logisticsNo-excel`);
      window.location = getTokenUrl("yiyuan/tmsTransfer/导入物流单号模板.xls")
    },
    //清关导出
    clearDeclareExport() {
      if (!this.selectList || this.selectList.length != 1) {
        this.$message.warning("请勾选一条数据")
        return
      }
      // if (!this.selectList[0].declareCustomNo) {
      //   this.$message.error("该数据没有报关单号");
      //   return;
      // }
      window.location =
        getUrlConcatToken(`/api/transfer/tmstransfer/exportCustomsClearanceExcel`) +
        "&transferNo=" +
        this.selectList[0].transferNo
    },
    //下载附件
    download(url) {
      if (!url) {
        this.$message.warning("未上传调拨附件")
        return
      }
      window.location = getTokenUrl(url)
    },
    //处理响应
    handleResponse(response, operationCode, operation) {
      this.loading = false
      if (response.data.code == 0) {
        this.clearSelectClear()
        this.handleSearchFilter()
        this.getList(this.page, this.searchFormConfirm)
        if (operationCode == "audit") {
          this.auditDialog = false
        } else if (operationCode == "saleAudit") {
          this.saleAuditDialog = false
        } else if (operationCode == "stockout") {
          this.stockoutDialog = false
        } else if (operationCode == "confirmArrival") {
          this.confirmArrivalDialog = false
        } else if (operationCode == "uploadFile") {
          this.uploadDialog = false
        } else if (operationCode == "update") {
          this.logisticsProviderDialog = false
        } else if (operationCode == "updateTransportMode") {
          this.transportModeDialog = false
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
        if (operationCode == "audit") {
          this.auditDialog = false
        } else if (operationCode == "saleAudit") {
          this.saleAuditDialog = false
        } else if (operationCode == "stockout") {
          this.stockoutDialog = false
        } else if (operationCode == "confirmArrival") {
          this.confirmArrivalDialog = false
        } else if (operationCode == "uploadFile") {
          this.uploadDialog = false
        } else if (operationCode == "update") {
          this.logisticsProviderDialog = false
        } else if (operationCode == "updateTransportMode") {
          this.transportModeDialog = false
        }
        this.$message.error(response.data.msg)
        return
      } else {
        this.$message.error("操作失败")
        return
      }
    },
    //重置表格验证
    formReset(formName) {
      this.$refs[formName].resetFields()
    },
    getList(page, params) {
      this.tableLoading = true
      // this.page.currentPage=page.currentPage;
      this.searchFormConfirm.transferType = this.transferType
      this.searchFormConfirm.transferStatusAll =
        this.tabPosition[parseInt(this.tabPositionModel)].transferStatusArr.join(",")
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
        this.tableData = response.data.data.ipage.records
        this.page.total = response.data.data.ipage.total
        const countMap = response.data.data.countMap
        for (let index = 0; index < 7; index++) {
          const element = this.tabPosition[index]
          element.count = 0
          for (let index = 0; index < element.transferStatusArr.length; index++) {
            if (countMap[element.transferStatusArr[index]]) {
              element.count = element.count + countMap[element.transferStatusArr[index]]
            }
          }
        }
        this.tableLoading = false
      })
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
      if (this.searchFormConfirm.warehouseOutId) {
        this.searchFormConfirm.warehouseOutId = this.searchFormConfirm.warehouseOutId.join(",")
      }
      if (this.searchFormConfirm.corporationId) {
        this.searchFormConfirm.corporationId = this.searchFormConfirm.corporationId.join(",")
      }
      if (this.searchFormConfirm.warehouseInId) {
        this.searchFormConfirm.warehouseInId = this.searchFormConfirm.warehouseInId.join(",")
      }
      if (this.searchFormConfirm.transferStatus) {
        this.searchFormConfirm.transferStatus = this.searchFormConfirm.transferStatus.join(",")
      }
      if (this.searchFormConfirm.transportModeId) {
        this.searchFormConfirm.transportModeId = this.searchFormConfirm.transportModeId.join(",")
      }
      if (this.searchFormConfirm.transportCarrierId) {
        this.searchFormConfirm.transportCarrierId = this.searchFormConfirm.transportCarrierId.join(",")
      }
      if (this.searchFormConfirm.time && this.searchFormConfirm.time.length == 2) {
        this.searchFormConfirm.startTime = this.searchFormConfirm.time[0]
        this.searchFormConfirm.endTime = this.searchFormConfirm.time[1]
      } else {
        this.searchFormConfirm.startTime = ""
        this.searchFormConfirm.endTime = ""
      }
      if (this.searchFormConfirm.outStockTime && this.searchFormConfirm.outStockTime.length == 2) {
        this.searchFormConfirm.outStockTimeStart = this.searchFormConfirm.outStockTime[0]
        this.searchFormConfirm.outStockTimeEnd = this.searchFormConfirm.outStockTime[1]
      } else {
        this.searchFormConfirm.outStockTimeStart = ""
        this.searchFormConfirm.outStockTimeEnd = ""
      }
      this.searchFormConfirm.time = ""
      this.searchFormConfirm.outStockTime = ""
      if (this.searchFormConfirm.taxType) {
        this.searchFormConfirm.taxType = this.searchFormConfirm.taxType.join(",")
      }
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
      // this.handleSearchFilter();
      this.getList(this.page, this.searchFormConfirm)
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      // this.handleSearchFilter();
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
    //跳转到详情页面
    openNewPage: function (transferNo) {
      this.$router.push({
        path: "/transfer/detail/" + this.transferType,
        query: {
          transferType: this.transferType
        }
      })
    },
    //查看操作日志
    showOperateLog: function (transferNo) {
      this.$refs.pooperatelog.showOperateLogDialog(transferNo, 1)
    },
    //查看SKU详情
    showSkuDetail: function (transferNo) {
      this.dialogTitil = "产品详情"
      getPlatformSkuInfo(transferNo).then((response) => {
        this.skuTableData = response.data.data
        this.skuDialog = true
      })
    },
    //查询仓库
    getAllWarehouse: function () {
      var query = {}
      this.warehouseOutOptions = []
      this.warehouseInOptions = []
      getAllWarehouse(query).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          for (let index = 0; index < data.length; index++) {
            const element = data[index]
            if (this.transferType == 1) {
              //国内调海外
              if (element.warehouseTypeCode == "GN") {
                this.warehouseOutOptions.push(element)
              }
              if (element.warehouseTypeCode == "HW" && element.providerCode != "FBA") {
                this.warehouseInOptions.push(element)
              }
            } else if (this.transferType == 2) {
              //国内调FBA
              if (element.warehouseTypeCode == "GN") {
                this.warehouseOutOptions.push(element)
              }
              if (element.warehouseTypeCode == "HW" && element.providerCode == "FBA") {
                this.warehouseInOptions.push(element)
              }
            } else if (this.transferType == 3) {
              //海外调FBA
              if (element.warehouseTypeCode == "HW" && element.providerCode != "FBA") {
                this.warehouseOutOptions.push(element)
              }
              if (element.warehouseTypeCode == "HW" && element.providerCode == "FBA") {
                this.warehouseInOptions.push(element)
              }
            } else if (this.transferType == 4) {
              //海外互转
              if (element.warehouseTypeCode == "HW" && element.providerCode != "FBA") {
                this.warehouseOutOptions.push(element)
              }
              if (element.warehouseTypeCode == "HW" && element.providerCode != "FBA") {
                this.warehouseInOptions.push(element)
              }
            } else if (this.transferType == 5) {
              //国内互转
              if (element.warehouseTypeCode == "GN") {
                this.warehouseOutOptions.push(element)
              }
              if (element.warehouseTypeCode == "GN") {
                this.warehouseInOptions.push(element)
              }
            }
          }
        }
      })
    },
    //获取法人主体
    getBsecorporationAll: function () {
      var query = {}
      getBsecorporationAll(query).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.corporationOptions = data
        }
      })
    },
    //查询运输方式
    getBsetransportmodesAll: function () {
      var params = {
        isUse: false
      }
      getBsetransportmodesAll(params).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.transportModeOptionsAll = data
          //当前可用运输方式
          this.transportModeOptions = deepClone(data).filter((obj) => {
            return obj.approveStatus === 2 && obj.delFlag === "0"
          })
        }
      })
    },
    //查询柜型
    getBsetransportcabinettypeAll: function () {
      var query = {
        delFlag: "0"
      }
      getBsetransportcabinettypeAll(query).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.transportCabinetTypeOptionsAll = data
          //当前运输方式柜型
          this.transportCabinetTypeOptions = deepClone(data).filter((obj) => {
            return obj.transportModeId == this.audit.transportModeId
          })
        }
      })
    },
    //查询物流商
    getBsetransportcarrierAll: function () {
      var query = {}
      getBsetransportcarrierAll(query).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.transportCarrierOptions = deepClone(data)
          this.transportCarrierUsableOptions = data.filter((obj) => {
            return obj.approveStatus == 2 && obj.delFlag == "0"
          })
        }
      })
    },
    //运输方式变更事件
    handleSelectTransportMode: function (item) {
      //置空柜型
      this.$set(this.audit, "transportCabinetTypeId", "")
      let options = this.transportModeOptions.filter((obj) => {
        return obj.transportModeId == item
      })
      if (options.length == 1) {
        let opt = options[0]
        this.$set(this.audit, "involveCabinetFlag", opt.involveCabinetFlag)
        //如果选择运输方式涉及组柜，则需选择柜型
        if (opt.involveCabinetFlag === 1) {
          this.transportCabinetTypeOptions = []
          if (!this.transportCabinetTypeOptionsAll || this.transportCabinetTypeOptionsAll.length == 0) {
            this.getBsetransportcabinettypeAll()
          } else {
            //当前运输方式柜型
            this.transportCabinetTypeOptions = deepClone(this.transportCabinetTypeOptionsAll).filter((obj) => {
              return obj.transportModeId == item
            })
          }
        }
      } else {
        this.$set(this.audit, "involveCabinetFlag", "")
      }
    },
    //物流商维护
    changeLogisticsProvider() {
      //this.canChangeLogisticsProvider=""
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      for (let i = 0; i < this.selectList.length; i++) {
        var selectData = this.selectList[i]
        if (selectData.transferStatus != 3 && selectData.transferStatus != 4) {
          let options = this.transferStatusOptions.filter((obj) => {
            return obj.value == selectData.transferStatus
          })
          this.$message.error(
            "调拨单：" + selectData.transferNo + "，状态为：" + options[0].label + "，不允许更新物流商"
          )
          return
        }
      }
      this.canChangeLogisticsProvider = ""
      // this.getBsetransportcarrierAll();
      this.logisticsProviderDialog = true
    },
    cancelLogistics() {
      this.logisticsProviderDialog = false
    },
    confirmLogistics: function () {
      // if(this.canChangeLogisticsProvider==this.canChangeLogisticsProviderOld.transportCarrierId){
      //   this.$message.error('物流商不能同当前单据选择的物流商一致');
      //   return;
      //  };
      let operation = "更新物流商"
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      if (this.canChangeLogisticsProvider == null || this.canChangeLogisticsProvider == "") {
        this.$message.error("请选择服务商")
        return
      }
      var transferNoArray = []
      for (let i = 0; i < this.selectList.length; i++) {
        var selectData = this.selectList[i]
        if (selectData.transferStatus != 3 && selectData.transferStatus != 4) {
          let options = this.transferStatusOptions.filter((obj) => {
            return obj.value == selectData.transferStatus
          })
          this.$message.error(
            "调拨单：" + selectData.transferNo + "，状态为：" + options[0].label + "，不允许更新物流商"
          )
          return
        }
        transferNoArray.push(selectData.transferNo)
      }

      updateLogisticsProvider({
        transferNo: transferNoArray.join(","),
        transportCarrierId: this.canChangeLogisticsProvider,
        transferType: this.transferType
      }).then((response) => {
        this.handleResponse(response, "update", operation)
      })
    },

    //运输方式维护
    changeTransportMode() {
      //this.canChangeLogisticsProvider=""
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      for (let i = 0; i < this.selectList.length; i++) {
        var selectData = this.selectList[i]
        if (selectData.transferStatus != 3 && selectData.transferStatus != 4) {
          let options = this.transferStatusOptions.filter((obj) => {
            return obj.value == selectData.transferStatus
          })
          this.$message.error(
            "调拨单：" + selectData.transferNo + "，状态为：" + options[0].label + "，不允许更新运输方式"
          )
          return
        }
      }
      this.canChangeTransportMode = ""
      // this.getBsetransportcarrierAll();
      this.transportModeDialog = true
    },
    cancelTransportMode() {
      this.transportModeDialog = false
    },
    confirmTransportMode: function () {
      // if(this.canChangeLogisticsProvider==this.canChangeLogisticsProviderOld.transportCarrierId){
      //   this.$message.error('物流商不能同当前单据选择的物流商一致');
      //   return;
      //  };
      let operation = "更新运输方式"
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("请勾选数据")
        return
      }
      if (this.canChangeTransportMode == null || this.canChangeTransportMode == "") {
        this.$message.error("请选择运输方式")
        return
      }
      var transferNoArray = []
      for (let i = 0; i < this.selectList.length; i++) {
        var selectData = this.selectList[i]
        if (selectData.transferStatus != 3 && selectData.transferStatus != 4) {
          let options = this.transferStatusOptions.filter((obj) => {
            return obj.value == selectData.transferStatus
          })
          this.$message.error(
            "调拨单：" + selectData.transferNo + "，状态为：" + options[0].label + "，不允许更新物流商"
          )
          return
        }
        transferNoArray.push(selectData.transferNo)
      }

      updateTransportMode({
        transferNo: transferNoArray.join(","),
        transportModeId: this.canChangeTransportMode,
        transferType: this.transferType
      }).then((response) => {
        this.handleResponse(response, "updateTransportMode", operation)
      })
    }
  }
}
</script>
<style lang="css" scoped>
.attachmentFileName {
  padding: 10px 0;
}
</style>
