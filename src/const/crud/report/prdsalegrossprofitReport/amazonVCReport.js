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
      label: "FOB成本DI",
      minWidth: 110,
      prop: "purchasePriceDi"
    },
    {
      label: "FOB成本PO",
      prop: "purchasePricePo"
    },
    {
      label: "建议售价",
      prop: "sellingPrice"
    },
    {
      label: "SC建议售价",
      prop: "sellingPriceSc"
    },
    {
      label: "DI供货价",
      minWidth: 110,
      prop: "supplyPriceDi"
    },
    {
      label: "PO供货价",
      minWidth: 110,
      prop: "supplyPricePo"
    },
    {
      label: "推广费",
      minWidth: 110,
      prop: "promotionExpenses"
    },
    {
      label: "DI毛利率",
      minWidth: 110,
      prop: "grossProfitRateDi"
    },
    {
      label: "PO毛利率",
      minWidth: 110,
      prop: "grossProfitRatePo"
    },
    {
      label: "SC毛利率",
      prop: "grossProfitRateSc"
    },
    {
      label: "综合毛利率",
      prop: "comGrossProfitRate"
    },
    {
      label: "DI供货价折扣率",
      prop: "supplyPriceDiscountDi"
    },
    {
      label: "PO供货价折扣率",
      prop: "supplyPriceDiscountPo"
    },
    {
      label: "DI PPM",
      prop: "ppmDi"
    },
    {
      label: "PO PPM",
      prop: "ppmPo"
    },
    {
      label: "DI与PO供货差距",
      prop: "supplyPriceDisparity"
    },
    {
      label: "SC售价和DI售价的差额",
      prop: "sellingPriceDisparity"
    },
    {
      label: "推广费比例",
      prop: "promotionExpensesRate"
    }
  ]
}
