export const tableOption = {
  maxHeight: document.body.clientHeight - 370, //固定标题
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  index: false,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  menu: false,
  align: "center",
  isMedia: true,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  showSummary: true,
  selection: true,
  dic: [],
  selectionFixed: "left",
  localStorageSymbol: "A", // 这个属性会拼在路由后面作为数据存储在localStorage中的key，为了兼容一个页面有两个不同表格的情况，没有这种情况的可以不加这个属性
  column: [
    { label: "仓库", prop: "warehouseName", sortable: false },
    { label: "仓库类型", prop: "warehouseTypeName" },
    { label: "法人主体", prop: "corporationName", sortable: false },
    // { label: "销售组", minWidth: 90, prop: "groupName" },
    { label: "标准SKU", prop: "standardSkuCode", sortable: false },
    { label: "工厂SKU", prop: "skuCode", sortable: false },
    { label: "产品名称", prop: "skuName", sortable: false },
    // { label: "平台SKU", minWidth: 120, prop: "platformSkuCode" },
    // { label: "店铺", prop: "storeAccount" },
    { label: "平台", prop: "platform" },
    { label: "站点", prop: "site" },
    { label: "实际库存", prop: "actualQuantity", solt: true, copy: false },
    { label: "可用库存", prop: "availableQuantity" },
    { label: "占用库存", prop: "lockQuantity", solt: true, copy: false },
    { label: "出入库记录", prop: "stockRecordLog", solt: true, sortable: false },
    { label: "操作", prop: "operation", solt: true, sortable: false, fixed: "right", width: 80 }
  ]
}
export const allTableOption = {
  maxHeight: document.body.clientHeight - 370, //固定标题
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  index: false,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  menu: false,
  align: "center",
  isMedia: true,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  showSummary: true,
  dic: [],
  localStorageSymbol: "B", // 这个属性会拼在路由后面作为数据存储在localStorage中的key，为了兼容一个页面有两个不同表格的情况，没有这种情况的可以不加这个属性
  column: [
    { label: "仓库", prop: "warehouseName", sortable: false },
    { label: "仓库类型", prop: "warehouseTypeName" },
    { label: "法人主体", prop: "corporationName", sortable: false },
    { label: "标准SKU", prop: "standardSkuCode", sortable: false },
    { label: "工厂SKU", prop: "skuCode", sortable: false },
    { label: "产品名称", prop: "skuName", sortable: false },
    { label: "实际库存", prop: "actualQuantity", solt: true, copy: false },
    { label: "可用库存", prop: "availableQuantity" },
    { label: "占用库存", prop: "lockQuantity", solt: true, copy: false },
    { label: "出入库记录", prop: "stockRecordLog", solt: true, sortable: false }
  ]
}
