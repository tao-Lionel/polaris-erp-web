export const tableOption = {
  maxHeight: document.body.clientHeight - 408, //固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
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

  column: [
    {
      label: "ID",
      prop: "id",
      width: 60
    },
    {
      label: "分类",
      prop: "category",
      width: 230,
      sortable: false
    },
    {
      label: "名称",
      prop: "name",
      width: 200,
      sortable: false
    },
    {
      label: "排序",
      prop: "orderNum",
      width: 80,
      sortable: false
    },
    {
      label: "应用类型",
      prop: "exportTypeName",
      width: 180,
      slotHeader: "exportTypeNameHeader",
      sortable: false
    },
    {
      label: "使用角色",
      prop: "roleNameList",
      width: 300,
      slotHeader: "roleNameListHeader",
      sortable: false
    },
    {
      label: "状态",
      width: 80,
      prop: "statusName",
      sortable: false
    },
    {
      label: "更新人",
      prop: "updateName",
      sortable: false
    },
    {
      label: "更新时间",
      prop: "updateTime",
      sortable: false
    },
    {
      label: "操作",
      prop: "opeSolt",
      sortable: false,
      solt: true,
      width: 100,
      fixed: "right",
      copy: false
    }
  ]
}

export const addFormDataRules = {
  category: [{ required: true, message: "请输入", trigger: "change" }],
  name: [{ required: true, message: "请輸入", trigger: "change" }],
  sql: [{ required: true, message: "请输入", trigger: "change" }]
}

export const tableDataRules = {
  type: [{ required: true, message: "请输入", trigger: "change" }],
  code: [{ required: true, message: "请输入", trigger: "change" }],
  name: [{ required: true, message: "请输入", trigger: "change" }],
  databaseCode: [{ required: true, message: "请输入", trigger: "change" }],
  conditionCode: [{ required: true, message: "请输入", trigger: "change" }],
  value: [{ required: true, message: "请输入", trigger: "change" }],
  format: [{ required: true, message: "请输入", trigger: "change" }]
}
