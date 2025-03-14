export const tableOption = {
  maxHeight: document.body.clientHeight - 450,
  border: true,
  menu: false,
  fixed: false,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  selection: true,
  stripe: true,
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  searchLabelPosition: "right",
  dic: [],
  // dialogDisable: [0, 1, 2, 3, 4, 5, 6, 7],//dialog是否可选
  column: [
    {
      label: "调拨单号",
      prop: "transferNo",
      solt: true,
      sortable: false
    },
    {
      label: "业务类型",
      prop: "transferBusinessTypeName",
      sortable: false
    },
    {
      label: "调拨状态",
      prop: "transferStatus",
      solt: true,
      sortable: false
    },
    {
      label: "数量",
      prop: "count",
      solt: true,
      sortable: false,
      copy: false
    },
    {
      label: "时间节点",
      prop: "timePoint",
      solt: true,
      width: 300,
      copy: false
    },
    {
      label: "预估费用",
      prop: "cost",
      solt: true,
      width: 180,
      sortable: false,
      copy: false
    },
    {
      label: "实际费用",
      prop: "actualCostDetail",
      solt: true,
      width: 180,
      sortable: false,
      copy: false
    },
    // {
    //   label: '费用状态', sortable: false,
    //   prop: 'costLockStatus',
    //   width: 150,
    //   solt: true
    // },
    {
      label: "仓库/国家",
      sortable: false,
      prop: "countryShortName",
      solt: true,
      width: 200,
      copy: false
    },
    {
      label: "装柜信息",
      prop: "container",
      solt: true,
      width: 130,
      sortable: false,
      copy: false
    },
    {
      label: "出货柜号",
      prop: "shippingContainerNo",
      width: 130,
      sortable: false
    },
    {
      label: "关联单号",
      sortable: false,
      width: 300,
      prop: "relationNo",
      solt: true,
      copy: false
    },
    {
      label: "备注",
      prop: "remark",
      sortable: false
    },
    {
      label: "异常类型/具体原因",
      prop: "abnormal",
      solt: true,
      width: 150,
      sortable: false,
      copy: false
    },
    {
      label: "创建人/创建时间",
      sortable: false,
      prop: "create",
      width: 160,
      solt: true,
      copy: false
    },
    {
      label: "更新人/更新时间",
      prop: "update",
      width: 160,
      solt: true,
      sortable: false,
      copy: false
    },
    {
      label: "操作",
      prop: "operation",
      solt: true,
      sortable: false,
      width: 130,
      fixed: "right",
      copy: false
    }
  ]
}
export const lastTableOption = {
  maxHeight: document.body.clientHeight - 410,
  border: true,
  menu: false,
  fixed: false,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  selection: true,
  stripe: true,
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  searchLabelPosition: "right",
  dic: [],
  // dialogDisable: [0, 1, 2, 3, 4, 5, 6, 7],//dialog是否可选
  column: [
    {
      label: "调拨单号",
      prop: "transferNo",
      solt: true,
      sortable: false
    },
    {
      label: "调拨类型",
      prop: "transferTypeName",
      sortable: false
    },
    {
      label: "业务类型",
      prop: "transferBusinessTypeName",
      sortable: false
    },
    {
      label: "调拨状态",
      prop: "transferStatus",
      solt: true,
      sortable: false
    },
    {
      label: "数量",
      prop: "count",
      solt: true,
      minWidth: 150,
      sortable: false
    },
    {
      label: "时间节点",
      prop: "timePoint",
      solt: true,
      width: 300,
      copy: false
    },
    {
      label: "预估费用",
      prop: "cost",
      solt: true,
      width: 180,
      sortable: false
    },
    {
      label: "实际费用",
      prop: "actualCostDetail",
      solt: true,
      width: 180,
      sortable: false
    },
    // {
    //   label: '费用状态', sortable: false,
    //   prop: 'costLockStatus',
    //   width: 150,
    //   solt: true
    // },
    {
      label: "仓库/国家",
      sortable: false,
      prop: "countryShortName",
      solt: true,
      width: 180,
      copy: false
    },
    // {
    //   label: 'shipmentID',
    //   prop: 'shipmentID',
    //   width: 180, sortable: false,
    // },
    {
      label: "关联单号",
      sortable: false,
      width: 300,
      prop: "relationNo",
      solt: true,
      copy: false
    },
    {
      label: "备注",
      prop: "remark",
      sortable: false
    },
    {
      label: "异常类型/具体原因",
      prop: "abnormal",
      solt: true,
      width: 150,
      sortable: false
    },
    {
      label: "创建人/创建时间",
      sortable: false,
      prop: "create",
      width: 160,
      solt: true,
      copy: false
    },
    {
      label: "更新人/更新时间",
      prop: "update",
      width: 160,
      solt: true,
      sortable: false,
      copy: false
    },
    {
      label: "操作",
      prop: "operation",
      solt: true,
      sortable: false,
      width: 130,
      fixed: "right",
      copy: false
    }
  ]
}
export const createTableOption = {
  maxHeight: 500,
  border: true,
  fixed: false,
  cancelFixedTop: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  // index: true,
  // indexLabel: '序号',
  menu: false,
  selection: false,
  stripe: true,
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  searchLabelPosition: "right",
  dic: [],
  // dialogDisable: [0, 1, 2, 3, 4, 5, 6, 7],//dialog是否可选
  column: [
    {
      label: "入库单号",
      prop: "wmsInboundNo",
      minWidth: 120,
      sortable: false
    },
    {
      label: "采购单号",
      prop: "purchaseOrderNo",
      // solt: true,
      sortable: false
    },
    {
      label: "排柜号",
      prop: "cabinetCode",
      // solt: true,
      minWidth: 120,
      sortable: false
    },
    {
      label: "出货柜号",
      prop: "shippingContainerNo",
      minWidth: 120,
      sortable: false
    },
    {
      label: "标准SPU",
      prop: "spuCode",
      minWidth: 120,
      sortable: false
    },
    {
      label: "SKU",
      prop: "skuCode",
      minWidth: 120,
      sortable: false
    },
    {
      label: "产品名称",
      sortable: false,
      prop: "skuName"
    },
    // {
    //   label: '仓库', sortable: false,
    //   prop: 'warehouseId',
    //   solt: true,
    //   minWidth: 120,
    // },
    // {
    //   label: '法人主体',
    //   prop: 'corporationName',
    //   // solt: true,
    //   minWidth: 140, sortable: false,
    // },
    {
      label: "平台",
      prop: "platform",
      sortable: false
    },
    {
      label: "站点",
      prop: "site",
      minWidth: 120,
      sortable: false
    },
    {
      label: "价格模式",
      prop: "priceModel",
      minWidth: 120,
      sortable: false
    },
    {
      label: "采购单价",
      prop: "unitPrice",
      sortable: false
    },
    {
      label: "计划调拨数量",
      sortable: false,
      prop: "planCount"
    },
    {
      label: "实收数量",
      sortable: false,
      prop: "inCount"
    },
    {
      label: "差异原因",
      sortable: false,
      prop: "abnormalType",
      width: 120,
      solt: true
    },
    {
      label: "操作",
      prop: "operation",
      solt: true,
      sortable: false,
      copy: false
    }
  ]
}
export const costTableOption = {
  border: true,
  menu: false,
  cancelFixedTop: true,
  header: false,
  fixed: false,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  selection: false,
  stripe: true,
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  searchLabelPosition: "right",
  dic: [],
  // dialogDisable: [0, 1, 2, 3, 4, 5, 6, 7],//dialog是否可选
  column: [
    {
      label: "物流商",
      prop: "transportCode",
      minWidth: 120,
      sortable: false,
      solt: true
    },
    {
      label: "费用类型",
      sortable: false,
      prop: "costType",
      solt: true
    },
    {
      label: "金额",
      sortable: false,
      prop: "cost",
      solt: true
    },
    {
      label: "操作",
      sortable: false,
      prop: "operate",
      solt: true,
      copy: false
    }

    // {
    //   label: '运费',
    //   prop: 'freightCost',
    //   minWidth: 120,
    //   sortable: false,
    //   solt: true,
    // },
    // {
    //   label: '关税',
    //   prop: 'taxCost',
    //   solt: true,
    //   sortable: false,
    //   minWidth: 120,
    // },
    // {
    //   label: '清关派送费',
    //   prop: 'clearanceCost',
    //   solt: true,
    //   minWidth: 120,
    //   sortable: false,
    // },
    // {
    //   label: '其他费用',
    //   prop: 'otherCost',
    //   minWidth: 120,
    //   sortable: false,
    //   solt: true,
    // },
  ]
}

export const costListOption = {
  border: true,
  menu: false,
  cancelFixedTop: true,
  header: false,
  fixed: false,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  selection: false,
  stripe: true,
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  searchLabelPosition: "right",
  dic: [],
  // dialogDisable: [0, 1, 2, 3, 4, 5, 6, 7],//dialog是否可选
  column: [
    {
      label: "物流商",
      prop: "transportCode",
      minWidth: 120,
      sortable: false,
      solt: true
    },
    {
      label: "费用类型",
      sortable: false,
      prop: "costType",
      solt: true
    },
    {
      label: "金额",
      sortable: false,
      minWidth: 120,
      prop: "cost",
      solt: true
    },
    {
      label: "对账状态",
      prop: "costStatusName",
      sortable: false
    },
    {
      label: "操作",
      sortable: false,
      prop: "operate",
      solt: true,
      copy: false
    }
  ]
}

export const lastCostTableOption = {
  border: true,
  menu: false,
  cancelFixedTop: true,
  header: false,
  fixed: false,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  // index: true,
  // indexLabel: '序号',
  selection: false,
  stripe: true,
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  searchLabelPosition: "right",
  dic: [],
  // dialogDisable: [0, 1, 2, 3, 4, 5, 6, 7],//dialog是否可选
  column: [
    {
      label: "物流商",
      prop: "transportCode",
      minWidth: 120,
      solt: true,
      sortable: false
    },
    {
      label: "费用类型",
      sortable: false,
      prop: "costType",
      solt: true
    },
    {
      label: "运费",
      prop: "cost",
      minWidth: 120,
      sortable: false,
      solt: true
    },
    {
      label: "操作",
      sortable: false,
      prop: "operate",
      solt: true,
      copy: false
    }
  ]
}

export const createFinalTableOption = {
  border: true,
  fixed: false,
  cancelFixedTop: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  // index: true,
  // indexLabel: '序号',
  menu: false,
  selection: false,
  stripe: true,
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  searchLabelPosition: "right",
  dic: [],
  // dialogDisable: [0, 1, 2, 3, 4, 5, 6, 7],//dialog是否可选
  column: [
    {
      label: "SKU",
      prop: "skuCode",
      minWidth: 120,
      sortable: false
    },
    {
      label: "产品名称",
      sortable: false,
      prop: "skuName"
    },
    {
      label: "仓库",
      sortable: false,
      prop: "warehouseName"
    },
    {
      label: "法人主体",
      prop: "corporationName",
      // solt: true,
      minWidth: 140,
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
      minWidth: 120,
      sortable: false
    },
    {
      label: "计划调拨数量",
      sortable: false,
      prop: "planQuantity"
    },
    {
      label: "实收数量",
      sortable: false,
      prop: "actualInBoundQuantity"
    },
    {
      label: "差异原因",
      sortable: false,
      prop: "abnormalType",
      width: 120,
      solt: true
    },
    {
      label: "操作",
      prop: "operation",
      solt: true,
      sortable: false,
      copy: false
    }
  ]
}

export const baseRules = {
  fmWarehouseId: [{ required: true, message: "请选择转出仓", trigger: "change" }],
  transferOutOrgId: [{ required: true, message: "请选择调出库存组织", trigger: "change" }],
  transferInOrgId: [{ required: true, message: "请选择调入库存组织", trigger: "change" }],
  transferBusinessType: [{ required: true, message: "请选择调拨类型", trigger: "change" }],
  fmCountryCode: [{ required: true, message: "请选择起运国家", trigger: "change" }],
  toWarehouseId: [{ required: true, message: "请选择目的仓", trigger: "change" }],
  toCountryCode: [{ required: true, message: "请选择目的国家", trigger: "change" }],
  departureHarbour: [{ required: true, message: "请选择起运港", trigger: "change" }],
  intoHarbour: [{ required: true, message: "请选择目的港", trigger: "change" }],
  transferMode: [{ required: true, message: "请选择调拨方式", trigger: "change" }],
  departureTime: [{ required: true, message: "请选择开船时间", trigger: "change" }],
  freightContainerTime: [{ required: true, message: "请选择装柜时间", trigger: "change" }],
  estimateArrivalTime: [{ required: true, message: "请选择预计到港时间", trigger: "change" }],
  estimatePutTime: [{ required: true, message: "请选择预计上架时间", trigger: "change" }],
  freightContainerMode: [{ required: true, message: "请选择装柜方式", trigger: "change" }],
  containerModel: [{ required: true, message: "请选择箱型", trigger: "change" }],
  containerNo: [{ required: true, message: "请输入柜号", trigger: "blur" }],
  transferType: [{ required: true, message: "请选择调拨类型", trigger: "blur" }]
}

export const lastBaseRules = {
  fmWarehouseId: [{ required: true, message: "请选择转出仓", trigger: "change" }],
  transferOutOrgId: [{ required: true, message: "请选择调出库存组织", trigger: "change" }],
  transferInOrgId: [{ required: true, message: "请选择调入库存组织", trigger: "change" }],
  transferBusinessType: [{ required: true, message: "请选择调拨类型", trigger: "change" }],
  fmCountryCode: [{ required: true, message: "请选择起运国家", trigger: "change" }],
  toWarehouseId: [{ required: true, message: "请选择目的仓", trigger: "change" }],
  toCountryCode: [{ required: true, message: "请选择目的国家", trigger: "change" }],
  departureHarbour: [{ required: true, message: "请选择起运港", trigger: "change" }],
  intoHarbour: [{ required: true, message: "请选择目的港", trigger: "change" }],
  transferMode: [{ required: true, message: "请选择调拨方式", trigger: "change" }],
  departureTime: [{ required: true, message: "请选择开船时间", trigger: "change" }],
  freightContainerTime: [{ required: true, message: "请选择装柜时间", trigger: "change" }],
  estimateArrivalTime: [{ required: true, message: "请选择预计到达时间", trigger: "change" }],
  estimateOutStockTime: [{ required: true, message: "请选择预约出库时间", trigger: "change" }],
  estimatePutTime: [{ required: true, message: "请选择预计上架时间", trigger: "change" }],
  freightContainerMode: [{ required: true, message: "请选择装柜方式", trigger: "change" }],
  containerModel: [{ required: true, message: "请选择箱型", trigger: "change" }],
  containerNo: [{ required: true, message: "请输入柜号", trigger: "blur" }],
  transferType: [{ required: true, message: "请选择调拨类型", trigger: "blur" }]
}

export const transferRules = {
  freightContainerMode: [{ required: true, message: "请选择装柜方式", trigger: "change" }],
  containerModel: [{ required: true, message: "请选择箱型", trigger: "change" }],
  containerNo: [{ required: true, message: "请输入柜号", trigger: "blur" }],
  logisticsTransportCode: [{ required: true, message: "请选择运输公司", trigger: "change" }],
  forwarderTransportCode: [{ required: true, message: "请选择货代公司", trigger: "change" }],
  clearanceTransportCode: [{ required: true, message: "请选择清关公司", trigger: "change" }],
  sendTransportCode: [{ required: true, message: "请选择派送公司", trigger: "change" }]
}

export const costInfoRules = {
  freightCost: [{ required: true, message: "请输入运费", trigger: "blur" }],
  clearanceCost: [{ required: true, message: "请输入关税", trigger: "blur" }],
  taxCost: [{ required: true, message: "请输入清关派送费", trigger: "blur" }]
}

export const importTariffOption = {
  border: true,
  menu: false,
  cancelFixedTop: true,
  header: false,
  fixed: false,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  selection: false,
  stripe: true,
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  searchLabelPosition: "right",
  dic: [],
  // dialogDisable: [0, 1, 2, 3, 4, 5, 6, 7],//dialog是否可选
  column: [
    {
      label: "产品品类",
      prop: "categoryName",
      minWidth: 120,
      sortable: false
    },
    {
      label: "海关编码",
      sortable: false,
      prop: "targetCustomsCode"
    },
    {
      label: "总货值（USD）",
      sortable: false,
      prop: "targetTotalValueOfGoods"
    },
    {
      label: "总货值（CAD）",
      sortable: false,
      prop: "poTotalValueOfGoods",
      solt: true,
      minWidth: 200
    },
    {
      label: "总关税率（含反倾销）",
      sortable: false,
      prop: "totalRate",
      solt: true,
      minWidth: 200
    },
    {
      label: "总关税额（CAD）",
      sortable: false,
      prop: "totalTaxAmount"
    },
    {
      label: "消费税率",
      sortable: false,
      prop: "consumptionRate",
      minWidth: 200,
      solt: true
    },
    {
      label: "消费税率（CAD）",
      sortable: false,
      prop: "consumptionTaxAmount"
    }
  ]
}
