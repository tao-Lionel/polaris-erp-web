/*
 *    Copyright (c) 2018-2025, aukeyit All rights reserved.
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
 * Author: aukeyit (aukeyit@aukeyit.com)
 */

const DIC = {
  vaild: [
    {
      label: "否",
      value: "false"
    },
    {
      label: "是",
      value: "true"
    }
  ]
}
export const tableOption = {
  border: true,
  index: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  viewBtn: true,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  showSearchBtn: false,
  resetBtn: false,
  dic: [],
  columnBtn: false,
  column: [
    {
      label: "用户ID",
      prop: "user_id",
      align: "center"
    },
    {
      label: "用户名",
      prop: "user_name",
      align: "center"
    },
    {
      label: "令牌",
      prop: "token_value",
      align: "center",
      overHidden: true
    },
    {
      label: "类型",
      prop: "token_type",
      align: "center"
    },
    {
      label: "过期时间",
      prop: "expires_in",
      align: "center"
    },
    {
      label: "客户端",
      prop: "client_id",
      align: "center"
    },
    {
      label: "授权类型",
      prop: "grant_type",
      align: "center"
    }
  ]
}
