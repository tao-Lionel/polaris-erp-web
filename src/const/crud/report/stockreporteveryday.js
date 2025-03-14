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
  searchAdvanced: true, //高级搜索栏开关，默认关闭
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
      type: "datetime",
      format: "yyyy-MM-dd",
      valueFormat: "yyyy-MM-dd",
      width: "150"
    },
    // {
    //   label: '平台SKU',
    //   prop: 'platformSkuCode',
    //   width:'120'
    // },
    {
      label: "平台",
      prop: "platformTypeCode"
    },
    {
      label: "站点",
      prop: "site"
    },
    {
      label: "SKU",
      prop: "skuCode",
      width: "120"
    },
    {
      label: "sku名称",
      prop: "skuName",
      width: "100"
    },
    {
      label: "仓库名称",
      prop: "warehouseName",
      width: "200"
    },
    {
      label: "销售组",
      minWidth: 100,
      prop: "groupName"
    },
    {
      label: "法人主体",
      prop: "corporationName",
      width: "200"
    },
    {
      label: "实际库存",
      prop: "actualQuantity",
      width: "120"
    },
    {
      label: "锁定库存",
      prop: "lockQuantity",
      width: "120"
    },
    {
      label: "可用库存",
      prop: "availableQuantity",
      width: "120"
    }
  ]
}
