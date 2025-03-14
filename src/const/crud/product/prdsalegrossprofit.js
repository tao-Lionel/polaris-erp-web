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
// import { getDetail } from '@/api/product/prdskucategory'
// var validateCategoryPid = (rule, value, callback) => {
//   if (window.boxType === 'edit') {
//     console.info(value)
//     callback(new Error('父级品类不可选择自己或子级'))
//   }
//   callback()
// }

export const tableOption = {
  maxHeight: document.body.clientHeight - 415,
  page: false,
  align: "center",
  menuAlign: "center",
  border: true, //是否显示边框
  editBtn: false,
  delBtn: false,
  addBtn: false,
  // dialogDisable: [0, 1, 2], //dialog是否可选
  dic: [],
  fixed: false,
  searchShow: true,
  showSearchBtn: true,
  showEmptyBtn: true,
  searchFlag: true,
  searchAdvanced: true, //高级搜索
  // index: true,
  selection: true,
  // indexLabel: '序号',
  stripe: true,
  menu: false,
  viewBtn: false,
  header: true, //是否显示头部
  pageFlag: true, //是否显示分页器
  localStorageSymbol: "list",
  column: [
    { label: "标准SPU", prop: "spuCode", search: false, sortable: false },
    { label: "标准SKU", prop: "parentSku", search: false, sortable: false },
    { label: "工厂SKU", prop: "skuCode", search: false, sortable: false },
    { label: "链接SPU", prop: "linkSpu", search: false, sortable: false },
    { label: "链接SKU", prop: "linkSku", search: false, sortable: false },
    { label: "ASIN/商品ID", prop: "asin", search: false, sortable: false },
    { label: "产品*长宽*高(cm)", prop: "specificationsIn", search: false, sortable: false },
    { label: "产品名称", prop: "skuName", sortable: false },
    { label: "店铺", prop: "storeName", sortable: false },
    { label: "平台", prop: "platformName", sortable: false },
    { label: "站点", prop: "sitName", sortable: false },
    { label: "模式", prop: "salesModel", sortable: false },
    { label: "标准售价", prop: "sellingPrice", sortable: false },
    { label: "标准不含税售价", prop: "sellingPriceNoTax", sortable: false },
    { label: "供货价", prop: "supplyPrice", sortable: false },
    { label: "推广费费比", prop: "promotionExpensesRate", sortable: false },
    { label: "盈亏平衡费比", prop: "balanceProfitRate", sortable: false },
    { label: "币种", prop: "currency", sortable: false },
    { label: "定价状态", prop: "pricingState", sortable: false, solt: true },
    { label: "测算批次号", prop: "batchId", sortable: false },
    { label: "创建人/创建时间", prop: "createName", width: 160, sortable: false, solt: true, copy: false },
    { label: "更新人/更新时间", prop: "updateName", width: 160, sortable: false, solt: true, copy: false },
    { label: "备注", prop: "remark", sortable: false },
    { label: "操作", prop: "brandSolt", solt: true, width: 100, sortable: false, fixed: "right", copy: false }
  ]
}

/**新增修改验证规则 */
export const addOrUpdateRules = {
  // currency: [
  //   { required: true, message: "币别不能为空", trigger: "blur" },
  //   { validator: validCurrency, message: '', trigger: 'blur' }
  // ],
  // currencyName: [
  //   { required: true, message: "币别名称不能为空", trigger: "blur" }
  // ],
  // currencySymbol: [
  //   { required: true, message: "币别符号不能为空", trigger: "blur" }
  // ],
  // exchangeRate: [
  //   { required: true, message: "汇率不能为空", trigger: "blur" },
  //   { validator: isRate, message: '', trigger: 'blur' }
  // ],
  // runtime: [
  //   { required: true, message: "执行时间不能为空", trigger: "blur" },
  // ]
}

// 销售状态 0-正常,1-停售,2-清仓,3-暂停
export const saleStatusOption = {
  0: "正常",
  1: "停售",
  2: "清仓",
  3: "暂停"
}
