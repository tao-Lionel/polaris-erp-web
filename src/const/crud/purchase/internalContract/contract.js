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
  maxHeight: document.body.clientHeight - 380, //固定标题
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: true,
  indexLabel: "序号",
  stripe: true,
  isMedia: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  menu: false,
  selection: true,
  column: [
    {
      label: "合同编号",
      prop: "contractNo",
      solt: true,
      width: "150px",
      sortable: false
    },
    {
      label: "合同日期",
      prop: "contractDate",
      width: "150px",
      type: "datetime",
      format: "yyyy-MM-dd HH:mm",
      valueFormat: "yyyy-MM-dd HH:mm:ss",
      sortable: false
    },
    {
      label: "供货方(乙方)",
      prop: "supplierName",
      minWidth: 90,
      inputStyle: "width:150px",
      overHidden: true,
      sortable: false
    },
    {
      label: "采购方(甲方)",
      minWidth: 120,
      prop: "inOrgName",
      overHidden: true,
      sortable: false
    },
    {
      label: "合同金额",
      minWidth: 120,
      prop: "amount",
      sortable: false
    },
    {
      label: "结算方式",
      minWidth: 120,
      prop: "settleaccountType",
      sortable: false
    },
    {
      label: "合同状态",
      minWidth: 120,
      prop: "contractStatus",
      solt: true,
      sortable: false,
      copy: false
    },
    {
      label: "内部采购订单",
      minWidth: 120,
      prop: "orderNo",
      solt: true,
      sortable: false
    }
  ]
}
