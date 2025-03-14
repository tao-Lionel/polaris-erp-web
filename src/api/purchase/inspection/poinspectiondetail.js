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
    url: "/purchase/poinspectiondetail/page",
    method: "get",
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: "/purchase/poinspectiondetail",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/purchase/poinspectiondetail/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/purchase/poinspectiondetail/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/purchase/poinspectiondetail",
    method: "put",
    data: obj
  })
}

export function getInspectionAddress(supplierNo) {
  return request({
    url: "/purchase/poinspectiondetail/getInspectionAddress/" + supplierNo,
    method: "get"
  })
}

export function increase(obj) {
  return request({
    url: "/purchase/poinspectiondetail/increase/",
    method: "post",
    data: obj
  })
}

export function getEnsureData(poInspectionVo) {
  return request({
    url: "/purchase/poinspectiondetail/getEnsureData/" + poInspectionVo,
    method: "get"
  })
}

export function ensureResultData(list) {
  return request({
    url: "/purchase/poinspectiondetail/ensureResult",
    method: "post",
    data: list
  })
}
