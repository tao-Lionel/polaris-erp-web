<template>
  <div class="pricing-detail">
    <basic-container>
      <div class="pricing-content">
        <!-- 左侧基础数据 -->
        <section class="costing-form">
          <header class="section-header">
            <h2 class="section-title label-description">基础数据</h2>
          </header>

          <div class="section-body">
            <div
              v-for="(item, index) in filteredDetailData"
              :key="index"
              class="info-item"
              :class="{ 'with-border': item.border }"
            >
              <div class="info-row">
                <label class="info-label label-description">{{ item.label }}</label>
                <!-- 使用具名插槽处理特殊显示逻辑 -->
                <template v-if="item.slot">
                  <span class="info-value">
                    <slot :name="item.prop" :item="item">
                      <template v-if="item.prop === 'createName'">
                        <span>{{ detail.createName }}</span> /
                        <span>{{ detail.createTime }}</span>
                      </template>
                      <template v-else-if="item.prop === 'updateName'">
                        <span>{{ detail.updateName }}</span> /
                        <span>{{ detail.updateTime }}</span>
                      </template>
                      <template v-else-if="item.prop === 'pricingInfoStatus'">
                        <span :style="{ color: pricingInfoStatusColor[item.value] }">
                          {{ detail.pricingInfoStatusName }}
                        </span>
                      </template>
                      <template v-else-if="item.prop === 'productType'">
                        <span :style="{ color: pricingInfoStatusColor[item.value] }">
                          {{ detail.productType == "NEW" ? "无档案" : "已有档案" }}
                        </span>
                      </template>
                      <template v-else-if="item.prop === 'version'">
                        <span :style="{ color: pricingInfoStatusColor[item.value] }">
                          {{ detail.version == "PRODUCT" ? "正式版" : "测试版" }}
                        </span>
                      </template>
                      <!-- packageLength -->
                      <template v-else-if="item.prop === 'packageLength'">
                        <span :style="{ color: pricingInfoStatusColor[item.value] }">
                          {{ detail.packageLength }}* {{ detail.packageWidth }}*
                          {{ detail.packageHeight }}
                        </span>
                      </template>
                      <template v-else-if="item.prop === 'outerBoxLength'">
                        <span :style="{ color: pricingInfoStatusColor[item.value] }">
                          {{ detail.outerBoxLength }}* {{ detail.outerBoxWidth }}*
                          {{ detail.outerBoxHeight }}
                        </span>
                      </template>
                      <template v-else-if="item.prop === 'pricingWarehouseServiceMethod'">
                        <span>
                          {{ getLabelById(warehouseServiceMethods, detail.pricingWarehouseServiceMethod) }}
                        </span>
                      </template>
                      <!-- { label: "核价类型", prop: "pricingCalculationType", value: "" },
                      { label: "核价逻辑", prop: "pricingCalculationMethod", value: "" }, -->
                      <template v-else-if="item.prop === 'pricingCalculationType'">
                        <span>
                          {{ getLabelById(pricingCalculationTypeOptions, detail.pricingCalculationType) }}
                        </span>
                      </template>
                      <template v-else-if="item.prop === 'pricingCalculationMethod'">
                        <span>
                          {{ getLabelById(pricingCalculationMethodOptions, detail.pricingCalculationMethod) }}
                        </span>
                      </template>
                    </slot>
                  </span>
                </template>
                <template v-else-if="item.copy && item.value">
                  <span class="info-value">
                    <copy-text :text="item.value" />
                  </span>
                </template>
                <span v-else class="info-value">{{ item.value || "-" }}</span>
              </div>

              <div v-if="item.border" class="divider"></div>
            </div>
          </div>
        </section>

        <!-- 右侧计算结果 -->
        <calc-result ref="calcResult"></calc-result>
      </div>
    </basic-container>

    <!-- 底部操作栏 -->
    <footer class="pricing-footer">
      <div class="footer-buttons">
        <el-button @click="handleClose">关 闭</el-button>
        <el-button
          type="primary"
          v-if="permissions.product_pricing_newProductCalc_edit && detail.pricingTrialStatus === 'NORMAL'"
          @click="handleEdit"
        >
          编辑
        </el-button>
        <el-button
          type="danger"
          v-if="permissions.product_pricing_newProductCalc_invalid && detail.pricingTrialStatus === 'NORMAL'"
          @click="handleInvalid"
        >
          作废
        </el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import CalcResult from "./components/calcResult.vue"
import { getTrialDetail, trialCancel } from "@/api/product/newProductCalc"
import { getDictByType } from "@/util/auth"

export default {
  name: "costingListDetail",
  components: { CalcResult },
  data() {
    return {
      detailData: [
        { label: "站点", prop: "site", value: "" },
        { label: "平台", prop: "platform", value: "" },
        { label: "销售模式", prop: "orderBusinessType", value: "" },
        { label: "配送方式", prop: "logisticsDeliveryModeName", value: "", copy: true, border: true },

        { label: "产品档案", prop: "productType", value: "", slot: true },

        { label: "SPU", prop: "spuCode", value: "", copy: true, show: "OLD" },
        { label: "标准SKU", prop: "standardSkuCode", value: "", copy: true, show: "OLD" },
        { label: "工厂SKU", prop: "skuCode", value: "", copy: true, show: "OLD" },
        { label: "品类", prop: "categoryName", value: "", copy: true, show: "OLD" },

        { label: "采购供应商", prop: "purchaseSupplierName", value: "", border: true, show: "OLD" },
        { label: "SKU名称", prop: "skuName", value: "", copy: true, show: "NEW" },
        { label: "包装长宽高(cm)", prop: "packageLength", value: "", copy: true, slot: true, show: "NEW" },
        { label: "包装毛重(kg)", prop: "packageGrossWeight", value: "", copy: true, show: "NEW", show: "NEW" },
        { label: "外箱长宽高(cm)", prop: "outerBoxLength", value: "", copy: true, slot: true, show: "NEW" },
        { label: "外箱毛重(kg)", prop: "boxGrossWeight", value: "", copy: true, show: "NEW" },
        { label: "装箱数量", prop: "boxs", value: "", copy: true, show: "NEW" },
        { label: "品类", prop: "categoryName", value: "", border: true, copy: true, show: "NEW" },
        { label: "核价类型", prop: "pricingCalculationType", value: "", slot: true },
        { label: "核价逻辑", prop: "pricingCalculationMethod", value: "", slot: true },
        { label: "仓储服务", prop: "pricingWarehouseServiceMethod", value: "", slot: true },
        { label: "使用汇率", prop: "exchangeRate", value: "", border: true },
        { label: "试算编码", prop: "pricingTrialCode", copy: true },
        { label: "创建人/时间", prop: "createName", slot: true },
        { label: "更新人/时间", prop: "updateName", slot: true, border: true },
        { label: "执行版本", prop: "version", copy: true, slot: true },
        { label: "执行时间", prop: "time", copy: true }
      ],
      filteredDetailData: [],
      pricingDemandId: this.$route.query.pricingDemandId,
      detail: {},
      pricingInfoStatusColor: {
        PENDING_REVIEW: "#303133",
        UNDER_REVIEW: "#409EFF",
        PENDING_ACTIVATION: "#E6A23C",
        ACTIVATED: "#67C23A",
        REVIEW_REJECTED: "#F56C6C",
        INACTIVE: "#909399"
      },
      warehouseServiceMethods: [],
      pricingCalculationTypeOptions: [],
      pricingCalculationMethodOptions: []
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  created() {
    const { id } = this.$route.query
    console.log("id", id)
    if (id) {
      this.id = id
      this.getTrialDetail(id)
    }
  },
  activated() {},
  async mounted() {
    this.warehouseServiceMethods = await getDictByType("pricing_warehouse_service_method")
    this.pricingCalculationTypeOptions = await getDictByType("pricing_calculation_type") // 核价类型
    this.pricingCalculationMethodOptions = await getDictByType("pricing_calculation_method") // 核价逻辑
  },
  methods: {
    // 获取核价详情
    async getTrialDetail(val) {
      const { data } = await getTrialDetail(val)
      if (data.code === 0) {
        this.detail = data.data
        this.detailData.forEach((item) => {
          item.value = data.data[item.prop]
        })
        this.filteredDetailData = this.detailData.filter((item) => {
          // 如果没有 show 字段，默认显示
          if (!item.show) {
            return true
          }

          // 如果有 show 字段，根据当前 type 判断是否显示
          return item.show === data.data.productType
        })
        this.$refs.calcResult.getResultData(data.data)
      }
    },
    getLabelById(list, value) {
      const item = list.find((element) => element.value === value)
      return item ? item.label : null
    },
    // 关闭
    handleClose() {
      this.$router.$avueRouter.closeTag()
      this.$router.go(-1)
    },

    // 编辑
    handleEdit() {
      this.$router.push({
        path: "/productCosting/newProductCalc/edit",
        query: {
          id: this.id,
          state: "edit"
        }
      })
    },
    // 作废
    handleInvalid() {
      this.$confirm("作废后，无法恢复！", "确认作废？", {
        confirmButtonText: "作废",
        cancelButtonText: "取消",
        confirmButtonClass: "el-button--danger",
        type: "error",
        center: true
      }).then(async () => {
        const { data } = await trialCancel([this.id])
        if (data.code == 0) {
          this.$message({
            type: "success",
            message: "作废成功"
          })
          this.handleClose()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// 变量定义
$border-color: #e5e5e5;
$text-color: #333;
$label-width: 200px;
$spacing-base: 15px;
$border-radius: 4px;

// Mixins
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// 主容器样式
.pricing-detail {
  position: relative;
  min-height: 100vh;
  padding-bottom: 90px;
}

// 内容区域
.pricing-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

// 左右两侧公共部分
.costing-form {
  padding-right: $spacing-base;

  &:first-child {
    border-right: 1px solid $border-color;
  }
}

// 头部样式
.section-header {
  padding-bottom: $spacing-base;
  margin-bottom: $spacing-base;
  border-bottom: 1px solid $border-color;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: $text-color;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

// 信息项样式
.info-item,
.result-item {
  margin-bottom: 10px;

  &.with-border {
    padding-bottom: 10px;
  }
}

// 行样式
.info-row {
  display: flex;
  align-items: center;
  min-height: 28px;
}

// 标签样式
.info-label {
  width: $label-width;
  padding-right: $spacing-base;
  text-align: right;
  color: $text-color;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

// 值样式
.info-value {
  flex: 1;
  color: $text-color;
}

// 分隔线
.divider {
  height: 1px;
  background-color: $border-color;
  margin-top: $spacing-base;
}

// 底部操作栏
.pricing-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.footer-buttons {
  height: 100%;
  padding-right: 50px;
  @include flex-center;
  justify-content: flex-end;

  .el-button + .el-button {
    margin-left: 12px;
  }
}

// 响应式设计
@media screen and (max-width: 1200px) {
  .pricing-content {
    grid-template-columns: 1fr;
  }

  .pricing-section:first-child {
    border-right: none;
    border-bottom: 1px solid $border-color;
  }

  .info-label,
  .result-label {
    width: 150px;
  }
}

@media screen and (max-width: 768px) {
  .info-label,
  .result-label {
    width: 120px;
  }

  .footer-buttons {
    padding-right: $spacing-base;
  }
}
</style>
