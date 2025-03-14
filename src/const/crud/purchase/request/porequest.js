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
      prop: "requestAccountNo",
      solt: true
    },
    {
      label: "单据时间",
      prop: "createTime"
    },
    {
      label: "付款单编号",
      prop: "poPaymentNo"
    },
    {
      label: "采购单号",
      prop: "purchaseOrderNo",
      solt: true,
      copy: false,
      width: 135
    },
    // {
    //   label: '合同编号',
    //   prop: 'poContractNo',
    //
    // },
    {
      label: "供应商",
      prop: "supplierName"
    },
    {
      label: "法人主体",
      prop: "corporationName"
    },
    {
      label: "期望付款时间",
      prop: "expectePaymentTime"
    },
    {
      label: "币种",
      prop: "currency"
    },
    {
      label: "SKU请款总额",
      prop: "requestAccount"
    },
    // {
    //   label: '优惠金额', minWidth: 120,
    //   prop: 'discountAmount'
    // },
    // {
    //   label: '应收账款使用金额',
    //   prop: 'receiveAccountUsed',
    // },
    {
      label: "实请金额",
      prop: "actualRequestAccount"
    },
    {
      label: "源单结算方式",
      prop: "settleaccountName"
    },
    {
      label: "对方收款账号",
      prop: "accountNo"
    },
    {
      label: "请款人",
      prop: "createName"
    },
    {
      label: "请款单位",
      prop: "purchaseGroupName"
    },
    {
      label: "请款状态",
      prop: "status",
      solt: true,
      copy: false
    },
    {
      label: "支付状态",
      prop: "payStatus",
      solt: true
    },
    // {
    //   label: '入库时间', minWidth: 120,
    //   prop: 'inboundDate',
    // },
    {
      label: "单据类型",
      prop: "requestAccountType",
      solt: true
    },
    {
      label: "备注",
      prop: "remark"
    },
    {
      label: "采购单总额",
      prop: "poAmount"
    }
    // {
    //   label: '预付金额', minWidth: 120,
    //   prop: 'inboundDate',
    // },
    // {
    //   label: '尾款', minWidth: 120,
    //   prop: 'inboundDate',
    // },
  ]
}
