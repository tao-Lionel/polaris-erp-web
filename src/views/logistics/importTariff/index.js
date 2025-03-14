export const detailOption = {
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
  selection: false,
  selectionFixed: true,
  index: true,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器
  localStorageSymbol: "A", // 这个属性会拼在路由后面作为数据存储在localStorage中的key，为了兼容一个页面有两个不同表格的情况，没有这种情况的可以不加这个属性
  column: [
    {
      label: "产品品类",
      prop: "categoryName",
      sortable: false
    },
    {
      label: "产地",
      prop: "sourceCountryName",
      sortable: false
    },
    {
      label: "目的国",
      prop: "targetCountryName",
      sortable: false
    },
    {
      label: "目的国海关编码",
      prop: "targetCustomsCode",
      sortable: false
    },
    {
      label: "关税率",
      prop: "tariffRate",
      solt: true,
      sortable: false
    },
    {
      label: "MPF",
      prop: "mpf",
      solt: true,
      sortable: false
    },
    {
      label: "HMF",
      prop: "hmf",
      solt: true,
      sortable: false
    },
    {
      label: "反倾销税率",
      prop: "antiDumpingRate",
      sortable: false,
      solt: true
    },
    {
      label: "消费税率",
      prop: "consumptionRate",
      sortable: false,
      solt: true
    },
    {
      label: "备注",
      prop: "remark",
      sortable: false
    },
    {
      label: "状态",
      prop: "status",
      sortable: false,
      solt: true
    },

    {
      label: "更新人",
      prop: "updateName",
      sortable: "custom"
    },
    {
      label: "更新时间",
      prop: "updateTime",
      sortable: "custom"
    },
    {
      label: "创建人",
      prop: "createName"
    },
    {
      label: "创建时间",
      prop: "createTime",
      sortable: "custom"
    },
    {
      label: "操作",
      prop: "opeSolt",
      sortable: false,
      solt: true,
      width: 150,
      fixed: "right",
      copy: false
    }
  ]
}

export const totalOption = {
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
  selection: false,
  selectionFixed: true,
  index: true,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器
  localStorageSymbol: "B", // 这个属性会拼在路由后面作为数据存储在localStorage中的key，为了兼容一个页面有两个不同表格的情况，没有这种情况的可以不加这个属性
  column: [
    {
      label: "产品品类",
      prop: "categoryName",
      sortable: false
    },
    {
      label: "已维护关税率（条）",
      prop: "maintenanceNum",
      sortable: false
    },

    {
      label: "操作",
      prop: "opeSolt",
      sortable: false,
      solt: true,
      width: 300,
      fixed: "right",
      copy: false
    }
  ]
}

export const getAddTariffFormRules = ({ validateFloat, validateFloatTen, validateFloatFourDigit }) => {
  const validatorArr = [
    { validator: validateFloat, message: "只能输入非负数", trigger: "blur" },
    { validator: validateFloatTen, message: "限制10位整数", trigger: "blur" },
    { validator: validateFloatFourDigit, message: "最多保留四位小数", trigger: "blur" }
  ]

  return {
    categoryId: [{ required: true, message: "请选择产品品类", trigger: "change" }],
    targetCustomsCode: [{ required: true, message: "请输入海关编码", trigger: "change" }],
    sourceCountryId: [{ required: true, message: "请选择产地", trigger: "blur" }],
    targetCountryId: [{ required: true, message: "请选择目的国", trigger: "blur" }],
    tariffRate: [{ required: true, message: "请输入关税率", trigger: "change" }, ...validatorArr],
    mpf: [{ required: true, message: "请输入MPF", trigger: "change" }, ...validatorArr],
    hmf: [{ required: true, message: "请输入HMF", trigger: "change" }, ...validatorArr],
    antiDumpingRate: [{ required: true, message: "请输入反倾销税率", trigger: "change" }, ...validatorArr],
    consumptionRate: [{ required: true, message: "请输入消费税率", trigger: "change" }, ...validatorArr]
  }
}
