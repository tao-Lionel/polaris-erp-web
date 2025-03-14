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
  searchAdvanced: true, //高级搜索栏开关
  column: [
    {
      label: "优先级",
      prop: "priority"
    },
    {
      label: "链接SPU",
      prop: "linkSpu"
    },
    {
      label: "链接SKU",
      prop: "linkSku"
    },
    {
      label: "链接SKU / ASIN",
      prop: "sellerSku"
    },
    {
      label: "工厂SKU",
      prop: "skuCode"
    },
    {
      label: "工厂SKU类型",
      prop: "bundleFlag",
      solt: true
    },
    {
      label: "店铺",
      prop: "storeAccount"
    },
    {
      label: "平台",
      prop: "platformTypeCode"
    },
    {
      label: "站点",
      prop: "sitEnName"
    },
    // {
    //   label: '销售组',
    //   prop: 'salesGroupName',
    //   minWidth: 100,
    // },
    {
      label: "启用/禁用",
      prop: "state",
      formatter(row, column, cellValue, index) {
        if ("1" == cellValue) {
          return "禁用"
        }
        return "启用"
      }
    },
    {
      label: "创建人/创建时间",
      prop: "createUser",
      solt: true
    },
    // {
    //   label: '创建时间',
    //   prop: 'createTime',
    //   minWidth: 120,
    // },
    {
      label: "更新人/更新时间",
      prop: "updateUser",
      solt: true
    },
    // {
    //   label: '更新时间',
    //   prop: 'createTime',
    //   minWidth: 120,
    // },
    {
      label: "操作日志",
      prop: "operationLog",
      solt: true,
      sortable: false
    }
  ]
}

import { validateCN } from "@/util/validate"

var validSellerSkuCode = (rule, value, callback) => {
  if (value && validateCN(value)) {
    callback(new Error("不能输入中文"))
  } else {
    callback()
  }
}

/**新增修改rule */
export const addOrUpdateRules = {
  bundleFlag: [{ required: true, message: "工厂SKU类型不能为空", trigger: "blur" }],
  platformTypeId: [{ required: true, message: "平台不能为空", trigger: "blur" }],
  storeId: [{ required: true, message: "店铺名称不能为空", trigger: "blur" }],
  sellerSku: [
    { required: true, message: "ASIN为空", trigger: "blur" },
    { validator: validSellerSkuCode, trigger: "blur" }
  ],
  linkSpu: [
    { required: true, message: "链接SPU为空", trigger: "blur" },
    { validator: validSellerSkuCode, trigger: "blur" }
  ],
  linkSku: [
    { required: true, message: "链接SKU为空", trigger: "blur" },
    { validator: validSellerSkuCode, trigger: "blur" }
  ],
  skuCode: [{ required: true, message: "工厂SKU不能为空", trigger: "blur" }],
  bsePlatformSitId: [{ required: true, message: "站点不能为空", trigger: "blur" }],
  priority: [{ required: true, message: "优先级不能为空", trigger: "blur" }]
}
