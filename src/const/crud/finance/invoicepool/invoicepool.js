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
  searchAdvanced: true, //高级搜索栏开关
  column: [
    {
      label: "发票号",
      minWidth: 100,
      prop: "invoiceNumber"
    },
    {
      label: "发票代码",
      minWidth: 100,
      prop: "invoiceCode"
    },
    {
      label: "供应商",
      minWidth: 100,
      prop: "supplierName"
    },
    {
      label: "关联单据",
      minWidth: 100,
      prop: "relationNum",
      solt: true
    },
    {
      label: "开票数量",
      minWidth: 100,
      prop: "quantityOfInvoice"
    },
    {
      label: "使用数",
      minWidth: 100,
      prop: "usageNumber"
    },
    {
      label: "结余数",
      minWidth: 100,
      prop: "remainingNum"
    },
    {
      label: "金额",
      prop: "amount"
    },
    {
      label: "税额",
      prop: "taxAmount"
    },
    {
      label: "价税合计",
      minWidth: 100,
      prop: "priceTaxSum"
    },
    {
      label: "状态",
      prop: "approveStatusText"
    },
    {
      label: "录入人",
      minWidth: 100,
      prop: "editUserName"
    },
    {
      label: "录入时间",
      minWidth: 100,
      prop: "updateTime"
    },
    {
      label: "审核人",
      minWidth: 100,
      prop: "approveUserName"
    },
    {
      label: "审核时间",
      minWidth: 100,
      prop: "approveTime"
    },
    {
      label: "操作日志",
      prop: "operationLog",
      solt: true,
      sortable: false,
      copy: false
    }
  ]
}

// 关联单据详情
export const relationBillTableOption = {
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
  index: true,
  indexLabel: "序号",
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
      label: "入库数量",
      prop: "inboundQuantity",
      sortable: false
    },
    {
      label: "开票数量",
      prop: "quantityOfInvoice",
      sortable: false
    },
    {
      label: "含税单价",
      prop: "taxPrice",
      sortable: false
    },
    {
      label: "增值税率",
      prop: "taxRate",
      sortable: false,
      formatter(row, column, cellValue, index) {
        if (typeof cellValue == "number") {
          return cellValue * 100 + "%"
        }
        return cellValue
      }
    },
    {
      label: "使用数量",
      prop: "usageNumber",
      sortable: false
    },
    {
      label: "关联单号",
      prop: "relationCustomBill",
      solt: true,
      sortable: false
    }
  ]
}
