export const tableOption = {
  border: true,
  selection: true,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "main",
  searchAdvanced: false, //高级搜索
  column: [
    { label: "月份", prop: "dataMonth", sortable: false },
    { label: "产地", prop: "originCountry", sortable: false },
    { label: "收货地", prop: "shipTo", sortable: false },
    { label: "起运港", prop: "departureHarbour", sortable: false },
    { label: "目的港", prop: "intoHarbour", sortable: false },
    { label: "供应商", prop: "saleName", sortable: false },
    { label: "采购商", prop: "purchaseName", sortable: false },
    { label: "采购量", prop: "totalQuantity", sortable: false },
    { label: "采购退货量", prop: "returnQuantity", sortable: false },
    { label: "实际采购", prop: "actualQuantity", sortable: false },
    { label: "结算金额", prop: "actualAmount", sortable: false, solt: true, width: 150 },
    { label: "结算模式", prop: "salesModel", sortable: false },
    { label: "发票号", prop: "invoiceNo", sortable: false },
    { label: "创建时间", prop: "createTime", sortable: false },
    { label: "操作", prop: "operate", sortable: false, solt: true, width: 100, fixed: "right" }
  ]
}
