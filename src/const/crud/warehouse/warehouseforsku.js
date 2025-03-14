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
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  column: [
    {
      label: "仓库服务商",
      prop: "providerName"
    },
    {
      label: "仓库SKU",
      prop: "bseWarehouseSkuCode"
    },
    {
      label: "工厂SKU",
      prop: "skuCode"
      // solt: true,
    },
    {
      label: "启用/禁用",
      prop: "status"

      // formatter: function (row, value) {
      //   if (value == '1') {
      //     return '禁用'
      //   } else if (value == '0') {
      //     return '启用'
      //   } else {
      //     return ''
      //   }
      // },
    },
    {
      label: "创建人",
      prop: "createUser"
    },
    {
      label: "创建时间",
      prop: "createTime"
    },
    {
      label: "更新人",
      prop: "updateUser"
    },
    {
      label: "更新时间",
      prop: "updateTime",
      sortable: true
    },
    {
      label: "操作日志",
      prop: "operationLog",
      solt: true,
      sortable: false
    }
  ]
}

var validPSkuCode = (rule, value, callback) => {
  var reg = /^[0-9a-zA-Z!@#$%^&*()-_]{0,50}$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error("字母+数字+特殊符号【!@#$%^&*()】"))
  }
}

export const addOrUpdateRules = {
  warehouseProviderId: [{ required: true, message: "仓库服务商不能为空", trigger: "blur" }],
  warehouseSku: [{ required: true, message: "仓库SKU不能为空", trigger: "blur" }],
  skuCode: [
    { required: true, message: "工厂SKU不能为空", trigger: "blur" }
    // { validator: validPSkuCode, trigger: 'blur' }
  ],
  isShare: [{ required: true, message: "共享不能为空", trigger: "blur" }],
  storeId: [{ required: true, message: "店铺不能为空", trigger: "blur" }],
  skuCode: [{ required: true, message: "SKU不能为空", trigger: "blur" }],
  salesGroupId: [{ required: true, message: "业务组不能为空", trigger: "blur" }]
}

/***店铺信息table */
export const storeOption = {
  enableLocalStorage: false,
  showSearchBtn: false,
  border: true,
  stripe: true,
  menu: false,
  header: false,
  menuAlign: "center",
  editBtn: false,
  delBtn: false,
  align: "center",
  addBtn: false,
  menuWidth: "auto",
  size: "mini",
  paginationLayout: "prev, pager, next",
  columnBtn: false,
  resetBtn: false,
  tip: false,
  height: 330,
  index: true,
  indexLabel: "序号",
  column: [
    {
      label: "店铺名称",
      prop: "storeAccount",
      span: 24
    },
    {
      label: "备注",
      prop: "storeRemark",
      span: 24
    }
  ]
}
