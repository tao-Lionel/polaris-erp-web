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

export function fetchList(obj) {
  return request({
    url: "/warehouse/wmsinbound/pagePost",
    method: "post",
    data: obj
  })
}

export function addObj(obj) {
  return request({
    url: "/warehouse/wmsinbound",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/warehouse/wmsinbound/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/warehouse/wmsinbound/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/warehouse/wmsinbound",
    method: "put",
    data: obj
  })
}

export function inStore(obj) {
  return request({
    url: "/warehouse/wmsinbound/inStore",
    method: "post",
    params: obj
  })
}

export function getStockLocation(obj) {
  return request({
    url: "/warehouse/wmsinbound/getStockLocation",
    method: "get",
    params: obj
  })
}

export function getStatusCounts() {
  return request({
    url: "/warehouse/wmsinbound/getStatusCount",
    method: "get"
  })
}

///wmsinbound/inBoundDetail
export function getDetail(obj) {
  return request({
    url: "/warehouse/wmsinbound/inBoundDetail",
    method: "post",
    data: obj
  })
}

///wmsinbound/inBoundV2 确认入库
export function confirmInBound(obj) {
  return request({
    url: "/warehouse/wmsinbound/inBoundV2",
    method: "post",
    data: obj
  })
}

// 入库页面详情展示接口
export function getConfirmInBoundDetailApi(data) {
  return request({
    url: "/warehouse/wmsinbound/getConfirmInBoundDetail",
    method: "post",
    data
  })
}
