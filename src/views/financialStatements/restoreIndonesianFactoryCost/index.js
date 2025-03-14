export const restoreIndonesianFactoryCostOption = {
  maxHeight: document.body.clientHeight - 375, //固定标题
  selection: false,
  border: true,
  index: false,
  // indexLabel: '序号',
  isMedia: true,
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  header: true,
  labelPosition: "right",
  dic: [],
  showSummary: false,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  columnBtn: true,
  showSummary: true,
  column: [
    {
      label: "月份",
      prop: "month",
      sortable: false
    },
    {
      label: "审核状态",
      prop: "fAuditStatus",
      sortable: false,
      solt: true,
      copy: false
    },
    {
      label: "推送金蝶",
      prop: "fPushStatus",
      sortable: false,
      solt: true,
      copy: false
    },
    {
      label: "SKU",

      prop: "skuCode",
      sortable: false
    },
    {
      label: "印尼SKU",
      prop: "ptcSkuCode",
      sortable: false
    },
    {
      label: "数量",
      prop: "quantity",
      sortable: false
    },
    {
      label: "材料单价",
      prop: "fRmup",
      sortable: false
    },
    {
      label: "人工单价",
      prop: "fPup",
      sortable: false
    },
    {
      label: "制造单价",
      prop: "fMup",
      sortable: false
    },
    {
      label: "外包单价",
      prop: "fOup",
      sortable: false
    },
    {
      label: "币种",
      prop: "currencyCode",
      sortable: false
    }
  ]
}
