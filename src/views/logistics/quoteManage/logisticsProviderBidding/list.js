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
  columnBtn: false,
  selectionFixed: "left",
  column: [
    { label: "招标需求单号", prop: "inviteTenderCode", sortable: false, solt: true },
    { label: "需求状态", prop: "inviteTenderStatusNameForBidder", sortable: false, solt: true },
    { label: "起运国家", prop: "countryOfOriginName", sortable: false },
    { label: "起运港口", prop: "portOfOriginName", sortable: false },
    { label: "目的国家", prop: "destinationCountryName", sortable: false },
    { label: "目的港口", prop: "destinationPortName", sortable: false },
    { label: "计划发运时间", prop: "plannedShipmentStartDate", sortable: false, solt: true },
    { label: "船司", prop: "shippingLine", sortable: false, solt: true, width: 150 },
    { label: "箱型", prop: "containerTypeName", sortable: false },
    { label: "招标时间", prop: "tenderStartTime", sortable: false, solt: true },
    // { label: "价格有效时间", prop: "priceValidityStartTime", solt: true },
    { label: "海运费", prop: "oceanFreight" },
    { label: "币种", prop: "currency", sortable: false },
    { label: "剩余舱位量", prop: "remainingCapacity" },
    { label: "中标舱位量", prop: "requiredCapacity", solt: true },
    { label: "是否中标", prop: "tenderRecordStatus", sortable: false, solt: true },
    { label: "创建时间", prop: "inviteTenderCreateTime", sortable: false },
    { label: "更新时间", prop: "inviteTenderUpdateTime", sortable: false },
    { label: "操作", prop: "operation", sortable: false, copy: false, width: 80, fixed: "right", solt: true }
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
    { label: "投标时间", prop: "tenderRecordCreateTime", sortable: false },
    { label: "船司", prop: "tenderShippingLine", sortable: false, width: 150 },
    { label: "海运费", prop: "oceanFreight", sortable: false },
    { label: "剩余舱位量", prop: "remainingCapacity", sortable: false },
    { label: "报价清单", prop: "uploadedFileUrl", sortable: false, solt: true, width: 120 },
    // { label: "价格有效时间", prop: "priceValidityStartTime", sortable: false, solt: true },
    { label: "中标舱位量", prop: "requiredCapacity", sortable: false, solt: true },
    { label: "备注", prop: "remark", sortable: false, solt: true },
    { label: "是否中标", prop: "tenderRecordStatus", sortable: false, solt: true }
  ]
}

export const bidTableOption = {
  border: true,
  selection: false,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "bid",
  searchAdvanced: false, //高级搜索
  header: false,
  column: [
    { label: "船司", prop: "tenderShippingLine", sortable: false, width: 180 },
    { label: "海运费", prop: "oceanFreight", sortable: false, solt: true, width: 200 },
    { label: "剩余舱位量", prop: "remainingCapacity", sortable: false, solt: true, width: 200 },
    { label: "报价清单", prop: "uploadedFileUrl", sortable: false, solt: true }
    // { label: "价格有效时间", prop: "priceValidityPeriodTime", sortable: false, solt: true, width: 450 }
  ]
}
