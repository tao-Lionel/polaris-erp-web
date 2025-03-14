<template>
  <div id="orderManage">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="pages"
        :data="tableData"
        :option="tableOption"
        @on-load="getList"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @selection-change="selectionChange"
        :cell-class-name="getCellClass"
        @sort-change="sortChange"
        :row-key="'id'"
      >
        <template slot="menuLeft">
          <el-tabs v-model="menuLeftModel" @tab-click="changeOrderStatus">
            <el-tab-pane
              v-for="item in orderAllStatus"
              :key="item.key"
              :label="item.statusName"
              :name="item.key"
            ></el-tab-pane>
          </el-tabs>

          <div class="tableBeforeSlot-elbutton">
            <el-popover
              placement="bottom"
              v-model="addOrderStatus"
              v-if="permissions.oms_order_manage_add"
              style="margin-right: 10px"
            >
              <div>
                <el-button size="small" @click="toAddOrder">手工下单</el-button>
                <el-button size="small" @click="showImport">导入订单</el-button>
              </div>
              <el-button type="primary" size="small" slot="reference" v-if="permissions.oms_order_manage_add">
                新增
              </el-button>
            </el-popover>

            <el-button
              type="primary"
              size="small"
              @click="setLabel('')"
              :disabled="!selectRows.length"
              v-if="permissions.oms_order_manage_modify_label"
            >
              修改标签
            </el-button>
            <el-button
              v-if="permissions.oms_order_manage_receive"
              type="primary"
              size="small"
              @click="batchAcceptOrder"
            >
              接收订单
            </el-button>
            <el-dropdown-button
              type="primary"
              size="small"
              buttonText="标记为待确认"
              :command="1"
              @command="modifyUnconfirm"
              v-if="permissions.oms_order_manage_un_confirm"
            >
              <el-dropdown-item :command="2" v-if="permissions.oms_order_manage_reDeal">取消待确认</el-dropdown-item>
            </el-dropdown-button>

            <el-button type="primary" size="small" @click="batchConfirm" v-if="permissions.oms_order_manage_confirm">
              批量确认订单
            </el-button>
            <el-button type="primary" size="small" @click="importArm" v-if="permissions.oms_order_manage_create_fo">
              批量生成发货批次单
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="handlePoBatchCreateFo"
              v-if="permissions.oms_order_manage_create_fo_PO"
            >
              PO批量生成发货批次单
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="cancelAbnormal"
              :disabled="!selectRows.length"
              v-if="permissions.oms_order_manage_cancell_abnormal"
              >取消异常标识</el-button
            >
            <el-button type="primary" size="small" @click="exportOrder" v-if="permissions.oms_order_manage_export">
              导出订单
            </el-button>
            <el-dropdown trigger="hover" style="margin-right: 10px">
              <el-button type="primary" size="small">上传附件</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in antiDumpingBill"
                  :key="item.value"
                  @click.native="downloadInvoiceTemplate(item)"
                >
                  {{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown size="small" style="margin-right: 10px">
              <el-button type="primary" size="small">
                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="permissions.oms_order_manage_sync" @click.native="synchronous">
                  同步订单
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="permissions.oms_order_manage_batchUpdateSKU"
                  @click.native="batchModifySku"
                  :disabled="!selectRows.length"
                >
                  批量修改SKU
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="permissions.oms_order_manage_batchImportUpdateSKU"
                  @click.native="handleBatchImportSku"
                >
                  批量导入修改SKU
                </el-dropdown-item>
                <el-dropdown-item @click.native="remarkDialog = true" :disabled="!selectRows.length">
                  批量新增备注
                </el-dropdown-item>
                <el-dropdown-item :disabled="!selectRows.length" @click.native="handleBatchGetPickupTime">
                  批量获取提货时间
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="permissions.oms_order_manage_releaseStock"
                  @click.native="releaseQuantityList"
                  :disabled="!selectRows.length"
                >
                  释放占用库存
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="permissions.oms_order_manage_orderReFreeze"
                  @click.native="changeFreeze"
                  :disabled="!selectRows.length"
                >
                  取消冻结
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="permissions.oms_order_manage_batchCancel"
                  @click.native="handleBatchCancelButton"
                  :disabled="!selectRows.length"
                >
                  批量取消订单
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="permissions.oms_order_manage_updateFaceSheet"
                  @click.native="handleBatchUploadFaceSheet"
                >
                  批量上传面单
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>

        <template slot="search">
          <el-form :model="searchForm" ref="searchForm" :inline="true">
            <el-form-item>
              <el-input
                v-model="searchForm.orderCode"
                size="small"
                placeholder="订单号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="searchForm.sourceCode"
                size="small"
                placeholder="平台单号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="searchForm.platformOrderCode"
                size="small"
                placeholder="平台订单编码,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="searchForm.extendCodes"
                size="small"
                placeholder="ARN/排柜号,支持多个"
                v-search-input
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="searchForm.platformCode"
                size="small"
                placeholder="平台,支持多个"
                @visible-change="getMarket"
                filterable
                clearable
                multiple
                collapse-tags
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
            <el-form-item>
              <select-all
                ref="selectAllRef"
                :selectValue.sync="searchForm.marketId"
                size="small"
                placeholder="站点,支持多个"
                @change="updateMarketId"
                @visible-change="visibleChangeSit"
                :options="sit"
                keyName="sitName"
                labelName="sitName"
              >
              </select-all>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="searchForm.shopIds"
                size="small"
                placeholder="店铺,支持多个"
                collapse-tags
                filterable
                multiple
                clearable
              >
                <el-option v-for="item in store" :key="item.storeId" :label="item.storeAccount" :value="item.storeId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="searchForm.orderBusinessType"
                size="small"
                placeholder="交货模式"
                filterable
                clearable
              >
                <el-option v-for="item in orderBusinessType" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="searchForm.accessMode" size="small" placeholder="订单来源" filterable clearable>
                <el-option v-for="item in operateType" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="searchForm.orderTypeList"
                size="small"
                placeholder="订单类型"
                multiple
                filterable
                clearable
              >
                <el-option v-for="item in orderType" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="searchForm.fulfillmentStatus"
                size="small"
                placeholder="订单状态,支持多个"
                multiple
                filterable
                collapse-tags
                @change="changeFullStatus"
                clearable
              >
                <el-option v-for="item in fulfillmentStatus" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="exclude-label">
              <el-select
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
            <el-form-item>
              <el-select v-model="searchForm.orderSkuNumType" size="small" placeholder="订单数量" filterable clearable>
                <el-option v-for="item in orderCountArr" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="searchForm.soAbnormalType" size="small" placeholder="异常类型" filterable clearable>
                <el-option v-for="item in abnormal" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot="searchAdvanced">
          <el-form :model="searchForm" ref="searchForm" :inline="true">
            <el-form-item>
              <el-select
                v-model="searchForm.warehouseIds"
                size="small"
                placeholder="仓库,支持多个"
                filterable
                collapse-tags
                multiple
                clearable
                :filter-method="filterWarehouse"
                @visible-change="visibleWarehouse"
              >
                <el-option
                  v-for="item in warehouse"
                  :key="item.warehouseId"
                  :label="item.warehouseName"
                  :value="item.warehouseId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="searchForm.deliveryMethod" size="small" placeholder="发货方式" filterable clearable>
                <el-option label="平台仓发货" value="PLATFORM"></el-option>
                <el-option label="海外仓发货" value="WAREHOUSE"></el-option>
                <el-option label="中转仓发货" value="TRANSIT"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="searchForm.relationStatus" size="small" placeholder="售后状态" filterable clearable>
                <el-option v-for="item in afterSaleStatusList" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="searchForm.freezeStatus" size="small" placeholder="是否冻结订单" filterable clearable>
                <el-option label="是" value="FROZEN"></el-option>
                <el-option label="否" value="NORMAL"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="searchForm.existPickUpTime"
                size="small"
                placeholder="是否存在提货时间"
                filterable
                clearable
              >
                <el-option label="存在" value="1"></el-option>
                <el-option label="不存在" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="needChangeSelect">
              <el-input placeholder="请输入内容" v-model="selectValue" size="small">
                <el-select v-model="selectLabel" slot="prepend" placeholder="请选择">
                  <el-option
                    v-for="item in searchName"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item class="needChangeTime">
              <el-select v-model="timeLabel" size="small" placeholder="请选择">
                <el-option v-for="item in serarchTime" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-date-picker
                v-model="timeValue"
                size="small"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </template>

        <template slot="labels" slot-scope="scope">
          <div v-if="scope.row.labels && scope.row.labels.length <= 3">
            <el-tag style="margin: 0 10px 5px 0" :type="item.labelColor" v-for="item in scope.row.labels" :key="item.id"
              >{{ item.name }}
            </el-tag>
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
        <template slot="spliceProducts" slot-scope="scope">
          <div v-for="(item, index) in scope.row.spliceProducts" :key="index">
            <span>{{ item.sku ? item.sku : "暂无SKU" }}</span>
            <span style="color: #1380e6">*{{ item.quantity }}</span>
            <span style="margin-left: 10px">{{ item.name ? item.name : "暂无商品名称" }}</span>
            <a v-if="!item.sku" style="font-size: 12px; color: #1380e6; margin-left: 10px" @click="mateSku(scope.row)">
              匹配SKU
            </a>
          </div>
          <div style="text-align: center; font-size: 12px" v-if="scope.row.isMoreProducts">
            <router-link
              style="width: auto; margin-right: 10px"
              :to="{
                path: '/order/orderManages/detailEdit',
                query: { id: scope.row.id }
              }"
            >
              <span style="font-weight: bold; color: black">……</span>
            </router-link>
          </div>
        </template>
        <template slot="orderCode" slot-scope="scope">
          <div>
            <copy-text hoverToShow>
              <a @click="goOrderDetail(scope.row)">{{ scope.row.orderCode }}</a>
            </copy-text>
            <div>
              <el-tag type="primary" size="mini" style="margin-right: 5px">{{ scope.row.deliveryName }}</el-tag>
              <el-tag type="primary" size="mini" style="margin-right: 5px">{{ scope.row.orderBusinessType }}</el-tag>
              <el-tag type="danger" size="mini" v-if="scope.row.freezeStatus === 'FROZEN'">冻结</el-tag>
            </div>
          </div>
        </template>
        <template slot="syncConfirmFlagName" slot-scope="scope">
          <p>{{ scope.row.syncConfirmFlagName }}</p>
          <p>{{ scope.row.syncDeliveryFlagName }}</p>
          <p>{{ scope.row.syncCancelFlagName }}</p>
        </template>
        <template slot="platformCode" slot-scope="scope">
          <p>{{ scope.row.platformCode }} / {{ scope.row.market }}</p>
        </template>
        <template slot="warehouseName" slot-scope="scope">
          <span>{{ scope.row.warehouseName }}</span>
        </template>
        <template slot="logisticsName" slot-scope="scope">
          <p v-for="item in scope.row.logisticsName" :key="item" style="margin-right: 10px">{{ item }}</p>
        </template>
        <template slot="logisticsChannel" slot-scope="scope">
          {{ scope.row.logisticsChannel }}
        </template>
        <template slot="createTime" slot-scope="scope">
          <p>{{ scope.row.createName }}</p>
          <p>{{ scope.row.createTime }}</p>
        </template>
        <template slot="updateTime" slot-scope="scope">
          <p>{{ scope.row.updateName }}</p>
          <p>{{ scope.row.updateTime }}</p>
        </template>

        <!-- 物流备注/运营备注 -->
        <template slot="omsSoOrderRemarks" slot-scope="scope">
          <el-popover v-if="scope.row?.omsSoOrderRemarks?.length" placement="top-start" width="auto" trigger="hover">
            <copy-text hoverToShow slot="reference">
              {{ scope.row?.omsSoOrderRemarks?.[0]?.content }}
            </copy-text>

            <div style="display: flex; flex-direction: column">
              <span v-for="item in scope.row?.omsSoOrderRemarks" :key="item.id">
                <copy-text hoverToShow>{{ item.updateTime }} {{ item.content }}</copy-text>
              </span>
            </div>
          </el-popover>
          <div v-else>-</div>
        </template>

        <template slot-scope="scope" slot="opeSolt">
          <avue-crud-ctrl :list="getCtrlList(scope)"></avue-crud-ctrl>
        </template>
      </avue-crud>

      <!-- 同步订单弹窗 -->
      <el-dialog
        v-if="synchronousStatus"
        title="同步订单"
        :visible.sync="synchronousStatus"
        :before-close="synCancel"
        width="30%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form :model="synchronousForm" ref="synchronousForm" style="padding: 0 20px" :rules="synchronousRule">
          <el-form-item prop="orderNumber" label="平台单号">
            <el-input v-model="synchronousForm.orderNumber" placeholder="请输入平台单号" clearable></el-input>
          </el-form-item>
          <el-form-item label="店铺" prop="shopId">
            <el-select v-model="synchronousForm.shopId" size="small" placeholder="请选择店铺" filterable clearable>
              <el-option v-for="item in store" :key="item.storeId" :label="item.storeAccount" :value="item.storeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务类型" prop="orderBusinessType">
            <el-select v-model="synchronousForm.orderBusinessType" size="small" placeholder="请选择业务类型" clearable>
              <el-option v-for="item in orderBusinessType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="distributorId" label="供应商ID" v-if="synchronousForm.orderBusinessType === 'DSV'">
            <el-input v-model="synchronousForm.distributorId" placeholder="请输入供应商ID" clearable></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center; margin-top: 20px">
          <el-button size="small" style="padding: 9px 30px" @click="synCancel">取消</el-button>
          <el-button size="small" style="padding: 9px 30px" :loading="loadingStatus" type="primary" @click="synConfirm"
            >确认</el-button
          >
        </div>
      </el-dialog>

      <!-- 取消订单弹窗 -->
      <el-dialog
        v-if="cancelOrderStatus"
        title="取消订单"
        :visible.sync="cancelOrderStatus"
        width="70%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <avue-crud :data="cancelOrderObj.cancelDetails" :option="cancelOrderOption">
          <template slot="cancelQuantity" slot-scope="scope">
            <el-input-number
              style="width: 100%"
              v-model="scope.row.cancelQuantity"
              :controls="false"
              :min="0"
              :max="scope.row.waitCancelQuantity"
              size="small"
            ></el-input-number>
          </template>
        </avue-crud>
        <div style="text-align: center; margin-top: 20px">
          <el-button size="small" style="padding: 9px 30px" @click="orderCancel">取消</el-button>
          <el-button
            size="small"
            style="padding: 8px 30px"
            :loading="loadingStatus"
            type="primary"
            @click="cancelOrderConfirm"
            >确定</el-button
          >
        </div>
      </el-dialog>

      <!-- 生成发货批次单 -->
      <el-dialog
        v-if="deliveryStatus"
        title="生成发货批次单"
        :visible.sync="deliveryStatus"
        width="90%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        id="orderManage-dialog"
      >
        <div>
          <p class="confirm-tips">
            请检查订单发货信息、sku匹配等是否正确，生成发货批次单后将不可变更！若需下发至三方仓可到发货单管理页面操作
          </p>
          <el-table :data="deliveryTableData" :border="true" :max-height="400" style="width: 100%">
            <el-table-column prop="soOrderDetailId" label="商品明细号" width="160"> </el-table-column>
            <el-table-column prop="skuCode" label="SKU" width="160"> </el-table-column>
            <el-table-column prop="asin" label="平台SKU" width="160"> </el-table-column>
            <el-table-column prop="skuName" label="产品名称"> </el-table-column>
            <el-table-column prop="expectedQuantity" label="数量" width="60"> </el-table-column>
            <el-table-column prop="confirmQuantity" label="确认发货量" width="100"> </el-table-column>
            <el-table-column prop="waitSplitQuantity" label="可拆单数量" width="100"> </el-table-column>
            <el-table-column prop="warehouseId" label="发货仓库" width="170">
              <template slot="header">
                <span style="color: red">*</span>
                <span>发货仓库</span>
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.warehouseName" disabled></el-input>
              </template>
            </el-table-column>

            <el-table-column prop="transportCode" label="物流商" width="170" v-if="logisticsModel">
              <template slot="header">
                <span style="color: red">*</span>
                <span>物流商</span>
              </template>
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.transportCode"
                  size="small"
                  placeholder="全部"
                  @change="getLogisticsChannel($event, scope.row)"
                >
                  <el-option
                    v-for="item in scope.row.bseTransportCarriers"
                    :key="item.transportCarrierCode"
                    :label="item.carrierName"
                    :value="item.transportCarrierCode"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column prop="logisticsChannel" label="物流渠道" width="170" v-if="logisticsModel">
              <template slot="header">
                <span style="color: red">*</span>
                <span>物流渠道</span>
              </template>
              <template slot-scope="scope">
                <el-select v-model="scope.row.logisticsChannel" size="small" placeholder="全部">
                  <el-option
                    v-for="item in scope.row.bseChannels"
                    :key="item.bseChannelCode"
                    :label="item.bseChannelName"
                    :value="item.bseChannelCode"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column
              v-if="isOrderBusinessType && logisticsModel"
              prop="extendCode"
              label="ARN/排柜号"
              width="170"
            >
              <template slot="header">
                <span style="color: red">*</span>
                <span>ARN/排柜号</span>
              </template>
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.extendCode"></el-input>
              </template>
            </el-table-column>

            <el-table-column label="操作" fixed="right" width="80">
              <template slot-scope="scope">
                <div style="text-align: center">
                  <el-popover
                    v-if="scope.row.isInit"
                    placement="top"
                    width="190"
                    ref="popoverRef"
                    @hide="deliveryHideSplit"
                    trigger="click"
                  >
                    <div>
                      <div style="display: flex; margin-bottom: 10px">
                        <span>可发货量：</span><span>{{ deliverySplitObj.purchaseCount }}</span>
                      </div>
                      <div style="display: flex; align-items: center">
                        <span>拆分量：</span>
                        <el-input-number
                          controls-position="right"
                          :controls="false"
                          :min="0"
                          :max="deliverySplitObj.purchaseCount - 1"
                          size="small"
                          v-model="deliverySplitObj.splitCount"
                        ></el-input-number>
                      </div>
                      <div style="text-align: center; margin-top: 20px">
                        <el-button
                          size="small"
                          style="padding: 7px 15px"
                          type="primary"
                          :disabled="deliverySplitObj.purchaseCount === 1"
                          @click="deliverysureSplit(scope.$index, scope.row)"
                          >确认</el-button
                        >
                      </div>
                    </div>
                    <el-button
                      type="text"
                      slot="reference"
                      :disabled="scope.row.validQuantity === 1"
                      @click="toDeliverySplit(scope.row)"
                      >拆分</el-button
                    >
                  </el-popover>
                  <el-button
                    type="text"
                    style="color: red"
                    v-else-if="!scope.row.isInit"
                    @click="deliveryRemoveSplit(scope.$index)"
                    >取消拆分</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="text-align: center; margin-top: 20px">
          <el-button size="small" style="padding: 9px 30px" @click="deliveryStatus = false">取消</el-button>
          <el-button
            size="small"
            style="padding: 9px 30px"
            :loading="loadingStatus"
            type="primary"
            @click="deliveryConfirm"
            >确认</el-button
          >
        </div>
      </el-dialog>

      <!-- 获取面单 -->
      <el-dialog
        v-if="faceSheetStatus"
        title="面单"
        :visible.sync="faceSheetStatus"
        width="35%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div>
          <avue-crud :data="faceSheetData" :option="faceSheetOption">
            <template slot="faceSheetUrl" slot-scope="scope">
              <el-popover placement="right" width="500" trigger="click">
                <img :src="scope.row.faceSheetUrl" width="500px" alt="" />
                <el-button type="text" slot="reference">面单</el-button>
              </el-popover>
            </template>
            <template slot="changeOrder" slot-scope="scope">
              <div style="text-align: center" v-if="isFacesheetOpe">
                <i
                  class="el-icon-caret-top"
                  @click="goTop(scope.row)"
                  v-if="scope.row.$index"
                  style="font-size: 18px; cursor: pointer"
                ></i>
                <i v-else style="width: 18px; height: 18px"></i>
                <i
                  class="el-icon-caret-bottom"
                  @click="goBottom(scope.row)"
                  v-if="scope.row.$index != faceSheetData.length - 1"
                  style="margin-left: 10px; font-size: 18px; cursor: pointer"
                ></i>
                <i v-else style="margin-left: 10px; width: 18px; height: 18px"></i>
              </div>
              <span v-else>无</span>
            </template>
          </avue-crud>
          <div style="text-align: center; margin-top: 20px" v-if="isFacesheetOpe">
            <el-button size="small" style="padding: 9px 30px" @click="faceSheetStatus = false">取消</el-button>
            <el-button
              size="small"
              style="padding: 9px 30px"
              :loading="loadingStatus"
              type="primary"
              @click="faceSheetConfirm"
              >确认</el-button
            >
          </div>
        </div>
      </el-dialog>

      <!-- 修改SKU弹窗 -->
      <el-dialog
        v-if="mateSkuStatus"
        title="修改SKU"
        :visible.sync="mateSkuStatus"
        width="900px"
        @close="closeMateSku"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <avue-crud
          ref="mateSkuCrud"
          :data="mateSkuData"
          :option="batchMateSkuOption"
          @search-change="batchSkuSearchChange"
        >
          <template slot="search">
            <el-form :model="mateSkuForm" ref="mateSkuForm">
              <el-form-item prop="sellerSku">
                <el-input v-model="mateSkuForm.sellerSku" size="small" placeholder="平台SKU" clearable></el-input>
              </el-form-item>
              <el-form-item prop="skuCode">
                <el-input v-model="mateSkuForm.skuCode" size="small" placeholder="SKU" clearable></el-input>
              </el-form-item>
            </el-form>
          </template>
          <template slot="imageUrl" slot-scope="scope">
            <img style="width: 60px" :src="scope.row.imageUrl" />
          </template>
          <template slot="opeBtn" slot-scope="scope">
            <a @click="editSku(scope.row)">修改SKU</a>
          </template>
        </avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeMateSku">关 闭</el-button>
        </span>
      </el-dialog>

      <!-- 修改SKU结果 -->
      <el-dialog
        v-if="mateSkuResultStatus"
        title="修改SKU结果"
        :visible.sync="mateSkuResultStatus"
        width="35%"
        @close="closeMateSkuResult"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <avue-crud ref="mateSkuResultCrud" :data="resultVOList" :option="batchMateSkuResultOption">
          <template slot="successFlag" slot-scope="scope">
            <span v-if="scope.row.successFlag">成功</span>
            <span v-else style="color: red">失败</span>
          </template>
        </avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeMateSkuResult">关 闭</el-button>
        </span>
      </el-dialog>

      <newCommonImport
        ref="newCommonImport"
        :downloadUrl="newDownloadUrl"
        :previewUrl="newPreviewUrl"
        :uploadUrl="newUploadUrl"
        :downloadTitle="newDownloadTitle"
        @import="importExcel"
      >
      </newCommonImport>

      <commonImport
        ref="commonImport"
        :downloadUrl="downloadUrl"
        :fileSuffix="fileSuffix"
        :excelStatus="false"
        :excelDangerStatus="excelDangerStatus"
        @import="importExcelBtn"
        @export="exportdangerExcel"
      >
      </commonImport>

      <el-dialog title="新增备注" width="35%" :visible.sync="remarkDialog" @close="remark = ''">
        <avue-crud-input
          maxlength="100"
          type="textarea"
          :rows="3"
          placeholder="请填写备注"
          v-model="remark"
        ></avue-crud-input>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="remarkDialog = false">取消</el-button>
          <el-button size="small" type="primary" @click="batchAddRemark">确认</el-button>
        </div>
      </el-dialog>

      <el-dialog title="释放占用库存" width="80%" :visible.sync="releaseDialog">
        <el-table :data="releaseData">
          <el-table-column prop="soOrderCode" label="订单号"></el-table-column>
          <el-table-column prop="sourceCode" label="平台订单号"></el-table-column>
          <el-table-column prop="sourceLineNo" label="商品明细号"></el-table-column>
          <el-table-column prop="skuCode" label="SKU"></el-table-column>
          <el-table-column prop="asin" label="平台SKU"></el-table-column>
          <el-table-column prop="skuName" label="产品名称"></el-table-column>
          <el-table-column prop="validQuantity" label="确认发货数量"></el-table-column>
          <el-table-column prop="canReleaseQuantity" label="可释放库存数量"></el-table-column>
          <el-table-column prop="shipWarehouseCode" label="发货仓库"></el-table-column>
          <el-table-column prop="backQuantity" label="释放数量">
            <template slot="header">
              <span style="color: red">*</span>
              <span>释放数量</span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.backQuantity" size="small"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="releaseDialog = false">取消</el-button>
          <el-button size="small" type="primary" @click="releaseConfirm">确认</el-button>
        </div>
      </el-dialog>

      <!-- 释放占用库存队列结果 -->
      <el-dialog
        title="提示"
        :visible.sync="releaseResultStatus"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="80%"
        :before-close="releaseResultConfirm"
      >
        <p style="color: red; font-size: 15px; margin-bottom: 10px">
          <span v-if="releaseLoading">正在处理数据，请不要进行任何操作，不要关闭此页面，谢谢！</span>
          <span v-else>释放占用库存数据已处理完毕！</span>
        </p>
        <div style="font-size: 14px; padding: 6px 0; display: flex">
          <p>
            <span>总条数：</span><span>{{ releaseData.length }}</span>
          </p>
          <p style="margin: 0 20px">
            <span>成功条数：</span><span>{{ responseList.successCount }}</span>
          </p>
          <p>
            <span>失败条数：</span><span style="color: red">{{ responseList.failCount }}</span>
          </p>
        </div>
        <el-table :data="responseList.erList" :border="true" :max-height="400" style="width: 100%">
          <el-table-column type="index" label="序号" width="80"> </el-table-column>
          <el-table-column prop="code" label="单据编号" width="210px"></el-table-column>
          <el-table-column prop="skuCode" label="SKU" width="210px"></el-table-column>
          <el-table-column prop="asin" label="平台SKU" width="210px"></el-table-column>
          <el-table-column prop="errorFlag" label="成功/失败" width="85px">
            <template slot-scope="scope">
              <span v-if="!scope.row.errorFlag">成功</span>
              <span v-else style="color: red">失败</span>
            </template>
          </el-table-column>
          <el-table-column prop="errorMsg" label="失败原因"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="releaseResultConfirm" :loading="releaseLoading"
            >关 闭</el-button
          >
        </span>
      </el-dialog>

      <!-- 冻结订单 -->
      <el-dialog title="冻结订单" width="35%" :visible.sync="freezeDialog" @close="freezeCancel">
        <el-form :model="freezeForm" ref="freezeForm" style="padding: 0 10px" :rules="freezeRule">
          <el-form-item prop="receiveName" label="订单号：" style="margin-bottom: 5px">
            <span>{{ freezeForm.orderCode }}</span>
          </el-form-item>
          <el-form-item prop="receiveName" label="平台单号：" style="margin-bottom: 5px">
            <span>{{ freezeForm.sourceCode }}</span>
          </el-form-item>
          <el-form-item prop="remark" label="冻结原因：" style="margin-bottom: 5px">
            <el-input
              v-model="freezeForm.remark"
              type="textarea"
              size="small"
              :rows="3"
              placeholder="请输入收件人"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="freezeCancel">取消</el-button>
          <el-button size="small" type="primary" @click="freezeConfirm">确认</el-button>
        </div>
      </el-dialog>

      <addWorkOrderDialog
        v-model="addWorkOrderVisible"
        :form="'ORDER_GIFT'"
        :id="addWorkOrderId"
        @success="addWorkOrderSuccess"
      ></addWorkOrderDialog>
    </basic-container>
    <!-- DI、PO确认单 -->
    <confirmOrderDialog ref="confirmOrderDialogRef" @updateList="updateList"></confirmOrderDialog>
    <!-- 确认单弹窗 -->
    <confirmOrderOtherDialog ref="confirmOrderOtherDialogRef" @updateList="updateList"></confirmOrderOtherDialog>
    <!-- 设置标签 -->
    <setLabelDialog ref="setLabelDialogRef" @updateList="updateList"></setLabelDialog>
    <!-- 筛选标签 -->
    <searchLabelDialog ref="searchLabelDialogRef" @searchLabel="searchLabel"></searchLabelDialog>
    <!-- 批量取消订单 -->
    <el-dialog title="批量取消订单" width="50%" :visible.sync="batchCancelDialog">
      <p style="padding: 10px 20px">
        “批量取消订单”功能，仅支持
        <span class="color-red">未发货订单的整单取消</span
        >，如需取消部分产品明细，请使用“取消订单”或“强制取消订单”功能。
        <br />
        您勾选了
        <span class="color-red">{{ selectRows.length }}</span
        >条数据，批量取消订单之后，订单状态不可逆，请确认是否需要继续取消订单！
      </p>
      <div style="margin-top: 20px; padding: 0 20px">
        <el-progress
          v-if="batchCancelResult.length"
          :text-inside="true"
          :stroke-width="16"
          :percentage="((batchCancelDoneCount / selectRows.length) * 100).toFixed(2)"
          status="success"
        ></el-progress>

        <div class="box-card" v-if="batchCancelResult.length">
          <p
            class="batch-cancel-result-item"
            :class="[s.type === 'success' ? 'batch-cancel-result-item-success' : 'batch-cancel-result-item-fail']"
            v-for="s in batchCancelResult"
            :key="s"
          >
            {{ s.orderCode }} - {{ s.status }}
          </p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCloseBatchCancel" v-if="!batchCancelResult.length">取 消</el-button>
        <el-button size="small" type="primary" @click="handleBatchCancelOrder" v-if="!batchCancelResult.length">
          确认
        </el-button>
        <el-button size="small" @click="handleCloseBatchCancel(true)" v-if="batchCancelResult.length">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 批量上传 -->
    <batchUploadFile ref="batchUploadFileRef" @updateList="updateList"></batchUploadFile>
    <!-- 接收订单 -->
    <receiveOrderDialog ref="receiveOrderDialogRef" @updateList="updateList"></receiveOrderDialog>
    <!-- 生成发货批次单 -->
    <generationDeliveryBatchDialog
      ref="generationDeliveryBatchDialogRef"
      @updateList="updateList"
    ></generationDeliveryBatchDialog>
    <!-- 批量获取提货时间 -->
    <batchGetPickupTimeDialog ref="batchGetPickupTimeDialogRef" @updateList="updateList"></batchGetPickupTimeDialog>
    <!-- 上传面单 -->
    <uploadOrderFaceSheetDialog
      ref="uploadOrderFaceSheetDialogRef"
      @updateList="updateList"
    ></uploadOrderFaceSheetDialog>
  </div>
</template>

<script>
import {
  tableOption,
  synchronousRule,
  warehouseRule,
  cancelOrderRule,
  batchMateSkuOption,
  mateWarehouseOption,
  faceSheetOption,
  cancelOrderOption,
  importOrderRule,
  batchMateSkuResultOption
} from "@/const/crud/order/orderManage/orderManage"
import {
  getPlayTypeAll,
  getSit,
  getStore,
  getObjByType,
  getCountry,
  getStockNumWithSku,
  hideWarehouse,
  matchOrderTasks,
  getCarriersByWarehouseld,
  syncSingeOrder,
  getOrderCountInfo,
  importOrderData,
  exportErrorExcel,
  cancelAbnormal,
  getOrderShippingLabelOperateInfo,
  customerServiceDeal,
  orderGenerateDelivery,
  getOrderDeliveryOperateInfo,
  orderShippingLabelSave,
  listDbShippingLabel,
  getOrderCancelOperateInfo,
  orderCancel,
  exportData,
  getOrderList,
  batchUpdateSKU,
  saveRemark,
  releaseQuantityList,
  releaseQuantity,
  orderFreeze,
  reDeal,
  orderReFreeze,
  getStoreBySitIds,
  getOrderCodeByPageParamApi,
  getDeliveryOperateInfoApi
} from "@/api/order/orderManage"
import { getListPage } from "@/api/order/labelManage"
import { getAllWarehouse } from "@/api/order/orderRule"
import { fetchList as getSearchWarehouse } from "@/api/baseSetup/bsewarehouse"
import { fetchList as getAsinSku } from "@/api/baseSetup/bseskurelatemanage/bseskurelatemanage"
import { fetchTreeList } from "@/api/product/prdskucategory"
import { fetchBrandAll } from "@/api/product/prdskubrand"
import commonImport from "@/views/cockpit/commonImport"
import newCommonImport from "@/views/cockpit/newCommonImport"
import { downloadBlob, getDictByType } from "@/util/auth"
import { mapGetters } from "vuex"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getStore as getSession, removeStore } from "@/util/store"
import { listAllAfterSaleStatus } from "@/api/order/afterOrderManage.js"
import addWorkOrderDialog from "../afterOrderManage/addDialog.vue"
import confirmOrderDialog from "./components/confirmOrderDialog"
import { getSitInfo } from "@/api/baseSetup/bseplatformsit"
import confirmOrderOtherDialog from "./components/confirmOrderOtherDialog"
import setLabelDialog from "./components/setLabelDialog"
import searchLabelDialog from "./components/searchLabelDialog"
import { batchCancel } from "@/api/order/invoiceManage"
import batchUploadFile from "./components/batchUploadFile"
import receiveOrderDialog from "./components/receiveOrderDialog"
import generationDeliveryBatchDialog from "./components/generationDeliveryBatchDialog.vue"
import batchGetPickupTimeDialog from "./components/batchGetPickupTimeDialog.vue"
import uploadOrderFaceSheetDialog from "./components/uploadOrderFaceSheetDialog.vue"

export default {
  name: "orderManageList",
  components: {
    commonImport,
    newCommonImport,
    addWorkOrderDialog,
    confirmOrderDialog,
    confirmOrderOtherDialog,
    setLabelDialog,
    searchLabelDialog,
    batchUploadFile,
    receiveOrderDialog,
    generationDeliveryBatchDialog,
    batchGetPickupTimeDialog,
    uploadOrderFaceSheetDialog
  },
  data() {
    return {
      newDownloadUrl: "/oms/basis/downloadTemplate",
      newPreviewUrl: "/oms/basis/importDataPreview",
      newUploadUrl: "",
      newDownloadTitle: "",
      faceSheetOption: faceSheetOption,
      faceSheetData: [],
      faceSheetStatus: false,
      isFacesheetOpe: true,
      downloadUrl: "/oms/omsSoOrder/downloadImportOrderTemplate",
      fileSuffix: ".xlsx",
      excelDangerStatus: false,
      //搜索条件，和前端控件绑定
      searchForm: {
        sourceCode: "",
        orderCode: "",
        asin: "",
        postalCode: "",
        beginOrderTime: "",
        endOrderTime: "",
        beginShoppingTime: "",
        endShoppingTime: "",
        platformCode: [],
        marketId: [],
        shopIds: "",
        labelIdList: [],
        warehouseIds: "",
        hasLabelIdFlag: true,
        orderTypeList: [],
        freezeStatus: "",
        relationStatus: "",
        platformOrderCode: "",
        extendCodes: "",
        orderBusinessType: "",
        accessMode: "",
        orderSkuNumType: "",
        soAbnormalType: "",
        deliveryMethod: "",
        fulfillmentStatus: "",
        existPickUpTime: ""
      },
      //确定的搜索条件
      searchFormConfirm: {},
      tableData: [],
      pages: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数旧参数
        page: 1, // 当前页数新参数
        pageSize: 10 // 每页显示多少条
      },
      tableOption: tableOption,
      selectRows: [],
      searchName: [
        { label: "创建人", value: "createName" },
        { label: "更新人", value: "updateName" },
        { label: "SKU", value: "sku" },
        { label: "平台SKU", value: "asin" },
        { label: "收件人", value: "receiveName" },
        { label: "电话", value: "phone" },
        { label: "邮箱", value: "receiveEmail" },
        { label: "地址1", value: "address" }
      ],
      serarchTime: [
        { label: "下单时间", value: "orderTime" },
        { label: "要求发货时间", value: "shoppingTime" },
        { label: "平台下单时间", value: "platOrderTime" },
        { label: "订单创建时间", value: "orderCreateTime" }
      ],
      selectLabel: "createName",
      selectValue: "",
      timeLabel: "orderTime",
      timeValue: "",
      menuLeftModel: "",
      orderAllStatus: [
        { statusName: "全部", key: "" },
        { statusName: "待处理", key: "PENDING", countKey: "pendingCount" },
        { statusName: "待接单", key: "UNRECEIVE", countKey: "unReceiveCount" },
        { statusName: "待确认", key: "UNCONFIRM", countKey: "unConfirmCount" },
        { statusName: "确认", key: "CONFIRM", countKey: "confirmCount" },
        { statusName: "待发货", key: "UNSHIPPED", countKey: "unshippedCount" },
        { statusName: "部分发货", key: "PARTIAL_DELIVERY", countKey: "partialDeliveryCount" },
        { statusName: "已发货", key: "ALREADY_DELIVERY", countKey: "alreadyDeliveryCount" },
        // {statusName: '已签收', key: 'ALREADY_SIGN', countKey: 'alreadySingCount'},
        { statusName: "已取消", key: "CANCELED", countKey: "canceledCount" }
      ],

      synchronousStatus: false,
      synchronousForm: {
        orderNumber: "",
        shopId: "",
        orderBusinessType: ""
      },
      synchronousRule: synchronousRule,
      warehouseStatus: false,
      warehouseForm: {
        orderCodes: [],
        warehouseId: "",
        warehouseCode: "",
        transportCarrierCode: "",
        bseOverseaCarrierCode: ""
      },
      warehouseRule: warehouseRule,
      labelStatus: false,
      tagsContent: [],
      checkAll: false,
      checkedLabel: [],
      labelsArr: [],
      sysLabelsArr: [],
      customizeLabelsArr: [],
      mateWarehouseData: [],
      isHideWareHouse: false,
      treeCategoryData: [],
      brandOption: [],
      mateWarehouseStatus: false,
      mateWarehouseOption: mateWarehouseOption,
      mateWarehouseId: "",
      bseWarehouseInfo: {
        size: -1,
        current: -1,
        warehouseProviderId: "",
        warehouseTypeId: "",
        warehouseName: ""
      },
      addOrderStatus: false,
      importOrderRule: importOrderRule,
      importOrderForm: {},
      splitObj: {
        purchaseCount: 0,
        splitCount: 0,
        maxSplitCount: 0
      },
      platform: [],
      sit: [],
      store: [],
      country: [],
      orderType: [],
      warehouse: [],
      warehouseInitOptions: [],
      mateWarehouse: [],
      logistics: [],
      logisticsChannel: [],
      labels: [],
      orderId: "",
      orderCode: "",
      loadingStatus: false,
      cancelOrderStatus: false,
      cancelOrderObj: {
        cancelDetails: []
      },
      cancelOrderOption: cancelOrderOption,
      cancelOrderForm: {},
      cancelOrderRule: cancelOrderRule,
      cancelReason: [
        { label: "平台", value: "平台" },
        { label: "仓库", value: "仓库" },
        { label: "其他", value: "其他" }
      ],
      abnormal: [],
      orderBusinessType: [],
      operateType: [],
      fulfillmentStatus: [],
      tableDataRow: {},
      deliveryStatus: false,
      deliveryTableData: [],
      deliverySplitObj: {
        purchaseCount: 0,
        splitCount: 0,
        maxSplitCount: 0
      },
      pickerOptions: {
        disabledDate(date) {
          return date.getTime() < new Date().getTime() - 8.67e7
        }
      },
      isInitWare: false,
      warehouseInit: {},
      isOrderBusinessType: "",
      logisticsModel: "",
      forceFlag: false, // 是否强制取消
      orderCountArr: [],
      mateSkuStatus: false,
      mateSkuData: [],
      batchMateSkuOption: batchMateSkuOption,
      mateSkuForm: {
        sellerSku: "",
        skuCode: "",
        current: 1,
        size: 100
      },
      resultVOList: [],
      mateSkuResultStatus: false,
      batchMateSkuResultOption: batchMateSkuResultOption,
      remarkDialog: false,
      remark: "",
      labelSearchInfo: "",
      labelSearchStatus: false,
      releaseData: [],
      releaseDialog: false,
      releaseResultStatus: false,
      releaseLoading: false,
      responseList: {
        erList: [],
        successCount: 0,
        failCount: 0
      },
      overseaLogisticsChannel: "",
      freezeDialog: false,
      freezeRule: {
        remark: [{ required: true, message: "请填写冻结原因", trigger: "change" }]
      },
      freezeForm: {
        remark: "",
        orderCode: ""
      },
      afterSaleStatusList: [],
      addWorkOrderVisible: false,
      addWorkOrderId: "",
      antiDumpingBill: [],
      batchCancelDialog: false,
      batchCancelDoneCount: 0,
      batchCancelResult: []
      // {
      //   successOrders: [],
      //   failedOrders: []
      // }
    }
  },

  created() {
    this.init()
  },
  activated() {
    const status = getSession({ name: "orderListReload", type: "session" })
    if (status) {
      this.searchForm = {}
      this.searchFormConfirm = {}
      this.menuLeftModel = "0"
      this.getList({
        total: 0,
        currentPage: 1,
        page: 1,
        pageSize: 10
      })
      removeStore({
        name: "orderListReload"
      })
    }
  },
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"])
  },
  watch: {
    "warehouseForm.warehouseId"(val) {
      if (!val) {
        this.warehouseForm.transportCarrierCode = ""
        this.warehouseForm.bseOverseaCarrierCode = ""
      }
    },
    "warehouseForm.transportCarrierCode"(val) {
      if (!val) {
        this.warehouseForm.bseOverseaCarrierCode = ""
      }
    },
    "searchForm.platformCode"(val) {
      if (!val.length) {
        this.searchForm.marketId = []
        this.sit = []
        this.getSitAll()
        this.searchForm.shopIds = []
        this.store = []
        this.getStoreList()
      }
    },
    "searchForm.marketId"(val) {
      this.searchForm.shopIds = []
      this.store = []
      // 有平台没站点的情况 根据平台获取店铺
      if (this.searchForm.platformCode?.length && !val.length) {
        this.getStoreList(this.searchForm.platformCode)
      }
      // 没站点没平台的情况，获取所有店铺
      else if (!val.length && !this.searchForm.platformCode?.length) {
        this.getStoreList()
      }
    }
  },
  methods: {
    releaseQuantityList() {
      let params = this.selectRows.map((item) => item.orderCode)
      releaseQuantityList(params).then((res) => {
        if (res.data.code === 0) {
          this.releaseData = res.data.data
          this.releaseDialog = true
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    async releaseConfirm() {
      let ids = this.releaseData.map((item) => {
        return {
          soOrderCode: item.soOrderCode,
          soOrderDetailId: item.soOrderDetailId,
          shipWarehouseId: item.shipWarehouseId,
          backQuantity: item.backQuantity,
          skuCode: item.skuCode,
          asin: item.asin
        }
      })
      this.releaseResultStatus = true
      this.releaseLoading = true
      for (let i = 0; i < ids.length; i++) {
        try {
          const res = await releaseQuantity(ids[i])
          if (res.data.code === 0) {
            if (res.data.data.errorFlag == false) {
              let obj = {
                id: res.data.data.id,
                code: res.data.data.soOrderCode,
                errorFlag: res.data.data.errorFlag,
                skuCode: res.data.data.skuCode,
                asin: res.data.data.asin,
                errorMsg: res.data.data.errorMsg
              }
              this.responseList.erList.push(obj)
              this.responseList.successCount++
            } else {
              let obj = {
                id: res.data.data.id,
                code: res.data.data.soOrderCode,
                errorFlag: res.data.data.errorFlag,
                skuCode: res.data.data.skuCode,
                asin: res.data.data.asin,
                errorMsg: res.data.data.errorMsg
              }
              this.responseList.erList.unshift(obj)
              this.responseList.failCount++
            }
          }
        } catch (error) {
          this.responseList.fail.push(error)
        }
      }
      this.releaseLoading = false
    },
    releaseResultConfirm() {
      this.responseList.erList = []
      this.responseList.successCount = 0
      this.responseList.failCount = 0
      this.releaseResultStatus = false
      this.releaseDialog = false
      this.clearSelectClear()
      this.refreshChange()
    },
    handleClear() {
      // this.checkedLabel = []
      // this.tagsContent = []
      this.$refs.searchLabelDialogRef.handleClear()
    },
    handleExpend(isVisible) {
      if (isVisible) {
        this.$refs.labelSelect.blur()
        this.labelSetType = "筛选"
        this.labelTitle = "标签搜索"
        this.labelSearchInfo = ""
        if (this.sysLabelsArr.length == 0 && this.sysLabelsArr.length == 0) {
          getListPage({ page: -1, pageSize: -1, name: this.labelSearchInfo }).then((res) => {
            if (res.data.code === 0) {
              // this.labelsArr = res.data.data.records
              this.sysLabelsArr = res.data.data.records.filter((item) => item.labelType === "SYS")
              this.customizeLabelsArr = res.data.data.records.filter((item) => item.labelType === "CUSTOMIZE")
            }
          })
        }

        this.$refs.searchLabelDialogRef.openDialog(this.sysLabelsArr, this.customizeLabelsArr, this.labelsArr)
      }
    },
    batchAddRemark() {
      let soOrderCode = this.selectRows.map((item) => item.orderCode)
      let remark = this.remark
      saveRemark({ soOrderCode, remark }).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("操作成功")
          this.remarkDialog = false
        } else {
          this.$message.error(res.data.msg)
          this.remarkDialog = false
        }
      })
    },
    batchModifySku() {
      const status = this.selectRows.every(
        (item) => item.sourceChannel === this.selectRows[0].sourceChannel && item.market === this.selectRows[0].market
      )
      if (!status) {
        this.$message.warning("勾选订单中含有多个平台、站点的订单，请重新勾选！")
        return
      }
      this.mateSkuStatus = true
    },
    closeMateSkuResult() {
      this.mateSkuResultStatus = false
      this.resultVOList = []
    },
    closeMateSku() {
      this.mateSkuForm = {
        sellerSku: "",
        skuCode: "",
        current: 1,
        size: 100
      }
      this.mateSkuData = []
      this.mateSkuStatus = false
      this.clearSelectClear()
      this.getList(this.pages, this.searchFormConfirm)
    },
    batchSkuSearchChange() {
      if (!this.mateSkuForm.sellerSku && !this.mateSkuForm.skuCode) {
        this.$message.warning("平台SKU或者SKU搜索条件不能为空！")
        return
      }
      getAsinSku(this.mateSkuForm).then((res) => {
        if (res.data.code === 0) {
          this.mateSkuData = res.data.data.records.filter((item) => {
            return (
              item.platformTypeCode === this.selectRows[0].sourceChannel && item.sitEnName === this.selectRows[0].market
            )
          })
        }
      })
    },
    editSku(row) {
      let params = {
        ids: [],
        relateId: row.relateId
      }
      params.ids = this.selectRows.map((item) => item.id)
      batchUpdateSKU(params).then((res) => {
        if (res.data.code === 0) {
          this.mateSkuResultStatus = true
          res.data.data.resultVOList.sort((a, b) => b.successFlag - a.successFlag)
          this.resultVOList = res.data.data.resultVOList
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    async init() {
      getOrderCountInfo().then((res) => {
        if (res.data.code === 0) {
          this.orderAllStatus.forEach((item) => {
            if (res.data.data[item.countKey] !== undefined) {
              item.statusName = item.statusName + "(" + res.data.data[item.countKey] + ")"
            }
          })
        }
      })
      getPlayTypeAll().then((res) => {
        if (res.data.code == 0) {
          this.platform = this.sortArray(res.data.data, "platformTypeName")
        }
      })
      getObjByType("order_type").then((res) => {
        if (res.data.code === 0) {
          this.orderType = res.data.data
        }
      })
      getObjByType("abnormal_type").then((res) => {
        if (res.data.code === 0) {
          this.abnormal = res.data.data
        }
      })
      getObjByType("order_business_type").then((res) => {
        if (res.data.code === 0) {
          this.orderBusinessType = res.data.data
        }
      })
      getObjByType("order_operate_type").then((res) => {
        if (res.data.code === 0) {
          this.operateType = res.data.data
        }
      })
      getObjByType("fulfillment_status").then((res) => {
        if (res.data.code === 0) {
          this.fulfillmentStatus = res.data.data
        }
      })
      getObjByType("order_sku_num_type").then((res) => {
        if (res.data.code === 0) {
          this.orderCountArr = res.data.data
        }
      })
      getAllWarehouse().then((res) => {
        if (res.data.code === 0) {
          this.warehouse = res.data.data.filter((item) => item.funcState === "1")
          this.mateWarehouse = deepClone(res.data.data)
          this.warehouseInitOptions = deepClone(this.warehouse)
        }
      })
      this.getStoreList()
      getCountry().then((res) => {
        if (res.data.code === 0) {
          this.country = res.data.data
        }
      })
      getListPage({ page: -1, pageSize: -1 }).then((res) => {
        if (res.data.code === 0) {
          this.labels = res.data.data.records
          this.labelsArr = res.data.data.records
          this.sysLabelsArr = res.data.data.records.filter((item) => item.labelType === "SYS")
          this.customizeLabelsArr = res.data.data.records.filter((item) => item.labelType === "CUSTOMIZE")
        }
      })
      //品类
      fetchTreeList().then((res) => {
        this.treeCategoryData = res.data.data
      })
      //品牌
      fetchBrandAll().then((res) => {
        if (res.data.code === 0) {
          this.brandOption = res.data.data.records.map((item) => {
            return {
              value: item.brandId,
              label: item.brandName
            }
          })
        }
      })
      listAllAfterSaleStatus().then((res) => {
        if (res.data.code === 0) {
          this.afterSaleStatusList = res.data.data
        }
      })
      this.getSitAll()
      this.antiDumpingBill = await getDictByType("anti_dumping_bill_type")
    },
    // 按时间排序
    sortChange(val) {
      this.searchForm.orderByField = val.prop
      if (val.order) {
        this.searchForm.orderByType = val.order === "descending" ? "des" : "asc"
      } else {
        this.searchForm.orderByType = ""
      }
      let searchForm = deepCloneIgnoreNull(this.searchForm)
      this.getList(this.pages, searchForm)
    },
    getCellClass({ row }) {
      if (row.abnormalType) {
        return "isAbnormalFlag"
      }
      if (row.freezeStatus === "FROZEN") {
        return "isFreezeFlag"
      }
    },
    // 导出订单
    exportOrder() {
      Object.assign(this.searchFormConfirm, {
        fulfillmentStatus: this.menuLeftModel === "0" ? this.searchFormConfirm.fulfillmentStatus : [this.menuLeftModel]
      })
      exportData(Object.assign(this.searchFormConfirm, this.pages))
        .then((res) => {
          if (res.data.size < 100) {
            let count = getSession({ name: "downloadCount" })
            this.$store.commit("SET_DOWNLOAD_COUNT", Number(count) + 1)
            this.$message.success(`由于导出订单数据量较大，请点击右上角【下载列表】图标进行查看！`)
          } else {
            this.$message.success(`导出订单成功`)
            downloadBlob(res.data, "导出数据.xls", "application/vnd.ms-excel;charset=utf-8")
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    batchConfirm() {
      this.newUploadUrl = "/oms/omsSoOrder/orderConfirmImport"
      this.newDownloadTitle = "批量确认订单导入模板"
      this.$refs.newCommonImport.syncFn({
        downloadParams: { templateName: "批量确认订单导入模板.xlsx" },
        uploadParams: { templateName: "批量确认订单导入模板.xlsx" }
      })
    },
    async importArm() {
      this.newUploadUrl = "/oms/omsSoOrder/orderGenerateDeliveryImport"
      this.newDownloadTitle = "批量生成发货批次单导入模板"
      this.$refs.newCommonImport.syncFn({
        downloadParams: { templateName: "批量生成发货导入模板.xlsx" },
        uploadParams: { templateName: "批量生成发货导入模板.xlsx" }
      })
    },
    // 导入成功才有的回调
    importExcel(file) {
      this.getList(this.pages, this.searchFormConfirm)
    },
    // 查看面单
    lookFacesheet(row) {
      this.orderCode = row.orderCode
      listDbShippingLabel({ soOrderCode: row.orderCode }).then((res) => {
        if (res.data.code === 0) {
          if (!res.data.data.shippingLabelDetails) {
            this.$message.warning("该订单暂无面单！")
            return
          }
          this.faceSheetData = res.data.data.shippingLabelDetails
          this.faceSheetStatus = true
          this.isFacesheetOpe = false
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 获取面单
    getFacesheet(row) {
      this.isFacesheetOpe = true
      const orderstatus = ["UNCONFIRM"]
      const status = orderstatus.includes(row.fulfillmentStatus)
      if (!status) {
        this.$message.warning("勾选的订单中存在订单状态为非待确认状态，请重新选择！")
        return
      }
      this.orderCode = row.orderCode
      getOrderShippingLabelOperateInfo({ soOrderCode: row.orderCode }).then((res) => {
        if (res.data.code === 0) {
          this.faceSheetData = res.data.data.shippingLabelDetails
          this.overseaLogisticsChannel = res.data.data.overseaLogisticsChannel
          this.faceSheetStatus = true
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    goBottom(row) {
      this.$confirm("此操作将调整面单顺序, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let changeKey = ["faceSheetUrl", "trackingNo", "faceSheet"]
          changeKey.forEach((item) => {
            let old = this.faceSheetData[row.$index + 1][item]
            this.faceSheetData[row.$index + 1][item] = row[item]
            row[item] = old
          })
        })
        .catch(() => {})
    },
    goTop(row) {
      this.$confirm("此操作将调整面单顺序, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let changeKey = ["faceSheetUrl", "trackingNo", "faceSheet"]
          changeKey.forEach((item) => {
            let old = this.faceSheetData[row.$index - 1][item]
            this.faceSheetData[row.$index - 1][item] = row[item]
            row[item] = old
          })
        })
        .catch(() => {})
    },
    // 修改面单
    faceSheetConfirm() {
      const params = {
        soOrderCode: this.orderCode,
        shippingLabelDetails: this.faceSheetData,
        overseaLogisticsChannel: this.overseaLogisticsChannel
      }
      orderShippingLabelSave(params).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("面单更新成功")
          this.faceSheetStatus = false
          this.clearSelectClear()
          this.getList(this.pages, this.searchFormConfirm)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 标记为待确认
    async markUnconfirm() {
      const orderstatus = ["PENDING"]
      const status = this.selectRows.every((item) => {
        return orderstatus.includes(item.fulfillmentStatus)
      })
      if (!status) {
        this.$message.warning("勾选的订单中存在订单状态为非待处理状态，请重新选择！")
        return
      }
      try {
        const data = await this.$confirm(`您勾选${this.selectRows.length}条数据，确认标记为待确认状态吗？`, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        const params = this.selectRows.map((item) => item.orderCode)
        customerServiceDeal(params).then((res) => {
          if (res.data.code === 0) {
            this.$message.success("标记为待确认成功")
            this.clearSelectClear()
            this.getList(this.pages, this.searchFormConfirm)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      } catch (err) {
        console.log("取消", err)
      }
    },
    cancelUnconfirm() {
      this.$confirm(`您勾选了${this.selectRows.length}条订单，确认将这些订单回退至"待处理"状态吗？`, "取消待确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = this.selectRows.map((item) => item.orderCode)
          reDeal(params).then((res) => {
            if (res.data.code === 0) {
              this.$message.success('取消"待确认"标识成功')
              this.clearSelectClear()
              this.getList(this.pages, this.searchFormConfirm)
            }
          })
        })
        .catch(() => {})
    },
    modifyUnconfirm(val) {
      if (!this.selectRows.length) {
        this.$message.warning("请勾选订单！")
        return
      }
      val === 1 ? this.markUnconfirm() : this.cancelUnconfirm()
    },
    // 选择平台的回调
    getMarket(status) {
      if (!status) {
        this.searchForm.marketId = []
        this.searchForm.shopIds = []
        if (!this.searchForm.platformCode.length) return
        getSit(this.searchForm.platformCode).then((res) => {
          if (res.status === 200) {
            this.sit = this.sortArray(res.data, "sitName")
          }
        })
        // 根据平台获取店铺
        this.getStoreList(this.searchForm.platformCode)
      }
    },
    updateMarketId(val) {
      this.$forceUpdate()
    },
    changeFullStatus(val) {
      this.menuLeftModel = "0"
    },
    // 导入
    showImport() {
      this.$refs.commonImport.syncFn()
    },
    importExcelBtn(file) {
      if (!file) {
        this.$message.error("请上传文件!")
        return
      }
      this.$refs.commonImport.openFullScreen()
      let formdata = new FormData()
      formdata.append("file", file.raw)
      importOrderData(formdata).then(({ data }) => {
        if (data.code == 0) {
          if (data.data && data.data.length) {
            const status = data.data.some((item) => item.errorMsg)
            if (!status) {
              this.$refs.commonImport.syncFn()
              this.excelDangerStatus = false
              this.$message.success("导入成功")
            } else {
              this.excelDangerStatus = true
              this.$message.error("导入的excel表格数据有误，请点击异常文件下载查看原因")
            }
          }
        } else if (data.code == 1) {
          this.$message.error(data.msg)
        } else {
          this.$message.error("导入失败")
        }
        this.$refs.commonImport.closeFullScreen()
      })
    },
    async exportdangerExcel(file) {
      let formdata = new FormData()
      formdata.append("file", file.raw)
      let res = await exportErrorExcel(formdata)
        .then((res) => {
          downloadBlob(res.data, "异常文件excel.xls", "application/vnd.ms-excel;charset=utf-8")
        })
        .catch((err) => {
          console.log(err)
        })
    },
    moreOperation(obj) {
      switch (obj.title) {
        case "getFacesheet":
          this.getFacesheet(obj.row)
          break
        case "lookFacesheet":
          this.lookFacesheet(obj.row)
          break
        case "cancelOrder":
          this.forceFlag = obj.forceFlag
          this.cancelOrder(obj.row)
          break
        case "freezeOrder":
          this.freezeOrder(obj.row)
          break
        case "addGiftWorkOrder":
          this.addGiftWorkOrder(obj.row)
          break
        case "addNotGiftWorkOrder":
          this.addNotGiftWorkOrder(obj.row)
          break
      }
    },
    freezeOrder(row) {
      this.freezeForm.orderCode = row.orderCode
      this.freezeForm.sourceCode = row.sourceCode
      this.freezeDialog = true
    },
    freezeConfirm() {
      this.$refs["freezeForm"].validate((valid) => {
        if (valid) {
          const params = deepClone(this.freezeForm)
          params.orderCode = [params.orderCode]
          orderFreeze(params).then((res) => {
            if (res.data.code === 0) {
              this.freezeCancel()
              this.$message.success("冻结订单成功")
              this.clearSelectClear()
              this.getList(this.pages, this.searchFormConfirm)
            }
          })
        }
      })
    },
    freezeCancel() {
      this.freezeForm = {}
      this.freezeDialog = false
    },
    cancelAbnormal() {
      const params = this.selectRows.map((item) => item.orderCode)
      cancelAbnormal(params).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("取消异常标识成功")
          this.clearSelectClear()
          this.getList(this.pages, this.searchFormConfirm)
        }
      })
    },
    changeFreeze() {
      this.$confirm(`您勾选了${this.selectRows.length}条订单，确认取消"冻结订单"的标识码？`, "取消冻结", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = this.selectRows.map((item) => item.orderCode)
          orderReFreeze({ orderCode: params }).then((res) => {
            if (res.data.code === 0) {
              this.$message.success('取消"冻结订单"标识成功')
              this.clearSelectClear()
              this.getList(this.pages, this.searchFormConfirm)
            }
          })
        })
        .catch(() => {})
    },
    goOrderDetail(row) {
      this.$router.push({
        path: "/order/orderManages/detail",
        query: { id: row.id }
      })
    },
    goOrderEdit(row, type) {
      this.$router.push({
        path: "/order/orderManages/detailEdit",
        query: { id: row.id, isPosition: type }
      })
    },
    changeOrderStatus() {
      this.clearSelectClear()
      this.pages.page = 1
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList(
        this.pages,
        Object.assign(this.searchFormConfirm, {
          fulfillmentStatus: this.menuLeftModel === "0" ? [] : [this.menuLeftModel]
        })
      )
      this.searchForm.fulfillmentStatus = []
    },

    getSitAndStore() {
      this.synchronousForm.market = ""
      this.synchronousForm.shop = ""
      if (!this.synchronousForm.platform) return
      getSit([this.synchronousForm.platform]).then((res) => {
        if (res.status === 200) {
          this.sit = this.sortArray(res.data, "sitName")
        }
      })
      getStore([this.synchronousForm.platform]).then((res) => {
        if (res.status === 200) {
          this.store = this.sortArray(res.data, "storeAccount")
        }
      })
    },

    mateSku(row) {
      // 订单状态创建时才能匹配SKU
      const orderstatus = ["SAVE", "PENDING"]
      const status = orderstatus.includes(row.fulfillmentStatus)
      if (!status) {
        this.$message.warning("订单状态为创建、待处理时才能匹配SKU！")
        return
      }
      const mateSkuParams = {
        soOrderCode: row.orderCode
      }
      matchOrderTasks(mateSkuParams).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("匹配SKU成功")
          this.getList(this.pages, this.searchFormConfirm)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },

    changeConfirm(val) {
      if (val.confirmStatus === "REJECT") {
        val.splitCount = 0
      }
    },

    setLabel(row) {
      // if (type === 'ALL' && this.selectRows.length < 2) {
      //   this.$message.warning(`已选择${this.selectRows.length}条订单，请选择多条都订单进行批量修改标签`)
      //   return;
      // }

      this.$refs.setLabelDialogRef.openDialog(this.selectRows, row)
    },

    synCancel() {
      this.synchronousForm = {}
      this.$refs["synchronousForm"].resetFields()
      this.synchronousStatus = false
    },
    synConfirm() {
      this.$refs["synchronousForm"].validate((valid) => {
        if (valid) {
          this.loadingStatus = true
          let formData = new FormData()
          formData.append("orderNumber", this.synchronousForm.orderNumber)
          formData.append("shopId", this.synchronousForm.shopId)
          formData.append("orderBusinessType", this.synchronousForm.orderBusinessType)
          formData.append("distributorId", this.synchronousForm.distributorId)
          syncSingeOrder(formData)
            .then((res) => {
              if (res.data.code === 0) {
                this.$message.success("订单同步成功")
                this.synchronousForm = {}
                this.loadingStatus = false
                this.$refs["synchronousForm"].resetFields()
                this.synchronousStatus = false
                this.getList(this.pages, this.searchFormConfirm)
              } else {
                this.loadingStatus = false
                this.$message.error(res.data.msg)
              }
            })
            .catch((err) => {
              this.loadingStatus = false
            })
        }
      })
    },
    getLogistics(warehouseId) {
      this.logistics = []
      this.logisticsChannel = []
      this.warehouseForm.transportCarrierCode = ""
      this.warehouseForm.bseOverseaCarrierCode = ""
      // this.changeWarehouserId(warehouseId)
      getCarriersByWarehouseld({ warehouseIds: [warehouseId] }).then((res) => {
        if (res.data.code === 0) {
          this.logistics = res.data.data[0].dataList
          if (this.logistics.length) {
            this.logistics.forEach((item) => {
              if (item.warehouseId === warehouseId) {
                this.warehouseForm.warehouseCode = item.warehouseCode
              }
            })
          }
          if (this.warehouseInit.transportCarrierCode && !this.isInitWare) {
            this.warehouseForm.transportCarrierCode = this.warehouseInit.transportCarrierCode
            this.getBseChannel(this.warehouseForm.transportCarrierCode)
          }
        }
      })
    },
    getBseChannel(val) {
      this.warehouseForm.bseOverseaCarrierCode = ""
      this.logistics.forEach((item) => {
        if (item.transportCarrierCode === val) {
          this.logisticsChannel = item.bseChannels ? item.bseChannels : []
        }
      })

      if (!this.isInitWare) {
        this.warehouseForm.bseOverseaCarrierCode = this.warehouseInit.bseOverseaCarrierCode
        this.isInitWare = true
      }
    },
    // hideWareHouse() {
    //   if (this.isHideWareHouse) {
    //     const params = {
    //       operate: 0,
    //       orderId: this.orderId
    //     }
    //     hideWarehouse(Object.assign(this.bseWarehouseInfo, params)).then((res) => {
    //       if (res.data.code === 0) {
    //         this.mateWarehouse = res.data.data
    //       }
    //     })
    //   } else {
    //     getSearchWarehouse(this.bseWarehouseInfo).then((res) => {
    //       if (res.data.code === 0) {
    //         this.mateWarehouse = res.data.data.records
    //       }
    //     })
    //   }
    // },
    changeWarehouserId(val) {
      const params = {
        orderId: this.tableDataRow.id,
        warehouseId: val
      }
      this.mateWarehouseData.forEach((item) => {
        this.$set(item, "availableQuantity", "")
      })
      getStockNumWithSku(params).then((res) => {
        if (res.data.code === 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            for (let j = 0; j < this.mateWarehouseData.length; j++) {
              if (res.data.data[i].skuCode === this.mateWarehouseData[j].skuCode) {
                this.$set(this.mateWarehouseData[j], "availableQuantity", res.data.data[i].availableQuantity)
              }
            }
          }
        }
      })
    },
    warehouseSearch() {
      getSearchWarehouse(this.bseWarehouseInfo).then((res) => {
        if (res.data.code === 0) {
          this.mateWarehouse = res.data.data.records
        }
      })
    },

    toAddOrder() {
      this.$router.push({ path: `/order/orderManages/add` })
    },
    sendConfirm(row) {
      if (row.fulfillmentStatus == "UNCONFIRM" && row.abnormalType != null && row.abnormalType !== "") {
        this.$message.warning("请先通过“取消异常标识”按钮取消异常，再继续操作订单发货相关动作！")
        return
      }

      // DI PO的确认订单特殊处理
      if (["DI", "PO"].includes(row.orderBusinessType)) {
        this.$refs.confirmOrderDialogRef.openDialog(row)
        return
      }

      this.orderCode = row.orderCode

      this.$refs.confirmOrderOtherDialogRef.openDialog(row)
    },

    // 生成发货批次单
    splitOrder(row) {
      // DI PO的特殊处理
      // if (["DI", "PO"].includes(row.orderBusinessType)) {
      //   this.$refs.generationDeliveryBatchDialogRef.openDialog([row.orderCode])
      //   return
      // }
      this.orderCode = row.orderCode
      getOrderDeliveryOperateInfo({ soOrderCode: row.orderCode }).then((res) => {
        if (res.data.code === 0) {
          res.data.data.deliveryDetails.forEach((item) => {
            item.isInit = true
            item.orderSplit = false
            item.isExpectedQuantity = item.waitSplitQuantity
            item.splitCount = 0
          })
          for (let i = 0; i < res.data.data.deliveryDetails.length; i++) {
            for (let j = 0; j < res.data.data.deliveryDetails[i].bseTransportCarriers.length; j++) {
              res.data.data.deliveryDetails[i]["transportCode"] = res.data.data.logisticsCode
                ? res.data.data.logisticsCode
                : res.data.data.deliveryDetails[i].suggestedTransportCarrierCode

              res.data.data.deliveryDetails[i]["logisticsChannel"] = res.data.data.logisticsChannel
                ? res.data.data.logisticsChannel
                : res.data.data.deliveryDetails[i].suggestedLogisticsChannel
              if (
                res.data.data.deliveryDetails[i].bseTransportCarriers[j].transportCarrierCode ===
                res.data.data.deliveryDetails[i].suggestedTransportCarrierCode
              ) {
                // res.data.data.deliveryDetails[i].transportCode = res.data.data.logisticsCode

                res.data.data.deliveryDetails[i].bseChannels =
                  res.data.data.deliveryDetails[i].bseTransportCarriers[j].bseChannels

                // 判断一下这个值在不在下拉列表 如果不在就不赋值 直接为空
                const flag = res.data.data.deliveryDetails[i].bseChannels.some(
                  (it) => it.bseChannelCode == res.data.data.deliveryDetails[i]["logisticsChannel"]
                )
                if (!flag) {
                  res.data.data.deliveryDetails[i]["logisticsChannel"] = ""
                }
              }
            }
          }
          this.deliveryTableData = res.data.data.deliveryDetails
          this.deliveryStatus = true
          this.isOrderBusinessType = row.orderBusinessType === "DI" || row.orderBusinessType === "PO" ? true : false
          this.logisticsModel = res.data.data.logisticsModel === "NO_LOGISTICS" ? false : true
        }
      })
    },
    getLogisticsChannel(val, row) {
      this.$set(row, "logisticsChannel", "")
      row.bseTransportCarriers.forEach((item) => {
        if (item.transportCarrierCode === val) {
          row.bseChannels = item.bseChannels
        }
      })
    },
    toDeliverySplit(row) {
      this.deliverySplitObj.purchaseCount = row.waitSplitQuantity
    },
    deliveryRemoveSplit(index) {
      for (let i = index; i >= 0; i--) {
        if (this.deliveryTableData[i].isInit) {
          this.deliveryTableData[i].waitSplitQuantity += this.deliveryTableData[index].waitSplitQuantity
          if (this.deliveryTableData[i].waitSplitQuantity === this.deliveryTableData[i].isExpectedQuantity) {
            this.deliveryTableData[i].orderSplit = false
          }
          break
        }
      }
      this.deliveryTableData.splice(index, 1)
    },
    deliverysureSplit(index, row) {
      if (this.deliverySplitObj.splitCount <= 0) return

      this.deliverySplitObj.purchaseCount = row.waitSplitQuantity - this.deliverySplitObj.splitCount
      row.waitSplitQuantity = this.deliverySplitObj.purchaseCount

      if (row.splitCount) {
        row.splitCount = row.waitSplitQuantity
      }

      const newRow = deepClone(row)
      newRow.isInit = false
      newRow.orderSplit = true
      newRow.waitSplitQuantity = this.deliverySplitObj.splitCount
      newRow.splitCount = 0
      this.deliverySplitObj.splitCount = 0
      this.deliveryTableData[index].orderSplit = true
      this.deliveryTableData.splice(index + 1, 0, newRow)

      if (this.deliverySplitObj.splitCount >= this.deliverySplitObj.purchaseCount) {
        this.deliverySplitObj.splitCount = this.deliverySplitObj.purchaseCount
      }
    },
    deliveryHideSplit() {
      this.deliverySplitObj.splitCount = 0
    },
    deliveryConfirm() {
      const params = {
        soOrderCode: this.orderCode,
        generateDeliverys: []
      }

      let generateDeliverys = this.deliveryTableData.filter((item) => {
        if (this.isOrderBusinessType && this.logisticsModel) {
          return item.transportCode || item.logisticsChannel || item.extendCode
        }
        if (this.logisticsModel) {
          return item.transportCode || item.logisticsChannel
        }
        return item
      })

      for (let i = 0; i < generateDeliverys.length; i++) {
        if (!generateDeliverys[i].transportCode && this.logisticsModel) {
          this.$message.warning(`SKU：${this.deliveryTableData[i].skuCode}的物流商不能为空`)
          return
        }
        if (!generateDeliverys[i].logisticsChannel && this.logisticsModel) {
          this.$message.warning(`SKU：${this.deliveryTableData[i].skuCode}的物流渠道不能为空`)
          return
        }
        if (!generateDeliverys[i].extendCode && this.isOrderBusinessType && this.logisticsModel) {
          this.$message.warning(`SKU：${this.deliveryTableData[i].skuCode}的ARN/排柜号不能为空`)
          return
        }
      }

      params.generateDeliverys = generateDeliverys.map((item) => {
        return {
          warehouseId: item.warehouseId,
          transportCode: item.transportCode,
          extendCode: item.extendCode,
          logisticsChannel: item.logisticsChannel,
          deliveryDetails: [
            { soOrderDetailId: item.soOrderDetailId, skuCode: item.skuCode, deliveryQuantity: item.waitSplitQuantity }
          ]
        }
      })
      if (params.generateDeliverys.length == 0 && this.logisticsModel) {
        this.$message.error("请检查必填字段！")
        return
      }

      this.loadingStatus = true
      orderGenerateDelivery(params)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success("生成发货批次单成功")
            this.loadingStatus = false
            this.clearSelectClear()
            this.getList(this.pages, this.searchFormConfirm)
            this.deliveryStatus = false
          } else {
            this.loadingStatus = false
            this.$message.error(res.data.msg)
          }
        })
        .catch((err) => {
          this.loadingStatus = false
        })
    },
    getDeliveryInventory(val, index) {
      this.deliveryTableData[index].warehouseStocks.forEach((item) => {
        if (item.warehouseId === val) {
          this.$set(this.deliveryTableData[index], "inventory", item.availableQuantity)
        }
      })
    },
    synchronous() {
      this.synchronousStatus = true
    },
    handleBatchCancelButton() {
      this.batchCancelDialog = true
    },
    handleCloseBatchCancel(flag) {
      this.batchCancelDialog = false
      this.batchCancelDoneCount = 0
      this.batchCancelResult = []
      if (flag) {
        this.updateList()
      }
    },
    async handleBatchCancelOrder() {
      // 检查所有订单是否满足取消条件
      const flag = this.selectRows.every((item) => {
        return ["SAVE", "PENDING", "UNCONFIRM", "CONFIRM", "UNSHIPPED"].includes(item.fulfillmentStatus)
      })

      if (!flag) {
        this.$message.warning(
          "批量取消订单功能，仅支持未发货订单的整单取消，如需取消部分产品明细，请使用“取消订单”或“强制取消订单”功能！"
        )
        return
      }

      // 封装获取订单详情的异步操作
      const getOrderDetailsNumber = (row) => {
        return new Promise((resolve, reject) => {
          getOrderCancelOperateInfo({ soOrderCode: row.orderCode })
            .then((res) => {
              if (res.data.code === 0) {
                resolve(res.data.data)
              } else {
                reject(res.data.msg)
              }
            })
            .catch((err) => {
              reject(err)
            })
        })
      }

      for (const row of this.selectRows) {
        this.forceFlag = false
        this.batchCancelDoneCount += 1

        try {
          let data
          try {
            data = await getOrderDetailsNumber(row)
          } catch (error) {
            this.batchCancelResult.push({ orderCode: row?.orderCode, status: error ? error : "失败", type: "fail" })
            continue
          }

          // 使用返回的数据进行下一步操作
          const params = {
            forceFlag: false,
            soOrderCode: data.orderCode,
            cancelDetails: data.cancelDetails.map((item) => ({
              soOrderDetailId: item.soOrderDetailId,
              skuCode: item.skuCode,
              cancelQuantity: item.waitCancelQuantity
            }))
          }

          // 调用取消订单接口
          const res = await orderCancel(params)
          if (res.data.code === 0) {
            this.batchCancelResult.push({ orderCode: row?.orderCode, status: "成功", type: "success" })
          } else {
            this.batchCancelResult.push({
              orderCode: row?.orderCode,
              status: res.data.msg ? res.data.msg : "失败",
              type: "fail"
            })
          }
        } catch (error) {
          this.batchCancelResult.push({ orderCode: row?.orderCode, status: error ? error : "失败", type: "fail" })
        }
      }

      // 最后更新进度条和显示完成信息
      console.log("所有订单处理完成")
    },

    // 取消订单
    cancelOrder(row) {
      const orderstatus = ["ALREADY_DELIVERY", "CANCELED"]
      const status = orderstatus.includes(row.fulfillmentStatus)
      if (status) {
        this.$message.warning("选中的订单中包含订单状态为已发货、取消状态，不能取消订单！")
        return
      }
      getOrderCancelOperateInfo({ soOrderCode: row.orderCode }).then((res) => {
        if (res.data.code === 0) {
          this.cancelOrderObj = res.data.data
          this.cancelOrderStatus = true
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    orderCancel() {
      this.cancelOrderStatus = false
    },
    cancelOrderConfirm() {
      const isEmpty = this.cancelOrderObj.cancelDetails.every((item) => !item.cancelQuantity)
      if (isEmpty) {
        this.$message.warning("请至少填写一个SKU的取消数量！")
        return
      }

      const params = {
        forceFlag: this.forceFlag,
        soOrderCode: this.cancelOrderObj.orderCode
      }
      params.cancelDetails = this.cancelOrderObj.cancelDetails
        .filter((item) => item.cancelQuantity)
        .map((item) => {
          return {
            soOrderDetailId: item.soOrderDetailId,
            skuCode: item.skuCode,
            cancelQuantity: item.cancelQuantity
          }
        })

      orderCancel(params).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("取消订单成功")
          this.cancelOrderStatus = false
          this.getList(this.pages, this.searchFormConfirm)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },

    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.pages, { scene: this.tabPositionModel })
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      //将搜索的条件放入到确认的搜索条件中
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      page = page || { currentPage: 1 }
      if (this.selectLabel) {
        params[this.selectLabel] = this.selectValue
        this.searchFormConfirm[this.selectLabel] = this.selectValue
      }
      if (this.timeLabel && this.timeValue) {
        if (this.timeLabel === "orderTime") {
          this.searchFormConfirm.beginOrderTime = this.timeValue[0]
          this.searchFormConfirm.endOrderTime = this.timeValue[1]
        } else if (this.timeLabel === "shoppingTime") {
          this.searchFormConfirm.beginShoppingTime = this.timeValue[0]
          this.searchFormConfirm.endShoppingTime = this.timeValue[1]
        } else if (this.timeLabel === "platOrderTime") {
          this.searchFormConfirm.beginPlatOrderTime = this.timeValue[0]
          this.searchFormConfirm.endPlatOrderTime = this.timeValue[1]
        } else if (this.timeLabel === "orderCreateTime") {
          this.searchFormConfirm.beginOrderCreateTime = this.timeValue[0]
          this.searchFormConfirm.endOrderCreateTime = this.timeValue[1]
        }
      } else {
        this.searchFormConfirm.beginOrderTime = ""
        this.searchFormConfirm.endOrderTime = ""
        this.searchFormConfirm.beginShoppingTime = ""
        this.searchFormConfirm.endShoppingTime = ""
        this.searchFormConfirm.beginPlatOrderTime = ""
        this.searchFormConfirm.endPlatOrderTime = ""
        this.searchFormConfirm.beginOrderCreateTime = ""
        this.searchFormConfirm.endOrderCreateTime = ""
      }
      Object.assign(params, this.searchFormConfirm)
      if (this.menuLeftModel !== "0") {
        params.fulfillmentStatus = [this.menuLeftModel]
      }
      this.getList(page, params)
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.searchForm = {
        sourceCode: "",
        orderCode: "",
        asin: "",
        postalCode: "",
        beginOrderTime: "",
        endOrderTime: "",
        beginShoppingTime: "",
        endShoppingTime: "",
        platformCode: [],
        marketId: [],
        shopIds: "",
        labelIdList: [],
        warehouseIds: "",
        hasLabelIdFlag: true,
        orderTypeList: [],
        freezeStatus: "",
        relationStatus: "",
        platformOrderCode: "",
        extendCodes: "",
        orderBusinessType: "",
        accessMode: "",
        orderSkuNumType: "",
        soAbnormalType: "",
        deliveryMethod: "",
        fulfillmentStatus: "",
        existPickUpTime: "",
        beginPlatOrderTime: "",
        endPlatOrderTime: ""
      }
      this.selectLabel = ""
      this.selectValue = ""
      this.timeLabel = ""
      this.timeValue = ""
      this.$refs.selectAllRef.resetSelectAll()
    },
    // 页大小回调
    sizeChange(val) {
      this.pages.pageSize = val
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    },
    clearSelectClear() {
      // this.$refs.crud.selectClear();
      this.$refs.crud?.toggleSelection()
    },
    getList(page, params) {
      this.pages.currentPage = page.currentPage
      this.pages.page = page.currentPage
      getOrderList(
        Object.assign(
          {
            page: page.currentPage,
            pageSize: page.pageSize
          },
          params,
          this.searchFormConfirm
        )
      ).then((res) => {
        if (res.data.code === 0) {
          res.data.data.records.forEach((item) => {
            item.totalAmount = item.totalAmountCurrency
              ? item.totalAmount + " " + item.totalAmountCurrency
              : item.totalAmount
            if (item.products && item.products.length > 3) {
              item.spliceProducts = item.products.slice(0, 1)
              item.isMoreProducts = true
            } else {
              item.spliceProducts = item.products
            }
            item.platformCodeSlotText = `${item.platformCode} / ${item.market}`
            item.syncConfirmFlagNameSlotText = `${item.syncConfirmFlagName}
            ${item?.syncDeliveryFlagName}
            ${item.syncCancelFlagName ? item.syncCancelFlagName : ""}
            `
            item.createTimeSlotText = `${item.createName}<br/>${item.createTime}`
            item.updateTimeSlotText = `${item.updateName}<br/>${item.updateTime}`
          })
          this.tableData = res.data.data ? res.data.data.records : []
          this.pages.total = res.data.data ? res.data.data.total : 0
        }
      })
    },
    addGiftWorkOrder(row) {
      this.$router.push({
        path: "/order/afterOrderManage/addGiftWorkOrder",
        query: {
          workOrderCode: null,
          form: "ORDER_GIFT",
          soOrderId: row.id
        }
      })
    },
    addNotGiftWorkOrder(row) {
      this.addWorkOrderVisible = true
      this.addWorkOrderId = row.id
    },
    addWorkOrderSuccess() {
      this.addWorkOrderId = ""
    },
    updateList() {
      this.clearSelectClear()
      // this.getList(this.pages, this.searchFormConfirm)
      this.searchChange(this.searchFormConfirm, this.pages)
    },
    // 获取所有站点
    async getSitAll() {
      const { data } = await getSitInfo()
      if (data.code === 0) {
        this.sit = this.sortArray(data.data, "sitName")
      }
    },
    // 获取店铺
    async getStoreList(platformCode = []) {
      const { data } = await getStore(platformCode)
      this.store = this.sortArray(
        data.filter((item) => item.state === "0"),
        "storeAccount"
      )
    },
    // 根据站点获取店铺
    async getStoreBySit(marketId) {
      let ids = []
      marketId.forEach((item) => {
        ids.push(this.sit.find((s) => s.sitName === item).bsePlatformSitId)
      })
      const { data } = await getStoreBySitIds(ids)
      if (data.code === 0) {
        this.store = this.sortArray(data.data, "storeAccount")
      }
    },
    // 站点下拉回调
    visibleChangeSit(status) {
      if (!status) {
        this.searchForm.shopIds = []
        if (!this.searchForm.marketId?.length) return
        this.getStoreBySit(this.searchForm.marketId)
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
    searchLabel({ checkedLabel, searchForm }) {
      this.searchForm.hasLabelIdFlag = searchForm.hasLabelIdFlag
      this.searchForm.labelIdList = [...checkedLabel]
    },
    getCtrlList(scope) {
      return [
        {
          title: "接收订单",
          item: scope,
          clickFn: (scope) => {
            this.$refs.receiveOrderDialogRef.openDialog([scope.row.orderCode])
          },
          show:
            this.permissions.oms_order_manage_receive &&
            ["UNCONFIRM", "UNRECEIVE"].includes(scope.row.fulfillmentStatus) &&
            ["PO"].includes(scope.row.orderBusinessType) // 订单状态=待接单/待确认，交货模式为PO订单
        },
        {
          title: "确认订单",
          item: scope,
          clickFn: (scope) => {
            this.sendConfirm(scope.row)
          },
          show:
            this.permissions.oms_order_manage_confirm &&
            ["CONFIRM", "UNCONFIRM", "UNSHIPPED", "PARTIAL_DELIVERY"].includes(scope.row.fulfillmentStatus) // 订单状态=已确认\待确认\待发货\部分发货
        },
        {
          title: "生成发货批次单",
          item: scope,
          clickFn: (scope) => {
            this.splitOrder(scope.row)
          },
          show:
            this.permissions.oms_order_manage_create_fo &&
            !["PO"].includes(scope.row.orderBusinessType) &&
            ["CONFIRM", "UNCONFIRM", "UNSHIPPED", "PARTIAL_DELIVERY"].includes(scope.row.fulfillmentStatus) // 非PO订单 订单状态=已确认\待确认\待发货\部分发货
        },
        {
          title: "PO生成发货批次单",
          item: scope,
          clickFn: (scope) => {
            this.splitOrderPO(scope.row)
          },
          show:
            this.permissions.oms_order_manage_create_fo_PO &&
            ["CONFIRM", "UNCONFIRM", "UNSHIPPED", "PARTIAL_DELIVERY"].includes(scope.row.fulfillmentStatus) &&
            ["PO"].includes(scope.row.orderBusinessType) // PO订单 订单状态=已确认\待确认\待发货\部分发货
        },
        {
          title: "编辑订单",
          item: scope,
          clickFn: (scope) => {
            this.goOrderEdit(scope.row)
          },
          show: this.permissions.oms_order_manage_update_order
        },
        {
          title: "获取面单",
          item: scope,
          clickFn: (scope) => {
            this.moreOperation({ title: "getFacesheet", row: scope.row })
          },
          show:
            this.permissions.oms_order_manage_facesheet &&
            ["UNCONFIRM"].includes(scope.row.fulfillmentStatus) &&
            !["DI", "PO"].includes(scope.row.orderBusinessType) // 待确认、 DI和PO，不展示 查看面单、获取面单按钮
        },
        {
          title: "查看面单",
          item: scope,
          clickFn: (scope) => {
            this.moreOperation({ title: "lookFacesheet", row: scope.row })
          },
          show: this.permissions.oms_order_manage_list_facesheet && !["DI", "PO"].includes(scope.row.orderBusinessType) // DI和PO，不展示 查看面单、获取面单按钮
        },
        {
          title: "取消订单",
          item: scope,
          clickFn: (scope) => {
            this.moreOperation({ title: "cancelOrder", row: scope.row, forceFlag: false })
          },
          show:
            this.permissions.oms_order_manage_cancel &&
            !["ALREADY_DELIVERY", "CANCELED"].includes(scope.row.fulfillmentStatus) // 订单状态!=已发货、取消状态
        },
        {
          title: "强制取消",
          item: scope,
          clickFn: (scope) => {
            this.moreOperation({ title: "cancelOrder", row: scope.row, forceFlag: true })
          },
          show:
            this.permissions.oms_order_manage_cancel &&
            !["ALREADY_DELIVERY", "CANCELED"].includes(scope.row.fulfillmentStatus), // 订单状态!=已发货、取消状态
          style: {
            color: "#f56c6c"
          }
        },
        {
          title: "冻结订单",
          item: scope,
          clickFn: (scope) => {
            this.moreOperation({ title: "freezeOrder", row: scope.row, forceFlag: true })
          },
          show: this.permissions.oms_order_manage_orderFreeze,
          style: {
            color: "#f56c6c"
          }
        },
        {
          title: "新增重发/赠品工单",
          item: scope,
          clickFn: (scope) => {
            this.moreOperation({ title: "addGiftWorkOrder", row: scope.row, forceFlag: true })
          },
          show: true,
          style: {
            color: "#f56c6c"
          }
        },
        {
          title: "新增退货退款工单",
          item: scope,
          clickFn: (scope) => {
            this.moreOperation({ title: "addNotGiftWorkOrder", row: scope.row, forceFlag: true })
          },
          show: true,
          style: {
            color: "#f56c6c"
          }
        }
      ]
    },
    downloadInvoiceTemplate(item) {
      this.$refs.batchUploadFileRef.openDialog(item)
    },
    // 批量接受订单
    async batchAcceptOrder() {
      if (this.selectRows?.length) {
        for (let item of this.selectRows) {
          if (!["PO"].includes(item.orderBusinessType)) {
            this.$message.warning("请选择PO订单")
            return
          }
          if (!["UNCONFIRM", "UNRECEIVE"].includes(item.fulfillmentStatus)) {
            this.$message.warning("请选择待接单/待确认订单")
            return
          }
        }

        const orderCodeList = this.selectRows.map((item) => item.orderCode)
        this.$refs.receiveOrderDialogRef.openDialog(orderCodeList)
      } else {
        const { data } = await getOrderCodeByPageParamApi(this.searchFormConfirm)
        if (data.code === 0) {
          this.$refs.receiveOrderDialogRef.openDialog(data.data || [])
        }
      }
    },
    // PO批量生成发货批次单 PO
    async handlePoBatchCreateFo() {
      let orderCodeList = []
      if (this.selectRows?.length) {
        for (let item of this.selectRows) {
          if (!["PO"].includes(item.orderBusinessType)) {
            this.$message.warning("请选择PO订单")
            return
          }
        }

        orderCodeList = this.selectRows.map((item) => item.orderCode)
      } else {
        const { data } = await getOrderCodeByPageParamApi(this.searchFormConfirm)
        if (data.code === 0) {
          orderCodeList = data.data
        } else {
          this.$message.error(data.error)
          return
        }
      }
      this.openGenerationDeliveryBatchDialog(orderCodeList)
    },
    splitOrderPO(row) {
      this.openGenerationDeliveryBatchDialog([row.orderCode])
    },
    // 打开生成发货批次单弹窗
    async openGenerationDeliveryBatchDialog(orderCodeList) {
      const { data } = await getDeliveryOperateInfoApi({
        soOrderCodes: orderCodeList,
        warehouseIds: this.searchFormConfirm?.warehouseIds
      })
      if (data.code === 0) {
        const { deliveryBusinessType, results } = data.data[0]
        this.$refs.generationDeliveryBatchDialogRef.openDialog(deliveryBusinessType, results)
      } else {
        this.$message.error(data.error)
      }
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
    // 批量导入修改SKU
    handleBatchImportSku() {
      this.newUploadUrl = "/oms/omsSoOrder/orderMatchSkuImport"
      this.newDownloadTitle = "订单批量匹配SKU模板"
      this.$refs.newCommonImport.syncFn({
        downloadParams: { templateName: "订单批量匹配SKU模板.xlsx" },
        uploadParams: { templateName: "订单批量匹配SKU模板.xlsx" }
      })
    },
    // 批量获取提货时间
    handleBatchGetPickupTime() {
      if (this.selectRows?.length <= 0) {
        this.$message.warning("请选择订单")
        return
      }

      this.$refs.batchGetPickupTimeDialogRef.openDialog(this.selectRows)
    },
    handleBatchUploadFaceSheet() {
      // if (this.selectRows?.length <= 0) {
      //   this.$message.warning("请选择订单")
      //   return
      // }

      this.$refs.uploadOrderFaceSheetDialogRef.openDialog(this.selectRows)
    }
  }
}
</script>

<style lang="scss">
#orderManage {
  .isAbnormalFlag {
    background: rgba(244, 201, 51, 0.1);
  }

  .isFreezeFlag {
    background: #fbc4c4;
  }

  .el-table .cell {
    text-overflow: initial;
    overflow: hidden;
  }

  .el-row-text {
    overflow: auto;
    white-space: wrap;
    text-overflow: initial;
  }

  .el-tabs__nav-wrap::after {
    height: 1px;
  }

  .confirm-tips {
    padding: 10px;
    color: red;
    background: #efefef;
    font-size: 13px;
  }

  .avue-crud__menu {
    margin-bottom: 3px;
  }

  a {
    text-decoration: none;
  }

  .el-radio__label {
    font-size: 13px;
  }

  .tableBeforeSlot-elbutton {
    .el-button--small {
      margin-bottom: 5px;
    }
  }

  #orderManage-dialog {
    .el-input-number {
      width: 100%;
    }

    .el-date-editor {
      width: 100%;
    }
  }
  .color-red {
    color: red;
  }
  .box-card {
    max-height: 300px;
    overflow-y: auto;
    margin-top: 20px;
    border: 1px solid #eceef5;
    border-radius: 6px;
    padding: 5px;
    /* 自定义滚动条 */
    /* 整个滚动条 */
    &::-webkit-scrollbar {
      width: 8px; /* 滚动条的宽度 */
      height: 8px; /* 滚动条的高度（对于水平滚动条） */
    }

    /* 滚动条的轨道 */
    &::-webkit-scrollbar-track {
      background: #f1f1f1; /* 轨道的背景色 */
    }

    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
      background: #939393; /* 滑块的背景色 */
      border-radius: 4px; /* 滑块的圆角 */
    }

    /* 滚动条滑块在悬停时 */
    &::-webkit-scrollbar-thumb:hover {
      background: #939393; /* 滑块在悬停时的背景色 */
    }

    .batch-cancel-result-item {
      margin: 0px 0 0 2px;
      &-success {
        color: #67c23a;
      }
      &-fail {
        color: #f56c6c;
      }
    }
  }
}
</style>
