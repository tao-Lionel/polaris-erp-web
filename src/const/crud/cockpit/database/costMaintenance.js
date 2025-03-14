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
  maxHeight: document.body.clientHeight - 360, //固定标题
  menu: false,
  selection: true,
  border: true,
  // index: true,
  // indexLabel: '序号',
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关
  column: [
    {
      label: "平台",
      prop: "platformTypeCode"
    },
    {
      label: "站点",
      prop: "countryCode"
    },
    {
      label: "店铺名称",
      minWidth: 120,
      prop: "storeAccount"
    },
    {
      label: "费用类型",
      minWidth: 120,
      prop: "rootItemName"
    },
    {
      label: "费用名称",
      minWidth: 120,
      prop: "childItemName"
    },
    {
      label: "月份",
      prop: "yearMonthDate"
    },
    {
      label: "币种",
      prop: "currency"
    },
    {
      label: "金额",
      prop: "amount"
    },
    {
      label: "备注",
      prop: "remark"
    },
    {
      label: "导入日期",
      minWidth: 120,
      prop: "importDate"
    },
    {
      label: "操作人",
      minWidth: 90,
      prop: "createUserName"
    }
    // {
    //   label:'操作',
    //   prop: 'operationLog',
    //   solt: true,
    // },
  ]
}
