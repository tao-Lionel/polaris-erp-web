<template>
  <div id="invoiceManageDetail">
    <basic-container>
      <div style="display: flex">
        <div style="width: calc(100% - 150px)">
          <div class="invoiceManageDetail-header">
            <div class="invoiceManageDetail-header-main">
              <copy-text>
                <span style="font-size: 24px; font-weight: bold">{{ orderDetail.orderCode }}</span>
              </copy-text>
              <el-tag style="margin-left: 10px" type="primary">{{ orderDetail.orderBusinessType }}</el-tag>
              <el-tag style="margin-left: 10px" type="primary">{{ orderDetail.deliveryName }}</el-tag>
              <span style="margin-left: 10px">查看详情</span>
            </div>
          </div>
          <!-- 基本信息 -->
          <div class="invoiceManageDetail-step jbNav">
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
                      <el-input
                        class="el-input--small"
                        v-model="orderDetail.buyerRemark"
                        placeholder="暂无数据"
                        :disabled="true"
                        size="mini"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- <el-row>
                <el-col :span="24">
                  <el-form-item label="备注" style="padding:5px;">
                    <el-input class="el-input--small" v-model="orderDetail.remark" placeholder="暂无数据" :disabled="true"
                      type="textarea" :rows="3" size="mini"></el-input>
                  </el-form-item>
                </el-col>
              </el-row> -->
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
                    <el-form-item label="承诺送达时间" label-width="100px">
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
                    <el-form-item label="要求发货时间" prop="receiveName" label-width="180px">
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
                    <el-form-item label="承诺送达时间" prop="phone" label-width="180px">
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
            </el-form>
          </div>

          <!-- 产品信息 -->
          <div style="position: relative" class="cpNav">
            <detail-wrapper :options="{ title: '产品信息' }">
              <el-table
                :data="tableData"
                stripe
                show-summary
                border
                :summary-method="getSummaries"
                max-height="600"
                class="cancelFixedTop"
                style="width: 100%"
              >
                <!-- <el-table-column label="明细行行号" prop="detailLineNo" width="100">
                </el-table-column> -->
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
                <el-table-column width="140" prop="asin  " label="链接SKU/ASIN">
                  <template slot-scope="scope">
                    <p>{{ scope.row.asin }}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="skuName" label="品名" width="180"> </el-table-column>
                <el-table-column prop="sku" label="SKU" width="220">
                  <template slot-scope="scope">
                    <div v-if="scope.row.sku" style="display: flex; align-items: center">
                      <el-input disabled="true" size="small" v-model="scope.row.sku"></el-input>
                      <el-button
                        v-if="!isDisabled"
                        style="flex-shrink: 0; margin-left: 10px"
                        :disabled="isDisabled || !isEditOrder"
                        size="small"
                        type="text"
                        @click="showMateSku(scope.$index)"
                        >修改SKU</el-button
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="expectedQuantity" label="数量" width="70"> </el-table-column>
                <el-table-column prop="validQuantity" width="100" label="确认发货量"> </el-table-column>
                <el-table-column prop="actualDeliveryNum" label="已发货量"> </el-table-column>
                <el-table-column prop="actualReturnQuantity" label="退货数量"> </el-table-column>
                <el-table-column prop="unitSalesPrice" label="销售单价">
                  <template slot-scope="scope">
                    {{ scope.row.unitSalesPrice ? scope.row.unitSalesPrice : 0 }}
                    {{
                      scope.row.noneTaxPriceCurrency && scope.row.unitSalesPrice ? scope.row.noneTaxPriceCurrency : ""
                    }}
                  </template>
                </el-table-column>
                <el-table-column prop="noneTaxPrice" width="110" label="实付单价(不含税)"> </el-table-column>
                <el-table-column prop="tax" label="税率/税费" width="100">
                  <!-- <template slot-scope="scope">
                    {{ scope.row.taxRate + '/' + scope.row.tax }}
                  </template> -->
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
                <el-table-column prop="taxPrice" width="90" label="实付单价(含税)"> </el-table-column>
                <el-table-column prop="noneTaxAmount" width="130" label="实付总金额(不含税)"> </el-table-column>
                <el-table-column prop="taxAmount" width="120" label="实付总金额(含税)"> </el-table-column>
                <el-table-column prop="address" label="延期要求"> </el-table-column>
              </el-table>
            </detail-wrapper>
          </div>
          <!-- 发货信息 -->
          <div class="fhNav">
            <el-form label-width="70px" class="demo-form-inline">
              <detail-wrapper :options="{ title: '发货信息' }">
                <avue-crud ref="crud" :data="foInfoData" :option="foInfoOption"> </avue-crud>
              </detail-wrapper>
            </el-form>
          </div>

          <!-- 操作日志 -->
          <div>
            <el-form label-width="70px" class="demo-form-inline rzNav">
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
import { foInfoOption, logOption, remarkOption } from "@/const/crud/order/invoiceManage/invoiceManage"
import { getDetailById, getAllBizLog } from "@/api/order/invoiceManage"
import { fetchList as getMateSkuList } from "@/api/product/prdarchives_detail"
import { getUrlConcatToken, getTokenUrl, downloadBlob } from "@/util/auth"
import { deepCloneIgnoreNull, deepClone } from "@/components/avue/utils/util"
import { getStore } from "@/util/store"

export default {
  name: "prdlcreate",
  data() {
    return {
      orderDetail: {},
      logData: [],
      logOption: logOption,
      tableData: [],
      foInfoData: [],
      foInfoOption: foInfoOption,
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
      className: "OmsFoOrder"
    }
    console.log(11111, getAllBizLog)
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
        data.oldTotalTaxAmount = data.totalTaxAmount
        data.oldTotalNoneTaxAmount = data.totalNoneTaxAmount
        data.totalTaxAmount = data.totalTaxAmountCurrency
          ? data.totalTaxAmount + " " + data.totalTaxAmountCurrency
          : data.totalTaxAmount
        data.totalNoneTaxAmount = data.totalNoneTaxAmountCurrency
          ? data.totalNoneTaxAmount + " " + data.totalNoneTaxAmountCurrency
          : data.totalNoneTaxAmount
        data.shippingPrice = data.shippingPriceCurrency
          ? data.shippingPrice + " " + data.shippingPriceCurrency
          : data.shippingPrice
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
          item.tax = (item.taxAmount - item.noneTaxAmount).toFixed(2)
          item.imageUrl = item.imageUrl ? getTokenUrl([item.imageUrl]) : item.imageUrl
          item.noneTaxPrice = item.noneTaxPriceCurrency
            ? item.noneTaxPrice + " " + item.noneTaxPriceCurrency
            : item.noneTaxPrice
          item.taxPrice = item.taxPriceCurrency ? item.taxPrice + " " + item.taxPriceCurrency : item.taxPrice
          item.taxAmount = item.taxAmountCurrency ? item.taxAmount + " " + item.taxAmountCurrency : item.taxAmount
          item.noneTaxAmount = item.noneTaxAmountCurrency
            ? item.noneTaxAmount + " " + item.noneTaxAmountCurrency
            : item.noneTaxAmount
        })
        this.tableData = res.data.data.productList
        this.foInfoData = res.data.data.foInfo
      }

      this.$nextTick(() => {
        const jbNavTop = document.getElementsByClassName("jbNav")[0].offsetTop - 70
        const bzNavTop = document.getElementsByClassName("bzNav")[0].offsetTop - 140
        const psNavTop = document.getElementsByClassName("psNav")[0].offsetTop - 140
        const sfNavTop = document.getElementsByClassName("sfNav")[0].offsetTop - 140
        const ptNavTop = document.getElementsByClassName("ptNav")[0].offsetTop - 140
        const cpNavTop = document.getElementsByClassName("cpNav")[0].offsetTop - 140
        const fhNavTop = document.getElementsByClassName("fhNav")[0].offsetTop - 140
        const rzNavTop = document.getElementsByClassName("rzNav")[0].offsetTop - 140

        this.scrollNav = [
          { title: "基本信息", className: "jbNav", top: jbNavTop },
          { title: "备注信息", className: "bzNav", top: bzNavTop },
          { title: "配送信息", className: "psNav", top: psNavTop },
          { title: "税费信息", className: "sfNav", top: sfNavTop },
          { title: "平台特殊信息", className: "ptNav", top: ptNavTop },
          { title: "产品信息", className: "cpNav", top: cpNavTop },
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
        "tax",
        "actualReturnQuantity"
      ]
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计"
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
        path: "/order/invoiceManageList"
      })
    }
  },
  components: {}
}
</script>

<style lang="scss">
#invoiceManageDetail {
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

  .title-name {
    font-weight: bold;
  }

  a {
    text-decoration: none;
  }

  .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    color: #000;
  }

  .invoiceManageDetail__opeBtn {
    position: fixed;
    bottom: 0;
    width: calc(100% - 220px);
    height: 80px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .el-table thead {
    color: #000;
  }

  .invoiceManageDetail-header {
    position: fixed;
    background: #fff;
    z-index: 666;
    width: calc(100% - 257px);
    left: 230px;
    top: 105px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #efefef;
    padding: 20px;
    box-sizing: border-box;

    .invoiceManageDetail-header-main {
      display: flex;
      align-items: center;
    }
  }

  .invoiceManageDetail-step {
    padding: 70px 0 0 0;
  }

  .editOrderMsg {
    position: absolute;
    right: 20px;
    z-index: 100;
    top: 10px;
  }

  .editSendOrderMsg {
    position: absolute;
    right: 20px;
    z-index: 100;
    top: 10px;
  }
}
</style>
