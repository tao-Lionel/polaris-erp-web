export const purchaseReturnOption = {
  maxHeight: document.body.clientHeight - 360, //固定标题
  selection: true,
  border: true,
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
  labelPosition: "right",
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  column: [
    {
      label: "采购退货单号",
      prop: "orderNo",
      sortable: false,
      solt: true
    },
    {
      label: "业务时间",
      prop: "transactionDate",
      sortable: false
    },
    {
      label: "供货商",
      prop: "supplierName",
      sortable: false
    },
    {
      label: "退货组织",
      prop: "inOrgName",
      sortable: false
    },
    {
      label: "实退数量",
      prop: "purchaseCount",
      sortable: false
    },
    {
      label: "实退金额",
      prop: "purchaseAmount",
      sortable: false
    },
    // {
    //   label: '发票',
    //   prop: 'remainingNum',
    //   sortable: false,
    // },
    {
      label: "源单类型",
      prop: "orderTypeName",
      sortable: false
    },
    {
      label: "源单号",
      prop: "relationNo",
      sortable: false
    }
  ]
}

export const purchaseReturnDetailOption = {
  selection: false,
  border: true,
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
  labelPosition: "right",
  header: false,
  dic: [],
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  showSummary: true,
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
      label: "商品规格",
      prop: "skuLength",
      sortable: false,
      formatter(row, value, label, column) {
        return row.skuLength + "*" + row.skuWidth + "*" + row.skuHeight
      }
    },
    {
      label: "单价",
      prop: "unitPrice",
      sortable: false
    },
    {
      label: "原采购数量",
      prop: "oriPurchaseCount",
      sortable: false
    },
    {
      label: "退货数量",
      prop: "receivedCount",
      sortable: false
    },
    {
      label: "退货金额",
      prop: "returnAmount",
      sortable: false
    }
  ]
}

export const purchaseOption = {
  selection: true,
  border: true,
  index: false,
  indexLabel: "序号",
  isMedia: true,
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
      label: "采购单号",
      prop: "orderNo",
      sortable: false,
      solt: true
    },
    {
      label: "业务时间",
      prop: "transactionDate",
      sortable: false
    },
    {
      label: "供应商",
      prop: "supplierName",
      sortable: false
    },
    {
      label: "采购组织",
      prop: "inOrgName",
      sortable: false
    },
    {
      label: "采购数量",
      prop: "purchaseCount",
      sortable: false
    },
    {
      label: "采购金额",
      prop: "purchaseAmount",
      sortable: false
    },
    // {
    //   label: '发票',
    //   prop: 'remainingNum',
    //   sortable: false,
    // },
    {
      label: "源单类型",
      prop: "orderTypeName",
      sortable: false
    },
    {
      label: "源单号",
      prop: "relationNo",
      sortable: false
    }
  ]
}

export const purchaseDetailOption = {
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
