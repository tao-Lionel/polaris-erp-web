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
  searchAdvanced: true, //高级搜索
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
    { label: "店铺名称", prop: "storeAccount", sortable: false },
    { label: "链接SKU", prop: "linkSku", sortable: false },
    { label: "供货价", prop: "cost", sortable: false },
    { label: "币别", prop: "currency", sortable: false },
    { label: "有效开始时间", prop: "startEffectiveTime", sortable: false },
    { label: "有效结束时间", prop: "endEffectiveTime", sortable: false },
    { label: "生效状态", prop: "effectiveStatusName", sortable: false },
    { label: "创建人/创建时间", prop: "createUserName", sortable: false, solt: true, width: 160 },
    { label: "更新人/更新时间", prop: "updateUserName", sortable: false, solt: true, width: 160 },
    { label: "操作日志", prop: "operate", width: 80, sortable: false, solt: true, fixed: "right" }
  ]
}
