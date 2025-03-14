"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true
})
exports.tableOption = void 0

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
var tableOption = {
  menu: false,
  selection: true,
  border: true,
  searchShow: true,
  //搜索栏开关
  searchAdvanced: false,
  //高级搜索栏开关，默认关闭
  //index: true,
  //indexLabel: '序号',
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "结算方式名称",
      prop: "settleaccountName",
      
    },
    {
      label: "预付（%）",
      prop: "prepay",
      
    },
    {
      label: "尾款（%）",
      prop: "willPay",
      
    },
    {
      label: "账期天数（d）",
      prop: "accountDays",
      
    },
    {
      label: "状态",
      solt: true,
      prop: "status" // formatter(row, value , label, column){
      //   if(value==0){
      //     return '启用中'
      //   }else if(value==1){
      //     return '禁用中'
      //   }else{
      //     return ''
      //   }
      // }
    },
    {
      label: "供应商",
      prop: "supplierName",
      
    },
    {
      label: "创建人",
      prop: "createDisplayname"
    },
    {
      label: "创建时间",
      width: 220,
      prop: "createTime"
    }
  ]
}
exports.tableOption = tableOption
