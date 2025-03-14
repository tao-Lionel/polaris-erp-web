<template>
  <div class="costing-page">
    <basic-container>
      <div class="costing-layout">
        <!-- 左侧表单区域 -->
        <section class="costing-form">
          <header class="site-header">
            <h3 class="title">{{ detailData.site }}</h3>
            <div class="label-description">
              {{ `使用汇率 (${currency}/USD)` }}
              <span style="margin-left: 5px">{{ detailData.exchangeRate }}</span>
            </div>
          </header>
          <el-form :model="form" ref="form" :rules="formRule" inline label-width="85px">
            <detail-wrapper :options="{ title: '基本信息' }">
              <el-row>
                <el-col span="12">
                  <el-form-item label="平台" prop="platform">
                    <el-select
                      v-model="form.platform"
                      size="small"
                      placeholder="请选择平台"
                      clearable
                      filterable
                      disabled
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
                      disabled
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
                  <el-form-item label="标准SKU" prop="standardSkuCode">
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
                      disabled
                    >
                      <el-option v-for="item in skuCodeList" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col span="12">
                  <el-form-item label="配送方式" prop="logisticsDeliveryMode">
                    <el-select
                      v-model="form.logisticsDeliveryMode"
                      size="small"
                      filterable
                      placeholder="配送方式"
                      clearable
                      disabled
                    >
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
              <el-row>
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
                <el-col span="12">
                  <el-form-item label="采购供应商" prop="purchaseSupplierCode">
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
                  <el-form-item label="核价类型" prop="pricingCalculationType" label-width="85px">
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
                  <el-form-item label="核价逻辑" prop="pricingCalculationMethod" label-width="85px">
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
                  <el-form-item label="仓储服务" prop="pricingWarehouseServiceMethod" label-width="85px">
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
                  <el-form-item label="PPM" prop="ppmInput" label-width="85px">
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
              <div style="background-color: #f2f2f2; padding: 15px 10px">
                核价需求说明：{{ detailData.demandDescription ? detailData.demandDescription : "-" }}
              </div>
            </detail-wrapper>
          </el-form>
        </section>

        <!-- 右侧计算结果 -->
        <calcResult ref="calcResult"></calcResult>
      </div>
    </basic-container>

    <!-- 底部操作栏 -->
    <footer class="page-footer">
      <div class="footer-left">
        <el-button type="warning" :loading="loading" @click="handleCalc">计 算</el-button>
      </div>
      <div class="footer-right">
        <el-button @click="handleClose">关 闭</el-button>
        <el-button
          v-if="detailData.pricingInfoStatus === 'PENDING_SUBMIT'"
          type="primary"
          :loading="loading"
          @click="handleSaveDraft"
        >
          保存草稿
        </el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">提 交</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { getPlayTypeAll } from "@/api/order/orderManage"
import { getDictByType } from "@/util/auth"
import { getByLikeSkuCode } from "@/api/product/prdsku"
import {
  getProductPricingDemandByIdApi,
  getProductPricingCalculateApi,
  batchSubmitPricingDemandApi,
  getSaleModeByPlatformApi,
  getSkuByStandardSkuApi,
  getSupplierBySkuApi,
  getSpuOrSkuApi
} from "@/api/product/pricing"
import { getCountryByParamApi } from "@/api/baseSetup/bsecountry"
import calcResult from "../components/calcResult.vue"

export default {
  name: "costingPage",
  components: { calcResult },
  data() {
    return {
      countryOptions: [],
      platformModel: [], // 模式
      platformOptions: [],
      form: {
        platform: undefined,
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
        ppmInput: undefined,
        site: undefined,
        logisticsDeliveryMode: undefined
      },
      skuCodeList: [],
      supplierOptions: [],
      formRule: {
        platform: [{ required: true, message: "请选择平台", trigger: "blur" }],
        standardSkuCode: [{ required: true, message: "请输入标准SKU", trigger: "blur" }],
        orderBusinessType: [{ required: true, message: "请选择销售模式", trigger: "blur" }],
        salePrice: [{ required: true, message: "请输入含税售价", trigger: "blur" }]
      },
      id: this.$route.query.id,
      detailData: {},
      pricingCalculationTypeOptions: [],
      pricingCalculationMethodOptions: [],
      pricingWarehouseServiceMethodOptions: [],
      currency: "",
      factorySkuList: [],
      loading: false,
      deliveryMethodOptions: [],
      platformModelMappings: [],
      deliveryMethodMappings: []
    }
  },
  watch: {
    "form.platform": {
      handler(newVal) {
        if (!newVal?.length) {
          this.platformModel = []
          this.form.orderBusinessType = ""
          return
        }

        const uniqueModels = new Set()

        // 根据平台过滤销售模式
        this.platformModel = this.platformModelMappings.filter((item) => {
          const hasMatchingPlatform = item.dictMappings.some((mapping) => newVal.includes(mapping.filtering))
          if (hasMatchingPlatform && !uniqueModels.has(item.value)) {
            uniqueModels.add(item.value)
            return true
          }
          return false
        })

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
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(["permissions"]),
    // 是否禁用
    isDisabled() {
      // 选中正算利润：禁用税前利润率，并清空值
      // 选中反算售价：禁用含税售价和供货价，并清空值
      return this.form.pricingCalculationType === "PROFIT_CALCULATION"
    }
  },
  created() {},
  activated() {
    this.getCostingDemand(true)
  },
  mounted: function () {
    this.init()
  },
  methods: {
    async init() {
      this.loading = true
      const [
        calculationTypes,
        calculationMethods,
        warehouseServiceMethods,
        platformModelMappings,
        deliveryMethodMappings,
        platformResponse
      ] = await Promise.all([
        getDictByType("pricing_calculation_type"),
        getDictByType("pricing_calculation_method"),
        getDictByType("pricing_warehouse_service_method"),
        getDictByType("prd_pricing_sale_model"),
        getDictByType("logistics_delivery_method"),
        this.getPlatform()
      ])

      this.platformModelMappings = platformModelMappings
      this.deliveryMethodMappings = deliveryMethodMappings

      // 设置各选项数据
      this.pricingCalculationTypeOptions = calculationTypes
      this.pricingCalculationMethodOptions = calculationMethods
      this.pricingWarehouseServiceMethodOptions = warehouseServiceMethods.filter((item) => item.value !== "ALL")

      // 获取核价需求和国家参数
      await Promise.all([this.getCostingDemand(true)])
      this.loading = false
    },
    // 获取核价需求
    async getCostingDemand(isUpdateValue = false) {
      const { data } = await getProductPricingDemandByIdApi(this.id)
      if (data.code === 0) {
        this.detailData = data.data
        const {
          platform,
          standardSkuCode,
          skuCode,
          purchaseSupplierCode,
          pricingWarehouseServiceMethod,
          pricingCalculationType,
          pricingCalculationMethod,
          salePrice,
          supplyPrice,
          profit,
          ppm,
          promotionExpenses,
          orderBusinessType,
          site,
          logisticsDeliveryMode
        } = data.data
        await Promise.all([
          this.$refs.calcResult.getResultData(this.detailData),
          this.getSkuByStandardSku(standardSkuCode),
          this.getSupplierBySku(skuCode),
          this.getCountryByParam()
        ])

        const defaultPurchaseSupplierCode = this.supplierOptions?.[0]?.value

        this.form = {
          site,
          platform,
          standardSkuCode,
          skuCode,
          orderBusinessType,
          logisticsDeliveryMode,
          purchaseSupplierCode: purchaseSupplierCode || defaultPurchaseSupplierCode, // 默认选中工厂SKU最新的供应商(默认取第一个)
          salePrice:
            pricingCalculationType === "SELL_PRICE_CALCULATION"
              ? null
              : isUpdateValue
              ? salePrice
              : this.form.salePrice, // 选中反算利润：清空含税售价
          pricingCalculationType: pricingCalculationType || "PROFIT_CALCULATION",
          supplyPrice:
            pricingCalculationType === "SELL_PRICE_CALCULATION"
              ? null
              : isUpdateValue
              ? supplyPrice
              : this.form.supplyPrice, // 选中反算利润：清空供货价
          pricingCalculationMethod: pricingCalculationMethod || "FREIGHT",
          promotionExpenses: isUpdateValue ? this.handlePercent(promotionExpenses) : this.form.promotionExpenses,
          pricingWarehouseServiceMethod:
            pricingWarehouseServiceMethod === "ALL"
              ? ["WAREHOUSE", "PLATFORM"]
              : pricingWarehouseServiceMethod
              ? [pricingWarehouseServiceMethod]
              : ["WAREHOUSE"],
          profit:
            pricingCalculationType === "PROFIT_CALCULATION"
              ? null
              : isUpdateValue
              ? this.handlePercent(profit)
              : this.form.profit, // 选中正算利润：清空税前利润率
          ppmInput:
            pricingCalculationMethod === "FREIGHT" ? null : isUpdateValue ? this.handlePercent(ppm) : this.form.ppmInput // 选中运费：清空PPM
        }
      }
    },

    // 获取平台
    async getPlatform() {
      const { data } = await getPlayTypeAll()
      this.platformOptions = data.data
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
    validateNumber(val, key) {
      if (!val) return
      // 推广费比、税前利润率、PPM只允许输入6位整数+2位小数
      if (key === "promotionExpenses" || key === "profit" || key === "ppmInput") {
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
    // 处理百分比 乘100
    handlePercent(value) {
      return value || value === 0 ? (value * 100).toFixed(2) : null
    },
    // 处理百分比 除100 计算时保留4位小数
    handlePercentDivide(value) {
      return value || value === 0 ? (value / 100).toFixed(4) : null
    },
    // 计算
    handleCalc() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let form = { ...this.form }
          form.pricingDemandId = this.id

          // 仓储服务 全选时，传ALL
          if (form.pricingWarehouseServiceMethod.length === 2) {
            form.pricingWarehouseServiceMethod = "ALL"
          } else {
            form.pricingWarehouseServiceMethod = form?.pricingWarehouseServiceMethod?.join(",") || undefined
          }

          form.promotionExpenses = form.promotionExpenses ? this.handlePercentDivide(form.promotionExpenses) : null
          form.profit = this.handlePercentDivide(form.profit)
          form.ppmInput = this.handlePercentDivide(form.ppmInput)

          this.loading = true
          try {
            const { data } = await getProductPricingCalculateApi(form)
            if (data.code === 0) {
              this.$message.success("计算成功")
              this.getCostingDemand()
            }
          } catch (error) {
            console.log(error)
          } finally {
            this.loading = false
          }
        }
      })
    },
    // 获取国家对应币种
    async getCountryByParam() {
      const { data } = await getCountryByParamApi({ countryCodeList: [this.detailData.site] })
      this.currency = data.data[0].baseCurrency
    },
    // 关闭
    handleClose() {
      this.$router.$avueRouter.closeTag()
      this.$router.go(-1)
    },
    // 提交
    async handleSubmit() {
      const { data } = await batchSubmitPricingDemandApi([Number(this.id)])
      if (data.code === 0) {
        this.$message.success("提交成功")
        this.handleClose()
      }
    },
    // 保存草稿
    async handleSaveDraft() {
      this.$message.success("保存草稿成功")
      this.handleClose()
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
    // 核价逻辑改变
    handleCalculationMethodChange(val) {
      // 选中 运费，PPM值清空
      if (val === "FREIGHT") {
        this.form.ppmInput = undefined
      }
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
    },
    // 获取配送方式
    async getDeliveryMethodOptions() {
      const platformAndModel = [`${this.form.platform}-${this.form.orderBusinessType}`]

      console.log("platformAndModel", platformAndModel)

      const uniqueDeliveryMethods = new Set()

      // 根据平台+销售模式过滤配送方式
      this.deliveryMethodOptions = this.deliveryMethodMappings.filter((item) => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
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
.costing-page {
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

  .footer-left {
    flex: 0 0 53%;
    display: flex;
    justify-content: flex-end;
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
  white-space: nowrap;
}
::v-deep .el-form-item {
  display: flex;
  align-items: center;
}
::v-deep .el-checkbox-group {
  display: flex;
  align-items: center;
}
::v-deep .el-checkbox__label {
  padding-left: 5px;
}
</style>
