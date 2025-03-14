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
  maxHeight: document.body.clientHeight - 370, //固定标题
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  // index: true,
  // indexLabel: '序号',
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
      label: "单据编号",
      prop: "poPaymentNo",
      solt: true
    },
    {
      label: "请款单号",
      prop: "requestAccountNo"
    },
    {
      label: "单据时间",
      prop: "createTime"
    },
    {
      label: "期望付款时间",
      prop: "expectePaymentTime",
      type: "date",
      format: "yyyy-MM-dd",
      valueFormat: "yyyy-MM-dd"
    },
    {
      label: "供应商",
      prop: "supplierName"
    },
    {
      label: "法人主体",
      prop: "corporationName"
    },
    {
      label: "对方收款账号",
      prop: "accountNo"
    },
    {
      label: "开户名称",
      prop: "accountName"
    },
    {
      label: "开户行",
      prop: "openingBank"
    },
    {
      label: "付款金额",
      prop: "requestAccount"
    },
    {
      label: "币别",
      prop: "currency"
    },
    {
      label: "付款账号",
      prop: "paymentAccount"
    },
    {
      label: "请款人",
      prop: "requestName"
    },
    {
      label: "请款单位",
      prop: "groupName"
    },
    {
      label: "付款人",
      prop: "createName"
    },
    {
      label: "实付金额",
      prop: "actualAmount"
    },
    {
      label: "实付币别",
      prop: "actualCurrency"
    },
    {
      label: "水单文件",
      prop: "paymentAttach",
      solt: true
    },
    {
      label: "支付状态",
      prop: "status",
      solt: true
    }
  ]
}
