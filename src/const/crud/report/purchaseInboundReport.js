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
  maxHeight: document.body.clientHeight - 320, //固定标题
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: false,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  isMedia: true,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  menu: false,
  selection: false,
  dic: [],
  column: [
    {
      label: "合同号",
      minWidth: 110,
      prop: "poContractNo"
    },
    {
      label: "采购单号",
      minWidth: 110,
      prop: "purchaseOrderNo"
    },
    {
      label: "供应商",
      minWidth: 110,
      prop: "supplierName"
    },
    {
      label: "法人主体",
      minWidth: 110,
      prop: "corporationName"
    },
    {
      label: "仓库名称",
      minWidth: 110,
      prop: "warehouseName"
    },
    {
      label: "结算方式",
      minWidth: 110,
      prop: "settleAccountName"
    },
    {
      label: "工厂SKU",
      minWidth: 110,
      prop: "skuCode"
    },
    {
      label: "产品长*宽*高(cm)",
      prop: "modelName"
    },
    {
      label: "币别",
      prop: "currency"
    },
    {
      label: "税别",
      prop: "taxType"
    },
    {
      label: "订单数量",
      minWidth: 110,
      prop: "purchaseQuantity"
    },
    {
      label: "入库数量",
      minWidth: 110,
      prop: "inboundQuantity"
    },
    {
      label: "未入库数量",
      minWidth: 110,
      prop: "unInboundQuantity"
    },
    {
      label: "入库金额",
      minWidth: 110,
      prop: "inboundAmount"
    },
    {
      label: "未入库金额",
      minWidth: 110,
      prop: "unInboundAmount"
    },
    {
      label: "采购组",
      minWidth: 110,
      prop: "purchaseGroupName"
    },
    {
      label: "采购员",
      minWidth: 110,
      prop: "purchaseUserName"
    }
  ]
}
