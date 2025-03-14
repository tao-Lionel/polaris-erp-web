export const tableOption = {
  border: true,
  selection: false,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  columnBtn: false,
  localStorageSymbol: "main",
  searchAdvanced: false, //高级搜索
  column: [
    {
      label: "功能",
      prop: "functionName",
      sortable: false
    },
    {
      label: "字段",
      prop: "fieldName",
      sortable: false
    },
    {
      label: "字段说明",
      prop: "description",
      sortable: false
    },
    {
      label: "创建人/时间",
      prop: "createByName",
      sortable: false,
      solt: true
    },
    {
      label: "更新人/时间",
      prop: "updateByName",
      sortable: false,
      solt: true
    },
    {
      label: "操作",
      prop: "operation",
      sortable: false,
      solt: true
    }
  ]
}
