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
  maxHeight: document.body.clientHeight - 360, //固定标题
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: true, //高级搜索栏开关，默认关闭
  selection: true,
  //index: true,
  //indexLabel: '序号',
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
      label: "供应商编码",
      prop: "historySupplierNo",
      solt: true,
      sortable: false
    },
    {
      label: "供应商名称",
      prop: "supplierName",
      sortable: false
    },
    {
      label: "供应商简称",
      prop: "abbreviation",
      sortable: false
    },
    {
      label: "法人代表",
      prop: "legalName",
      sortable: false
    },
    {
      label: "营业执照",
      prop: "licenseNo",
      sortable: false
    },
    {
      label: "对公账户",
      prop: "accountNoHistory",
      sortable: false
    },
    {
      label: "香港账户",
      prop: "accountNoHistory2",
      sortable: false
    },
    {
      label: "基本信息状态",
      prop: "approveStatus",
      formatter: function (row, value, label, column) {
        if (row.approveStatus == 0) {
          return "未处理"
        }

        if (row.approveStatus == 1) {
          return "审核中"
        }
        if (row.approveStatus == 2) {
          return "已审核"
        }
      },
      sortable: false
    },
    {
      label: "对公账户状态",
      prop: "accountStatus1",
      formatter: function (row, value, label, column) {
        if (row.accountStatus1 === 0) {
          return "未处理"
        }

        if (row.accountStatus1 == 1) {
          return "审核中"
        }
        if (row.accountStatus1 == 2) {
          return "已审核"
        }

        return "无"
      },
      sortable: false
    },
    {
      label: "香港账户状态",
      prop: "accountStatus2",
      formatter: function (row, value, label, column) {
        if (row.accountStatus2 === 0) {
          return "未处理"
        }

        if (row.accountStatus2 == 1) {
          return "审核中"
        }
        if (row.accountStatus2 == 2) {
          return "已审核"
        }
        return "无"
      },
      sortable: false
    },
    {
      label: "税务资质",
      prop: "taxStatus",
      formatter: function (row, value, label, column) {
        if (row.taxStatus === 0) {
          return "未处理"
        }
        if (row.taxStatus == 1) {
          return "审核中"
        }
        if (row.taxStatus == 2) {
          return "已审核"
        }
        return "无"
      },
      sortable: false
    },
    {
      label: "供应商等级",
      prop: "creditLevel",
      solt: true,
      sortable: false
    },
    {
      label: "供应商状态",
      prop: "status",
      formatter: function (row, value, label, column) {
        if (value == 1) {
          return "禁用中"
        }
        return "启用中"
      },
      sortable: false
    }
  ]
}
