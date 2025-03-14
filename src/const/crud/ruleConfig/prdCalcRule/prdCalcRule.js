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
  maxHeight: document.body.clientHeight - 445, //固定标题
  border: true,
  menu: false,
  fixed: false,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  selection: true,
  stripe: true,
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  searchLabelPosition: "right",
  dic: [],
  defaultSort: {
    prop: "updateTime",
    order: "descending"
  },
  column: [
    {
      label: "规则ID",
      prop: "code"
    },
    {
      label: "规则名称",
      prop: "name"
    },
    {
      label: "规则状态",
      prop: "status",
      solt: true
    },
    // {
    //   label: '审核状态',
    //   prop: 'checkStatus',
    //   solt: true
    // },
    {
      label: "区域",
      prop: "districtName"
      // solt: true
    },
    {
      label: "平台",
      prop: "platformId",
      solt: true
    },
    {
      label: "站点",
      prop: "salesSiteEnName"
    },
    {
      label: "模式",
      prop: "salesModel"
    },
    // {
    //   label: '品类',
    //   prop: 'categoryName'
    // },
    {
      label: "供应商",
      prop: "supplierNo",
      sortable: false,
      solt: true,
      width: 200
    },
    // {
    //   label: '品牌',
    //   prop: 'brand',
    //   solt: true
    // },
    {
      label: "币种",
      prop: "currency"
    },
    {
      label: "净利率",
      prop: "grossProfitRate",
      solt: true
    },
    {
      label: "关税率",
      prop: "tariffRate",
      solt: true
    },
    {
      label: "推广费费比",
      prop: "promotionExpensesRateList",
      solt: true,
      copy: false,
      width: 120
    },
    {
      label: "退款费比",
      prop: "refundFeeRate",
      solt: true
    },
    {
      label: "管理费用费比",
      prop: "managementFeeRate",
      solt: true
    },
    {
      label: "创建人/创建时间",
      prop: "createrName",
      solt: true,
      width: 160
    },
    // {
    //   label: '创建时间',
    //   prop: 'createTime'
    // },
    {
      label: "更新人/更新时间",
      prop: "updaterName",
      solt: true,
      width: 160
    },
    // {
    //   label: '更新时间',
    //   prop: 'updateTime',
    //   sortable: true,
    // },
    {
      label: "操 作",
      prop: "btnGroup",
      solt: true,
      sortable: false,
      fixed: "right",
      copy: false
    },
    {
      label: "操作日志",
      prop: "operationLog",
      solt: true,
      sortable: false,
      fixed: "right"
    }
  ]
}
