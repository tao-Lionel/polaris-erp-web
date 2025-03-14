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
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
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
  dic: [],
  column: [
    {
      label: "质检编号",
      prop: "wmsQualityControlNo",
      width: "130px"
    },
    {
      label: "签收编号",
      prop: "wmsSignNo",
      width: "150px"
    },
    {
      label: "质检状态",
      prop: "status",
      formatter(row, value, label, column) {
        if (value == 1) {
          return "合格"
        } else if (value == 2) {
          return "不合格"
        } else if (value == 3) {
          return "部分合格"
        } else {
          return "待检"
        }
      }
    },
    {
      label: "质检信息",
      prop: "remarks"
    },
    {
      label: "质检时间",
      prop: "createTime"
    },
    {
      label: "SKU",
      prop: "skuCode"
    },
    {
      label: "产品名称",
      prop: "skuName"
    },
    // {
    //   label: '平台SKU',
    //   prop: 'platformSkuCode',
    // },
    {
      label: "平台",
      prop: "platform"
    },
    // {
    //   label: '店铺',
    //   prop: 'storeAccount',
    // },
    {
      label: "站点",
      prop: "sitName"
    },
    {
      label: "送货数量",
      prop: "deliveryQuantity"
    },
    {
      label: "送货箱数",
      prop: "boxCount"
    },
    {
      label: "良品数量",
      prop: "qcStandardQuantity"
    },
    {
      label: "不良数量",
      prop: "qcUnstandardquantity"
    },
    {
      label: "供应商",
      prop: "supplierName"
    },
    {
      label: "法人主体",
      prop: "corporationName"
    },
    {
      label: "税别",
      prop: "taxType",
      formatter(row, value, label, column) {
        if (value == 1) {
          return "含税"
        } else if (value == 2) {
          return "非税"
        } else {
          return ""
        }
      }
    },
    {
      label: "源送货单号",
      prop: "deliveryNo"
    },
    {
      label: "采购单号",
      prop: "purchaseOrderNo"
    },
    {
      label: "合同编号",
      prop: "poContractNo"
    },
    {
      label: "采购员",
      minWidth: 90,
      prop: "purchaseUserName"
    }
  ]
}
