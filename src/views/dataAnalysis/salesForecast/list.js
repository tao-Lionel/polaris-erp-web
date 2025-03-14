export const tableOption = {
  maxHeight: document.body.clientHeight - 520, //固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: true,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2], //dialog是否可选
  dic: [],
  fixed: false,
  searchShow: true,
  showSearchBtn: true,
  showEmptyBtn: true,
  searchFlag: true,
  searchAdvanced: true, //高级搜索
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
  localStorageSymbol: "main",
  column: [
    {
      label: "链接SPU",
      prop: "linkSpu",
      sortable: false,
      fixed: "left",
      width: 120
    },
    {
      label: "链接SKU",
      prop: "linkSku",
      sortable: false,
      fixed: "left",
      solt: true,
      width: 200
    },
    {
      label: "ASIN",
      prop: "asin",
      sortable: false,
      fixed: "left",
      width: 120
    },
    {
      label: "标准SPU",
      prop: "spu",
      sortable: false,
      width: 120
    },
    {
      label: "标准SKU",
      prop: "sku",
      sortable: false,
      width: 200
    },
    {
      label: "产品名称",
      prop: "skuName",
      sortable: false,
      width: 150
    },
    {
      label: "品牌",
      prop: "brandName",
      sortable: false
    },
    {
      label: "品类",
      prop: "categoryName",
      sortable: false
    },
    {
      label: "平台/站点",
      prop: "platform",
      solt: true,
      sortable: false,
      width: 150
    },
    {
      label: "店铺",
      prop: "storeAccount",
      sortable: false,
      width: 150
    },
    {
      label: "销售状态",
      prop: "saleStatus",
      sortable: false,
      solt: true
    },
    {
      label: "开售时间",
      prop: "beginSaleDate",
      sortable: false,
      width: 200
    },
    {
      label: "当前产品状态",
      prop: "currentProductStatus",
      sortable: false,
      solt: true
    },
    {
      label: "产品定位",
      prop: "productPositioning",
      sortable: false,
      solt: true
    },
    {
      label: "含税售价",
      prop: "sellingPriceHasTax",
      sortable: false
    },
    {
      label: "非税售价",
      prop: "sellingPrice",
      sortable: false
    },
    {
      label: "DI供货价",
      prop: "supplyPriceDi",
      sortable: false
    },
    {
      label: "PO供货价",
      prop: "supplyPricePo",
      sortable: false
    },
    {
      label: "DF/多平台供货价",
      prop: "supplyPriceDfOther",
      sortable: false
    },
    {
      label: "币种",
      prop: "currency",
      sortable: false
    },
    // {
    //   label: "推广费费比",
    //   prop: "promotionExpensesRate",
    //   sortable: false
    // },
    // {
    //   label: "盈亏平衡费比",
    //   prop: "balanceProfitRate",
    //   sortable: false
    // },
    {
      label: "一级负责人",
      prop: "firstResponsiblePerson",
      sortable: false
    },
    {
      label: "二级负责人",
      prop: "secondResponsiblePerson",
      sortable: false
    },
    {
      label: "运营",
      prop: "operationsPerson",
      sortable: false
    }
  ]
}

export const lockStatusOptions = [
  { label: "未锁定", value: 0 },
  { label: "锁定", value: 1 }
]

// export const currentProductStatusOptions = [
//   { label: "新品", value: "NEW" },
//   { label: "老品", value: 1 }
// ]

// export const skuOptions = [
//   { label: "A", value: "A" },
//   { label: "B", value: "B" },
//   { label: "C", value: "C" },
//   { label: "D", value: "D" }
// ]

// export const saleStatusOptions = [
//   { label: "在售", value: 1 },
//   { label: "停售", value: 0 }
// ]
