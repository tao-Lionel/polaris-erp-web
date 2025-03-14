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
  searchShow: false,
  header: false,
  menu: false,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  //index: true,
  //indexLabel: '序号',
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "SKU",
      prop: "skuCode",
      solt: "skuCode",
      sortable: false
    },
    {
      label: "产品名称",
      prop: "skuName",
      sortable: false
    },
    {
      label: "平台",
      prop: "platform",
      sortable: false
    },
    {
      label: "站点",
      prop: "site",
      sortable: false
    },

    {
      label: "入库价",
      prop: "poPrice",
      sortable: false
    },
    {
      label: "库存",
      prop: "availableQuantity",
      sortable: false
    },
    // {
    //   label: '型号',
    //   prop: 'modelName',
    //   sortable:false,
    // },
    // {
    //   label: '平台SKU',
    //   prop: 'platformSku',
    //   solt: 'platformSku',
    //   sortable:false,
    // },
    {
      label: "退货数量",
      prop: "returnCount",
      sortable: false,
      solt: true,
      width: 150
    },
    {
      label: "退货货值",
      prop: "returnValue",
      sortable: false
    },
    // {
    //   label: '退款金额',
    //   prop: 'refundMoney',
    //   sortable:false,
    //   solt: true,
    // },
    {
      label: "说明",
      prop: "remark",
      solt: "remark",
      sortable: false,
      width: 150
    },
    {
      label: "操作",
      width: 80,
      prop: "operator",
      solt: "operator",
      sortable: false,
      copy: false
    }
  ]
}

export const stockOption = {
  enableLocalStorage: false,
  searchShow: false,
  header: false,
  menu: false,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  //index: true,
  //indexLabel: '序号',
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "stockBatchId",
      prop: "stockBatchId",
      hide: true
    },
    {
      label: "平台SKU",
      prop: "platformSkuCode",
      sortable: false
    },
    {
      label: "平台",
      sortable: false,
      prop: "platformTypeCode"
    },
    {
      label: "采购单号",
      sortable: false,
      prop: "purchaseOrderNo"
    },
    {
      label: "税别",
      sortable: false,
      prop: "taxType",
      formatter(row, value, label, column) {
        if (value == "1") {
          return "含税"
        } else if (value == "2") {
          return "非税"
        } else {
          return ""
        }
      }
    },
    {
      label: "入库单号",
      sortable: false,
      prop: "wmsInboundNo"
    },
    {
      label: "币别",
      sortable: false,
      prop: "currency"
    },
    {
      label: "入库价",
      sortable: false,
      prop: "poPrice"
    },
    {
      label: "当前可用库存",
      sortable: false,
      prop: "availableQuantity"
    },
    {
      label: "退货数量",
      sortable: false,
      prop: "returnCount",
      solt: true,
      width: 120
    },
    {
      label: "退款金额",
      sortable: false,
      prop: "refundMoney",
      solt: "refundMoney",
      width: 120
    }
  ]
}

export let purchaseDetailTableOption = {
  menu: false,
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  // index: true,
  // indexLabel: '序号',
  isMedia: true,
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "SKU",
      prop: "skuCode",
      width: 100,
      sortable: false
    },
    {
      label: "产品名称",
      prop: "skuName",
      sortable: false
    },
    // {
    //   label: '退货数量',
    //   prop: 'returnCount',
    //   sortable:false,
    //   solt: true,
    // },
    {
      label: "可退货库存",
      prop: "availableQuantity",
      width: 100,
      sortable: false
    },
    {
      label: "单价",
      prop: "price",
      width: 80,
      sortable: false
    },
    // {
    //   label: '金额',
    //   prop: 'refundMoney',
    //   width: 180,
    //   sortable: false,
    // },
    {
      label: "采购员",
      prop: "createName",
      width: 100,
      sortable: false
    },
    {
      label: "平台",
      prop: "platform",
      width: 130,
      sortable: false
    },
    {
      label: "站点",
      prop: "site",
      width: 80,
      sortable: false
    }
  ]
}
