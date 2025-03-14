export const tableOption = {
  maxHeight: document.body.clientHeight - 408, //固定标题
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
  index: true,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器
  cancelFixedTop: true,
  column: [
    {
      label: "名称",
      prop: "name",
      sortable: false
    },
    {
      label: "所属分类",
      prop: "classIdName",
      solt: true,
      sortable: false
    },
    {
      label: "变量类型",
      prop: "variablesTypeDisplayName",
      sortable: false
    },
    {
      label: "值类型",
      prop: "generalValueTypeDisplayName",
      sortable: false
    },

    {
      label: "值",
      prop: "value",
      sortable: false
    },
    {
      label: "备注",
      prop: "remark",
      sortable: false
    },
    {
      label: "版本",
      prop: "version",
      sortable: false,
      solt: true,
      width: 160
    },
    {
      label: "状态",
      prop: "status",
      sortable: false,
      solt: true
    },
    {
      label: "创建人/创建时间",
      prop: "createTime",
      sortable: "custom",
      solt: true,
      width: 180
    },

    {
      label: "操作",
      prop: "opeSlot",
      sortable: false,
      solt: true,
      width: 140,
      fixed: "right",
      copy: false
    }
  ]
}

export const versionsTableOption = {
  maxHeight: document.body.clientHeight - 508, //固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  // editBtn: true,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2],//dialog是否可选
  fixed: false,
  searchShow: false,
  showSearchBtn: true,
  showEmptyBtn: true,
  searchFlag: true,
  searchAdvanced: false, //高级搜索
  selection: false,
  selectionFixed: true,
  index: false,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器

  column: [
    {
      label: "版本",
      prop: "version",
      solt: true,
      sortable: false
    },
    {
      label: "生效时间",
      prop: "validTime",
      sortable: false
    },
    {
      label: "失效时间",
      prop: "invalidTime",
      sortable: false
    },
    {
      label: "创建人/创建时间",
      prop: "createName",
      sortable: false,
      solt: true
    },

    {
      label: "更新人/更新时间",
      prop: "updateName",
      sortable: false,
      solt: true
    },

    {
      label: "操作",
      prop: "opeSlot",
      sortable: false,
      solt: true,
      width: 120,
      copy: false
    }
  ]
}
