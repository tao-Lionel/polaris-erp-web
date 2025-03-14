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
  column: [
    {
      label: "海关要素ID",
      prop: "customsElementId",
      hidden: true,
      addVisdiplay: false,
      editVisdiplay: false
    },
    {
      label: "海关编码",
      prop: "customsCode"
    },
    {
      label: "海关名称",
      prop: "customsName"
    },
    {
      label: "海关名称(英文)",
      prop: "customsNameEn"
    },
    {
      label: "海关法定单位",
      prop: "customsLegalUnit"
    },
    {
      label: "法定退税率",
      prop: "legalRefundRate"
    },
    {
      label: "状态",
      prop: "delFlag",
      addVisdiplay: false,
      editVisdiplay: false,
      solt: true,
      copy: false
    },
    {
      label: "所关联的SKU",
      prop: "showSkuView",
      addVisdiplay: false,
      editVisdiplay: false,
      solt: true,
      width: 120,
      sortable: false
    },
    {
      label: "操作日志",
      prop: "operateLog",
      addVisdiplay: false,
      editVisdiplay: false,
      solt: true,
      width: 80,
      sortable: false
    }
    // {
    //   label: '创建人',
    //   prop: 'createBy'
    // },
    // {
    //   label: '最后更新人',
    //   prop: 'updateBy'
    // },
    // {
    //   label: '是否删除 1：已删除  0：正常',
    //   prop: 'delFlag'
    // },
  ]
}
