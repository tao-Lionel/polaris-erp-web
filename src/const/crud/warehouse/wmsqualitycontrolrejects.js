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
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  isMedia: true,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  selection: true,
  menu: false,
  dic: [],
  column: [
    {
      label: "质检单号",
      minWidth: 120,
      prop: "wmsQualityControlNo"
    },
    {
      label: "不良品数量",
      minWidth: 120,
      prop: "rejectsQuantity"
    },
    {
      label: "转良详情",
      minWidth: 120,
      prop: "turnDetail",
      solt: true
    },
    {
      label: "质检信息",
      minWidth: 120,
      prop: "remarks"
    },
    {
      label: "质检时间",
      minWidth: 120,
      prop: "createTime"
    },
    {
      label: "SKU",
      minWidth: 90,
      prop: "skuCode"
    },
    {
      label: "产品名称",
      minWidth: 120,
      prop: "skuName"
    },
    {
      label: "平台",
      prop: "platform"
    },
    // {
    //   label: '平台SKU',
    //   minWidth:120,
    //   prop: 'platformSkuCode'
    // },
    // {
    //   label: '店铺',
    //   prop: 'storeAccount'
    // },
    {
      label: "站点",
      prop: "sitName"
    },
    {
      label: "送货数量",
      minWidth: 120,
      prop: "deliveryQuantity"
    },
    {
      label: "送货箱数",
      minWidth: 120,
      prop: "boxCount"
    },
    {
      label: "处理状态",
      minWidth: 120,
      prop: "status",
      formatter: function (row, value, label, column) {
        if (row.status == 0) {
          return "未处理"
        }
        if (row.status == 1) {
          return "已处理"
        }
        if (row.status == 2) {
          return "全部转良"
        }
        return ""
      }
    },
    {
      label: "处理方案",
      minWidth: 120,
      prop: "scheme"
    },
    {
      label: "供应商",
      minWidth: 90,
      prop: "supplierName"
    },
    {
      label: "税别",
      prop: "taxType",
      formatter: function (row, value, label, column) {
        if (value == 1) {
          return "含税"
        }
        return "非税"
      }
    },
    {
      label: "源送货单号",
      minWidth: 120,
      prop: "deliveryNo"
    },
    {
      label: "采购单号",
      minWidth: 120,
      prop: "purchaseOrderNo"
    },
    {
      label: "合同编号",
      minWidth: 120,
      prop: "poContractNo"
    },
    {
      label: "采购员",
      minWidth: 90,
      prop: "purchaseUserName"
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
  dic: [],
  column: [
    {
      label: "质检单号",
      sortable: false,
      prop: "wmsQualityControlNo"
    },
    {
      label: "转良品数",
      sortable: false,
      prop: "turnQuantity"
    },
    {
      label: "入库单号",
      sortable: false,
      prop: "wmsInboundNo"
    },
    {
      label: "备注信息",
      sortable: false,
      prop: "remark"
    },
    {
      label: "操作人",
      sortable: false,
      prop: "createName"
    },
    {
      label: "操作时间",
      sortable: false,
      prop: "createTime"
    }
  ]
}
