<template>
  <div id="addOrderManage">
    <basic-container>
      <el-form label-width="80px" ref="orderForm" :model="orderForm" :rules="addOrderRule">
        <!-- 基本信息 -->
        <detail-wrapper :options="{ title: '基本信息' }">
          <el-row>
            <el-col :span="6">
              <el-form-item label="平台" prop="platform">
                <el-select v-model="orderForm.platform" size="small" placeholder="请选择" @change="getSit" clearable>
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
                  v-model="orderForm.market"
                  :disabled="!orderForm.platform"
                  size="small"
                  @change="getStore"
                  placeholder="请选择"
                  clearable
                >
                  <el-option v-for="item in sit" :key="item.sitEnName" :label="item.sitEnName" :value="item.sitEnName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="店铺" prop="shop">
                <el-select
                  v-model="orderForm.shop"
                  :disabled="!orderForm.market"
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
                <el-select v-model="orderForm.orderBusinessType" size="small" placeholder="请选择" clearable>
                  <el-option v-for="item in businessType" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="订单类型" prop="orderType">
                <el-select v-model="orderForm.orderType" size="small" placeholder="请选择" clearable>
                  <el-option v-for="item in orderType" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="下单时间" prop="orderTime">
                <el-date-picker
                  v-model="orderForm.orderTime"
                  type="datetime"
                  size="small"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
                  placeholder="选择日期时间"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="平台单号" prop="sourceCode">
                <el-input
                  class="el-input--small"
                  v-model="orderForm.sourceCode"
                  placeholder="请输入"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="付款方式" prop="paymentMethod">
                <el-select v-model="orderForm.paymentMethod" size="small" placeholder="请选择" clearable>
                  <el-option v-for="item in paymentMethod" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="发货方式" prop="deliveryMethod">
                <el-select v-model="orderForm.deliveryMethod" size="small" placeholder="发货方式" clearable>
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
                :prop="orderForm.buyerFreight ? 'buyerFreightCurrency' : ''"
              >
                <el-input
                  class="el-input--append"
                  v-model="orderForm.buyerFreight"
                  placeholder="请输入"
                  @change="validateNumber($event, 'buyerFreight')"
                  size="small"
                >
                  <el-select
                    v-model="orderForm.buyerFreightCurrency"
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
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" style="padding: 5px">
                <el-input
                  class="el-input--small"
                  type="textarea"
                  :rows="3"
                  v-model="orderForm.remark"
                  placeholder="请输入"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </detail-wrapper>
        <!--收货地址模块-->
        <detail-wrapper :options="{ title: '收货地址' }">
          <el-row>
            <el-col :span="6">
              <el-form-item label="收件人" prop="receiveName">
                <el-input
                  class="el-input--small"
                  v-model="orderForm.receiveName"
                  placeholder="请输入"
                  size="small"
                  maxlength="35"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电话" label-width="90px" prop="receivePhone">
                <el-input
                  class="el-input--small"
                  v-model="orderForm.receivePhone"
                  placeholder="请输入"
                  size="small"
                  maxlength="20"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="邮箱" label-width="90px">
                <el-input
                  class="el-input--small"
                  v-model="orderForm.receiveEmail"
                  placeholder="请输入"
                  maxlength="35"
                  size="small"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="国家" label-width="90px" prop="country">
                <el-select v-model="orderForm.country" size="small" placeholder="请选择" clearable>
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
                  v-model="orderForm.province"
                  placeholder="请输入"
                  maxlength="32"
                  size="small"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="市" label-width="90px" prop="city">
                <el-input
                  class="el-input--small"
                  v-model="orderForm.city"
                  placeholder="请输入"
                  maxlength="32"
                  size="small"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="区">
                <el-input class="el-input--small" v-model="orderForm.area" placeholder="请输入" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="地址1"
                prop="address"
                v-if="orderForm.country === 'IDN'"
                :rules="addOrderRule.addressIDN"
              >
                <el-input
                  class="el-input--small"
                  v-model="orderForm.address"
                  placeholder="请输入"
                  size="small"
                  maxlength="150"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item v-else label="地址1" prop="address">
                <el-input
                  class="el-input--small"
                  v-model="orderForm.address"
                  placeholder="请输入"
                  size="small"
                  maxlength="35"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="地址2" prop="altAddress" v-if="orderForm.country === 'IDN'">
                <el-input
                  class="el-input--small"
                  v-model="orderForm.altAddress"
                  placeholder="请输入"
                  size="small"
                  maxlength="150"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item v-else label="地址2" prop="altAddress">
                <el-input
                  class="el-input--small"
                  v-model="orderForm.altAddress"
                  placeholder="请输入"
                  size="small"
                  maxlength="35"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="邮编"
                label-width="90px"
                :prop="
                  orderForm.orderBusinessType === 'DI' || orderForm.orderBusinessType === 'PO'
                    ? ''
                    : 'receivePostalCode'
                "
              >
                <el-input
                  class="el-input--small"
                  v-model="orderForm.receivePostalCode"
                  placeholder="请输入"
                  maxlength="10"
                  size="small"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </detail-wrapper>
        <!-- 产品信息 -->
        <detail-wrapper :options="{ title: '产品信息' }">
          <div class="product-message" style="padding: 10px 10px 0">
            <el-button size="small" type="primary" style="margin-bottom: 10px" @click="addSku">添加商品</el-button>
            <el-button
              size="small"
              type="primary"
              style="margin-bottom: 10px"
              :disabled="!skuShowData.length"
              @click="calcAmount"
              >汇总订单总金额</el-button
            >
            <avue-crud ref="skuShowCrud" :data="skuShowData" :option="skuShowOption">
              <template slot="imageUrl" slot-scope="scope">
                <img class="big-img" v-if="scope.row.imageUrl" :src="scope.row.imageUrl" :alt="加载失败" />
                <span v-else></span>
              </template>
              <template slot="asin" slot-scope="scope">
                <el-input v-model="scope.row.asin" disabled="true" size="small"></el-input>
              </template>
              <template slot="unitPrice" slot-scope="scope">
                <el-input
                  class="el-input--append"
                  v-model="scope.row.unitPrice"
                  placeholder="请输入"
                  @change="validateNumberArr(scope.row.$index, scope.row.unitPrice, 'unitPrice')"
                  size="small"
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
                  size="small"
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
                  size="small"
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
                  :min="1"
                  :precision="0"
                  v-model="scope.row.quantity"
                  placeholder="请输入"
                  size="small"
                ></el-input-number>
              </template>
              <template slot="opeBtn" slot-scope="scope">
                <el-button type="text" @click="deltePrd(scope.row)">删除</el-button>
              </template>
            </avue-crud>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="订单总金额(不含税)"
                  label-width="145px"
                  :prop="orderForm.amount ? 'amountCurrency' : 'amount'"
                  class="el-form--append"
                >
                  <el-input
                    class="el-input--append"
                    @change="validateNumber($event, 'amount')"
                    v-model="orderForm.amount"
                    placeholder="请输入"
                    size="small"
                  >
                    <el-select
                      v-model="orderForm.amountCurrency"
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
                <el-form-item
                  label="订单总金额(含税)"
                  label-width="130px"
                  class="el-form--append"
                  :prop="orderForm.amountHasTax ? 'amountHasTaxCurrency' : 'amountHasTax'"
                >
                  <el-input
                    class="el-input--append"
                    @change="validateNumber($event, 'amountHasTax')"
                    v-model="orderForm.amountHasTax"
                    placeholder="请输入"
                    size="small"
                  >
                    <el-select
                      v-model="orderForm.amountHasTaxCurrency"
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
        <!-- 标签 -->
        <detail-wrapper :options="{ title: '标签' }">
          <div style="padding: 10px">
            <el-button size="small" type="primary" @click="addLabel">添加标签</el-button>
            <div style="margin-top: 10px">
              <el-tag style="margin: 0 10px 10px 0" v-for="tag in tags" :key="tag.name" :type="tag.labelColor">
                {{ tag.name }}
              </el-tag>
            </div>
          </div>
        </detail-wrapper>
      </el-form>
    </basic-container>
    <div class="addOrderManage__opeBtn">
      <el-button @click="cancel" size="small" style="padding: 10px 30px; margin-left: -220px">取消</el-button>
      <el-button @click="save" type="primary" size="small" style="padding: 10px 30px">新增</el-button>
    </div>

    <!-- 添加商品弹窗 -->
    <el-dialog title="添加商品" :visible.sync="addSkuStatus" width="80%">
      <avue-crud
        ref="addSkuCrud"
        :page="page"
        :data="addSkuData"
        :option="addSkuOption"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
      >
        <template slot="search">
          <el-form>
            <el-form-item size="small">
              <el-input v-model.trim="addOrderSearchForm.sku" placeholder="工厂SKU，支持多个" v-search-input></el-input>
            </el-form-item>
            <el-form-item size="small">
              <el-input
                v-model.trim="addOrderSearchForm.linkSku"
                placeholder="平台SKU，支持多个"
                v-search-input
              ></el-input>
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
        <el-button size="small" style="padding: 9px 30px" type="primary" :disabled="!selectRows.length" @click="addSave"
          >确认</el-button
        >
      </div>
    </el-dialog>

    <!-- 标签弹窗 -->
    <el-dialog
      title="设置标签"
      :visible.sync="labelStatus"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div style="display: flex; padding: 10px 15px">
        <p style="flex-shrink: 0">已选标签：</p>
        <div style="display: flex; flex-wrap: wrap">
          <el-tag
            style="margin: 0 10px 10px 0"
            size="small"
            v-for="(tag, index) in tagsContent"
            :key="tag.name"
            closable
            @close="handleClose(tag, index)"
            :type="tag.labelColor"
          >
            {{ tag.name }}
          </el-tag>
        </div>
      </div>
      <div style="padding: 10px 15px">
        <el-checkbox v-model="checkAll" style="margin-bottom: 10px" @change="handleCheckAllChange">全选</el-checkbox>
        <router-link :to="{ path: '/order/labelManageList' }">维护标签</router-link>
        <el-checkbox-group style="display: flex; flex-wrap: wrap" v-model="checkedLabel" @change="handleCheckedLabel">
          <el-checkbox style="margin-bottom: 5px" v-for="item in labels" :label="item.id" :key="item.id">{{
            item.name
          }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div style="text-align: center; margin-top: 20px">
        <el-button size="small" style="padding: 9px 30px" @click="labelStatus = false">取消</el-button>
        <el-button size="small" style="padding: 9px 30px" type="primary" @click="labelConfirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import {
  getPlayTypeAll,
  getSit,
  getStore,
  getObjByType,
  getCountry,
  getCarriersByWarehouseld,
  getAsin,
  getStoreBySitIds,
  getSellerSku,
  manualCreate,
  getEnableSkuRelateManagerInfoApi
} from "@/api/order/orderManage"
import { fetchList as getCurrency } from "@/api/baseSetup/bsecurrency"
import { getAllWarehouse } from "@/api/order/orderRule"
import { getListPage as getLabelList } from "@/api/order/labelManage"
import { fetchList } from "@/api/product/prdarchives_detail"
import { fetchList as getCombPrd } from "@/api/product/prdcombproduct"
import { fetchList as getLogistics } from "@/api/baseSetup/bsetransportcarrier/bsetransportcarrier"
import { addSkuOption, skuShowOption, addOrderRule, addCombSkuOption } from "@/const/crud/order/orderManage/orderManage"
import { getTokenUrl } from "@/util/auth"
import { deepClone } from "@/components/avue/utils/util"
import { setStore } from "@/util/store"

export default {
  name: "prdlcreate",
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
      addOrderSearchForm: {
        sku: "",
        linkSku: ""
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      addOrderRule: addOrderRule,
      addSkuStatus: false,
      addSkuOption: addSkuOption,
      addCombSkuOption: addCombSkuOption,
      addSkuData: [],
      selectRow: [],
      searchForm: {},
      labelStatus: false,
      tags: [],
      tagsContent: [],
      checkAll: false,
      checkedLabel: [],
      labels: [],
      skuShowOption: skuShowOption,
      platform: [],
      sit: [],
      store: [],
      country: [],
      warehouse: [],
      logistics: [],
      logisticsChannel: [],
      businessType: [],
      orderType: [],
      selectRows: [],
      skuShowData: [
        // { unitPrice: 1.1129, quantity: 5 },
        // { unitPrice: 10.12, quantity: 9 },
        // { unitPrice: 8, quantity: 15 },
      ],
      pickerOptions: {
        disabledDate(date) {
          return date.getTime() > new Date().getTime()
        }
      },
      paymentMethod: [],
      asinOptions: [],
      currencyArr: [],
      currency: ""
    }
  },
  created() {
    this.init()
    this.getCurrency()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getSit() {
      this.orderForm.market = ""
      this.orderForm.shop = ""
      if (!this.orderForm.platform) return
      getSit([this.orderForm.platform]).then((res) => {
        if (res.status === 200) {
          this.sit = res.data
          if (this.skuShowData.length) {
            this.$message.warning("平台信息改变，产品信息需要重新选择！")
            this.skuShowData = []
            this.orderForm.products = []
          }
        }
      })
    },
    getStore() {
      this.orderForm.shop = ""
      let bsePlatformSitId = ""
      this.sit.forEach((item) => {
        if (item.sitEnName === this.orderForm.market) {
          bsePlatformSitId = item.bsePlatformSitId
        }
      })
      getStoreBySitIds([bsePlatformSitId]).then((res) => {
        if (res.data.code === 0) {
          this.store = res.data.data.filter((item) => item.state === "0")
          if (this.skuShowData.length) {
            this.$message.warning("站点信息改变，产品信息需要重新选择！")
            this.skuShowData = []
            this.orderForm.products = []
          }
        }
      })
    },
    getBuyerFreight(val) {
      this.store.forEach((item) => {
        if (item.storeId === val) {
          this.orderForm.buyerFreightCurrency = item.currency
          this.orderForm.amountCurrency = item.currency
          this.orderForm.amountHasTaxCurrency = item.currency
          this.currency = item.currency
        }
      })
      if (this.skuShowData.length) {
        this.$message.warning("店铺信息改变，产品信息需要重新选择！")
        this.skuShowData = []
        this.orderForm.products = []
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
    validateNumberArr(index, val, key) {
      if (!val) return
      const newVal = parseFloat(val.replace(/[^\d|\.]/g, "").replace(/^[0]+/g, "0"))
      if (newVal || newVal === 0) {
        this.$set(this.skuShowData[index], key, newVal)
      } else {
        this.$set(this.skuShowData[index], key, null)
      }
    },
    changeCurrency(val, key) {
      this.skuShowData.forEach((item) => {
        this.$set(item, key, val)
      })
      if (key === "unitPriceCurrency") {
        this.orderForm.amountCurrency = val
      } else if (key === "unitPriceHasTaxCurrency") {
        this.orderForm.amountHasTaxCurrency = val
      }
    },
    calcAmount() {
      const status = this.skuShowData.every((item) => {
        return (
          item.unitPrice &&
          item.quantity &&
          item.taxAmountHasTax !== null &&
          item.taxAmountHasTax !== undefined &&
          item.unitPriceHasTax !== null &&
          item.unitPriceHasTax !== undefined
          // item.unitPriceHasTax
        )
      })
      if (!status) {
        this.$message.warning("产品信息中单价(不含税)、单价（含税）、购买数量不能为空")
        return
      }

      const allUnitPrice = []
      const allAmountHasTax = []
      let maxLength = 0
      let maxLengthHasTax = 0
      const lastUnitPrice = []
      const lastAmountHasTax = []

      // 处理不含税单价
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

      // 处理含税单价
      this.skuShowData.forEach((item) => {
        let arrHasTax = String(item.unitPriceHasTax).split(".")
        if (arrHasTax.length === 2) {
          let amountLengthHasTax = Math.pow(10, arrHasTax[1].length)
          let newAmountHasTax = Number(String(item.unitPriceHasTax).replace(".", "")) * item.quantity
          allAmountHasTax.push(newAmountHasTax / amountLengthHasTax)
        } else {
          allAmountHasTax.push(Number(item.unitPriceHasTax) * item.quantity)
        }
      })

      allAmountHasTax.forEach((item) => {
        let arr = String(item).split(".")
        if (arr.length === 2) {
          maxLengthHasTax = arr[1].length > maxLengthHasTax ? arr[1].length : maxLengthHasTax
        }
      })

      allAmountHasTax.forEach((item) => {
        let arr = String(item).split(".")
        if (arr.length === 2) {
          let newAmountHasTax =
            arr[1].length < maxLengthHasTax
              ? Number(String(item).replace(".", "")) * Math.pow(10, maxLengthHasTax - arr[1].length)
              : Number(String(item).replace(".", ""))
          lastAmountHasTax.push(newAmountHasTax)
        } else {
          lastAmountHasTax.push(item * Math.pow(10, maxLengthHasTax))
        }
      })

      // 计算总金额
      // this.orderForm.amount =
      //   lastUnitPrice.reduce((prev, cuv) => {
      //     return prev + cuv
      //   }, 0) / Math.pow(10, maxLength)
      this.$set(
        this.orderForm,
        "amount",
        lastUnitPrice.reduce((prev, cuv) => {
          return prev + cuv
        }, 0) / Math.pow(10, maxLength)
      )

      // 计算含税总金额
      // this.orderForm.amountHasTax =
      //   lastAmountHasTax.reduce((prev, cuv) => {
      //     return prev + cuv
      //   }, 0) / Math.pow(10, maxLengthHasTax)
      this.$set(
        this.orderForm,
        "amountHasTax",
        lastAmountHasTax.reduce((prev, cuv) => {
          return prev + cuv
        }, 0) / Math.pow(10, maxLengthHasTax)
      )
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
    remoteMethod(query) {
      if (!query) return
      const params = {
        current: -1,
        size: -1,
        skuCode: query
      }
      getAsin(params).then((res) => {
        if (res.data.code === 0) {
          this.asinOptions = res.data.data.records
        }
      })
    },
    getLogistics(warehouseId) {
      this.logistics = []
      this.logisticsChannel = []
      getCarriersByWarehouseld({ warehouseId }).then((res) => {
        if (res.data.code === 0) {
          this.logistics = res.data.data
        }
      })
    },
    labelConfirm() {
      this.tags = deepClone(this.tagsContent)
      this.labelStatus = false
    },
    handleClose(tag, tagIndex) {
      const index = this.checkedLabel.findIndex((item) => item === tag.id)
      this.checkedLabel.splice(index, 1)
      this.tagsContent.splice(tagIndex, 1)
      this.checkAll = this.tagsContent.length === this.labels.length
    },
    handleCheckAllChange(val) {
      if (val) {
        this.checkedLabel = this.labels.map((item) => item.id)
        this.tagsContent = deepClone(this.labels)
      } else {
        this.checkedLabel = []
        this.tagsContent = []
      }
    },
    handleCheckedLabel(val) {
      this.tagsContent = []
      val.forEach((valItem) => {
        let needArr = this.labels.filter((item) => valItem === item.id)
        this.tagsContent = [...this.tagsContent, ...needArr]
      })
      let checkedCount = val.length
      this.checkAll = checkedCount === this.labels.length
    },
    addSku() {
      if (!this.orderForm.shop) {
        this.$message.warning("请先选择店铺之后再添加商品！")
        return
      }
      this.addSkuStatus = true
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.getList()
    },
    addLabel() {
      this.labelStatus = true
      this.tagsContent = deepClone(this.tags)
      this.checkedLabel = this.tags.map((item) => item.id)
      this.checkAll = this.tagsContent.length === this.labels.length
    },
    addCancel() {
      this.addSkuStatus = false
      this.$refs.addSkuCrud.selectClear()
    },
    cancel() {
      setStore({ name: "orderListReload", type: "session", content: true })
      this.$router.push({
        path: "/order/orderManageList"
      })
    },
    addSave() {
      const selectRows = deepClone(this.selectRows)
      // 根据 skuId 和 sellerSku 去重
      let allArr = Array.from(
        new Map(this.skuShowData.concat(selectRows).map((item) => [`${item.skuId}-${item.sellerSku}`, item])).values()
      )
      const mergedArr = allArr.filter((item, index, self) => {
        return index === self.findIndex((obj) => obj.skuCode === item.skuCode)
      })

      const skuId = mergedArr.map((item) => item.skuId)
      const sellerSkuCode = allArr.map((item) => item.sellerSku).join(",")
      const params = {
        storeId: this.orderForm.shop,
        skuIds: skuId,
        sellerSkuCode
      }
      getSellerSku(params).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          for (let j = 0; j < allArr.length; j++) {
            if (res.data[i].skuId === allArr[j].skuId && res.data[i].sellerSku === allArr[j].sellerSku) {
              allArr[j].asin = res.data[i].sellerSku
            }
          }
        }
        allArr.forEach((item) => {
          item.skuName = item.productName
          item.taxAmountHasTax = 0
          if (this.currency) {
            item.unitPriceCurrency = this.currency
            item.taxAmountHasTaxCurrency = this.currency
            item.unitPriceHasTaxCurrency = this.currency
          } else {
            item.unitPriceCurrency = allArr[0].unitPriceCurrency
            item.taxAmountHasTaxCurrency = allArr[0].taxAmountHasTaxCurrency
            item.unitPriceHasTaxCurrency = allArr[0].unitPriceHasTaxCurrency
          }
        })
        this.skuShowData = allArr
        this.addSkuStatus = false
        this.$refs.addSkuCrud.selectClear()
        this.$message.success("商品添加成功")
      })
    },
    deltePrd(row) {
      this.skuShowData.splice(row.$index, 1)
    },
    save() {
      this.$refs["orderForm"].validate((valid) => {
        if (valid) {
          if (!this.skuShowData.length) {
            this.$message.warning("产品信息不能为空")
            return
          }

          if (
            (this.orderForm.buyerFreight || this.orderForm.buyerFreight === 0) &&
            !this.orderForm.buyerFreightCurrency
          ) {
            this.$message.warning("请选择运费币种")
            return
          }
          if (this.orderForm.amountHasTax && !this.orderForm.amountHasTaxCurrency) {
            this.$message.warning("请选择订单总金额(含税)币种)")
            return
          }

          for (let i = 0; i < this.skuShowData.length; i++) {
            if (this.skuShowData[i].unitPrice === "") {
              this.$message.warning("请填写产品信息的单价(不含税)")
              return
            }
            if (!this.skuShowData[i].unitPriceCurrency) {
              this.$message.warning("请填写产品信息的单价(不含税)币种")
              return
            }
            if (this.skuShowData[i].taxAmountHasTax == null || this.skuShowData[i].taxAmountHasTax === "") {
              this.$message.warning("请输入税额")
              return
            }
            if (this.skuShowData[i].taxAmountHasTax && !this.skuShowData[i].taxAmountHasTaxCurrency) {
              this.$message.warning("请选择税额币种")
              return
            }
            if (this.skuShowData[i].unitPriceHasTax == null || this.skuShowData[i].unitPriceHasTax === "") {
              this.$message.warning("请输入含税价")
              return
            }
            if (this.skuShowData[i].unitPriceHasTax && !this.skuShowData[i].unitPriceHasTaxCurrency) {
              this.$message.warning("请选择产品信息的单价(含税)币种")
              return
            }
            if (!this.skuShowData[i].quantity) {
              this.$message.warning("请填写产品信息的购买数量")
              return
            }
            if (!this.skuShowData[i].asin) {
              this.$message.warning("平台SKU不能为空，请到销售SKU关系管理页面进行维护！")
              return
            }
          }
          this.orderForm.products = this.skuShowData.map((item) => {
            return {
              sku: item.skuCode,
              unitPrice: item.unitPrice,
              unitPriceCurrency: item.unitPriceCurrency,
              taxAmountHasTax: item.taxAmountHasTax,
              taxAmountHasTaxCurrency: item.taxAmountHasTaxCurrency,
              unitPriceHasTax: item.unitPriceHasTax,
              unitPriceHasTaxCurrency: item.unitPriceHasTaxCurrency,
              quantity: item.quantity,
              asin: item.asin
            }
          })
          this.country.forEach((item) => {
            if (item.countryLongCode === this.orderForm.country) {
              this.orderForm.countryCode = item.countryCode
            }
          })
          this.orderForm.labels = this.tags.map((item) => item.id)
          manualCreate(this.orderForm).then((res) => {
            if (res.data.code === 0) {
              this.$message.success("手工订单创建成功")
              this.cancel()
            }
          })
        }
      })
    },
    init() {
      getPlayTypeAll().then((res) => {
        if (res.data.code == 0) {
          this.platform = res.data.data
        }
      })
      getObjByType("order_type").then((res) => {
        if (res.data.code === 0) {
          this.orderType = res.data.data
        }
      })
      getObjByType("order_business_type").then((res) => {
        if (res.data.code === 0) {
          this.businessType = res.data.data
        }
      })
      getObjByType("payment_method").then((res) => {
        if (res.data.code === 0) {
          this.paymentMethod = res.data.data
        }
      })

      getCountry().then((res) => {
        if (res.data.code === 0) {
          this.country = res.data.data
        }
      })
      getAllWarehouse().then((res) => {
        if (res.data.code === 0) {
          this.warehouse = res.data.data
        }
      })
      getLogistics({ current: -1, size: -1 }).then((res) => {
        if (res.data.code === 0) {
          this.logistics = res.data.data.records
        }
      })
      getLabelList({ current: -1, size: -1 }).then((res) => {
        if (res.data.code === 0) {
          this.labels = res.data.data.records
        }
      })
    },
    getList() {
      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        storeId: this.orderForm.shop,
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
    searchChange() {
      this.page.currentPage = 1
      this.getList()
    },
    searchReset() {
      this.addOrderSearchForm = {}
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    //选中行事件
    selectionChange(selection) {
      this.selectRows = selection
    }
  },
  components: {}
}
</script>

<style lang="scss">
#addOrderManage {
  padding-bottom: 90px;
  .el-input.is-disabled .el-input__inner {
    // background-color: #fff;
    color: #000;
  }

  .el-input--append {
    margin-top: 6px;

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
  }

  .el-input-group__append {
    background: #fff;
  }

  .el-select--append {
    .el-input__inner {
      width: 80px;
    }

    .el-input__suffix {
      left: 45px;
    }
  }

  a {
    text-decoration: none;
  }

  .product-message {
    th:nth-child(8) {
      position: relative;

      &:before {
        content: "*";
        color: red;
        position: absolute;
        left: 4px;
      }
    }

    th:nth-child(5) {
      &:before {
        content: "*";
        color: red;
        position: absolute;
        left: 3px;
      }
    }
    th:nth-child(6) {
      &:before {
        content: "*";
        color: red;
        position: absolute;
        left: 3px;
      }
    }
    th:nth-child(7) {
      &:before {
        content: "*";
        color: red;
        position: absolute;
        left: 3px;
      }
    }
  }

  .big-img {
    height: 50px;
    width: 50px;
    object-fit: cover;
  }

  .el-input-number {
    width: 100%;

    .el-input__inner {
      text-align: left;
    }
  }

  .custom-forms {
    display: flex;
    border-bottom: 1px solid #e7ebef;

    .el-form-item {
      margin-bottom: 0;
    }
  }

  .add-form-item {
    margin-bottom: 0;
    flex: 1;
    padding: 0 8px;
    border-right: 1px solid #e7ebef;
  }

  .addOrderManage__opeBtn {
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
}
</style>
