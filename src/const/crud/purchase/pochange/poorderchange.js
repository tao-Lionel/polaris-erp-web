export const tableOption = {
  maxHeight: document.body.clientHeight - 370, //固定标题
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  // index: true,
  // indexLabel: '序号',
  isMedia: true,
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  expand: true,
  column: [
    {
      label: "单据编号",
      prop: "poOrderChangeNo",
      solt: true,
      sortable: false
    },
    {
      label: "单据时间",
      prop: "createTime"
    },
    {
      label: "采购订单",
      prop: "purchaseOrderNo",
      sortable: false
    },
    {
      label: "新采购单号",
      prop: "newPurchaseOrderNo",
      sortable: false
    },
    {
      label: "源合同编号",
      prop: "oldContractNo",
      sortable: false
    },
    {
      label: "新合同单号",
      prop: "newContractNo",
      sortable: false
    },
    // {
    //   label: '新合同我司签章件',
    //   prop: 'attachFile',
    //   solt:true,
    //
    // },
    {
      label: "法人主体",
      prop: "corporationName",
      sortable: false
    },
    {
      label: "供应商",
      prop: "supplierName",
      sortable: false
    },
    {
      label: "变更状态",
      prop: "status",
      solt: true,
      copy: false,
      sortable: false
    },
    {
      label: "变更人",
      prop: "createName",
      sortable: false
    }
  ]
}
