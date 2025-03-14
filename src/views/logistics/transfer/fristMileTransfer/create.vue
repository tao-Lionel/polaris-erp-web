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
                <el-form-item label="业务类型" prop="transferBusinessType">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="baseInfo.transferBusinessType"
                    filterable
                    placeholder="请选择"
                    @change="toTransferBusinessType"
                    :disabled="
                      state === 'detail' ||
                      (state === 'edit' &&
                        transferStatus !== 'TO_BE_SUBMITTED' &&
                        transferStatus !== 'WAIT_DELIVERY') ||
                      from === 'containerGenerate'
                    "
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
                <el-form-item label="起运港" prop="departureHarbour">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="baseInfo.departureHarbour"
                    filterable
                    placeholder="请选择"
                    :disabled="
                      state === 'detail' ||
                      (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED' && transferStatus !== 'WAIT_DELIVERY')
                    "
                  >
                    <el-option
                      v-for="item in departureHarbourOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="目的港" prop="intoHarbour">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="baseInfo.intoHarbour"
                    filterable
                    placeholder="请选择"
                    :disabled="
                      state === 'detail' ||
                      (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED' && transferStatus !== 'WAIT_DELIVERY')
                    "
                  >
                    <el-option
                      v-for="item in intoHarbourOptions"
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
                      state === 'detail' ||
                      (state === 'edit' &&
                        transferStatus !== 'TO_BE_SUBMITTED' &&
                        transferStatus !== 'WAIT_DELIVERY') ||
                      !baseInfo.transferBusinessType ||
                      from === 'containerGenerate'
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
                <el-form-item label="转出仓" prop="fmWarehouseId">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="baseInfo.fmWarehouseId"
                    filterable
                    placeholder="请选择"
                    @change="handleFmWarehouse"
                    :disabled="
                      state === 'detail' ||
                      (state === 'edit' &&
                        transferStatus !== 'TO_BE_SUBMITTED' &&
                        transferStatus !== 'WAIT_DELIVERY') ||
                      !baseInfo.transferOutOrgId ||
                      from === 'containerGenerate'
                    "
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
            </el-row>
            <el-row>
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
                      state === 'detail' ||
                      (state === 'edit' &&
                        transferStatus !== 'TO_BE_SUBMITTED' &&
                        transferStatus !== 'WAIT_DELIVERY') ||
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
                      state === 'detail' ||
                      (state === 'edit' &&
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
                    :disabled="transferStatus !== 'IN_TRANSIT'"
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
                <el-form-item label="调拨方式" prop="transferMode">
                  <el-select
                    class="custom-select"
                    size="mini"
                    clearable
                    v-model="baseInfo.transferMode"
                    filterable
                    placeholder="请选择"
                    :disabled="
                      state === 'detail' ||
                      (state === 'edit' &&
                        transferStatus !== 'TO_BE_SUBMITTED' &&
                        transferStatus !== 'WAIT_DELIVERY' &&
                        transferStatus !== 'IN_TRANSIT') ||
                      !baseInfo.toWarehouseId
                    "
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
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="装柜时间" prop="freightContainerTime">
                  <el-date-picker
                    class="custom-date-picker"
                    v-model="baseInfo.freightContainerTime"
                    size="mini"
                    clearable
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择装柜时间"
                    :disabled="
                      state === 'detail' ||
                      (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED' && transferStatus !== 'WAIT_DELIVERY')
                    "
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="开船时间" prop="departureTime">
                  <el-date-picker
                    class="custom-date-picker"
                    v-model="baseInfo.departureTime"
                    size="mini"
                    clearable
                    type="date"
                    placeholder="选择开船时间"
                    value-format="yyyy-MM-dd"
                    :disabled="
                      state === 'detail' ||
                      (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED' && transferStatus !== 'WAIT_DELIVERY')
                    "
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="预计到港时间" prop="estimateArrivalTime" label-width="110px">
                  <el-date-picker
                    class="custom-date-picker"
                    v-model="baseInfo.estimateArrivalTime"
                    size="mini"
                    clearable
                    type="date"
                    @change="handleTime"
                    value-format="yyyy-MM-dd"
                    placeholder="选择预计到港时间"
                    :disabled="
                      state === 'detail' ||
                      (state === 'edit' &&
                        transferStatus !== 'TO_BE_SUBMITTED' &&
                        transferStatus !== 'WAIT_DELIVERY' &&
                        transferStatus !== 'IN_TRANSIT')
                    "
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="预计上架时间" prop="estimatePutTime" label-width="110px">
                  <el-date-picker
                    class="custom-date-picker"
                    v-model="baseInfo.estimatePutTime"
                    size="mini"
                    clearable
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择预计上架时间"
                    :disabled="
                      state === 'detail' ||
                      (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED' && transferStatus !== 'WAIT_DELIVERY')
                    "
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
                    :disabled="
                      state === 'detail' ||
                      (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED' && transferStatus !== 'WAIT_DELIVERY')
                    "
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
      <div class="iod-target-top">
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
                    :disabled="
                      state === 'detail' ||
                      (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED' && transferStatus !== 'WAIT_DELIVERY')
                    "
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
                    :disabled="
                      state === 'detail' ||
                      (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED' && transferStatus !== 'WAIT_DELIVERY')
                    "
                  >
                    <el-option
                      v-for="item in boxCarTypeList"
                      :key="item.id"
                      :label="item.boxCarTypeName"
                      :value="item.boxCarType"
                    ></el-option>
                    <!-- 旧逻辑 先保留 -->
                    <!-- <el-option
                      v-for="item in filterContainerModelOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option> -->
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
                    :disabled="
                      state === 'detail' ||
                      (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED' && transferStatus !== 'WAIT_DELIVERY')
                    "
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
                    :disabled="
                      state === 'detail' ||
                      (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED' && transferStatus !== 'WAIT_DELIVERY')
                    "
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
                    :disabled="
                      state === 'detail' ||
                      (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED' && transferStatus !== 'WAIT_DELIVERY')
                    "
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
                    :disabled="
                      state === 'detail' ||
                      (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED' && transferStatus !== 'WAIT_DELIVERY')
                    "
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
                    :disabled="
                      state === 'detail' ||
                      (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED' && transferStatus !== 'WAIT_DELIVERY')
                    "
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

      <!--产品信息模块-->
      <div class="iod-target-top">
        <el-form>
          <detail-wrapper :options="{ title: '产品信息' }">
            <div class="validate_wrapper">
              <avue-crud
                ref="crud"
                :data="createTableData"
                :option="createTableOption"
                @row-del="delRowAttr"
                class="handle-cell-hidden"
              >
                <template slot="menuLeft">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="addByNo"
                    :disabled="
                      state === 'detail' ||
                      (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED' && transferStatus !== 'WAIT_DELIVERY')
                    "
                    >按单号添加</el-button
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
                  <el-button
                    type="text"
                    style="padding: 0"
                    @click="deleteInNo(row.$index)"
                    :disabled="state === 'detail' || (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED')"
                    >删 除</el-button
                  >
                </template>
              </avue-crud>
              <el-row>
                <el-col :span="8">
                  <el-form-item>
                    <span style="white-space: nowrap; vertical-align: baseline">SKU总数量：{{ skuTotal }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <span style="white-space: nowrap; vertical-align: baseline"
                      >预估包装总重量(kg)：{{ skuPackageWightTotal }}</span
                    >
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <div style="display: flex; align-items: center">
                      <span style="white-space: nowrap; vertical-align: baseline">实际包装总重量(kg)：</span>
                      <el-input
                        class="custom-input"
                        v-model="productInfo.totalWeight"
                        size="mini"
                        style="width: 100px"
                        :disabled="
                          state === 'detail' ||
                          (state === 'edit' &&
                            transferStatus !== 'TO_BE_SUBMITTED' &&
                            transferStatus !== 'WAIT_DELIVERY')
                        "
                      ></el-input>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item>
                    <span style="white-space: nowrap; vertical-align: baseline"
                      >预估包装总体积(cm³)：{{ skuPackageVolumeTotal }}</span
                    >
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <div style="display: flex; align-items: center">
                      <span style="white-space: nowrap; vertical-align: baseline">实际包装总体积(cm³)：</span>
                      <el-input
                        class="custom-input"
                        v-model="productInfo.totalVolume"
                        size="mini"
                        style="width: 100px"
                        :disabled="
                          state === 'detail' ||
                          (state === 'edit' &&
                            transferStatus !== 'TO_BE_SUBMITTED' &&
                            transferStatus !== 'WAIT_DELIVERY')
                        "
                      ></el-input>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <span style="white-space: nowrap; vertical-align: baseline">$总货值：{{ skuTotalMoney }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </detail-wrapper>
        </el-form>
      </div>

      <!-- 详情调拨费用  -->
      <div class="iod-target-top">
        <detail-wrapper :options="{ title: '调拨费用' }">
          <div class="validate_wrapper">
            <avue-crud
              ref="crud"
              :data="costTableData"
              :option="costTableOption"
              @row-del="delRowAttr"
              class="handle-cell-hidden"
            >
              <template slot="transportCode" slot-scope="{ row }">
                <el-select
                  size="mini"
                  clearable
                  v-model="row.transportCode"
                  filterable
                  placeholder="请选择"
                  :disabled="
                    state === 'detail' ||
                    (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED' && transferStatus !== 'WAIT_DELIVERY')
                  "
                >
                  <el-option
                    v-for="item in forwarderTransportCodeOptions"
                    :key="item.transportCarrierCode"
                    :label="item.carrierShortName"
                    :value="item.transportCarrierCode"
                  ></el-option>
                </el-select>
              </template>

              <template slot="costType" slot-scope="{ row }">
                <el-select
                  size="mini"
                  clearable
                  v-model="row.costType"
                  filterable
                  placeholder="请选择"
                  :disabled="state === 'detail' || row.costType == 'TARIFF' || row.costType == 'CONSUMPTION_TAX'"
                >
                  <!-- state === 'detail' ||
                    (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED' && transferStatus !== 'WAIT_DELIVERY') -->
                  <el-option
                    v-for="item in costList"
                    :key="item.tmsLogisticsCostTypeCode"
                    :label="item.tmsLogisticsCostTypeName"
                    :value="item.tmsLogisticsCostTypeCode"
                    :disabled="
                      item.tmsLogisticsCostTypeCode == 'TARIFF' || item.tmsLogisticsCostTypeCode == 'CONSUMPTION_TAX'
                    "
                  ></el-option>
                </el-select>
              </template>
              <!-- :disabled="state === 'detail' || !isChangeFlag || transferStatus === 'IN' || transferStatus === 'PART_IN'" -->
              <template slot="cost" slot-scope="{ row }">
                <el-input
                  class="el-input--append"
                  v-model="row.cost"
                  placeholder="请输入"
                  @change="validateNumber($event, row, 'cost')"
                  :disabled="state === 'detail' || row.costType == 'TARIFF' || row.costType == 'CONSUMPTION_TAX'"
                  size="mini"
                >
                  <el-select
                    v-model="row.costCurrency"
                    :disabled="state === 'detail' || row.costType == 'TARIFF' || row.costType == 'CONSUMPTION_TAX'"
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
                    v-if="row.$index === costTableData.length - 1 && row.$index > 1 && state !== 'detail'"
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

      <!-- 进口关税清单  -->
      <div class="iod-target-top import-tariff">
        <detail-wrapper :options="{ title: '进口关税清单' }">
          <div class="validate_wrapper" style="padding: 5px">
            <el-form :model="{ importTariffData }" ref="importTariffForm">
              <el-table
                :data="importTariffData"
                stripe
                border
                show-summary
                :summary-method="getSummaries"
                max-height="500"
                :header-cell-style="{
                  color: '#2c2f2f',
                  backgroundColor: '#f7f8fb',
                  fontSize: '12px'
                }"
                style="width: 100%"
              >
                <el-table-column type="index" prop="index" label="序号" width="50"> </el-table-column>
                <el-table-column prop="categoryName" label="产品品类" width="250"> </el-table-column>
                <el-table-column prop="targetCustomsCode" label="海关编码" width="180"> </el-table-column>
                <el-table-column prop="poTotalValueOfGoods" label="总货值（USD）"> </el-table-column>
                <el-table-column prop="targetTotalValueOfGoods" label="总货值（CAD）">
                  <template slot="header">总货值（{{ importTariffCurrency }}）</template>
                </el-table-column>
                <el-table-column prop="totalRate" label="总关税率（含反倾销）" width="150">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="`importTariffData[${scope.$index}].totalRate`"
                      :rules="importTariffRules.totalRate"
                      style="padding: 10px 0"
                    >
                      <el-input
                        size="small"
                        v-model="scope.row.totalRate"
                        :disabled="state === 'detail' || (transferStatus !== 'TO_BE_SUBMITTED' && state !== 'add')"
                        @change="totalRateChange($event, scope.row)"
                      >
                        <template slot="append">%</template>
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="totalTaxAmount" label="总关税额（CAD）">
                  <template slot="header">总关税额（{{ importTariffCurrency }}）</template>
                </el-table-column>
                <el-table-column prop="consumptionRate" label="消费税率" width="150">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="`importTariffData[${scope.$index}].consumptionRate`"
                      :rules="importTariffRules.consumptionRate"
                      style="padding: 10px 0"
                    >
                      <el-input
                        size="small"
                        v-model="scope.row.consumptionRate"
                        :disabled="state === 'detail' || (transferStatus !== 'TO_BE_SUBMITTED' && state !== 'add')"
                        @change="consumptionRateChange($event, scope.row)"
                      >
                        <template slot="append">%</template>
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="consumptionTaxAmount" label="消费税额（CAD）">
                  <template slot="header">消费税额（{{ importTariffCurrency }}）</template>
                </el-table-column>
              </el-table>
            </el-form>
          </div>
        </detail-wrapper>
      </div>
      <div class="iod-target-top" v-if="state === 'detail'">
        <detail-wrapper :options="{ title: '操作日志' }">
          <operationlog ref="operationlog"></operationlog>
        </detail-wrapper>
      </div>

      <!--底端按钮模块-->

      <div
        class="y-submit"
        v-if="
          state === 'detail' ||
          (state === 'edit' && transferStatus !== 'TO_BE_SUBMITTED' && transferStatus !== 'WAIT_DELIVERY')
        "
      >
        <el-button
          size="small"
          type="primary"
          @click="submitTransfer('submit')"
          :loading="buttonLoading"
          v-if="transferStatus === 'IN_TRANSIT'"
          :disabled="buttonLoading"
          >保存并提交</el-button
        >
      </div>
      <div class="y-submit" v-else>
        <el-button
          size="small"
          type="primary"
          @click="saveTransfer('save')"
          :loading="buttonLoading"
          :disabled="buttonLoading"
          >保 存</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="submitTransfer('submit')"
          :loading="buttonLoading"
          :disabled="buttonLoading"
          >保存并提交</el-button
        >
      </div>
    </basic-container>

    <el-dialog
      title="按单号添加"
      :visible.sync="addByNoVisible"
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :inline="true" :model="searchForm" ref="addForm" :rules="searchRules">
        <el-row>
          <!-- <el-col :span="6">
            <el-form-item label="法人主体" prop="corporationId">
              <el-select size="mini" v-model="searchForm.corporationId" clearable>
                <el-option v-for="item in corporationOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item label="采购单号" style="margin-bottom: 0">
              <el-input
                v-model="searchForm.purchaseNo"
                v-search-input
                placeholder="多个采购单号,请用英文,分隔"
                size="mini"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="送货单号(入库单号)" style="margin-bottom: 0">
              <el-input
                v-model="formatInNo"
                v-search-input
                placeholder="多个入库单号,请用英文,分隔"
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
        <el-table-column label="送货单号(入库单号)" prop="wmsInboundNo"></el-table-column>
        <el-table-column label="采购单号" prop="purchaseOrderNo"></el-table-column>
        <el-table-column label="排柜号" prop="cabinetCode"></el-table-column>
        <el-table-column label="出货柜号" prop="shippingContainerNo"></el-table-column>
        <el-table-column label="SKU" prop="skuCode"></el-table-column>
        <el-table-column label="产品名称" prop="skuName"></el-table-column>
        <!-- <el-table-column label="仓库" prop="warehouseId"></el-table-column> -->
        <el-table-column label="法人主体" prop="corporationName"></el-table-column>
        <el-table-column label="平台" prop="platform"></el-table-column>
        <el-table-column label="站点" prop="site"></el-table-column>
        <el-table-column label="入库数量" prop="actualQuantity"></el-table-column>
        <el-table-column label="可用库存" prop="availableQuantity"></el-table-column>
        <el-table-column label="采购单价" prop="unitPrice"></el-table-column>
        <el-table-column label="计划调拨数量" prop="planCount">
          <template slot-scope="scope">
            <el-input-number
              style="width: 100%"
              v-model="scope.row.planCount"
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
import {
  getStockQueryGroupIn,
  transferSave,
  transferUpdate,
  getDetailInfo,
  getCarriersByWarehouse,
  getCostInfoById,
  getTransferLogisticsTransport,
  costListAll,
  downloadImgAndPdf,
  getListCustomsDeclarationMsg
} from "@/api/logistics/transfer/fristMileTransfer"
import { queryCustomsCodeList } from "@/api/product/prdrelatedelements"
// import Background from "./background"
import { promised } from "q"
import { getTokenUrl } from "@/util/auth"
import { preventShake, validateInput, limitFilesMaxSize } from "@/util/tool"
import preview from "@/components/yvue/pdf/index"
import operationlog from "@/views/logistics/transfer/fristMileTransfer/log"
import { setTimeout } from "timers"
import { getObjByType } from "@/api/admin/dict"
import { deepClone } from "../../../../util/util"
import {
  createTableOption,
  costTableOption,
  baseRules,
  transferRules,
  costInfoRules,
  importTariffOption
} from "@/const/crud/logistics/transfer/fristMileTransfer"
import { getAllWarehouse, getWarehouseByCorpCodeApi, getBseWarehouseInfo } from "@/api/baseSetup/bsewarehouse"
import { getCountry } from "@/api/baseSetup/bsecountry"
import { getAll as getBsecorporationAll } from "@/api/baseSetup/bsecorporation"
import { rules } from "@/const/crud/purchase/organizeSettlement"
import { getCountryByParamApi } from "@/api/baseSetup/bsecountry"
import { getGenerateTransfer } from "@/api/purchase/containerLoadingPlan/index.js"
import { listPage } from "@/api/baseSetup/bseWarehouseProviderManage.js"
import { setOrderBy } from "@/util/auth"

export default {
  name: "prdlcreate",
  data() {
    return {
      searchRules: {
        corporationId: [
          {
            required: true,
            type: "number",
            message: "请选择法人主体",
            taggier: "blur"
          }
        ]
      },
      state: "",
      transferId: "",
      baseInfo: {
        transferOutOrgId: "",
        transferInOrgId: "",
        transferBusinessType: "",
        transferType: "HEAD",
        fmWarehouseId: "",
        fmCountryCode: "",
        toWarehouseId: "",
        toCountryCode: "",
        departureHarbour: "",
        intoHarbour: "",
        transferMode: "",
        departureTime: "",
        freightContainerTime: "",
        estimateArrivalTime: "",
        estimatePutTime: "",

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
      costTableOption: costTableOption,
      createTableOption: createTableOption,
      createTableData: [],
      addFormData: [],
      costTableData: [],
      addByNoVisible: false,
      searchForm: {
        warehouseId: "",
        corporationId: null,
        purchaseNo: "",
        inNo: ""
      },
      search: {},
      baseRules: baseRules,
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
      costInfoRules: costInfoRules,
      inAbnormalOptions: [],
      internalStatus: [],
      costType: [],
      transferTransportCostDetailVOS: [],
      isChangeFlag: false,
      costList: [],
      importTariffOption: importTariffOption,
      importTariffData: [],
      importTariffCurrency: "CAD", // 关税清单 表头币种字段
      importTariffRules: {
        totalRate: [
          { required: true, message: "请输入总关税率", trigger: "change" },
          { validator: this.validateFloat, message: "只能输入非负数", trigger: "blur" },
          { validator: this.validateFloatTen, message: "限制10位整数", trigger: "blur" },
          { validator: this.validateFloatFourDigit, message: "最多保留四位小数", trigger: "blur" }
        ],
        consumptionRate: [
          { required: true, message: "请输入消费税率", trigger: "change" },
          { validator: this.validateFloat, message: "只能输入非负数", trigger: "blur" },
          { validator: this.validateFloatTen, message: "限制10位整数", trigger: "blur" },
          { validator: this.validateFloatFourDigit, message: "最多保留四位小数", trigger: "blur" }
        ]
      },
      loadCount: 0, // 编辑状态下 第一次的时候 不监听createTableData变化
      paramsArr: [
        {
          transportCode: "",
          costType: "SHIPMENT",
          cost: "",
          costCurrency: "USD"
        },
        {
          transportCode: "",
          costType: "CLEARANCE",
          cost: "",
          costCurrency: "USD"
        },
        {
          transportCode: "",
          costType: "TARIFF",
          cost: 0,
          costCurrency: "USD"
        },
        {
          transportCode: "",
          costType: "CONSUMPTION_TAX",
          cost: 0,
          costCurrency: "USD"
        }
      ],
      from: null, /// 从排柜页面跳转过来
      deliveryPlanCode: "", //送货计划单编码
      boxCarTypeList: [],
      overseasWarehouseRegion: "",
      fmWarehouseCode: "" // 服务商编码
    }
  },
  components: {
    operationlog
  },
  async created() {
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
    getObjByType("internal_transaction_order_stats").then((res) => {
      if (res.data.code === 0) {
        this.internalStatus = res.data.data
      }
    })
    getObjByType("logistics_cost_type").then((res) => {
      if (res.data.code === 0) {
        this.costType = res.data.data
      }
    })
    costListAll().then((res) => {
      if (res.data.code === 0) {
        this.costList = res.data.data
      }
    })
    await this.isFromContainerGenerate()
    this.getBoxCarTypeList()
  },
  activated() {
    this.isChangeFlag = false
    if (this.state !== "add" && this.from == null) {
      this.watchDetailById(this.transferId)
    }
    if (this.state === "detail") {
      // getCostInfoById({ transferId: this.transferId }).then(res => {
      //   if (res.data.code === 0) {
      //     this.costTableData = res.data.data.costDetails
      //   }
      // })
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
    },
    skuPackageWightTotal() {
      return this.createTableData.reduce((total, row) => total + row.skuPackageWight * 1 * row.planCount, 0).toFixed(2)
    },
    skuPackageVolumeTotal() {
      return this.createTableData.reduce((total, row) => total + row.skuPackageVolume * 1 * row.planCount, 0).toFixed(2)
    },
    skuTotal() {
      return this.createTableData.reduce((total, row) => total + row.planCount * 1, 0)
    },
    skuTotalMoney() {
      return this.createTableData.reduce((total, row) => total + row.unitPrice * row.planCount, 0).toFixed(2)
    }
  },
  watch: {
    providerCode(newVal) {
      console.log("newVal", newVal)

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
      let containerModelData = this.containerModelOptions.filter((options) => {
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
    },
    async createTableData(val, oldVal) {
      if (this.loadCount == 1) return
      if (!val.length) {
        this.importTariffData = []
        return
      }
      const postData = {
        sourceCountry: this.baseInfo.fmCountryCode,
        targetCountry: this.baseInfo.toCountryCode,
        reqQueryDtos: val.map(
          ({
            skuId,
            skuCode,
            corporationId,
            platform,
            site,
            cabinetCode,
            purchaseOrderNo,
            wmsInboundNo,
            planCount,
            priceModel,
            currency,
            unitPrice,
            shippingContainerNo
          }) => ({
            skuId,
            skuCode,
            corporationId,
            platform,
            site,
            cabinetCode,
            purchaseOrderNo,
            wmsInboundNo,
            planCount,
            priceModel,
            currency,
            unitPrice,
            shippingContainerNo
          })
        )
      }
      this.getListCustomsDeclarationMsg(postData)
      // return
      const data = await this.getListCustomsDeclarationMsg(postData)
      this.importTariffData = data.map((item) => {
        return {
          ...item,
          totalRate: this.formatNumber(item.totalRate * 100),
          consumptionRate: this.formatNumber(item.consumptionRate * 100),
          totalTaxAmount: this.formatNumber(item.targetTotalValueOfGoods * item.totalRate, item.targetCurrencyAccuracy),
          consumptionTaxAmount: this.formatNumber(
            item.targetTotalValueOfGoods * item.consumptionRate,
            item.targetCurrencyAccuracy
          )
        }
      })

      // 新增是 需要把关税清单的币种给调拨费用币种赋值
      if (this.importTariffData.length) {
        this.costTableData.forEach((item) => {
          if (item.costType === "TARIFF" || item.costType === "CONSUMPTION_TAX") {
            this.$set(item, "costCurrency", this.importTariffData[0].targetCurrency)
          }
        })
      }

      if (this.costTableData.length && this.state !== "detail") {
        this.costTableData.forEach((item) => {
          if (item.costType === "TARIFF") {
            this.$set(item, "cost", this.calculateTotal(this.importTariffData, "totalTaxAmount"))
          }
          if (item.costType === "CONSUMPTION_TAX") {
            this.$set(item, "cost", this.calculateTotal(this.importTariffData, "consumptionTaxAmount"))
          }
        })
      }
    },
    costTableData: {
      handler(newVal, oldVal) {
        newVal.forEach((item) => {
          if (this.state == "detail" || this.state == "edit") {
            if (item.costType === "TARIFF") {
              this.$set(item, "cost", this.calculateTotal(this.importTariffData, "totalTaxAmount"))
            }
            if (item.costType === "CONSUMPTION_TAX") {
              this.$set(item, "cost", this.calculateTotal(this.importTariffData, "consumptionTaxAmount"))
            }
          }
        })
      },
      deep: true // 深度监听数组变化
    },
    importTariffData(val, oldVal) {
      if (val.length) {
        this.importTariffCurrency = val[0].targetCurrency
      } else {
        this.importTariffCurrency = "CAD"
      }
    }
  },
  methods: {
    // 获取全部的车型箱型
    getBoxCarTypeList() {
      let filtering = []
      if (this.fmWarehouseCode) {
        filtering = [
          {
            field: "carrierCode",
            operator: "EQUAL",
            value: [this.fmWarehouseCode]
          }
        ]
      }
      listPage({
        page: 1,
        pageSize: 9999,
        filtering,
        orderBy: setOrderBy(null, [
          {
            field: "updateTime",
            order: "desc"
          }
        ])
      }).then(({ data }) => {
        if (data.code == 0) {
          this.boxCarTypeList = data.data.records.filter(
            (record, index, self) => self.findIndex((r) => r.boxCarType === record.boxCarType) === index
          )
        }
      })
    },
    async isFromContainerGenerate() {
      const { from, shipmentPlanCode, transferBusinessType, deliveryPlanCode } = this.$route.query
      this.deliveryPlanCode = deliveryPlanCode
      this.from = from
      this.baseInfo.transferBusinessType = transferBusinessType

      if (from && deliveryPlanCode) {
        const { data } = await getGenerateTransfer(deliveryPlanCode)
        console.log("排柜信息 获取调拨单 ==》data", data.data)
        if (data.code == 0) {
          const {
            transferOutOrgId,
            fmWarehouseId,
            fmWarehouseCode,
            deliveryPlanCode,
            departurePort,
            destinationPort,
            containerType,
            overseasWarehouseRegion
          } = data.data

          this.deliveryPlanCode = deliveryPlanCode
          this.transferInfo.containerModel = containerType
          this.overseasWarehouseRegion = overseasWarehouseRegion
          this.baseInfo.transferOutOrgId = transferOutOrgId
          this.baseInfo.departureHarbour = departurePort
          this.baseInfo.intoHarbour = destinationPort
          this.fmWarehouseCode = fmWarehouseCode
          this.getWarehouse(this.baseInfo.transferInOrgId, "in")
          this.handleTransferOut()
          //运输物流
          this.getLogisticsInformationList(fmWarehouseId)
          this.$nextTick(() => {
            this.baseInfo.fmWarehouseId = fmWarehouseId
            this.baseInfo.fmCountryCode = this.warehouseObj[fmWarehouseId]
          })
        }
      }
    },
    init() {
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
    },
    //数据初始化

    download(url) {
      downloadImgAndPdf({ fileId: url }).then((res) => {
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

      // {
      //     transportCode: this.transferInfo.forwarderTransportCode,
      //     costType: "SHIPMENT",
      //     cost: "",
      //     costCurrency: "USD"
      //   },
      //   {
      //     transportCode: this.transferInfo.sendTransportCode,
      //     costType: "CLEARANCE",
      //     cost: "",
      //     costCurrency: "USD"
      //   },
      //   {
      //     transportCode: this.transferInfo.clearanceTransportCode,
      //     costType: "TARIFF",
      //     cost: 0,
      //     costCurrency: "USD"
      //   },
      //   {
      //     transportCode: this.transferInfo.clearanceTransportCode,
      //     costType: "CONSUMPTION_TAX",
      //     cost: 0,
      //     costCurrency: "USD"
      //   }

      this.paramsArr.forEach((item) => {
        if (item.costType === "SHIPMENT") {
          item.transportCode = this.transferInfo.forwarderTransportCode
        } else if (item.costType === "CLEARANCE") {
          item.transportCode = this.transferInfo.sendTransportCode
        } else if (item.costType === "TARIFF" || item.costType === "CONSUMPTION_TAX") {
          item.transportCode = this.transferInfo.clearanceTransportCode
        }
      })

      for (let i = 0; i < this.paramsArr.length; i++) {
        if (!this.paramsArr[i].transportCode) return
      }

      this.costTableData = this.paramsArr

      if (this.importTariffData.length == 0) return
      const index = this.costTableData.findIndex((item) => item.costType === "TARIFF")
      this.costTableData[index].cost = this.formatNumber(
        this.importTariffData.reduce((total, item) => {
          return total + (item.totalTaxAmount || 0)
        }, 0),
        this.importTariffData[0].targetCurrencyAccuracy == null ? 2 : this.importTariffData[0].targetCurrencyAccuracy
      )
      const index1 = this.costTableData.findIndex((item) => item.costType === "CONSUMPTION_TAX")
      this.costTableData[index1].cost = this.formatNumber(
        this.importTariffData.reduce((total, item) => {
          return total + (item.consumptionTaxAmount || 0)
        }, 0),
        this.importTariffData[0].targetCurrencyAccuracy == null ? 2 : this.importTariffData[0].targetCurrencyAccuracy
      )
    },
    addCost(row) {
      console.log(row)
      this.costTableData.push({
        transportCode: "",
        costType: "",
        cost: "",
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

      // 仅费用类型=运费、关税、清关费、消费税，且仅有1条时不允许删除，其他项均可删除
      if (["SHIPMENT", "CLEARANCE", "TARIFF", "CONSUMPTION_TAX"].find((item) => item === row.costType) && count <= 1) {
        this.$message.warning(`该费用类型只有唯一一条，不可删除！`)
        return
      }

      // if (count <= 1) {
      //   this.$message.warning(`该费用类型只有唯一一条，不可删除！`);
      //   return;
      // }
      this.costTableData.splice(row.$index, 1)
    },
    getFmWarehouse(corporationId, type) {
      getAllWarehouse({
        funcState: "1",
        delFlag: "0",
        corporationId: corporationId
      }).then((res) => {
        if (this.baseInfo.transferBusinessType === "NORMAL") {
          this.warehouseFm = res.data.data
        } else {
          if (type === "out") {
            this.warehouseFm = res.data.data
          } else {
          }
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
      const { areaList } = this.$route.query
      let corporationCode = this.corporationOptions
        .filter((item) => item.value === corporationId)
        .map((i) => i.corporationCode)
      getBseWarehouseInfo({
        funcState: 1,
        corporationCodeList: corporationCode,
        areaList: this.overseasWarehouseRegion?.split(",").filter(Boolean)
      }).then((res) => {
        if (res.data.code === 0) {
          if (this.baseInfo.transferBusinessType === "NORMAL") {
            // this.warehouseFm = res.data.data
            this.warehouseTo = res.data.data
          } else {
            if (type === "out") {
              // this.warehouseFm = res.data.data
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
      this.getFmWarehouse(this.baseInfo.transferOutOrgId, "out")
      this.getWarehouse(this.baseInfo.transferOutOrgId, "out")
    },
    async handleTransferIn() {
      this.baseInfo.toWarehouseId = ""
      this.baseInfo.toCountryCode = ""
      this.baseInfo.transferMode = ""
      this.getWarehouse(this.baseInfo.transferInOrgId, "in")
    },
    /**
     * 如果从发货计划来的  会自带信息 同组织的直接出发回显
     */
    async fromContainerGenerateGetData() {
      if (this.from) {
        const { transferBusinessType, transferOutOrgId, transferInOrgId, fmWarehouseId } = this.baseInfo

        const { data } = await getStockQueryGroupIn({
          transferInOrgId,
          transferOutOrgId,
          warehouseId: fmWarehouseId,
          deliveryPlanCode: this.deliveryPlanCode,
          transferBusinessType
        })
        if (data.code == 0) {
          this.createTableData = data.data.map((item) => {
            return {
              ...item,
              planCount: item.availableQuantity
            }
          })
        }
      }
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

      if (this.state !== "detail") {
        this.transferInfo.logisticsTransportCode = ""
        this.transferInfo.forwarderTransportCode = ""
        this.transferInfo.clearanceTransportCode = ""
        this.transferInfo.sendTransportCode = ""
      }
      let warehouseIds = val
      if (!val) return
      this.getLogisticsInformationList(warehouseIds)
    },
    /**
     * 获取物流信息 下拉列表
     */
    getLogisticsInformationList(warehouseIds) {
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

    watchDetailById(transferId) {
      getDetailInfo({ transferId }).then((res) => {
        let data = res.data.data
        this.handleFmWarehouse(data.fmWarehouseId)
        this.providerCode = data.toCountryCode
        this.costTableData = data.costInfo
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
        this.loadCount += 1
        this.createTableData = data.transferDetails
        this.transferStatus = data.transferStatus
        this.statementDownloadsList = data.statementDownloads
        this.importTariffData = data.wmsCustomsDeclarationMaintenanceMsg.map((ele) => ({
          ...ele,
          totalRate: this.formatNumber(ele.totalRate * 100),
          consumptionRate: this.formatNumber(ele.consumptionRate * 100)
        }))

        getAllWarehouse({
          funcState: "1",
          delFlag: "0"
        }).then((res) => {
          this.warehouseFm = res.data.data
          this.warehouseTo = res.data.data
          this.baseInfo.fmWarehouseId = data.fmWarehouseId
          this.baseInfo.toWarehouseId = data.toWarehouseId
        })

        if (data.costInfo.length === 0) {
          this.geFail()
        }
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
      this.$refs.addForm.validate((vaild) => {
        if (vaild) {
          this.searchForm.warehouseId = this.baseInfo.fmWarehouseId
          this.searchForm.transferInOrgId = this.baseInfo.transferInOrgId
          this.searchForm.transferOutOrgId = this.baseInfo.transferOutOrgId
          this.searchForm.transferBusinessType = this.baseInfo.transferBusinessType
          let inNo = this.searchForm.inNo.split(",")
          let purchaseNo = this.searchForm.purchaseNo.split(",")
          inNo = inNo == "" ? [] : inNo
          purchaseNo = purchaseNo == "" ? [] : purchaseNo
          getStockQueryGroupIn({ ...this.searchForm, inNo, purchaseNo }).then((res) => {
            res.data.data.forEach((item) => {
              item.planCount = item.availableQuantity
            })
            let data = res.data.data
            this.addFormData = data
            console.log(data)
          })
        }
      })
    },
    onClear() {
      this.searchForm = {
        warehouseId: "",
        corporationId: "",
        purchaseNo: "",
        inNo: ""
      }
      this.$refs.addForm.resetFields()
    },

    handleToWarehouse(value) {
      if (value) {
        this.baseInfo.toCountryCode = this.warehouseObj[value]
        this.providerCode = this.warehouseOptions.filter((item) => item.warehouseId === value)[0]?.providerCode
        this.getCountryByParam()
        this.fromContainerGenerateGetData()

        this.fmWarehouseCode = this.warehouseTo.find(
          (item) => item.warehouseId == value
        )?.bseWarehouseProvider.providerCode
        this.getBoxCarTypeList()
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
      const hasPlanCount = this.selectList.some((row) => row.planCount > row.availableQuantity || !row.planCount)
      if (hasPlanCount) {
        this.$message.error("有选中数据计划数量未填写或超出可用库存！")
        return
      }
      console.log("this.createTableData=====", this.createTableData)
      console.log("this.selectList=====", this.selectList)
      this.selectList.forEach((selectedRow) => {
        let data = this.createTableData.find((savedRow) => {
          if (
            savedRow.skuId === selectedRow.skuId &&
            savedRow.site === selectedRow.site &&
            savedRow.platform === selectedRow.platform &&
            savedRow.unitPrice === selectedRow.unitPrice &&
            savedRow.wmsInboundNo === selectedRow.wmsInboundNo
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
      // 清空选中的行
      this.selectList = []
    },
    deleteInNo(index) {
      console.log(index)
      this.createTableData.splice(index, 1)
    },

    async saveTransfer(operateFlag) {
      if (operateFlag === "save") {
        let baseVaild = false
        this.$refs.baseForm.validate((valid) => {
          baseVaild = valid
        })
        let transferVaild = false
        this.$refs.transferForm.validate((valid) => {
          transferVaild = valid
        })
        let importTariffVaild = false
        this.$refs.importTariffForm.validate((valid) => {
          importTariffVaild = valid
        })

        if (!transferVaild || !baseVaild || !importTariffVaild) {
          return
        }

        if (!this.createTableData.length) {
          this.$message.warning("请添加产品信息！")
          return
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
      }
      var res = []
      if (this.state === "add") {
        res = await transferSave({
          ...this.productInfo,
          ...this.transferInfo,
          ...this.baseInfo,
          transferDetails: this.createTableData,
          costInfo: this.costTableData,
          operateFlag,
          wmsCustomsDeclarationMaintenanceMsg: this.importTariffData,
          ...(this.from && { deliveryPlanCode: this.deliveryPlanCode })
        })
      }
      if (this.state === "edit") {
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
          costInfo: this.costTableData,
          transferDetails: this.createTableData,
          operateFlag,
          wmsCustomsDeclarationMaintenanceMsg: this.importTariffData
        })
      }
      if (res.data.code === 0) {
        this.$message.success("操作成功")
        this.$router.$avueRouter.closeTag()
        this.$router.push({
          path: "/logistics/tmstransfer/fristMileTransfer",
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
        let transferVaild = false
        this.$refs.transferForm.validate((valid) => {
          transferVaild = valid
        })
        let importTariffVaild = false
        this.$refs.importTariffForm.validate((valid) => {
          importTariffVaild = valid
        })

        if (!transferVaild || !baseVaild || !importTariffVaild) {
          return
        }

        if (!this.createTableData.length) {
          this.$message.warning("请添加产品信息！")
          return
        }

        let existFreightCost = this.costTableData.every((item) => item.freightCost == 0)
        let existClearanceCost = this.costTableData.every((item) => item.clearanceCost == 0)
        if (existFreightCost) {
          this.$message.warning("至少有一个物流商填写运费！")
          return
        }
        if (existClearanceCost) {
          this.$message.warning("至少有一个物流商填写清关派送费！")
          return
        }
        var res = []
        if (this.state === "add") {
          res = await transferSave({
            ...this.productInfo,
            ...this.transferInfo,
            ...this.baseInfo,
            transferDetails: this.createTableData,
            costInfo: this.costTableData,
            operateFlag,
            wmsCustomsDeclarationMaintenanceMsg: this.importTariffData,
            ...(this.from && { deliveryPlanCode: this.deliveryPlanCode })
          })
        } else if (this.state === "edit") {
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
            costInfo: this.costTableData,
            transferDetails: this.createTableData,
            operateFlag,
            wmsCustomsDeclarationMaintenanceMsg: this.importTariffData
          })
        }
        if (res.data.code === 0) {
          this.$message.success("操作成功")
          this.$router.$avueRouter.closeTag()
          this.$router.push({
            path: "/logistics/tmstransfer/fristMileTransfer",
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
    async getListCustomsDeclarationMsg(optData) {
      const { data } = await getListCustomsDeclarationMsg(optData)
      if (data.code === 0) {
        return data.data
      } else {
        return []
      }
    },
    formatNumber(num, precision = 4) {
      if (Number.isInteger(num)) {
        return Number(num)
      } else {
        return Number(num.toFixed(precision).replace(/\.?0+$/, ""))
      }
    },
    calculateTotal(data, field) {
      return this.formatNumber(
        data.reduce((sum, item) => sum + (item[field] || 0), 0),
        2
      )
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = "汇总"
          return
        }
        const values = data.map((item) => Number(item[column.property]))
        const propertyList = [
          "poTotalValueOfGoods",
          "targetTotalValueOfGoods",
          "totalTaxAmount",
          "consumptionTaxAmount"
        ]
        if (propertyList.includes(column.property)) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return this.formatNumber(prev + curr, 2)
            } else {
              return this.formatNumber(prev, 2)
            }
          }, 0)
        } else {
          sums[index] = ""
        }
      })

      return sums
    },
    totalRateChange(value, row) {
      this.$set(
        row,
        "totalTaxAmount",
        this.formatNumber(
          (row.targetTotalValueOfGoods / 100) * value,
          row.targetCurrencyAccuracy == null ? 2 : row.targetCurrencyAccuracy
        )
      )
      const index = this.costTableData.findIndex((item) => item.costType === "TARIFF")
      this.costTableData[index].cost = this.formatNumber(
        this.importTariffData.reduce((total, item) => {
          return total + (item.totalTaxAmount || 0)
        }, 0),
        row.targetCurrencyAccuracy == null ? 2 : row.targetCurrencyAccuracy
      )
    },
    consumptionRateChange(value, row) {
      this.$set(
        row,
        "consumptionTaxAmount",
        this.formatNumber(
          (row.targetTotalValueOfGoods / 100) * value,
          row.targetCurrencyAccuracy == null ? 2 : row.targetCurrencyAccuracy
        )
      )
      const index = this.costTableData.findIndex((item) => item.costType === "CONSUMPTION_TAX")
      this.costTableData[index].cost = this.formatNumber(
        this.importTariffData.reduce((total, item) => {
          return total + (item.consumptionTaxAmount || 0)
        }, 0),
        row.targetCurrencyAccuracy == null ? 2 : row.targetCurrencyAccuracy
      )
    },
    validateFloatTen(rule, value, callback) {
      // 正则表达式匹配最多10位整数，可选的小数部分
      var reg = /^(?:\d{1,10})(\.\d+)?$/

      // 验证输入是否符合正则表达式
      if (reg.test(value)) {
        callback() // 验证通过
      } else {
        // 如果输入的整数部分超过10位或者输入的是非数字字符，则验证失败
        callback(new Error("整数部分不能超过10位"))
      }
    },
    /**是否非负数 */
    validateFloat(rule, value, callback) {
      var reg = /^\d+(\.\d+)?$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error("只能输入非负数"))
      }
    },
    /**最多保留两位小数 */
    validateFloatFourDigit(rule, value, callback) {
      var reg = /^\d+(\.\d{1,4})?$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error("最多保留四位小数"))
      }
    },
    // 获取国家对应币种
    async getCountryByParam() {
      if (!this.baseInfo.toCountryCode) return
      const { data } = await getCountryByParamApi({ countryCodeList: [this.baseInfo.toCountryCode] })
      const currency = data.data[0].baseCurrency
      // 根据目的国家显示币种
      this.paramsArr.forEach((item) => {
        if (["TARIFF", "CONSUMPTION_TAX"].includes(item.costType)) {
          item.costCurrency = currency
        }
      })
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
.import-tariff .fixedTop {
  position: static !important;
}
</style>
