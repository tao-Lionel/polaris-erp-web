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
  maxHeight: document.body.clientHeight - 420, //固定标题
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
      label: "报关单号",
      prop: "declareCustomNo"
    },
    {
      label: "海关单号",
      prop: "customsNumber",
      solt: true
    },
    {
      label: "合同协议号",
      minWidth: 120,
      prop: "contractNumber"
    },
    {
      label: "供应商",
      minWidth: 120,
      prop: "supplierName"
    },
    {
      label: "申报日期",
      minWidth: 120,
      prop: "declareDate"
    },
    {
      label: "项号",
      prop: "itemNo"
    },
    {
      label: "SKU",
      prop: "skuCode"
    },
    {
      label: "品名",
      prop: "categoryName"
    },
    {
      label: "型号",
      prop: "modelName"
    },
    {
      label: "海关单位",
      minWidth: 120,
      prop: "customsLegalUnit"
    },
    {
      label: "报关数量",
      minWidth: 120,
      prop: "declareQuantity",
      solt: true,
      copy: false
    },
    {
      label: "开票数量",
      minWidth: 120,
      prop: "quantityOfInvoice",
      solt: true,
      copy: false
    },
    {
      label: "含税单价",
      minWidth: 120,
      prop: "taxPrice"
    },
    {
      label: "金额",
      prop: "taxAmount"
    },
    {
      label: "出口日期",
      minWidth: 120,
      prop: "outDate"
    },
    {
      label: "申报币别",
      minWidth: 120,
      prop: "currency"
    },
    {
      label: "申报单价",
      minWidth: 120,
      prop: "declarePrice"
    },
    {
      label: "申报金额",
      minWidth: 120,
      prop: "declareSumAmount"
    },
    {
      label: "退税率",
      minWidth: 120,
      prop: "legalRefundRate"
    },
    {
      label: "开票状态",
      minWidth: 120,
      prop: "invoiceStatus"
    },
    {
      label: "物流商",
      minWidth: 120,
      prop: "carrierShortName"
    },
    {
      label: "国家",
      prop: "countryShortName"
    },
    {
      label: "状态",
      prop: "approveStatusText"
    },
    {
      label: "报关员",
      minWidth: 120,
      prop: "declareUser"
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

/**退税管理table */
export const tableDrawtackOption = {
  maxHeight: document.body.clientHeight - 420, //固定标题
  enableLocalStorage: false,
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
  searchAdvanced: false, //高级搜索栏开关
  column: [
    {
      label: "报关单号",
      prop: "declareCustomNo",
      solt: true
    },
    {
      label: "海关单号",
      minWidth: 120,
      prop: "customsNumber"
    },
    {
      label: "合同协议号",
      minWidth: 120,
      prop: "contractNumber"
    },
    {
      label: "法人",
      prop: "corporationName"
    },
    {
      label: "申报日期",
      minWidth: 120,
      prop: "declareDate"
    },
    {
      label: "含税金额",
      minWidth: 120,
      prop: "taxAmount"
    },
    {
      label: "增值税率",
      minWidth: 120,
      prop: "valueAddedTax"
    },
    {
      label: "退税金额",
      minWidth: 120,
      prop: "refundTaxAmount"
    },
    {
      label: "预报人",
      minWidth: 120,
      prop: "predictionUser"
    },
    {
      label: "预报时间",
      minWidth: 120,
      prop: "predictionTime"
    },
    {
      label: "状态",
      prop: "approveStatusText"
    },
    {
      label: "退税人",
      minWidth: 120,
      prop: "taxRefundUser"
    },
    {
      label: "退税时间",
      minWidth: 120,
      prop: "taxRefundTime"
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
