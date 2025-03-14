export const tableOption = {
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  fixed: false,
  searchShow: true,
  showSearchBtn: true,
  showEmptyBtn: true,
  searchFlag: true,
  searchAdvanced: true, //高级搜索
  // index: true,
  selection: true,
  selectionFixed: true,
  index: false,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器
  localStorageSymbol: "list",
  column: [
    { label: "店铺", prop: "storeAccount", sortable: false },
    { label: "链接SPU", prop: "linkSpuCode", sortable: false },
    { label: "链接SKU", prop: "linkSkuCode", sortable: false },
    { label: "ASIN", prop: "asin", sortable: false },
    { label: "含税售价", prop: "sellingPriceHasTax", sortable: false },
    { label: "非税售价", prop: "sellingPrice", sortable: false },
    { label: "DI供货价", prop: "diSupplyPrice", sortable: false },
    { label: "PO供货价", prop: "poSupplyPrice", sortable: false },
    { label: "DF/多平台供货价", prop: "dfAndOtherSupplyPrice", sortable: false },
    { label: "重点SKU", prop: "focusStatus", sortable: false, width: 120, solt: true },
    { label: "新老品", prop: "productStatus", sortable: false, solt: true },
    { label: "销售状态", prop: "saleStatus", sortable: false, solt: true },
    { label: "审核状态", prop: "auditStatus", sortable: false, solt: true },
    { label: "品牌", prop: "brandName", sortable: false },
    { label: "标准SKU", prop: "parentSkuCode", sortable: false },
    { label: "标准SPU", prop: "spuCode", sortable: false },
    { label: "品类", prop: "categoryName", sortable: false },
    { label: "一级负责人", prop: "firstLeaderName", sortable: false },
    { label: "二级负责人", prop: "secondLeaderName", sortable: false },
    { label: "运营", prop: "operatorName", sortable: false },
    { label: "核价需求", prop: "pricingDemandStatusName", sortable: false, solt: true },
    { label: "已启用核价（条）", prop: "bound", sortable: false, solt: true },
    { label: "待启用核价（条）", prop: "available", sortable: false, solt: true },
    { label: "开售时间", prop: "saleStartTime", width: 220, sortable: false },
    { label: "平台", prop: "platform", sortable: false },
    { label: "站点", prop: "site", sortable: false },
    // { label: "是否核价", prop: "auditPriceStatus", sortable: false, solt: true, copy: false },
    { label: "item_id/product_id", prop: "platformItemId", sortable: false, solt: true },
    { label: "wm", prop: "platformSkuCode", sortable: false, solt: true },
    { label: "gtin/sku_id", prop: "platformSkuId", sortable: false, solt: true },
    { label: "更新人", prop: "updateName" },
    { label: "更新时间", prop: "updateTime" },
    { label: "创建人", prop: "createName" },
    { label: "创建时间", prop: "createTime" },
    { label: "操作", prop: "operate", width: 150, sortable: false, solt: true, fixed: "right", copy: false }
  ]
}
export const createTableOption = {
  border: true,
  index: true,
  indexLabel: "序号",
  menu: false,
  header: false,
  column: [
    { label: "标准SPU", prop: "spuCode", sortable: false, solt: true, required: true, width: 180, copy: false },
    { label: "标准SKU", prop: "parentSkuCode", sortable: false, solt: true, required: true, width: 180, copy: false },
    { label: "链接SPU", prop: "linkSpuCode", sortable: false, solt: true, required: true, width: 180, copy: false },
    { label: "链接SKU", prop: "linkSkuCode", sortable: false, solt: true, required: true, width: 180, copy: false },
    { label: "ASIN", prop: "asin", sortable: false, solt: true, width: 180, copy: false },
    { label: "item_id/product_id", prop: "platformItemId", sortable: false, solt: true, width: 180, copy: false },
    { label: "wm", prop: "platformSkuCode", sortable: false, solt: true, width: 180, copy: false },
    { label: "gtin/sku_id", prop: "platformSkuId", sortable: false, solt: true, width: 180, copy: false },
    { label: "操作", prop: "operate", sortable: false, solt: true, copy: false, fixed: "right" }
  ]
}

export const bindingPriceOption = {
  border: true,
  index: false,
  menu: false,
  header: false,
  column: [
    { label: "标准SKU", prop: "parentSku", sortable: false },
    { label: "链接SKU", prop: "linkSku", sortable: false },
    { label: "工厂SKU", prop: "skuCode", sortable: false },
    { label: "平台", prop: "platformName", sortable: false },
    { label: "站点", prop: "sitName", sortable: false },
    { label: "状态", prop: "auditStatus", sortable: false, solt: true },
    { label: "店铺", prop: "storeName", sortable: false },
    { label: "模式", prop: "salesModel", sortable: false },
    { label: "标准售价", prop: "sellingPrice", sortable: false },
    { label: "供货价", prop: "supplyPrice", sortable: false },
    { label: "操作", prop: "operate", sortable: false, solt: true, copy: false, width: 100, fixed: "right" }
  ]
}

// 已关联核价
export const relationshipTableOption = {
  border: true,
  selection: false,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "detail",
  searchAdvanced: false, //高级搜索
  header: false,
  index: true,
  indexLabel: "序号",
  calcColWidth: true, // 动态计算列宽
  column: [
    { label: "核价编码", prop: "pricingInfoCode", sortable: false },
    { label: "工厂SKU", prop: "skuCode", sortable: false },
    { label: "销售模式", prop: "orderBusinessType", sortable: false },
    { label: "配送方式", prop: "logisticsDeliveryModeName", sortable: false },
    { label: "含税售价", prop: "salePrice", sortable: false, solt: true },
    { label: "非税售价", prop: "nonTaxPrice", sortable: false, solt: true },
    { label: "供货价", prop: "supplyPrice", sortable: false, solt: true },
    { label: "PPM", prop: "ppm", sortable: false },
    { label: "推广费比", prop: "promotionExpenses", sortable: false },
    // { label: "经营利润率", prop: "operatingProfitStr", sortable: false },
    { label: "税前利润率", prop: "profitStr", sortable: false },
    { label: "采购供应商", prop: "purchaseSupplierName", sortable: false },
    { label: "状态", prop: "bindingStatus", sortable: false, solt: true },
    { label: "操作人/启用时间", prop: "enableTime", sortable: false, solt: true },
    { label: "操作人/失效时间", prop: "disableTime", sortable: false, solt: true }
  ]
}

// 可启用核价
export const canTableOption = {
  border: true,
  selection: false,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "detail",
  searchAdvanced: false, //高级搜索
  header: false,
  index: true,
  indexLabel: "序号",
  calcColWidth: true, // 动态计算列宽
  column: [
    { label: "核价编码", prop: "pricingInfoCode", sortable: false },
    { label: "工厂SKU", prop: "skuCode", sortable: false },
    { label: "销售模式", prop: "orderBusinessType", sortable: false },
    { label: "配送方式", prop: "logisticsDeliveryModeName", sortable: false },
    { label: "含税售价", prop: "salePrice", sortable: false, solt: true },
    { label: "非税售价", prop: "nonTaxPrice", sortable: false, solt: true },
    { label: "供货价", prop: "supplyPrice", sortable: false, solt: true },
    { label: "PPM", prop: "ppm", sortable: false },
    { label: "推广费比", prop: "promotionExpenses", sortable: false },
    // { label: "经营利润率", prop: "operatingProfitStr", sortable: false },
    { label: "税前利润率", prop: "profitStr", sortable: false },
    { label: "采购供应商", prop: "purchaseSupplierName", sortable: false },
    { label: "操作", prop: "operate", sortable: false, copy: false, solt: true }
  ]
}

// 核价需求
export const requireTableOption = {
  border: true,
  selection: false,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "detail",
  searchAdvanced: false, //高级搜索
  header: false,
  fixHeight: 450,
  calcColWidth: true, // 动态计算列宽
  column: [
    { label: "需求编码", prop: "pricingDemandCode", sortable: false },
    { label: "销售模式", prop: "orderBusinessType", sortable: false },
    { label: "配送方式", prop: "logisticsDeliveryModeName", sortable: false },
    { label: "类型", prop: "pricingTypeName", sortable: false },
    { label: "含税售价", prop: "salePrice", sortable: false, solt: true },
    { label: "供货价", prop: "supplyPrice", sortable: false, solt: true },
    { label: "推广费比", prop: "promotionExpenses", sortable: false },
    { label: "需求描述", prop: "demandDescription", sortable: false },
    { label: "需求状态", prop: "pricingDemandStatusName", sortable: false, solt: true },
    { label: "含税售价", prop: "calSalePrice", sortable: false, solt: true, width: 120 },
    { label: "非税售价", prop: "nonTaxPrice", sortable: false, solt: true, width: 120 },
    { label: "供货价", prop: "calSupplyPrice", sortable: false, solt: true, width: 120 },
    { label: "PPM", prop: "ppm", sortable: false, width: 120 },
    { label: "推广费比", prop: "promotionExpenses", sortable: false, width: 120 },
    // { label: "经营利润率", prop: "operatingProfitStr", sortable: false },
    { label: "税前利润率", prop: "profitStr", sortable: false },
    { label: "采购供应商", prop: "purchaseSupplierName", sortable: false },
    { label: "核价状态", prop: "pricingInfoStatus", sortable: false, solt: true },
    { label: "创建人/创建时间", prop: "demandCreateByName", sortable: false, solt: true, width: 160 },
    { label: "操作", prop: "operate", sortable: false, copy: false, solt: true }
  ]
}

export const distributeLogTableOption = {
  border: true,
  selection: false,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  searchAdvanced: false, //高级搜索
  header: true,
  fixHeight: 450,
  columnBtn: false,
  column: [
    { label: "变更级别", prop: "levelName", sortable: false },
    { label: "变更后负责人", prop: "userName", sortable: false },
    { label: "起效时间", prop: "enableTime", sortable: false },
    { label: "失效时间", prop: "disableTime", sortable: false, solt: true },
    { label: "状态", prop: "status", sortable: false, solt: true },
    { label: "备注", prop: "remark", sortable: false },
    { label: "操作人/操作时间", prop: "enableTime", sortable: false, solt: true }
  ]
}
