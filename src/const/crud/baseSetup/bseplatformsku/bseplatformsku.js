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
  searchShow: true, //搜索栏开关
  searchAdvanced: false, //高级搜索栏开关
  column: [
    {
      label: "平台SKU",
      prop: "platformSkuCode"
    },
    {
      label: "SKU",
      prop: "skuCode"
    },
    {
      label: "店铺",
      prop: "storeAccount"
      // solt: true,
    },
    // {
    //   label: '站点',
    //   prop: 'districtName'
    // },
    {
      label: "业务组",
      prop: "salesGroupName"
    },
    {
      label: "平台",
      prop: "platformTypeCode"
    },
    {
      label: "站点",
      prop: "sitEnName"
    },
    {
      label: "状态",
      prop: "approveStatus",
      formatter: function (row, value) {
        if (value == "1") {
          return "待审核"
        } else if (value == "2") {
          return "已审核"
        } else {
          return ""
        }
      }
    },
    {
      label: "启用/禁用",
      prop: "delFlag",
      minWidth: 120,
      formatter: function (row, value) {
        if (value == "1") {
          return "禁用"
        } else if (value == "0") {
          return "启用"
        } else {
          return ""
        }
      }
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
      prop: "updateTime",
      sortable: true
    },
    {
      label: "操作日志",
      prop: "operationLog",
      solt: true,
      sortable: false
    }
  ]
}

var validPSkuCode = (rule, value, callback) => {
  var reg = /^[0-9a-zA-Z!@#$%^&*()-_]{0,50}$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error("字母+数字+特殊符号【!@#$%^&*()】"))
  }
}

export const addOrUpdateRules = {
  platformTypeId: [{ required: true, message: "平台不能为空", trigger: "blur" }],
  bsePlatformSitId: [{ required: true, message: "站点不能为空", trigger: "blur" }],
  platformSkuCode: [
    { required: true, message: "平台SKU不能为空", trigger: "blur" },
    { validator: validPSkuCode, trigger: "blur" }
  ],
  isShare: [{ required: true, message: "共享不能为空", trigger: "blur" }],
  storeId: [{ required: true, message: "店铺不能为空", trigger: "blur" }],
  skuCode: [{ required: true, message: "SKU不能为空", trigger: "blur" }],
  salesGroupId: [{ required: true, message: "业务组不能为空", trigger: "blur" }]
}

/***店铺信息table */
export const storeOption = {
  enableLocalStorage: false,
  showSearchBtn: false,
  border: true,
  stripe: true,
  menu: false,
  header: false,
  menuAlign: "center",
  editBtn: false,
  delBtn: false,
  align: "center",
  addBtn: false,
  menuWidth: "auto",
  size: "mini",
  paginationLayout: "prev, pager, next",
  columnBtn: false,
  resetBtn: false,
  tip: false,
  height: 330,
  index: true,
  indexLabel: "序号",
  column: [
    {
      label: "店铺名称",
      prop: "storeAccount",
      span: 24
    },
    {
      label: "备注",
      prop: "storeRemark",
      span: 24
    }
  ]
}
