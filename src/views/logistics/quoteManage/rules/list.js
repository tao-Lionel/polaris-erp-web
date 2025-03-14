export const tableOption = {
  border: true,
  selection: true,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  searchAdvanced: true, //高级搜索
  column: [
    { label: "起运港口", prop: "portOfOriginName", sortable: false },
    { label: "目的港口", prop: "destinationPortName", sortable: false },
    { label: "物流商", prop: "logisticsProviderUserName", sortable: false },
    { label: "状态", prop: "enable", sortable: false, solt: true },
    { label: "创建人", prop: "createName", sortable: false },
    { label: "创建时间", prop: "createTime" },
    { label: "更新人", prop: "updateName", sortable: false },
    { label: "更新时间", prop: "updateTime" },
    { label: "操作", prop: "operation", sortable: false, copy: false, width: 100, fixed: "right", solt: true }
  ]
}
