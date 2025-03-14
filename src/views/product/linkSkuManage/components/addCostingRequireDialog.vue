<template>
  <el-dialog title="添加核价需求" :visible.sync="showDialog" width="500px" top="2vh" @close="cancel">
    <div>
      <el-alert
        :title="
          disabled ? '从链接发起的核价需求，无法编辑站点、平台和标准SPU、标准SKU' : '标准SPU和标准SKU，必须填一项。'
        "
        type="warning"
        show-icon
        :closable="false"
        style="margin-bottom: 5px"
      >
      </el-alert>
      <el-form :model="form" ref="form" :rules="formRule" label-width="100px" label-position="right" inline>
        <el-form-item label="站点" prop="site">
          <el-select
            v-model="form.site"
            size="small"
            filterable
            placeholder="站点"
            clearable
            :disabled="disabled"
            @change="changeSite"
          >
            <el-option v-for="item in siteOptions" :key="item.value" :label="item.value" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平台" prop="platform">
          <el-select
            v-model="form.platform"
            size="small"
            placeholder="平台,支持多选"
            clearable
            filterable
            multiple
            :disabled="disabled"
            @change="handlePlatformChange"
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
        <el-form-item label="标准SPU">
          <el-select
            v-model="form.spuCode"
            filterable
            clearable
            remote
            placement="top"
            size="small"
            reserve-keyword
            placeholder="标准SPU,支持多选"
            :loading="loadingSpuQuery"
            multiple
            :remote-method="remoteMethodSpu"
            @visible-change="handleSpuVisibleChange"
            @change="handleSpuChange"
            :disabled="disabled"
          >
            <el-option v-for="item in spuCodeList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标准SKU">
          <el-select
            v-model="form.standardSkuCode"
            filterable
            clearable
            remote
            placement="top"
            size="small"
            reserve-keyword
            placeholder="标准SKU,支持多选"
            :loading="loadingSkuQuery"
            multiple
            :remote-method="remoteMethodSku"
            @visible-change="handleSkuVisibleChange"
            @change="handleSkuChange"
            :disabled="disabled"
          >
            <el-option v-for="item in skuCodeList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售模式" prop="orderBusinessType">
          <el-select
            v-model="form.orderBusinessType"
            size="small"
            filterable
            placeholder="销售模式,支持多选"
            clearable
            multiple
            :disabled="!form.platform || !form.platform?.length"
          >
            <el-option v-for="item in platformModel" :key="item.description" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配送方式" prop="logisticsDeliveryMode">
          <el-select
            v-model="form.logisticsDeliveryMode"
            size="small"
            filterable
            placeholder="配送方式,支持多选"
            clearable
            multiple
            :disabled="!form.orderBusinessType || !form.orderBusinessType?.length"
          >
            <el-option v-for="item in deliveryMethodOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="定价方式" prop="pricingMethod">
          <el-radio-group v-model="form.pricingMethod">
            <el-radio label="PROFIT_CALCULATION">正算利润</el-radio>
            <el-radio label="SELL_PRICE_CALCULATION">反算售价</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="含税售价"
          prop="salePrice"
          :rules="
            form.pricingMethod == 'PROFIT_CALCULATION'
              ? [{ required: true, message: '含税售价不能为空', trigger: 'blur' }]
              : []
          "
          v-if="form.pricingMethod == 'PROFIT_CALCULATION'"
        >
          <el-input
            v-model="form.salePrice"
            placeholder="请输入含税售价"
            size="small"
            @change="validateNumber($event, 'salePrice')"
          >
            <template slot="suffix"> {{ currency }}</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="税前利润率"
          prop="preTaxProfitMargin"
          class="other-form-label"
          :rules="
            form.pricingMethod == 'SELL_PRICE_CALCULATION'
              ? [{ required: true, message: '税前利润率不能为空', trigger: 'blur' }]
              : []
          "
          v-if="form.pricingMethod == 'SELL_PRICE_CALCULATION'"
        >
          <el-input
            v-model="form.preTaxProfitMargin"
            placeholder="请输入税前利润率"
            size="small"
            @change="validateNumber($event, 'preTaxProfitMargin')"
          >
            <template slot="suffix"> %</template>
          </el-input>
        </el-form-item>

        <el-form-item label="" prop="promotionExpenses" class="other-form-label">
          <template slot="label">
            <div>
              <div style="text-align: right; line-height: 30px">推广费比</div>
              <div style="font-size: 12px; color: #ccc; line-height: 1">(占含税售价)</div>
            </div>
          </template>
          <el-input
            v-model="form.promotionExpenses"
            placeholder="请输入推广费比"
            size="small"
            @change="validateNumber($event, 'promotionExpenses')"
          >
            <template slot="suffix"> %</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="附加要求"
          prop="additionalRequirements"
          :rules="additionalRequirementsRules"
          v-if="shouldShowAdditionalRequirements"
        >
          <el-radio-group v-model="form.additionalRequirements">
            <el-radio v-for="option in additionalRequirementsOptions" :key="option.value" :label="option.value">
              {{ option.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="供货价"
          prop="supplyPrice"
          :rules="
            form.additionalRequirements == 'a' ? [{ required: true, message: '请输入供货价', trigger: 'blur' }] : []
          "
          v-if="form.pricingMethod == 'PROFIT_CALCULATION' && form.additionalRequirements == 'a'"
        >
          <el-input
            v-model="form.supplyPrice"
            placeholder="请输入供货价"
            size="small"
            @change="validateNumber($event, 'supplyPrice')"
          >
            <template slot="suffix"> {{ currency }}</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="PPM"
          prop="ppmm"
          class="other-form-label"
          :rules="form.additionalRequirements == 'b' ? [{ required: true, message: '请输入PPM', trigger: 'blur' }] : []"
          v-if="form.additionalRequirements == 'b'"
        >
          <el-input v-model="form.ppmm" placeholder="请输入PPM" size="small" @change="validateNumber($event, 'ppmm')">
            <template slot="suffix"> %</template>
          </el-input>
        </el-form-item>
        <el-form-item label="需求描述" prop="demandDescription">
          <el-input
            v-model="form.demandDescription"
            placeholder="请输入需求描述"
            size="small"
            type="textarea"
            :rows="2"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getPlayTypeAll } from "@/api/order/orderManage"
import { getDictByType } from "@/util/auth"
import { saveProductPricingDemandApi, getSpuOrSkuApi, getSaleModeByPlatformApi } from "@/api/product/pricing"
import { getAll as getAllCurrency } from "@/api/baseSetup/bsecurrency"
import { getCountry, getCountryByParamApi } from "@/api/baseSetup/bsecountry"

let form = {
  linkSkuId: undefined,
  pricingType: "NEW",
  platform: undefined,
  site: undefined,
  orderBusinessType: [],
  spuCode: undefined,
  standardSkuCode: undefined,
  salePrice: undefined,
  supplyPrice: undefined,
  demandDescription: undefined,
  logisticsDeliveryMode: [],
  additionalRequirements: "a",
  pricingMethod: "PROFIT_CALCULATION"
}
export default {
  name: "linkSkuAddCostingRequireDialog",
  components: {},
  data() {
    return {
      showDialog: false,
      form: {},
      siteOptions: [],
      platformOptions: [],
      platformModel: [], // 模式
      spuCodeList: [],
      skuCodeList: [],
      formRule: {
        platform: [{ required: true, message: "请选择平台", trigger: "blur" }],
        site: [{ required: true, message: "请选择站点", trigger: "blur" }],
        orderBusinessType: [{ required: true, message: "请选择销售模式", trigger: "blur" }],
        logisticsDeliveryMode: [{ required: true, message: "请选择配送方式", trigger: "blur" }],
        salePrice: [{ required: true, message: "请输入含税售价", trigger: "blur" }],
        supplyPrice: [{ required: true, message: "请输入供货价", trigger: "blur" }],
        promotionExpenses: [{ required: true, message: "请输入推广费比", trigger: "blur" }],
        pricingMethod: [{ required: true, message: "请选择定价方式", trigger: "blur" }],
        preTaxProfitMargin: [{ required: true, message: "请输入税前利润率", trigger: "blur" }],
        additionalRequirements: [{ required: true, message: "请选择附加要求", trigger: "blur" }],
        ppmm: [{ required: true, message: "请输入PPM", trigger: "blur" }]
      },
      disabled: false,
      currency: "",
      currencyOptions: [],
      deliveryMethodOptions: [],
      platformModelMappings: [],
      deliveryMethodMappings: [],
      additionalRequirementsOptions: [
        { value: "a", label: "供货价" },
        { value: "b", label: "PPM" },
        { value: "c", label: "运费逻辑" },
        { value: "d", label: "协议PPM" }
      ]
    }
  },
  computed: {
    additionalRequirementsRules() {
      return this.form.platform?.includes("AMAZONVC")
        ? [{ required: true, message: "请选择附加要求", trigger: "blur" }]
        : []
    },

    isPlatformShow() {
      // 仅平台=亚马逊VC时，显示并必填
      return this.form.platform?.includes("AMAZONVC")
    },

    shouldShowAdditionalRequirements() {
      // 仅平台=亚马逊VC时，显示并必填
      // 站点=JP，且定价方式=反算售价时，不显示字段【附加要求】
      return this.isPlatformShow || !(this.form.site === "JP" && this.form.pricingMethod === "SELL_PRICE_CALCULATION")
    }
  },
  watch: {
    "form.platform": {
      handler(newVal, old) {
        console.log("🥶 ---> handler ---> newVal👉", newVal, old)
        if (!newVal?.length) {
          this.platformModel = []
          this.form.orderBusinessType = []
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

        // 如果销售模式只有一个，则默认选中
        if (this.platformModel.length === 1) {
          this.form.orderBusinessType = [this.platformModel[0].value]
        }

        this.getDeliveryMethodOptions()
        // this.updateAdditionalRequirementsOptions()
        this.$refs.form?.clearValidate()
      },
      deep: true
    },
    "form.site": {
      handler() {
        console.log(22)
        this.updateAdditionalRequirementsOptions() // 更新附加要求选项
        this.$refs.form?.clearValidate()
      }
    },
    "form.pricingMethod": {
      handler() {
        console.log(33)

        this.updateAdditionalRequirementsOptions() // 更新附加要求选项
        this.$refs.form?.clearValidate()
      }
    },
    "form.additionalRequirements": {
      handler() {
        this.$refs.form?.clearValidate()
      }
    },
    "form.orderBusinessType": {
      handler(newVal) {
        if (!newVal?.length) {
          this.deliveryMethodOptions = []
          this.form.logisticsDeliveryMode = []
          return
        }

        this.getDeliveryMethodOptions()
        // 如果配送方式只有一个，则默认选中
        if (this.deliveryMethodOptions.length === 1) {
          this.form.logisticsDeliveryMode = [this.deliveryMethodOptions[0].value]
        }
      },
      deep: true
    }
  },
  created() {},
  mounted: function () {},
  methods: {
    async openDialog(row = null) {
      await this.init()
      console.log("form666666", form)
      this.form = { ...form }
      this.disabled = !!row
      if (row) {
        this.form = {
          ...form,
          linkSkuId: row.id,
          platform: [row.platform],
          site: row.site,
          spuCode: [row.spuCode],
          standardSkuCode: [row.parentSkuCode]
        }
        this.getCountryByParam()
      }
      this.showDialog = true
      await Promise.all([this.getCurrency(), this.getPlatform()])
    },
    changeSite() {
      this.getCountryByParam()
    },
    async init() {
      const [platformModelMappings, deliveryMethodMappings, countryOptions] = await Promise.all([
        getDictByType("prd_pricing_sale_model"),
        getDictByType("logistics_delivery_method"),
        this.getAllCountry()
      ])

      this.platformModelMappings = platformModelMappings
      this.deliveryMethodMappings = deliveryMethodMappings
    },
    // 获取国家对应币种
    async getCountryByParam() {
      const { data } = await getCountryByParamApi({ countryCodeList: [this.form.site] })
      this.currency = data.data[0].baseCurrency
    },
    // 获取国家
    async getAllCountry() {
      const { data } = await getCountry()
      this.siteOptions = data.data.map((item) => ({
        label: item.countryShortName,
        value: item.countryCode
      }))
    },
    // 获取币种
    async getCurrency() {
      const { data } = await getAllCurrency()
      this.currencyOptions = data.data
    },
    // 获取平台
    async getPlatform() {
      const { data } = await getPlayTypeAll()
      this.platformOptions = data.data
    },
    // 获取SPU或SKU
    async getSpuOrSku({ spuCode, skuCode }) {
      if (!spuCode && !skuCode) {
        return { spuCodeList: [], skuCodeList: [] }
      }
      const params = {
        spuCode: spuCode,
        skuCode: skuCode
      }
      const { data } = await getSpuOrSkuApi(params)
      return data.data
    },
    // 显示时有SPU获取SPU, 否则有SKU获取SKU
    async setSpuOrSku(type) {
      if (this.form.spuCode && this.form.spuCode.length > 0) {
        const spuCode = Array.isArray(this.form.spuCode) ? this.form.spuCode?.join(",") : this.form.spuCode
        const data = await this.getSpuOrSku({ spuCode })
        this[type] = data[type]
      } else if (this.form.standardSkuCode && this.form.standardSkuCode.length > 0) {
        const skuCode = Array.isArray(this.form.standardSkuCode)
          ? this.form.standardSkuCode?.join(",")
          : this.form.standardSkuCode
        const data = await this.getSpuOrSku({ skuCode })
        this[type] = data[type]
      }
    },
    // 获取SPU
    async remoteMethodSpu(queryString) {
      if (queryString) {
        this.form.standardSkuCode = undefined
        this.loadingSpuQuery = true
        const data = await this.getSpuOrSku({ spuCode: queryString?.trim() })
        this.spuCodeList = data.spuCodeList
        this.loadingSpuQuery = false
      }
    },
    // 获取SKU
    async handleSpuVisibleChange(visible) {
      // 隐藏时获取SKU
      if (!visible) {
        const spuCode = Array.isArray(this.form.spuCode) ? this.form.spuCode?.join(",") : this.form.spuCode
        const data = await this.getSpuOrSku({ spuCode })
        this.skuCodeList = data.skuCodeList
      } else {
        this.setSpuOrSku("spuCodeList")
      }
    },
    // 获取SKU
    async remoteMethodSku(queryString) {
      if (queryString) {
        // this.form.spuCode = undefined
        this.loadingSkuQuery = true
        const data = await this.getSpuOrSku({ skuCode: queryString?.trim() })
        this.skuCodeList = data.skuCodeList
        this.loadingSkuQuery = false
      }
    },
    // 获取SPU
    async handleSkuVisibleChange(visible) {
      // 隐藏时获取SPU
      if (!visible) {
        const skuCode = Array.isArray(this.form.standardSkuCode)
          ? this.form.standardSkuCode?.join(",")
          : this.form.standardSkuCode
        const data = await this.getSpuOrSku({ skuCode })
        this.spuCodeList = data.spuCodeList
      } else {
        this.setSpuOrSku("skuCodeList")
      }
    },
    // 改变SKU
    async handleSkuChange(val) {
      if (!val || val.length <= 0) {
        this.skuCodeList = []
        this.spuCodeList = []
      } else {
        // 切换SKU后， 自动回填SKU所属的SPU
        const skuCode = Array.isArray(val) ? val?.join(",") : val
        const data = await this.getSpuOrSku({ skuCode })
        this.spuCodeList = data.spuCodeList
        // 合并已有的SPU并去重
        if (this.form.spuCode) {
          this.form.spuCode = [...new Set([...this.spuCodeList, ...this.form.spuCode])]
        } else {
          this.form.spuCode = this.spuCodeList
        }
      }
    },
    // 改变SPU
    handleSpuChange(val) {
      // 切换SPU后，清空标准SKU
      this.form.standardSkuCode = undefined
      if (!val || val.length <= 0) {
        this.skuCodeList = []
        this.spuCodeList = []
      }
    },
    validateNumber(val, key) {
      if (!val) return
      // 含税售价和供货价 币别如果是印尼盾和日元就是整数，其他是两位小数
      if ((key === "supplyPrice" || key === "salePrice") && (this.currency === "IDR" || this.currency === "JPY")) {
        this.form[key] = val.replace(/[^0-9]/g, "")
      } else {
        const newVal = parseFloat(val.replace(/[^\d|\.]/g, "").replace(/^[0]+/g, "0")).toFixed(2)
        if (newVal || newVal === 0) {
          this.form[key] = newVal
        } else {
          this.form[key] = null
        }
      }
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // 标准SPU和标准SKU，必须填一项。
          if (!this.form.spuCode && !this.form.standardSkuCode) {
            this.$message.warning("标准SPU和标准SKU，必须填一项。")
            return
          }

          const convertToPercentage = (value) => {
            return value || value === 0 ? (value / 100).toFixed(4) : undefined
          }
          // 推广费比 转成百分比传给后端 保留4位小数
          let form = { ...this.form }
          form.promotionExpenses = convertToPercentage(form.promotionExpenses)
          form.preTaxProfitMargin = convertToPercentage(form.preTaxProfitMargin)
          form.ppmm = convertToPercentage(form.ppmm)

          Object.keys(form).forEach((key) => {
            if (Array.isArray(form[key])) {
              form[key] = form[key].join(",")
            }
            if (form[key] === "") {
              form[key] = null
            }
          })
          console.log("====>", form)
          // return

          const { data } = await saveProductPricingDemandApi(form)
          if (data.code === 0) {
            this.$message.success("操作成功")
            this.close()
          }
        }
      })
    },
    close() {
      this.showDialog = false
    },
    cancel() {
      console.log("cancel")
      this.$refs.form?.clearValidate()
      this.$emit("updateDate")
    },
    handlePlatformChange() {
      this.form.orderBusinessType = []
      this.form.logisticsDeliveryMode = []
    },
    // 获取配送方式
    async getDeliveryMethodOptions() {
      const platformAndModel = []
      this.form.platform.forEach((platform) => {
        this.form.orderBusinessType.forEach((model) => {
          platformAndModel.push(`${platform}-${model}`)
        })
      })

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
    },
    updateAdditionalRequirementsOptions() {
      console.log("打印一次")
      const { site, platform, pricingMethod } = this.form

      if (platform === "AMAZON_VC") {
        this.additionalRequirementsOptions = [
          { value: "a", label: "供货价" },
          { value: "b", label: "PPM" },
          { value: "c", label: "运费逻辑" },
          { value: "d", label: "协议PPM" }
        ]
        this.form.additionalRequirements = "a"
      } else if (pricingMethod === "PROFIT_CALCULATION") {
        if (site === "US") {
          this.additionalRequirementsOptions = [
            { value: "a", label: "供货价" },
            { value: "b", label: "PPM" },
            { value: "c", label: "运费逻辑" }
          ]
          this.form.additionalRequirements = "a"
        } else if (["UK", "FR", "DE", "ES", "IT"].includes(site)) {
          this.additionalRequirementsOptions = [
            { value: "a", label: "供货价" },
            { value: "b", label: "PPM" },
            { value: "d", label: "协议PPM" }
          ]
          this.form.additionalRequirements = "a"
        } else {
          this.additionalRequirementsOptions = [{ value: "a", label: "供货价" }]
          this.form.additionalRequirements = "a"
        }
      } else if (pricingMethod === "SELL_PRICE_CALCULATION" && site !== "JP") {
        this.additionalRequirementsOptions = [
          // { value: "a", label: "供货价" },
          { value: "b", label: "PPM" },
          { value: "c", label: "运费逻辑" }
        ]
        this.form.additionalRequirements = "b"
      } else {
        this.additionalRequirementsOptions = [
          { value: "a", label: "供货价" },
          { value: "b", label: "PPM" },
          { value: "c", label: "运费逻辑" },
          { value: "d", label: "协议PPM" }
        ]
        this.form.additionalRequirements = "a"
      }

      // 默认选中“供货价”
      // if (this.additionalRequirementsOptions.length > 0) {
      //   this.form.additionalRequirements = this.additionalRequirementsOptions[0].value
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.other-form-label {
  ::v-deep .el-form-item__label {
    display: flex !important;
  }
}
</style>
