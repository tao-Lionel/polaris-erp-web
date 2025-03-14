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
 * Author: wangxiaowen (AukeyIT@aukeys.com)
 */
/** SKU费用列表JS */
export const tableOption = {
  maxHeight: document.body.clientHeight - 360, //固定标题
  menu: false,
  selection: true,
  border: true,
  //index: true,
  //indexLabel: '序号',
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  labelPosition: "right",
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  column: [
    {
      label: "平台销售SKU",
      minWidth: 150,
      prop: "sellerSku"
    },
    {
      label: "工厂SKU",
      minWidth: 120,
      prop: "skuCode"
    },
    {
      label: "店铺",
      prop: "storeAccount"
    },
    {
      label: "站点",
      prop: "countryCode"
    },
    {
      label: "平台",
      prop: "platformTypeCode"
    },
    {
      label: "采购价",
      minWidth: 120,
      prop: "purchaseCosting"
    },
    {
      label: "头程成本",
      minWidth: 120,
      prop: "headCosting"
    },
    // {
    //   label: '其他成本',
    //   prop: 'otherCosting',
    // },
    {
      label: "更新时间",
      minWidth: 120,
      prop: "updateTime",
      type: "date",
      format: "yyyy-MM-dd"
    }
    // {
    //   label: '操作',
    //   prop: 'operate',
    // },
  ]
}
