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
      label: "运输方式",
      prop: "transportModeName"
    },
    {
      label: "账期（天）",
      prop: "accountDays"
    },
    {
      label: "签收时间(天)",
      prop: "signDays"
    },
    {
      label: "备注",
      prop: "remarks"
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

/**运输方式验证 字母或者数字+特殊符号 */
var transportTypeValid = (rule, value, callback) => {
  var reg = /^[0-9a-zA-Z!@#$%^&*()]{0,30}$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error("只能输入字母或者数字或特殊符号:!@#$%^&*()"))
  }
}

var checkDay = (rule, value, callback) => {
  if (!value) {
    callback()
  }
  var reg = /^[0-9]{0,10}$/
  if (reg.test(value)) {
    if (value <= 10000000) {
      callback()
    } else {
      callback(new Error("不能大于10000000"))
    }
  } else {
    callback(new Error("请输入正整数"))
  }
}

var checkSignDays = (rule, value, callback) => {
  if (!value) {
    callback()
  }
  // var reg = /^[0-9#&_-|&*]{0,10}$/g;
  var reg = /^[0-9!@#$%^&*_-]{0,10}$/i
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error("签收时间不合法，只能输入数字和特殊符号:!@#$%^&*_-"))
  }
}

/**新增修改验证规则 */
export const addOrUpdateRules = {
  transportModeName: [
    { required: true, message: "运输方式不能为空", trigger: "blur" }
    // { validator: transportTypeValid, trigger: 'blur' }
  ],
  accountDays: [
    // { required: true, message: "账期不能为空", trigger: "blur" },
    { validator: checkDay, trigger: "blur" }
  ],
  signDays: [
    // { required: true, message: "签收时间不能为空", trigger: "blur" },
    { validator: checkSignDays, trigger: "blur" }
  ]
}
