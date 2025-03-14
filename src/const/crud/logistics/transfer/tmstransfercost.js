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

// export const tableOption = {
//   menu: false,
//   selection: true,
//   border: true,
//   searchShow: true, //搜索栏开关
//   searchAdvanced: false,//高级搜索栏开关，默认关闭
//   // index: true,
//   // indexLabel: '序号',
//   stripe: true,
//   menuAlign: 'center',
//   align: 'center',
//   editBtn: false,
//   delBtn: false,
//   addBtn: false,
//   dic: [],
//   dialogDisable: [0, 1, 2, 3, 4, 5, 6, 7],//dialog是否可选
//   column: [
//     {
//       label: '调拨单号',
//       prop: 'transferNo',
//       sortable: false,
//
//     },
//     {
//       label: '调拨状态',
//       prop: 'transferStatusName',
//       minWidth: 120, sortable: false,
//     },
//     {
//       label: '物流商',
//       prop: 'transportCarrierName',
//       // solt: true,
//       minWidth: 120, sortable: false,
//     },
//     {
//       label: '费用类型', sortable: false,
//       // solt: true,
//       prop: 'costOperateTypeName',
//
//     },
//     {
//       label: '费用项', sortable: false,
//       // solt: true,
//       prop: 'costTypeName',
//       minWidth: 120,
//     },
//     {
//       label: '费用',
//       prop: 'costMsg',
//       solt: true,
//       minWidth: 140, sortable: false,
//     },
//     {
//       label: '费用状态',
//       prop: 'costLockStatusName',
//       sortable: false,
//       minWidth: 120,
//     },
//     {
//       label: '锁定人/锁定时间',
//       prop: 'lockMsg',
//       solt: true,
//
//     },
//     {
//       label: '转出仓',
//       prop: 'fmWarehouseName',
//       minWidth: 120, sortable: false,
//     },
//     {
//       label: '起运国家', sortable: false,
//       prop: 'fmCountryName'
//     },
//     {
//       label: '目的仓',
//       prop: 'toWarehouseName', sortable: false,
//     },
//     {
//       label: '目的国家', sortable: false,
//       prop: 'toCountryName'
//     },
//     {
//       label: '创建人/创建时间', sortable: false,
//       prop: 'createMsg',
//       solt: true,
//       minWidth: 120,
//     },
//     {
//       label: '更新人/更新时间', sortable: false,
//       prop: 'updateMsg',
//       solt: true,
//       minWidth: 120,
//     },
//   ]
// }

export const tableOption = {
  maxHeight: document.body.clientHeight - 408, //固定标题
  menu: false,
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  showSummary: true,
  // dialogDisable: [], //dialog是否可选
  column: [
    {
      label: "业务单号",
      prop: "sourceNo",
      sortable: false,
      solt: true
    },
    {
      label: "调拨类型",
      prop: "transferTypeName",
      sortable: false
    },
    {
      label: "物流跟踪号",
      prop: "trackingNo",
      sortable: false
    },
    {
      label: "费用类型",
      prop: "costTypeName",
      sortable: false
    },
    {
      label: "预估金额",
      sortable: false,
      prop: "costMsg"
    },
    {
      label: "实际金额",
      sortable: false,
      prop: "actualCostMsg"
    },
    {
      label: "物流商",
      prop: "transportCarrierName",
      sortable: false
    },
    {
      label: "结算组织",
      prop: "corporationName",
      sortable: false
    },
    {
      label: "对账状态",
      prop: "costLockStatusName",
      sortable: false
    },
    {
      label: "是否异常",
      prop: "abnormalFlagName",
      sortable: false
    },
    {
      label: "处理状态",
      sortable: false,
      prop: "handleStatusName"
    },
    {
      label: "对账人/时间",
      prop: "lockMsg",
      sortable: false
    },
    {
      label: "处理人/时间",
      prop: "handleMsg",
      sortable: false
    },
    {
      label: "创建人/时间",
      sortable: false,
      prop: "createMsg"
    },
    {
      label: "核销原因",
      sortable: false,
      prop: "verificationReason"
    },
    {
      label: "单据时间",
      sortable: false,
      prop: "invoiceDate"
    },
    {
      label: "操作",
      sortable: false,
      prop: "operate",
      solt: true,
      fixed: "right",
      copy: false
    }
  ]
}

/**产品详情页table */
export const skuTableOption = {
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
      label: "sku",
      sortable: false,
      prop: "skuCode"
    },
    {
      label: "产品名称",
      sortable: false,
      prop: "skuName"
    },
    {
      label: "型号",
      sortable: false,
      prop: "modelName"
    },
    {
      label: "平台SKU",
      sortable: false,
      prop: "platformSkuCode"
    },
    {
      label: "单品重量",
      sortable: false,
      prop: "skuGrossWeight",
      formatter: function (row, value, label, column) {
        if (value) {
          return value.toFixed(5)
        }
        return ""
      }
    },
    {
      label: "总重量",
      sortable: false,
      prop: "boxWeight",
      formatter: function (row, value, label, column) {
        if (value) {
          return value.toFixed(5)
        }
        return ""
      }
    }
  ]
}

export const recordTableOption = {
  maxHeight: 450,
  header: false,
  menu: false,
  selection: false,
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "业务单号",
      prop: "sourceNo",
      sortable: false
    },
    {
      label: "柜号",
      prop: "trackingNo",
      minWidth: 120,
      sortable: false
    },
    {
      label: "物流商",
      prop: "transportCarrierCode",
      minWidth: 140,
      sortable: false
    },
    {
      label: "费用类型",
      prop: "costType",
      // solt: true,
      minWidth: 120,
      sortable: false
    },
    {
      label: "预估费用",
      sortable: false,
      // solt: true,
      prop: "cost"
    },
    {
      label: "实际费用",
      sortable: false,
      // solt: true,
      prop: "actualCost"
    },
    {
      label: "失败原因",
      sortable: false,
      // solt: true,
      prop: "failDesc",
      minWidth: 120,
      hidden: true
    },
    {
      label: "差异金额",
      prop: "diffCost",
      sortable: false,
      minWidth: 120,
      solt: true,
      hidden: false
    },
    {
      label: "是否异常",
      prop: "abnormalFlag",
      minWidth: 120,
      sortable: false,
      solt: true,
      hidden: false
    }
  ]
}

export const estimateTableOption = {
  maxHeight: 450,
  header: false,
  menu: false,
  selection: false,
  border: true,
  searchShow: false, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  column: [
    {
      label: "业务单号",
      prop: "sourceNo",
      sortable: false
    },
    {
      label: "跟踪单号",
      prop: "trackingNo",
      minWidth: 120,
      sortable: false
    },
    {
      label: "物流商",
      prop: "transportCarrierCode",
      minWidth: 140,
      sortable: false
    },
    {
      label: "费用类型",
      prop: "costTypeName",
      // solt: true,
      minWidth: 120,
      sortable: false
    },
    {
      label: "预估费用",
      sortable: false,
      // solt: true,
      prop: "cost"
    },
    {
      label: "失败原因",
      sortable: false,
      // solt: true,
      prop: "errMsg"
    }
  ]
}
