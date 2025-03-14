export const tableOption = {
  maxHeight: document.body.clientHeight - 525, //固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2], //dialog是否可选
  dic: [],
  fixed: false,
  searchShow: true,
  showSearchBtn: true,
  showEmptyBtn: true,
  searchFlag: true,
  searchAdvanced: false, //高级搜索
  // index: true,
  selection: false,
  selectionFixed: true,
  index: false,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器
  localStorageSymbol: "A",
  column: [
    { label: "标准SKU", prop: "skuCode", width: 180, sortable: false },
    { label: "平台", prop: "platform", width: 120, sortable: false },
    { label: "站点", prop: "site", width: 80, sortable: false },
    { label: "产品名称", prop: "productName", sortable: false },
    { label: "品牌", prop: "brand", sortable: false },
    { label: "品类", prop: "category", sortable: false },
    { label: "安全库存天数", prop: "safeDayNum" },
    { label: "操作", prop: "operate", sortable: false, solt: true, copy: false, fixed: "right" }
  ]
}
