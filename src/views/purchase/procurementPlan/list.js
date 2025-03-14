export const tableOption = {
  border: true,
  selection: true,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "main",
  selectionFixed: "left",
  searchAdvanced: true, //高级搜索
  column: [
    { label: "采购计划号", prop: "purchasePlanCode", sortable: false, solt: true },
    { label: "计划单属性", prop: "planAttributesName", sortable: false },
    { label: "单据类型", prop: "documentTypeName", sortable: false },
    { label: "单据状态", prop: "documentStatusName", sortable: false, solt: true },
    { label: "单据时间", prop: "documentTime", sortable: "custom" },
    { label: "采购计划数量", prop: "plannedPurchaseQuantity", sortable: false },
    { label: "实采数量", prop: "actualPurchaseQuantity", sortable: false },
    { label: "实入数量", prop: "actualReceivedQuantity", sortable: false },
    // { label: "采购组织", prop: "purchaseOrganizationName", sortable: false },
    // { label: "供应商", prop: "supplierName", sortable: false },
    { label: "关联采购单号", prop: "relationPurchaseOrderNo", sortable: false, solt: true, width: 100 },
    { label: "排柜号", prop: "relationDeliveryPlanCode", sortable: false, solt: true },
    { label: "下发数夫状态", prop: "issuedSoonforStatusName", sortable: false, solt: true },
    { label: "数夫预测订单号", prop: "soonforForecastOrderCode", sortable: false },
    { label: "采购计划员", prop: "purchasePlanner", sortable: false },
    // { label: "采购员", prop: "purchaser", sortable: false },
    { label: "操作", prop: "operate", sortable: false, solt: true, fixed: "right", width: 120 }
  ]
}

export const createTableOption = {
  border: true,
  selection: false,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "create",
  header: false,
  index: true,
  indexLabel: "序号",
  column: [
    { label: "标准SPU", prop: "standardSpuCode", sortable: false },
    { label: "标准SKU", prop: "standardSkuCode", sortable: false },
    { label: "工厂SKU", prop: "skuCode", sortable: false },
    { label: "产品名称", prop: "productName", sortable: false },
    { label: "链接SKU", prop: "linkSkuCode", sortable: false, solt: true, width: 180, required: true },
    { label: "采购计划数量", prop: "plannedQuantity", sortable: false, solt: true, required: true, width: 150 },
    { label: "平台", prop: "platform", sortable: false, solt: true, required: true, width: 180 },
    { label: "站点", prop: "site", sortable: false, solt: true, required: true, width: 180 },
    { label: "销售期望交期", prop: "expectedDeliveryDate", sortable: false, solt: true, required: true, width: 180 },
    { label: "海外仓所属区域", prop: "overseasWarehouseRegion", sortable: false, solt: true, width: 150 },
    { label: "操作", prop: "operate", sortable: false, solt: true, width: 90, fixed: "right" }
  ]
}

export const detailTableOption = {
  border: true,
  selection: false,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "detail",
  header: false,
  index: true,
  indexLabel: "序号",
  showSummary: true,
  column: [
    { label: "标准SPU", prop: "standardSpuCode", sortable: false },
    { label: "标准SKU", prop: "standardSkuCode", sortable: false },
    { label: "工厂SKU", prop: "skuCode", sortable: false },
    { label: "产品名称", prop: "productName", sortable: false },
    { label: "链接SKU", prop: "linkSkuCode", sortable: false },
    { label: "采购计划数量", prop: "plannedQuantity", sortable: false },
    { label: "平台", prop: "platform", sortable: false },
    { label: "站点", prop: "site", sortable: false },
    { label: "销售期望交期", prop: "expectedDeliveryDate", sortable: false },
    { label: "海外仓所属区域", prop: "overseasWarehouseRegion", sortable: false, solt: true }
  ]
}

export const logTableOption = {
  border: true,
  selection: false,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "log",
  header: false,
  index: true,
  indexLabel: "序号",
  column: [
    { label: "操作时间", prop: "createTime", sortable: false },
    { label: "操作人", prop: "displayname", sortable: false },
    { label: "操作类型", prop: "logRemark", sortable: false },
    { label: "操作事项", prop: "operateItem", sortable: false }
  ]
}

export const detailExportOption = [
  { label: "采购计划号", prop: "purchasePlanCode" },
  { label: "单据状态", prop: "documentStatusName" },
  { label: "单据时间", prop: "documentTime" },
  { label: "采购计划员", prop: "purchasePlanner" },
  { label: "单据类型", prop: "documentTypeName" },
  { label: "计划单属性", prop: "planAttributesName" },
  { label: "备注", prop: "remark" },
  ...detailTableOption.column
]

export const documentStatusArrColor = {
  0: "#67C23A",
  1: "#FF9214",
  2: "#E6A23C",
  3: "#606266",
  4: "#409EFF",
  5: "#909399",
  6: "#F56C6C"
}

export const issuedSoonforStatusArrColor = {
  1: "#67C23A",
  3: "#F56C6C"
}
