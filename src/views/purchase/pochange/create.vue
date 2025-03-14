<template>
  <div class="execution" id="pochange-create">
    <basic-container>
      <!-- 原采购单内容 -->
      <div class="border-wrap" style="margin-bottom: 20px">
        <div class="header">
          <div class="title">原采购单内容</div>
          <div class="flex">
            <span class="no-wrap"> 原合同编号：</span>
            <copy-text>{{ oldContractNo }}</copy-text>
          </div>
          <div v-if="Boolean(isChangeList)" class="ml-20">
            变更状态：
            <span class="no-wrap">{{ orderStatusObj[orderStatus] }}</span>
          </div>
          <div class="ml-20 flex">
            <span class="no-wrap">请购单批次号：</span>
            <copy-text>
              <span class="no-wrap">{{ requisitionBatchNo }}</span>
            </copy-text>
          </div>
          <div class="ml-20 flex">
            <span class="no-wrap">采购单号：</span>
            <copy-text>
              <span class="no-wrap">{{ oldContractNo }}</span>
            </copy-text>
          </div>
          <div class="ml-20">
            <span class="no-wrap">采购员：</span>
            <span class="no-wrap">{{ purchaseUserName }}</span>
          </div>
          <div class="ml-20">
            价格模式：<span class="no-wrap">{{ priceModel }}</span>
          </div>
        </div>
        <!-- 原始数据 -->
        <div style="padding: 20px">
          <avue-crud
            ref="crud"
            :page="oldPage"
            :data="oldTableData"
            :option="oldTableOption"
            @search-change="searchChange"
            @search-reset="searchReset"
            @refresh-change="refreshChange"
            @size-change="sizeChange"
            @selection-change="selectionChange"
            :selectable="selectable"
          >
            <template slot-scope="scope" slot="search">
              <el-form ref="searchForm" :model="searchForm">
                <el-form-item label="工厂SKU">
                  <el-input
                    v-model="searchForm.skuCode"
                    style="width: 150px"
                    size="small"
                    placeholder="请输入工厂SKU"
                    :disabled="isDisabled"
                  ></el-input>
                </el-form-item>
              </el-form>
            </template>
          </avue-crud>
        </div>
      </div>

      <!-- 变更内容 -->
      <div class="border-wrap">
        <div class="header">
          <div class="title">变更内容</div>
          <div>新合同编号：{{ newContractNo ? newContractNo : "（保存后生成）" }}</div>
        </div>

        <div style="padding: 20px">
          <el-form ref="submitFormRef" :model="submitForm" inline :rules="submitFormRules">
            <el-form-item label="供应商" prop="supplierNo">
              <el-select
                v-model="submitForm.supplierNo"
                size="small"
                placeholder="请选择供应商"
                filterable
                clearable
                :disabled="isDisabled"
                @change="changeSupplier"
              >
                <el-option v-for="item in supplierList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="法人主体" prop="corporationId">
              <el-select
                v-model="submitForm.corporationId"
                size="small"
                placeholder="请选择法人主体"
                filterable
                clearable
                :disabled="isDisabled"
              >
                <el-option v-for="item in corporationList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="价格模式" prop="priceModel">
              <el-select
                v-model="submitForm.priceModel"
                size="small"
                placeholder="请选择价格模式"
                clearable
                :disabled="isDisabled"
                @change="changePriceModel"
              >
                <el-option
                  v-for="item in priceModelOptions"
                  :key="item.value"
                  :label="item.description"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>

          <el-table v-if="isDisabled" stripe border :data="newTableData">
            <el-table-column type="index" label="序号" width="50px"></el-table-column>
            <el-table-column prop="skuCode" label="工厂SKU" width="190px"></el-table-column>
            <el-table-column prop="modelName" label="产品长*宽*高(cm)" width="130px"></el-table-column>
            <el-table-column prop="skuName" label="产品名称" min-width="120px"></el-table-column>
            <el-table-column prop="skuQuantity" label="数量" min-width="120px">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.oldSkuQuantity }}<i class="el-icon-right ml-10 mr-10"></i>
                  <span class="update-color">{{ scope.row.skuQuantity }}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="非税单价" min-width="120px">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.oldPrice }}<i class="el-icon-right ml-10 mr-10"></i>
                  <span class="update-color">{{ scope.row.price }}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="skuAmount" label="总金额" min-width="120px">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.oldSkuAmount }}<i class="el-icon-right ml-10 mr-10"></i>
                  <span class="update-color">{{ scope.row.skuAmount }}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="planDelivery" label="采购预计交期" width="120px"></el-table-column>
            <el-table-column prop="priceModel" label="价格模式" min-width="150px">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.oldPriceModel }}<i class="el-icon-right ml-10 mr-10"></i>
                  <span class="update-color">{{ scope.row.priceModel }}</span>
                </span>
              </template>
            </el-table-column>
          </el-table>

          <el-table v-else stripe border :data="newTableData">
            <el-table-column type="index" label="序号" width="50px"></el-table-column>
            <el-table-column prop="skuCode" label="工厂SKU" width="190px"></el-table-column>
            <el-table-column prop="modelName" label="产品长*宽*高(cm)" width="130px"></el-table-column>
            <el-table-column prop="skuName" label="产品名称" min-width="100px"></el-table-column>
            <el-table-column prop="oldSkuQuantityFront" label="原采购数量" width="90px"></el-table-column>
            <el-table-column prop="skuQuantity" label="变更数量" width="120px">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.skuQuantity"
                  type="number"
                  size="small"
                  :max="scope.row.optionalQuantity"
                  :min="0"
                  :disabled="isDisabled"
                  @change="changeSkuQuantity($event, scope)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="originalRemainingQuantity" label="原单剩余数量" width="100px"></el-table-column>
            <el-table-column prop="price" label="非税单价" width="90px"></el-table-column>
            <el-table-column prop="skuAmount" label="总金额" width="80px"></el-table-column>
            <el-table-column prop="planDelivery" label="采购预计交期" width="160px">
              <template slot-scope="scope">
                <el-date-picker
                  size="small"
                  v-model="scope.row.planDelivery"
                  value-format="yyyy-MM-dd"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  :disabled="isDisabled"
                  style="width: 140px"
                ></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column prop="operation" label="操作" width="100px" fixed="right">
              <template slot-scope="scope">
                <avue-crud-ctrl :list="getCtrlList(scope)"></avue-crud-ctrl>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div v-if="orderStatus === 0" style="text-align: center; padding: 20px">
        <el-button @click="handleSave(1)" v-if="permissions.purchase_poorderchange_save" type="primary" size="small">
          保 存
        </el-button>
        <el-button @click="handleSave(2)" type="primary" size="small"> 提交审核 </el-button>
      </div>
    </basic-container>

    <newPriceDialog ref="newPriceDialogRef" @updateList="updateList"></newPriceDialog>
  </div>
</template>

<script>
import {
  getPoChangList,
  saveDataPurchaseChangeOrderApi,
  postSubmitPochange,
  getChangeDetail,
  getPurchaseChangeOrderSkuPriceApi
} from "@/api/purchase/pochange/poorderchangedetail"
import { deepClone } from "@/util/util"
import { mapGetters } from "vuex"
import { oldTableOption, oldPage, orderStatusObj, submitFormRules } from "./create"
import { getAll as getAllSupplierApi } from "@/api/supplier/posupplier"
import { getCorporation, getModelBySupplierNoApi } from "@/api/purchase/porequisiton"
import newPriceDialog from "./components/newPriceDialog"

export default {
  components: { newPriceDialog },
  data() {
    return {
      poOrderNos: this.$route.query.poOrderNos, //采购单号，支持多个
      orderStatus: 0, //变更单状态
      orderStatusObj,
      oldContractNo: "", //旧合同
      newContractNo: "", //新合同
      oldTableData: [],
      oldTableOption,
      oldPage,
      searchForm: {
        skuCode: ""
      },
      supplierList: [],
      corporationList: [],
      priceModelOptions: [],
      submitForm: {
        priceModel: ""
      },
      newTableData: [],
      submitFormRules,
      skuPriceList: [],
      purchaseOrderNoForDetail: "",
      requisitionBatchNo: "", // 请购单批次号
      purchaseUserName: "", // 采购员
      priceModel: "", // 价格模式
      purchaseOrderNo: "" // 采购单号
    }
  },
  computed: {
    ...mapGetters(["permissions"]),
    isChangeList() {
      const map = {
        true: true,
        false: false
      }
      if (typeof this.$route.query.isChangeList === "string") {
        return map[this.$route.query.isChangeList]
      }
      return this.$route.query.isChangeList
    },
    // 是否禁用(已经变更完成)
    isDisabled() {
      return this.orderStatus !== 0
    },
    showGetHistoryPriceBtn() {
      return !!this.submitForm.priceModel
    }
  },
  created() {},
  mounted: function () {
    this.init()
  },
  methods: {
    init() {
      if (this.isChangeList) {
        //由采购变更列表进入请求
        this.loadChangeDetail()
      } else {
        // 由采购订单-发起变更进入
        this.getList()
      }
      this.getAllSupplier()
      this.getPriceModelAll()
    },
    // 获取详情
    async loadChangeDetail() {
      const { data } = await getChangeDetail(this.poOrderNos)
      if (data.code === 0) {
        this.oldTableData = data.data.orderInfoList //旧列表
        this.oldContractNo = data.data.poOrderChange.oldContractNo //旧合同
        this.orderStatus = data.data.poOrderChange.status //当前订单状态
        this.newContractNo = data.data.poOrderChange.newContractNo //新合同单号
        this.purchaseOrderNoForDetail = data.data.poOrderChange.purchaseOrderNoForDetail // 原始的采购单号

        this.requisitionBatchNo = this.oldTableData[0].requisitionBatchNo
        this.purchaseUserName = this.oldTableData[0].purchaseUserName
        this.priceModel = this.oldTableData[0].priceModel
        this.purchaseOrderNo = this.oldTableData[0].purchaseOrderNo

        const { supplierNo, corporationId } = data.data.poOrderChange
        this.getCorporationAndPriceModelBySupplier(supplierNo)
        this.$set(this.submitForm, "corporationId", corporationId)
        this.$set(this.submitForm, "priceModel", data.data.detailList.length ? data.data.detailList[0]?.priceModel : "")
        // 回显选中的效果
        let selectRows = []
        data.data.detailList.forEach((item) => {
          this.oldTableData.forEach((oldItem) => {
            if (item.poDetailId === oldItem.poDetailId) {
              selectRows.push(oldItem)
            }
          })
        })
        this.$refs.crud.toggleSelection(selectRows, true)
        // 变更后的内容
        this.newTableData = data.data.detailList
        this.setField()
      }
    },

    // 页面初始化
    async getList() {
      const { data } = await getPoChangList({
        poOrderNos: this.newContractNo ? this.purchaseOrderNoForDetail : this.poOrderNos,
        skuCode: this.searchForm.skuCode,
        poOrderChangeNo: this.newContractNo ? this.poOrderNos : null // 变更单号
      })
      if (data.code === 0) {
        this.oldTableData = data.data
        // 赋值旧合同
        if (this.oldTableData && this.oldTableData.length > 0) {
          this.oldContractNo = this.oldTableData[0].poContractNo

          this.requisitionBatchNo = this.oldTableData[0].requisitionBatchNo
          this.purchaseUserName = this.oldTableData[0].purchaseUserName
          this.priceModel = this.oldTableData[0].priceModel
          this.purchaseOrderNo = this.oldTableData[0].purchaseOrderNo

          this.getCorporationAndPriceModelBySupplier(this.oldTableData[0].supplierNo)
        }
      } else {
        this.$message.warning(data.msg)
        this.oldTableData = []
      }
    },

    // 根据供应商触发事件
    getCorporationAndPriceModelBySupplier(supplierNo) {
      this.$set(this.submitForm, "supplierNo", supplierNo)
      this.getCorporationBySupplier(supplierNo)
      this.getPriceModelAll(supplierNo)
    },

    // 获取供应商
    async getAllSupplier() {
      const { data } = await getAllSupplierApi()
      if (data.code === 0) {
        this.supplierList = data.data.map((item) => {
          return {
            value: item.supplierNo,
            label: item.supplierName
          }
        })
      }
    },
    // 选择供应商
    changeSupplier(val) {
      this.corporationList = []
      this.$set(this.submitForm, "corporationId", "")
      this.$set(this.submitForm, "priceModel", "")
      if (!val) return
      this.getCorporationBySupplier(val)
      this.getPriceModelAll(val)
    },
    // 根据供应商获取法人主体
    async getCorporationBySupplier(val) {
      const { data } = await getCorporation({ supplierNo: val })
      if (data.code === 0) {
        if (data.data.length > 0) {
          this.corporationList = data.data.map((item) => {
            return {
              label: item.corporationName,
              value: item.corporationId
            }
          })
        } else {
          this.$message.warning("该供应商没有法人主体")
        }
      }
    },
    // 获取价格模式
    async getPriceModelAll(val) {
      const { data } = await getModelBySupplierNoApi(val)
      this.priceModelOptions = data.data
    },
    // 选择价格模式
    changePriceModel(val) {
      if (!val) return
      this.getSkuPrice()
    },
    /**
     * 搜索回调
     */
    searchChange(params, page) {
      if (this.isDisabled) return
      this.getList()
    },
    searchReset() {
      // 清空搜索条件
      this.searchForm = { skuCode: "" }
      this.init()
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.searchChange(undefined, this.page)
    },
    // 页大小回调
    sizeChange(val) {
      this.page.pageSize = val
    },
    // 选择回调
    selectionChange(selected) {
      if (this.isDisabled) return
      this.selectRows = selected
      this.newTableData = deepClone(selected)
      this.setField()
      this.getSkuPrice()
    },
    selectable() {
      return !this.isDisabled
    },
    // 删除列表
    deleteRow(scope) {
      this.newTableData.splice(scope.$index, 1)
      let cancelRow = this.selectRows.find((item) => item.skuId === scope.row.skuId)
      this.$refs.crud.toggleSelection([cancelRow], false)
    },
    // 根据供应商、价格模式 和 对应的SKU 带出sku 单价
    async getSkuPrice() {
      if (this.newTableData.length <= 0 || !this.submitForm.supplierNo || !this.submitForm.priceModel) {
        return
      }
      let skuIds = []
      this.newTableData.forEach((item) => {
        skuIds.push(item.skuId)
      })
      const params = {
        skuIds,
        supplierNo: this.submitForm.supplierNo,
        priceModel: this.submitForm.priceModel
      }
      const { data } = await getPurchaseChangeOrderSkuPriceApi(params)
      if (data.data.length > 0 && data.data.length === this.newTableData.length) {
        this.skuPriceList = data.data

        this.skuPriceList.forEach((item) => {
          this.newTableData.forEach((sku) => {
            if (sku.skuId === item.skuId && !sku.monthYear) {
              sku.price = item.price
              sku.skuAmount = (item.price * sku.skuQuantity).toFixed(2)
            }
          })
        })
      } else {
        this.$message.error(data.msg)
      }
    },

    // 修改数量的回调
    changeSkuQuantity(val, scope) {
      // if (!this.submitForm.supplierNo || !this.submitForm.priceModel) {
      //   this.$message.warning("请先选择供应商和价格模式")
      //   this.$set(this.newTableData[scope.$index], "skuQuantity", 0)
      //   return
      // }
      if (val > scope.row.optionalQuantity) {
        this.$message.warning("数量不能大于可选数量")
        this.$set(this.newTableData[scope.$index], "skuQuantity", 0)
        return
      }

      let skuPrice = scope.row.price

      // 没选择历史价格并且选择供应商和价格模式后，自动带出价格
      if (!scope.row?.monthYear && this.submitForm.supplierNo && this.submitForm.priceModel) {
        skuPrice = this.skuPriceList.find((item) => item.skuId === scope.row.skuId)?.price
        if (skuPrice || skuPrice === 0) {
          this.$set(this.newTableData[scope.$index], "price", skuPrice)
        } else {
          this.$message.warning("该sku当前价格模式与供应商下没有维护询价单相关数据")
          return
        }
      }

      this.$set(this.newTableData[scope.$index], "skuAmount", (skuPrice * val).toFixed(2))
      this.$set(this.newTableData[scope.$index], "originalRemainingQuantity", scope.row.oldSkuQuantityFront - val)
    },

    // 1保存 2 提交
    handleSave(type) {
      if (this.newTableData.length <= 0) {
        this.$message.warning("请选择要变更的数据")
        return
      }

      for (let i = 0; i < this.newTableData.length; i++) {
        if (!this.newTableData[i].skuQuantity || this.newTableData[i].skuQuantity == 0) {
          this.$message.warning("请填写数量,且数量不能为0")
          return
        }
      }

      this.$refs.submitFormRef.validate(async (valid) => {
        if (valid) {
          let list = this.newTableData.map((item) => {
            return {
              poOrderChangeNo: this.newContractNo ? this.poOrderNos : null, //	变更单号
              purchaseOrderNo: item.purchaseOrderNo, //	 采购单号
              poDetailId: item.poDetailId, //	 采购单明细id
              skuId: item.skuId, // skuid
              skuQuantity: item.skuQuantity, //数量
              price: item.price,
              planDelivery: item.planDelivery, //采购交期
              monthYear: item?.monthYear,
              skuPriceHistoryId: item?.skuPriceHistoryId,
              currency: item?.currency
            }
          })

          const params = {
            poOrderNos: this.newContractNo ? [this.purchaseOrderNoForDetail] : [this.poOrderNos],
            supplierNo: this.submitForm.supplierNo,
            corporationId: this.submitForm.corporationId,
            priceModel: this.submitForm.priceModel,
            updatePriceFlag: this.submitForm.priceModel ? 1 : 0, // 是否更新价格
            list
          }

          let fn = saveDataPurchaseChangeOrderApi
          if (type === 2) {
            fn = postSubmitPochange
          }

          const { data } = await fn(params)
          if (data.code === 0) {
            this.$message.success("操作成功")
            this.$router.$avueRouter.closeTag()
            this.$router.go(-1)
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },
    getCtrlList(scope) {
      return [
        {
          title: "删除",
          item: scope,
          clickFn: (scope) => {
            this.deleteRow(scope)
          },
          show: true
        },
        {
          title: "获取历史报价",
          item: scope,
          clickFn: (scope) => {
            this.getNewPrice(scope)
          },
          show: this.showGetHistoryPriceBtn
        }
      ]
    },
    getNewPrice(scope) {
      this.$refs.newPriceDialogRef.openDialog(scope.row, this.submitForm.priceModel, this.submitForm.supplierNo)
    },
    // 选择历史价格的回调
    updateList({ monthYear, price, skuId, skuPriceHistoryId, currency }) {
      this.newTableData.forEach((item) => {
        if (item.skuId === skuId) {
          item.price = price
          item.monthYear = monthYear
          item.skuAmount = (item.price * item.skuQuantity).toFixed(2) // 总金额
          item.skuPriceHistoryId = skuPriceHistoryId
          item.currency = currency
        }
      })
    },
    // 设置原采购数量 字段和原单剩余数量字段
    setField() {
      this.newTableData.forEach((item) => {
        item.oldSkuQuantityFront = item?.oldSkuQuantity ? item.oldSkuQuantity : item.skuQuantity // 原采购数量
        item.originalRemainingQuantity = item.skuQuantity ? item.oldSkuQuantityFront - item.skuQuantity : undefined // 原单剩余数量
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.border-wrap {
  border: 1px solid #e7ebef;
  border-radius: 4px; /*overflow: hidden;*/
  .header {
    padding: 14px 18px;
    background: #f6f9fb;
    border: 1px solid #e7ebef;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-weight: bold;
      font-size: 16px;
      margin-right: 30px;
      white-space: nowrap;
    }
  }
  .no-wrap {
    white-space: nowrap;
  }
  .flex {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
}
.update-color {
  color: #f56c6c;
}
</style>
