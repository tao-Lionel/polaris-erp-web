export const accountsPayableOption = {
  maxHeight: document.body.clientHeight - 410, //固定标题
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
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  column: [
    {
      label: "应付单号",
      prop: "fBillNo",
      sortable: false,
      solt: true
    },
    {
      label: "立账类型",
      prop: "fSetAccountTypeName",
      sortable: false
    },
    {
      label: "业务日期",
      prop: "fDate",
      sortable: false
    },
    {
      label: "费用项目",
      prop: "fFeeItemName",
      sortable: false
    },
    {
      label: "应付金额",
      prop: "fPrice",
      sortable: false
    },
    {
      label: "供应商",
      prop: "fSupplierName",
      sortable: false
    },
    {
      label: "结算组织",
      prop: "fSettleOrgName",
      sortable: false
    },
    {
      label: "成本调整",
      prop: "fAllocationStatusName",
      sortable: false
    }
  ]
}

export const accountsPayableDetailOption = {
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
  header: false,
  labelPosition: "right",
  dic: [],
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  showSummary: true,
  maxHeight: 500,
  column: [
    {
      label: "费用编码",
      prop: "fCostId",
      sortable: false,
      solt: true
    },
    {
      label: "费用项目名称",
      prop: "fCostName",
      sortable: true
    },
    {
      label: "含税金额",
      prop: "fTaxPrice",
      sortable: false
    },
    {
      label: "需调整成本",
      prop: "requiredAdjustedCost",
      sortable: false
    },
    {
      label: "成本调整单",
      prop: "costAdjustBillNoList",
      sortable: false,
      solt: true
    }
  ]
}

export const accountsPayablePsdetailOption = {
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
  header: false,
  labelPosition: "right",
  dic: [],
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  showSummary: true,
  maxHeight: 500,
  column: [
    {
      label: "费用编码",
      prop: "fCostId",
      sortable: false
    },
    {
      label: "费用项目名称",
      prop: "fCostName",
      sortable: true
    },
    {
      label: "含税金额",
      prop: "fTaxPrice",
      sortable: false
    },
    {
      label: "关联财务应付金额",
      prop: "fFinancialPrice",
      sortable: false
    },
    {
      label: "关联财务应付单",
      prop: "fFinancialBillNoList",
      sortable: false,
      solt: true
    },
    {
      label: "未调整成本",
      prop: "unadjustedCost",
      sortable: false
    },
    {
      label: "已调整成本",
      prop: "adjustedCost",
      sortable: false
    },
    {
      label: "成本调整单",
      prop: "costBillNoList",
      sortable: false,
      solt: true
    }
  ]
}

export const receiptOption = {
  maxHeight: document.body.clientHeight - 360, //固定标题
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
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  column: [
    {
      label: "收款单号",
      prop: "fBillNo",
      sortable: false,
      solt: true
    },
    {
      label: "PO号",
      prop: "fOraPo",
      sortable: false
    },
    {
      label: "收款日期",
      prop: "fDate",
      sortable: false
    },
    {
      label: "付款单位",
      prop: "fPayUnitName",
      sortable: false
    },
    // {
    //   label: '销售组织',
    //   prop: 'fPayOrgName',
    //   sortable: false,
    // },
    {
      label: "收款组织",
      prop: "fPayOrgName",
      sortable: false
    },
    {
      label: "实收金额",
      prop: "fPrice",
      sortable: false
    },
    {
      label: "业务类型",
      prop: "fBusinessTypeName",
      sortable: false
    }
  ]
}

export const receiptDetailOption = {
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
  header: false,
  labelPosition: "right",
  dic: [],
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  showSummary: true,
  column: [
    {
      label: "结算方式",
      prop: "fSettleTypeName",
      sortable: false
    },
    {
      label: "收款用途",
      prop: "fPurposeName",
      sortable: false
    },
    {
      label: "实收",
      prop: "fAfttaxTotalAmount",
      sortable: false
    }
    // {
    //   label: '已退',
    //   prop: 'relationNum',
    //   sortable: false,
    // },
  ]
}

export const receiptReturnOption = {
  maxHeight: document.body.clientHeight - 360, //固定标题
  selection: false,
  border: true,
  //index: true,
  //indexLabel: '序号',
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
      label: "退款单号",
      prop: "aaa",
      sortable: false,
      solt: true
    },
    {
      label: "PO号",
      prop: "invoiceCode",
      sortable: false
    },
    {
      label: "退款日期",
      prop: "supplierName",
      sortable: false
    },
    {
      label: "收款单位",
      prop: "relationNum",
      sortable: false
    },
    {
      label: "销售组织",
      prop: "quantityOfInvoice",
      sortable: false
    },
    {
      label: "付款组织",
      prop: "usageNumber",
      sortable: false
    },
    {
      label: "实退金额",
      prop: "remainingNum",
      sortable: false
    },
    {
      label: "业务类型",
      prop: "amount",
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

export const receiptReturnDetailOption = {
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
  header: false,
  labelPosition: "right",
  dic: [],
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  column: [
    {
      label: "结算方式",
      prop: "aaa",
      sortable: false,
      solt: true
    },
    {
      label: "原收款用途",
      prop: "invoiceCode",
      sortable: false
    },
    {
      label: "原实收金额",
      prop: "supplierName",
      sortable: false
    },
    {
      label: "本次实退金额",
      prop: "relationNum",
      sortable: false
    }
  ]
}

export const costAdjustmentOption = {
  maxHeight: document.body.clientHeight - 400, //固定标题
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
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  column: [
    {
      label: "调整单号",
      prop: "fBillNo",
      sortable: false,
      solt: true
    },
    {
      label: "业务日期",
      prop: "fDate",
      sortable: false
    },
    {
      label: "库存组织",
      prop: "fCreateOrgName",
      sortable: false
    },
    {
      label: "仓库",
      prop: "fStockName",
      sortable: false
    },
    {
      label: "调整商品数",
      prop: "fQty",
      sortable: false
    },
    {
      label: "调整金额",
      prop: "fCurrPrice",
      sortable: false,
      formatter: function (row, value, label, column) {
        return row.fLocalCurrSymbol + row.fCurrPrice
      }
    },
    {
      label: "费用项目",
      prop: "fFeeItemName",
      sortable: false
    },
    {
      label: "应付单",
      prop: "fPayableBillNo",
      sortable: false,
      solt: true
    }
  ]
}

export const costAdjustmentDetailOption = {
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
  header: false,
  labelPosition: "right",
  dic: [],
  showSummary: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
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
      label: "规格型号",
      prop: "skuLength",
      sortable: false,
      formatter(row, value, label, column) {
        if (row.skuLength && row.skuWidth && row.skuHeight) {
          return row.skuLength + "*" + row.skuWidth + "*" + row.skuHeight
        } else {
          return ""
        }
      }
    },
    {
      label: "调整金额",
      prop: "costAdjustmentTotal",
      sortable: false
    },
    {
      label: "费用项目调整明细",
      prop: "costAdjustmentDetail",
      sortable: false,
      minWidth: 120,
      solt: true,
      children: [],
      copy: false
    }
  ]
}

export const purchaseSalesInventoryOption = {
  maxHeight: document.body.clientHeight - 375, //固定标题
  selection: false,
  border: true,
  index: false,
  // indexLabel: '序号',
  isMedia: true,
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  header: true,
  labelPosition: "right",
  dic: [],
  showSummary: false,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  columnBtn: true,
  column: [
    {
      label: "月份",
      prop: "month",
      sortable: false
    },
    {
      label: "库存组织",
      prop: "corporationName",
      sortable: false
    },
    {
      label: "仓库",
      prop: "warehouseName",
      sortable: false
    },
    {
      label: "审核状态",
      prop: "processStatusName",
      sortable: false
    },
    {
      label: "推送金蝶",
      prop: "pushStatusName",
      sortable: false
    },
    {
      label: "期初结余",
      prop: "beginStockCount",
      sortable: false
      // children: [
      //   // {
      //   //   label: '在途',
      //   //   prop: 'beginInTravelCount',
      //   //   sortable: false,
      //   // },
      //   {
      //     label: '在库',
      //     prop: 'beginStockCount',
      //     sortable: false,
      //   },
      //   {
      //     label: '总库存',
      //     prop: 'beginStockCountTotal',
      //     sortable: false,
      //   }
      // ]
    },
    {
      label: "入库总数",
      prop: "inCount",
      sortable: false
    },
    {
      label: "出库总数",
      prop: "outCount",
      sortable: false
    },
    {
      label: "期末结余",
      prop: "endStockCount",
      sortable: false
      // children: [
      //   // {
      //   //   label: '在途',
      //   //   prop: 'endInTravelCount',
      //   //   sortable: false,
      //   // },
      //   {
      //     label: '在库',
      //     prop: 'endStockCount',
      //     sortable: false,
      //   },
      //   {
      //     label: '总库存',
      //     prop: 'endStockCountTotal',
      //     sortable: false,
      //   },

      // ]
    },
    {
      label: "ERP期末库存",
      prop: "erpEndStockCount",
      sortable: false
      // children: [
      //   // {
      //   //   label: '在途',
      //   //   prop: 'erpInTravelCount',
      //   //   sortable: false,
      //   // },
      //   {
      //     label: '在库',
      //     prop: 'erpStockCount',
      //     sortable: false,
      //   },
      //   {
      //     label: '总库存',
      //     prop: 'erpStockCountTotal',
      //     sortable: false,
      //   },

      // ]
    },
    {
      label: "金蝶结余",
      prop: "kingdeeEndStockCount",
      sortable: false
    },
    {
      label: "差异",
      prop: "stockCountDiff",
      sortable: false,
      width: 100,
      solt: true
      // children: [
      //   // {
      //   //   label: '在途',
      //   //   prop: 'inTravelCountDiff',
      //   //   sortable: false,
      //   // },
      //   {
      //     label: '在库',
      //     prop: 'stockCountDiff',
      //     sortable: false,
      //   },
      // ]
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

export const purchaseSalesInventoryDetailOption = {
  maxHeight: document.body.clientHeight - 310, //固定标题
  selection: false,
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
  header: true,
  labelPosition: "right",
  dic: [],
  showSummary: false,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  column: [
    {
      label: "月份",
      prop: "month",
      sortable: false,
      minWidth: 90,
      fixed: "left"
    },
    {
      label: "库存组织",
      prop: "corporationName",
      sortable: false,
      fixed: "left"
    },
    {
      label: "仓库",
      prop: "warehouseName",
      minWidth: 120,
      sortable: false,
      fixed: "left"
    },
    {
      label: "商品编码",
      prop: "skuCode",
      minWidth: 170,
      sortable: false,
      fixed: "left"
    },
    {
      label: "商品名称",
      prop: "skuName",
      minWidth: 170,
      sortable: false
    },
    {
      label: "规格型号",
      prop: "skuMsg",
      minWidth: 150,
      sortable: false
    },
    // {
    //   label: '审核状态',
    //   prop: 'processStatusName',
    //   sortable: false,
    // },
    // {
    //   label: '推送金蝶',
    //   prop: 'pushStatusName',
    //   sortable: false,
    // },
    {
      label: "期初结余",
      prop: "beginStockCount",
      sortable: false
      // children: [
      //   // {
      //   //   label: '在途',
      //   //   prop: 'beginInTravelCount',
      //   //   sortable: false,
      //   // },
      //   {
      //     label: '在库',
      //     prop: 'beginStockCount',
      //     sortable: false,
      //   },
      //   {
      //     label: '总库存',
      //     prop: 'beginCountTotal',
      //     sortable: false,
      //   },

      // ]
    },
    {
      label: "入库总数",
      prop: "inCount",
      sortable: false
    },
    {
      label: "出库总数",
      prop: "outCount",
      sortable: false
    },
    {
      label: "期末结余",
      prop: "endStockCount",
      sortable: false
      // children: [
      //   // {
      //   //   label: '在途',
      //   //   prop: 'endInTravelCount',
      //   //   sortable: false,
      //   // },
      //   {
      //     label: '在库',
      //     prop: 'endStockCount',
      //     sortable: false,
      //   },
      //   {
      //     label: '总库存',
      //     prop: 'endStockCountTotal',
      //     sortable: false,
      //   },

      // ]
    },
    {
      label: "ERP期末库存",
      prop: "erpEndStockCount",
      minWidth: 120,
      sortable: false
      // children: [
      //   // {
      //   //   label: '在途',
      //   //   prop: 'erpInTravelCount',
      //   //   sortable: false,
      //   // },
      //   {
      //     label: '在库',
      //     prop: 'erpStockCount',
      //     sortable: false,
      //   },
      //   {
      //     label: '总库存',
      //     prop: 'erpStockCountTotal',
      //     sortable: false,
      //   },

      // ]
    },
    {
      label: "金蝶结余",
      prop: "kingdeeEndStockCount",
      sortable: false
    },
    {
      label: "差异",
      prop: "stockCountDiff",
      sortable: false,
      width: 100,
      solt: true
      // children: [
      //   // {
      //   //   label: '在途',
      //   //   prop: 'inTravelCountDiff',
      //   //   sortable: false,
      //   // },
      //   {
      //     label: '在库',
      //     prop: 'stockCountDiff',
      //     sortable: false,
      //   },
      // ]
    },
    {
      label: "入库类明细",
      prop: "costList",
      sortable: false,
      width: 100,
      children: [
        {
          label: "调拨入库",
          prop: "transferInCount",
          sortable: false
        },
        // {
        //   label: '调拨在途',
        //   prop: 'transferInTravelCount',
        //   sortable: false,
        // },
        {
          label: "采购入库",
          prop: "purchaseInCount",
          sortable: false
        },
        {
          label: "销售退货入库",
          prop: "saleReturnInCount",
          width: 120,
          sortable: false
        },
        {
          label: "其他入库",
          prop: "otherInCount",
          sortable: false
        }
      ]
    },
    {
      label: "出库类明细",
      prop: "costList",
      sortable: false,
      width: 100,
      children: [
        {
          label: "调拨出库",
          prop: "transferOutCount",
          sortable: false
        },
        {
          label: "销售出库",
          prop: "saleOutCount",
          sortable: false
        },
        {
          label: "采购退货出库",
          prop: "purchaseReturnCount",
          width: 120,
          sortable: false
        },
        {
          label: "其他出库",
          prop: "otherOutCount",
          sortable: false
        }
      ]
    }
  ]
}

export const purchaseSalesInventoryLogOption = {
  // height: 400,//固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [], //dialog是否可选
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
      label: "操作时间",
      prop: "createTime",
      sortable: false
    },
    {
      label: "账期",
      prop: "bizId",
      width: 110,
      sortable: false
    },
    {
      label: "操作类型",
      prop: "operateType",
      sortable: false
    },
    {
      label: "操作事项",
      prop: "changeContent",
      sortable: false
    },
    {
      label: "操作人",
      prop: "createByName",
      sortable: false
    }
  ]
}

export const purchaseInStockOption = {
  maxHeight: document.body.clientHeight - 400, //固定标题
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
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  column: [
    {
      label: "采购单号",
      prop: "fBillNo",
      sortable: false,
      solt: true
    },
    {
      label: "入库日期",
      prop: "fDate",
      sortable: false
    },
    {
      label: "供应商",
      prop: "supplierName",
      sortable: false
    },
    {
      label: "采购组织",
      prop: "purchaseOrgName",
      sortable: false
    },
    {
      label: "实收数量",
      prop: "fQty",
      sortable: false
    },
    {
      label: "应收金额",
      prop: "fPrice",
      sortable: false
    },
    {
      label: "仓库",
      prop: "fStockName",
      sortable: false
    }
  ]
}

export const purchaseInStockDetailOption = {
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
  header: false,
  labelPosition: "right",
  dic: [],
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
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
      prop: "skuMsg",
      sortable: false
    },
    {
      label: "含税单价",
      prop: "fTaxPrice",
      sortable: false,
      solt: true
    },
    {
      label: "应收数量",
      prop: "fRealQty",
      sortable: false
    },
    {
      label: "实收数量",
      prop: "fRealQty",
      sortable: false
    },
    {
      label: "合计金额",
      prop: "fTaxAmount",
      sortable: false
    }
  ]
}

export const purchaseReturnOption = {
  maxHeight: document.body.clientHeight - 360, //固定标题
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
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  column: [
    {
      label: "退货单号",
      prop: "fBillNo",
      sortable: false,
      solt: true
    },
    {
      label: "退货日期",
      prop: "fDate",
      sortable: false
    },
    {
      label: "供应商",
      prop: "fSupplierName",
      sortable: false
    },
    {
      label: "退货组织",
      prop: "fStockOrgName",
      sortable: false
    },
    {
      label: "实退数量",
      prop: "fQty",
      sortable: false
    },
    {
      label: "应退金额",
      prop: "fPrice",
      sortable: false
    },
    {
      label: "仓库",
      prop: "fStockName",
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
  header: false,
  labelPosition: "right",
  dic: [],
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
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
      prop: "skuMsg",
      sortable: false
    },
    {
      label: "单价",
      prop: "fTaxPrice",
      sortable: false,
      solt: true
    },
    {
      label: "实退数量",
      prop: "fRmRealQty",
      sortable: false
    },
    {
      label: "合计金额",
      prop: "fTaxAmount",
      sortable: false,
      solt: true
    }
  ]
}

export const salesOutStockOption = {
  maxHeight: document.body.clientHeight - 360, //固定标题
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
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  column: [
    {
      label: "出库单号",
      prop: "fBillNo",
      sortable: false,
      solt: true
    },
    {
      label: "PO号",
      prop: "fOraPO",
      sortable: false
    },
    {
      label: "出库日期",
      prop: "fDate",
      sortable: false
    },
    {
      label: "客户",
      prop: "fCustomerName",
      sortable: false
    },
    {
      label: "销售组织",
      prop: "fSaleOrgName",
      sortable: false
    },
    {
      label: "实发数量",
      prop: "fQty",
      sortable: false
    },
    {
      label: "应收金额",
      prop: "fPrice",
      sortable: false
    }
  ]
}

export const salesOutStockDetailOption = {
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
  header: false,
  labelPosition: "right",
  dic: [],
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
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
      prop: "skuMsg",
      sortable: false
    },
    {
      label: "含税单价",
      prop: "fTaxPrice",
      sortable: false,
      solt: true
    },
    {
      label: "实发数量",
      prop: "fRealQty",
      sortable: false
    },
    {
      label: "税率",
      prop: "fEntryTaxRate",
      solt: true,
      sortable: false
    },
    {
      label: "税额",
      prop: "fEntryTaxAmount",
      sortable: false
    },
    {
      label: "价税合计",
      prop: "fTaxAmount",
      sortable: false,
      solt: true
    },
    {
      label: "发货仓库",
      prop: "fStockName",
      sortable: false
    }
  ]
}

export const salesReturnOption = {
  maxHeight: document.body.clientHeight - 360, //固定标题
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
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  column: [
    {
      label: "退货单号",
      prop: "fBillNo",
      sortable: false,
      solt: true
    },
    {
      label: "PO号",
      prop: "fOraPo",
      sortable: false
    },
    {
      label: "退货日期",
      prop: "fDate",
      sortable: false
    },
    {
      label: "客户",
      prop: "fRetcustName",
      sortable: false
    },
    {
      label: "销售组织",
      prop: "fSaleOrgName",
      sortable: false
    },
    {
      label: "实退数量",
      prop: "fQty",
      sortable: false
    },
    {
      label: "应退金额",
      prop: "fPrice",
      sortable: false
    },
    {
      label: "销售出库单号",
      prop: "outStockId",
      sortable: false
    }
  ]
}

export const salesReturnDetailOption = {
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
  header: false,
  labelPosition: "right",
  dic: [],
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  column: [
    {
      label: "商品编码",
      prop: "skuCode",
      sortable: false,
      solt: true
    },
    {
      label: "商品名称",
      prop: "skuName",
      sortable: false
    },
    {
      label: "商品规格",
      prop: "skuMsg",
      sortable: false
    },
    {
      label: "含税单价",
      prop: "fTaxPrice",
      sortable: false
    },
    {
      label: "实退数量",
      prop: "fRealQty",
      sortable: false
    },
    {
      label: "合计金额",
      prop: "fTaxAmount",
      sortable: false
    },
    {
      label: "退回仓库",
      prop: "fStockName",
      sortable: false
    }
  ]
}

export const otherInStockOption = {
  maxHeight: document.body.clientHeight - 360, //固定标题
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
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  column: [
    {
      label: "入库单号",
      prop: "fBillNo",
      sortable: false,
      solt: true
    },
    {
      label: "入库日期",
      prop: "fDate",
      sortable: false
    },
    {
      label: "仓库",
      prop: "fStockName",
      sortable: false
    },
    {
      label: "库存组织",
      prop: "fStockOrgName",
      sortable: false
    },
    {
      label: "实收数量",
      prop: "fQty",
      sortable: false
    }
  ]
}

export const otherInStockDetailOption = {
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
  header: false,
  labelPosition: "right",
  dic: [],
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
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
      prop: "skuMsg",
      sortable: false
    },
    {
      label: "实收数量",
      prop: "fRealQty",
      sortable: false
    }
  ]
}

export const otherOutStockOption = {
  maxHeight: document.body.clientHeight - 360, //固定标题
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
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  column: [
    {
      label: "出库单号",
      prop: "fBillNo",
      sortable: false,
      solt: true
    },
    {
      label: "出库日期",
      prop: "fDate",
      sortable: false
    },
    {
      label: "仓库",
      prop: "fStockName",
      sortable: false
    },
    {
      label: "库存组织",
      prop: "fStockOrgName",
      sortable: false
    },
    {
      label: "实发数量",
      prop: "fQty",
      sortable: false
    }
  ]
}

export const otherOutStockDetailOption = {
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
  header: false,
  labelPosition: "right",
  dic: [],
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
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
      prop: "skuMsg",
      sortable: false
    },
    {
      label: "实发数量",
      prop: "fRealQty",
      sortable: false
    }
  ]
}

export const logOption = {
  // height: 400,//固定标题
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [], //dialog是否可选
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
      label: "操作时间",
      prop: "createTime",
      sortable: false
    },
    {
      label: "操作人",
      prop: "createByName",
      sortable: false
    },
    {
      label: "操作类型",
      prop: "operateType",
      sortable: false
    },
    {
      label: "操作事项",
      prop: "changeContent",
      sortable: false
    }
  ]
}

export const firstlegcostOption = {
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
      label: "费用类型名称",
      prop: "tmsLogisticsCostTypeName",
      sortable: false
    },
    {
      label: "是否分摊",
      prop: "tmsLogisticsCostTypeIsShare",
      solt: true,
      sortable: false
    },
    {
      label: "分摊规则",
      prop: "shareRuleName",
      sortable: false
    },
    {
      label: "状态",
      prop: "statusName",
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
    },
    {
      label: "操作",
      prop: "brandSolt",
      solt: true,
      sortable: false,
      copy: false
    }
  ]
}
