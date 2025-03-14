export const tableOption = {
  // maxHeight: document.body.clientHeight - 408, //固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  // editBtn: true,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2],//dialog是否可选
  fixed: false,
  searchShow: true,
  showSearchBtn: true,
  showEmptyBtn: true,
  searchFlag: true,
  searchAdvanced: false, //高级搜索
  selection: false,
  selectionFixed: true,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  header: true, //是否显示头部
  pageFlag: false, //是否显示分页器
  cancelFixedTop: true,
  treeProps: { children: "children", hasChildren: "hasChildren" },
  defaultExpandAll: true,
  column: [
    {
      label: "分类名称",
      prop: "name",
      sortable: false
    },

    {
      label: "状态",
      prop: "status",
      sortable: false,
      solt: true
    },
    {
      label: "创建人",
      prop: "createName"
    },
    {
      label: "创建时间",
      prop: "createTime"
    },

    {
      label: "操作",
      prop: "opeSlot",
      sortable: false,
      solt: true,
      width: 300,
      fixed: "right",
      copy: false
    }
  ]
}
