export const tableOption = {
  border: true,
  selection: true,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "main",
  searchAdvanced: false, //高级搜索
  column: [
    { label: "工厂SKU", prop: "skuCode", sortable: false },
    { label: "托盘尺寸", prop: "palletSpec", sortable: false },
    { label: "托盘数", prop: "palletNumber", sortable: false },
    { label: "创建人", prop: "createName", sortable: false },
    { label: "创建时间", prop: "createTime", sortable: false },
    { label: "更新人", prop: "updateName", sortable: false },
    { label: "更新时间", prop: "updateTime", sortable: false },
    { label: "操作", prop: "operate", sortable: false, solt: true, fixed: "right" }
  ]
}
