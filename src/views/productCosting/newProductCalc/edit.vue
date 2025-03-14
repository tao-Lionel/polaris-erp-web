<template>
  <div id="costing-page">
    <basic-container style="height: 100%">
      <div class="costing-layout">
        <!-- 左侧表单区域 -->
        <section class="costing-form">
          <header class="site-header">
            <h3 class="title">
              <el-select v-model="form.site" filterable="" placeholder="请选择" @change="changeSite">
                <el-option v-for="item in siteOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </h3>
            <div class="label-description">
              {{ `使用汇率 (${currency}/USD)` }}
              <span style="margin-left: 5px">{{ trialCalculateData.exchangeRate || form.exchangeRate }}</span>
            </div>
          </header>
          <el-form :model="form" ref="costingForm" :rules="formRule" inline label-width="85px">
            <detail-wrapper :options="{ title: '基本信息' }">
              <el-row>
                <el-col span="12">
                  <el-form-item label="平台" prop="platform" label-width="100px">
                    <el-select
                      v-model="form.platform"
                      size="small"
                      placeholder="请选择平台"
                      clearable
                      filterable
                      @change="changePlatform"
                    >
                      <el-option
                        v-for="item in platformOptions"
                        :key="item.platformTypeCode"
                        :label="item.platformTypeName"
                        :value="item.platformTypeCode"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col span="12">
                  <el-form-item label="销售模式" prop="orderBusinessType">
                    <el-select
                      v-model="form.orderBusinessType"
                      size="small"
                      filterable
                      placeholder="请选择销售模式"
                      clearable
                      :disabled="!form.platform"
                    >
                      <el-option
                        v-for="item in platformModel"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col span="12">
                  <el-form-item label="产品档案" prop="productType" label-width="100px">
                    <el-radio-group v-model="form.productType" @change="productTypeChange">
                      <el-radio label="OLD"> 有</el-radio>
                      <el-radio label="NEW"> 无，新品</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col span="12">
                  <el-form-item label="配送方式" prop="logisticsDeliveryMode" label-width="100px">
                    <el-select v-model="form.logisticsDeliveryMode" size="small" placeholder="配送方式" filterable>
                      <el-option
                        v-for="item in deliveryMethodOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <template v-if="form.productType === 'OLD'">
                <el-row>
                  <el-col span="12">
                    <el-form-item label="标准SKU" prop="standardSkuCode" label-width="100px">
                      <el-select
                        v-model="form.standardSkuCode"
                        filterable
                        remote
                        placement="top"
                        size="small"
                        reserve-keyword
                        placeholder="请输入标准SKU"
                        :remote-method="fetchSuggestions"
                        @change="getSkuByStandardSku"
                      >
                        <el-option v-for="item in skuCodeList" :key="item" :label="item" :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col span="12">
                    <el-form-item label="工厂SKU" prop="skuCode">
                      <el-select
                        v-model="form.skuCode"
                        size="small"
                        placeholder="工厂SKU"
                        filterable
                        :disabled="!form.standardSkuCode"
                        @change="getSupplierBySku"
                      >
                        <el-option
                          v-for="item in factorySkuList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col span="12">
                    <el-form-item label="采购供应商" prop="purchaseSupplierCode" label-width="100px">
                      <el-select
                        v-model="form.purchaseSupplierCode"
                        size="small"
                        placeholder="采购供应商"
                        filterable
                        :disabled="!form.standardSkuCode"
                      >
                        <el-option
                          v-for="item in supplierOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>

              <template v-if="form.productType === 'NEW'">
                <el-row>
                  <el-col span="12">
                    <el-form-item label="SKU名称" prop="skuName" label-width="100px">
                      <el-input placeholder="请输入" size="small" v-model="form.skuName"> </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col span="12">
                    <el-form-item label="品类" prop="categoryName" label-width="100px">
                      <el-cascader
                        placeholder="品类"
                        size="small"
                        expand-trigger="hover"
                        :props="props"
                        v-model="form.categoryId"
                        :show-all-levels="false"
                        :options="treeCategoryData"
                        clearable
                        collapse-tags
                        @change="changeCategoryId"
                      ></el-cascader>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col span="12">
                    <el-form-item label="" prop="packageLWH" label-width="100px">
                      <template slot="label">
                        <div style="display: flex; flex-direction: column">
                          <span class="form-item-label label-description">包装长宽高</span>
                          <span style="font-size: 12px; color: #ccc; line-height: 1">(cm)</span>
                        </div>
                      </template>
                      <div class="lwh-box">
                        <el-input-number
                          v-model="form.packageLength"
                          @change="LWHChange($event, 'packageLength')"
                          :controls="false"
                          :min="0"
                          @input="validateField('packageLWH')"
                          placeholder="长"
                        ></el-input-number>
                        x
                        <el-input-number
                          v-model="form.packageWidth"
                          @change="LWHChange($event, 'packageWidth')"
                          :controls="false"
                          :min="0"
                          placeholder="宽"
                          @input="validateField('packageLWH')"
                        ></el-input-number>
                        x
                        <el-input-number
                          v-model="form.packageHeight"
                          @change="LWHChange($event, 'packageHeight')"
                          :controls="false"
                          :min="0"
                          placeholder="高"
                          @input="validateField('packageLWH')"
                        ></el-input-number>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col span="12">
                    <el-form-item label="" prop="outerBoxLWH" label-width="100px">
                      <template slot="label">
                        <div style="display: flex; flex-direction: column">
                          <span class="form-item-label label-description">外箱长宽高</span>
                          <span style="font-size: 12px; color: #ccc; line-height: 1">(cm)</span>
                        </div>
                      </template>
                      <div class="lwh-box">
                        <el-input-number
                          v-model="form.outerBoxLength"
                          :controls="false"
                          :min="0"
                          placeholder="长"
                          @input="validateField('outerBoxLWH')"
                        ></el-input-number>
                        x
                        <el-input-number
                          v-model="form.outerBoxWidth"
                          :controls="false"
                          :min="0"
                          placeholder="宽"
                          @input="validateField('outerBoxLWH')"
                        ></el-input-number>
                        x
                        <el-input-number
                          v-model="form.outerBoxHeight"
                          :controls="false"
                          :min="0"
                          placeholder="高"
                          @input="validateField('outerBoxLWH')"
                        ></el-input-number>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col span="12">
                    <el-form-item label="包装毛重" prop="packageGrossWeight" label-width="100px">
                      <el-input
                        v-model="form.packageGrossWeight"
                        placeholder="请输入"
                        size="small"
                        @change="packageGrossWeightChange"
                        @input="validateField('packageGrossWeight')"
                      >
                        <template slot="suffix"> kg</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col span="12">
                    <el-form-item label="外箱毛重" prop="boxGrossWeight" label-width="100px">
                      <el-input
                        v-model="form.boxGrossWeight"
                        placeholder="请输入"
                        size="small"
                        @input="validateField('boxGrossWeight')"
                      >
                        <template slot="suffix">kg</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col>
                    <el-form-item label="装箱数量" prop="boxs" label-width="100px">
                      <el-input v-model="form.boxs" placeholder="请输入" size="small" @input="boxsChange"> </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
            </detail-wrapper>

            <detail-wrapper :options="{ title: '计算指标' }">
              <el-row>
                <el-col span="12">
                  <!-- 正算利润时必填 -->
                  <el-form-item label="含税售价" :prop="isDisabled ? 'salePrice' : ''">
                    <el-input
                      v-model="form.salePrice"
                      placeholder="请输入含税售价"
                      size="small"
                      :disabled="!isDisabled"
                      @change="validateNumber($event, 'salePrice')"
                    >
                      <template slot="suffix"> {{ currency }}</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col span="12">
                  <el-form-item label="核价类型" prop="pricingCalculationType" label-width="120px">
                    <el-radio-group v-model="form.pricingCalculationType" @change="handleCalculationTypeChange">
                      <el-radio v-for="item in pricingCalculationTypeOptions" :key="item.value" :label="item.value">
                        {{ item.label }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col span="12">
                  <el-form-item label="供货价" prop="supplyPrice">
                    <el-input
                      v-model="form.supplyPrice"
                      placeholder="请输入供货价"
                      size="small"
                      :disabled="!isDisabled"
                      @change="validateNumber($event, 'supplyPrice')"
                    >
                      <template slot="suffix">{{ currency }} </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col span="12">
                  <el-form-item label="核价逻辑" prop="pricingCalculationMethod" label-width="120px">
                    <el-radio-group v-model="form.pricingCalculationMethod" @change="handleCalculationMethodChange">
                      <el-radio v-for="item in pricingCalculationMethodOptions" :key="item.value" :label="item.value">
                        {{ item.label }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col span="12">
                  <el-form-item label="" prop="promotionExpenses">
                    <template slot="label">
                      <div style="display: flex; flex-direction: column">
                        <span class="form-item-label label-description">推广费比</span>
                        <span style="font-size: 12px; color: #ccc; line-height: 1">(占含税售价)</span>
                      </div>
                    </template>
                    <el-input
                      v-model="form.promotionExpenses"
                      placeholder="请输入推广费比"
                      size="small"
                      @change="validateNumber($event, 'promotionExpenses')"
                    >
                      <template slot="suffix"> % </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col span="12">
                  <el-form-item label="仓储服务" prop="pricingWarehouseServiceMethod" label-width="120px">
                    <el-checkbox-group v-model="form.pricingWarehouseServiceMethod">
                      <el-checkbox
                        v-for="item in pricingWarehouseServiceMethodOptions"
                        :key="item.value"
                        :label="item.value"
                      >
                        {{ item.label }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col span="12">
                  <el-form-item label="税前利润率" prop="profit">
                    <el-input
                      v-model="form.profit"
                      placeholder="请输入税前利润率"
                      size="small"
                      :disabled="isDisabled"
                      @change="validateNumber($event, 'profit')"
                    >
                      <template slot="suffix"> % </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col span="12">
                  <el-form-item label="PPM" prop="ppmInput" label-width="120px">
                    <el-input
                      v-model="form.ppmInput"
                      placeholder="请输入PPM"
                      size="small"
                      :disabled="form.pricingCalculationMethod !== 'PPM'"
                      @change="validateNumber($event, 'ppmInput')"
                    >
                      <template slot="suffix"> % </template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col span="12">
                  <el-form-item label="退款比" prop="refundRatio">
                    <el-input
                      v-model="form.refundRatio"
                      placeholder="请输入"
                      size="small"
                      @change="validateNumber($event, 'refundRatio')"
                    >
                      <template slot="suffix"> % </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col span="12">
                  <el-form-item label="DI Saving Rate" prop="diSavingRateInput" label-width="120px">
                    <el-input
                      v-model="form.diSavingRateInput"
                      placeholder="请输入"
                      size="small"
                      @change="validateNumber($event, 'diSavingRateInput')"
                    >
                      <template slot="suffix"> % </template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col span="12">
                  <el-form-item label="头程费用" prop="headwayCostInput">
                    <el-input v-model="form.headwayCostInput" placeholder="请输入" size="small">
                      <template slot="suffix"> {{ currency }}/柜 </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col span="12">
                  <el-form-item
                    class="el-form--append"
                    label="FOB成本"
                    prop="fobCostInput"
                    label-width="120px"
                    v-if="form.productType == 'NEW'"
                  >
                    <el-input
                      v-model="form.fobCostInput"
                      placeholder="请输入"
                      style="width: 100px !important"
                      size="small"
                      class="el-input--append"
                    >
                      <template slot="append">
                        <el-select
                          class="el-select--append"
                          v-model="form.fobCostInputCurrency"
                          slot="append"
                          placeholder=""
                        >
                          <el-option
                            v-for="item in allCurrency"
                            :key="item.id"
                            :label="item.currency"
                            :value="item.currency"
                          ></el-option>
                        </el-select>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </detail-wrapper>
          </el-form>
        </section>

        <!-- 右侧计算结果 -->
        <calc-result ref="calcResult"></calc-result>
      </div>
    </basic-container>
    <!-- 底部操作栏 -->
    <footer class="page-footer">
      <div class="footer-left">
        <div style="margin-right: 80px">
          <p>执行版本/时间</p>
          <el-select size="small" v-model="form.version" placeholder="请选择">
            <el-option label="正式版" value="PRODUCT"> </el-option>
            <el-option label="测试版" value="TEST"> </el-option>
          </el-select>
          <el-date-picker
            v-model="form.time"
            class="calc-time"
            type="datetime"
            size="small"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </div>
        <div style="display: flex; align-self: center">
          <el-button
            type="warning"
            :loading="loading"
            v-if="permissions.product_pricing_newProductCalc_calc"
            @click="handleCalc"
            >计 算</el-button
          >
        </div>
      </div>
      <div class="footer-right">
        <el-button @click="handleClose">关 闭</el-button>

        <el-button
          type="primary"
          :loading="loading"
          v-if="permissions.product_pricing_newProductCalc_submit"
          @click="handleSubmit"
          >提 交</el-button
        >
      </div>
    </footer>
  </div>
</template>
<script>
import CalcResult from "./components/calcResult.vue"

import { getDictByType } from "@/util/auth"
import { getPlayTypeAll } from "@/api/order/orderManage"
import {
  getProductPricingDemandByIdApi,
  getSaleModeByPlatformApi,
  getSkuByStandardSkuApi,
  getSupplierBySkuApi
} from "@/api/product/pricing"
import { getByLikeSkuCode } from "@/api/product/prdsku"
import { getSpuOrSkuApi } from "@/api/product/pricing"
import { getCountryByParamApi, getCountry } from "@/api/baseSetup/bsecountry"
import { mapGetters } from "vuex"
import { fetchTreeList } from "@/api/product/prdskucategory"
import { trialCalculate, trialSave, getTrialDetail } from "@/api/product/newProductCalc"
import { cloneDeep } from "lodash"
import { getAll as getAllCurrency } from "@/api/baseSetup/bsecurrency.js"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util"

export default {
  name: "costingList",
  data() {
    return {
      form: {
        exchangeRate: undefined,
        platform: "",
        standardSkuCode: undefined,
        skuCode: undefined,
        purchaseSupplierCode: undefined,
        salePrice: undefined,
        pricingCalculationType: "PROFIT_CALCULATION",
        supplyPrice: undefined,
        pricingCalculationMethod: "FREIGHT",
        promotionExpenses: undefined,
        pricingWarehouseServiceMethod: ["WAREHOUSE"],
        profit: undefined,
        orderBusinessType: undefined,
        productType: "OLD",
        ppmInput: undefined,
        site: "US",
        packageGrossWeight: undefined,
        outerBoxHeight: undefined,
        boxs: undefined,
        skuName: "",
        categoryName: "",
        categoryId: "",
        packageLength: undefined,
        packageWidth: undefined,
        packageHeight: undefined,
        packageGrossWeight: undefined,
        outerBoxLength: undefined,
        outerBoxWidth: undefined,
        outerBoxHeight: undefined,
        boxGrossWeight: undefined,
        diSavingRateInput: undefined,
        refundRatio: undefined,
        headwayCostInput: undefined,
        fobCostInput: undefined,
        fobCostInputCurrency: "",
        currency: "",
        version: "PRODUCT",
        time: this.getTodayTime(),
        logisticsDeliveryMode: ""
      },
      formRule: {
        platform: [{ required: true, message: "请选择平台", trigger: "blur" }],
        standardSkuCode: [{ required: true, message: "请输入标准SKU", trigger: "blur" }],
        orderBusinessType: [{ required: true, message: "请选择销售模式", trigger: "blur" }],
        salePrice: [{ required: true, message: "请输入含税售价", trigger: "blur" }],
        // 新品，无档案
        skuName: [{ required: true, message: "请输入SKU名称", trigger: "blur" }],
        fobCostInput: [{ required: true, message: "请输入FOB成本", trigger: "blur" }],
        categoryName: [{ required: true, message: "请选择分类", trigger: "blur" }],
        packageGrossWeight: [
          {
            required: true,
            validator: (rule, value, callback) => {
              // 校验是否为空
              if (!value) {
                return callback(new Error("包装毛重不能为空"))
              }

              // 校验是否为正数，最多6位整数+2位小数
              const regex = /^[1-9]\d{0,5}(\.\d{1,2})?$/
              if (!regex.test(value)) {
                return callback(new Error("包装毛重必须是 >0 的6位整数 + 2位小数"))
              }

              callback() // 校验通过
            },
            trigger: ["blur", "change"]
          }
        ],
        boxGrossWeight: [
          {
            required: true,
            validator: (rule, value, callback) => {
              const { packageGrossWeight, boxs } = this.form // 从表单中获取相关数据

              // 校验是否为空
              if (!value) {
                return callback(new Error("外箱毛重不能为空"))
              }

              // 校验是否为正数，最多6位整数+2位小数
              const regex = /^[1-9]\d{0,5}(\.\d{1,2})?$/
              if (!regex.test(value)) {
                return callback(new Error("外箱毛重必须是 >0 的6位整数 + 2位小数"))
              }

              // 检查是否有有效的包装毛重和装箱数量
              if (!packageGrossWeight || isNaN(packageGrossWeight) || Number(packageGrossWeight) <= 0) {
                return callback(new Error("请先填写有效的包装毛重"))
              }

              if (!boxs || isNaN(boxs) || Number(boxs) <= 0) {
                return callback(new Error("请先填写有效的装箱数量"))
              }

              // 计算包装毛重 * 装箱数量
              const requiredGrossWeight = Number(packageGrossWeight) * Number(boxs)

              // 校验外箱毛重是否符合条件
              if (Number(value) < requiredGrossWeight) {
                return callback(
                  new Error(`外箱毛重必须满足：外箱毛重≥包装毛重 × 装箱数量（≥ ${requiredGrossWeight.toFixed(2)}）`)
                )
              }

              callback() // 校验通过
            },
            trigger: ["blur", "change"]
          }
        ],
        boxs: [
          { required: true, message: "请输入装箱数量", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              const reg = /^[1-9]\d*$/ // 正则匹配大于 0 的整数
              if (!value) {
                callback(new Error("请输入装箱数量"))
              } else if (!reg.test(value)) {
                callback(new Error("装箱数量必须为大于 0 的整数"))
              } else {
                callback() // 验证通过
              }
            },
            trigger: ["blur", "change"]
          }
        ],

        packageLWH: [
          {
            required: true,
            validator: (rule, value, callback) => {
              const { packageLength, packageWidth, packageHeight } = this.form // 假设表单数据绑定在 `this.form`
              if (packageLength && packageWidth && packageHeight) {
                callback() // 校验通过
              } else {
                callback(new Error("包装长、宽、高均不能为空"))
              }
            },
            trigger: ["blur", "change"]
          }
        ],
        outerBoxLWH: [
          {
            required: true,
            validator: (rule, value, callback) => {
              const {
                outerBoxLength,
                outerBoxWidth,
                outerBoxHeight,
                packageLength,
                packageWidth,
                packageHeight,
                boxs
              } = this.form // 假设表单数据绑定在 `this.form`

              // 校验外箱长宽高是否为空
              if (!outerBoxLength || !outerBoxWidth || !outerBoxHeight) {
                return callback(new Error("外箱长、宽、高均不能为空"))
              }

              // 校验装箱数量是否有效
              if (!boxs || isNaN(boxs) || Number(boxs) <= 0) {
                return callback(new Error("装箱数量必须为大于 0 的整数"))
              }

              // 校验外箱尺寸是否符合条件
              const requiredLength = Number(packageLength) * Number(boxs)
              const requiredWidth = Number(packageWidth) * Number(boxs)
              const requiredHeight = Number(packageHeight) * Number(boxs)

              if (
                Number(outerBoxLength) >= requiredLength &&
                Number(outerBoxWidth) >= requiredWidth &&
                Number(outerBoxHeight) >= requiredHeight
              ) {
                callback() // 校验通过
              } else {
                callback(
                  new Error(
                    `外箱长宽高必须满足：\n` + `长≥${requiredLength}，宽≥${requiredWidth}，高≥${requiredHeight}`
                  )
                )
              }
            },
            trigger: ["blur", "change"]
          }
        ]
      },
      pricingCalculationTypeOptions: [],
      pricingCalculationMethodOptions: [],
      pricingWarehouseServiceMethodOptions: [],
      factorySkuList: [],
      skuCodeList: [],
      currency: "",
      treeCategoryData: [],
      siteOptions: [],
      platformModel: [],
      allCurrency: [],
      trialCalculateData: {},
      id: "",
      supplierOptions: [],
      deliveryMethodOptions: [],
      deliveryMethodMappings: [],
      platformModelMappings: []
    }
  },
  components: { CalcResult },

  created() {
    const { id } = this.$route.query
    if (id) return
  },
  async mounted() {
    await this.init()
    const { id } = this.$route.query
    if (id) {
      this.id = id
      this.getTrialDetail(id)
      this.changePlatform("AMAZONVC") // 默认选中vc
      this.getDeliveryMethodOptions()
    }
  },

  watch: {
    "form.platform": {
      handler(newVal) {
        const platforms = this.isEdit ? [this.form.platform] : newVal
        if (!newVal?.length) {
          this.platformModel = []
          this.form.orderBusinessType = ""
          return
        }

        const uniqueModels = new Set()

        // 根据平台过滤销售模式
        this.platformModel = this.platformModelMappings?.filter((item) => {
          const hasMatchingPlatform = item.dictMappings.some((mapping) => platforms.includes(mapping.filtering))
          if (hasMatchingPlatform && !uniqueModels.has(item.value)) {
            uniqueModels.add(item.value)
            return true
          }
          return false
        })

        // 如果销售模式只有一个，则默认选中
        if (this.platformModel.length === 1) {
          this.form.orderBusinessType = this.isEdit ? this.platformModel[0].value : this.platformModel[0].value
        }

        this.getDeliveryMethodOptions()
      },
      deep: true
    },
    "form.orderBusinessType": {
      handler(newVal) {
        if (!newVal?.length) {
          this.deliveryMethodOptions = []
          this.form.logisticsDeliveryMode = ""
          return
        }
        this.getDeliveryMethodOptions()
        // 如果配送方式只有一个，则默认选中
        if (this.deliveryMethodOptions.length === 1) {
          this.form.logisticsDeliveryMode = this.isEdit
            ? this.deliveryMethodOptions[0].value
            : [this.deliveryMethodOptions[0].value]
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(["permissions"]),
    isEdit() {
      return !!this.id
    },
    // 是否禁用
    isDisabled() {
      // 选中正算利润：禁用税前利润率，并清空值
      // 选中反算售价：禁用含税售价和供货价，并清空值
      return this.form.pricingCalculationType === "PROFIT_CALCULATION"
    }
  },

  methods: {
    async getDeliveryMethodOptions() {
      if (!this.form.orderBusinessType) return
      const platformAndModel = [`${this.form.platform}-${this.form.orderBusinessType}`]

      const uniqueDeliveryMethods = new Set()

      // 根据平台+销售模式过滤配送方式
      this.deliveryMethodOptions = this.deliveryMethodMappings?.filter((item) => {
        const hasMatchingPlatform = item.dictMappings.some((mapping) => platformAndModel.includes(mapping.filtering))

        if (hasMatchingPlatform && !uniqueDeliveryMethods.has(item.value)) {
          uniqueDeliveryMethods.add(item.value)
          return true
        }
        return false
      })

      // 如果配送方式只有一个，则默认选中
      if (this.deliveryMethodOptions.length === 1) {
        this.form.logisticsDeliveryMode = this.deliveryMethodOptions[0].value
      }
    },
    validateField(field) {
      this.$refs.costingForm.validateField(field) // 手动校验单个字段
    },
    async init() {
      this.loading = true
      const [
        calculationTypes,
        calculationMethods,
        warehouseServiceMethods,
        deliveryMethodMappings,
        platformModelMappings,
        platformResponse
      ] = await Promise.all([
        getDictByType("pricing_calculation_type"),
        getDictByType("pricing_calculation_method"),
        getDictByType("pricing_warehouse_service_method"),
        getDictByType("logistics_delivery_method"),
        getDictByType("prd_pricing_sale_model"),
        ,
        this.getPlatform()
      ])
      //品类
      await fetchTreeList().then((response) => {
        this.treeCategoryData = response.data.data
      })
      // 设置各选项数据
      this.pricingCalculationTypeOptions = calculationTypes
      this.pricingCalculationMethodOptions = calculationMethods
      this.pricingWarehouseServiceMethodOptions = warehouseServiceMethods?.filter((item) => item.value !== "ALL")
      this.platformModelMappings = platformModelMappings
      this.deliveryMethodMappings = deliveryMethodMappings
      // 获取核价需求和国家参数

      this.getAllCountry()
      this.getCountryByParam()
      this.getCurrency()
      this.loading = false
    },
    getTodayTime() {
      const now = new Date()
      const pad = (n) => (n < 10 ? `0${n}` : n)
      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} 00:00:00`
    },
    async getTrialDetail(val) {
      const { data } = await getTrialDetail(val)
      if (data.code === 0) {
        const defaultPurchaseSupplierCode = this.supplierOptions?.[0]?.value
        const {
          purchaseSupplierCode,
          pricingWarehouseServiceMethod,
          pricingCalculationType,
          pricingCalculationMethod,
          salePrice,
          supplyPrice,
          profit,
          ppmInput,
          promotionExpenses,
          categoryName,
          categoryId,
          currency,
          diSavingRateInput,
          refundRatio,
          skuCode
        } = data.data
        this.currency = currency
        this.form = {
          ...data.data,
          purchaseSupplierCode: purchaseSupplierCode || defaultPurchaseSupplierCode, // 默认选中工厂SKU最新的供应商(默认取第一个)
          salePrice: pricingCalculationType === "SELL_PRICE_CALCULATION" ? null : salePrice, // 选中反算利润：清空含税售价
          pricingCalculationType: pricingCalculationType || "PROFIT_CALCULATION",
          supplyPrice: pricingCalculationType === "SELL_PRICE_CALCULATION" ? null : supplyPrice, // 选中反算利润：清空供货价
          pricingCalculationMethod: pricingCalculationMethod || "FREIGHT",
          promotionExpenses: this.handlePercent(promotionExpenses),
          diSavingRateInput: this.handlePercent(diSavingRateInput),
          refundRatio: this.handlePercent(refundRatio),
          pricingWarehouseServiceMethod:
            pricingWarehouseServiceMethod === "ALL"
              ? ["WAREHOUSE", "PLATFORM"]
              : pricingWarehouseServiceMethod
              ? [pricingWarehouseServiceMethod]
              : ["WAREHOUSE"],
          profit: pricingCalculationType === "PROFIT_CALCULATION" ? null : this.handlePercent(profit), // 选中正算利润：清空税前利润率
          ppmInput: pricingCalculationMethod === "FREIGHT" ? null : this.handlePercent(ppmInput), // 选中运费：清空PPM
          categoryId: this.findPathByValue(this.treeCategoryData, categoryId)
        }

        this.getSaleModeByPlatformList(data.data.platform)
        this.getEchoSupplierOptions(skuCode)
        this.$refs.calcResult.getResultData(data.data)
      }
    },
    // 获取平台
    async getPlatform() {
      const { data } = await getPlayTypeAll()
      this.platformOptions = data.data
    },
    // 用于编辑回显 产品档案为有的时候
    async getEchoSupplierOptions(val) {
      console.log("获取回显信息列表")
      const { data } = await getSupplierBySkuApi({ skuCode: val })
      if (data.code === 0) {
        this.supplierOptions = data.data?.supplierVoList?.map((item) => {
          return {
            value: item.supplierNo,
            label: item.supplierName
          }
        })
      }
    },
    // 根据sku获取采购供应商
    async getSupplierBySku(val) {
      this.form.purchaseSupplierCode = undefined
      if (val) {
        const { data } = await getSupplierBySkuApi({ skuCode: val })
        if (data.code === 0) {
          this.supplierOptions = data.data?.supplierVoList?.map((item) => {
            return {
              value: item.supplierNo,
              label: item.supplierName
            }
          })
          // 默认选中第一个供应商
          this.form.purchaseSupplierCode = this.supplierOptions?.[0]?.value
        }
      }
    }, // 平台改变 获取销售模式
    async changePlatform(val) {
      this.form.orderBusinessType = undefined
      if (val) {
        // const { data } = await getSaleModeByPlatformApi({ platform: [val] })
        // this.platformModel = data.data[0].businessTypeCodeList?.map((item) => {
        //   return {
        //     value: item,
        //     label: item
        //   }
        // })
      }
    },
    async getSaleModeByPlatformList(val) {
      // const { data } = await getSaleModeByPlatformApi({ platform: [val] })
      // this.platformModel = data.data[0].businessTypeCodeList?.map((item) => {
      //   return {
      //     value: item,
      //     label: item
      //   }
      // })
    },
    productTypeChange(val) {
      if (val === "NEW") {
        this.form.standardSkuCode = undefined
        this.form.skuCode = undefined
        this.form.purchaseSupplierCode = undefined
      }
      this.$refs.costingForm.clearValidate()
    },
    changeCategoryId(val) {
      this.form.categoryName = this.getNameById(this.treeCategoryData, val[val.length - 1])
    },
    /**
     * 根据最后一级 ID 获取完整路径的 ID 数组
     * @param tree
     * @param targetId
     */
    findPathByValue(options, targetValue) {
      for (const item of options) {
        // 如果当前节点的值匹配目标值，直接返回包含该节点值的数组
        if (item.id === targetValue) return [item.id]

        // 继续递归查找子节点，但仅限于 children 不为空数组的情况
        if (item.children && item.children.length > 0) {
          const path = this.findPathByValue(item.children, targetValue)
          // 如果路径找到，返回包含当前节点值的完整路径
          if (path.length) return [item.id, ...path]
        }
      }
      // 未找到目标值时返回空数组
      return []
    },
    /**
     * 根据最后一级 ID 获取对应的 name
     * @param tree
     * @param targetId
     */
    getNameById(tree, targetId) {
      let result = null

      const dfs = (node) => {
        if (!node) return

        // 如果找到目标节点
        if (node.id === targetId) {
          result = node.name
          return
        }

        // 遍历子节点
        if (node.children && node.children.length) {
          for (const child of node.children) {
            dfs(child)
          }
        }
      }

      // 遍历整个树
      for (const node of tree) {
        dfs(node)
        if (result) break
      }

      return result
    },
    /**
     * 根据 name 找出对应的 id 数组
     * @param tree 树结构
     * @param targetName 目标名称
     * @returns {Array} 匹配的 id 数组
     */
    getIdsByName(tree, targetName) {
      const result = []

      const dfs = (node) => {
        if (!node) return

        // 如果找到目标节点，记录 id
        if (node.name === targetName) {
          result.push(node.id)
        }

        // 遍历子节点
        if (node.children && node.children.length) {
          for (const child of node.children) {
            dfs(child)
          }
        }
      }

      // 遍历整个树
      for (const node of tree) {
        dfs(node)
      }

      return result
    },
    // 根据标准sku获取工厂sku
    async getSkuByStandardSku(val) {
      this.form.skuCode = undefined
      if (val) {
        const { data } = await getSkuByStandardSkuApi({ standardSkuCode: val })
        if (data.code === 0) {
          this.factorySkuList = data.data.skuCodeList.map((item) => {
            return {
              value: item,
              label: item
            }
          })
        }
      }
    },
    // 模糊搜索,请求数据
    async fetchSuggestions(queryString) {
      let queryParams = {
        skuCode: queryString.trim()
      }
      // const { data } = await getByLikeSkuCode(queryParams)
      const { data } = await getSpuOrSkuApi(queryParams)
      if (data.code === 0) {
        this.skuCodeList = data.data?.skuCodeList || []
      }
    },
    // 获取国家
    async getAllCountry() {
      const { data } = await getCountry()
      this.siteOptions = data.data.map((item) => ({
        label: item.countryCode,
        value: item.countryCode
      }))
    },
    // 获取国家对应币种
    async getCountryByParam() {
      const { data } = await getCountryByParamApi({
        countryCodeList: [this.form.site]
      })
      this.currency = data.data[0].baseCurrency
      this.form.fobCostInputCurrency = data.data[0].baseCurrency
    },
    async getCurrency() {
      const { data } = await getAllCurrency()
      if (data.code === 0) {
        this.allCurrency = data.data
      }
    },
    validateNumber(val, key) {
      if (!val) return
      // 推广费比、税前利润率、PPM只允许输入6位整数+2位小数

      if (
        [
          "promotionRatio",
          "promotionExpenses",
          "profit",
          "ppmInput",
          "headwayCostInput",
          "diSavingRateInput",
          "fobCostInput",
          "refundRatio"
        ].includes(key)
      ) {
        const regex = /^\d{1,6}(\.\d{0,2})?$/
        if (!regex.test(val)) {
          this.$message.warning("请输入最多6位整数，2位小数的数字")
          this.form[key] = null
          return
        }
      } else {
        const newVal = parseFloat(val.replace(/[^\d|\.]/g, "").replace(/^[0]+/g, "0"))
        if (newVal || newVal === 0) {
          this.form[key] = newVal
        } else {
          this.form[key] = null
        }
      }
    },
    changeSite(val) {
      this.getCountryByParam()
    },

    handleCalculationMethodChange(val) {
      if (val === "FREIGHT") {
        this.form.ppmInput = undefined
      }
    },
    LWHChange(value, key) {
      const { boxs } = this.form
      if (!isNaN(boxs) && boxs.trim() !== "") {
        switch (key) {
          case "packageLength":
            this.form.outerBoxLength = value ? Number(value) * boxs : undefined
            break
          case "packageWidth":
            this.form.outerBoxWidth = value ? Number(value) * boxs : undefined
            break
          case "packageHeight":
            this.form.outerBoxHeight = value ? Number(value) * boxs : undefined
            break
        }
      }
    },
    packageGrossWeightChange(val) {
      const { boxs } = this.form

      // 转换为数字并校验输入有效性
      const packageGrossWeight = Number(val)
      const boxCount = Number(boxs)

      if (isNaN(packageGrossWeight) || packageGrossWeight <= 0) {
        console.warn("请输入有效的包装毛重")
        return
      }

      if (isNaN(boxCount) || boxCount <= 0) {
        console.warn("请输入有效的装箱数量")
        return
      }

      this.form.boxGrossWeight = packageGrossWeight * boxCount
    },
    boxsChange(val) {
      // 检查是否是有效数字
      if (!isNaN(val) && val.trim() !== "") {
        const { packageLength, packageWidth, packageHeight, packageGrossWeight } = this.form

        // 确保原始值存在才能进行计算
        if (packageLength) {
          this.form.outerBoxLength = Number(packageLength) * Number(val)
        }
        if (packageWidth) {
          this.form.outerBoxWidth = Number(packageWidth) * Number(val)
        }
        if (packageHeight) {
          this.form.outerBoxHeight = Number(packageHeight) * Number(val)
        }
        if (packageGrossWeight) {
          this.form.boxGrossWeight = Number(val) * Number(packageGrossWeight)
        }
      }
      this.validateField("boxs")
    },
    // 核价类型改变
    handleCalculationTypeChange(val) {
      if (val === "PROFIT_CALCULATION") {
        //   选中正算利润：禁用税前利润率，并清空值
        this.form.profit = undefined
      } else {
        // 选中反算售价：禁用含税售价和供货价，并清空值
        this.form.salePrice = undefined
        this.form.supplyPrice = undefined
      }
    },
    handlePercent(value) {
      return value || value === 0 ? (value * 100).toFixed(2) : null
    },
    // 处理百分比 除100 计算时保留4位小数
    handlePercentDivide(value) {
      return value || value === 0 ? (value / 100).toFixed(4) : null
    },
    // 关闭
    handleClose() {
      this.$router.$avueRouter.closeTag()
      this.$router.go(-1)
    },
    async handleCalc() {
      await this.$refs.costingForm.validate()
      const {
        platform,
        site,
        version,
        orderBusinessType,
        productType,
        standardSkuCode,
        skuCode,
        purchaseSupplierCode,
        skuName,
        packageLength,
        packageWidth,
        packageHeight,
        packageGrossWeight,
        outerBoxLength,
        outerBoxWidth,
        outerBoxHeight,
        boxGrossWeight,
        boxs,
        salePrice,
        supplyPrice,
        promotionExpenses,
        pricingWarehouseServiceMethod,
        categoryId,
        categoryName,
        profit,
        ppmInput,
        refundRatio,
        diSavingRateInput,
        headwayCostInput,
        fobCostInput,
        fobCostInputCurrency,
        pricingCalculationMethod,
        pricingCalculationType,
        time,
        logisticsDeliveryMode
      } = this.form
      const postData = cloneDeep({
        ...{
          // ...this.form,
          platform,
          site,
          currency: this.currency,
          pricingWarehouseServiceMethod:
            pricingWarehouseServiceMethod.length && pricingWarehouseServiceMethod.length == 1
              ? pricingWarehouseServiceMethod[0]
              : "ALL",
          promotionExpenses: promotionExpenses ? this.handlePercentDivide(promotionExpenses) : null,
          profit: this.handlePercentDivide(profit),
          ppmInput: this.handlePercentDivide(ppmInput),
          refundRatio: this.handlePercentDivide(refundRatio),
          diSavingRateInput: this.handlePercentDivide(diSavingRateInput),
          orderBusinessType,
          productType,
          standardSkuCode,
          skuCode,
          purchaseSupplierCode,
          salePrice,
          supplyPrice,
          headwayCostInput,
          version,
          pricingCalculationMethod,
          pricingCalculationType,
          time,
          logisticsDeliveryMode
        },
        ...(productType === "NEW"
          ? {
              categoryId: categoryId ? categoryId[categoryId.length - 1] : "",
              categoryName,
              skuName,
              packageLength,
              packageWidth,
              packageHeight,
              packageGrossWeight,
              outerBoxLength,
              outerBoxWidth,
              outerBoxHeight,
              boxGrossWeight,
              boxs,
              fobCostInput,
              fobCostInputCurrency
            }
          : {})
      })
      // return
      const { data } = await trialCalculate({ ...postData, ...(this.id ? { id: this.id } : {}) })
      if (data.code === 0) {
        this.trialCalculateData = data.data
        this.$refs.calcResult.getResultData(data.data)
        this.$message.success("计算成功")
      }
    },
    async handleSubmit() {
      const {
        categoryId,
        pricingWarehouseServiceMethod,
        promotionExpenses,
        profit,
        ppmInput,
        refundRatio,
        diSavingRateInput
      } = this.form
      let pCategoryId = categoryId ? categoryId[categoryId.length - 1] || "" : this.trialCalculateData.categoryId
      const postData = deepCloneIgnoreNull({
        ...(Object.keys(this.trialCalculateData).length > 0 ? this.trialCalculateData : this.form),
        // ...this.form,
        // ...this.trialCalculateData,
        id: this.id,
        categoryId: pCategoryId,
        pricingWarehouseServiceMethod:
          pricingWarehouseServiceMethod.length && pricingWarehouseServiceMethod.length == 1
            ? pricingWarehouseServiceMethod[0]
            : "ALL",
        promotionExpenses: promotionExpenses ? this.handlePercentDivide(promotionExpenses) : null,
        profit: this.handlePercentDivide(profit),
        ppmInput: this.handlePercentDivide(ppmInput),
        refundRatio: this.handlePercentDivide(refundRatio),
        diSavingRateInput: this.handlePercentDivide(diSavingRateInput)
      })

      console.log("postData提交", postData)
      // return

      const { data } = await trialSave(postData)
      if (data.code === 0) {
        this.$message({
          type: "success",
          message: "提交成功"
        })
        this.handleClose()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// =======
// 核心变量
$primary-color: #409eff;
$border-color: #dcdfe6;
$text-color: #606266;
$background-color: #f5f7fa;

// 布局间距
$spacing-base: 16px;
$spacing-lg: 24px;
$spacing-sm: 8px;

$label-width: 200px;
#costing-page {
  min-height: 100vh;
  padding-bottom: 90px;
}

.costing-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-base;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
}

// 表单区域样式
.costing-form {
  border-right: 1px solid $border-color;
  padding-right: $spacing-base;
  .site-header {
    margin-bottom: $spacing-base;
    padding: 10px;
    border-bottom: 1px solid $border-color;
    display: flex;
    justify-content: space-between;
    .title {
      font-size: 16px;
    }
  }
}

// 底部操作栏
.page-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-lg;
  z-index: 10;
  padding-left: 220px;

  .footer-left {
    flex: 0 0 45%;
    display: flex;
    padding: 0 20px;
    justify-content: space-between;
    padding-right: $spacing-lg;
  }

  .footer-right {
    display: flex;
    gap: $spacing-base;
  }
}

.form-item-label {
  line-height: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

::v-deep .el-radio-group {
  .el-radio__label {
    padding-left: 0px;
  }
  .el-radio:first-child {
    margin-right: 10px;
  }
}

::v-deep .el-checkbox {
  margin-right: 10px;
}

::v-deep .el-input__inner {
  width: 160px;
}
::v-deep .el-form-item__label {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 8px 0 0;
}
::v-deep .el-form-item {
  display: flex;
  align-items: center;
  padding: 16px 8px !important;
}
::v-deep .el-checkbox-group {
  display: flex;
  align-items: center;
}
::v-deep .el-checkbox__label {
  padding-left: 5px;
}
.lwh-box {
  display: flex;
  justify-content: space-around;
}
::v-deep .lwh-box .el-input-number {
  width: 60px;
}
::v-deep .lwh-box .el-input-number .el-input__inner {
  width: 60px;
  padding-left: 8px;
  padding-right: 8px;
  height: 30px;
  line-height: 30px;
}
.el-input--append {
  margin-top: 6px;

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
}
::v-deep .el-select--append .el-input__inner {
  width: 80px;
}
::v-deep .el-select--append .el-input__inner {
  width: 80px;
}
::v-deep .el-select--append .el-input__suffix {
  left: 45px;
}
::v-deep .el-input--append .el-input__inner {
  width: 80px;
}
.calc-time {
  width: 190px;
}
::v-deep .calc-time .el-input__inner {
  width: 190px !important;
}
</style>
