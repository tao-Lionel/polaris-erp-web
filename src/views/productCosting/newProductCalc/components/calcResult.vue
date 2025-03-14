<template>
  <section class="pricing-section">
    <header class="section-header">
      <h2 class="title label-description">计算结果</h2>
    </header>

    <div class="section-result-body">
      <div v-for="(item, index) in resultData" :key="index" class="result-item" :class="{ 'with-border': item.border }">
        <div class="result-row">
          <label class="result-label label-description">{{ item.label }}</label>
          <div class="result-values">
            <span class="value">{{ item.value || "-" }}</span>
            <span class="standard-value">
              {{ item.standardCurrencyValue || "-" }}
            </span>
            <span class="ratio">{{ item.ratio || "-" }}</span>
          </div>
        </div>

        <!-- 子项列表 -->
        <div v-if="item.children" class="sub-items">
          <div v-for="(child, childIndex) in item.children" :key="childIndex" class="sub-item">
            <label class="sub-label label-description">{{ child.label }}</label>
            <div class="result-values">
              <span class="value">{{ child.value || "-" }}</span>
              <span class="standard-value">
                {{ child.standardCurrencyValue || "-" }}
              </span>
              <span class="ratio">{{ child.ratio || "-" }}</span>
            </div>
          </div>
        </div>

        <div v-if="item.border" class="divider"></div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "productCostingCalcResult",
  components: {},
  data() {
    return {
      resultData: [
        { label: "含税售价", currency: "$", prop: "calSalePrice", value: "" },
        { label: "非税售价", currency: "$", prop: "nonTaxPrice" },
        { label: "供货价", currency: "$", prop: "calSupplyPrice" },
        { label: "PPM", prop: "ppm" },
        { label: "运费逻辑PPM", prop: "freightLogicPPM" },
        { label: "DI Saving Rate", prop: "diSavingRate" },
        { label: "盈亏平衡推广费比", prop: "breakEvenPromotionRatio" },
        { label: "推广费比(占含税售价)", prop: "promotionRatio", border: true },
        { label: "经营利润", currency: "$", prop: "operatingProfit" },
        { label: "税前利润", currency: "$", prop: "preTaxProfit" },
        { label: "最新成本税前利润(参考)", currency: "$", prop: "latestPreTaxProfitRef", border: true },
        {
          label: "运营费用小计",
          currency: "$",
          prop: "operatingExpenseSubtotal",
          border: true,
          children: [
            { label: "推广费", currency: "$", prop: "promotionCost" },
            { label: "退款", currency: "$", prop: "refund" },
            { label: "BTR", currency: "$", prop: "btr" },
            { label: "销售罚款", currency: "$", prop: "salesPenalty" }
          ]
        },
        {
          label: "运营佣金小计",
          currency: "$",
          prop: "operatingCommissionSubtotal",
          children: [
            { label: "平台比例佣金", currency: "$", prop: "platformCommissionRate" },
            { label: "订单固定佣金", currency: "$", prop: "fixedOrderCommission" },
            { label: "AVS", currency: "$", prop: "avs" }
          ]
        },
        {
          label: "供应链费用小计",
          currency: "$",
          prop: "scmexpenseSubtotal",
          children: [
            { label: "FOB成本", currency: "$", prop: "fobCost" },
            { label: "最新采购成本(参考)", currency: "$", prop: "latestPurchaseCostRef" },
            { label: "头程费用", currency: "$", prop: "headwayCost" },
            { label: "关税", currency: "$", prop: "customsDuty" },
            { label: "海外仓入库费", currency: "$", prop: "overseasWarehouseInCost" },
            { label: "海外仓操作费", currency: "$", prop: "overseasWarehouseOpCost" },
            { label: "尾程费用", currency: "$", prop: "tailwayCost" },
            { label: "仓租", currency: "$", prop: "warehouseRent" },
            { label: "物流罚款", currency: "$", prop: "logisticsPenalty" }
          ]
        },
        {
          label: "后台费用小计",
          currency: "$",
          prop: "backendExpenseSubtotal",
          children: [
            { label: "管理费", currency: "$", prop: "managementFee" },
            { label: "财务费", currency: "$", prop: "financialFee" },
            { label: "资产减值损失", currency: "$", prop: "assetImpairmentLoss" }
          ]
        }
      ]
    }
  },
  computed: {},
  created() {},
  mounted: function () {},
  methods: {
    // 获取结果
    getResultData(data) {
      const otherProps = ["diSavingRate", "breakEvenPromotionRatio", "promotionRatio", "ppm"]
      const formatValue = (item, value) => {
        // 处理本位币显示
        if (!otherProps.includes(item.prop) && data.baseCurrencySymbol && value !== undefined && value !== null) {
          return `${data.baseCurrencySymbol} ${Number(value).toFixed(2)}`
        }
        // 处理费比显示
        if (otherProps.includes(item.prop) && value !== undefined && value !== null) {
          return (value * 100).toFixed(2) + "%"
        }
        return value || "-"
      }

      // 计算占比 （占比=字段值/供货价）同币种/同币种
      const calculateRatio = (value, calSupplyPrice) => {
        if (value === undefined || value === null || !calSupplyPrice) return "-"
        return ((value / calSupplyPrice) * 100).toFixed(2) + "%"
      }

      // 通过本位币计算美元
      const calculateUSDValue = (item, value) => {
        if (value === undefined || value === null || !data.exchangeRate) return "-"
        return `${item.currency} ${(value * data.exchangeRate).toFixed(2)}`
      }

      const newResultData = this.resultData.map((item) => {
        const value = data[item.prop]
        const newItem = { ...item }
        if (item.children) {
          const childrenSum = item.children
            .reduce((sum, child) => {
              const childValue = parseFloat(data[child.prop]) || 0
              return sum + childValue
            }, 0)
            .toFixed(2)

          newItem.standardCurrencyValue = formatValue(item, childrenSum)
          newItem.value = otherProps.includes(item.prop)
            ? formatValue(item, childrenSum)
            : calculateUSDValue(item, childrenSum)
        } else {
          // 设置本位币值
          newItem.standardCurrencyValue = formatValue(item, value)
          // 设置主项的值（美元）
          newItem.value = otherProps.includes(item.prop) ? formatValue(item, value) : calculateUSDValue(item, value)
        }

        // 处理子项
        if (item.children) {
          let totalRatioValue = 0
          newItem.children = item.children.map((child) => {
            const childValue = data[child.prop]
            totalRatioValue += Number(((childValue / data.calSupplyPrice) * 100).toFixed(2))
            return {
              ...child,
              value: calculateUSDValue(child, childValue),
              ratio: calculateRatio(childValue, data.calSupplyPrice),
              standardCurrencyValue: formatValue(child, childValue)
            }
          })
          newItem.ratio = totalRatioValue.toFixed(2) + "%"
        }

        // 计算主项的比率（排除特定字段）
        const excludedProps = ["calSalePrice", "nonTaxPrice", "calSupplyPrice", ...otherProps]
        if (!excludedProps.includes(item.prop) && !item.children) {
          newItem.ratio = calculateRatio(value, data.calSupplyPrice)
        }

        return newItem
      })

      this.resultData = newResultData
    }
  }
}
</script>

<style lang="scss" scoped>
// 计算结果区域
.pricing-section {
  .section-header {
    margin-bottom: 10px;
    padding-bottom: 16px;
    border-bottom: 1px solid #dcdfe6;

    .title {
      font-size: 16px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
  }

  .section-result-body {
    .result-item {
      margin-bottom: 8px;

      &.with-border {
        position: relative;
        padding-bottom: 15px;

        .divider {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: #ebeef5;
        }
      }
    }

    .result-row {
      display: flex;
      align-items: center;
      min-height: 28px;
    }

    .result-label,
    .sub-label {
      width: 200px;
      padding-right: 16px;
      text-align: right;
      color: #606266;
      font-size: 14px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    .result-values {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      align-items: center;

      .value,
      .standard-value,
      .ratio {
        padding: 0 8px;
        text-align: center;
        font-size: 14px;
      }

      .standard-value {
        position: relative;

        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 16px;
          background: #dcdfe6;
        }
      }
    }

    .sub-items {
      margin-top: 8px;
      padding: 10px 0px;
      background: #f5f7fa;
      border-radius: 4px;

      .sub-item {
        display: flex;
        align-items: center;
        min-height: 28px;

        &:not(:last-child) {
          margin-bottom: 8px;
        }
      }
    }
  }
}
</style>
