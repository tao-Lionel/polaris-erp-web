export const settlementTableOptions = {
  border: true,
  selection: true,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "settlement",
  searchAdvanced: true, //高级搜索
  showSummary: true,
  column: [
    { label: "店铺", prop: "storeAccount", sortable: false },
    { label: "支付日期", prop: "paymentDate", sortable: "custom" },
    { label: "支付单", prop: "paymentNo", sortable: false },
    { label: "结算单", prop: "platSettlementNo", sortable: false },
    { label: "金额", prop: "amount", sortable: false, width: 120 },
    { label: "结算币别", prop: "currencyCode", sortable: false },
    { label: "账单数量", prop: "billQuantity", sortable: false },
    { label: "附件数量", prop: "settlementAttachmentQuantity", sortable: false, solt: true },
    { label: "操作", prop: "operate", sortable: false, solt: true, fixed: "right" }
  ]
}

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
    { label: "店铺", prop: "storeAccount", sortable: false },
    { label: "科目", prop: "subjectCode", sortable: false },
    { label: "费用类型", prop: "feeType", sortable: false },
    { label: "账单单号", prop: "platBillNo", sortable: false },
    { label: "账单日期", prop: "billDate", sortable: "custom" },
    { label: "金额", prop: "amount", sortable: false, width: 120 },
    { label: "币别", prop: "currencyCode", sortable: false },
    { label: "支付日期", prop: "paymentDate", sortable: false },
    { label: "支付单", prop: "paymentNo", sortable: false },
    { label: "结算单", prop: "platSettlementNo", sortable: false, solt: true },
    { label: "附件数量", prop: "billAttachmentCount", sortable: false, solt: true },
    { label: "操作", prop: "operate", sortable: false, solt: true, fixed: "right" }
  ]
}

export const billDetailTableOption = {
  border: true,
  selection: false,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "billDetailTable",
  searchAdvanced: true, //高级搜索
  showSummary: true,
  column: [
    { label: "店铺", prop: "storeAccount", sortable: false },
    { label: "科目", prop: "subjectCode", sortable: false },
    { label: "费用类型", prop: "feeType", sortable: false },
    { label: "账单单号", prop: "platBillNo", sortable: false, solt: true },
    { label: "账单日期", prop: "billDate", sortable: "custom" },
    { label: "订单/调整单", prop: "poAdjustOrder", sortable: false, solt: true },
    { label: "链接SKU", prop: "linkSku", sortable: false },
    { label: "数量", prop: "quantity", sortable: false },
    { label: "金额", prop: "detailAmount", sortable: false, width: 120 },
    { label: "币别", prop: "detailCurrency", sortable: false },
    { label: "支付日期", prop: "paymentDate", sortable: false },
    { label: "支付单", prop: "paymentNo", sortable: false },
    { label: "结算单", prop: "platSettlementNo", sortable: false, solt: true }
  ]
}
