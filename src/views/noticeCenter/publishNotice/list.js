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
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器

  column: [
    { label: "公告类型", prop: "typeName", sortable: false, solt: true },
    { label: "公告标题", prop: "title", sortable: false },
    { label: "发布人", prop: "publishUserName", sortable: false },
    { label: "发布时间", prop: "publishTime", sortable: false },
    { label: "状态", prop: "publishStatusName", sortable: false, solt: true },
    { label: "操作", prop: "operate", sortable: false, solt: true, fixed: "right", copy: false }
  ]
}
