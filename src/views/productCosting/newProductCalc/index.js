export const tableOption = {
  maxHeight: document.body.clientHeight - 408, //固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  // editBtn: true,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2],//dialog是否可选
  fixed: false,
  searchShow: true,
  showSearchBtn: true,
  showEmptyBtn: true,
  searchFlag: true,
  searchAdvanced: false, //高级搜索
  selection: true,
  selectionFixed: true,
  index: true,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器
  selectionFixed: true, // 选择列固定
  column: [
    {
      label: "试算编号",
      prop: "pricingTrialCode",
      sortable: false
    },
    {
      label: "SPU",
      prop: "spuCode",
      sortable: false
    },

    {
      label: "标准SKU",
      prop: "standardSkuCode",
      sortable: false
    },
    {
      label: "工厂SKU",
      prop: "skuCode",
      sortable: false
    },
    {
      label: "站点",
      prop: "site",
      sortable: false
    },
    {
      label: "平台",
      prop: "platform",
      sortable: false
    },
    {
      label: "销售模式",
      prop: "orderBusinessType",
      sortable: false
    },
    {
      label: "配送方式",
      prop: "logisticsDeliveryModeName",
      width: 100,
      sortable: false
    },
    {
      label: "含税售价",
      prop: "salePrice",
      solt: true,
      sortable: false
    },

    {
      label: "非税售价",
      prop: "nonTaxPrice",
      solt: true,
      sortable: false
    },
    {
      label: "供货价",
      prop: "supplyPrice",
      solt: true,
      sortable: false
    },
    {
      label: "PPM",
      prop: "ppm",
      sortable: false
    },
    {
      label: "运费逻辑PPM",
      prop: "freightLogicPPM",
      sortable: false,
      width: 120
    },
    {
      label: "运费PPM差",
      prop: "ppmDiff",
      sortable: false,
      width: 120
    },
    {
      label: "推广费比",
      prop: "promotionRatio",
      sortable: false
    },

    {
      label: "经营利润率",
      prop: "operatingProfitStr",
      sortable: false,
      width: 120
    },
    {
      label: "税前利润率",
      prop: "profitStr",
      sortable: false,
      width: 120
    },

    {
      label: "创建人 / 时间",
      prop: "createTime",
      sortable: false,
      solt: true,
      width: 160
    },
    {
      label: "更新人 / 时间",
      prop: "updateTime",
      sortable: false,
      solt: true,
      width: 160
    },
    {
      label: "操作",
      prop: "opeSlot",
      sortable: false,
      solt: true,
      width: 180,
      fixed: "right",
      copy: false
    }
  ]
}
export const tableColumn = [
  {
    label: "试算编号",
    prop: "pricingTrialCode"
  },
  {
    label: "SPU",
    prop: "spuCode"
  },

  {
    label: "标准SKU",
    prop: "standardSkuCode"
  },
  {
    label: "工厂SKU",
    prop: "skuCode"
  },
  {
    label: "站点",
    prop: "site"
  },
  {
    label: "平台",
    prop: "platform"
  },
  {
    label: "销售模式",
    prop: "orderBusinessType"
  },
  {
    label: "配送方式",
    prop: "logisticsDeliveryModeName"
  },
  {
    label: "含税售价",
    prop: "salePrice"
  },

  {
    label: "非税售价",
    prop: "nonTaxPrice"
  },
  {
    label: "供货价",
    prop: "supplyPrice"
  },
  {
    label: "PPM",
    prop: "ppm"
  },
  {
    label: "运费逻辑PPM",
    prop: "freightLogicPPM"
  },
  {
    label: "运费PPM差",
    prop: "ppmDiff"
  },
  {
    label: "推广费比",
    prop: "promotionRatio"
  },

  {
    label: "经营利润率",
    prop: "operatingProfitStr"
  },
  {
    label: "税前利润率",
    prop: "profitStr"
  },

  {
    label: "创建人",
    prop: "createName"
  },
  {
    label: "创建时间",
    prop: "createTime"
  },
  {
    label: "更新人",
    prop: "updateName"
  },
  {
    label: "更新时间",
    prop: "updateTime"
  }
]

export const detailsData = {
  id: "id",
  pricingTrialCode: "试算编号",
  pricingTrialStatusName: "状态",
  platform: "平台",
  site: "站点",
  orderBusinessType: "销售模式",
  logisticsDeliveryModeName: "配送方式",
  productTypeName: "产品档案",
  standardSkuCode: "标准SKU",
  skuCode: "工厂SKU",
  purchaseSupplierCode: "采购供应商编码",
  purchaseSupplierName: "采购供应商名称",
  skuName: "SKU名称",
  categoryId: "品类id",
  categoryName: "品类名字",
  promotionCost: "推广费",
  spuCode: "SPU",
  packageLength: "包装长",
  packageWidth: "包装宽",
  packageHeight: "包装高",
  packageGrossWeight: "包装毛重",
  outerBoxLength: "外箱长",
  outerBoxWidth: "外箱宽",
  outerBoxHeight: "外箱高",
  boxGrossWeight: "外箱毛重",
  boxs: "装箱数量",
  salePrice: "含税售价",
  supplyPrice: "供货价",
  promotionExpenses: "推广费比",
  calSalePrice: "含税售价",
  calSupplyPrice: "供货价",
  pricingCalculationTypeName: "核价类型",
  pricingCalculationMethodName: "核价逻辑",
  pricingWarehouseServiceMethodName: "仓储服务",
  profit: "税前利润率",
  preTaxProfit: "税前利润",
  latestPreTaxProfitRef: "最新成本税前利润(参考)",
  operatingProfit: "经营利润",
  nonTaxPrice: "非税售价",
  ppm: "PPM",
  ppmDiff: "运费PPM差",
  diSavingRate: "DI Saving Rate",
  breakEvenPromotionRatio: "盈亏平衡推广费比",
  promotionRatio: "推广费比(占含税售价)",
  refund: "退款",
  btr: "BTR",
  salesPenalty: "销售罚款",
  platformCommissionRate: "平台比例佣金",
  fixedOrderCommission: "订单固定佣金",
  avs: "AVS",
  fobCost: "FOB成本",
  latestPurchaseCostRef: "最新采购成本(参考)",
  headwayCost: "头程费用",
  customsDuty: "关税",
  overseasWarehouseInCost: "海外仓入库费",
  overseasWarehouseOpCost: "海外仓操作费",
  tailwayCost: "尾程费用",
  warehouseRent: "仓租",
  logisticsPenalty: "物流罚款",
  managementFee: "管理费",
  financialFee: "财务费",
  assetImpairmentLoss: "资产减值损失",
  exchangeRate: "汇率",
  version: "版本",
  time: "版本时间",
  currency: "币种",
  fobCostInputCurrency: "FOB币种",
  refundRatio: "退款比",
  // diSavingRateInput: null,
  // headwayCostInput: null,
  // fobCostInput: null,
  // ppmInput: null,

  createName: "创建人",
  createTime: "创建时间",
  updateName: "更新人",
  updateTime: "更新时间",
  baseCurrencySymbol: "本位币",
  operatingExpenseSubtotal: "运营费用小计",
  operatingCommissionSubtotal: "运营佣金小计",
  scmExpenseSubtotal: "供应链费用小计",
  backendExpenseSubtotal: "后台费用小计"
}
export const detailColumnList = [
  // ...tableOption.column,
  ...Object.entries(detailsData).map(([key, value]) => {
    return {
      label: value,
      prop: key
    }
  })
]
