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
  maxHeight: document.body.clientHeight - 320, //固定标题
  border: true,
  index: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  refreshBtn: false,
  showClomnuBtn: false,
  searchSize: "mini",
  editBtn: false,
  delBtn: false,
  dic: [],
  column: [
    {
      label: "数据值",
      prop: "value",
      rules: [
        {
          required: true,
          message: "请输入数据值",
          trigger: "blur"
        }
      ]
    },
    {
      label: "标签名",
      prop: "label",
      rules: [
        {
          required: true,
          message: "请输入标签名",
          trigger: "blur"
        }
      ]
    },
    {
      label: "类型",
      prop: "type",
      rules: [
        {
          required: true,
          message: "请输入字典类型",
          trigger: "blur"
        }
      ]
    },
    {
      label: "描述",
      prop: "description",
      rules: [
        {
          required: true,
          message: "请输入字典描述",
          trigger: "blur"
        }
      ]
    },
    {
      label: "排序",
      prop: "sort",
      type: "number",
      rules: [
        {
          required: true,
          message: "请输入排序",
          trigger: "blur"
        }
      ]
    },
    {
      label: "备注信息",
      prop: "remarks",
      width: 200
    },
    {
      label: "操作日志",
      prop: "log",
      solt: true,
      sortable: false,
      visdiplay: false
    },
    {
      label: "操作",
      prop: "operation",
      solt: true,
      sortable: false,
      copy: false,
      width: 130,
      visdiplay: false
    }
  ]
}
