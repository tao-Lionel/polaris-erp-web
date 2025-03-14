<template>
  <div>
    <basic-container>
      <detail-template
        :value="1"
        :options="{
          template: 1,
          title: '采购订单',
          list: [{ label: '采购计划员', value: detailData.purchasePlanner }]
        }"
      >
      </detail-template>

      <detail-wrapper :options="{ title: '基本信息' }">
        <el-form ref="formRef" :model="form" inline :rules="rules" label-suffix=":">
          <el-row>
            <el-col :span="8">
              <el-form-item label="单据类型" prop="purchaseDocumentType">
                <div style="display: flex; align-items: center">
                  <el-select
                    v-model="form.purchaseDocumentType"
                    size="small"
                    placeholder="单据类型"
                    filterable
                    clearable
                    :disabled="isSplit || purchasePlanDocumentType == 1"
                    @change="getSupplierOptions"
                  >
                    <el-option
                      v-for="item in documentTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-tooltip placement="top" effect="light">
                    <i class="el-tooltip el-icon-question" style="margin-left: 10px"></i>

                    <div slot="content" style="width: 400px; font-size: 14px; line-height: 20px">
                      <ul>
                        <li style="margin-bottom: 5px">
                          1.
                          国内自制：甜秘密寝具公司生产销售给广东甜秘密创新科技有限公司，创新科技公司再销售给香港公司，需选择国内自制；
                          单据审核通过后，<span style="color: red">人工下发采购订单给巨益系统</span>
                        </li>
                        <li style="margin-bottom: 5px">
                          2. 国内外购：广东甜秘密创新科技公司找外部供应商采购，再销售给香港公司，需选择国内外购；
                          <span style="color: red">无需下发单据给数夫、巨益</span>
                        </li>
                        <li style="margin-bottom: 5px">
                          3. 印尼自制：供应商为印尼冠军，需选择印尼自制；<span style="color: red">
                            单据审核通过后，系统自动下发销售订单给数夫
                          </span>
                        </li>
                        <li style="margin-bottom: 5px">
                          4. 外购：直接找外部供应商采购，需选择外购；<span style="color: red">
                            无需下发单据给数夫、巨益
                          </span>
                        </li>
                      </ul>
                    </div>
                  </el-tooltip>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购单属性" prop="purchaseAttributes">
                <el-radio-group v-model="form.purchaseAttributes" :disabled="!isSplit">
                  <el-radio v-for="item in planAttributesList" :key="item.value" :label="item.value">
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否下发数夫" prop="needPushShufuFlag">
                <el-radio-group v-model="form.needPushShufuFlag" :disabled="isSplit || form.purchaseDocumentType != 1">
                  <el-radio :label="true"> 是 </el-radio>
                  <el-radio :label="false"> 否 </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="供应商" prop="supplierNo">
                <el-select
                  v-model="form.supplierNo"
                  size="small"
                  placeholder="供应商"
                  filterable
                  clearable
                  @change="getCorporationId"
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
            <el-col :span="8">
              <el-form-item label="采购组织" prop="purchaseOrgId">
                <el-select
                  v-model="form.purchaseOrgId"
                  size="small"
                  placeholder="采购组织"
                  filterable
                  clearable
                  :disabled="!form.supplierNo"
                  @change="changeCorporationId"
                >
                  <el-option
                    v-for="item in corporationList"
                    :key="item.corporationId"
                    :label="item.corporationName"
                    :value="item.corporationId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="价格模式" prop="priceModel">
                <el-select
                  v-model="form.priceModel"
                  size="small"
                  clearable
                  filterable
                  placeholder="价格模式"
                  @change="changePriceModel"
                >
                  <el-option
                    v-for="item in priceModelOptions"
                    :key="item.value"
                    :label="item.description"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="入库仓库" prop="inWarehouseId">
                <el-select v-model="form.inWarehouseId" size="small" filterable clearable placeholder="入库仓库">
                  <el-option
                    v-for="item in warehouseOptions"
                    :key="item.warehouseId"
                    :label="item.warehouseName"
                    :value="item.warehouseId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </detail-wrapper>

      <detail-wrapper :options="{ title: '产品信息', customContentStyle: { padding: '8px' } }">
        <avue-crud
          :data="tableData"
          :option="createTableOption"
          @search-change="searchChange"
          @search-reset="searchReset"
          @selection-change="selectionChange"
        >
          <template slot="search">
            <el-form ref="createOrderForm" :model="createOrderForm" inline>
              <el-form-item prop="skuCode">
                <el-input
                  v-model="createOrderForm.skuCode"
                  size="small"
                  v-search-input
                  placeholder="工厂SKU"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item prop="categoryId">
                <el-cascader
                  expand-trigger="hover"
                  :props="{ multiple: true }"
                  v-model="createOrderForm.categoryId"
                  :show-all-levels="false"
                  :options="treeCategoryData"
                  @change="handleChange"
                  clearable
                  size="small"
                  placeholder="品类"
                ></el-cascader>
              </el-form-item>
            </el-form>
          </template>

          <template slot="currentProcurementQuantity" slot-scope="scope">
            <el-input
              v-model="scope.row.currentProcurementQuantity"
              placeholder="本次采购数量"
              size="small"
              type="number"
              clearable
              @change="changeCurrentProcurementQuantity(scope.row)"
            >
            </el-input>
          </template>

          <template slot="platformCode" slot-scope="scope">
            <el-input v-if="isSplit" v-model="scope.row.platformCode" placeholder="平台订单号" size="small" clearable>
            </el-input>
            <div v-else>
              <copy-text hoverToShow>
                {{ scope.row.platformCode }}
              </copy-text>
            </div>
          </template>
        </avue-crud>
      </detail-wrapper>

      <div style="display: flex; justify-content: flex-end; margin-right: 20px">
        <el-button type="primary" @click="handleSubmit('save')">保 存</el-button>
        <el-button v-if="permissions.purchase_order_audit" type="primary" @click="handleSubmit('submit')">
          提交审核
        </el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { createTableOption } from "./list.js"
import { getAll as getAllSupplierApi } from "@/api/supplier/posupplier"
import { getDictByType } from "@/util/auth"
import { createPurchaseOrderApi, getPurchasePlanDetailApi } from "@/api/purchase/procurementPlan"
import { getPurchaseChangeOrderSkuValidPriceApi } from "@/api/purchase/pochange/poorderchangedetail"
import { getCorporation, getModelBySupplierNoApi } from "@/api/purchase/porequisiton"
import { getWarehouseByCorpCodeApi } from "@/api/baseSetup/bsewarehouse"
import { fetchTreeList } from "@/api/product/prdskucategory"
import { deepClone } from "@/util/util.js"
import { getPoOrderDetailApi, updatePoOrderPageApi, splitPoOrderPageApi } from "@/api/purchase/order/poorder"
import { deepCloneIgnoreNull } from "@/components/avue/utils/util.js"

export default {
  name: "purchasePoOrderCreate",
  components: {},
  data() {
    return {
      form: {
        poPurchasePlanCode: this.$route.query.purchasePlanCode,
        purchaseDocumentType: "",
        supplierNo: "",
        purchaseOrgId: "",
        priceModel: "",
        inWarehouseId: "",
        purchaseOrgCode: "",
        directSubmit: false,
        purchaseOrderNo: undefined,
        purchaseAttributes: "",
        needPushShufuFlag: true
      },
      documentTypeOptions: [],
      rules: {
        purchaseDocumentType: [{ required: true, message: "请选择类型", trigger: "change" }],
        supplierNo: [{ required: true, message: "请选择供应商", trigger: "change" }],
        purchaseOrgId: [{ required: true, message: "请选择采购组织", trigger: "change" }],
        priceModel: [{ required: true, message: "请选择价格模式", trigger: "change" }],
        inWarehouseId: [{ required: true, message: "请选择入库仓库", trigger: "change" }],
        purchaseAttributes: [{ required: true, message: "请选择采购单属性", trigger: "change" }]
      },
      createTableOption,
      tableData: [],
      originTableData: [],
      supplierOptions: [],
      corporationList: [],
      priceModelOptions: [],
      warehouseOptions: [],
      createOrderForm: {
        skuCode: "",
        categoryId: [],
        categories: []
      },
      treeCategoryData: [],
      detailData: {},
      planAttributesList: [],
      procurementPlanAttrOptions: [],
      initSupplierOptions: [],
      purchasePlanDocumentType: "", // 采购计划单据类型
      selectList: []
    }
  },
  computed: {
    ...mapGetters(["permissions"]),
    // 采购单号
    purchaserOrderNo() {
      return this.$route.query.purchaserOrderNo
    },
    // 是编辑
    isEdit() {
      return this.$route.query.type === "edit"
    },
    // 是拆分
    isSplit() {
      return this.$route.query.type === "split"
    }
  },
  created() {},
  mounted: async function () {
    await this.init()
    if (this.isEdit || this.isSplit) {
      this.getDetail()
    } else {
      this.getPlanDetail()
    }
  },
  async activated() {},
  methods: {
    async init() {
      await Promise.all([this.getSupplierAll(), this.getTreeCategoryData()])
      this.documentTypeOptions = await getDictByType("document_type")
      this.planAttributesList = await getDictByType("plan_attributes")
    },
    // 获取采购单详情
    async getDetail() {
      const { data } = await getPoOrderDetailApi({ purchaserOrderNo: this.purchaserOrderNo })
      if (data.code === 0) {
        await this.getCorporationId(data.data.supplierNo)
        await this.changeCorporationId(data.data.corporationId)

        this.form = {
          ...this.form,
          purchaseDocumentType: data.data.purchaseDocumentType + "",
          supplierNo: data.data.supplierNo,
          purchaseOrgId: data.data.corporationId,
          priceModel: data.data.priceModel,
          inWarehouseId: data.data.warehouseId,
          poPurchasePlanCode: data.data.purchasePlanCode,
          purchaseAttributes: data.data.purchaseAttributes,
          needPushShufuFlag: data.data.saleOrderIssuedSoonforStatus === 5 ? false : true // 5: 无需下发数夫
        }
        this.detailData = data.data
        this.tableData = data.data.list.map((item) => {
          return {
            ...item,
            platformCode: item.platformOrderNo,
            productName: item.skuName,
            currentProcurementQuantity: item.purchaseQuantity,
            totalAmount: (item.purchaseQuantity * item.noTaxPrice).toFixed(2)
          }
        })
        this.originTableData = deepClone(this.tableData)
        this.getSupplierOptions(this.form.purchaseDocumentType)
      }
    },
    //品类
    getTreeCategoryData() {
      fetchTreeList().then((response) => {
        this.treeCategoryData = response.data.data
      })
    },
    // 获取采购计划单
    async getPlanDetail() {
      const { data } = await getPurchasePlanDetailApi(this.form.poPurchasePlanCode)
      if (data.code === 0) {
        this.tableData = data.data.poPurchasePlanDetailList.map((item) => ({
          ...item,
          specification: `${item.skuLength} * ${item.skuWidth} * ${item.skuHeight}`,
          packageSpecification: `${item.packageLength} * ${item.packageWidth} * ${item.packageHeight}`,
          noTaxPrice: undefined,
          totalAmount: undefined,
          currentProcurementQuantity: undefined,
          currency: undefined,
          planDelivery: item.expectedDeliveryDate,
          platformCode: item.platformOrderNo,
          currentProcurementQuantity: item.plannedQuantity - item.purchasedQuantity
        }))
        this.purchasePlanDocumentType = data.data.documentType + ""
        this.form = {
          ...this.form,
          purchaseDocumentType: this.purchasePlanDocumentType,
          supplierNo: data.data.supplierCode,
          purchaseAttributes: data.data.planAttributes,
          needPushShufuFlag: data.data.issuedSoonforStatus === 5 ? false : true // 5: 无需下发数夫
        }
        this.detailData = data.data
        this.originTableData = deepClone(this.tableData)
        this.getCorporationId(data.data.supplierCode)
        this.getSupplierOptions(this.form.purchaseDocumentType)
      }
    },

    getSupplierOptions(val) {
      const mapping = {
        0: "SELF_MADE_BY_DOMESTIC",
        1: "SELF_MADE_BY_INDONESIA",
        2: "OUTSCOURING",
        3: "DOMESTIC_FOREIGN_PURCHASES"
      }

      this.supplierOptions = this.initSupplierOptions.filter((item) => item.supplierSource === mapping[Number(val)])
    },

    //获取供应商
    async getSupplierAll() {
      const { data } = await getAllSupplierApi()
      if (data.code === 0) {
        this.supplierOptions = data.data.map((item) => {
          return {
            ...item,
            value: item.supplierNo,
            label: item.supplierName
          }
        })
        this.initSupplierOptions = deepCloneIgnoreNull(this.supplierOptions)
      }
    },
    // 提交
    async handleSubmit(type) {
      if (this.selectList.length === 0) {
        this.$message.warning("请选择产品")
        return
      }
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          for (let item of this.selectList) {
            if (
              item.currentProcurementQuantity === "" ||
              item.currentProcurementQuantity === undefined ||
              item.currentProcurementQuantity <= 0
            ) {
              this.$message.error(`工厂SKU：${item.skuCode} 本次采购数量必须大于0`)
              return
            }
            if (!item.noTaxPrice) {
              this.$message.error(`工厂SKU：${item.skuCode} 没有非税单价`)
              return
            }
          }

          // 是拆分订单是，如果选了DI订单，那么平台订单号必填
          if (this.isSplit && this.form.purchaseAttributes === "DI") {
            for (let item of this.selectList) {
              if (!item.platformCode) {
                this.$message.error(`工厂SKU：${item.skuCode} 平台订单号必填`)
                return
              }
            }
          }

          const items = this.selectList.map((item) => ({
            skuCode: item.skuCode,
            skuId: item.skuId,
            noTaxPrice: item.noTaxPrice,
            purchaseQuantity: item.currentProcurementQuantity,
            splitNum: item.currentProcurementQuantity,
            platform: item.platform,
            site: item.site,
            amount: item.totalAmount,
            poPurchasePlanDetailCode: item.purchasePlanDetailCode,
            currency: item.currency,
            planDelivery: item.planDelivery,
            poDetailId: item.poDetailId,
            poOrderDetailExtensionId: item.poOrderDetailExtensionId,
            purchasePlanDetailCode: item.purchasePlanDetailCode,
            platformCode: item.platformCode
          }))
          this.form.directSubmit = type === "save" ? false : true
          this.form.purchaseOrderNo = this.purchaserOrderNo
          let fn = this.isEdit ? updatePoOrderPageApi : createPurchaseOrderApi
          let res = null
          if (this.isSplit) {
            this.form.originPurchaseOrderNo = this.purchaserOrderNo
            res = await splitPoOrderPageApi({ ...this.form, poOrderSplitDetailCmdList: items })
          } else {
            res = await fn({ ...this.form, items })
          }

          if (res.data.code === 0) {
            this.$message.success("操作成功")
            this.handleCancel()
          }
        }
      })
    },

    handleCancel() {
      // this.$refs.formRef.resetFields()
      // this.getPlanDetail()
      this.$router.$avueRouter.closeTag()
      // this.$router.push({ path: "/purchase/poorder/list" })
      this.$router.go(-1)
    },
    async getCorporationId(val) {
      this.corporationList = []
      this.$set(this.form, "purchaseOrgId", "")
      this.$set(this.form, "priceModel", "")
      if (!val) return
      const { data } = await getCorporation({ supplierNo: val })
      if (data.code === 0) {
        if (data.data && data.data.length) {
          this.corporationList = data.data
        } else {
          this.$message.warning("该供应商没有对应的法人主体，请前往供应商详情页面配置【使用组织】！")
        }
      }
      // 获取价格模式
      const res = await getModelBySupplierNoApi(val)
      this.priceModelOptions = res.data.data
    },
    // 改变法人主体(采购组织)
    changeCorporationId(val) {
      this.warehouseOptions = []
      this.$set(this.form, "inWarehouseId", "")
      this.$set(this.form, "purchaseOrgCode", "")
      if (!val) return
      let { corporationCode } = this.corporationList.find((item) => item.corporationId === val)
      this.$set(this.form, "purchaseOrgCode", corporationCode)
      // 获取仓库
      getWarehouseByCorpCodeApi(corporationCode, { funcState: 1 }).then((res) => {
        if (res.data.code === 0) {
          this.warehouseOptions = res.data.data
        }
      })
    },
    //改变价格模式
    changePriceModel(val) {
      this.getNoTaxPrice()
    },

    // 获取非税单价
    async getNoTaxPrice() {
      const skuId = this.tableData.map((item) => item.skuId).join(",")
      const params = {
        skuId,
        supplierNo: this.form.supplierNo,
        priceModel: this.form.priceModel
      }
      const { data } = await getPurchaseChangeOrderSkuValidPriceApi(params)
      if (data.data.length > 0) {
        // 创建一个映射表 { skuId: { price, currency } }
        const priceMap = new Map(
          data.data.map((item) => [Number(item.skuId), { price: item.price, currency: item.currency }])
        )

        this.tableData.forEach((row) => {
          if (priceMap.has(Number(row.skuId))) {
            // 存在于 data.data 中，赋值
            const { price, currency } = priceMap.get(Number(row.skuId))
            row.noTaxPrice = price
            row.currency = currency
            this.changeCurrentProcurementQuantity(row)
          } else {
            // 不存在于 data.data 中，清空
            row.noTaxPrice = ""
            row.currency = ""
            row.totalAmount = ""
          }
        })
      } else {
        this.$message.error(data.msg)
        this.tableData.forEach((row) => {
          row.noTaxPrice = ""
          row.currency = ""
          row.totalAmount = ""
        })
      }
    },
    // 计算采购总金额
    changeCurrentProcurementQuantity(row) {
      if (
        (!row.noTaxPrice && row.noTaxPrice !== 0) ||
        (!row.currentProcurementQuantity && row.currentProcurementQuantity !== 0)
      ) {
        // this.$message.error("请先选择价格模式")
        return
      }
      this.$set(row, "totalAmount", (row.currentProcurementQuantity * row.noTaxPrice).toFixed(2))
    },
    handleChange() {
      this.createOrderForm.categories = []
      this.createOrderForm.categoryId.forEach((item) => {
        this.createOrderForm.categories.push(item[item.length - 1])
      })
    },
    searchChange() {
      if (
        !this.createOrderForm.skuCode &&
        !this.createOrderForm.categoryId?.length &&
        !this.createOrderForm.categories?.length
      ) {
        this.tableData = this.originTableData
        return
      }
      if (this.createOrderForm.skuCode) {
        console.log("this.createOrderForm.skuCode", this.createOrderForm.skuCode)
        if (this.createOrderForm.skuCode.includes(",")) {
          const skuCodes = this.createOrderForm.skuCode.split(",")
          this.tableData = this.tableData.filter((item) => skuCodes.includes(item.skuCode))
        } else {
          this.tableData = this.tableData.filter((item) => item.skuCode === this.createOrderForm.skuCode)
        }
      }
      if (this.createOrderForm.categories?.length) {
        this.tableData = this.tableData.filter((item) =>
          this.createOrderForm.categories.includes(Number(item.categoryId))
        )
      }
    },
    searchReset() {
      this.createOrderForm = {
        skuCode: "",
        categoryId: [],
        categories: []
      }
    },
    selectionChange(list) {
      this.selectList = list
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-radio {
  margin-right: 10px;
}

::v-deep .el-cascader__tags {
  display: block;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

::v-deep .el-radio__label {
  padding-left: 5px;
}
</style>
