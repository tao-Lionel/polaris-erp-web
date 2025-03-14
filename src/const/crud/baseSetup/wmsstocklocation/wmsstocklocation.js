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
  selection: true,
  border: true,
  //index: true,
  //indexLabel: '序号',
  stripe: true,
  menu: false,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  labelPosition: "right",
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  column: [
    {
      label: "仓库",
      prop: "warehouseName"
    },
    {
      label: "库位",
      prop: "locationCode"
    },
    {
      label: "状态",
      prop: "approveStatusText"
    },
    {
      label: "启用/禁用",
      prop: "delFlagText"
    },
    {
      label: "维护人",
      prop: "editUserName"
    },
    {
      label: "维护时间",
      prop: "updateTime"
    },
    {
      label: "操作日志",
      prop: "operationLog",
      solt: true,
      sortable: false
    }
  ]
}

export const addOrUpdateRules = {
  warehouseName: [{ required: true, message: "仓库不能为空", trigger: "blur" }],
  locationCode: [{ required: true, message: "库位不能为空", trigger: "blur" }]
}
