export const notDiTableOption = {
  maxHeight: document.body.clientHeight - 363, //固定标题
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  //index: true,
  //indexLabel: '序号',
  stripe: false,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  cancelFixedTop: false,
  dic: [],
  column: [
    {
      label: "采购单号",
      prop: "code",
      sortable: false
    },

    {
      label: "标准SKU",
      prop: "standardSkuCode",
      sortable: false
    },
    {
      label: "工厂SKU",
      prop: "skuCode",
      sortable: false
    },

    {
      label: "产品名称",
      prop: "productName",
      sortable: false
    },
    {
      label: "产品分类",
      prop: "categoryName",
      sortable: false
    },
    {
      label: "待排数量",
      prop: "pendingShipmentQuantity",
      sortable: false
    },
    {
      label: "是否加急",
      prop: "urgentFlag",
      solt: true,
      sortable: false
    },
    {
      label: "平台",
      sortable: false,
      prop: "platform"
    },
    {
      label: "站点",
      prop: "site",
      sortable: false
    },

    {
      label: "入库仓库",
      prop: "warehouse",
      copy: false,
      sortable: false
    },
    {
      label: "工厂预计交期",
      prop: "factoryEstimatedDeliveryDate",
      copy: false,
      width: 160,
      sortable: false
    },
    {
      label: "采购组织",
      prop: "purchaseOrganizationName",
      sortable: false,
      copy: false
    },
    {
      label: "供应商",
      prop: "supplierName",
      sortable: false
    },
    {
      label: "产品长*宽*高（cm）",
      prop: "productSize",
      sortable: false,
      width: 160
    },
    {
      label: "外箱长*宽*高（cm）",
      prop: "outsideWrapperSize",
      sortable: false,
      width: 160
    },
    {
      label: "外箱体积（cm³）",
      prop: "outerBoxVolume",
      sortable: false,
      width: 160
    },
    {
      label: "外箱重量（kg）",
      prop: "boxGrossWeight",
      sortable: false,
      width: 160
    },
    {
      label: "海外仓所属区域",
      prop: "overseasWarehouseRegionName",
      sortable: false,
      width: 160
    }
  ]
}

export const diTableOption = {
  maxHeight: document.body.clientHeight - 363, //固定标题
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  //index: true,
  //indexLabel: '序号',
  stripe: false,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  cancelFixedTop: false,
  dic: [],
  column: [
    {
      label: "平台订单号",
      prop: "code",
      sortable: false
    },
    {
      label: "目的地",
      prop: "shipToParty",
      sortable: false
    },
    {
      label: "ASIN",
      prop: "asin",
      sortable: false
    },
    {
      label: "标准SKU",
      prop: "standardSkuCode",
      sortable: false
    },
    {
      label: "工厂SKU",
      prop: "skuCode",
      sortable: false
    },

    {
      label: "产品名称",
      prop: "productName",
      sortable: false
    },
    {
      label: "产品分类",
      prop: "categoryName",
      sortable: false
    },
    {
      label: "平台下单数量",
      prop: "acceptedQuantity",
      sortable: false
    },
    {
      label: "已排数量",
      prop: "shipmentQuantity",
      sortable: false
    },
    {
      label: "待排数量",
      prop: "pendingShipmentQuantity",
      sortable: false
    },
    {
      label: "平台",
      sortable: false,
      prop: "platform"
    },
    {
      label: "站点",
      prop: "site",
      sortable: false
    },

    {
      label: "店铺",
      prop: "store",
      copy: false,
      sortable: false
    },
    {
      label: "window start",
      prop: "shipWindowLeft",
      copy: false,
      sortable: false,
      width: 160
    },
    {
      label: "window end",
      prop: "shipWindowRight",
      copy: false,
      sortable: false,
      width: 160
    },
    {
      label: "产品长*宽*高（cm）",
      prop: "productSize",
      sortable: false,
      width: 160
    },
    {
      label: "外箱长*宽*高（cm）",
      prop: "outsideWrapperSize",
      sortable: false,
      width: 160
    },
    {
      label: "外箱体积（cm³）",
      prop: "outerBoxVolume",
      sortable: false,
      width: 160
    },
    {
      label: "外箱重量（kg）",
      prop: "boxGrossWeight",
      sortable: false,
      width: 160
    }
  ]
}

export const allTableOption = {
  maxHeight: document.body.clientHeight - 363, //固定标题
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  //index: true,
  //indexLabel: '序号',
  stripe: false,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  cancelFixedTop: false,
  dic: [],
  fixed: false,
  column: [
    {
      label: "排柜号",
      prop: "deliveryPlanCode",
      solt: true,
      sortable: false
    },

    {
      label: "采购单属性",
      prop: "purchaseOrderAttribute",
      sortable: false,
      solt: true,
      width: 120
    },
    {
      label: "单据状态",
      prop: "documentStatus",
      solt: true,
      sortable: false
    },

    {
      label: "出货柜号",
      prop: "shippingContainerNo",
      sortable: false
    },
    {
      label: "是否加急",
      prop: "urgentFlag",
      sortable: false
    },
    {
      label: "起运港口",
      prop: "departurePortName",
      sortable: false
    },
    {
      label: "目的港口",
      prop: "destinationPortName",
      sortable: false
    },
    {
      label: "SKU种数",
      sortable: false,
      prop: "skuTypes"
    },
    {
      label: "SKU件数",
      prop: "skuQuantity",
      sortable: false
    },

    {
      label: "货物总体积（m³）",
      prop: "totalVolume",
      sortable: false,
      width: 180,
      solt: true
    },
    {
      label: "装载率",
      prop: "loadRateStr",
      sortable: false,
      width: 160
    },
    {
      label: "箱型",
      prop: "containerTypeName",
      sortable: false,
      width: 160
    },
    {
      label: "海外仓所属区域",
      prop: "overseasWarehouseRegionName",
      sortable: false,
      width: 160
    },
    {
      label: "采购单入库仓库",
      prop: "warehouseId",
      solt: true,
      sortable: false,
      width: 160
    },
    {
      label: "供应商送货单号",
      prop: "deliveryNo",
      sortable: false,
      width: 160
    },
    {
      label: "头程调拨单",
      prop: "transferNo",
      sortable: false,
      width: 160
    },
    {
      label: "创建人/创建时间",
      prop: "createTime",
      solt: true,
      sortable: false,
      width: 160
    },
    {
      label: "操作",
      prop: "opeSolt",
      sortable: false,
      solt: true,
      width: 200,
      fixed: "right",
      copy: false
    }
  ]
}

export const allcolumn = [
  {
    label: "排柜号",
    prop: "deliveryPlanCode"
  },
  {
    label: "采购单属性",
    prop: "purchaseOrderAttribute"
  },
  {
    label: "单据状态",
    prop: "documentStatus"
  },
  {
    label: "出货柜号",
    prop: "shippingContainerNo"
  },
  {
    label: "是否加急",
    prop: "urgentFlag"
  },
  {
    label: "起运港口",
    prop: "departurePortName"
  },
  {
    label: "目的港口",
    prop: "destinationPortName"
  },
  {
    label: "SKU种数",
    prop: "skuTypes"
  },
  {
    label: "SKU件数",
    prop: "skuQuantity"
  },
  {
    label: "货物总体积（m³）",
    prop: "totalVolume"
  },
  {
    label: "装载率",
    prop: "loadRateStr"
  },
  {
    label: "箱型",
    prop: "containerTypeName"
  },
  {
    label: "海外仓所属区域",
    prop: "overseasWarehouseRegionName"
  },
  {
    label: "采购单入库仓库",
    prop: "warehouseId"
  },
  {
    label: "供应商送货单号",
    prop: "deliveryNo"
  },
  {
    label: "头程调拨单",
    prop: "transferNo"
  },
  {
    label: "创建人",
    prop: "createUserName"
  },
  {
    label: "创建时间",
    prop: "createTime"
  }
]

export const notDiGenerateTableOption = {
  selection: false,
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  stripe: false,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  pageFlag: false, //是否显示分页器
  showSummary: true,
  cancelFixedTop: true,
  fixed: false,
  column: [
    {
      label: "采购单号",
      prop: "poOrderNo",
      sortable: false,
      width: 140
    },

    {
      label: "采购单属性",
      prop: "purchaseOrderAttribute",
      sortable: false,
      solt: true,
      width: 100
    },
    {
      label: "平台",
      prop: "platform",
      width: 120,
      sortable: false
    },

    {
      label: "站点",
      prop: "site",
      sortable: false
    },
    {
      label: "标准SKU",
      prop: "standardSkuCode",
      width: 160,
      sortable: false
    },
    {
      label: "工厂SKU",
      prop: "skuCode",
      width: 160,
      sortable: false
    },
    {
      label: "产品名称",
      prop: "productName",
      width: 160,
      sortable: false
    },
    {
      label: "是否加急",
      sortable: false,
      solt: true,
      prop: "urgentFlag"
    },
    {
      label: "待排数量",
      prop: "pendingQuantity",
      sortable: false
    },

    {
      label: "本次计划排柜数量",
      prop: "planQuantity",
      copy: false,
      width: 180,
      sortable: false,
      solt: true,
      required: true
    },
    {
      label: "采购组织",
      prop: "purchaseOrganizationName",
      width: 180,
      sortable: false
    },

    {
      label: "供应商",
      prop: "supplierName",
      width: 140,
      sortable: false
    },
    {
      label: "工厂预计交期",
      prop: "factoryEstimatedDeliveryDate",
      sortable: false,
      width: 160
    },
    {
      label: "入库仓库",
      prop: "warehouseName",
      width: 120,
      sortable: false
    },
    {
      label: "海外仓所属区域",
      prop: "overseasWarehouseRegion",
      sortable: false,
      width: 120
    },
    {
      label: "产品分类",
      prop: "skuCategoryName",
      sortable: false,
      width: 160
    },
    {
      label: "外箱长*宽*高（cm）",
      prop: "outsideWrapperSize",
      sortable: false,
      width: 160
    },

    {
      label: "外箱体积（cm³）",
      prop: "outerBoxVolume",
      sortable: false,
      width: 180
    },
    {
      label: "外箱重量（kg）",
      prop: "boxGrossWeight",
      sortable: false,
      width: 140
    },
    {
      label: "操作",
      prop: "action",
      sortable: false,
      solt: true,
      fixed: false
    }
  ]
}

export const diGenerateTableOption = {
  selection: false,
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  stripe: false,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  pageFlag: false, //是否显示分页器
  showSummary: true,
  cancelFixedTop: true,
  column: [
    // {
    //   label: "采购单号",
    //   prop: "poOrderNo",
    //   sortable: false
    // },

    {
      label: "平台订单号",
      prop: "platformOrderCode",
      sortable: false,
      width: 140
    },
    {
      label: "平台",
      prop: "platform",
      sortable: false,
      width: 120
    },

    {
      label: "站点",
      prop: "site",
      sortable: false
    },
    {
      label: "ASIN",
      prop: "asin",
      width: 120,
      sortable: false
    },
    {
      label: "标准SKU",
      prop: "standardSkuCode",
      width: 140,
      sortable: false
    },
    {
      label: "工厂SKU",
      prop: "skuCode",
      width: 140,
      sortable: false
    },
    {
      label: "产品名称",
      prop: "productName",
      width: 160,
      sortable: false
    },

    {
      label: "待排数量",
      prop: "pendingQuantity",
      sortable: false
    },

    {
      label: "本次计划排柜数量",
      prop: "planQuantity",
      copy: false,
      sortable: false,
      width: 140,
      solt: true,
      required: true
    },

    {
      label: "window start",
      prop: "shipWindowLeft",
      width: 160,
      sortable: false
    },
    {
      label: "window end",
      prop: "shipWindowRight",
      width: 160,
      sortable: false
    },
    {
      label: "vendor code",
      prop: "vendorCode",
      width: 120,
      sortable: false
    },
    {
      label: "目的地",
      prop: "destination",
      sortable: false
    },
    {
      label: "产品分类",
      prop: "skuCategoryName",
      sortable: false,
      width: 160
    },
    {
      label: "外箱长*宽*高（cm）",
      prop: "outsideWrapperSize",
      sortable: false,
      width: 160
    },

    {
      label: "外箱体积（cm³）",
      prop: "outerBoxVolume",
      sortable: false,
      width: 180
    },
    {
      label: "外箱重量（kg）",
      prop: "boxGrossWeight",
      sortable: false,
      width: 120
    },
    {
      label: "操作",
      prop: "action",
      sortable: false,
      solt: true,
      fixed: false
    }
  ]
}

export const notDiDetailsTableOption = {
  selection: false,
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  stripe: false,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  pageFlag: false, //是否显示分页器
  showSummary: true,
  cancelFixedTop: true,
  column: [
    {
      label: "采购计划单号",
      prop: "purchasePlanCode",
      width: 140,
      sortable: false
    },
    {
      label: "采购单号",
      prop: "poOrderNo",
      sortable: false
    },
    {
      label: "标准SKU",
      prop: "standardSkuCode",
      sortable: false
    },
    {
      label: "工厂SKU",
      prop: "skuCode",
      sortable: false
    },
    {
      label: "产品名称",
      prop: "productName",
      sortable: false
    },

    {
      label: "是否加急",
      prop: "urgentFlag",
      sortable: false,
      solt: true
    },
    {
      label: "平台",
      prop: "platform",
      sortable: false
    },
    {
      label: "站点",
      prop: "site",
      sortable: false
    },

    {
      label: "外箱长*宽*高（cm）",
      prop: "skuOuterSize",
      sortable: false,
      width: 160
    },

    {
      label: "外箱体积（cm³）",
      prop: "skuOuterVolume",
      sortable: false,
      width: 160
    },
    {
      label: "外箱重量（kg）",
      prop: "skuOuterWeight",
      sortable: false,
      width: 160
    },
    {
      label: "排柜数量",
      prop: "loadedQuantity",
      sortable: false,
      width: 120
    },
    {
      label: "实际装柜数量",
      prop: "inQuantity",
      sortable: false,
      width: 120
    },
    {
      label: "差异数量",
      prop: "diffQuantity",
      sortable: false,
      width: 120
    }
  ]
}

export const diDetailsTableOption = {
  selection: false,
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  stripe: false,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  pageFlag: false, //是否显示分页器
  showSummary: true,
  cancelFixedTop: true,
  column: [
    {
      label: "平台订单号",
      prop: "platformOrderNo",
      width: 140,
      sortable: false
    },
    {
      label: "ASIN",
      prop: "asin",
      sortable: false
    },
    {
      label: "标准SKU",
      prop: "standardSkuCode",
      sortable: false
    },
    {
      label: "工厂SKU",
      prop: "skuCode",
      sortable: false
    },
    {
      label: "产品名称",
      prop: "productName",
      sortable: false
    },

    {
      label: "平台",
      prop: "platform",
      sortable: false
    },
    {
      label: "站点",
      prop: "site",
      sortable: false
    },

    {
      label: "外箱长*宽*高（cm）",
      prop: "skuOuterSize",
      sortable: false,
      width: 160
    },

    {
      label: "外箱体积（cm³）",
      prop: "skuOuterVolume",
      sortable: false,
      width: 160
    },
    {
      label: "外箱重量（kg）",
      prop: "skuOuterWeight",
      sortable: false,
      width: 160
    },
    {
      label: "排柜数量",
      prop: "loadedQuantity",
      sortable: false,
      width: 120
    },

    {
      label: "实际装柜数量",
      prop: "inQuantity",
      sortable: false,
      width: 120
    },
    {
      label: "差异数量",
      prop: "diffQuantity",
      sortable: false,
      width: 120
    }
  ]
}
export const detailsLogTableOption = {
  selection: false,
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  stripe: false,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  cancelFixedTop: true,
  pageFlag: false, //是否显示分页器
  column: [
    {
      label: "操作时间",
      prop: "createTime",
      sortable: false
    },

    {
      label: "操作人",
      prop: "displayname",
      sortable: false,
      width: 140
    },
    {
      label: "操作类型",
      prop: "logRemark",
      sortable: false
    },
    {
      label: "操作事项",
      prop: "operateItem",
      sortable: false
    }
  ]
}

export const purchaseTableOption = {
  maxHeight: 400,
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  stripe: false,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "main",
  column: [
    { label: "采购计划号", prop: "purchasePlanCode", sortable: false, width: 140 },
    { label: "采购单号", prop: "purchaseOrderNo", sortable: false },
    { label: "采购状态", prop: "poOrderStatusName", sortable: false },
    { label: "单据类型", prop: "documentTypeName", sortable: false },
    { label: "单据时间", prop: "createTime", sortable: "custom", width: 140 },
    { label: "采购组织", prop: "corporationName", sortable: false },
    { label: "供应商", prop: "supplierName", sortable: false },
    { label: "商品种数", prop: "skuCount", sortable: false },
    { label: "入库仓库", prop: "warehouseName", sortable: false }
  ]
}
