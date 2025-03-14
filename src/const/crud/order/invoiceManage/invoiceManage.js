export const tableOption = {
  maxHeight: document.body.clientHeight - 490,
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: true,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [], //dialog是否可选
  dic: [],
  fixed: false,
  searchShow: true,
  showSearchBtn: true,
  showEmptyBtn: true,
  searchFlag: true,
  searchAdvanced: true, //高级搜索
  // index: true,
  selection: true,
  // indexLabel: '序号',
  stripe: true,
  menu: false,
  viewBtn: false,
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器
  showSummary: true,
  column: [
    { label: "发货单号", prop: "orderCode", solt: true, search: false, sortable: false },
    { label: "ARN/排柜号", prop: "extendCode", sortable: false },
    { label: "订单号", prop: "soOrderCode", sortable: false, solt: true, copy: false },
    { label: "平台单号", prop: "sourceCode", sortable: false },
    { label: "平台订单编码", prop: "platformOrderCode", sortable: false },
    { label: "标签", prop: "labels", solt: true, width: 120, sortable: false, copy: false },
    { label: "SKU*数量", solt: true, prop: "spliceProducts", search: false, sortable: false, width: 200, copy: false },
    { label: "不含税总金额", prop: "totalAmount", search: false, sortable: false, width: 130 },
    { label: "平台/站点", prop: "platformSlotText", width: 150, sortable: false },
    { label: "店铺", prop: "store", sortable: false },
    { label: "省/州", prop: "stateOrRegion", sortable: false },
    { label: "异常类型", prop: "abnormalTypeSlotText", sortable: false },
    { label: "发货状态", prop: "deliveryStatusSlotText", width: 120, sortable: false },
    { label: "物流渠道", prop: "logisticsChannelName", sortable: false },
    { label: "发货仓库", prop: "warehouse", sortable: false },
    { label: "下发仓库状态/原因", prop: "interfaceSendFlag", width: 140, solt: true, sortable: false, copy: false },
    { label: "三方仓出库单号", prop: "wmsCode", sortable: false },
    { label: "下发三方仓时间", prop: "interfaceTransactionTime", sortable: false },
    { label: "跟踪号", prop: "trackingNo", sortable: false, solt: true },
    { label: "仓库发货状态/仓库发货时间", prop: "wmsStatus", solt: true, sortable: false },
    { label: "下单时间", prop: "orderTime", sortable: false },
    { label: "要求发货时间", prop: "requiredShipDate", sortable: false },
    { label: "ERP发货时间", prop: "erpShippingTime", sortable: false },
    { label: "创建人/创建时间", prop: "createUserName", width: 180, solt: true, sortable: false },
    { label: "更新人/创建时间", prop: "updateUserName", width: 180, solt: true, sortable: false },
    { label: "操作", prop: "opeSolt", solt: true, sortable: false, width: 100, fixed: "right" }
  ]
}

export const sendTableOption = {
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  pageFlag: true, //是否显示分页器
  column: [
    {
      label: "发货单号",
      prop: "orderCode"
    },
    {
      label: "系统订单号",
      prop: "soOrderCode"
    },
    {
      label: "平台订单号",
      prop: "sourceCode"
    },
    // {
    //   label: "商品图片",
    //   prop: "priority",
    //   width: 80,
    //   solt: true,
    //   type: 'picture'
    // },
    {
      label: "商品",
      slot: true,
      prop: "skuList",
      width: 180
    },
    {
      label: "发货仓库",
      prop: "warehouse",
      width: 130,
      solt: true,
      header: "批量",
      isNeed: true,
      type: "select"
    },
    {
      label: "物流方式",
      prop: "bseOverseaCarrierCode",
      width: 130,
      solt: true,
      header: "批量",
      isNeed: true,
      type: "select"
    },
    // {
    //   label: "运单号",
    //   prop: "yundan",
    //   width: 160,
    //   solt: true,
    //   header: '批量',
    //   isNeed: true,
    //   type: 'input'
    // },
    {
      label: "跟踪号",
      prop: "truckingNo",
      solt: true,
      width: 160,
      header: "批量",
      isNeed: true,
      type: "input"
    },
    {
      label: "操作",
      prop: "sendOpe",
      width: 100,
      solt: true,
      type: "operation",
      fixed: "right",
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
  // dialogDisable: [], //dialog是否可选
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
      label: "发货仓库",
      prop: "warehouseName",
      sortable: false
    },
    {
      label: "物流渠道",
      prop: "logisticsChannelName",
      sortable: false
    },
    {
      label: "发货状态",
      prop: "deliveryStatusName",
      sortable: false
    },
    {
      label: "发货时间",
      prop: "deliveryTime",
      sortable: false
    },
    {
      label: "跟踪号",
      prop: "trackingNo",
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
  // dialogDisable: [], //dialog是否可选
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
export const remarkOption = {
  // height: 400,//固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [], //dialog是否可选
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
export const faceSheetOption = {
  // height: 400,//固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [], //dialog是否可选
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
      label: "跟踪号",
      prop: "trackingNo",
      sortable: false
    },
    {
      label: "面单",
      width: 80,
      prop: "faceSheetUrl",
      sortable: false,
      solt: true
    }
  ]
}

// 同步订单校验
export const synchronousRule = {
  platformTypeId: [{ required: true, message: "请选择平台", trigger: "change" }],
  market: [{ required: true, message: "请选择站点", trigger: "change" }],
  shop: [{ required: true, message: "请选择店铺", trigger: "change" }],
  orderCode: [{ required: true, message: "请输入订单编号", trigger: "blur" }]
}

// 设置仓库物流校验
export const warehouseRule = {
  warehouse: [{ required: true, message: "请选择发货仓库", trigger: "change" }],
  logisticsCode: [{ required: true, message: "请选择物流商", trigger: "change" }],
  logisticsChannel: [{ required: true, message: "请选择物流渠道", trigger: "change" }]
}

// 规则名称等校验
export const actionRule = {
  action: [{ required: true, message: "请选择执行工作", trigger: "change" }],
  splitMethod: [{ required: true, message: "请选择拆分方式", trigger: "change" }],
  deliveryWarehouseId: [{ required: true, message: "请选择发货仓库", trigger: "change" }],
  alternativeWarehouseId: [{ required: true, message: "请选择备选仓库", trigger: "change" }]
}

export const logisticsTrackingOption = {
  // height: 400,//固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [], //dialog是否可选
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
      label: "时间",
      prop: "time_raw",
      sortable: false,
      solt: true
    },
    {
      label: "物流主状态",
      prop: "stage",
      sortable: false
    },
    {
      label: "物流子状态",
      prop: "sub_status",
      sortable: false
    },
    {
      label: "详细物流信息",
      prop: "description",
      sortable: false
    }
  ]
}
