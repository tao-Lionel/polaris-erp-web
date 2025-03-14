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
 * Author: wangixaowen (AukeyIT@aukeys.com)
 */

import request from "@/router/axios"

export function fetchList(data) {
  return request({
    url: "/baseSetup/bsewarehouse/page",
    method: "post",
    data
  })
}

export function addObj(obj) {
  return request({
    url: "/baseSetup/bsewarehouse",
    method: "post",
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: "/baseSetup/bsewarehouse/" + id,
    method: "get"
  })
}

export function delObj(id) {
  return request({
    url: "/baseSetup/bsewarehouse/" + id,
    method: "delete"
  })
}

export function putObj(obj) {
  return request({
    url: "/baseSetup/bsewarehouse",
    method: "put",
    data: obj
  })
}

export function useObj(id, funcState) {
  return request({
    url: "/baseSetup/bsewarehouse/use/" + id,
    method: "get"
  })
}

export function notuseObj(id, funcState) {
  return request({
    url: "/baseSetup/bsewarehouse/notuse/" + id,
    method: "get"
  })
}

export function getAllWarehouse(params) {
  return request({
    url: "/baseSetup/bsewarehouse/getAll",
    method: "get",
    params: params
  })
}

export function getSelectedWarehouse(obj) {
  return request({
    url: "/baseSetup/bsewarehouse/listByIds",
    method: "post",
    data: obj
  })
}
export function saveAppIdAndAppSecret(obj) {
  return request({
    url: "/baseSetup/bsewarehouse/saveAppIdAndAppSecret",
    method: "post",
    data: obj
  })
}

// 根据法人信息获取仓库信息
export function getWarehouseByCorpCodeApi(data, params) {
  return request({
    url: "/baseSetup/bsewarehouse/getWarehouseByCorpCode/" + data,
    method: "get",
    params: params
  })
}

// 设置平台仓库映射
export function addBatchPlatformWarehouseApi(obj) {
  return request({
    url: "/baseSetup/bsewarehouse/addBatchPlatformWarehouse",
    method: "post",
    data: obj
  })
}

// 获取库房信息
export function getBseWarehouseInfo(data) {
  return request({
    url: "/baseSetup/bsewarehouse/getBseWarehouseInfo",
    method: "post",
    data
  })
}
