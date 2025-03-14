export const tableOption = {
  border: true,
  selection: true,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "main",
  searchAdvanced: true, //高级搜索
  calcColWidth: true, // 动态计算列宽
  selectionFixed: true, // 选择列固定
  column: [
    { label: "需求编码", prop: "pricingDemandCode", sortable: false, solt: true },
    { label: "类型", prop: "pricingTypeName", sortable: false, width: 100 },
    { label: "平台", prop: "platform", sortable: false },
    { label: "站点", prop: "site", sortable: false, width: 100 },
    { label: "销售模式", prop: "orderBusinessType", sortable: false, width: 100 },
    { label: "配送方式", prop: "logisticsDeliveryModeName", sortable: false, width: 100 },
    { label: "标准SPU", prop: "spuCode", sortable: false },
    { label: "标准SKU", prop: "standardSkuCode", sortable: false },
    { label: "备注", prop: "remarkString", sortable: false, width: 150, solt: true },
    { label: "税前利润率", prop: "profitString", sortable: false },
    { label: "含税售价", prop: "salePriceString", sortable: false },
    { label: "供货价", prop: "supplyPriceString", sortable: false },
    { label: "推广费比(占含税售价)", prop: "promotionExpensesString", sortable: false },
    { label: "需求描述", prop: "demandDescriptionString", sortable: false, width: 150 },
    { label: "需求状态", prop: "pricingDemandStatusName", sortable: false, solt: true, width: 100 },
    { label: "生成状态", prop: "pricingGenerateStatus", sortable: false, solt: true, width: 100 },
    { label: "创建人/创建时间", prop: "demandCreateTime", solt: true, sortable: "custom", width: 160 },
    { label: "更新人/更新时间", prop: "demandUpdateTime", solt: true, sortable: "custom", width: 160 },
    { label: "操作", prop: "operate", width: 130, sortable: false, solt: true, copy: false, fixed: "right" }
  ]
}

export const batchCostingTableOption = {
  border: true,
  selection: true,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  searchAdvanced: false, //高级搜索
  columnBtn: false,
  subtractedHeight: 50, // 需要减去的高度
  selectionFixed: true, // 选择列固定
  column: [
    { label: "标准SPU", prop: "spuCode", sortable: false },
    { label: "标准SKU", prop: "standardSkuCode", sortable: false },
    { label: "工厂SKU", prop: "skuCode", sortable: false },
    { label: "平台", prop: "platform", sortable: false },
    { label: "站点", prop: "site", sortable: false, width: 100 },
    { label: "销售模式", prop: "orderBusinessType", sortable: false, width: 100 },
    { label: "配送方式", prop: "logisticsDeliveryModeName", sortable: false, width: 100 },
    // { label: "备注", prop: "remarkString", sortable: false, width: 120, solt: true },
    { label: "税前利润率", prop: "profit", sortable: false, solt: true, width: 150 },
    { label: "含税售价", prop: "salePrice", sortable: false, solt: true, width: 150 },
    { label: "供货价", prop: "supplyPrice", sortable: false, solt: true, width: 150 },
    { label: "非税售价", prop: "nonTaxPrice", sortable: false, width: 120 },
    { label: "FOB成本", prop: "fobCost", sortable: false, width: 120 },
    { label: "PPM", prop: "ppmInput", sortable: false, solt: true, width: 150 },
    { label: "推广费比(占含税售价)", prop: "promotionExpenses", sortable: false, solt: true, width: 150 },
    { label: "核价类型", prop: "pricingCalculationType", sortable: false, solt: true, width: 200 },
    { label: "核价逻辑", prop: "pricingCalculationMethod", sortable: false, solt: true, width: 150 },
    { label: "采购供应商", prop: "purchaseSupplierCode", sortable: false, solt: true, width: 150 },
    { label: "使用海外仓", prop: "useOverseasWarehouse", sortable: false, solt: true, width: 110 },
    { label: "使用平台仓", prop: "usePlatformWarehouse", sortable: false, solt: true, width: 110 },
    { label: "生成状态", prop: "pricingGenerateStatus", sortable: false, solt: true, width: 100 },
    { label: "操作", prop: "operation", sortable: false, solt: true }
  ]
}

export const pricingDemandStatusColor = {
  INITIAL_PENDING: "#E6A23C",
  DEMAND_REJECTED: "#F56C6C",
  DEMAND_COMPLETE: "#67C23A",
  DEMAND_CANCEL: "#909399"
}

export const pricingGenerateStatusColor = {
  NOT_GENERATED: "#909399",
  FAIL: "#F56C6C",
  GENERATING: "#E6A23C",
  SUCCESS: "#67C23A"
}
