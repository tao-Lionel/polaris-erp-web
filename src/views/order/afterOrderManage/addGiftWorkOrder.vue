<template>
  <div id="addGiftWorkOrder">
    <basic-container>
      <el-form label-width="80px" ref="giftForm" :model="omsAfterSaleWorkOrderInfoCmd" :rules="addGiftWorkOrderRules">
        <div class="iod-target-top border-rang y-prd-info">
          <p class="iod-target target-title">工单信息</p>

          <div style="padding: 20px" class="flex4">
            <el-form-item class="f4-item" label="工单类型" prop="workOrderType">
              <el-select
                size="small"
                clearable
                filterable
                placeholder="请选择"
                v-model="omsAfterSaleWorkOrderInfoCmd.workOrderType"
              >
                <el-option v-for="item in workOrderTypeList" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="f4-item" prop="reason" label="售后原因">
              <el-cascader
                v-model="omsAfterSaleWorkOrderInfoCmd.reason"
                :options="listAllReason"
                :props="reasonProps"
                clearable
                @change="handleReasonChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item class="f4-item" label="投诉原文" prop="complainOriginalText">
              <el-input
                size="small"
                v-search-input-trim
                v-model="omsAfterSaleWorkOrderInfoCmd.complainOriginalText"
              ></el-input>
            </el-form-item>
            <el-form-item class="f4-item" label="要点提取" prop="keyPointsExtractionText">
              <el-input
                size="small"
                v-search-input-trim
                v-model="omsAfterSaleWorkOrderInfoCmd.keyPointsExtractionText"
              ></el-input>
            </el-form-item>
            <el-form-item class="f4-item" label="备注" prop="exchangeRate">
              <el-input
                size="small"
                type="textarea"
                :rows="2"
                v-search-input-trim
                v-model="omsAfterSaleWorkOrderInfoCmd.remark"
              ></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="iod-target-top border-rang y-prd-info" style="margin-top: 20px; margin-bottom: 20px">
          <p class="iod-target target-title">原订单信息</p>
          <div style="padding: 20px">
            <div class="flex5" style="margin-bottom: 20px">
              <el-form-item
                label-width="100px"
                style="width: 250px; margin-bottom: 0; margin-right: 30px"
                label="平台订单号"
                prop="sourceCode"
              >
                <el-input size="small" v-search-input-trim v-model="omsAfterSaleWorkOrderInfoCmd.sourceCode"></el-input>
              </el-form-item>
              <el-button type="primary" size="small" @click="handleCheck">查询订单</el-button>
            </div>
            <div class="flex5">
              <el-form-item
                style="width: 250px; margin-bottom: 0; margin-right: 30px"
                prop="orderCode"
                label-width="100px"
                label="订单号"
              >
                <el-select
                  v-model="omsAfterSaleWorkOrderInfoCmd.orderCode"
                  size="small"
                  clearable
                  filterable
                  placeholder="请选择"
                  @change="orderChange"
                >
                  <el-option
                    v-for="item in orderInfoList"
                    :key="item.orderCode"
                    :label="item.orderCode"
                    :value="item.orderCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                style="width: 250px; margin-bottom: 0; margin-right: 30px"
                prop="store"
                label="店铺"
                label-width="100px"
              >
                <el-select
                  v-model="omsAfterSaleWorkOrderInfoCmd.store"
                  size="small"
                  placeholder="请选择"
                  clearable
                  :disabled="canModifyShopInfoFlag"
                  @change="storeChange"
                >
                  <el-option
                    v-for="item in allStore"
                    :key="item.storeId"
                    :label="item.storeAccount"
                    :value="item.storeId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                style="width: 250px; margin-bottom: 0; margin-right: 30px"
                prop="orderBusinessType"
                label="交货模式"
                label-width="100px"
              >
                <el-select
                  v-model="omsAfterSaleWorkOrderInfoCmd.orderBusinessType"
                  size="small"
                  placeholder="请选择"
                  clearable
                  :disabled="canModifyShopInfoFlag"
                >
                  <el-option v-for="item in businessType" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>

            <p style="padding: 20px 0 0 20px; color: #d9001b" v-show="addWorkOrderData.sourceCode || relevanceOrder">
              该平台订单号{{ addWorkOrderData.sourceCode }},有以下关联工单:{{ relevanceOrder }}
            </p>
          </div>
        </div>
      </el-form>
      <el-form label-width="80px" ref="workOrderForm" :model="manualCrateOrderCmd" :rules="manualWorkOrderRules">
        <detail-wrapper :options="{ title: '基本信息' }">
          <el-row>
            <el-col :span="6">
              <el-form-item label="平台" prop="sourceChannel">
                <el-select
                  size="small"
                  placeholder="请选择"
                  @change="getSit"
                  clearable
                  :disabled="canModifyShopInfoFlag"
                  v-model="manualCrateOrderCmd.sourceChannel"
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
            </el-col>
            <el-col :span="6">
              <el-form-item label="站点" prop="market">
                <el-select
                  v-model="manualCrateOrderCmd.market"
                  :disabled="!manualCrateOrderCmd.sourceChannel || canModifyShopInfoFlag"
                  size="small"
                  @change="getStore"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in sit"
                    :key="item.bsePlatformSitId"
                    :label="item.sitEnName"
                    :value="item.bsePlatformSitId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="店铺" prop="shop">
                <el-select
                  v-model="manualCrateOrderCmd.shop"
                  :disabled="!manualCrateOrderCmd.market || canModifyShopInfoFlag"
                  size="small"
                  placeholder="请选择"
                  @change="getBuyerFreight"
                  clearable
                >
                  <el-option v-for="item in store" :key="item.storeId" :label="item.storeAccount" :value="item.storeId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="交货模式" prop="orderBusinessType">
                <el-select
                  v-model="manualCrateOrderCmd.orderBusinessType"
                  size="small"
                  placeholder="请选择"
                  clearable
                  :disabled="canModifyShopInfoFlag"
                >
                  <el-option v-for="item in businessType" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="订单类型" prop="orderType">
                <el-select v-model="manualCrateOrderCmd.orderType" size="small" placeholder="请选择" clearable disabled>
                  <el-option v-for="item in orderType" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="下单时间" prop="orderTime">
                <el-date-picker
                  v-model="manualCrateOrderCmd.orderTime"
                  type="datetime"
                  size="small"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
                  placeholder="选择日期时间"
                >
                </el-date-picker>
              </el-form-item>
            </el-col> -->
            <!-- <el-col :span="6">
              <el-form-item label="平台单号" prop="sourceCode">
                <el-input
                  class="el-input--small"
                  v-model="manualCrateOrderCmd.sourceCode"
                  placeholder="请输入"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="6">
              <el-form-item label="付款方式" prop="paymentMethod">
                <el-select
                  v-model="manualCrateOrderCmd.paymentMethod"
                  size="small"
                  placeholder="请选择"
                  clearable
                  disabled
                >
                  <el-option v-for="item in paymentMethod" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="发货方式" prop="deliveryMethod">
                <el-select v-model="manualCrateOrderCmd.deliveryMethod" size="small" placeholder="发货方式" clearable>
                  <el-option label="平台仓发货" value="PLATFORM"></el-option>
                  <el-option label="海外仓发货" value="WAREHOUSE"></el-option>
                  <el-option label="中转仓发货" value="TRANSIT"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="运费"
                class="el-form--append"
                :prop="manualCrateOrderCmd.buyerFreight ? 'buyerFreightCurrency' : ''"
              >
                <el-input
                  class="el-input--append"
                  v-model="manualCrateOrderCmd.buyerFreight"
                  placeholder="请输入"
                  @change="validateNumber($event, 'buyerFreight')"
                  size="mini"
                >
                  <template slot="append">
                    <el-select
                      v-model="manualCrateOrderCmd.buyerFreightCurrency"
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
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" style="padding: 5px">
                <el-input
                  class="el-input--small"
                  type="textarea"
                  :rows="3"
                  v-model="manualCrateOrderCmd.remark"
                  placeholder="请输入"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </detail-wrapper>

        <detail-wrapper :options="{ title: '收货地址' }">
          <el-row>
            <el-col :span="6">
              <el-form-item label="收件人" prop="receiveName">
                <el-input
                  class="el-input--small"
                  v-model="manualCrateOrderCmd.receiveName"
                  placeholder="请输入"
                  size="mini"
                  maxlength="35"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电话" label-width="90px" prop="receivePhone">
                <el-input
                  class="el-input--small"
                  v-model="manualCrateOrderCmd.receivePhone"
                  placeholder="请输入"
                  size="mini"
                  maxlength="20"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="邮箱" label-width="90px">
                <el-input
                  class="el-input--small"
                  v-model="manualCrateOrderCmd.receiveEmail"
                  placeholder="请输入"
                  maxlength="35"
                  size="mini"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="国家" label-width="90px" prop="country">
                <el-select v-model="manualCrateOrderCmd.country" size="small" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in country"
                    :key="item.countryLongCode"
                    :label="item.countryLongCode"
                    :value="item.countryLongCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="省/州" label-width="90px" prop="province">
                <el-input
                  class="el-input--small"
                  v-model="manualCrateOrderCmd.province"
                  placeholder="请输入"
                  maxlength="32"
                  size="mini"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="市" label-width="90px" prop="city">
                <el-input
                  class="el-input--small"
                  v-model="manualCrateOrderCmd.city"
                  placeholder="请输入"
                  maxlength="32"
                  size="mini"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="区">
                <el-input
                  class="el-input--small"
                  v-model="manualCrateOrderCmd.area"
                  placeholder="请输入"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="地址1"
                prop="address"
                v-if="manualCrateOrderCmd.country === 'IDN'"
                :rules="manualWorkOrderRules.addressIDN"
              >
                <el-input
                  class="el-input--small"
                  v-model="manualCrateOrderCmd.address"
                  placeholder="请输入"
                  size="mini"
                  maxlength="150"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item v-else label="地址1" prop="address">
                <el-input
                  class="el-input--small"
                  v-model="manualCrateOrderCmd.address"
                  placeholder="请输入"
                  size="mini"
                  maxlength="35"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="地址2" prop="altAddress" v-if="manualCrateOrderCmd.country === 'IDN'">
                <el-input
                  class="el-input--small"
                  v-model="manualCrateOrderCmd.altAddress"
                  placeholder="请输入"
                  size="mini"
                  maxlength="150"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item label="地址2" prop="altAddress" v-else>
                <el-input
                  class="el-input--small"
                  v-model="manualCrateOrderCmd.altAddress"
                  placeholder="请输入"
                  size="mini"
                  maxlength="35"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="邮编" label-width="90px" prop="receivePostalCode">
                <el-input
                  class="el-input--small"
                  v-model="manualCrateOrderCmd.receivePostalCode"
                  placeholder="请输入"
                  maxlength="10"
                  size="mini"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </detail-wrapper>

        <detail-wrapper :options="{ title: '产品信息' }">
          <div class="product-message" style="padding: 10px 10px 0">
            <el-button
              size="small"
              type="primary"
              style="margin-bottom: 10px"
              @click="addSku"
              :disabled="type == 'RESEND'"
              >添加商品</el-button
            >
            <el-button size="small" type="primary" style="margin-bottom: 10px" @click="calcAmount"
              >汇总订单总金额(不含税)</el-button
            >
            <avue-crud ref="skuShowCrud" :data="skuShowData" :option="skuShowOption">
              <template slot="imageUrl" slot-scope="scope">
                <img class="big-img" v-if="scope.row.imageUrl" :src="scope.row.imageUrl" :alt="加载失败" />
                <span v-else></span>
              </template>
              <template slot="asin" slot-scope="scope">
                <el-input v-model="scope.row.asin" disabled="true" size="mini"></el-input>
              </template>
              <template slot="unitPrice" slot-scope="scope">
                <el-input
                  class="el-input--append"
                  v-model="scope.row.unitPrice"
                  placeholder="请输入"
                  @change="validateNumberArr(scope.row.$index, scope.row.unitPrice, 'unitPrice')"
                  size="mini"
                >
                  <el-select
                    v-model="scope.row.unitPriceCurrency"
                    slot="append"
                    placeholder="币种"
                    :disabled="scope.row.$index !== 0"
                    @change="changeCurrency($event, 'unitPriceCurrency')"
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
              <template slot="taxAmountHasTax" slot-scope="scope">
                <el-input
                  class="el-input--append"
                  @change="validateNumberArr(scope.row.$index, scope.row.taxAmountHasTax, 'taxAmountHasTax')"
                  v-model="scope.row.taxAmountHasTax"
                  placeholder="请输入"
                  size="mini"
                >
                  <el-select
                    v-model="scope.row.taxAmountHasTaxCurrency"
                    slot="append"
                    placeholder="币种"
                    :disabled="scope.row.$index !== 0"
                    @change="changeCurrency($event, 'taxAmountHasTaxCurrency')"
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
              <template slot="unitPriceHasTax" slot-scope="scope">
                <el-input
                  class="el-input--append"
                  @change="validateNumberArr(scope.row.$index, scope.row.unitPriceHasTax, 'unitPriceHasTax')"
                  v-model="scope.row.unitPriceHasTax"
                  placeholder="请输入"
                  size="mini"
                >
                  <el-select
                    v-model="scope.row.unitPriceHasTaxCurrency"
                    slot="append"
                    placeholder="币种"
                    :disabled="scope.row.$index !== 0"
                    @change="changeCurrency($event, 'unitPriceHasTaxCurrency')"
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
              <template slot="quantity" slot-scope="scope">
                <el-input-number
                  class="el-input--small"
                  :controls="false"
                  :min="0"
                  :precision="0"
                  v-model="scope.row.quantity"
                  placeholder="请输入"
                  size="mini"
                ></el-input-number>
              </template>
              <template slot="opeBtn" slot-scope="scope">
                <el-button type="text" @click="deletePrd(scope.row)">删除</el-button>
              </template>
            </avue-crud>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="订单总金额(不含税)"
                  label-width="145px"
                  :prop="manualCrateOrderCmd.amount ? 'amountCurrency' : 'amount'"
                  class="el-form--append"
                >
                  <el-input
                    class="el-input--append"
                    @change="validateNumber($event, 'amount')"
                    v-model="manualCrateOrderCmd.amount"
                    placeholder="请输入"
                    size="mini"
                  >
                    <el-select
                      v-model="manualCrateOrderCmd.amountCurrency"
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
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="订单总金额(含税)" label-width="120px" class="el-form--append">
                  <el-input
                    class="el-input--append"
                    @change="validateNumber($event, 'amountHasTax')"
                    v-model="manualCrateOrderCmd.amountHasTax"
                    placeholder="请输入"
                    size="mini"
                  >
                    <el-select
                      v-model="manualCrateOrderCmd.amountHasTaxCurrency"
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
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </detail-wrapper>
      </el-form>
      <div style="padding: 20px">
        <span slot="footer" class="dialog-footer" style="display: flex; justify-content: center">
          <el-button style="padding: 9px 30px" size="small" @click="handleClose">取 消</el-button>
          <el-button type="primary" size="small" style="padding: 9px 30px" @click="createOrder()">创建新订单</el-button>
        </span>
      </div>

      <!-- 添加商品弹窗 -->
      <el-dialog title="添加商品" :visible.sync="addSkuStatus" width="60%">
        <avue-crud
          ref="addSkuCrud"
          :page="page"
          :data="addSkuData"
          :option="addSkuOption"
          @on-load="getList"
          @refresh-change="refreshChange"
          @search-change="searchChange"
          @search-reset="searchReset"
          @size-change="sizeChange"
          @selection-change="selectionChange"
        >
          <template slot="search">
            <el-form>
              <el-form-item label="" size="small">
                <el-input v-model.trim="addOrderSearchForm.sku" placeholder="工厂SKU，支持多个"></el-input>
              </el-form-item>
              <el-form-item label="" size="small">
                <el-input v-model.trim="addOrderSearchForm.linkSku" placeholder="平台SKU，支持多个"></el-input>
              </el-form-item>
            </el-form>
          </template>
          <template slot="imageUrl" slot-scope="scope">
            <img class="big-img" v-if="scope.row.imageUrl" :src="scope.row.imageUrl" :alt="加载失败" />
            <span v-else></span>
          </template>
        </avue-crud>
        <div style="text-align: center; margin-top: 20px">
          <el-button size="small" style="padding: 9px 30px" @click="addCancel">取消</el-button>
          <el-button
            size="small"
            style="padding: 9px 30px"
            type="primary"
            :disabled="!selectRows.length"
            @click="addSave"
            >确认</el-button
          >
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { skuShowOption, addGiftWorkOrderRules, addSkuOption, manualWorkOrderRules } from "./index"
import {
  getOrderByCode,
  getAllWorkOrderType,
  getListAllReason,
  addWorkOrder,
  addWorkOrderByGifts,
  getPlayTypeAll,
  getSit,
  getStoreBySitIds,
  getObjByType,
  getCurrency,
  getCountry,
  getProductList,
  getSellerSku,
  getDetail,
  getSalesDetailById,
  manualCreate,
  getStore as getAllStore
} from "@/api/order/afterOrderManage.js"
import { getTokenUrl } from "@/util/auth"
import { deepClone } from "@/components/avue/utils/util"
import { storeOption } from "@/const/crud/warehouse/warehouseforsku"
import { getEnableSkuRelateManagerInfoApi } from "@/api/order/orderManage"

export default {
  name: "addGiftWorkOrder",
  computed: {
    ...mapGetters(["permissions"])
  },
  data() {
    return {
      orderForm: {
        labels: [],
        country: "",
        market: "",
        platform: "",
        shop: "",
        amount: "",
        buyerFreight: "",
        buyerFreightCurrency: "",
        amountCurrency: "",
        amountHasTaxCurrency: ""
      },
      addOrderRule: {},
      skuShowOption: skuShowOption,
      addSkuOption: addSkuOption,
      addGiftWorkOrderRules: addGiftWorkOrderRules,
      manualWorkOrderRules: manualWorkOrderRules,
      // 提交数据
      addWorkOrderData: {
        workOrderType: "GIFT_WORK_ORDER",
        reason: "",
        complainOriginalText: "",
        keyPointsExtractionText: "",
        remark: "",
        orderCode: "",
        sourceCode: "",
        store: 0,
        storeAccount: "",
        freezeStatus: "",
        freezeStatusName: "",
        orderBusinessType: "",
        cmdDetail: [],
        platformOrderCode: "",
        orderId: ""
      },
      workOrderTypeList: [],
      listAllReason: [],
      reasonProps: {
        value: "id",
        label: "displayText"
      },

      omsAfterSaleWorkOrderInfoCmd: {
        workOrderType: "GIFT_WORK_ORDER",
        reason: 0,
        complainOriginalText: "",
        keyPointsExtractionText: "",
        remark: "",
        orderCode: "",
        orderId: "",
        sourceCode: "",
        platformOrderCode: "",
        store: "",
        storeAccount: "",
        orderBusinessType: "",
        cmdDetail: [],
        totalAmountHasTaxCurrency: ""
      },
      manualCrateOrderCmd: {
        sourceChannel: "",
        market: "",
        shop: "",
        orderType: "AFTER_SALES",
        orderBusinessType: "",
        sourceCode: "",
        orderTime: "",
        buyerName: "",
        buyerEmail: "",
        buyerFreight: "",
        buyerFreightCurrency: "",
        remark: "",
        receiveName: "",
        receivePostalCode: "",
        receivePhone: "",
        receiveEmail: "",
        country: "",
        countryCode: "",
        province: "",
        city: "",
        area: "",
        street: "",
        address: "",
        altAddress: "",
        warehouse: 0,
        logisticsCode: "",
        logisticsChannel: "",
        products: [],
        labels: [],
        paymentMethod: "Other",
        amount: 0,
        amountCurrency: "",
        amountHasTax: 0,
        amountHasTaxCurrency: "",
        deliveryMethod: "WAREHOUSE",
        accessMode: "AFTER_SALE",
        totalAmountHasTaxCurrency: ""
      },

      orderInfoList: [],
      platform: [],
      sit: [],
      store: [],
      allStore: [],
      businessType: [],
      orderType: [],
      paymentMethod: [],
      currencyArr: [],
      country: [],
      addOrderSearchForm: {
        // skuCode: ""
        sku: "",
        linkSku: ""
      },
      selectRows: [],
      addSkuStatus: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      addSkuData: [],
      skuShowData: [],
      currency: "",
      // 选中订单号信息
      checkedOrderItem: {},
      type: "",
      canModifyShopInfoFlag: false // 判断能否修改店铺信息  true不能
    }
  },
  created() {
    const { type } = this.$route.query
    this.omsAfterSaleWorkOrderInfoCmd.workOrderType = type || "GIFT_WORK_ORDER"
    this.type = type
    this.init()
    this.isResend()
    this.isOrderAddGift()
  },
  methods: {
    isOrderAddGift() {
      const { workOrderCode, form, soOrderId } = this.$route.query
      console.log("workOrderCode, type, soOrderId ===>", workOrderCode, soOrderId)
      // 从订单管理的新增赠品过来的
      if (form == "ORDER_GIFT") {
        this.getSalesDetailById(soOrderId)
      }
    },
    isResend() {
      const { workOrderCode, type, soOrderId } = this.$route.query
      if (type !== "RESEND") return
      this.omsAfterSaleWorkOrderInfoCmd.workOrderType = type
      this.getDetail(workOrderCode)
      this.getSalesDetailById(soOrderId)
    },
    // 获取工单信息回显明细
    async getDetail(workOrderCode) {
      const { data } = await getDetail({
        workOrderCode: workOrderCode
      })
      //  表格数据回显 待处理
      this.skuShowData = data.data.omsAfterSaleMainDetailMsgVos.map((item) => {
        return {
          sku: item.sku,
          skuName: item.skuName,
          unitSalesPrice: 0,
          unitPrice: 0,
          unitPriceCurrency: item.refundCurrency, // 币种
          unitPriceHasTax: 0,
          unitPriceHasTaxCurrency: item.refundCurrency,
          amount: 0,
          amountCurrency: item.refundCurrency,
          amountHasTax: 0,
          amountHasTaxCurrency: item.refundCurrency,
          taxAmountHasTax: 0,
          taxAmountHasTaxCurrency: item.refundCurrency,
          asin: item.asin,
          quantity: item.returnQuantity,
          imageUrl: item.imageUrl
        }
      })
      const { omsAfterSaleMainMsgVo } = data.data
      this.omsAfterSaleWorkOrderInfoCmd = {
        ...this.omsAfterSaleWorkOrderInfoCmd,
        ...omsAfterSaleMainMsgVo,
        orderBusinessType: omsAfterSaleMainMsgVo.soOrderBusinessType,
        store: omsAfterSaleMainMsgVo.shop,
        storeAccount: omsAfterSaleMainMsgVo.shopAccount,
        orderCode: omsAfterSaleMainMsgVo.soOrderCode,
        orderId: omsAfterSaleMainMsgVo.soOrderId
      }
    },
    // 获取销售明细回显基本信息地址信息
    async getSalesDetailById(soOrderId) {
      const { data } = await getSalesDetailById({
        orderId: soOrderId
      })
      console.log("data.data", data.data)
      if (this.type == "RESEND") {
        this.manualCrateOrderCmd = {
          ...this.manualCrateOrderCmd,
          ...data.data,
          sourceChannel: data.data.platformCode,
          orderType: "AFTER_SALES",
          shop: data.data.shop,
          receivePhone: data.data.phone,
          area: data.data.district,
          province: data.data.stateOrRegion,
          country: data.data.country,
          countryCode: data.data.country,
          receivePostalCode: data.data.postalCode,
          amountCurrency: data.data.discountCurrency,
          amountHasTaxCurrency: data.data.discountCurrency,
          paymentMethod: "Other"
        }
        this.getSit()
      } else if (this.$route.query.form == "ORDER_GIFT") {
        // 订单列表进来的 处理
        this.omsAfterSaleWorkOrderInfoCmd.sourceCode = data.data.sourceCode
        this.omsAfterSaleWorkOrderInfoCmd.store = data.data.shop
        this.omsAfterSaleWorkOrderInfoCmd.storeAccount = data.data.shopName
        // 赋值storeAccount 列表回显使用
        // this.storeChange(data.data.shop)
        this.omsAfterSaleWorkOrderInfoCmd.orderBusinessType = data.data.orderBusinessType
        // this.omsAfterSaleWorkOrderInfoCmd.orderCode
        this.manualCrateOrderCmd = {
          ...this.manualCrateOrderCmd,
          ...data.data,
          sourceCode: data.data.sourceCode,
          sourceChannel: data.data.platformCode,
          shop: data.data.shop,
          receivePhone: data.data.phone,
          area: data.data.district,
          province: data.data.stateOrRegion,
          country: data.data.country,
          countryCode: data.data.country,
          receivePostalCode: data.data.postalCode,
          amountCurrency: "",
          amountHasTaxCurrency: "",
          orderType: "AFTER_SALES",
          paymentMethod: "Other"
        }
        this.getOrderByCode()
        this.getSit()
        // if (this.orderInfoList.length) {
        //    this.orderChange(this.orderInfoList[0].orderCode)
        // }
      } else {
        this.manualCrateOrderCmd = {
          ...this.manualCrateOrderCmd,
          ...data.data,
          sourceChannel: data.data.platformCode,
          paymentMethod: "Other",
          deliveryMethod: "WAREHOUSE",
          orderType: "AFTER_SALES",
          receivePhone: data.data.phone,
          area: data.data.district,
          province: data.data.stateOrRegion,
          country: data.data.country,
          countryCode: data.data.country,
          receivePostalCode: data.data.postalCode,
          amountCurrency: data.data.discountCurrency,
          amountHasTaxCurrency: data.data.discountCurrency
        }
        this.getSit()
      }
    },
    init() {
      this.getAllWorkOrderType()
      this.getListAllReason()
      this.getPlayTypeAll()
      this.getObjByType()
      this.getOrderType()
      this.getPaymentMethod()
      this.getCurrency()
      this.getCountry()
      this.getAllStore()
    },
    getPlayTypeAll() {
      getPlayTypeAll().then((res) => {
        if (res.data.code == 0) {
          this.platform = res.data.data
        }
      })
    },
    getSit() {
      if (!this.manualCrateOrderCmd.sourceChannel) return
      getSit([this.manualCrateOrderCmd.sourceChannel]).then((res) => {
        if (res.status === 200) {
          this.sit = res.data
          if (this.type == "RESEND" || this.omsAfterSaleWorkOrderInfoCmd.workOrderType == "GIFT_WORK_ORDER") {
            this.isResendGetStore()
          }
        }
      })
    },
    getStore() {
      getStoreBySitIds([this.manualCrateOrderCmd.market]).then((res) => {
        if (res.data.code === 0) {
          this.store = res.data.data.filter((item) => item.state === "0")
        }
      })
    },
    // 全部店铺
    getAllStore() {
      getAllStore([]).then((res) => {
        console.log("this.allStore", res)
        if (res.status === 200) {
          this.allStore = res.data.filter((item) => item.state === "0")
        }
      })
    },
    // 重发工单 单独出来获取店铺的
    isResendGetStore() {
      let fItem = {}
      if (typeof this.manualCrateOrderCmd.market === "string") {
        fItem = this.sit.find((item) => item.sitEnName === this.manualCrateOrderCmd.market)
        this.manualCrateOrderCmd.market = fItem.sitEnName
      }

      getStoreBySitIds([fItem.bsePlatformSitId || ""]).then((res) => {
        if (res.data.code === 0) {
          this.store = res.data.data.filter((item) => item.state === "0")
        }
      })
    },
    getObjByType() {
      getObjByType("order_business_type").then((res) => {
        if (res.data.code === 0) {
          this.businessType = res.data.data
        }
      })
    },
    getOrderType() {
      getObjByType("order_type").then((res) => {
        if (res.data.code === 0) {
          this.orderType = res.data.data
        }
      })
    },
    getPaymentMethod() {
      getObjByType("payment_method").then((res) => {
        if (res.data.code === 0) {
          this.paymentMethod = res.data.data
        }
      })
    },
    getCurrency() {
      const params = {
        size: -1,
        current: -1
      }
      getCurrency(params).then((res) => {
        if (res.data.code === 0) {
          this.currencyArr = res.data.data.records
        }
      })
    },
    getCountry() {
      getCountry().then((res) => {
        if (res.data.code === 0) {
          this.country = res.data.data
        }
      })
    },
    changeCurrency(val, key) {
      this.skuShowData.forEach((item) => {
        this.$set(item, key, val)
      })
      if (key === "unitPriceCurrency") {
        this.manualCrateOrderCmd.amountCurrency = val
      } else if (key === "unitPriceHasTaxCurrency") {
        this.manualCrateOrderCmd.amountHasTaxCurrency = val
      }
    },
    /**
     * 工单类型
     */
    async getAllWorkOrderType() {
      const res = await getAllWorkOrderType()
      if (res.data.code === 0) {
        this.workOrderTypeList = res.data.data.filter((item) => item.key === "GIFT_WORK_ORDER" || item.key === "RESEND")
      }
    },
    async getListAllReason() {
      const res = await getListAllReason()
      if (res.data.code === 0) {
        this.listAllReason = this.removeEmptyChildren(res.data.data)
      }
    },
    removeEmptyChildren(data) {
      if (!Array.isArray(data)) {
        throw new Error("Input data must be an array.")
      }

      return data.map((item) => {
        if (item.children && item.children.length === 0) {
          const { children, ...rest } = item
          return rest
        } else if (item.children && item.children.length > 0) {
          const children = this.removeEmptyChildren(item.children)
          return { ...item, children }
        } else {
          return item
        }
      })
    },
    storeChange(val) {
      console.log("val===》", val)
      const fItem = this.allStore.find((item) => item.storeId == val)
      console.log("fItem", fItem)
      this.omsAfterSaleWorkOrderInfoCmd.storeAccount = fItem.storeAccount || ""
    },
    handleCheck() {
      this.getOrderByCode()
    },
    // 获取订单详情
    async getOrderByCode() {
      if (this.omsAfterSaleWorkOrderInfoCmd.sourceCode == "") {
        this.$refs.giftForm.validateField("sourceCode")
        return
      }
      const { data } = await getOrderByCode({
        sourceCode: this.omsAfterSaleWorkOrderInfoCmd.sourceCode
      })
      this.orderInfoList = data.data
      if (this.orderInfoList.length > 0) {
        this.canModifyShopInfoFlag = true
      }

      //  查出只有一个SO，就默认选上了 不用用户自己再选
      if (this.orderInfoList.length === 1 && this.$route.query.form !== "ORDER_GIFT") {
        this.omsAfterSaleWorkOrderInfoCmd.orderCode = this.orderInfoList[0].orderCode
        this.orderChange(this.orderInfoList[0].orderCode)
      }
      // 从订单管理列表来的
      if (this.$route.query.form == "ORDER_GIFT") {
        if (this.orderInfoList.length > 0) {
          this.omsAfterSaleWorkOrderInfoCmd.orderCode = this.orderInfoList[0].orderCode
          this.omsAfterSaleWorkOrderInfoCmd.totalAmountHasTaxCurrency = this.orderInfoList[0].totalAmountHasTaxCurrency
          this.manualCrateOrderCmd.totalAmountHasTaxCurrency = this.orderInfoList[0].totalAmountHasTaxCurrency
        }
      }
    },
    addSku() {
      if (this.manualCrateOrderCmd.shop) {
        this.addSkuStatus = true
        this.getList()
      } else {
        this.$message.warning("请先选择店铺之后再添加商品！")
      }
    },
    searchChange() {
      this.getList()
    },
    searchReset() {
      this.addOrderSearchForm = { sku: "", linkSku: "" }
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    },
    async orderChange(val) {
      console.log("val", val)
      this.checkedOrderItem = this.orderInfoList.find((item) => {
        return item.orderCode == val
      })
      console.log("this.checkedOrderItem", this.checkedOrderItem)
      if (this.checkedOrderItem) {
        this.omsAfterSaleWorkOrderInfoCmd.store = this.checkedOrderItem.store
        this.omsAfterSaleWorkOrderInfoCmd.storeAccount = this.checkedOrderItem.storeAccount
        this.omsAfterSaleWorkOrderInfoCmd.cmdDetail = this.checkedOrderItem.soOrderDetailInfoVoDetails
        this.omsAfterSaleWorkOrderInfoCmd.orderBusinessType = this.checkedOrderItem.orderBusinessType
        this.omsAfterSaleWorkOrderInfoCmd.platformOrderCode = this.checkedOrderItem.platformOrderCode
        this.omsAfterSaleWorkOrderInfoCmd.orderId = this.checkedOrderItem.orderId
        this.omsAfterSaleWorkOrderInfoCmd.sourceCode = this.checkedOrderItem.sourceCode
        // 设置币种
        this.currency = this.checkedOrderItem.totalAmountHasTaxCurrency

        //  选中订单获取订单的销售数据
        this.getSalesDetailById(this.checkedOrderItem.orderId)
      } else {
        this.omsAfterSaleWorkOrderInfoCmd.store = ""
        this.omsAfterSaleWorkOrderInfoCmd.storeAccount = ""
        this.omsAfterSaleWorkOrderInfoCmd.cmdDetail = []
        this.omsAfterSaleWorkOrderInfoCmd.orderBusinessType = ""
        this.omsAfterSaleWorkOrderInfoCmd.platformOrderCode = ""
        this.omsAfterSaleWorkOrderInfoCmd.orderId = ""
        // 设置币种
        this.currency = ""
        this.canModifyShopInfoFlag = false
      }
    },
    addSave() {
      console.log("添加商品")

      const selectRows = deepClone(this.selectRows)
      const mergedArr = this.skuShowData.concat(selectRows).filter((item, index, self) => {
        return index === self.findIndex((obj) => obj.skuCode === item.skuCode)
      })
      const skuId = mergedArr.map((item) => item.skuId)
      const sellerSkuCode = mergedArr.map((item) => item.sellerSku).join(",")
      const params = {
        storeId: this.manualCrateOrderCmd.shop,
        skuId: skuId,
        sellerSkuCode
      }
      getSellerSku(params).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          for (let j = 0; j < mergedArr.length; j++) {
            if (res.data[i].skuId === mergedArr[j].skuId) {
              mergedArr[j].asin = res.data[i].sellerSku
            }
          }
        }
        mergedArr.forEach((item) => {
          if (this.currency) {
            item.unitPriceCurrency = this.currency
            item.taxAmountHasTaxCurrency = this.currency
            item.unitPriceHasTaxCurrency = this.currency
          } else {
            item.unitPriceCurrency = mergedArr[0].unitPriceCurrency
            item.taxAmountHasTaxCurrency = mergedArr[0].taxAmountHasTaxCurrency
            item.unitPriceHasTaxCurrency = mergedArr[0].unitPriceHasTaxCurrency
          }
          item.sku = item.skuCode
          // 赠品工单 金额默认为0
          item.unitPrice = 0
          item.taxAmountHasTax = 0
          item.unitPriceHasTax = 0
          this.manualCrateOrderCmd.amount = 0
          this.manualCrateOrderCmd.amountHasTax = 0
        })
        // 设置币种
        this.manualCrateOrderCmd.buyerFreightCurrency = this.currency
        this.manualCrateOrderCmd.amountCurrency = this.currency
        this.manualCrateOrderCmd.amountHasTaxCurrency = this.currency

        console.log(12121212, mergedArr)
        this.skuShowData = mergedArr
        this.addSkuStatus = false
        this.$refs.addSkuCrud.selectClear()
        this.$message({
          message: "添加商品成功",
          type: "success"
        })
      })
    },
    getList(val) {
      // let params = {}
      // if (val) {
      //   params = {
      //     current: val.currentPage,
      //     size: val.pageSize
      //   }
      // }
      // getProductList(
      //   Object.assign(
      //     {
      //       current: this.page.currentPage,
      //       size: this.page.pageSize
      //     },
      //     params,
      //     this.addOrderSearchForm
      //   )
      // ).then((res) => {
      //   res.data.data.records.forEach((item) => {
      //     item.imageUrl = item.imageUrl ? getTokenUrl([item.imageUrl]) : ""
      //   })
      //   this.addSkuData = res.data.data.records
      //   this.page.total = res.data.data.total
      // })

      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        storeId: this.manualCrateOrderCmd.shop,
        ...this.addOrderSearchForm
      }
      getEnableSkuRelateManagerInfoApi(params).then((res) => {
        res.data.data.records.forEach((item) => {
          item.imageUrl = item.imageUrl ? getTokenUrl([item.imageUrl]) : ""
        })
        this.addSkuData = res.data.data.records
        this.page.total = res.data.data.total
      })
    },
    getBuyerFreight(val) {
      const fItem = this.allStore.find((item) => item.storeId == val)
      this.manualCrateOrderCmd.shopName = fItem.storeAccount || ""
      // this.store.forEach((item) => {
      //   if (item.storeId === val) {
      //     this.manualCrateOrderCmd.buyerFreightCurrency = this.currency;
      //     this.manualCrateOrderCmd.amountCurrency = this.currency;
      //     this.manualCrateOrderCmd.amountHasTaxCurrency = this.currency;
      //     // 获取币种在获取工单信息的时候获取
      //     // this.currency = item.currency;
      //   }
      //   console.log(this.store,this.currency);
      // });
      // 先注释
      // if (this.skuShowData.length) {
      //   this.$message.warning('店铺信息改变，产品信息需要重新选择！');
      //   this.skuShowData = [];
      //   this.manualCrateOrderCmd.products = [];
      // }
    },
    calcAmount() {
      const status = this.skuShowData.every((item) => {
        return item.unitPrice && item.quantity
      })
      if (!status) {
        this.$message.warning("产品信息中单价(不含税)、购买数量不能为空")
        return
      }

      const allUnitPrice = []
      let maxLength = 0
      const lastUnitPrice = []

      this.skuShowData.forEach((item) => {
        let arr = String(item.unitPrice).split(".")
        if (arr.length === 2) {
          let amountLength = Math.pow(10, arr[1].length)
          let newUnitPrice = Number(String(item.unitPrice).replace(".", "")) * item.quantity
          allUnitPrice.push(newUnitPrice / amountLength)
        } else {
          allUnitPrice.push(Number(item.unitPrice) * item.quantity)
        }
      })
      allUnitPrice.forEach((item) => {
        let arr = String(item).split(".")
        if (arr.length === 2) {
          maxLength = arr[1].length > maxLength ? arr[1].length : maxLength
        }
      })
      allUnitPrice.forEach((item) => {
        let arr = String(item).split(".")
        if (arr.length === 2) {
          let newUnitPrice =
            arr[1].length < maxLength
              ? Number(String(item).replace(".", "")) * Math.pow(10, maxLength - arr[1].length)
              : Number(String(item).replace(".", ""))
          lastUnitPrice.push(newUnitPrice)
        } else {
          lastUnitPrice.push(item * Math.pow(10, maxLength))
        }
      })
      this.manualCrateOrderCmd.amount =
        lastUnitPrice.reduce((prev, cuv) => {
          return prev + cuv
        }, 0) / Math.pow(10, maxLength)
    },
    validateNumberArr(index, val, key) {
      if (!val) return
      const newVal = parseFloat(val.replace(/[^\d|\.]/g, "").replace(/^[0]+/g, "0"))
      if (newVal || newVal === 0) {
        this.$set(this.skuShowData[index], key, newVal)
      } else {
        this.$set(this.skuShowData[index], key, null)
      }
    },
    validateNumber(val, key) {
      if (!val) return
      const newVal = parseFloat(val.replace(/[^\d|\.]/g, "").replace(/^[0]+/g, "0"))
      if (newVal || newVal === 0) {
        this.orderForm[key] = newVal
      } else {
        this.orderForm[key] = null
      }
    },
    deletePrd(row) {
      this.skuShowData.splice(row.$index, 1)
    },
    // 需要区分赠品和重发工单
    async createOrder() {
      console.log("创建订单")
      let flag = true
      this.$refs.giftForm.validate((val) => {
        if (!val) {
          flag = val
        }
      })

      this.$refs.workOrderForm.validate((val) => {
        if (!val) {
          flag = val
        }
      })

      const postData = JSON.parse(
        JSON.stringify({
          omsAfterSaleWorkOrderInfoCmd: this.omsAfterSaleWorkOrderInfoCmd,
          manualCrateOrderCmd: {
            ...this.manualCrateOrderCmd,
            accessMode: "AFTER_SALE"
          }
        })
      )
      postData.omsAfterSaleWorkOrderInfoCmd.reason =
        postData.omsAfterSaleWorkOrderInfoCmd.reason[postData.omsAfterSaleWorkOrderInfoCmd.reason.length - 1]

      if (postData.manualCrateOrderCmd.buyerFreight == "") {
        delete postData.manualCrateOrderCmd.buyerFreight
        delete postData.manualCrateOrderCmd.buyerFreightCurrency
      }

      postData.manualCrateOrderCmd.products = this.skuShowData
      // 赠品工单
      postData.omsAfterSaleWorkOrderInfoCmd.cmdDetail = this.skuShowData.map((item) => {
        return {
          returnQuantity: item.quantity,
          refundAmount: 0,
          soOrderDetailId: 0,
          sku: item.sku,
          skuName: item.skuName,
          brand: "",
          brandName: item.brandName,
          category: "",
          categoryName: item.brandName,
          soOrderDetailQuantity: 0,
          actualDeliveryNum: 0,
          unitPriceHasTax: 0,
          amountHasTax: 0,
          applyReturnQuantity: 0,
          applyRefundAmount: 0,
          currencyHasTax: this.currency
        }
      })

      // 赠品工单sourceCode 是手动输入的
      postData.manualCrateOrderCmd.sourceCode = postData.omsAfterSaleWorkOrderInfoCmd.sourceCode

      if (this.type === "RESEND") {
        // 固定是这个售后工单号
        postData.omsAfterSaleWorkOrderInfoCmd.sourceCode = postData.omsAfterSaleWorkOrderInfoCmd.workOrderCode
        postData.manualCrateOrderCmd.sourceCode = postData.omsAfterSaleWorkOrderInfoCmd.workOrderCode
      }

      if (typeof postData.manualCrateOrderCmd.market === "number") {
        const fItem = this.sit.find((item) => item.bsePlatformSitId === postData.manualCrateOrderCmd.market)
        postData.manualCrateOrderCmd.market = fItem.sitEnName
      }

      if (!flag) return

      if (postData.omsAfterSaleWorkOrderInfoCmd.store !== postData.manualCrateOrderCmd.shop) {
        this.$message({
          showClose: true,
          message: "原订单信息店铺和基本信息店铺不一致",
          type: "warning"
        })

        return
      }
      // console.log("postData", postData)
      // return

      if (this.type === "RESEND") {
        console.log("postData.manualCrateOrderCmd", postData.manualCrateOrderCmd)
        const { data } = await manualCreate(postData.manualCrateOrderCmd)
        if (data.code === 0) {
          this.$message.success("创建工单成功")
          this.$router.push({
            path: "/order/afterOrderManageList"
          })
        } else {
          this.$messages({
            type: "error",
            message: data.msg
          })
        }
      } else {
        const { data } = await addWorkOrderByGifts(postData)
        if (data.code === 0) {
          this.$message.success("创建工单成功")
          this.$router.push({
            path: "/order/afterOrderManageList"
          })
        } else {
          this.$messages({
            type: "error",
            message: data.msg
          })
        }
      }
    },
    addCancel() {
      this.addSkuStatus = false
    },
    handleClose() {
      this.$router.$avueRouter.closeTag()
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss">
.flex4 {
  display: flex;
  flex-wrap: wrap;
  .f4-item {
    width: 25%;
  }
}
.flex5 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.footer-bottom {
  height: 100px;
  width: 100%;
  position: fixed;
  bottom: 0px;
  display: flex;
  justify-content: center;
}
.el-select--append {
  .el-input__inner {
    width: 80px;
  }

  .el-input__suffix {
    left: 45px;
  }
}
.big-img {
  height: 50px;
  width: 50px;
  object-fit: cover;
}
.el-input--append {
  margin-top: 6px;

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
}
</style>
