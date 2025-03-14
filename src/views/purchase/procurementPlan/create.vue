<template>
  <div>
    <basic-container>
      <detail-template
        :value="1"
        :options="{
          template: 1,
          title: '采购计划单',
          list: [{ label: '采购计划员', value: userInfo.displayname }]
        }"
      >
      </detail-template>

      <detail-wrapper :options="{ title: '基本信息' }">
        <el-form ref="formRef" :model="form" :rules="rules" label-suffix=":">
          <el-row>
            <el-col :span="8">
              <el-form-item label="单据类型" prop="documentType" label-width="85px">
                <el-radio-group v-model="form.documentType" @change="changeDocumentType">
                  <el-radio v-for="item in documentTypeOptions" :key="item" :label="item.value">
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="供应商" prop="supplierCode">
                <el-select v-model="form.supplierCode" size="small" placeholder="供应商" filterable clearable>
                  <el-option
                    v-for="item in supplierOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="计划单属性" prop="planAttributes">
                <el-radio-group v-model="form.planAttributes" disabled>
                  <el-radio v-for="item in procurementPlanAttrOptions" :key="item.value" :label="item.value">
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否下发数夫" prop="needPushShufuFlag">
                <el-radio-group v-model="form.needPushShufuFlag" :disabled="form.documentType != 1">
                  <el-radio :label="true"> 是 </el-radio>
                  <el-radio :label="false"> 否 </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-form-item label="备注" prop="remark" label-width="50px">
                <el-input type="textarea" :rows="2" placeholder="备注" v-model="form.remark" clearable> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </detail-wrapper>

      <detail-wrapper :options="{ title: '产品信息', customContentStyle: { padding: '8px' } }">
        <el-form :model="productForm" ref="formProductRef" inline>
          <avue-crud :data="productForm.tableData" :option="createTableOption">
            <template slot-scope="scope" slot="linkSkuCode">
              <el-form-item :prop="`tableData.${scope.row.$index}.linkSkuCode`" :rules="productRules.linkSkuCode">
                <el-input
                  v-model="scope.row.linkSkuCode"
                  placeholder="链接SKU"
                  size="small"
                  clearable
                  :disabled="isContainer"
                  @change="changeLinkSkuCode(scope.row)"
                >
                </el-input>
              </el-form-item>
            </template>

            <template slot-scope="scope" slot="plannedQuantity">
              <el-form-item
                :prop="`tableData.${scope.row.$index}.plannedQuantity`"
                :rules="productRules.plannedQuantity"
              >
                <el-input
                  v-model="scope.row.plannedQuantity"
                  placeholder="采购计划数量"
                  size="small"
                  clearable
                  :disabled="isContainer"
                  @change="changePlannedQuantity($event, scope.row)"
                ></el-input>
              </el-form-item>
            </template>
            <template slot-scope="scope" slot="platform">
              <el-form-item :prop="`tableData.${scope.row.$index}.platform`" :rules="productRules.platform">
                <div style="display: flex">
                  <el-select
                    v-model="scope.row.platform"
                    size="small"
                    placeholder="平台"
                    @change="changePlatform(scope.row)"
                    clearable
                    filterable
                    :disabled="isContainer"
                  >
                    <el-option
                      v-for="item in platformOptions"
                      :key="item.platformTypeCode"
                      :label="item.platformTypeName"
                      :value="item.platformTypeCode"
                    >
                    </el-option>
                  </el-select>
                  <el-button
                    size="small"
                    type="text"
                    :disabled="isContainer"
                    @click="fillData(scope.row, 'platform')"
                    v-if="scope.row.$index === 0"
                  >
                    填充
                  </el-button>
                </div>
              </el-form-item>
            </template>
            <!-- 站点 -->
            <template slot="site" slot-scope="scope">
              <el-form-item :prop="`tableData.${scope.row.$index}.site`" :rules="productRules.site">
                <div style="display: flex">
                  <el-select
                    v-model="scope.row.site"
                    :disabled="!scope.row.platform || isContainer"
                    size="small"
                    placeholder="站点"
                    clearable
                    filterable
                    @change="changeSite(scope.row)"
                  >
                    <el-option
                      v-for="item in scope.row.sitArr"
                      :key="item.sitEnName"
                      :label="item.sitEnName"
                      :value="item.sitEnName"
                    >
                    </el-option>
                  </el-select>
                  <el-button
                    size="small"
                    type="text"
                    :disabled="isContainer"
                    @click="fillData(scope.row, 'site')"
                    v-if="scope.row.$index === 0"
                  >
                    填充
                  </el-button>
                </div>
              </el-form-item>
            </template>

            <template slot="expectedDeliveryDate" slot-scope="scope">
              <el-form-item
                :prop="`tableData.${scope.row.$index}.expectedDeliveryDate`"
                :rules="productRules.expectedDeliveryDate"
              >
                <el-date-picker
                  v-model="scope.row.expectedDeliveryDate"
                  type="date"
                  size="small"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="销售期望交期"
                  style="width: 150px"
                  clearable
                >
                </el-date-picker>
              </el-form-item>
            </template>

            <template slot="overseasWarehouseRegion" slot-scope="scope">
              <el-form-item
                :prop="`tableData.${scope.row.$index}.overseasWarehouseRegion`"
                :rules="scope.row.site === 'US' ? productRules.overseasWarehouseRegion : [{ required: false }]"
              >
                <el-select
                  v-model="scope.row.overseasWarehouseRegion"
                  size="small"
                  placeholder="海外仓所属区域"
                  filterable
                  clearable
                  @visible-change="visibleChangeOverseas($event, scope.row)"
                >
                  <el-option
                    v-for="item in overseasWarehouseAreaOptions"
                    :key="item.mappingCode"
                    :label="item.mappingName"
                    :value="item.mappingCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>

            <template slot-scope="scope" slot="operate">
              <div style="font-size: 18px; cursor: pointer">
                <i
                  class="el-icon-circle-plus-outline"
                  style="margin-right: 10px"
                  @click="handleAddRow(scope.row.$index)"
                ></i>
                <i class="el-icon-delete" @click="handleDelRow(scope.row.$index)"></i>
              </div>
            </template>
          </avue-crud>
        </el-form>
      </detail-wrapper>

      <div style="display: flex; justify-content: flex-end; margin-right: 20px">
        <el-button type="primary" @click="handleSubmit('save')">保 存</el-button>
        <el-button v-if="permissions.purchase_plan_audit" type="primary" @click="handleSubmit('submit')">
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
import { getPlayTypeAll, getSit } from "@/api/purchase/order/poorder"
import { getDictByType } from "@/util/auth.js"
import {
  addPurchasePlanApi,
  getPurchasePlanDetailApi,
  getLinkSkuInfoApi,
  getDeliveryPlanDetailApi
} from "@/api/purchase/procurementPlan"
import { getAll as getAllSupplierApi } from "@/api/supplier/posupplier"
import { deepClone } from "@/components/avue/utils/util"

export default {
  name: "procurementPlanCreate",
  components: {},
  data() {
    return {
      form: {
        purchasePlanCode: this.$route.query?.purchasePlanCode,
        documentType: null,
        supplierCode: "",
        planAttributes: "OTHER",
        remark: "",
        saveOperateType: "SAVE",
        directSubmit: false,
        id: undefined,
        needPushShufuFlag: true,
        deliveryPlanCode: this.$route.query?.deliveryPlanCode
      },
      documentTypeOptions: [],
      procurementPlanAttrOptions: [],
      rules: {
        documentType: [{ required: true, message: "请选择类型", trigger: "change" }],
        planAttributes: [{ required: true, message: "请选择计划单属性", trigger: "change" }]
      },
      productRules: {
        linkSkuCode: [{ required: true, message: "请输入链接SKU", trigger: "blur" }],
        plannedQuantity: [{ required: true, message: "请输入采购计划数量", trigger: "blur" }],
        platform: [{ required: true, message: "请选择平台", trigger: "change" }],
        site: [{ required: true, message: "请选择站点", trigger: "change" }],
        expectedDeliveryDate: [{ required: true, message: "请选择销售期望交期", trigger: "change" }],
        overseasWarehouseRegion: [{ required: true, message: "请选择区域", trigger: "change" }]
      },
      createTableOption,
      productForm: {
        tableData: []
      },
      initTableData: {
        standardSpuCode: "",
        standardSkuCode: "",
        skuCode: "",
        productName: "",
        linkSkuCode: "",
        plannedQuantity: undefined,
        platform: "",
        site: "",
        expectedDeliveryDate: "",
        overseasWarehouseRegion: ""
      },
      platformOptions: [],
      sitOptions: [],
      overseasWarehouseAreaOptions: [],
      warehouseRegion: [],
      supplierOptions: [],
      supplierOptionsInitData: [],
      type: this.$route.query.type
    }
  },
  computed: {
    ...mapGetters(["permissions", "userInfo"]),
    isContainer() {
      return this.type === "container"
    }
  },
  created() {},
  mounted: async function () {
    if (this.isContainer) {
      this.form.planAttributes = "DI"
    } else {
      this.form.planAttributes = "OTHER"
    }
    await this.init()
    if (this.form.purchasePlanCode) {
      this.getDetail()
    } else {
      if (this.form.deliveryPlanCode) {
        this.getDetailPlanDetail()
      } else {
        this.productForm.tableData = [{ ...this.initTableData }]
      }
    }
  },
  async activated() {},
  methods: {
    async init() {
      await Promise.all([this.getPlatformAll(), this.getSitAll(), this.getSupplierAll()])
      const [documentTypeOptions, procurementPlanAttrOptions, warehouseRegion] = await Promise.all([
        getDictByType("purchase_plan_document_type"),
        getDictByType("plan_attributes"),
        getDictByType("warehouse_region")
      ])
      this.documentTypeOptions = documentTypeOptions
      this.procurementPlanAttrOptions = procurementPlanAttrOptions
      this.warehouseRegion = warehouseRegion
    },
    // 获取详情
    async getDetail() {
      const { data } = await getPurchasePlanDetailApi(this.form.purchasePlanCode)
      if (data.code === 0) {
        Object.keys(this.form).forEach((key) => {
          this.form[key] = data.data[key]
        })
        this.form.documentType = data.data.documentType + ""
        this.form.needPushShufuFlag = data.data.issuedSoonforStatus === 5 ? false : true // 5: 无需下发数夫
        data.data.poPurchasePlanDetailList.forEach((item) => {
          this.getOverseas(item)
        })
        this.productForm.tableData = data.data.poPurchasePlanDetailList
      }
    },
    // 获取送货计划详情
    async getDetailPlanDetail() {
      const { data } = await getDeliveryPlanDetailApi(this.form.deliveryPlanCode)
      if (data.code === 0) {
        this.productForm.tableData = data.data.planDetailVOList.map((item) => {
          return {
            ...item,
            plannedQuantity: item.loadedQuantity
          }
        })

        this.productForm.tableData.forEach((item) => {
          delete item.id
          // this.getLinkSkuCode(item)
        })
      }
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
        this.supplierOptionsInitData = deepClone(this.supplierOptions)
      }
    },
    // 获取所有平台
    async getPlatformAll() {
      const { data } = await getPlayTypeAll()
      if (data.code === 0) {
        this.platformOptions = data.data.map((item) => ({
          platformTypeCode: item.platformTypeCode,
          platformTypeName: item.platformTypeName,
          platformTypeId: item.platformTypeId
        }))
      }
    },
    // 获取所有站点
    getSitAll() {
      getSit([]).then((res) => {
        if (res.status === 200) {
          this.sitOptions = res.data
        }
      })
    },

    // 根据平台获取站点
    changePlatform(row) {
      this.$set(row, "site", "")
      if (!row.platform) return
      const platformTypeId = this.platformOptions.find((item) => item.platformTypeCode === row.platform).platformTypeId
      const sitArr = this.sitOptions.filter((item) => platformTypeId === item.sitType)
      this.$set(row, "sitArr", sitArr)
    },
    changeSite(row) {
      this.$set(row, "overseasWarehouseRegion", "")
      this.getLinkSkuCode(row)
    },
    // 获取海外仓所属区域
    getOverseas(row) {
      this.overseasWarehouseAreaOptions =
        this.warehouseRegion.find((item) => item.value === row.site)?.dictMappings || []
    },
    // 填充数据
    fillData(row, key) {
      if (!row[key]) {
        this.$message.warning("请先选择或者填写数据，再进行填充！")
        return
      }
      const tableData = this.productForm.tableData
      if (key === "platform") {
        for (let i = 0; i < tableData.length; i++) {
          this.$set(tableData[i], key, row[key])
          const platformTypeId = this.platformOptions.find((item) => item.platformTypeCode === row[key]).platformTypeId
          const sitArr = this.sitOptions.filter((item) => platformTypeId === item.sitType)
          this.$set(tableData[i], "sitArr", sitArr)
        }
      } else if (key === "site") {
        for (let i = 0; i < tableData.length; i++) {
          let sitArr = tableData[i].sitArr
          for (let j = 0; j < sitArr.length; j++) {
            if (sitArr[j].sitEnName === row[key]) {
              this.$set(tableData[i], key, row[key])
            }
          }
        }
        tableData.forEach((item) => {
          this.getLinkSkuCode(item)
        })
      }
      this.$message.success("填充成功")
    },
    // 添加数据行
    handleAddRow(index) {
      if (this.isContainer) {
        this.$message.warning("已排柜，不允许修改")
        return
      }
      this.productForm.tableData.push({ ...this.initTableData })
    },
    // 删除数据行
    handleDelRow(index) {
      if (this.isContainer) {
        this.$message.warning("已排柜，不允许修改")
        return
      }
      if (this.productForm.tableData.length === 1) {
        this.$message.warning("至少保留一条数据")
        return
      }
      this.productForm.tableData.splice(index, 1)
    },
    changeLinkSkuCode(row) {
      this.getLinkSkuCode(row)
    },
    // 获取链接sku 信息
    async getLinkSkuCode(row) {
      const { linkSkuCode, platform, site } = row
      console.log("linkSkuCode, platform, site", linkSkuCode, platform, site)
      if (!linkSkuCode || !platform || !site) return
      const params = {
        linkSkuCode: linkSkuCode ? linkSkuCode : undefined,
        platform: platform ? platform : undefined,
        site: site ? site : undefined
      }
      getLinkSkuInfoApi(params)
        .then(({ data }) => {
          if (data.code === 0) {
            const { standardSkuCode, standardSpuCode, factorySkuCodeList } = data.data?.[0]
            const factorySkuCodeListData = factorySkuCodeList.filter(
              (item) => item.purchaseState === 0 && item.saleStatus === 0
            )
            this.$set(row, "standardSpuCode", standardSpuCode)
            this.$set(row, "standardSkuCode", standardSkuCode)
            this.$set(row, "productName", factorySkuCodeListData?.[0]?.productName)
            this.$set(row, "skuCode", factorySkuCodeListData?.[0]?.skuCode)
          }
        })
        .catch((err) => {
          this.$set(row, "standardSpuCode", "")
          this.$set(row, "standardSkuCode", "")
          this.$set(row, "productName", "")
          this.$set(row, "skuCode", "")
        })
    },
    // 提交
    async handleSubmit(type) {
      this.$refs.formRef.validate(async (valid) => {
        const productValid = await this.$refs.formProductRef.validate()

        if (valid && productValid) {
          console.log(this.form)
          console.log(this.productForm.tableData)
          this.form.directSubmit = type === "save" ? false : true
          const { data } = await addPurchasePlanApi({
            ...this.form,
            poPurchasePlanDetailList: this.productForm.tableData
          })
          if (data.code === 0) {
            this.$message.success("操作成功")
            // this.$refs.formRef.resetFields()
            // this.productForm.tableData = [{ ...this.initTableData }]
            this.handleCancel()
          }
        }
      })
    },
    handleCancel() {
      this.$router.$avueRouter.closeTag()
      this.$router.go(-1)
    },
    changeDocumentType(val) {
      // const mapping = {
      //   0: "SELF_MADE_BY_DOMESTIC",
      //   1: "SELF_MADE_BY_INDONESIA",
      //   2: "OUTSCOURING"
      // }

      // this.supplierOptions = this.supplierOptionsInitData.filter((item) => item.supplierSource === mapping[val])
      this.form.needPushShufuFlag = val == 1 ? true : false
    },
    visibleChangeOverseas(status, row) {
      if (status) {
        this.getOverseas(row)
      }
    },
    changePlannedQuantity(val, row) {
      if (!val) return
      const newVal = val.replace(/[^0-9]/g, "")
      if (newVal || newVal === 0) {
        this.$set(row, "plannedQuantity", newVal)
      } else {
        this.$set(row, "plannedQuantity", null)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item {
  margin-bottom: 10px;
}

::v-deep .el-table .el-form-item {
  margin-bottom: 0;
}

::v-deep .el-radio {
  margin-right: 10px;
}
</style>
