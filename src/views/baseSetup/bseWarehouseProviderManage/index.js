export const tableOption = {
  maxHeight: document.body.clientHeight - 360, //固定标题
  selection: true,
  border: true,
  // index: true,
  // indexLabel: "序号",
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
      label: "仓库服务商编码",
      prop: "carrierCode",
      sortable: false
    },
    {
      label: "仓库服务商名称",
      sortable: false,
      prop: "carrierName"
    },
    {
      label: "是否海外",
      sortable: false,
      prop: "isOverseasName"
    },
    {
      label: "适用箱型",
      sortable: false,
      prop: "boxCarType",
      solt: true
    },
    {
      label: "状态",
      sortable: false,
      prop: "disabledName"
    },
    {
      label: "创建人",
      sortable: false,
      prop: "createName"
    },
    {
      label: "创建时间",
      sortable: false,
      prop: "createTime"
    },

    {
      label: "更新人",
      sortable: false,
      prop: "updateName"
    },
    {
      label: "更新时间",
      sortable: false,
      prop: "updateTime"
    },
    {
      label: "操 作",
      prop: "btnGroup",
      solt: true,
      width: 100,
      sortable: false,
      copy: false
    }
  ]
}

/**新增修改验证规则 */
export const addOrUpdateRules = {
  disabled: [{ required: true, message: "状态", trigger: "blur" }],
  carrierCode: [{ required: true, message: "仓库服务商编码不能为空", trigger: "blur" }],
  carrierName: [{ required: true, message: "仓库服务商名称不能为空", trigger: "blur" }],
  boxCarType: [{ required: true, message: "箱型车型不能为空", trigger: "blur" }],
  isOverseas: [{ required: true, message: "是否海外不能为空", trigger: "blur" }]
}
