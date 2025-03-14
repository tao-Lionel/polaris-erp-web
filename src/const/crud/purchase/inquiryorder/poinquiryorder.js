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

/**校验手机号码 */
var isvalidatemobile = (rule, value, callback) => {
  var isPhone = /^1[0-9]{10}$/
  if (isPhone.test(value)) {
    callback()
  } else {
    callback(new Error(""))
  }
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

/**校验税率 */
var isTaxRate = (rule, value, callback) => {
  // var req = /^([0-9]{0,2})?(\.[0-9]{0,2})?$/;
  // var reg = new RegExp(req);
  // if(reg.test(value)){
  //     callback();
  // }else{
  //     callback(new Error('2位整数,2位小数'));
  // }
  if (!value) {
    callback()
  }
  var reg = /^[0-9]+$/
  if (reg.test(value)) {
    if (0 <= value && value <= 16) {
      callback()
    } else {
      callback(new Error("0~16的整数"))
    }
  } else {
    callback(new Error("0~16的整数"))
  }
}

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
  cancelFixedTop: true,
  column: [
    {
      label: "单据编号",
      prop: "inquiryOrderNo",
      solt: true,
      sortable: false
    },
    {
      label: "单据时间",
      prop: "createTime"
    },
    {
      label: "供应商名称",
      prop: "supplierName",
      sortable: false
    },
    {
      label: "询价人",
      prop: "displayname",
      sortable: false
    },
    {
      label: "报价人",
      prop: "bidder",
      sortable: false
    },
    {
      label: "报价人电话",
      prop: "bidderPhone",
      sortable: false
    },
    {
      label: "询价凭证",
      prop: "inquiryEvidence",
      solt: true,
      sortable: false
    },
    {
      label: "价格模式",
      prop: "priceModel",
      sortable: false
    },
    {
      label: "询价状态",
      prop: "approveStatus",
      solt: true,
      copy: false,
      sortable: false
    },
    {
      label: "操作",
      fixed: "right",
      solt: true,
      prop: "operation",
      sortable: false,
      width: 100,
      copy: false
    }
  ]
}

export const createPoinOrderRules = {
  //新建询价单验证规则

  skuCode: [{ required: true, message: "请选择sku" }],
  inquiryQuantity: [
    { required: true, message: "询价数量不能为空", trigger: "blur" },
    { validator: isPositiveNumber, trigger: "blur" }
  ],

  // currency: [{ required: true, message: "请选择币别", trigger: "blur" }],
  moq: [{ required: true, message: "请输入moq", trigger: "blur" }],

  taxType: [{ required: true, message: "请选择交易税别", trigger: "blur" }], //交易税别
  taxPrice: [
    { required: true, message: "含税单价不能为空", trigger: "blur" },
    { validator: isNumber, trigger: "blur" }
  ], //含税单价
  taxRate: [{ validator: isTaxRate, trigger: "blur" }], //交易税率

  noneTaxPrice: [
    { required: true, message: "非税单价不能为空", trigger: "blur" },
    { validator: isNumber, trigger: "blur" }
  ], //非税单价

  period: [
    { required: true, message: "请输入采购周期", trigger: "blur" },
    { validator: isPositiveNumber, trigger: "blur" }
  ] //采购周期（d）
}

export function numberToString(val) {
  // if(val===0)return '0';
  if (!val) return ""
  if (typeof val === "string") {
    return val
  } else {
    return val.toString()
  }
}

/**详情页table */
export const handleTableOption = {
  menu: false,
  header: false,
  selection: false,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  // index: true,
  // indexLabel: '序号',
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  maxHeight: 500,
  cancelFixedTop: true,
  dic: [],
  column: [
    {
      label: "明细主键",
      prop: "inquiryOrderDetailId",
      hidden: true,
      sortable: false
    },
    {
      label: "序号",
      prop: "id",
      solt: true,
      width: 50,
      sortable: false
    },
    {
      label: "SKU",
      prop: "skuCode",
      solt: true,
      width: 200,
      sortable: false,
      required: true
    },
    {
      label: "产品名称",
      prop: "skuName",
      sortable: false
    },
    // {
    //   label:'型号',
    //   prop: 'modelName',
    //   sortable:false,
    // },
    {
      label: "产品长宽高(cm)",
      prop: "modelName",
      sortable: false,
      width: 140,
      formatter(row, value, label, column) {
        if (row.skuLength && row.skuWidth && row.skuHeight) {
          return row.skuLength + "*" + row.skuWidth + "*" + row.skuHeight
        } else {
          return row.modelName
        }
      }
    },
    // {
    //   label: '单位',
    //   prop: 'bidder'
    // },
    // {
    //   label: '询价数量',
    //   prop: 'inquiryQuantity',
    //   solt: true,
    //   width:150,
    //   sortable:false,
    // },
    // {
    //   label: "币种",
    //   prop: "currency",
    //   solt: true,
    //   width: 150,
    //   sortable: false
    // },
    {
      label: "交易税别",
      prop: "taxType",
      solt: true,
      width: 150,
      sortable: false
    },
    {
      label: "含税单价",
      prop: "taxPrice",
      solt: true,
      width: 150,
      sortable: false
    },
    {
      label: "交易税率",
      prop: "taxRate",
      solt: true,
      width: 150,
      sortable: false
    },
    {
      label: "非税单价",
      prop: "noneTaxPrice",
      solt: true,
      width: 140,
      sortable: false,
      required: true
    },
    {
      label: "价格有效期",
      prop: "startPriceValidity",
      solt: true,
      width: 320,
      sortable: false,
      required: true
    },
    {
      label: "MOQ",
      prop: "moq",
      solt: true,
      width: 150,
      sortable: false,
      required: true
    },
    {
      label: "采购周期（d）",
      prop: "period",
      solt: true,
      width: 140,
      sortable: false,
      required: true
    },
    {
      label: "退税率",
      prop: "legalRefundRate",
      sortable: false
    },
    {
      label: "操作",
      prop: "oprateHandle",
      solt: true,
      copy: false
    }
  ]
}

export const addSkuOption = {
  maxHeight: 400,
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  isMedia: true,
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  columnBtn: false,
  dic: [],
  fixHeight: 400,
  column: [
    {
      label: "编码",
      prop: "skuCode",
      sortable: false
    },
    {
      label: "商品名称",
      prop: "skuName",
      sortable: false
    },
    {
      label: "规格",
      prop: "productSize",
      sortable: false
    }
  ]
}

export const resultOption = {
  maxHeight: 400,
  selection: false,
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  isMedia: true,
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  columnBtn: false,
  header: false,
  dic: [],
  column: [
    {
      label: "SKU",
      prop: "sku",
      width: 200,
      sortable: false
    },
    {
      label: "失败原因",
      prop: "errorMsg",
      sortable: false
    }
  ]
}

/**表单校验 */
export const inquiryFormRules = {
  supplierNo: [{ required: true, message: "请检索输入", trigger: "change" }],
  bidder: [{ required: true, message: "请输入报价人", trigger: "blur" }],
  bidderPhone: [
    { required: true, message: "请输入报价人电话", trigger: "blur" },
    { validator: isvalidatemobile, message: "手机号码格式不正确", trigger: "blur" }
  ],
  deliveryType: [{ required: true, message: "请输入交货方式", trigger: "blur" }],
  deliveryAddress: [{ required: true, message: "请输入交货地址", trigger: "blur" }],
  inquiryEvidence: [{ required: true, message: "请上传询价凭证", trigger: "change" }],
  priceModel: [{ required: true, message: "请选择价格模式", trigger: "change" }],
  currency: [{ required: true, message: "请选择币种", trigger: "change" }]
}

export const operationLogTableOption = {
  border: true,
  selection: false,
  stripe: true,
  menu: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  localStorageSymbol: "log",
  searchAdvanced: false,
  header: false,
  indexLabel: "序号",
  index: true,

  column: [
    { label: "操作时间", prop: "createTime", sortable: false },

    { label: "操作人", prop: "displayname", sortable: false },
    { label: "操作类型", prop: "logRemark", sortable: false },
    { label: "操作事项", prop: "operateItem", sortable: false }
  ]
}
