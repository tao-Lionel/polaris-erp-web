export const tableOption = {
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  stripe: false,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "main",
  selectionFixed: "left",
  column: [
    { label: "采购计划号", prop: "purchasePlanCode", sortable: false, solt: true },
    { label: "采购单号", prop: "purchaseOrderNo", sortable: false, solt: true },
    { label: "采购状态", prop: "poOrderStatusName", sortable: false, solt: true },
    { label: "单据类型", prop: "purchaseDocumentTypeName", sortable: false },
    { label: "采购单属性", prop: "purchaseAttributesName", sortable: false },
    { label: "单据时间", prop: "createTime", sortable: "custom" },
    { label: "采购组织", prop: "corporationName", sortable: false },
    { label: "供应商", prop: "supplierName", sortable: false },
    { label: "商品种数", prop: "skuCount", sortable: false, solt: true },
    { label: "商品总件数", prop: "totalNum", sortable: false },
    { label: "采购总金额", prop: "amount", sortable: false },
    { label: "币别", prop: "currency", sortable: false },
    { label: "价格模式", prop: "priceModel", sortable: false, solt: true },
    { label: "排柜个数", prop: "cabinetContainerNum", sortable: false },
    { label: "排柜件数", prop: "cabinetNum", sortable: false },
    { label: "入库件数", prop: "inboundQuantity", sortable: false },
    { label: "入库仓库", prop: "warehouseName", sortable: false },
    { label: "下发数夫状态", prop: "saleOrderIssuedSoonforStatusName", sortable: false, solt: true },
    { label: "数夫销售订单号", prop: "saleOrderSoonforForecastOrderCode", sortable: false },
    { label: "付款状态", prop: "paymentStatusName", sortable: false },
    { label: "合同状态", prop: "contractStatusName", sortable: false },
    { label: "合同编号", prop: "poContractNo", sortable: false, solt: true },
    { label: "采购员", prop: "purchaser", sortable: false },
    { label: "操作", fixed: "right", prop: "operation", sortable: false, solt: true, width: 140 }
  ]
}

export const createTableOption = {
  border: true,
  selection: true,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "create",
  header: true,
  index: true,
  indexLabel: "序号",
  columnBtn: false,
  column: [
    { label: "标准SPU", prop: "standardSpuCode", sortable: false },
    { label: "标准SKU", prop: "standardSkuCode", sortable: false, width: 150 },
    { label: "工厂SKU", prop: "skuCode", sortable: false },
    { label: "产品名称", prop: "productName", sortable: false },
    { label: "平台", prop: "platform", sortable: false },
    { label: "站点", prop: "site", sortable: false },
    { label: "非税单价", prop: "noTaxPrice", sortable: false, width: 150 },
    { label: "采购计划数量", prop: "plannedQuantity", sortable: false, width: 150 },
    { label: "已采数量", prop: "purchasedQuantity", sortable: false, width: 150 },
    { label: "本次采购数量", prop: "currentProcurementQuantity", sortable: false, width: 150, solt: true },
    { label: "采购总金额", prop: "totalAmount", sortable: false, width: 180 },
    { label: "币种", prop: "currency", sortable: false, width: 150 },
    { label: "产品长*宽*高(cm)", prop: "specification", sortable: false, width: 150 },
    { label: "包装长*宽*高(cm)", prop: "packageSpecification", sortable: false, width: 150 },
    { label: "平台订单号", prop: "platformCode", sortable: false, width: 150, solt: true }
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
  localStorageSymbol: "create",
  header: false,
  index: true,
  indexLabel: "序号",
  showSummary: true,
  column: [
    { label: "标准SPU", prop: "standardSpuCode", sortable: false },
    { label: "标准SKU", prop: "standardSkuCode", sortable: false, width: 150 },
    { label: "工厂SKU", prop: "skuCode", sortable: false },
    { label: "产品名称", prop: "skuName", sortable: false },
    { label: "平台", prop: "platform", sortable: false, width: 180 },
    { label: "站点", prop: "site", sortable: false, width: 180 },
    { label: "非税单价", prop: "noTaxPrice", sortable: false, width: 150 },
    { label: "采购计划数量", prop: "plannedQuantity", sortable: false, width: 150 },
    { label: "采购数量", prop: "purchaseQuantity", sortable: false, width: 150 },
    { label: "采购总金额", prop: "totalAmount", sortable: false, width: 150 },
    { label: "币种", prop: "currency", sortable: false, width: 150 },
    { label: "排柜数量", prop: "arrangeDeliveryQuantity", sortable: false, width: 150 },
    { label: "入库数量", prop: "inboundQuantity", sortable: false, width: 150 },
    { label: "排柜号", prop: "detailAssociatedDeliveryOrderNo", sortable: false, width: 150 },
    { label: "送货单号", prop: "detailAssociatedDeliveryNo", sortable: false, width: 150 },
    { label: "产品长*宽*高(cm)", prop: "specification", sortable: false, width: 150 },
    { label: "包装长*宽*高(cm)", prop: "packageSpecification", sortable: false, width: 150 },
    { label: "平台订单号", prop: "platformOrderNo", sortable: false, width: 150 }
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

export const skuInfoDialogOption = {
  selection: false,
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  stripe: false,
  menu: false,
  header: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  maxHeight: 400,
  column: [
    { label: "SKU", sortable: false, prop: "skuCode" },
    { label: "SKU名称", sortable: false, prop: "skuName" },
    { label: "采购数量", sortable: false, prop: "purchaseQuantity" },
    { label: "单价", sortable: false, prop: "price" },
    { label: "平台", sortable: false, prop: "platformCode" },
    { label: "站点", sortable: false, prop: "sitCode" },
    // { label: "交易税率(%)", sortable: false, prop: "taxRate" },
    { label: "金额", sortable: false, prop: "total" },
    { label: "采购计划单号", sortable: false, prop: "purchasePlanCode" }
  ]
}

export let createContractTableOption = {
  border: true,
  selection: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  header: false,
  menu: false,
  pageFlag: false, //是否显示分页器
  dic: [],
  column: [
    {
      label: "合同条款名称",
      prop: "informationName",
      sortable: false
    }
  ]
}

export const detailExportOption = [
  { label: "采购单号", prop: "purchaseOrderNo" },
  { label: "采购员", prop: "createName" },
  { label: "采购计划号", prop: "purchasePlanCode" },
  { label: "单据状态", prop: "poOrderStatusName" },
  { label: "单据属性", prop: "purchaseAttributesName" },
  { label: "单据时间", prop: "createTime" },
  { label: "采购计划员", prop: "createName" },
  { label: "单据类型", prop: "documentTypeName" },
  { label: "采购组织", prop: "corporationName" },
  { label: "价格模式", prop: "priceModel" },
  { label: "结算方式", prop: "settleaccountTypeName" },
  { label: "入库仓库", prop: "warehouseName" },
  { label: "供应商", prop: "supplierName" },
  { label: "销售期望交期", prop: "planDelivery" },
  { label: "工厂预计交期(变更前)", prop: "factoryEstimatedDeliveryDateBefore" },
  { label: "工厂预计交期(变更后)", prop: "factoryEstimatedDeliveryDate" },
  { label: "变更原因", prop: "changeReason" },
  { label: "备注", prop: "remarks" },
  ...detailTableOption.column
]

export const poOrderStatusArrColor = {
  10: "#606266",
  11: "#FF9214",
  12: "#E6A23C",
  13: "#67C23A",
  14: "#409EFF",
  15: "#909399",
  16: "#F56C6C"
}

export const saleOrderIssuedSoonforStatusArrColor = {
  1: "#67C23A",
  3: "#F56C6C"
}
