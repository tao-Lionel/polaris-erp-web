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
  enableLocalStorage: false,
  border: true,
  cancelFixedTop: true,
  // index: true,
  // indexLabel: '序号',
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  menu: false,
  header: false,
  dic: [],
  height: 430,
  column: [
    {
      label: "日志ID",
      prop: "logId",
      hidden: true,
      sortable: false
    },
    {
      label: "原修改内容",
      prop: "olderContent",
      hidden: true,
      sortable: false
    },
    {
      label: "新修改内容",
      prop: "newContent",
      hidden: true,
      sortable: false
    },
    {
      label: "操作类型",
      prop: "logRemark",
      sortable: false
    },
    {
      label: "日志类型",
      prop: "logType",
      hidden: true,
      sortable: false
    },
    {
      label: "关联主表ID",
      prop: "relateId",
      hidden: true,
      sortable: false
    },
    {
      label: "创建人",
      prop: "createBy",
      hidden: true,
      sortable: false
    },
    {
      label: "操作人",
      prop: "displayname",
      sortable: false
    },
    {
      label: "操作时间",
      prop: "createTime",
      sortable: false
    },
    {
      label: "操作事项",
      prop: "operateDetail",
      sortable: false
    }
  ]
}
