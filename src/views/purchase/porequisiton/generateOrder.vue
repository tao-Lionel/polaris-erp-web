<template>
  <div>
    <basic-container>
      <el-form ref="createOrderForm" :model="createOrderForm" id="createOrderDialog">
        <detail-wrapper :options="{ title: '基础信息' }">
          <el-form ref="orderObjFormRef" :model="orderObj" :inline="true" label-width="auto" :rules="orderObjFormRules">
            <el-row style="border-top: 1px solid #efefef; padding-top: 10px">
              <el-col :span="8">
                <el-form-item label="供应商" prop="supplierNo">
                  <el-select
                    v-model="orderObj.supplierNo"
                    size="small"
                    placeholder="请选择"
                    filterable
                    clearable
                    @change="getCorporationId"
                  >
                    <el-option v-for="item in supplierList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="corporationId" label="法人主体">
                  <el-select
                    size="small"
                    v-model="orderObj.corporationId"
                    clearable
                    filterable
                    placeholder="请输入法人主体"
                    :disabled="!orderObj.supplierNo"
                    @change="changeCorporationId"
                  >
                    <el-option
                      v-for="item in corporationArr"
                      :key="item.corporationId"
                      :label="item.corporationName"
                      :value="item.corporationId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="仓储方" prop="warehouseId">
                  <el-select v-model="orderObj.warehouseId" size="small" filterable clearable placeholder="请选择">
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
            <el-row>
              <el-col :span="8">
                <el-form-item label="价格模式" prop="priceModel">
                  <el-select v-model="orderObj.priceModel" size="small" filterable clearable placeholder="请选择">
                    <el-option
                      v-for="item in priceModelOptions"
                      :key="item.value"
                      :label="item.description"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采购预计交期" prop="planDelivery">
                  <el-date-picker
                    v-model="orderObj.planDelivery"
                    size="small"
                    type="date"
                    placeholder="请选择采购预计交期"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </detail-wrapper>

        <avue-crud
          ref="createOrder"
          :data="createOrdeData"
          :option="createOrderTableOption"
          @search-change="createOrderSearch"
          @search-reset="createOrderReset"
          @selection-change="createOrderChange"
        >
          <template slot="search">
            <el-form-item prop="skuCode">
              <el-input
                v-model="createOrderForm.skuCode"
                size="small"
                v-search-input
                placeholder="工厂SKU"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item class="exclude-label" prop="categoryId">
              <el-cascader
                expand-trigger="hover"
                :props="{ multiple: true }"
                v-model="categoryId"
                :show-all-levels="false"
                :options="treeCategoryData"
                @change="handleChange"
                clearable
                size="small"
                placeholder="品类"
              ></el-cascader>
            </el-form-item>
          </template>

          <template slot="thisPurchaseQuantity" slot-scope="scope">
            <el-input-number
              style="width: 100%"
              v-model="scope.row.thisPurchaseQuantity"
              placeholder="请输入"
              :min="0"
              :max="scope.row.requisitionQuantity - scope.row.purchaseQuantity"
              :controls="false"
              size="mini"
            ></el-input-number>
          </template>

          <template slot="tableBeforeSlot">
            <div style="position: relative; font-size: 13px">
              <div style="position: absolute; top: 7px; left: 300px; z-index: 100">
                <span>汇总数量：</span><span>{{ thisPurchaseQuantity }}</span>
              </div>
            </div>
          </template>
        </avue-crud>
      </el-form>
      <div style="display: flex; justify-content: center; padding: 10px">
        <el-button size="small" @click="createOrderCancel">取 消</el-button>
        <el-button size="small" type="primary" @click="createOrderConfirm">确 定</el-button>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { fetchList, getCorporation, getModelBySupplierNoApi, createOrder } from "@/api/purchase/porequisiton"
import { getWarehouseByCorpCodeApi } from "@/api/baseSetup/bsewarehouse"
import { createOrderTableOption } from "@/const/crud/purchase/porequisiton"
import { getAll as getAllSupplierApi } from "@/api/supplier/posupplier"
import { fetchTreeList } from "@/api/product/prdskucategory"

export default {
  name: "porequisitonGenerateOrder",
  components: {},
  data() {
    return {
      requisitionBatchNo: this.$route.query.requisitionBatchNo,
      createOrderForm: {
        categories: [],
        size: -1,
        current: -1,
        requisitionBatchNo: ""
      },
      createOrdeData: [],
      createOrderTableOption: createOrderTableOption,
      orderObj: {
        planDelivery: "",
        supplierNo: "",
        corporationId: "",
        priceModel: "",
        warehouseId: ""
      },
      orderObjFormRules: {
        supplierNo: [{ required: true, message: "请选择供应商", trigger: "blur" }],
        corporationId: [{ required: true, message: "请选择法人", trigger: "blur" }],
        warehouseId: [{ required: true, message: "请选择仓储方", trigger: "blur" }],
        priceModel: [{ required: true, message: "请选择价格模式", trigger: "blur" }],
        planDelivery: [{ required: true, message: "请选择采购预计交期", trigger: "blur" }]
      },
      priceModelOptions: [],
      supplierList: [],
      corporationArr: [],
      warehouseOptions: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime()
        }
      },
      treeCategoryData: [],
      categoryId: [],
      createOrderChoice: [],
      thisPurchaseQuantity: 0
    }
  },
  created() {},
  mounted: function () {
    this.getList()
    this.getSupplierAll()
    this.getTreeCategoryData()
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getList() {
      const params = {
        size: -1,
        current: -1,
        requisitionBatchNo: this.requisitionBatchNo
      }
      Object.assign(this.createOrderForm, params)
      fetchList(this.createOrderForm).then((res) => {
        if (res.data.code === 0) {
          res.data.data.records.forEach((item, index) => {
            item.purchaseOuantity = item.purchaseOuantity ? item.purchaseOuantity : 0
            item.thisPurchaseQuantity = item.requisitionQuantity - item.purchaseOuantity
          })
          this.createOrdeData = res.data.data.records.filter((item) => item.requisitionQuantity > item.purchaseOuantity)
        }
      })
      this.orderObj = {}
    },
    //品类
    getTreeCategoryData() {
      fetchTreeList().then((response) => {
        this.treeCategoryData = response.data.data
      })
    },
    //获取供应商
    async getSupplierAll() {
      const { data } = await getAllSupplierApi()
      if (data.code === 0) {
        data.data.forEach((item) => {
          this.supplierList.push({
            value: item.supplierNo,
            label: item.supplierName
          })
        })
      }
    },
    getCorporationId(val) {
      this.corporationArr = []
      this.$set(this.orderObj, "corporationId", "")
      if (!val) return
      getCorporation({ supplierNo: val }).then((res) => {
        if (res.data.code === 0) {
          if (res.data.data && res.data.data.length) {
            this.corporationArr = res.data.data
          } else {
            this.$message.warning("该供应商没有对应的法人主体，请前往供应商详情页面配置【使用组织】！")
          }
        }
      })
      // 获取价格模式
      getModelBySupplierNoApi(val).then((res) => {
        console.log("res===", res)
        this.priceModelOptions = res.data.data
      })
    },
    // 改变法人主体
    changeCorporationId(val) {
      this.warehouseOptions = []
      this.$set(this.orderObj, "warehouseId", "")
      if (!val) return
      let { corporationCode } = this.corporationArr.find((item) => item.corporationId === val)
      // 获取仓库
      getWarehouseByCorpCodeApi(corporationCode, { funcState: 1 }).then((res) => {
        if (res.data.code === 0) {
          this.warehouseOptions = res.data.data
        }
      })
    },
    createOrderChange(val) {
      this.createOrderChoice = val
      this.thisPurchaseQuantity = this.createOrderChoice.reduce((prev, cuv) => {
        return prev + (cuv.thisPurchaseQuantity ? cuv.thisPurchaseQuantity : 0)
      }, 0)
    },
    createOrderSearch() {
      this.$refs.createOrder.selectClear()
      fetchList(this.createOrderForm).then((res) => {
        if (res.data.code === 0) {
          res.data.data.records.forEach((item, index) => {
            item.purchaseOuantity = item.purchaseOuantity ? item.purchaseOuantity : 0
            item.thisPurchaseQuantity = item.requisitionQuantity - item.purchaseOuantity
          })
          this.createOrdeData = res.data.data.records.filter((item) => item.requisitionQuantity > item.purchaseOuantity)
        }
      })
    },
    createOrderReset() {
      this.createOrderForm.categories = []
      this.categoryId = ""
      this.createOrderForm.skuCode = ""
    },
    handleChange() {
      this.createOrderForm.categories = []
      this.categoryId.forEach((item) => {
        this.createOrderForm.categories.push(item[item.length - 1])
      })
      console.log(this.createOrderForm.categories)
    },
    createOrderConfirm() {
      this.$refs.orderObjFormRef.validate((valid) => {
        if (valid) {
          if (!this.createOrderChoice.length) {
            this.$message.warning("请选择要生成订单的请购单明细")
            return
          }

          for (let i = 0; i < this.createOrderChoice.length; i++) {
            if (!this.createOrderChoice[i].thisPurchaseQuantity) {
              this.$message.warning(`请输入SKU：${this.createOrderChoice[i].skuCode}的实采数量`)
              return
            }
          }

          let params = {
            poOrder: {},
            poOrderDetailList: []
          }

          if (this.createOrderChoice.length) {
            params.poOrder = {
              supplierNo: this.orderObj.supplierNo,
              corporationId: this.orderObj.corporationId,
              warehouseId: this.orderObj.warehouseId,
              priceModel: this.orderObj.priceModel
              // remarks: this.selectList[0].notes
            }
          }
          params.poOrderDetailList = this.createOrderChoice.map((item) => {
            return {
              expectDelivery: item.expectDelivery,
              skuId: item.skuId,
              requisitionNo: item.requisitionNo,
              // remarks: item.remarks,
              planDelivery: this.orderObj.planDelivery,
              thisPurchaseQuantity: item.thisPurchaseQuantity
            }
          })

          createOrder(params).then((response) => {
            if (response.data.code === 0) {
              this.$refs.createOrder.selectClear()
              this.$notify({
                title: "成功",
                message: "生成订单成功",
                type: "success",
                duration: 2000
              })
              this.createOrderCancel()
            } else if (response.data.code === 1) {
              this.$message.error(response.data.msg)
              return
            } else {
              this.$message.error("操作失败")
              return
            }
          })
        }
      })
    },
    createOrderCancel() {
      this.createOrderForm.categories = []
      this.categoryId = ""
      this.$router.$avueRouter.closeTag()
      this.$router.push({
        path: "/purchase/porequisiton/list"
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
