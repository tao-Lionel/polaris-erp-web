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
  // header:false,
  dic: [],
  column: [
    {
      label: "联系人",
      sortable: false,
      prop: "contactName"
    },
    {
      label: "职务",
      sortable: false,
      prop: "title"
    },
    {
      label: "手机",
      sortable: false,
      prop: "cellPhone"
    },
    {
      label: "电话",
      sortable: false,
      prop: "phone"
    },
    {
      label: "传真",
      sortable: false,
      prop: "faxNo"
    },
    {
      label: "电子邮箱",
      sortable: false,
      prop: "email"
    },
    {
      label: "备注",
      sortable: false,
      prop: "remarks"
    },
    {
      label: "创建人",
      sortable: false,
      prop: "createByName",
      addVisdiplay: false,
      editVisdiplay: false
    },
    {
      label: "操作",
      prop: "operate",
      sortable: false,
      solt: true,
      copy: false
    }
  ]
}
