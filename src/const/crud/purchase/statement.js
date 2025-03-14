export const tableOption = {
  maxHeight: document.body.clientHeight - 360, //固定标题
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  index: false,
  indexLabel: "序号",
  stripe: true,
  isMedia: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  menu: false,
  selection: true,
  column: [
    {
      label: "对账单号",
      prop: "statementNo",
      solt: true,
      sortable: false
    },
    {
      label: "法人主体",
      prop: "corporationName",
      overHidden: true,
      sortable: false
    },
    {
      label: "供应商",
      prop: "supplierName",
      inputStyle: "width:150px",
      overHidden: true,
      sortable: false
    },
    {
      label: "单据日期",
      prop: "statementTime",
      sortable: false
    },
    {
      label: "排柜号",
      prop: "cabinetCodeNos",
      width: 180,
      sortable: false,
      formatter: function (row, value, label, column) {
        return value.join(",")
      }
    },
    {
      label: "采购单号",
      prop: "purchaseOrderNos",
      width: 150,
      solt: true,
      sortable: false
    },

    {
      label: "对账金额",
      prop: "totalAmount",
      sortable: false
    },
    {
      label: "币种",
      prop: "currency",
      sortable: false
    },
    {
      label: "对账状态",
      prop: "statementStatus",
      sortable: false,
      formatter: function (row, value, label, column) {
        if (value == -1) {
          return "无效"
        } else if (value == 0) {
          return "待提交"
        } else if (value == 1) {
          return "待采购审核"
        } else if (value == 2) {
          return "待财务审核"
        } else if (value == 3) {
          return "审核完成"
        } else {
          return value
        }
      }
    },
    {
      label: "对方回签件",
      width: 120,
      prop: "existSupplierCertification",
      sortable: false,
      solt: true
    },
    {
      label: "制单员",
      minWidth: 90,
      prop: "createByName",
      sortable: false
    }
  ]
}

export const inAndOutStockInfoDialogOption = {
  selection: false,
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  //index: true,
  //indexLabel: '序号',
  stripe: false,
  menu: false,
  header: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "SKU",
      sortable: false,
      prop: "skuCode"
    },
    {
      label: "SKU名称",
      sortable: false,
      prop: "skuName"
    },
    {
      label: "入库数量",
      sortable: false,
      prop: "inStockQuantity"
    },
    {
      label: "出库数量",
      sortable: false,
      prop: "outStockQuantity"
    },
    {
      label: "结余数量",
      sortable: false,
      prop: "remainQuantity"
    }
  ]
}
