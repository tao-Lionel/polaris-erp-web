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
  index: true,
  selection: true,
  indexLabel: "序号",
  stripe: true,
  menu: false,
  viewBtn: false,
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器
  column: [
    {
      label: "组合商品编码",
      prop: "code",
      solt: true,
      sortable: false
    },

    {
      label: "组合商品名称",
      prop: "name",
      sortable: false
    },
    {
      label: "组合商品关系",
      prop: "relationString",
      sortable: false
    },
    {
      label: "销售状态",
      prop: "saleStatus",
      sortable: false
    },
    {
      label: "审核状态",
      prop: "checkStatus",
      sortable: false
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
      prop: "updateName",
      sortable: false
    },
    {
      label: "更新时间",
      prop: "updateTime",
      sortable: false
    }
  ]
}

export const prdOption = {
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
      label: "工厂SKU",
      prop: "skuCode",
      width: 200,
      solt: true,
      sortable: false
    },

    {
      label: "产品名称",
      prop: "skuName",
      width: 240,
      sortable: false
    },
    {
      label: "数量",
      prop: "num",
      width: 100,
      solt: true,
      sortable: false
    },
    {
      label: "标准售价",
      prop: "price",
      width: 120,
      solt: true,
      sortable: false
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
