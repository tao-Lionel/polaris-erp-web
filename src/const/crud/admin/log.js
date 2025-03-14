export const tableOption = {
  maxHeight: document.body.clientHeight - 290, //固定标题
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  // menuWidth: 150,
  align: "center",
  refreshBtn: true,
  showClomnuBtn: false,
  searchSize: "mini",
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: true,
  dicUrl: "/admin/dict/type/log_type",
  props: {
    label: "label",
    value: "value"
  },
  column: [
    {
      label: "类型",
      prop: "type",
      type: "select",
      dicData: "log_type"
    },
    {
      label: "标题",
      prop: "title"
    },
    {
      label: "IP地址",
      prop: "remoteAddr"
    },
    {
      label: "请求方式",
      prop: "method"
    },
    {
      label: "客户端",
      prop: "serviceId"
    },
    {
      minWidth: 120,
      label: "请求时间",
      prop: "time"
    },
    {
      minWidth: 150,
      label: "创建人",
      prop: "createBy"
    },
    {
      minWidth: 150,
      label: "创建时间",
      prop: "createTime",
      type: "datetime",
      format: "yyyy-MM-dd HH:mm",
      valueFormat: "yyyy-MM-dd HH:mm:ss"
    },
    { label: "操作", prop: "operate", sortable: false, solt: true, fixed: "right", width: 120 }
  ]
}
