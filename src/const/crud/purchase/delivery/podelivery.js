export const tableOption = {
  maxHeight: document.body.clientHeight - 370, //固定标题
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  isMedia: true,
  index: false,
  indexLabel: "序号",
  menu: false,
  selection: true,
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "单据编号",
      prop: "deliveryNo",
      solt: true,
      sortable: false
    },
    {
      label: "单据时间",
      prop: "createTime",
      type: "datetime",
      format: "yyyy-MM-dd HH:mm",
      valueFormat: "yyyy-MM-dd HH:mm:ss"
    },
    {
      label: "出货柜号",
      prop: "shippingContainerNoList",
      solt: true,
      sortable: false
    },
    {
      label: "仓库",
      prop: "warehouseName",
      sortable: false
    },
    {
      label: "采购计划号",
      prop: "requisitionBatchNo",
      width: 150,
      sortable: false
    },
    {
      label: "采购单号",
      prop: "purchaseOrderNo",
      sortable: false
    },
    // {
    //   label: "PO号",
    //   prop: "poCode",
    //
    // },
    {
      label: "排柜号",
      prop: "cabinetCode",
      sortable: false
    },
    {
      label: "供应商",
      prop: "supplierName",
      sortable: false
    },
    {
      label: "法人主体",
      prop: "corporationName",
      sortable: false
    },
    {
      label: "送货产品",
      prop: "deliveryProduct",
      solt: true,
      copy: false,
      sortable: false
    },
    {
      label: "送货日期",
      prop: "deliveryDate",
      width: "150px",
      type: "datetime",
      format: "yyyy-MM-dd",
      valueFormat: "yyyy-MM-dd"
    },
    {
      label: "税别",
      prop: "taxType",
      sortable: false,
      formatter: function (row, value, label, column) {
        if (value == 1) {
          return "含税"
        } else if (value == 2) {
          return "非税"
        } else {
          return value
        }
      }
    },
    {
      label: "总箱数",
      minWidth: 90,
      prop: "sumBoxCount"
    },
    // {
    //   label: "合同编号",
    //   minWidth: 120,
    //   prop: "poContractNo"
    // },
    {
      label: "采购员",
      prop: "purchaseUserName"
    },
    {
      label: "单据状态",
      prop: "deliveryStatus",
      solt: "deliveryStatus",
      copy: false,
      sortable: false
      // formatter: (function (row, value, label, column) {
      //   if (value == 0) {
      //     return '未处理';
      //   } else if (value == 1) {
      //     return '已安排'
      //   } else {
      //     return value
      //   }
      // })
    },
    {
      label: "数夫出货通知单号",
      prop: "shippingNoticeNo"
    },
    {
      label: "入库状态",
      prop: "inboundStatus",
      sortable: false,
      formatter: function (row, value, label, column) {
        if (value == 1) {
          return "未入库"
        } else if (value == 2) {
          return "已入库"
        }
        // if (value == 1) {
        //   return '待签收'
        // } else if (value == 2) {
        //   return '待质检'
        // } else if (value == 3) {
        //   return '质检完成'
        // } else if (value == 4) {
        //   return '部分入库'
        // } else if (value == 5) {
        //   return '全部入库'
        // } else {
        //   return ''
        // }
      }
    },
    {
      label: "入库时间",
      prop: "inboundDate"
    },
    {
      label: "操作",
      prop: "opeSolt",
      sortable: false,
      solt: true,
      width: 200,
      fixed: "right",
      copy: false
    }
  ]
}

export const detailTableOptions = {
  border: true,
  header: false,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  isMedia: false,
  index: false,
  indexLabel: "序号",
  menu: false,
  selection: false,
  stripe: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  maxHeight: 400,
  dic: [],
  column: [
    // {
    //   label: '交货计划单号',
    //   prop: 'deliveryPlanNo',
    //   minWidth:170,
    //   sortable:false,
    // },
    {
      label: "采购单号",
      prop: "purchaseOrderNo",
      minWidth: 120,
      sortable: false
    },
    {
      label: "SKU",
      prop: "skuCode",
      minWidth: 120,
      sortable: false
    },
    {
      label: "产品名称",
      prop: "skuName",
      minWidth: 120,
      sortable: false
    },
    // {
    //   label: '平台SKU',
    //   prop: 'platformSkuCode',
    //   minWidth:120,
    //   sortable:false,
    // },
    // {
    //   label: '店铺',
    //   sortable:false,
    //   prop: 'storeAccount'
    // },
    {
      label: "平台",
      sortable: false,
      prop: "platformTypeName"
    },
    {
      label: "站点",
      sortable: false,
      prop: "sitName"
    },
    {
      label: "采购数量",
      minWidth: 120,
      sortable: false,
      prop: "purchaseQuantity"
    },
    {
      label: "送货数量",
      minWidth: 120,
      sortable: false,
      prop: "deliveryQuantity"
    },
    {
      label: "单价",
      sortable: false,
      prop: "price"
    },
    {
      label: "箱数",
      sortable: false,
      prop: "boxCount"
    },
    {
      label: "长/宽/高(cm)",
      width: 180,
      sortable: false,
      prop: "boxInfo"
    },
    {
      label: "单箱重(g)",
      width: 130,
      sortable: false,
      prop: "boxGrossWeight"
    }
  ]
}
