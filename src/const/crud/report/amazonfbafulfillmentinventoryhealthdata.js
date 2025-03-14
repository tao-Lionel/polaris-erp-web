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

const formatPermission = (row, num) => {
  if (num === null) {
    return "****"
  } else {
    return num
  }
}
export const tableOption = {
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: false,
  indexLabel: "序号",
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
      label: "快照时间",
      prop: "createTime",
      type: "datetime",
      format: "yyyy-MM-dd"
    },
    {
      label: "平台SKU",
      minWidth: 120,
      prop: "fnsku"
    },
    {
      label: "SellerSku",
      minWidth: 120,
      prop: "amazonSku"
    },
    {
      label: "工厂SKU",
      minWidth: 120,
      prop: "skuCode"
    },
    {
      label: "销售组",
      minWidth: 120,
      prop: "groupName"
    },
    {
      label: "店铺",
      prop: "storeAccount"
    },

    {
      label: "大区",
      prop: "districtName",
      with: "100"
    },
    {
      label: "销售价",
      minWidth: 120,
      prop: "yourPrice",
      formatter: formatPermission
    },
    {
      label: "币别",
      prop: "currencyCode"
    },
    {
      label: "asin",
      prop: "asin"
    },
    {
      label: "产品名称",
      minWidth: 120,
      prop: "productName"
    },
    {
      label: "商品成色",
      minWidth: 120,
      prop: "conditionWare"
    },
    {
      label: "实际库存",
      minWidth: 120,
      prop: "totalQuantity"
    },
    {
      label: "可用库存",
      minWidth: 120,
      prop: "sellableQuantity"
    },
    {
      label: "占用库存",
      minWidth: 120,
      prop: "unsellableQuantity"
    },
    {
      label: "90天库龄",
      minWidth: 120,
      prop: "invAge0To90Days",
      with: "100"
    },
    {
      label: "180天库龄",
      minWidth: 120,
      prop: "invAge91To180Days",
      with: "100"
    },
    {
      label: "270天库龄",
      minWidth: 120,
      prop: "invAge181To270Days",
      with: "100"
    },
    {
      label: "365天库龄",
      minWidth: 120,
      prop: "invAge271To365Days",
      with: "100"
    },
    {
      label: "超365天库龄",
      minWidth: 150,
      prop: "invAge365PlusDays",
      with: "100"
    },
    {
      label: "24时发货量",
      minWidth: 120,
      prop: "unitsShippedLast24Hrs",
      formatter: formatPermission,
      with: "100"
    },
    {
      label: "7天发货量",
      minWidth: 120,
      prop: "unitsShippedLast7Days",
      formatter: formatPermission,
      with: "100"
    },
    {
      label: "30天发货量",
      minWidth: 120,
      prop: "unitsShippedLast30Days",
      formatter: formatPermission,
      with: "100"
    },
    {
      label: "90天发货量",
      minWidth: 120,
      prop: "unitsShippedLast90Days",
      formatter: formatPermission,
      with: "100"
    },
    {
      label: "180天发货量",
      minWidth: 140,
      prop: "unitsShippedLast180Days",
      formatter: formatPermission,
      with: "100"
    },
    {
      label: "365天发货量",
      minWidth: 140,
      prop: "unitsShippedLast365Days",
      formatter: formatPermission,
      with: "100"
    },
    {
      label: "7天周转",
      minWidth: 120,
      prop: "weeksOfCoverT7",
      formatter: formatPermission,
      with: "100"
    },
    {
      label: "30天周转",
      minWidth: 120,
      prop: "weeksOfCoverT30",
      formatter: formatPermission,
      with: "100"
    },
    {
      label: "90天周转",
      minWidth: 120,
      prop: "weeksOfCoverT90",
      formatter: formatPermission,
      with: "100"
    },
    {
      label: "180天周转",
      minWidth: 140,
      prop: "weeksOfCoverT180",
      formatter: formatPermission,
      with: "100"
    },
    {
      label: "365天周转",
      minWidth: 140,
      prop: "weeksOfCoverT365",
      formatter: formatPermission,
      with: "100"
    },
    {
      label: "在途数量",
      minWidth: 120,
      prop: "inBoundQuantity"
    }
  ]
}
