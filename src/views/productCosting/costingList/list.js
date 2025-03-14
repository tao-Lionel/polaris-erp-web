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
  index: true,
  indexLabel: "序号",
  calcColWidth: true, // 动态计算列宽
  selectionFixed: true, // 选择列固定
  column: [
    { label: "核价编号", prop: "pricingInfoCode", sortable: false },
    { label: "标准SPU", prop: "spuCode", sortable: false },
    { label: "标准SKU", prop: "standardSkuCode", sortable: false },
    { label: "工厂SKU", prop: "skuCode", sortable: false },
    { label: "平台", prop: "platform", sortable: false },
    { label: "站点", prop: "site", sortable: false, width: 100 },
    { label: "销售模式", prop: "orderBusinessType", sortable: false, width: 100 },
    { label: "配送方式", prop: "logisticsDeliveryModeName", sortable: false, width: 100 },
    { label: "税前利润率", prop: "profitStr", sortable: false },
    { label: "含税售价", prop: "salePrice", sortable: false, solt: true },
    { label: "非税售价", prop: "nonTaxPrice", sortable: false, solt: true },
    { label: "供货价", prop: "supplyPrice", sortable: false, solt: true },
    { label: "PPM", prop: "ppm", sortable: false },
    { label: "运费逻辑PPM", prop: "freightLogicPPM", sortable: false },
    { label: "运费PPM差", prop: "ppmDiff", sortable: false },
    { label: "推广费比(占含税售价)", prop: "promotionRatio", sortable: false },
    { label: "经营利润率", prop: "operatingProfitStr", sortable: false },
    { label: "状态", prop: "pricingInfoStatus", sortable: false, solt: true, width: 100 },
    { label: "绑定链接", prop: "pricingRecordLinkSkuList", sortable: false, solt: true, width: 100 },
    { label: "备注", prop: "infoRemark", sortable: false, solt: true },
    { label: "创建人/创建时间", prop: "demandCreateTime", sortable: "custom", solt: true, width: 160 },
    { label: "更新人/更新时间", prop: "demandUpdateTime", sortable: "custom", solt: true, width: 160 },
    { label: "操作", prop: "operation", sortable: false, solt: true, width: 160, fixed: "right" }
  ]
}

export const connectedLinkTableOption = {
  border: true,
  selection: false,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  searchAdvanced: false, //高级搜索
  header: false,
  column: [
    { label: "链接SKU", prop: "linkSkuCode", sortable: false, solt: true },
    { label: "ASIN", prop: "asin", sortable: false },
    { label: "店铺名称", prop: "storeAccountName", sortable: false },
    { label: "状态", prop: "bindingStatus", sortable: false, solt: true },
    { label: "操作人/启用时间", prop: "enableTime", sortable: false, solt: true },
    { label: "操作人/失效时间", prop: "disableTime", sortable: false, solt: true }
  ]
}
