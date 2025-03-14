export const tableOption = {
  maxHeight: document.body.clientHeight - 408, //固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: true,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2],//dialog是否可选
  fixed: false,
  searchShow: true,
  showSearchBtn: true,
  showEmptyBtn: true,
  searchFlag: true,
  searchAdvanced: true, //高级搜索
  // index: true,
  selection: false,
  selectionFixed: true,
  index: false,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器

  column: [
    {
      label: "工单编号",
      prop: "workOrderCode",
      solt: true,
      sortable: false
    },
    {
      label: "工单类型",
      prop: "workOrderTypeName",
      sortable: false
    },
    {
      label: "工单状态",
      prop: "workOrderStatusName",
      sortable: false
    },
    {
      label: "关联单据状态",
      prop: "relationStatus",
      solt: true,
      sortable: false
    },
    {
      label: "售后原因",
      prop: "reasonMsg",
      sortable: false
    },
    {
      label: "备注",
      prop: "remark",
      sortable: false,
      width: 120
    },
    {
      label: "订单号",
      prop: "soOrderCode",
      sortable: false
    },
    {
      label: "平台订单号",
      prop: "sourceCode",
      sortable: false
    },
    {
      label: "平台订单编码",
      prop: "platformOrderCode",
      sortable: false
    },
    {
      label: "店铺",
      prop: "shopAccount",
      sortable: false
    },
    {
      label: "SKU*申请退货数量",
      prop: "skuReturnQuantity",
      sortable: false,
      solt: true,
      width: 350
    },
    {
      label: "总退款金额",
      prop: "totalRefundAmount",
      sortable: false,
      solt: true
    },

    {
      label: "新订单单号/状态",
      prop: "soOrderCodeNew",
      sortable: false,
      solt: true
    },

    {
      label: "创建人/创建时间",
      prop: "createTime",
      sortable: "custom",
      solt: true,
      width: 200
    },
    {
      label: "更新人/更新时间",
      prop: "updateTime",
      sortable: "custom",
      solt: true,
      width: 200
    },
    {
      label: "操作",
      prop: "opeSolt",
      sortable: false,
      solt: true,
      width: 190,
      fixed: "right",
      copy: false
    }
  ]
}

export const addDetailOption = {
  maxHeight: document.body.clientHeight - 408, //固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: true,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2],//dialog是否可选
  fixed: false,
  searchShow: true,
  showSearchBtn: true,
  showEmptyBtn: true,
  searchFlag: true,
  searchAdvanced: false, //高级搜索
  // index: true,
  selection: true,
  selectionFixed: false,
  index: false,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  header: false, //是否显示头部
  pageFlag: true, //是否显示分页器

  column: [
    {
      label: "SKU",
      prop: "sku",
      width: 100,
      sortable: false
    },
    {
      label: "产品名称",
      prop: "skuName",
      width: 130,
      sortable: false
    },
    {
      label: "品类",
      prop: "categoryName",
      width: 100,
      sortable: false
    },
    {
      label: "品牌",
      prop: "brandName",
      sortable: false
    },
    {
      label: "下单数量",
      prop: "soOrderDetailQuantity",
      sortable: false
    },
    {
      label: "已发货数量",
      prop: "actualDeliveryNum",
      sortable: false
    },
    {
      label: "实付单价（含税）",
      prop: "unitPriceHasTax",
      sortable: false
    },
    {
      label: "实付总金额（含税）",
      prop: "amountHasTax",
      sortable: false
    },
    {
      label: "已申请退货数量",
      prop: "applyReturnQuantity",
      sortable: false
    },
    {
      label: "申请退货数量",
      prop: "returnQuantity",
      solt: true,
      sortable: false,
      width: 200
    },
    {
      label: "已退款金额",
      prop: "applyRefundAmount",
      sortable: false
    },
    {
      label: "退款金额",
      prop: "refundAmount",
      solt: true,
      sortable: false,
      width: 300
    },
    {
      label: "操作",
      prop: "opeBtn",
      solt: true,
      sortable: false,
      width: 200,
      copy: false
    }
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
  // dialogDisable: [0, 1, 2],//dialog是否可选
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
      width: 100
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

export const refundOption = {
  maxHeight: document.body.clientHeight - 408, //固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: true,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2],//dialog是否可选
  fixed: false,
  searchShow: true,
  showSearchBtn: true,
  showEmptyBtn: true,
  searchFlag: true,
  searchAdvanced: false, //高级搜索
  // index: true,
  selection: false,
  selectionFixed: true,
  index: false,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  header: false, //是否显示头部
  pageFlag: false, //是否显示分页器

  column: [
    {
      label: "SKU",
      prop: "sku",
      width: 180,
      sortable: false
    },
    {
      label: "产品名称",
      prop: "skuName",
      width: 300,
      sortable: false
    },
    {
      label: "品类",
      prop: "categoryName",
      width: 250,
      sortable: false
    },
    {
      label: "品牌",
      prop: "brandName",
      width: 200,
      sortable: false
    },
    {
      label: "下单数量",
      width: 100,
      prop: "soOrderDetailQuantity",
      sortable: false
    },
    {
      label: "已发货数量",
      prop: "actualDeliveryNum",
      sortable: false
    },
    {
      label: "实付单价（含税）",
      prop: "unitPriceHasTax",
      sortable: false
    },
    {
      label: "实付总金额（含税）",
      prop: "amountHasTax",
      sortable: false
    },
    {
      label: "申请退货数量",
      prop: "returnQuantity",
      sortable: false
    },
    {
      label: "已申请退款金额",
      prop: "applyRefundAmount",
      sortable: false
    },
    {
      label: "退款金额",
      prop: "refundAmount",
      sortable: false
    }
  ]
}

export const returnOption = {
  maxHeight: document.body.clientHeight - 408, //固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: true,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2],//dialog是否可选
  fixed: false,
  searchShow: true,
  showSearchBtn: true,
  showEmptyBtn: true,
  searchFlag: true,
  searchAdvanced: false, //高级搜索
  // index: true,
  selection: false,
  selectionFixed: true,
  index: false,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  header: false, //是否显示头部
  pageFlag: false, //是否显示分页器

  column: [
    {
      label: "退货单号",
      prop: "returnCode",
      sortable: false
    },
    {
      label: "SKU",
      prop: "sku",
      sortable: false
    },
    {
      label: "产品名称",
      prop: "skuName",
      sortable: false
    },
    {
      label: "品类",
      prop: "categoryName",
      sortable: false
    },
    {
      label: "下单数量",
      prop: "soOrderDetailQuantity",
      sortable: false
    },
    {
      label: "已发货数量",
      prop: "actualDeliveryNum",
      sortable: false
    },
    {
      label: "申请退货数量",
      prop: "returnQuantity",
      sortable: false,
      required: true
    },
    {
      label: "退货物流单号",
      prop: "logisticsNo",
      sortable: false,
      required: true
    },
    {
      label: "实际退货数量",
      prop: "actualReturnNum",
      sortable: false,
      solt: true,
      required: true,
      width: 120
    },
    {
      label: "退货仓库",
      prop: "defaultWarehouseIdList",
      sortable: false,
      required: true,
      solt: true,
      width: 150
    },
    {
      label: "退货入库单号",
      prop: "returnInBoundNo",
      sortable: false,
      solt: true,
      width: 120
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
  // dialogDisable: [0, 1, 2],//dialog是否可选
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
      prop: "operateName",
      width: 200,
      sortable: false
    },
    {
      label: "操作时间",
      width: 180,
      prop: "operateTime",
      sortable: false
    },
    {
      label: "备注",
      prop: "remark",
      sortable: false
    }
  ]
}

export const originOrderOption = {
  // height: 400,//固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2],//dialog是否可选
  dic: [],
  fixed: false,
  searchShow: false,
  showSearchBtn: false,
  showEmptyBtn: false,
  searchFlag: false,
  searchAdvanced: false, //高级搜索
  index: true,
  // selection: true,
  // indexLabel: '序号',
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
      prop: "sku",
      sortable: false
    },
    {
      label: "产品名称",
      prop: "skuName",
      sortable: false
    },
    {
      label: "品类",
      prop: "categoryName",
      sortable: false
    },
    {
      label: "品牌",
      prop: "brandName",
      sortable: false
    },
    {
      label: "下单数量",
      prop: "soOrderDetailQuantity",
      sortable: false
    },
    {
      label: "已发货数量",
      prop: "actualDeliveryNum",
      sortable: false
    },
    {
      label: "实付单件（含税）",
      prop: "unitPriceHasTax",
      sortable: false
    },
    {
      label: "实付总金额（含税）",
      prop: "amountHasTax",
      sortable: false
    },
    {
      label: "申请售后数量",
      prop: "returnQuantity",
      sortable: false
    },
    {
      label: "退款金额",
      prop: "refundAmount",
      sortable: false
    }
  ]
}

export const operationLogOption = {
  // height: 400,//固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2],//dialog是否可选
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
      width: 200,
      sortable: false
    },
    {
      label: "操作人",
      width: 180,
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

export const addOrUpdateRules = {
  workOrderType: [{ required: true, message: "请选择工单类型", trigger: "change" }],
  reason: [{ required: true, message: "请选择售后原因", trigger: "change" }],
  complainOriginalText: [{ required: true, message: "请输入投诉原文", trigger: "change" }],
  keyPointsExtractionText: [{ required: true, message: "请输入要点提取", trigger: "change" }],
  sourceCode: [{ required: true, message: "平台订单号不能为空", trigger: "change" }],
  store: [{ required: true, message: "店铺不能为空", trigger: "change" }],
  orderBusinessType: [{ required: true, message: "交货模式能为空", trigger: "change" }]
}

export const followReturnRules = {
  workOrderType: [{ required: true, message: "请选择工单类型", trigger: "change" }],
  reason: [{ required: true, message: "请选择售后原因", trigger: "change" }],
  complainOriginalText: [{ required: true, message: "请输入投诉原文", trigger: "change" }],
  keyPointsExtractionText: [{ required: true, message: "请输入要点提取", trigger: "change" }]
}

//  新增窗口rule
export const addOrderRule = {
  platform: [{ required: true, message: "请选择平台", trigger: "change" }],
  market: [{ required: true, message: "请选择站点", trigger: "change" }],
  shop: [{ required: true, message: "请选择店铺", trigger: "change" }],
  orderType: [{ required: true, message: "请选择订单类型", trigger: "change" }],
  paymentMethod: [{ required: true, message: "请选择付款方式", trigger: "change" }],
  orderBusinessType: [{ required: true, message: "请选择业务类型", trigger: "change" }],
  sourceCode: [{ required: true, message: "请输入平台单号", trigger: "blur" }]
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
  // dialogDisable: [0, 1, 2],//dialog是否可选
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
      label: "SKU",
      prop: "sku",
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
      sortable: false,
      width: 250
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

export const addGiftWorkOrderRules = {
  workOrderType: [{ required: true, message: "请选择工单类型", trigger: "change" }],
  reason: [{ required: true, message: "请选择售后原因", trigger: "change" }],
  complainOriginalText: [{ required: true, message: "请输入投诉原文", trigger: "change" }],
  keyPointsExtractionText: [{ required: true, message: "请输入要点提取", trigger: "change" }],
  sourceCode: [{ required: true, message: "平台订单号不能为空", trigger: "change" }],
  store: [{ required: true, message: "店铺不为空", trigger: "change" }],
  orderBusinessType: [{ required: true, message: "交货模式不为空", trigger: "change" }]
}

export const manualWorkOrderRules = {
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
  buyerFreightCurrency: [{ required: true, message: "请选择运费币种", trigger: "change" }],
  deliveryMethod: [{ required: true, message: "请选择发货方式", trigger: "change" }]
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
