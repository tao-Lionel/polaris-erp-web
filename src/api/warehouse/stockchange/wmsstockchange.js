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

// export function fetchList (query) {
//   return request({
//     url: '/warehouse/wmsstockchange/page',
//     method: 'get',
//     params: query
//   })
// }

export function fetchList(obj) {
  return request({
    url: "/warehouse/wmsstockchange/pagePost",
    method: "post",
    data: obj
  })
}

export function addObj(obj) {
  return request({
    url: "/warehouse/wmsstockchange",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/warehouse/wmsstockchange/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/warehouse/wmsstockchange/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/warehouse/wmsstockchange",
    method: "put",
    data: obj
  })
}
export function comfrimCreate(obj) {
  return request({
    url: "/warehouse/wmsstockchange/comfrimCreate",
    method: "post",
    data: obj
  })
}
export function approvalProcess(approvalProcessVo, order, functionName) {
  return request({
    url: "/warehouse/wmsstockchange/approvalProcess/" + order + "/" + functionName,
    method: "post",
    data: approvalProcessVo
  })
}

export function approvalProcessV2(approvalProcessVo, order, functionName) {
  return request({
    url: "/warehouse/wmsstockchange/approvalProcessV2/" + order + "/" + functionName,
    method: "post",
    data: approvalProcessVo
  })
}

// export function showDetail (orderNo) {
//   return request({
//     url: '/warehouse/wmsstockchange/showDetail/' + orderNo,
//     method: 'get',
//   })
// }

export function showDetail(obj) {
  return request({
    url: "/warehouse/wmsstockchange/showDetail",
    method: "post",
    data: obj
  })
}

export function showOccupyDetail(orderNo) {
  return request({
    url: "/warehouse/wmsstockchange/showOccupyDetail/" + orderNo,
    method: "get"
  })
}
export function delRows(data) {
  return request({
    url: "/warehouse/wmsstockchange/delRows",
    method: "post",
    data: data
  })
}

export function productSubmit(obj) {
  return request({
    url: "/warehouse/wmsstockchange/wmsStockChangeCreated",
    method: "post",
    data: obj
  })
}

export function getUser(obj) {
  return request({
    url: "/admin/user/listAll",
    method: "post",
    data: obj
  })
}
