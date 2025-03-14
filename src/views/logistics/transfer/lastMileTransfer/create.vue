<template>
  <div id="createTms">
    <basic-container>
      <!-- 详情模块 -->
      <div class="iod-target-top" v-if="state === 'detail'">
        <el-form label-width="90px">
          <detail-wrapper :options="{ title: '单号信息' }">
            <el-row>
              <el-col :span="6">
                <el-form-item label="调拨单号：">
                  <el-input v-model="baseInfo.transferNo" placeholder="暂无数据" size="small" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="内部交易订单：" label-width="110px">
                  <div style="display: flex">
                    <el-input
                      v-model="baseInfo.internalTransactionOrderNo"
                      placeholder="暂无数据"
                      size="small"
                      disabled
                    ></el-input>
                    <router-link
                      style="margin-left: 20px; width: 50px"
                      :to="{
                        path: '/transfer/fristMileTransfer/internalOrderDetail',
                        query: {
                          internalTransactionOrderNo: baseInfo.internalTransactionOrderNo,
                          transferId: this.transferId
                        }
                      }"
                      >查看</router-link
                    >
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="状态" label-width="50px">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="baseInfo.internalTransactionOrderStats"
                    filterable
                    placeholder="暂无数据"
                    disabled
                  >
                    <el-option
                      v-for="item in internalStatus"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="内部交易合同" label-width="110px">
                  <div style="display: flex">
                    <el-input
                      v-model="baseInfo.internalTransactionContractNo"
                      placeholder="暂无数据"
                      size="small"
                      disabled
                    ></el-input>
                    <router-link
                      style="margin-left: 20px; width: 50px"
                      :to="'/purchase/internalContract/detail?contractNo=' + baseInfo.internalTransactionContractNo"
                      >查看</router-link
                    >
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </detail-wrapper>
        </el-form>
      </div>

      <div class="iod-target-top">
        <el-form label-width="80px" :model="baseInfo" :rules="baseRules" ref="baseForm">
          <!--基础信息模块-->
          <detail-wrapper :options="{ title: '基础信息' }">
            <el-row>
              <el-col :span="6">
                <el-form-item label="调拨类型" prop="transferType">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="baseInfo.transferType"
                    filterable
                    placeholder="请选择"
                    @change="toTransferBusinessType"
                    :disabled="state !== 'add' && transferStatus !== 'TO_BE_SUBMITTED'"
                  >
                    <el-option
                      v-for="item in transferTypeArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="业务类型" prop="transferBusinessType">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="baseInfo.transferBusinessType"
                    filterable
                    placeholder="请选择"
                    @change="toTransferBusinessType"
                    :disabled="state !== 'add' && transferStatus !== 'TO_BE_SUBMITTED'"
                  >
                    <el-option
                      v-for="item in transferBusinessTypeArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="调出库存组织" prop="transferOutOrgId" label-width="110px">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="baseInfo.transferOutOrgId"
                    filterable
                    placeholder="请选择"
                    @change="handleTransferOut"
                    :disabled="
                      (state !== 'add' && transferStatus !== 'TO_BE_SUBMITTED') || !baseInfo.transferBusinessType
                    "
                  >
                    <el-option
                      v-for="item in corporationOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="调入库存组织" prop="transferInOrgId" label-width="110px">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="baseInfo.transferInOrgId"
                    filterable
                    placeholder="请选择"
                    @change="handleTransferIn"
                    :disabled="
                      (state !== 'add' && transferStatus !== 'TO_BE_SUBMITTED') ||
                      baseInfo.transferBusinessType === 'NORMAL' ||
                      !baseInfo.transferBusinessType
                    "
                  >
                    <el-option
                      v-for="item in corporationOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="baseInfo.transferBusinessType !== 'NORMAL' && baseInfo.transferOutOrgId === item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="转出仓" prop="fmWarehouseId">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="baseInfo.fmWarehouseId"
                    filterable
                    placeholder="请选择"
                    @change="handleFmWarehouse"
                    :disabled="(state !== 'add' && transferStatus !== 'TO_BE_SUBMITTED') || !baseInfo.transferOutOrgId"
                  >
                    <el-option
                      v-for="item in warehouseFm"
                      :key="item.warehouseId"
                      :label="item.warehouseName"
                      :value="item.warehouseId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="起运国家" prop="fmCountryCode">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="baseInfo.fmCountryCode"
                    filterable
                    placeholder="请选择"
                    disabled
                  >
                    <el-option
                      v-for="item in countryOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="目的仓" prop="toWarehouseId">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="baseInfo.toWarehouseId"
                    filterable
                    placeholder="请选择"
                    @change="handleToWarehouse"
                    :disabled="
                      (state !== 'add' &&
                        transferStatus !== 'TO_BE_SUBMITTED' &&
                        transferStatus !== 'WAIT_DELIVERY' &&
                        transferStatus !== 'IN_TRANSIT') ||
                      !baseInfo.transferInOrgId
                    "
                  >
                    <el-option
                      v-for="item in warehouseTo"
                      :key="item.warehouseId"
                      :label="item.warehouseName"
                      :value="item.warehouseId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="目的国家" prop="toCountryCode">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="baseInfo.toCountryCode"
                    filterable
                    placeholder="请选择"
                    disabled
                  >
                    <el-option
                      v-for="item in countryOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="调拨方式" prop="transferMode">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="baseInfo.transferMode"
                    filterable
                    placeholder="请选择"
                    :disabled="state === 'detail' || transferStatus === 'IN_TRANSIT' || !baseInfo.toWarehouseId"
                  >
                    <el-option
                      v-for="item in filterTransferModelOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="预计出库时间" prop="estimateOutStockTime" label-width="110px">
                  <el-date-picker
                    class="custom-date-picker"
                    v-model="baseInfo.estimateOutStockTime"
                    size="mini"
                    clearable
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择预计出库时间"
                    :disabled="state === 'detail'"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="预计到达时间" prop="estimateArrivalTime" label-width="110px">
                  <el-date-picker
                    class="custom-date-picker"
                    v-model="baseInfo.estimateArrivalTime"
                    size="mini"
                    clearable
                    type="date"
                    @change="handleTime"
                    value-format="yyyy-MM-dd"
                    placeholder="选择预计到达时间"
                    :disabled="state === 'detail'"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" style="padding: 5px 0">
                <el-form-item label="备注" prop="remark" label-width="50px">
                  <el-input
                    class="custom-input"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                    v-model="baseInfo.remark"
                    :disabled="state === 'detail'"
                  >
                  </el-input>
                  <!-- <el-input size="mini" v-search-input-trim v-model="baseInfo.productName" placeholder="请输入产品名称"></el-input> -->
                </el-form-item>
              </el-col>
            </el-row>
          </detail-wrapper>
        </el-form>
      </div>

      <!--物流信息模块-->
      <div class="iod-target-top" v-if="false">
        <el-form label-width="80px" :model="transferInfo" :rules="transferRules" ref="transferForm">
          <detail-wrapper :options="{ title: '物流信息' }">
            <el-row>
              <el-col :span="6">
                <el-form-item label="装柜方式" prop="freightContainerMode">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="transferInfo.freightContainerMode"
                    filterable
                    placeholder="请选择"
                    :disabled="state === 'detail' || transferStatus === 'IN_TRANSIT'"
                  >
                    <el-option
                      v-for="item in filterFreightContainerModeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="箱型" prop="containerModel">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="transferInfo.containerModel"
                    filterable
                    placeholder="请选择"
                    :disabled="state === 'detail' || transferStatus === 'IN_TRANSIT'"
                  >
                    <el-option
                      v-for="item in filterContainerModelOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="柜号" prop="containerNo">
                  <el-input
                    class="inputContainer custom-input"
                    size="mini"
                    v-search-input-trim
                    v-model="transferInfo.containerNo"
                    placeholder="请输入柜号"
                    :disabled="state === 'detail'"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="运输公司" prop="logisticsTransportCode">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="transferInfo.logisticsTransportCode"
                    filterable
                    placeholder="请选择"
                    :disabled="state === 'detail' || transferStatus === 'IN' || transferStatus === 'PART_IN'"
                    @change="geFail"
                  >
                    <el-option
                      v-for="item in logisticsTransportCodeOptions"
                      :key="item.transportCarrierCode"
                      :label="item.carrierShortName"
                      :value="item.transportCarrierCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="货代公司" prop="forwarderTransportCode">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="transferInfo.forwarderTransportCode"
                    filterable
                    placeholder="请选择"
                    :disabled="state === 'detail' || transferStatus === 'IN' || transferStatus === 'PART_IN'"
                    @change="geFail"
                  >
                    <el-option
                      v-for="item in forwarderTransportCodeOptions"
                      :key="item.transportCarrierCode"
                      :label="item.carrierShortName"
                      :value="item.transportCarrierCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="清关公司" prop="clearanceTransportCode">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="transferInfo.clearanceTransportCode"
                    filterable
                    placeholder="请选择"
                    :disabled="state === 'detail' || transferStatus === 'IN' || transferStatus === 'PART_IN'"
                    @change="geFail"
                  >
                    <el-option
                      v-for="item in clearanceTransportCodeOptions"
                      :key="item.transportCarrierCode"
                      :label="item.carrierShortName"
                      :value="item.transportCarrierCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="派送公司" prop="sendTransportCode">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="transferInfo.sendTransportCode"
                    filterable
                    placeholder="请选择"
                    :disabled="state === 'detail' || transferStatus === 'IN' || transferStatus === 'PART_IN'"
                    @change="geFail"
                  >
                    <el-option
                      v-for="item in sendTransportCodeOptions"
                      :key="item.transportCarrierCode"
                      :label="item.carrierShortName"
                      :value="item.transportCarrierCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </detail-wrapper>
        </el-form>
      </div>

      <!-- 详情调拨费用  -->
      <div class="iod-target-top">
        <detail-wrapper :options="{ title: '调拨费用' }">
          <div class="validate_wrapper">
            <avue-crud
              ref="crud"
              v-model="form"
              :data="costTableData"
              :option="lastCostTableOption"
              @row-del="delRowAttr"
              class="handle-cell-hidden"
            >
              <!-- 物流商 -->
              <template slot="transportCode" slot-scope="{ row }">
                <el-select
                  v-model="row.transportCode"
                  @change="transportCodeChange"
                  filterable
                  placeholder="请选择"
                  size="mini"
                  :disabled="state === 'detail'"
                >
                  <el-option
                    v-for="item in transportCarrierOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>

              <!-- 费用类型 -->
              <template slot="costType" slot-scope="{ row }">
                <el-select
                  size="mini"
                  clearable
                  v-model="row.costType"
                  filterable
                  placeholder="请选择"
                  :disabled="
                    state === 'detail' ||
                    (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED' && transferStatus !== 'WAIT_DELIVERY')
                  "
                >
                  <el-option
                    v-for="item in costList"
                    :key="item.tmsLogisticsCostTypeCode"
                    :label="item.tmsLogisticsCostTypeName"
                    :value="item.tmsLogisticsCostTypeCode"
                  ></el-option>
                </el-select>
              </template>

              <template slot="cost" slot-scope="{ row }">
                <el-input
                  class="el-input--append"
                  v-model="row.cost"
                  @change="validateNumber($event, row, 'cost')"
                  placeholder="请输入"
                  :disabled="state === 'detail' || transferStatus === 'IN' || transferStatus === 'PART_IN'"
                  size="mini"
                >
                  <el-select
                    v-model="row.costCurrency"
                    :disabled="state === 'detail' || transferStatus === 'IN' || transferStatus === 'PART_IN'"
                    slot="append"
                    placeholder="币种"
                    class="el-select--append"
                  >
                    <el-option
                      :label="item.currency"
                      :value="item.currency"
                      v-for="item in currencyArr"
                      :key="item.currency"
                    ></el-option>
                  </el-select>
                </el-input>
              </template>

              <template slot="operate" slot-scope="{ row }">
                <div
                  v-if="
                    state === 'detail' ||
                    (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED' && transferStatus !== 'WAIT_DELIVERY')
                  "
                ></div>
                <div v-else>
                  <el-button
                    type="text"
                    style="padding: 10px 0"
                    @click="addCost(row)"
                    v-if="row.$index === costTableData.length - 1 && state !== 'detail'"
                    >添加</el-button
                  >
                  <el-button type="text" style="padding: 10px 0; color: rgb(140, 9, 9)" @click="deleteCost(row)"
                    >删除</el-button
                  >
                </div>
              </template>
            </avue-crud>
            <div style="margin: 10px 0 10px 10px; border-top: 1px solid #efefef">
              <p style="margin: 10px 0 2px"><b>对账单列表:</b></p>
              <ul>
                <li v-for="(item, index) in statementDownloadsList" :key="index" style="padding: 3px 0px">
                  <span>{{ index + 1 }}.</span>
                  <span style="display: inline-block">
                    {{ "对账单" }}{{ index + 1 }}{{ "号" }}
                    <i class="icon-xiazai y-icon-edit" style="margin-left: 15px" @click="download(item.fileId)"></i>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </detail-wrapper>
      </div>

      <!--产品信息模块-->
      <div class="iod-target-top">
        <el-form>
          <detail-wrapper :options="{ title: '产品信息' }">
            <div class="validate_wrapper">
              <avue-crud
                ref="crud"
                :data="createTableData"
                :option="createFinalTableOption"
                @row-del="delRowAttr"
                class="handle-cell-hidden"
              >
                <template slot="menuLeft">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="addByNo"
                    :disabled="state === 'detail'"
                    v-if="state === 'add' || transferStatus === 'TO_BE_SUBMITTED'"
                    >添加产品</el-button
                  >
                </template>
                <template slot="abnormalType" slot-scope="{ row }">
                  <el-select v-model="row.abnormalType" size="mini" disabled>
                    <el-option
                      v-for="item in inAbnormalOptions"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    ></el-option>
                  </el-select>
                </template>
                <template slot="operation" slot-scope="{ row }">
                  <a @click="deleteInNo(row.$index)" v-if="state === 'add' || transferStatus === 'TO_BE_SUBMITTED'"
                    >删 除</a
                  >
                </template>
              </avue-crud>
              <!-- <el-row>
                <el-col :span="8">
                  <el-form-item>
                    <span style="white-space: nowrap; vertical-align: baseline">SKU总数量：{{ skuTotal }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <span style="white-space: nowrap; vertical-align: baseline">预估包装总重量(kg)：{{
                      skuPackageWightTotal }}</span>
                  </el-form-item>

                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <div style="display: flex; align-items: center">
                      <span style="white-space: nowrap; vertical-align: baseline">实际包装总重量(kg)：</span>
                      <el-input class="custom-input" v-model="productInfo.totalWeight" size="mini" style="width: 100px"
                        :disabled="state === 'detail'"></el-input>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item>
                    <span style="white-space: nowrap; vertical-align: baseline">预估包装总体积(cm³)：{{ skuPackageVolumeTotal
                    }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <div style="display: flex; align-items: center">
                      <span style="white-space: nowrap; vertical-align: baseline">实际包装总体积(cm³)：</span>
                      <el-input class="custom-input" v-model="productInfo.totalVolume" size="mini" style="width: 100px"
                        :disabled="state === 'detail'"></el-input>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <span style="white-space: nowrap; vertical-align: baseline">$总货值：{{ skuTotalMoney }}</span>
                  </el-form-item>
                </el-col>
              </el-row> -->
            </div>
          </detail-wrapper>
        </el-form>
      </div>

      <!-- <div class="iod-target-top border-rang margin-top-20" v-if="state === 'detail'">
        <p class="iod-target target-title">操作日志</p>
        <div class="validate_wrapper">
          <avue-crud ref="crud" :page="page" :data="tableData" :option="newTableOption" @current-change="currentChange"
            @size-change="sizeChange" @search-change="handleFilter" @search-reset="searchReset"
            @refresh-change="refreshChange" @row-update="handleUpdate" @row-save="handleSave"
            @row-del="rowDel"></avue-crud>
        </div>
      </div> -->
      <div class="iod-target-top" v-if="state === 'detail'">
        <detail-wrapper :options="{ title: '操作日志' }">
          <operationlog ref="operationlog"></operationlog>
        </detail-wrapper>
      </div>

      <!--底端按钮模块-->

      <div class="y-submit">
        <el-button
          size="small"
          type="primary"
          @click="saveTransfer('save')"
          :loading="buttonLoading"
          :disabled="buttonLoading"
          v-if="state === 'add' || transferStatus === 'TO_BE_SUBMITTED'"
          >保 存</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="submitTransfer('submit')"
          :loading="buttonLoading"
          :disabled="buttonLoading"
          v-if="state !== 'detail'"
          >保存并提交</el-button
        >
      </div>
    </basic-container>
    <el-dialog
      title="添加产品"
      :visible.sync="addByNoVisible"
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :inline="true" :model="searchForm" ref="addForm">
        <el-row>
          <el-col :span="6">
            <el-form-item label="标准SPU" style="margin-bottom: 0">
              <el-input
                v-model="searchForm.spuCode"
                v-search-input-trim
                v-search-input
                placeholder="多个SPU,请用英文,分隔"
                size="mini"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SKU" style="margin-bottom: 0">
              <el-input
                v-model="searchForm.skuCode"
                v-search-input-trim
                v-search-input
                placeholder="多个SKU,请用英文,分隔"
                size="mini"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品名称" style="margin-bottom: 0">
              <el-input
                v-model="searchForm.skuName"
                v-search-input-trim
                v-search-input
                placeholder="多个产品名称,请用英文,分隔"
                size="mini"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="onSearch" size="mini">搜索</el-button>
              <el-button @click="onClear" size="mini">清空</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table :data="addFormData" @selection-change="handleSelect" border>
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="标准SPU" prop="spuCode"></el-table-column>
        <el-table-column label="SKU" prop="skuCode"></el-table-column>
        <el-table-column label="产品名称" prop="skuName"></el-table-column>
        <el-table-column label="法人主体" prop="corporationName"></el-table-column>
        <el-table-column label="平台" prop="platform"></el-table-column>
        <el-table-column label="站点" prop="site"></el-table-column>
        <el-table-column label="ERP可用库存" prop="availableQuantity"></el-table-column>
        <el-table-column label="海外仓可用库存" prop="overseaAvailableQuantity"></el-table-column>
        <el-table-column label="计划调拨数量" prop="planQuantity">
          <template slot-scope="scope">
            <el-input-number
              style="width: 100%"
              v-model="scope.row.planQuantity"
              :controls="false"
              :min="0"
              size="mini"
            ></el-input-number>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addConfirm">添加到调拨单</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import attrcombin from "./attrcombin"
// import pricevue from "./price"
import { mapGetters } from "vuex"
import { getAll as getAllCurrency } from "@/api/baseSetup/bsecurrency"
import { getCarriers } from "@/api/logistics/transfer/tmstransfercost"
import {
  getStockQueryGroupIn,
  transferSave,
  transferUpdate,
  finalSave,
  getDetailInfo,
  getFinalInfo,
  getCarriersByWarehouse,
  getCostInfoById,
  getTransferLogisticsTransport,
  downloadImgAndPdf,
  getTransferFinalProduct,
  costListAll
} from "@/api/logistics/transfer/fristMileTransfer"
import { queryCustomsCodeList } from "@/api/product/prdrelatedelements"
import { getTokenUrl } from "@/util/auth"
import { preventShake, validateInput, limitFilesMaxSize } from "@/util/tool"
import preview from "@/components/yvue/pdf/index"
import operationlog from "@/views/logistics/transfer/fristMileTransfer/log"
import { setTimeout } from "timers"
import { getObjByType } from "@/api/admin/dict"
import { deepClone } from "../../../../util/util"
import {
  createTableOption,
  lastCostTableOption,
  lastBaseRules,
  transferRules,
  costInfoRules,
  createFinalTableOption
} from "@/const/crud/logistics/transfer/fristMileTransfer"
import { getAllWarehouse, getWarehouseByCorpCodeApi } from "@/api/baseSetup/bsewarehouse"
import { getCountry } from "@/api/baseSetup/bsecountry"
import { getAll as getBsecorporationAll } from "@/api/baseSetup/bsecorporation"
import { runInThisContext } from "vm"
export default {
  name: "prdlcreate",
  data() {
    return {
      state: "",
      transferId: "",
      baseInfo: {
        transferOutOrgId: "",
        transferInOrgId: "",
        transferType: "",
        fmWarehouseId: "",
        fmCountryCode: "",
        toWarehouseId: "",
        toCountryCode: "",
        departureHarbour: "",
        intoHarbour: "",
        transferMode: "",
        departureTime: "",
        estimateOutStockTime: "",
        freightContainerTime: "",
        estimateArrivalTime: "",
        estimatePutTime: "",
        transferOutOrgId: "",
        transferInOrgId: "",
        transferBusinessType: "",
        remark: ""
      },
      transferInfo: {
        freightContainerMode: "",
        containerModel: "",
        containerNo: "",
        forwarderTransportCode: "",
        clearanceTransportCode: "",
        sendTransportCode: "",
        logisticsTransportCode: ""
      },
      productInfo: {
        totalWeight: "",
        totalVolume: ""
      },
      lastCostTableOption: lastCostTableOption,
      createFinalTableOption: createFinalTableOption,
      createTableData: [],
      addFormData: [],
      costTableData: [
        // {
        //   transportCarrierCode: "",
        //   cost: null,
        //   costType: "",
        //   costCurrency: "USD",
        // },
      ],
      addByNoVisible: false,
      searchForm: {
        transferOutOrgId: null,
        fmWarehouseId: null,
        spuCode: "",
        skuCode: "",
        skuName: ""
      },
      search: {},
      baseRules: lastBaseRules,
      transferRules: transferRules,
      warehouseOptions: [],
      warehouseFm: [],
      warehouseTo: [],
      countryOptions: [],
      corporationOptions: [],
      transferModeOptions: [],
      freightContainerModeOptions: [],
      containerModelOptions: [],
      forwarderTransportCodeOptions: [],
      clearanceTransportCodeOptions: [],
      sendTransportCodeOptions: [],
      intoHarbourOptions: [],
      departureHarbourOptions: [],
      logisticsTransportCodeOptions: [],
      providerCode: "",
      filterTransferModelOptions: [],
      filterFreightContainerModeOptions: [],
      filterContainerModelOptions: [],
      selectList: [],
      transferStatus: "",
      statementDownloadsList: [],
      currencyArr: [],
      transferBusinessTypeArr: [],
      transferTypeArr: [],
      costInfoRules: costInfoRules,
      inAbnormalOptions: [],
      internalStatus: [],
      costType: [{ value: "WAREHOUSE_TRANSFER" }],
      transferTransportCostDetailVOS: [],
      isChangeFlag: false,
      transportCarrierOptions: [],
      costList: []
    }
  },
  components: {
    operationlog
  },
  created() {
    //查看单据编号下的所有信息
    this.init()
    this.transferId = this.$route.query.id
    this.state = this.$route.query.type

    getObjByType("in_abnormal_type").then((res) => {
      if (res.data.code === 0) {
        this.inAbnormalOptions = res.data.data
      }
    })
    getObjByType("transfer_business_type").then((res) => {
      if (res.data.code === 0) {
        this.transferBusinessTypeArr = res.data.data
      }
    })
    getObjByType("transfer_type").then((res) => {
      if (res.data.code === 0) {
        let data = res.data.data.filter((item) => item.value !== "HEAD")
        this.transferTypeArr = data
      }
    })
    getObjByType("internal_transaction_order_stats").then((res) => {
      if (res.data.code === 0) {
        this.internalStatus = res.data.data
      }
    })
    // getObjByType("logistics_cost_type").then((res) => {
    //   if (res.data.code === 0) {
    //     this.costType = res.data.data;
    //   }
    // });
    costListAll().then((res) => {
      if (res.data.code === 0) {
        this.costList = res.data.data

        this.costTableData.push({
          transportCode: "",
          cost: null,
          costType: "WAREHOUSE_TRANSFER",
          costCurrency: "USD"
        })
      }
    })
  },
  activated() {
    this.isChangeFlag = false
    if (this.state !== "add") {
      this.watchDetailById(this.transferId)
    }
    if (this.state === "detail") {
      // getCostInfoById({ transferId: this.transferId }).then((res) => {
      //   if (res.data.code === 0) {
      //     this.costTableData = res.data.data.costDetails;
      //   }
      // });
      this.$refs.operationlog.showOperateLogDialog(this.transferId, "Transfer", true)
    }
  },
  mounted() {
    // if (this.state !== 'add') {
    //   this.watchDetailById(this.transferId)
    // }
    // if (this.state === 'detail') {
    //   getCostInfoById({ transferId: this.transferId }).then(res => {
    //     if (res.data.code === 0) {
    //       this.costTableData = res.data.data.costDetails
    //     }
    //     console.log('costDetails', res.data.data.costDetails)
    //   })
    // }
  },
  computed: {
    ...mapGetters(["permissions"]),
    formatInNo: {
      get() {
        return this.searchForm.inNo.replace(/\s|\n/g, ",")
      },
      set(value) {
        this.searchForm.inNo = value
      }
    },
    formatPurchaseNo: {
      get() {
        return this.searchForm.purchaseNo.replace(/\s|\n/g, ",")
      },
      set(value) {
        this.searchForm.purchaseNo = value
      }
    },
    warehouseObj() {
      const result = {}
      this.warehouseOptions.forEach((item) => {
        const key = item.warehouseId
        result[key] = item.countryCode
      })
      return result
    }
    // skuPackageWightTotal () {
    //   return this.createTableData.reduce((total, row) => total + (row.skuPackageWight * 1 * row.planQuantity), 0).toFixed(2)
    // },
    // skuPackageVolumeTotal () {
    //   return this.createTableData.reduce((total, row) => total + (row.skuPackageVolume * 1 * row.planQuantity), 0).toFixed(2)
    // },
    // skuTotal () {
    //   return this.createTableData.reduce((total, row) => total + row.planQuantity * 1, 0)
    // },
    // skuTotalMoney () {
    //   return this.createTableData.reduce((total, row) => total + row.unitPrice * row.planQuantity, 0).toFixed(2)
    // },
  },
  watch: {
    providerCode(newVal) {
      if (this.state == "add") {
        this.baseInfo.transferMode = ""
        this.transferInfo.freightContainerMode = ""
        this.transferInfo.containerModel = ""
      }
      //调拨方式
      let transferModelData = this.transferModelOptions.filter((options) => {
        if (options.dictMappings == null) {
          return []
        } else {
          return options.dictMappings.filter((item) => item.filtering == newVal).length > 0
        }
      })
      if (transferModelData.length == 0) {
        this.filterTransferModelOptions = this.transferModelOptions
      } else {
        this.filterTransferModelOptions = transferModelData
      }
      //装柜方式
      let freightContainerModeData = this.freightContainerModeOptions.filter((options) => {
        if (options.dictMappings == null) {
          return []
        } else {
          return options.dictMappings.filter((item) => item.filtering == newVal).length > 0
        }
      })
      if (freightContainerModeData.length == 0) {
        this.filterFreightContainerModeOptions = this.freightContainerModeOptions
      } else {
        this.filterFreightContainerModeOptions = freightContainerModeData
      }
      //箱型
      let containerModelData = this.filterContainerModelOptions.filter((options) => {
        if (options.dictMappings == null) {
          return []
        } else {
          return options.dictMappings.filter((item) => item.filtering == newVal).length > 0
        }
      })
      if (containerModelData.length == 0) {
        this.filterContainerModelOptions = this.containerModelOptions
      } else {
        this.filterContainerModelOptions = containerModelData
      }
    }
  },
  methods: {
    init() {
      getCarriers().then((res) => {
        res.data.data.forEach((item) => {
          this.transportCarrierOptions.push({
            label: item.carrierShortName,
            value: item.transportCarrierCode
          })
        })
      })
      getAllWarehouse({
        funcState: "1",
        delFlag: "0"
      }).then((res) => {
        this.warehouseOptions = res.data.data
      })
      //加载所有国家
      getCountry().then((res) => {
        res.data.data.forEach((item) => {
          this.countryOptions.push({
            label: item.countryShortName,
            value: item.countryCode
          })
        })
      })

      getAllCurrency().then((res) => {
        if (res.data.code === 0) {
          this.currencyArr = res.data.data
        }
      })

      getBsecorporationAll().then((res) => {
        res.data.data.forEach((item) => {
          this.corporationOptions.push({
            label: item.corporationName,
            value: item.corporationId,
            corporationCode: item.corporationCode
          })
        })
      })

      //装柜方式
      getObjByType("freight_container_mode").then((res) => {
        this.freightContainerModeOptions = res.data.data
      })
      //箱型
      getObjByType("container_model").then((res) => {
        this.containerModelOptions = res.data.data
      })
      //调拨方式
      getObjByType("logistics_type").then((res) => {
        this.transferModelOptions = res.data.data
      })
      // 货代公司
      getObjByType("forwarder_transport_code").then((res) => {
        this.forwarderTransportCodeOptions = res.data.data
      })
      //清关公司
      getObjByType("clearance_transport_code").then((res) => {
        this.clearanceTransportCodeOptions = res.data.data
      })
      //运输公司
      getObjByType("logistics_transport_Code").then((res) => {
        this.logisticsTransportCodeOptions = res.data.data
      })
      //派送公司
      getObjByType("send_transport_code").then((res) => {
        this.sendTransportCodeOptions = res.data.data
      })
      //目的港
      getObjByType("into_harbour").then((res) => {
        this.intoHarbourOptions = res.data.data
      })
      //起运港
      getObjByType("departure_harbour").then((res) => {
        this.departureHarbourOptions = res.data.data
      })
      //物流商
    },
    //数据初始化

    transportCodeChange(val) {
      this.transferInfo.forwarderTransportCode = val
    },

    download(url) {
      downloadImgAndPdf({ fileId: url }).then((res) => {
        console.log(res)
        const blobUrl = window.URL.createObjectURL(res.data)
        const filename = res.headers["content-disposition"].split("=")[1]
        const a = document.createElement("a")
        a.href = blobUrl
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(blobUrl)
      })
    },

    validateNumber(val, row, key) {
      if (!val) return
      row[key] = val.replace(/[^\d|\.]/g, "").replace(/^[0]+/g, "0")
      row[key] = row[key] === "" ? "" : parseFloat(row[key]).toFixed(2)
    },
    geFail() {
      this.isChangeFlag = true
      // if (this.state !== 'add') return
      const params = {
        forwarderTransportCode: this.transferInfo.forwarderTransportCode,
        clearanceTransportCode: this.transferInfo.clearanceTransportCode,
        sendTransportCode: this.transferInfo.sendTransportCode
      }
      const paramsArr = []
      for (let key in params) {
        paramsArr.push(params[key])
      }
      for (let i = 0; i < paramsArr.length; i++) {
        if (!paramsArr[i]) return
      }

      getTransferLogisticsTransport(params).then((res) => {
        if (res.data.code === 0) {
          console.log(111, res)
          this.costTableData = res.data.data.map((item, index) => {
            return {
              transferCostId: null,
              transportCarrierName: item.transportCarrierName,
              transportCarrierCode: item.transportCarrierCode,
              freightCost: 0,
              taxCost: 0,
              clearanceCost: 0,
              otherCost: 0,
              freightCurrency: "USD",
              taxCurrency: "USD",
              clearanceCurrency: "USD",
              otherCurrency: "USD"
            }
          })
        }
      })
    },
    // 获取对应的目的仓和转出仓
    getWarehouse(corporationId, type) {
      // getAllWarehouse({
      //   funcState: "1",
      //   delFlag: "0",
      //   corporationId: corporationId
      // }).then((res) => {
      //   if (this.baseInfo.transferBusinessType === "NORMAL") {
      //     this.warehouseFm = res.data.data
      //     this.warehouseTo = res.data.data
      //   } else {
      //     if (type === "out") {
      //       this.warehouseFm = res.data.data
      //     } else {
      //       this.warehouseTo = res.data.data
      //     }
      //   }
      // })
      let { corporationCode } = this.corporationOptions.find((item) => item.value === corporationId)
      getWarehouseByCorpCodeApi(corporationCode, { funcState: 1 }).then((res) => {
        if (res.data.code === 0) {
          if (this.baseInfo.transferBusinessType === "NORMAL") {
            this.warehouseFm = res.data.data
            this.warehouseTo = res.data.data
          } else {
            if (type === "out") {
              this.warehouseFm = res.data.data
            } else {
              this.warehouseTo = res.data.data
            }
          }
        }
      })
    },
    handleTransferOut() {
      if (this.baseInfo.transferBusinessType === "NORMAL") {
        this.baseInfo.transferInOrgId = this.baseInfo.transferOutOrgId
        this.baseInfo.toWarehouseId = ""
        this.baseInfo.toCountryCode = ""
        this.baseInfo.transferMode = ""
      }
      this.baseInfo.fmWarehouseId = ""
      this.baseInfo.fmCountryCode = ""
      this.getWarehouse(this.baseInfo.transferOutOrgId, "out")
    },
    handleTransferIn() {
      this.baseInfo.toWarehouseId = ""
      this.baseInfo.toCountryCode = ""
      this.baseInfo.transferMode = ""
      this.getWarehouse(this.baseInfo.transferInOrgId, "in")
    },
    toTransferBusinessType() {
      this.baseInfo.transferOutOrgId = ""
      this.baseInfo.transferInOrgId = ""
      this.baseInfo.fmWarehouseId = ""
      this.baseInfo.fmCountryCode = ""
      this.baseInfo.toWarehouseId = ""
      this.baseInfo.toCountryCode = ""
      this.baseInfo.transferMode = ""
    },

    handleTime(val) {
      console.log(val)
      if (val) {
        const daysToAdd = 10 // 想要加上的天数
        const dateParts = val.split("-")
        if (dateParts.length === 3) {
          // 解析日期并添加天数
          const year = parseInt(dateParts[0], 10)
          const month = parseInt(dateParts[1], 10) - 1 // 月份在 JavaScript 中是从 0 开始的
          const day = parseInt(dateParts[2], 10)
          const newDate = new Date(year, month, day)
          newDate.setDate(newDate.getDate() + daysToAdd)

          // 格式化新日期为 "YYYY-MM-DD"
          const newYear = newDate.getFullYear()
          const newMonth = (newDate.getMonth() + 1).toString().padStart(2, "0")
          const newDay = newDate.getDate().toString().padStart(2, "0")
          this.baseInfo.estimatePutTime = `${newYear}-${newMonth}-${newDay}`
        }
      }
      console.log(this.baseInfo.estimatePutTime)
      // this.baseInfo.estimatePutTime
    },

    handleFmWarehouse(val) {
      this.baseInfo.fmCountryCode = this.warehouseObj[val]
      // if (this.state == "add") {
      //   this.transferInfo.logisticsTransportCode = ""
      //   this.transferInfo.forwarderTransportCode = ""
      //   this.transferInfo.clearanceTransportCode = ""
      //   this.transferInfo.sendTransportCode = ""
      // }
      let warehouseIds = val
      if (!val) return
      //货代物流
      getCarriersByWarehouse({
        warehouseIds: [warehouseIds],
        transportType: "FORWARDER"
      }).then((res) => {
        this.forwarderTransportCodeOptions = res.data.data[0].dataList
      })
      //清关物流
      getCarriersByWarehouse({
        warehouseIds: [warehouseIds],
        transportType: "CLEARANCE"
      }).then((res) => {
        this.clearanceTransportCodeOptions = res.data.data[0].dataList
      })
      //运输物流
      getCarriersByWarehouse({
        warehouseIds: [warehouseIds],
        transportType: "LOGISTICS"
      }).then((res) => {
        this.logisticsTransportCodeOptions = res.data.data[0].dataList
      })
      //派送物流
      getCarriersByWarehouse({
        warehouseIds: [warehouseIds],
        transportType: "SEND"
      }).then((res) => {
        this.sendTransportCodeOptions = res.data.data[0].dataList
      })
    },

    async watchDetailById(transferId) {
      await getFinalInfo({ transferId }).then((res) => {
        console.log(res.data.data)
        let data = res.data.data
        this.handleFmWarehouse(data.fmWarehouseId)
        this.providerCode = data.toCountryCode
        this.baseInfo = {
          transferType: data.transferType,
          fmWarehouseId: "",
          fmCountryCode: data.fmCountryCode,
          toWarehouseId: "",
          toCountryCode: data.toCountryCode,
          departureHarbour: data.departureHarbour,
          intoHarbour: data.intoHarbour,
          transferMode: data.logisticsType,
          departureTime: data.departureTime,
          freightContainerTime: data.freightContainerTime,
          estimateArrivalTime: data.estimateArrivalTime,
          estimateOutStockTime: data.estimateOutStockTime,
          estimatePutTime: data.estimatePutTime,
          transferOutOrgId: data.transferOutOrgId,
          transferInOrgId: data.transferInOrgId,
          transferBusinessType: data.transferBusinessType,
          transferNo: data.transferNo,
          internalTransactionContractNo: data.internalTransactionContractNo,
          internalTransactionOrderNo: data.internalTransactionOrderNo,
          internalTransactionOrderStats: data.internalTransactionOrderStats,
          remark: data.remark
        }
        this.transferInfo = {
          freightContainerMode: data.freightContainerMode,
          containerModel: data.containerModel,
          containerNo: data.containerNo,
          forwarderTransportCode: data.forwarderTransportCode,
          clearanceTransportCode: data.clearanceTransportCode,
          sendTransportCode: data.sendTransportCode,
          logisticsTransportCode: data.logisticsTransportCode
        }
        this.productInfo = {
          totalWeight: data.totalWeight,
          totalVolume: data.totalVolume
        }
        this.createTableData = data.productList
        this.transferStatus = data.transferStatus
        this.statementDownloadsList = data.statementDownloads

        getAllWarehouse({
          funcState: "1",
          delFlag: "0"
        }).then((res) => {
          this.warehouseFm = res.data.data
          this.warehouseTo = res.data.data
          this.baseInfo.fmWarehouseId = data.fmWarehouseId
          this.baseInfo.toWarehouseId = data.toWarehouseId
        })

        // let costDetails = [
        //   { transportBelongName: '物流商1', transportBelongCode: '1', transferTransportCostDetailVOS: [
        //     { transferCostId: 1, cost: 1, logisticsCostTypeEnum: 'SHIPMENT', costCurrency: 'USD', costLockStatus: 'UN_LOCK' },
        //     { transferCostId: 2, cost: 2, logisticsCostTypeEnum: 'TARIFF', costCurrency: 'JPY', costLockStatus: 'LOCK' },
        //     { transferCostId: 3, cost: 3, logisticsCostTypeEnum: 'CLEARANCE', costCurrency: 'USD', costLockStatus: 'LOCK' },
        //     { transferCostId: 4, cost: 4, logisticsCostTypeEnum: 'OTHER', costCurrency: 'JPY', costLockStatus: 'UN_LOCK' },
        //   ] },
        //   { transportBelongName: '物流商2', transportBelongCode: '2', transferTransportCostDetailVOS: [
        //     { transferCostId: 1, cost: 1, logisticsCostTypeEnum: 'SHIPMENT', costCurrency: 'USD', costLockStatus: 'UN_LOCK' },
        //     { transferCostId: 2, cost: 2, logisticsCostTypeEnum: 'TARIFF', costCurrency: 'JPY', costLockStatus: 'LOCK' },
        //     { transferCostId: 3, cost: 3, logisticsCostTypeEnum: 'CLEARANCE', costCurrency: 'USD', costLockStatus: 'LOCK' },
        //     { transferCostId: 4, cost: 4, logisticsCostTypeEnum: 'OTHER', costCurrency: 'JPY', costLockStatus: 'UN_LOCK' },
        //   ] }
        // ]

        this.costTableData = data.costInfo
        if (data.costInfo.length === 0) {
          this.costTableData.push({
            transportCode: "",
            cost: null,
            costType: "WAREHOUSE_TRANSFER",
            costCurrency: "USD"
          })
        }
        // let costDetails = data.costDetails;
        // console.log(costDetails, 1024);
        // let costTableData = [];
        // for (let i = 0; i < costDetails.length; i++) {
        //   let obj = {};
        //   obj.transportCarrierName = costDetails[i].transportCarrierName;
        //   obj.transportCarrierCode = costDetails[i].transportCarrierCode;
        //   obj.costOperateName = costDetails[i].costOperateName;
        //   if (costDetails[i].transferTransportCostDetailVOS) {
        //     for (
        //       let j = 0;
        //       j < costDetails[i].transferTransportCostDetailVOS.length;
        //       j++
        //     ) {
        //       let row = costDetails[i].transferTransportCostDetailVOS[j];
        //       switch (true) {
        //         case row.logisticsCostTypeEnum === "SHIPMENT":
        //           obj.transferCostId = obj.transferCostId
        //             ? obj.transferCostId
        //             : row.transferCostId;
        //           obj.freightCost = obj.freightCost
        //             ? obj.freightCost
        //             : row.cost;
        //           obj.freightCurrency = obj.freightCurrency
        //             ? obj.freightCurrency
        //             : row.costCurrency;
        //           obj.logisticsCostTypeEnum = obj.logisticsCostTypeEnum
        //             ? obj.logisticsCostTypeEnum
        //             : row.logisticsCostTypeEnum;
        //           obj.costLockStatusName = obj.costLockStatusName
        //             ? obj.costLockStatusName
        //             : row.costLockStatusName;
        //           break;
        //       }
        //     }
        //     costTableData.push(obj);
        //   }
        // }
        // console.log(costTableData, 123);
        // this.costTableData = costTableData;
      })
    },

    addByNo() {
      // getStockQueryGroupIn(this.searchForm).then(res => {
      //   console.log(res.data.data)
      // })
      if (!this.baseInfo.fmWarehouseId) {
        this.$message.warning("请先选择转出仓!!!")
        return
      }
      this.addFormData = []
      this.addByNoVisible = true
    },

    onSearch() {
      this.searchForm.fmWarehouseId = this.baseInfo.fmWarehouseId
      this.searchForm.transferOutOrgId = this.baseInfo.transferOutOrgId
      let param = {
        ...this.searchForm,
        size: 100
      }
      getTransferFinalProduct(param).then((res) => {
        res.data.data.records.forEach((item) => {
          item.planQuantity = item.availableQuantity
        })
        let data = res.data.data.records
        this.addFormData = data
        console.log(this.addFormData, 1025)
      })
    },
    onClear() {
      this.searchForm = {
        spuCode: "",
        spuCode: "",
        skuName: ""
      }
      this.$refs.addForm.resetFields()
    },

    handleToWarehouse(value) {
      if (value) {
        this.baseInfo.toCountryCode = this.warehouseObj[value]
        this.providerCode = this.warehouseOptions.filter((item) => item.warehouseId === value)[0].providerCode
        console.log(this.providerCode)
      } else {
        this.baseInfo.toCountryCode = ""
        this.baseInfo.transferMode = ""
      }
    },

    addConfirm() {
      if (!this.selectList || this.selectList.length == 0) {
        this.$message.error("未勾选入库单！")
        return
      }
      const hasPlanCount = this.selectList.some((row) => row.planQuantity > row.availableQuantity || !row.planQuantity)
      if (hasPlanCount) {
        this.$message.error("有选中数据计划数量未填写或超出可用库存！")
        return
      }
      this.selectList.forEach((selectedRow) => {
        let data = this.createTableData.find((savedRow) => {
          if (
            savedRow.skuId === selectedRow.skuId &&
            savedRow.site === selectedRow.site &&
            savedRow.platform === selectedRow.platform
          ) {
            return savedRow
          }
        })
        if (data) {
          // 更新已保存的数据
          Object.assign(data, selectedRow)
        } else {
          // 添加新数据
          this.createTableData.push(selectedRow)
        }
      })
      this.$message.success("产品添加成功")
      this.addByNoVisible = false
      console.log(this.createTableData, 102)
      // 清空选中的行
      this.selectList = []
    },
    deleteInNo(index) {
      console.log(index)
      this.createTableData.splice(index, 1)
    },

    async saveTransfer(operateFlag) {
      if (operateFlag === "submit") {
        let baseVaild = false
        this.$refs.baseForm.validate((valid) => {
          baseVaild = valid
        })
        if (baseVaild) {
          if (!this.createTableData.length) {
            this.$message.warning("请添加产品信息！")
            return
          }
        }
      }

      let target = {}
      for (let i = 0; i < this.costTableData.length; i++) {
        let data = this.costTableData[i]
        if (target[`${data.transportCode}+${data.costType}`]) {
          this.$message.warning("存在相同的物流商和费用类型")
          return
        } else {
          target[`${data.transportCode}+${data.costType}`] = true
        }
      }

      var res = []
      // let costInfoList = [];
      // console.log("this.costType=====", this.costType);
      // for (let i = 0; i < this.costTableData.length; i++) {
      //   for (let j = 0; j < this.costType.length; j++) {
      //     let obj = {};
      //     obj.transportCarrierCode = this.costTableData[i].transportCarrierCode;
      //     obj.transferCostId = this.costTableData[i].transferCostId;
      //     switch (true) {
      //       case this.costType[j].value === "SHIPMENT":
      //         obj.cost = this.costTableData[i].freightCost;
      //         obj.costCurrency = this.costTableData[i].freightCurrency;
      //         obj.logisticsCostTypeEnum = "SHIPMENT";
      //         break;
      //     }
      //     costInfoList.push(obj);
      //   }
      // }
      if (this.state === "add") {
        res = await finalSave({
          ...this.productInfo,
          ...this.transferInfo,
          ...this.baseInfo,
          detail: this.createTableData,
          costInfo: this.costTableData,
          operateFlag
        })
      }
      if (this.state === "edit" || this.transferStatus === "TO_BE_SUBMITTED") {
        let transferEnterCostSave = {
          enterCost: this.costTableData,
          transferId: this.transferId,
          saveModel: "COST"
        }
        res = await transferUpdate({
          transferId: this.transferId,
          ...this.productInfo,
          ...this.transferInfo,
          ...this.baseInfo,
          transferEnterCostSave,
          detail: this.createTableData,
          operateFlag,
          costInfo: this.costTableData
        })
      }
      if (res.data.code === 0) {
        this.$message.success("操作成功")
        this.$router.$avueRouter.closeTag()
        this.$router.push({
          path: "/logistics/tmstransfer/lastMileTransfer",
          query: null
        })
      } else {
        this.$message.error(res.data.msg)
      }
    },

    async submitTransfer(operateFlag) {
      if (operateFlag === "submit") {
        let baseVaild = false
        this.$refs.baseForm.validate((valid) => {
          baseVaild = valid
        })
        if (baseVaild) {
          if (!this.createTableData.length) {
            this.$message.warning("请添加产品信息！")
            return
          }
        }

        let target = {}
        for (let i = 0; i < this.costTableData.length; i++) {
          let data = this.costTableData[i]
          if (target[`${data.transportCode}+${data.costType}`]) {
            this.$message.warning("存在相同的物流商和费用类型")
            return
          } else {
            target[`${data.transportCode}+${data.costType}`] = true
          }
        }
        // if (!this.costTableData[0].transportCarrierCode) {
        //   this.$message.warning("请选择物流商！");
        //   return;
        // }
        // if (!this.costTableData[0].freightCost) {
        //   this.$message.warning("请填写运费！");
        //   return;
        // }
        // if (!this.costTableData[0].freightCurrency) {
        //   this.$message.warning("请选择币种！");
        //   return;
        // }
        // 调拨费用处理
        // let costInfoList = [];
        // console.log("this.costType=======", this.costType);
        // for (let i = 0; i < this.costTableData.length; i++) {
        //   for (let j = 0; j < this.costType.length; j++) {
        //     let obj = {};
        //     obj.transportCarrierCode =
        //       this.costTableData[i].transportCarrierCode;
        //     obj.transferCostId = this.costTableData[i].transferCostId;
        //     switch (true) {
        //       case this.costType[j].value === "SHIPMENT":
        //         obj.cost = this.costTableData[i].freightCost;
        //         obj.costCurrency = this.costTableData[i].freightCurrency;
        //         obj.logisticsCostTypeEnum = "SHIPMENT";
        //         break;
        //       case this.costType[j].value === "TARIFF":
        //         obj.cost = this.costTableData[i].taxCost;
        //         obj.costCurrency = this.costTableData[i].taxCurrency;
        //         obj.logisticsCostTypeEnum = "TARIFF";
        //         break;
        //       case this.costType[j].value === "CLEARANCE":
        //         obj.cost = this.costTableData[i].clearanceCost;
        //         obj.costCurrency = this.costTableData[i].clearanceCurrency;
        //         obj.logisticsCostTypeEnum = "CLEARANCE";
        //         break;
        //       case this.costType[j].value === "OTHER":
        //         obj.cost = this.costTableData[i].otherCost;
        //         obj.costCurrency = this.costTableData[i].otherCurrency;
        //         obj.logisticsCostTypeEnum = "OTHER";
        //         break;
        //     }
        //     costInfoList.push(obj);
        //   }
        // }
        var res = []
        if (this.state === "add") {
          console.log(113)
          res = await finalSave({
            ...this.productInfo,
            ...this.transferInfo,
            ...this.baseInfo,
            detail: this.createTableData,
            costInfo: this.costTableData,
            operateFlag
          })
        } else if (this.state === "edit") {
          console.log(123)
          let transferEnterCostSave = {
            enterCost: this.costTableData,
            transferId: this.transferId,
            saveModel: "COST"
          }
          res = await transferUpdate({
            transferId: this.transferId,
            ...this.productInfo,
            ...this.transferInfo,
            ...this.baseInfo,
            transferEnterCostSave,
            detail: this.createTableData,
            operateFlag,
            costInfo: this.costTableData
          })
        }
        if (res.data.code === 0) {
          this.$message.success("操作成功")
          this.$router.$avueRouter.closeTag()
          this.$router.push({
            path: "/logistics/tmstransfer/lastMileTransfer",
            query: null
          })
        } else {
          this.$message.error(res.data.msg)
        }
        console.log(res.data.data)
      }
    },

    handleSelect(val) {
      this.selectList = val
      console.log(this.selectList)
    },

    toUpperCase(scope) {
      if (scope.row.skuCode) {
        scope.row.skuCode = scope.row.skuCode.replace(/\s/g, "").toUpperCase()
      }
    },
    specialTrim(scope) {
      if (scope.row.skuName) {
        scope.row.skuName = scope.row.skuName.replace(/\s/g, "")
      }
    },
    addCost(row) {
      this.costTableData.push({
        // transportCode: "",
        // costType: "",
        // cost: "",
        // costCurrency: "USD",

        transportCode: "",
        cost: null,
        costType: "",
        costCurrency: "USD"
      })
    },
    deleteCost(row) {
      let count = 0
      this.costTableData.forEach((item) => {
        if (item.costType === row.costType) {
          count++
        }
      })
      // 仅费用类型=仓库调拨费、且仅有1条时不允许删除，其他项均可删除
      if (["WAREHOUSE_TRANSFER"].find((item) => item === row.costType) && count <= 1) {
        this.$message.warning(`该费用类型只有唯一一条，不可删除！`)
        return
      }

      this.costTableData.splice(row.$index, 1)
    }
  }
}
</script>

<style lang="scss">
@import "./createTms.scss";

.avue-crud__menu {
  min-height: auto;
}

.inputContainer {
  width: 178px;
}

// .el-input.is-disabled .el-input__inner,
// .el-textarea.is-disabled .el-textarea__inner {
//   background-color: #fff;
//   color: #606266;
//   border-color: #dcdfe6;
//   /* 其他样式，根据需要添加 */
// }
</style>
