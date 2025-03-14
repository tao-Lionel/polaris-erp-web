export const oldTableOption = {
  maxHeight: document.body.clientHeight - 600, //固定标题
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  // index: true,
  // indexLabel: '序号',
  isMedia: true,
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  columnBtn: false,
  column: [
    // { label: "请购单批次号", prop: "requisitionBatchNo", sortable: false },
    // { label: "采购单号", prop: "purchaseOrderNo", sortable: false },
    { label: "工厂SKU", prop: "skuCode", sortable: false },
    { label: "产品长*宽*高(cm)", prop: "modelName", sortable: false },
    { label: "产品名称", prop: "skuName", sortable: false },
    { label: "数量", prop: "skuQuantity", width: 100, sortable: false },
    { label: "非税单价", prop: "price", width: 100, sortable: false },
    { label: "总金额", prop: "skuAmount", width: 100, sortable: false },
    { label: "采购预计交期", prop: "planDelivery", width: 100, sortable: false }
  ]
}

export const oldPage = {
  total: null, // 总页数 为null 不显示分页
  currentPage: 1, // 当前页数
  pageSize: 10, // 每页显示多少条
  pageSizes: [10]
}

export const orderStatusObj = {
  0: "未处理",
  1: "采购审核",
  2: "财务审核",
  3: "审核完成"
}

export const submitFormRules = {
  supplierNo: [{ required: true, message: "请选择供应商", trigger: "change" }],
  corporationId: [{ required: true, message: "请选择法人主体", trigger: "change" }]
}
