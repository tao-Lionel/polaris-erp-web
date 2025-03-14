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
      label: "物流商编码",
      prop: "transportCarrierCode"
    },
    {
      label: "物流商名称",
      prop: "carrierName"
    },
    {
      label: "物流商简称",
      prop: "carrierShortName"
    },
    {
      label: "服务范围",
      prop: "serviceScope"
    },
    {
      label: "联系人",
      prop: "contactName"
    },
    {
      label: "联系方式",
      prop: "contactNo"
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
      label: "创建人",
      prop: "createUser"
    },
    {
      label: "创建时间",
      prop: "createTime"
    },
    {
      label: "更新人",
      prop: "updateUser"
    },
    {
      label: "更新时间",
      prop: "updateTime"
    },
    {
      label: "操 作",
      prop: "btnGroup",
      solt: true,
      width: 120,
      sortable: false,
      copy: false
    }
    // {
    //   label: '维护人',
    //   prop: 'editUserName',
    //   minWidth: 90,
    // },
    // {
    //   label: '维护时间',
    //   prop: 'updateTime',
    //   minWidth: 120,
    // },
    // {
    //   label: '操作日志',
    //   prop: 'operationLog',
    //   solt: true,
    //   sortable: false,
    // },
  ]
}

var notZH = (rule, value, callback) => {
  var reg = /^[0-9a-zA-Z-_]{0,20}$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error("联系方式不合法，只能含(字母数字_-)"))
  }
}

/**新增修改验证规则 */
export const addOrUpdateRules = {
  transportCarrierCode: [{ required: true, message: "物流商编码不能为空", trigger: "blur" }],
  carrierName: [{ required: true, message: "物流商名称不能为空", trigger: "blur" }],
  carrierShortName: [{ required: true, message: "物流商简称不能为空", trigger: "blur" }],
  contactName: [
    // { required: true, message: "联系人不能为空", trigger: "blur" },
  ],
  contactNo: [
    // { required: true, message: "联系方式不能为空", trigger: "blur" } ,
    { validator: notZH, trigger: "blur" }
  ]
}

export const platTransportRules = {
  platformTypeId: [{ required: true, message: "平台不能为空", trigger: "blur" }],
  sitId: [{ required: true, message: "站点不能为空", trigger: "blur" }],
  bsePlatformTransportCarrierCode: [{ required: true, message: "平台物流商编码不能为空", trigger: "blur" }],
  bsePlatformTransportCarrierName: [{ required: true, message: "平台物流商名称不能为空", trigger: "blur" }]
}

export const wareTransportRules = {
  providerId: [{ required: true, message: "海外仓物流商不能为空", trigger: "blur" }],
  bseOverseaCarrierId: [{ required: true, message: "海外仓物流商编码不能为空", trigger: "blur" }],
  bseOverseaCarrierName: [{ required: true, message: "海外仓物流商名称不能为空", trigger: "blur" }]
}
