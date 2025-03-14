export const tableOption = {
  // height:750,//固定标题
  maxHeight: document.body.clientHeight - 360, //固定标题
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
      prop: "labelPriority",
      solt: true,
      search: false,
      sortable: false
    },
    {
      label: "标签类型",
      prop: "labelType",
      sortable: false,
      solt: true
    },
    {
      label: "标签",
      prop: "name",
      solt: true,
      sortable: false,
      copy: false
    },
    {
      label: "操作人",
      prop: "updateName",
      sortable: false
    },
    {
      label: "操作时间",
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

// 新建标签校验
export const addLabelRule = {
  name: [{ required: true, message: "请输入标签名称", trigger: "blur" }],
  labelColor: [{ required: true, message: "请选择标签颜色", trigger: "change" }]
}
