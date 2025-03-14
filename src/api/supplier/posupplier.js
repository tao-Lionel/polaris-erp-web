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

import request from "@/router/axios"

// export function fetchList(query) {
//   return request({
//     url: '/supplier/posupplier/page',
//     method: 'get',
//     params: query
//   })
// }

export function fetchList(obj) {
  return request({
    url: "/supplier/posupplier/page",
    method: "post",
    data: obj
  })
}

export function addObj(obj) {
  return request({
    url: "/supplier/posupplier",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/supplier/posupplier/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/supplier/posupplier/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/supplier/posupplier",
    method: "put",
    data: obj
  })
}
export function getHistoryObj(id) {
  return request({
    url: "/supplier/posupplier/history/" + id,
    method: "get"
  })
}
/**
 * 审核供应商基础数据
 */
export function audit(id, flag, refuseText) {
  return request({
    url: "/supplier/posupplier/audit/",
    params: {
      id: id,
      flag: flag,
      refuseText: refuseText
    },
    method: "put"
  })
}
/**
 * 禁用，启用
 */
export function operationStatus(supplierNos, flag) {
  return request({
    url: "/supplier/posupplier/operationStatus",
    params: {
      supplierNos: supplierNos,
      flag: flag
    },
    method: "put"
  })
}

/**
 * 供应商等级修改
 */
export function switchLevel(supplierNos, level) {
  return request({
    url: "/supplier/posupplier/switchLevel",
    params: {
      supplierNos: supplierNos,
      level: level
    },
    method: "put"
  })
}

/**
 * 查询所有供应商
 */
export function getAll() {
  return request({
    url: "/supplier/posupplier/getAll",
    method: "get"
  })
}

/**
 * 显示历史，查询审核通过的数据
 */
export function showHistory(supplierNo, start) {
  return request({
    url: "/supplier/posupplier/showHistory",
    params: {
      supplierNo: supplierNo,
      start: start
    },
    method: "get"
  })
}
/**
 *供应商模糊查询
 */
export function getSupplierLikeName(query) {
  return request({
    url: "/supplier/posupplier/getSupplierLikeName",
    method: "get",
    params: query
  })
}

/**
 *供应商模糊查询
 */
export function getSupplierLikeNameIncludeProhibit(query) {
  return request({
    url: "/supplier/posupplier/getSupplierLikeNameIncludeProhibit",
    method: "get",
    params: query
  })
}

/**
 * 撤销提交
 */
export function cancelSubmit(id) {
  return request({
    url: "/supplier/posupplier/cancelSubmit/" + id,
    method: "put"
  })
}

export function getAllSupplierGroup(query) {
  return request({
    url: "/supplier/poSupplierGroup/getAllSupplierGroup",
    method: "get",
    params: query
  })
}
