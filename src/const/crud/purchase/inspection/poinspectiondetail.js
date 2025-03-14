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

/**是否是整数 */
var isPositiveNumber = (rule, value, callback) => {
  var req = /^\d{0,9}$/
  var reg = new RegExp(req)
  if (reg.test(value)) {
    if (value > 0) {
      callback()
    } else {
      callback(new Error("必须大于0"))
    }
  } else {
    callback(new Error("请输入9位自然数"))
  }
}

/**校验手机号码 */
var isvalidatemobile = (rule, value, callback) => {
  var isPhone = /^1[0-9]{10}$/
  if (isPhone.test(value)) {
    callback()
  } else {
    callback(new Error(""))
  }
}

/**校验是否为数 */
var isNumber = (rule, value, callback) => {
  var req = /^([0-9]{0,8})?(\.[0-9]{0,2})?$/
  var reg = new RegExp(req)
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error("8位整数,2位小数"))
  }
}

export const formAndTableRules = {
  planQuantity: [
    { required: true, message: "请输入计划验货数量", trigger: "blur" },
    { validator: isPositiveNumber, trigger: "blur" }
  ],
  skuCode: [{ required: true, message: "请输入sku", trigger: "blur" }],
  supplierName: [{ required: true, message: "请检索输入", trigger: "change" }],
  callphone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { validator: isvalidatemobile, message: "手机号码格式不正确", trigger: "blur" }
  ],
  inspectionAdress: [{ required: true, message: "请输入交货地址", trigger: "blur" }]
}

export const tableOption = {
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: false,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  menu: false,
  header: false,
  dic: [],
  column: [
    {
      label: "skuId",
      prop: "skuId",
      hide: true
    },
    {
      label: "SKU",
      prop: "skuCode",
      solt: true,
      width: 200,
      sortable: false
    },
    {
      label: "SKU名称",
      prop: "skuName",
      sortable: false
    },
    {
      label: "型号",
      prop: "modelName",
      sortable: false
    },
    {
      label: "计划验货数量",
      prop: "planQuantity",
      solt: true,
      width: 180,
      sortable: false
    },
    {
      label: "说明",
      prop: "remark",
      solt: true,
      width: 300,
      sortable: false
    }
  ]
}

/**表单校验 */
export const basicFormRules = {
  supplierName: [{ required: true, message: "请检索输入", trigger: "change" }],
  callphone: [
    { required: true, message: "请输入报价人电话", trigger: "blur" },
    { validator: isvalidatemobile, message: "手机号码格式不正确", trigger: "blur" }
  ],
  inspectionAdress: [{ required: true, message: "请输入交货地址", trigger: "blur" }]
}
