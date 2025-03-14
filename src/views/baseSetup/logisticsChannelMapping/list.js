export const tableOption = {
  maxHeight: document.body.clientHeight - 360, //固定标题
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
  selection: true,
  selectionFixed: true,
  index: false,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  // header: true, //是否显示头部
  // pageFlag: true, //是否显示分页器

  column: [
    { label: "海外仓服务商", prop: "providerName", sortable: false },
    { label: "内部仓库编码", prop: "bseWarehouseCode", sortable: false },
    { label: "仓库名称", prop: "bseWarehouseName", sortable: false },
    { label: "平台", prop: "platform", sortable: false },
    { label: "交货模式", prop: "orderBusinessType", sortable: false, solt: true },
    { label: "操作", prop: "operate", width: 100, sortable: false, solt: true, copy: false },
    { label: "操作日志", prop: "operateLog", width: 100, sortable: false, solt: true }
  ]
}
