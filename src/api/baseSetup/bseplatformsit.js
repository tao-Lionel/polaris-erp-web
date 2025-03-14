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
    url: "/baseSetup/bseplatformsit/page",
    method: "get",
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: "/baseSetup/bseplatformsit",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/baseSetup/bseplatformsit/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/baseSetup/bseplatformsit/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/baseSetup/bseplatformsit",
    method: "put",
    data: obj
  })
}

export function getAll(params) {
  return request({
    url: "/baseSetup/bseplatformsit/getAll",
    method: "get",
    params: params
  })
}

export function getSitInfoEnName(obj) {
  return request({
    url: "/baseSetup/bseplatformsit/getSitEnName",
    method: "post",
    data: obj
  })
}

export function getSitInfo(params) {
  return request({
    url: "/baseSetup/bseplatformsit/getSitInfo",
    method: "get",
    params
  })
}

/**根据平台id获取该平台下的所有站点 */
export function getSitInfoByPlatformId(params) {
  return request({
    url: "/baseSetup/bseplatformsit/getSitInfoByPlatformId",
    method: "get",
    params: params
  })
}

/** 获取所有站点 */
export function getSitAll(obj) {
  return request({
    url: "/baseSetup/bseplatformsit/getSitEnName",
    method: "post",
    data: obj
  })
}

// 获取站点下面的所有平台
export function getPlatformAllBySitApi(obj) {
  return request({
    url: "/baseSetup/bseplatformsit/getPlatformBySitEnNames ",
    method: "post",
    data: obj
  })
}
