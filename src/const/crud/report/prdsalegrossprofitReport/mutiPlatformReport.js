export const tableOption = {
  maxHeight: document.body.clientHeight - 360, //固定标题
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: false,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  isMedia: true,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  menu: false,
  selection: false,
  dic: [],
  column: [
    {
      label: "测算批次号",
      minWidth: 110,
      prop: "batchId"
    },
    {
      label: "产品定位",
      minWidth: 110,
      prop: "productPositioning"
    },
    {
      label: "品牌",
      minWidth: 110,
      prop: "brandName"
    },
    {
      label: "SKU",
      minWidth: 110,
      prop: "sku"
    },
    {
      label: "品类",
      minWidth: 110,
      prop: "categoryName"
    },
    {
      label: "产品长*宽*高(cm)",
      minWidth: 110,
      prop: "specification"
    },
    {
      label: "建议售价",
      prop: "sellingPrice"
    },
    {
      label: "沃尔玛DSV供货价",
      prop: "supplyPriceDsv"
    },
    {
      label: "沃尔玛DSV毛利率",
      prop: "grossProfitRateDsv"
    },
    {
      label: "Wayfair供货价",
      prop: "supplyPriceWayfair"
    },
    {
      label: "Wayfair毛利率",
      prop: "grossProfitRateWayfair"
    },
    {
      label: "Homedepot供货价",
      prop: "supplyPriceHomedepot"
    },
    {
      label: "Homedepot毛利率",
      prop: "grossProfitRateHomedepot"
    },
    {
      label: "Overstock供货价",
      prop: "supplyPriceOverstock"
    },
    {
      label: "Overstock毛利率",
      prop: "grossProfitRateOverstock"
    },
    {
      label: "Low's供货价",
      prop: "supplyPriceLows"
    },
    {
      label: "Low's毛利率",
      prop: "grossProfitRateLows"
    },
    {
      label: "推广费",
      minWidth: 110,
      prop: "promotionExpenses"
    },
    {
      label: "FOB采购成本",
      prop: "purchasePrice"
    },
    {
      label: "目标售价",
      prop: "targetPrice"
    },
    {
      label: "售价差价",
      prop: "sellingPriceDisparity"
    },
    {
      label: "FOB采购成本含税",
      minWidth: 110,
      prop: "purchasePriceAndTraff"
    },
    {
      label: "FOB采购成本差价",
      minWidth: 110,
      prop: "purchasePriceDisparity"
    }
  ]
}
