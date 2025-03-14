
export const tableOption = {
  maxHeight: document.body.clientHeight - 380, //固定标题
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  stripe: true,
  isMedia: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  menu: false,
  selection: true,
  column: [

    {
      label: "执行月份",
      prop: "month",
      width: "150px",
      sortable: false
    },

    {
      label: "SKU",
      minWidth: 120,
      prop: "sku",
      overHidden: true,
      sortable: false
    },
    {
      label: "成本单价（USD）",
      minWidth: 120,
      prop: "cost",
      sortable: false
    },
    {
      label: "更新人",
      minWidth: 120,
      prop: "updateName",
      sortable: false
    },
    {
      label: "更新时间",
      minWidth: 120,
      prop: "updateTime",
      sortable: false
    },

  ]
}




export const editTableOption = {
  maxHeight: document.body.clientHeight - 380, //固定标题
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  stripe: true,
  isMedia: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  menu: false,
  selection: false,
  column: [

    {
      label: "执行月份",
      prop: "month",
      width: "150px",
      sortable: false
    },

    {
      label: "SKU",
      minWidth: 120,
      prop: "sku",
      overHidden: true,
      sortable: false
    },
    {
      label: "成本单价（USD）",
      minWidth: 120,
      prop: "cost",
      sortable: false,
      solt: true,

    },


  ]
}
