<template>
  <div>
    <basic-container>
      <!-- 生成送货单 -->
      <h2 style="padding-bottom: 10px">生成送货单</h2>
      <avue-crud
        ref="createOrder"
        :page="page"
        :data="createOrderData"
        :option="createOrderTableOption"
        @search-change="createOrderSearch"
        @search-reset="createOrderReset"
        @selection-change="createOrderChange"
        @current-change="currentChange"
        @size-change="sizeChange"
      >
        <!-- <template slot="search">
          <el-form :model="createOrderForm" id="createOrderDialog">
            <el-form-item label="SKU" prop="skuCode">
              <el-input
                v-model="createOrderForm.skuCode"
                placeholder="请输入SKU"
                size="small"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item label="品类" prop="categoryId">
              <el-cascader
                expand-trigger="hover"
                :props="{ multiple: true }"
                v-model="categoryId"
                :show-all-levels="false"
                :options="treeCategoryData"
                @change="handleChange"
                clearable
                size="small"
              ></el-cascader>
            </el-form-item>
          </el-form>
        </template> -->
        <template slot="tableBeforeSlot">
          <el-form
            ref="orderObjRef"
            :model="orderObj"
            :rules="orderObjRules"
            inline
            style="border-top: 1px solid #efefef; padding-top: 10px"
          >
            <el-form-item label="送货时间" prop="deliveryDate">
              <el-date-picker
                style="width: 100%"
                v-model="orderObj.deliveryDate"
                clearable
                size="small"
                type="datetime"
                placeholder="请选择"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="出货柜号" prop="shippingContainerNo">
              <el-input v-model="orderObj.shippingContainerNo" size="small" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item prop="warehouseId" label="仓库">
              <el-select disabled v-model="orderObj.warehouseId" size="small" filterable clearable placeholder="请输入">
                <el-option
                  v-for="item in warehouseOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>

        <template slot="deliveryQuantity" slot-scope="scope">
          <el-input-number
            style="width: 100%"
            v-model="scope.row.deliveryQuantity"
            @change="handleDelivery(scope.row)"
            placeholder="请输入"
            :min="0"
            :max="scope.row.unDeliveryQuantity"
            :controls="false"
            clearable
            size="mini"
          ></el-input-number>
        </template>

        <template slot="tableBeforeSlot">
          <div style="position: relative; font-size: 13px">
            <div style="position: absolute; top: 7px; left: 300px; z-index: 100">
              <span>汇总数量：</span><span>{{ deliveryQuantityTotal }}</span>
              <span style="margin-left: 30px">汇总金额：</span><span>{{ deliveryAmountTotal.toFixed(2) }}</span>
            </div>
          </div>
        </template>
      </avue-crud>

      <div style="display: flex; justify-content: center; margin: 10px 0">
        <el-button size="small" @click="createOrderCancel">取 消</el-button>
        <el-button size="small" type="primary" @click="createOrderConfirm">确 定</el-button>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { getPoOrderDetailPage, createDelivery } from "@/api/purchase/order/poorder"
import { createOrderTableOption } from "@/const/crud/purchase/order/poorder"
import { fetchTreeList } from "@/api/product/prdskucategory"
import { getWarehouseByCorpCodeApi } from "@/api/baseSetup/bsewarehouse"
import { generateDelivery } from "@/api/purchase/containerLoadingPlan/index.js"
import { createDeliveryV2 } from "@/api/purchase/containerLoadingPlan/index.js"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"

export default {
  name: "generateDeliveryNote",
  components: {},
  data() {
    return {
      orderObjRules: {
        deliveryDate: [{ required: true, message: "请选择送货时间", trigger: "blur" }],
        warehouseId: [{ required: true, message: "请选择仓库", trigger: "blur" }],
        shippingContainerNo: [{ required: true, message: "请输入出货柜号", trigger: "blur" }]
      },
      createOrderTableOption,
      orderObj: {
        deliveryDate: "",
        warehouseId: "",
        shippingContainerNo: ""
      },
      createOrderData: [],
      createOrderForm: {
        categories: [],
        skuCode: "",
        purchaseOrderNo: ""
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      treeCategoryData: [],
      categoryId: [],
      createOrderChoice: [],
      warehouseByCorporationOptions: [],
      warehouseId: this.$route.query.warehouseId,
      purchaseOrderNo: this.$route.query.purchaseOrderNo,
      corporationCode: this.$route.query.corporationCode,
      poContractNo: this.$route.query.poContractNo,
      requisitionBatchNo: this.$route.query.requisitionBatchNo,
      warehouseOptions: []
    }
  },
  created() {},
  mounted: function () {
    this.init()
  },
  computed: {
    ...mapGetters(["permissions"]),
    deliveryQuantityTotal() {
      return this.createOrderChoice.reduce((prev, cuv) => {
        return prev + (cuv.deliveryQuantity ? cuv.deliveryQuantity : 0)
      }, 0)
    },
    deliveryAmountTotal() {
      return this.createOrderChoice.reduce((prev, cuv) => {
        return prev + (cuv.amount ? cuv.amount : 0)
      }, 0)
    }
  },
  methods: {
    async getList() {
      const { deliveryPlanCode } = this.$route.query
      if (deliveryPlanCode) {
        const { data } = await generateDelivery({
          deliveryPlanCode: deliveryPlanCode || "SP2501230003",
          pageSize: this.page.pageSize,
          page: this.page.currentPage
        })
        console.log("data", data)
        if (data.code === 0) {
          data.data.records.forEach((item) => {
            item.deliveryQuantity = item.unDeliveryQuantity
            item.amount = parseFloat((item.price * item.deliveryQuantity).toFixed(2))
          })
          this.createOrderData = data.data.records
          this.page.total = data.data.total
          if (data.data.records.length > 0) {
            this.orderObj.warehouseId = data.data.records[0].warehouseId
          }
        }
      }
    },
    init() {
      fetchTreeList().then((response) => {
        this.treeCategoryData = response.data.data
      })
      const { from } = this.$route.query
      this.getList()
      this.getWarehouseList()
    },

    /**
     * 查询仓库
     */ getWarehouseList() {
      var query = {
        funcState: "1",
        delFlag: "0",
        isFba: false
      }
      this.warehouseInOptions = []
      getAllWarehouse(query).then((response) => {
        var data = response.data.data
        if (data && data.length > 0) {
          this.warehouseOptions = data.map((item) => {
            return {
              value: item.warehouseId,
              label: item.warehouseName
            }
          })
        }
      })
    },

    createOrderSearch() {
      this.getList()
      // getPoOrderDetailPage(this.createOrderForm).then((res) => {
      //   if (res.data.code === 0) {
      //     if (this.orderObj.planDelivery) {
      //       res.data.data.records.forEach((item) => {
      //         item.a = this.orderObj.planDelivery
      //       })
      //     }
      //     res.data.data.records.forEach((item) => {
      //       item.deliveryQuantity = item.unDeliveryQuantity
      //       item.amount = parseFloat((item.price * item.deliveryQuantity).toFixed(2))
      //     })
      //     this.createOrderData = res.data.data.records
      //   }
      // })
    },
    createOrderReset() {
      this.createOrderForm.skuCode = ""
      this.createOrderForm.categories = []
      this.categoryId = ""
    },
    createOrderChange(val) {
      this.createOrderChoice = val
    },
    handleChange() {
      this.createOrderForm.categories = []
      this.categoryId.forEach((item) => {
        this.createOrderForm.categories.push(item[item.length - 1])
      })
      console.log(this.createOrderForm.categories)
    },
    handleDelivery(row) {
      console.log(row)
      row.amount = parseFloat((row.price * row.deliveryQuantity).toFixed(2))
    },

    createOrderConfirm() {
      if (!this.createOrderChoice.length) {
        this.$message.warning("请选择要生成送货单的明细")
        return
      }
      this.$refs.orderObjRef.validate((valid) => {
        if (valid) {
          for (let i = 0; i < this.createOrderChoice.length; i++) {
            if (!this.createOrderChoice[i].deliveryQuantity) {
              this.$message.warning(`请输入SKU：${this.createOrderChoice[i].skuCode}的送货数量`)
              return
            }
          }

          this.createOrderChoice.forEach((item) => (item.shippingContainerNo = this.orderObj.shippingContainerNo))

          let params = {
            poContractNo: this.poContractNo,
            purchaseOrderNo: this.purchaseOrderNo,
            requisitionBatchNo: this.requisitionBatchNo,
            deliveryDate: this.orderObj.deliveryDate,
            warehouseId: this.orderObj.warehouseId,
            shippingContainerNo: this.orderObj.shippingContainerNo,
            deliveryPlanCode: this.$route.query.deliveryPlanCode || "",
            details: []
          }

          params.details = this.createOrderChoice
          createDeliveryV2(params).then((res) => {
            if (res.data.code === 0) {
              this.$message.success("生成送货单成功")
              this.$router.$avueRouter.closeTag()
              this.$router.go(-1)
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    createOrderCancel() {
      this.$router.$avueRouter.closeTag()
      this.$router.go(-1)
    },
    //当前第几页
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    //每页显示几条
    sizeChange(val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
