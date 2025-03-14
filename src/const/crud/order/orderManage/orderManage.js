export const tableOption = {
  // maxHeight: document.body.clientHeight - 420, //固定标题
  page: false,
  // align: "center",
  // menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2], //dialog是否可选
  // dic: [],
  // fixed: false,
  searchShow: true,
  showSearchBtn: true,
  showEmptyBtn: true,
  searchFlag: true,
  searchAdvanced: true, //高级搜索
  selection: true,
  selectionFixed: true,
  index: true,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器
  localStorageSymbol: "main",
  column: [
    {
      label: "订单号",
      prop: "orderCode",
      solt: true,
      sortable: false,
      copy: false,
      width: 190
    },
    {
      label: "平台单号",
      prop: "sourceCode",
      sortable: false
    },
    {
      label: "平台订单编码",
      prop: "platformOrderCode",
      sortable: false
    },
    {
      label: "标签",
      prop: "labels",
      solt: true,
      sortable: false,
      copy: false
    },
    {
      label: "备注",
      prop: "omsSoOrderRemarks",
      sortable: false,
      solt: true,
      width: 150
    },
    {
      label: "SKU*数量",
      solt: true,
      width: 200,
      prop: "spliceProducts",
      sortable: false,
      copy: false
    },
    {
      label: "平台/站点",
      prop: "platformCodeSlotText",
      sortable: false,
      // solt: true,
      width: 150,
      copy: false
    },
    {
      label: "店铺",
      prop: "shopName",
      sortable: false
    },
    {
      label: "省/州",
      prop: "stateOrRegion",
      sortable: false
    },
    {
      label: "订单来源",
      prop: "accessModeName",
      sortable: false
    },
    {
      label: "订单状态",
      prop: "fulfillmentStatusName",
      sortable: false
    },
    {
      label: "平台订单状态",
      prop: "orderStatus",
      sortable: false
    },
    {
      label: "同步平台状态",
      prop: "syncConfirmFlagNameSlotText",
      sortable: false,
      // solt: true,
      copy: false
    },
    {
      label: "单据操作失败原因",
      prop: "executionErrorMessage",
      sortable: false
    },
    {
      label: "异常类型",
      prop: "abnormalTypeName",
      sortable: false
    },
    {
      label: "订单总金额(不含税)",
      prop: "totalAmount",
      sortable: false
    },
    {
      label: "建议物流渠道",
      prop: "logisticsChannel",
      sortable: false
    },
    {
      label: "下单时间",
      prop: "orderTime",
      sortable: "custom"
    },
    {
      label: "要求发货时间",
      prop: "requiredShipDate",
      sortable: false
    },
    {
      label: "创建人/创建时间",
      prop: "createTimeSlotText",
      sortable: "custom",
      // solt: true,
      copy: false
    },
    {
      label: "更新人/更新时间",
      prop: "updateTimeSlotText",
      sortable: "custom",
      // solt: true,
      copy: false
    },
    {
      label: "操作",
      prop: "opeSolt",
      sortable: false,
      solt: true,
      fixed: "right",
      copy: false,
      width: 180
    }
  ]
}

export const mateSkuOption = {
  height: 350, //固定标题
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
  searchFlag: false,
  searchAdvanced: false, //高级搜索
  // index: true,
  selection: false,
  // indexLabel: '序号',
  stripe: true,
  menu: false,
  viewBtn: false,
  header: false, //是否显示头部
  pageFlag: false, //是否显示分页器

  column: [
    {
      label: "图片",
      prop: "imageUrl",
      solt: true,
      search: false,
      sortable: false,
      width: 100
    },
    {
      label: "品名",
      prop: "skuName",
      sortable: false
    },
    {
      label: "平台SKU",
      prop: "sellerSku",
      sortable: false
    },
    {
      label: "SKU",
      prop: "skuCode",
      sortable: false
    },
    {
      label: "库存",
      prop: "stockNum",
      sortable: false
    },
    {
      label: "操作",
      prop: "opeBtn",
      solt: true,
      sortable: false,
      copy: false
    }
  ]
}

export const batchMateSkuOption = {
  maxHeight: 400, //固定标题
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
  searchFlag: false,
  searchAdvanced: false, //高级搜索
  index: true,
  selection: false,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  header: true, //是否显示头部
  pageFlag: false, //是否显示分页器
  columnBtn: false,
  resetBtn: false,
  column: [
    {
      label: "平台SKU",
      prop: "sellerSku",
      sortable: false
    },
    {
      label: "SKU",
      prop: "skuCode",
      sortable: false
    },
    {
      label: "操作",
      prop: "opeBtn",
      width: 100,
      solt: true,
      sortable: false,
      copy: false
    }
  ]
}

export const mateWarehouseOption = {
  // height:750,//固定标题
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
  searchShow: false,
  showSearchBtn: false,
  showEmptyBtn: false,
  searchFlag: false,
  searchAdvanced: false, //高级搜索
  // index: true,
  selection: false,
  // indexLabel: '序号',
  stripe: true,
  menu: false,
  viewBtn: false,
  indexLabel: true,
  maxHeight: 420,
  header: false, //是否显示头部
  pageFlag: false, //是否显示分页器

  column: [
    {
      label: "品名/SKU",
      prop: "productName",
      solt: true,
      sortable: false
    },
    {
      label: "平台SKU",
      prop: "asin",
      sortable: false
    },
    {
      label: "数量",
      prop: "expectedQuantity",
      sortable: false
    },
    {
      label: "确认发货量",
      prop: "actualDeliveryNum",
      sortable: false
    }
    // {
    //   label: "可发货量",
    //   prop: "availableQuantity",
    //   sortable: false,
    //
    // },
    // {
    //   label: "是否缺货",
    //   prop: "stock",
    //   solt: true,
    //   sortable: false,
    //
    // },
  ]
}

export const addSkuOption = {
  // height:750,//固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: true,
  delBtn: false,
  addBtn: false,
  dialogDisable: [0, 1, 2], //dialog是否可选
  dic: [],
  fixed: false,
  searchShow: true,
  showSearchBtn: true,
  showEmptyBtn: true,
  searchFlag: true,
  searchAdvanced: false, //高级搜索
  // index: true,
  selection: true,
  // indexLabel: '序号',
  stripe: true,
  menu: false,
  viewBtn: false,
  maxHeight: 400,
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器

  column: [
    {
      label: "图片",
      prop: "imageUrl",
      solt: true,
      search: false,
      sortable: false,
      width: 110
    },
    {
      label: "品名",
      prop: "productName",
      sortable: false
    },
    {
      label: "平台SKU",
      prop: "sellerSku",
      sortable: false
    },
    {
      label: "工厂SKU",
      prop: "skuCode",
      sortable: false
    },
    {
      label: "分类",
      prop: "category",
      sortable: false
    },
    {
      label: "品牌",
      prop: "brand",
      sortable: false
    }
  ]
}

export const addCombSkuOption = {
  // height:750,//固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: true,
  delBtn: false,
  addBtn: false,
  dialogDisable: [0, 1, 2], //dialog是否可选
  dic: [],
  fixed: false,
  searchShow: true,
  showSearchBtn: true,
  showEmptyBtn: true,
  searchFlag: true,
  searchAdvanced: false, //高级搜索
  // index: true,
  selection: true,
  // indexLabel: '序号',
  stripe: true,
  menu: false,
  viewBtn: false,
  maxHeight: 400,
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器

  column: [
    {
      label: "品名",
      prop: "name",
      sortable: false
    },
    {
      label: "SKU",
      prop: "relationString",
      sortable: false
    }
  ]
}

export const skuShowOption = {
  // height: 400,//固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dialogDisable: [0, 1, 2], //dialog是否可选
  dic: [],
  fixed: false,
  searchShow: false,
  showSearchBtn: false,
  showEmptyBtn: false,
  searchFlag: false,
  searchAdvanced: false, //高级搜索
  // index: true,
  selection: false,
  // indexLabel: '序号',
  stripe: true,
  menu: false,
  viewBtn: false,
  maxHeight: 400,
  header: false, //是否显示头部
  pageFlag: false, //是否显示分页器

  column: [
    {
      label: "图片",
      prop: "imageUrl",
      solt: true,
      width: 100,
      sortable: false
    },
    {
      label: "工厂SKU",
      prop: "skuCode",
      width: 200,
      sortable: false
    },
    {
      label: "平台SKU",
      prop: "asin",
      width: 200,
      solt: true,
      sortable: false
    },
    {
      label: "产品名称",
      prop: "skuName",
      width: 200,
      sortable: false
    },
    {
      label: "单价(不含税)",
      prop: "unitPrice",
      solt: true,
      width: 200,
      sortable: false
    },
    {
      label: "税额",
      prop: "taxAmountHasTax",
      solt: true,
      width: 200,
      sortable: false
    },
    {
      label: "单价(含税)",
      prop: "unitPriceHasTax",
      solt: true,
      width: 200,
      sortable: false
    },
    {
      label: "购买数量",
      prop: "quantity",
      solt: true,
      sortable: false
    },
    {
      label: "操作",
      prop: "opeBtn",
      solt: true,
      sortable: false,
      copy: false
    }
  ]
}

export const foInfoOption = {
  // height: 400,//固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dialogDisable: [0, 1, 2], //dialog是否可选
  dic: [],
  fixed: false,
  searchShow: false,
  showSearchBtn: false,
  showEmptyBtn: false,
  searchFlag: false,
  searchAdvanced: false, //高级搜索
  index: true,
  selection: false,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  maxHeight: 400,
  header: false, //是否显示头部
  pageFlag: false, //是否显示分页器

  column: [
    {
      label: "发货单号",
      prop: "foCode",
      sortable: false
    },
    {
      label: "发货批次单号",
      prop: "batchOrderCode",
      sortable: false
    },
    {
      label: "ARN/排柜号",
      prop: "extendCode",
      sortable: false
    },
    {
      label: "发货仓库",
      prop: "warehouseName",
      sortable: false
    },
    {
      label: "物流渠道",
      prop: "logisticsChannelName",
      sortable: false
    },
    // {
    //   label: "发货状态",
    //   prop: "deliveryStatusName",
    //   sortable: false,
    // },
    {
      label: "发货时间",
      prop: "deliveryTime",
      sortable: false
    },
    {
      label: "跟踪号",
      prop: "trackingNo",
      sortable: false
    },
    {
      label: "平台SKU/SKU/数量",
      prop: "foDetailInfos",
      solt: true,
      width: 350,
      sortable: false,
      copy: false
    }
  ]
}

export const confirmOption = {
  // height: 400,//固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2], //dialog是否可选
  dic: [],
  fixed: false,
  searchShow: false,
  showSearchBtn: false,
  showEmptyBtn: false,
  searchFlag: false,
  searchAdvanced: false, //高级搜索
  index: true,
  selection: false,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  maxHeight: 400,
  header: false, //是否显示头部
  pageFlag: false, //是否显示分页器

  column: [
    {
      label: "链接SKU/ASIN",
      prop: "asin",
      sortable: false
    },
    {
      label: "SKU",
      prop: "skuCode",
      sortable: false
    },
    {
      label: "确认发货数量",
      prop: "confirmQuantity",
      sortable: false
    },
    {
      label: "发货仓库",
      prop: "warehouseName",
      sortable: false
    }
  ]
}

export const remarkOption = {
  // height: 400,//固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2], //dialog是否可选
  dic: [],
  fixed: false,
  searchShow: false,
  showSearchBtn: false,
  showEmptyBtn: false,
  searchFlag: false,
  searchAdvanced: false, //高级搜索
  index: true,
  selection: false,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  maxHeight: 400,
  header: false, //是否显示头部
  pageFlag: false, //是否显示分页器

  column: [
    {
      label: "操作人",
      prop: "createName",
      width: 100,
      sortable: false
    },
    {
      label: "操作时间",
      width: 180,
      prop: "createTime",
      sortable: false
    },
    {
      label: "备注",
      prop: "content",
      sortable: false
    }
  ]
}

export const logOption = {
  // height: 400,//固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2], //dialog是否可选
  dic: [],
  fixed: false,
  searchShow: false,
  showSearchBtn: false,
  showEmptyBtn: false,
  searchFlag: false,
  searchAdvanced: false, //高级搜索
  index: true,
  selection: false,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  maxHeight: 400,
  header: false, //是否显示头部
  pageFlag: false, //是否显示分页器

  column: [
    {
      label: "操作时间",
      prop: "createTime",
      sortable: false
    },
    {
      label: "操作人",
      prop: "createByName",
      sortable: false
    },
    {
      label: "操作类型",
      prop: "operateType",
      sortable: false
    },
    {
      label: "操作事项",
      prop: "changeContent",
      sortable: false
    }
  ]
}

export const batchMateSkuResultOption = {
  // height: 400,//固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2], //dialog是否可选
  dic: [],
  fixed: false,
  searchShow: false,
  showSearchBtn: false,
  showEmptyBtn: false,
  searchFlag: false,
  searchAdvanced: false, //高级搜索
  index: true,
  selection: false,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  maxHeight: 400,
  header: false, //是否显示头部
  pageFlag: false, //是否显示分页器
  column: [
    {
      label: "订单编号",
      prop: "orderCode",
      sortable: false
    },
    {
      label: "结果",
      prop: "message",
      sortable: false
    },
    {
      label: "成功/失败",
      prop: "successFlag",
      width: 100,
      solt: true,
      sortable: false
    }
  ]
}

export const faceSheetOption = {
  // height: 400,//固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2], //dialog是否可选
  dic: [],
  fixed: false,
  searchShow: false,
  showSearchBtn: false,
  showEmptyBtn: false,
  searchFlag: false,
  searchAdvanced: false, //高级搜索
  index: true,
  selection: false,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  maxHeight: 400,
  header: false, //是否显示头部
  pageFlag: false, //是否显示分页器

  column: [
    {
      label: "SKU",
      width: 180,
      prop: "skuCode",
      sortable: false
    },
    {
      label: "数量",
      prop: "quantity",
      width: 60,
      sortable: false
    },
    {
      label: "运单号",
      prop: "trackingNo",
      sortable: false
    },
    {
      label: "面单",
      width: 80,
      prop: "faceSheetUrl",
      sortable: false,
      solt: true
    },
    {
      label: "调整顺序",
      prop: "changeOrder",
      sortable: false,
      solt: true
    }
  ]
}

export const cancelOrderOption = {
  // height: 400,//固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2], //dialog是否可选
  dic: [],
  fixed: false,
  searchShow: false,
  showSearchBtn: false,
  showEmptyBtn: false,
  searchFlag: false,
  searchAdvanced: false, //高级搜索
  index: false,
  selection: false,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  maxHeight: 400,
  header: false, //是否显示头部
  pageFlag: false, //是否显示分页器

  column: [
    {
      label: "商品明细号",
      width: 180,
      prop: "soOrderDetailId",
      sortable: false
    },
    {
      label: "SKU",
      width: 180,
      prop: "skuCode",
      sortable: false
    },
    {
      label: "平台SKU",
      prop: "asin",
      sortable: false
    },
    {
      label: "产品名称",
      prop: "skuName",
      width: 150,
      sortable: false
    },
    {
      label: "数量",
      prop: "expectedQuantity",
      sortable: false
    },
    {
      label: "可取消数量",
      width: 100,
      prop: "waitCancelQuantity",
      sortable: false
    },
    {
      label: "取消数量",
      prop: "cancelQuantity",
      sortable: false,
      solt: true
    }
  ]
}

// 同步订单校验
export const synchronousRule = {
  orderNumber: [{ required: true, message: "请输入平台单号", trigger: "blur" }],
  shopId: [{ required: true, message: "请选择店铺", trigger: "blur" }],
  orderBusinessType: [{ required: true, message: "请选择订单业务类型", trigger: "blur" }],
  distributorId: [{ required: true, message: "请输入供应商ID", trigger: "blur" }]
}

// 导入订单校验
export const importOrderRule = {
  labelType: [{ required: true, message: "请选择标签类型", trigger: "change" }],
  platform: [{ required: true, message: "请选择平台", trigger: "change" }],
  market: [{ required: true, message: "请选择站点", trigger: "change" }],
  shop: [{ required: true, message: "请选择店铺", trigger: "change" }],
  orderCode: [{ required: true, message: "请输入订单编号", trigger: "blur" }]
}

// 设置仓库物流校验
export const warehouseRule = {
  warehouseId: [{ required: true, message: "请选择发货仓库", trigger: "change" }],
  transportCarrierCode: [{ required: true, message: "请选择物流商", trigger: "change" }],
  bseOverseaCarrierCode: [{ required: true, message: "请选择物流渠道", trigger: "change" }]
}

// 规则名称等校验
export const actionRule = {
  action: [{ required: true, message: "请选择执行工作", trigger: "change" }],
  splitMethod: [{ required: true, message: "请选择拆分方式", trigger: "change" }],
  deliveryWarehouseId: [{ required: true, message: "请选择发货仓库", trigger: "change" }],
  alternativeWarehouseId: [{ required: true, message: "请选择备选仓库", trigger: "change" }]
}

// 新增手工单校验
const validateReceivePhone = (rule, value, callback) => {
  if (!/\d/.test(value)) {
    callback(new Error("电话必须包含数字"))
  }
  callback()
}
const validateAddress = (rule, value, callback) => {
  if (/^\d+$/.test(value)) {
    callback(new Error("详细地址不能是纯数字"))
  }
  callback()
}
const validateNumber = (rule, value, callback) => {
  console.log(1111, value)
  if (/^[1-9]+\.*[0-9]+$/.test(value)) {
    callback()
  } else {
    callback(new Error("请输入正整数"))
  }
}

export const addOrderRule = {
  platform: [{ required: true, message: "请选择平台", trigger: "change" }],
  market: [{ required: true, message: "请选择站点", trigger: "change" }],
  shop: [{ required: true, message: "请选择店铺", trigger: "change" }],
  orderType: [{ required: true, message: "请选择订单类型", trigger: "change" }],
  paymentMethod: [{ required: true, message: "请选择付款方式", trigger: "change" }],
  orderBusinessType: [{ required: true, message: "请选择业务类型", trigger: "change" }],
  sourceCode: [{ required: true, message: "请输入平台单号", trigger: "blur" }],
  orderTime: [{ required: true, message: "请输入下单时间", trigger: "blur" }],
  receiveName: [{ required: true, message: "请输入收件人", trigger: "blur" }],
  receivePostalCode: [{ required: true, message: "请输入邮编", trigger: "blur" }],
  country: [{ required: true, message: "请选择国家", trigger: "change" }],
  address: [
    { required: true, message: "请输入详细地址", trigger: "blur" },
    { min: 2, max: 35, message: "详细地址长度在2到35个字符", trigger: "blur" },
    { validator: validateAddress, trigger: "blur" }
  ],
  addressIDN: [
    { required: true, message: "请输入详细地址", trigger: "blur" },
    { min: 2, max: 150, message: "详细地址长度在2到150个字符", trigger: "blur" },
    { validator: validateAddress, trigger: "blur" }
  ],
  receivePhone: [
    { required: true, message: "请输入电话", trigger: "blur" },
    { min: 10, max: 20, message: "电话长度在10到20个字符", trigger: "blur" },
    { validator: validateReceivePhone, trigger: "blur" }
  ],
  province: [{ required: true, message: "请输入省", trigger: "blur" }],
  city: [{ required: true, message: "请输入市", trigger: "blur" }],
  amount: [{ required: true, message: "请输入订单总金额(不含税)", trigger: "blur" }],
  amountCurrency: [{ required: true, message: "请选择订单总金额(不含税)币种", trigger: "change" }],
  amountHasTax: [{ required: true, message: "请输入订单总金额(含税)", trigger: "blur" }],
  amountHasTaxCurrency: [{ required: true, message: "请选择订单总金额(含税)币种", trigger: "change" }],
  buyerFreightCurrency: [{ required: true, message: "请选择运费币种", trigger: "change" }],
  deliveryMethod: [{ required: true, message: "请选择发货方式", trigger: "change" }]
}

// 编辑订单校验
export const editOrderRule = {
  receiveName: [{ required: true, message: "请输入收件人", trigger: "blur" }],
  phone: [
    { required: true, message: "请输入电话", trigger: "blur" },
    { min: 10, max: 20, message: "电话长度在10到20个字符", trigger: "blur" },
    { validator: validateReceivePhone, trigger: "blur" }
  ],
  // receiveEmail: [
  //   { required: true, message: '请输入邮箱', trigger: 'blur' },
  // ],
  postalCode: [{ required: true, message: "请输入邮编", trigger: "blur" }],
  country: [{ required: true, message: "请选择国家", trigger: "change" }],
  address: [
    { required: true, message: "请输入详细地址", trigger: "blur" },
    { min: 2, max: 35, message: "详细地址长度在2到35个字符", trigger: "blur" },
    { validator: validateAddress, trigger: "blur" }
  ],
  stateOrRegion: [{ required: true, message: "请输入省", trigger: "blur" }],
  city: [{ required: true, message: "请输入市", trigger: "blur" }]
}

// 取消订单校验
export const cancelOrderRule = {
  reason: [{ required: true, message: "请选择取消原因", trigger: "change" }],
  remark: [{ required: true, message: "请输入取消备注", trigger: "blur" }]
}

// 修改地址校验
export const editAddressrRule = {
  receiveName: [{ required: true, message: "请输入收件人", trigger: "blur" }],
  receivePhone: [
    { required: true, message: "请输入电话", trigger: "blur" },
    { min: 10, max: 20, message: "电话长度在10到20个字符", trigger: "blur" },
    { validator: validateReceivePhone, trigger: "blur" }
  ],
  receivePostalCode: [{ required: true, message: "请输入邮编", trigger: "blur" }],
  country: [{ required: true, message: "请选择国家", trigger: "change" }],
  address: [
    { required: true, message: "请输入详细地址", trigger: "blur" },
    { min: 2, max: 150, message: "详细地址长度在2到150个字符", trigger: "blur" },
    { validator: validateAddress, trigger: "blur" }
  ],
  addressIDN: [
    { required: true, message: "请输入详细地址", trigger: "blur" },
    { min: 2, max: 150, message: "详细地址长度在2到150个字符", trigger: "blur" },
    { validator: validateAddress, trigger: "blur" }
  ],
  province: [{ required: true, message: "请输入省/州", trigger: "blur" }],
  city: [{ required: true, message: "市", trigger: "blur" }]
}

export const ORDER_STATUS = [
  { label: "创建", value: "SAVE" },
  { label: "待处理", value: "PENDING" },
  { label: "待确认", value: "UNCONFIRM" },
  { label: "已确认", value: "CONFIRM" },
  { label: "待发货", value: "UNSHIPPED" }
]

// 接收订单
export const receiveOrderTableOption = {
  border: true,
  selection: false,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "receiveOrder",
  searchAdvanced: false, //高级搜索
  header: false,
  column: [
    { label: "订单号", prop: "orderCode", sortable: false },
    { label: "平台订单号", prop: "sourceCode", sortable: false },
    { label: "发货窗口", prop: "shipWindowLeft", solt: true, sortable: false },
    { label: "明细行行号", prop: "detailLineNo", sortable: false },
    { label: "工厂SKU", prop: "skuCode", sortable: false },
    { label: "平台SKU", prop: "asin", sortable: false },
    { label: "产品名称", prop: "skuName", sortable: false },
    { label: "数量", prop: "expectedQuantity", sortable: false, width: 100 },
    { label: "当前SKU可用库存", prop: "currentSkuAbleQuantity", sortable: false },
    { label: "所有SKU可用库存", prop: "allSkuAbleQuantity", sortable: false },
    { label: "接收数量", prop: "receiveQuantity", sortable: false, solt: true, required: true, width: 180 }
  ]
}

// 生成发货批次单
export const generationDeliveryBatchTableOption = {
  border: true,
  selection: true,
  stripe: false,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "generationDelivery",
  searchAdvanced: false, //高级搜索
  header: false,
  highlightCurrentRow: false,
  fixHeight: 400,
  column: [
    { label: "提货时间", prop: "requestPickUpTime", sortable: false, solt: true, required: true, width: 130 },
    { label: "发货仓库", prop: "warehouseName", sortable: false },
    // { label: "物流商", prop: "transportCarrier", sortable: false, solt: true, required: true, width: 130 },
    // { label: "物流渠道", prop: "logisticsChannel", sortable: false, solt: true, required: true, width: 130 },
    { label: "shipment ID", prop: "shipmentId", sortable: false },
    { label: "总托数", prop: "totalPalletCount", sortable: false, width: 80 },
    { label: "总箱数", prop: "totalCartonCount", sortable: false, width: 80 },
    { label: "托盘号", prop: "palletCode", sortable: false, width: 80 },
    { label: "每托合计箱数", prop: "cartonCount", sortable: false },
    { label: "打托数", prop: "palletNumber", sortable: false, width: 80 },
    { label: "箱号", prop: "cartonCode", sortable: false, width: 80 },
    { label: "平台订单号", prop: "sourceCode", sortable: false },
    { label: "明细行行号", prop: "detailLineNo", sortable: false, width: 90 },
    { label: "托盘规格", prop: "palletSpec", sortable: false, width: 80 },
    { label: "工厂SKU", prop: "sku", sortable: false },
    { label: "平台SKU", prop: "asin", sortable: false },
    { label: "产品名称", prop: "skuName", sortable: false, width: 100 },
    { label: "数量", prop: "expectedQuantity", sortable: false, width: 80 },
    { label: "确认发货量", prop: "validQuantity", sortable: false, width: 90 },
    { label: "可拆单数量", prop: "deliveryQuantity", sortable: false, width: 90 },
    { label: "操作", prop: "operation", sortable: false, solt: true, width: 80 }
  ]
}

// 生成发货批次单 TOC
export const generationDeliveryBatchTableOptionToC = {
  border: true,
  selection: false,
  stripe: false,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "generationDeliveryToC",
  searchAdvanced: false, //高级搜索
  header: false,
  highlightCurrentRow: false,
  fixHeight: 570,
  column: [
    { label: "物流商", prop: "transportCarrier", sortable: false, solt: true, required: true, width: 180 },
    { label: "物流渠道", prop: "logisticsChannel", sortable: false, solt: true, required: true, width: 180 },
    { label: "发货仓库", prop: "warehouseName", sortable: false },
    { label: "平台订单号", prop: "sourceCode", sortable: false },
    { label: "明细行行号", prop: "detailLineNo", sortable: false },
    { label: "工厂SKU", prop: "sku", sortable: false },
    { label: "平台SKU", prop: "asin", sortable: false },
    { label: "产品名称", prop: "skuName", sortable: false, width: 150 },
    { label: "数量", prop: "expectedQuantity", sortable: false, width: 100 },
    { label: "确认发货量", prop: "validQuantity", sortable: false }
  ]
}
