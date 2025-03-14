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
    url: "/purchase/posupplierskuperiod/page",
    method: "get",
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: "/purchase/posupplierskuperiod",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/purchase/posupplierskuperiod/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/purchase/posupplierskuperiod/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/purchase/posupplierskuperiod",
    method: "put",
    data: obj
  })
}

export function getOperateLog(supplierNo, skuId) {
  return request({
    url: "/purchase/posupplierskuperiod/getOperateLogById/" + supplierNo + "/" + skuId,
    method: "get"
  })
}

export function importPreview(params) {
  return request({
    url: "/purchase/posupplierskuperiod/purchaseCycleImport",
    method: "post",
    data: params
  })
}
