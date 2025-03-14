export const tableOption = {
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
  searchShow: false,
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
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器

  column: [
    { label: "海外仓渠道编码", prop: "bseOverseaChannelCode", sortable: false },
    { label: "ERP渠道编码", prop: "bseChannelName", sortable: false },
    { label: "订单性质", prop: "orderType", sortable: false, solt: true },
    { label: "平台发货渠道", prop: "bseOverseaCarrierName", sortable: false },
    { label: "第三方付款账号", prop: "accountCode", sortable: false }
  ]
}
