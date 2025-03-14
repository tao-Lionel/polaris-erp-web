export const tableOption = {
  maxHeight: document.body.clientHeight - 360, //固定标题
  // height:750,//固定标题
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
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器

  column: [
    {
      label: "优先级",
      prop: "priority",
      solt: true,
      search: false,
      sortable: false
    },
    {
      label: "规则名称",
      prop: "ruleName",
      solt: true,
      sortable: false
    },
    {
      label: "规则类型",
      prop: "rulesetName",
      search: false,
      sortable: false
    },
    {
      label: "状态",
      prop: "ruleStatus",
      solt: true,
      sortable: false,
      searchPlaceholder: "请输入",
      copy: false
    },
    {
      label: "创建人",
      prop: "createName",
      sortable: false
    },
    {
      label: "创建时间",
      prop: "createTime",
      sortable: false
    },
    {
      label: "更新人",
      prop: "operatorName",
      sortable: false
    },
    {
      label: "更新时间",
      prop: "updateTime",
      sortable: false
    },
    {
      label: "操作",
      prop: "brandSolt",
      solt: true,
      sortable: false,
      width: "140px",
      copy: false
    }
  ]
}

// 规则名称等校验
export const formRule = {
  ruleName: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
  scene: [{ required: true, message: "请选择规则类型", trigger: "change" }],
  ruleStatus: [{ required: true, message: "请选择规则状态", trigger: "change" }]
}

// 规则名称等校验
export const actionRule = {
  action: [{ required: true, message: "请选择执行工作", trigger: "change" }],
  splitMethod: [{ required: true, message: "请选择拆分方式", trigger: "change" }],
  deliveryWarehouseId: [{ required: true, message: "请选择发货仓库", trigger: "change" }],
  // alternativeWarehouseId: [
  //   { required: true, message: '请选择备选仓库', trigger: 'change' },
  // ],
  logisticsChannel: [{ required: true, message: "请选择物流渠道", trigger: "change" }],
  delayedHours: [{ required: true, message: "请输入小时数", trigger: "change" }],
  excuteFlags: [{ required: true, message: "请输入", trigger: "blur" }]
}

// 可选条件标题
export const TITLE = [
  { title: "基础信息", value: "baseMsg" },
  { title: "仓储物流", value: "logistics" },
  { title: "订单信息", value: "orderMsg" }
]
