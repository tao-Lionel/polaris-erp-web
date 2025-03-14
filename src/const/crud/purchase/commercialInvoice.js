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
      label: "商业发票单号",
      prop: "invoiceNo",
      width: "200px",
      solt: true,
      inputStyle: "width:150px",
      sortable: false
    },
    {
      label: "法人主体",
      minWidth: 120,
      prop: "corporationName",
      overHidden: true,
      sortable: false
    },
    {
      label: "供应商",
      prop: "supplierName",
      minWidth: 90,
      inputStyle: "width:150px",
      overHidden: true,
      sortable: false
    },
    {
      label: "单据日期",
      prop: "invoiceTime",
      sortable: false
    },
    {
      label: "采购单号",
      prop: "purchaseOrderNos",
      width: 120,
      solt: true,
      sortable: false
    },

    {
      label: "商业发票金额",
      minWidth: 120,
      prop: "totalAmount",
      sortable: false
    },
    {
      label: "币种",
      width: 120,
      prop: "currency",
      sortable: false
    },
    {
      label: "商业发票状态",
      prop: "invoiceStatus",
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
