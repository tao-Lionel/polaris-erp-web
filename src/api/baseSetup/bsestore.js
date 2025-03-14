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

export function fetchList(data) {
  return request({
    url: "/baseSetup/bsestore/page",
    method: "post",
    data
  })
}

export function addObj(obj) {
  return request({
    url: "/baseSetup/bsestore",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/baseSetup/bsestore/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/baseSetup/bsestore/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/baseSetup/bsestore",
    method: "put",
    data: obj
  })
}

export function useObj(id, funcState) {
  return request({
    url: "/baseSetup/bsestore/use/" + id,
    method: "get"
  })
}

export function notuseObj(id, funcState) {
  return request({
    url: "/baseSetup/bsestore/notuse/" + id,
    method: "get"
  })
}

export function getDistrict() {
  return request({
    url: "/baseSetup/bsedistrict/getDistrict",
    method: "get"
  })
}

export function getAll(params) {
  return request({
    url: "/baseSetup/bsestore/getAll",
    method: "get",
    params: params
  })
}

export function getStoreBySkuId(params) {
  return request({
    url: "/baseSetup/bsestore/getStoreBySkuId",
    method: "get",
    params: params
  })
}

export function authValidate(obj) {
  return request({
    url: "/baseSetup/bsestore/authValidate",
    method: "post",
    data: obj
  })
}

export function saveAuthorization(obj) {
  return request({
    url: "/baseSetup/bsestore/saveAuthorization",
    method: "post",
    data: obj
  })
}

export function getListStoreWithCorporation(obj) {
  return request({
    url: "/baseSetup/bsestore/listStoreWithCorporation",
    method: "post",
    data: obj
  })
}
export function getAllCorporation(obj) {
  return request({
    url: "/baseSetup/bsecorporation/list",
    method: "post",
    data: obj
  })
}
export function saveCorporation(obj) {
  return request({
    url: "/baseSetup/bsestore/saveCorporation",
    method: "post",
    data: obj
  })
}

export function getDetail(obj) {
  return request({
    url: "/baseSetup/bsestore/getStoreDetailById",
    method: "post",
    data: obj
  })
}

// 获取平台下的所有店铺站点
export function getStoreByPlatformTypeCodesApi(obj) {
  return request({
    url: "/baseSetup/bsestore/getStoreByPlatformTypeCodes",
    method: "post",
    data: obj
  })
}

// 获取店铺
export function getStoreListApi(params) {
  return request({
    url: "/baseSetup/bsestore/getList",
    method: "get",
    params
  })
}
