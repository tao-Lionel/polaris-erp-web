export const billTableOptions = {
  border: true,
  selection: true,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "bill",
  searchAdvanced: true, //高级搜索
  showSummary: true,
  column: [
    { label: "月份", prop: "billTime", sortable: "custom" },
    { label: "账单号", prop: "billCode" },
    { label: "供应商", prop: "providerCode", sortable: "custom" },
    { label: "结算公司", prop: "settlementOrg", sortable: false },
    { label: "站点", prop: "site", sortable: false },
    { label: "金额", prop: "amount", sortable: false },
    { label: "结算币别", prop: "currencyCode", sortable: false },
    { label: "备注", prop: "remark", sortable: false },
    { label: "操作", prop: "operate", sortable: false, solt: true, fixed: "right", width: 180 }
  ]
}

export const feeSummaryTableOptions = {
  border: true,
  selection: false,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "feeSummary",
  searchAdvanced: true, //高级搜索
  showSummary: true,
  column: [
    { label: "月份", prop: "billTime", sortable: "custom" },
    { label: "账单号", prop: "billCode", sortable: false, solt: true },
    { label: "供应商", prop: "providerCode", sortable: "custom" },
    { label: "结算公司", prop: "settlementOrg", sortable: false },
    { label: "站点", prop: "site", sortable: false },
    { label: "费用类型", prop: "feeTypeDesc", sortable: "custom" },
    { label: "金额", prop: "amount", sortable: false },
    { label: "结算币别", prop: "currencyCode", sortable: false },
    { label: "操作", prop: "operate", sortable: false, solt: true, fixed: "right", width: 180 }
  ]
}

export const warehouseFeesTableOptions = {
  border: true,
  selection: false,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "warehouseFees",
  searchAdvanced: true, //高级搜索
  showSummary: true,
  column: [
    { label: "月份", prop: "billTime", sortable: "custom" },
    { label: "账单号", prop: "billCode", sortable: false, solt: true },
    { label: "结算公司", prop: "settlementOrg", sortable: false },
    { label: "供应商", prop: "providerCode", sortable: false },
    { label: "站点", prop: "site", sortable: false },
    { label: "仓库", prop: "warehouseCode", sortable: "custom" },
    { label: "费用类型", prop: "feeType", sortable: "custom", solt: true },
    { label: "金额", prop: "amount", sortable: false },
    { label: "结算币别", prop: "currencyCode", sortable: false },
    { label: "操作", prop: "operate", sortable: false, solt: true, fixed: "right" }
  ]
}

export const feeDetailTableOptions = {
  border: true,
  selection: false,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "feeDetail",
  searchAdvanced: true, //高级搜索
  showSummary: true,
  column: [
    { label: "月份", prop: "billTime", sortable: "custom" },
    { label: "站点", prop: "site", sortable: false },
    { label: "仓库", prop: "warehouseCode", sortable: "custom", solt: true },
    { label: "SKU", prop: "skuCode", sortable: "custom" },
    { label: "数量", prop: "quantity", sortable: false },
    { label: "费用项", prop: "feeItemDesc", sortable: false },
    { label: "费用类型", prop: "feeType", sortable: "custom", solt: true },
    { label: "金额", prop: "amount", sortable: false },
    { label: "结算币别", prop: "currencyCode", sortable: false },
    { label: "业务发生时间", prop: "businessTime", sortable: false },
    { label: "业务单号", prop: "parentBusinessNo", sortable: false, solt: true },
    { label: "单据类型", prop: "settlementTargetDesc", sortable: false },
    { label: "账单号", prop: "billCode", sortable: false, solt: true },
    { label: "平台订单号", prop: "sourceCode", sortable: false },
    { label: "发货单号", prop: "foOrderCode", sortable: false },
    { label: "店铺", prop: "shopName", sortable: false },
    { label: "订单类型", prop: "orderTypeName", sortable: false }
  ]
}
