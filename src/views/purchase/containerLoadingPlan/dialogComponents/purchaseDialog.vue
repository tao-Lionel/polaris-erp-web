<template>
  <el-dialog title="关联已有采购计划" :visible.sync="visible" width="70%" @closed="handleClose" @open="open">
    <div class="purchase-box">
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :option="purchaseTableOption"
        @refresh-change="refreshChange"
        @search-change="searchChange"
        @search-reset="searchReset"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
      >
        <template slot="search">
          <el-form @submit.prevent.native :model="searchForm" inline ref="searchForm">
            <el-form-item prop="purchaseOrderNo">
              <el-input
                v-model="searchForm.purchaseOrderNo"
                size="small"
                clearable
                placeholder="采购单号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="createTime">
              <el-date-picker
                v-model="searchForm.createTime"
                clearable
                type="daterange"
                size="small"
                start-placeholder="单据开始日期"
                end-placeholder="单据结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="purchasePlanCode">
              <el-input
                v-model="searchForm.purchasePlanCode"
                size="small"
                clearable
                placeholder="采购计划号"
                v-search-input
              ></el-input>
            </el-form-item>
            <el-form-item prop="corporationId">
              <el-select
                v-model="searchForm.corporationId"
                size="small"
                placeholder="采购组织"
                filterable
                clearable
                multiple
              >
                <el-option
                  v-for="item in corporationList"
                  :key="item.corporationId"
                  :label="item.corporationName"
                  :value="item.corporationId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="supplierNo">
              <el-select
                v-model="searchForm.supplierNo"
                size="small"
                placeholder="供应商"
                filterable
                clearable
                multiple
              >
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </avue-crud>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="handleConfirm">确 定</el-button>
      <el-button size="small" @click="visible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex"
import { relatedPurchasePlan } from "@/api/purchase/containerLoadingPlan/index.js"
import { purchaseTableOption } from "../index.js"
import { getDictByType, setFiltering, setOrderBy } from "@/util/auth"
import { getPoOrderPageApi } from "@/api/purchase/order/poorder"
import { cloneDeep } from "lodash"
import { getAll as getAllSupplierApi } from "@/api/supplier/posupplier"
import { getAll as getBseCurrency } from "@/api/baseSetup/bsecurrency"
import { getAllWarehouse } from "@/api/baseSetup/bsewarehouse"
import { getAll as getAllCorporationApi } from "@/api/baseSetup/bsecorporation"
export default {
  name: "purchaseDialog",
  components: {},
  data() {
    return {
      visible: false,
      purchaseForm: {
        purchaseNo: "",
        purchaseOrderNo: ""
      },
      rules: {
        purchaseNo: [{ required: true, message: "请输入采购计划号", trigger: "blur" }]
      },
      purchaseTableOption: purchaseTableOption,
      searchForm: {
        purchaseOrderNo: "",
        createTime: [],
        purchasePlanCode: "",
        corporationId: [],
        supplierNo: []
      },
      selectList: [],
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      relatedPurchasePlanForm: {
        deliveryPlanCode: "",
        purchaseCodeList: []
      },
      currencyOptions: [],
      warehouseOptions: [],

      priceModelOptions: [],
      supplierOptions: [],
      corporationList: []
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    open() {
      this.getList()
    },
    handleClose() {
      this.searchForm = {
        purchaseOrderNo: "",
        createTime: [],
        purchasePlanCode: "",
        corporationId: [],
        supplierNo: []
      }
    },
    async getWhileActive(tab) {
      await Promise.all([
        this.getCurrencyAll(),
        this.getWarehouseAll(),
        this.getPriceModelAll(),
        this.getSupplierAll(),
        this.getCorporation()
      ])

      // const [documentTypeOptions, purchaseAttrOptions, purchaseStatusOptions] = await Promise.all([
      //   getDictByType("document_type"),
      //   getDictByType("plan_attributes"),
      //   getDictByType("po_order_status_v2")
      // ])

      // this.documentTypeOptions = documentTypeOptions
      // this.purchaseAttrOptions = purchaseAttrOptions
      // this.purchaseStatusOptions = purchaseStatusOptions
    },
    // 获取币别
    getCurrencyAll() {
      getBseCurrency().then(({ data }) => {
        if (data.code == 0) {
          this.currencyOptions = data.data
        }
      })
    },
    // 获取仓库
    getWarehouseAll() {
      getAllWarehouse().then((res) => {
        if (res.data.code === 0) {
          let arr = res.data.data.filter((item) => item.funcState === "1")
          this.warehouseOptions = arr.map((item) => {
            return {
              label: item.warehouseName,
              value: item.warehouseId
            }
          })
        }
      })
    },
    // 获取价格模式
    async getPriceModelAll() {
      this.priceModelOptions = await getDictByType("price_model")
    },
    //获取供应商
    async getSupplierAll() {
      const { data } = await getAllSupplierApi()
      if (data.code === 0) {
        data.data.forEach((item) => {
          this.supplierOptions.push({
            value: item.supplierNo,
            label: item.supplierName
          })
        })
      }
    },
    // 获取法人主体
    async getCorporation() {
      const { data } = await getAllCorporationApi()
      if (data.code === 0) {
        this.corporationList = data.data
      }
    },
    openDialog(row) {
      this.visible = true
      this.relatedPurchasePlanForm.deliveryPlanCode = row.deliveryPlanCode
      this.getList()
      this.getWhileActive()
    },
    async getList(column = null) {
      const params = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        filtering: [
          ...setFiltering(this.searchForm, this.operatorParams),
          {
            field: "status",
            operator: "IN",
            value: ["10", "11", "13", "14", "15"]
          }
        ],
        orderBy: setOrderBy(column, this.orderBy)
      }

      const { data } = await getPoOrderPageApi(params)
      this.tableData = data.data.records
      this.page.total = data.data.total
    },
    async handleConfirm() {
      const { deliveryPlanCode } = this.relatedPurchasePlanForm
      const postData = cloneDeep({
        deliveryPlanCode,
        purchaseCodeList: this.selectList.map((item) => item?.purchaseOrderNo)
      })

      const { data } = await relatedPurchasePlan(postData)
      if (data.code === 0) {
        this.$message.success("操作成功")
        this.visible = false
        this.$emit("success")
      }
    },
    selectionChange(list) {
      this.selectList = list
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },

    /**
     * 刷新回调
     */
    refreshChange() {
      this.searchFormConfirm = deepCloneIgnoreNull(this.searchForm)
      this.getList()
    }, // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      this.getList()
    },
    searchReset() {
      //将默认的搜索条件放入到搜索条件中
      this.$refs["searchForm"].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.purchase-box {
  padding: 20px;
}
::v-deep .el-form-item__content {
  margin-left: 0 !important;
}
</style>
