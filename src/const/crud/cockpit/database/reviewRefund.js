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
/** =测评返款列表JS */
export const tableOption = {
  selection: true,
  border: true,
  //index: true,
  //indexLabel: '序号',
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  labelPosition: "right",
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关
  column: [
    {
      label: "店铺",
      prop: "c1"
    },
    {
      label: "站点",
      prop: "c2"
    },
    {
      label: "返款日期",
      prop: "c3"
    },
    {
      label: "订单号",
      prop: "c4"
    },
    {
      label: "ASIN",
      prop: "c5"
    },
    {
      label: "产品名",
      prop: "c6"
    },
    {
      label: "币种",
      prop: "c7"
    },
    {
      label: "价格",
      prop: "c8"
    },
    {
      label: "账号",
      prop: "c9"
    },
    {
      label: "申请人",
      prop: "c10"
    },
    {
      label: "备注",
      prop: "c11"
    },
    {
      label: "导入日期",
      prop: "c12"
    }
  ]
}
