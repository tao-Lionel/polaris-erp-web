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

export const tableOption = {
  border: true,
  index: true,
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  viewBtn: true,
  dicUrl: "/admin/dict/type/social_type",
  column: [
    {
      label: "ID",
      prop: "id",
      hide: true,
      addVisdiplay: false,
      editDisabled: true
    },
    {
      label: "类型",
      prop: "type",
      type: "select",
      dicData: "social_type",
      rules: [
        {
          required: true,
          message: "请选择类型",
          trigger: "blur"
        }
      ]
    },
    {
      label: "描述",
      prop: "remark"
    },
    {
      label: "appId",
      prop: "appId",
      overHidden: true,
      rules: [
        {
          required: true,
          message: "请输入appId",
          trigger: "blur"
        }
      ]
    },
    {
      label: "agentId",
      prop: "agentId",
      overHidden: true,
      rules: [
        {
          required: true,
          message: "请输入agentId",
          trigger: "blur"
        }
      ]
    },
    {
      label: "appSecret",
      prop: "appSecret",
      overHidden: true,
      rules: [
        {
          required: true,
          message: "请输入appSecret",
          trigger: "blur"
        }
      ]
    },
    {
      label: "回调地址",
      prop: "redirectUrl",
      hide: true,
      rules: [
        {
          required: true,
          message: "请输入回调地址",
          trigger: "blur"
        }
      ]
    },
    {
      label: "tokenRediskey",
      prop: "tokenRediskey",
      hide: true,
      rules: [
        {
          required: true,
          message: "请输入TOKEN缓存地址",
          trigger: "blur"
        }
      ]
    },
    {
      valueFormat: "timestamp",
      format: "yyyy-MM-dd hh:mm:ss",
      label: "创建时间",
      prop: "createTime",
      align: "center",
      addVisdiplay: false,
      editDisabled: true
    }
  ]
}
