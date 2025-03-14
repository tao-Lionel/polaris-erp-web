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
  header: false,
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: false,
  indexLabel: "序号",
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
      label: "平台SKU_ID",
      prop: "bsePlatformSkuId",
      hide: true,
      sortable: false
    },
    {
      label: "平台SKU",
      prop: "platformSkuCode",
      solt: true,
      sortable: false
    },
    {
      label: "SKU",
      sortable: false,
      prop: "skuCode"
    },
    {
      label: "型号",
      sortable: false,
      prop: "modelName"
    },
    {
      label: "货品名称",
      sortable: false,
      prop: "skuName"
    },
    {
      label: "退货数量",
      sortable: false,
      prop: "returnQuantity",
      solt: true
    },
    {
      label: "销售状态",
      sortable: false,
      prop: "saleStatus",
      solt: true
    },
    {
      label: "物流追踪号",
      sortable: false,
      prop: "logisticsTrackNo",
      solt: true
    },
    {
      label: "操作",
      sortable: false,
      prop: "oprateHandle",
      width: 100,
      solt: true,
      copy: false
    }
  ]
}

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

/**英文，数字，特殊字符 */
var isLetterNumber = (rule, value, callback) => {
  var req = /^([a-z0-9\.\@\!\-\_\#\$\%\^\&\*\(\)]){1,30}$/i
  var reg = new RegExp(req)
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error("请输入字母，数字，特殊字符!"))
  }
}

/**表单校验 */
export const returnFormRules = {
  warehouseName: [{ required: true, message: "请检索输入", trigger: "change" }],
  transportModeName: [{ required: true, message: "请选择", trigger: "change" }],
  fbaRemoveNo: [
    { required: true, message: "请输入", trigger: "blur" },
    { validator: isLetterNumber, trigger: "blur" }
  ],

  handleModeName: [{ required: true, message: "请选择", trigger: "change" }],
  salesGroupId: [{ required: true, message: "请选择", trigger: "change" }],
  sitName: [{ required: true, message: "请选择站点", trigger: "change" }],
  storeAccount: [{ required: true, message: "请选择店铺", trigger: "change" }]
}

export const createPoinOrderRules = {
  //新建询价单验证规则

  platformSkuCode: [{ required: true, message: "请输入" }],
  returnQuantity: [
    { required: true, message: "请填写" },
    { validator: isPositiveNumber, trigger: "blur" }
  ],
  saleStatus: [{ required: true, message: "请选择", trigger: "change" }],
  logisticsTrackNo: [
    { required: true, message: "请填写" },
    { validator: isLetterNumber, trigger: "blur" }
  ]
}

export const inforTableOption = {
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: false,
  indexLabel: "序号",
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
      label: "平台SKU",
      prop: "platformSkuCode",
      sortable: false
    },
    {
      label: "SKU",
      sortable: false,
      prop: "skuCode"
    },
    {
      label: "型号",
      sortable: false,
      prop: "modelName"
    },
    {
      label: "货品名称",
      sortable: false,
      prop: "skuName"
    },
    {
      label: "计划退货数量",
      sortable: false,
      prop: "returnQuantity"
    },
    {
      label: "实际退货数量",
      sortable: false,
      prop: "arriveQuantity"
    },
    {
      label: "物流追踪号",
      sortable: false,
      prop: "logisticsTrackNo"
    },
    {
      label: "关联单号",
      sortable: false,
      prop: "relationNo"
    },
    {
      label: "实际处理方式",
      sortable: false,
      prop: "handleModeName"
    }
  ]
}
