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
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: false,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "快照时间",
      prop: "backUpDate",
      type: "date",
      format: "yyyy-MM-dd",
      valueFormat: "yyyy-MM-dd",
      width: "120"
    },
    {
      label: "SKU",
      prop: "skuCode"
    },
    {
      label: "sku名称",
      prop: "skuName"
    },
    {
      label: "销售组",
      minWidth: 110,
      prop: "groupName"
    },
    {
      label: "国内仓库存",
      minWidth: 120,
      prop: "domesticQuantity",
      solt: true
    },
    {
      label: "海外仓库存",
      minWidth: 120,
      prop: "overseasQuantity",
      solt: true
    },
    {
      label: "采购在途",
      minWidth: 110,
      prop: "purchaseOnwayQuantity",
      solt: true
    },
    {
      label: "国内在途",
      minWidth: 110,
      prop: "domesticOnwayQuantity",
      solt: true
    },
    {
      label: "海外在途",
      minWidth: 110,
      prop: "overseasOnwayQuantity",
      solt: true
    },
    {
      label: "fba库存",
      minWidth: 110,
      prop: "fbaQuantity",
      solt: true
    },
    {
      label: "30天销量",
      minWidth: 110,
      prop: "unitsShippedLast30Days",
      solt: true
    },
    {
      label: "90天销量",
      minWidth: 110,
      prop: "unitsShippedLast90Days",
      solt: true
    }
  ]
}
