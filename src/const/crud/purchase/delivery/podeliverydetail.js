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
  menu: false,
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  header: false,
  column: [
    // {
    //   label: '交货计划单号',
    //   prop: 'deliveryPlanNo',
    //   solt: true,
    //   width: '220px',
    //   sortable:false,
    // },
    {
      label: "合同单号",
      prop: "poContractNo",
      hide: true,
      sortable: false
    },
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
      label: "产品名称",
      prop: "skuName",
      sortable: false
    },
    {
      label: "采购数量",
      prop: "purchaseQuantity",
      sortable: false
    },
    // {
    //   label: '平台SKU',
    //   prop: 'platformSkuCode',
    //   sortable:false,
    // },
    {
      label: "平台",
      prop: "platformCode",
      sortable: false
    },
    {
      label: "站点",
      prop: "sitCode",
      sortable: false
    },
    {
      label: "PO号",
      prop: "poCode",
      sortable: false
    },
    {
      label: "排柜号",
      prop: "cabinetCode",
      sortable: false
    },
    {
      label: "入库单号",
      prop: "inboundNo",
      minWidth: 140,
      sortable: false
    },
    {
      label: "出货柜号",
      prop: "shippingContainerNo",
      minWidth: 160,
      sortable: false
    },
    // {
    //   label: '店铺',
    //   prop: 'storeAccount',
    //   sortable:false,
    // },
    {
      label: "最大还能收货数量",
      prop: "maxQuantity",
      hide: true,
      sortable: false
    },
    {
      label: "送货数量",
      prop: "deliveryQuantity",
      solt: true,
      width: "150px",
      sortable: false
    },
    {
      label: "单箱数量",
      prop: "boxQuantity",
      sortable: false
    },
    {
      label: "箱数",
      prop: "boxCount",
      width: "150px",
      solt: true,
      sortable: false
    },
    {
      label: "不含税单价",
      prop: "noTaxPrice",
      width: "150px",
      solt: true,
      sortable: false
    },
    {
      label: "单价",
      prop: "price",
      solt: true,
      width: "150px",
      sortable: false
    },
    {
      label: "箱长(CM)",
      prop: "boxLength",
      width: "120px",
      solt: true,
      sortable: false
    },
    {
      label: "箱宽(CM)",
      prop: "boxWidth",
      width: "120px",
      solt: true,
      sortable: false
    },
    {
      label: "箱高(CM)",
      prop: "boxHeight",
      width: "120px",
      solt: true,
      sortable: false
    },
    {
      label: "单箱毛重(g)",
      prop: "boxGrossWeight",
      width: "150px",
      solt: true,
      sortable: false
    },
    {
      label: "说明",
      prop: "remarks",
      solt: true,
      width: "310px",
      sortable: false
    }
  ]
}
