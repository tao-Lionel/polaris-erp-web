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
  maxHeight: document.body.clientHeight - 360, //固定标题
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
      label: "报关单号",
      minWidth: 100,
      prop: "declareCustomNo"
    },
    {
      label: "海关单号",
      minWidth: 100,
      prop: "customsNumber"
    },
    {
      label: "申报日期",
      minWidth: 100,
      prop: "declareDate"
    },
    {
      label: "出口日期",
      minWidth: 100,
      prop: "outDate"
    },
    {
      label: "申报币别",
      minWidth: 100,
      prop: "currency"
    },
    {
      label: "申报金额",
      minWidth: 100,
      prop: "declareSumAmount"
    },
    {
      label: "发货单号",
      minWidth: 100,
      prop: "transferNo"
    },
    {
      label: "合同状态",
      minWidth: 100,
      prop: "contractState",
      solt: true,
      copy: false
    },
    {
      label: "开票状态",
      minWidth: 100,
      prop: "invoiceStatus",
      solt: true,
      copy: false
    },
    {
      label: "物流单据",
      minWidth: 100,
      prop: "fileAttach",
      solt: true
    },
    {
      label: "报关员",
      minWidth: 100,
      prop: "declareUser"
    }
  ]
}
