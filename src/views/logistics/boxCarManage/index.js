export const tableOption = {
  maxHeight: document.body.clientHeight - 370, //固定标题
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  // index: true,
  // indexLabel: '序号',
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
      label: "名称",
      prop: "name",
      sortable: false
    },
    {
      label: "编码",
      prop: "code",
      sortable: false
    },
    {
      label: "类型",
      prop: "boxCarTypeName"
    },
    {
      label: "最大重量（kg）",
      width: 160,
      prop: "maxWeight",
      sortable: false
    },
    {
      label: "最大体积（m³）",
      prop: "maxVolume",
      width: 160,
      sortable: false
    },
    {
      label: "适用站点",
      solt: true,
      prop: "applicationSite",
      sortable: false
    },
    {
      label: "状态",
      prop: "disabledName",
      sortable: false
    },

    {
      label: "创建人",
      prop: "createName",
      copy: false,
      sortable: false
    },
    {
      label: "创建时间",
      prop: "createTime",
      copy: false,
      sortable: false
    },
    {
      label: "更新人",
      prop: "updateName",
      copy: false,
      sortable: false
    },
    {
      label: "更新时间",
      prop: "updateTime",
      copy: false,
      sortable: false
    },
    {
      label: "操作",
      fixed: "right",
      solt: true,
      prop: "operation",
      sortable: false,
      width: 100,
      copy: false
    }
  ]
}
