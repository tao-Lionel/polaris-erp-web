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
              v-for="(item, index) in detailData"
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
                      <template v-if="item.prop === 'pricingRecordLinkSkuList'">
                        <a v-if="item.value?.length" @click="handleConnected(item.value)">
                          {{ item.value?.length }}
                        </a>
                        <span v-else>-</span>
                      </template>
                      <template v-else-if="item.prop === 'demandCreateByName'">
                        <span>{{ detail.demandCreateByName }}</span> /
                        <span>{{ detail.demandCreateTime }}</span>
                      </template>
                      <template v-else-if="item.prop === 'demandUpdateByName'">
                        <span>{{ detail.demandUpdateByName }}</span> /
                        <span>{{ detail.demandUpdateTime }}</span>
                      </template>
                      <template v-else-if="item.prop === 'pricingInfoStatus'">
                        <span :style="{ color: pricingInfoStatusColor[item.value] }">
                          {{ detail.pricingInfoStatusName }}
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
        <calcResult ref="calcResult"></calcResult>
      </div>
    </basic-container>

    <!-- 底部操作栏 -->
    <footer class="pricing-footer">
      <div class="footer-buttons">
        <el-button @click="handleClose">关闭</el-button>
        <!-- 待提审 -->
        <el-button
          v-if="permissions.product_pricing_info_audit && detail.pricingInfoStatus === 'PENDING_REVIEW'"
          type="primary"
          @click="handleSubmit"
        >
          提交审批
        </el-button>
        <!-- 审核中 -->
        <el-button
          v-if="permissions.product_pricing_info_review_progress && ['UNDER_REVIEW'].includes(detail.pricingInfoStatus)"
          type="primary"
          @click="handleProgress"
        >
          审批进度
        </el-button>
        <!-- 待提审、待提交 可编辑-->
        <!-- 已驳回不可编辑 -->
        <el-button
          v-if="
            permissions.product_pricing_info_generate &&
            ['PENDING_SUBMIT', 'PENDING_REVIEW'].includes(detail.pricingInfoStatus) &&
            !['DEMAND_REJECTED'].includes(detail.pricingDemandStatus)
          "
          type="primary"
          @click="handleEdit"
        >
          编辑
        </el-button>
        <!-- 待提审 -->
        <el-button
          v-if="permissions.product_pricing_info_del && detail.pricingInfoStatus === 'PENDING_REVIEW'"
          type="danger"
          @click="handleInvalid"
        >
          作废
        </el-button>
      </div>
    </footer>

    <connectedLinkDialog ref="connectedLinkDialogRef" />
    <auditDialog ref="auditDialogRef" @updateList="getDetail"></auditDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import {
  reviewProductPricingInfoApi,
  getProductPricingDemandByIdApi,
  invalidProductPricingInfoApi,
  getOaProcessUrlApi
} from "@/api/product/pricing"
import connectedLinkDialog from "./components/connectedLinkDialog.vue"
import auditDialog from "./components/auditDialog.vue"
import calcResult from "../components/calcResult.vue"
import { setFiltering } from "@/util/auth"

export default {
  name: "costingListDetail",
  components: { connectedLinkDialog, calcResult, auditDialog },
  data() {
    return {
      detailData: [
        { label: "站点", prop: "site", value: "" },
        { label: "平台", prop: "platform", value: "" },
        { label: "销售模式", prop: "orderBusinessType", value: "" },
        { label: "配送方式", prop: "logisticsDeliveryModeName", value: "" },
        { label: "标准SPU", prop: "spuCode", value: "", copy: true },
        { label: "标准SKU", prop: "standardSkuCode", value: "", copy: true },
        { label: "工厂SKU", prop: "skuCode", value: "", copy: true },
        { label: "品类", prop: "categoryName", value: "" },
        { label: "采购供应商", prop: "purchaseSupplierName", value: "", border: true },
        { label: "核价类型", prop: "pricingCalculationTypeName", value: "" },
        { label: "核价逻辑", prop: "pricingCalculationMethodName", value: "" },
        { label: "仓储服务", prop: "pricingWarehouseServiceMethodName", value: "" },
        { label: "使用汇率", prop: "exchangeRate", value: "", border: true },
        { label: "核价状态", prop: "pricingInfoStatus", value: "", slot: true },
        { label: "已关联链接", prop: "pricingRecordLinkSkuList", value: "", slot: true },
        { label: "生效时间", prop: "validTime", value: "" },
        { label: "失效时间", prop: "invalidTime", value: "", border: true },
        { label: "需求编码", prop: "pricingDemandCode", value: "", copy: true },
        { label: "需求描述", prop: "demandDescription", value: "", border: true, copy: true },
        { label: "核价编码", prop: "pricingInfoCode", copy: true },
        { label: "创建人/时间", prop: "demandCreateByName", slot: true },
        { label: "更新人/时间", prop: "demandUpdateByName", slot: true }
      ],
      pricingDemandId: this.$route.query.pricingDemandId,
      detail: {},
      pricingInfoStatusColor: {
        PENDING_REVIEW: "#303133",
        UNDER_REVIEW: "#409EFF",
        PENDING_ACTIVATION: "#E6A23C",
        ACTIVATED: "#67C23A",
        REVIEW_REJECTED: "#F56C6C",
        INACTIVE: "#909399"
      }
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  created() {},
  activated() {
    this.getDetail()
  },
  mounted: function () {},
  methods: {
    // 获取核价详情
    async getDetail() {
      const { data } = await getProductPricingDemandByIdApi(this.pricingDemandId)
      if (data.code === 0) {
        this.detail = data.data
        this.detailData.forEach((item) => {
          item.value = data.data[item.prop]
        })
        this.$refs.calcResult.getResultData(data.data)
      }
    },

    // 关闭
    handleClose() {
      this.$router.$avueRouter.closeTag()
      this.$router.go(-1)
    },
    // 提交审批
    async handleSubmit() {
      const filtering = setFiltering({ pricingInfoId: this.detail.pricingInfoId })

      const { data } = await reviewProductPricingInfoApi({
        pricingDemandQueryDto: {
          filtering
        }
      })
      const { passed, total } = data

      if (total && total === passed) {
        this.$message.success(`${total}条已自动审批通过`)
        this.getDetail()
      } else {
        this.$refs.auditDialogRef.openDialog(filtering, total, passed)
      }
    },
    // 审核进度
    async handleProgress() {
      // 打开OA该审批流，查看审批状态
      const { infoApprovalTmplCode, businessId } = this.detail
      const { data } = await getOaProcessUrlApi({ templateCode: infoApprovalTmplCode, businessId })
      if (data.code === 0) {
        window.open(data.data)
      }
    },
    // 编辑
    handleEdit() {
      this.$router.push({
        path: `/productCosting/costingRequire/costing`,
        query: {
          id: this.detail.pricingDemandId
        }
      })
    },
    // 已关联链接
    handleConnected(val) {
      this.$refs.connectedLinkDialogRef.openDialog(val)
    },
    // 作废
    handleInvalid() {
      this.$confirm(`确定作废该核价吗?<br/> 作废后，无法恢复。`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true
      }).then(async () => {
        const { data } = await invalidProductPricingInfoApi([this.detail.pricingInfoId])
        if (data.code === 0) {
          this.$message.success("作废成功")
          this.getDetail()
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
