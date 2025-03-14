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
  selectionFixed: "left",
  column: [
    { label: "招标需求单号", prop: "inviteTenderCode", sortable: false, solt: true },
    { label: "需求状态", prop: "inviteTenderStatus", sortable: false, solt: true },
    { label: "起运国家", prop: "countryOfOriginName", sortable: false },
    { label: "起运港口", prop: "portOfOriginName", sortable: false },
    { label: "目的国家", prop: "destinationCountryName", sortable: false },
    { label: "目的港口", prop: "destinationPortName", sortable: false },
    { label: "计划发运时间", prop: "plannedShipmentStartDate", solt: true, sortable: false },
    { label: "船司", prop: "shippingLine", sortable: false, solt: true, width: 150 },
    { label: "箱型", prop: "containerTypeName", sortable: false },
    { label: "需求舱位量", prop: "inviteTenderRequiredCapacity" },
    // { label: "紧急舱位量", prop: "emergencyRequiredCapacity" },
    { label: "招标时间", prop: "tenderStartTime", solt: true, sortable: false },
    { label: "投标物流商", prop: "tenderRecordCreateName", sortable: false, solt: true },
    // { label: "价格有效时间", prop: "priceValidityStartTime", solt: true },
    { label: "海运费", prop: "oceanFreight" },
    { label: "币种", prop: "currency", sortable: false },
    { label: "剩余舱位量", prop: "remainingCapacity" },
    { label: "中标舱位量", prop: "requiredCapacity" },
    { label: "创建人/创建时间", prop: "inviteTenderCreateName", sortable: false, solt: true },
    { label: "更新人/更新时间", prop: "inviteTenderUpdateName", sortable: false, solt: true },
    { label: "操作", prop: "operation", sortable: false, copy: false, width: 100, fixed: "right", solt: true }
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
  searchAdvanced: false, //高级搜索
  header: false,
  column: [
    { label: "投标物流商/投标时间", prop: "tenderRecordCreateName", sortable: false, solt: true },
    { label: "船司", prop: "tenderShippingLine", sortable: false, width: 150 },
    { label: "海运费", prop: "oceanFreight", sortable: false },
    { label: "剩余舱位量", prop: "remainingCapacity", sortable: false },
    { label: "报价清单", prop: "uploadedFileUrl", sortable: false, solt: true, width: 120 },
    // { label: "价格有效时间", prop: "priceValidityStartTime", sortable: false, solt: true },
    { label: "中标舱位量", prop: "requiredCapacity", sortable: false },
    { label: "备注", prop: "remark", sortable: false },
    { label: "是否中标", prop: "tenderRecordStatus", sortable: false, solt: true }
  ]
}

export const confirmTableOption = {
  border: true,
  selection: true,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "confirm",
  searchAdvanced: false, //高级搜索
  header: false,
  column: [
    { label: "投标物流商", prop: "tenderRecordCreateName", sortable: false },
    { label: "船司", prop: "tenderShippingLine", sortable: false, width: 150 },
    { label: "海运费", prop: "oceanFreight", sortable: false },
    { label: "剩余舱位量", prop: "remainingCapacity", sortable: false },
    // { label: "价格有效时间", prop: "priceValidityStartTime", sortable: false, solt: true },
    { label: "中标舱位量", prop: "requiredCapacity", sortable: false, solt: true, required: true, width: 150 },
    { label: "备注", prop: "remark", sortable: false, solt: true, width: 150 },
    { label: "是否中标", prop: "tenderRecordStatus", sortable: false, solt: true }
  ]
}

export const operationLogTableOption = {
  border: true,
  selection: false,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "log",
  searchAdvanced: false,
  header: false,

  column: [
    { label: "操作时间", prop: "createTime", sortable: false },
    { label: "操作人", prop: "createByName", sortable: false },
    { label: "操作类型", prop: "operateType", sortable: false },
    { label: "操作事项", prop: "changeContent", sortable: false }
  ]
}
