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

/**校验是否为数 */
var isRate = (rule, value, callback) => {
  var req = /^([0-9]{0,2})?(\.[0-9]{0,6})?$/
  var reg = new RegExp(req)
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error("2位整数,6位小数"))
  }
}
/***币别验证 */
var validCurrency = (rule, value, callback) => {
  var req = /^([A-Z]{0,5})?$/
  var reg = new RegExp(req)
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error("5位[A-Z]币别"))
  }
}

export const tableOption = {
  maxHeight: document.body.clientHeight - 380, //固定标题
  selection: true,
  border: true,
  //index: true,
  //indexLabel: '序号',
  stripe: true,
  menu: false,
  menuType: "menu",
  // menuBtnTitle: '自定义按钮',
  menuAlign: "center",
  align: "center",
  viewBtn: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  labelPosition: "right",
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  menuWidth: 100,
  column: [
    {
      label: "币种代码",
      prop: "currency",
      sortable: false
    },
    {
      label: "币种名称",
      prop: "currencyName",
      sortable: false
    },
    {
      label: "币种符号",
      prop: "currencySymbol",
      sortable: false
    },
    {
      label: "汇率",
      prop: "exchangeRate",
      solt: true,
      sortable: false,
      copy: false
    },
    {
      label: "平均汇率",
      prop: "averageExchangeRate",
      sortable: false
    },
    // {
    //   label: '本位币',
    //   prop: 'isDefaultCurrency',
    //   minWidth: 100,
    // },
    // {
    //   label: '状态',
    //   prop: 'approveStatusText',
    //   sortable: false,
    // },
    {
      label: "启用/禁用",
      prop: "delFlagText",
      minWidth: 120,
      sortable: false
    },
    {
      label: "维护人",
      prop: "editUserName",
      minWidth: 100,
      sortable: false
    },
    {
      label: "维护时间",
      prop: "updateTime",
      minWidth: 120,
      sortable: false
    },
    {
      label: "操作日志",
      prop: "operationLog",
      solt: true,
      sortable: false,
      copy: false
    }
  ]
}

export const exchangeOption = {
  selection: false,
  border: true,
  maxHeight: 400,
  //index: true,
  //indexLabel: '序号',
  stripe: true,
  menu: false,
  menuType: "menu",
  // menuBtnTitle: '自定义按钮',
  menuAlign: "center",
  align: "center",
  viewBtn: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  header: false,
  labelPosition: "right",
  dic: [],
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  column: [
    {
      label: "当前币种",
      prop: "currencySource",
      sortable: false
    },
    {
      label: "目标币种",
      prop: "currencyTarget",
      sortable: false
    },
    {
      label: "目标汇率",
      prop: "exchangeRate",
      sortable: false
    },
    {
      label: "有效时间",
      prop: "formatterEndDate",
      solt: true,
      width: 200,
      sortable: false
    }
  ]
}

/**新增修改验证规则 */
export const addOrUpdateRules = {
  currency: [
    { required: true, message: "币别不能为空", trigger: "blur" },
    { validator: validCurrency, message: "", trigger: "blur" }
  ],
  currencyName: [{ required: true, message: "币别名称不能为空", trigger: "blur" }],
  currencySymbol: [{ required: true, message: "币别符号不能为空", trigger: "blur" }],
  exchangeRate: [
    { required: true, message: "汇率不能为空", trigger: "blur" },
    { validator: isRate, message: "", trigger: "blur" }
  ],
  averageExchangeRate: [
    { required: true, message: "平均汇率不能为空", trigger: "blur" },
    { validator: isRate, message: "", trigger: "blur" }
  ]
}
