export const tableOption = {
  page: false,
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  searchShow: true,
  showSearchBtn: true,
  searchAdvanced: true, //高级搜索
  selection: true,
  stripe: false,
  menu: false,
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器
  localStorageSymbol: "main",
  column: [
    { label: "发货批次单号", prop: "batchOrderCode", solt: true, search: false, sortable: false, width: 180 },
    { label: "ARN/排柜号", prop: "extendCode", sortable: false, width: 150 },
    { label: "订单号", prop: "soOrderNo", sortable: false, solt: true, copy: false, width: 180 },
    { label: "平台单号", prop: "sourceNo", sortable: false, width: 150 },
    { label: "平台订单编码", prop: "platformOrderCode", sortable: false, width: 150 },
    { label: "标签", prop: "labels", solt: true, width: 200, sortable: false, copy: false },
    { label: "SKU*数量", solt: true, prop: "spliceProducts", search: false, sortable: false, width: 200, copy: false },
    { label: "ASIN*数量", solt: true, prop: "asin", search: false, sortable: false, width: 200, copy: false },
    { label: "平台/站点", prop: "platformSlotText", width: 150, sortable: false },
    { label: "店铺", prop: "store", sortable: false, width: 150 },
    { label: "省/州", prop: "stateOrRegion", sortable: false, width: 100 },
    { label: "异常类型", prop: "abnormalTypeSlotText", sortable: false, width: 120 },
    { label: "备注", prop: "remark", sortable: false, width: 120, solt: true },
    { label: "发货批次单状态", prop: "deliveryStatusSlotText", width: 120, sortable: false },
    { label: "物流渠道", prop: "logisticsChannelName", sortable: false, width: 150 },
    { label: "发货仓库", prop: "warehouse", sortable: false, width: 150 },
    { label: "仓库服务商", prop: "warehouseProviderName", sortable: false, width: 150 },
    { label: "下发仓库状态/原因", prop: "interfaceSendFlag", width: 140, solt: true, sortable: false, copy: false },
    { label: "三方仓出库单号", prop: "wmsCode", sortable: false, width: 150 },
    { label: "下发三方仓时间", prop: "interfaceTransactionTime", sortable: false, width: 180 },
    { label: "跟踪号", prop: "trackingNo", sortable: false, solt: true, width: 150 },
    { label: "平台物流商code", prop: "platformTransportCarrierCode", sortable: false, width: 150 },
    { label: "平台物流商", prop: "platformTransportCarrierName", sortable: false, width: 150 },
    { label: "平台约车单号", prop: "warehouseBookCarCode", sortable: false, width: 150 },
    { label: "仓库发货状态/仓库发货时间", prop: "wmsStatus", solt: true, sortable: false, width: 180 },
    // { label: "下单时间", prop: "orderTime", sortable: false },
    { label: "实际提货时间", prop: "requiredShipDate", sortable: false, width: 180 },
    { label: "提交提货时间", prop: "platformSubmitPickUpTime", sortable: false, width: 180 },
    { label: "ERP发货时间", prop: "erpShippingTime", sortable: false, width: 180 },
    { label: "创建人/创建时间", prop: "createUserName", width: 180, solt: true, sortable: false },
    { label: "更新人/创建时间", prop: "updateUserName", width: 180, solt: true, sortable: false },
    { label: "操作", prop: "operation", solt: true, sortable: false, width: 160, fixed: "right", copy: false }
  ]
}

// 发货批次单详情
export const infoTableOption = {
  page: false,
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  searchShow: true,
  showSearchBtn: false,
  searchAdvanced: false, //高级搜索
  selection: false,
  stripe: false,
  menu: false,
  header: false, //是否显示头部
  pageFlag: false, //是否显示分页器
  // index: true,
  // indexLabel: "序号",
  // fixHeight: 500,
  column: [
    { label: "订单号", prop: "orderCode", sortable: false },
    { label: "平台订单号", prop: "sourceCode", sortable: false },
    { label: "订单来源", prop: "accessModeName", sortable: false },
    { label: "订单类型", prop: "orderTypeName", sortable: false },
    { label: "下单时间", prop: "orderTime", sortable: false },
    { label: "订单总金额(含税)", prop: "totalTaxAmountAndCurrency", sortable: false },
    { label: "订单总金额(不含税)", prop: "totalNoneTaxAmountAndCurrency", sortable: false },
    { label: "订单状态", prop: "fulfillmentStatusName", sortable: false },
    { label: "平台订单状态", prop: "orderStatus", sortable: false },
    { label: "发货时间", prop: "erpShippingTime", sortable: false },
    { label: "平台SKU/SKU/数量", prop: "foDetailInfos", sortable: false, solt: true },
    { label: "自定义托盘号", prop: "cusPalletCode", sortable: false },
    { label: "平台托盘号", prop: "palletCode", sortable: false },
    { label: "自定义箱号", prop: "cusCartonCode", sortable: false },
    { label: "平台箱号", prop: "cartonCode", sortable: false },
    { label: "操作", prop: "operation", sortable: false, solt: true, fixed: "right" }
  ]
}

// 发货批次单产品详情
export const productOption = {
  page: false,
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  searchShow: true,
  showSearchBtn: false,
  searchAdvanced: false, //高级搜索
  selection: false,
  stripe: true,
  menu: false,
  header: false, //是否显示头部
  pageFlag: false, //是否显示分页器
  // index: true,
  // indexLabel: "序号",
  showSummary: true,
  column: [
    { label: "明细行行号", prop: "detailLineNo", sortable: false, width: 120 },
    { label: "图片", prop: "imageUrl", sortable: false, solt: true },
    { label: "平台SKU", prop: "asin", sortable: false },
    { label: "品名", prop: "skuName", sortable: false },
    { label: "SKU", prop: "sku", sortable: false, solt: true, width: 150 },
    { label: "数量", prop: "expectedQuantity", sortable: false },
    { label: "接收数量", prop: "receiveQuantity", sortable: false },
    { label: "确认发货量", prop: "validQuantity", sortable: false, width: 120 },
    { label: "已发货量", prop: "actualDeliveryNum", sortable: false },
    { label: "取消数量", prop: "cancelQuantity", sortable: false },
    { label: "退货数量", prop: "actualReturnQuantity", sortable: false },
    { label: "销售单价", prop: "unitSalesPrice", sortable: false, solt: true, width: 120 },
    { label: "实付单价(不含税)", prop: "noneTaxPrice", sortable: false, solt: true, width: 120 },
    { label: "税率/税费", prop: "tax", sortable: false, solt: true, width: 120 },
    { label: "实付单价(含税)", prop: "taxPrice", sortable: false, solt: true, width: 120 },
    { label: "实付总金额(不含税)", prop: "noneTaxAmount", sortable: false, solt: true, width: 150 },
    { label: "实付总金额(含税)", prop: "taxAmount", sortable: false, solt: true, width: 120 },
    { label: "延期要求", prop: "address", sortable: false, solt: true }
  ]
}

export const logOption = {
  page: false,
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  searchShow: true,
  showSearchBtn: false,
  searchAdvanced: false, //高级搜索
  selection: false,
  stripe: true,
  menu: false,
  header: false, //是否显示头部
  pageFlag: false, //是否显示分页器
  index: true,
  indexLabel: "序号",
  column: [
    { label: "操作时间", prop: "createTime", sortable: false },
    { label: "操作人", prop: "createByName", sortable: false },
    { label: "操作类型", prop: "operateType", sortable: false },
    { label: "操作事项", prop: "changeContent", sortable: false }
  ]
}

export const remarkOption = {
  // height: 400,//固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [], //dialog是否可选
  dic: [],
  fixed: false,
  searchShow: false,
  showSearchBtn: false,
  showEmptyBtn: false,
  searchFlag: false,
  searchAdvanced: false, //高级搜索
  index: true,
  selection: false,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  maxHeight: 400,
  header: false, //是否显示头部
  pageFlag: false, //是否显示分页器

  column: [
    { label: "操作人", prop: "createName", width: 100, sortable: false },
    { label: "操作时间", width: 180, prop: "createTime", sortable: false },
    { label: "备注", prop: "content", sortable: false }
  ]
}

export const tableField = {
  DF: [
    { label: "供货商ID", prop: "sellingPartyId" },
    { label: "买家指定物流", prop: "overseaLogisticsChannel" },
    { label: "要求发货时间", prop: "requiredShipDate" },
    { label: "承诺送达时间", prop: "promisedDeliveryDate" },
    { label: "是否需要装箱清单", prop: "pslipRequiredFlag" },
    { label: "是否含礼物", prop: "giftFlag" },
    { label: "是否预定交付计划", prop: "scheduledDeliveryShipment" },
    { label: "是否优先发货", prop: "priorityShipmentFlag" }
  ],
  DI_PO: [
    { label: "供货商ID", prop: "sellingPartyId" },
    { label: "发货窗口", prop: "shipWindowStr" },
    { label: "订单变更日期", prop: "purchaseOrderStateChangedDate" }
  ],
  DSV_MP: [
    { label: "买家指定物流", prop: "overseaLogisticsChannelName" },
    { label: "要求发货时间", prop: "estimatedShipDate" },
    { label: "承诺送达时间", prop: "estimatedDeliveryDate" }
  ]
}

// 查看附件
export const viewAttachmentTableOption = {
  page: true,
  border: true,
  header: true,
  columnBtn: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  selection: true,
  fixHeight: 200,
  localStorageSymbol: "viewAttachmentTableOption",
  column: [
    { label: "文件名", prop: "name", sortable: false },
    { label: "文件类型", prop: "attachmentTypeName", sortable: false, width: 120 },
    { label: "是否拆分", prop: "attachmentSplitTypeName", sortable: false, width: 120 },
    { label: "操作", prop: "operation", sortable: false, solt: true, width: 120 }
  ]
}

export const reGenerationTableOption = {
  page: false,
  border: true,
  header: false,
  columnBtn: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  selection: false,
  fixHeight: 400,
  column: [
    { label: "单号", prop: "foBatchOrderCode", sortable: false },
    { label: "要求提货时间", prop: "requirePickUpDateVOList", sortable: false, width: 180, solt: true, required: true },
    { label: "异常类型", prop: "abnormalName", sortable: false },
    { label: "生成状态", prop: "message", sortable: false, solt: true }
  ]
}
