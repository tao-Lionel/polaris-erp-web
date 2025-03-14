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
  index: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  // menu: true,
  menu: false,
  header: true,
  cancelFixedTop: true,
  searchShow: true, //搜索栏开关
  dic: [],
  height: 430,
  columnBtn: false,
  fixHeight: 400,
  column: [
    {
      label: "出入库类型",
      sortable: false,
      prop: "recordTypeName"
    },
    {
      label: "关联单号",
      sortable: false,
      prop: "relationNo"
    },
    {
      label: "操作数量",
      sortable: false,
      prop: "quantity"
    },
    {
      label: "操作人",
      sortable: false,
      prop: "createByName"
    },
    {
      label: "创建时间",
      sortable: false,
      prop: "createTime"
    }
  ]
}

export const stockRecordOption = {
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
      label: "SKU",
      prop: "skuCode"
    },
    {
      label: "平台SKU",
      prop: "platformSkuCode"
    },
    {
      label: "仓库",
      prop: "warehouseName"
    },
    {
      label: "法人主体",
      prop: "corporationName"
    },
    {
      label: "销售组",
      prop: "groupName"
    },
    {
      label: "关联单号",
      prop: "relationNo"
    },
    {
      label: "出入库类型",
      prop: "recordTypeName"
    },
    {
      label: "操作数量",
      prop: "quantity"
    },
    {
      label: "税别",
      prop: "taxTypeDescribe"
    },
    {
      label: "单价",
      prop: "poPrice"
    },
    {
      label: "本位币",
      prop: "defaultPrice"
    },
    {
      label: "币别",
      prop: "currency"
    },
    {
      label: "库位",
      prop: "locationCode"
    },
    {
      label: "创建人",
      prop: "createByName"
    },
    {
      label: "创建时间",
      prop: "createTime"
    }
  ]
}
