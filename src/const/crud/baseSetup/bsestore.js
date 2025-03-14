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
  menu: false,
  selection: true,
  border: true,
  // index: true,
  // indexLabel: '序号',
  isMedia: true,
  stripe: true,
  menuAlign: "center",
  align: "center",
  editBtn: false,
  delBtn: false,
  addBtn: false,
  dic: [],
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  column: [
    // {
    //   label: '店铺编码',
    //   prop: 'storeCode',
    //   minWidth: 120,
    // },
    {
      label: "店铺名称",
      prop: "storeAccount"
    },
    // {
    //   label: "店铺简称",
    //   prop: "storeNameShort",
    //
    // },
    // {
    //   label: "英文名称",
    //   prop: "storeNameEn",
    //
    // },
    {
      label: "平台",
      prop: "platformTypeCode"
    },
    {
      label: "站点",
      // prop: 'countryCode',
      prop: "sitEnName"
    },
    {
      label: "币种",
      prop: "currency"
    },
    // {
    //   label: '区域',
    //   prop: 'districtName',
    // },
    // {
    //   label: '销售组',
    //   prop: 'saleGroupName',
    //   minWidth: 100,
    // },
    {
      label: "销售主体",
      prop: "corporationName"
    },
    {
      label: "发货主体",
      prop: "deliveryCorporationName"
    },
    {
      label: "启用/禁用",
      minWidth: 120,
      prop: "state",
      type: "select",
      dicData: [
        {
          label: "启用",
          value: "0"
        },
        {
          label: "禁用",
          value: "1"
        }
      ]
    },
    {
      label: "授权",
      prop: "token",
      formatter(row, column, cellValue, index) {
        if (cellValue && cellValue != "") {
          return "是"
        }
        return "否"
      }
    },
    {
      label: "创建人",
      minWidth: 100,
      prop: "createUser"
    },
    {
      label: "创建时间",
      prop: "createTime",
      type: "datetime",
      format: "yyyy-MM-dd HH:mm",
      valueFormat: "yyyy-MM-dd HH:mm:ss",
      minWidth: 120,
      addVisdiplay: false,
      editVisdiplay: false
    },
    {
      label: "更新人",
      minWidth: 100,
      prop: "updateUser"
    },
    {
      label: "更新时间",
      prop: "updateTime",
      type: "datetime",
      format: "yyyy-MM-dd HH:mm",
      valueFormat: "yyyy-MM-dd HH:mm:ss",
      minWidth: 120,
      addVisdiplay: false,
      editVisdiplay: false
    },
    {
      label: "备注",
      prop: "remark"
    },
    {
      label: "操作",
      prop: "btnGroup",
      solt: true,
      width: 120,
      sortable: false,
      copy: false
      // fixed: "right"
    }
    // {
    //   label: '操作日志',
    //   prop: 'operationLog',
    //   solt: true,
    //   sortable: false,
    // },
  ]
}
import { validateSpecialChar } from "@/util/validate"

/**验证不能包含特字符 */
var validChar = (rule, value, callback) => {
  let result = validateSpecialChar(value)
  if (result) {
    callback(new Error("不能输入特殊字符"))
  }
  callback()
}

var validCode = (rule, value, callback) => {
  let reg = new RegExp(/[\u4e00-\u9fa5\s]/)
  reg.test(value) ? callback(new Error("仅支持输入数字、英文字母、符号")) : callback()
}

//字段rule
export const addOrUpdateFormRules = {
  platformTypeId: [{ required: true, message: "请选择平台", trigger: "blur" }],
  bsePlatformSitId: [{ required: true, message: "请选择站点", trigger: "blur" }],
  currency: [{ required: true, message: "请选择币种", trigger: "blur" }],
  storeAccount: [{ required: true, message: "请输入店铺名称", trigger: "blur" }],
  remark: [{ max: 200, message: "备注不得超过200个字符", trigger: "blur" }],
  kingdeeCustCode: [
    { required: true, message: "请输入金蝶CODE", trigger: "blur" },
    { validator: validCode, trigger: "blur" }
  ],
  kingdeeCustName: [
    { required: true, message: "请输入金蝶名称", trigger: "blur" },
    {
      max: 200
    }
  ]
}

/**授权rule */
export const authRules = {
  sellerId: [{ required: true, message: "Seller ID不能为空", trigger: "blur" }],
  token: [{ required: true, message: "Token不能为空", trigger: "blur" }],
  // clientId: '',
  // clientSecret: '',
  // channelType: '',
  // shipNode: '',
  // privateKey: '',
  // accessKeyId: '',
  // secretKey: '',
  // roleArn: '',
  // roleSessionName: '',
  // refreshToken: '',
  // lwaEndpoint: '',
  // region: ''
  clientId: [{ required: true, message: "该字段不能为空", trigger: "blur" }],
  clientSecret: [{ required: true, message: "该字段不能为空", trigger: "blur" }],
  channelType: [{ required: true, message: "该字段不能为空", trigger: "blur" }],
  shipNode: [{ required: true, message: "该字段不能为空", trigger: "blur" }],
  privateKey: [{ required: true, message: "该字段不能为空", trigger: "blur" }],
  accessKeyId: [{ required: true, message: "该字段不能为空", trigger: "blur" }],
  secretKey: [{ required: true, message: "该字段不能为空", trigger: "blur" }],
  roleArn: [{ required: true, message: "该字段不能为空", trigger: "blur" }],
  roleSessionName: [{ required: true, message: "该字段不能为空", trigger: "blur" }],
  refreshToken: [{ required: true, message: "该字段不能为空", trigger: "blur" }],
  lwaEndpoint: [{ required: true, message: "该字段不能为空", trigger: "blur" }],
  region: [{ required: true, message: "该字段不能为空", trigger: "blur" }]
}
