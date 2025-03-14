/*
 *    Copyright (c) 2018-2025, Aukey All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the trob4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: wangbin (AukeyIT@aukeys.com)
 */

export const tableOption = {
  maxHeight: document.body.clientHeight - 360, //固定标题
  selection: true,
  border: true,
  //index: true,
  //indexLabel: '序号',
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
  searchAdvanced: true, //高级搜索栏开关
  column: [
    {
      label: "采购单号",
      minWidth: 120,
      prop: "purchaseOrderNo"
    },
    {
      label: "单据日期",
      minWidth: 120,
      prop: "billCreateTime"
    },
    {
      label: "合同编号",
      minWidth: 120,
      prop: "poContractNo"
    },
    {
      label: "供应商",
      minWidth: 120,
      prop: "supplierName"
    },
    {
      label: "SKU",
      minWidth: 120,
      prop: "skuCode"
    },
    {
      label: "品名",
      prop: "categoryName"
    },
    {
      label: "单位",
      prop: "unitName"
    },
    {
      label: "含税单价",
      minWidth: 120,
      prop: "taxPrice",
      formatter: function (row, column, cellValue, index) {
        if (typeof cellValue === "number") {
          return cellValue.toFixed(2)
        }
        return cellValue
      }
    },
    {
      label: "订单数量",
      minWidth: 120,
      prop: "purchaseQuantity"
    },
    {
      label: "入库数量",
      minWidth: 120,
      prop: "inboundQuantity"
    },
    {
      label: "开票数量",
      minWidth: 120,
      prop: "quantityOfInvoice",
      solt: true,
      copy: false
    },
    {
      label: "报关数量",
      minWidth: 120,
      prop: "outQuantity",
      solt: true,
      copy: false
    },
    {
      label: "开票状态",
      minWidth: 120,
      prop: "invoiceStatus"
    },
    {
      label: "采购组",
      minWidth: 120,
      prop: "purchaseGroupName"
    },
    {
      label: "操作日志",
      minWidth: 120,
      prop: "operationLog",
      solt: true,
      sortable: false,
      copy: false
    }
  ]
}

/**验证开票数量 */
var validNumeric = (rule, value, callback) => {
  var req = /^\d{0,7}$/g
  var reg = new RegExp(req)
  if (reg.test(value)) {
    if (value > 0) {
      callback()
    } else {
      callback(new Error("只能输入大于0的正整数"))
    }
  } else {
    callback(new Error("只能输入大于0的正整数"))
  }
}
/**验证发票号  发票代码 */
var validInvoice = (rule, value, callback) => {
  if (!value) {
    callback()
    return
  }
  var req = /^\d{0,20}$/
  var reg = new RegExp(req)
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error("只能输入正整数"))
  }
}

export const entryInvoiceFormRules = {
  invoiceNumber: [
    { required: true, message: "请输入发票号", trigger: "blur" },
    { validator: validInvoice, trigger: "blur" }
  ],
  invoiceCode: [
    { required: false, message: "请输入发票代码", trigger: "blur" },
    { validator: validInvoice, trigger: "blur" }
  ],
  // invoiceNumber:[],
  // invoiceCode:[],
  quantityOfInvoice: [
    { required: true, message: "请输入开票数量", trigger: "blur" },
    { validator: validNumeric, trigger: "blur" }
  ]
}

/**录入发票table */
export const invoiceTableOption = {
  enableLocalStorage: false,
  menu: false,
  header: false,
  selection: false,
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
  height: 361,
  column: [
    {
      label: "采购单号",
      prop: "purchaseOrderNo",
      sortable: false
    },
    {
      label: "SKU",
      prop: "skuCode",
      sortable: false
    },
    {
      label: "品名",
      prop: "categoryName",
      sortable: false
    },
    {
      label: "单位",
      prop: "unitName",
      sortable: false
    },
    {
      label: "开票数量",
      prop: "quantityOfInvoice",
      sortable: false,
      solt: true
    },
    {
      label: "已开票数量",
      prop: "oldQuantityOfInvoice",
      sortable: false
    },
    {
      label: "报关数量",
      prop: "outQuantity",
      sortable: false
    },
    {
      label: "含税单价",
      prop: "taxPrice",
      sortable: false
    },
    {
      label: "价税合计",
      prop: "taxPriceSum",
      sortable: false
    }
  ]
}

/**发票详情table */
export const invoiceDetailTableOption = {
  enableLocalStorage: false,
  menu: false,
  header: false,
  selection: false,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  height: 361,
  column: [
    {
      label: "采购单号",
      prop: "purchaseOrderNo",
      sortable: false
    },
    {
      label: "发票号",
      prop: "invoiceNumber",
      sortable: false
    },
    {
      label: "SKU",
      prop: "skuCode",
      sortable: false
    },
    {
      label: "品名",
      prop: "categoryName",
      sortable: false
    },
    {
      label: "单位",
      prop: "unitName",
      sortable: false
    },
    {
      label: "含税单价",
      prop: "taxPrice",
      sortable: false,
      formatter: function (row, column, cellValue, index) {
        if (typeof cellValue === "number") {
          return cellValue.toFixed(2)
        }
        return cellValue
      }
    },
    {
      label: "开票数量",
      prop: "quantityOfInvoice",
      sortable: false
    },
    {
      label: "状态",
      prop: "approveStatus",
      sortable: false,
      formatter: function (row, column, cellValue, index) {
        if (2 == cellValue) {
          return "已审核"
        } else {
          return "待审核"
        }
      }
    },
    {
      label: "操作",
      prop: "oprateDetail",
      sortable: false,
      solt: true,
      copy: false
    }
  ]
}
