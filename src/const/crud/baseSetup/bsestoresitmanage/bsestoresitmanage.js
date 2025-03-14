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
  searchAdvanced: true, //高级搜索栏开关
  column: [
    {
      label: "店铺名称",
      prop: "storeAccount"
    },
    // {
    //   label: "店铺简称",
    //   prop: "storeNameShort"
    // },
    {
      label: "平台",
      prop: "platformTypeName"
    },
    {
      label: "区域",
      prop: "districtName"
    },
    {
      label: "站点",
      // prop: 'countryCode'
      prop: "sitName"
    },
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
      label: "销售组",
      prop: "saleGroupName"
    },
    {
      label: "备注",
      prop: "remark"
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
      label: "维护时间",
      prop: "updateTime"
    },
    {
      label: "操作日志",
      prop: "operationLog",
      solt: true
    }
  ]
}

/**新增修改rule */
export const addOrUpdateRules = {
  platformTypeId: [{ required: true, message: "平台不能为空", trigger: "blur" }],
  storeId: [{ required: true, message: "店铺名称不能为空", trigger: "blur" }],
  bsePlatformSitId: [{ required: true, message: "站点不能为空", trigger: "blur" }],
  saleGroupId: [{ required: true, message: "销售组不能为空", trigger: "blur" }]
}

/**授权rule */
export const authRules = {
  sellerId: [{ required: true, message: "Seller ID不能为空", trigger: "blur" }],
  token: [{ required: true, message: "Token不能为空", trigger: "blur" }]
}
