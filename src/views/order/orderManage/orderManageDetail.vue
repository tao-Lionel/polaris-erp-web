<template>
  <div id="orderManageDetail">
    <basic-container>
      <div style="display: flex">
        <div style="width: calc(100% - 160px)">
          <div class="orderManageDetail-header">
            <div class="orderManageDetail-header-main">
              <copy-text>
                <span style="font-size: 24px; font-weight: bold">{{ orderDetail.orderCode }}</span>
              </copy-text>
              <el-tag style="margin-left: 10px" type="warning">{{ orderDetail.orderBusinessType }}</el-tag>
              <el-tag style="margin-left: 10px" type="warning">{{ orderDetail.deliveryName }}</el-tag>
              <span style="margin-left: 10px; white-space: nowrap">查看详情</span>
            </div>
          </div>
          <!-- 基本信息 -->
          <div class="orderManageDetail-step jbNav">
            <el-form label-width="70px" class="demo-form-inline">
              <detail-wrapper :options="{ title: '基本信息' }">
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="平台">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.platformCode"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="站点">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.marketCode"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="店铺">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.shopName"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="订单号">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.orderCode"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="平台订单号" label-width="85px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.sourceCode"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="平台订单编码" label-width="100px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.platformOrderCode"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="订单来源">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.accessModeName"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="交货模式">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.orderBusinessType"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="订单类型">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.orderTypeName"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="下单时间">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.orderTime"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="运费">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.shippingPrice"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="订单总金额(含税)" label-width="120px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.totalTaxAmount"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="订单总金额(不含税)" label-width="140px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.totalNoneTaxAmount"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="订单状态">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.fulfillmentStatusName"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="平台订单状态" label-width="100px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.orderStatus"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="付款方式">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.paymentMethodName"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="异常类型">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.abnormalTypeName"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="买家备注">
                      <el-popover
                        placement="top-start"
                        title=""
                        width="300"
                        trigger="hover"
                        :content="orderDetail.buyerRemark"
                      >
                        <el-input
                          class="el-input--small"
                          slot="reference"
                          v-model="orderDetail.buyerRemark"
                          placeholder="暂无数据"
                          :disabled="true"
                          size="mini"
                          sl
                        ></el-input>
                      </el-popover>
                    </el-form-item>
                  </el-col>
                </el-row>
              </detail-wrapper>
            </el-form>
          </div>
          <!-- 备注信息 -->
          <div style="position: relative" class="bzNav">
            <el-form label-width="70px" class="demo-form-inline">
              <detail-wrapper :options="{ title: '备注信息' }">
                <avue-crud ref="crud" :data="orderDetail.orderRemarkList" :option="remarkOption"> </avue-crud>
              </detail-wrapper>
            </el-form>
          </div>
          <!-- 配送信息 -->
          <div style="position: relative" class="psNav">
            <el-form class="demo-form-inline" label-width="70px" :model="orderDetail" ref="orderForm">
              <detail-wrapper :options="{ title: '配送信息' }">
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="收件人" prop="receiveName">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.receiveName"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="电话" prop="phone">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.phone"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="邮箱">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.receiveEmail"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="国家" label-width="100px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.country"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="省/州" label-width="100px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.stateOrRegion"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="市">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.city"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="区">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.district"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="地址1" label-width="100px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.address"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="地址2" label-width="100px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.altAddress"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="邮编" prop="postalCode">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.postalCode"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="建议发货仓" label-width="85px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.overseaWarehouseCode"
                        placeholder="暂无数据"
                        disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="建议物流渠道" label-width="100px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.logisticsChannel"
                        placeholder="暂无数据"
                        disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="接收仓仓库编码" label-width="120px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.desWarehouse"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </detail-wrapper>
            </el-form>
          </div>
          <!-- 税费信息 -->
          <div style="position: relative" class="sfNav">
            <el-form class="demo-form-inline" label-width="70px">
              <detail-wrapper :options="{ title: '税费信息' }">
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="税费总额">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.totalTax"
                        placeholder="暂无数据"
                        disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </detail-wrapper>
            </el-form>
          </div>
          <!-- 平台特殊信息Amazon -->
          <div style="position: relative" class="ptNav">
            <el-form class="demo-form-inline" label-width="70px">
              <detail-wrapper :options="{ title: '平台特殊信息' }" v-if="orderDetail.orderBusinessType === 'DF'">
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="供货商ID" prop="receiveName">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.omsOrderCustomerOptionsVO.df.sellingPartyId"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="买家指定物流" prop="receiveName" label-width="100px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.omsOrderCustomerOptionsVO.df.overseaLogisticsChannel"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="要求发货时间" label-width="120px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.omsOrderCustomerOptionsVO.df.requiredShipDate"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="承诺送达时间" label-width="120px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.omsOrderCustomerOptionsVO.df.promisedDeliveryDate"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="是否需要装箱清单" label-width="125px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.omsOrderCustomerOptionsVO.df.pslipRequiredFlag"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="是否含礼物" label-width="85px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.omsOrderCustomerOptionsVO.df.giftFlag"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="是否预定交付计划" label-width="125px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.omsOrderCustomerOptionsVO.df.scheduledDeliveryShipment"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="是否优先发货" label-width="100px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.omsOrderCustomerOptionsVO.df.priorityShipmentFlag"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </detail-wrapper>
              <detail-wrapper
                :options="{ title: '平台特殊信息' }"
                v-else-if="orderDetail.orderBusinessType === 'DI' || orderDetail.orderBusinessType === 'PO'"
              >
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="供货商ID" prop="receiveName">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.omsOrderCustomerOptionsVO.diPo.sellingPartyId"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="发货窗口" prop="phone">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.omsOrderCustomerOptionsVO.diPo.shipWindowStr"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="订单变更日期" label-width="100px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.omsOrderCustomerOptionsVO.diPo.purchaseOrderStateChangedDate"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </detail-wrapper>
              <detail-wrapper
                :options="{ title: '平台特殊信息' }"
                v-else-if="orderDetail.orderBusinessType === 'MP' || orderDetail.orderBusinessType === 'DSV'"
              >
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="买家指定物流" prop="receiveName" label-width="100px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.omsOrderCustomerOptionsVO.dsvMp.overseaLogisticsChannelName"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="要求发货时间" prop="receiveName" label-width="100px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.omsOrderCustomerOptionsVO.dsvMp.estimatedShipDate"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="承诺送达时间" prop="phone" label-width="100px">
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.omsOrderCustomerOptionsVO.dsvMp.estimatedDeliveryDate"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </detail-wrapper>
              <!-- <detail-wrapper :options="{title:'平台特殊信息'}" v-else>
              </detail-wrapper> -->
            </el-form>
          </div>
          <!-- 产品信息 -->
          <div style="position: relative" class="cpNav">
            <detail-wrapper :options="{ title: '产品信息' }">
              <el-table
                :data="tableData"
                show-summary
                border
                :summary-method="getSummaries"
                max-height="600"
                class="cancelFixedTop"
                style="width: 100%"
                :row-class-name="rowClassName"
              >
                <el-table-column prop="detailLineNo" label="明细行行号" width="100"> </el-table-column>
                <el-table-column prop="imageUrl" label="图片" width="80">
                  <template slot-scope="scope">
                    <img
                      style="width: 60px"
                      v-if="scope.$index !== tableData.length - 1"
                      :src="scope.row.imageUrl"
                      alt="暂无图片"
                    />
                  </template>
                </el-table-column>
                <el-table-column width="140" prop="asin  " label="平台SKU">
                  <template slot-scope="scope">
                    <p>{{ scope.row.asin }}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="skuName" label="品名" width="180"> </el-table-column>
                <el-table-column prop="sku" label="SKU" width="220">
                  <template slot-scope="scope">
                    <div v-if="scope.$index === tableData.length - 1">优惠总金额：</div>
                    <div v-else>
                      <el-tag type="success" v-if="scope.row.isBundle" style="margin-bottom: 5px">bundle</el-tag>
                      <el-input disabled="true" size="small" v-model="scope.row.sku" placeholder="暂无数据"></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="expectedQuantity" label="数量" width="70"> </el-table-column>
                <!-- 只有PO和DI订单有接收数量 -->
                <el-table-column
                  v-if="['PO', 'DI'].includes(orderDetail.orderBusinessType)"
                  prop="receiveQuantity"
                  label="接收数量"
                  width="70"
                >
                </el-table-column>
                <el-table-column prop="validQuantity" width="100" label="确认发货量"> </el-table-column>
                <el-table-column prop="actualDeliveryNum" label="已发货量"> </el-table-column>
                <el-table-column prop="cancelQuantity" label="取消数量"> </el-table-column>
                <el-table-column prop="actualReturnQuantity" label="退货数量"> </el-table-column>
                <el-table-column prop="unitSalesPrice" label="销售单价">
                  <template slot-scope="scope">
                    {{ scope.row.unitSalesPrice ? scope.row.unitSalesPrice : "" }}
                    {{
                      scope.row.noneTaxPriceCurrency && scope.row.unitSalesPrice ? scope.row.noneTaxPriceCurrency : ""
                    }}
                  </template>
                </el-table-column>
                <el-table-column prop="noneTaxPrice" width="120" label="实付单价(不含税)">
                  <template slot-scope="scope">
                    {{ scope.row.noneTaxPrice ? scope.row.noneTaxPrice : "" }}
                    {{ scope.row.noneTaxPriceCurrency && scope.row.noneTaxPrice ? scope.row.noneTaxPriceCurrency : "" }}
                  </template>
                </el-table-column>
                <el-table-column prop="tax" width="120" label="税率/税费">
                  <template slot-scope="scope" v-if="scope.$index !== tableData.length - 1">
                    <div v-if="!orderDetail.isBundle">
                      {{ scope.row.taxRate + "/" + scope.row.tax
                      }}{{ scope.row.taxCurrency ? scope.row.taxCurrency : "" }}
                    </div>
                    <div v-else>
                      <p v-for="(item, index) in scope.row.taxShowMuch" :key="index">
                        {{ item.taxRate + " /" }} {{ item.remark }} {{ item.tax }} {{ item.taxCurrency }}
                      </p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="taxPrice" width="120" label="实付单价(含税)">
                  <template slot-scope="scope">
                    {{ scope.row.taxPrice ? scope.row.taxPrice : "" }}
                    {{ scope.row.taxPriceCurrency && scope.row.taxPrice ? scope.row.taxPriceCurrency : "" }}
                  </template>
                </el-table-column>
                <el-table-column prop="noneTaxAmount" width="130" label="实付总金额(不含税)">
                  <template slot-scope="scope">
                    {{ scope.row.noneTaxAmount ? scope.row.noneTaxAmount : "" }}
                    {{
                      scope.row.noneTaxAmountCurrency && scope.row.noneTaxAmount ? scope.row.noneTaxAmountCurrency : ""
                    }}
                  </template>
                </el-table-column>
                <el-table-column prop="taxAmount" width="120" label="实付总金额(含税)">
                  <template slot-scope="scope">
                    {{ scope.row.taxAmount ? scope.row.taxAmount : "" }}
                    {{ scope.row.taxAmountCurrency && scope.row.taxAmount ? scope.row.taxAmountCurrency : "" }}
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="延期要求"> </el-table-column>
              </el-table>
            </detail-wrapper>
          </div>
          <!-- 确认信息 -->
          <div class="qrNav">
            <el-form label-width="70px" class="demo-form-inline">
              <detail-wrapper :options="{ title: '确认信息' }">
                <avue-crud ref="crud" :data="confirmData" :option="confirmOption"> </avue-crud>
              </detail-wrapper>
            </el-form>
          </div>
          <!-- 发货信息 -->
          <div class="fhNav">
            <el-form label-width="70px" class="demo-form-inline">
              <detail-wrapper :options="{ title: '发货信息' }">
                <avue-crud ref="crud" :data="foInfoData" :option="foInfoOption">
                  <template slot="foDetailInfos" slot-scope="scope">
                    <p v-for="(item, index) in scope.row.foDetailInfos" :key="index">
                      <span>{{ item.asin }}<span style="margin: 0 20px">/</span></span
                      ><span>{{ item.sku }}<span style="margin: 0 10px">/</span></span
                      ><span>{{ item.expectedQuantity }}</span>
                    </p>
                  </template>
                </avue-crud>
              </detail-wrapper>
            </el-form>
          </div>
          <!-- 操作日志 -->
          <div class="rzNav">
            <el-form label-width="70px" class="demo-form-inline">
              <detail-wrapper :options="{ title: '操作日志' }">
                <avue-crud ref="opeCrud" :data="logData" :option="logOption"> </avue-crud>
              </detail-wrapper>
            </el-form>
          </div>
        </div>
        <div class="scroll-nav">
          <div v-for="item in scrollNav" :key="item.title" class="scroll-navTitle">
            <el-button type="text" @click="goTop(item.top)">{{ item.title }}</el-button>
          </div>
        </div>
      </div>
    </basic-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { foInfoOption, confirmOption, logOption, remarkOption } from "@/const/crud/order/orderManage/orderManage"
import { getDetailById, updateOrder, matchOrderTasks } from "@/api/order/orderManage"
import { getAllBizLog } from "@/api/baseSetup/bseoperatelog/prdoperatelog"
import { fetchList as getMateSkuList } from "@/api/product/prdarchives_detail"
import { getUrlConcatToken, getTokenUrl, downloadBlob } from "@/util/auth"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getStore } from "@/util/store"
import { Sku } from "vant"

export default {
  name: "prdlcreate",
  data() {
    return {
      orderDetail: {},
      tableData: [],
      foInfoData: [],
      foInfoOption: foInfoOption,
      confirmData: [],
      confirmOption: confirmOption,
      logOption: logOption,
      logData: [],
      cascaderProp: { multiple: false },
      orderId: "",
      scrollNav: [],
      remarkOption: remarkOption
    }
  },
  activated() {
    this.orderId = this.$route.query.id
    this.init(this.orderId)
    const params = {
      bizId: this.orderId,
      className: "OmsSoOrder"
    }
    getAllBizLog(params).then((res) => {
      if (res.data.code === 0) {
        this.logData = res.data.data
      }
    })
  },
  computed: {
    ...mapGetters(["permissions", "tagList"])
  },
  methods: {
    async init(orderId) {
      const res = await getDetailById({ orderId })
      if (res.data.code == 0) {
        // 费用拼上后缀币种
        let data = res.data.data
        data.oldTotalNoneTaxAmount = data.totalNoneTaxAmount
        data.oldTotalTaxAmount = data.totalTaxAmount
        if (data.totalTaxAmount) {
          data.totalTaxAmount = data.totalTaxAmountCurrency
            ? data.totalTaxAmount + " " + data.totalTaxAmountCurrency
            : data.totalTaxAmount
        } else {
          data.totalTaxAmount = ""
        }
        if (data.totalNoneTaxAmount) {
          data.totalNoneTaxAmount = data.totalNoneTaxAmountCurrency
            ? data.totalNoneTaxAmount + " " + data.totalNoneTaxAmountCurrency
            : data.totalNoneTaxAmount
        } else {
          data.totalNoneTaxAmount = ""
        }
        if (data.shippingPrice) {
          data.shippingPrice = data.shippingPriceCurrency
            ? data.shippingPrice + " " + data.shippingPriceCurrency
            : data.shippingPrice
        } else {
          data.shippingPrice = ""
        }
        this.orderDetail = data
        if (!this.orderDetail.omsOrderCustomerOptionsVO) {
          this.orderDetail.omsOrderCustomerOptionsVO = {
            df: {},
            diPo: {},
            dsvMp: {}
          }
        }
        this.orderDetail.orderId = this.orderId
        data.productList.forEach((item) => {
          item.imageUrl = item.imageUrl ? getTokenUrl([item.imageUrl]) : item.imageUrl
          item.tax = (item.taxAmount - item.noneTaxAmount).toFixed(2)
        })

        let allObj = {
          noneTaxAmount: res.data.data.discountAmount + " " + res.data.data.discountCurrency,
          taxAmount: res.data.data.discountAmount + " " + res.data.data.discountCurrency
        }
        data.productList.push(allObj)
        this.tableData = data.productList

        // 算父级的确认发货量、已发货量、取消数量
        if (["DI", "PO"].includes(this.orderDetail.orderBusinessType)) {
          // 1. 创建父行映射对象
          const parentRowMap = {}

          // 2. 初始化父子行关系
          this.tableData.forEach((item) => {
            if (!item.detailLineNo) return

            // 设置父行编号
            item.parentDetailLineNo = item.isParentDetail ? "" : item.detailLineNo.split("-")[0]

            // 将父行记录到映射对象中
            if (item.isParentDetail) {
              parentRowMap[item.detailLineNo] = {
                row: item,
                validQuantity: 0,
                actualDeliveryNum: 0,
                cancelQuantity: 0
              }
            }
          })

          // 3. 统计子行数据到父行
          this.tableData.forEach((item) => {
            if (!item.detailLineNo) return

            // 如果是父行且没有子行,保留原始数据
            if (item.isParentDetail) {
              const hasChildren = this.tableData.some((row) => {
                return (
                  !row.isParentDetail &&
                  row.detailLineNo &&
                  item.detailLineNo &&
                  row.detailLineNo.toString().startsWith(item.detailLineNo.toString() + "-")
                )
              })

              if (!hasChildren) {
                parentRowMap[item.detailLineNo] = {
                  row: item,
                  validQuantity: Number(item.validQuantity || 0),
                  actualDeliveryNum: Number(item.actualDeliveryNum || 0),
                  cancelQuantity: Number(item.cancelQuantity || 0)
                }
                return
              }
            }

            // 累加子行数据到父行
            if (!item.isParentDetail && item.parentDetailLineNo && parentRowMap[item.parentDetailLineNo]) {
              const parentData = parentRowMap[item.parentDetailLineNo]
              parentData.validQuantity += Number(item.validQuantity || 0)
              parentData.actualDeliveryNum += Number(item.actualDeliveryNum || 0)
              parentData.cancelQuantity += Number(item.cancelQuantity || 0)
            }
          })

          // 4. 更新父行数据
          Object.values(parentRowMap).forEach(({ row, ...sums }) => {
            Object.assign(row, sums)
          })
        }

        this.confirmData = data.orderConfirmList
        this.foInfoData = data.foInfoList
      }
      this.$nextTick(() => {
        const jbNavTop = document.getElementsByClassName("jbNav")[0].offsetTop - 70
        const bzNavTop = document.getElementsByClassName("bzNav")[0].offsetTop - 140
        const psNavTop = document.getElementsByClassName("psNav")[0].offsetTop - 140
        const sfNavTop = document.getElementsByClassName("sfNav")[0].offsetTop - 140
        const ptNavTop = document.getElementsByClassName("ptNav")[0].offsetTop - 140
        const cpNavTop = document.getElementsByClassName("cpNav")[0].offsetTop - 140
        const qrNavTop = document.getElementsByClassName("qrNav")[0].offsetTop - 140
        const fhNavTop = document.getElementsByClassName("fhNav")[0].offsetTop - 140
        const rzNavTop = document.getElementsByClassName("rzNav")[0].offsetTop - 140

        this.scrollNav = [
          { title: "基本信息", className: "jbNav", top: jbNavTop },
          { title: "备注信息", className: "bzNav", top: bzNavTop },
          { title: "配送信息", className: "psNav", top: psNavTop },
          { title: "税费信息", className: "sfNav", top: sfNavTop },
          { title: "平台特殊信息", className: "ptNav", top: ptNavTop },
          { title: "产品信息", className: "cpNav", top: cpNavTop },
          { title: "确认信息", className: "qrNav", top: qrNavTop },
          { title: "发货信息", className: "fhNav", top: fhNavTop },
          { title: "操作日志", className: "rzNav", top: rzNavTop }
        ]
      })
    },
    goTop(top) {
      const bodys = document.getElementsByClassName("scrollView")[0]
      bodys.scroll({
        top: top,
        behavior: "smooth"
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      const amountKey = [
        "expectedQuantity",
        "validQuantity",
        "actualDeliveryNum",
        "unshippedNum",
        "taxAmount",
        "noneTaxAmount",
        "sku",
        "tax",
        "actualReturnQuantity",
        "cancelQuantity",
        "receiveQuantity"
      ]
      const DIAndPoAmountKey = [
        "expectedQuantity",
        "validQuantity",
        "actualDeliveryNum",
        "cancelQuantity",
        "actualReturnQuantity",
        "receiveQuantity"
      ]
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = ""
          return
        }
        if (amountKey.includes(column.property)) {
          if (column.property === "taxAmount") {
            sums[index] = this.orderDetail.totalTaxAmount
          } else if (column.property === "noneTaxAmount") {
            sums[index] = this.orderDetail.totalNoneTaxAmount
          } else if (column.property === "tax") {
            let tax = (this.orderDetail.oldTotalTaxAmount - this.orderDetail.oldTotalNoneTaxAmount).toFixed(2)
            sums[index] = this.orderDetail.totalTaxAmountCurrency
              ? tax + " " + this.orderDetail.totalTaxAmountCurrency
              : tax
          } else if (column.property === "sku") {
            sums[index] = "总计："
          } else if (
            DIAndPoAmountKey.includes(column.property) &&
            ["DI", "PO"].includes(this.orderDetail.orderBusinessType)
          ) {
            // DI、PO单只合并父元素的值
            let parentRows = data.filter((item) => item?.isParentDetail)
            // 判断[column.property] 有值或者等于0
            const allNonVal = parentRows.every((item) => item[column.property] === 0 || item[column.property])
            if (allNonVal) {
              console.log("column.property", column.property)
              sums[index] = parentRows.reduce((pre, cur) => {
                return pre + cur[column.property]
              }, 0)
            } else {
              sums[index] = "-/-"
            }
          } else {
            const values = data.map((item) => Number(item[column.property]))
            if (!values.every((value) => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
            } else {
              sums[index] = "-/-"
            }
          }
        }
      })
      return sums
    },
    orderCancel() {
      this.$router.push({
        path: "/order/orderManageList"
      })
    },
    rowClassName({ row }) {
      if (["DI", "PO"].includes(this.orderDetail.orderBusinessType) && row?.isParentDetail) {
        return "parent-row"
      }
    }
  },
  components: {}
}
</script>

<style lang="scss" scoped>
#orderManageDetail {
  padding-bottom: 0px;
  .scroll-nav {
    top: 178px;
    right: 30px;
    position: fixed;
    width: 160px;
    z-index: 100;
    box-sizing: border-box;
    background: #fff;

    .scroll-navTitle {
      border-bottom: 1px solid #efefef;
      border-left: 1px solid #efefef;
      text-indent: 20px;
    }
  }

  .orderManageDetail-header {
    position: fixed;
    background: #fff;
    z-index: 666;
    width: calc(100% - 257px);
    left: 230px;
    top: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #efefef;
    padding: 20px;
    box-sizing: border-box;

    .orderManageDetail-header-main {
      display: flex;
      align-items: center;
    }
  }

  .orderManageDetail-step {
    padding: 80px 0 0 0;
  }

  ::v-deep .parent-row {
    background-color: rgba(255 249 204 / 36%) !important;
  }
}
</style>
