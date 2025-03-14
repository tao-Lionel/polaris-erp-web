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

/**报关单 tab JS */
export const tableOption = {
  enableLocalStorage: false,
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
  dic: [],
  column: [
    {
      label: "项号",
      prop: "itemNo",
      sortable: false
    },
    {
      label: "商品编号",
      prop: "customsCode",
      sortable: false
    },
    {
      label: "商品名称及规格型号",
      prop: "customsName",
      solt: true,
      width: "200",
      sortable: false
    },
    {
      label: "数量及单位",
      prop: "declareQuantity",
      solt: true,
      sortable: false
    },
    {
      label: "单价/总价/币制",
      prop: "price",
      width: "135px",
      solt: true,
      sortable: false
    },
    {
      label: "原产国（地区）",
      width: "120px",
      prop: "originCountryName",
      sortable: false
    },
    {
      label: "最终用目的国",
      prop: "goalCountryName",
      solt: true,
      sortable: false
    },
    {
      label: "境内货源地",
      prop: "sourceLocal",
      solt: true,
      sortable: false
    },
    {
      label: "征免",
      prop: "exemption",
      sortable: false
    },
    {
      label: "排序",
      prop: "sort",
      solt: true,
      sortable: false
    }
  ]
}

/**申报要素table */
export const elementTableOption = {
  enableLocalStorage: false,
  menu: false,
  header: false,
  selection: false,
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  pageFlag: false, //是否显示分页器
  dic: [],
  column: [
    {
      label: "序号",
      sortable: false,
      prop: "itemNo"
    },
    {
      label: "sku",
      sortable: false,
      prop: "skuCode"
    },
    {
      label: "净重",
      sortable: false,
      prop: "netWeight"
    },
    {
      label: "海关编码",
      sortable: false,
      prop: "customsCode"
    },
    {
      label: "单位",
      sortable: false,
      prop: "customsLegalUnit"
    },
    {
      label: "产品名称",
      sortable: false,
      prop: "customsName"
    },
    {
      label: "申报要素",
      sortable: false,
      prop: "declarationElement"
    },
    {
      label: "数量",
      sortable: false,
      prop: "declareQuantity"
    },
    {
      label: "单价",
      sortable: false,
      prop: "declarePrice"
    },
    {
      label: "报关总价",
      sortable: false,
      prop: "amount"
    }
  ]
}
