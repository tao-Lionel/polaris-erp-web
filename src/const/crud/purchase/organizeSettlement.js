export const markedTableOption = {
  maxHeight: document.body.clientHeight - 378,
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  isMedia: true,
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "单据编号",
      prop: "listNo",
      width: 150,
      solt: true,
      sortable: false
    },
    {
      label: "价目表名称",
      prop: "listName",
      width: 150,
      sortable: false
    },
    {
      label: "使用组织",
      prop: "corporationName",
      width: 150,
      sortable: false
    },
    {
      label: "结算币别",
      prop: "currency",
      width: 150,
      sortable: false
    },
    {
      label: "商品数量",
      prop: "skuNum",
      width: 150,
      sortable: false
    },
    {
      label: "审核状态",
      prop: "auditStatus",
      width: 150,
      solt: true,
      sortable: false,
      copy: false
    },
    {
      label: "有效时间",
      prop: "effectiveTime",
      width: 200,
      solt: true,
      sortable: false
    },
    {
      label: "备注",
      prop: "remark",
      width: 150,
      sortable: false
    },
    // {
    //   label: '推送状态',
    //   prop: 'syncStatus',
    //   width:150,
    //   solt: true,
    //   sortable: false
    // },
    // {
    //   label: '推送日期',
    //   prop: 'syncTime',
    //   width:150,
    //   sortable: false
    // },
    {
      label: "操作",
      prop: "brandSolt",
      width: 150,
      solt: true,
      fixed: "right",
      sortable: false,
      copy: false
    }
  ]
}

export const relationshipTableOption = {
  maxHeight: document.body.clientHeight - 378,
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  isMedia: true,
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "供应方(应收组织)",
      prop: "outOrgName",
      sortable: false
    },
    {
      label: "接收方(应付组织)",
      prop: "inOrgName",
      sortable: false
    },
    {
      label: "价格来源",
      prop: "detailNameList",
      solt: true,
      sortable: false
    },
    {
      label: "审核状态",
      prop: "auditStatus",
      solt: true,
      sortable: false,
      copy: false
    },
    // {
    //   label: '推送状态',
    //   prop: 'syncStatus',
    //   solt: true,
    //   sortable: false
    // },
    {
      label: "操作日志",
      prop: "log",
      sortable: false,
      solt: true
    },
    {
      label: "操作",
      prop: "brandSolt",
      width: 150,
      fixed: "right",
      solt: true,
      sortable: false,
      copy: false
    }
  ]
}
export const addSkuOption = {
  maxHeight: 400,
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  isMedia: true,
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "编码",
      prop: "skuCode",
      sortable: false
    },
    {
      label: "商品名称",
      prop: "skuName",
      sortable: false
    },
    {
      label: "规格",
      prop: "productSize",
      sortable: false
    }
  ]
}

export const orderOption = {
  maxHeight: 300,
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: false,
  indexLabel: "序号",
  isMedia: true,
  stripe: true,
  header: false,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  showSummary: true,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "序号",
      prop: "indexNum",
      sortable: false,
      solt: true
    },
    {
      label: "商品编码",
      prop: "skuCode",
      sortable: false
    },
    {
      label: "商品名称",
      prop: "skuName",
      sortable: false
    },
    {
      label: "商品规格",
      prop: "skuSpecification",
      sortable: false
    },
    {
      label: "含税单价",
      prop: "unitPrice",
      sortable: false
    },
    {
      label: "应收数量",
      prop: "planCount",
      sortable: false
    },
    {
      label: "实收数量",
      prop: "receivedCount",
      sortable: false
    },
    {
      label: "合计金额",
      prop: "amount",
      sortable: false
    }
  ]
}

export const skuOption = {
  maxHeight: 300,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  isMedia: true,
  stripe: true,
  header: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  columnBtn: false,
  resetBtn: false,
  dic: [],
  column: [
    {
      label: "商品编码",
      prop: "skuCode",
      sortable: false
    },
    {
      label: "商品名称",
      prop: "skuName",
      sortable: false
    },
    {
      label: "规格型号",
      prop: "productSize",
      sortable: false
    },
    {
      label: "含税单价",
      prop: "unitPrice",
      sortable: false
    }
  ]
}

export const editSkuOption = {
  maxHeight: 300,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  isMedia: true,
  stripe: true,
  header: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  columnBtn: false,
  resetBtn: false,
  selection: true,
  dic: [],
  column: [
    {
      label: "商品编码",
      prop: "skuCode",
      sortable: false
    },
    {
      label: "商品名称",
      prop: "skuName",
      sortable: false
    },
    {
      label: "规格型号",
      prop: "productSize",
      sortable: false
    },
    {
      label: "含税单价",
      prop: "unitPrice",
      sortable: false,
      solt: true
    },
    {
      label: "操作",
      prop: "operate",
      sortable: false,
      solt: true,
      copy: false
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

export const rules = {
  listName: [{ required: true, message: "必填字段", trigger: "blur" }],
  corporationId: [{ required: true, message: "必填字段", trigger: "change" }],
  currency: [{ required: true, message: "必填字段", trigger: "change" }],
  timeArr: [{ required: true, message: "必填字段", trigger: "change" }]
}
export const rsRules = {
  outOrgId: [{ required: true, message: "必填字段", trigger: "change" }],
  inOrgId: [{ required: true, message: "必填字段", trigger: "change" }],
  listIdList: [{ required: true, message: "必填字段", trigger: "change" }],
  relationType: [{ required: true, message: "必填字段", trigger: "change" }],
  commonRate: [{ required: true, message: "必填字段", trigger: "blur" }]
}
