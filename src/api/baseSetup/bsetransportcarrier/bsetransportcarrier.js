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
    url: "/baseSetup/bsetransportcarrier/page",
    method: "get",
    params: query
  })
}

export function handleSaveOrUpdate(obj) {
  return request({
    url: "/baseSetup/bsetransportcarrier/handleSaveOrUpdate",
    method: "post",
    data: obj
  })
}

export function stateModify(obj) {
  return request({
    url: "/baseSetup/bsetransportcarrier/stateModify",
    method: "post",
    data: obj
  })
}

export function handleAudit(obj) {
  return request({
    url: "/baseSetup/bsetransportcarrier/handleAudit",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/baseSetup/bsetransportcarrier/" + id,
    method: "get"
  })
}

export function getAll(query) {
  return request({
    url: "/baseSetup/bsetransportcarrier/getAll",
    method: "get",
    params: query
  })
}

export function getCarrierMsg(obj) {
  return request({
    url: "/baseSetup/bsetransportcarrier/listMapData",
    method: "post",
    data: obj
  })
}

export function saveCarrierMsg(obj) {
  return request({
    url: "/baseSetup/bsetransportcarrier/saveTransportCarrierToBsePlatformTransportCarrier",
    method: "post",
    data: obj
  })
}

export function getProviderAll(obj) {
  return request({
    url: "/baseSetup/bsetransportcarrier/listProvider",
    method: "post",
    data: obj
  })
}

export function getOverseaCarrierById(obj) {
  return request({
    url: "/baseSetup/bsetransportcarrier/listOverseaCarrier",
    method: "post",
    data: obj
  })
}

export function getOverseaMsg(obj) {
  return request({
    url: "/baseSetup/bsetransportcarrier/listMapDataByCarrier",
    method: "post",
    data: obj
  })
}

export function saveOverseaMsg(obj) {
  return request({
    url: "/baseSetup/bsetransportcarrier/saveMappingByOverSeaCarrier",
    method: "post",
    data: obj
  })
}

export function getDetail(obj) {
  return request({
    url: "/baseSetup/bsetransportcarrier/showDetail",
    method: "post",
    data: obj
  })
}

// 获取服务范围是船司的物流商
export function getServiceScopeApi(params) {
  return request({
    url: "/baseSetup/bsetransportcarrier/getServiceScope",
    method: "get",
    params
  })
}
