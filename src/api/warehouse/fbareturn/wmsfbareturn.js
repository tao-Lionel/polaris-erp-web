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

export function fetchList(query) {
  return request({
    url: "/warehouse/wmsfbareturn/page",
    method: "get",
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: "/warehouse/wmsfbareturn",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/warehouse/wmsfbareturn/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/warehouse/wmsfbareturn/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/warehouse/wmsfbareturn",
    method: "put",
    data: obj
  })
}

export function deleteBatch(params) {
  return request({
    url: "/warehouse/wmsfbareturn/deleteBatch",
    method: "put",
    params: params
  })
}

export function submitBatch(params) {
  return request({
    url: "/warehouse/wmsfbareturn/submitBatch",
    method: "put",
    params: params
  })
}

export function cancelBatch(params) {
  return request({
    url: "/warehouse/wmsfbareturn/cancelBatch",
    method: "put",
    params: params
  })
}

export function verifyBatch(params) {
  return request({
    url: "/warehouse/wmsfbareturn/verifyBatch",
    method: "put",
    params: params
  })
}

export function getArriveConfirmInfo(param) {
  return request({
    url: "/warehouse/wmsfbareturn/getArriveConfirmInfo/" + param,
    method: "get"
  })
}

export function submitArriveConfirm(data) {
  return request({
    url: "/warehouse/wmsfbareturn/submitArriveConfirm",
    method: "post",
    data: data
  })
}

export function getInfoByTypes(param) {
  return request({
    url: "/warehouse/wmsbusinesstype/getInfoByTypes",
    method: "get",
    params: param
  })
}
