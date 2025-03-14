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
import { validateDecimalAndFigure } from "@/util/validate"

export const tableOption = {
  selection: true,
  border: true,
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关，默认关闭
  index: false,
  indexLabel: "序号",
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
      label: "运输方式",
      prop: "transportModeName"
    },
    {
      label: "国家",
      prop: "countryCode"
    },
    {
      label: "清关率（%）",
      prop: "customsClearanceRate"
    },
    {
      label: "状态",
      prop: "approveStatusText"
    },
    {
      label: "维护人",
      prop: "updateName"
    },
    {
      label: "维护时间",
      prop: "updateTime"
    },
    {
      label: "创建人",
      prop: "createName"
    },
    {
      label: "创建时间",
      prop: "createTime"
    },
    {
      label: "操作日志",
      prop: "operationLog",
      solt: true,
      sortable: false
    }
  ]
}

var validateDecimalCustomsClearanceRate = (rule, value, callback) => {
  if (validateDecimalAndFigure(value, 4, 2)) {
    callback()
  } else {
    callback(new Error("最大输入9999.99，最小输入0，保留两位小数"))
  }
}

export const addRules = {
  transportModeId: [{ required: true, message: "运输方式不能为空", trigger: "blur" }],
  countryId: [{ required: true, message: "国家不能为空", trigger: "blur" }],
  customsClearanceRate: [{ validator: validateDecimalCustomsClearanceRate, trigger: "blur" }]
}

export const editRules = {
  customsClearanceRate: [{ validator: validateDecimalCustomsClearanceRate, trigger: "blur" }]
}
