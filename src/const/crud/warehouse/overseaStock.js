export const tableOption = {
  maxHeight: document.body.clientHeight - 360, //固定标题
  selection: true,
  border: true,
  //index: true,
  //indexLabel: '序号',
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  labelPosition: "right",
  showSummary: true,
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  sumColumnList: [
    {
      name: "overseaAvailableQuantity",
      type: "sum",
      decimals: 1
    },
    {
      name: "overseaInTransitQuantity",
      type: "sum",
      decimals: 0
    },
    {
      name: "overseaPendingShipmentQuantity",
      type: "sum",
      decimals: 0
    },
    {
      name: "bseAvailableQuantity",
      type: "sum",
      decimals: 0
    },
    {
      name: "availableDifference",
      type: "sum",
      decimals: 0
    },
    {
      name: "bseActualQuantity",
      type: "sum",
      decimals: 0
    },
    {
      name: "bseOccupyQuantity",
      type: "sum",
      decimals: 0
    },
    {
      name: "overseaBadQuantity",
      type: "sum",
      decimals: 0
    }
  ],
  column: [
    {
      label: "内部仓库编码",
      prop: "warehousingPartyName"
    },
    {
      label: "服务商仓库编码",
      prop: "overseaWarehouseCode"
    },
    {
      label: "仓库SKU",
      prop: "overseaSkuCode"
    },
    {
      label: "仓库商品名称",
      prop: "overseaSkuName"
    },
    {
      label: "产品名称",
      prop: "bseSkuName"
    },
    {
      label: "工厂SKU",
      prop: "bseSkuCode"
    },
    {
      label: "可售库存(海外仓)",
      prop: "overseaAvailableQuantity"
    },
    {
      label: "在途数量(海外仓)",
      prop: "overseaInTransitQuantity"
    },
    {
      label: "待出库数(海外仓)",
      prop: "overseaPendingShipmentQuantity"
    },
    {
      label: "实际库存",
      prop: "bseActualQuantity"
    },
    {
      label: "可用库存",
      prop: "bseAvailableQuantity"
    },
    {
      label: "占用库存",
      prop: "bseOccupyQuantity"
    },
    {
      label: "差异数",
      prop: "availableDifference"
    },
    {
      label: "不良库存(海外仓)",
      prop: "overseaBadQuantity"
    },
    {
      label: "更新时间",
      prop: "updateTime",
      sortable: true
    }
  ]
}
