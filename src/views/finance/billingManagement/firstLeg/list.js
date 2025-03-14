export const billTableOption = {
  border: true,
  selection: true,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "billTable",
  searchAdvanced: false, //高级搜索
  showSummary: true,
  column: [
    { label: "月份", prop: "month", sortable: "custom" },
    { label: "结算公司", prop: "settlementCompanyName", sortable: false },
    { label: "供应商", prop: "supplierName", sortable: "custom" },
    { label: "费用", prop: "amount", sortable: false },
    { label: "结算币别", prop: "currency", sortable: false },
    { label: "操作", prop: "operate", sortable: false, solt: true, fixed: "right" }
  ]
}

export const feeSummaryTableOption = {
  border: true,
  selection: true,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "firstLegFeeSummary",
  searchAdvanced: true, //高级搜索
  showSummary: true,
  column: [
    { label: "月份", prop: "month", sortable: "custom" },
    { label: "结算公司", prop: "settlementCompanyName", sortable: false },
    { label: "供应商", prop: "supplierName", sortable: "custom" },
    { label: "船司", prop: "shippingCompany", sortable: false },
    { label: "柜型", prop: "containerType", sortable: false },
    { label: "柜号", prop: "containerNumber", sortable: false },
    { label: "提单号", prop: "billOfLadingNumber", sortable: false },
    { label: "出发港", prop: "departurePort", sortable: false },
    { label: "目的港", prop: "destinationPort", sortable: false },
    { label: "目的仓", prop: "destinationWarehouse", sortable: false },
    { label: "起运港费用", prop: "departurePortFee", sortable: false, solt: true },
    { label: "海运费", prop: "oceanFreight", sortable: false, solt: true },
    { label: "目的港费用", prop: "destinationPortFee", sortable: false, solt: true },
    { label: "合计", prop: "totalFee", sortable: false },
    { label: "结算币别", prop: "settlementCurrency", sortable: false },
    { label: "渠道单号", prop: "channelOrderNumber", sortable: false },
    { label: "计划柜号", prop: "plannedContainerNumber", sortable: false },
    { label: "调拨单", prop: "transferNo", sortable: false, solt: true },
    { label: "操作", prop: "operate", sortable: false, solt: true, fixed: "right" }
  ]
}

export const feeDetailTableOption = {
  border: true,
  selection: true,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "firstLegFeeDetail",
  searchAdvanced: true, //高级搜索
  showSummary: true,
  column: [
    { label: "月份", prop: "month", sortable: false },
    { label: "柜型", prop: "containerType", sortable: false },
    { label: "柜号", prop: "containerNumber", sortable: false, solt: true },
    { label: "提单号", prop: "billOfLadingNumber", sortable: false },
    { label: "出发港", prop: "departurePort", sortable: false },
    { label: "目的港", prop: "destinationPort", sortable: false },
    { label: "目的仓", prop: "destinationWarehouse", sortable: false },
    { label: "费用类型", prop: "feeType", sortable: false, solt: true },
    { label: "费用项", prop: "feeItem", sortable: false },
    { label: "费用", prop: "fee", sortable: false },
    { label: "结算币别", prop: "settlementCurrency", sortable: false },
    { label: "调拨单", prop: "transferNo", sortable: false, solt: true }
  ]
}
